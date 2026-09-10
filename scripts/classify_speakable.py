"""Speakable v2 archetype classifier (Phase 3a §6.3).

Walks every `complete-qa.json` under `content/java-backend-intermediate/`, infers
the Speakable A–G archetype for each question, and writes
`content/_audits/archetype_assignments.csv`.

Excludes:
  - the 7 golden references (`speakable_status: approved`)
  - the 30 priority_handcraft picks (`speakable_status: priority_handcraft`)

Confidence bands:
  - high   — matched a structural rule (path or strong slug pattern)
  - medium — matched only a slug/title keyword
  - low    — fell through to A and the title does not begin with "What"

The taxonomy (A–G) and decision tree mirror `docs/speakable/archetypes.md`.
This script does NOT modify any content JSON. It is a pure read pass that
produces a CSV the agent briefs (§6.4) and Phase 3b consume.

Idempotent: re-running produces an identical CSV (sorted by pillar, module,
topic, slug).
"""

from __future__ import annotations

import csv
import json
import re
from dataclasses import dataclass
from pathlib import Path
from typing import Iterable, List, Optional, Tuple

ROOT = Path(__file__).resolve().parent.parent
JBI_ROOT = ROOT / "content" / "java-backend-intermediate"
INDEX_PATH = JBI_ROOT / "_index.json"
OUT_CSV = ROOT / "content" / "_audits" / "archetype_assignments.csv"

# ---------------------------------------------------------------------------
# Heuristic patterns — anchored in archetypes.md decision tree.
# Order matters: G > F > E > B > D > C > A.
# ---------------------------------------------------------------------------

G_BEHAVIOURAL_MODULES = {"behavioral", "engineering-practices"}
G_BEHAVIOURAL_TOPICS = {
    "star-method",
    "conflict-resolution",
    "technical-leadership",
    "agile-and-scrum",
    "delivering-under-pressure",
    "failure-and-learning",
    "career-growth",
    "team-collaboration",
    "knowledge-sharing",
    "mentoring",
    "code-review",
    "on-call",
}
G_TITLE_RE = re.compile(
    r"\b("
    r"tell me about (a |)time|"
    r"describe (a |an |the |)(situation|time|experience)|"
    r"give (me )?an example of|"
    r"share (an|a) experience|"
    r"how (do|did|would) you handle|"
    r"how (do|did|would) you (deal|cope) with|"
    r"how (do|did) you respond to|"
    r"have you ever|"
    r"walk me through (a|an|your) (time|experience|situation)|"
    r"a time when"
    r")\b",
    re.IGNORECASE,
)
G_TITLE_KEYWORDS = re.compile(
    r"\b(disagreement|disagree|conflict|failure|mistake|pressure|deadline|"
    r"criticism|feedback|teammate|challenging|difficult colleague|burnout|"
    r"learning from|career growth|mentoring|onboarding teammate)\b",
    re.IGNORECASE,
)

F_SYSTEM_DESIGN_MODULES = {"system-design-cases", "low-level-design", "system-design"}
F_SLUG_PREFIX_RE = re.compile(r"^design[-_]")
F_TITLE_RE = re.compile(
    r"^\s*(design (a|an|the)|how would you (design|build|architect))\b",
    re.IGNORECASE,
)

E_DESIGN_TOPICS = {"solid-principles", "design-patterns", "architecture-decisions"}
E_DECISION_RE = re.compile(
    r"\b(when to use|when (do|should) (you |we |i )?(use|choose|pick|prefer)|"
    r"which (to|should you|would you) (use|choose|pick|prefer)|"
    r"how (do|would) you choose|trade.?off(s)? between|"
    r"how (do|would) you decide)\b",
    re.IGNORECASE,
)
VS_RE = re.compile(r"\bvs\.?\b|\bversus\b", re.IGNORECASE)

B_COMPARISON_TOPICS = {"comparisons"}
B_DIFFERENCE_RE = re.compile(
    r"\b(difference(s)? between|compare(d)?|differentiate|"
    r"what.{0,3}s the difference|how (does|do|is|are) .+ differ|"
    r"contrast)\b",
    re.IGNORECASE,
)

D_SCENARIO_MODULES = {"production-sre"}
D_SCENARIO_TOPICS = {
    "scenario-based",
    "incident-response",
    "incident-management",
    "root-cause-analysis",
    "postmortems",
    "debugging-production",
    "memory-leaks",
    "performance-troubleshooting",
    "n-plus-one-problem",
    "thread-and-heap-dumps",
}
D_SLUG_RE = re.compile(
    r"\b(debug|troubleshoot|diagnose|investigate|fix-(a|the|an))\b|"
    r"^(what-would-you-do-|how-do-you-handle-|how-would-you-handle-)",
    re.IGNORECASE,
)
D_TITLE_RE = re.compile(
    r"\b(debug|troubleshoot|diagnose|investigat\w+|root cause|"
    r"how would you handle|what would you do)\b",
    re.IGNORECASE,
)

