"""Speakable v2 per-pillar agent brief generator (Phase 3a §6.4).

Reads the Phase 0/1/2 reference docs, the codex JSONs, and the 7 golden
references; emits one self-contained brief per pillar at
``docs/speakable/agent-briefs/P0X-<slug>.md``.

Also writes per-pillar queue CSVs at
``content/_audits/agent-queues/P0X-queue.csv`` listing the questions the
Phase 3b agent for that pillar will iterate (sorted by importance,
difficulty, then slug).

Excludes: the 7 goldens (already approved), the 30 priority_handcraft
items (humans hand-craft those). All other questions in the pillar are
in scope.

Briefs are deliberately self-contained — each is generated to include
every per-pillar archetype slice, the full lint rule set, the full
visual style guide §6, the full banned-vocab layers, the codex slice,
and the 7 goldens. An agent reading only its brief plus the lint script
can produce v2s for that pillar without reading any other doc.

Idempotent: re-running produces deterministic byte-stable briefs.
"""

from __future__ import annotations

import csv
import json
import re
from collections import defaultdict
from dataclasses import dataclass
from pathlib import Path
from typing import Dict, Iterable, List, Optional, Set, Tuple

ROOT = Path(__file__).resolve().parent.parent
DOCS = ROOT / "docs" / "speakable"
CODEX = ROOT / "codex"
JBI_ROOT = ROOT / "content" / "java-backend-intermediate"
INDEX_PATH = JBI_ROOT / "_index.json"
ASSIGN_CSV = ROOT / "content" / "_audits" / "archetype_assignments.csv"
BRIEFS_DIR = DOCS / "agent-briefs"
QUEUES_DIR = ROOT / "content" / "_audits" / "agent-queues"

# 12 pillar slugs used in brief filenames.
PILLAR_SLUGS = {
    "P01": "java-core",
    "P02": "spring-ecosystem",
    "P03": "data-persistence",
    "P04": "apis-microservices-messaging",
    "P05": "architecture-design",
    "P06": "system-design",
    "P07": "security",
    "P08": "testing-quality",
    "P09": "devops",
    "P10": "cloud",
    "P11": "production-sre",
    "P12": "interview-readiness",
}
PILLAR_NAMES = {
    "P01": "Java Language & Core",
    "P02": "Spring Ecosystem",
    "P03": "Data & Persistence",
    "P04": "APIs, Microservices & Messaging",
    "P05": "Architecture & Design",
    "P06": "System Design",
    "P07": "Security",
    "P08": "Testing & Quality",
    "P09": "DevOps",
    "P10": "Cloud",
    "P11": "Production",
    "P12": "Interview Readiness",
}

# Locations of the 7 goldens — quoted as JSON blobs in every brief.
GOLDENS = [
    ("A", "java-thread-lifecycle-states", "java-concurrency/threads-and-lifecycle"),
    ("B", "difference-between-equals-and-double-equals-java", "core-java/scenario-based"),
    ("C", "hashmap-collision-handling", "java-collections/collections-internals"),
    ("D", "cpu-spikes-java-applications-debugging", "production-sre/debugging-production"),
    ("E", "abstract-class-vs-interface-java-when-to-use", "java-oop/oop-principles"),
    ("F", "design-url-shortener", "system-design-cases/url-shortener"),
    ("G", "handle-technical-disagreements", "behavioral/conflict-resolution"),
]


# ---------------------------------------------------------------------------
# Markdown slicing helpers — section-by-header
# ---------------------------------------------------------------------------


def _slice_by_h2(text: str, header_substring: str) -> Optional[str]:
    """Return the body of an H2 section whose header contains the given substring.

    The body is everything from the matching ``## …`` line up to (but not
    including) the next ``## `` line at the same level. Trailing whitespace
    is preserved as-is so the section keeps its tabular formatting.
    """
    lines = text.splitlines()
    out: List[str] = []
    capturing = False
    for line in lines:
        if line.startswith("## "):
            if capturing:
                break
            if header_substring in line:
                capturing = True
                out.append(line)
                continue
        if capturing:
            out.append(line)
    return "\n".join(out).rstrip() if out else None


