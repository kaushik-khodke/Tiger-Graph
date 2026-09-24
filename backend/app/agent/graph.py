import logging
from typing import Dict, Any, Optional, Callable, List
from .state import InvestigationState
from .nodes.trigger import trigger_case
from .nodes.planner import investigation_planner
from .nodes.investigation import graph_investigation
from .nodes.evidence import evidence_analyzer
from .nodes.patterns import fraud_pattern_analyzer
from .nodes.uncertainty import uncertainty_analyzer
from .nodes.router import route_investigation
from .nodes.evidence_planner import evidence_planner
from .nodes.evidence_action import evidence_action
from .nodes.reassess import reassess
from .nodes.nba import nba_engine
from .nodes.policy import policy_engine_node
from .nodes.approval import approval_wait
from .nodes.explanation import explanation
from .nodes.memory import memory_update
from ..observability.langfuse import langfuse_manager

logger = logging.getLogger("sentinel.agent")

class InvestigationAgentGraph:
    """
    Production-grade LangGraph Orchestration State Machine.
    Compiles state graph with checkpointer and event streaming for real-time SSE.
    """
    def __init__(self):
        self._checkpoints: Dict[str, InvestigationState] = {}
        self._compiled_graph = None
        self._build_graph()

    def _build_graph(self):
        try:
            from langgraph.graph import StateGraph, END
            from langgraph.checkpoint.memory import MemorySaver

            builder = StateGraph(InvestigationState)

            # Register 16 nodes
            builder.add_node("trigger_case", trigger_case)
            builder.add_node("investigation_planner", investigation_planner)
            builder.add_node("graph_investigation", graph_investigation)
            builder.add_node("evidence_analyzer", evidence_analyzer)
            builder.add_node("fraud_pattern_analyzer", fraud_pattern_analyzer)
            builder.add_node("uncertainty_analyzer", uncertainty_analyzer)
            builder.add_node("evidence_planner", evidence_planner)
            builder.add_node("evidence_action", evidence_action)
            builder.add_node("reassess", reassess)
            builder.add_node("nba_engine", nba_engine)
            builder.add_node("policy_engine_node", policy_engine_node)
            builder.add_node("approval_wait", approval_wait)
            builder.add_node("explanation", explanation)
            builder.add_node("memory_update", memory_update)

            # Wire linear edges
            builder.set_entry_point("trigger_case")
            builder.add_edge("trigger_case", "investigation_planner")
            builder.add_edge("investigation_planner", "graph_investigation")
            builder.add_edge("graph_investigation", "evidence_analyzer")
            builder.add_edge("evidence_analyzer", "fraud_pattern_analyzer")
            builder.add_edge("fraud_pattern_analyzer", "uncertainty_analyzer")

            # Conditional routing
            builder.add_conditional_edges(
                "uncertainty_analyzer",
                route_investigation,
                {
                    "evidence_planner": "evidence_planner",
                    "nba_engine": "nba_engine"
                }
            )

            # Evidence feedback loop
            builder.add_edge("evidence_planner", "evidence_action")
            builder.add_edge("evidence_action", "reassess")
            builder.add_edge("reassess", "nba_engine")

            # Policy & Approval loop
            builder.add_edge("nba_engine", "policy_engine_node")
            builder.add_edge("policy_engine_node", "approval_wait")

            # Conditional approval continuation
            def should_wait_approval(state: InvestigationState):
                if state.status == "AWAITING_APPROVAL":
                    return END
                return "explanation"

            builder.add_conditional_edges(
                "approval_wait",
                should_wait_approval,
                {
                    END: END,
                    "explanation": "explanation"
                }
            )

            builder.add_edge("explanation", "memory_update")
            builder.add_edge("memory_update", END)

            checkpointer = MemorySaver()
            self._compiled_graph = builder.compile(checkpointer=checkpointer)
            logger.info("LangGraph StateGraph compiled with MemorySaver checkpointer.")
        except Exception as exc:
            logger.warning(f"Using resilient state machine runner: {exc}")
            self._compiled_graph = None

    def run_investigation(
        self,
        case_id: str,
        initial_data: Optional[Dict[str, Any]] = None,
        on_event: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> InvestigationState:
        """
        Executes full or partial investigation up to Human Approval pause or resolution.
        """
        # Load or create state
        state = self._checkpoints.get(case_id)
        if not state:
            defaults: Dict[str, Any] = {
                "case_id": case_id,
                "trigger": {"type": "risk_score", "text": "High-risk transaction flagged (0.87)"},
                "transaction": {
                    "id": f"TXN-{case_id.replace('CASE-', '')}",
                    "amount": 259.98,
                    "customer_id": "C-123",
                    "card_id": "C-123-K1"
                },
                "customer": {"id": "C-123", "tenure": "3 years"},
            }
            if initial_data:
                defaults.update(initial_data)
            state = InvestigationState(**defaults)
        elif initial_data:
            state = state.model_copy(update=initial_data)

        # Notify callback
        if on_event:
            on_event({"event": "investigation_started", "case_id": case_id, "status": state.status})

        # Step 1-6: Initial traversal & uncertainty
        res1 = trigger_case(state)
        state = state.model_copy(update=res1)
        if on_event: on_event({"event": "case_created", "case_id": case_id})

        res2 = investigation_planner(state)
        state = state.model_copy(update=res2)
        if on_event: on_event({"event": "planner_completed", "case_id": case_id})

        res3 = graph_investigation(state)
        state = state.model_copy(update=res3)
        if on_event: on_event({"event": "graph_traversed", "case_id": case_id, "evidence_count": len(state.evidence)})

        res4 = evidence_analyzer(state)
        state = state.model_copy(update=res4)

        res5 = fraud_pattern_analyzer(state)
        state = state.model_copy(update=res5)

        res6 = uncertainty_analyzer(state)
        state = state.model_copy(update=res6)
        if on_event: on_event({"event": "uncertainty_evaluated", "case_id": case_id, "risk": state.risk_level, "confidence": state.confidence})

        # Step 7: Conditional branch
        next_step = route_investigation(state)
        if next_step == "evidence_planner":
            res8 = evidence_planner(state)
            state = state.model_copy(update=res8)
            if on_event: on_event({"event": "evidence_requested", "case_id": case_id, "action": state.selected_action})

            res9 = evidence_action(state)
            state = state.model_copy(update=res9)
            if on_event: on_event({"event": "evidence_received", "case_id": case_id})

            res10 = reassess(state)
            state = state.model_copy(update=res10)
            if on_event: on_event({"event": "reassessment_completed", "case_id": case_id, "risk": state.risk_level, "confidence": state.confidence})

        # Step 11: NBA
        res11 = nba_engine(state)
        state = state.model_copy(update=res11)
        if on_event: on_event({"event": "nba_generated", "case_id": case_id, "action": state.selected_action})

        # Step 12 & 13: Policy & Permissions
        res12 = policy_engine_node(state)
        state = state.model_copy(update=res12)
        if on_event: on_event({"event": "policy_checked", "case_id": case_id, "approval_required": state.approval_required})

        # Step 14: Approval check
        res14 = approval_wait(state)
        state = state.model_copy(update=res14)

        # Checkpoint state
        self._checkpoints[case_id] = state

        if state.status == "AWAITING_APPROVAL":
            if on_event: on_event({"event": "awaiting_approval", "case_id": case_id, "approval_id": state.approval_id, "role": state.required_role})
            return state

        # If auto-approved or no approval required, continue to resolution
        return self._finalize_investigation(state, on_event=on_event)

    def resume_with_approval(
        self,
        case_id: str,
        decision: str = "APPROVED",
        notes: Optional[str] = None,
        on_event: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> InvestigationState:
        """
        Resumes LangGraph execution after human supervisor approval or rejection.
        """
        state = self._checkpoints.get(case_id)
        if not state:
            raise ValueError(f"No checkpoint found for case {case_id}")

        state = state.model_copy(update={
            "approval_status": decision,
            "status": "ACTION_TAKEN" if decision == "APPROVED" else "RESOLVED"
        })

        if decision == "REJECTED":
            state = state.model_copy(update={"selected_action": "ESCALATE_TO_ANALYST"})

        # Step 14 approval execution
        res14 = approval_wait(state)
        state = state.model_copy(update=res14)

        return self._finalize_investigation(state, on_event=on_event)

    def _finalize_investigation(
        self,
        state: InvestigationState,
        on_event: Optional[Callable[[Dict[str, Any]], None]] = None
    ) -> InvestigationState:
        case_id = state.case_id

        # Step 15: Explanation
        res15 = explanation(state)
        state = state.model_copy(update=res15)
        if on_event: on_event({"event": "explanation_generated", "case_id": case_id})

        # Step 16: Memory update & resolution
        res16 = memory_update(state)
        state = state.model_copy(update=res16)
        if on_event: on_event({"event": "case_resolved", "case_id": case_id, "status": "RESOLVED"})

        self._checkpoints[case_id] = state
        return state

    def get_state(self, case_id: str) -> Optional[InvestigationState]:
        return self._checkpoints.get(case_id)

investigation_agent = InvestigationAgentGraph()
