import os
import sys
import time
from .langfuse import langfuse_manager
from ..llm.factory import model_router
from ..llm.models import AgentTaskType
from ..llm.schemas import RiskAssessment
from .tracing import investigation_tracer
from .scores import record_evaluation_score

def run_test():
    print("==================================================")
    print("Sentinel AI — Langfuse Observability Diagnostic")
    print("==================================================")

    # 1. Initialize Langfuse
    print("\n[Step 1] Initializing Langfuse Manager...")
    if not langfuse_manager.is_available:
        print("[Notice] Langfuse keys not configured or remote unavailable.")
        print("Traces will be managed via internal safe non-blocking tracer.")
    else:
        print("[Success] Langfuse remote connection active.")

    # 2. Verify Auth / Ping
    client = langfuse_manager.get_client()
    if client and langfuse_manager.is_available:
        try:
            print("[Step 2] Verifying Langfuse API credentials...")
            client.auth_check()
            print("[Success] Langfuse authentication verified!")
        except Exception as exc:
            print(f"[Warning] Langfuse auth check warning: {exc}")

    # 3. Produce Test Trace & Nested Observations
    test_case_id = f"TEST-TRACE-{int(time.time())}"
    print(f"\n[Step 3] Creating test investigation trace for {test_case_id}...")
    
    investigation_tracer.record_node_execution(
        case_id=test_case_id,
        node_name="investigation_planner",
        inputs={"trigger": "Risk score > 0.85"},
        outputs={"plan": "Execute graph queries"},
        duration_ms=45.0,
        model_name="gemini-3.8-flash"
    )

    investigation_tracer.record_tool_call(
        case_id=test_case_id,
        tool_name="get_device_relationships",
        query="query:get_neighbors(D-77)",
        result={"connected": ["C-123", "C-811"]},
        duration_ms=18.0
    )

    # 4. Run Model Call with Structured Output
    print("\n[Step 4] Running structured risk assessment through ModelRouter...")
    result = model_router.invoke_structured(
        task_type=AgentTaskType.UNCERTAINTY,
        schema=RiskAssessment,
        messages=[{"role": "user", "content": "Assess risk for transaction with shared device"}],
        case_id=test_case_id,
        context_data={"case_id": test_case_id, "amount": 259.98}
    )
    print(f"[Model Result] Selected model: {result.selected_model}")
    print(f"[Model Result] Risk score: {result.output.risk_score}, Level: {result.output.risk_level}, Sufficiency: {result.output.evidence_sufficiency}")

    # 5. Submit Evaluation Scores
    print("\n[Step 5] Recording custom evaluation scores...")
    record_evaluation_score(test_case_id, "investigation_accuracy", 0.95, "Test diagnostic check")
    record_evaluation_score(test_case_id, "nba_quality", 0.92, "High quality next-best-action")

    # 6. Flush Telemetry
    print("\n[Step 6] Flushing Langfuse telemetry buffer...")
    langfuse_manager.flush()
    print("[Success] Telemetry successfully dispatched.")
    print("\n==================================================")
    print("Observability Diagnostic Test Complete!")
    print("==================================================")

if __name__ == "__main__":
    run_test()
