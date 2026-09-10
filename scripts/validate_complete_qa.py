#!/usr/bin/env python3
"""Validate every complete-qa.json under content/ against the canonical schema.

Usage:
  python3 scripts/validate_complete_qa.py
  python3 scripts/validate_complete_qa.py <file>...
  python3 scripts/validate_complete_qa.py --summary [file|directory ...]
Exit code: 0 = all valid, 1 = drift found, 2 = validator failed to run.
"""

from __future__ import annotations

import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

try:
    from jsonschema import Draft202012Validator
except ImportError:
    print("Install jsonschema: python3 -m pip install jsonschema", file=sys.stderr)
    sys.exit(2)

REPO_ROOT = Path(__file__).resolve().parents[1]
SCHEMA_PATH = REPO_ROOT / "content" / "_schemas" / "complete-qa.schema.json"


def branch_validator(schema: dict, document: object) -> Draft202012Validator:
    """Validate against the applicable root shape without noisy oneOf errors."""
    if isinstance(document, list):
        branch = schema["oneOf"][0]
    elif isinstance(document, dict):
        branch = {"$ref": "#/$defs/document"}
    else:
        return Draft202012Validator(schema)

    branch_schema = {
        "$schema": schema["$schema"],
        "$defs": schema["$defs"],
        **branch,
    }
    return Draft202012Validator(branch_schema)


def error_path(error, *, collapse_indexes: bool) -> str:
    """Render a canonical question path, optionally collapsing array indexes."""
    parts = list(error.absolute_path)
    if parts and isinstance(parts[0], int):
        parts.insert(0, "questions")
    rendered = [
        "[]" if collapse_indexes and isinstance(part, int) else str(part)
        for part in parts
    ]
    return "/".join(rendered) or "<root>"


def error_signature(error) -> str:
    """Return a stable taxonomy key without embedding the invalid document."""
    path = error_path(error, collapse_indexes=True)
    if error.validator == "required":
        match = re.match(r"'([^']+)' is a required property", error.message)
        missing = match.group(1) if match else "unknown"
        return f"{path}: missing required property '{missing}'"
    if error.validator == "type":
        return f"{path}: expected type {error.validator_value!r}"
    if error.validator == "enum":
        return f"{path}: value outside the allowed enum"
    if error.validator == "pattern":
        return f"{path}: value does not match {error.validator_value!r}"
    if error.validator == "minLength":
        return f"{path}: shorter than {error.validator_value} characters"
    if error.validator == "maxLength":
        return f"{path}: longer than {error.validator_value} characters"
    if error.validator == "minItems":
        return f"{path}: fewer than {error.validator_value} items"
    if error.validator == "maxItems":
        return f"{path}: more than {error.validator_value} items"
    if error.validator == "contains":
        zone = error.schema.get("description", "a required section")
        return f"{path}: missing {zone}"
    if error.validator in {"anyOf", "oneOf"}:
        return f"{path}: does not match any allowed shape"
    return f"{path}: {error.validator}: {error.message}"


def find_files() -> list[Path]:
    return sorted((REPO_ROOT / "content").rglob("complete-qa.json"))


def resolve_files(args: list[str]) -> list[Path]:
    """Resolve explicit files/directories without making callers expand globs."""
    if not args:
        return find_files()

    files: list[Path] = []
    for raw in args:
        path = Path(raw)
        if path.is_dir():
            files.extend(sorted(path.rglob("complete-qa.json")))
        else:
            files.append(path)
    return sorted(dict.fromkeys(files))


def main(argv: list[str]) -> int:
    if not SCHEMA_PATH.exists():
        print(f"Schema missing: {SCHEMA_PATH}", file=sys.stderr)
        return 2

    schema = json.loads(SCHEMA_PATH.read_text())
    Draft202012Validator.check_schema(schema)

    summary = "--summary" in argv[1:]
    targets = [arg for arg in argv[1:] if arg != "--summary"]
    files = resolve_files(targets)
    failed = 0
    taxonomy: Counter[str] = Counter()
    taxonomy_files: defaultdict[str, set[Path]] = defaultdict(set)

    for fp in files:
        try:
            doc = json.loads(fp.read_text())
        except json.JSONDecodeError as exc:
            if not summary:
                print(f"INVALID JSON: {fp}: {exc}")
            failed += 1
            continue
        validator = branch_validator(schema, doc)
        errors = sorted(
            validator.iter_errors(doc),
            key=lambda error: tuple(str(part) for part in error.absolute_path),
        )
        if errors:
            failed += 1
            for err in errors:
                signature = error_signature(err)
                taxonomy[signature] += 1
                taxonomy_files[signature].add(fp)
                if not summary:
                    path = error_path(err, collapse_indexes=False)
                    print(f"SCHEMA: {fp}: {path}: {err.message}")

    total = len(files)
    if summary and taxonomy:
        print("Failure taxonomy (files / occurrences):")
        for signature, occurrences in sorted(
            taxonomy.items(),
            key=lambda item: (-len(taxonomy_files[item[0]]), -item[1], item[0]),
        ):
            print(f"  {len(taxonomy_files[signature]):>3} / {occurrences:<4}  {signature}")
    print(f"\nValidated {total} files. {total - failed} OK, {failed} failed.")
    return 0 if failed == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv))
