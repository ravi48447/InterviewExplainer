#!/usr/bin/env python3
"""apply_blueprint.py

Applies a Pillar blueprint to the JBI content tree.

INPUT:  content/blueprints/pillar-<N>-<slug>.json
EFFECT:
  - For every module in the blueprint:
      * Rewrites _config.json `topics` array to blueprint `topicOrder`.
      * For every topic in the blueprint:
          - Loads existing content/<module>/<topic>/complete-qa.json (may be empty).
          - Rebuilds the questions[] array in blueprint order:
              * Known slug (already has an answer)  -> keep full entry, stamp `order`.
              * New slug (not in existing)          -> insert stub {slug, title, question, difficulty, order, stub: true}.
          - Existing questions NOT listed in the blueprint are APPENDED at the end
            (preserves any V2 content the blueprint may have missed).
          - Writes complete-qa.json back.
  - Never deletes answers.
  - Never overwrites existing answer text.

USAGE:
  python3 scripts/apply_blueprint.py content/blueprints/pillar-01-java-language.json
"""

from __future__ import annotations

import json
import sys
from datetime import datetime
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
JBI_ROOT = ROOT / "content" / "java-backend-intermediate"
ARCHIVE_ROOT = ROOT / "content" / ".archive"


# ─── Slug → human text helpers ───────────────────────────────────────────────

def slug_to_title(slug: str) -> str:
    """Convert `how-does-hashmap-work-internally-java` →
    `How Does Hashmap Work Internally Java`. Only used when the blueprint
    omits an explicit title."""
    words = slug.replace("_", "-").split("-")
    return " ".join(w.capitalize() for w in words if w)


def slug_to_question(slug: str, title: str | None = None) -> str:
    """Make a natural-sounding question from a slug, if none supplied.
    Generally the blueprint should provide explicit questions."""
    t = title or slug_to_title(slug)
    # If it already looks like a question, leave it
    lower = t.lower().strip()
    if lower.endswith("?"):
        return t
    # Starters that read well as questions
    prefixes = ("what", "how", "why", "when", "which", "where", "can ", "is ", "are ", "does ", "do ", "should ")
    if lower.startswith(prefixes):
        return t + "?"
    return f"Explain: {t}"


# ─── Core merge logic ────────────────────────────────────────────────────────

def load_json(path: Path) -> dict[str, Any] | None:
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as exc:
        print(f"  [WARN] bad JSON at {path}: {exc}")
        return None


def write_json(path: Path, data: dict[str, Any]) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def build_stub(slug: str, meta: dict[str, Any], order: int) -> dict[str, Any]:
    title = meta.get("title") or slug_to_title(slug)
    question = meta.get("question") or slug_to_question(slug, title)
    difficulty = meta.get("difficulty") or "medium"
    importance = meta.get("importance") or "medium"
    entry: dict[str, Any] = {
        "id": slug,
        "title": title,
        "slug": slug,
        "question": question,
        "difficulty": difficulty,
        "importance": importance,
        "order": order,
        "stub": True,
    }
    if meta.get("tags"):
        entry["tags"] = meta["tags"]
    if meta.get("seoKeywords"):
        entry["seoKeywords"] = meta["seoKeywords"]
    return entry


def apply_topic(
    module_dir: Path,
    topic_slug: str,
    topic_cfg: dict[str, Any],
    report: dict[str, Any],
) -> None:
    topic_dir = module_dir / topic_slug
    topic_dir.mkdir(parents=True, exist_ok=True)
    qa_path = topic_dir / "complete-qa.json"

    existing = load_json(qa_path) or {}
    existing_qs: list[dict[str, Any]] = list(existing.get("questions") or [])
    existing_by_slug = {q.get("slug"): q for q in existing_qs if q.get("slug")}

    blueprint_questions: list[dict[str, Any]] = topic_cfg.get("questions", [])
    blueprint_slugs = [q["slug"] for q in blueprint_questions]

    new_questions: list[dict[str, Any]] = []
    kept = 0
    stubs_added = 0

    for order_idx, bq in enumerate(blueprint_questions, start=1):
        slug = bq["slug"]
        if slug in existing_by_slug:
            entry = dict(existing_by_slug[slug])
            entry["order"] = order_idx
            # Preserve existing stub flag if already present; otherwise default to
            # the answered state (no stub flag). Only add `stub: true` if the
            # existing entry has no answer sections AND blueprint doesn't
            # explicitly mark it as complete.
            new_questions.append(entry)
            kept += 1
        else:
            new_questions.append(build_stub(slug, bq, order_idx))
            stubs_added += 1

    # Leftover handling:
    #   * Real content (V2 / Phase-B answers) NOT in the blueprint  -> APPEND
    #     at the end so we never lose a human-authored answer.
    #   * Old stubs (`stub: true`) NOT in the blueprint              -> DROP.
    #     These are disposable drafts superseded by the new blueprint.
    blueprint_set = set(blueprint_slugs)
    dropped_stubs = 0
    leftover: list[dict[str, Any]] = []
    for q in existing_qs:
        slug = q.get("slug")
        if not slug or slug in blueprint_set:
            continue
        if q.get("stub") is True:
            dropped_stubs += 1
            continue
        leftover.append(q)
    for i, q in enumerate(leftover, start=len(blueprint_slugs) + 1):
        entry = dict(q)
        entry["order"] = i
        new_questions.append(entry)

    # Assemble envelope
    topic_name = existing.get("topic") or topic_cfg.get("title") or slug_to_title(topic_slug)
    envelope: dict[str, Any] = {
        "topic": topic_name,
        "topicSlug": topic_slug,
        "questions": new_questions,
    }
    # Carry over any top-level meta (e.g. `meta`, `version`) from existing.
    for k, v in existing.items():
        if k in {"topic", "topicSlug", "questions"}:
            continue
        envelope[k] = v

    write_json(qa_path, envelope)

    report.setdefault("topics", []).append({
        "module": module_dir.name,
        "topic": topic_slug,
        "kept": kept,
        "stubsAdded": stubs_added,
        "leftoverAppended": len(leftover),
        "droppedStubs": dropped_stubs,
        "total": len(new_questions),
    })


