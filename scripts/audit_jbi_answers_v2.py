"""v2 auditor — archetype-aware, no universal word limits.

Reads `scripts/out/suggested_archetypes.json` (produced by
`scripts/infer_archetypes.py`) and audits every question against:

  - Universal shape/tone rules (always enforced)
  - Archetype-specific shape rules (internals expects phase sections,
    comparison expects a table, behavioral expects STAR beats, etc.)
  - Length sanity checks that only fire on RADICAL deviations
    (<50% of archetype lower band or >200% of upper band)

Does NOT modify any content JSON.

Supports pilot mode: pass --pillars P01,P06,P12 to limit scope.
"""
from __future__ import annotations

import argparse
import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass, field, asdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JBI_ROOT = ROOT / "content" / "java-backend-intermediate"
OUT_DIR = ROOT / "scripts" / "out"
OUT_DIR.mkdir(parents=True, exist_ok=True)

CRITICAL, MAJOR, MINOR = "CRITICAL", "MAJOR", "MINOR"

NON_DEEP_DIVE_TYPES = {
    "key_points", "important_points", "speakable_answer",
    "interviewer_expectation",
}

# ---------------------------------------------------------------------------
# Archetype bands (guidance; only radical deviations are flagged)
# ---------------------------------------------------------------------------
#   (deep_dive_low, deep_dive_high, speakable_low, speakable_high)
ARCHETYPE_BANDS: dict[str, tuple[int, int, int, int]] = {
    "direct-concept":     (400, 800,  120, 220),
    "comparison":         (600, 1100, 150, 280),
    "internals":          (900, 1500, 250, 400),
    "moderate-concept":   (800, 1300, 220, 320),
    "debugging-pattern":  (700, 1200, 200, 300),
    "how-to-recipe":      (800, 1400, 220, 350),
    "tool-config":        (700, 1300, 220, 350),
    "architecture":       (1000, 1700, 250, 400),
    "system-design":      (1500, 3000, 500, 900),
    "behavioral":         (400, 800,  300, 600),
    "scenario-based":     (600, 1100, 200, 320),
}

RADICAL_LOW_FACTOR = 0.50    # below this fraction of the lower band → flag
RADICAL_HIGH_FACTOR = 2.00   # above this multiple of the upper band → flag

# ---------------------------------------------------------------------------
# Text measurement helpers
# ---------------------------------------------------------------------------
WORD_RE = re.compile(r"\b[\w']+\b")
FENCE_RE = re.compile(r"```[\s\S]*?```", re.MULTILINE)
BULLET_LINE_RE = re.compile(r"^\s*[-*+]\s+", re.MULTILINE)
BOLD_RE = re.compile(r"\*\*[^*\n]+\*\*")


def words(text: str) -> int:
    if not text:
        return 0
    return len(WORD_RE.findall(FENCE_RE.sub(" ", text)))


def chars_in_code(text: str) -> int:
    return sum(len(m.group(0)) for m in FENCE_RE.finditer(text or ""))


def paragraphs(text: str) -> list[str]:
    if not text:
        return []
    stripped = FENCE_RE.sub("", text)
    return [p.strip() for p in re.split(r"\n\s*\n", stripped) if p.strip()]


def bullets(text: str) -> list[str]:
    return [line.strip() for line in (text or "").splitlines()
            if BULLET_LINE_RE.match(line)]


# ---------------------------------------------------------------------------
# Universal rule patterns
# ---------------------------------------------------------------------------
DOC_VOICE_RE = re.compile(
    r"\b(it is important to note|in computer science|in conclusion|"
    r"firstly|secondly|thirdly|moreover|furthermore|as we all know|"
    r"in today'?s world|with the advent of|in this article|let us discuss)\b",
    re.IGNORECASE,
)

WEAK_OPENER_STARTS = (
    "in computer science", "in today", "over the years",
    "it is a", "this is a", "in this answer",
    "let's discuss", "let us discuss", "in general,",
)

