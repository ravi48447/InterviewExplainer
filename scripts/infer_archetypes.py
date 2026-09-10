"""Archetype inference for Java Backend Intermediate questions.

Read-only analyzer. Produces `scripts/out/suggested_archetypes.json`
containing a deterministic archetype guess + confidence for every question.

Does NOT modify any content JSON. The audit pipeline reads the suggestions
file; humans can review low-confidence entries before the v2 auditor runs.

Archetypes (allowed values for the `archetype` field in content/*.json):
  direct-concept | comparison | internals | moderate-concept |
  debugging-pattern | how-to-recipe | tool-config | architecture |
  system-design | behavioral | scenario-based
"""
from __future__ import annotations

import json
import re
from collections import Counter
from dataclasses import dataclass, asdict
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
JBI_ROOT = ROOT / "content" / "java-backend-intermediate"
OUT_DIR = ROOT / "scripts" / "out"
OUT_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_ARCHETYPES = {
    "direct-concept", "comparison", "internals", "moderate-concept",
    "debugging-pattern", "how-to-recipe", "tool-config", "architecture",
    "system-design", "behavioral", "scenario-based",
}


# ---------------------------------------------------------------------------
# Signal 1: module-level strong defaults
#   Used only if no stronger text pattern matches.
# ---------------------------------------------------------------------------
MODULE_DEFAULTS: dict[str, tuple[str, float]] = {
    "behavioral": ("behavioral", 0.95),
    "system-design-cases": ("system-design", 0.95),
    "system-design": ("architecture", 0.55),  # mixed — can be architecture or system-design
    "design-patterns": ("architecture", 0.65),
    "architecture-patterns": ("architecture", 0.75),
    "unit-testing": ("how-to-recipe", 0.55),
    "advanced-testing": ("how-to-recipe", 0.55),
    "docker": ("tool-config", 0.70),
    "kubernetes": ("tool-config", 0.70),
    "cicd": ("tool-config", 0.60),
    "git-build-tools": ("tool-config", 0.60),
    "observability": ("tool-config", 0.55),
    "production-sre": ("debugging-pattern", 0.55),
    "engineering-practices": ("behavioral", 0.60),
    "application-security": ("moderate-concept", 0.50),
    "aws-cloud": ("tool-config", 0.55),
    "cloud-native": ("architecture", 0.50),
    "spring-batch": ("how-to-recipe", 0.55),
    "messaging-events": ("moderate-concept", 0.45),
    "microservices": ("architecture", 0.50),
}


# ---------------------------------------------------------------------------
# Signal 2: topic-level strong defaults
# ---------------------------------------------------------------------------
TOPIC_DEFAULTS: dict[str, tuple[str, float]] = {
    "scenario-based": ("scenario-based", 0.90),
    "comparisons": ("comparison", 0.95),
    "solid-principles": ("architecture", 0.85),
    "creational-patterns": ("architecture", 0.80),
    "structural-patterns": ("architecture", 0.80),
    "behavioral-patterns": ("architecture", 0.80),
    "algorithm-complexity": ("moderate-concept", 0.60),
    "sorting-and-searching": ("how-to-recipe", 0.55),
    "trees-and-graphs": ("how-to-recipe", 0.55),
    "dynamic-programming": ("how-to-recipe", 0.55),
    "problem-solving-patterns": ("scenario-based", 0.70),
    "star-method": ("behavioral", 0.95),
    "conflict-resolution": ("behavioral", 0.95),
    "technical-leadership": ("behavioral", 0.95),
    "agile-and-scrum": ("behavioral", 0.90),
    "delivering-under-pressure": ("behavioral", 0.95),
    "failure-and-learning": ("behavioral", 0.95),
    "career-growth": ("behavioral", 0.90),
    "owasp-top-10": ("moderate-concept", 0.65),
    "encryption": ("moderate-concept", 0.60),
    "incident-response": ("debugging-pattern", 0.70),
    "incident-management": ("debugging-pattern", 0.70),
    "root-cause-analysis": ("debugging-pattern", 0.75),
    "postmortems": ("debugging-pattern", 0.75),
    "debugging-production": ("debugging-pattern", 0.85),
    "memory-leaks": ("debugging-pattern", 0.80),
    "performance-troubleshooting": ("debugging-pattern", 0.80),
    "n-plus-one-problem": ("debugging-pattern", 0.80),
    "runbooks": ("how-to-recipe", 0.60),
    "on-call": ("behavioral", 0.65),
    "code-review": ("behavioral", 0.70),
    "team-collaboration": ("behavioral", 0.85),
    "knowledge-sharing": ("behavioral", 0.80),
    "mentoring": ("behavioral", 0.85),
    "architecture-decisions": ("architecture", 0.75),
    "technical-documentation": ("how-to-recipe", 0.55),
    "technical-debt": ("architecture", 0.55),
}


