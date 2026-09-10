"""Audit Java Backend Intermediate answer quality across all 34 modules.

Evaluates every question's 3 UI zones against the project's Answer Quality
Constitution (content/ANSWER_QUALITY_SPEC.md):

  Zone 1 - Quick Answer     (direct_answer + key_points)
  Zone 2 - Interview Answer (speakable_answer)
  Zone 3 - Deep Dive        (everything else: overview, phase, step,
                             before_code, after_code, comparison_table,
                             concept_map, problem_statement, code_example, ...)

Produces two artifacts:
  scripts/out/jbi_audit_report.md   - human-readable report
  scripts/out/jbi_audit_data.json   - structured issue list for downstream fix tooling

The script does NOT modify any content. It is strictly a read-only analyzer.
"""
from __future__ import annotations

import json
import re
from collections import Counter, defaultdict
from dataclasses import dataclass, field, asdict
from pathlib import Path
from typing import Iterable

ROOT = Path(__file__).resolve().parent.parent
JBI_ROOT = ROOT / "content" / "java-backend-intermediate"
OUT_DIR = ROOT / "scripts" / "out"
OUT_DIR.mkdir(parents=True, exist_ok=True)

# ---------------------------------------------------------------------------
# Severity levels
# ---------------------------------------------------------------------------
CRITICAL = "CRITICAL"   # answer is broken / unusable as-is
MAJOR = "MAJOR"         # violates constitution in a way users will notice
MINOR = "MINOR"         # style / polish issue

# Zone 3 section types per constitution
DEEP_DIVE_TYPES = {
    "overview", "step", "phase", "code_example", "comparison_table",
    "concept_map", "problem_statement", "before_code", "after_code",
    "diagnosis", "component", "when_to_use", "verdict",
}

# Section types that belong in Zone 1/2 (should NOT appear in deep dive)
NON_DEEP_DIVE_TYPES = {"key_points", "important_points", "speakable_answer",
                       "interviewer_expectation"}

# ---------------------------------------------------------------------------
# Utility: text measurements
# ---------------------------------------------------------------------------
WORD_RE = re.compile(r"\b[\w']+\b")
FENCE_RE = re.compile(r"```[\s\S]*?```", re.MULTILINE)
BULLET_LINE_RE = re.compile(r"^\s*[-*+]\s+", re.MULTILINE)
TABLE_ROW_RE = re.compile(r"^\s*\|.*\|\s*$", re.MULTILINE)
BOLD_RE = re.compile(r"\*\*[^*\n]+\*\*")
INLINE_CODE_RE = re.compile(r"`[^`\n]+`")


def words(text: str) -> int:
    """Count words excluding fenced code blocks."""
    if not text:
        return 0
    stripped = FENCE_RE.sub(" ", text)
    return len(WORD_RE.findall(stripped))


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
# Issue record
# ---------------------------------------------------------------------------
@dataclass
class Issue:
    severity: str
    zone: str            # "Z1" | "Z2" | "Z3" | "X" (cross-zone)
    category: str        # short machine label
    detail: str          # human-readable specifics
    section_type: str = ""  # which section this came from, if applicable


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
    word_totals: dict = field(default_factory=dict)
    issues: list[Issue] = field(default_factory=list)

    def add(self, *args, **kw):
        self.issues.append(Issue(*args, **kw))


# ---------------------------------------------------------------------------
# Zone checkers
# ---------------------------------------------------------------------------
DOC_VOICE_PATTERNS = [
    r"\bIt is important to note\b",
    r"\bIn computer science\b",
    r"\bIn conclusion\b",
    r"\bFirstly\b", r"\bSecondly\b", r"\bThirdly\b",
    r"\bMoreover\b", r"\bFurthermore\b",
    r"\bAs we all know\b",
    r"\bIn today's world\b",
    r"\bWith the advent of\b",
    r"\bIn this article\b",
    r"\bLet us\b",
]
DOC_VOICE_RE = re.compile("|".join(DOC_VOICE_PATTERNS), re.IGNORECASE)

