from typing import List, Optional
from fastapi import APIRouter, HTTPException, Query
from ...schemas.case import CaseListItem, CaseDetail, CaseMetrics
from ...services.data_service import data_service

router = APIRouter(prefix="/cases", tags=["Cases"])

@router.get("", response_model=List[CaseListItem])
def list_cases(
    status: Optional[str] = Query(None, description="Filter by status (Active, Awaiting Approval, etc.)"),
    search: Optional[str] = Query(None, description="Search query")
):
    return data_service.list_cases(status=status, search=search)

@router.get("/metrics", response_model=CaseMetrics)
def get_metrics():
    return data_service.get_metrics()

@router.get("/{case_id}", response_model=CaseDetail)
def get_case_detail(case_id: str):
    c = data_service.get_case(case_id)
    if not c:
        raise HTTPException(status_code=404, detail=f"Case {case_id} not found")
    return c