VERDICT_PATTERNS = re.compile(
    r"\b(my default|my go-to|i (reach for|prefer|default to|pick|"
    r"choose|use)|i'?d (reach|pick|choose|use)|"
    r"the right (choice|default) is|stick with|never use|"
    r"always (use|prefer|go with)|in practice i)\b",
    re.IGNORECASE,
)

# STAR beats for behavioral archetype
STAR_SIGNALS = {
    "situation": re.compile(r"\b(situation|context|at (my|the) (company|team|"
                            r"job)|when i was|the team (was|needed)|"
                            r"we had|we were)\b", re.IGNORECASE),
    "task": re.compile(r"\b(my (task|role|job|goal) was|i was (asked|"
                       r"tasked|responsible)|the goal was|i (needed|had) to)\b",
                       re.IGNORECASE),
    "action": re.compile(r"\b(i (did|decided|started|led|organized|built|"
                         r"implemented|created|proposed|drove|pushed|"
                         r"wrote|designed)|my approach was|i chose to)\b",
                         re.IGNORECASE),
    "result": re.compile(r"\b(the (result|outcome) was|we (shipped|delivered|"
                         r"reduced|improved|increased|cut|achieved)|"
                         r"in the end|ultimately|as a result|"
                         r"by the time)\b", re.IGNORECASE),
}

# System-design scale math heuristics
SCALE_MATH_RE = re.compile(
    r"(\d[\d,]*\s*(req/s|requests? per second|rps|qps|tps|"
    r"op/?s|operations? per second|writes?/s|reads?/s|"
    r"tb|gb|mb|ms|p99|p95|p50|concurrent|daily active users|dau))"
    r"|(86[,.]?400)|(\d+\s*×\s*\d+)|(\d+[MBK]\s*(users|rows|records))",
    re.IGNORECASE,
)


# ---------------------------------------------------------------------------
# Result types
# ---------------------------------------------------------------------------
@dataclass
class Issue:
    severity: str
    zone: str
    category: str
    detail: str
    section_type: str = ""


@dataclass
class QuestionAudit:
    pillar: str
    pillar_name: str
    module_slug: str
    module_title: str
    topic_slug: str
    question_id: str
    question_slug: str
    question_title: str
    archetype: str
    archetype_confidence: float
    word_totals: dict = field(default_factory=dict)
    issues: list[Issue] = field(default_factory=list)

    def add(self, *args, **kw):
        self.issues.append(Issue(*args, **kw))


# ---------------------------------------------------------------------------
# Universal zone checks
# ---------------------------------------------------------------------------
def check_universal_zone1(q: QuestionAudit, direct_answer: str,
                          key_points: dict | None):
    if not direct_answer:
        q.add(MAJOR, "Z1", "zone1_missing_direct_answer",
              "No direct_answer field — Quick Answer has no lede.")
    else:
        if "```" in direct_answer:
            q.add(MAJOR, "Z1", "zone1_direct_answer_has_fence",
                  "direct_answer contains fenced code; spec allows inline `code` only.")
        if not BOLD_RE.search(direct_answer) and words(direct_answer) > 20:
            q.add(MAJOR, "Z1", "zone1_direct_answer_no_bold",
                  f"{words(direct_answer)}-word direct_answer has zero bold anchors — unscannable.")

    if key_points is None:
        q.add(CRITICAL, "Z1", "zone1_missing_key_points",
              "No key_points section — Zone 1 is incomplete.")
        return

    content = key_points.get("content", "") or ""
    b = bullets(content)
    q.word_totals["key_points_bullets"] = len(b)

    prose_paras = [p for p in paragraphs(content)
                   if not p.lstrip().startswith(("-", "*", "+", "|"))
                   and not p.startswith("#")]
    if prose_paras:
        q.add(MAJOR, "Z1", "zone1_key_points_has_prose",
              f"{len(prose_paras)} prose paragraph(s) mixed with bullets.",
              section_type="key_points")

    if not b:
        q.add(CRITICAL, "Z1", "zone1_key_points_no_bullets",
              "key_points has zero bullets.",
              section_type="key_points")
        return

    no_bold = 0
    label_only = 0
    for bl in b:
        body = re.sub(r"^[-*+]\s+", "", bl)
        if not BOLD_RE.search(body):
            no_bold += 1
        if words(body) < 6:
            label_only += 1

    if no_bold:
        q.add(MAJOR, "Z1", "zone1_key_points_bullets_no_bold",
              f"{no_bold}/{len(b)} bullets lack a **bold anchor**.",
              section_type="key_points")
    if label_only:
        q.add(MAJOR, "Z1", "zone1_key_points_bullets_label_only",
              f"{label_only}/{len(b)} bullets are < 6 words (label, not 'bold + why it matters').",
              section_type="key_points")


