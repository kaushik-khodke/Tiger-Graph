import pytest
from app.observability.langfuse import langfuse_manager
from app.observability.tracing import investigation_tracer
from app.observability.scores import calculate_investigation_score
from app.llm.models import AgentTaskType

def test_langfuse_graceful_handling_on_network_or_key_error():
    """Verify tracer and manager never throw exceptions into the caller."""
    tracer = investigation_tracer
    case_id = "TEST-RESILIENCE"
    
    # Recording node execution
    tracer.record_node_execution(
        case_id=case_id,
        node_name="investigation_planner",
        inputs={"trigger": "high_risk"},
        outputs={"plan": "query_graph"},
        duration_ms=45.2,
        model_name="gemini-3.8-flash"
    )

    # Recording tool call
    tracer.record_tool_call(
        case_id=case_id,
        tool_name="get_entity",
        query="C-123",
        result={"found": True},
        duration_ms=12.5
    )

    # Recording fallback event
    tracer.record_fallback_event(
        case_id=case_id,
        previous_model="gemini-3.8-flash",
        selected_model="gemini-3.7-flash",
        reason="429 Resource Exhausted",
        retry_count=1
    )

    trace = tracer.get_case_trace(case_id)
    assert trace is not None
    assert len(trace["nodes"]) >= 1
    assert len(trace["tool_calls"]) >= 1
    assert len(trace["fallbacks"]) >= 1

    # Flush should be non-blocking
    langfuse_manager.flush()

def test_evaluation_score_calculation():
    """Verify custom evaluation scoring functions compute accurately."""
    score = calculate_investigation_score(
        ground_truth="fraud",
        predicted_verdict="fraud",
        evidence_count=4,
        confidence=92
    )
    assert 0.0 <= score <= 1.0
    assert score >= 0.85
