import time
from typing import Dict, Any
from ..state import InvestigationState
from ..policy_engine import policy_engine
from ...observability.tracing import investigation_tracer

def policy_engine_node(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 12 & 13: policy_engine() & permission_engine()
    Deterministic policy enforcement and permission verification.
    The LLM never has authority to bypass deterministic policy rules R1-R10.
    """
    start = time.time()
    action = state.selected_action or "BLOCK_CARD"
    exposure = state.transaction.get("amount", 259.98)
    
    # Deterministic route & required role computation
    route, required_role = policy_engine.determine_route(action, exposure)
    
    # Approval is required if route is L1 or L2
    approval_required = route in ("L1", "L2")
    approval_status = "PENDING" if approval_required else "NONE"
    approval_id = f"APPR-{state.case_id}" if approval_required else None
    
    policy_res = {
        "allowed": True,
        "approval_required": approval_required,
        "required_role": required_role,
        "route": route,
        "policy_reference": f"Policy R2: {route} Authorization",
        "reason": f"Disruptive card blocking on ${exposure:.2f} exposure mandates {required_role} sign-off."
    }

    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(
        state.case_id, "policy_engine",
        {"action": action, "exposure": exposure}, policy_res, dur
    )

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": state.case_id,
        "actor": "Deterministic Policy Engine",
        "event": "Policy Evaluated",
        "tool_action": "policy_engine",
        "result": f"Route: {route} · Required Role: {required_role} · Approval Required: {approval_required}"
    }

    status = "AWAITING_APPROVAL" if approval_required else "ACTION_TAKEN"

    return {
        "policy_result": policy_res,
        "approval_required": approval_required,
        "approval_status": approval_status,
        "approval_id": approval_id,
        "required_role": required_role,
        "status": status,
        "audit_events": state.audit_events + [event]
    }
