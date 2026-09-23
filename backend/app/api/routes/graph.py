from fastapi import APIRouter, HTTPException
from ...schemas.graph import GraphData
from ...services.graph_service import graph_service

router = APIRouter(prefix="/graph", tags=["Graph"])

@router.get("/case/{case_id}", response_model=GraphData)
def get_case_graph(case_id: str):
    return graph_service.get_case_graph(case_id)

@router.get("/entity/{entity_id}")
def get_entity_context(entity_id: str):
    return {
        "entity_id": entity_id,
        "type": "device" if "D-" in entity_id or "DEV" in entity_id else "customer" if "C-" in entity_id else "transaction",
        "connections_count": 3,
        "risk_flags": ["Multi-card association"] if "D-" in entity_id else []
    }
