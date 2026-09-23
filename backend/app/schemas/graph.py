from typing import List, Optional, Tuple, Dict, Any
from pydantic import BaseModel

class GraphNode(BaseModel):
    id: str
    label: str
    sub: str
    kind: str  # customer | device | transaction | account | merchant | case | card | region
    x: float
    y: float
    meta: Optional[Dict[str, Any]] = None

class GraphData(BaseModel):
    nodes: List[GraphNode]
    edges: List[Tuple[str, str]]
    case_id: str
    entity_count: int
    relationship_count: int