# ---------------------------------------------------------------------------
# Signal 3: question-text regex patterns (highest-precedence when they match)
#   Listed in priority order; first match wins within this signal.
# ---------------------------------------------------------------------------
TEXT_PATTERNS: list[tuple[str, float, str, re.Pattern]] = [
    # Behavioral cues
    ("behavioral", 0.95, "STAR opener in title",
     re.compile(r"\b(tell me about a time|describe a (situation|time)|"
                r"share (an|a) experience|give (me |)an example of)\b",
                re.IGNORECASE)),
    ("behavioral", 0.85, "self-reflection pattern",
     re.compile(r"\b(how do you handle|how would you handle|how do you deal with|"
                r"how do you respond to|how do you approach)\b.*\b("
                r"conflict|disagreement|failure|mistake|pressure|deadline|"
                r"teammate|manager|criticism|feedback|difficult)\b",
                re.IGNORECASE)),
    # System design cues (before "how would you design")
    ("system-design", 0.95, "design X at scale",
     re.compile(r"\b(design (a|an|the)|how would you (design|build|architect))\s+"
                r"(.+?)(at scale|that scales|for (millions?|[0-9]+m|high throughput)|"
                r"url shortener|rate limiter|chat|newsfeed|notification|payment|"
                r"search autocomplete|recommendation|api gateway|load balancer)",
                re.IGNORECASE)),
    ("system-design", 0.80, "design X (generic)",
     re.compile(r"^\s*(design (a|an|the)|how would you design)\b",
                re.IGNORECASE)),
    # Comparison cues
    ("comparison", 0.95, "X vs Y",
     re.compile(r"\bvs\.?\b|\bversus\b", re.IGNORECASE)),
    ("comparison", 0.90, "difference between / compare",
     re.compile(r"\b(difference between|compare|which is (better|faster|"
                r"preferred)|when (to|should) (use|choose))\b", re.IGNORECASE)),
    # Debugging cues
    ("debugging-pattern", 0.90, "debug/troubleshoot",
     re.compile(r"\b(debug|troubleshoot|diagnose|fix|fixing|resolve|"
                r"investigat\w+|root cause)\b", re.IGNORECASE)),
    ("debugging-pattern", 0.80, "why does X fail / happen / leak",
     re.compile(r"\bwhy (does|is|do|will|would)\b.*\b(fail|leak|hang|break|"
                r"crash|slow|throw|not work|happen)\b", re.IGNORECASE)),
    ("debugging-pattern", 0.75, "common mistakes / pitfalls",
     re.compile(r"\b(common (mistakes?|pitfalls?|errors?|bugs?)|"
                r"what goes wrong|gotchas?)\b", re.IGNORECASE)),
    # Internals cues
    ("internals", 0.90, "how does X work internally",
     re.compile(r"\bhow does .+ work\b|\bhow (does|is)\b.+\bimplemented\b|"
                r"\bunder the hood\b|\binternals? of\b|"
                r"\bwalk (through|me through)\b|\bwhat happens when\b",
                re.IGNORECASE)),
    ("internals", 0.70, "explain the X mechanism",
     re.compile(r"\bexplain (the |)\b.+\b(mechanism|algorithm|lifecycle|"
                r"flow|process|pipeline)\b", re.IGNORECASE)),
    # How-to-recipe cues
    ("how-to-recipe", 0.85, "how do you implement/build/write X",
     re.compile(r"\bhow (do|would) you\b.*\b(implement|build|write|create|"
                r"setup|set up|install|deploy|run|use|integrate|handle|"
                r"expose|publish|consume|send|receive)\b", re.IGNORECASE)),
    ("how-to-recipe", 0.70, "implement X in Java",
     re.compile(r"^(implement|write|build)\b.*\bin (java|spring|sql|"
                r"kafka|redis)\b", re.IGNORECASE)),
    # Tool-config cues
    ("tool-config", 0.80, "how to configure / configuration",
     re.compile(r"\b(how (do|would) you configure|how to configure|"
                r"configure (a|an|the)|configuration (for|of))\b",
                re.IGNORECASE)),
    ("tool-config", 0.70, "options / settings / properties",
     re.compile(r"\b(what (are|is) the )?(key |main |)(options|settings|"
                r"properties|flags|parameters) (for|of|in)\b",
                re.IGNORECASE)),
    # Architecture cues
    ("architecture", 0.85, "what is X pattern / principle / architecture",
     re.compile(r"\bwhat (is|are) (the |)\b.+\b(pattern|principle|"
                r"architecture|architectural style|design approach)\b",
                re.IGNORECASE)),
    ("architecture", 0.75, "clean / hexagonal / ddd / cqrs",
     re.compile(r"\b(clean architecture|hexagonal|onion architecture|"
                r"domain.?driven design|ddd|cqrs|event sourcing)\b",
                re.IGNORECASE)),
    # Scenario cues
    ("scenario-based", 0.85, "you have / given / imagine",
     re.compile(r"^(you (have|are given|need to)|given (a|an|that)|"
                r"imagine (a|you|that)|suppose (a|an|that)|"
                r"your team (has|needs|is))\b", re.IGNORECASE)),
    ("scenario-based", 0.75, "what would you do / which would you choose",
     re.compile(r"\b(what would you do|which would you (choose|pick)|"
                r"how would you approach)\b", re.IGNORECASE)),
    # Direct-concept as relatively weak default for "what is X" when no other signal
    ("direct-concept", 0.55, "what is X (simple)",
     re.compile(r"^\s*what (is|are) (a|an|the |)\w[\w\- ]*\??\s*$",
                re.IGNORECASE)),
]


