#!/usr/bin/env python3
"""
seed_jfi_phase1.py
==================

Phase-1 scaffold seeder for the 21 NEW Java Fullstack Intermediate frontend
modules (pillars P13–P18).

What Phase 1 does
-----------------
Writes `complete-qa.json` at every topic folder with question-level metadata
only (schema parity with java-backend-intermediate). The two heaviest fields —
`direct_answer` and `answer.sections[]` — hold the placeholder
`"_TBD_PHASE_2_"` and are filled question-by-question in Phase 2.

Selection gates (every included question passes ≥2)
---------------------------------------------------
1. High search-volume keyword (Google / People-Also-Ask).
2. Cross-site classic — appears on ≥3 of: GeeksforGeeks, InterviewBit,
   javascript.info, FreeCodeCamp, MDN, web.dev, dev.to, Toptal, Glassdoor,
   Indeed, LeetCode discuss, NamasteJS.
3. Famous interviewer favourite at FAANG / MAANG / Indian product cos.
4. Foundational concept — not niche trivia.
5. SEO long-tail match — aligns with the module's `seoSlug` / `altSlugs`.

Source of truth
---------------
The 290 question definitions live in `seed_jfi_phase1_data.py` as a compact
tuple format (see TUPLE_FIELDS below).

Idempotent: rerunning overwrites the 195 topic files. The 35 reused (backend)
modules are NOT touched — they reference content via `contentSource` in
`_index.json`.

Usage
-----
    cd <repo-root>
    python scripts/seed_jfi_phase1.py
"""

from __future__ import annotations

import json
import sys
from datetime import date
from pathlib import Path

# Make sibling data module importable when run as a script.
_THIS_DIR = Path(__file__).resolve().parent
if str(_THIS_DIR) not in sys.path:
    sys.path.insert(0, str(_THIS_DIR))

from seed_jfi_phase1_data import TOPIC_DEFS  # noqa: E402

REPO_ROOT = _THIS_DIR.parent
JFI_ROOT = REPO_ROOT / "content" / "java-fullstack-intermediate"
TODAY = date.today().isoformat()  # e.g. "2026-04-23"

# Tuple field order used in seed_jfi_phase1_data.py
TUPLE_FIELDS = (
    "qid",          # also used as slug
    "question",
    "title",
    "layout",       # layout_type
    "difficulty",   # easy | medium | hard
    "importance",   # low | medium | high
    "reading",      # reading_time_minutes
    "testing",      # interviewer_intent.testing
    "mistake",      # interviewer_intent.common_mistake
    "stand_out",    # interviewer_intent.to_stand_out
    "tags",         # list[str]
    "followups",    # list[str]
    "meta_title",   # seo.metaTitle
    "meta_desc",    # seo.metaDescription
)


def _question_from_tuple(t: tuple, order: int) -> dict:
    """Convert a compact tuple definition into a Phase-1 question dict."""
    if len(t) != len(TUPLE_FIELDS):
        raise ValueError(
            f"Tuple length {len(t)} != expected {len(TUPLE_FIELDS)} for qid={t[0]!r}"
        )
    f = dict(zip(TUPLE_FIELDS, t))
    return {
        "id": f["qid"],
        "slug": f["qid"],
        "question": f["question"],
        "title": f["title"],
        "direct_answer": "_TBD_PHASE_2_",
        "layout_type": f["layout"],
        "difficulty": f["difficulty"],
        "importance": f["importance"],
        "reading_time_minutes": f["reading"],
        "last_updated": TODAY,
        "interviewer_intent": {
            "testing": f["testing"],
            "common_mistake": f["mistake"],
            "to_stand_out": f["stand_out"],
        },
        "company_tags": list(f["tags"]),
        "answer": {"sections": "_TBD_PHASE_2_"},
        "followup_questions": list(f["followups"]),
        "seo": {
            "metaTitle": f["meta_title"],
            "metaDescription": f["meta_desc"],
        },
        "order": order,
    }


def main() -> None:
    if not JFI_ROOT.exists():
        raise SystemExit(f"JFI root not found: {JFI_ROOT}")

    total_files = 0
    empty_files = 0
    total_questions = 0
    per_module: dict[str, tuple[int, int]] = {}  # slug -> (files, questions)

    for module_slug, topics in TOPIC_DEFS.items():
        module_dir = JFI_ROOT / module_slug
        if not module_dir.exists():
            raise SystemExit(
                f"Module folder missing: {module_dir}. "
                f"Did the seed step run for {module_slug}?"
            )

        m_files = 0
        m_qs = 0
        for topic_slug, (topic_title, question_tuples) in topics.items():
            topic_dir = module_dir / topic_slug
            topic_dir.mkdir(parents=True, exist_ok=True)

            questions = [
                _question_from_tuple(t, order=i + 1)
                for i, t in enumerate(question_tuples)
            ]

            # Check for duplicate qids inside the same topic.
            seen_ids = {q["id"] for q in questions}
            if len(seen_ids) != len(questions):
                dupes = sorted(
                    qid for qid in seen_ids
                    if sum(1 for q in questions if q["id"] == qid) > 1
                )
                raise SystemExit(
                    f"Duplicate qids in {module_slug}/{topic_slug}: {dupes}"
                )

            payload = {
                "topic": topic_title,
                "topicSlug": topic_slug,
                "questions": questions,
            }
            out_path = topic_dir / "complete-qa.json"
            out_path.write_text(
                json.dumps(payload, indent=2, ensure_ascii=False) + "\n",
                encoding="utf-8",
            )

            total_files += 1
            m_files += 1
            total_questions += len(questions)
            m_qs += len(questions)
            if not questions:
                empty_files += 1

        per_module[module_slug] = (m_files, m_qs)

    # Report.
    print(f"Wrote {total_files} complete-qa.json files.")
    print(f"Total scaffold questions: {total_questions}")
    print(f"Topics with zero questions (intentional / filler): {empty_files}")
    print()
    print(f"{'Module':<32s} {'Topics':>7s} {'Qs':>5s}")
    print(f"{'-' * 32} {'-' * 7} {'-' * 5}")
    for slug, (f_count, q_count) in per_module.items():
        print(f"{slug:<32s} {f_count:>7d} {q_count:>5d}")


if __name__ == "__main__":
    main()
