from typing import List, Optional
from pydantic import BaseModel
from .case import NextBestAction, RecommendationSnapshot

class RecommendationResponse(BaseModel):
    case_id: str
    snapshot: RecommendationSnapshot
    reassessed: bool
