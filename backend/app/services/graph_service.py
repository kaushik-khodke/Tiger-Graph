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

        nodes = [
            GraphNode(id=cust_id, label="Customer", sub=cust_id, x=20.0, y=48.0, kind="customer"),
            GraphNode(id=card_id, label="Card", sub=card_id, x=43.0, y=20.0, kind="card"),
            GraphNode(id=f"DEV-{case_id}", label="Device", sub="Device-ID", x=46.0, y=74.0, kind="device"),
            GraphNode(id=txn_id, label="Transaction", sub=txn_id, x=68.0, y=46.0, kind="transaction", meta={"amount": f"${case_info.amount:.2f}"}),
            GraphNode(id="M-ONLINE", label="Merchant", sub="M-Online", x=90.0, y=42.0, kind="merchant"),
            GraphNode(id=f"PRIOR-{case_id}", label="Prior Case", sub="CC-0141", x=90.0, y=78.0, kind="case")
        ]

        edges = [
            (cust_id, card_id),
            (cust_id, f"DEV-{case_id}"),
            (card_id, txn_id),
            (txn_id, "M-ONLINE"),
            (f"DEV-{case_id}", f"PRIOR-{case_id}")
        ]

        return GraphData(
            nodes=nodes,
            edges=edges,
            case_id=case_id,
            entity_count=len(nodes),
            relationship_count=len(edges)
        )

graph_service = GraphService()