def _slice_archetype_section(archetypes_md: str, letter: str) -> str:
    """Slice the per-archetype section out of `archetypes.md` (H2 = letter)."""
    body = _slice_by_h2(archetypes_md, f"## {letter} —")
    if body is None:
        body = _slice_by_h2(archetypes_md, f"## {letter} ")
    return body or f"_(slice for archetype {letter} not found in archetypes.md)_"


def _slice_pillar_register(pr_md: str, pillar_code: str) -> str:
    body = _slice_by_h2(pr_md, f"## {pillar_code} —")
    return body or f"_(slice for {pillar_code} not found in pillar-register.md)_"


def _slice_word_ceilings(wc_md: str, letter: str) -> str:
    body = _slice_by_h2(wc_md, f"## Archetype {letter}")
    return body or f"_(slice for archetype {letter} not found in word-ceilings.md)_"


def _slice_depth_markers(dm_md: str, letter: str) -> str:
    body = _slice_by_h2(dm_md, f"## {letter} —")
    if body is None:
        body = _slice_by_h2(dm_md, f"## {letter} ")
    return body or f"_(slice for archetype {letter} not found in depth-markers.md)_"


def _slice_visual_style_section_6(vsg_md: str) -> str:
    """Slice the §6 'The 7 primitives' section from visual-style-guide.md."""
    lines = vsg_md.splitlines()
    out: List[str] = []
    capturing = False
    for line in lines:
        if line.startswith("## "):
            if capturing:
                break
            if line.startswith("## 6. ") or line.startswith("## 6 "):
                capturing = True
                out.append(line)
                continue
        if capturing:
            out.append(line)
    return "\n".join(out).rstrip()


def _slice_lint_section_7(rules_md: str) -> str:
    """Slice §7 (all sub-sections) from lint-rules.md."""
    lines = rules_md.splitlines()
    out: List[str] = []
    capturing = False
    for line in lines:
        if line.startswith("## ") and capturing and not re.match(r"^## 7\.", line):
            break
        if line.startswith("## 7."):
            capturing = True
        if capturing:
            out.append(line)
    return "\n".join(out).rstrip()


# ---------------------------------------------------------------------------
# Codex slicing
# ---------------------------------------------------------------------------


def _codex_slice_for_topics(
    codex: dict, key: str, topic_ids: Set[str]
) -> List[dict]:
    """Filter a codex blob's list (under `key`) by topic_id ∈ topic_ids."""
    items = codex.get(key, [])
    if not isinstance(items, list):
        return []
    return [it for it in items if it.get("topic_id") in topic_ids]


# ---------------------------------------------------------------------------
# Queue + per-pillar gather
# ---------------------------------------------------------------------------


@dataclass(frozen=True)
class QueueRow:
    pillar: str
    module: str
    topic: str
    slug: str
    title: str
    inferred_archetype: str
    confidence_band: str
    importance: str
    difficulty: str
    file: str


def _question_status(q: dict) -> Optional[str]:
    v2 = q.get("speakable_v2") or {}
    return v2.get("speakable_status") or q.get("speakable_status")


def _has_legacy_speakable(q: dict) -> bool:
    """Return True iff the question carries non-empty legacy speakable material."""
    if isinstance(q.get("speakable_answer"), str) and q["speakable_answer"].strip():
        return True
    answer = q.get("answer") or {}
    if isinstance(answer, dict):
        for s in answer.get("sections", []) or []:
            if (s.get("type") == "speakable_answer" or s.get("type") == "key_points") and \
               isinstance(s.get("content"), str) and s["content"].strip():
                return True
    return False


def _importance_rank(value: str) -> int:
    return {"high": 0, "medium": 1, "moderate": 1, "low": 2}.get((value or "").lower(), 3)


def _difficulty_rank(value: str) -> int:
    return {"easy": 0, "medium": 1, "moderate": 1, "hard": 2}.get((value or "").lower(), 3)


