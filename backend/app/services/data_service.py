import csv
import re
from pathlib import Path
from typing import Dict, List, Optional, Any
from ..config import settings
from ..schemas.case import CaseListItem, CaseDetail, UncertaintyAssessment, RecommendationSnapshot, NextBestAction
from .audit_service import audit_service
from ..agent.policy_engine import policy_engine
from ..agent.sar_generator import sar_generator

class DataService:
    def __init__(self):
        self._cases: Dict[str, Dict[str, Any]] = {}
        self._case_evidence: Dict[str, List[Dict[str, Any]]] = {}
        self._loaded = False
        self._init_golden_case()

    def _init_golden_case(self):
        """Initializes the Golden Path CASE-10293."""
        cid = "CASE-10293"
        self._cases[cid] = {
            "id": cid,
            "opened_at": "2016-12-05 10:01:00",
            "trigger_type": "risk_score",
            "trigger_text": "High-risk transaction flagged by real-time model (score: 0.87, online). Review and decide.",
            "flagged_txn_id": "TXN-10293",
            "card_id": "C-123-K1",
            "customer_id": "C-123",
            "amount": 259.98,
            "status": "EVIDENCE_REQUIRED",
            "verdict": "uncertain",
            "fraud_probability": 0.62,
            "pattern": "card_not_present_new_device",
            "pattern_description": "",
            "affected_txn_ids": ["TXN-10293"],
            "connected_card_ids": ["C-811-K1"],
            "connected_device_profiles": ["Device D-77 | Samsung SM-G892A | Android 7.0"],
            "exposure_usd": 259.98,
            "evidence_count": 4,
            "evidence_requested": False,
            "evidence_received": False,
            "approval_status": "NONE",
            "approval_id": None,
            "finding_headline": "Customer C-123 is connected to a historical fraud case through shared device D-77.",
            "finding_body": "Shared device D-77 used by C-123 and C-811 was previously linked to confirmed fraud case CC-0141.",
            "finding_pattern": "FP-03",
            "finding_policy": "Section 4.2",
            "timeline": [
                ("10:01", "Investigation triggered", "completed"),
                ("10:01", "Case created", "completed"),
                ("10:02", "Transaction context retrieved", "completed"),
                ("10:02", "Customer history analyzed", "completed"),
                ("10:03", "Shared device discovered", "completed"),
                ("10:04", "Fraud pattern matched", "completed"),
                ("10:04", "Evidence deemed insufficient", "warning"),
                ("10:05", "Customer validation recommended", "waiting")
            ],
            "activity_dates": ["2016-12-05", "2016-12-05"]
        }

        self._case_evidence[cid] = [
            {
                "id": "E-004",
                "type": "Supporting Evidence",
                "title": "Shared device relationship",
                "description": "Customer C-123 and C-811 both authenticated via Device D-77.",
                "source": "TigerGraph · relationship query",
                "strength": "Strong",
                "tone": "support",
                "entities": "C-123 → D-77 → C-811",
                "pattern": "FP-03",
                "time": "10:03",
                "provenance": {
                    "tool": "get_device_connections",
                    "query": "query:device_neighbors(device_id=D-77)",
                    "retrieved_at": "10:03:12",
                    "entity_ids": ["C-123", "D-77", "C-811"]
                }
            },
            {
                "id": "E-007",
                "type": "Supporting Evidence",
                "title": "Historical fraud connection",
                "description": "C-811 is associated with a previous confirmed fraud case CC-0141 / CASE-103.",
                "source": "Case memory · CASE-103",
                "strength": "Strong",
                "tone": "support",
                "entities": "C-811 → CASE-103",
                "pattern": "FP-03",
                "time": "10:04",
                "provenance": {
                    "tool": "find_prior_cases",
                    "query": "query:case_similarity(entity_id=C-811)",
                    "retrieved_at": "10:04:19",
                    "entity_ids": ["C-811", "CASE-103"]
                }
            },
            {
                "id": "E-009",
                "type": "Contradicting Evidence",
                "title": "Known device history",
                "description": "Customer historically used this device legitimately for routine logins.",
                "source": "Customer history",
                "strength": "Moderate",
                "tone": "contradict",
                "entities": "C-123 → D-77",
                "pattern": "Context",
                "time": "10:04",
                "provenance": {
                    "tool": "get_customer_history",
                    "query": "query:customer_devices(customer_id=C-123)",
                    "retrieved_at": "10:04:45",
                    "entity_ids": ["C-123", "D-77"]
                }
            },
            {
                "id": "E-011",
                "type": "Contextual Evidence",
                "title": "Transaction timing anomaly",
                "description": "Transaction occurred at 01:55 AM, outside the customer's normal spending window.",
                "source": "Transaction context",
                "strength": "Moderate",
                "tone": "context",
                "entities": "TXN-10293",
                "pattern": "FP-07",
                "time": "10:02",
                "provenance": {
                    "tool": "get_transaction_context",
                    "query": "query:transaction_window(txn_id=TXN-10293)",
                    "retrieved_at": "10:02:11",
                    "entity_ids": ["TXN-10293"]
                }
            }
        ]

    def load_cases(self):
        if self._loaded:
            return
        self._loaded = True

        csv_path = settings.CASE_PACK_CSV
        if not csv_path.exists():
            return

        try:
            with open(csv_path, mode="r", encoding="utf-8", errors="ignore") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    cid = row.get("case_id", "").strip()
                    if not cid:
                        continue
                    
                    trigger_text = row.get("trigger_text", "")
                    # Extract dollar amount from trigger text if present (e.g. $77.07)
                    amt_match = re.search(r"\$([\d,]+\.?\d*)", trigger_text)
                    amt = float(amt_match.group(1).replace(",", "")) if amt_match else 125.00
                    
                    raw_score = row.get("risk_score", "").strip()
                    score_val = float(raw_score) if raw_score else 0.70
                    
                    # Pattern deduction based on trigger & text
                    trigger_type = row.get("trigger_type", "risk_score")
                    if "customer_report" in trigger_type:
                        pattern = "card_not_present_fraud"
                    elif "billing region" in trigger_text:
                        pattern = "out_of_region_use"
                    elif "device" in trigger_text or "online" in trigger_text:
                        pattern = "card_not_present_new_device"
                    elif score_val >= 0.85:
                        pattern = "card_testing"
                    else:
                        pattern = "card_not_present_fraud"

                    self._cases[cid] = {
                        "id": cid,
                        "opened_at": row.get("opened_at", "2016-12-05 00:00:00"),
                        "trigger_type": trigger_type,
                        "trigger_text": trigger_text,
                        "flagged_txn_id": row.get("flagged_txn_id", ""),
                        "card_id": row.get("card_id", ""),
                        "customer_id": row.get("customer_id", ""),
                        "amount": amt,
                        "status": "INVESTIGATING",
                        "verdict": "uncertain",
                        "fraud_probability": score_val,
                        "pattern": pattern,
                        "pattern_description": "",
                        "affected_txn_ids": [row.get("flagged_txn_id", "")],
                        "connected_card_ids": [],
                        "connected_device_profiles": [],
                        "exposure_usd": amt,
                        "evidence_count": 3,
                        "evidence_requested": False,
                        "evidence_received": False,
                        "approval_status": "NONE",
                        "approval_id": None,
                        "finding_headline": f"Unusual activity detected on card {row.get('card_id')}",
                        "finding_body": f"Model flagged transaction {row.get('flagged_txn_id')} with risk score {score_val:.2f}.",
                        "finding_pattern": pattern,
                        "finding_policy": "Section 4.1",
                        "timeline": [
                            ("09:00", "Alert generated", "completed"),
                            ("09:01", "Investigation opened", "completed"),
                            ("09:02", "Graph relationship query", "completed"),
                            ("09:03", "Awaiting verification", "waiting")
                        ],
                        "activity_dates": [row.get("opened_at", "")[:10], row.get("opened_at", "")[:10]]
                    }

                    self._case_evidence[cid] = [
                        {
                            "id": f"E-{cid}-1",
                            "type": "Supporting Evidence",
                            "title": "Model Risk Trigger",
                            "description": trigger_text,
                            "source": "Detection Model",
                            "strength": "Strong" if score_val > 0.75 else "Moderate",
                            "tone": "support",
                            "entities": f"{row.get('customer_id')} → {row.get('card_id')} → {row.get('flagged_txn_id')}",
                            "pattern": pattern,
                            "time": "09:01",
                            "provenance": {
                                "tool": "get_transaction_context",
                                "query": f"query:transaction_window(txn_id={row.get('flagged_txn_id')})",
                                "retrieved_at": "09:01:22",
                                "entity_ids": [row.get("flagged_txn_id", "")]
                            }
                        },
                        {
                            "id": f"E-{cid}-2",
                            "type": "Contextual Evidence",
                            "title": "Customer Spending Profile",
                            "description": f"Customer {row.get('customer_id')} has active tenure with card {row.get('card_id')}.",
                            "source": "Customer history",
                            "strength": "Moderate",
                            "tone": "context",
                            "entities": f"{row.get('customer_id')}",
                            "pattern": "Context",
                            "time": "09:02",
                            "provenance": {
                                "tool": "get_customer_history",
                                "query": f"query:customer_summary(customer_id={row.get('customer_id')})",
                                "retrieved_at": "09:02:10",
                                "entity_ids": [row.get("customer_id", "")]
                            }
                        }
                    ]
        except Exception as e:
            print(f"Error loading case_pack: {e}")

    def list_cases(self, status: Optional[str] = None, search: Optional[str] = None) -> List[CaseListItem]:
        self.load_cases()
        items: List[CaseListItem] = []
        for idx, (cid, c) in enumerate(self._cases.items()):
            if status and status.lower() != "all":
                c_status = c["status"].replace("_", " ").lower()
                if status.lower() not in c_status:
                    continue
            if search:
                s = search.lower()
                match = (
                    s in cid.lower() or 
                    s in c["customer_id"].lower() or 
                    s in c["flagged_txn_id"].lower() or 
                    s in c["trigger_text"].lower() or
                    s in c.get("card_id", "").lower()
                )
                if not match:
                    continue

            risk_pct = int(c["fraud_probability"] * 100) if c["fraud_probability"] <= 1.0 else int(c["fraud_probability"])
            conf_pct = 91 if c.get("evidence_received") else 62

            # Compute current NBA display
            rec_snap = self.get_recommendation_snapshot(cid)
            nba_title = rec_snap.current_recommended_action.replace("_", " ").title()

            # Dynamic relative updated time
            if c.get("evidence_received"):
                time_ago = "Just now"
            elif c.get("evidence_requested"):
                time_ago = "1m ago"
            else:
                mins = (idx * 3 + 2)
                time_ago = f"{mins}m ago" if mins < 60 else f"{mins // 60}h ago"

            items.append(CaseListItem(
                id=cid,
                trigger=c["trigger_type"].replace("_", " ").title(),
                customer=c["customer_id"],
                transaction=c["flagged_txn_id"],
                amount=c["amount"],
                risk=risk_pct,
                confidence=conf_pct,
                status=c["status"].replace("_", " ").title(),
                nba=nba_title,
                evidence=len(self._case_evidence.get(cid, [])),
                updated=time_ago,
                card_id=c.get("card_id"),
                opened_at=c.get("opened_at")
            ))

        return items

    def get_metrics(self) -> Dict[str, Any]:
        self.load_cases()
        from .approval_service import approval_service
        
        active = sum(1 for c in self._cases.values() if c["status"] in ("INVESTIGATING", "EVIDENCE_REQUIRED"))
        awaiting = sum(1 for c in self._cases.values() if c["status"] == "EVIDENCE_REQUIRED")
        
        # Live pending approvals from approval_service
        pending_apps = len(approval_service.list_approvals(status="PENDING"))
        pending = pending_apps if pending_apps > 0 else sum(1 for c in self._cases.values() if c["status"] == "AWAITING_APPROVAL")
        
        resolved = sum(1 for c in self._cases.values() if c["status"] in ("RESOLVED", "CLOSED_NO_FRAUD", "ACTION_TAKEN"))
        escalations = sum(1 for c in self._cases.values() if c["status"] == "ESCALATED")
        
        total = len(self._cases)
        active_pct = f"+{round((active / total * 100) if total else 0)}%"
        awaiting_text = f"{awaiting} require review" if awaiting > 0 else "0 pending"
        pending_text = f"{pending} in queue" if pending > 0 else "0 pending"
        escalations_text = f"{escalations} active" if escalations > 0 else "0 active"
        resolved_text = f"+{round((resolved / total * 100) if total else 0)}%"
        
        return {
            "active_investigations": active,
            "awaiting_evidence": awaiting,
            "pending_approvals": pending,
            "escalations": escalations,
            "resolved_today": resolved,
            "total_cases": total,
            "active_change": active_pct,
            "awaiting_change": awaiting_text,
            "pending_change": pending_text,
            "escalations_change": escalations_text,
            "resolved_change": resolved_text
        }

    def get_case(self, case_id: str) -> Optional[CaseDetail]:
        self.load_cases()
        c = self._cases.get(case_id)
        if not c:
            return None

        ev_list = self._case_evidence.get(case_id, [])
        risk_pct = int(c["fraud_probability"] * 100) if c["fraud_probability"] <= 1.0 else int(c["fraud_probability"])
        conf_pct = 91 if c.get("evidence_received") else 62

        suff = "SUFFICIENT" if c.get("evidence_received") else "INSUFFICIENT"
        risk_lvl = "VERY HIGH" if risk_pct >= 90 else "HIGH" if risk_pct >= 70 else "MEDIUM"

        unc = UncertaintyAssessment(
            risk_score=risk_pct,
            risk_level=risk_lvl,
            confidence=conf_pct,
            evidence_sufficiency=suff,
            known_signals=[
                "Unusual device transaction" if "device" in c["pattern"] else "Unusual transaction amount",
                "Transaction outside normal window",
                "Entity relationship path identified"
            ],
            uncertain_signals=[
                "Customer recognizes transaction authorization",
                "Device association legitimacy"
            ] if not c.get("evidence_received") else [],
            primary_uncertainty="Legitimate cardholder activity vs unauthorized compromise" if not c.get("evidence_received") else "Resolved by customer statement",
            why_not_acting="Customer identity verified, but transaction authorization remains unresolved." if not c.get("evidence_received") else "Evidence supports immediate intervention."
        )

        rec_snap = self.get_recommendation_snapshot(case_id)

        return CaseDetail(
            id=c["id"],
            opened_at=c["opened_at"],
            trigger_type=c["trigger_type"],
            trigger_text=c["trigger_text"],
            flagged_txn_id=c["flagged_txn_id"],
            card_id=c["card_id"],
            customer_id=c["customer_id"],
            amount=c["amount"],
            status=c["status"],
            verdict=c["verdict"],
            fraud_probability=c["fraud_probability"],
            pattern=c["pattern"],
            pattern_description=c.get("pattern_description", ""),
            affected_txn_ids=c["affected_txn_ids"],
            connected_card_ids=c["connected_card_ids"],
            connected_device_profiles=c["connected_device_profiles"],
            exposure_usd=c["exposure_usd"],
            uncertainty=unc,
            recommendation=rec_snap,
            evidence_count=len(ev_list),
            finding_headline=c["finding_headline"],
            finding_body=c["finding_body"],
            finding_pattern=c["finding_pattern"],
            finding_policy=c["finding_policy"],
            approval_status=c["approval_status"],
            timeline=c["timeline"]
        )

    def get_evidence(self, case_id: str) -> List[Dict[str, Any]]:
        self.load_cases()
        return self._case_evidence.get(case_id, [])

    def request_evidence(self, case_id: str, action_type: str = "customer_validation") -> Dict[str, Any]:
        """Simulates customer validation and automatically reassesses case."""
        self.load_cases()
        c = self._cases.get(case_id)
        if not c:
            raise ValueError(f"Case {case_id} not found")

        c["evidence_requested"] = True
        c["evidence_received"] = True
        c["fraud_probability"] = 0.94
        c["verdict"] = "fraud"
        c["status"] = "AWAITING_APPROVAL"

        # Append new evidence item
        new_ev_id = f"E-{case_id}-DENIAL"
        new_ev = {
            "id": new_ev_id,
            "type": "Supporting Evidence",
            "title": "Customer denied transaction",
            "description": "Customer validation received: cardholder confirms transaction was unauthorized and unrecognized.",
            "source": "Customer validation · simulated",
            "strength": "Strong",
            "tone": "support",
            "entities": f"{c['customer_id']} → {c['flagged_txn_id']}",
            "pattern": c["pattern"],
            "time": "10:06",
            "provenance": {
                "tool": "customer_validation_provider",
                "query": f"evidence_request:customer_validation({c['customer_id']})",
                "retrieved_at": "10:06:04",
                "entity_ids": [c["customer_id"], c["flagged_txn_id"]]
            }
        }
        self._case_evidence[case_id].append(new_ev)

        # Update timeline
        c["timeline"].append(("10:06", "Evidence received: customer denial", "completed"))
        c["timeline"].append(("10:06", "Case reassessed: fraud probability 0.94", "active"))
        c["timeline"].append(("10:07", "Recommendation updated: BLOCK_CARD + CREATE_CASE + FILE_REPORT", "action"))

        # Log audit event
        audit_service.log(
            case_id=case_id,
            actor="Agent",
            event="Evidence received",
            tool_action="Customer validation response",
            result="Denied by customer",
            metadata={"evidence_id": new_ev_id, "action": "VERIFY_WITH_CUSTOMER"}
        )

        return {
            "case_id": case_id,
            "status": "received",
            "new_evidence": new_ev,
            "updated_fraud_probability": 0.94,
            "updated_status": c["status"]
        }

    def get_recommendation_snapshot(self, case_id: str) -> RecommendationSnapshot:
        c = self._cases.get(case_id, {})
        exposure = c.get("exposure_usd", 259.98)
        pattern = c.get("pattern", "card_not_present_fraud")
        connected_cards = c.get("connected_card_ids", [])
        has_shared = len(connected_cards) > 0 or len(c.get("connected_device_profiles", [])) > 0

        initial_actions = policy_engine.evaluate_pre_evidence(
            trigger_type=c.get("trigger_type", "risk_score"),
            fraud_prob=0.62 if not c.get("evidence_received") else 0.62,
            exposure_usd=exposure,
            pattern=pattern,
            is_single_signal=True
        )

        final_actions = policy_engine.evaluate_post_evidence(
            customer_response="denied",
            exposure_usd=exposure,
            has_shared_origin=has_shared,
            pattern=pattern,
            connected_cards=connected_cards
        )

        if c.get("evidence_received"):
            current_act = final_actions[0].action if final_actions else "BLOCK_CARD"
            app_req = any(a.route in ("L1", "L2") for a in final_actions)
            role = final_actions[0].required_role or "Fraud Supervisor"
            rule = "POLICY-4.2 / R2"
            what = f"Customer denial confirmed unauthorized transaction {c.get('flagged_txn_id', '')} on card {c.get('card_id', '')}. Fraud probability raised to 0.94."
            reasons = [
                f"Customer confirmed {c.get('flagged_txn_id', 'transaction')} was unauthorized",
                f"Card {c.get('card_id', '')} linked to suspicious activity pattern ({pattern.replace('_', ' ')})",
                f"Exposure of ${exposure:.2f} USD requires {role} authorization under {rule}",
                "Case memory links confirmed fraud precedent with high confidence"
            ]
        else:
            current_act = initial_actions[0].action if initial_actions else "VERIFY_WITH_CUSTOMER"
            app_req = any(a.route in ("L1", "L2") for a in initial_actions)
            role = initial_actions[0].required_role or "System / Agent"
            rule = "POLICY-4.1 / R1"
            what = f"Initial recommendation for transaction {c.get('flagged_txn_id', '')} prior to customer step-up validation."
            reasons = [
                f"Uncertainty target: legitimate use vs account takeover on {c.get('flagged_txn_id', 'flagged transaction')}",
                f"Model risk score: {c.get('fraud_probability', 0.70):.2f} on {c.get('trigger_type', 'risk score').replace('_', ' ')}",
                f"Policy {rule}: automated verification required before card blocking",
                "Expected decision impact: HIGH once customer authentication response is received"
            ]

        return RecommendationSnapshot(
            initial=initial_actions,
            final=final_actions,
            what_changed=what,
            current_recommended_action=current_act,
            approval_required=app_req,
            required_role=role,
            policy_rule=rule,
            reasons=reasons
        )

data_service = DataService()
