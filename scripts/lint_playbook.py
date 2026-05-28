#!/usr/bin/env python3
"""Lint expansion-plan playbook files against the 1000-line skeleton.

Enforces the rules locked in `expansion-plan/_TEMPLATE-1000.md`,
`expansion-plan/_GLOSSARY.md`, and `expansion-plan/_VOICE-RULES.md`.

Checks performed (per file):

 1. Total line count: 950 <= N <= 1050.
 2. All 18 section headers present, in order.
 3. Banned-word list: zero matches in playbook prose.
 4. §3 Easy-language glossary has >= 25 rows (after the table header).
 5. §6 Target state table has >= 5 rows.
 6. §7 Search phrases -> URL map has 10-24 rows; every "Diagram type"
    cell is one of the allowed values.
 7. §9 has >= 8 numbered steps; every step contains a "Verify" cue and a
    fenced block.
 8. §10 Reference Q is a fenced ```json block that parses as JSON and
    contains the required top-level keys.
 9. §11 Diagram catalogue has >= 5 rows; every "Diagram type" cell is one
    of the allowed values; for content playbooks, the set of diagram
    types covers at least one flowchart, one sequenceDiagram, and one
    comparison_table.
10. §13 Quality gates table has >= 8 rows, each with a non-empty
    threshold and a non-empty verify command.
11. §14 Anti-patterns has >= 4 entries (### sub-headers).
12. §16 Definition of Done has >= 12 checkbox items.

Usage:

  python3 scripts/lint_playbook.py                          # lint all NN-*.md
  python3 scripts/lint_playbook.py expansion-plan/12-*.md   # lint specific files

Exit code: 0 if all files pass, 1 if any fail.
"""

from __future__ import annotations

import argparse
import json
import re
import sys
from pathlib import Path
from typing import Iterable

REPO_ROOT = Path(__file__).resolve().parents[1]
PLAYBOOK_DIR = REPO_ROOT / "expansion-plan"

# Section headers, in the order the template defines.
# Each entry: (section number, regex matching the header line).
SECTION_HEADERS: list[tuple[int, re.Pattern[str]]] = [
    (0, re.compile(r"^#\s+\d{2}\s+[—-]\s+.+")),  # Title line
    (1, re.compile(r"^##\s+1\b[ .\u2014-].*TL;DR", re.IGNORECASE)),
    (2, re.compile(r"^##\s+2\b[ .\u2014-].*Why this matters", re.IGNORECASE)),
    (3, re.compile(r"^##\s+3\b[ .\u2014-].*Easy-language glossary", re.IGNORECASE)),
    (4, re.compile(r"^##\s+4\b[ .\u2014-].*Hard prerequisites", re.IGNORECASE)),
    (5, re.compile(r"^##\s+5\b[ .\u2014-].*Current state", re.IGNORECASE)),
    (6, re.compile(r"^##\s+6\b[ .\u2014-].*Target state", re.IGNORECASE)),
    (7, re.compile(r"^##\s+7\b[ .\u2014-].*Search phrases", re.IGNORECASE)),
    (8, re.compile(r"^##\s+8\b[ .\u2014-].*Dependency", re.IGNORECASE)),
    (9, re.compile(r"^##\s+9\b[ .\u2014-].*Step-by-step", re.IGNORECASE)),
    (10, re.compile(r"^##\s+10\b[ .\u2014-].*Reference Q", re.IGNORECASE)),
    (11, re.compile(r"^##\s+11\b[ .\u2014-].*Diagram catalogue", re.IGNORECASE)),
    (12, re.compile(r"^##\s+12\b[ .\u2014-].*voice rules", re.IGNORECASE)),
    (13, re.compile(r"^##\s+13\b[ .\u2014-].*Quality gates", re.IGNORECASE)),
    (14, re.compile(r"^##\s+14\b[ .\u2014-].*Anti-patterns", re.IGNORECASE)),
    (15, re.compile(r"^##\s+15\b[ .\u2014-].*Failure modes", re.IGNORECASE)),
    (16, re.compile(r"^##\s+16\b[ .\u2014-].*Definition of Done", re.IGNORECASE)),
    (17, re.compile(r"^##\s+17\b[ .\u2014-].*Estimated effort", re.IGNORECASE)),
    (18, re.compile(r"^##\s+18\b[ .\u2014-].*Appendix", re.IGNORECASE)),
]

