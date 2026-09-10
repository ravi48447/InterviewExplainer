"""Self-contained merge helper for exc/mt JBF upgrades (avoids shared-name races)."""
import json

DATE = "2026-06-04"


def apply(path, updates):
    with open(path) as f:
        d = json.load(f)
    if isinstance(d, dict):
        d["last_updated"] = DATE
        qs = d.get("questions", [])
    else:
        qs = d
    seen = set()
    for q in qs:
        if not isinstance(q, dict):
            continue
        qid = q.get("id")
        u = updates.get(qid) or updates.get(q.get("slug"))
        if not u:
            continue
        seen.add(qid)
        for k in ("direct_answer", "layout_type", "interviewer_intent", "followup_questions"):
            if k in u:
                q[k] = u[k]
        if "sections" in u:
            ans = q.get("answer")
            if not isinstance(ans, dict):
                ans = {}
                q["answer"] = ans
            ans["sections"] = u["sections"]
        if "hook" in u and isinstance(q.get("speakable_v2"), dict):
            q["speakable_v2"]["hook"] = u["hook"]
        q["last_updated"] = DATE
    missing = set(updates) - seen - {q.get("slug") for q in qs if isinstance(q, dict)}
    if missing:
        print(f"  WARN {path}: ids not matched {sorted(missing)}")
    with open(path, "w") as f:
        json.dump(d, f, indent=2, ensure_ascii=False)
        f.write("\n")
    print(f"  updated {path} ({len(seen)} questions)")