def _build_question_lookup() -> Dict[str, Tuple[dict, str]]:
    """Return {slug: (question_dict, file_path_str)} for every question."""
    out: Dict[str, Tuple[dict, str]] = {}
    index = json.loads(INDEX_PATH.read_text())
    for module in index["modules"]:
        mdir = JBI_ROOT / module["moduleSlug"]
        if not mdir.exists():
            continue
        for topic in module.get("topics", []):
            qa = mdir / topic / "complete-qa.json"
            if not qa.exists():
                continue
            try:
                data = json.loads(qa.read_text())
            except Exception:
                continue
            for q in data.get("questions", []) or []:
                slug = q.get("slug")
                if slug:
                    out[slug] = (q, str(qa.relative_to(ROOT)))
    return out


def build_queues(
    classifier_csv: Path = ASSIGN_CSV,
) -> Dict[str, List[QueueRow]]:
    by_pillar: Dict[str, List[QueueRow]] = defaultdict(list)
    lookup = _build_question_lookup()
    with classifier_csv.open() as fp:
        reader = csv.DictReader(fp)
        for row in reader:
            slug = row["slug"]
            qfile = lookup.get(slug)
            if not qfile:
                continue
            q, file_str = qfile
            status = _question_status(q)
            if status in {"approved", "priority_handcraft"}:
                continue
            importance = q.get("importance", "")
            difficulty = q.get("difficulty", "")
            by_pillar[row["pillar"]].append(
                QueueRow(
                    pillar=row["pillar"],
                    module=row["module"],
                    topic=row["topic"],
                    slug=slug,
                    title=row["title"],
                    inferred_archetype=row["inferred_archetype"],
                    confidence_band=row["confidence_band"],
                    importance=importance,
                    difficulty=difficulty,
                    file=file_str,
                )
            )
    for p in by_pillar.values():
        p.sort(
            key=lambda r: (
                _importance_rank(r.importance),
                _difficulty_rank(r.difficulty),
                r.module,
                r.topic,
                r.slug,
            )
        )
    return by_pillar


# ---------------------------------------------------------------------------
# Brief assembly
# ---------------------------------------------------------------------------


def _golden_blocks() -> str:
    """Embed all 7 goldens as fenced JSON blocks, in archetype order."""
    out: List[str] = []
    for letter, slug, rel_dir in GOLDENS:
        path = JBI_ROOT / rel_dir / "complete-qa.json"
        data = json.loads(path.read_text())
        v2 = None
        for q in data["questions"]:
            if q.get("slug") == slug:
                v2 = q.get("speakable_v2")
                break
        if not v2:
            out.append(f"### G-{letter} ({slug}) — MISSING")
            continue
        out.append(f"### G-{letter} — `{slug}` (Archetype {letter})")
        out.append("")
        out.append(f"_Source: `content/java-backend-intermediate/{rel_dir}/complete-qa.json`_")
        out.append("")
        out.append("```json")
        out.append(json.dumps(v2, indent=2, ensure_ascii=False))
        out.append("```")
        out.append("")
    return "\n".join(out)


def _banned_block(banned: dict) -> str:
    out: List[str] = []
    for layer_key, label in (("layer1", "Layer 1 — generic hi-tech"),
                             ("layer2", "Layer 2 — meta-references"),
                             ("layer3", "Layer 3 — coaching / instructional")):
        layer = banned.get(layer_key, {})
        out.append(f"### {label}")
        out.append("")
        out.append(f"- **Tolerance:** {layer.get('tolerance', '?')}")
        out.append(f"- **Severity:** {layer.get('lint_severity', '?')}")
        out.append("")
        out.append("```json")
        out.append(json.dumps(layer.get("phrases", []), indent=2, ensure_ascii=False))
        out.append("```")
        out.append("")
    return "\n".join(out)