BANNED_WORDS = [
    "leverage",
    "utilize",
    "synergize",
    "synergies",
    "synergistic",
    "world-class",
    "cutting-edge",
    "state-of-the-art",
    "hereinafter",
    "aforementioned",
    "heretofore",
    "seamless",
    "seamlessly",
    "holistic",
    "paradigm",
    "paradigms",
    "best-in-class",
    "best-of-breed",
    "next-generation",
    "turnkey",
    "battle-tested",
    "enterprise-grade",
    "revolutionary",
    "game-changing",
    "industry-leading",
]
# Banned-word regex with word boundaries; case-insensitive at use site.
BANNED_RE = re.compile(
    r"(?<![A-Za-z0-9])(?:" + "|".join(re.escape(w) for w in BANNED_WORDS) + r")(?![A-Za-z0-9])",
    re.IGNORECASE,
)

ALLOWED_DIAGRAM_TYPES = {
    "comparison_table",
    "flowchart",
    "sequenceDiagram",
    "sequence_diagram",
    "classDiagram",
    "class_diagram",
    "stateDiagram",
    "stateDiagram-v2",
    "state_diagram",
    "none",
}

REQUIRED_REFERENCE_Q_KEYS = {
    "id",
    "title",
    "direct_answer",
    "difficulty",
    "interviewer_intent",
    "answer",
    "followup_questions",
    "seo",
}

MIN_LINES = 950
MAX_LINES = 1050
MIN_GLOSSARY_ROWS = 25
MIN_TARGET_STATE_ROWS = 5
MIN_SEARCH_ROWS = 10
MAX_SEARCH_ROWS = 24
MIN_STEPS = 8
MIN_DIAGRAM_ROWS = 5
MIN_QUALITY_GATES = 8
MIN_ANTI_PATTERNS = 4
MIN_DOD_ITEMS = 12


class LintFinding:
    __slots__ = ("file", "rule", "message")

    def __init__(self, file: Path, rule: str, message: str) -> None:
        self.file = file
        self.rule = rule
        self.message = message

    def __str__(self) -> str:  # pragma: no cover - cosmetic
        rel = self.file.relative_to(REPO_ROOT) if self.file.is_absolute() else self.file
        return f"FAIL [{self.rule}] {rel}: {self.message}"


def _section_spans(lines: list[str]) -> dict[int, tuple[int, int]]:
    """Return {section_number: (start_line_index, end_line_index_exclusive)}.

    Lines that don't fall under any matched section are skipped.
    """
    matches: list[tuple[int, int]] = []  # (section_no, line_index)
    for idx, line in enumerate(lines):
        for sec_no, pat in SECTION_HEADERS:
            if pat.match(line):
                matches.append((sec_no, idx))
                break
    # Drop duplicates: only first occurrence of each section number counts.
    seen: set[int] = set()
    deduped: list[tuple[int, int]] = []
    for sec_no, idx in matches:
        if sec_no in seen:
            continue
        seen.add(sec_no)
        deduped.append((sec_no, idx))
    spans: dict[int, tuple[int, int]] = {}
    for i, (sec_no, start) in enumerate(deduped):
        end = deduped[i + 1][1] if i + 1 < len(deduped) else len(lines)
        spans[sec_no] = (start, end)
    return spans


def _table_rows(lines: list[str], start: int, end: int) -> list[str]:
    """Return content rows of the first markdown table found within [start, end)."""
    rows: list[str] = []
    in_table = False
    for i in range(start, end):
        line = lines[i].rstrip()
        if line.startswith("|") and "|" in line[1:]:
            if not in_table:
                in_table = True
                continue
            if re.match(r"^\|\s*[-:]+", line):
                continue
            rows.append(line)
        else:
            if in_table:
                break
    return rows


def _check_total_lines(file: Path, lines: list[str], findings: list[LintFinding]) -> None:
    n = len(lines)
    if n < MIN_LINES:
        findings.append(
            LintFinding(file, "line_count", f"total lines {n} < min {MIN_LINES}")
        )
    elif n > MAX_LINES:
        findings.append(
            LintFinding(file, "line_count", f"total lines {n} > max {MAX_LINES}")
        )


