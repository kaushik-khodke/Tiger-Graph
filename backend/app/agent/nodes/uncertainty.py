import time
from typing import Dict, Any
from ..state import InvestigationState
from ...llm.factory import model_router
from ...llm.models import AgentTaskType
from ...llm.schemas import RiskAssessment
from ...observability.tracing import investigation_tracer

def uncertainty_analyzer(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 6: uncertainty_analyzer()
    Separately calculates risk and confidence; assesses evidence sufficiency.
    Rule: HIGH RISK != HIGH CONFIDENCE.
    """
    start = time.time()
    ctx = {
        "case_id": state.case_id,
        "amount": state.transaction.get("amount", 259.98),
        "has_new_evidence": state.has_new_evidence,
        "customer_denied": any("denied" in str(e).lower() for e in state.received_evidence)
    }

    prompt = (
        f"Case: {state.case_id}\n"
        f"Amount: ${ctx['amount']}\n"
        f"Has additional evidence: {state.has_new_evidence}\n"
        f"Received evidence: {state.received_evidence}\n"
        "Evaluate Risk vs Confidence, determine evidence sufficiency and missing elements."
    )

    res = model_router.invoke_structured(
        task_type=AgentTaskType.UNCERTAINTY,
        schema=RiskAssessment,
        messages=[{"role": "user", "content": prompt}],
        case_id=state.case_id,
        context_data=ctx
    )

    out = res.output
    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(
        state.case_id, "uncertainty_analyzer",
        {"has_new_evidence": state.has_new_evidence}, out.model_dump(), dur, model_name=res.selected_model
    )

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": state.case_id,
        "actor": f"Agent ({res.selected_model})",
        "event": "Uncertainty Assessed",
        "tool_action": "uncertainty_analyzer",
        "result": f"Risk: {out.risk_level} ({out.risk_score:.2f}) · Confidence: {out.confidence:.2f} · Sufficiency: {out.evidence_sufficiency}"
    }

    return {
        "risk_level": out.risk_level,
        "risk_score": out.risk_score,
        "confidence": out.confidence,
        "evidence_sufficiency": out.evidence_sufficiency,
        "missing_evidence": out.uncertain_signals,
        "model_metadata": {**state.model_metadata, "uncertainty_model": res.selected_model},
        "audit_events": state.audit_events + [event]
    }
