import os
import logging
from typing import Optional, Dict, Any
from ..config import settings

logger = logging.getLogger("sentinel.observability")

class LangfuseManager:
    def __init__(self):
        self._client = None
        self._is_available = False
        self._init_client()

    def _init_client(self):
        pub_key = settings.LANGFUSE_PUBLIC_KEY
        sec_key = settings.LANGFUSE_SECRET_KEY
        host = settings.LANGFUSE_BASE_URL

        if not (pub_key and sec_key):
            logger.info("Langfuse credentials not configured. Tracing will run in mock/silent mode.")
            self._is_available = False
            return

        try:
            from langfuse import Langfuse
            self._client = Langfuse(
                public_key=pub_key,
                secret_key=sec_key,
                host=host
            )
            self._is_available = True
            logger.info(f"Langfuse observability initialized successfully (env: {settings.LANGFUSE_TRACING_ENVIRONMENT})")
        except Exception as exc:
            logger.warning(f"Langfuse tracing unavailable: {exc}. Agent will continue execution normally.")
            self._is_available = False

    @property
    def is_available(self) -> bool:
        return self._is_available

    def get_client(self):
        return self._client

    def get_langchain_callback(
        self,
        case_id: Optional[str] = None,
        trace_name: str = "fraud-investigation",
        metadata: Optional[Dict[str, Any]] = None,
        tags: Optional[list] = None
    ):
        """
        Returns Langfuse CallbackHandler for LangGraph / LangChain execution.
        Falls back to None if Langfuse is unavailable, preventing agent failure.
        """
        if not self._is_available:
            return None

        try:
            # Check for current langfuse.langchain or langfuse.callback
            try:
                from langfuse.langchain import CallbackHandler
            except ImportError:
                from langfuse.callback import CallbackHandler

            meta = {
                "environment": settings.LANGFUSE_TRACING_ENVIRONMENT,
                "agent_version": "2.0.0",
                "graph_version": "10-stage-langgraph",
                **(metadata or {})
            }
            if case_id:
                meta["case_id"] = case_id

            all_tags = ["hhgoa", "fraud-investigation", settings.LANGFUSE_TRACING_ENVIRONMENT]
            if tags:
                all_tags.extend(tags)

            handler = CallbackHandler(
                public_key=settings.LANGFUSE_PUBLIC_KEY,
                secret_key=settings.LANGFUSE_SECRET_KEY,
                host=settings.LANGFUSE_BASE_URL,
                session_id=case_id or "session-default",
                trace_name=trace_name,
                metadata=meta,
                tags=all_tags
            )
            return handler
        except Exception as exc:
            logger.warning(f"Could not initialize Langfuse callback handler: {exc}")
            return None

    def flush(self):
        """Flushes telemetry buffers before shutdown or test completion."""
        if self._client and self._is_available:
            try:
                self._client.flush()
            except Exception as exc:
                logger.warning(f"Error flushing Langfuse telemetry: {exc}")

langfuse_manager = LangfuseManager()
