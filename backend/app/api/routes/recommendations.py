from fastapi import APIRouter, HTTPException
from ...schemas.recommendation import RecommendationResponse
from ...services.data_service import data_service

router = APIRouter(prefix="/cases", tags=["Recommendations"])

@router.get("/{case_id}/recommendations", response_model=RecommendationResponse)
def get_recommendations(case_id: str):
    c = data_service.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    
    snap = data_service.get_recommendation_snapshot(case_id)
    raw = data_service._cases.get(case_id, {})
    return RecommendationResponse(
        case_id=case_id,
        snapshot=snap,
        reassessed=raw.get("evidence_received", False)
    )
