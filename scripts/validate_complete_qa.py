#!/usr/bin/env python3
"""Validate every complete-qa.json under content/ against the canonical schema.

Usage:
  python3 scripts/validate_complete_qa.py
  python3 scripts/validate_complete_qa.py <file>...
Exit code: 0 = all valid, 1 = drift found, 2 = validator failed to run.
"""

from __future__ import annotations

import json
import sys
from pathlib import Path

try:
    from jsonschema import Draft202012Validator
except ImportError:
    print("Install jsonschema: python3 -m pip install jsonschema", file=sys.stderr)
    sys.exit(2)

REPO_ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = REPO_ROOT / "content" / "_schemas" / "complete-qa.schema.json"


def find_files() -> list[Path]:
    return sorted((REPO_ROOT / "content").rglob("complete-qa.json"))


def main(argv: list[str]) -> int:
    if not SCHEMA_PATH.exists():
        print(f"Schema missing: {SCHEMA_PATH}", file=sys.stderr)
        return 2

    schema = json.loads(SCHEMA_PATH.read_text())
    validator = Draft202012Validator(schema)

    files = [Path(p) for p in argv[1:]] if len(argv) > 1 else find_files()
    failed = 0

    for fp in files:
        try:
            doc = json.loads(fp.read_text())
        except json.JSONDecodeError as exc:
            print(f"INVALID JSON: {fp}: {exc}")
            failed += 1
            continue
        errors = sorted(validator.iter_errors(doc), key=lambda e: tuple(e.absolute_path))
        if errors:
            failed += 1
            for err in errors:
                loc = "/".join(str(p) for p in err.absolute_path) or "<root>"
                print(f"SCHEMA: {fp}: {loc}: {err.message}")

    total = len(files)
    print(f"\nValidated {total} files. {total - failed} OK, {failed} failed.")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