def check_universal_zone2(q: QuestionAudit, speakable: dict | None,
                          deep_dive_content: str):
    if speakable is None:
        q.add(CRITICAL, "Z2", "zone2_missing_speakable",
              "No speakable_answer section.")
        return

    content = speakable.get("content", "") or ""
    w = words(content)
    q.word_totals["speakable"] = w

    if FENCE_RE.search(content):
        q.add(MAJOR, "Z2", "zone2_speakable_has_fence",
              "Fenced code block in speakable — cannot be spoken aloud.",
              section_type="speakable_answer")

    doc_hits = DOC_VOICE_RE.findall(content)
    if doc_hits:
        samples = list({m.lower() for m in doc_hits})[:3]
        q.add(MAJOR, "Z2", "zone2_speakable_documentation_voice",
              f"Textbook phrasing: {samples}.",
              section_type="speakable_answer")

    first_sent = (re.split(r"(?<=[.!?])\s+", content.lstrip()) or [""])[0]
    first_sent = first_sent.strip("# ").strip()
    if first_sent and first_sent.lower().startswith(WEAK_OPENER_STARTS):
        q.add(MAJOR, "Z2", "zone2_speakable_weak_opener",
              f"Preamble opener: '{first_sent[:80]}...'. Spec: mental model in sentence 1.",
              section_type="speakable_answer")

    if not BOLD_RE.search(content) and w > 100:
        q.add(MINOR, "Z2", "zone2_speakable_no_bold",
              "No bold anchors — listener/scanner loses structure.",
              section_type="speakable_answer")

    if not VERDICT_PATTERNS.search(content) and w > 120:
        q.add(MAJOR, "Z2", "zone2_speakable_no_verdict",
              "No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').",
              section_type="speakable_answer")

    # Near-duplicate of deep dive: word set overlap > 80%
    if deep_dive_content and w > 120:
        sp_set = set(WORD_RE.findall(content.lower()))
        dd_set = set(WORD_RE.findall(deep_dive_content.lower()))
        if sp_set and dd_set:
            # Portion of speakable that is already in deep dive
            overlap = len(sp_set & dd_set) / max(len(sp_set), 1)
            if overlap > 0.85 and len(sp_set) > 60:
                q.add(MAJOR, "Z2", "zone2_speakable_near_duplicate_of_deepdive",
                      f"{overlap:.0%} word-set of speakable is inside deep dive — it reads as a duplicate, not a summary.",
                      section_type="speakable_answer")


