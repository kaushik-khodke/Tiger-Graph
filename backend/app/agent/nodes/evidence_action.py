import time
from typing import Dict, Any
from ..state import InvestigationState
from ...observability.tracing import investigation_tracer

def evidence_action(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 9: evidence_action()
    Executes controlled evidence action (e.g. customer transaction validation).
    Adds newly acquired evidence with full provenance.
    """
    start = time.time()
    case_id = state.case_id
    
    # Mocked or dispatched external action response
    new_evidence_item = {
        "id": "E-021",
        "type": "Supporting Evidence",
        "title": "Customer Transaction Validation: Denied",
        "description": "Cardholder explicitly confirmed transaction $259.98 was unauthorized (NOT recognized).",
        "source": "Out-of-Band SMS / Push Validation",
        "strength": "Strong",
        "tone": "support",
        "entities": f"{state.customer.get('id', 'C-123')} → {state.transaction.get('id', 'TXN-10293')}",
        "pattern": "FP-03",
        "time": time.strftime("%H:%M"),
        "provenance": {
            "tool": "customer_validation_gateway",
            "query": f"action:request_validation(customer={state.customer.get('id')}, txn={state.transaction.get('id')})",
            "retrieved_at": time.strftime("%H:%M:%S"),
            "entity_ids": [state.customer.get("id", "C-123"), state.transaction.get("id", "TXN-10293")]
        }
    }

    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(case_id, "evidence_action", {"action": "customer_validation"}, new_evidence_item, dur)

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": case_id,
        "actor": "Customer Gateway",
        "event": "Evidence Received",
        "tool_action": "evidence_action",
        "result": "Cardholder confirmed transaction was NOT recognized"
    }

    return {
        "evidence": state.evidence + [new_evidence_item],
        "received_evidence": state.received_evidence + [new_evidence_item],
        "has_new_evidence": True,
        "audit_events": state.audit_events + [event]
    }
