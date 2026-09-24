from typing import Optional, Dict, Any
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException
from ...services.audit_service import audit_service
from ...agent.graph import investigation_agent
from .investigations import broadcast_case_event

router = APIRouter(prefix="/mock", tags=["Mock External Services"])

class CustomerValidationPayload(BaseModel):
    case_id: str
    response: str = "denied"  # "confirmed" | "denied" | "timeout"
    channel: str = "sms"      # "sms" | "app_push" | "email"
    notes: Optional[str] = "Customer reported unrecognized charge via mobile notification"

class StepUpAuthPayload(BaseModel):
    case_id: str
    method: str = "sms_otp"   # "sms_otp" | "biometric" | "push"
    result: str = "pass"      # "pass" | "fail" | "expired"
    device_id: Optional[str] = "D-77"

class AnalystInfoPayload(BaseModel):
    case_id: str
    info_type: str = "disputed_charge"  # "identity_verified" | "known_compromise_feed" | "disputed_charge"
    notes: Optional[str] = "External intel confirms card involved in merchant database leak"

@router.post("/customer-validation")
def mock_customer_validation(payload: CustomerValidationPayload):
    """Simulates customer out-of-band validation callback."""
    audit_service.log(
        case_id=payload.case_id,
        actor=f"Customer ({payload.channel.upper()})",
        event="Out-of-band validation response",
        tool_action=f"Response: {payload.response.upper()}",
        result="Success",
        metadata={"channel": payload.channel, "notes": payload.notes}
    )

    broadcast_case_event(payload.case_id, {
        "event": "evidence_received",
        "case_id": payload.case_id,
        "type": "customer_validation",
        "response": payload.response,
        "channel": payload.channel,
        "message": f"Customer validation received via {payload.channel}: {payload.response.upper()}"
    })

    # If case has LangGraph checkpoint, run reassessment
    agent_state = investigation_agent.get_state(payload.case_id)
    if agent_state:
        agent_state = investigation_agent.run_investigation(
            case_id=payload.case_id,
            initial_data={
                "has_new_evidence": True,
                "customer_response": payload.response
            },
            on_event=lambda ev: broadcast_case_event(payload.case_id, ev)
        )
        return {
            "status": "PROCESSED",
            "case_id": payload.case_id,
            "response": payload.response,
            "current_risk": agent_state.risk_level,
            "next_action": agent_state.selected_action
        }

    return {
        "status": "RECORDED",
        "case_id": payload.case_id,
        "response": payload.response,
        "message": "Validation response recorded successfully"
    }

@router.post("/step-up-auth")
def mock_step_up_auth(payload: StepUpAuthPayload):
    """Simulates multi-factor step-up authentication challenge result."""
    audit_service.log(
        case_id=payload.case_id,
        actor="Auth Gateway",
        event="Step-up authentication",
        tool_action=f"{payload.method.upper()} -> {payload.result.upper()}",
        result=payload.result.upper(),
        metadata={"method": payload.method, "device_id": payload.device_id}
    )

    broadcast_case_event(payload.case_id, {
        "event": "step_up_auth_completed",
        "case_id": payload.case_id,
        "method": payload.method,
        "result": payload.result,
        "message": f"Step-up auth ({payload.method}) resulted in: {payload.result.upper()}"
    })

    return {
        "status": "RECORDED",
        "case_id": payload.case_id,
        "method": payload.method,
        "result": payload.result
    }

@router.post("/analyst-information")
def mock_analyst_information(payload: AnalystInfoPayload):
    """Simulates investigator or tier-2 fraud analyst additional notes."""
    audit_service.log(
        case_id=payload.case_id,
        actor="Tier-2 Analyst",
        event="Intel added",
        tool_action=f"Type: {payload.info_type}",
        result="Success",
        metadata={"info_type": payload.info_type, "notes": payload.notes}
    )

    broadcast_case_event(payload.case_id, {
        "event": "analyst_info_added",
        "case_id": payload.case_id,
        "info_type": payload.info_type,
        "message": payload.notes or "Additional analyst information attached"
    })

    return {
        "status": "RECORDED",
        "case_id": payload.case_id,
        "info_type": payload.info_type,
        "message": "Analyst intel successfully attached"
    }
