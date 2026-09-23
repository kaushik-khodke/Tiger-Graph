from typing import List, Optional
from pydantic import BaseModel

class ProvenanceInfo(BaseModel):
    tool: str
    query: str
    retrieved_at: str
    entity_ids: List[str]

class EvidenceItem(BaseModel):
    id: str
    type: str
    title: str
    description: str
    source: str
    strength: str
    tone: str  # support | contradict | context
    entities: str
    pattern: Optional[str] = None
    time: Optional[str] = None
    provenance: Optional[ProvenanceInfo] = None

class EvidenceRequestPayload(BaseModel):
    action_type: str = "customer_validation"
    target_entity: Optional[str] = None
    question: Optional[str] = None
