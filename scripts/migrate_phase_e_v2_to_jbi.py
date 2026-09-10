"""
Phase E — Move V2 (content/interview/java/backend/intermediate/**) into the
new JBI tree (content/java-backend-intermediate/**) per content/ARCHITECTURE.md.

CONTRACT (user-stated, 2026-04-17):
   "don't rewrite, just move all older questions here; only need to modify
   their URLs or anything; bring all questions into current architecture and
   not only spring-boot, but entire modules from Java to last system design"

Therefore this script:
   1. Reads every complete-qa.json under the V2 tree.
   2. For each V2 source folder, appends its `questions[]` into the target
      JBI topic's complete-qa.json (merge-by-id, never overwrite).
   3. Preserves every question field exactly (id, slug, title, question,
      answer.sections, difficulty, importance, etc.).
   4. The only thing that "changes" is the file path: each question ends up
      inside its architecturally-correct module/topic folder, so its App URL
      becomes /java-backend-intermediate/<module>/<slug> — matching the
      locked architecture.
   5. Never deletes source. Never drops a question. Appends a per-run report
      to content/MIGRATION_REPORT.md so the move is auditable.

SAFETY:
   - Idempotent: re-running produces the same end state (dedupe by id).
   - If a question id is already in the target (from Phase B), the existing
     entry wins (we do not overwrite Phase B content with V2 content).
   - If two V2 sources claim the same id, first-seen wins + duplicate is logged.
   - Envelope (topic / topicSlug / domain / stack / experience / category) of
     the JBI target is PRESERVED, not replaced.
"""
from __future__ import annotations

import json
from collections import defaultdict
from datetime import datetime
from pathlib import Path

# ─── Paths ───────────────────────────────────────────────────────────────────
REPO_ROOT = Path(__file__).resolve().parent.parent
V2_ROOT = REPO_ROOT / "content" / "interview" / "java" / "backend" / "intermediate"
JBI_ROOT = REPO_ROOT / "content" / "java-backend-intermediate"
REPORT_PATH = REPO_ROOT / "content" / "MIGRATION_REPORT.md"

