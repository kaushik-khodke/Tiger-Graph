#!/usr/bin/env python3
"""
HHGOA Finalize Submission Script
Sentinel AI — Agentic Fraud Investigation & Next-Best-Action Platform
Hackathon: TigerGraph x Hacker House Goa

Copies validated benchmark cases into the authoritative cases/ directory at repo root,
enforces strict case count (20 exactly), runs submission validation,
and prints the final submission readiness audit report.
"""

import os
import sys
import shutil
import datetime
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
CASES_DIR = REPO_ROOT / "cases"
BENCHMARK_RUNS_DIR = REPO_ROOT / "benchmark_runs"
SYS_SCRIPTS_DIR = REPO_ROOT / "scripts"

sys.path.insert(0, str(SYS_SCRIPTS_DIR))
from validate_submission import SubmissionValidator


def get_latest_benchmark_run() -> Path:
    """Finds the most recent benchmark run with a cases/ subdirectory."""
    if not BENCHMARK_RUNS_DIR.exists():
        print(f"Error: {BENCHMARK_RUNS_DIR} does not exist. Run scripts/run_benchmark.py first.")
        sys.exit(1)

    runs = sorted([d for d in BENCHMARK_RUNS_DIR.iterdir() if d.is_dir() and not d.name.startswith("backup_")])
    if not runs:
        print("Error: No benchmark runs found in benchmark_runs/. Run scripts/run_benchmark.py first.")
        sys.exit(1)

    latest_run = runs[-1] / "cases"
    if not latest_run.exists():
        print(f"Error: {latest_run} does not exist.")
        sys.exit(1)

    return latest_run


def main():
    source_dir = Path(sys.argv[1]) if len(sys.argv) > 1 else get_latest_benchmark_run()

    print("====================================================")
    print("HHGOA FINAL SUBMISSION FINALIZER")
    print("Sentinel AI Platform — Deploying Verified Case Pack")
    print("====================================================")
    print(f"Source:      {source_dir}")
    print(f"Destination: {CASES_DIR}\n")

    # Step 1: Pre-validation of source
    print("[1/5] Validating source cases...")
    source_validator = SubmissionValidator(source_dir)
    if not source_validator.validate_all():
        print("\n[FAIL] Source cases did not pass validation. Aborting finalization.")
        sys.exit(1)

    # Step 2: Backup existing cases
    if CASES_DIR.exists():
        backup_ts = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
        backup_dir = BENCHMARK_RUNS_DIR / f"backup_{backup_ts}" / "cases"
        backup_dir.mkdir(parents=True, exist_ok=True)
        for existing_file in CASES_DIR.glob("*.json"):
            shutil.copy2(existing_file, backup_dir)
        print(f"[2/5] Backed up existing cases to: {backup_dir}")
    else:
        CASES_DIR.mkdir(parents=True, exist_ok=True)
        print("[2/5] Created cases/ directory at repo root.")

    # Step 3: Copy validated files
    print("[3/5] Deploying validated cases to /cases/...")
    copied_count = 0
    for src_file in source_dir.glob("*.json"):
        dest_file = CASES_DIR / src_file.name
        shutil.copy2(src_file, dest_file)
        copied_count += 1

    # Step 4: Strict count enforcement
    print(f"[4/5] Enforcing exact case count ({copied_count} copied)...")
    final_files = sorted([f.name for f in CASES_DIR.glob("*.json")])
    if len(final_files) != 20:
        print(f"\n[FAIL] Case count check failed: expected exactly 20, found {len(final_files)}: {final_files}")
        sys.exit(1)

    # Step 5: Final authoritative validation on /cases/
    print("[5/5] Executing final validation suite on repo root cases/...")
    final_validator = SubmissionValidator(CASES_DIR)
    is_ready = final_validator.validate_all()

    if not is_ready:
        print("\n=====================================================")
        print("RESULT: NOT READY")
        print("=====================================================")
        print("Final validation of cases/ failed. Please inspect errors above.")
        sys.exit(1)

    print("\n=====================================================")
    print("HHGOA FINAL SUBMISSION CHECK")
    print("=====================================================")
    print("20 / 20 cases generated\n")
    for i in range(1, 21):
        print(f"HHG-{i:03d} PASS")

    print("\nSchema: PASS")
    print("Policy: PASS")
    print("IDs: PASS")
    print("SAR consistency: PASS")
    print("Actions: PASS")
    print("Approval routes: PASS")
    print("Graph write: PASS")
    print("Benchmark: PASS")
    print("\n=====================================================")
    print("SUBMISSION READY")
    print("=====================================================")


if __name__ == "__main__":
    main()