# ---------------------------------------------------------------------------
# Inference
# ---------------------------------------------------------------------------
@dataclass
class Suggestion:
    pillar: str
    pillar_name: str
    module_slug: str
    module_title: str
    topic_slug: str
    question_id: str
    question_slug: str
    question_title: str
    inferred_archetype: str
    confidence: float
    reasoning: str
    signals_considered: list[str]
    already_has_archetype: bool
    existing_archetype: str | None


def infer(module_slug: str, topic_slug: str, question_title: str,
          already: str | None) -> tuple[str, float, str, list[str]]:
    """Return (archetype, confidence, reasoning, signals_considered)."""
    signals: list[str] = []

    # Existing explicit field wins, always
    if already and already in ALLOWED_ARCHETYPES:
        signals.append(f"explicit-field={already}")
        return already, 1.0, "explicit archetype field present", signals

    # Collect all candidates then pick highest confidence
    candidates: list[tuple[str, float, str]] = []

    if module_slug in MODULE_DEFAULTS:
        a, c = MODULE_DEFAULTS[module_slug]
        candidates.append((a, c, f"module-default[{module_slug}]→{a}"))
        signals.append(candidates[-1][2])

    if topic_slug in TOPIC_DEFAULTS:
        a, c = TOPIC_DEFAULTS[topic_slug]
        candidates.append((a, c, f"topic-default[{topic_slug}]→{a}"))
        signals.append(candidates[-1][2])

    for archetype, conf, label, pat in TEXT_PATTERNS:
        if pat.search(question_title):
            candidates.append((archetype, conf, f"text-pattern[{label}]"))
            signals.append(candidates[-1][2])

    if not candidates:
        return ("moderate-concept", 0.30,
                "fallback: no module/topic/text signal matched", signals or ["none"])

    # Highest confidence wins; ties broken by text-pattern over defaults
    def sort_key(t):
        _, c, label = t
        text_bonus = 0.01 if label.startswith("text-pattern") else 0
        return -(c + text_bonus)

    candidates.sort(key=sort_key)
    best_archetype, best_conf, best_reason = candidates[0]

    # If more than one candidate but second-best matches first, raise confidence
    if len(candidates) >= 2:
        second = candidates[1]
        if second[0] == best_archetype:
            best_conf = min(1.0, best_conf + 0.05)
            best_reason = f"{best_reason} + reinforced by {second[2]}"

    return best_archetype, round(best_conf, 2), best_reason, signals