FILLER_PATTERNS = [
    r"\bbasically\b", r"\bsimply\b", r"\bobviously\b",
    r"\bof course\b", r"\bin order to\b",
    r"\bvery unique\b", r"\bjust\b and \b",
]
FILLER_RE = re.compile("|".join(FILLER_PATTERNS), re.IGNORECASE)


def check_zone1(q: QuestionAudit, direct_answer: str, key_points: dict | None):
    # ----- direct_answer (short summary shown at top of Quick Answer) -----
    if not direct_answer:
        q.add(MAJOR, "Z1", "direct_answer_missing",
              "No direct_answer field — Quick Answer box has no lede.")
    else:
        w = words(direct_answer)
        q.word_totals["direct_answer"] = w
        if w < 15:
            q.add(MINOR, "Z1", "direct_answer_too_short",
                  f"direct_answer is only {w} words — too thin to summarize.")
        elif w > 120:
            q.add(MAJOR, "Z1", "direct_answer_too_long",
                  f"direct_answer is {w} words — should be a punchy 30–80 word lede, not a paragraph dump.")
        if "```" in direct_answer:
            q.add(MAJOR, "Z1", "direct_answer_has_code_block",
                  "direct_answer contains fenced code — it should only use inline `code`.")
        if len(BOLD_RE.findall(direct_answer)) == 0 and w > 25:
            q.add(MINOR, "Z1", "direct_answer_no_bold",
                  "direct_answer has zero bolded anchors — readers can't scan it.")

    # ----- key_points section -----
    if key_points is None:
        q.add(CRITICAL, "Z1", "key_points_missing",
              "No key_points section — Zone 1 is incomplete per spec.")
        return
    content = key_points.get("content", "") or ""
    b = bullets(content)
    q.word_totals["key_points"] = words(content)
    q.word_totals["key_points_bullet_count"] = len(b)

    # Prose paragraphs mixed in (not bullets-only)
    prose_paras = [p for p in paragraphs(content)
                   if not p.lstrip().startswith(("-", "*", "+", "|"))
                   and not p.startswith("#")]
    if prose_paras:
        q.add(MAJOR, "Z1", "key_points_has_prose",
              f"{len(prose_paras)} prose paragraph(s) mixed with bullets — spec says bullets only.",
              section_type="key_points")

    if len(b) < 4:
        q.add(CRITICAL, "Z1", "key_points_too_few",
              f"Only {len(b)} bullets — spec requires 4–6 (up to 8). 'Never fewer than 4.'",
              section_type="key_points")
    elif len(b) > 8:
        q.add(MAJOR, "Z1", "key_points_too_many",
              f"{len(b)} bullets — spec caps at 8. Harder to scan in 30s.",
              section_type="key_points")

    # Bullet quality: each bullet needs **bold anchor** + explanation
    label_only = []
    too_long = []
    no_bold = []
    for bl in b:
        bl_body = re.sub(r"^[-*+]\s+", "", bl)
        has_bold = bool(BOLD_RE.search(bl_body))
        bw = words(bl_body)
        if not has_bold:
            no_bold.append(bl_body[:60])
        if bw < 6:
            label_only.append(bl_body[:60])
        if bw > 45:
            too_long.append((bw, bl_body[:60]))
    if no_bold:
        q.add(MAJOR, "Z1", "key_points_bullets_no_bold",
              f"{len(no_bold)}/{len(b)} bullets have no **bold anchor** concept name.",
              section_type="key_points")
    if label_only:
        q.add(MAJOR, "Z1", "key_points_bullets_label_only",
              f"{len(label_only)}/{len(b)} bullets look like labels, not 'bold + why it matters' (examples: {label_only[:2]}).",
              section_type="key_points")
    if too_long:
        q.add(MINOR, "Z1", "key_points_bullets_too_long",
              f"{len(too_long)}/{len(b)} bullets exceed 45 words — defeats the 30-second scan.",
              section_type="key_points")


