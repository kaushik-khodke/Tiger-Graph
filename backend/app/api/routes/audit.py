from typing import List, Optional
from fastapi import APIRouter, Query
from ...schemas.audit import AuditLogItem
from ...services.audit_service import audit_service

router = APIRouter(tags=["Audit"])

@router.get("/audit", response_model=List[AuditLogItem])
def get_global_audit(limit: int = Query(50)):
    return audit_service.get_events(limit=limit)

@router.get("/cases/{case_id}/audit", response_model=List[AuditLogItem])
def get_case_audit(case_id: str, limit: int = Query(50)):
    return audit_service.get_events(case_id=case_id, limit=limit)
