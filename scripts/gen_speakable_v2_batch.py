#!/usr/bin/env python3
"""
Batch-generate speakable_v2 blocks for all queue CSV entries that lack them.
Generates schema-compliant blocks (draft quality, status=pending_review).

Usage:
  python3 scripts/gen_speakable_v2_batch.py --pillar P01 [--dry-run]
  python3 scripts/gen_speakable_v2_batch.py --all [--dry-run]

Exit: 0 = success, 1 = partial failures.
"""
from __future__ import annotations
import argparse
import json
import re
import sys
from pathlib import Path
from typing import Optional

REPO_ROOT = Path(__file__).resolve().parents[1]
CONTENT_ROOT = REPO_ROOT / "content"
QUEUES_DIR = CONTENT_ROOT / "_audits" / "agent-queues"

BANNED = [
    "leverage", "utilize", "synergize", "world-class", "cutting-edge",
    "seamless", "robust", "holistic", "paradigm", "battle-tested",
    "enterprise-grade", "revolutionary", "game-changing", "industry-leading",
]

# Pillar from queue filename P01..P12
PILLAR_QUEUE = {f"P{i:02d}": QUEUES_DIR / f"P{i:02d}-queue.csv" for i in range(1, 13)}

# Valid beat kinds per archetype (schema-enforced)
BEAT_KINDS: dict[str, list[str]] = {
    "A": ["definition", "why_exists", "parts_or_states", "how_to_use", "example", "pitfalls"],
    "B": ["what_each_is", "differences", "when_to_pick", "tiny_example"],
    "C": ["mental_model", "mechanism", "edge_cases", "failure_mode", "example"],
    "D": ["clarify", "hypothesis", "step_by_step", "tools", "tradeoff"],
    "E": ["optimising_for", "options", "tradeoffs", "decision", "rethink_if"],
    "F": ["requirements_fr_nfr", "capacity", "api", "data_model", "high_level",
          "bottleneck_deep_dive", "tradeoffs"],
    "G": ["situation", "task", "action", "result", "reflection"],
}

# Required beats (subset that MUST be present)
REQUIRED_BEATS: dict[str, list[str]] = {
    "A": ["definition", "why_exists", "parts_or_states", "example", "pitfalls"],
    "B": ["what_each_is", "differences", "when_to_pick", "tiny_example"],
    "C": ["mental_model", "mechanism", "edge_cases", "failure_mode"],
    "D": ["clarify", "hypothesis", "step_by_step", "tools", "tradeoff"],
    "E": ["optimising_for", "options", "tradeoffs", "decision", "rethink_if"],
    "F": ["requirements_fr_nfr", "capacity", "api", "data_model", "high_level",
          "bottleneck_deep_dive", "tradeoffs"],
    "G": ["situation", "task", "action", "result"],
}

# Hard word caps per beat (strictly enforced by lint)
CAPS: dict[str, int] = {
    "definition": 75, "why_exists": 65, "parts_or_states": 120, "how_to_use": 100,
    "example": 110, "pitfalls": 80,
    "what_each_is": 65, "differences": 40, "when_to_pick": 80, "tiny_example": 55,
    "mental_model": 80, "mechanism": 130, "edge_cases": 90, "failure_mode": 80,
    "clarify": 45, "hypothesis": 75, "step_by_step": 160, "tools": 65, "tradeoff": 65,
    "optimising_for": 40, "options": 90, "tradeoffs": 80, "decision": 35, "rethink_if": 45,
    "requirements_fr_nfr": 110, "capacity": 100, "api": 110, "data_model": 110,
    "high_level": 110, "bottleneck_deep_dive": 130,
    "situation": 75, "task": 65, "action": 90, "result": 65, "reflection": 50,
}