def _codex_block(codex_phrasings: list, codex_examples: list, topic_ids: Set[str]) -> str:
    out: List[str] = []
    out.append(f"_Topics in scope (codex `topic_id`s touched by this pillar's queue): {len(topic_ids)}._")
    out.append("")
    out.append("#### Canonical phrasings (from `codex/phrasings.json`)")
    out.append("")
    if not codex_phrasings:
        out.append("_No codex phrasings registered for this pillar's topics yet — agent should anchor on the per-pillar standard examples in the register slice above._")
    else:
        out.append("```json")
        out.append(json.dumps(codex_phrasings, indent=2, ensure_ascii=False))
        out.append("```")
    out.append("")
    out.append("#### Standard examples (from `codex/examples.json`)")
    out.append("")
    if not codex_examples:
        out.append("_No codex examples registered for this pillar's topics yet — use the per-pillar standard examples in the register slice above._")
    else:
        out.append("```json")
        out.append(json.dumps(codex_examples, indent=2, ensure_ascii=False))
        out.append("```")
    out.append("")
    return "\n".join(out)


def _archetype_summary_table(rows: List[QueueRow]) -> str:
    counts: Dict[str, int] = defaultdict(int)
    for r in rows:
        counts[r.inferred_archetype] += 1
    out: List[str] = []
    out.append("| Archetype | Count | % of pillar |")
    out.append("|---|---:|---:|")
    total = max(1, len(rows))
    for letter in "ABCDEFG":
        n = counts.get(letter, 0)
        pct = 100.0 * n / total
        out.append(f"| {letter} | {n} | {pct:.1f}% |")
    return "\n".join(out)


def _queue_first_n(rows: List[QueueRow], n: int = 25) -> str:
    out: List[str] = []
    out.append("| # | slug | archetype | confidence | importance | topic |")
    out.append("|---:|---|---|---|---|---|")
    for i, r in enumerate(rows[:n], 1):
        out.append(
            f"| {i} | `{r.slug}` | {r.inferred_archetype} | {r.confidence_band} | "
            f"{r.importance or '—'} | `{r.module}/{r.topic}` |"
        )
    return "\n".join(out)


def _topics_in_pillar(rows: List[QueueRow]) -> Set[str]:
    return {f"{r.module}/{r.topic}" for r in rows} | {r.topic for r in rows}


