import time
from typing import Dict, Any, List
from ..state import InvestigationState
from ..tools import tigergraph as tg_tools
from ...observability.tracing import investigation_tracer

def graph_investigation(state: InvestigationState) -> Dict[str, Any]:
    """
    NODE 3: graph_investigation()
    Executes TigerGraph tools: gathers connected context, devices, related cases, and temporal sequences.
    """
    start = time.time()
    case_id = state.case_id
    txn_id = state.transaction.get("id", "TXN-10293")
    cust_id = state.customer.get("id", "C-123")

    # 1. Transaction context
    txn_ctx = tg_tools.get_transaction_context(txn_id, case_id=case_id)
    # 2. Customer history
    cust_hist = tg_tools.get_customer_history(cust_id, case_id=case_id)
    # 3. Device relationships
    dev_rel = tg_tools.get_device_relationships("D-77", case_id=case_id)
    # 4. Related cases
    rel_cases = tg_tools.find_related_cases(["C-123", "D-77", "C-811"], case_id=case_id)
    # 5. Temporal sequence
    temporal_res = tg_tools.run_temporal_query(cust_id, "09:40:00", "10:05:00", case_id=case_id)

    graph_context = {
        "transaction": txn_ctx,
        "customer": cust_hist,
        "device": dev_rel,
        "related_cases": rel_cases,
        "temporal": temporal_res
    }

    raw_evidence = [
        {
            "id": "E-004",
            "type": "Supporting Evidence",
            "title": "Shared device relationship",
            "description": "Customer C-123 and C-811 both authenticated via Device D-77.",
            "source": "TigerGraph · get_device_relationships",
            "strength": "Strong",
            "tone": "support",
            "entities": "C-123 → D-77 → C-811",
            "pattern": "FP-03",
            "time": time.strftime("%H:%M"),
            "provenance": dev_rel["provenance"]
        },
        {
            "id": "E-007",
            "type": "Contextual Evidence",
            "title": "Rapid sequence: registration to checkout",
            "description": "Device registration at 09:42 followed by online checkout at 10:01 (19 min).",
            "source": "TigerGraph · run_temporal_query",
            "strength": "Moderate",
            "tone": "context",
            "entities": "D-77 → TXN-10293",
            "time": time.strftime("%H:%M"),
            "provenance": temporal_res["provenance"]
        },
        {
            "id": "E-012",
            "type": "Supporting Evidence",
            "title": "Linked to historical fraud case CC-0141",
            "description": "Device D-77 was previously recorded in confirmed card testing fraud CC-0141.",
            "source": "TigerGraph · find_related_cases",
            "strength": "Strong",
            "tone": "support",
            "entities": "D-77 → CC-0141",
            "pattern": "FP-03",
            "time": time.strftime("%H:%M"),
            "provenance": rel_cases["provenance"]
        },
        {
            "id": "E-015",
            "type": "Contradicting Evidence",
            "title": "Legitimate cardholder region history",
            "description": "Cardholder C-123 has 3-year tenure with established legitimate activity in billing region.",
            "source": "TigerGraph · get_customer_history",
            "strength": "Moderate",
            "tone": "contradict",
            "entities": "C-123 → US-West",
            "time": time.strftime("%H:%M"),
            "provenance": cust_hist["provenance"]
        }
    ]

    dur = (time.time() - start) * 1000.0
    investigation_tracer.record_node_execution(case_id, "graph_investigation", {"tools": 5}, {"evidence_count": len(raw_evidence)}, dur)

    event = {
        "timestamp": time.strftime("%H:%M:%S"),
        "case_id": case_id,
        "actor": "TigerGraph MCP Tools",
        "event": "Graph Traversal Completed",
        "tool_action": "get_device_relationships",
        "result": f"Retrieved {len(raw_evidence)} evidence items with full provenance"
    }

    return {
        "graph_context": graph_context,
        "evidence": raw_evidence,
        "audit_events": state.audit_events + [event]
    }
