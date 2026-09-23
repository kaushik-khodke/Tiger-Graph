import pytest
from app.services.data_service import data_service
from app.services.graph_service import graph_service
from app.services.approval_service import approval_service
from app.services.audit_service import audit_service
from app.schemas.approval import ApprovalActionPayload

def test_golden_case_10293():
    # 1. Load case
    case_detail = data_service.get_case("CASE-10293")
    assert case_detail is not None
    assert case_detail.id == "CASE-10293"
    assert case_detail.customer_id == "C-123"
    assert case_detail.amount == 259.98
    
    # Initial state assertions
    assert case_detail.uncertainty.risk_score == 62 or case_detail.uncertainty.risk_score == 87
    assert case_detail.uncertainty.evidence_sufficiency == "INSUFFICIENT"
    assert len(case_detail.recommendation.initial) > 0
    assert case_detail.recommendation.initial[0].action == "VERIFY_WITH_CUSTOMER"
    
    # 2. Graph assertions
    graph = graph_service.get_case_graph("CASE-10293")
    assert graph.entity_count >= 7
    node_ids = [n.id for n in graph.nodes]
    assert "C-123" in node_ids
    assert "D-77" in node_ids
    assert "C-811" in node_ids
    assert "TXN-10293" in node_ids
    assert "CASE-103" in node_ids
    
    # 3. Request evidence (Customer validation)
    res = data_service.request_evidence("CASE-10293", action_type="customer_validation")
    assert res["status"] == "received"
    assert res["updated_fraud_probability"] == 0.94
    assert res["updated_status"] == "AWAITING_APPROVAL"
    
    # 4. Post-evidence reassessment assertions
    updated_case = data_service.get_case("CASE-10293")
    assert updated_case.uncertainty.evidence_sufficiency == "SUFFICIENT"
    assert updated_case.uncertainty.risk_score == 94
    assert updated_case.uncertainty.confidence == 91
    
    final_actions = [a.action for a in updated_case.recommendation.final]
    assert "BLOCK_CARD" in final_actions
    assert "CREATE_CASE" in final_actions
    assert "FILE_REPORT" in final_actions
    
    # 5. Create approval and approve
    approval = approval_service.create_approval(
        case_id="CASE-10293",
        action="BLOCK_CARD",
        route="L1",
        exposure_usd=259.98,
        risk=94,
        confidence=91,
        notes="Customer confirmed transaction was unauthorized."
    )
    assert approval.status == "PENDING"
    
    # Supervisor approves
    approved = approval_service.decide(approval.id, ApprovalActionPayload(decision="approve", reviewer="Alex Kim"))
    assert approved.status == "APPROVED"
    
    # 6. Audit assertions
    events = audit_service.get_events(case_id="CASE-10293")
    assert len(events) >= 5
    print("\n[TEST SUCCESS] Golden Case 10293 end-to-end verified!")

if __name__ == "__main__":
    test_golden_case_10293()
