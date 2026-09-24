import time
from typing import Dict, Any
from ..state import InvestigationState
from ...observability.tracing import investigation_tracer

def approval_wait(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 14: approval_wait()
    Checks whether human supervisor authorization is required.
    If approval is pending, marks case state as AWAITING_APPROVAL.
    If approved, transitions to ACTION_TAKEN and records action execution.
    """
    start = time.time()
    case_id = state.case_id
    
    if state.approval_required and state.approval_status == "PENDING":
        # Graph pauses here for Human-in-the-Loop review
        dur = (time.time() - start) * 1000.0
        investigation_tracer.record_node_execution(
            case_id, "approval_wait",
            {"approval_id": state.approval_id},
            {"status": "AWAITING_APPROVAL"},
            dur
        )
        return {
            "status": "AWAITING_APPROVAL"
        }

    # Action executed after approval or if auto-routed
    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": case_id,
        "actor": "Action Execution Service",
        "event": "Defensive Action Executed",
        "tool_action": "execute_action",
        "result": f"Executed action '{state.selected_action or 'BLOCK_CARD'}' with approval status '{state.approval_status}'"
    }

    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(
        case_id, "approval_wait",
        {"status": state.approval_status},
        {"action_executed": state.selected_action},
        dur
    )

    return {
        "status": "ACTION_TAKEN",
        "audit_events": state.audit_events + [event]
    }