def check_zone2(q: QuestionAudit, speakable: dict | None, deep_dive_words: int):
    if speakable is None:
        q.add(CRITICAL, "Z2", "speakable_missing",
              "No speakable_answer — Zone 2 (Interview Answer) is empty.")
        return
    content = speakable.get("content", "") or ""
    w = words(content)
    q.word_totals["speakable"] = w
    paras = paragraphs(content)
    n_paras = len(paras)
    q.word_totals["speakable_paragraphs"] = n_paras

    # Length bounds
    if w < 100:
        q.add(MAJOR, "Z2", "speakable_too_short",
              f"Speakable is only {w} words — spec target is 150–300. Too thin to answer in an interview.",
              section_type="speakable_answer")
    elif w > 450:
        q.add(MAJOR, "Z2", "speakable_too_long",
              f"Speakable is {w} words — spec target is 150–300 (up to ~350 for complex). Reads like a monologue, not a conversation.",
              section_type="speakable_answer")
    elif w > 350:
        q.add(MINOR, "Z2", "speakable_slightly_long",
              f"Speakable is {w} words — upper bound. Trim unless topic is genuinely deep.",
              section_type="speakable_answer")

    # Ratio vs deep dive: speakable should be 1/3–1/5 of deep dive
    if deep_dive_words > 0 and w > 0:
        ratio = w / deep_dive_words
        q.word_totals["speakable_to_deepdive_ratio"] = round(ratio, 3)
        if ratio > 0.5 and deep_dive_words >= 400:
            q.add(MAJOR, "Z2", "speakable_not_shorter_than_deepdive",
                  f"Speakable is {ratio:.0%} of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.",
                  section_type="speakable_answer")

    # Fenced code blocks forbidden in speakable
    if FENCE_RE.search(content):
        q.add(MAJOR, "Z2", "speakable_has_code_fence",
              "Contains ``` fenced code — spec forbids code blocks in speakable, only inline `code`.",
              section_type="speakable_answer")

    # Paragraph structure: target 3–5 paragraphs
    if n_paras < 2:
        q.add(MAJOR, "Z2", "speakable_single_paragraph",
              f"Only {n_paras} paragraph(s) — reads as a text wall. Spec target is 3–5 paragraphs.",
              section_type="speakable_answer")
    elif n_paras > 8:
        q.add(MINOR, "Z2", "speakable_over_fragmented",
              f"{n_paras} paragraphs — overly fragmented; collapse to 3–5.",
              section_type="speakable_answer")

    # Bullet density: some speakables have become bullet lists
    n_bullets = len(bullets(content))
    if n_bullets >= 6 and n_paras <= 2:
        q.add(MAJOR, "Z2", "speakable_bullet_heavy",
              f"{n_bullets} bullets vs {n_paras} paragraph(s) — speakable should read like speech, not a slide.",
              section_type="speakable_answer")

    # Bold anchor count: spec wants 3–5
    n_bold = len(BOLD_RE.findall(content))
    if n_bold == 0 and w > 120:
        q.add(MINOR, "Z2", "speakable_no_bold",
              "No **bold terms** — readers lose anchor points when scanning.",
              section_type="speakable_answer")
    elif n_bold > 12:
        q.add(MINOR, "Z2", "speakable_bold_spam",
              f"{n_bold} bold terms — over-emphasis; spec suggests 3–5.",
              section_type="speakable_answer")

    # Documentation voice
    doc_hits = DOC_VOICE_RE.findall(content)
    if doc_hits:
        samples = list({m.lower() for m in doc_hits})[:3]
        q.add(MAJOR, "Z2", "speakable_documentation_voice",
              f"Textbook phrasing detected ({samples}) — speakable must sound like speech.",
              section_type="speakable_answer")

    # Filler words
    filler_hits = FILLER_RE.findall(content)
    if len(filler_hits) >= 3:
        q.add(MINOR, "Z2", "speakable_filler_words",
              f"{len(filler_hits)} filler words ({Counter(f.lower() for f in filler_hits).most_common(3)}) — trim.",
              section_type="speakable_answer")

    # Opening hook: first sentence should carry the mental model, not a preamble
    first_sent = re.split(r"(?<=[.!?])\s+", content.lstrip())[0] if content.strip() else ""
    first_sent = first_sent.strip("# ").strip()
    bad_openers = ("in computer science", "in today", "over the years",
                   "it is a", "this is a", "in this answer",
                   "let's discuss", "let us discuss")
    if first_sent and first_sent.lower().startswith(bad_openers):
        q.add(MAJOR, "Z2", "speakable_weak_opener",
              f"Speakable opens with a preamble ('{first_sent[:70]}...') — spec requires the key mental model in sentence one.",
              section_type="speakable_answer")


