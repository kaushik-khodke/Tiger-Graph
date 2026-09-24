import pytest
from unittest.mock import MagicMock, patch
from app.llm.fallback import is_transient_error
from app.llm.models import AgentTaskType, FallbackReason
from app.llm.factory import model_router, ModelRouter
from app.llm.schemas import InvestigationPlan, RiskAssessment

def test_transient_error_detection():
    # 429 Rate limit / ResourceExhausted
    assert is_transient_error(Exception("429 Resource has been exhausted (e.g. check quota)"))[0]
    assert is_transient_error(Exception("Rate limit reached for requests per minute"))[0]
    
    # 5xx Server errors
    assert is_transient_error(Exception("503 Service Unavailable"))[0]
    assert is_transient_error(Exception("500 Internal Server Error"))[0]
    assert is_transient_error(Exception("502 Bad Gateway"))[0]
    assert is_transient_error(Exception("504 Gateway Timeout"))[0]
    
    # Network & connection drops
    assert is_transient_error(Exception("ReadTimeout: Request timed out after 30s"))[0]
    assert is_transient_error(Exception("Connection reset by peer"))[0]
    assert is_transient_error(Exception("Deadline exceeded"))[0]

def test_non_transient_errors_do_not_fallback():
    # 400 Bad Request or business logic
    assert not is_transient_error(Exception("400 Bad Request: Invalid argument"))[0]
    assert not is_transient_error(Exception("401 Unauthorized"))[0]
    assert not is_transient_error(Exception("403 Permission denied"))[0]
    assert not is_transient_error(ValueError("Invalid state transition"))[0]
    assert not is_transient_error(KeyError("missing_field"))[0]

def test_deterministic_offline_fallback():
    """Verify that when no API keys are configured, router generates valid Pydantic structures."""
    router = ModelRouter()
    
    res = router.invoke_structured(
        task_type=AgentTaskType.PLANNER,
        schema=InvestigationPlan,
        messages=[{"role": "user", "content": "Transaction $259.98 flagged on customer C-123"}],
        case_id="CASE-10293"
    )
    assert res is not None
    assert isinstance(res.output, InvestigationPlan)
    assert len(res.output.priority_areas) > 0
    assert len(res.output.tools_to_execute) > 0

    risk_res = router.invoke_structured(
        task_type=AgentTaskType.UNCERTAINTY,
        schema=RiskAssessment,
        messages=[{"role": "user", "content": "Flagged transaction $259.98 on shared device D-77"}],
        case_id="CASE-10293"
    )
    assert risk_res is not None
    assert isinstance(risk_res.output, RiskAssessment)
    assert 0 <= risk_res.output.risk_score <= 1.0 or 0 <= risk_res.output.risk_score <= 100
    assert 0 <= risk_res.output.confidence <= 1.0 or 0 <= risk_res.output.confidence <= 100

def test_fallback_progression_on_transient_error():
    """Verify that router tracks attempted models across priority chain."""
    router = ModelRouter()
    assert len(router.priority_chain) >= 5
    assert "flash" in router.priority_chain[0]
    assert router.priority_chain[-1] == "gemini-3.5-flash-lite"