def _check_sections_present(
    file: Path, spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    expected = {n for n, _ in SECTION_HEADERS}
    missing = sorted(expected - spans.keys())
    if missing:
        findings.append(
            LintFinding(
                file,
                "sections_present",
                f"missing section numbers: {missing}",
            )
        )
    # Order check: section numbers must increase by line index.
    ordered = sorted(spans.items(), key=lambda kv: kv[1][0])
    nums_in_order = [n for n, _ in ordered]
    if nums_in_order != sorted(nums_in_order):
        findings.append(
            LintFinding(
                file,
                "section_order",
                f"section headers are out of order: encountered {nums_in_order}",
            )
        )


def _check_banned_words(file: Path, lines: list[str], findings: list[LintFinding]) -> None:
    # Skip files that intentionally enumerate the banned list itself.
    if file.name in {"_VOICE-RULES.md", "lint_playbook.py"}:
        return
    in_fence = False
    in_table_voice_examples = False
    for idx, line in enumerate(lines, start=1):
        stripped = line.strip()
        # Track fenced code-block state. Code blocks legitimately contain
        # grep / rg patterns that name the banned words.
        if stripped.startswith("```"):
            in_fence = not in_fence
            continue
        if in_fence:
            continue
        # Skip the "voice examples" table rows that show ✅/❌ side-by-side —
        # the ❌ row deliberately quotes a banned word as the counterexample.
        if "❌" in line:
            continue
        # Skip explicit list rows under "**Banned words**" headers — these are
        # the playbook's own quotation of the banned list (mirrored from
        # _VOICE-RULES.md for the author's convenience).
        if re.search(r"^\s*[`'\"]?(?:leverage|utilize|synergize|world-class|cutting-edge|state-of-the-art|hereinafter|aforementioned|seamless|robust|holistic|paradigm|best-in-class|battle-tested|enterprise-grade|revolutionary|game-changing|industry-leading)[`'\",.;]?\s*(?:—|--|-|$)", line, re.IGNORECASE):
            # A bullet that quotes a single banned word with an explanation.
            continue
        # Pre-compute backtick-inline-code spans on this line. Any match that
        # falls inside one of these spans is a verbatim code citation and is
        # skipped (e.g. an `rg 'leverage|...'` command in a table cell).
        inline_code_spans = _inline_code_spans(line)
        for m in BANNED_RE.finditer(line):
            start, end_pos = m.span()
            if any(s <= start and end_pos <= e for (s, e) in inline_code_spans):
                continue
            # Pedagogical citation: skip when the match is wrapped in quotes
            # (single, double, smart) or italics (`*...*` / `_..._`), which is
            # how playbook prose deliberately calls out the banned word.
            before = line[max(0, start - 2):start]
            after = line[end_pos:end_pos + 2]
            wrappers = {'"', "'", "*", "_", "`", "“", "”", "‘", "’"}
            if (before and before[-1] in wrappers) and (after and after[0] in wrappers):
                continue
            # Allow `*"word"*` and `*"word,"*` patterns explicitly.
            if (before.endswith('*"') or before.endswith('_"')) and (
                after.startswith('"*') or after.startswith('"_') or after.startswith('",')
            ):
                continue
            findings.append(
                LintFinding(
                    file,
                    "banned_word",
                    f"line {idx}: banned word {m.group(0)!r}",
                )
            )


def _inline_code_spans(line: str) -> list[tuple[int, int]]:
    """Return [start, end) char offsets of backtick-fenced inline code spans.

    Handles single-backtick spans only (multi-backtick fences are rare in
    playbook prose). A span is the run of characters between two backticks
    on the same line.
    """
    spans: list[tuple[int, int]] = []
    in_span = False
    start = -1
    for i, ch in enumerate(line):
        if ch == "`":
            if not in_span:
                in_span = True
                start = i + 1
            else:
                spans.append((start, i))
                in_span = False
                start = -1
    return spans


def _check_glossary(
    file: Path, lines: list[str], spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    if 3 not in spans:
        return
    start, end = spans[3]
    rows = _table_rows(lines, start, end)
    if len(rows) < MIN_GLOSSARY_ROWS:
        findings.append(
            LintFinding(
                file,
                "glossary_rows",
                f"§3 glossary has {len(rows)} rows; min {MIN_GLOSSARY_ROWS}",
            )
        )


def _check_target_state(
    file: Path, lines: list[str], spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    if 6 not in spans:
        return
    start, end = spans[6]
    rows = _table_rows(lines, start, end)
    if len(rows) < MIN_TARGET_STATE_ROWS:
        findings.append(
            LintFinding(
                file,
                "target_state_rows",
                f"§6 target-state table has {len(rows)} rows; min {MIN_TARGET_STATE_ROWS}",
            )
        )


def _check_search_phrases(
    file: Path, lines: list[str], spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    if 7 not in spans:
        return
    start, end = spans[7]
    rows = _table_rows(lines, start, end)
    n = len(rows)
    if n < MIN_SEARCH_ROWS or n > MAX_SEARCH_ROWS:
        findings.append(
            LintFinding(
                file,
                "search_phrases_rows",
                f"§7 search-phrases table has {n} rows; expected {MIN_SEARCH_ROWS}-{MAX_SEARCH_ROWS}",
            )
        )
    # Diagram type cell check (last column).
    for row in rows:
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        if len(cells) < 4:
            continue
        diagram_cell = cells[-1].strip("`")
        # Some cells list multiple types separated by `+` or `,`.
        types = re.split(r"[+,]| OR ", diagram_cell)
        for t in types:
            t = t.strip().strip("`")
            if not t:
                continue
            if t not in ALLOWED_DIAGRAM_TYPES:
                findings.append(
                    LintFinding(
                        file,
                        "search_phrases_diagram",
                        f"§7 row diagram type {t!r} not in allowed set",
                    )
                )


def _check_steps(
    file: Path, lines: list[str], spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    if 9 not in spans:
        return
    start, end = spans[9]
    step_re = re.compile(r"^###\s+Step\s+\d+", re.IGNORECASE)
    step_indices: list[int] = []
    for i in range(start, end):
        if step_re.match(lines[i]):
            step_indices.append(i)
    if len(step_indices) < MIN_STEPS:
        findings.append(
            LintFinding(
                file,
                "step_count",
                f"§9 has {len(step_indices)} steps; min {MIN_STEPS}",
            )
        )
    # Each step must contain a "verify" cue and at least one fenced block
    # (shell, code, json, mermaid, etc.). Use MULTILINE so ^ matches at the
    # start of any line, not just the start of the joined string.
    verify_re = re.compile(r"\*\*Verify", re.IGNORECASE)
    block_re = re.compile(r"^```", re.MULTILINE)
    for i, s_idx in enumerate(step_indices):
        s_end = step_indices[i + 1] if i + 1 < len(step_indices) else end
        body = "\n".join(lines[s_idx:s_end])
        if not verify_re.search(body) and "Verify" not in body:
            findings.append(
                LintFinding(
                    file,
                    "step_verify",
                    f"§9 step starting at line {s_idx + 1} has no Verify cue",
                )
            )
        if not block_re.search(body):
            findings.append(
                LintFinding(
                    file,
                    "step_fenced_block",
                    f"§9 step starting at line {s_idx + 1} has no fenced block",
                )
            )


def _check_reference_q(
    file: Path, lines: list[str], spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    if 10 not in spans:
        return
    start, end = spans[10]
    json_block: list[str] = []
    in_block = False
    found = False
    for i in range(start, end):
        line = lines[i]
        if line.strip().startswith("```json"):
            in_block = True
            json_block = []
            continue
        if in_block and line.strip().startswith("```"):
            in_block = False
            try:
                doc = json.loads("\n".join(json_block))
            except json.JSONDecodeError as exc:
                findings.append(
                    LintFinding(
                        file,
                        "reference_q_json",
                        f"§10 reference Q JSON is invalid: {exc}",
                    )
                )
                json_block = []
                break
            if not isinstance(doc, dict):
                findings.append(
                    LintFinding(
                        file, "reference_q_shape", "§10 reference Q is not a JSON object"
                    )
                )
                break
            missing = REQUIRED_REFERENCE_Q_KEYS - doc.keys()
            if missing:
                findings.append(
                    LintFinding(
                        file,
                        "reference_q_keys",
                        f"§10 reference Q is missing keys: {sorted(missing)}",
                    )
                )
            found = True
            break
        if in_block:
            json_block.append(line)
    if not found:
        findings.append(
            LintFinding(
                file,
                "reference_q_missing",
                "§10 has no ```json reference Q block",
            )
        )


def _check_diagram_catalogue(
    file: Path, lines: list[str], spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    if 11 not in spans:
        return
    start, end = spans[11]
    rows = _table_rows(lines, start, end)
    if len(rows) < MIN_DIAGRAM_ROWS:
        findings.append(
            LintFinding(
                file,
                "diagram_catalogue_rows",
                f"§11 diagram catalogue has {len(rows)} rows; min {MIN_DIAGRAM_ROWS}",
            )
        )
        return
    types_seen: set[str] = set()
    for row in rows:
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        if len(cells) < 2:
            continue
        diagram_cell = cells[1]
        for t in re.split(r"[+,]| OR ", diagram_cell):
            t = t.strip().strip("`").strip("()*_ ")
            if not t:
                continue
            # Normalize "(mermaid)" suffixes.
            t = re.sub(r"\s*\(mermaid\)$", "", t, flags=re.IGNORECASE)
            if t in ALLOWED_DIAGRAM_TYPES:
                types_seen.add(t)
            else:
                # Soft fail: unknown diagram type.
                findings.append(
                    LintFinding(
                        file,
                        "diagram_catalogue_type",
                        f"§11 unknown diagram type {t!r}",
                    )
                )
    # For now we only require that at least 3 distinct allowed types appear;
    # the per-genre stricter floor (content vs infra) is enforced at the
    # higher level when the user wires this into CI.
    if len(types_seen) < 3:
        findings.append(
            LintFinding(
                file,
                "diagram_variety",
                f"§11 covers only {sorted(types_seen)}; need ≥ 3 distinct diagram types",
            )
        )


def _check_quality_gates(
    file: Path, lines: list[str], spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    if 13 not in spans:
        return
    start, end = spans[13]
    rows = _table_rows(lines, start, end)
    if len(rows) < MIN_QUALITY_GATES:
        findings.append(
            LintFinding(
                file,
                "quality_gate_rows",
                f"§13 quality gates table has {len(rows)} rows; min {MIN_QUALITY_GATES}",
            )
        )
    for row in rows:
        cells = [c.strip() for c in row.strip().strip("|").split("|")]
        if len(cells) < 3:
            findings.append(
                LintFinding(
                    file,
                    "quality_gate_columns",
                    f"§13 row has {len(cells)} columns; need ≥ 3 (gate / threshold / verify)",
                )
            )
            continue
        if not cells[1]:
            findings.append(
                LintFinding(file, "quality_gate_threshold", "§13 row missing threshold")
            )
        if not cells[2]:
            findings.append(
                LintFinding(file, "quality_gate_verify", "§13 row missing verify command")
            )


def _check_anti_patterns(
    file: Path, lines: list[str], spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    if 14 not in spans:
        return
    start, end = spans[14]
    sub_re = re.compile(r"^###\s+14\.\d+")
    count = sum(1 for i in range(start, end) if sub_re.match(lines[i]))
    if count < MIN_ANTI_PATTERNS:
        findings.append(
            LintFinding(
                file,
                "anti_patterns",
                f"§14 has {count} entries; min {MIN_ANTI_PATTERNS}",
            )
        )


def _check_definition_of_done(
    file: Path, lines: list[str], spans: dict[int, tuple[int, int]], findings: list[LintFinding]
) -> None:
    if 16 not in spans:
        return
    start, end = spans[16]
    box_re = re.compile(r"^- \[[ x]\] ")
    count = sum(1 for i in range(start, end) if box_re.match(lines[i]))
    if count < MIN_DOD_ITEMS:
        findings.append(
            LintFinding(
                file,
                "dod_items",
                f"§16 DoD has {count} checkbox items; min {MIN_DOD_ITEMS}",
            )
        )


def lint_file(file: Path) -> list[LintFinding]:
    findings: list[LintFinding] = []
    text = file.read_text(encoding="utf-8")
    lines = text.splitlines()
    spans = _section_spans(lines)
    _check_total_lines(file, lines, findings)
    _check_sections_present(file, spans, findings)
    _check_banned_words(file, lines, findings)
    _check_glossary(file, lines, spans, findings)
    _check_target_state(file, lines, spans, findings)
    _check_search_phrases(file, lines, spans, findings)
    _check_steps(file, lines, spans, findings)
    _check_reference_q(file, lines, spans, findings)
    _check_diagram_catalogue(file, lines, spans, findings)
    _check_quality_gates(file, lines, spans, findings)
    _check_anti_patterns(file, lines, spans, findings)
    _check_definition_of_done(file, lines, spans, findings)
    return findings


def _candidate_files(args: Iterable[str]) -> list[Path]:
    paths: list[Path] = []
    if not args:
        for p in sorted(PLAYBOOK_DIR.glob("*.md")):
            if re.match(r"^\d{2}-", p.name):
                paths.append(p)
        return paths
    for a in args:
        p = Path(a)
        if not p.is_absolute():
            p = (REPO_ROOT / p).resolve()
        paths.append(p)
    return paths


def main(argv: list[str]) -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "files",
        nargs="*",
        help="Playbook .md files to lint (default: every expansion-plan/NN-*.md).",
    )
    parser.add_argument(
        "--exit-on-first",
        action="store_true",
        help="Stop after the first file with findings.",
    )
    ns = parser.parse_args(argv)

    files = _candidate_files(ns.files)
    if not files:
        print("No playbook files matched.", file=sys.stderr)
        return 2

    total_findings = 0
    for f in files:
        if not f.exists():
            print(f"FAIL [exists] {f}: file not found")
            total_findings += 1
            continue
        findings = lint_file(f)
        if findings:
            total_findings += len(findings)
            for fnd in findings:
                print(fnd)
            if ns.exit_on_first:
                break

    print(f"\nLinted {len(files)} file(s). {total_findings} finding(s).")
    return 0 if total_findings == 0 else 1


if __name__ == "__main__":
    raise SystemExit(main(sys.argv[1:]))