def check_zone3(q: QuestionAudit, deep_sections: list[dict]):
    if not deep_sections:
        q.add(CRITICAL, "Z3", "deep_dive_missing",
              "No deep-dive sections — Zone 3 is empty.")
        return

    total_w = 0
    per_section = []
    code_heavy_sections = []
    thin_sections = []
    orphan_code_sections = []
    missing_code_lang = []

    for s in deep_sections:
        stype = s.get("type", "")
        title = s.get("title", "")
        content = s.get("content", "") or ""
        w = words(content)
        total_w += w
        per_section.append((stype, title, w))

        # Section length rule: no section under 100 words
        if w < 60 and stype not in {"concept_map", "comparison_table",
                                    "before_code", "after_code",
                                    "code_example"}:
            thin_sections.append((stype, title, w))

        # Code ratio: no section more than 60% code
        c_chars = chars_in_code(content)
        t_chars = max(len(content), 1)
        if c_chars / t_chars > 0.60 and stype not in {"before_code", "after_code", "code_example"}:
            code_heavy_sections.append((stype, title, round(c_chars / t_chars, 2)))

        # Code fences missing language hint
        for m in FENCE_RE.finditer(content):
            first_line = m.group(0).splitlines()[0].strip("`").strip()
            if not first_line:
                missing_code_lang.append((stype, title))
                break

        # Orphan code: *_code sections that have no explanatory prose
        if stype in {"before_code", "after_code", "code_example"}:
            non_code = FENCE_RE.sub("", content).strip()
            if words(non_code) < 12:
                orphan_code_sections.append((stype, title))

    q.word_totals["deep_dive_total"] = total_w
    q.word_totals["deep_dive_sections"] = len(deep_sections)

    # Total length bucket against complexity rules (500–2000 spec range)
    if total_w < 350:
        q.add(MAJOR, "Z3", "deep_dive_too_short",
              f"Deep dive is only {total_w} words across {len(deep_sections)} sections — thinner than the 500-word floor for shallow topics.")
    elif total_w > 2500:
        q.add(MAJOR, "Z3", "deep_dive_too_long",
              f"Deep dive is {total_w} words — above the 2000-word ceiling. Either over-padded or needs to be split.")

    # Section count
    if len(deep_sections) < 2:
        q.add(MAJOR, "Z3", "deep_dive_single_section",
              f"Only {len(deep_sections)} deep-dive section — progressive depth is impossible with one block.")

    # Only overview, no concrete structure
    types_present = {s.get("type") for s in deep_sections}
    has_scaffold = bool(types_present & {"phase", "step", "component",
                                         "problem_statement", "before_code",
                                         "after_code", "code_example",
                                         "comparison_table"})
    if not has_scaffold and total_w > 300:
        q.add(MAJOR, "Z3", "deep_dive_no_scaffold",
              f"Deep dive only has narrative sections ({sorted(types_present)}) — no phase/step/code_example/comparison_table for structure.")

    # Thin sections
    if thin_sections:
        q.add(MINOR, "Z3", "deep_dive_thin_sections",
              f"{len(thin_sections)} section(s) under 60 words: {[(t[0], t[2]) for t in thin_sections[:3]]}. Spec: 'merge with adjacent'.")

    # Code-heavy sections
    if code_heavy_sections:
        q.add(MAJOR, "Z3", "deep_dive_code_heavy",
              f"{len(code_heavy_sections)} section(s) >60% code: {code_heavy_sections[:2]} — add explanation.")

    # Orphan code
    if orphan_code_sections:
        q.add(MAJOR, "Z3", "deep_dive_orphan_code",
              f"{len(orphan_code_sections)} *_code section(s) with <12 words of prose: {orphan_code_sections[:2]} — code blocks should be framed, not dumped.")

    if missing_code_lang:
        q.add(MINOR, "Z3", "deep_dive_code_no_language",
              f"{len(missing_code_lang)} fenced block(s) missing language tag — breaks syntax highlighting.")

    # Non-deep-dive section types lurking in Zone 3
    bad_types = [s.get("type") for s in deep_sections if s.get("type") in NON_DEEP_DIVE_TYPES]
    if bad_types:
        q.add(MINOR, "Z3", "deep_dive_wrong_section_type",
              f"Types that belong in Zone 1/2 found inside deep dive: {bad_types}.")

    # Comparison archetype check: question text says "vs" or "difference between"
    qtext = f"{q.question_title}".lower()
    if re.search(r"\bvs\b|difference between|compare|which is better", qtext):
        if "comparison_table" not in types_present:
            q.add(MAJOR, "Z3", "comparison_missing_table",
                  "Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.")

    # Paragraph-wall detection across Zone 3: any single content block >250 words with <2 bullets and <2 paragraphs
    for s in deep_sections:
        content = s.get("content", "") or ""
        w = words(content)
        paras = paragraphs(content)
        bs = bullets(content)
        if w > 250 and len(paras) <= 2 and len(bs) < 3:
            q.add(MINOR, "Z3", "deep_dive_text_wall",
                  f"Section '{s.get('title','')}' ({s.get('type')}) is {w} words as a text wall — break into paragraphs/bullets.",
                  section_type=s.get("type", ""))


