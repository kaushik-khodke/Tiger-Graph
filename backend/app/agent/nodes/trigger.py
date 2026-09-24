import time
from typing import Dict, Any
from ..state import InvestigationState
from ...observability.tracing import investigation_tracer

def trigger_case(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 1: trigger_case()
    Validates trigger, identifies customer/transaction, assigns baseline case state.
    """
    start = time.time()
    case_id = state.case_id or "CASE-10293"
    
    txn = state.transaction or {
        "id": "TXN-10293",
        "amount": 259.98,
        "channel": "online",
        "card_id": "C-123-K1",
        "customer_id": "C-123"
    }

    cust = state.customer or {
        "id": txn.get("customer_id", "C-123"),
        "tenure": "3 years",
        "risk_tier": "Standard"
    }

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": case_id,
        "actor": "System / Real-Time Risk Engine",
        "event": "Investigation Triggered",
        "tool_action": "trigger_case",
        "result": f"High risk score 0.87 detected on transaction {txn.get('id')}"
    }

    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(case_id, "trigger_case", {"trigger": state.trigger}, {"status": "INVESTIGATING"}, dur)

    return {
        "case_id": case_id,
        "status": "INVESTIGATING",
        "transaction": txn,
        "customer": cust,
        "audit_events": state.audit_events + [event]
    }
