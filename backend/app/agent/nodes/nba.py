import time
from typing import Dict, Any
from ..state import InvestigationState
from ...llm.factory import model_router
from ...llm.models import AgentTaskType
from ...llm.schemas import ActionRecommendation
from ...observability.tracing import investigation_tracer

def nba_engine(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 11: nba_engine()
    Formulates candidate and recommended next-best actions.
    Records the final NBA snapshot post-evidence.
    """
    start = time.time()
    ctx = {
        "case_id": state.case_id,
        "amount": state.transaction.get("amount", 259.98),
        "has_new_evidence": state.has_new_evidence,
        "customer_denied": True
    }

    prompt = (
        f"Case: {state.case_id}\n"
        f"Risk Level: {state.risk_level} ({state.risk_score:.2f}) · Confidence: {state.confidence:.2f}\n"
        f"Evidence Sufficiency: {state.evidence_sufficiency}\n"
        f"New Evidence Acquired: {state.has_new_evidence}\n"
        "Generate final defensible next-best-actions with grounding reasons."
    )

    res = model_router.invoke_structured(
        task_type=AgentTaskType.NBA,
        schema=ActionRecommendation,
        messages=[{"role": "user", "content": prompt}],
        case_id=state.case_id,
        context_data=ctx
    )

    out = res.output
    
    # Structure final NBA items
    final_nba = [
        {
            "action": out.recommended_action,
            "route": "L1", # Refined deterministically by policy node
            "reason": "; ".join(out.reasons[:2]),
            "policy_reference": "Policy R2",
            "required_role": "Team Lead"
        },
        {
            "action": "ESCALATE",
            "route": "auto",
            "reason": "Escalate to fraud operations queue with high-confidence compromise package",
            "policy_reference": "Policy R10",
            "required_role": "System / Agent"
        }
    ]

    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(
        state.case_id, "nba_engine",
        {"sufficiency": state.evidence_sufficiency}, out.model_dump(), dur, model_name=res.selected_model
    )

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": state.case_id,
        "actor": f"Agent ({res.selected_model})",
        "event": "Next-Best Action Recommended",
        "tool_action": "nba_engine",
        "result": f"Action: {out.recommended_action} · Candidates: {', '.join(out.candidate_actions)}"
    }

    return {
        "selected_action": out.recommended_action,
        "candidate_actions": out.candidate_actions,
        "final_nba": final_nba,
        "model_metadata": {**state.model_metadata, "nba_model": res.selected_model},
        "audit_events": state.audit_events + [event]
    }
