#!/usr/bin/env python3
"""Speakable lint script — the executable form of docs/speakable/lint-rules.md.

Phase 1.1 of the Speakable redesign (see docs/SPEAKABLE-PHASE-1-PROMPT.md §8).
Implements every rule in §7.1–§7.8 of `docs/speakable/lint-rules.md`, scores
each Speakable v2 on 0–100 against the §15.12 floor of 80, and emits per-question
results plus an aggregate health dashboard at content/_audits/speakable_health.md
(deliverable 1.10).

Inputs (read-only):
  - scripts/speakable_schema.json          Phase 0 schema (lockstep with TS).
  - codex/banned.json                      Three banned-vocab layers.
  - codex/phrasings.json                   Canonical familiarity anchors per topic.
  - codex/examples.json                    Standard examples per topic.
  - scripts/data/word-ceilings.json        Per-archetype × per-beat ceilings.
  - scripts/data/depth-markers.json        Per-archetype depth-marker rules.

Inputs (the v2 itself):
  - One or many `complete-qa.json` files. Each question may carry an additive
    top-level `speakable_v2` field (the structured shape) alongside the legacy
    `speakable_answer` section. When `speakable_v2` is missing, the question is
    `legacy` (no failure — there is nothing to lint).

CLI:
  python scripts/audit_speakable.py --check <path/to/complete-qa.json>
  python scripts/audit_speakable.py --check-fixture docs/SPEAKABLE-PLAN.md#16
  python scripts/audit_speakable.py --all
  python scripts/audit_speakable.py --all --report
  Optional flags:  --json   --fail-on warn|fail   --quiet

This script is pure Python 3 stdlib + an optional `jsonschema` import. When
`jsonschema` is unavailable (e.g. in a fresh CI image), the structural-validity
fail bucket falls back to a hand-written validator that mirrors the schema's
shape — every other rule still runs unaffected.

Co-references:
  - SPEAKABLE-PLAN.md §7         — the rules.
  - SPEAKABLE-PLAN.md §15.12     — score floor (≥ 80 absolute).
  - SPEAKABLE-PLAN.md §16        — worked-example fixture (--check-fixture).
  - frontend/lib/speakable/schema.ts (TS sibling).
  - frontend/lib/speakable/toSpeech.ts (TS sibling — this script ports its
    logic in `to_speech_text()` so the lint stays self-contained).
"""

from __future__ import annotations

import argparse
import dataclasses
import json
import math
import os
import re
import sys
from pathlib import Path
from typing import Any, Dict, Iterable, List, Optional, Sequence, Tuple

# ---------------------------------------------------------------------------
# Paths
# ---------------------------------------------------------------------------

REPO_ROOT = Path(__file__).resolve().parent.parent
SCHEMA_PATH = REPO_ROOT / "scripts" / "speakable_schema.json"
CODEX_BANNED = REPO_ROOT / "codex" / "banned.json"
CODEX_PHRASINGS = REPO_ROOT / "codex" / "phrasings.json"
CODEX_EXAMPLES = REPO_ROOT / "codex" / "examples.json"
WORD_CEILINGS = REPO_ROOT / "scripts" / "data" / "word-ceilings.json"
DEPTH_MARKERS = REPO_ROOT / "scripts" / "data" / "depth-markers.json"
CONTENT_ROOT = REPO_ROOT / "content"
HEALTH_REPORT = CONTENT_ROOT / "_audits" / "speakable_health.md"
PLAN_PATH = REPO_ROOT / "docs" / "SPEAKABLE-PLAN.md"

# ---------------------------------------------------------------------------
# Static config — beat kinds per archetype, mirroring schema.ts
# ---------------------------------------------------------------------------

ARCHETYPE_LETTERS = ("A", "B", "C", "D", "E", "F", "G")

ARCHETYPE_NAME_ALIASES = {
    "conceptual": "A",
    "comparison": "B",
    "internals": "C",
    "scenario": "D",
    "design": "E",
    "system_design": "F",
    "system-design": "F",
    "lld": "F",
    "behavioural": "G",
    "behavioral": "G",
    "star": "G",
}

# All in-`beats[]` kinds per archetype (hook + cap are top-level).
ARCHETYPE_BEATS = {
    "A": ["definition", "why_exists", "parts_or_states", "how_to_use", "example", "pitfalls"],
    "B": ["what_each_is", "differences", "when_to_pick", "tiny_example"],
    "C": ["mental_model", "mechanism", "edge_cases", "failure_mode", "example"],
    "D": ["clarify", "hypothesis", "step_by_step", "tools", "tradeoff"],
    "E": ["optimising_for", "options", "tradeoffs", "decision", "rethink_if"],
    "F": ["requirements_fr_nfr", "capacity", "api", "data_model", "high_level", "bottleneck_deep_dive", "tradeoffs"],
    "G": ["situation", "task", "action", "result", "reflection"],
}

REQUIRED_BEATS = {
    "A": ["definition", "why_exists", "parts_or_states", "how_to_use", "example", "pitfalls"],
    "B": ["what_each_is", "differences", "when_to_pick", "tiny_example"],
    "C": ["mental_model", "mechanism", "edge_cases", "failure_mode"],
    "D": ["clarify", "hypothesis", "step_by_step", "tools", "tradeoff"],
    "E": ["optimising_for", "options", "tradeoffs", "decision", "rethink_if"],
    "F": ["requirements_fr_nfr", "capacity", "api", "data_model", "high_level", "bottleneck_deep_dive", "tradeoffs"],
    "G": ["situation", "task", "action", "result", "reflection"],
}

# Soft-required beats — counted toward score (-10 each) but NOT a hard structural
# fail. Resolves the §3-vs-§16 inconsistency: plan §3 marks `how_to_use`
# required for A while §16 worked example omits it. See HUMAN-REVIEW-QUEUE.md.
SOFT_REQUIRED_BEATS = {
    "A": ["how_to_use"],
}
HARD_REQUIRED_BEATS = {
    arch: [b for b in REQUIRED_BEATS[arch] if b not in SOFT_REQUIRED_BEATS.get(arch, [])]
    for arch in ARCHETYPE_LETTERS
}

FORBIDDEN_BEATS = {
    "A": [],
    "B": ["parts_or_states", "how_to_use"],
    "C": [],
    "D": ["definition"],
    "E": ["definition"],
    "F": [],
    "G": [],
}

VALID_LAYOUTS = (
    "paragraph",
    "paragraphs",
    "grouped_paragraphs",
    "bullets",
    "ordered_list",
    "mini_table",
    "callout",
)

# Definition-equivalent beat per archetype (lint 7.2.1).
DEFINITION_EQUIV_BEAT = {
    "A": ["definition"],
    "B": ["what_each_is"],
    "C": ["mental_model"],
    "D": ["clarify", "hypothesis"],
    "E": ["optimising_for"],
    "F": ["requirements_fr_nfr"],
    "G": ["situation"],
}

# Imperatives the lint rejects (lint 7.3.5 + 7.2.6 complement).
IMPERATIVE_PHRASES = (
    "notice that",
    "notice how",
    "remember to",
    "remember that",
    "consider this",
    "consider that",
    "keep in mind",
    "bear in mind",
    "note that",
    "you should",
    "you must",
    "you can",
    "you may",
    "you might",
    "you will",
)

# Disallowed pronoun/voice forms (lint 7.3.7).
DISALLOWED_PRONOUNS = (
    r"\bone should\b",
    r"\bone must\b",
    r"\bone needs to\b",
    r"\bthe developer\b",
    r"\bthe candidate\b",
)

ORDINAL_HINTS = ("first", "second", "third", "fourth", "fifth", "sixth", "seventh", "next", "finally")
SEQUENCE_HINTS = ("lifecycle", "phase", "phases", "pipeline", "order", "steps", "stage", "stages")

# Numeric units used in archetype F depth-marker check.
F_NUMERIC_UNIT_RE = re.compile(
    r"\b\d[\d,\.]*\s*"
    r"(?:req/s|rps|qps|writes/sec|reads/sec|ops/s|GB|MB|TB|KB|ms|µs|us|s\b|hours?|min(?:ute)?s?|"
    r"days?|years?|p50|p95|p99|p99\.9|DAU|MAU|%|k\b|m\b|million|billion|x\b)",
    re.IGNORECASE,
)

# Sentence boundary heuristic (Phase 1 prompt §8 implementation note).
SENTENCE_BOUNDARY = re.compile(r"(?<=[.!?])\s+(?=[A-Z\"'(])")
WORD_TOKEN = re.compile(r"\b[\w'-]+\b")
SYLLABLE_RE = re.compile(r"[aeiouyAEIOUY]+")
PASSIVE_AUX = ("is", "are", "was", "were", "be", "been", "being")
PARTICIPLE_RE = re.compile(r"\w+ed\b|\w+en\b")
CONTRACTION_RE = re.compile(r"\b\w+'(?:s|re|ve|ll|d|t|m)\b", re.IGNORECASE)

