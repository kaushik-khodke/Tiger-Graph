from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class InvestigationPlan(BaseModel):
    priority_areas: List[str] = Field(
        description="Target contextual areas to investigate, e.g. transaction_context, customer_history, device_relationships, connection_history, prior_cases"
    )
    tools_to_execute: List[str] = Field(
        description="Names of TigerGraph tools to call, e.g. get_transaction_context, get_device_relationships, find_related_cases"
    )
    rationale: str = Field(description="Reasoning behind this plan")

class StructuredEvidenceItem(BaseModel):
    title: str = Field(description="Short title of the evidence")
    description: str = Field(description="Factual description")
    source: str = Field(description="Origin system / tool, e.g. TigerGraph")
    strength: str = Field(description="Strong, Moderate, or Weak")
    tone: str = Field(description="support, contradict, or context")
    entities: List[str] = Field(description="Connected entity IDs involved")
    pattern_reference: Optional[str] = Field(default=None, description="Matched fraud pattern ID if applicable, e.g. FP-03")

class EvidenceAssessment(BaseModel):
    items: List[StructuredEvidenceItem] = Field(description="Analyzed evidence items")
    primary_findings: List[str] = Field(description="Key factual takeaways")
    contradictions_found: List[str] = Field(default_factory=list, description="Any conflicting historical signals")

class EvidenceRequest(BaseModel):
    action_type: str = Field(description="customer_validation, step_up_auth, or analyst_information")
    reason: str = Field(description="Why this specific evidence is needed to resolve uncertainty")
    target_entity: str = Field(description="Entity or transaction targeted")
    decision_impact: str = Field(description="How receiving this evidence could change the next-best action")

class RiskAssessment(BaseModel):
    risk_score: float = Field(ge=0.0, le=1.0, description="Fraud probability / risk between 0.0 and 1.0")
    risk_level: str = Field(description="LOW, MEDIUM, HIGH, or VERY HIGH")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence in assessment between 0.0 and 1.0")
    evidence_sufficiency: str = Field(description="SUFFICIENT, INSUFFICIENT, or AMBIGUOUS")
    known_signals: List[str] = Field(description="Established facts")
    uncertain_signals: List[str] = Field(description="Unverified or ambiguous signals")
    primary_uncertainty: str = Field(description="Main source of doubt")
    why_not_acting: str = Field(description="Explanation of why further evidence or approval is required before final action")

class ActionRecommendation(BaseModel):
    recommended_action: str = Field(
        description="e.g. ALLOW_TRANSACTION, BLOCK_TRANSACTION, VERIFY_WITH_CUSTOMER, BLOCK_CARD, MONITOR_CARD, ESCALATE, FILE_REPORT"
    )
    candidate_actions: List[str] = Field(default_factory=list, description="Other possible candidate actions")
    reasons: List[str] = Field(description="Defensible reasons grounded in evidence")
    what_changed: Optional[str] = Field(default="", description="Delta if reassessed after additional evidence")

class PolicyDecision(BaseModel):
    allowed: bool = Field(description="Whether the action is permitted under fraud policy")
    approval_required: bool = Field(description="Whether human supervisor approval is required before execution")
    required_role: str = Field(description="System / Agent, Team Lead (L1), or Fraud Manager (L2)")
    policy_reference: str = Field(description="Governing policy rule, e.g. Policy R1, Policy R5")
    reason: str = Field(description="Policy rationale")

class Explanation(BaseModel):
    facts: List[str] = Field(description="Verified evidence facts")
    evidence_references: List[str] = Field(description="Evidence IDs cited, e.g. E-004, E-007")
    uncertainty_narrative: str = Field(description="Summary of remaining or resolved uncertainty")
    decision_rationale: str = Field(description="Grounding for why the recommended action was chosen")
    policy_reference: str = Field(description="Policy rule cited")
    approval_requirement: str = Field(description="Approval tier and required role")
