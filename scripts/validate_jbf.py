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
    "scenario_based", "interviewer_expectation", "core_concepts",
    "important_points", "practice_prompt", "followup_questions",
    "short_summary", "detailed_explanation", "best_practices", "warning",
    "recipe", "tip", "requirements", "approach", "design_diagram",
    "sample_data", "query_example", "diagnosis", "problem_statement",
    "diagram", "decision_tree", "tradeoff", "table", "visual",
    "practice", "exercise", "code", "mermaid", "trace", "comparison",
    "timeline", "flow", "state",
}
LEGACY_LAYOUTS = {"default", "explanation", "", None}
DIAGRAM_TYPES = {"architecture_diagram", "flow_diagram", "sequence_diagram",
                 "concept_map", "diagram", "design_diagram", "decision_tree",
                 "visual", "mermaid"}
COMPARISON_ARTIFACT_TYPES = {"comparison_table", "table", "comparison"}
CODE_TYPES = {"code_example", "before_code", "after_code", "code", "query_example"}
QUICK_TYPES = {"key_points", "important_points"}
TEACHING_TYPES = {
    "overview", "core_concepts", "deep_explanation", "detailed_explanation",
    "explanation",
}
CODE_QUESTION = re.compile(
    r"\b(implement|write|code|program|query|annotation|configure|configuration|"
    r"deserialize|serialize|parse|build|create an? (?:api|endpoint|test))\b",
    re.I,
)
VISUAL_QUESTION = re.compile(
    r"\b(flow|lifecycle|architecture|internals?|how (?:does|do)|state|sequence|"
    r"request path|thread lifecycle|garbage collection)\b",
    re.I,
)
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


def quick_items(section):
    if not isinstance(section, dict):
        return []
    items = section.get("items")
    if isinstance(items, list):
        return [str(item).strip() for item in items if str(item).strip()]
    content = section.get("content")
    if isinstance(content, list):
        return [str(item).strip() for item in content if str(item).strip()]
    return [
        line.strip()
        for line in str(content or "").splitlines()
        if re.match(r"^\s*[-*]\s+", line)
    ]


def section_has_content(section):
    if not isinstance(section, dict):
        return False
    content = section.get("content")
    if isinstance(content, str) and content.strip():
        return True
    if isinstance(content, list) and any(str(item).strip() for item in content):
        return True
    return bool(section.get("beats"))


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

    quick_sections = [s for s in secs if s.get("type") in QUICK_TYPES]
    quick = quick_sections[0] if quick_sections else None
    recall = quick_items(quick)
    if quick is None:
        crit.append(f"{tag}: missing Quick Revision section")
    elif len(quick_sections) != 1:
        crit.append(f"{tag}: expected exactly one Quick Revision section, found {len(quick_sections)}")
    elif not recall:
        crit.append(f"{tag}: Quick Revision is empty")
    elif quick.get("title") != "Quick revision":
        crit.append(f"{tag}: Quick Revision title must be 'Quick revision'")
    elif len(recall) > 8:
        mod.append(f"{tag}: Quick Revision has {len(recall)} points; review whether every point aids recall")

    speaking_sections = [s for s in secs if s.get("type") == "speakable_answer"]
    speaking = speaking_sections[0] if speaking_sections else None
    if not section_has_content(speaking):
        crit.append(f"{tag}: missing or empty Interview Answer section")
    elif len(speaking_sections) != 1:
        crit.append(f"{tag}: expected exactly one Interview Answer section, found {len(speaking_sections)}")
    elif speaking.get("title") != "Interview answer":
        crit.append(f"{tag}: Interview Answer title must be 'Interview answer'")

    teaching = [s for s in secs if s.get("type") in TEACHING_TYPES]
    if not any(section_has_content(section) for section in teaching):
        crit.append(f"{tag}: missing independent Deep Dive teaching content")

    qtext = str(q.get("question") or "").strip()
    has_code = any(t in CODE_TYPES for t in types)
    if CODE_QUESTION.search(qtext) and not has_code:
        mod.append(f"{tag}: implementation/code question has no worked code or query")

    # before/after must be consecutive
    if "before_code" in types and "after_code" not in types:
        mod.append(f"{tag}: before_code without after_code")

    has_semantic_visual = any(t in DIAGRAM_TYPES for t in types) or any(
        "```mermaid" in str(section.get("content") or "")
        for section in secs
        if isinstance(section, dict)
    )
    comparison_question = bool(re.search(
        r"\b(compare|comparison|versus|vs\.?|difference|choose|which (?:one|approach))\b",
        qtext,
        re.I,
    ))
    if comparison_question and any(t in COMPARISON_ARTIFACT_TYPES for t in types):
        has_semantic_visual = True
    if VISUAL_QUESTION.search(qtext) and not has_semantic_visual:
        mod.append(f"{tag}: process/relationship question has no semantic visual")

    if "?" in qtext and not qtext.endswith("?"):
        suffix = qtext.split("?", 1)[1].strip()
        if suffix and not re.match(
            r"^(?:give|show|explain|compare|contrast|describe|include|also|and)\b",
            suffix,
            re.I,
        ):
            mod.append(f"{tag}: question appears to include answer text after the question mark")

    da = (q.get("direct_answer") or "").strip()
    if len(da) < 24:
        crit.append(f"{tag}: direct_answer too short ({len(da)} chars)")

    sv2 = q.get("speakable_v2") or {}
    hook = (sv2.get("hook") or "").strip()
    if hook and da and hook[:80] == da[:80]:
        mod.append(f"{tag}: speakable_v2.hook duplicates direct_answer")

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