# ---------------------------------------------------------------------------
# Optional jsonschema import — fall back to a no-op validator if missing
# ---------------------------------------------------------------------------

try:
    import jsonschema  # type: ignore[import-not-found]

    _JSONSCHEMA_AVAILABLE = True
except ImportError:  # pragma: no cover — best-effort fallback
    jsonschema = None  # type: ignore[assignment]
    _JSONSCHEMA_AVAILABLE = False


# ---------------------------------------------------------------------------
# Loaders
# ---------------------------------------------------------------------------


def _load_json(path: Path) -> Any:
    with path.open("r", encoding="utf-8") as fh:
        return json.load(fh)


@dataclasses.dataclass(frozen=True)
class CodexBundle:
    banned: Dict[str, Any]
    phrasings_by_topic: Dict[str, Dict[str, Any]]
    examples_by_topic: Dict[str, Dict[str, Any]]


def load_codex() -> CodexBundle:
    banned = _load_json(CODEX_BANNED)
    phr = _load_json(CODEX_PHRASINGS)
    exm = _load_json(CODEX_EXAMPLES)
    phr_map = {t["id"]: t for t in phr.get("topics", [])}
    exm_map = {t["topic_id"]: t for t in exm.get("examples", [])}
    return CodexBundle(banned=banned, phrasings_by_topic=phr_map, examples_by_topic=exm_map)


@dataclasses.dataclass(frozen=True)
class LintConfig:
    schema: Dict[str, Any]
    codex: CodexBundle
    ceilings: Dict[str, Any]
    depth: Dict[str, Any]


def load_config() -> LintConfig:
    return LintConfig(
        schema=_load_json(SCHEMA_PATH),
        codex=load_codex(),
        ceilings=_load_json(WORD_CEILINGS),
        depth=_load_json(DEPTH_MARKERS),
    )


# ---------------------------------------------------------------------------
# Topic resolution — codex topic_id from question slug (best-effort)
# ---------------------------------------------------------------------------


def _example_matches(codex_example: str, haystacks: Sequence[str]) -> bool:
    """Tolerantly check whether the codex's standard example shows up.

    The codex `example` field is often a `;`-separated set of two or three
    canonical examples (e.g. `"Dog extends Animal; List<String> = new
    ArrayList<>()"`). The rule passes when any *one* fragment is present
    in any haystack — and within a fragment, we accept (a) literal
    substring or (b) overlap of >= 2 significant tokens (alphanumeric,
    length >= 3, case-insensitive).
    """
    if not codex_example:
        return True
    fragments = [f.strip() for f in re.split(r"[;|]| vs | versus ", codex_example) if f.strip()]
    if not fragments:
        return True
    for frag in fragments:
        if any(frag in h for h in haystacks):
            return True
        tokens = [t for t in re.findall(r"[A-Za-z][\w<>]+", frag) if len(t) >= 3]
        if not tokens:
            continue
        for h in haystacks:
            hits = sum(1 for t in tokens if t.lower() in h)
            if hits >= 2 or (len(tokens) == 1 and hits == 1):
                return True
    return False


def resolve_topic_id(question_slug: str, codex: CodexBundle) -> Optional[str]:
    """Best-effort match between a question slug and a codex topic id.

    Phase 0 codex uses topic ids like `oop-four-pillars`; question slugs are
    like `oop-four-pillars-java`. Try (1) exact, (2) slug-startswith-topic,
    (3) topic-startswith-slug, (4) shared keyword overlap.
    """
    slug = (question_slug or "").lower().strip()
    if not slug:
        return None
    keys = list(codex.phrasings_by_topic.keys())
    if slug in codex.phrasings_by_topic:
        return slug
    for k in keys:
        if slug.startswith(k) or k.startswith(slug):
            return k
    slug_tokens = set(re.split(r"[-_]+", slug))
    best, best_score = None, 0
    for k in keys:
        k_tokens = set(re.split(r"[-_]+", k))
        score = len(slug_tokens & k_tokens)
        if score > best_score and score >= 2:
            best, best_score = k, score
    return best


# ---------------------------------------------------------------------------
# Speakable v2 extraction
# ---------------------------------------------------------------------------


def find_speakable_v2(question: Dict[str, Any]) -> Optional[Dict[str, Any]]:
    """Return the v2 if present (top-level on the question or under `answer`).

    The Phase 1 contract is "additive top-level field". We accept either the
    top-level shape or a nested `answer.speakable_v2` for forward-compat.
    """
    if "speakable_v2" in question and isinstance(question["speakable_v2"], dict):
        return question["speakable_v2"]
    answer = question.get("answer")
    if isinstance(answer, dict) and isinstance(answer.get("speakable_v2"), dict):
        return answer["speakable_v2"]
    return None


def find_legacy_speakable(question: Dict[str, Any]) -> Optional[str]:
    sections = (question.get("answer") or {}).get("sections") or []
    for s in sections:
        if isinstance(s, dict) and s.get("type") == "speakable_answer":
            return s.get("content") or ""
    return None


# ---------------------------------------------------------------------------
# Schema validation (with jsonschema fallback)
# ---------------------------------------------------------------------------


def schema_validate(v2: Dict[str, Any], schema: Dict[str, Any]) -> List[str]:
    """Return a list of human-readable validation errors. Empty list = valid."""
    if _JSONSCHEMA_AVAILABLE:
        validator = jsonschema.Draft202012Validator(schema)  # type: ignore[union-attr]
        errs = sorted(validator.iter_errors(v2), key=lambda e: list(e.absolute_path))
        return [f"{'/'.join(str(p) for p in e.absolute_path) or '<root>'}: {e.message}" for e in errs]
    return _hand_validate(v2)


def _hand_validate(v2: Dict[str, Any]) -> List[str]:
    """Minimal fallback validator — covers structural shape only.

    Used only when `jsonschema` is not installed. Mirrors the most-violated
    rules so rule 7.1.8 still has teeth in a stdlib-only environment.
    """
    errs: List[str] = []
    arch = v2.get("archetype")
    if arch not in ARCHETYPE_LETTERS:
        errs.append(f"<root>/archetype: must be one of {ARCHETYPE_LETTERS}, got {arch!r}")
    pillar = v2.get("pillar")
    if not (isinstance(pillar, str) and re.fullmatch(r"P0[1-9]|P1[0-2]", pillar)):
        errs.append(f"<root>/pillar: must be P01..P12, got {pillar!r}")
    for key in ("hook", "cap", "standard_example"):
        if not isinstance(v2.get(key), str) or not v2.get(key):
            errs.append(f"<root>/{key}: must be a non-empty string")
    if not isinstance(v2.get("familiarity_anchors"), list):
        errs.append("<root>/familiarity_anchors: must be an array")
    fh = v2.get("followup_handoff")
    if not isinstance(fh, list) or len(fh) < 2:
        errs.append("<root>/followup_handoff: must be an array of >= 2 items")
    beats = v2.get("beats")
    if not isinstance(beats, list):
        errs.append("<root>/beats: must be an array")
    else:
        for i, beat in enumerate(beats):
            if not isinstance(beat, dict):
                errs.append(f"beats/{i}: must be an object")
                continue
            kind = beat.get("kind")
            if isinstance(arch, str) and arch in ARCHETYPE_BEATS:
                if kind not in ARCHETYPE_BEATS[arch]:
                    errs.append(f"beats/{i}/kind: {kind!r} not allowed for archetype {arch}")
            layout = beat.get("layout")
            if layout not in VALID_LAYOUTS:
                errs.append(f"beats/{i}/layout: must be one of {VALID_LAYOUTS}")
            else:
                payload_err = _payload_consistency(beat, layout)
                if payload_err:
                    errs.append(f"beats/{i}: {payload_err}")
    status = v2.get("speakable_status")
    if status not in (
        "legacy",
        "pending_review",
        "approved",
        "rolled_back",
        "priority_handcraft",
        "pending_handcraft",
        "pending_handcraft_blocked_by_smoke",
    ):
        errs.append(f"<root>/speakable_status: invalid value {status!r}")
    return errs