# ─── V2 → JBI mapping ────────────────────────────────────────────────────────
# Each entry: (v2_relative_path, jbi_module_slug, jbi_primary_topic_slug)
#
# "Primary topic" = where a V2 folder's questions land by default. We do NOT
# split V2 folders across multiple JBI topics in this phase — the user can
# move individual questions between topics later (it's a simple JSON edit).
# This keeps Phase E zero-loss and zero-rewrite.
#
# Topic slugs have been cross-checked against ARCHITECTURE.md module topic
# lists AND the actual JBI scaffolded folders — see the audit step above.
MAPPINGS: list[tuple[str, str, str]] = [
    # ─── Pillar 01 · Java Language & Core ───
    ("01-java-language/01-java-fundamentals",          "core-java",           "scenario-based"),
    ("01-java-language/02-collections-data-structures","java-collections",    "collections-internals"),
    ("01-java-language/03-java-streams-modern",        "java-streams",        "streams-api"),
    ("01-java-language/04-concurrency-multithreading", "java-concurrency",    "scenario-based"),
    ("01-java-language/05-jvm-internals-performance",  "jvm-internals",       "jvm-tuning"),

    # ─── Pillar 02 · Spring Ecosystem ───
    ("02-spring-ecosystem/06-spring-core",                        "spring-core",     "scenario-based"),
    ("02-spring-ecosystem/07-spring-boot",                        "spring-boot",     "scenario-based"),
    ("02-spring-ecosystem/08-data-persistence-jpa-hibernate",     "spring-data-jpa", "scenario-based"),
    ("02-spring-ecosystem/09-spring-security",                    "spring-security", "scenario-based"),
    ("02-spring-ecosystem/10-spring-batch",                       "spring-batch",    "batch-fundamentals"),

    # ─── Pillar 03 · Data & Persistence ───
    ("03-data-persistence/10-database-design", "sql-databases",  "sql-fundamentals"),
    ("03-data-persistence/10-mysql",           "sql-databases",  "advanced-sql-features"),
    ("03-data-persistence/10-postgresql",      "sql-databases",  "postgresql-features"),
    ("03-data-persistence/11-elasticsearch",   "nosql-mongodb",  "elasticsearch-basics"),
    ("03-data-persistence/11-mongodb",         "nosql-mongodb",  "mongodb-core"),
    ("03-data-persistence/12-redis",           "redis-caching",  "redis-advanced"),

    # ─── Pillar 04 · APIs, Microservices & Messaging ───
    ("04-apis-messaging/13-graphql",                  "rest-api",          "graphql-with-spring"),
    ("04-apis-messaging/13-grpc",                     "rest-api",          "grpc-basics"),
    ("04-apis-messaging/13-rest-apis-spring-mvc",     "rest-api",          "rest-fundamentals"),
    ("04-apis-messaging/14-microservices",            "microservices",     "fundamentals"),
    ("04-apis-messaging/14-spring-cloud",             "microservices",     "config-management"),
    ("04-apis-messaging/15-event-driven-architecture","messaging-events",  "event-sourcing"),
    ("04-apis-messaging/15-rabbitmq",                 "messaging-events",  "rabbitmq"),
    ("04-apis-messaging/15-spring-kafka",             "messaging-events",  "spring-kafka"),
    ("04-apis-messaging/15-websockets",               "microservices",     "communication-patterns"),

    # ─── Pillar 05 · Architecture & Design ───
    ("05-architecture-design/16-design-patterns",      "design-patterns",       "solid-principles"),
    ("05-architecture-design/17-architecture-patterns","architecture-patterns", "architectural-styles"),
    ("05-architecture-design/17-clean-architecture",   "architecture-patterns", "clean-architecture"),
    ("05-architecture-design/17-domain-driven-design", "architecture-patterns", "domain-driven-design"),

    # ─── Pillar 06 · System Design ───
    ("06-system-design/18-fundamentals-building-blocks","system-design",       "design-fundamentals"),
    ("06-system-design/19-hld-design-problems",         "system-design-cases", "url-shortener"),
    ("06-system-design/19-lld-component-design",        "system-design",       "capacity-planning"),

    # ─── Pillar 08 · Testing & Quality ───
    ("08-testing-quality/21-testing", "unit-testing", "unit-testing-basics"),

    # ─── Pillar 09 · DevOps ───
    ("09-devops/23-build-tools",      "git-build-tools", "maven-build"),
    ("09-devops/23-git",              "git-build-tools", "git-internals"),
    ("09-devops/24-ci-cd-pipelines",  "cicd",            "cicd-fundamentals"),
    ("09-devops/24-terraform",        "cloud-native",    "cloud-design-patterns"),
    ("09-devops/25-docker",           "docker",          "docker-fundamentals"),
    ("09-devops/26-kubernetes",       "kubernetes",      "kubernetes-fundamentals"),

    # ─── Pillar 10 · Cloud ───
    ("10-cloud/27-aws",   "aws-cloud", "aws-core-services"),
    ("10-cloud/28-azure", "aws-cloud", "gcp-and-azure-overview"),
    ("10-cloud/28-gcp",   "aws-cloud", "gcp-and-azure-overview"),

    # ─── Pillar 11 · Production ───
    ("11-production/29-observability-monitoring", "observability",  "metrics-and-micrometer"),
    ("11-production/30-performance-tuning",       "production-sre", "performance-troubleshooting"),
    ("11-production/30-production-operations",    "production-sre", "debugging-production"),

    # ─── Pillar 12 · Interview Readiness ───
    ("12-professional/32-behavioral", "behavioral", "star-method"),
]


# ─── JSON I/O helpers ────────────────────────────────────────────────────────

def load_json(path: Path):
    if not path.exists():
        return None
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception as exc:
        print(f"[warn] could not parse {path}: {exc}")
        return None


def write_json(path: Path, data) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")


def extract_questions(data) -> list[dict]:
    """Pull the `questions` array out of any complete-qa.json shape we've seen."""
    if data is None:
        return []
    if isinstance(data, dict):
        qs = data.get("questions")
        if isinstance(qs, list):
            return qs
    if isinstance(data, list):
        return [q for q in data if isinstance(q, dict)]
    return []


