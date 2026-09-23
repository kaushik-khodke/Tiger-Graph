from typing import List, Dict, Any
from ..schemas.benchmark import SARRecord

class SARGenerator:
    def generate(
        self,
        case_id: str,
        customer_id: str,
        card_id: str,
        affected_txns: List[str],
        connected_cards: List[str],
        connected_devices: List[str],
        exposure_usd: float,
        activity_dates: List[str],
        reason_rule: str,
        pattern: str
    ) -> SARRecord:
        subjects = [customer_id, card_id]
        for c in connected_cards:
            if c not in subjects:
                subjects.append(c)
        for d in connected_devices:
            if d not in subjects:
                subjects.append(d)

        dates_str = f"between {activity_dates[0]} and {activity_dates[1]}" if len(activity_dates) == 2 and activity_dates[0] != activity_dates[1] else f"on {activity_dates[0]}" if activity_dates else "during the reporting period"

        txn_list_str = ", ".join(affected_txns[:4])
        if len(affected_txns) > 4:
            txn_list_str += f" and {len(affected_txns) - 4} other transaction(s)"

        narrative = (
            f"On {dates_str}, card {card_id} belonging to customer {customer_id} was utilized in {len(affected_txns)} unauthorized transaction(s) "
            f"({txn_list_str}) totaling ${exposure_usd:,.2f} USD. "
            f"The flagged activity conforms to {pattern.replace('_', ' ')} methodology. "
        )

        if connected_devices:
            dev_str = ", ".join(connected_devices[:2])
            narrative += f"Forensic analysis identified shared device infrastructure ({dev_str}) linking this cardholder to coordinated activity. "

        if connected_cards:
            cards_str = ", ".join(connected_cards[:3])
            narrative += f"Additional compromised card accounts identified in the syndicate cluster include {cards_str}. "

        narrative += (
            f"The cardholder was contacted via customer verification protocols and confirmed that they did not initiate or authorize these charges. "
            f"Under bank fraud policy {reason_rule}, the card has been blocked and flagged for law enforcement reporting due to confirmed illicit activity."
        )

        return SARRecord(
            file=True,
            reason=f"{reason_rule}: confirmed unauthorized activity with total exposure of ${exposure_usd:,.2f}",
            narrative=narrative,
            subjects=subjects,
            total_amount_usd=exposure_usd,
            activity_dates=activity_dates if len(activity_dates) == 2 else [activity_dates[0], activity_dates[0]] if activity_dates else ["2016-12-01", "2016-12-01"]
        )

sar_generator = SARGenerator()