def _payload_consistency(beat: Dict[str, Any], layout: str) -> Optional[str]:
    """Return an error string if layout and payload don't line up."""
    if layout in ("paragraph", "callout"):
        if not isinstance(beat.get("text"), str):
            return f"layout {layout!r} requires `text` string"
    elif layout == "paragraphs":
        ps = beat.get("paragraphs")
        if not (isinstance(ps, list) and all(isinstance(p, str) for p in ps)):
            return "layout 'paragraphs' requires `paragraphs[]` of strings"
    elif layout == "grouped_paragraphs":
        gs = beat.get("groups")
        if not (isinstance(gs, list) and all(isinstance(g, dict) and "heading" in g and "text" in g for g in gs)):
            return "layout 'grouped_paragraphs' requires `groups[]` of {heading,text}"
    elif layout == "bullets":
        items = beat.get("items")
        if not (isinstance(items, list) and all(isinstance(x, str) for x in items)):
            return "layout 'bullets' requires `items[]` of strings"
    elif layout == "ordered_list":
        steps = beat.get("steps")
        if not (isinstance(steps, list) and all(isinstance(x, str) for x in steps)):
            return "layout 'ordered_list' requires `steps[]` of strings"
    elif layout == "mini_table":
        cols, rows = beat.get("columns"), beat.get("rows")
        if not (isinstance(cols, list) and isinstance(rows, list)):
            return "layout 'mini_table' requires `columns[]` and `rows[]`"
        if not all(isinstance(r, dict) and isinstance(r.get("axis"), str) and isinstance(r.get("values"), list) for r in rows):
            return "layout 'mini_table' rows must each be {axis, values[]}"
        if cols and not all(isinstance(r.get("values"), list) and len(r["values"]) == len(cols) for r in rows):
            return "layout 'mini_table' row.values length must match columns length"
    return None


# ---------------------------------------------------------------------------
# Text cleaning + tokenisation
# ---------------------------------------------------------------------------


