import os
from pathlib import Path
from typing import List, Optional
from pydantic import BaseModel

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent
BACKEND_ROOT = WORKSPACE_ROOT / "backend"

# Manually load .env if python-dotenv is not installed or as a fallback
def _load_env_file(env_path: Path):
    if env_path.is_file():
        try:
            with open(env_path, "r", encoding="utf-8") as f:
                for line in f:
                    line = line.strip()
                    if not line or line.startswith("#") or "=" not in line:
                        continue
                    k, v = line.split("=", 1)
                    k = k.strip()
                    v = v.strip().strip("'\"")
                    if k and k not in os.environ:
                        os.environ[k] = v
        except Exception:
            pass

_load_env_file(BACKEND_ROOT / ".env")
_load_env_file(WORKSPACE_ROOT / ".env")

def _resolve_data_path(filename: str, default_dir: Path) -> Path:
    custom_dir = os.getenv("DATASET_DIR")
    if custom_dir:
        p = Path(custom_dir) / filename
        if p.exists():
            return p
    default_path = default_dir / filename
    if default_path.exists():
        return default_path
    for base in [WORKSPACE_ROOT, BACKEND_ROOT, Path.cwd(), Path.cwd().parent]:
        candidate = base / filename
        if candidate.exists():
            return candidate
    return default_path

class Settings(BaseModel):
    APP_NAME: str = "Sentinel AI API"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("PORT", os.getenv("API_PORT", "8001")))
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3000")
    
    # Dataset files
    DATASET_DIR: Path = Path(os.getenv("DATASET_DIR", str(WORKSPACE_ROOT)))
    CASE_PACK_CSV: Path = _resolve_data_path("case_pack.csv", WORKSPACE_ROOT)
    CLOSED_CASES_CSV: Path = _resolve_data_path("closed_cases_history.csv", WORKSPACE_ROOT)
    TRANSACTIONS_CSV: Path = _resolve_data_path("transactions.csv", WORKSPACE_ROOT)
    IDENTITY_CSV: Path = _resolve_data_path("identity.csv", WORKSPACE_ROOT)
    CASES_OUTPUT_DIR: Path = _resolve_data_path("cases", WORKSPACE_ROOT)

    # Gemini LLM Config
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", os.getenv("GEMINI_API_KEY", ""))
    GEMINI_MODEL_PRIORITY: str = os.getenv(
        "GEMINI_MODEL_PRIORITY",
        "gemini-2.5-flash,gemini-2.0-flash,gemini-1.5-flash,gemini-1.5-pro,gemini-3.8-flash,gemini-3.5-flash-lite"
    )
    GEMINI_25_API_KEY: str = os.getenv("GEMINI_25_API_KEY", "")
    GEMINI_20_API_KEY: str = os.getenv("GEMINI_20_API_KEY", "")
    GEMINI_38_API_KEY: str = os.getenv("GEMINI_38_API_KEY", "")
    GEMINI_37_API_KEY: str = os.getenv("GEMINI_37_API_KEY", "")
    GEMINI_36_API_KEY: str = os.getenv("GEMINI_36_API_KEY", "")
    GEMINI_35_API_KEY: str = os.getenv("GEMINI_35_API_KEY", "")
    GEMINI_35_LITE_API_KEY: str = os.getenv("GEMINI_35_LITE_API_KEY", "")

    # Langfuse Observability Config
    LANGFUSE_PUBLIC_KEY: str = os.getenv("LANGFUSE_PUBLIC_KEY", "")
    LANGFUSE_SECRET_KEY: str = os.getenv("LANGFUSE_SECRET_KEY", "")
    LANGFUSE_BASE_URL: str = os.getenv("LANGFUSE_BASE_URL", "https://cloud.langfuse.com")
    LANGFUSE_TRACING_ENVIRONMENT: str = os.getenv("LANGFUSE_TRACING_ENVIRONMENT", "development")

    # TigerGraph & MCP Config
    TIGERGRAPH_HOST: str = os.getenv("TIGERGRAPH_HOST", "http://localhost:9000")
    TIGERGRAPH_GRAPH: str = os.getenv("TIGERGRAPH_GRAPH", "FraudGraph")
    TIGERGRAPH_USERNAME: str = os.getenv("TIGERGRAPH_USERNAME", "tigergraph")
    TIGERGRAPH_PASSWORD: str = os.getenv("TIGERGRAPH_PASSWORD", "tigergraph")
    TIGERGRAPH_SECRET: str = os.getenv("TIGERGRAPH_SECRET", "")
    MCP_SERVER_URL: str = os.getenv("MCP_SERVER_URL", "")

    # Feature Toggles
    CASE_MEMORY_ENABLED: bool = os.getenv("CASE_MEMORY_ENABLED", "true").lower() == "true"
    GRAPHRAG_ENABLED: bool = os.getenv("GRAPHRAG_ENABLED", "true").lower() == "true"
    AUDIT_ENABLED: bool = os.getenv("AUDIT_ENABLED", "true").lower() == "true"
    DEMO_MODE: bool = os.getenv("DEMO_MODE", "false").lower() == "true"

    def get_model_priority_list(self) -> List[str]:
        return [m.strip() for m in self.GEMINI_MODEL_PRIORITY.split(",") if m.strip()]

    def get_gemini_api_key(self, model_name: str) -> str:
        """Returns model-specific API key if configured, otherwise global GOOGLE_API_KEY."""
        normalized = model_name.lower().replace("-", "_").replace(".", "")
        if "25" in normalized and self.GEMINI_25_API_KEY:
            return self.GEMINI_25_API_KEY
        if "20" in normalized and self.GEMINI_20_API_KEY:
            return self.GEMINI_20_API_KEY
        if "38" in normalized and self.GEMINI_38_API_KEY:
            return self.GEMINI_38_API_KEY
        if "37" in normalized and self.GEMINI_37_API_KEY:
            return self.GEMINI_37_API_KEY
        if "36" in normalized and self.GEMINI_36_API_KEY:
            return self.GEMINI_36_API_KEY
        if "35_lite" in normalized or "flash_lite" in normalized:
            if self.GEMINI_35_LITE_API_KEY:
                return self.GEMINI_35_LITE_API_KEY
        if "35" in normalized and self.GEMINI_35_API_KEY:
            return self.GEMINI_35_API_KEY
        return self.GOOGLE_API_KEY

settings = Settings()
