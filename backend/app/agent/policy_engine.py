from typing import List, Tuple, Optional
from ..schemas.case import NextBestAction

class PolicyEngine:
    def determine_route(self, action: str, exposure_usd: float) -> Tuple[str, str]:
        """Returns (route, required_role)."""
        action = action.upper()
        if action in ("ALLOW_TRANSACTION", "MONITOR_CARD", "MONITOR_CONNECTED_CARDS", 
                      "WARN_CUSTOMER", "VERIFY_WITH_CUSTOMER", "STEP_UP_AUTH", 
                      "GENERATE_REPORT", "CREATE_CASE", "ESCALATE_TO_ANALYST", "CLOSE_NO_FRAUD"):
            return "auto", "System / Agent"
        
        if action == "DECLINE_TRANSACTION":
            return "L1", "Team Lead"
        
        if action == "BLOCK_CARD":
            if exposure_usd <= 2500.0:
                return "L1", "Team Lead"
            else:
                return "L2", "Fraud Manager"
                
        if action in ("BLOCK_ALL_CARDS", "FILE_REPORT"):
            return "L2", "Fraud Manager"
            
        return "L1", "Team Lead"

    def evaluate_pre_evidence(
        self, 
        trigger_type: str, 
        fraud_prob: float, 
        exposure_usd: float, 
        pattern: str,
        is_single_signal: bool = True
    ) -> List[NextBestAction]:
        """Rules R1, R5, R8 before additional evidence is acquired."""
        actions: List[NextBestAction] = []
        
        if pattern == "card_testing":
            route1, role1 = self.determine_route("DECLINE_TRANSACTION", exposure_usd)
            route2, role2 = self.determine_route("STEP_UP_AUTH", exposure_usd)
            actions.append(NextBestAction(
                action="DECLINE_TRANSACTION",
                route=route1,
                reason="R5: card testing sequence observed with unauthorized micro-charges",
                policy_reference="Policy R5",
                required_role=role1
            ))
            actions.append(NextBestAction(
                action="STEP_UP_AUTH",
                route=route2,
                reason="R5: step-up authentication required before further card-not-present activity",
                policy_reference="Policy R5",
                required_role=role2
            ))
            return actions

        if is_single_signal and fraud_prob < 0.70:
            route, role = self.determine_route("VERIFY_WITH_CUSTOMER", exposure_usd)
            actions.append(NextBestAction(
                action="VERIFY_WITH_CUSTOMER",
                route=route,
                reason="R1: verify before blocking on weak/single signal where assessed fraud probability < 0.70",
                policy_reference="Policy R1",
                required_role=role
            ))
            return actions

        if fraud_prob >= 0.70:
            route1, role1 = self.determine_route("DECLINE_TRANSACTION", exposure_usd)
            route2, role2 = self.determine_route("VERIFY_WITH_CUSTOMER", exposure_usd)
            actions.append(NextBestAction(
                action="DECLINE_TRANSACTION",
                route=route1,
                reason="R1 & R4: decline pending authorization pending customer confirmation",
                policy_reference="Policy R1/R4",
                required_role=role1
            ))
            actions.append(NextBestAction(
                action="VERIFY_WITH_CUSTOMER",
                route=route2,
                reason="R1: verify transaction authorization with customer before blocking card",
                policy_reference="Policy R1",
                required_role=role2
            ))
            return actions

        route, role = self.determine_route("MONITOR_CARD", exposure_usd)
        actions.append(NextBestAction(
            action="MONITOR_CARD",
            route=route,
            reason="R1: low probability single alert placed on 72h heightened monitoring",
            policy_reference="Policy R1",
            required_role=role
        ))
        return actions

    def evaluate_post_evidence(
        self, 
        customer_response: str, # "denied" | "confirmed" | "timeout"
        exposure_usd: float,
        has_shared_origin: bool = False,
        pattern: str = "none",
        connected_cards: Optional[List[str]] = None
    ) -> List[NextBestAction]:
        """Rules R2, R3, R4, R6, R9, R10."""
        actions: List[NextBestAction] = []
        connected_cards = connected_cards or []
        
        if customer_response == "confirmed":
            route, role = self.determine_route("CLOSE_NO_FRAUD", exposure_usd)
            actions.append(NextBestAction(
                action="CLOSE_NO_FRAUD",
                route=route,
                reason="R3: customer confirmed legitimate transaction; close alert with no fraud",
                policy_reference="Policy R3",
                required_role=role
            ))
            return actions

        if customer_response == "denied":
            # R10: If multiple cards under this customer or connected cards confirmed compromised
            if has_shared_origin and len(connected_cards) >= 2:
                route_all, role_all = self.determine_route("BLOCK_ALL_CARDS", exposure_usd)
                actions.append(NextBestAction(
                    action="BLOCK_ALL_CARDS",
                    route=route_all,
                    reason=f"R10: multiple compromised cards ({len(connected_cards)}) detected under shared account or ring",
                    policy_reference="Policy R10",
                    required_role=role_all
                ))
            else:
                route_block, role_block = self.determine_route("BLOCK_CARD", exposure_usd)
                actions.append(NextBestAction(
                    action="BLOCK_CARD",
                    route=route_block,
                    reason=f"R2: customer denied transaction; block card and reissue (exposure: ${exposure_usd:,.2f})",
                    policy_reference="Policy R2",
                    required_role=role_block
                ))

            route_case, role_case = self.determine_route("CREATE_CASE", exposure_usd)
            actions.append(NextBestAction(
                action="CREATE_CASE",
                route=route_case,
                reason="R2: customer dispute and confirmed unauthorized transaction",
                policy_reference="Policy R2",
                required_role=role_case
            ))
            
            # FILE_REPORT if exposure > $1000 or shared device/origin or pattern undocumented
            should_file_sar = exposure_usd > 1000.0 or has_shared_origin or pattern == "undocumented"
            if should_file_sar:
                route_sar, role_sar = self.determine_route("FILE_REPORT", exposure_usd)
                sar_reason = "R2 & R6: customer denied transaction and shared entity/network link detected" if has_shared_origin else f"R2: exposure ${exposure_usd:,.2f} exceeds $1,000 threshold"
                actions.append(NextBestAction(
                    action="FILE_REPORT",
                    route=route_sar,
                    reason=sar_reason,
                    policy_reference="Policy R2/R6",
                    required_role=role_sar
                ))

            if has_shared_origin and connected_cards:
                route_conn, role_conn = self.determine_route("MONITOR_CONNECTED_CARDS", exposure_usd)
                actions.append(NextBestAction(
                    action="MONITOR_CONNECTED_CARDS",
                    route=route_conn,
                    reason=f"R6: place {len(connected_cards)} connected card(s) sharing device/origin under monitoring",
                    policy_reference="Policy R6",
                    required_role=role_conn
                ))
            return actions

        # If no reply within 24 hours (R4)
        route_mon, role_mon = self.determine_route("MONITOR_CARD", exposure_usd)
        route_dec, role_dec = self.determine_route("DECLINE_TRANSACTION", exposure_usd)
        actions.append(NextBestAction(
            action="MONITOR_CARD",
            route=route_mon,
            reason="R4: no customer reply within 24h; raise monitoring sensitivity",
            policy_reference="Policy R4",
            required_role=role_mon
        ))
        actions.append(NextBestAction(
            action="DECLINE_TRANSACTION",
            route=route_dec,
            reason="R4: decline pending authorization while waiting for customer",
            policy_reference="Policy R4",
            required_role=role_dec
        ))
        if exposure_usd > 500.0:
            route_esc, role_esc = self.determine_route("ESCALATE_TO_ANALYST", exposure_usd)
            actions.append(NextBestAction(
                action="ESCALATE_TO_ANALYST",
                route=route_esc,
                reason="R4: exposure exceeds $500 with unverified customer status",
                policy_reference="Policy R4",
                required_role=role_esc
            ))
        return actions

policy_engine = PolicyEngine()
