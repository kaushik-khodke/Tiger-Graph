from enum import Enum
from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class AgentTaskType(str, Enum):
    PLANNER = "planner"
    INVESTIGATOR = "investigator"
    EVIDENCE_ANALYZER = "evidence_analyzer"
    PATTERN_ANALYZER = "pattern_analyzer"
    UNCERTAINTY = "uncertainty"
    EVIDENCE_PLANNER = "evidence_planner"
    NBA = "nba"
    EXPLANATION = "explanation"
    LITE_FALLBACK = "lite_fallback"

class FallbackReason(str, Enum):
    RATE_LIMIT = "rate_limit"
    SERVER_ERROR = "server_error"
    TIMEOUT = "timeout"
    CONNECTION_RESET = "connection_reset"
    SCHEMA_RETRY_EXHAUSTED = "schema_retry_exhausted"

TASK_THINKING_LEVELS: Dict[AgentTaskType, str] = {
    AgentTaskType.PLANNER: "medium",
    AgentTaskType.INVESTIGATOR: "medium",
    AgentTaskType.EVIDENCE_ANALYZER: "medium",
    AgentTaskType.PATTERN_ANALYZER: "high",
    AgentTaskType.UNCERTAINTY: "medium",
    AgentTaskType.EVIDENCE_PLANNER: "high",
    AgentTaskType.NBA: "high",
    AgentTaskType.EXPLANATION: "medium",
    AgentTaskType.LITE_FALLBACK: "low",
}

class ModelAttempt(BaseModel):
    model_name: str
    task_type: str
    status: str # "success" | "retryable_failure" | "non_retryable_failure"
    duration_ms: float = 0.0
    error_message: Optional[str] = None
    fallback_reason: Optional[str] = None

class FallbackEvent(BaseModel):
    case_id: Optional[str] = None
    task_type: str
    previous_model: str
    selected_model: str
    fallback_trigger: str
    retry_count: int

class ModelInvocationResult(BaseModel):
    output: Any
    selected_model: str
    attempted_models: List[str] = Field(default_factory=list)
    fallback_reason: Optional[str] = None
    attempt_count: int = 1
    duration_ms: float = 0.0
    attempts: List[ModelAttempt] = Field(default_factory=list)