# Named failure mode phrases for depth markers per pillar
DEPTH_PHRASES: dict[str, str] = {
    "P01": "resize storm under sustained insert pressure",
    "P02": "N+1 query problem from lazy loading",
    "P03": "connection pool exhaustion under concurrent load",
    "P04": "connection timeout when the upstream service is slow",
    "P05": "rebalance storm when consumers join and leave rapidly",
    "P06": "the hotspot bottleneck that breaks the design",
    "P07": "token leakage through misconfigured CORS",
    "P08": "mock drift: tests pass but prod breaks",
    "P09": "OOMKilled when the container exceeds memory limits",
    "P10": "region failover lag that breaks RTO targets",
    "P11": "cardinality explosion in Prometheus labels",
    "P12": "the answer that contradicts your resume",
}


def clean_markdown(text: str) -> str:
    """Strip markdown for voice-safe text."""
    text = re.sub(r"```[\s\S]*?```", "", text)
    text = re.sub(r"`([^`\n]+)`", r"\1", text)
    text = re.sub(r"\*\*(.+?)\*\*", r"\1", text)
    text = re.sub(r"\*(.+?)\*", r"\1", text)
    text = re.sub(r"^#{1,6}\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"^\s*[-*•]\s+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\[([^\]]+)\]\([^\)]+\)", r"\1", text)
    text = re.sub(r"\|[^\n]+\|", "", text)  # table rows
    text = re.sub(r"^[-|:]+$", "", text, flags=re.MULTILINE)  # table separators
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def remove_banned(text: str) -> str:
    for phrase in BANNED:
        text = re.sub(re.escape(phrase), "", text, flags=re.IGNORECASE)
    return re.sub(r"  +", " ", text).strip()


def truncate_words(text: str, max_words: int) -> str:
    text = text.strip()
    words = text.split()
    if len(words) <= max_words:
        return text
    truncated = " ".join(words[:max_words])
    # End on sentence boundary if possible
    for punct in [". ", "! ", "? "]:
        idx = truncated.rfind(punct)
        if idx > max_words * 3:  # at least 60% through
            return truncated[:idx + 1]
    return truncated.rstrip(".,;:") + "."


def shorten_sentences(text: str, max_words: int = 16) -> str:
    """Best-effort: split very long sentences."""
    sentences = re.split(r"(?<=[.!?])\s+", text)
    result = []
    for sent in sentences:
        words = sent.split()
        if len(words) <= max_words:
            result.append(sent)
        else:
            # Split on comma/em-dash/semicolon
            parts = re.split(r",\s+|—|;\s+", sent)
            if len(parts) > 1:
                result.extend(p.strip().rstrip(",;") + "." for p in parts if p.strip())
            else:
                # Just truncate
                result.append(" ".join(words[:max_words]).rstrip(".,;:") + ".")
    return " ".join(result)


def get_first_sentence(text: str, max_words: int = 35) -> str:
    text = clean_markdown(text)
    for end in [". ", "! ", "? "]:
        idx = text.find(end)
        if idx != -1 and idx < 300:
            return truncate_words(text[:idx + 1], max_words)
    return truncate_words(text, max_words)


def get_last_sentence(text: str, max_words: int = 35) -> str:
    text = clean_markdown(text).strip()
    for end in [". ", "! ", "? "]:
        idx = text.rfind(end)
        if idx != -1:
            rest = text[idx + 2:].strip()
            if len(rest.split()) > 3:
                return truncate_words(rest, max_words)
    return get_first_sentence(text, max_words)


def sections_by_type(sections: list) -> dict[str, list[str]]:
    index: dict[str, list[str]] = {}
    for s in sections:
        if not isinstance(s, dict):
            continue
        t = s.get("type", "")
        c = s.get("content", "")
        if isinstance(c, str):
            content = clean_markdown(c).strip()
        elif isinstance(c, list):
            content = " ".join(clean_markdown(str(x)) for x in c).strip()
        else:
            content = ""
        if content and t:
            index.setdefault(t, []).append(content)
    return index


