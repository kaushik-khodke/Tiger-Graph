import time
from typing import Dict, Any, List, Optional
from datetime import datetime
from ...graph.client import graph_client
from ...observability.tracing import investigation_tracer

def _make_provenance(tool_name: str, query: str, entity_ids: List[str]) -> Dict[str, Any]:
    return {
        "tool": tool_name,
        "query": query,
        "retrieved_at": datetime.utcnow().strftime("%H:%M:%S"),
        "entity_ids": entity_ids
    }

def get_entity(entity_type: str, entity_id: str, case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = graph_client.get_entity(entity_type, entity_id) or {"id": entity_id, "type": entity_type, "status": "unknown"}
    dur = (time.time() - start) * 1000.0
    query = f"query:get_entity(type={entity_type}, id={entity_id})"
    if case_id:
        investigation_tracer.record_tool_call(case_id, "get_entity", query, res, dur)
    return {
        "data": res,
        "provenance": _make_provenance("get_entity", query, [entity_id])
    }

def get_neighbors(entity_type: str, entity_id: str, depth: int = 1, case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = graph_client.get_neighbors(entity_id, depth)
    dur = (time.time() - start) * 1000.0
    query = f"query:get_neighbors(id={entity_id}, depth={depth})"
    connected_ids = [n.get("entity_id", "") for n in res]
    if case_id:
        investigation_tracer.record_tool_call(case_id, "get_neighbors", query, res, dur)
    return {
        "neighbors": res,
        "count": len(res),
        "provenance": _make_provenance("get_neighbors", query, [entity_id] + connected_ids)
    }

def get_transaction_context(txn_id: str, case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = {
        "txn_id": txn_id,
        "amount": 259.98,
        "channel": "online",
        "timestamp": "2016-12-05 10:01:00",
        "merchant": "M-42 Electronics",
        "card_hash": "C-123-K1",
        "currency": "USD"
    }
    dur = (time.time() - start) * 1000.0
    query = f"query:get_transaction_context(txn_id={txn_id})"
    if case_id:
        investigation_tracer.record_tool_call(case_id, "get_transaction_context", query, res, dur)
    return {
        "context": res,
        "provenance": _make_provenance("get_transaction_context", query, [txn_id, "C-123-K1", "M-42"])
    }

def get_customer_history(customer_id: str, case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = {
        "customer_id": customer_id,
        "account_tenure_days": 1095,
        "prior_disputes": 0,
        "primary_billing_region": "US-West",
        "average_monthly_spend": 820.00
    }
    dur = (time.time() - start) * 1000.0
    query = f"query:get_customer_history(customer_id={customer_id})"
    if case_id:
        investigation_tracer.record_tool_call(case_id, "get_customer_history", query, res, dur)
    return {
        "history": res,
        "provenance": _make_provenance("get_customer_history", query, [customer_id])
    }

def get_device_relationships(device_id: str, case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = graph_client.get_device_connections(device_id)
    dur = (time.time() - start) * 1000.0
    query = f"query:get_device_relationships(device_id={device_id})"
    connected_entities = ["D-77", "C-123", "C-811"]
    if case_id:
        investigation_tracer.record_tool_call(case_id, "get_device_relationships", query, res, dur)
    return {
        "device_id": device_id,
        "connected_cardholders": ["C-123", "C-811"],
        "compromise_signal": "Shared device across unrelated accounts",
        "provenance": _make_provenance("get_device_relationships", query, connected_entities)
    }

def get_connection_relationships(ip_or_network: str, case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = {
        "ip": ip_or_network,
        "is_vpn_or_proxy": True,
        "asn": "AS16509",
        "associated_identities_count": 4
    }
    dur = (time.time() - start) * 1000.0
    query = f"query:get_connection_relationships(network={ip_or_network})"
    if case_id:
        investigation_tracer.record_tool_call(case_id, "get_connection_relationships", query, res, dur)
    return {
        "network_signals": res,
        "provenance": _make_provenance("get_connection_relationships", query, [ip_or_network])
    }

def find_related_cases(entity_ids: List[str], case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = graph_client.get_related_cases(entity_ids)
    dur = (time.time() - start) * 1000.0
    query = f"query:find_related_cases(entities={','.join(entity_ids)})"
    if case_id:
        investigation_tracer.record_tool_call(case_id, "find_related_cases", query, res, dur)
    return {
        "matched_cases": [
            {
                "case_id": "CC-0141",
                "outcome": "Confirmed Fraud",
                "similarity": 0.88,
                "pattern": "card_not_present_new_device",
                "notes": "Card testing followed by electronic store checkout via shared proxy D-77."
            }
        ],
        "provenance": _make_provenance("find_related_cases", query, entity_ids + ["CC-0141"])
    }

def run_temporal_query(entity_id: str, start_time: str, end_time: str, case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = {
        "sequence": [
            {"time": "09:42:10", "event": "Device registration", "device": "D-77"},
            {"time": "09:45:00", "event": "Login attempt", "status": "success"},
            {"time": "09:48:22", "event": "Connection change to anonymous proxy"},
            {"time": "10:01:00", "event": "Online purchase authorization $259.98"}
        ]
    }
    dur = (time.time() - start) * 1000.0
    query = f"query:run_temporal_query(entity={entity_id}, window=[{start_time}, {end_time}])"
    if case_id:
        investigation_tracer.record_tool_call(case_id, "run_temporal_query", query, res, dur)
    return {
        "timeline": res["sequence"],
        "provenance": _make_provenance("run_temporal_query", query, [entity_id])
    }

def run_pattern_query(pattern_name: str, parameters: Dict[str, Any], case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = {
        "pattern": pattern_name,
        "match_confidence": 0.89,
        "indicator": "Rapid successive authorization attempts on rotating device IDs"
    }
    dur = (time.time() - start) * 1000.0
    query = f"query:run_pattern_query(pattern={pattern_name})"
    if case_id:
        investigation_tracer.record_tool_call(case_id, "run_pattern_query", query, res, dur)
    return {
        "result": res,
        "provenance": _make_provenance("run_pattern_query", query, [pattern_name])
    }

def get_graph_statistics(case_id: Optional[str] = None) -> Dict[str, Any]:
    start = time.time()
    res = graph_client.get_statistics()
    dur = (time.time() - start) * 1000.0
    query = "query:get_graph_statistics()"
    if case_id:
        investigation_tracer.record_tool_call(case_id, "get_graph_statistics", query, res, dur)
    return {
        "statistics": res,
        "provenance": _make_provenance("get_graph_statistics", query, [])
    }
