import time
from typing import Dict, Any
from ..state import InvestigationState
from ...llm.factory import model_router
from ...llm.models import AgentTaskType
from ...llm.schemas import EvidenceRequest
from ...observability.tracing import investigation_tracer

def evidence_planner(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 8: evidence_planner()
    Formulates a targeted evidence acquisition request (e.g. customer_validation).
    Records initial pre-evidence NBA.
    """
    start = time.time()
    prompt = (
        f"Case: {state.case_id}\n"
        f"Risk: {state.risk_level} ({state.risk_score:.2f}) · Confidence: {state.confidence:.2f}\n"
        f"Missing: {state.missing_evidence}\n"
        "Plan a controlled evidence action to resolve uncertainty."
    )

    res = model_router.invoke_structured(
        task_type=AgentTaskType.EVIDENCE_PLANNER,
        schema=EvidenceRequest,
        messages=[{"role": "user", "content": prompt}],
        case_id=state.case_id,
        context_data={"case_id": state.case_id, "amount": state.transaction.get("amount", 259.98)}
    )

    out = res.output
    req_dict = out.model_dump()
    
    # Record initial Next Best Action (pre-evidence)
    initial_nba = [
        {
            "action": "VERIFY_WITH_CUSTOMER",
            "route": "auto",
            "reason": f"R1: verify transaction authorization with customer before blocking card; {out.reason}",
            "policy_reference": "Policy R1",
            "required_role": "System / Agent"
        }
    ]

    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(
        state.case_id, "evidence_planner",
        {"missing": state.missing_evidence}, req_dict, dur, model_name=res.selected_model
    )

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": state.case_id,
        "actor": f"Agent ({res.selected_model})",
        "event": "Evidence Action Planned",
        "tool_action": "evidence_planner",
        "result": f"Recommended action: {out.action_type} ({out.reason})"
    }

    return {
        "evidence_requests": state.evidence_requests + [req_dict],
        "initial_nba": initial_nba,
        "selected_action": "VERIFY_WITH_CUSTOMER",
        "status": "EVIDENCE_REQUIRED",
        "model_metadata": {**state.model_metadata, "evidence_planner_model": res.selected_model},
        "audit_events": state.audit_events + [event]
    }
