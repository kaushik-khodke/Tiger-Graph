from typing import List, Optional, Dict, Any
from datetime import datetime, timedelta
from ..schemas.approval import ApprovalItem, ApprovalActionPayload
from .audit_service import audit_service
from .data_service import data_service

class ApprovalService:
    def __init__(self):
        now = datetime.now()
        t1 = (now - timedelta(minutes=3, seconds=20)).strftime("%H:%M:%S")
        t2 = (now - timedelta(minutes=18, seconds=45)).strftime("%H:%M:%S")
        t3 = (now - timedelta(hours=1, minutes=12)).strftime("%H:%M:%S")

        self._approvals: Dict[str, ApprovalItem] = {
            "APP-10293": ApprovalItem(
                id="APP-10293",
                case_id="CASE-10293",
                action="BLOCK_CARD",
                requested_by="Sentinel Agent",
                created_at=t1,
                route="L1",
                status="PENDING",
                risk=94,
                confidence=91,
                exposure_usd=259.98,
                policy_rule="POLICY-4.2 / R2",
                notes="Customer confirmed transaction was unauthorized. Linked to shared device D-77."
            ),
            "APP-1047": ApprovalItem(
                id="APP-1047",
                case_id="HHG-002",
                action="BLOCK_ALL_CARDS",
                requested_by="Sentinel Agent",
                created_at=t2,
                route="L2",
                status="PENDING",
                risk=94,
                confidence=91,
                exposure_usd=2850.00,
                policy_rule="POLICY-4.2 / R10",
                notes="Multiple compromised cards detected under customer C11891."
            ),
            "APP-1039": ApprovalItem(
                id="APP-1039",
                case_id="HHG-010",
                action="FILE_REPORT",
                requested_by="Sentinel Agent",
                created_at=t3,
                route="L2",
                status="PENDING",
                risk=90,
                confidence=85,
                exposure_usd=1000.03,
                policy_rule="POLICY-4.2 / R2",
                notes="High value transaction ($1,000.03) online without customer recognition."
            )
        }

    def list_approvals(self, status: Optional[str] = None) -> List[ApprovalItem]:
        if status:
            return [a for a in self._approvals.values() if a.status.upper() == status.upper()]
        return list(self._approvals.values())

    def get_approval(self, approval_id: str) -> Optional[ApprovalItem]:
        return self._approvals.get(approval_id)

    def create_approval(self, case_id: str, action: str, route: str, exposure_usd: float, risk: int, confidence: int, notes: str) -> ApprovalItem:
        app_id = f"APP-{case_id.replace('CASE-', '').replace('HHG-', '')}"
        item = ApprovalItem(
            id=app_id,
            case_id=case_id,
            action=action,
            requested_by="Sentinel Agent",
            created_at=datetime.now().strftime("%H:%M:%S"),
            route=route,
            status="PENDING",
            risk=risk,
            confidence=confidence,
            exposure_usd=exposure_usd,
            policy_rule="POLICY-4.2",
            notes=notes
        )
        self._approvals[app_id] = item
        
        # Update case
        c = data_service._cases.get(case_id)
        if c:
            c["status"] = "AWAITING_APPROVAL"
            c["approval_status"] = "PENDING"
            c["approval_id"] = app_id

        audit_service.log(
            case_id=case_id,
            actor="Agent",
            event="Approval requested",
            tool_action=f"{action} submitted for {route} review",
            result="Pending",
            metadata={"approval_id": app_id, "route": route}
        )
        return item

    def decide(self, approval_id: str, payload: ApprovalActionPayload) -> Optional[ApprovalItem]:
        item = self._approvals.get(approval_id)
        if not item:
            return None

        decision = payload.decision.lower()
        if decision == "approve":
            item.status = "APPROVED"
            result_str = "Approved & Executed"
            # Update case status
            c = data_service._cases.get(item.case_id)
            if c:
                c["status"] = "ACTION_TAKEN"
                c["approval_status"] = "APPROVED"
                c["timeline"].append((
                    datetime.now().strftime("%H:%M"),
                    f"Action executed: {item.action} by {payload.reviewer} ({payload.role})",
                    "completed"
                ))
        elif decision == "reject":
            item.status = "REJECTED"
            result_str = "Rejected"
            c = data_service._cases.get(item.case_id)
            if c:
                c["status"] = "RESOLVED"
                c["approval_status"] = "REJECTED"
        else:
            item.status = "PENDING"
            result_str = "Info Requested"

        audit_service.log(
            case_id=item.case_id,
            actor=payload.reviewer,
            event="Approval decision",
            tool_action=f"{item.action} ({item.route})",
            result=result_str,
            metadata={"decision": decision, "notes": payload.notes, "role": payload.role}
        )

        # Resume LangGraph investigation agent if checkpoint exists
        try:
            from ..agent.graph import investigation_agent
            from ..api.routes.investigations import broadcast_case_event
            
            agent_decision = "APPROVED" if decision == "approve" else ("REJECTED" if decision == "reject" else "INFO_REQUESTED")
            investigation_agent.resume_with_approval(
                case_id=item.case_id,
                decision=agent_decision,
                notes=payload.notes,
                on_event=lambda ev: broadcast_case_event(item.case_id, ev)
            )
            broadcast_case_event(item.case_id, {
                "event": "approval_decided",
                "case_id": item.case_id,
                "approval_id": approval_id,
                "decision": agent_decision,
                "reviewer": payload.reviewer,
                "notes": payload.notes
            })
        except Exception as e:
            # If no LangGraph checkpoint is active for this case, silently continue
            pass

        return item

approval_service = ApprovalService()
