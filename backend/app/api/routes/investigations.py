import asyncio
import json
from typing import AsyncGenerator
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from ...services.data_service import data_service
from ...services.audit_service import audit_service

router = APIRouter(prefix="/investigations", tags=["Investigations"])

@router.post("/{case_id}/run")
def run_investigation(case_id: str):
    c = data_service.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    
    audit_service.log(
        case_id=case_id,
        actor="Agent",
        event="Investigation run",
        tool_action="Pipeline initiated",
        result="Running",
        metadata={"case_id": case_id}
    )
    return {"status": "started", "case_id": case_id}

@router.get("/{case_id}/events")
async def stream_case_events(case_id: str):
    """Server-Sent Events streaming live investigation milestones."""
    async def event_generator() -> AsyncGenerator[str, None]:
        milestones = [
            ("investigation_started", "Investigation opened for target transaction"),
            ("graph_traversed", "Graph context retrieved: customer, devices, card"),
            ("prior_cases_matched", "Historical case CC-0141 matched on shared device"),
            ("evidence_assessed", "Initial evidence assessed: sufficiency INSUFFICIENT"),
            ("nba_ready", "Recommended Next-Best-Action: VERIFY_WITH_CUSTOMER")
        ]
        for event_type, msg in milestones:
            await asyncio.sleep(0.4)
            payload = json.dumps({"case_id": case_id, "event": event_type, "message": msg})
            yield f"event: {event_type}\ndata: {payload}\n\n"

    return StreamingResponse(event_generator(), media_type="text/event-stream")