def default_envelope(module_slug: str, topic_slug: str) -> dict:
    """Envelope used when a JBI target has no complete-qa.json yet."""
    return {
        "topic":       topic_slug.replace("-", " ").title(),
        "topicSlug":   topic_slug,
        "domain":      "java",
        "stack":       module_slug,
        "experience":  "intermediate",
        "category":    "java-backend-intermediate",
        "questions":   [],
    }


def merge_questions_by_id(
    existing: list[dict],
    incoming: list[dict],
    log: dict,
    source: str,
) -> list[dict]:
    """Append `incoming` to `existing`, deduped by `id` then by `slug`.

    First-seen wins. Phase B data (already in `existing`) is never overwritten
    by V2 data (coming in `incoming`).
    """
    result = list(existing)
    seen_ids = {q.get("id") for q in result if isinstance(q, dict) and q.get("id")}
    seen_slugs = {q.get("slug") for q in result if isinstance(q, dict) and q.get("slug")}

    for q in incoming:
        if not isinstance(q, dict):
            continue
        qid = q.get("id")
        slug = q.get("slug")
        if qid and qid in seen_ids:
            log["dupes_by_id"].append({"source": source, "id": qid, "slug": slug})
            continue
        if slug and slug in seen_slugs:
            log["dupes_by_slug"].append({"source": source, "id": qid, "slug": slug})
            continue
        result.append(q)
        if qid:
            seen_ids.add(qid)
        if slug:
            seen_slugs.add(slug)
    return result


# ─── Main migration routine ──────────────────────────────────────────────────

def migrate_one(v2_rel: str, mod_slug: str, topic_slug: str, log: dict) -> None:
    src_qa = V2_ROOT / v2_rel / "complete-qa.json"
    dst_dir = JBI_ROOT / mod_slug / topic_slug
    dst_qa = dst_dir / "complete-qa.json"

    if not src_qa.exists():
        log["sources_missing"].append(v2_rel)
        return

    src_data = load_json(src_qa)
    src_qs = extract_questions(src_data)
    if not src_qs:
        log["sources_empty"].append(v2_rel)
        return

    dst_data = load_json(dst_qa) or default_envelope(mod_slug, topic_slug)
    if not isinstance(dst_data, dict):
        log["targets_malformed"].append(str(dst_qa.relative_to(REPO_ROOT)))
        return
    dst_qs_before = extract_questions(dst_data)

    merged = merge_questions_by_id(
        existing=dst_qs_before,
        incoming=src_qs,
        log=log,
        source=v2_rel,
    )
    added = len(merged) - len(dst_qs_before)

    dst_data["questions"] = merged
    # preserve topic / topicSlug if envelope already had them; otherwise
    # default_envelope already set them correctly.
    dst_data.setdefault("topicSlug", topic_slug)
    dst_data.setdefault("topic", topic_slug.replace("-", " ").title())
    dst_data.setdefault("domain", "java")
    dst_data.setdefault("stack", mod_slug)
    dst_data.setdefault("experience", "intermediate")
    dst_data.setdefault("category", "java-backend-intermediate")

    write_json(dst_qa, dst_data)

    log["per_source"].append({
        "source":        v2_rel,
        "target":        f"{mod_slug}/{topic_slug}",
        "src_questions": len(src_qs),
        "dst_before":    len(dst_qs_before),
        "dst_after":     len(merged),
        "added":         added,
    })
    log["total_src_questions"] += len(src_qs)
    log["total_added"]         += added


def run() -> dict:
    log = {
        "started_at":          datetime.utcnow().isoformat() + "Z",
        "total_src_questions": 0,
        "total_added":         0,
        "per_source":          [],
        "sources_missing":     [],
        "sources_empty":       [],
        "targets_malformed":   [],
        "dupes_by_id":         [],
        "dupes_by_slug":       [],
    }
    for src, mod, topic in MAPPINGS:
        migrate_one(src, mod, topic, log)
    log["finished_at"] = datetime.utcnow().isoformat() + "Z"
    return log


def count_tree(root: Path, label: str) -> dict:
    """Return per-module question counts for a tree (for before/after audit)."""
    counts: dict[str, int] = defaultdict(int)
    total = 0
    if not root.exists():
        return {"label": label, "total": 0, "by_module": {}}
    for mod in sorted(root.iterdir()):
        if not mod.is_dir() or mod.name.startswith((".", "_")):
            continue
        for qa in mod.rglob("complete-qa.json"):
            data = load_json(qa)
            qs = extract_questions(data)
            counts[mod.name] += len(qs)
            total += len(qs)
    return {"label": label, "total": total, "by_module": dict(counts)}


