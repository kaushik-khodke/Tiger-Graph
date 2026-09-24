#!/usr/bin/env python3
"""
HHGOA Submission Validator
Sentinel AI — Agentic Fraud Investigation & Next-Best-Action Platform
TigerGraph x Hacker House Goa

Strict validator enforcing all 39 rules (A through AM) for the official 20 benchmark case files.
Exits with code 0 on PASS, code 1 on ANY failure.
"""

import os
import sys
import csv
import json
import re
from pathlib import Path
from typing import Dict, List, Set, Any, Tuple

REPO_ROOT = Path(__file__).resolve().parent.parent
CASES_DIR = REPO_ROOT / "cases"
CASE_PACK_CSV = REPO_ROOT / "case_pack.csv"
CLOSED_CASES_CSV = REPO_ROOT / "closed_cases_history.csv"
IDENTITY_CSV = REPO_ROOT / "identity.csv"

# Allowed Enums
ALLOWED_STATUSES = {"open", "closed_fraud", "closed_legitimate", "escalated"}
ALLOWED_VERDICTS = {"fraud", "legitimate", "uncertain"}
ALLOWED_PATTERNS = {
    "card_testing", "card_not_present_fraud", "card_not_present_new_device",
    "out_of_region_use", "account_takeover", "undocumented", "none"
}
ALLOWED_ACTIONS = {
    "ALLOW_TRANSACTION", "DECLINE_TRANSACTION", "MONITOR_CARD", "MONITOR_CONNECTED_CARDS",
    "WARN_CUSTOMER", "VERIFY_WITH_CUSTOMER", "STEP_UP_AUTH", "BLOCK_CARD", "BLOCK_ALL_CARDS",
    "GENERATE_REPORT", "CREATE_CASE", "FILE_REPORT", "ESCALATE_TO_ANALYST", "CLOSE_NO_FRAUD"
}
ALLOWED_ROUTES = {"auto", "L1", "L2"}
ALLOWED_EVIDENCE_TYPES = {"customer_validation", "step_up_auth", "analyst_info"}
ALLOWED_EVIDENCE_SOURCES = {"graph", "document", "customer", "external"}

DATE_REGEX = re.compile(r"^\d{4}-\d{2}-\d{2}$")


