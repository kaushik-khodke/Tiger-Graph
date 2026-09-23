from typing import List, Optional
from pydantic import BaseModel
from fastapi import APIRouter, HTTPException, Query
from ...schemas.approval import ApprovalItem, ApprovalActionPayload
from ...services.approval_service import approval_service

router = APIRouter(prefix="/approvals", tags=["Approvals"])

class ApprovalCreatePayload(BaseModel):
    case_id: str
    action: str = "BLOCK_CARD"
    route: str = "L1"
    exposure_usd: float = 259.98
    risk: int = 94
    confidence: int = 91
    notes: Optional[str] = "Supervisor review requested for policy-constrained action"

@router.get("", response_model=List[ApprovalItem])
def list_approvals(status: Optional[str] = Query(None)):
    return approval_service.list_approvals(status=status)

@router.post("", response_model=ApprovalItem)
def create_approval(payload: ApprovalCreatePayload):
    return approval_service.create_approval(
        case_id=payload.case_id,
        action=payload.action,
        route=payload.route,
        exposure_usd=payload.exposure_usd,
        risk=payload.risk,
        confidence=payload.confidence,
        notes=payload.notes or ""
    )

@router.post("/{approval_id}/approve", response_model=ApprovalItem)
def approve_action(approval_id: str):
    res = approval_service.decide(approval_id, ApprovalActionPayload(decision="approve"))
    if not res:
        raise HTTPException(status_code=404, detail="Approval not found")
    return res

@router.post("/{approval_id}/reject", response_model=ApprovalItem)
def reject_action(approval_id: str):
    res = approval_service.decide(approval_id, ApprovalActionPayload(decision="reject"))
    if not res:
        raise HTTPException(status_code=404, detail="Approval not found")
    return res

@router.post("/{approval_id}/decide", response_model=ApprovalItem)
def decide_action(approval_id: str, payload: ApprovalActionPayload):
    res = approval_service.decide(approval_id, payload)
    if not res:
        raise HTTPException(status_code=404, detail="Approval not found")
    return res