C_INTERNALS_TOPIC_SUFFIX = "-internals"
C_TITLE_RE = re.compile(
    r"\b(how does .+ work|how is .+ implemented|under the hood|"
    r"internals? of|inside (the |a |an |)|walk (me )?through|"
    r"what happens when|the .+ mechanism|the .+ algorithm|"
    r"the .+ lifecycle|the .+ pipeline)\b",
    re.IGNORECASE,
)
C_SLUG_RE = re.compile(
    r"(internals|mechanism|under-the-hood|how-(does|is)|lifecycle)",
    re.IGNORECASE,
)

A_FALLBACK_HEAD_RE = re.compile(r"^\s*(what|why|explain)\b", re.IGNORECASE)

# Concept-shaped title indicators. If a question doesn't match any other
# archetype but the title looks like a concept noun phrase (carries a code
# identifier, a domain anchor like "Java"/"Spring"/etc., or a definitional
# subtitle separator), classify A at `medium`. Genuinely ambiguous short
# titles still drop to `low` and surface for human review.
CODE_ID_RE = re.compile(r"`[^`]+`")
A_DOMAIN_ANCHORS = re.compile(
    r"\b(Java|Spring|JVM|JPA|Hibernate|SQL|Kafka|Redis|Docker|Kubernetes|"
    r"AWS|GCP|Azure|JUnit|Mockito|REST|gRPC|GraphQL|JWT|OAuth|OWASP|HTTP|"
    r"TCP|TLS|JSON|XML|CI/CD|Linux|JDBC|JNDI|JMS|Lombok|Maven|Gradle|"
    r"PECS|HashMap|ArrayList|TreeMap|ConcurrentHashMap|ExecutorService|"
    r"Optional|Stream|Collectors|Lambda|NIO|Servlet|Tomcat|MongoDB|"
    r"PostgreSQL|MySQL|JIT|GC|HTTP/2|HTTP/3|gRPC|Reactor)\b"
)
A_TITLE_HAS_DESC_SEPARATOR = re.compile(r"\s[—:–-]\s")


# ---------------------------------------------------------------------------
# Result type
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class Row:
    pillar: str
    module: str
    topic: str
    slug: str
    title: str
    inferred_archetype: str
    confidence_band: str


# ---------------------------------------------------------------------------
# Inference
# ---------------------------------------------------------------------------


def infer_archetype(
    *, module_slug: str, topic_slug: str, slug: str, title: str
) -> Tuple[str, str]:
    """Return (archetype_letter, confidence_band)."""
    title_l = title.lower()
    slug_l = slug.lower()

    # G — Behavioural
    if module_slug in G_BEHAVIOURAL_MODULES or topic_slug in G_BEHAVIOURAL_TOPICS:
        return "G", "high"
    if G_TITLE_RE.search(title) or G_TITLE_KEYWORDS.search(title):
        return "G", "medium"

    # F — System Design / LLD
    if module_slug in F_SYSTEM_DESIGN_MODULES:
        return "F", "high"
    if F_SLUG_PREFIX_RE.search(slug_l) or F_TITLE_RE.search(title):
        return "F", "high"

    # B vs E disambiguation: both can carry "X vs Y" titles. The decisive
    # signal is whether the question asks "what's the difference" (B) or
    # "when to use / which to pick" (E). E also fires inside design-pattern-
    # adjacent topics where the question asks for a recommendation.
    has_vs = bool(VS_RE.search(title))
    asks_decision = bool(E_DECISION_RE.search(title))
    asks_difference = bool(B_DIFFERENCE_RE.search(title))

    # E — Design (when-to-use / which-to-pick)
    if has_vs and asks_decision:
        return "E", "high"
    if topic_slug in E_DESIGN_TOPICS and asks_decision:
        return "E", "high"
    if topic_slug in E_DESIGN_TOPICS and (
        "trade.?off" in title_l or "recommend" in title_l
    ):
        return "E", "medium"

    # B — Comparison (difference / compare)
    if topic_slug in B_COMPARISON_TOPICS:
        return "B", "high"
    if has_vs and asks_difference:
        return "B", "high"
    if has_vs:
        # Generic "X vs Y" without a strong decision verb leans comparative.
        return "B", "medium"
    if asks_difference:
        return "B", "medium"

    # D — Scenario / debugging
    if topic_slug in D_SCENARIO_TOPICS or module_slug in D_SCENARIO_MODULES:
        return "D", "high"
    if D_SLUG_RE.search(slug_l):
        return "D", "high"
    if D_TITLE_RE.search(title):
        return "D", "medium"

    # C — Internals
    if topic_slug.endswith(C_INTERNALS_TOPIC_SUFFIX):
        return "C", "high"
    if C_SLUG_RE.search(slug_l):
        return "C", "high"
    if C_TITLE_RE.search(title):
        return "C", "medium"

    # A — Conceptual fallback
    if A_FALLBACK_HEAD_RE.match(title):
        return "A", "medium"
    # Concept-shaped title — promote to medium when:
    #   - it carries a code identifier (backticks),
    #   - matches a domain anchor (Java/Spring/etc),
    #   - has a descriptive subtitle separator (": " / " — "), or
    #   - is a multi-word noun phrase (≥4 words) — concept titles are
    #     almost always longer than three words; very short titles are
    #     the genuinely ambiguous ones that warrant low-confidence flags.
    word_count = len(re.findall(r"\b\w[\w'-]*\b", title))
    if (
        CODE_ID_RE.search(title)
        or A_DOMAIN_ANCHORS.search(title)
        or A_TITLE_HAS_DESC_SEPARATOR.search(title)
        or word_count >= 4
    ):
        return "A", "medium"
    return "A", "low"


