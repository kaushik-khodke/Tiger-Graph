from typing import List, Optional
from fastapi import APIRouter, HTTPException
from ...schemas.benchmark import BenchmarkCaseItem, BenchmarkSummary, OfficialCaseAnswer
from ...services.benchmark_service import benchmark_service

router = APIRouter(prefix="/benchmark", tags=["Benchmark"])

@router.get("/cases", response_model=List[BenchmarkCaseItem])
def list_benchmark_cases():
    return benchmark_service.list_benchmark_cases()

@router.post("/run/{case_id}", response_model=OfficialCaseAnswer)
def run_benchmark_case(case_id: str):
    try:
        return benchmark_service.run_case(case_id)
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/run-all", response_model=BenchmarkSummary)
def run_all_cases():
    return benchmark_service.run_all()

@router.get("/status", response_model=BenchmarkSummary)
def get_benchmark_status():
    return benchmark_service.get_summary()

@router.get("/output/{case_id}", response_model=OfficialCaseAnswer)
def get_case_output(case_id: str):
    ans = benchmark_service.get_answer(case_id)
    if not ans:
        # Generate on demand
        try:
            return benchmark_service.run_case(case_id)
        except ValueError as e:
            raise HTTPException(status_code=404, detail=str(e))
    return ans