def check_universal_zone3(q: QuestionAudit, deep_sections: list[dict]):
    if not deep_sections:
        q.add(CRITICAL, "Z3", "zone3_missing_deepdive",
              "No deep-dive sections at all.")
        return

    total_w = 0
    for s in deep_sections:
        stype = s.get("type", "")
        content = s.get("content", "") or ""
        w = words(content)
        total_w += w

        c_chars = chars_in_code(content)
        t_chars = max(len(content), 1)
        is_code_slot = stype in {"before_code", "after_code", "code_example"}

        if not is_code_slot and c_chars / t_chars > 0.60:
            q.add(MAJOR, "Z3", "zone3_code_heavy_section",
                  f"Section '{s.get('title','')}' ({stype}) is {c_chars/t_chars:.0%} code — add explanation.",
                  section_type=stype)

        if is_code_slot:
            prose_only = FENCE_RE.sub("", content).strip()
            # Count sentence terminators as a rough sentence count
            n_sent = len(re.findall(r"[.!?](?:\s|$)", prose_only))
            if n_sent < 2:
                q.add(MAJOR, "Z3", "zone3_orphan_code",
                      f"'{s.get('title','')}' has code but < 2 sentences framing it.",
                      section_type=stype)

        # Code fences missing language tag
        for m in FENCE_RE.finditer(content):
            first_line = m.group(0).splitlines()[0].strip("`").strip()
            if not first_line:
                q.add(MINOR, "Z3", "zone3_code_no_language",
                      f"Code block in '{s.get('title','')}' missing language tag.",
                      section_type=stype)
                break

        if stype in NON_DEEP_DIVE_TYPES:
            q.add(MINOR, "Z3", "zone3_wrong_section_type",
                  f"Section type '{stype}' belongs in Zone 1/2, not deep dive.",
                  section_type=stype)

    q.word_totals["deep_dive"] = total_w
    q.word_totals["deep_dive_sections"] = len(deep_sections)

    if len(deep_sections) == 1 and total_w > 300:
        q.add(MAJOR, "Z3", "zone3_single_section",
              "Deep dive is a single monolithic section — no progressive depth.")


# ---------------------------------------------------------------------------
# Archetype-specific checks
# ---------------------------------------------------------------------------
def check_archetype_specific(q: QuestionAudit, speakable: dict | None,
                             deep_sections: list[dict]):
    types_present = {s.get("type") for s in deep_sections}
    a = q.archetype
    sp_content = (speakable or {}).get("content", "") or ""

    if a == "comparison":
        if "comparison_table" not in types_present:
            q.add(MAJOR, "Z3", "comparison_missing_table",
                  "Comparison archetype requires a comparison_table section — spec says 'table is required'.")

    if a == "internals":
        if "phase" not in types_present:
            q.add(MAJOR, "Z3", "internals_no_phase_sections",
                  "Internals archetype should walk through the mechanism with `phase` sections; none found.")

    if a == "how-to-recipe":
        if "step" not in types_present:
            q.add(MAJOR, "Z3", "how_to_recipe_no_step_sections",
                  "how-to-recipe archetype should use `step` sections; none found.")

    if a == "architecture":
        if not (types_present & {"component", "step", "phase"}):
            q.add(MAJOR, "Z3", "architecture_no_structural_sections",
                  "Architecture archetype should use `component` (preferred) or `phase`/`step` sections; none found.")

    if a == "debugging-pattern":
        if not (types_present & {"before_code", "after_code"}):
            q.add(MAJOR, "Z3", "debugging_pattern_no_before_after",
                  "debugging-pattern archetype expects before_code/after_code sections; neither found.")

    if a == "system-design":
        if sp_content and not SCALE_MATH_RE.search(sp_content):
            q.add(MAJOR, "Z2", "system_design_no_scale_math",
                  "System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.",
                  section_type="speakable_answer")

    if a == "behavioral":
        if sp_content:
            hit_beats = [name for name, pat in STAR_SIGNALS.items()
                         if pat.search(sp_content)]
            missing = [name for name in STAR_SIGNALS if name not in hit_beats]
            if len(missing) >= 2:
                q.add(MAJOR, "Z2", "behavioral_missing_star_beats",
                      f"Behavioral speakable missing STAR beats: {missing}. Present: {hit_beats}.",
                      section_type="speakable_answer")


