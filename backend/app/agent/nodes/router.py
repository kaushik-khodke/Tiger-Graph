from typing import Literal
from ..state import InvestigationState

def route_investigation(state: InvestigationState) -> Literal["nba_engine", "evidence_planner", "explanation"]:
    """
    NODE 7: router()
    Conditional branch:
    - If evidence is SUFFICIENT -> advance directly to nba_engine.
    - If evidence is INSUFFICIENT or AMBIGUOUS (and not yet requested) -> route to evidence_planner.
    - Otherwise -> proceed to nba_engine.
    """
    if state.evidence_sufficiency == "SUFFICIENT" or state.has_new_evidence:
        return "nba_engine"
    
    if state.evidence_sufficiency in ("INSUFFICIENT", "AMBIGUOUS"):
        return "evidence_planner"
        
    return "nba_engine"