def apply_module(blueprint_module: dict[str, Any], report: dict[str, Any]) -> None:
    slug = blueprint_module["moduleSlug"]
    module_dir = JBI_ROOT / slug
    if not module_dir.exists():
        print(f"  [SKIP] Module dir missing: {module_dir}")
        return

    # Update _config.json topics array to blueprint order.
    cfg_path = module_dir / "_config.json"
    cfg = load_json(cfg_path) or {}
    new_topics_order: list[str] = blueprint_module.get("topicOrder", [])
    if new_topics_order:
        cfg["topics"] = new_topics_order
        write_json(cfg_path, cfg)

    # Apply each topic.
    topics_blueprint: dict[str, dict[str, Any]] = blueprint_module.get("topics", {})
    for topic_slug in new_topics_order:
        topic_cfg = topics_blueprint.get(topic_slug)
        if topic_cfg is None:
            # Topic listed but not defined -> skip (keeps existing content untouched).
            continue
        apply_topic(module_dir, topic_slug, topic_cfg, report)

    print(f"  ✓ {slug}")


def archive_tree(tag: str) -> Path:
    stamp = datetime.now().strftime("%Y%m%d-%H%M%S")
    dest = ARCHIVE_ROOT / f"jbi-blueprint-{tag}-{stamp}"
    dest.mkdir(parents=True, exist_ok=True)
    # Shallow: copy only complete-qa.json + _config.json per module/topic.
    import shutil
    for mod_dir in JBI_ROOT.iterdir():
        if not mod_dir.is_dir() or mod_dir.name.startswith("_") or mod_dir.name.startswith("."):
            continue
        out_mod = dest / mod_dir.name
        out_mod.mkdir(parents=True, exist_ok=True)
        for src in mod_dir.iterdir():
            if src.is_file() and src.name in {"_config.json"}:
                shutil.copy2(src, out_mod / src.name)
            elif src.is_dir():
                out_topic = out_mod / src.name
                out_topic.mkdir(parents=True, exist_ok=True)
                for qa in src.iterdir():
                    if qa.name in {"complete-qa.json", "_config.json"}:
                        shutil.copy2(qa, out_topic / qa.name)
    return dest


def main() -> int:
    if len(sys.argv) < 2:
        print("usage: apply_blueprint.py <blueprint.json>", file=sys.stderr)
        return 2

    bp_path = Path(sys.argv[1]).resolve()
    if not bp_path.exists():
        print(f"blueprint not found: {bp_path}", file=sys.stderr)
        return 1

    blueprint = json.loads(bp_path.read_text(encoding="utf-8"))
    pillar_num = blueprint.get("pillarNumber", "??")
    pillar_name = blueprint.get("pillarName", "??")
    domain = blueprint.get("domainSlug", "java-backend-intermediate")

    print(f"\n=== Pillar {pillar_num}: {pillar_name} ===")
    print(f"    domain: {domain}")

    archive_tag = f"p{pillar_num:02d}" if isinstance(pillar_num, int) else str(pillar_num)
    archive = archive_tree(archive_tag)
    print(f"    archived prior content -> {archive.relative_to(ROOT)}")

    report: dict[str, Any] = {
        "pillar": pillar_num,
        "blueprint": str(bp_path.relative_to(ROOT)),
        "appliedAt": datetime.now().isoformat(timespec="seconds"),
        "topics": [],
    }

    for mod in blueprint.get("modules", []):
        apply_module(mod, report)

    # Summary
    total_kept = sum(t["kept"] for t in report["topics"])
    total_stubs = sum(t["stubsAdded"] for t in report["topics"])
    total_left = sum(t["leftoverAppended"] for t in report["topics"])
    total_dropped = sum(t.get("droppedStubs", 0) for t in report["topics"])
    total = sum(t["total"] for t in report["topics"])
    print("\n  SUMMARY")
    print(f"    topics touched:       {len(report['topics'])}")
    print(f"    existing kept:        {total_kept}")
    print(f"    new stubs added:      {total_stubs}")
    print(f"    old stubs dropped:    {total_dropped}")
    print(f"    V2 leftover appended: {total_left}")
    print(f"    total questions:      {total}")

    # Write report next to blueprint
    report_path = bp_path.with_name(bp_path.stem + ".report.json")
    report_path.write_text(json.dumps(report, indent=2) + "\n", encoding="utf-8")
    print(f"\n    report -> {report_path.relative_to(ROOT)}")

    return 0


if __name__ == "__main__":
    raise SystemExit(main())
