from typing import Optional, Dict, Any
from pydantic import BaseModel

class AuditLogItem(BaseModel):
    timestamp: str
    case_id: str
    actor: str
    event: str
    tool_action: str
    result: str
    metadata: Optional[Dict[str, Any]] = None