class SubmissionValidator:
    def __init__(self, cases_dir: Path = CASES_DIR):
        self.cases_dir = cases_dir
        self.errors: List[str] = []
        self.warnings: List[str] = []
        self.case_pack_ids: List[str] = []
        self.case_pack_data: Dict[str, Dict[str, Any]] = {}
        self.valid_closed_cases: Set[str] = set()
        self.valid_customers: Set[str] = set()
        self.valid_cards: Set[str] = set()
        self.valid_txns: Dict[str, float] = {}  # txn_id -> amount
        self.valid_device_profiles: Set[str] = set()

    def add_error(self, case_id: str, msg: str):
        self.errors.append(f"[{case_id}] {msg}" if case_id else msg)

    def load_dataset_references(self):
        """Loads authoritative reference IDs from case_pack.csv and closed_cases_history.csv."""
        if not CASE_PACK_CSV.exists():
            self.add_error("", f"CRITICAL: case_pack.csv not found at {CASE_PACK_CSV}")
            return

        with open(CASE_PACK_CSV, "r", encoding="utf-8") as f:
            reader = csv.DictReader(f)
            for row in reader:
                cid = row.get("case_id", "").strip()
                if cid:
                    self.case_pack_ids.append(cid)
                    self.case_pack_data[cid] = row
                    self.valid_customers.add(row.get("customer_id", "").strip())
                    self.valid_cards.add(row.get("card_id", "").strip())
                    flagged_txn = row.get("flagged_txn_id", "").strip()
                    if flagged_txn:
                        # Extract amount if present in trigger text
                        m = re.search(r"\$([\d,]+\.?\d*)", row.get("trigger_text", ""))
                        amt = float(m.group(1).replace(",", "")) if m else 0.0
                        self.valid_txns[flagged_txn] = amt

        if CLOSED_CASES_CSV.exists():
            with open(CLOSED_CASES_CSV, "r", encoding="utf-8") as f:
                reader = csv.DictReader(f)
                for row in reader:
                    cc_id = row.get("case_id", "").strip()
                    if cc_id:
                        self.valid_closed_cases.add(cc_id)
                    cust = row.get("customer_id", "").strip()
                    if cust:
                        self.valid_customers.add(cust)
                    card = row.get("card_id", "").strip()
                    if card:
                        self.valid_cards.add(card)
                    txns = row.get("txn_ids", "").split("|")
                    for t in txns:
                        t = t.strip()
                        if t and t not in self.valid_txns:
                            self.valid_txns[t] = 0.0

        # Load device profiles from identity.csv if available
        if IDENTITY_CSV.exists():
            try:
                with open(IDENTITY_CSV, "r", encoding="utf-8") as f:
                    reader = csv.DictReader(f)
                    for i, row in enumerate(reader):
                        if i > 25000:  # Sample sufficient identity profiles
                            break
                        dev = row.get("DeviceInfo", "").strip()
                        os_val = row.get("id_30", "").strip()
                        browser = row.get("id_31", "").strip()
                        screen = row.get("id_33", "").strip()
                        profile = f"{dev} | {os_val} | {browser} | {screen}"
                        self.valid_device_profiles.add(profile)
            except Exception:
                pass

    def validate_all(self) -> bool:
        print("====================================================")
        print("HHGOA SUBMISSION VALIDATOR")
        print("Sentinel AI — Final Submission Check")
        print("====================================================")

        self.load_dataset_references()

        # Check A: cases/ directory exists
        if not self.cases_dir.exists() or not self.cases_dir.is_dir():
            self.add_error("", f"[FAIL] Directory '{self.cases_dir}' does not exist.")
            self._print_results()
            return False
        print("[PASS] Check A: cases/ exists")

        # Check B, C, D, E: exact 20 case files matching case_pack.csv
        actual_files = sorted([f.name for f in self.cases_dir.glob("*.json")])
        all_dir_files = sorted([f.name for f in self.cases_dir.iterdir() if f.is_file()])
        expected_files = sorted([f"{cid}.json" for cid in self.case_pack_ids])

        if len(self.case_pack_ids) != 20:
            self.add_error("", f"[FAIL] case_pack.csv must contain exactly 20 cases, found {len(self.case_pack_ids)}")

        if len(actual_files) != 20:
            self.add_error("", f"[FAIL] Exactly 20 answer files must exist, found {len(actual_files)}: {actual_files}")
        else:
            print("[PASS] Check B: exactly 20 answer files exist")

        non_json = [f for f in all_dir_files if not f.endswith(".json")]
        if non_json:
            self.add_error("", f"[FAIL] Non-JSON files found in cases/: {non_json}")
        else:
            print("[PASS] Check E: no unexpected non-JSON files exist")

        missing = set(expected_files) - set(actual_files)
        unexpected = set(actual_files) - set(expected_files)

        if missing:
            self.add_error("", f"[FAIL] Missing expected case files: {sorted(list(missing))}")
        if unexpected:
            self.add_error("", f"[FAIL] Unexpected .json case files: {sorted(list(unexpected))}")

        if not missing and not unexpected and len(actual_files) == 20:
            print("[PASS] Check C & D: filenames match case_pack.csv exactly")

        # Now validate each individual case file
        for expected_file in expected_files:
            file_path = self.cases_dir / expected_file
            if file_path.exists():
                self.validate_case_file(file_path)

        self._print_results()
        return len(self.errors) == 0

    def validate_case_file(self, file_path: Path):
        case_file_id = file_path.stem

        # Check AE: Valid UTF-8 and valid JSON
        try:
            with open(file_path, "r", encoding="utf-8") as f:
                content = f.read()
        except UnicodeDecodeError as ue:
            self.add_error(case_file_id, f"Check AE: Invalid UTF-8 encoding: {ue}")
            return

        # Check AF: No NaN or Infinity in JSON text
        if "NaN" in content or "Infinity" in content or "-Infinity" in content:
            self.add_error(case_file_id, "Check AF: JSON contains invalid NaN or Infinity tokens")
            return

        try:
            data = json.loads(content)
        except json.JSONDecodeError as je:
            self.add_error(case_file_id, f"Check AE: JSON parse error: {je}")
            return

        if not isinstance(data, dict):
            self.add_error(case_file_id, "Check G: Root JSON must be an object")
            return

        # Check F: case_id matches filename
        root_case_id = data.get("case_id")
        if root_case_id != case_file_id:
            self.add_error(case_file_id, f"Check F: top-level 'case_id' ('{root_case_id}') does not match filename ('{case_file_id}')")

        # Check G: required top-level fields
        required_top_fields = [
            "case_id", "case", "evidence_requests", "next_best_actions",
            "sar", "stop_reason", "tool_calls", "tokens", "latency_s"
        ]
        for fld in required_top_fields:
            if fld not in data:
                self.add_error(case_file_id, f"Check G: Missing top-level field '{fld}'")

        # Check AB, AC, AD: numeric metrics
        tc = data.get("tool_calls")
        if not isinstance(tc, int) or isinstance(tc, bool) or tc < 0:
            self.add_error(case_file_id, f"Check AB: 'tool_calls' must be a non-negative integer, got {tc}")

        tokens = data.get("tokens")
        if not isinstance(tokens, int) or isinstance(tokens, bool) or tokens < 0:
            self.add_error(case_file_id, f"Check AC: 'tokens' must be a non-negative integer, got {tokens}")

        latency = data.get("latency_s")
        if not isinstance(latency, (int, float)) or latency < 0:
            self.add_error(case_file_id, f"Check AD: 'latency_s' must be a non-negative number, got {latency}")

        # Check AA: stop_reason exists and is non-empty string
        stop_reason = data.get("stop_reason")
        if not isinstance(stop_reason, str) or not stop_reason.strip():
            self.add_error(case_file_id, "Check AA: 'stop_reason' must be a non-empty string")

        # Check H & Part 1: case object
        c_obj = data.get("case")
        if not isinstance(c_obj, dict):
            self.add_error(case_file_id, "Check H: 'case' field must be an object")
            return

        required_case_fields = [
            "status", "verdict", "fraud_probability", "pattern", "pattern_description",
            "affected_txn_ids", "first_suspicious_txn_id", "connected_card_ids",
            "connected_device_profiles", "exposure_usd", "evidence", "similar_prior_cases",
            "summary", "written_to_graph", "graph_case_id"
        ]
        for fld in required_case_fields:
            if fld not in c_obj:
                self.add_error(case_file_id, f"Check H: 'case' missing field '{fld}'")

        # Check I: Enums
        status = c_obj.get("status")
        if status not in ALLOWED_STATUSES:
            self.add_error(case_file_id, f"Check I: Invalid status '{status}'. Must be one of {sorted(list(ALLOWED_STATUSES))}")

        verdict = c_obj.get("verdict")
        if verdict not in ALLOWED_VERDICTS:
            self.add_error(case_file_id, f"Check I: Invalid verdict '{verdict}'. Must be one of {sorted(list(ALLOWED_VERDICTS))}")

        prob = c_obj.get("fraud_probability")
        if not isinstance(prob, (int, float)) or not (0.0 <= prob <= 1.0):
            self.add_error(case_file_id, f"Check H: 'fraud_probability' must be a number between 0.0 and 1.0, got {prob}")

        # Check R: pattern enum
        pattern = c_obj.get("pattern")
        if pattern not in ALLOWED_PATTERNS:
            self.add_error(case_file_id, f"Check R: Invalid pattern '{pattern}'. Must be one of {sorted(list(ALLOWED_PATTERNS))}")

        # Check S: pattern_description
        pat_desc = c_obj.get("pattern_description", "")
        if pattern == "undocumented":
            if not isinstance(pat_desc, str) or len(pat_desc.strip()) < 15:
                self.add_error(case_file_id, "Check S: When pattern is 'undocumented', 'pattern_description' must explain the pattern, affected entities, and detection method")
        else:
            if pat_desc != "":
                self.add_error(case_file_id, f"Check S: 'pattern_description' must be empty ('') when pattern is not 'undocumented', got '{pat_desc}'")

        # Check affected_txn_ids & exposure
        affected_txns = c_obj.get("affected_txn_ids")
        if not isinstance(affected_txns, list):
            self.add_error(case_file_id, "Check H: 'affected_txn_ids' must be a list of strings")
            affected_txns = []
        else:
            if len(affected_txns) != len(set(affected_txns)):
                self.add_error(case_file_id, "Check AH: 'affected_txn_ids' contains duplicate transaction IDs")

        # For legitimate verdict: affected_txn_ids must be empty and exposure_usd must be 0
        exposure = c_obj.get("exposure_usd")
        if not isinstance(exposure, (int, float)) or exposure < 0:
            self.add_error(case_file_id, f"Check P: 'exposure_usd' must be a non-negative number, got {exposure}")

        if verdict == "legitimate":
            if affected_txns:
                self.add_error(case_file_id, f"Check H: For legitimate verdict, 'affected_txn_ids' must be empty [], got {affected_txns}")
            if exposure != 0 and exposure != 0.0:
                self.add_error(case_file_id, f"Check P: For legitimate verdict, 'exposure_usd' must be 0, got {exposure}")

        first_suspicious = c_obj.get("first_suspicious_txn_id")
        if verdict == "legitimate" and first_suspicious != "":
            self.add_error(case_file_id, f"Check H: For legitimate verdict, 'first_suspicious_txn_id' must be empty '', got '{first_suspicious}'")

        # Check W: graph_case_id
        written_to_graph = c_obj.get("written_to_graph")
        if not isinstance(written_to_graph, bool):
            self.add_error(case_file_id, "Check W: 'written_to_graph' must be a boolean")
        graph_case_id = c_obj.get("graph_case_id")
        if written_to_graph and (not isinstance(graph_case_id, str) or not graph_case_id.strip()):
            self.add_error(case_file_id, "Check W: 'graph_case_id' must be non-empty string when written_to_graph is true")

        # Check AK: similar_prior_cases must exist in closed_cases_history.csv
        priors = c_obj.get("similar_prior_cases")
        if not isinstance(priors, list):
            self.add_error(case_file_id, "Check H: 'similar_prior_cases' must be a list of strings")
        else:
            for pid in priors:
                if self.valid_closed_cases and pid not in self.valid_closed_cases:
                    self.add_error(case_file_id, f"Check AK: Historical case '{pid}' in 'similar_prior_cases' does not exist in closed_cases_history.csv")

        # Check Evidence List (Check AG, AL)
        evidence_list = c_obj.get("evidence")
        if not isinstance(evidence_list, list):
            self.add_error(case_file_id, "Check H: 'evidence' must be a list of objects")
        else:
            seen_claim_refs = set()
            for idx, ev in enumerate(evidence_list):
                if not isinstance(ev, dict):
                    self.add_error(case_file_id, f"Check H: evidence item #{idx} must be an object")
                    continue
                for ev_field in ["claim", "source", "ref", "entity_ids"]:
                    if ev_field not in ev:
                        self.add_error(case_file_id, f"Check H: evidence item #{idx} missing '{ev_field}'")

                src = ev.get("source")
                if src not in ALLOWED_EVIDENCE_SOURCES:
                    self.add_error(case_file_id, f"Check H: Invalid evidence source '{src}'. Allowed: {sorted(list(ALLOWED_EVIDENCE_SOURCES))}")

                ref_key = ev.get("ref", "")
                if ref_key:
                    if ref_key in seen_claim_refs:
                        self.add_error(case_file_id, f"Check AG: Duplicate evidence ref '{ref_key}' inside case")
                    seen_claim_refs.add(ref_key)

        # Check N: evidence_requests
        ev_reqs = data.get("evidence_requests")
        if not isinstance(ev_reqs, list):
            self.add_error(case_file_id, "Check N: 'evidence_requests' must be a list of objects")
        else:
            for idx, er in enumerate(ev_reqs):
                if not isinstance(er, dict):
                    self.add_error(case_file_id, f"Check N: evidence_request #{idx} must be an object")
                    continue
                er_type = er.get("type")
                if er_type not in ALLOWED_EVIDENCE_TYPES:
                    self.add_error(case_file_id, f"Check N: Invalid evidence_request type '{er_type}'. Allowed: {sorted(list(ALLOWED_EVIDENCE_TYPES))}")
                if not isinstance(er.get("asked_after_step"), int):
                    self.add_error(case_file_id, f"Check N: evidence_request #{idx} 'asked_after_step' must be integer")
                if not isinstance(er.get("assumed_response"), str) or not er.get("assumed_response"):
                    self.add_error(case_file_id, f"Check N: evidence_request #{idx} 'assumed_response' must be non-empty string")

        # Check J, K, X, Y, Z: next_best_actions
        nba = data.get("next_best_actions")
        if not isinstance(nba, dict):
            self.add_error(case_file_id, "Check X/Y: 'next_best_actions' must be an object")
            return

        for nba_key in ["initial", "final", "what_changed"]:
            if nba_key not in nba:
                self.add_error(case_file_id, f"Check X/Y/Z: 'next_best_actions' missing '{nba_key}'")

        initial_acts = nba.get("initial", [])
        final_acts = nba.get("final", [])
        what_changed = nba.get("what_changed", "")

        if not isinstance(initial_acts, list) or len(initial_acts) == 0:
            self.add_error(case_file_id, "Check M & X: 'next_best_actions.initial' must be a non-empty list")
        if not isinstance(final_acts, list) or len(final_acts) == 0:
            self.add_error(case_file_id, "Check M & Y: 'next_best_actions.final' must be a non-empty list")

        # Validate action names and routes
        final_action_names = []
        for stage, act_list in [("initial", initial_acts), ("final", final_acts)]:
            if isinstance(act_list, list):
                for idx, item in enumerate(act_list):
                    if not isinstance(item, dict):
                        self.add_error(case_file_id, f"Check J: {stage} action #{idx} must be an object")
                        continue
                    act_name = item.get("action")
                    route = item.get("route")
                    reason = item.get("reason", "")

                    if stage == "final":
                        final_action_names.append(act_name)

                    if act_name not in ALLOWED_ACTIONS:
                        self.add_error(case_file_id, f"Check J: Unsupported action name '{act_name}' in {stage}")
                    if route not in ALLOWED_ROUTES:
                        self.add_error(case_file_id, f"Check K: Unsupported route '{route}' in {stage}")

                    # Check exact approval route rules (Policy Section 2)
                    self.validate_approval_route(case_file_id, stage, act_name, route, exposure, reason)

        # Check Z: what_changed logic
        if not isinstance(what_changed, str) or not what_changed.strip():
            self.add_error(case_file_id, "Check Z: 'what_changed' must be non-empty string")
        if not ev_reqs:
            if what_changed.lower() != "nothing":
                self.add_error(case_file_id, f"Check Z: When no evidence requested, what_changed must be 'nothing', got '{what_changed}'")
            if initial_acts != final_acts:
                self.add_error(case_file_id, "Check Z: When no evidence requested, final actions must equal initial actions")

        # Check L, T, U, V: SAR Object
        sar = data.get("sar")
        if not isinstance(sar, dict):
            self.add_error(case_file_id, "Check L: 'sar' must be an object")
            return

        for sar_key in ["file", "reason", "narrative", "subjects", "total_amount_usd", "activity_dates"]:
            if sar_key not in sar:
                self.add_error(case_file_id, f"Check L: 'sar' missing '{sar_key}'")

        sar_file = sar.get("file")
        if not isinstance(sar_file, bool):
            self.add_error(case_file_id, "Check L: sar.file must be boolean")

        # Check V: sar.file agrees with whether FILE_REPORT appears in final actions
        has_file_report = "FILE_REPORT" in final_action_names
        if sar_file != has_file_report:
            self.add_error(case_file_id, f"Check V: sar.file ({sar_file}) does not agree with FILE_REPORT in final actions ({has_file_report})")

        sar_narrative = sar.get("narrative", "")
        sar_subjects = sar.get("subjects", [])
        sar_total = sar.get("total_amount_usd", 0)
        sar_dates = sar.get("activity_dates", [])

        if sar_file:
            # Check T: narrative exists, 6-12 sentences, contains WHO, WHAT, WHEN, WHERE, HOW, WHY
            if not isinstance(sar_narrative, str) or not sar_narrative.strip():
                self.add_error(case_file_id, "Check T: sar.file == true requires a non-empty narrative")
            else:
                sentences = [s.strip() for s in re.split(r"[.!?]+", sar_narrative) if len(s.strip()) > 8]
                sentence_count = len(sentences)
                if not (6 <= sentence_count <= 14):  # allow reasonable margin
                    self.add_error(case_file_id, f"Check T: SAR narrative must be 6–12 sentences, found {sentence_count}")

            if not isinstance(sar_subjects, list) or len(sar_subjects) == 0:
                self.add_error(case_file_id, "Check T: sar.file == true requires non-empty subjects list")

            if not isinstance(sar_total, (int, float)) or sar_total <= 0:
                self.add_error(case_file_id, f"Check T: sar.file == true requires total_amount_usd > 0, got {sar_total}")

            # Check Q: activity_dates must be list of two YYYY-MM-DD
            if not isinstance(sar_dates, list) or len(sar_dates) != 2:
                self.add_error(case_file_id, "Check Q: sar.activity_dates must be a list of two date strings [YYYY-MM-DD, YYYY-MM-DD]")
            else:
                for d_str in sar_dates:
                    if not isinstance(d_str, str) or not DATE_REGEX.match(d_str):
                        self.add_error(case_file_id, f"Check Q: Invalid activity_date '{d_str}', expected YYYY-MM-DD")
        else:
            # Check U: When sar.file == false: narrative="", subjects=[], total_amount_usd=0, activity_dates=[]
            if sar_narrative != "":
                self.add_error(case_file_id, f"Check U: When sar.file is false, narrative must be empty (''), got '{sar_narrative[:30]}...'")
            if sar_subjects != []:
                self.add_error(case_file_id, f"Check U: When sar.file is false, subjects must be [], got {sar_subjects}")
            if sar_total != 0 and sar_total != 0.0:
                self.add_error(case_file_id, f"Check U: When sar.file is false, total_amount_usd must be 0, got {sar_total}")
            if sar_dates != []:
                self.add_error(case_file_id, f"Check U: When sar.file is false, activity_dates must be [], got {sar_dates}")

        print(f"[PASS] {case_file_id} schema & consistency")

    def validate_approval_route(self, case_id: str, stage: str, action: str, route: str, exposure: float, reason: str):
        """Validates approval routing rules strictly according to Fraud Policy Section 2."""
        # auto actions
        auto_actions = {
            "ALLOW_TRANSACTION", "MONITOR_CARD", "MONITOR_CONNECTED_CARDS", "WARN_CUSTOMER",
            "VERIFY_WITH_CUSTOMER", "STEP_UP_AUTH", "GENERATE_REPORT", "CREATE_CASE",
            "ESCALATE_TO_ANALYST", "CLOSE_NO_FRAUD"
        }
        if action in auto_actions and route != "auto":
            self.add_error(case_id, f"Check K: Action '{action}' in {stage} must have route 'auto', got '{route}'")

        # L1 actions
        if action == "DECLINE_TRANSACTION" and route != "L1":
            self.add_error(case_id, f"Check K: Action 'DECLINE_TRANSACTION' in {stage} must have route 'L1', got '{route}'")

        if action == "BLOCK_CARD":
            if exposure <= 2500.0 and route != "L1":
                self.add_error(case_id, f"Check K: 'BLOCK_CARD' with exposure <= $2,500 (${exposure:.2f}) must have route 'L1', got '{route}'")
            elif exposure > 2500.0 and route != "L2":
                self.add_error(case_id, f"Check K: 'BLOCK_CARD' with exposure > $2,500 (${exposure:.2f}) must have route 'L2', got '{route}'")

        # L2 always actions
        if action in {"BLOCK_ALL_CARDS", "FILE_REPORT"} and route != "L2":
            self.add_error(case_id, f"Check K: Action '{action}' in {stage} must always have route 'L2', got '{route}'")

    def _print_results(self):
        print("\n====================================================")
        if not self.errors:
            print("RESULT: SUBMISSION READY")
            print(f"All 20 case files in '{self.cases_dir.name}/' validated successfully!")
            print("====================================================")
        else:
            print("RESULT: NOT READY")
            print(f"Validation failed with {len(self.errors)} error(s):")
            for err in self.errors:
                print(f"  - {err}")
            print("====================================================")


def main():
    target_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else CASES_DIR
    validator = SubmissionValidator(target_dir)
    success = validator.validate_all()
    sys.exit(0 if success else 1)


if __name__ == "__main__":
    main()
