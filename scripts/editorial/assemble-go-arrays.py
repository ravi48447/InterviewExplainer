#!/usr/bin/env python3
"""
assemble-go-arrays.py — build the rewritten complete-qa.json files from the
editorial content sources. Preserves IDs, slugs, and routes; replaces the
generated sections with the individually drafted content.

Per the plan: ordinary content improvement must not silently change routes
or identifiers — this script asserts that before writing.
"""

import json, hashlib, sys, os

SNAP = "/app/data/sessions/5230c4ea-76b3-4435-8772-b7721464bae2/InterviewExplainer-snap"
ED = os.path.join(SNAP, "scripts/editorial")

# The three-section content, transcribed from the editorial .md sources
# (content-go-arrays-q1.md, content-go-arrays-q2-q5.md, content-go-arrays-q6-q10.md)
from content_data import ARRAYS_BASICS, ARRAYS_VS_SLICES  # noqa

def assemble(path, new_questions, freeze):
    """Rewrite one complete-qa.json, preserving identity per-question."""
    full = os.path.join(SNAP, path)
    j = json.load(open(full))
    original = json.load(open(full))  # for freeze comparison

    assert len(j["questions"]) == len(new_questions), f"{path}: question count changed"
    for old, new in zip(j["questions"], new_questions):
        # identity gates: id/slug/route must survive
        assert old["id"] == new["id"], f"id drift: {old['id']} -> {new['id']}"
        assert old["slug"] == new["slug"], f"slug drift: {old['slug']}"
        # question text MAY change only for the re-identified family (declared)
        if freeze:
            assert old["question"] == new["question"], f"question text drifted: {old['id']}"
        # section types present
        types = {s["type"] for s in new["answer"]["sections"]}
        assert {"interviewer_expectation", "speakable_answer", "deep_explanation"} <= types, \
            f"{new['id']}: missing sections"
        # keep metadata fields from the old record (order, difficulty, etc.)
        for meta in ("difficulty", "importance", "order", "layout_type", "reading_time_minutes", "last_updated"):
            if meta in old:
                new[meta] = old[meta]

    j["questions"] = new_questions
    with open(full, "w") as f:
        json.dump(j, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"assembled: {path} ({len(new_questions)} questions)")

def freeze_hashes(path):
    full = os.path.join(SNAP, path)
    j = json.load(open(full))
    return {q["id"]: hashlib.sha1(json.dumps(q, sort_keys=True).encode()).hexdigest()[:10] for q in j["questions"]}

# pre-freeze (before rewrite) for the record
frozen_before = {
    "arrays-basics": freeze_hashes("content/go-fresher/go-syntax-basics/arrays-basics/complete-qa.json"),
    "arrays-vs-slices": freeze_hashes("content/go-fresher/go-slices-maps/arrays-vs-slices/complete-qa.json"),
}
json.dump(frozen_before, open(os.path.join(ED, "frozen-before.json"), "w"), indent=2)

# arrays-basics: identity frozen (question text unchanged), content rewritten
assemble("content/go-fresher/go-syntax-basics/arrays-basics/complete-qa.json",
         ARRAYS_BASICS, freeze=True)
# arrays-vs-slices: declared re-identification (template shells -> real questions)
assemble("content/go-fresher/go-slices-maps/arrays-vs-slices/complete-qa.json",
         ARRAYS_VS_SLICES, freeze=False)

# post-freeze for the audit record
frozen_after = {
    "arrays-basics": freeze_hashes("content/go-fresher/go-syntax-basics/arrays-basics/complete-qa.json"),
    "arrays-vs-slices": freeze_hashes("content/go-fresher/go-slices-maps/arrays-vs-slices/complete-qa.json"),
}
json.dump(frozen_after, open(os.path.join(ED, "frozen-after.json"), "w"), indent=2)
print("identity freeze recorded before/after")