def write_brief(
    pillar: str,
    rows: List[QueueRow],
    *,
    archetypes_md: str,
    pillar_register_md: str,
    word_ceilings_md: str,
    depth_markers_md: str,
    lint_section_7: str,
    visual_section_6: str,
    banned: dict,
    phrasings_topics: list,
    examples_list: list,
    goldens_block: str,
) -> Path:
    pillar_slug = PILLAR_SLUGS[pillar]
    pillar_name = PILLAR_NAMES[pillar]
    archetypes_present = sorted({r.inferred_archetype for r in rows})

    # codex topic-id filter — match by slug-anchor in topic_id (use the
    # topic slug from the queue rows; phrasings are keyed by `topic_id`
    # which often mirrors the topic slug or a normalised variant).
    pillar_topic_slugs = {r.topic for r in rows}
    pillar_topic_ids = pillar_topic_slugs.copy()
    # also accept ids that contain any pillar topic slug as a substring
    # so we don't miss codex entries keyed on a finer-grained id.
    codex_phrasings = [
        t for t in phrasings_topics
        if t.get("topic_id") in pillar_topic_ids
        or any(slug in (t.get("topic_id") or "") for slug in pillar_topic_slugs)
    ]
    codex_examples = [
        e for e in examples_list
        if e.get("topic_id") in pillar_topic_ids
        or any(slug in (e.get("topic_id") or "") for slug in pillar_topic_slugs)
    ]
    topic_ids_in_scope = {
        t.get("topic_id") for t in (codex_phrasings + codex_examples) if t.get("topic_id")
    }

    out: List[str] = []
    a = out.append

    a(f"# Pillar {pillar} — {pillar_name} agent brief")
    a("")
    a(f"> Phase 3a/3b agent brief generated by `scripts/build_agent_briefs.py`. "
      f"Self-contained: an agent reading only this brief, the lint script "
      f"`scripts/audit_speakable.py`, the codex JSONs, and the 7 golden "
      f"references embedded below can refine this pillar's queue to lint-green "
      f"output. Phase 3a smoke gate: draft **only the first question** in "
      f"`content/_audits/agent-queues/{pillar}-queue.csv`, halt for human "
      f"review. (Per the SPEAKABLE-PHASE-3A-PROMPT.md §1.5 + §7.4.)")
    a("")
    a("---")
    a("")

    # --- Identity & scope ----------------------------------------------------
    a("## Identity & scope")
    a("")
    a(f"- **Pillar:** {pillar} / {pillar_name}")
    a(f"- **Pillar register:** see slice below.")
    a(f"- **Number of questions in scope** (excludes 7 goldens + 30 priority_handcraft + already-approved): **{len(rows)}**")
    a(f"- **Question list:** see `content/_audits/agent-queues/{pillar}-queue.csv` "
      f"(columns: slug, archetype, confidence, importance, difficulty, "
      f"module, topic, file).")
    a(f"- **Archetype mix in this pillar:**")
    a("")
    a(_archetype_summary_table(rows))
    a("")
    a("- **Top of queue (first 25 — Phase 3a smoke target is row 1):**")
    a("")
    a(_queue_first_n(rows, 25))
    a("")
    a("---")
    a("")

    # --- The plan extract ----------------------------------------------------
    a("## The plan extract — what your output must satisfy")
    a("")
    a("### Archetypes you will encounter in this pillar")
    a("")
    a("Required and forbidden beats per archetype, plus the visual-rhythm "
      "expectation each carries. Slices below are the relevant rows from "
      "`docs/speakable/archetypes.md`.")
    a("")
    for letter in archetypes_present:
        a(_slice_archetype_section(archetypes_md, letter))
        a("")
    a("---")
    a("")
    a("### This pillar's voice register")
    a("")
    a(_slice_pillar_register(pillar_register_md, pillar))
    a("")
    a("---")
    a("")
    a("### Data-model shape")
    a("")
    a("Speakable v2 conforms to `frontend/lib/speakable/schema.ts`. The shape "
      "an agent emits per question is exactly:")
    a("")
    a("```jsonc")
    a("{")
    a('  "archetype": "A" | "B" | "C" | "D" | "E" | "F" | "G",')
    a(f'  "pillar": "{pillar}",  // exactly this pillar code')
    a('  "audience_assumption": "beginner" | "familiar" | "advanced",')
    a('  "voice": "friendly" | "neutral" | "technical",')
    a('  "speakable_status": "pending_review",  // ALWAYS pending_review for Phase-3 output')
    a('  "familiarity_anchors": [/* canonical phrasings the listener should already know */],')
    a('  "standard_example": "/* the canonical example from codex/examples.json for this topic */",')
    a('  "hook": "/* opening line, ≤ 35 words, declarative */",')
    a('  "beats": [')
    a('    { "kind": "<archetype-specific>", "layout": "<layout-primitive>", /* payload */ }')
    a('  ],')
    a('  "cap": "/* closing line, ≤ 35 words */",')
    a('  "followup_handoff": ["...", "..."],  // ≥ 2 items required')
    a('  "tts_overrides": { "code-symbol": "spoken-form" }  // for any code identifier the TTS would mangle')
    a("}")
    a("```")
    a("")
    a("Lifecycle locked: `speakable_status: pending_review` for every Phase 3 "
      "agent output. Never `approved` (humans approve in /admin/speakable-review). "
      "Never `legacy` (legacy is the source-of-truth fallback while v2 is "
      "pending). The renderer ignores `pending_review` and falls back to "
      "the legacy `speakable_answer` markdown.")
    a("")
    a("Side-by-side coexistence: the v2 sits **alongside** the legacy "
      "`speakable_answer` and every other field on the question object. "
      "Never modify, overwrite, or delete the legacy field. v2 is purely "
      "additive (Plan §14.1, Phase 3a prompt §3.10).")
    a("")
    a("---")
    a("")
    a("### Codex slice for the topics in this pillar")
    a("")
    a(_codex_block(codex_phrasings, codex_examples, topic_ids_in_scope))
    a("---")
    a("")
    a("### Lint rules — the gate")
    a("")
    a("Below is `docs/speakable/lint-rules.md` §7 in full — every rule "
      "`audit_speakable.py` enforces, with pass criterion + fail-mode "
      "example for each.")
    a("")
    a(lint_section_7)
    a("")
    a("---")
    a("")
    a("### Word ceilings — the tightness control")
    a("")
    a("Per-archetype, per-beat ceilings the lint enforces (slices from "
      "`docs/speakable/word-ceilings.md`).")
    a("")
    for letter in archetypes_present:
        a(_slice_word_ceilings(word_ceilings_md, letter))
        a("")
    a("---")
    a("")
    a("### Depth markers — the seniority signal")
    a("")
    a("The depth marker is the one moment in the answer that proves the "
      "speaker is not surface-level. Mandatory for A/B/C/D/E, recommended "
      "for G, replaced by capacity numbers for F. Slices from "
      "`docs/speakable/depth-markers.md`.")
    a("")
    for letter in archetypes_present:
        a(_slice_depth_markers(depth_markers_md, letter))
        a("")
    a("---")
    a("")
    a("### Layout primitives the renderer supports")
    a("")
    a("Below is `docs/speakable/visual-style-guide.md` §6 in full — the 7 "
      "primitives, with purpose, when-to-use, when-not-to, ASCII sketch, "
      "and do/don't for each. Pick `layout` per beat from this set; the "
      "lint validates layout × payload consistency at 7.5.5.")
    a("")
    a(visual_section_6)
    a("")
    a("---")
    a("")

    # --- Goldens -------------------------------------------------------------
    a("## The 7 golden references — IMITATE THESE")
    a("")
    a("Every Phase 3 v2 imitates the golden for its archetype's voice and "
      "visual rhythm. The goldens are the bar; an agent output that doesn't "
      "feel like the matching golden is wrong even if the lint passes.")
    a("")
    a(goldens_block)
    a("---")
    a("")

    # --- Banned vocabulary ---------------------------------------------------
    a("## The forbidden list (Layer 1 / Layer 2 / Layer 3)")
    a("")
    a("Layer 2 + Layer 3 = zero tolerance. One hit fails the lint. Layer 1 "
      "= ≤ 2 hits per 1000 words. Source: `codex/banned.json`.")
    a("")
    a(_banned_block(banned))
    a("---")
    a("")

    # --- Mandates ------------------------------------------------------------
    a("## The voice mandate (principle 2.7)")
    a("")
    a("The Speakable text addresses **no one**. It does not say \"you "
      "should…\", \"tell the interviewer…\", \"in your answer…\", \"this "
      "is how you'd say it…\", \"make sure to mention…\". It is read as "
      "**study material, not coaching**. Internet-canonical knowledge is "
      "silently echoed; no meta acknowledgement of where it came from. The "
      "reader internalises by reading.")
    a("")
    a("## The visual mandate (principle 2.8)")
    a("")
    a("Every beat declares a `layout`. No paragraph > 60 words. ≥ 3 items "
      "become a list. ≥ 3 comparison axes become a `mini_table`. Sequences "
      "become `ordered_list`. The output must be visually scannable on "
      "mobile (no walls of text).")
    a("")
    a("---")
    a("")

    # --- Work loop -----------------------------------------------------------
    a("## The work loop (per question)")
    a("")
    a("1. **Read legacy material** as raw input — `speakable_answer`, "
      "`key_points`, `direct_answer`, `interviewer_intent`, the topic "
      "intro from `_index.json`. Do **not** preserve their structure; "
      "they are inputs to refine, not outputs to copy.")
    a("2. **Identify archetype** — from the queue CSV's `inferred_archetype` "
      "column. If `confidence_band == low`, fall back to manual judgement "
      "using the archetype decision tree in `docs/speakable/archetypes.md`.")
    a("3. **Identify topic_id** — map the question's title to a "
      "`codex/phrasings.json` or `codex/examples.json` entry. The audit "
      "script's `resolve_topic_id` uses shared-token count with Jaccard "
      "tie-break (lint rule 7.8.8) — replicate that ranking.")
    a("4. **Draft `speakable_v2`** in the order: `hook` → "
      "`familiarity_anchors` → `standard_example` → `beats` (with explicit "
      "`layout` per beat) → `cap` → `followup_handoff` → `tts_overrides`. "
      "Imitate the matching golden's voice, rhythm, and depth.")
    a("5. **Place v2 on the question object** as a sibling field next to "
      "`speakable_answer`. Set `speakable_v2.speakable_status = \"pending_review\"`. "
      "Do **not** modify any other field.")
    a("6. **Run the lint** — `python3 scripts/audit_speakable.py --check "
      "<file>`. Read the JSON output (use `--json` for machine-parseable).")
    a("7. **Iterate.** If status PASS and score ≥ 80: done. If WARN/FAIL "
      "or score < 80: read every violation, fix, re-lint. Repeat until "
      "(a) lint-green or (b) one of the escape conditions (next section) "
      "fires.")
    a("8. **Smoke gate (Phase 3a only).** After question 1 in this pillar, "
      "halt. Emit slug, lint score, and the v2 JSON to the smoke-batch "
      "file. Wait for human review before continuing.")
    a("")
    a("### Escape conditions (lint Appendix A.2)")
    a("")
    a("Exit the loop and write `speakable_status: pending_handcraft` when:")
    a("")
    a("- **Iteration cap (A.2.1):** 20 iterations completed without lint-green.")
    a("- **Plateau (A.2.2):** Score has not improved across 5 consecutive iterations (delta < 1 point each).")
    a("- **Critic rejections (A.2.3):** Reviewer has rejected the v2 3 times after lint-green was achieved.")
    a("")
    a("On escape, write a `_speakable_v2_diagnosis` sibling field with:")
    a("")
    a("```jsonc")
    a("{")
    a('  "escape_reason": "iteration_cap" | "plateau" | "critic_rejected",')
    a('  "rounds": <int>,')
    a('  "last_score": <int>,')
    a('  "top_violations": [/* the highest-weight failed_rules from the last iteration */],')
    a('  "suspected_cause": "/* one-line guess for the human reviewer */"')
    a("}")
    a("```")
    a("")
    a("---")
    a("")

    # --- Output format -------------------------------------------------------
    a("## Output format")
    a("")
    a("- The v2 is a sibling field on the question object: "
      "`question.speakable_v2 = { ... }`.")
    a("- The legacy `speakable_answer` and every other existing field "
      "stays untouched.")
    a("- Schema: `frontend/lib/speakable/schema.ts` `SpeakableV2` "
      "discriminated union (mirrored by `scripts/speakable_schema.json` "
      "for the lint).")
    a("- Pretty-print the file as JSON with 2-space indent, "
      "`ensure_ascii=False`, trailing newline. (Match the formatting of "
      "the goldens — `git diff` of any other question must be confined to "
      "the new `speakable_v2` block.)")
    a("")
    a("---")
    a("")

    # --- Stop rules ----------------------------------------------------------
    a("## Stop rules")
    a("")
    a("- **Never** set `speakable_status: \"approved\"`. Humans approve in "
      "the admin review flow.")
    a("- **Never** modify questions whose status is `approved` (the 7 "
      "goldens) or `priority_handcraft` (the 30 humans-only items). "
      "Verify before each write.")
    a("- **Never** modify the legacy `speakable_answer` or any other "
      "field on the question.")
    a("- **Never** edit `audit_speakable.py`, the codex JSONs, the "
      "schema, or any rubric file. If a rule looks broken, log to "
      "`docs/speakable/HUMAN-REVIEW-QUEUE.md` and proceed (or halt the "
      "pillar — see §7.4 of the Phase 3a prompt).")
    a("- **Never** cross pillar boundaries. This brief is scoped to "
      f"{pillar} only.")
    a("- **If the legacy is empty / placeholder** (no `speakable_answer`, "
      "no `key_points` content, no meaningful `direct_answer`): write "
      "`speakable_status: \"pending_handcraft\"` with diagnosis "
      "\"no raw material\" and skip. This brief's queue filters out empty-"
      "legacy questions where possible, but a few may slip through.")
    a("")
    a("---")
    a("")

    # --- Smoke gate ----------------------------------------------------------
    a("## Smoke-test gate (Phase 3a only)")
    a("")
    a("After your **first question** in this pillar, halt. Emit the slug, "
      "the lint score, and the full v2 JSON to "
      "`content/_audits/smoke_review_batch.md` (one section per pillar). "
      "Wait for human review. Phase 3a stops here for each pillar; Phase "
      "3b is a separate run (one per pillar) and only runs after the human "
      "approves the smoke output.")
    a("")
    a("---")
    a("")
    a("## Pillar queue — full list")
    a("")
    a(f"All {len(rows)} questions in scope, sorted by importance, then "
      f"difficulty, then slug. Phase 3b iterates this list; Phase 3a "
      f"smoke targets row 1.")
    a("")
    a("| # | slug | archetype | confidence | importance | difficulty | "
      "module | topic |")
    a("|---:|---|---|---|---|---|---|---|")
    for i, r in enumerate(rows, 1):
        a(
            f"| {i} | `{r.slug}` | {r.inferred_archetype} | "
            f"{r.confidence_band} | {r.importance or '—'} | "
            f"{r.difficulty or '—'} | `{r.module}` | `{r.topic}` |"
        )
    a("")
    a("---")
    a("")
    a("_End of brief P{0}._".format(pillar.lstrip("P")))
    a("")

    text = "\n".join(out)
    BRIEFS_DIR.mkdir(parents=True, exist_ok=True)
    out_path = BRIEFS_DIR / f"{pillar}-{pillar_slug}.md"
    out_path.write_text(text)
    return out_path


