import time
from typing import Dict, Any
from ..state import InvestigationState
from ...llm.factory import model_router
from ...llm.models import AgentTaskType
from ...llm.schemas import InvestigationPlan
from ...observability.tracing import investigation_tracer

def investigation_planner(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 2: investigation_planner()
    Determines investigation priorities, missing contextual areas, and tool call list.
    """
    start = time.time()
    prompt = (
        f"Case: {state.case_id}\n"
        f"Transaction: ${state.transaction.get('amount', 259.98)} (online)\n"
        f"Trigger: {state.trigger.get('text', 'High-risk transaction flagged')}\n"
        "Plan investigation: identify contextual areas to query in TigerGraph."
    )

    res = model_router.invoke_structured(
        task_type=AgentTaskType.PLANNER,
        schema=InvestigationPlan,
        messages=[{"role": "user", "content": prompt}],
        case_id=state.case_id,
        context_data={"case_id": state.case_id, "amount": state.transaction.get("amount", 259.98)}
    )

    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(
        state.case_id, "investigation_planner",
        {"prompt": prompt}, res.output.model_dump(), dur, model_name=res.selected_model
    )

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": state.case_id,
        "actor": f"Agent ({res.selected_model})",
        "event": "Investigation Plan Created",
        "tool_action": "investigation_planner",
        "result": f"Targeting {len(res.output.priority_areas)} contextual areas"
    }

    return {
        "model_metadata": {**state.model_metadata, "planner_model": res.selected_model},
        "audit_events": state.audit_events + [event]
    }