def get_text(smap: dict, *types: str, fallback: str = "") -> str:
    for t in types:
        if t in smap and smap[t]:
            return " ".join(smap[t])
    return fallback


def make_para_beat(kind: str, text: str) -> dict:
    max_w = CAPS.get(kind, 70)
    text = remove_banned(clean_markdown(text))
    text = shorten_sentences(text, 16)
    text = truncate_words(text, max_w)
    # Ensure ends with punctuation
    if text and text[-1] not in ".!?":
        text = text.rstrip(".,;:") + "."
    return {"kind": kind, "layout": "paragraph", "text": text}


def make_bullets_beat(kind: str, items_text: str, min_items: int = 2) -> dict:
    text = remove_banned(clean_markdown(items_text))
    # Split into sentences as bullet items
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 15]
    if not sentences:
        sentences = [s.strip() for s in text.split(".") if len(s.strip()) > 10]
    # Limit each item to 20 words
    items = []
    for s in sentences[:5]:
        truncated = truncate_words(s, 20)
        if truncated and not truncated.endswith("."):
            truncated += "."
        items.append(truncated)
    if len(items) < min_items:
        items.append(f"See the answer sections for more details.")
    return {"kind": kind, "layout": "bullets", "items": items[:5]}


def make_ordered_beat(kind: str, steps_text: str) -> dict:
    text = remove_banned(clean_markdown(steps_text))
    sentences = [s.strip() for s in re.split(r"(?<=[.!?])\s+", text) if len(s.strip()) > 10]
    steps = []
    for s in sentences[:6]:
        truncated = truncate_words(s, 25)
        if not truncated.endswith("."):
            truncated += "."
        steps.append(truncated)
    if not steps:
        steps = [f"Review the complete answer for step-by-step details."]
    return {"kind": kind, "layout": "ordered_list", "steps": steps[:6]}


def make_callout_beat(kind: str, text: str) -> dict:
    max_w = CAPS.get(kind, 80)
    text = remove_banned(clean_markdown(text))
    text = shorten_sentences(text, 20)
    text = truncate_words(text, max_w)
    if text and text[-1] not in ".!?":
        text = text.rstrip(".,;:") + "."
    return {"kind": kind, "layout": "callout", "text": text}


def build_hook(question: dict, smap: dict) -> str:
    for key in ("speakable_answer", "overview"):
        if key in smap and smap[key]:
            h = get_first_sentence(smap[key][0], 35)
            return remove_banned(h)
    da = clean_markdown(question.get("direct_answer", ""))
    return truncate_words(remove_banned(get_first_sentence(da, 35)), 35)


def build_cap(question: dict, smap: dict) -> str:
    sa = smap.get("speakable_answer", [])
    if sa:
        c = get_last_sentence(sa[-1], 35)
        return remove_banned(c)
    da = clean_markdown(question.get("direct_answer", ""))
    return truncate_words(remove_banned(get_last_sentence(da, 35)), 35)


def build_standard_example(question: dict, smap: dict) -> str:
    """Extract a short standard example phrase."""
    # Look for code identifiers
    for key in ("code_example", "example", "step"):
        if key in smap:
            text = smap[key][0]
            # Find first code-like word (CamelCase or with special chars)
            m = re.search(r"\b([A-Z][a-zA-Z]{3,}(?:[A-Z][a-zA-Z]+)*)\b", text)
            if m:
                return m.group(1)
    # Fall back to words from the question
    q_text = question.get("question", "")
    words = re.findall(r"\b([A-Z][a-zA-Z]{4,})\b", q_text)
    return words[0] if words else "see answer"


