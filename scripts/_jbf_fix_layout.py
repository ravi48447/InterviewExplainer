#!/usr/bin/env python3
"""One-off: replace legacy/default layout_type on JBF questions with a sensible
archetype inferred from the question's existing answer.sections. Only touches
questions whose layout_type is legacy ('default'/'explanation'/''/None); never
changes section content. Pass module dirs as args."""
import json
import sys
import glob
import os

LEGACY = {"default", "explanation", "", None}


def pick_layout(sections):
    types = {s.get("type") for s in sections if isinstance(s, dict)}
    if "comparison_table" in types:
        return "comparison-arena"
    if {"sequence_diagram", "flow_diagram"} & types:
        return "lifecycle-timeline"
    if "architecture_diagram" in types:
        return "architecture-map"
    if "step" in types:
        return "recipe-builder"
    return "concept-explainer"


def fix_file(path):
    with open(path) as f:
        data = json.load(f)
    qs = data if isinstance(data, list) else data.get("questions", [])
    changed = 0
    for q in qs:
        if not isinstance(q, dict):
            continue
        if q.get("layout_type") in LEGACY:
            ans = q.get("answer")
            secs = ans.get("sections", []) if isinstance(ans, dict) else []
            q["layout_type"] = pick_layout(secs)
            changed += 1
    if changed:
        with open(path, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")
    return changed


def main():
    total = 0
    for target in sys.argv[1:]:
        for path in sorted(glob.glob(os.path.join(target, "**", "complete-qa.json"),
                                     recursive=True)):
            n = fix_file(path)
            if n:
                print(f"{path}: {n} layout_type fixed")
                total += n
    print(f"TOTAL layout_type fixed: {total}")


if __name__ == "__main__":
    main()
