"""
Deeper verification — count question IDs inside questions.json and
complete-qa.json arrays across both trees, so we catch anything the
answers/*.json counter missed.

Appends results to content/MIGRATION_REPORT.md.
"""

from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = REPO_ROOT / "content" / "domains" / "java" / "backend" / "intermediate"
DST_ROOT = REPO_ROOT / "content" / "java-backend-intermediate"
REPORT_PATH = REPO_ROOT / "content" / "MIGRATION_REPORT.md"


def iter_topic_dirs(root: Path):
    if not root.exists():
        return
    for module_dir in sorted(p for p in root.iterdir() if p.is_dir()):
        for topic_dir in sorted(p for p in module_dir.iterdir() if p.is_dir()):
            yield module_dir.name, topic_dir.name, topic_dir


def collect_ids(root: Path):
    """Return (all_ids, per_module_counts, per_file_source_map) across questions.json + complete-qa.json."""
    all_ids: set = set()
    per_module: dict = defaultdict(set)
    per_topic: dict = defaultdict(set)
    file_count = 0

    if not root.exists():
        return all_ids, dict(per_module), dict(per_topic), file_count

    for module, topic, topic_dir in iter_topic_dirs(root):
        for fname in ("questions.json", "complete-qa.json"):
            p = topic_dir / fname
            if not p.exists():
                continue
            file_count += 1
            try:
                data = json.loads(p.read_text(encoding="utf-8"))
            except Exception:
                continue
            if not isinstance(data, list):
                continue
            for item in data:
                if not isinstance(item, dict):
                    continue
                qid = item.get("id") or item.get("slug")
                if not qid:
                    continue
                all_ids.add(qid)
                per_module[module].add(qid)
                per_topic[f"{module}/{topic}"].add(qid)
    return all_ids, {k: v for k, v in per_module.items()}, {k: v for k, v in per_topic.items()}, file_count


def render_section(title: str, src_ids: set, dst_ids: set, src_per_mod, dst_per_mod, missing: list) -> str:
    lines = [f"## {title}"]
    lines.append("")
    lines.append(f"- Unique IDs in source: **{len(src_ids)}**")
    lines.append(f"- Unique IDs in target: **{len(dst_ids)}**")
    lines.append(f"- Present only in source (MISSING from target): **{len(missing)}**")
    lines.append("")
    if missing:
        lines.append(f"MISSING IDs (first 100 shown):")
        lines.append("")
        for mid in missing[:100]:
            lines.append(f"- `{mid}`")
        if len(missing) > 100:
            lines.append(f"- ...and {len(missing) - 100} more")
        lines.append("")
    else:
        lines.append("PASS — every source ID is present in the target.")
        lines.append("")
    lines.append("### Per-module ID counts")
    lines.append("")
    lines.append("| Module | Source IDs | Target IDs |")
    lines.append("|---|---:|---:|")
    all_mods = sorted(set(src_per_mod) | set(dst_per_mod))
    for mod in all_mods:
        s = len(src_per_mod.get(mod, set()))
        d = len(dst_per_mod.get(mod, set()))
        lines.append(f"| `{mod}` | {s} | {d} |")
    lines.append("")
    return "\n".join(lines)


def main():
    src_ids, src_per_mod, src_per_topic, src_files = collect_ids(SRC_ROOT)
    dst_ids, dst_per_mod, dst_per_topic, dst_files = collect_ids(DST_ROOT)

    missing = sorted(src_ids - dst_ids)
    extra = sorted(dst_ids - src_ids)

    section = []
    section.append("")
    section.append("---")
    section.append("")
    section.append("# Deeper Verification (questions.json + complete-qa.json IDs)")
    section.append("")
    section.append(f"- JSON files scanned in source tree: **{src_files}**")
    section.append(f"- JSON files scanned in target tree: **{dst_files}**")
    section.append(f"- Source unique question IDs: **{len(src_ids)}**")
    section.append(f"- Target unique question IDs: **{len(dst_ids)}**")
    section.append(f"- IDs only in source (MISSING in target): **{len(missing)}**")
    section.append(f"- IDs only in target (added/duplicated): **{len(extra)}**")
    section.append("")
    if missing:
        section.append(f"MISSING IDs (first 100 shown):")
        section.append("")
        for mid in missing[:100]:
            section.append(f"- `{mid}`")
        if len(missing) > 100:
            section.append(f"- ...and {len(missing) - 100} more")
        section.append("")
    else:
        section.append("PASS — every source question ID is present in the target tree.")
        section.append("")

    section.append("## Per-module ID counts (source vs target)")
    section.append("")
    section.append("| Source module / Target module | Source IDs | Target IDs |")
    section.append("|---|---:|---:|")
    all_mods = sorted(set(src_per_mod) | set(dst_per_mod))
    for mod in all_mods:
        s = len(src_per_mod.get(mod, set()))
        d = len(dst_per_mod.get(mod, set()))
        section.append(f"| `{mod}` | {s} | {d} |")
    section.append("")

    # Sum row
    section.append(f"**TOTAL: source {sum(len(v) for v in src_per_mod.values())} IDs across {len(src_per_mod)} modules, target {sum(len(v) for v in dst_per_mod.values())} IDs across {len(dst_per_mod)} modules**")
    section.append("")

    addition = "\n".join(section) + "\n"
    existing = REPORT_PATH.read_text(encoding="utf-8") if REPORT_PATH.exists() else ""
    REPORT_PATH.write_text(existing + addition, encoding="utf-8")

    print(f"JSON files scanned  (src/dst): {src_files} / {dst_files}")
    print(f"Unique question IDs (src/dst): {len(src_ids)} / {len(dst_ids)}")
    print(f"Missing from target           : {len(missing)}")
    print(f"Extra in target               : {len(extra)}")
    print()
    print("Per-module totals:")
    print(f"{'module':<35} {'src':>6} {'dst':>6}")
    for mod in all_mods:
        s = len(src_per_mod.get(mod, set()))
        d = len(dst_per_mod.get(mod, set()))
        print(f"{mod:<35} {s:>6} {d:>6}")

    if missing:
        print()
        print("WARNING: missing IDs (first 20):")
        for mid in missing[:20]:
            print(f"  - {mid}")


if __name__ == "__main__":
    main()