def write_queue_csv(pillar: str, rows: List[QueueRow]) -> Path:
    QUEUES_DIR.mkdir(parents=True, exist_ok=True)
    out = QUEUES_DIR / f"{pillar}-queue.csv"
    with out.open("w", newline="", encoding="utf-8") as fp:
        w = csv.writer(fp)
        w.writerow([
            "slug", "archetype", "confidence", "importance", "difficulty",
            "module", "topic", "title", "file",
        ])
        for r in rows:
            w.writerow([
                r.slug, r.inferred_archetype, r.confidence_band,
                r.importance, r.difficulty, r.module, r.topic, r.title, r.file,
            ])
    return out


# ---------------------------------------------------------------------------
# main
# ---------------------------------------------------------------------------


def main() -> int:
    archetypes_md = (DOCS / "archetypes.md").read_text()
    pillar_register_md = (DOCS / "pillar-register.md").read_text()
    word_ceilings_md = (DOCS / "word-ceilings.md").read_text()
    depth_markers_md = (DOCS / "depth-markers.md").read_text()
    lint_section_7 = _slice_lint_section_7((DOCS / "lint-rules.md").read_text())
    visual_section_6 = _slice_visual_style_section_6(
        (DOCS / "visual-style-guide.md").read_text()
    )

    banned = json.loads((CODEX / "banned.json").read_text())
    phrasings = json.loads((CODEX / "phrasings.json").read_text()).get("topics", [])
    examples = json.loads((CODEX / "examples.json").read_text()).get("examples", [])

    goldens_block = _golden_blocks()

    queues = build_queues()

    written: List[str] = []
    queue_paths: List[str] = []
    for pillar in [f"P{i:02d}" for i in range(1, 13)]:
        rows = queues.get(pillar, [])
        out = write_brief(
            pillar,
            rows,
            archetypes_md=archetypes_md,
            pillar_register_md=pillar_register_md,
            word_ceilings_md=word_ceilings_md,
            depth_markers_md=depth_markers_md,
            lint_section_7=lint_section_7,
            visual_section_6=visual_section_6,
            banned=banned,
            phrasings_topics=phrasings,
            examples_list=examples,
            goldens_block=goldens_block,
        )
        qpath = write_queue_csv(pillar, rows)
        line_count = len(out.read_text().splitlines())
        written.append(f"  {out.relative_to(ROOT)}  ({line_count} lines, {len(rows)} questions)")
        queue_paths.append(f"  {qpath.relative_to(ROOT)}  ({len(rows)} rows)")

    print("Wrote agent briefs:")
    for w in written:
        print(w)
    print("Wrote pillar queues:")
    for q in queue_paths:
        print(q)
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
