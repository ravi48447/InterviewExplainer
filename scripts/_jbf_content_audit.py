#!/usr/bin/env python3
"""Content-quality audit for JBF gold rewrite — checks the dimensions the two
existing linters (validate_jbf.py = structure, audit_speakable.py = speakable card)
do NOT cover: the deep-dive prose quality bar from .cursor/plans/jbf-gold-rewrite.plan.md.

Per question it scores the deep-dive (answer.sections):
  - overview present, substantial (ladder-from-zero needs real prose)
  - overview opener is NOT a misconception/meta hook (must start plain, GFG-style)
  - visual formatting in overview: >=2 bold, >=2 inline-code, and a bullet/blockquote
  - >=1 real diagram (flow/sequence/architecture/concept_map)
  - >=1 runnable code block with enough lines
  - common_mistakes present
  - key_points has >=5 bullets

Usage: python3 scripts/_jbf_content_audit.py <module-dir>
Exit code = number of questions flagged WEAK.
"""
import json, sys, glob, os, re

DIAGRAM = {"architecture_diagram", "flow_diagram", "sequence_diagram", "concept_map"}
CODE = {"code_example", "before_code", "after_code"}
# openers that violate "ladder from zero" (must start with the plainest line, not these)
BAD_OPENERS = re.compile(
    r"^\s*(unlike|contrary|most\s+freshers|many\s+freshers|a\s+common\s+misconception|"
    r"you\s+might\s+think|people\s+often|it'?s\s+a\s+myth|don'?t\s+confuse|"
    r"the\s+biggest\s+mistake)\b",
    re.I,
)


def load(path):
    d = json.load(open(path))
    return d if isinstance(d, list) else d.get("questions", [])


def sections(q):
    a = q.get("answer")
    return a.get("sections", []) if isinstance(a, dict) else []


def first_sentence(text):
    # strip markdown bold/code for opener detection
    plain = re.sub(r"[*`>#-]", "", text).strip()
    return plain.split(".")[0][:120]


def audit_q(q):
    secs = sections(q)
    by_type = {}
    for s in secs:
        by_type.setdefault(s.get("type"), []).append(s)
    issues = []

    ov = by_type.get("overview", [{}])[0].get("content", "") or ""
    ov_words = len(ov.split())
    if ov_words < 120:
        issues.append(f"thin overview ({ov_words}w <120)")
    if ov and BAD_OPENERS.search(first_sentence(ov)):
        issues.append(f"overview opener not ladder-from-zero: '{first_sentence(ov)[:60]}'")
    if ov.count("**") < 4:  # 2 bold = 4 asterisks
        issues.append(f"overview <2 bold")
    if len(re.findall(r"`[^`]+`", ov)) < 2:
        issues.append("overview <2 inline-code")
    if "\n-" not in ov and "\n>" not in ov and "- " not in ov[:0]:
        # allow either a bullet list or a blockquote somewhere
        if "\n- " not in ov and "\n> " not in ov:
            issues.append("overview no bullet/blockquote")

    if not any(t in DIAGRAM for t in by_type):
        issues.append("no diagram")

    code_secs = [s for t in CODE for s in by_type.get(t, [])]
    code_text = "\n".join(s.get("content", "") for s in code_secs)
    code_lines = len([l for l in code_text.splitlines() if l.strip() and "```" not in l])
    if not code_secs:
        issues.append("no code block")
    elif code_lines < 6:
        issues.append(f"trivial code ({code_lines} lines)")

    if "common_mistakes" not in by_type:
        issues.append("no common_mistakes")

    kp = by_type.get("key_points", [{}])[0].get("content", "") or ""
    kp_bullets = len([l for l in kp.splitlines() if l.strip().startswith("-")])
    if kp_bullets < 5:
        issues.append(f"key_points {kp_bullets} bullets (<5)")

    return issues


def main():
    target = sys.argv[1] if len(sys.argv) > 1 else "."
    files = sorted(glob.glob(os.path.join(target, "**", "complete-qa.json"), recursive=True))
    flagged = 0
    total = 0
    for f in files:
        topic = os.path.basename(os.path.dirname(f))
        for q in load(f):
            if not isinstance(q, dict):
                continue
            total += 1
            issues = audit_q(q)
            qid = q.get("slug") or q.get("id")
            if issues:
                flagged += 1
                print(f"WEAK  {topic}/{qid}")
                for i in issues:
                    print(f"        - {i}")
    print("-" * 60)
    print(f"Questions: {total} | GOLD: {total - flagged} | WEAK: {flagged}")
    return flagged


if __name__ == "__main__":
    sys.exit(min(main(), 255))