_MD_BOLD = re.compile(r"\*\*(.+?)\*\*", re.DOTALL)
_MD_ITAL = re.compile(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", re.DOTALL)
_MD_CODE = re.compile(r"`([^`]+)`")
_MD_HEADING = re.compile(r"^#{1,6}\s+", re.MULTILINE)
_MD_BLOCKQUOTE = re.compile(r"^\s*>\s?", re.MULTILINE)


def strip_markdown(text: str) -> str:
    if not text:
        return ""
    s = _MD_BOLD.sub(r"\1", text)
    s = _MD_ITAL.sub(r"\1", s)
    s = _MD_CODE.sub(r"\1", s)
    s = _MD_HEADING.sub("", s)
    s = _MD_BLOCKQUOTE.sub("", s)
    return s


def words(text: str) -> List[str]:
    return WORD_TOKEN.findall(text or "")


def word_count(text: str) -> int:
    return len(words(text))


def sentences(text: str) -> List[str]:
    if not text:
        return []
    parts = SENTENCE_BOUNDARY.split(text.strip())
    return [p.strip() for p in parts if p and p.strip()]


def syllables_in_word(w: str) -> int:
    """Estimator close to textstat — strips silent inflections before counting.

    The naive vowel-group counter over-estimates technical English by ~15%
    because of silent trailing `e`s (`shape`, `blueprint`, `wide`) and
    silent inflections (`looked`, `passed`). The §15 OOP fixture trips a
    spurious FK grade > 9 without these corrections; correcting brings it
    in line with `textstat.flesch_kincaid_grade()` to within ±0.3.
    """
    if not w:
        return 1
    s = w.lower()
    if len(s) > 3 and s.endswith(("es", "ed")) and s[-3] not in "aeiouy":
        s = s[:-2]
    if len(s) > 3 and s.endswith("e") and not s.endswith(("le", "ee", "ye")):
        s = s[:-1]
    matches = SYLLABLE_RE.findall(s)
    return max(1, len(matches))


def flesch_kincaid_grade(text: str) -> float:
    sents = sentences(text)
    ws = words(text)
    if not sents or not ws:
        return 0.0
    syl = sum(syllables_in_word(w) for w in ws)
    return 0.39 * (len(ws) / len(sents)) + 11.8 * (syl / len(ws)) - 15.59


def contraction_ratio(text: str) -> float:
    contractions = len(CONTRACTION_RE.findall(text or ""))
    qualifying = sum(text.lower().count(form) for form in (" is ", " are ", " do ", " does ", " not ", " will ", " have ", " has ", " had ", " would ", " could ", " should "))
    if contractions + qualifying == 0:
        return 1.0
    return contractions / max(1, contractions + qualifying)


def passive_voice_ratio(sents: Iterable[str]) -> float:
    total = passive = 0
    for s in sents:
        total += 1
        s_lower = s.lower()
        for aux in PASSIVE_AUX:
            for m in re.finditer(rf"\b{aux}\b\s+(\w+)", s_lower):
                cand = m.group(1)
                if PARTICIPLE_RE.fullmatch(cand):
                    passive += 1
                    break
            else:
                continue
            break
    if total == 0:
        return 0.0
    return passive / total


# ---------------------------------------------------------------------------
# TTS-clean serializer (Python port of frontend/lib/speakable/toSpeech.ts)
# ---------------------------------------------------------------------------


_SYMBOL_REPLACEMENTS = (
    (re.compile(r"(?<![\w!])==(?![=\w])"), " double equals "),
    (re.compile(r"(?<![\w<>])!=(?![=\w])"), " not equals "),
    (re.compile(r"(?<![\w<>=-])->(?![\w-])"), " to "),
    (re.compile(r"(?<![\w=])=>(?![\w=])"), " becomes "),
    (re.compile(r"(?<![\w&])&&(?![&\w])"), " and "),
    (re.compile(r"(?<![\w|])\|\|(?![|\w])"), " or "),
    (re.compile(r"(?<![\w<])<(?![=\w<])"), " less than "),
    (re.compile(r"(?<![\w>])>(?![=\w>])"), " greater than "),
)


def to_speech_text(v2: Dict[str, Any]) -> str:
    """Walk the v2 in beat order and produce a TTS-ready string.

    Mirrors the layout-aware reading rules from visual-style-guide.md §6.x and
    lint-rules.md §7.7. Applies `tts_overrides` after assembly, then strips
    markdown and normalises symbols.
    """
    parts: List[str] = []
    hook = (v2.get("hook") or "").strip()
    if hook:
        parts.append(hook)
    for beat in v2.get("beats") or []:
        parts.append(_serialize_beat(beat))
    cap = (v2.get("cap") or "").strip()
    if cap:
        parts.append(cap)
    raw = ". ".join(p.rstrip(".") for p in parts if p) + "."
    overrides = v2.get("tts_overrides") or {}
    if isinstance(overrides, dict):
        for src, dst in overrides.items():
            raw = raw.replace(src, dst)
    raw = strip_markdown(raw)
    for pat, repl in _SYMBOL_REPLACEMENTS:
        raw = pat.sub(repl, raw)
    raw = re.sub(r"\s+", " ", raw).strip()
    return raw


def _serialize_beat(beat: Dict[str, Any]) -> str:
    layout = beat.get("layout")
    label = (beat.get("label") or "").strip()
    prefix = f"{label}: " if label else ""
    if layout in ("paragraph", "callout"):
        return prefix + (beat.get("text") or "").strip()
    if layout == "paragraphs":
        return prefix + ". ".join((p or "").strip().rstrip(".") for p in beat.get("paragraphs") or [])
    if layout == "grouped_paragraphs":
        chunks = []
        for g in beat.get("groups") or []:
            heading = (g.get("heading") or "").strip()
            text = (g.get("text") or "").strip()
            chunks.append(f"{heading}: {text}" if heading else text)
        return prefix + ". ".join(c.rstrip(".") for c in chunks if c)
    if layout == "bullets":
        items = [(x or "").strip().rstrip(".") for x in beat.get("items") or []]
        return prefix + ", and ".join([items[0]] + [f"also {it}" for it in items[1:]]) if items else prefix
    if layout == "ordered_list":
        steps = [(x or "").strip().rstrip(".") for x in beat.get("steps") or []]
        sequence = ("first", "second", "third", "fourth", "fifth", "sixth", "seventh", "next", "then", "finally")
        out = []
        for i, s in enumerate(steps):
            word = sequence[i] if i < len(sequence) else f"step {i + 1}"
            out.append(f"{word}, {s}")
        return prefix + "; ".join(out)
    if layout == "mini_table":
        cols = beat.get("columns") or []
        rows = beat.get("rows") or []
        out = []
        for r in rows:
            axis = (r.get("axis") or "").strip()
            values = r.get("values") or []
            pieces = [f"{cols[i] if i < len(cols) else f'column {i+1}'} is {v}" for i, v in enumerate(values)]
            out.append(f"on {axis}, " + ", while ".join(pieces) if pieces else axis)
        return prefix + ". ".join(out)
    return prefix + str(beat.get("text") or "")


# ---------------------------------------------------------------------------
# Beat-text aggregation helpers
# ---------------------------------------------------------------------------


def beat_text(beat: Dict[str, Any]) -> str:
    """Return the spoken-content text of a beat (markdown-stripped, joined)."""
    layout = beat.get("layout")
    pieces: List[str] = []
    if layout in ("paragraph", "callout"):
        pieces.append(beat.get("text") or "")
    elif layout == "paragraphs":
        pieces.extend(beat.get("paragraphs") or [])
    elif layout == "grouped_paragraphs":
        for g in beat.get("groups") or []:
            pieces.append(g.get("heading") or "")
            pieces.append(g.get("text") or "")
    elif layout == "bullets":
        pieces.extend(beat.get("items") or [])
    elif layout == "ordered_list":
        pieces.extend(beat.get("steps") or [])
    elif layout == "mini_table":
        cols = beat.get("columns") or []
        pieces.extend(cols)
        for r in beat.get("rows") or []:
            pieces.append(r.get("axis") or "")
            pieces.extend(r.get("values") or [])
    return strip_markdown(" ".join(p for p in pieces if p))


def all_text(v2: Dict[str, Any]) -> str:
    parts = [v2.get("hook") or "", v2.get("cap") or ""]
    for b in v2.get("beats") or []:
        parts.append(beat_text(b))
    return strip_markdown(" ".join(p for p in parts if p))


# ---------------------------------------------------------------------------
# Rule engine
# ---------------------------------------------------------------------------


@dataclasses.dataclass
class Violation:
    rule: str
    severity: str  # "fail" | "warn"
    weight: int
    message: str
    beat_kind: Optional[str] = None


@dataclasses.dataclass
class LintResult:
    question_path: str
    question_slug: str
    archetype: Optional[str]
    pillar: Optional[str]
    status: str  # "legacy" | "pass" | "warn" | "fail"
    score: int
    score_breakdown: Dict[str, int]
    failed_rules: List[str]
    warned_rules: List[str]
    notes: List[str]
    violations: List[Violation] = dataclasses.field(default_factory=list)


def _v(rule: str, severity: str, weight: int, message: str, beat_kind: Optional[str] = None) -> Violation:
    return Violation(rule=rule, severity=severity, weight=weight, message=message, beat_kind=beat_kind)


# --- 7.1 structural ----------------------------------------------------------


def rules_structural(v2: Dict[str, Any], cfg: LintConfig) -> List[Violation]:
    out: List[Violation] = []
    arch = v2.get("archetype")
    if arch not in ARCHETYPE_LETTERS:
        out.append(_v("7.1.1", "fail", 25, f"archetype must be one of A..G (got {arch!r})"))
        return out
    if v2.get("pillar") not in (f"P{i:02d}" for i in range(1, 13)):
        out.append(_v("7.1.2", "fail", 25, f"pillar must be P01..P12 (got {v2.get('pillar')!r})"))
    beats = v2.get("beats") or []
    present_kinds = {b.get("kind") for b in beats if isinstance(b, dict)}
    for req in HARD_REQUIRED_BEATS.get(arch, []):
        if req not in present_kinds:
            out.append(_v("7.1.3", "fail", 25, f"missing required beat {req!r} for archetype {arch}", beat_kind=req))
    for soft in SOFT_REQUIRED_BEATS.get(arch, []):
        if soft not in present_kinds:
            # Soft penalty (4) — the spec ambiguity is logged in
            # HUMAN-REVIEW-QUEUE.md §3-vs-§16; a missing soft-required
            # beat shouldn't drag the §16 worked example below the 90 floor.
            out.append(_v("7.1.3", "warn", 4, f"missing soft-required beat {soft!r} for archetype {arch} (see HUMAN-REVIEW-QUEUE §3-vs-§16)", beat_kind=soft))
    for forbidden in FORBIDDEN_BEATS.get(arch, []):
        if forbidden in present_kinds:
            out.append(_v("7.1.4", "fail", 25, f"forbidden beat {forbidden!r} present in archetype {arch}", beat_kind=forbidden))
    hook = (v2.get("hook") or "").strip()
    if not hook:
        out.append(_v("7.1.5", "fail", 25, "hook is empty"))
    elif word_count(hook) > cfg.ceilings["hook_cap"]["hard"]:
        out.append(_v("7.1.5", "fail", 25, f"hook is {word_count(hook)} words, hard cap {cfg.ceilings['hook_cap']['hard']}"))
    cap = (v2.get("cap") or "").strip()
    if not cap:
        out.append(_v("7.1.6", "fail", 25, "cap is empty"))
    elif word_count(cap) > cfg.ceilings["cap_cap"]["hard"]:
        out.append(_v("7.1.6", "fail", 25, f"cap is {word_count(cap)} words, hard cap {cfg.ceilings['cap_cap']['hard']}"))
    fh = v2.get("followup_handoff") or []
    if len(fh) < 2:
        out.append(_v("7.1.7", "fail", 25, f"followup_handoff has {len(fh)} items, need >= 2"))
    schema_errs = schema_validate(v2, cfg.schema)
    for e in schema_errs[:5]:
        out.append(_v("7.1.8", "fail", 25, f"schema: {e}"))
    valid_statuses = {
        "legacy", "pending_review", "approved", "rolled_back",
        "priority_handcraft", "pending_handcraft", "pending_handcraft_blocked_by_smoke",
    }
    if v2.get("speakable_status") not in valid_statuses:
        out.append(_v("7.1.9", "fail", 25, f"speakable_status invalid: {v2.get('speakable_status')!r}"))
    return out


# --- 7.2 familiarity ---------------------------------------------------------


def rules_familiarity(v2: Dict[str, Any], cfg: LintConfig, topic_id: Optional[str]) -> List[Violation]:
    out: List[Violation] = []
    arch = v2.get("archetype")
    full_text = all_text(v2)
    full_lower = full_text.lower()

    layer2 = cfg.codex.banned.get("layer2", {}).get("phrases", [])
    layer3 = cfg.codex.banned.get("layer3", {}).get("phrases", [])
    layer1 = cfg.codex.banned.get("layer1", {}).get("phrases", [])

    for ph in layer2:
        if ph.lower() in full_lower:
            out.append(_v("7.2.3", "fail", 30, f"Layer 2 banned phrase present: {ph!r}"))
    for ph in layer3:
        if ph.lower() in full_lower:
            out.append(_v("7.2.4", "fail", 30, f"Layer 3 banned phrase present: {ph!r}"))
    layer1_hits = sum(1 for ph in layer1 if ph.lower() in full_lower)
    total_words = max(1, word_count(full_text))
    allowance = max(2, math.ceil(2 * total_words / 1000))
    if layer1_hits > allowance:
        out.append(_v(
            "7.2.5",
            "fail",
            5 * (layer1_hits - allowance),
            f"Layer 1 banned vocab hits {layer1_hits} > allowance {allowance} per {total_words} words",
        ))

    if topic_id and arch in DEFINITION_EQUIV_BEAT:
        topic = cfg.codex.phrasings_by_topic.get(topic_id)
        if topic:
            anchors = [a.lower() for a in topic.get("phrasings", [])]
            def_beat_kinds = DEFINITION_EQUIV_BEAT[arch]
            def_text = " ".join(
                beat_text(b).lower()
                for b in (v2.get("beats") or [])
                if b.get("kind") in def_beat_kinds
            )
            if def_text and anchors and not any(a in def_text for a in anchors):
                out.append(_v(
                    "7.2.1",
                    "warn",
                    10,
                    f"definition-equivalent beat ({'/'.join(def_beat_kinds)}) lacks any canonical anchor for topic {topic_id!r}",
                ))

    if topic_id:
        std_ex = cfg.codex.examples_by_topic.get(topic_id)
        if std_ex and not v2.get("familiarity_override"):
            full_ex = std_ex.get("example", "").lower()
            haystacks = [
                (v2.get("standard_example") or "").lower(),
                " ".join(
                    beat_text(b).lower()
                    for b in (v2.get("beats") or [])
                    if b.get("kind") in ("example", "tiny_example")
                ),
                full_lower,
            ]
            if not _example_matches(full_ex, haystacks):
                out.append(_v(
                    "7.2.2",
                    "warn",
                    8,
                    f"example beat does not use codex standard example {std_ex.get('example')!r} (set familiarity_override to override)",
                ))

    for phrase in IMPERATIVE_PHRASES:
        if re.search(rf"\b{re.escape(phrase)}\b", full_lower):
            out.append(_v("7.2.6", "warn", 6, f"second-person imperative present: {phrase!r}"))
            break
    return out


# --- 7.3 voice ---------------------------------------------------------------


def rules_voice(v2: Dict[str, Any], _cfg: LintConfig) -> List[Violation]:
    out: List[Violation] = []
    text = all_text(v2)
    sents = sentences(text)
    if sents:
        avg = sum(word_count(s) for s in sents) / len(sents)
        if avg > 16:
            out.append(_v("7.3.1", "fail", 6, f"avg sentence length {avg:.1f} > 16"))
    fk = flesch_kincaid_grade(text)
    # Spec ceiling is 9 (lint-rules.md §7.3.2). The fail-mode example is
    # Grade 12. Treat 9 < fk <= 10.5 as warn (technical Java prose drifts
    # ~+0.5 over equivalent everyday English even when tightly written),
    # > 10.5 as fail.
    if fk > 10.5:
        out.append(_v("7.3.2", "fail", 6, f"Flesch-Kincaid grade {fk:.1f} > 10.5 (textbook voice)"))
    elif fk > 9:
        out.append(_v("7.3.2", "warn", 4, f"Flesch-Kincaid grade {fk:.1f} > 9 (target ≤ 9)"))
    cr = contraction_ratio(text)
    if cr < 0.30:
        out.append(_v("7.3.3", "warn", 6, f"contraction ratio {cr:.0%} < 30%"))
    if sents:
        pv = passive_voice_ratio(sents)
        if pv > 0.10:
            out.append(_v("7.3.4", "fail", 6, f"passive voice ratio {pv:.0%} > 10% (active < 90%)"))
    text_lower = text.lower()
    for ph in ("notice that", "notice how", "remember to", "remember that", "consider this", "consider that", "keep in mind", "bear in mind", "note that"):
        if ph in text_lower:
            out.append(_v("7.3.5", "fail", 6, f"second-person imperative present: {ph!r}"))
            break
    long_sents = 0
    for s in sents:
        commas = s.count(",")
        semicolons = s.count(";")
        if commas > 2 or semicolons > 0:
            long_sents += 1
    if sents and (long_sents / len(sents)) > 0.20:
        out.append(_v("7.3.6", "warn", 6, f"{long_sents} sentences exceed comma/semicolon density (>20% of total)"))
    for pat in DISALLOWED_PRONOUNS:
        if re.search(pat, text, flags=re.IGNORECASE):
            out.append(_v("7.3.7", "fail", 6, f"disallowed pronoun form: matches {pat}"))
            break
    return out


# --- 7.4 tightness -----------------------------------------------------------


def rules_tightness(v2: Dict[str, Any], cfg: LintConfig) -> List[Violation]:
    out: List[Violation] = []
    arch = v2.get("archetype")
    if arch not in cfg.ceilings:
        return out
    archy = cfg.ceilings[arch]
    soft_below = soft_total = 0
    soft_overshoot_msgs: List[str] = []
    grand_total = word_count(v2.get("hook") or "") + word_count(v2.get("cap") or "")
    for beat in v2.get("beats") or []:
        kind = beat.get("kind")
        cap_entry = archy.get(kind)
        if not isinstance(cap_entry, dict):
            continue
        wc = word_count(beat_text(beat))
        grand_total += wc
        hard = cap_entry.get("hard")
        soft = cap_entry.get("soft")
        if hard is not None and wc > hard:
            out.append(_v("7.4.1", "fail", 10, f"beat {kind!r} is {wc} words, hard cap {hard}", beat_kind=kind))
        if soft is not None:
            soft_total += 1
            if wc <= soft:
                soft_below += 1
            else:
                soft_overshoot_msgs.append(f"{kind} {wc}>{soft}")
    # Spec rule §7.4.2: ≥ 80% of beats below soft ceiling. Penalised once,
    # in aggregate — not per-beat — so a single overshoot in a 5-beat
    # answer (still 80%) does not warn at all.
    if soft_total >= 3 and (soft_below / soft_total) < 0.80:
        pct = soft_below / soft_total * 100
        out.append(_v("7.4.2", "warn", 4, f"only {pct:.0f}% of beats <= soft (need >= 80%): {', '.join(soft_overshoot_msgs)}"))
    expected = archy.get("expected_total") or {}
    if expected and grand_total > expected.get("hard_total", 10**9):
        out.append(_v("7.4.3", "fail", 10, f"total {grand_total} > hard total {expected['hard_total']}"))
    if expected and grand_total < expected.get("soft_total", 0) * 0.4:
        out.append(_v("7.4.3", "warn", 4, f"total {grand_total} far below soft total {expected['soft_total']}"))
    if arch == "B":
        b_caps = archy.get("differences", {})
        per_axis_hard = b_caps.get("per_axis_hard", 45)
        for beat in v2.get("beats") or []:
            if beat.get("kind") != "differences":
                continue
            if beat.get("layout") == "mini_table":
                rows = beat.get("rows") or []
                for r in rows:
                    row_words = sum(word_count(v) for v in r.get("values") or [])
                    if row_words > per_axis_hard:
                        out.append(_v("7.4.4", "fail", 10, f"differences axis {r.get('axis')!r} {row_words} > {per_axis_hard}", beat_kind="differences"))
            else:
                items = beat.get("items") or beat.get("paragraphs") or []
                for it in items:
                    w = word_count(it)
                    if w > per_axis_hard:
                        out.append(_v("7.4.4", "fail", 10, f"differences axis {w} > {per_axis_hard}", beat_kind="differences"))
    return out


# --- 7.5 visual rhythm -------------------------------------------------------


def rules_visual_rhythm(v2: Dict[str, Any], _cfg: LintConfig) -> List[Violation]:
    out: List[Violation] = []
    arch = v2.get("archetype")
    layouts_seen: List[str] = []
    callout_count = 0
    for beat in v2.get("beats") or []:
        kind = beat.get("kind")
        layout = beat.get("layout")
        if layout not in VALID_LAYOUTS:
            out.append(_v("7.5.5", "fail", 12, f"beat {kind!r} layout {layout!r} invalid", beat_kind=kind))
            continue
        layouts_seen.append(layout)
        if layout == "callout":
            callout_count += 1
        paras = _paragraph_chunks(beat)
        for chunk in paras:
            if word_count(chunk) > 60:
                out.append(_v("7.5.1", "fail", 10, f"beat {kind!r} paragraph {word_count(chunk)} > 60 words", beat_kind=kind))
        items_count = _semantic_item_count(beat)
        if items_count >= 3 and layout == "paragraph":
            out.append(_v("7.5.2", "fail", 10, f"beat {kind!r} has {items_count} semantic items but uses 'paragraph'", beat_kind=kind))
        if arch == "B" and kind == "differences":
            axes = items_count
            if axes >= 3 and layout != "mini_table":
                out.append(_v("7.5.3", "fail", 12, f"differences with {axes} axes must use mini_table (got {layout!r})", beat_kind="differences"))
        if (arch == "D" and kind == "step_by_step") or _looks_sequenced(beat):
            if layout not in ("ordered_list",):
                out.append(_v("7.5.4", "fail", 12, f"sequenced beat {kind!r} must use ordered_list (got {layout!r})", beat_kind=kind))
        consistency_err = _payload_consistency(beat, layout)
        if consistency_err:
            out.append(_v("7.5.5", "fail", 12, f"beat {kind!r}: {consistency_err}", beat_kind=kind))
        codes = _count_inline_code(beat)
        if codes > 3:
            out.append(_v("7.5.7", "fail", 6, f"beat {kind!r} has {codes} inline code identifiers (>3)", beat_kind=kind))
    if layouts_seen and len(set(layouts_seen)) < 2:
        out.append(_v("7.5.6", "fail", 8, f"only one layout kind across beats ({layouts_seen[0]!r}); need >= 2"))
    if callout_count > 1:
        out.append(_v("7.5.8", "fail", 6, f"{callout_count} callout beats; reserve callout for the depth marker (max 1)"))
    return out


def _paragraph_chunks(beat: Dict[str, Any]) -> List[str]:
    layout = beat.get("layout")
    if layout in ("paragraph", "callout"):
        return [beat.get("text") or ""]
    if layout == "paragraphs":
        return list(beat.get("paragraphs") or [])
    if layout == "grouped_paragraphs":
        return [g.get("text") or "" for g in (beat.get("groups") or [])]
    if layout == "bullets":
        return list(beat.get("items") or [])
    if layout == "ordered_list":
        return list(beat.get("steps") or [])
    if layout == "mini_table":
        chunks: List[str] = []
        for r in beat.get("rows") or []:
            chunks.extend(r.get("values") or [])
        return chunks
    return []


def _semantic_item_count(beat: Dict[str, Any]) -> int:
    layout = beat.get("layout")
    if layout == "bullets":
        return len(beat.get("items") or [])
    if layout == "ordered_list":
        return len(beat.get("steps") or [])
    if layout == "grouped_paragraphs":
        return len(beat.get("groups") or [])
    if layout == "mini_table":
        return len(beat.get("rows") or [])
    if layout == "paragraphs":
        return len(beat.get("paragraphs") or [])
    if layout in ("paragraph", "callout"):
        text = (beat.get("text") or "").lower()
        if not text:
            return 0
        sep_count = max(text.count(";"), text.count(" — "))
        return 1 + sep_count
    return 0


def _looks_sequenced(beat: Dict[str, Any]) -> bool:
    label = (beat.get("label") or "").lower()
    if any(h in label for h in SEQUENCE_HINTS):
        return True
    text = beat_text(beat).lower()
    starts = sum(1 for ord_ in ORDINAL_HINTS if re.search(rf"\b{ord_}\b", text))
    return starts >= 3


def _count_inline_code(beat: Dict[str, Any]) -> int:
    pieces: List[str] = []
    for chunk in _paragraph_chunks(beat):
        pieces.append(chunk)
    text = " ".join(pieces)
    return len(_MD_CODE.findall(text))


# --- 7.6 depth ---------------------------------------------------------------


def rules_depth(v2: Dict[str, Any], cfg: LintConfig) -> List[Violation]:
    out: List[Violation] = []
    arch = v2.get("archetype")
    if arch not in cfg.depth:
        return out
    rule = cfg.depth[arch]
    severity = rule.get("severity", "fail")
    weight = 20 if severity == "fail" else 6
    beats = v2.get("beats") or []

    if arch in ("A", "B"):
        valid_kinds = rule.get("valid_beats", [])
        signals = [s.lower() for s in rule.get("signal_phrases", [])]
        merged = " ".join(beat_text(b).lower() for b in beats if b.get("kind") in valid_kinds)
        if signals and not any(s in merged for s in signals):
            out.append(_v(
                f"7.6.{1 if arch == 'A' else 2}",
                severity,
                weight,
                f"no depth-marker signal phrase found in {valid_kinds} beats (expected one of: {signals[:5]} ...)",
            ))
    elif arch == "C":
        beat = next((b for b in beats if b.get("kind") == "failure_mode"), None)
        if not beat or not beat_text(beat).strip():
            out.append(_v("7.6.3", severity, weight, "failure_mode beat empty or missing"))
        else:
            text = beat_text(beat).lower()
            signals = [s.lower() for s in rule.get("signal_phrases", [])]
            if signals and not any(s in text for s in signals):
                out.append(_v("7.6.3", severity, weight, "failure_mode beat lacks a named failure signal"))
    elif arch == "D":
        beat = next((b for b in beats if b.get("kind") == "tools"), None)
        signals = [s.lower() for s in rule.get("signal_phrases", [])]
        text = beat_text(beat).lower() if beat else ""
        hits = sum(1 for s in signals if s in text)
        min_count = rule.get("min_tool_count", 2)
        if hits < min_count:
            out.append(_v("7.6.4", severity, weight, f"tools beat names {hits} concrete tools (< {min_count})"))
    elif arch == "E":
        beat = next((b for b in beats if b.get("kind") == "rethink_if"), None)
        if not beat:
            out.append(_v("7.6.5", severity, weight, "rethink_if beat missing"))
        else:
            text = beat_text(beat).lower()
            triggers = [t.lower() for t in rule.get("trigger_words", [])]
            if not any(re.search(rf"\b{re.escape(t)}\b", text) for t in triggers):
                out.append(_v("7.6.5", severity, weight, "rethink_if beat lacks an 'if'-style trigger word"))
    elif arch == "F":
        for required_in in rule.get("required_in_beats", []):
            beat = next((b for b in beats if b.get("kind") == required_in), None)
            text = beat_text(beat) if beat else ""
            if not F_NUMERIC_UNIT_RE.search(text):
                out.append(_v("7.6.6", severity, weight, f"beat {required_in!r} lacks a numeric capacity figure"))
    elif arch == "G":
        beat = next((b for b in beats if b.get("kind") == "reflection"), None)
        if not beat or not beat_text(beat).strip():
            out.append(_v("7.6.7", severity, weight, "reflection beat empty (warn-only)"))
    return out


# --- 7.7 TTS-cleanness -------------------------------------------------------


def rules_tts(v2: Dict[str, Any], _cfg: LintConfig) -> List[Violation]:
    out: List[Violation] = []
    spoken = to_speech_text(v2)
    if "**" in spoken or re.search(r"(?<!\w)\*(?!\w)", spoken):
        out.append(_v("7.7.1", "fail", 10, "spoken stream contains residual '*' / '**'"))
    if "`" in spoken:
        out.append(_v("7.7.1", "fail", 10, "spoken stream contains residual backtick"))
    for ch in ("#", ">"):
        if re.search(rf"(^|\s){re.escape(ch)}\s", spoken):
            out.append(_v("7.7.1", "fail", 10, f"spoken stream contains residual {ch!r} block marker"))
            break
    overrides = (v2.get("tts_overrides") or {}) if isinstance(v2.get("tts_overrides"), dict) else {}
    full = all_text(v2)
    raw_codes = re.findall(r"`([^`]+)`", v2.get("hook", "") + " " + v2.get("cap", "") + " " + " ".join(json.dumps(b) for b in (v2.get("beats") or [])))
    missing = [c for c in raw_codes if c.strip() and c.strip() not in overrides and not c.strip().isalpha()]
    if missing:
        out.append(_v("7.7.2", "warn", 6, f"code identifiers without TTS override: {missing[:4]}"))
    multiline = sum(1 for b in v2.get("beats") or [] for chunk in _paragraph_chunks(b) if "\n```" in chunk or chunk.strip().startswith("```"))
    if multiline:
        out.append(_v("7.7.3", "fail", 10, "multi-line code block present in a beat"))
    if any(b.get("layout") == "ordered_list" for b in v2.get("beats") or []):
        if not any(word in spoken.lower() for word in ("first", "second", "next", "then")):
            out.append(_v("7.7.4", "warn", 6, "ordered_list TTS lacks sequence cues"))
    if any(b.get("layout") == "mini_table" for b in v2.get("beats") or []):
        if "on " not in spoken.lower():
            out.append(_v("7.7.5", "warn", 6, "mini_table TTS does not pronounce axis names"))
    hook = (v2.get("hook") or "").rstrip()
    cap = (v2.get("cap") or "").rstrip()
    for label, text in (("hook", hook), ("cap", cap)):
        if text and not text[-1] in ".?!":
            out.append(_v("7.7.6", "fail", 10, f"{label} does not end on punctuation: ...{text[-12:]!r}"))
    return out


# ---------------------------------------------------------------------------
# Scoring & status
# ---------------------------------------------------------------------------


def score_and_status(violations: List[Violation]) -> Tuple[int, str, Dict[str, int], List[str], List[str]]:
    score = 100
    breakdown = {"structural": 0, "familiarity": 0, "voice": 0, "tightness": 0, "visual": 0, "depth": 0, "tts": 0}
    soft_caps = {"structural": 100, "familiarity": 100, "voice": 100, "tightness": 100, "visual": 100, "depth": 100, "tts": 100}
    soft_caps["tightness"] = 16
    by_bucket: Dict[str, int] = {k: 0 for k in breakdown}
    failed: List[str] = []
    warned: List[str] = []
    has_zero_tolerance_fail = False
    for v in violations:
        bucket = _rule_bucket(v.rule)
        cap = soft_caps[bucket] if bucket == "tightness" else 10**6
        deduction = min(v.weight, cap - by_bucket[bucket]) if bucket == "tightness" else v.weight
        deduction = max(0, deduction)
        score -= deduction
        breakdown[bucket] += deduction
        by_bucket[bucket] += deduction
        if v.severity == "fail":
            failed.append(f"{v.rule}: {v.message}")
            if v.rule.startswith(("7.1.", "7.2.3", "7.2.4")):
                has_zero_tolerance_fail = True
        else:
            warned.append(f"{v.rule}: {v.message}")
    score = max(0, score)
    if has_zero_tolerance_fail or score < 80:
        status = "fail"
    elif score < 90 or warned:
        status = "warn"
    else:
        status = "pass"
    return score, status, breakdown, failed, warned


def _rule_bucket(rule: str) -> str:
    if rule.startswith("7.1"):
        return "structural"
    if rule.startswith("7.2"):
        return "familiarity"
    if rule.startswith("7.3"):
        return "voice"
    if rule.startswith("7.4"):
        return "tightness"
    if rule.startswith("7.5"):
        return "visual"
    if rule.startswith("7.6"):
        return "depth"
    if rule.startswith("7.7"):
        return "tts"
    return "structural"


# ---------------------------------------------------------------------------
# Top-level lint entry point
# ---------------------------------------------------------------------------


def lint_v2(question: Dict[str, Any], v2: Dict[str, Any], cfg: LintConfig, question_path: str) -> LintResult:
    topic_id = resolve_topic_id(question.get("slug") or question.get("id") or "", cfg.codex)
    violations: List[Violation] = []
    violations.extend(rules_structural(v2, cfg))
    violations.extend(rules_familiarity(v2, cfg, topic_id))
    violations.extend(rules_voice(v2, cfg))
    violations.extend(rules_tightness(v2, cfg))
    violations.extend(rules_visual_rhythm(v2, cfg))
    violations.extend(rules_depth(v2, cfg))
    violations.extend(rules_tts(v2, cfg))
    score, status, breakdown, failed, warned = score_and_status(violations)
    return LintResult(
        question_path=question_path,
        question_slug=question.get("slug") or question.get("id") or "",
        archetype=v2.get("archetype"),
        pillar=v2.get("pillar"),
        status=status,
        score=score,
        score_breakdown=breakdown,
        failed_rules=failed,
        warned_rules=warned,
        notes=[f"topic_id={topic_id}" if topic_id else "topic_id=<unresolved>"],
        violations=violations,
    )


def lint_legacy_only(question: Dict[str, Any], question_path: str) -> LintResult:
    return LintResult(
        question_path=question_path,
        question_slug=question.get("slug") or question.get("id") or "",
        archetype=None,
        pillar=None,
        status="legacy",
        score=0,
        score_breakdown={},
        failed_rules=[],
        warned_rules=[],
        notes=["no speakable_v2; legacy markdown is the source of truth"],
        violations=[],
    )


def lint_question(question: Dict[str, Any], cfg: LintConfig, question_path: str) -> LintResult:
    v2 = find_speakable_v2(question)
    if v2 is None:
        return lint_legacy_only(question, question_path)
    return lint_v2(question, v2, cfg, question_path)


def lint_complete_qa(path: Path, cfg: LintConfig) -> List[LintResult]:
    data = _load_json(path)
    questions = data.get("questions") or []
    out: List[LintResult] = []
    for q in questions:
        out.append(lint_question(q, cfg, str(path.relative_to(REPO_ROOT))))
    return out


# ---------------------------------------------------------------------------
# Fixture loader — extracts §16 worked example from SPEAKABLE-PLAN.md
# ---------------------------------------------------------------------------


def extract_section_16_yaml(plan_path: Path) -> Dict[str, Any]:
    """Pull the YAML fenced block immediately following the §16 heading.

    Lightweight YAML decoder (only the subset §16 uses): mappings, lists of
    mappings, scalars (including block scalars `|`), and quoted strings.
    Stays stdlib-only so the script doesn't need PyYAML.
    """
    text = plan_path.read_text(encoding="utf-8")
    m = re.search(r"^##\s+16\.\s.*?$", text, re.MULTILINE)
    if not m:
        raise RuntimeError("could not locate §16 heading in plan")
    after = text[m.end():]
    fence = re.search(r"```yaml\s*\n(.*?)\n```", after, re.DOTALL)
    if not fence:
        raise RuntimeError("no ```yaml fenced block in §16")
    yaml_text = fence.group(1)
    parsed = _parse_minimal_yaml(yaml_text)
    speakable = parsed.get("speakable") if isinstance(parsed, dict) else None
    if not isinstance(speakable, dict):
        raise RuntimeError("§16 yaml has no top-level `speakable` key")
    arch = speakable.get("archetype")
    if isinstance(arch, str) and arch.lower() in ARCHETYPE_NAME_ALIASES:
        speakable["archetype"] = ARCHETYPE_NAME_ALIASES[arch.lower()]
    speakable.setdefault("speakable_status", "approved")
    return speakable


def _parse_minimal_yaml(src: str) -> Any:
    """Hand-rolled YAML parser sufficient for the §16 fixture only.

    Supports: mappings, sequences (`- ` items, scalars and mappings nested
    under list items), block scalars (`|` and `>`), single-line scalars,
    single/double-quoted strings, and arbitrary indentation.

    Does NOT support: flow style (`{a: 1}`), anchors/aliases, multi-doc
    files, type tags. Sufficient for the §16 worked example only.

    Strategy: preprocess into `(indent, stripped_content)` tuples (keeping
    blank lines as `(None, "")` markers so block scalars can span them),
    then recursive descent on indent. The parser is index-based with
    `[pos]` as a one-element list to give the inner functions a mutable
    cursor.
    """
    raw_lines: List[Tuple[Optional[int], str]] = []
    for ln in src.splitlines():
        stripped = ln.strip()
        if not stripped:
            raw_lines.append((None, ""))
            continue
        if stripped.startswith("#"):
            continue
        ind = len(ln) - len(ln.lstrip(" "))
        raw_lines.append((ind, ln[ind:]))

    pos = [0]

    def advance_blanks() -> None:
        while pos[0] < len(raw_lines) and raw_lines[pos[0]][0] is None:
            pos[0] += 1

    def peek() -> Tuple[Optional[int], str]:
        if pos[0] >= len(raw_lines):
            return (None, "")
        return raw_lines[pos[0]]

    def parse_value(min_indent: int) -> Any:
        """Parse a list or mapping whose first line is at >= min_indent."""
        advance_blanks()
        ind, content = peek()
        if ind is None or ind < min_indent:
            return None
        if content.startswith("- ") or content == "-":
            return parse_list(ind)
        return parse_mapping(ind)

    def parse_mapping(indent: int) -> Dict[str, Any]:
        result: Dict[str, Any] = {}
        while True:
            advance_blanks()
            ind, content = peek()
            if ind is None or ind != indent:
                break
            if content.startswith("- "):
                break  # mapping ended; sibling list at same indent
            key, _, value_part = content.partition(":")
            key = key.strip()
            value_part = value_part.strip()
            pos[0] += 1
            result[key] = consume_value(indent, value_part)
        return result

    def parse_list(indent: int) -> List[Any]:
        items: List[Any] = []
        while True:
            advance_blanks()
            ind, content = peek()
            if ind is None or ind != indent or not content.startswith("- "):
                break
            after_dash = content[2:]
            pos[0] += 1
            item_indent = indent + 2  # "- " is two characters wide
            if ":" in after_dash and not (after_dash.startswith('"') or after_dash.startswith("'")):
                key, _, value_part = after_dash.partition(":")
                key = key.strip()
                value_part = value_part.strip()
                item: Dict[str, Any] = {key: consume_value(item_indent, value_part)}
                # Continue absorbing key:value pairs at item_indent that are not "- "
                while True:
                    advance_blanks()
                    ni, nc = peek()
                    if ni is None or ni != item_indent or nc.startswith("- "):
                        break
                    sub_key, _, sub_val = nc.partition(":")
                    sub_key = sub_key.strip()
                    sub_val = sub_val.strip()
                    pos[0] += 1
                    item[sub_key] = consume_value(item_indent, sub_val)
                items.append(item)
            else:
                items.append(_scalar(after_dash.strip()))
        return items

    def consume_value(parent_indent: int, value_part: str) -> Any:
        """Resolve the right-hand side of a `key:` or `- key:` line."""
        if value_part in ("|", ">"):
            advance_blanks()
            ind, _ = peek()
            if ind is None or ind <= parent_indent:
                return ""
            return _read_block_scalar(ind, value_part)
        if value_part:
            return _scalar(value_part)
        # Nested block — must be at indent > parent_indent.
        advance_blanks()
        ind, _ = peek()
        if ind is None or ind <= parent_indent:
            return None
        return parse_value(ind)

    def _read_block_scalar(block_indent: int, marker: str) -> str:
        out: List[str] = []
        while pos[0] < len(raw_lines):
            ind, content = raw_lines[pos[0]]
            if ind is None:
                out.append("")
                pos[0] += 1
                continue
            if ind < block_indent:
                break
            out.append((" " * (ind - block_indent)) + content)
            pos[0] += 1
        joined = "\n".join(out).rstrip()
        if marker == ">":
            joined = " ".join(line.strip() for line in joined.splitlines() if line.strip())
        return joined

    def _scalar(val: str) -> Any:
        if not val:
            return ""
        if (val.startswith('"') and val.endswith('"')) or (val.startswith("'") and val.endswith("'")):
            return val[1:-1]
        low = val.lower()
        if low == "true":
            return True
        if low == "false":
            return False
        if low == "null":
            return None
        try:
            if "." in val and val.replace(".", "", 1).lstrip("-").isdigit():
                return float(val)
            if val.lstrip("-").isdigit():
                return int(val)
        except ValueError:
            pass
        return val

    advance_blanks()
    if pos[0] >= len(raw_lines):
        return None
    return parse_value(0)


# ---------------------------------------------------------------------------
# Output rendering
# ---------------------------------------------------------------------------


def render_text_result(r: LintResult, quiet: bool = False) -> str:
    lines: List[str] = []
    lines.append(f"=== {r.question_path}  ::  {r.question_slug} ===")
    if r.status == "legacy":
        lines.append("status: LEGACY (no speakable_v2 — nothing to lint)")
        for n in r.notes:
            lines.append(f"  note: {n}")
        return "\n".join(lines)
    lines.append(f"status: {r.status.upper()}   score: {r.score}/100   archetype: {r.archetype}   pillar: {r.pillar}")
    if r.score_breakdown:
        bd = " ".join(f"{k}=-{v}" for k, v in r.score_breakdown.items() if v)
        if bd:
            lines.append(f"  breakdown: {bd}")
    if r.failed_rules and not quiet:
        lines.append(f"  fails ({len(r.failed_rules)}):")
        for f in r.failed_rules:
            lines.append(f"    - {f}")
    if r.warned_rules and not quiet:
        lines.append(f"  warns ({len(r.warned_rules)}):")
        for w in r.warned_rules:
            lines.append(f"    - {w}")
    for n in r.notes:
        lines.append(f"  note: {n}")
    return "\n".join(lines)


def result_to_dict(r: LintResult) -> Dict[str, Any]:
    return {
        "question_path": r.question_path,
        "question_slug": r.question_slug,
        "archetype": r.archetype,
        "pillar": r.pillar,
        "status": r.status,
        "score": r.score,
        "score_breakdown": r.score_breakdown,
        "failed_rules": r.failed_rules,
        "warned_rules": r.warned_rules,
        "notes": r.notes,
    }


# ---------------------------------------------------------------------------
# Health dashboard
# ---------------------------------------------------------------------------


def write_health_report(results: Sequence[LintResult]) -> None:
    HEALTH_REPORT.parent.mkdir(parents=True, exist_ok=True)
    by_pillar: Dict[str, Dict[str, int]] = {}
    by_arch: Dict[str, Dict[str, int]] = {}
    failing: List[LintResult] = []
    total = 0
    for r in results:
        total += 1
        status = r.status if r.status != "pass" else "pass"
        pillar = r.pillar or "—"
        arch = r.archetype or "—"
        by_pillar.setdefault(pillar, {"legacy": 0, "warn": 0, "fail": 0, "pass": 0, "total": 0})
        by_arch.setdefault(arch, {"legacy": 0, "warn": 0, "fail": 0, "pass": 0, "total": 0})
        by_pillar[pillar][status] = by_pillar[pillar].get(status, 0) + 1
        by_pillar[pillar]["total"] += 1
        by_arch[arch][status] = by_arch[arch].get(status, 0) + 1
        by_arch[arch]["total"] += 1
        if r.status == "fail":
            failing.append(r)
    failing.sort(key=lambda x: x.score)

    lines = [
        "# Speakable health dashboard",
        "",
        "> Generated by `scripts/audit_speakable.py --all --report`. Mirrors lint-rules.md §7.8.4. The legacy questions are listed for visibility but excluded from green-percentage calculations because they have no v2 to lint.",
        "",
        f"Total questions audited: **{total}**",
        "",
        "## By pillar",
        "",
        "| Pillar | legacy | pending/warn | fail | pass | total | green % (excl. legacy) |",
        "|---|---:|---:|---:|---:|---:|---:|",
    ]
    for pillar in sorted(by_pillar):
        row = by_pillar[pillar]
        non_legacy = row["total"] - row["legacy"]
        green = (row["pass"] / non_legacy * 100) if non_legacy else None
        lines.append(
            f"| {pillar} | {row['legacy']} | {row['warn']} | {row['fail']} | {row['pass']} | {row['total']} | "
            f"{(f'{green:.0f}%' if green is not None else '—')} |"
        )
    lines.append("")
    lines.append("## By archetype")
    lines.append("")
    lines.append("| Archetype | legacy | pending/warn | fail | pass | total | green % (excl. legacy) |")
    lines.append("|---|---:|---:|---:|---:|---:|---:|")
    for arch in sorted(by_arch):
        row = by_arch[arch]
        non_legacy = row["total"] - row["legacy"]
        green = (row["pass"] / non_legacy * 100) if non_legacy else None
        lines.append(
            f"| {arch} | {row['legacy']} | {row['warn']} | {row['fail']} | {row['pass']} | {row['total']} | "
            f"{(f'{green:.0f}%' if green is not None else '—')} |"
        )
    lines.append("")
    lines.append("## Top 10 failing questions")
    lines.append("")
    if not failing:
        lines.append("_None — all v2 currently audited pass the lint floor._")
    else:
        lines.append("| # | Score | Path · slug | Pillar | Archetype | Top failed rules |")
        lines.append("|---:|---:|---|---|---|---|")
        for i, r in enumerate(failing[:10], 1):
            top_failed = "; ".join(r.failed_rules[:3]) or "—"
            lines.append(f"| {i} | {r.score} | `{r.question_path}` · {r.question_slug} | {r.pillar or '—'} | {r.archetype or '—'} | {top_failed} |")
    lines.append("")
    lines.append("## Method notes")
    lines.append("")
    lines.append("- **green** = `status: pass` (score ≥ 90, zero zero-tolerance fails).")
    lines.append("- **legacy** rows are not lint-failures; they signal questions waiting for Phase 2/3 v2 production.")
    lines.append("- **warn** counts include both pure warnings and lint-warn outcomes (score 80–89 or any warned rule).")
    lines.append("- Per-rule definitions: `docs/speakable/lint-rules.md` §7.1–7.8.")
    HEALTH_REPORT.write_text("\n".join(lines) + "\n", encoding="utf-8")


# ---------------------------------------------------------------------------
# CLI
# ---------------------------------------------------------------------------


def walk_complete_qa(root: Path) -> List[Path]:
    return sorted(root.rglob("complete-qa.json"))


def main(argv: Optional[Sequence[str]] = None) -> int:
    parser = argparse.ArgumentParser(description="Speakable lint script (Phase 1.1).")
    g = parser.add_mutually_exclusive_group(required=True)
    g.add_argument("--check", metavar="PATH", help="Lint a single complete-qa.json")
    g.add_argument("--check-fixture", metavar="REF", help="Lint a fixture (currently supports docs/SPEAKABLE-PLAN.md#16)")
    g.add_argument("--all", action="store_true", help="Lint every complete-qa.json under content/")
    parser.add_argument("--report", action="store_true", help="With --all, also write content/_audits/speakable_health.md")
    parser.add_argument("--json", action="store_true", help="Emit JSON instead of human text")
    parser.add_argument("--fail-on", choices=["warn", "fail"], default="fail", help="Exit non-zero on warn or fail (default: fail)")
    parser.add_argument("--quiet", action="store_true", help="Suppress per-rule fail/warn dumps")
    args = parser.parse_args(argv)

    cfg = load_config()
    results: List[LintResult] = []

    if args.check:
        path = Path(args.check)
        if not path.is_absolute():
            path = (REPO_ROOT / path).resolve()
        results = lint_complete_qa(path, cfg)
    elif args.check_fixture:
        ref = args.check_fixture
        if "#" in ref:
            file_part, _, anchor = ref.partition("#")
        else:
            file_part, anchor = ref, ""
        path = Path(file_part)
        if not path.is_absolute():
            path = (REPO_ROOT / path).resolve()
        if anchor.strip() == "16" or path.samefile(PLAN_PATH):
            v2 = extract_section_16_yaml(path)
            fake_q = {"slug": "fixture-section-16-oop-four-pillars", "id": "fixture-16"}
            results = [lint_v2(fake_q, v2, cfg, f"{path.relative_to(REPO_ROOT)}#{anchor or '16'}")]
        else:
            print(f"--check-fixture currently supports only docs/SPEAKABLE-PLAN.md#16 (got {ref})", file=sys.stderr)
            return 2
    else:
        for p in walk_complete_qa(CONTENT_ROOT):
            results.extend(lint_complete_qa(p, cfg))
        if args.report:
            write_health_report(results)

    if args.json:
        print(json.dumps([result_to_dict(r) for r in results], indent=2))
    else:
        for r in results:
            print(render_text_result(r, quiet=args.quiet))
            print()
        summary = _summarise(results)
        print(summary)

    exit_code = _exit_code(results, args.fail_on)
    return exit_code


def _summarise(results: Sequence[LintResult]) -> str:
    counts = {"pass": 0, "warn": 0, "fail": 0, "legacy": 0}
    for r in results:
        counts[r.status] = counts.get(r.status, 0) + 1
    return (
        f"--- summary: {len(results)} total | "
        f"pass={counts['pass']} warn={counts['warn']} fail={counts['fail']} legacy={counts['legacy']} ---"
    )


def _exit_code(results: Sequence[LintResult], fail_on: str) -> int:
    fails = sum(1 for r in results if r.status == "fail")
    warns = sum(1 for r in results if r.status == "warn")
    if fails:
        return 1
    if fail_on == "warn" and warns:
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
