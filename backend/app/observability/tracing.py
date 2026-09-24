import time
import logging
from typing import Optional, Dict, Any
from .langfuse import langfuse_manager

logger = logging.getLogger("sentinel.tracing")

class InvestigationTracer:
    def __init__(self):
        self._in_memory_traces: Dict[str, Dict[str, Any]] = {}

    def get_case_trace(self, case_id: str) -> Optional[Dict[str, Any]]:
        return self._in_memory_traces.get(case_id)

    def record_node_execution(
        self,
        case_id: str,
        node_name: str,
        inputs: Any,
        outputs: Any,
        duration_ms: float,
        model_name: Optional[str] = None,
        status: str = "success"
    ):
        """Records node observation locally and forwards to Langfuse when online."""
        if case_id not in self._in_memory_traces:
            self._in_memory_traces[case_id] = {
                "case_id": case_id,
                "start_time": time.time(),
                "nodes": [],
                "tool_calls": [],
                "fallbacks": []
            }

        node_event = {
            "node": node_name,
            "status": status,
            "duration_ms": duration_ms,
            "model": model_name,
            "timestamp": time.time()
        }
        self._in_memory_traces[case_id]["nodes"].append(node_event)

        # Forward span to Langfuse if available
        client = langfuse_manager.get_client()
        if client and langfuse_manager.is_available:
            try:
                trace = client.trace(
                    name="fraud-investigation",
                    id=f"trace-{case_id}",
                    metadata={"case_id": case_id}
                )
                trace.span(
                    name=node_name,
                    input=inputs,
                    output=outputs,
                    metadata={"duration_ms": duration_ms, "model": model_name, "status": status}
                )
            except Exception as exc:
                logger.debug(f"Langfuse span error for {node_name}: {exc}")

    def record_tool_call(
        self,
        case_id: str,
        tool_name: str,
        query: str,
        result: Any,
        duration_ms: float
    ):
        """Records TigerGraph / Graph tool execution observation."""
        if case_id in self._in_memory_traces:
            self._in_memory_traces[case_id]["tool_calls"].append({
                "tool": tool_name,
                "query": query,
                "duration_ms": duration_ms,
                "timestamp": time.time()
            })

        client = langfuse_manager.get_client()
        if client and langfuse_manager.is_available:
            try:
                trace = client.trace(
                    name="fraud-investigation",
                    id=f"trace-{case_id}",
                    metadata={"case_id": case_id}
                )
                trace.span(
                    name=f"tool:{tool_name}",
                    input={"query": query},
                    output=result,
                    metadata={"duration_ms": duration_ms, "tool": tool_name}
                )
            except Exception as exc:
                logger.debug(f"Langfuse tool span error for {tool_name}: {exc}")

    def record_fallback_event(
        self,
        case_id: str,
        previous_model: str,
        selected_model: str,
        reason: str,
        retry_count: int
    ):
        """Records model fallback occurrence in Langfuse and memory."""
        if case_id in self._in_memory_traces:
            self._in_memory_traces[case_id]["fallbacks"].append({
                "previous_model": previous_model,
                "selected_model": selected_model,
                "reason": reason,
                "retry_count": retry_count,
                "timestamp": time.time()
            })

        client = langfuse_manager.get_client()
        if client and langfuse_manager.is_available:
            try:
                trace = client.trace(
                    name="fraud-investigation",
                    id=f"trace-{case_id}",
                    metadata={"case_id": case_id}
                )
                trace.event(
                    name="model_fallback",
                    metadata={
                        "previous_model": previous_model,
                        "selected_model": selected_model,
                        "fallback_trigger": reason,
                        "retry_count": retry_count
                    }
                )
            except Exception as exc:
                logger.debug(f"Langfuse fallback event error: {exc}")

investigation_tracer = InvestigationTracer()
