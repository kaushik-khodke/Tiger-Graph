from typing import List, Optional, Tuple, Literal
from pydantic import BaseModel, Field

class CaseListItem(BaseModel):
    id: str
    trigger: str
    customer: str
    transaction: str
    amount: float
    risk: int
    confidence: int
    status: str
    nba: str
    evidence: int
    updated: str
    card_id: Optional[str] = None
    opened_at: Optional[str] = None

class CaseMetrics(BaseModel):
    active_investigations: int
    awaiting_evidence: int
    pending_approvals: int
    escalations: int
    resolved_today: int
    total_cases: int

class UncertaintyAssessment(BaseModel):
    risk_score: int
    risk_level: str
    confidence: int
    evidence_sufficiency: str
    known_signals: List[str]
    uncertain_signals: List[str]
    primary_uncertainty: str
    why_not_acting: str

class NextBestAction(BaseModel):
    action: str
    route: str
    reason: str
    policy_reference: Optional[str] = None
    required_role: Optional[str] = None

class RecommendationSnapshot(BaseModel):
    initial: List[NextBestAction]
    final: List[NextBestAction]
    what_changed: str
    current_recommended_action: str
    approval_required: bool
    required_role: str
    policy_rule: str

class CaseDetail(BaseModel):
    id: str
    opened_at: str
    trigger_type: str
    trigger_text: str
    flagged_txn_id: str
    card_id: str
    customer_id: str
    amount: float
    status: str
    verdict: str
    fraud_probability: float
    pattern: str
    pattern_description: str = ""
    affected_txn_ids: List[str] = []
    connected_card_ids: List[str] = []
    connected_device_profiles: List[str] = []
    exposure_usd: float = 0.0
    uncertainty: UncertaintyAssessment
    recommendation: RecommendationSnapshot
    evidence_count: int
    finding_headline: str
    finding_body: str
    finding_pattern: str
    finding_policy: str
    approval_status: str
    timeline: List[Tuple[str, str, str]] = []
