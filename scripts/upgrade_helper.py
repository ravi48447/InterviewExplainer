"""Helper to surgically upgrade complete-qa.json files.

Adds mermaid architecture_diagram + tradeoffs sections to existing questions,
or replaces an entire topic file with new Q&A content.

Pattern matches the System Design pillar upgrade (rate-limiter, k8s-fundamentals).
"""
import json
import os
from typing import Dict, List, Any, Optional


def insert_sections(
    file_path: str,
    upgrades: Dict[str, Dict[str, Any]],
    *,
    dry_run: bool = False,
) -> Dict[str, str]:
    """For each question (by slug) in upgrades, insert architecture_diagram
    after overview and tradeoffs before key_points.

    upgrades schema: { slug: {
        "diagram": {"title": "...", "content": "..."},   # optional
        "tradeoffs": {"title": "...", "content": "..."}, # optional
        "extra_sections": [ {"type":..,"title":..,"content":..,"insert_after_type":..} ]  # optional
    } }
    """
    with open(file_path, "r") as fp:
        data = json.load(fp)

    log: Dict[str, str] = {}
    for q in data.get("questions", []):
        slug = q.get("slug")
        if slug not in upgrades:
            continue
        up = upgrades[slug]
        sections: List[Dict[str, Any]] = q.get("answer", {}).get("sections", [])
        existing_types = [s.get("type") for s in sections]

        # 1. Insert architecture_diagram after overview (if not already present)
        if "diagram" in up and "architecture_diagram" not in existing_types:
            diag = {
                "type": "architecture_diagram",
                "title": up["diagram"]["title"],
                "content": up["diagram"]["content"],
            }
            # find overview index
            try:
                idx = next(i for i, s in enumerate(sections) if s.get("type") == "overview")
                sections.insert(idx + 1, diag)
            except StopIteration:
                sections.insert(0, diag)

        # 2. Insert tradeoffs before key_points (if not already present)
        if "tradeoffs" in up and "tradeoffs" not in [s.get("type") for s in sections]:
            tro = {
                "type": "tradeoffs",
                "title": up["tradeoffs"]["title"],
                "content": up["tradeoffs"]["content"],
            }
            types_now = [s.get("type") for s in sections]
            try:
                idx = next(i for i, t in enumerate(types_now) if t == "key_points")
                sections.insert(idx, tro)
            except StopIteration:
                # put before speakable_answer if no key_points
                try:
                    idx = next(i for i, t in enumerate(types_now) if t == "speakable_answer")
                    sections.insert(idx, tro)
                except StopIteration:
                    sections.append(tro)

        # 3. Any extra sections
        for extra in up.get("extra_sections", []):
            anchor = extra.pop("insert_after_type", None)
            types_now = [s.get("type") for s in sections]
            if anchor and anchor in types_now:
                idx = types_now.index(anchor)
                sections.insert(idx + 1, extra)
            else:
                sections.append(extra)

        q["answer"]["sections"] = sections
        log[slug] = f"OK :: now {len(sections)} sections"

    if not dry_run:
        with open(file_path, "w") as fp:
            json.dump(data, fp, indent=2, ensure_ascii=False)
    return log


def write_topic_file(
    file_path: str,
    topic: str,
    topic_slug: str,
    questions: List[Dict[str, Any]],
) -> None:
    """Write a fresh complete-qa.json for a topic (used for empty folders)."""
    os.makedirs(os.path.dirname(file_path), exist_ok=True)
    with open(file_path, "w") as fp:
        json.dump({"topic": topic, "topicSlug": topic_slug, "questions": questions}, fp, indent=2, ensure_ascii=False)


if __name__ == "__main__":
    import sys
    print("This module is a library used by per-module upgrade scripts.")
