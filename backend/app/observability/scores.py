import logging
from typing import Dict, Any, Optional
from .langfuse import langfuse_manager

logger = logging.getLogger("sentinel.scores")

EVALUATION_METRICS = [
    "investigation_accuracy",
    "evidence_relevance",
    "nba_quality",
    "uncertainty_quality",
    "evidence_request_quality",
    "explanation_grounding",
    "policy_compliance",
    "case_completeness"
]

def record_evaluation_score(
    case_id: str,
    metric_name: str,
    value: float,
    comment: Optional[str] = None
):
    """
    Records a deterministic or benchmark score against a Langfuse trace.
    Value should be between 0.0 and 1.0 or standard 1-100 scale.
    """
    client = langfuse_manager.get_client()
    if not (client and langfuse_manager.is_available):
        return

    try:
        client.score(
            trace_id=f"trace-{case_id}",
            name=metric_name,
            value=value,
            comment=comment
        )
    except Exception as exc:
        logger.debug(f"Error submitting score {metric_name} for {case_id}: {exc}")

def record_benchmark_scores(case_id: str, benchmark_id: str, scores: Dict[str, float]):
    """Batch records custom benchmark evaluation scores."""
    for metric, val in scores.items():
        record_evaluation_score(case_id, metric, val, comment=f"Benchmark case {benchmark_id}")

def calculate_investigation_score(
    ground_truth: str,
    predicted_verdict: str,
    evidence_count: int,
    confidence: int
) -> float:
    """Computes composite evaluation score for an investigation."""
    match = 0.5 if ground_truth.lower() == predicted_verdict.lower() else 0.0
    ev_score = min(0.3, evidence_count * 0.1)
    conf_score = min(0.2, (confidence / 100.0) * 0.2)
    return round(match + ev_score + conf_score, 2)