def check_cross_zone(q: QuestionAudit, direct_answer: str,
                     speakable: dict | None, key_points: dict | None):
    # Speakable and key_points duplicating each other verbatim
    sp = (speakable or {}).get("content", "") or ""
    kp = (key_points or {}).get("content", "") or ""
    if sp and kp:
        sp_words = set(WORD_RE.findall(sp.lower()))
        kp_words = set(WORD_RE.findall(kp.lower()))
        if sp_words and kp_words:
            overlap = len(sp_words & kp_words) / max(len(kp_words), 1)
            if overlap > 0.85 and len(kp_words) > 40:
                q.add(MINOR, "X", "zone1_zone2_high_overlap",
                      f"{overlap:.0%} word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.")

    # Direct answer duplicating speakable lede
    if direct_answer and sp:
        da_norm = re.sub(r"\s+", " ", direct_answer).strip().lower()[:80]
        sp_norm = re.sub(r"\s+", " ", sp).strip().lower()[:80]
        if da_norm and da_norm == sp_norm:
            q.add(MINOR, "X", "direct_answer_equals_speakable_opener",
                  "direct_answer is identical to speakable opener — duplicated content.")


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------
def load_index() -> list[dict]:
    idx = json.loads((JBI_ROOT / "_index.json").read_text())
    return idx["modules"]


def audit_question(module_meta: dict, topic_slug: str, q: dict) -> QuestionAudit:
    audit = QuestionAudit(
        pillar=module_meta["pillar"],
        pillar_name=module_meta["pillarName"],
        module_slug=module_meta["moduleSlug"],
        module_title=module_meta["title"],
        topic_slug=topic_slug,
        question_id=q.get("id", ""),
        question_slug=q.get("slug", ""),
        question_title=q.get("title") or q.get("question", ""),
    )

    sections = (q.get("answer") or {}).get("sections") or []
    by_type = defaultdict(list)
    for s in sections:
        by_type[s.get("type", "")].append(s)

    # A stub = zero sections. Flag it once and skip the zone checks —
    # a stub is a content gap, not a "quality" issue to categorize separately.
    if not sections:
        audit.add(CRITICAL, "X", "stub_no_sections",
                  "Question has no answer.sections at all — complete stub.")
        ii = q.get("interviewer_intent") or {}
        if not isinstance(ii, dict):
            ii = {}
        missing_ii = [k for k in ("testing", "common_mistake", "to_stand_out")
                      if not (ii.get(k) or "").strip()]
        if missing_ii:
            audit.add(MINOR, "X", "interviewer_intent_incomplete",
                      f"Missing interviewer_intent keys: {missing_ii}.")
        if not (q.get("company_tags") or []):
            audit.add(MINOR, "X", "missing_company_tags", "No company_tags populated.")
        return audit

    key_points = (by_type.get("key_points") or by_type.get("important_points") or [None])[0]
    speakable = (by_type.get("speakable_answer") or [None])[0]
    deep_dive = [s for s in sections
                 if s.get("type") not in (NON_DEEP_DIVE_TYPES)]

    deep_dive_words = sum(words(s.get("content", "") or "") for s in deep_dive)

    check_zone1(audit, q.get("direct_answer", ""), key_points)
    check_zone2(audit, speakable, deep_dive_words)
    check_zone3(audit, deep_dive)
    check_cross_zone(audit, q.get("direct_answer", ""), speakable, key_points)

    # Missing interviewer_intent (not a zone, but a structural quality signal)
    ii = q.get("interviewer_intent") or {}
    if not isinstance(ii, dict):
        ii = {}
    missing_ii = [k for k in ("testing", "common_mistake", "to_stand_out")
                  if not (ii.get(k) or "").strip()]
    if missing_ii:
        audit.add(MINOR, "X", "interviewer_intent_incomplete",
                  f"Missing interviewer_intent keys: {missing_ii}.")

    if not (q.get("company_tags") or []):
        audit.add(MINOR, "X", "missing_company_tags", "No company_tags populated.")

    return audit


