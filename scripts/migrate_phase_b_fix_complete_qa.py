"""
Phase B HOTFIX — Re-merge complete-qa.json correctly.

Why this script exists
----------------------
The original `migrate_phase_b_and_c.py` treated `complete-qa.json` as a
list of question dicts. In reality, the source files are shaped like:

    {
      "topic": "...",
      "topicSlug": "...",
      "domain": "...",
      "stack": "...",
      ...,
      "questions": [ { "id": "...", "title": "...", ... }, ... ]
    }

Passing a dict to a list-merge routine iterated the dict's KEYS, producing
target files that looked like:

    ["topic", "topicSlug", "domain", "stack", "experience", "category", "questions"]

That's what the UI surfaced as "0 questions" via `qaData.questions` being
undefined. No data was lost from the SOURCE tree, only the target's
complete-qa.json was corrupted.

What this script does
---------------------
1. Deletes every `content/java-backend-intermediate/*/*/complete-qa.json`
   so we start from a clean slate for that file type only.
2. Re-executes the same mapping table as the original migration, but uses
   an envelope-aware merge:
   - If source is a dict with a `questions` array, merge that questions
     array into the target's questions array by `id`, preserving the
     first-seen envelope (topic, topicSlug, domain, ...).
   - If source is a list, treat it as a raw questions array (back-compat).
3. Leaves `questions.json` and `answers/*.json` UNTOUCHED — they were
   copied correctly the first time.
4. Verifies every target `complete-qa.json` is a well-formed envelope with
   a real `questions` array, and reports total question counts.

Source tree (content/domains/java/backend/intermediate/) is read-only here.
"""

from __future__ import annotations

import json
from collections import defaultdict
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parents[1]
SRC_ROOT = REPO_ROOT / "content" / "domains" / "java" / "backend" / "intermediate"
DST_ROOT = REPO_ROOT / "content" / "java-backend-intermediate"
REPORT_PATH = REPO_ROOT / "content" / "MIGRATION_REPORT.md"

# Import the mapping table from the original migration script so we don't
# drift. This file is in the same directory.
import importlib.util
_spec = importlib.util.spec_from_file_location(
    "_orig_mig", Path(__file__).with_name("migrate_phase_b_and_c.py")
)
assert _spec is not None and _spec.loader is not None
_orig = importlib.util.module_from_spec(_spec)
_spec.loader.exec_module(_orig)
MAPPINGS = _orig.MAPPINGS


# ---------------------------------------------------------------------------
# JSON helpers
# ---------------------------------------------------------------------------

def load_json(path: Path):
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except json.JSONDecodeError as e:
        raise RuntimeError(f"invalid JSON in {path}: {e}") from e


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def extract_questions(data) -> list:
    """Return the questions list regardless of file shape (dict or list)."""
    if data is None:
        return []
    if isinstance(data, list):
        return [q for q in data if isinstance(q, dict)]
    if isinstance(data, dict):
        qs = data.get("questions")
        return [q for q in qs if isinstance(q, dict)] if isinstance(qs, list) else []
    return []


def extract_envelope(data) -> dict:
    """Return the non-questions metadata envelope, empty dict if no envelope."""
    if isinstance(data, dict):
        return {k: v for k, v in data.items() if k != "questions"}
    return {}


def merge_questions_by_id(existing: list, new: list, log: dict) -> list:
    """Merge two question lists, deduplicating by 'id' (fallback to 'slug').
    Preserves first-seen order (existing wins on collision)."""
    result: list = []
    seen: set = set()

    def key_of(q: dict):
        return q.get("id") or q.get("slug")

    for q in existing:
        k = key_of(q)
        if k is None:
            result.append(q)
            continue
        if k in seen:
            log["dupes_in_existing"].append(k)
            continue
        seen.add(k)
        result.append(q)

    for q in new:
        k = key_of(q)
        if k is None:
            result.append(q)
            continue
        if k in seen:
            log["dupes_dropped_on_merge"].append(k)
            continue
        seen.add(k)
        result.append(q)

    return result


# ---------------------------------------------------------------------------
# Clean + re-copy complete-qa.json
# ---------------------------------------------------------------------------

def wipe_all_complete_qa(log: dict) -> None:
    """Delete every complete-qa.json under DST_ROOT so we can regenerate."""
    if not DST_ROOT.exists():
        return
    for p in DST_ROOT.rglob("complete-qa.json"):
        try:
            p.unlink()
            log["files_wiped"] += 1
        except OSError as e:
            log["wipe_errors"].append(f"{p}: {e}")


def merge_one_source_into_target(
    src_topic_dir: Path,
    dst_topic_dir: Path,
    log: dict,
) -> None:
    """Read source/complete-qa.json, envelope-merge into dst/complete-qa.json."""
    src_path = src_topic_dir / "complete-qa.json"
    if not src_path.exists():
        return

    src_data = load_json(src_path)
    src_questions = extract_questions(src_data)
    src_envelope = extract_envelope(src_data)

    if not src_questions and not src_envelope:
        log["sources_empty"].append(str(src_path.relative_to(REPO_ROOT)))
        return

    dst_topic_dir.mkdir(parents=True, exist_ok=True)
    dst_path = dst_topic_dir / "complete-qa.json"

    dst_data = load_json(dst_path)
    dst_questions = extract_questions(dst_data)
    dst_envelope = extract_envelope(dst_data)

    # First-seen envelope wins. If dst has nothing yet, take src's.
    envelope = dst_envelope if dst_envelope else src_envelope

    # Override select fields to reflect the NEW tree's identity where set in
    # the source envelope, but keep the envelope's topic/topicSlug so the
    # document reads sensibly for readers that display topic name.
    merged_questions = merge_questions_by_id(dst_questions, src_questions, log)

    out = dict(envelope)
    out["questions"] = merged_questions
    write_json(dst_path, out)
    log["files_written"] += 1


