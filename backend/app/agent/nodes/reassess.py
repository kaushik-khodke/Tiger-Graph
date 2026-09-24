import time
from typing import Dict, Any
from ..state import InvestigationState
from ...llm.factory import model_router
from ...llm.models import AgentTaskType
from ...llm.schemas import RiskAssessment
from ...observability.tracing import investigation_tracer

def reassess(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 10: reassess()
    Re-evaluates risk and confidence with the new evidence.
    Transitions sufficiency to SUFFICIENT and records decision delta.
    """
    start = time.time()
    ctx = {
        "case_id": state.case_id,
        "amount": state.transaction.get("amount", 259.98),
        "has_new_evidence": True,
        "customer_denied": True
    }

    prompt = (
        f"Case: {state.case_id}\n"
        "Customer validation received: Transaction was NOT recognized (denied by cardholder).\n"
        "Reassess Risk, Confidence, and Evidence Sufficiency."
    )

    res = model_router.invoke_structured(
        task_type=AgentTaskType.UNCERTAINTY,
        schema=RiskAssessment,
        messages=[{"role": "user", "content": prompt}],
        case_id=state.case_id,
        context_data=ctx
    )

    out = res.output
    what_changed = (
        f"Customer denied authorization on {state.transaction.get('id', 'TXN-10293')}. "
        f"Confidence increased from {state.confidence * 100:.0f}% to {out.confidence * 100:.0f}%, "
        f"Risk escalated to {out.risk_level}, and evidence sufficiency transitioned to SUFFICIENT."
    )

    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(
        state.case_id, "reassess",
        {"new_evidence_count": len(state.received_evidence)},
        {"risk": out.risk_score, "confidence": out.confidence, "delta": what_changed},
        dur, model_name=res.selected_model
    )

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": state.case_id,
        "actor": f"Agent ({res.selected_model})",
        "event": "Reassessment Completed",
        "tool_action": "reassess",
        "result": f"Risk updated to {out.risk_level} ({out.risk_score:.2f}) · Confidence: {out.confidence:.2f} · Sufficient"
    }

    return {
        "risk_level": out.risk_level,
        "risk_score": out.risk_score,
        "confidence": out.confidence,
        "evidence_sufficiency": out.evidence_sufficiency,
        "what_changed": what_changed,
        "audit_events": state.audit_events + [event]
    }