def audit_all() -> tuple[list[QuestionAudit], list[dict]]:
    modules = load_index()
    audits: list[QuestionAudit] = []
    topic_stats: list[dict] = []

    for m in modules:
        mdir = JBI_ROOT / m["moduleSlug"]
        if not mdir.exists():
            continue
        for topic in m.get("topics", []):
            qa_path = mdir / topic / "complete-qa.json"
            if not qa_path.exists():
                topic_stats.append({
                    "module": m["moduleSlug"], "topic": topic,
                    "status": "MISSING_FILE",
                })
                continue
            try:
                data = json.loads(qa_path.read_text())
            except Exception as e:
                topic_stats.append({
                    "module": m["moduleSlug"], "topic": topic,
                    "status": f"PARSE_ERROR: {e}",
                })
                continue
            qs = data.get("questions", [])
            topic_stats.append({
                "module": m["moduleSlug"], "topic": topic,
                "status": "ok", "questions": len(qs),
            })
            for q in qs:
                audits.append(audit_question(m, topic, q))
    return audits, topic_stats


# ---------------------------------------------------------------------------
# Report rendering
# ---------------------------------------------------------------------------
def render_report(audits: list[QuestionAudit], topic_stats: list[dict]) -> str:
    # Aggregate counters
    by_severity = Counter()
    by_category = Counter()
    by_zone = Counter()
    by_pillar_severity = defaultdict(Counter)
    by_module_severity = defaultdict(Counter)
    by_module_category = defaultdict(Counter)
    questions_with_crit = 0
    questions_clean = 0

    for a in audits:
        sevs = {i.severity for i in a.issues}
        if CRITICAL in sevs:
            questions_with_crit += 1
        if not a.issues:
            questions_clean += 1
        for i in a.issues:
            by_severity[i.severity] += 1
            by_category[i.category] += 1
            by_zone[i.zone] += 1
            by_pillar_severity[(a.pillar, a.pillar_name)][i.severity] += 1
            by_module_severity[a.module_slug][i.severity] += 1
            by_module_category[a.module_slug][i.category] += 1

    total_q = len(audits)
    total_issues = sum(by_severity.values())

    lines: list[str] = []
    stub_audits = [a for a in audits
                   if any(i.category == "stub_no_sections" for i in a.issues)]
    written_audits = [a for a in audits if a not in stub_audits]
    written_with_crit = sum(1 for a in written_audits
                            if any(i.severity == CRITICAL for i in a.issues))
    written_with_major = sum(1 for a in written_audits
                             if any(i.severity == MAJOR for i in a.issues))
    written_clean = sum(1 for a in written_audits if not a.issues)

    lines.append("# Java Backend Intermediate — Answer Quality Audit")
    lines.append("")
    lines.append(f"**Scope:** all 34 modules, 12 pillars. **Questions audited:** {total_q}.")
    lines.append("")
    lines.append(f"- **Complete stubs (zero sections):** {len(stub_audits)} — listed in §6. "
                 "These are content gaps, not quality issues.")
    lines.append(f"- **Written answers audited:** {len(written_audits)}.")
    lines.append(f"  - With CRITICAL issue(s): {written_with_crit}")
    lines.append(f"  - With MAJOR issue(s): {written_with_major}")
    lines.append(f"  - Fully clean (zero issues): {written_clean}")
    lines.append(f"- **Total issues flagged:** {total_issues}.")
    lines.append("")
    lines.append("All checks are aligned to `content/ANSWER_QUALITY_SPEC.md`. "
                 "Three UI zones are evaluated:")
    lines.append("- **Zone 1** — Quick Answer (`direct_answer` + `key_points`)")
    lines.append("- **Zone 2** — Interview Answer (`speakable_answer`)")
    lines.append("- **Zone 3** — Deep Dive (`overview`, `phase`, `step`, `before_code`, `after_code`, `comparison_table`, `concept_map`, `problem_statement`, `code_example`, `component`, ...)")
    lines.append("")
    lines.append("Severity legend: **CRITICAL** (answer broken/unusable) · **MAJOR** (violates the constitution; users will notice) · **MINOR** (polish).")
    lines.append("")

    # ---- Severity summary ----
    lines.append("## 1. Severity summary")
    lines.append("")
    lines.append("| Severity | Count |")
    lines.append("|---|---:|")
    for sev in (CRITICAL, MAJOR, MINOR):
        lines.append(f"| {sev} | {by_severity.get(sev, 0)} |")
    lines.append("")

    # ---- Per-zone distribution ----
    lines.append("## 2. Issues by zone")
    lines.append("")
    lines.append("| Zone | Count |")
    lines.append("|---|---:|")
    for z in ("Z1", "Z2", "Z3", "X"):
        lines.append(f"| {z} | {by_zone.get(z, 0)} |")
    lines.append("")

    # ---- Top categories ----
    lines.append("## 3. Top issue categories (systemic problems to fix first)")
    lines.append("")
    lines.append("| # | Category | Count | Zone |")
    lines.append("|---:|---|---:|:-:|")
    cat_to_zone = {}
    for a in audits:
        for i in a.issues:
            cat_to_zone.setdefault(i.category, i.zone)
    for rank, (cat, n) in enumerate(by_category.most_common(25), 1):
        lines.append(f"| {rank} | `{cat}` | {n} | {cat_to_zone.get(cat, '')} |")
    lines.append("")

    # ---- Per-pillar heatmap ----
    lines.append("## 4. Pillar heatmap")
    lines.append("")
    lines.append("| Pillar | Name | CRITICAL | MAJOR | MINOR |")
    lines.append("|---|---|---:|---:|---:|")
    for (pid, pname) in sorted(by_pillar_severity.keys()):
        c = by_pillar_severity[(pid, pname)]
        lines.append(f"| {pid} | {pname} | {c.get(CRITICAL,0)} | {c.get(MAJOR,0)} | {c.get(MINOR,0)} |")
    lines.append("")

    # ---- Per-module heatmap ----
    lines.append("## 5. Module heatmap (top offenders)")
    lines.append("")
    mod_sorted = sorted(by_module_severity.items(),
                        key=lambda kv: (-kv[1].get(CRITICAL, 0),
                                        -kv[1].get(MAJOR, 0),
                                        -kv[1].get(MINOR, 0)))
    lines.append("| Module | CRITICAL | MAJOR | MINOR | Top categories |")
    lines.append("|---|---:|---:|---:|---|")
    for mod, c in mod_sorted:
        top_cats = ", ".join(f"`{k}`×{v}" for k, v in
                             by_module_category[mod].most_common(3))
        lines.append(f"| {mod} | {c.get(CRITICAL,0)} | {c.get(MAJOR,0)} | {c.get(MINOR,0)} | {top_cats} |")
    lines.append("")

    # ---- Stubs: complete content gaps (no sections at all) ----
    lines.append(f"## 6. Complete stubs — no answer.sections at all ({len(stub_audits)})")
    lines.append("")
    lines.append("These questions exist with titles/metadata but have zero answer content. "
                 "They need full authoring, not editing.")
    lines.append("")
    if stub_audits:
        lines.append("| Module | Topic | Question |")
        lines.append("|---|---|---|")
        for a in sorted(stub_audits, key=lambda x: (x.module_slug, x.topic_slug, x.question_title)):
            lines.append(f"| {a.module_slug} | {a.topic_slug} | {a.question_title[:90]} |")
    lines.append("")

    # ---- Critical failures (non-stub) ----
    crit_written = [a for a in written_audits
                    if any(i.severity == CRITICAL for i in a.issues)]
    lines.append(f"## 7. Written answers with CRITICAL issues ({len(crit_written)})")
    lines.append("")
    lines.append("These have some content but are missing at least one whole zone, which "
                 "means the page renders without Quick Answer, Interview Answer, or Deep Dive.")
    lines.append("")
    if not crit_written:
        lines.append("_None._")
    else:
        lines.append("| Module | Topic | Question | Critical issues |")
        lines.append("|---|---|---|---|")
        for a in crit_written:
            ci = [i for i in a.issues if i.severity == CRITICAL]
            cats = ", ".join(f"`{i.category}`" for i in ci)
            lines.append(f"| {a.module_slug} | {a.topic_slug} | {a.question_title[:70]} | {cats} |")
    lines.append("")

    # ---- Full per-question appendix (collapsed per module) ----
    lines.append("## 8. Per-question findings (written answers only)")
    lines.append("")
    lines.append("_Issues grouped by module → topic → question. Empty questions omitted._")
    lines.append("")
    grouped: dict[str, dict[str, list[QuestionAudit]]] = defaultdict(lambda: defaultdict(list))
    for a in written_audits:
        if a.issues:
            grouped[a.module_slug][a.topic_slug].append(a)

    for mod in sorted(grouped.keys()):
        lines.append(f"### Module: `{mod}`")
        lines.append("")
        for topic in sorted(grouped[mod].keys()):
            lines.append(f"#### Topic: `{topic}`")
            lines.append("")
            for a in grouped[mod][topic]:
                lines.append(f"- **{a.question_title}** (`{a.question_slug}`) — "
                             f"{len([i for i in a.issues if i.severity==CRITICAL])} CRITICAL, "
                             f"{len([i for i in a.issues if i.severity==MAJOR])} MAJOR, "
                             f"{len([i for i in a.issues if i.severity==MINOR])} MINOR")
                for i in sorted(a.issues, key=lambda x: (
                        0 if x.severity == CRITICAL else 1 if x.severity == MAJOR else 2)):
                    loc = f" [{i.section_type}]" if i.section_type else ""
                    lines.append(f"  - **{i.severity}** · {i.zone} · `{i.category}`{loc} — {i.detail}")
            lines.append("")

    return "\n".join(lines)


