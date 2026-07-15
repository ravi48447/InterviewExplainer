#!/usr/bin/env python3
"""
Validate / score java-backend-fresher (JBF) question quality against the spec
in content/java-backend-fresher/_QUALITY_SPEC.md.

Usage:
    python3 scripts/validate_jbf.py                                  # whole JBF track
    python3 scripts/validate_jbf.py content/java-backend-fresher/git-basics/
    python3 scripts/validate_jbf.py content/.../topic/complete-qa.json
    python3 scripts/validate_jbf.py --summary                        # one line per module

Exit code = number of CRITICAL issues (0 = clean).
"""
import json
import sys
import glob
import os
import re

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
JBF = os.path.join(ROOT, "content", "java-backend-fresher")

ALLOWED_TYPES = {
    "overview", "phase", "step", "code_example", "before_code", "after_code",
    "architecture_diagram", "flow_diagram", "sequence_diagram", "concept_map",
    "comparison_table", "key_points", "common_mistakes", "when_to_use",
    "tradeoffs", "component", "reference_group", "speakable_answer",
    "explanation", "deep_explanation", "real_world_example",
}
LEGACY_LAYOUTS = {"default", "explanation", "", None}
DIAGRAM_TYPES = {"architecture_diagram", "flow_diagram", "sequence_diagram",
                 "concept_map", "diagram"}
# (phrase, is_word) — word-boundary phrases avoid false positives like "TODO" in "mapToDouble"
BANNED = [
    ("combo meal", False),
    ("think of it like a combo", False),
    ("lorem ipsum", False),
    ("TODO", True),
    ("TBD", True),
]


def load_questions(path):
    with open(path) as f:
        d = json.load(f)
    if isinstance(d, list):
        return d, "list"
    return d.get("questions", []), "dict"


def get_sections(q):
    ans = q.get("answer")
    if isinstance(ans, dict):
        return ans.get("sections", []) or []
    return []


def check_question(q, fname, idx):
    crit, mod = [], []
    qid = q.get("slug") or q.get("id") or f"#{idx}"
    tag = f"{fname}::{qid}"

    if q.get("layout_type") in LEGACY_LAYOUTS:
        crit.append(f"{tag}: layout_type is legacy/default ({q.get('layout_type')!r})")

    secs = get_sections(q)
    types = [s.get("type") for s in secs if isinstance(s, dict)]

    if not secs:
        crit.append(f"{tag}: no answer.sections")
        return crit, mod

    bad = [t for t in types if t not in ALLOWED_TYPES]
    if bad:
        crit.append(f"{tag}: unsupported section type(s) {sorted(set(bad))}")

    has_code = any(t in ("code_example", "before_code", "after_code") for t in types)
    if not has_code:
        crit.append(f"{tag}: no code block (need >=1 runnable snippet)")

    # before/after must be consecutive
    if "before_code" in types and "after_code" not in types:
        mod.append(f"{tag}: before_code without after_code")

    if not any(t in DIAGRAM_TYPES for t in types):
        mod.append(f"{tag}: no diagram/concept_map")

    if "speakable_answer" not in types:
        mod.append(f"{tag}: no speakable_answer section")

    da = (q.get("direct_answer") or "").strip()
    if len(da) < 40:
        crit.append(f"{tag}: direct_answer too short ({len(da)} chars)")

    sv2 = q.get("speakable_v2") or {}
    hook = (sv2.get("hook") or "").strip()
    if hook and da and hook[:80] == da[:80]:
        mod.append(f"{tag}: speakable_v2.hook duplicates direct_answer")

    ii = q.get("interviewer_intent")
    if not isinstance(ii, dict) or not ii.get("testing"):
        mod.append(f"{tag}: interviewer_intent missing/empty")

    blob = json.dumps(q)
    blob_lower = blob.lower()
    for phrase, is_word in BANNED:
        if is_word:
            hit = re.search(rf"\b{re.escape(phrase)}\b", blob)
        else:
            hit = phrase.lower() in blob_lower
        if hit:
            mod.append(f"{tag}: banned phrase {phrase!r}")

    return crit, mod


def iter_files(target):
    if target.endswith(".json"):
        return [target]
    if os.path.isdir(target):
        return sorted(glob.glob(os.path.join(target, "**", "complete-qa.json"),
                                recursive=True))
    return sorted(glob.glob(os.path.join(JBF, "**", "complete-qa.json"),
                            recursive=True))


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    summary = "--summary" in sys.argv
    target = args[0] if args else JBF
    files = iter_files(target)

    total_q = total_crit = total_mod = 0
    per_module = {}
    all_crit, all_mod = [], []

    for f in files:
        rel = os.path.relpath(f, JBF)
        module = rel.split(os.sep)[0]
        try:
            qs, _ = load_questions(f)
        except Exception as e:
            all_crit.append(f"{rel}: JSON PARSE ERROR: {e}")
            per_module.setdefault(module, [0, 0, 0])
            per_module[module][1] += 1
            total_crit += 1
            continue
        pm = per_module.setdefault(module, [0, 0, 0])
        for i, q in enumerate(qs):
            if not isinstance(q, dict):
                continue
            total_q += 1
            pm[0] += 1
            c, m = check_question(q, rel, i)
            pm[1] += len(c)
            pm[2] += len(m)
            total_crit += len(c)
            total_mod += len(m)
            all_crit += c
            all_mod += m

    if summary:
        print(f"{'MODULE':40} {'Qs':>5} {'CRIT':>6} {'MOD':>6}")
        for m in sorted(per_module):
            q, c, md = per_module[m]
            print(f"{m:40} {q:>5} {c:>6} {md:>6}")
        print("-" * 60)
        print(f"{'TOTAL':40} {total_q:>5} {total_crit:>6} {total_mod:>6}")
        return total_crit

    for c in all_crit[:200]:
        print("CRITICAL:", c)
    for m in all_mod[:200]:
        print("MODERATE:", m)
    print("-" * 60)
    print(f"Questions: {total_q} | CRITICAL: {total_crit} | MODERATE: {total_mod}")
    return total_crit


if __name__ == "__main__":
    sys.exit(min(main(), 255))
