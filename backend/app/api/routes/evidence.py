from typing import List, Optional
from fastapi import APIRouter, HTTPException
from ...schemas.evidence import EvidenceItem, EvidenceRequestPayload
from ...services.data_service import data_service

router = APIRouter(tags=["Evidence"])

@router.get("/cases/{case_id}/evidence", response_model=List[EvidenceItem])
def get_case_evidence(case_id: str):
    ev = data_service.get_evidence(case_id)
    return ev

@router.post("/cases/{case_id}/evidence/request")
def request_evidence(case_id: str, payload: Optional[EvidenceRequestPayload] = None):
    act_type = payload.action_type if payload else "customer_validation"
    try:
        res = data_service.request_evidence(case_id, action_type=act_type)
        return res
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