def main():
    index = json.loads((JBI_ROOT / "_index.json").read_text())
    modules = index["modules"]
    suggestions: list[Suggestion] = []

    for m in modules:
        mdir = JBI_ROOT / m["moduleSlug"]
        if not mdir.exists():
            continue
        for topic in m.get("topics", []):
            qa_path = mdir / topic / "complete-qa.json"
            if not qa_path.exists():
                continue
            data = json.loads(qa_path.read_text())
            for q in data.get("questions", []):
                title = q.get("title") or q.get("question", "")
                existing = q.get("archetype")
                archetype, conf, reason, signals = infer(
                    m["moduleSlug"], topic, title, existing)
                suggestions.append(Suggestion(
                    pillar=m["pillar"],
                    pillar_name=m["pillarName"],
                    module_slug=m["moduleSlug"],
                    module_title=m["title"],
                    topic_slug=topic,
                    question_id=q.get("id", ""),
                    question_slug=q.get("slug", ""),
                    question_title=title,
                    inferred_archetype=archetype,
                    confidence=conf,
                    reasoning=reason,
                    signals_considered=signals,
                    already_has_archetype=bool(existing),
                    existing_archetype=existing if isinstance(existing, str) else None,
                ))

    # Distribution & confidence summary
    dist = Counter(s.inferred_archetype for s in suggestions)
    conf_bucket = Counter()
    for s in suggestions:
        if s.confidence >= 0.85:
            conf_bucket["high (>=0.85)"] += 1
        elif s.confidence >= 0.60:
            conf_bucket["medium (0.60-0.84)"] += 1
        else:
            conf_bucket["low (<0.60)"] += 1

    output = {
        "source_spec": "content/ANSWER_QUALITY_SPEC_V2.md",
        "allowed_archetypes": sorted(ALLOWED_ARCHETYPES),
        "total_questions": len(suggestions),
        "archetype_distribution": dict(dist.most_common()),
        "confidence_buckets": dict(conf_bucket),
        "needs_review_low_confidence":
            sorted(
                [asdict(s) for s in suggestions if s.confidence < 0.60],
                key=lambda r: (r["module_slug"], r["topic_slug"], r["question_slug"]),
            ),
        "suggestions": [asdict(s) for s in suggestions],
    }

    out_path = OUT_DIR / "suggested_archetypes.json"
    out_path.write_text(json.dumps(output, indent=2))

    print(f"Total questions: {len(suggestions)}")
    print("Archetype distribution:")
    for a, n in dist.most_common():
        print(f"  {a:20s} {n:4d}")
    print("Confidence buckets:")
    for b, n in conf_bucket.most_common():
        print(f"  {b:22s} {n:4d}")
    print(f"Wrote: {out_path}")


if __name__ == "__main__":
    main()
