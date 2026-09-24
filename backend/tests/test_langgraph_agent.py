import pytest
from app.agent.graph import investigation_agent
from app.agent.state import InvestigationState

def test_case_10293_golden_flow():
    """
    Executes the golden flow for CASE-10293:
    1. Start investigation.
    2. Runs graph through trigger, planner, tools, evidence, patterns, uncertainty.
    3. Branches to evidence gathering, executes customer validation, reassesses.
    4. Evaluates NBA (BLOCK_CARD) and Policy (requires supervisor approval).
    5. Pauses in AWAITING_APPROVAL state with checkpoint saved.
    6. Resumes via human approval decision -> completes explanation and memory.
    """
    case_id = "CASE-10293"
    events_received = []

    def on_event(ev):
        events_received.append(ev)

    # Initial Run
    state = investigation_agent.run_investigation(
        case_id=case_id,
        initial_data={
            "trigger": {"type": "risk_score", "text": "Flagged transaction $259.98 on shared device D-77"},
            "transaction": {"id": "TXN-10293", "amount": 259.98, "customer_id": "C-123"},
            "customer": {"id": "C-123"},
            "card": {"id": "CARD-9011"}
        },
        on_event=on_event
    )

    # Check paused state
    assert state is not None
    assert state.case_id == case_id
    assert state.status == "AWAITING_APPROVAL"
    assert state.approval_required is True
    assert state.approval_id is not None
    assert len(state.evidence) > 0

    # Verify checkpoint exists
    checkpoint = investigation_agent.get_state(case_id)
    assert checkpoint is not None
    assert checkpoint.status == "AWAITING_APPROVAL"

    # Human-in-the-loop: Resume with approval
    final_state = investigation_agent.resume_with_approval(
        case_id=case_id,
        decision="APPROVED",
        notes="Supervisor approved card freeze after out-of-band customer denial",
        on_event=on_event
    )

    assert final_state is not None
    assert final_state.approval_status == "APPROVED"
    assert final_state.status in ("ACTION_TAKEN", "RESOLVED")
    assert final_state.explanation is not None

    # Check that events were emitted across the lifecycle
    event_names = [e.get("event") for e in events_received]
    assert "investigation_started" in event_names
    assert "awaiting_approval" in event_names
    assert "case_resolved" in event_names