def main():
    audits, topic_stats = audit_all()

    # Structured JSON (for downstream fix tooling)
    data_out = {
        "topic_stats": topic_stats,
        "questions": [
            {
                "pillar": a.pillar,
                "pillar_name": a.pillar_name,
                "module_slug": a.module_slug,
                "module_title": a.module_title,
                "topic_slug": a.topic_slug,
                "question_id": a.question_id,
                "question_slug": a.question_slug,
                "question_title": a.question_title,
                "word_totals": a.word_totals,
                "issues": [asdict(i) for i in a.issues],
            }
            for a in audits
        ],
    }
    (OUT_DIR / "jbi_audit_data.json").write_text(json.dumps(data_out, indent=2))

    # Markdown report
    md = render_report(audits, topic_stats)
    (OUT_DIR / "jbi_audit_report.md").write_text(md)

    # Console summary
    by_sev = Counter()
    for a in audits:
        for i in a.issues:
            by_sev[i.severity] += 1
    print(f"Questions audited: {len(audits)}")
    print(f"Total issues: {sum(by_sev.values())}")
    for sev in (CRITICAL, MAJOR, MINOR):
        print(f"  {sev}: {by_sev.get(sev, 0)}")
    print(f"Wrote: {OUT_DIR/'jbi_audit_report.md'}")
    print(f"Wrote: {OUT_DIR/'jbi_audit_data.json'}")


if __name__ == "__main__":
    main()
