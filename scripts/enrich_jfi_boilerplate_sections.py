#!/usr/bin/env python3
"""
Replace thin auto-generated answer sections in java-fullstack-intermediate
(fill_jfi_tbd_from_intent.py output) with richer interview-style sections.

Detects boilerplate via section title or the distinctive overview sentence.
Only modifies questions that match; leaves hand-authored content unchanged.

  python3 scripts/enrich_jfi_boilerplate_sections.py
"""

from __future__ import annotations

import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "content" / "java-fullstack-intermediate"

BOILER_TITLE = "How to frame this in an interview"
BOILER_PHRASE = "This answer lines up with how **"
GENERIC_AFTER_CODE = "Interview tip: show one minimal, realistic snippet"


def is_boilerplate_question(q: dict) -> bool:
    secs = (q.get("answer") or {}).get("sections")
    if not isinstance(secs, list):
        return False
    for s in secs:
        if not isinstance(s, dict):
            continue
        if s.get("title") == BOILER_TITLE:
            return True
        c = s.get("content") or ""
        if BOILER_PHRASE in c:
            return True
    return False


def polish_direct_answer(q: dict) -> None:
    """If direct_answer is the stitched intent sentence, make it read slightly cleaner."""
    intent = q.get("interviewer_intent") or {}
    testing = (intent.get("testing") or "").strip().rstrip(".")
    mistake = (intent.get("common_mistake") or "").strip().rstrip(".")
    stand = (intent.get("to_stand_out") or "").strip().rstrip(".")
    qu = (q.get("question") or "").strip()
    da = (q.get("direct_answer") or "").strip()

    if not testing or "Interviewers usually want you to explain:" not in da:
        return

    parts: list[str] = []
    if qu:
        lead = qu if qu.endswith(("?", ".", "!")) else qu + "."
        parts.append(lead)
    parts.append(
        "Interviewers typically push on: " + testing + "."
    )
    if mistake:
        parts.append("A common weak answer: " + mistake + ".")
    if stand:
        parts.append("To sound senior, also cover: " + stand + ".")
    out = " ".join(parts)
    if len(out) > 2400:
        out = out[:2397] + "..."
    q["direct_answer"] = out


def build_sections(q: dict) -> list[dict]:
    intent = q.get("interviewer_intent") or {}
    testing = (intent.get("testing") or "").strip().rstrip(".")
    mistake = (intent.get("common_mistake") or "").strip().rstrip(".")
    stand = (intent.get("to_stand_out") or "").strip().rstrip(".")
    tit = (q.get("title") or "Topic").strip()
    qu = (q.get("question") or "").strip()

    if not testing:
        testing = "the underlying mechanism, trade-offs, and one production-shaped example"

    overview = (
        f"{tit} is a frequent fullstack interview theme.\n\n"
        f"**The question:** {qu}\n\n"
        "Strong answers lead with a **clear definition**, then connect **how the system behaves in practice**, "
        "**failure modes**, and **what you would measure or log** in production—not a list of API names alone."
    )

    deep = (
        "### What interviewers are probing\n\n"
        f"- {testing}.\n\n"
        "### How to go one level deeper\n\n"
        f"- {stand if stand else 'Give a concrete example: DevTools, network trace, test, or a small code shape, then state trade-offs.'}"
    )

    pitfalls = (
        "### Weak signal\n\n"
        f"{mistake if mistake else 'Vague hand-waving without an example or without naming what breaks in production.'}\n\n"
        "### Strong signal\n\n"
        "Name **one failure you have seen** (CORS, stale cache, double fetch, wrong dependency resolution, flaky E2E) "
        "and what you changed."
    )

    kp_lines = [s.strip() for s in testing.split(";") if s.strip()][:8]
    if stand:
        kp_lines.append(stand)
    if mistake:
        kp_lines.append(f"Pitfall: {mistake}")
    key_points = "\n".join(f"- {line}" for line in kp_lines[:12])

    verbal = (
        f"**Open:** Answer the question in one or two sentences for **{tit.split('—')[0].strip()}**.\n\n"
        f"**Middle:** Expand on: {testing[:320]}{'…' if len(testing) > 320 else ''}\n\n"
        f"**Sharpen:** Call out the common mistake: {mistake[:220]}{'…' if len(mistake) > 220 else ''}\n\n"
        f"**Close:** Add: {stand[:220]}{'…' if len(stand) > 220 else ''}"
    )

    return [
        {"type": "overview", "title": "Interview angle", "content": overview},
        {"type": "step", "title": "What to explain", "content": deep},
        {"type": "pitfalls", "title": "Weak vs strong signal", "content": pitfalls},
        {"type": "key_points", "title": "Key points", "content": key_points},
        {"type": "speakable_answer", "title": "How to answer verbally", "content": verbal},
    ]


def strip_generic_after_code(sections: list) -> list:
    """Remove generic filler after_code blocks left by the old template."""
    out = []
    for s in sections:
        if not isinstance(s, dict):
            out.append(s)
            continue
        if s.get("type") == "after_code" and GENERIC_AFTER_CODE in (s.get("content") or ""):
            continue
        if s.get("title") == "Quick pattern (when code helps)" and GENERIC_AFTER_CODE in (s.get("content") or ""):
            continue
        out.append(s)
    return out


def process_file(path: Path) -> int:
    raw = path.read_text(encoding="utf-8")
    data = json.loads(raw)
    qs = data.get("questions") or []
    changed = 0
    for q in qs:
        if not isinstance(q, dict):
            continue
        if not is_boilerplate_question(q):
            continue
        polish_direct_answer(q)
        q["answer"] = {"sections": build_sections(q)}
        changed += 1
    if changed:
        path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    return changed


def main() -> None:
    total_files = 0
    total_q = 0
    for path in sorted(ROOT.rglob("complete-qa.json")):
        n = process_file(path)
        if n:
            total_files += 1
            total_q += n
            print(f"+{n}Q  {path.relative_to(REPO)}")
    print(f"Done: {total_files} files, {total_q} questions enriched.")

    # Second pass: optional strip generic after_code from non-boilerplate files?
    # Skipped to avoid unintended edits.


if __name__ == "__main__":
    main()