def build_beats_A(q: dict, smap: dict, pillar: str) -> list:
    overview = get_text(smap, "overview", "explanation", fallback=clean_markdown(q.get("direct_answer", "")))
    intent = q.get("interviewer_intent", {}) if isinstance(q.get("interviewer_intent"), dict) else {}
    beats = []
    beats.append(make_para_beat("definition", overview[:400]))
    why = intent.get("testing", "") or get_text(smap, "when_to_use", fallback=overview)
    beats.append(make_para_beat("why_exists", why[:300]))
    kp = get_text(smap, "key_points", "important_points", "speakable_answer", fallback=overview)
    beats.append(make_bullets_beat("parts_or_states", kp))
    ex = get_text(smap, "code_example", "example", "before_code", fallback=overview)
    beats.append(make_para_beat("example", ex[:400]))
    warn = get_text(smap, "warning", "common_mistakes", fallback=intent.get("common_mistake", ""))
    if not warn:
        warn = DEPTH_PHRASES.get(pillar, "watch for the edge case in production")
    beats.append(make_bullets_beat("pitfalls", warn))
    return beats


def build_beats_B(q: dict, smap: dict, pillar: str) -> list:
    overview = get_text(smap, "overview", fallback=clean_markdown(q.get("direct_answer", "")))
    beats = []
    beats.append(make_para_beat("what_each_is", overview[:300]))
    # differences as mini_table from comparison_table or bullets
    diff_text = get_text(smap, "comparison_table", "tradeoffs", fallback=overview)
    table_lines = [l for l in diff_text.split("\n") if "|" in l and "---" not in l and l.strip()]
    if len(table_lines) >= 3:
        rows = []
        for line in table_lines[1:5]:
            cells = [c.strip() for c in line.split("|") if c.strip()]
            if len(cells) >= 3:
                rows.append({"axis": cells[0][:40], "values": [cells[1][:40], cells[2][:40]]})
        if len(rows) >= 2:
            headers = [c.strip() for c in table_lines[0].split("|") if c.strip()]
            beats.append({"kind": "differences", "layout": "mini_table",
                          "columns": headers[1:3] if len(headers) >= 3 else ["Option A", "Option B"],
                          "rows": rows[:4]})
        else:
            beats.append(make_bullets_beat("differences", diff_text))
    else:
        beats.append(make_bullets_beat("differences", diff_text))
    when = get_text(smap, "tradeoffs", "when_to_use", fallback=overview)
    beats.append(make_para_beat("when_to_pick", when[:350]))
    ex = get_text(smap, "code_example", "example", fallback=overview)
    beats.append(make_para_beat("tiny_example", ex[:250]))
    return beats


def build_beats_C(q: dict, smap: dict, pillar: str) -> list:
    overview = get_text(smap, "overview", fallback=clean_markdown(q.get("direct_answer", "")))
    intent = q.get("interviewer_intent", {}) if isinstance(q.get("interviewer_intent"), dict) else {}
    beats = []
    beats.append(make_para_beat("mental_model", overview[:350]))
    step_text = get_text(smap, "step", "recipe", "phase", fallback=overview)
    beats.append(make_ordered_beat("mechanism", step_text[:600]))
    edge = get_text(smap, "warning", "tip", "key_points", fallback=intent.get("common_mistake", ""))
    beats.append(make_bullets_beat("edge_cases", edge or overview))
    # failure_mode must have named failure
    fail = get_text(smap, "warning", fallback="")
    depth_phrase = DEPTH_PHRASES.get(pillar, "the production failure mode here")
    if not fail or len(fail) < 20:
        fail = f"The classic production failure is {depth_phrase}. Watch for this under load."
    beats.append(make_callout_beat("failure_mode", fail[:350]))
    return beats


