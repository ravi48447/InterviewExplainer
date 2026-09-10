"""Reusable merge helper for upgrading JBF questions in place.

Preserves the file's original shape (dict-with-questions OR top-level list) and
every existing key on each question. Only the upgraded fields are overwritten.
"""
import json
import os


def _section(type_, title, content):
    return {"type": type_, "title": title, "content": content}


def apply_updates(path, updates):
    """updates: {qid: {direct_answer, intent, layout_type, sections, followups,
    hook, reading_time?}} where sections is a list of (type, title, content)."""
    with open(path) as f:
        data = json.load(f)
    is_list = isinstance(data, list)
    questions = data if is_list else data.get("questions", [])

    seen = set()
    for q in questions:
        if not isinstance(q, dict):
            continue
        qid = q.get("id")
        if qid not in updates:
            continue
        seen.add(qid)
        u = updates[qid]

        if "direct_answer" in u:
            q["direct_answer"] = u["direct_answer"]
        if "intent" in u:
            q["interviewer_intent"] = u["intent"]
        if "layout_type" in u:
            q["layout_type"] = u["layout_type"]
        if "reading_time" in u:
            q["reading_time_minutes"] = u["reading_time"]
        if "sections" in u:
            q.setdefault("answer", {})
            q["answer"]["sections"] = [_section(*s) for s in u["sections"]]
        if "followups" in u:
            q["followup_questions"] = u["followups"]
        if "hook" in u:
            sv2 = q.get("speakable_v2")
            if isinstance(sv2, dict):
                sv2["hook"] = u["hook"]
                sv2["speakable_status"] = "reviewed"
        q["last_updated"] = "2026-06-04"

    missing = set(updates) - seen
    if missing:
        raise SystemExit(f"IDs not found in {os.path.basename(path)}: {sorted(missing)}")

    with open(path, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"OK {os.path.relpath(path)} — updated {len(seen)} questions")
