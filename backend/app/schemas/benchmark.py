from typing import List, Optional, Dict, Any
from pydantic import BaseModel

class BenchmarkCaseItem(BaseModel):
    case_id: str
    opened_at: str
    trigger_type: str
    flagged_txn_id: str
    card_id: str
    customer_id: str
    amount: float
    status: str
    verdict: Optional[str] = None
    fraud_probability: Optional[float] = None
    pattern: Optional[str] = None
    exposure_usd: Optional[float] = None
    initial_nba: Optional[str] = None
    final_nba: Optional[str] = None
    sar_filed: Optional[bool] = None
    latency_s: Optional[float] = None
    tool_calls: Optional[int] = None

class BenchmarkSummary(BaseModel):
    total: int
    completed: int
    fraud_count: int
    legitimate_count: int
    uncertain_count: int
    sar_count: int
    total_exposure_usd: float

# Official Answer Key JSON Models matching README.md Section "Answer Format"
class EvidenceClaim(BaseModel):
    claim: str
    source: str
    ref: str
    entity_ids: List[str]

class EvidenceRequestRecord(BaseModel):
    type: str
    asked_after_step: int
    assumed_response: str

class SARRecord(BaseModel):
    file: bool
    reason: str
    narrative: str
    subjects: List[str]
    total_amount_usd: float
    activity_dates: List[str]

class BenchmarkCaseDeliverable(BaseModel):
    status: str
    verdict: str
    fraud_probability: float
    pattern: str
    pattern_description: str = ""
    affected_txn_ids: List[str] = []
    first_suspicious_txn_id: str = ""
    connected_card_ids: List[str] = []
    connected_device_profiles: List[str] = []
    exposure_usd: float = 0.0
    evidence: List[EvidenceClaim] = []
    similar_prior_cases: List[str] = []
    summary: str
    written_to_graph: bool = True
    graph_case_id: str = ""

class NBAActionRecord(BaseModel):
    action: str
    route: str
    reason: str

class NextBestActionsDeliverable(BaseModel):
    initial: List[NBAActionRecord]
    final: List[NBAActionRecord]
    what_changed: str

class OfficialCaseAnswer(BaseModel):
    case_id: str
    case: BenchmarkCaseDeliverable
    evidence_requests: List[EvidenceRequestRecord]
    next_best_actions: NextBestActionsDeliverable
    sar: SARRecord
    stop_reason: str
    tool_calls: int
    tokens: int
    latency_s: float
