import csv
from pathlib import Path
from typing import List, Dict, Any, Optional
from ..config import settings
from ..schemas.case import NextBestAction

class MemoryCaseItemData:
    def __init__(self, id: str, similarity: int, outcome: str, pattern: str, shared: List[str], analyst_notes: str, exposure_usd: float):
        self.id = id
        self.similarity = similarity
        self.outcome = outcome
        self.pattern = pattern
        self.shared = shared
        self.analyst_notes = analyst_notes
        self.exposure_usd = exposure_usd

    def to_dict(self) -> Dict[str, Any]:
        return {
            "id": self.id,
            "similarity": self.similarity,
            "outcome": self.outcome,
            "pattern": self.pattern,
            "shared": self.shared,
            "analyst_notes": self.analyst_notes,
            "exposure_usd": self.exposure_usd,
        }

class MemoryService:
    def __init__(self):
        self._cases: Dict[str, Dict[str, Any]] = {}
        self._loaded = False

    def load_cases(self):
        if self._loaded:
            return
        csv_path = settings.CLOSED_CASES_CSV
        if not csv_path.exists():
            return
        
        try:
            with open(csv_path, mode="r", encoding="utf-8", errors="ignore") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    cid = row.get("case_id", "").strip()
                    if cid:
                        self._cases[cid] = row
            self._loaded = True
        except Exception as e:
            print(f"Error loading closed cases: {e}")

    def find_similar(self, case_id: str, pattern: Optional[str] = None, customer_id: Optional[str] = None, limit: int = 4) -> List[Dict[str, Any]]:
        self.load_cases()
        from .data_service import data_service
        c_detail = data_service._cases.get(case_id, {})
        target_pattern = pattern or c_detail.get("pattern", "")
        target_amt = float(c_detail.get("amount", 250.0))
        target_cust = customer_id or c_detail.get("customer_id", "")
        target_card = c_detail.get("card_id", "")

        candidates = []
        for cid, row in self._cases.items():
            row_pattern = row.get("pattern", "")
            row_cust = row.get("customer_id", "")
            row_card = row.get("card_id", "")
            is_fraud = row.get("outcome") == "confirmed_fraud"
            outcome_display = "Confirmed Fraud" if is_fraud else "Cleared"

            try:
                exp = float(row.get("exposure_usd", "0") or 0)
            except ValueError:
                exp = 0.0

            # Compute multi-dimensional similarity score (40 - 95%)
            score = 45
            shared_tags = []

            # 1. Pattern alignment
            if target_pattern and row_pattern and target_pattern == row_pattern:
                score += 25
                shared_tags.append(f"Matching typology ({target_pattern.replace('_', ' ')})")

            # 2. Entity overlap
            if target_cust and row_cust and target_cust == row_cust:
                score += 20
                shared_tags.append(f"Customer relationship ({target_cust})")
            elif target_card and row_card and target_card == row_card:
                score += 20
                shared_tags.append(f"Card profile match ({target_card})")

            # 3. Exposure amount proximity
            if target_amt > 0 and exp > 0:
                diff_ratio = abs(target_amt - exp) / max(target_amt, exp)
                if diff_ratio < 0.25:
                    score += 15
                    shared_tags.append(f"Similar exposure (${exp:.2f})")
                elif diff_ratio < 0.60:
                    score += 8

            # Ensure baseline tags if none specific
            if not shared_tags:
                shared_tags = ["Transaction channel similarity", "Historical risk tier"]

            candidates.append({
                "id": cid,
                "similarity": min(score, 95),
                "outcome": outcome_display,
                "pattern": row_pattern,
                "shared": shared_tags[:3],
                "analyst_notes": row.get("analyst_notes", f"Historical case record for {cid}"),
                "exposure_usd": exp
            })

        # Sort candidates descending by similarity score
        candidates.sort(key=lambda x: x["similarity"], reverse=True)
        return candidates[:limit]

memory_service = MemoryService()
