import os
from pathlib import Path
from pydantic import BaseModel

WORKSPACE_ROOT = Path(__file__).resolve().parent.parent.parent

class Settings(BaseModel):
    APP_NAME: str = "Sentinel AI API"
    APP_ENV: str = os.getenv("APP_ENV", "development")
    API_HOST: str = os.getenv("API_HOST", "0.0.0.0")
    API_PORT: int = int(os.getenv("API_PORT", "8001"))
    FRONTEND_ORIGIN: str = os.getenv("FRONTEND_ORIGIN", "http://localhost:3001")
    
    # Dataset files
    DATASET_DIR: Path = WORKSPACE_ROOT
    CASE_PACK_CSV: Path = WORKSPACE_ROOT / "case_pack.csv"
    CLOSED_CASES_CSV: Path = WORKSPACE_ROOT / "closed_cases_history.csv"
    TRANSACTIONS_CSV: Path = WORKSPACE_ROOT / "transactions.csv"
    IDENTITY_CSV: Path = WORKSPACE_ROOT / "identity.csv"
    CASES_OUTPUT_DIR: Path = WORKSPACE_ROOT / "cases"

    # TigerGraph & MCP Config
    TIGERGRAPH_HOST: str = os.getenv("TIGERGRAPH_HOST", "http://localhost:9000")
    TIGERGRAPH_GRAPH: str = os.getenv("TIGERGRAPH_GRAPH", "FraudGraph")
    TIGERGRAPH_USERNAME: str = os.getenv("TIGERGRAPH_USERNAME", "tigergraph")
    TIGERGRAPH_PASSWORD: str = os.getenv("TIGERGRAPH_PASSWORD", "tigergraph")
    MCP_SERVER_URL: str = os.getenv("MCP_SERVER_URL", "")

    DEMO_MODE: bool = os.getenv("DEMO_MODE", "false").lower() == "true"

settings = Settings()
