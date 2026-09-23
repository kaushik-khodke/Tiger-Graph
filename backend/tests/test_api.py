import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health():
    res = client.get("/health")
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "healthy"

def test_cases_endpoints():
    # List cases
    res = client.get("/api/cases")
    assert res.status_code == 200
    cases = res.json()
    assert len(cases) >= 20
    
    # Case detail
    res = client.get("/api/cases/CASE-10293")
    assert res.status_code == 200
    detail = res.json()
    assert detail["id"] == "CASE-10293"
    assert detail["customer_id"] == "C-123"

def test_graph_endpoints():
    res = client.get("/api/graph/case/CASE-10293")
    assert res.status_code == 200
    graph = res.json()
    assert len(graph["nodes"]) >= 7
    assert len(graph["edges"]) >= 6

def test_evidence_endpoints():
    res = client.get("/api/cases/CASE-10293/evidence")
    assert res.status_code == 200
    ev = res.json()
    assert len(ev) >= 4

def test_benchmark_endpoints():
    res = client.get("/api/benchmark/cases")
    assert res.status_code == 200
    bcases = res.json()
    assert len(bcases) == 20
    
    # Run single case
    res = client.post("/api/benchmark/run/HHG-001")
    assert res.status_code == 200
    ans = res.json()
    assert ans["case_id"] == "HHG-001"
    assert "case" in ans
    assert "sar" in ans
    assert "next_best_actions" in ans

def test_approvals_endpoints():
    res = client.get("/api/approvals")
    assert res.status_code == 200
    apps = res.json()
    assert len(apps) >= 1
