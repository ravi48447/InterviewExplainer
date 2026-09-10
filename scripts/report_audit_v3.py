"""
Reporter — converts audit_v3 structural JSON into per-module Markdown reports.

Output: content/_audits/<pillar>/<module_number>_<module_slug>__<topic>.md

The reports follow the same format as the hand-written oop-principles audit:
- Module-level structural issues (stubs + topic overlaps)
- Per-question table (Zone 1 / Zone 2 / Zone 3 / Severity)
- Verdict tally

These are structural-signal reports. The judgment layer (tone, analogies,
internet-calibration) is layered on top per module as needed.
"""
from __future__ import annotations
import json
from pathlib import Path
from collections import Counter

REPO = Path(__file__).resolve().parent.parent
AUDIT = REPO / "scripts" / "out" / "audit_v3"
OUT = REPO / "content" / "_audits"
OUT.mkdir(parents=True, exist_ok=True)

ISSUE_ZONE_LABELS = {1: "Zone 1", 2: "Zone 2", 3: "Zone 3"}

SEVERITY_ORDER = {"CRITICAL": 0, "MAJOR": 1, "MODERATE": 2, "MINOR": 3}


def worst_severity(issues: list[dict]) -> str:
    if not issues:
        return "CLEAN"
    return min(issues, key=lambda i: SEVERITY_ORDER.get(i["severity"], 99))["severity"]


def summarize_zone_issues(issues: list[dict], zone: int) -> str:
    z_issues = [i for i in issues if i.get("zone") == zone]
    if not z_issues:
        return "✓"
    msgs = [i["msg"] for i in z_issues]
    return "; ".join(msgs)


def render_question_row(q: dict) -> str:
    if q.get("stub"):
        return f"| **Q{q.get('order', '?')}** {q['slug']} | — | — | — | STUB |"
    issues = q.get("issues", [])
    sev = worst_severity(issues)
    z1 = summarize_zone_issues(issues, 1)
    z2 = summarize_zone_issues(issues, 2)
    z3 = summarize_zone_issues(issues, 3)
    return f"| **Q{q.get('order', '?')}** {q['slug']} | {z1} | {z2} | {z3} | {sev} |"


def render_module_report(mod: dict, module_label: str) -> str:
    lines = [f"# Audit — {module_label}", ""]
    lines.append(f"**Pillar:** {mod['pillar']}  ")
    lines.append(f"**Module:** {mod['module_number']} {mod['module_slug']}  ")
    topic_count = len(mod["topics"])
    total_q = sum(t["question_count"] for t in mod["topics"].values())
    total_stubs = sum(t["stub_count"] for t in mod["topics"].values())
    lines.append(f"**Topics:** {topic_count}  ")
    lines.append(f"**Questions:** {total_q} ({total_q - total_stubs} written, {total_stubs} stubs)")
    lines.append("")

    # ---- Module-level structural issues
    lines.append("## Module-level structural issues")
    lines.append("")
    structural = []
    # Stubs
    for topic_slug, topic in mod["topics"].items():
        for q in topic["questions"]:
            if q.get("stub"):
                structural.append({
                    "tag": "STUB",
                    "severity": "CRITICAL",
                    "msg": f"**{topic_slug}/Q{q.get('order', '?')} {q['slug']}** — stub, no content",
                })
    # Detected overlaps
    for topic_slug, topic in mod["topics"].items():
        for ov in topic.get("overlaps", []):
            structural.append({
                "tag": "OVERLAP",
                "severity": "MAJOR",
                "msg": (f"**{topic_slug}**: `{ov['a_slug']}` ↔ `{ov['b_slug']}` — "
                        f"shared tokens: {', '.join(ov['shared_tokens'])} (Jaccard {ov['jaccard']})"),
            })
    if not structural:
        lines.append("_None detected by structural signals. Judgment layer may add module-level concerns._")
        lines.append("")
    else:
        lines.append("| # | Tag | Severity | Issue |")
        lines.append("|---|---|---|---|")
        for i, s in enumerate(structural, 1):
            lines.append(f"| S{i} | {s['tag']} | {s['severity']} | {s['msg']} |")
        lines.append("")

    # ---- Per-topic question tables
    for topic_slug, topic in mod["topics"].items():
        lines.append(f"## Topic: {topic_slug}")
        lines.append("")
        lines.append(f"_{topic['question_count']} questions ({topic['stub_count']} stubs)._")
        lines.append("")
        lines.append("| Q | Zone 1 (direct_answer + key_points) | Zone 2 (speakable) | Zone 3 (deep dive) | Severity |")
        lines.append("|---|---|---|---|---|")
        for q in sorted(topic["questions"], key=lambda q: q.get("order") or 0):
            lines.append(render_question_row(q))
        lines.append("")

    # ---- Tally
    lines.append("## Tally")
    lines.append("")
    sev_counter = Counter()
    clean = 0
    stubs = 0
    for topic in mod["topics"].values():
        for q in topic["questions"]:
            if q.get("stub"):
                stubs += 1
                continue
            issues = q.get("issues", [])
            if not issues:
                clean += 1
            else:
                sev_counter[worst_severity(issues)] += 1
    lines.append(f"- **CRITICAL:** {sev_counter.get('CRITICAL', 0)}")
    lines.append(f"- **MAJOR:** {sev_counter.get('MAJOR', 0)}")
    lines.append(f"- **MODERATE:** {sev_counter.get('MODERATE', 0)}")
    lines.append(f"- **MINOR:** {sev_counter.get('MINOR', 0)}")
    lines.append(f"- **CLEAN:** {clean}")
    lines.append(f"- **STUBS:** {stubs}")
    lines.append("")

    # ---- Top issue codes by frequency
    code_counter = Counter()
    for topic in mod["topics"].values():
        for q in topic["questions"]:
            for i in q.get("issues", []):
                code_counter[i["code"]] += 1
    if code_counter:
        lines.append("### Most common issue codes")
        lines.append("")
        for code, n in code_counter.most_common(8):
            lines.append(f"- `{code}` × {n}")
        lines.append("")

    lines.append("---")
    lines.append("")
    lines.append("_This is a structural-signal report produced by the v3 auditor. "
                 "A judgment layer (analogies, standard interview facts, tone calibration "
                 "against top internet sources) will be layered on top per module as needed._")
    lines.append("")
    return "\n".join(lines)


def main():
    # Iterate pillars
    for pillar_dir in sorted(AUDIT.iterdir()):
        if not pillar_dir.is_dir():
            continue
        for mod_file in sorted(pillar_dir.glob("*.json")):
            mod = json.loads(mod_file.read_text())
            if not mod.get("topics"):
                continue
            # Module-label from filename
            label = mod_file.stem  # e.g. "M01_core-java"
            out_dir = OUT / mod["pillar"]
            out_dir.mkdir(parents=True, exist_ok=True)
            # Special case: oop-principles already has a curated report; skip structural draft
            out_path = out_dir / f"{label}.md"
            # But write the structural draft if no curated report exists yet, or
            # always write into _structural.md for reference
            structural_path = out_dir / f"{label}_structural.md"
            md = render_module_report(mod, label)
            structural_path.write_text(md)
    print(f"Wrote structural reports under {OUT}")


if __name__ == "__main__":
    main()