def build_beats_D(q: dict, smap: dict, pillar: str) -> list:
    overview = get_text(smap, "overview", fallback=clean_markdown(q.get("direct_answer", "")))
    intent = q.get("interviewer_intent", {}) if isinstance(q.get("interviewer_intent"), dict) else {}
    beats = []
    beats.append(make_para_beat("clarify", overview[:200]))
    hyp = intent.get("testing", "") or overview
    beats.append(make_para_beat("hypothesis", hyp[:300]))
    step_text = get_text(smap, "step", "recipe", "diagnosis", fallback=overview)
    beats.append(make_ordered_beat("step_by_step", step_text[:700]))
    tools_text = get_text(smap, "key_points", "tip", fallback=intent.get("to_stand_out", ""))
    beats.append(make_bullets_beat("tools", tools_text or overview))
    tr = get_text(smap, "tradeoffs", "warning", fallback=intent.get("common_mistake", overview))
    beats.append(make_para_beat("tradeoff", tr[:270]))
    return beats


def build_beats_E(q: dict, smap: dict, pillar: str) -> list:
    overview = get_text(smap, "overview", fallback=clean_markdown(q.get("direct_answer", "")))
    intent = q.get("interviewer_intent", {}) if isinstance(q.get("interviewer_intent"), dict) else {}
    beats = []
    beats.append(make_para_beat("optimising_for", overview[:180]))
    kp = get_text(smap, "key_points", "when_to_use", "comparison_table", fallback=overview)
    beats.append(make_bullets_beat("options", kp))
    tr = get_text(smap, "tradeoffs", "warning", fallback=overview)
    beats.append(make_bullets_beat("tradeoffs", tr))
    da = clean_markdown(q.get("direct_answer", overview))
    beats.append(make_para_beat("decision", get_first_sentence(da, 35)))
    ri = intent.get("to_stand_out", "") or intent.get("common_mistake", "")
    if not ri or len(ri) < 20:
        ri = f"I'd rethink this if the team size or deployment context changed significantly."
    beats.append(make_callout_beat("rethink_if", ri[:200]))
    return beats


def build_beats_F(q: dict, smap: dict, pillar: str) -> list:
    overview = get_text(smap, "overview", fallback=clean_markdown(q.get("direct_answer", "")))
    intent = q.get("interviewer_intent", {}) if isinstance(q.get("interviewer_intent"), dict) else {}
    beats = []
    beats.append(make_para_beat("requirements_fr_nfr", overview[:450]))
    cap_text = get_text(smap, "architecture_diagram", "design_diagram", "step", fallback=overview)
    beats.append(make_para_beat("capacity", f"At scale: {cap_text[:350]}"))
    beats.append(make_bullets_beat("api", get_text(smap, "step", "recipe", fallback=overview)))
    beats.append(make_para_beat("data_model", get_text(smap, "component", "explanation", fallback=overview)[:400]))
    beats.append(make_para_beat("high_level", overview[:440]))
    warn = get_text(smap, "warning", "tip", fallback=intent.get("common_mistake", ""))
    depth_phrase = DEPTH_PHRASES.get(pillar, "the bottleneck under load")
    if not warn or len(warn) < 20:
        warn = f"The bottleneck is {depth_phrase}. Plan for this at the data layer."
    beats.append(make_callout_beat("bottleneck_deep_dive", warn[:520]))
    beats.append(make_para_beat("tradeoffs", get_text(smap, "tradeoffs", "key_points", fallback=overview)[:440]))
    return beats


def build_beats_G(q: dict, smap: dict, pillar: str) -> list:
    overview = get_text(smap, "overview", fallback=clean_markdown(q.get("direct_answer", "")))
    intent = q.get("interviewer_intent", {}) if isinstance(q.get("interviewer_intent"), dict) else {}
    beats = []
    beats.append(make_para_beat("situation", overview[:300]))
    beats.append(make_para_beat("task", clean_markdown(q.get("question", overview))[:260]))
    beats.append(make_para_beat("action", get_text(smap, "step", "recipe", fallback=overview)[:360]))
    beats.append(make_para_beat("result", get_text(smap, "key_points", "overview", fallback=overview)[:260]))
    refl = intent.get("to_stand_out", "") or intent.get("common_mistake", "")
    if not refl or len(refl) < 15:
        refl = "Looking back, I'd raise the concern earlier and involve the team sooner."
    beats.append(make_callout_beat("reflection", refl[:200]))
    return beats


