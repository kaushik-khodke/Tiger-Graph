import time
from typing import Dict, Any
from ..state import InvestigationState
from ...llm.factory import model_router
from ...llm.models import AgentTaskType
from ...llm.schemas import Explanation
from ...observability.tracing import investigation_tracer

def explanation(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 15: explanation()
    Generates a concise, defensible, evidence-grounded explanation.
    Never exposes internal chain-of-thought tokens.
    """
    start = time.time()
    evidence_ids = [e.get("id") for e in state.evidence]

    prompt = (
        f"Case: {state.case_id}\n"
        f"Selected Action: {state.selected_action}\n"
        f"Evidence IDs: {', '.join(evidence_ids)}\n"
        f"Policy: {state.policy_result.get('policy_reference') if state.policy_result else 'Policy R2'}\n"
        f"Approval Status: {state.approval_status}\n"
        "Generate factual, auditable explanation grounded in evidence and policy."
    )

    res = model_router.invoke_structured(
        task_type=AgentTaskType.EXPLANATION,
        schema=Explanation,
        messages=[{"role": "user", "content": prompt}],
        case_id=state.case_id,
        context_data={
            "case_id": state.case_id,
            "has_new_evidence": state.has_new_evidence
        }
    )

    expl_dict = res.output.model_dump()
    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(
        state.case_id, "explanation",
        {"action": state.selected_action}, expl_dict, dur, model_name=res.selected_model
    )

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": state.case_id,
        "actor": f"Agent ({res.selected_model})",
        "event": "Audit Explanation Generated",
        "tool_action": "explanation",
        "result": f"Citing {len(expl_dict['evidence_references'])} evidence records and {expl_dict['policy_reference']}"
    }

    return {
        "explanation": expl_dict,
        "model_metadata": {**state.model_metadata, "explanation_model": res.selected_model},
        "audit_events": state.audit_events + [event]
    }
