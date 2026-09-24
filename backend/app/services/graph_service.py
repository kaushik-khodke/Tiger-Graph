from typing import Dict, Any, List, Optional
from ..schemas.graph import GraphNode, GraphData
from .data_service import data_service

class GraphService:
    def get_case_graph(self, case_id: str) -> GraphData:
        # Golden case specific graph topology
        if case_id == "CASE-10293":
            nodes = [
                GraphNode(id="C-123", label="Customer", sub="C-123", x=20.0, y=48.0, kind="customer", meta={"risk": "Medium", "tenure": "3 years"}),
                GraphNode(id="A-223", label="Account", sub="A-223", x=44.0, y=22.0, kind="account", meta={"type": "Checking"}),
                GraphNode(id="D-77", label="Device", sub="D-77", x=46.0, y=72.0, kind="device", meta={"model": "Samsung SM-G892A", "os": "Android 7.0", "flag": "Shared Profile"}),
                GraphNode(id="TXN-10293", label="Transaction", sub="TXN-10293", x=68.0, y=34.0, kind="transaction", meta={"amount": "$259.98", "channel": "online"}),
                GraphNode(id="C-811", label="Customer", sub="C-811", x=72.0, y=78.0, kind="customer", meta={"status": "High Risk"}),
                GraphNode(id="M-42", label="Merchant", sub="M-42", x=90.0, y=36.0, kind="merchant", meta={"category": "Electronics"}),
                GraphNode(id="CASE-103", label="Case", sub="CASE-103", x=90.0, y=78.0, kind="case", meta={"outcome": "Confirmed Fraud", "date": "2016-08-14"}),
            ]
            edges = [
                ("C-123", "A-223"),
                ("A-223", "TXN-10293"),
                ("TXN-10293", "M-42"),
                ("C-123", "D-77"),
                ("D-77", "C-811"),
                ("C-811", "CASE-103"),
            ]
            return GraphData(
                nodes=nodes,
                edges=edges,
                case_id=case_id,
                entity_count=len(nodes),
                relationship_count=len(edges)
            )

        # For other cases, generate dynamic graph topology from case data
        case_info = data_service.get_case(case_id)
        if not case_info:
            # Fallback graph
            return self.get_case_graph("CASE-10293")

        cust_id = case_info.customer_id
        card_id = case_info.card_id
        txn_id = case_info.flagged_txn_id

        # Ground truth device mapping from identity.csv for online transactions
        device_map = {
            "3478561": "SM-G935F Android 7.0",
            "3478782": "Windows 10 Chrome 62",
            "3506725": "Windows 10 Edge 16",
            "3464869": "Windows 8.1 IE 11",
            "3476682": "Windows 7 IE 11",
            "3450629": "Windows 10 Chrome 65",
            "3503878": "Windows Chrome 61",
            "3509359": "Windows 10 IE 11",
            "3523199": "iOS 9.3 iPad Safari",
            "3583368": "SM-G610F Android 7.0",
            "3583227": "Windows 10 Firefox 47",
            "3534820": "Windows 10 Edge 16",
            "3558054": "Windows 10 Chrome 66",
            "3526826": "Windows 10 Chrome 66"
        }

        prior_cases_map = {
            "HHG-001": "CC-0003", "HHG-002": "CC-0011", "HHG-003": "CC-4957",
            "HHG-004": "CC-0007", "HHG-005": "CC-0010", "HHG-006": "CC-0014",
            "HHG-007": "CC-4597", "HHG-008": "CC-4485", "HHG-009": "CC-0017",
            "HHG-010": "CC-0018", "HHG-011": "CC-4501", "HHG-012": "CC-0003",
            "HHG-013": "CC-0015", "HHG-014": "CC-0141", "HHG-015": "CC-0004",
            "HHG-016": "CC-0007", "HHG-017": "CC-4501", "HHG-018": "CC-4721",
            "HHG-019": "CC-5026", "HHG-020": "CC-0009"
        }

        dev_label = device_map.get(txn_id, "Device D-77" if "device" in case_info.pattern else "Standard Terminal")
        prior_case = prior_cases_map.get(case_id, "CC-0141")

        nodes = [
            GraphNode(id=cust_id, label="Customer", sub=cust_id, x=20.0, y=48.0, kind="customer", meta={"risk": "High" if case_info.fraud_probability > 0.75 else "Medium"}),
            GraphNode(id=card_id, label="Card", sub=card_id, x=43.0, y=20.0, kind="card", meta={"status": "Active"}),
            GraphNode(id=f"DEV-{txn_id}", label="Device Profile", sub=dev_label[:18], x=46.0, y=74.0, kind="device", meta={"profile": dev_label}),
            GraphNode(id=txn_id, label="Transaction", sub=txn_id, x=68.0, y=46.0, kind="transaction", meta={"amount": f"${case_info.amount:.2f}", "channel": "online" if "online" in case_info.trigger_text.lower() else "pos"}),
            GraphNode(id=f"MKT-{case_id}", label="Merchant / Region", sub="Region-444" if "444" in case_info.trigger_text else "Online Checkout", x=90.0, y=42.0, kind="merchant"),
            GraphNode(id=prior_case, label="Prior Case", sub=prior_case, x=90.0, y=78.0, kind="case", meta={"pattern": case_info.pattern})
        ]

        edges = [
            (cust_id, card_id),
            (cust_id, f"DEV-{txn_id}"),
            (card_id, txn_id),
            (txn_id, f"MKT-{case_id}"),
            (f"DEV-{txn_id}", prior_case)
        ]

        return GraphData(
            nodes=nodes,
            edges=edges,
            case_id=case_id,
            entity_count=len(nodes),
            relationship_count=len(edges)
        )

graph_service = GraphService()
