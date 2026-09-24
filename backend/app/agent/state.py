from typing import Dict, Any, List, Optional, Union
from pydantic import BaseModel, Field

class InvestigationState(BaseModel):
    # Core identifiers
    case_id: str = "CASE-10293"
    trigger: Dict[str, Any] = Field(default_factory=dict)
    customer: Dict[str, Any] = Field(default_factory=dict)
    account: Dict[str, Any] = Field(default_factory=dict)
    transaction: Dict[str, Any] = Field(default_factory=dict)
    entities: List[Dict[str, Any]] = Field(default_factory=list)
    graph_context: Dict[str, Any] = Field(default_factory=dict)

    # Evidence & findings
    evidence: List[Dict[str, Any]] = Field(default_factory=list)
    findings: List[Dict[str, Any]] = Field(default_factory=list)
    fraud_patterns: List[Dict[str, Any]] = Field(default_factory=list)
    contradictions: List[str] = Field(default_factory=list)

    # Uncertainty & Risk
    risk_level: str = "HIGH"
    risk_score: float = 0.87
    confidence: float = 0.62
    evidence_sufficiency: str = "INSUFFICIENT" # SUFFICIENT | INSUFFICIENT | AMBIGUOUS
    missing_evidence: List[str] = Field(default_factory=list)
    
    # Evidence Planning & Reassessment loop
    evidence_requests: List[Dict[str, Any]] = Field(default_factory=list)
    received_evidence: List[Dict[str, Any]] = Field(default_factory=list)
    has_new_evidence: bool = False
    prior_cases: List[Dict[str, Any]] = Field(default_factory=list)

    # Next Best Action (NBA)
    candidate_actions: List[str] = Field(default_factory=list)
    selected_action: Optional[str] = None
    initial_nba: List[Dict[str, Any]] = Field(default_factory=list)
    final_nba: List[Dict[str, Any]] = Field(default_factory=list)
    what_changed: str = ""

    # Policy & Human-in-the-Loop Approval
    policy_result: Optional[Dict[str, Any]] = None
    permission_result: Optional[Dict[str, Any]] = None
    approval_required: bool = False
    approval_status: str = "NONE" # NONE | PENDING | APPROVED | REJECTED
    approval_id: Optional[str] = None
    required_role: str = "System / Agent"

    # Explanation & Audit
    explanation: Optional[Dict[str, Any]] = None
    audit_events: List[Dict[str, Any]] = Field(default_factory=list)
    status: str = "TRIGGERED" # TRIGGERED | INVESTIGATING | EVIDENCE_REQUIRED | AWAITING_APPROVAL | RESOLVED

    # Metadata & Observability
    model_metadata: Dict[str, Any] = Field(default_factory=dict)
    trace_metadata: Dict[str, Any] = Field(default_factory=dict)
