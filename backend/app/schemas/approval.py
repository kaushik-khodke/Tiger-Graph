from typing import Optional
from pydantic import BaseModel

class ApprovalItem(BaseModel):
    id: str
    case_id: str
    action: str
    requested_by: str
    created_at: str
    route: str  # auto | L1 | L2
    status: str  # PENDING | APPROVED | REJECTED
    risk: int
    confidence: int
    exposure_usd: float
    policy_rule: str
    notes: Optional[str] = None

class ApprovalActionPayload(BaseModel):
    decision: str  # approve | reject | request_info
    reviewer: str = "Alex Kim"
    role: str = "Fraud Supervisor"
    notes: Optional[str] = None
