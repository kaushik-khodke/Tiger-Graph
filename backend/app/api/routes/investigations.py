import asyncio
import json
from typing import AsyncGenerator, Dict, Any, Optional, List
from fastapi import APIRouter, HTTPException, BackgroundTasks
from fastapi.responses import StreamingResponse
from pydantic import BaseModel

from ...services.data_service import data_service
from ...services.audit_service import audit_service
from ...agent.graph import investigation_agent
from ...agent.state import InvestigationState

router = APIRouter(prefix="/investigations", tags=["Investigations"])

# In-memory pub/sub queues for SSE streaming per case
_event_queues: Dict[str, List[asyncio.Queue]] = {}

def broadcast_case_event(case_id: str, event_data: Dict[str, Any]):
    queues = _event_queues.get(case_id, [])
    for q in queues:
        try:
            q.put_nowait(event_data)
        except Exception:
            pass

class StartInvestigationPayload(BaseModel):
    case_id: Optional[str] = "CASE-10293"
    trigger_type: Optional[str] = "risk_score"
    trigger_text: Optional[str] = "High-risk transaction flagged"
    amount: Optional[float] = 259.98
    customer_id: Optional[str] = "C-123"

class EvidenceResponsePayload(BaseModel):
    response_type: str = "denied" # "denied" | "confirmed" | "timeout"
    action_type: str = "customer_validation"
    notes: Optional[str] = "Cardholder confirmed transaction was not recognized"

@router.post("/start")
def start_investigation(payload: StartInvestigationPayload):
    case_id = payload.case_id or "CASE-10293"
    
    state = investigation_agent.run_investigation(
        case_id=case_id,
        initial_data={
            "trigger": {"type": payload.trigger_type, "text": payload.trigger_text},
            "transaction": {"id": f"TXN-{case_id.replace('CASE-', '')}", "amount": payload.amount, "customer_id": payload.customer_id},
            "customer": {"id": payload.customer_id}
        },
        on_event=lambda ev: broadcast_case_event(case_id, ev)
    )
    return {"status": state.status, "case_id": case_id, "state": state.model_dump()}

@router.post("/{case_id}/run")
def run_investigation(case_id: str):
    state = investigation_agent.run_investigation(
        case_id=case_id,
        on_event=lambda ev: broadcast_case_event(case_id, ev)
    )
    return {"status": state.status, "case_id": case_id, "state": state.model_dump()}

@router.get("/{case_id}")
def get_investigation_state(case_id: str):
    state = investigation_agent.get_state(case_id)
    if not state:
        # Fall back to data service case
        c = data_service.get_case(case_id)
        if not c:
            raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
        return {"case_id": case_id, "status": c.status, "detail": c.model_dump()}
    return {"case_id": case_id, "status": state.status, "state": state.model_dump()}

@router.post("/{case_id}/evidence/request")
def request_evidence(case_id: str, action_type: str = "customer_validation"):
    broadcast_case_event(case_id, {
        "event": "evidence_request_created",
        "case_id": case_id,
        "action_type": action_type,
        "message": f"Dispatched {action_type} out-of-band request to cardholder."
    })
    return {
        "status": "EVIDENCE_REQUIRED",
        "case_id": case_id,
        "action_type": action_type,
        "message": "Evidence request dispatched"
    }

@router.post("/{case_id}/evidence/response")
def submit_evidence_response(case_id: str, payload: EvidenceResponsePayload):
    # Simulate receiving validation and running reassessment in the agent
    broadcast_case_event(case_id, {
        "event": "evidence_received",
        "case_id": case_id,
        "response": payload.response_type,
        "message": f"Received {payload.response_type} response from cardholder."
    })
    
    state = investigation_agent.run_investigation(
        case_id=case_id,
        initial_data={"has_new_evidence": True},
        on_event=lambda ev: broadcast_case_event(case_id, ev)
    )
    return {"status": state.status, "case_id": case_id, "state": state.model_dump()}

@router.get("/{case_id}/events")
async def stream_case_events(case_id: str):
    """Server-Sent Events streaming live investigation milestones."""
    queue: asyncio.Queue = asyncio.Queue()
    if case_id not in _event_queues:
        _event_queues[case_id] = []
    _event_queues[case_id].append(queue)

    async def event_generator() -> AsyncGenerator[str, None]:
        try:
            # Yield initial connection heartbeat
            init_payload = json.dumps({"case_id": case_id, "event": "connected", "message": "SSE stream established"})
            yield f"event: connected\ndata: {init_payload}\n\n"

            # Stream live events
            while True:
                try:
                    event_data = await asyncio.wait_for(queue.get(), timeout=20.0)
                    ev_type = event_data.get("event", "update")
                    payload = json.dumps(event_data)
                    yield f"event: {ev_type}\ndata: {payload}\n\n"
                except asyncio.TimeoutError:
                    # Keep-alive ping
                    yield f": keep-alive\n\n"
        finally:
            if case_id in _event_queues and queue in _event_queues[case_id]:
                _event_queues[case_id].remove(queue)

    return StreamingResponse(event_generator(), media_type="text/event-stream")
