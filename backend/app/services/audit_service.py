from datetime import datetime, timedelta
from typing import List, Optional, Dict, Any
from ..schemas.audit import AuditLogItem

class AuditService:
    def __init__(self):
        now = datetime.now()
        t1 = (now - timedelta(minutes=1, seconds=15)).strftime("%H:%M:%S")
        t2 = (now - timedelta(minutes=2, seconds=45)).strftime("%H:%M:%S")
        t3 = (now - timedelta(minutes=4, seconds=20)).strftime("%H:%M:%S")
        t4 = (now - timedelta(minutes=6, seconds=10)).strftime("%H:%M:%S")
        t5 = (now - timedelta(minutes=8, seconds=30)).strftime("%H:%M:%S")

        self._events: List[AuditLogItem] = [
            AuditLogItem(
                timestamp=t1,
                case_id="CASE-10293",
                actor="Agent",
                event="Action",
                tool_action="Escalation submitted",
                result="Executed",
                metadata={"rule": "POLICY-4.2"}
            ),
            AuditLogItem(
                timestamp=t2,
                case_id="CASE-10293",
                actor="Supervisor",
                event="Approval",
                tool_action="Policy-4.2",
                result="Approved",
                metadata={"role": "Fraud Supervisor"}
            ),
            AuditLogItem(
                timestamp=t3,
                case_id="CASE-10293",
                actor="Agent",
                event="Evidence request",
                tool_action="Customer validation",
                result="Sent",
                metadata={"action": "VERIFY_WITH_CUSTOMER"}
            ),
            AuditLogItem(
                timestamp=t4,
                case_id="CASE-10293",
                actor="Agent",
                event="Graph query",
                tool_action="find_prior_cases",
                result="Evidence found",
                metadata={"prior_case": "CC-0141"}
            ),
            AuditLogItem(
                timestamp=t5,
                case_id="CASE-10293",
                actor="Agent",
                event="Policy check",
                tool_action="Policy-4.2",
                result="Allowed",
                metadata={"rule": "R1"}
            ),
        ]

    def log(self, case_id: str, actor: str, event: str, tool_action: str, result: str, metadata: Optional[Dict[str, Any]] = None) -> AuditLogItem:
        now_str = datetime.now().strftime("%H:%M:%S")
        item = AuditLogItem(
            timestamp=now_str,
            case_id=case_id,
            actor=actor,
            event=event,
            tool_action=tool_action,
            result=result,
            metadata=metadata or {}
        )
        self._events.insert(0, item)
        return item

    def get_events(self, case_id: Optional[str] = None, limit: int = 50) -> List[AuditLogItem]:
        if case_id:
            return [e for e in self._events if e.case_id == case_id][:limit]
        return self._events[:limit]

audit_service = AuditService()