def run_fix() -> dict:
    log: dict = {
        "files_wiped": 0,
        "wipe_errors": [],
        "rows_processed": 0,
        "files_written": 0,
        "sources_missing": [],
        "sources_empty": [],
        "dupes_in_existing": [],
        "dupes_dropped_on_merge": [],
    }

    wipe_all_complete_qa(log)

    for src_mod, src_topic, dst_mod, dst_topic in MAPPINGS:
        src_dir = SRC_ROOT / src_mod / src_topic
        dst_dir = DST_ROOT / dst_mod / dst_topic
        if not src_dir.exists():
            log["sources_missing"].append(f"{src_mod}/{src_topic}")
            log["rows_processed"] += 1
            continue
        merge_one_source_into_target(src_dir, dst_dir, log)
        log["rows_processed"] += 1

    return log


# ---------------------------------------------------------------------------
# Verification — counts + structural checks
# ---------------------------------------------------------------------------

def verify_target() -> dict:
    """Walk DST_ROOT and validate every complete-qa.json we touched."""
    stats = {
        "files_found": 0,
        "files_valid_envelope": 0,
        "files_malformed": [],
        "total_questions": 0,
        "per_module_questions": defaultdict(int),
        "per_module_topics": defaultdict(int),
    }
    if not DST_ROOT.exists():
        return stats

    for module_dir in sorted(p for p in DST_ROOT.iterdir() if p.is_dir()):
        for topic_dir in sorted(p for p in module_dir.iterdir() if p.is_dir()):
            qa_path = topic_dir / "complete-qa.json"
            if not qa_path.exists():
                continue
            stats["files_found"] += 1
            stats["per_module_topics"][module_dir.name] += 1
            data = load_json(qa_path)
            if not isinstance(data, dict) or not isinstance(data.get("questions"), list):
                stats["files_malformed"].append(str(qa_path.relative_to(REPO_ROOT)))
                continue
            stats["files_valid_envelope"] += 1
            n = len(data["questions"])
            stats["total_questions"] += n
            stats["per_module_questions"][module_dir.name] += n
    return stats


def append_report(fix_log: dict, verify_stats: dict) -> None:
    """Append a hotfix section to content/MIGRATION_REPORT.md."""
    lines: list = []
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Phase B Hotfix — complete-qa.json re-merge")
    lines.append("")
    lines.append("Regenerated by `scripts/migrate_phase_b_fix_complete_qa.py`.")
    lines.append("")
    lines.append(f"- Corrupted files wiped: **{fix_log['files_wiped']}**")
    lines.append(f"- Mapping rows processed: **{fix_log['rows_processed']}**")
    lines.append(f"- Source folders referenced but missing: **{len(fix_log['sources_missing'])}**")
    lines.append(f"- Source complete-qa.json files found empty: **{len(fix_log['sources_empty'])}**")
    lines.append(f"- Target complete-qa.json files written: **{fix_log['files_written']}**")
    lines.append(f"- Duplicate IDs dropped during re-merge: **{len(fix_log['dupes_dropped_on_merge'])}**")
    lines.append("")
    lines.append("### Post-fix verification")
    lines.append("")
    lines.append(f"- Files found in target: **{verify_stats['files_found']}**")
    lines.append(f"- Files with a valid `{{questions: [...]}}` envelope: **{verify_stats['files_valid_envelope']}**")
    lines.append(f"- Malformed files still remaining: **{len(verify_stats['files_malformed'])}**")
    lines.append(f"- Total questions across target tree: **{verify_stats['total_questions']}**")
    lines.append("")
    lines.append("#### Per-module question counts (post-fix)")
    lines.append("")
    lines.append("| Module | Topics | Questions |")
    lines.append("|---|---:|---:|")
    for mod in sorted(verify_stats["per_module_questions"]):
        lines.append(
            f"| `{mod}` | {verify_stats['per_module_topics'][mod]} | {verify_stats['per_module_questions'][mod]} |"
        )
    lines.append("")
    if verify_stats["files_malformed"]:
        lines.append("#### Malformed files still present after re-merge")
        lines.append("")
        for f in verify_stats["files_malformed"][:50]:
            lines.append(f"- `{f}`")
        lines.append("")

    existing = REPORT_PATH.read_text(encoding="utf-8") if REPORT_PATH.exists() else ""
    REPORT_PATH.write_text(existing + "\n".join(lines) + "\n", encoding="utf-8")


if __name__ == "__main__":
    print("[hotfix] wiping corrupted complete-qa.json and re-merging...")
    fix_log = run_fix()
    print(f"[hotfix] wiped        : {fix_log['files_wiped']}")
    print(f"[hotfix] rows done    : {fix_log['rows_processed']}")
    print(f"[hotfix] written      : {fix_log['files_written']}")
    print(f"[hotfix] sources miss : {len(fix_log['sources_missing'])}")
    print(f"[hotfix] dupes dropped: {len(fix_log['dupes_dropped_on_merge'])}")
    print()
    print("[hotfix] verifying target tree...")
    v = verify_target()
    print(f"[hotfix] files found       : {v['files_found']}")
    print(f"[hotfix] files valid       : {v['files_valid_envelope']}")
    print(f"[hotfix] files malformed   : {len(v['files_malformed'])}")
    print(f"[hotfix] total questions   : {v['total_questions']}")
    print()
    append_report(fix_log, v)
    print(f"[hotfix] appended results to: {REPORT_PATH.relative_to(REPO_ROOT)}")