# ---------------------------------------------------------------------------
# Length radical-deviation checks (archetype-banded)
# ---------------------------------------------------------------------------
def check_length_bands(q: QuestionAudit, speakable_words: int,
                       deep_dive_words: int):
    band = ARCHETYPE_BANDS.get(q.archetype)
    if not band:
        return
    dd_lo, dd_hi, sp_lo, sp_hi = band

    # Deep dive
    if deep_dive_words > 0:
        if deep_dive_words < dd_lo * RADICAL_LOW_FACTOR:
            q.add(MAJOR, "Z3", "zone3_dd_radically_short",
                  f"Deep dive {deep_dive_words}w is <50% of {q.archetype} lower band ({dd_lo}).")
        elif deep_dive_words > dd_hi * RADICAL_HIGH_FACTOR:
            q.add(MAJOR, "Z3", "zone3_dd_radically_long",
                  f"Deep dive {deep_dive_words}w is >2× of {q.archetype} upper band ({dd_hi}).")

    # Speakable
    if speakable_words > 0:
        if speakable_words < sp_lo * RADICAL_LOW_FACTOR:
            q.add(MAJOR, "Z2", "zone2_speakable_radically_short",
                  f"Speakable {speakable_words}w is <50% of {q.archetype} lower band ({sp_lo}).")
        elif speakable_words > sp_hi * RADICAL_HIGH_FACTOR:
            q.add(MAJOR, "Z2", "zone2_speakable_radically_long",
                  f"Speakable {speakable_words}w is >2× of {q.archetype} upper band ({sp_hi}).")


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------
def load_archetype_map() -> dict[str, dict]:
    p = OUT_DIR / "suggested_archetypes.json"
    if not p.exists():
        raise SystemExit("Run scripts/infer_archetypes.py first.")
    d = json.loads(p.read_text())
    return {s["question_id"]: s for s in d["suggestions"]}


def audit_question(meta: dict, topic_slug: str, q: dict,
                   archetype_map: dict[str, dict]) -> QuestionAudit:
    sug = archetype_map.get(q.get("id", "")) or {}
    audit = QuestionAudit(
        pillar=meta["pillar"],
        pillar_name=meta["pillarName"],
        module_slug=meta["moduleSlug"],
        module_title=meta["title"],
        topic_slug=topic_slug,
        question_id=q.get("id", ""),
        question_slug=q.get("slug", ""),
        question_title=q.get("title") or q.get("question", ""),
        archetype=sug.get("inferred_archetype", "moderate-concept"),
        archetype_confidence=sug.get("confidence", 0.0),
    )

    sections = (q.get("answer") or {}).get("sections") or []
    if not sections:
        audit.add(CRITICAL, "X", "stub_no_sections",
                  "Question has no answer.sections — complete stub.")
        return audit

    by_type = defaultdict(list)
    for s in sections:
        by_type[s.get("type", "")].append(s)

    key_points = (by_type.get("key_points")
                  or by_type.get("important_points") or [None])[0]
    speakable = (by_type.get("speakable_answer") or [None])[0]
    deep_dive = [s for s in sections
                 if s.get("type") not in NON_DEEP_DIVE_TYPES]

    deep_dive_content = "\n\n".join(s.get("content", "") or "" for s in deep_dive)
    deep_dive_words = sum(words(s.get("content", "") or "") for s in deep_dive)
    speakable_words = words((speakable or {}).get("content", "") or "")

    check_universal_zone1(audit, q.get("direct_answer", ""), key_points)
    check_universal_zone2(audit, speakable, deep_dive_content)
    check_universal_zone3(audit, deep_dive)
    check_archetype_specific(audit, speakable, deep_dive)
    check_length_bands(audit, speakable_words, deep_dive_words)

    return audit


def audit_all(pillars: set[str] | None) -> list[QuestionAudit]:
    index = json.loads((JBI_ROOT / "_index.json").read_text())
    arche_map = load_archetype_map()
    audits: list[QuestionAudit] = []

    for m in index["modules"]:
        if pillars and m["pillar"] not in pillars:
            continue
        mdir = JBI_ROOT / m["moduleSlug"]
        if not mdir.exists():
            continue
        for topic in m.get("topics", []):
            qa_path = mdir / topic / "complete-qa.json"
            if not qa_path.exists():
                continue
            data = json.loads(qa_path.read_text())
            for q in data.get("questions", []):
                audits.append(audit_question(m, topic, q, arche_map))
    return audits


