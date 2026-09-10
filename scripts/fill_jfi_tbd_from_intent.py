#!/usr/bin/env python3
"""
Fill _TBD_PHASE_2_ placeholders in java-fullstack-intermediate complete-qa.json files
using question text + interviewer_intent (high-signal fields already in the JSON).

Run from repo root:
  python3 scripts/fill_jfi_tbd_from_intent.py
"""

from __future__ import annotations

import json
from pathlib import Path

REPO = Path(__file__).resolve().parents[1]
ROOT = REPO / "content" / "java-fullstack-intermediate"


def build_direct_answer(q: dict) -> str:
    intent = q.get("interviewer_intent") or {}
    parts: list[str] = []
    qu = (q.get("question") or "").strip()
    if qu:
        lead = qu.rstrip()
        if not lead.endswith((".", "?", "!")):
            lead += "."
        parts.append(lead)
    if intent.get("testing"):
        parts.append(
            "Interviewers usually want you to explain: "
            + intent["testing"].strip().rstrip(".")
            + "."
        )
    if intent.get("common_mistake"):
        parts.append(
            "A frequent mistake is "
            + intent["common_mistake"].strip().rstrip(".")
            + "."
        )
    if intent.get("to_stand_out"):
        parts.append(
            "To go deeper: "
            + intent["to_stand_out"].strip().rstrip(".")
            + "."
        )
    text = " ".join(parts)
    if len(text) > 2200:
        text = text[:2197] + "..."
    return text


def build_sections(q: dict, direct: str) -> list[dict]:
    intent = q.get("interviewer_intent") or {}
    title = q.get("title") or "Topic"

    overview = (
        f"This answer lines up with how **{title}** shows up in **fullstack / frontend interviews**: "
        "clear definition first, then trade-offs and production patterns—not only API names."
    )

    step = "### What they are testing\n\n"
    if intent.get("testing"):
        step += intent["testing"].strip() + "\n\n"
    step += "### Strong closing angle\n\n"
    if intent.get("to_stand_out"):
        step += intent["to_stand_out"].strip()

    pitfalls = "### Pitfall to name explicitly\n\n"
    if intent.get("common_mistake"):
        pitfalls += intent["common_mistake"].strip()
    else:
        pitfalls += "Hand-waving without a concrete example or tool (DevTools, network trace, test) usually weakens the answer."

    kp_lines = []
    if intent.get("testing"):
        for chunk in intent["testing"].split(";"):
            c = chunk.strip()
            if c:
                kp_lines.append(c)
    if intent.get("to_stand_out"):
        kp_lines.append(intent["to_stand_out"].strip())
    if not kp_lines:
        kp_lines = ["Tie theory to something you ship: metrics, security, or DX."]
    key_points = "\n".join(f"- {line}" for line in kp_lines[:10])

    speak = (
        f"**Headline:** Answer the question in one sentence.\n\n"
        f"**Body:** Walk through what interviewers list under “testing”: {intent.get('testing', 'core behaviour and trade-offs')[:280]}.\n\n"
        f"**Pitfall:** Call out the common mistake so you sound senior.\n\n"
        f"**Finish:** Mention the “stand out” angle with a tool, API, or diagram if time allows."
    )

    return [
        {"type": "overview", "title": "How to frame this in an interview", "content": overview},
        {"type": "step", "title": "Deep dive", "content": step},
        {"type": "pitfalls", "title": "What not to do", "content": pitfalls},
        {
            "type": "after_code",
            "title": "Quick pattern (when code helps)",
            "content": "```ts\n// Interview tip: show one minimal, realistic snippet—\n// then explain trade-offs (bundle size, security, SSR, a11y).\nexport async function example() {\n  return { ok: true };\n}\n```",
        },
        {"type": "key_points", "title": "Key points", "content": key_points},
        {"type": "speakable_answer", "title": "How to answer this verbally", "content": speak},
    ]


def process_file(path: Path) -> int:
    raw = path.read_text(encoding="utf-8")
    if "_TBD_PHASE_2_" not in raw:
        return 0
    data = json.loads(raw)
    questions = data.get("questions") or []
    changed = 0
    for q in questions:
        ans = q.get("answer") or {}
        if q.get("direct_answer") == "_TBD_PHASE_2_" or ans.get("sections") == "_TBD_PHASE_2_":
            direct = build_direct_answer(q)
            q["direct_answer"] = direct
            q["answer"] = {"sections": build_sections(q, direct)}
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
            print(f"+ {n}Q  {path.relative_to(REPO)}")
    print(f"Done: {total_files} files, {total_q} questions updated.")


if __name__ == "__main__":
    main()