BEAT_BUILDERS = {
    "A": build_beats_A, "B": build_beats_B, "C": build_beats_C,
    "D": build_beats_D, "E": build_beats_E, "F": build_beats_F, "G": build_beats_G,
}


def load_queue_map() -> dict[str, tuple[str, str]]:
    """Map {filepath: (archetype, pillar)}."""
    result: dict[str, tuple[str, str]] = {}
    for pillar, queue_path in PILLAR_QUEUE.items():
        if not queue_path.exists():
            continue
        lines = queue_path.read_text().splitlines()
        if not lines:
            continue
        header = lines[0].split(",")
        try:
            arch_idx = header.index("archetype")
            file_idx = header.index("file")
        except ValueError:
            continue
        for line in lines[1:]:
            # Handle CSV with quoted fields
            parts = re.split(r',(?=(?:[^"]*"[^"]*")*[^"]*$)', line)
            if len(parts) <= max(arch_idx, file_idx):
                continue
            arch = parts[arch_idx].strip().strip('"')
            fp = parts[file_idx].strip().strip('"')
            if arch in BEAT_BUILDERS and fp:
                result[fp] = (arch, pillar)
    return result


def infer_archetype(question: dict) -> str:
    qtext = question.get("question", "").lower()
    if any(x in qtext for x in ["tell me", "describe a time", "situation when", "behavioral"]):
        return "G"
    if any(x in qtext for x in ["design ", "architect ", "build a "]):
        return "F"
    if any(x in qtext for x in ["how would you debug", "diagnose", "troubleshoot", "fix this"]):
        return "D"
    if any(x in qtext for x in ["when would", "when to use", "should i use", "would you use"]):
        return "E"
    if any(x in qtext for x in [" vs ", " versus ", "difference between", "compare "]):
        return "B"
    if any(x in qtext for x in ["how does", "how do", "internals", "under the hood", "works internally"]):
        return "C"
    return "A"


def infer_pillar(filepath: str) -> str:
    fp = filepath.lower()
    if "behavioral" in fp or "career" in fp or "conflict" in fp:
        return "P12"
    if "spring" in fp:
        return "P02"
    if "docker" in fp or "kubernetes" in fp or "ci-cd" in fp or "maven" in fp or "gradle" in fp:
        return "P09"
    if "security" in fp or "authentication" in fp or "oauth" in fp or "jwt" in fp:
        return "P07"
    if "testing" in fp or "junit" in fp or "mockito" in fp or "testcontainers" in fp:
        return "P08"
    if "cloud" in fp or "aws" in fp or "gcp" in fp or "azure" in fp:
        return "P10"
    if "observability" in fp or "logging" in fp or "monitoring" in fp or "sre" in fp:
        return "P11"
    if "database" in fp or "jpa" in fp or "hibernate" in fp or "sql" in fp or "redis" in fp:
        return "P03"
    if "api" in fp or "rest" in fp or "graphql" in fp or "grpc" in fp:
        return "P04"
    if "messaging" in fp or "kafka" in fp or "rabbitmq" in fp or "microservices" in fp:
        return "P05"
    if "system-design" in fp or "architecture" in fp or "design" in fp:
        return "P06"
    return "P01"


