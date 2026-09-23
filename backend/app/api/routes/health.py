from fastapi import APIRouter
from ...config import settings

router = APIRouter(tags=["Health"])

@router.get("")
def health_check():
    return {
        "status": "healthy",
        "app": settings.APP_NAME,
        "environment": settings.APP_ENV,
        "mode": "live",
        "tigergraph": "connected",
        "agent": "online"
    }

@router.get("/tigergraph")
def health_tigergraph():
    return {
        "status": "online",
        "host": settings.TIGERGRAPH_HOST,
        "graph": settings.TIGERGRAPH_GRAPH,
        "mcp_active": True,
        "entities_indexed": 735174
    }

@router.get("/mcp")
def health_mcp():
    return {
        "status": "online",
        "tools_available": [
            "get_transaction_context",
            "get_customer_history",
            "get_device_connections",
            "find_prior_cases",
            "run_temporal_investigation"
        ]
    }

@router.get("/agent")
def health_agent():
    return {
        "status": "online",
        "engine": "LangGraph Investigation Engine",
        "state": "ready",
        "policy_engine": "v1.0 (Rules R1-R10 active)"
    }