# ---------------------------------------------------------------------------
# Report rendering
# ---------------------------------------------------------------------------
def render(audits: list[QuestionAudit], pillars: set[str] | None) -> str:
    stubs = [a for a in audits
             if any(i.category == "stub_no_sections" for i in a.issues)]
    written = [a for a in audits if a not in stubs]

    by_severity = Counter()
    by_category = Counter()
    by_zone = Counter()
    by_archetype = Counter()
    by_archetype_sev = defaultdict(Counter)
    by_module_sev = defaultdict(Counter)
    by_module_category = defaultdict(Counter)

    for a in audits:
        by_archetype[a.archetype] += 1
        for i in a.issues:
            by_severity[i.severity] += 1
            by_category[i.category] += 1
            by_zone[i.zone] += 1
            by_archetype_sev[a.archetype][i.severity] += 1
            by_module_sev[a.module_slug][i.severity] += 1
            by_module_category[a.module_slug][i.category] += 1

    crit_written = sum(1 for a in written
                       if any(i.severity == CRITICAL for i in a.issues))
    major_written = sum(1 for a in written
                        if any(i.severity == MAJOR for i in a.issues))
    clean_written = sum(1 for a in written if not a.issues)

    lines: list[str] = []
    scope = f"pillars={sorted(pillars)}" if pillars else "all pillars"
    lines.append(f"# JBI Audit v2 — {scope}")
    lines.append("")
    lines.append(f"Aligned to `content/ANSWER_QUALITY_SPEC_V2.md`. "
                 f"Archetype source: `scripts/out/suggested_archetypes.json`.")
    lines.append("")
    lines.append(f"- Questions audited: **{len(audits)}**")
    lines.append(f"- Complete stubs: **{len(stubs)}** (separate from quality issues)")
    lines.append(f"- Written answers: **{len(written)}**")
    lines.append(f"  - With CRITICAL: {crit_written}")
    lines.append(f"  - With MAJOR: {major_written}")
    lines.append(f"  - Fully clean: {clean_written}")
    lines.append("")
    lines.append("**Key philosophy change from v1:** universal word ceilings removed. "
                 "Length is only flagged on radical deviation from the archetype's band "
                 "(<50% lower or >200% upper).")
    lines.append("")

    # Severity summary
    lines.append("## 1. Severity counts")
    lines.append("")
    lines.append("| Severity | Count |")
    lines.append("|---|---:|")
    for sev in (CRITICAL, MAJOR, MINOR):
        lines.append(f"| {sev} | {by_severity.get(sev, 0)} |")
    lines.append("")

    # Archetype distribution for this scope
    lines.append("## 2. Archetype distribution in this scope")
    lines.append("")
    lines.append("| Archetype | Questions | CRITICAL | MAJOR | MINOR |")
    lines.append("|---|---:|---:|---:|---:|")
    for a, n in by_archetype.most_common():
        c = by_archetype_sev[a]
        lines.append(f"| `{a}` | {n} | {c.get(CRITICAL,0)} | {c.get(MAJOR,0)} | {c.get(MINOR,0)} |")
    lines.append("")

    # Categories
    lines.append("## 3. Top issue categories")
    lines.append("")
    lines.append("| Category | Count | Zone |")
    lines.append("|---|---:|:-:|")
    cat_zone = {i.category: i.zone for a in audits for i in a.issues}
    for cat, n in by_category.most_common(30):
        lines.append(f"| `{cat}` | {n} | {cat_zone.get(cat,'')} |")
    lines.append("")

    # Module heatmap
    lines.append("## 4. Module heatmap")
    lines.append("")
    lines.append("| Module | CRITICAL | MAJOR | MINOR | Top categories |")
    lines.append("|---|---:|---:|---:|---|")
    for mod, c in sorted(by_module_sev.items(),
                         key=lambda kv: (-kv[1].get(CRITICAL,0),
                                         -kv[1].get(MAJOR,0))):
        top = ", ".join(f"`{k}`×{v}" for k, v in
                        by_module_category[mod].most_common(3))
        lines.append(f"| {mod} | {c.get(CRITICAL,0)} | {c.get(MAJOR,0)} | {c.get(MINOR,0)} | {top} |")
    lines.append("")

    # Stubs
    lines.append(f"## 5. Complete stubs in scope ({len(stubs)})")
    lines.append("")
    if stubs:
        lines.append("| Module | Topic | Question |")
        lines.append("|---|---|---|")
        for a in sorted(stubs, key=lambda x: (x.module_slug, x.topic_slug)):
            lines.append(f"| {a.module_slug} | {a.topic_slug} | {a.question_title[:85]} |")
    else:
        lines.append("_None in this scope._")
    lines.append("")

    # Per-question findings (written answers with issues)
    lines.append("## 6. Per-question findings")
    lines.append("")
    grouped: dict[str, dict[str, list[QuestionAudit]]] = defaultdict(lambda: defaultdict(list))
    for a in written:
        if a.issues:
            grouped[a.module_slug][a.topic_slug].append(a)
    for mod in sorted(grouped):
        lines.append(f"### `{mod}`")
        lines.append("")
        for topic in sorted(grouped[mod]):
            lines.append(f"#### `{topic}`")
            lines.append("")
            for a in grouped[mod][topic]:
                conf = f"(conf {a.archetype_confidence:.2f})"
                dd = a.word_totals.get("deep_dive", 0)
                sp = a.word_totals.get("speakable", 0)
                lines.append(f"- **{a.question_title}** · archetype=`{a.archetype}` {conf} · "
                             f"speakable={sp}w · deep_dive={dd}w")
                for i in sorted(a.issues, key=lambda x: (
                        0 if x.severity == CRITICAL else
                        1 if x.severity == MAJOR else 2)):
                    loc = f" [{i.section_type}]" if i.section_type else ""
                    lines.append(f"  - **{i.severity}** · {i.zone} · `{i.category}`{loc} — {i.detail}")
            lines.append("")

    return "\n".join(lines)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--pillars", default="",
                    help="Comma list e.g. P01,P06,P12. Empty = all.")
    ap.add_argument("--out-prefix", default="jbi_audit_v2")
    args = ap.parse_args()

    pillars = {p.strip() for p in args.pillars.split(",") if p.strip()} or None
    audits = audit_all(pillars)

    data = {
        "pillars_in_scope": sorted(pillars) if pillars else "all",
        "total_audited": len(audits),
        "questions": [
            {
                **{k: getattr(a, k) for k in (
                    "pillar", "pillar_name", "module_slug", "module_title",
                    "topic_slug", "question_id", "question_slug",
                    "question_title", "archetype", "archetype_confidence",
                    "word_totals",
                )},
                "issues": [asdict(i) for i in a.issues],
            }
            for a in audits
        ],
    }
    (OUT_DIR / f"{args.out_prefix}_data.json").write_text(
        json.dumps(data, indent=2))
    (OUT_DIR / f"{args.out_prefix}_report.md").write_text(
        render(audits, pillars))

    sev = Counter()
    for a in audits:
        for i in a.issues:
            sev[i.severity] += 1
    print(f"Audited {len(audits)} questions in "
          f"{sorted(pillars) if pillars else 'all'} pillars.")
    for s in (CRITICAL, MAJOR, MINOR):
        print(f"  {s}: {sev.get(s, 0)}")
    print(f"Wrote: {OUT_DIR}/{args.out_prefix}_report.md")
    print(f"Wrote: {OUT_DIR}/{args.out_prefix}_data.json")


if __name__ == "__main__":
    main()
