import pytest
from app.agent.policy_engine import policy_engine

def test_rule_r1_low_exposure_auto_approve():
    """R1: Low risk or small exposure below threshold allows auto execution."""
    actions = policy_engine.evaluate_pre_evidence(
        trigger_type="risk_score",
        fraud_prob=0.15,
        exposure_usd=45.0,
        pattern="none",
        is_single_signal=False
    )
    assert len(actions) > 0
    assert actions[0].action == "MONITOR_CARD"
    assert actions[0].route == "auto"

def test_rule_r5_single_signal_verify_with_customer():
    """R5: Single signal uncertainty requires out-of-band verification before hard action."""
    actions = policy_engine.evaluate_pre_evidence(
        trigger_type="velocity_anomaly",
        fraud_prob=0.65,
        exposure_usd=259.98,
        pattern="velocity",
        is_single_signal=True
    )
    assert len(actions) > 0
    assert actions[0].action == "VERIFY_WITH_CUSTOMER"

def test_rule_r2_r6_post_evidence_customer_denied():
    """R2 & R6: Cardholder denial elevates to fraud, triggers BLOCK_CARD and SAR check."""
    actions = policy_engine.evaluate_post_evidence(
        customer_response="denied",
        exposure_usd=1250.00,
        has_shared_origin=False,
        pattern="device_spoofing"
    )
    action_names = [a.action for a in actions]
    assert "BLOCK_CARD" in action_names
    assert "FILE_REPORT" in action_names

def test_rule_r4_shared_origin_block_all_cards():
    """R4: Multi-account device compromise triggers account-level freeze."""
    actions = policy_engine.evaluate_post_evidence(
        customer_response="denied",
        exposure_usd=3500.00,
        has_shared_origin=True,
        pattern="shared_device_ring",
        connected_cards=["CARD-A", "CARD-B"]
    )
    action_names = [a.action for a in actions]
    assert "BLOCK_ALL_CARDS" in action_names
    # Over $2500 requires L2 approval
    l2_actions = [a for a in actions if a.route == "L2"]
    assert len(l2_actions) > 0

def test_rule_r3_customer_confirmed_legitimate():
    """R3: Cardholder recognizes charge; close as legitimate without penalty."""
    actions = policy_engine.evaluate_post_evidence(
        customer_response="confirmed",
        exposure_usd=500.00,
        has_shared_origin=False
    )
    assert len(actions) > 0
    assert actions[0].action == "CLOSE_NO_FRAUD"