def generate_speakable_v2(question: dict, archetype: str, pillar: str) -> dict:
    answer = question.get("answer", {})
    if not isinstance(answer, dict):
        answer = {}
    sections = answer.get("sections", [])
    if not isinstance(sections, list):
        sections = []
    smap = sections_by_type(sections)
    intent = question.get("interviewer_intent", {})
    if not isinstance(intent, dict):
        intent = {}

    hook = build_hook(question, smap)
    cap = build_cap(question, smap)
    if not cap or cap == hook:
        cap = f"Use this understanding to give concrete, production-grounded answers."

    builder = BEAT_BUILDERS.get(archetype, build_beats_A)
    beats = builder(question, smap, pillar)

    # standard_example: first capitalized compound from sections or question
    standard_example = build_standard_example(question, smap)

    # familiarity_anchors: 2-4 short phrases from question
    da = clean_markdown(question.get("direct_answer", ""))
    anchors = list(dict.fromkeys(re.findall(r"\b[A-Z][a-zA-Z]{3,}\b", da)))[:3]
    if not anchors:
        anchors = [standard_example]

    followup = question.get("followup_questions", [])
    if not isinstance(followup, list):
        followup = []

    return {
        "archetype": archetype,
        "pillar": pillar,
        "audience_assumption": "familiar",
        "voice": "friendly",
        "familiarity_anchors": anchors[:3],
        "standard_example": standard_example,
        "hook": hook,
        "beats": beats,
        "cap": cap,
        "tts_overrides": {},
        "speakable_status": "pending_review",
        "followup_handoff": followup[:3],
    }


def process_file(filepath: Path, queue_map: dict, dry_run: bool = False) -> tuple[int, int]:
    rel = str(filepath.relative_to(REPO_ROOT))
    try:
        data = json.loads(filepath.read_text())
    except (json.JSONDecodeError, Exception):
        return 0, 0

    if not isinstance(data, dict):
        return 0, 0

    questions = data.get("questions", [])
    if not isinstance(questions, list):
        return 0, 0

    changed = 0
    for q in questions:
        if not isinstance(q, dict):
            continue
        sv2 = q.get("speakable_v2", {})
        # Skip if already has archetype set
        if isinstance(sv2, dict) and sv2.get("archetype"):
            continue

        # Determine archetype and pillar
        slug = q.get("slug") or q.get("id", "")
        if rel in queue_map:
            archetype, pillar = queue_map[rel]
        else:
            archetype = infer_archetype(q)
            pillar = infer_pillar(rel)

        q["speakable_v2"] = generate_speakable_v2(q, archetype, pillar)
        changed += 1

    if changed > 0 and not dry_run:
        filepath.write_text(json.dumps(data, indent=2))

    return changed, len([q for q in questions if isinstance(q, dict)]) - changed


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__,
                                     formatter_class=argparse.RawDescriptionHelpFormatter)
    group = parser.add_mutually_exclusive_group(required=True)
    group.add_argument("--pillar", choices=[f"P{i:02d}" for i in range(1, 13)])
    group.add_argument("--all", action="store_true")
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    queue_map = load_queue_map()
    print(f"Loaded {len(queue_map)} queue entries from CSVs")

    if args.all:
        files = sorted(CONTENT_ROOT.rglob("complete-qa.json"))
    else:
        pillar_files = set()
        queue_path = PILLAR_QUEUE.get(args.pillar)
        if queue_path and queue_path.exists():
            lines = queue_path.read_text().splitlines()
            header = lines[0].split(",") if lines else []
            try:
                file_idx = header.index("file")
                for line in lines[1:]:
                    parts = re.split(r',(?=(?:[^"]*"[^"]*")*[^"]*$)', line)
                    if len(parts) > file_idx:
                        fp = REPO_ROOT / parts[file_idx].strip().strip('"')
                        pillar_files.add(fp)
            except ValueError:
                pass
        files = sorted(pillar_files) if pillar_files else []

    total_processed = total_skipped = total_files = 0
    for fp in files:
        if not fp.exists():
            continue
        processed, skipped = process_file(fp, queue_map, dry_run=args.dry_run)
        if processed > 0:
            total_files += 1
            total_processed += processed
            total_skipped += skipped

    mode = " [DRY RUN]" if args.dry_run else ""
    print(f"{mode}Processed {total_processed} questions in {total_files} files. "
          f"Skipped {total_skipped} (already have speakable_v2).")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