def append_report(log: dict, before: dict, after: dict) -> None:
    lines: list[str] = []
    lines.append("")
    lines.append("---")
    lines.append("")
    lines.append("## Phase E — V2 → JBI content migration")
    lines.append("")
    lines.append(f"Run:    {log['started_at']} → {log['finished_at']}")
    lines.append(f"Sources processed: {len(log['per_source'])} / {len(MAPPINGS)}")
    lines.append(f"Total V2 questions inspected: {log['total_src_questions']}")
    lines.append(f"Total questions appended to JBI: {log['total_added']}")
    lines.append(f"Duplicate IDs skipped (already in JBI from Phase B): {len(log['dupes_by_id'])}")
    lines.append(f"Duplicate slugs skipped: {len(log['dupes_by_slug'])}")
    lines.append(f"V2 sources missing complete-qa.json: {len(log['sources_missing'])}")
    lines.append(f"V2 sources with empty questions[]: {len(log['sources_empty'])}")
    lines.append(f"JBI targets malformed: {len(log['targets_malformed'])}")
    lines.append("")
    lines.append("### JBI tree — before vs after")
    lines.append("")
    lines.append("| Module | Before | After | Delta |")
    lines.append("|---|---:|---:|---:|")
    all_modules = sorted(set(before["by_module"]) | set(after["by_module"]))
    for mod in all_modules:
        b = before["by_module"].get(mod, 0)
        a = after["by_module"].get(mod, 0)
        lines.append(f"| {mod} | {b} | {a} | +{a - b} |")
    lines.append(f"| **TOTAL** | **{before['total']}** | **{after['total']}** | **+{after['total'] - before['total']}** |")
    lines.append("")
    lines.append("### Per-source detail")
    lines.append("")
    lines.append("| V2 source | → JBI target | src Q | dst before | dst after | added |")
    lines.append("|---|---|---:|---:|---:|---:|")
    for row in log["per_source"]:
        lines.append(
            f"| {row['source']} | {row['target']} | {row['src_questions']} "
            f"| {row['dst_before']} | {row['dst_after']} | +{row['added']} |"
        )
    if log["dupes_by_id"]:
        lines.append("")
        lines.append(f"### Duplicate IDs skipped (first {min(20, len(log['dupes_by_id']))} of {len(log['dupes_by_id'])})")
        lines.append("")
        for d in log["dupes_by_id"][:20]:
            lines.append(f"- `{d['id']}` (slug: `{d.get('slug')}`) from {d['source']}")
    if log["sources_empty"]:
        lines.append("")
        lines.append("### V2 sources that had no questions to migrate")
        lines.append("")
        for s in log["sources_empty"]:
            lines.append(f"- `{s}`")
    if log["sources_missing"]:
        lines.append("")
        lines.append("### V2 sources missing complete-qa.json (no-ops)")
        lines.append("")
        for s in log["sources_missing"]:
            lines.append(f"- `{s}`")
    lines.append("")

    REPORT_PATH.parent.mkdir(parents=True, exist_ok=True)
    with REPORT_PATH.open("a", encoding="utf-8") as fh:
        fh.write("\n".join(lines))
    print(f"[phaseE] report appended → {REPORT_PATH.relative_to(REPO_ROOT)}")


if __name__ == "__main__":
    print("[phaseE] counting JBI tree BEFORE migration...")
    before = count_tree(JBI_ROOT, "jbi-before")
    print(f"[phaseE] JBI before: {before['total']} questions across {len(before['by_module'])} modules")

    print("[phaseE] running migration...")
    log = run()
    print(f"[phaseE] appended {log['total_added']} new questions "
          f"(skipped {len(log['dupes_by_id'])} duplicate IDs, "
          f"{len(log['dupes_by_slug'])} duplicate slugs)")

    print("[phaseE] counting JBI tree AFTER migration...")
    after = count_tree(JBI_ROOT, "jbi-after")
    print(f"[phaseE] JBI after:  {after['total']} questions across {len(after['by_module'])} modules")

    append_report(log, before, after)