# ---------------------------------------------------------------------------
# Walk
# ---------------------------------------------------------------------------


EXCLUDED_STATUSES = {"approved", "priority_handcraft"}


def question_status(q: dict) -> Optional[str]:
    """Resolve the active speakable_status, handling both storage locations.

    Goldens carry `speakable_status` inside `speakable_v2` (per schema).
    Phase-2 priority_handcraft items carry it at the question top-level
    (no v2 yet). Either location counts as a real status.
    """
    v2 = q.get("speakable_v2") or {}
    return v2.get("speakable_status") or q.get("speakable_status")


def iter_questions(
    index_path: Path = INDEX_PATH,
) -> Iterable[Tuple[str, str, str, dict]]:
    """Yield (pillar_code, module_slug, topic_slug, question) for every Q."""
    index = json.loads(index_path.read_text())
    for module in index["modules"]:
        module_slug = module["moduleSlug"]
        pillar = module["pillar"]
        mdir = JBI_ROOT / module_slug
        if not mdir.exists():
            continue
        for topic_slug in module.get("topics", []):
            qa_path = mdir / topic_slug / "complete-qa.json"
            if not qa_path.exists():
                continue
            try:
                data = json.loads(qa_path.read_text())
            except Exception:
                continue
            for q in data.get("questions", []) or []:
                yield pillar, module_slug, topic_slug, q


def main() -> int:
    rows: List[Row] = []
    excluded = 0
    by_band = {"high": 0, "medium": 0, "low": 0}
    by_arch = {a: 0 for a in "ABCDEFG"}

    for pillar, module_slug, topic_slug, q in iter_questions():
        status = question_status(q)
        if status in EXCLUDED_STATUSES:
            excluded += 1
            continue
        slug = q.get("slug") or ""
        title = q.get("title") or q.get("question") or ""
        if not slug or not title:
            continue
        archetype, band = infer_archetype(
            module_slug=module_slug,
            topic_slug=topic_slug,
            slug=slug,
            title=title,
        )
        rows.append(
            Row(
                pillar=pillar,
                module=module_slug,
                topic=topic_slug,
                slug=slug,
                title=title,
                inferred_archetype=archetype,
                confidence_band=band,
            )
        )
        by_band[band] += 1
        by_arch[archetype] += 1

    rows.sort(key=lambda r: (r.pillar, r.module, r.topic, r.slug))

    OUT_CSV.parent.mkdir(parents=True, exist_ok=True)
    with OUT_CSV.open("w", newline="", encoding="utf-8") as fp:
        writer = csv.writer(fp)
        writer.writerow(
            ["pillar", "module", "topic", "slug", "title", "inferred_archetype", "confidence_band"]
        )
        for r in rows:
            writer.writerow(
                [r.pillar, r.module, r.topic, r.slug, r.title, r.inferred_archetype, r.confidence_band]
            )

    total = len(rows)
    print(f"wrote {OUT_CSV.relative_to(ROOT)}  ({total} rows; excluded {excluded})")
    print("Confidence bands:")
    for band in ("high", "medium", "low"):
        n = by_band[band]
        pct = (100.0 * n / total) if total else 0
        print(f"  {band:6s} {n:5d}  ({pct:5.1f}%)")
    print("Archetype distribution:")
    for arch in "ABCDEFG":
        n = by_arch[arch]
        pct = (100.0 * n / total) if total else 0
        print(f"  {arch}      {n:5d}  ({pct:5.1f}%)")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
