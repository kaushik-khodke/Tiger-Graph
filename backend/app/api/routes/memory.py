from typing import List, Dict, Any, Optional
from fastapi import APIRouter, Query
from ...services.memory_service import memory_service

router = APIRouter(prefix="/memory", tags=["Case Memory"])

@router.get("/similar/{case_id}")
def get_similar_cases(case_id: str, limit: int = Query(4)):
    return memory_service.find_similar(case_id=case_id, limit=limit)

@router.get("/cases")
def list_memory_cases(pattern: Optional[str] = Query(None), limit: int = Query(10)):
    return memory_service.find_similar(case_id="ALL", pattern=pattern, limit=limit)
