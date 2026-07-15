"""
Audit v3 — calibrated structural auditor for Java Backend Intermediate.

Produces a per-question signal bundle for every question in every module.
Signals are structural and deterministic; the judgment layer (human + LLM)
runs on top of these signals to produce the final per-module markdown report.

Output: scripts/out/audit_v3/<pillar>/<module>__<topic>.json
"""
from __future__ import annotations
import json
import os
import re
import sys
from pathlib import Path
from collections import defaultdict

REPO = Path(__file__).resolve().parent.parent
ROOT = REPO / "content" / "java-backend-intermediate"
OUT = REPO / "scripts" / "out" / "audit_v3"
OUT.mkdir(parents=True, exist_ok=True)

BOLD_RE = re.compile(r"\*\*[^*]+\*\*")
INLINE_CODE_RE = re.compile(r"`[^`]+`")
FENCED_CODE_RE = re.compile(r"```[a-zA-Z]*\n[\s\S]*?```", re.MULTILINE)
MD_HEADER_RE = re.compile(r"^(#{1,6})\s", re.MULTILINE)
MD_BULLET_RE = re.compile(r"^\s*[-*]\s", re.MULTILINE)
PARAGRAPH_SPLIT_RE = re.compile(r"\n\s*\n")

ANALOGY_KEYWORDS = (
    r"\b(think of|imagine|like a|similar to|picture|analogy|real-world|"
    r"everyday|compare it|consider a|it's like|as if|"
    r"bank account|atm|car|driver|family tree|house|room|engine|"
    r"pill capsule|dispatcher|postman|delivery)\b"
)
ANALOGY_RE = re.compile(ANALOGY_KEYWORDS, re.IGNORECASE)

SPEAKABLE_SUBHEADER_RE = re.compile(r"^\*\*[^*]+\*\*\s*:?\s*$", re.MULTILINE)

STOPWORDS = set("a an and or the of to in is for on with by from as at vs versus".split())
# Generic domain tokens — sharing these alone isn't evidence of topic overlap
GENERIC_DOMAIN = set(
    "java spring boot bean beans scope scopes scoped annotation annotations "
    "class classes method methods object objects interface interfaces api "
    "rest service services controller controllers component components "
    "db database databases sql jpa hibernate aws cloud k8s kubernetes docker "
    "test tests testing unit integration security config configuration"
    .split()
)


def tokenize_slug(s: str) -> set[str]:
    return {t for t in re.split(r"[-_\s]+", s.lower()) if t and t not in STOPWORDS}


def count_code_blocks(text: str) -> int:
    return len(FENCED_CODE_RE.findall(text or ""))


def count_inline_code(text: str) -> int:
    return len(INLINE_CODE_RE.findall(text or ""))


def count_bold(text: str) -> int:
    return len(BOLD_RE.findall(text or ""))


def word_count(text: str) -> int:
    if not text:
        return 0
    t = FENCED_CODE_RE.sub(" ", text)
    t = INLINE_CODE_RE.sub(" ", t)
    return len(re.findall(r"\w+", t))


def has_analogy(text: str) -> bool:
    if not text:
        return False
    return bool(ANALOGY_RE.search(text))


def analyze_section(section: dict) -> dict:
    content = section.get("content", "") or ""
    return {
        "type": section.get("type"),
        "title": section.get("title", "")[:80],
        "words": word_count(content),
        "code_blocks": count_code_blocks(content),
        "inline_code": count_inline_code(content),
        "bold": count_bold(content),
        "bullets": len(MD_BULLET_RE.findall(content)),
        "has_analogy": has_analogy(content),
    }


def analyze_speakable(content: str) -> dict:
    """Detect speakable shape: bulleted-under-subheaders vs flowing prose vs mixed."""
    if not content:
        return {"shape": "empty", "words": 0, "has_recommendation": False}
    paragraphs = [p for p in PARAGRAPH_SPLIT_RE.split(content) if p.strip()]
    subheaders = SPEAKABLE_SUBHEADER_RE.findall(content)
    bullets = MD_BULLET_RE.findall(content)
    words = word_count(content)
    has_reco = bool(re.search(r"\b(I recommend|my default|I'd|I would|rule of thumb|prefer|default to)\b",
                              content, re.IGNORECASE))
    if subheaders and bullets:
        shape = "bulleted-subheaders"
    elif bullets and not subheaders:
        shape = "bullets-no-headers"
    elif not bullets and not subheaders:
        shape = "prose"
    else:
        shape = "headers-no-bullets"
    return {
        "shape": shape,
        "words": words,
        "paragraphs": len(paragraphs),
        "subheaders": len(subheaders),
        "bullets": len(bullets),
        "has_recommendation": has_reco,
        "has_analogy": has_analogy(content),
    }


def analyze_direct_answer(text: str) -> dict:
    if not text:
        return {"words": 0, "bold_anchors": 0, "inline_code": 0, "is_paragraph_wall": False}
    words = word_count(text)
    bold = count_bold(text)
    return {
        "words": words,
        "bold_anchors": bold,
        "inline_code": count_inline_code(text),
        "is_paragraph_wall": words > 60 and bold == 0,
    }


def analyze_question(q: dict, fallback_order: int | None = None) -> dict:
    order = q.get("order") if q.get("order") is not None else fallback_order
    if q.get("stub"):
        return {
            "id": q.get("id"),
            "slug": q.get("slug", q.get("id")),
            "question": q.get("question", q.get("title", ""))[:120],
            "order": order,
            "stub": True,
        }

    ans = q.get("answer") or {}
    sections = ans.get("sections") if isinstance(ans, dict) else None
    sections = sections if isinstance(sections, list) else []

    section_infos = [analyze_section(s) for s in sections if isinstance(s, dict)]
    section_types = [s.get("type") for s in sections if isinstance(s, dict)]

    # Locate specific sections
    speakable = next((s for s in sections if isinstance(s, dict) and s.get("type") == "speakable_answer"), None)
    key_points = next((s for s in sections if isinstance(s, dict) and s.get("type") == "key_points"), None)

    total_code_blocks = sum(s["code_blocks"] for s in section_infos)
    total_words_zone3 = sum(s["words"] for s in section_infos if s["type"] not in ("speakable_answer", "key_points"))
    any_analogy_zone3 = any(s["has_analogy"] for s in section_infos if s["type"] not in ("speakable_answer", "key_points"))

    direct = analyze_direct_answer(q.get("direct_answer", ""))
    speak = analyze_speakable(speakable.get("content", "") if speakable else "")
    kp_info = analyze_section(key_points) if key_points else None

    # Interviewer intent check
    ii = q.get("interviewer_intent") or {}
    ii_ok = isinstance(ii, dict) and all((ii.get(k) or "").strip() for k in ("testing", "common_mistake", "to_stand_out"))

    issues = []
    # Zone 1 issues
    if direct["words"] == 0:
        issues.append({"zone": 1, "severity": "CRITICAL", "code": "zone1_no_direct_answer",
                       "msg": "direct_answer is empty"})
    elif direct["is_paragraph_wall"]:
        issues.append({"zone": 1, "severity": "MODERATE", "code": "zone1_direct_answer_paragraph_wall",
                       "msg": f"direct_answer is {direct['words']} words with no bold anchors"})
    elif direct["bold_anchors"] == 0 and direct["words"] > 30:
        issues.append({"zone": 1, "severity": "MINOR", "code": "zone1_direct_answer_no_bold_anchors",
                       "msg": "no **bold** anchors in direct_answer"})
    if not kp_info:
        issues.append({"zone": 1, "severity": "MODERATE", "code": "zone1_no_key_points",
                       "msg": "key_points section missing"})
    elif kp_info["bullets"] < 3:
        issues.append({"zone": 1, "severity": "MINOR", "code": "zone1_key_points_thin",
                       "msg": f"only {kp_info['bullets']} bullets in key_points"})
    if not ii_ok:
        issues.append({"zone": 1, "severity": "MINOR", "code": "zone1_interviewer_intent_incomplete",
                       "msg": "interviewer_intent missing one of testing/common_mistake/to_stand_out"})

    # Zone 2 issues
    if not speakable or speak["words"] == 0:
        issues.append({"zone": 2, "severity": "CRITICAL", "code": "zone2_no_speakable",
                       "msg": "speakable_answer section missing or empty"})
    else:
        if speak["shape"] == "prose" and speak["paragraphs"] < 3:
            issues.append({"zone": 2, "severity": "MINOR", "code": "zone2_speakable_thin_prose",
                           "msg": "speakable is short prose — may be too light for topic"})
        if speak["words"] < 120:
            issues.append({"zone": 2, "severity": "MINOR", "code": "zone2_speakable_short",
                           "msg": f"speakable is only {speak['words']} words"})
        if speak["words"] > 700:
            issues.append({"zone": 2, "severity": "MINOR", "code": "zone2_speakable_long",
                           "msg": f"speakable is {speak['words']} words — may be too long"})

    # Zone 3 issues
    if not sections:
        issues.append({"zone": 3, "severity": "CRITICAL", "code": "zone3_no_sections",
                       "msg": "answer.sections is empty"})
    else:
        non_meta_sections = [s for s in sections if isinstance(s, dict) and
                             s.get("type") not in ("speakable_answer", "key_points")]
        if len(non_meta_sections) < 2:
            issues.append({"zone": 3, "severity": "MODERATE", "code": "zone3_thin_deep_dive",
                           "msg": f"only {len(non_meta_sections)} deep-dive section(s)"})
        if total_code_blocks == 0 and total_words_zone3 > 300:
            issues.append({"zone": 3, "severity": "MODERATE", "code": "zone3_no_code_examples",
                           "msg": "substantive Zone 3 with zero code examples"})
        if not any_analogy_zone3 and total_words_zone3 > 400:
            issues.append({"zone": 3, "severity": "MINOR", "code": "zone3_no_analogy",
                           "msg": "substantive Zone 3 with no analogies detected"})

    return {
        "id": q.get("id"),
        "slug": q.get("slug", q.get("id")),
        "question": q.get("question", q.get("title", ""))[:160],
        "order": order,
        "stub": False,
        "direct_answer": direct,
        "speakable": speak,
        "key_points": kp_info,
        "section_types": section_types,
        "section_count": len(section_infos),
        "zone3_words": total_words_zone3,
        "zone3_code_blocks": total_code_blocks,
        "zone3_has_analogy": any_analogy_zone3,
        "interviewer_intent_ok": ii_ok,
        "issues": issues,
    }


def find_overlaps(questions: list[dict]) -> list[dict]:
    """Detect likely topic duplicates in a module via slug-token Jaccard similarity."""
    overlaps = []
    slugs = [(q["id"], q["slug"], tokenize_slug(q["slug"])) for q in questions]
    for i in range(len(slugs)):
        for j in range(i + 1, len(slugs)):
            a_id, a_s, a_t = slugs[i]
            b_id, b_s, b_t = slugs[j]
            if not a_t or not b_t:
                continue
            inter = a_t & b_t
            meaningful_inter = inter - GENERIC_DOMAIN
            union = a_t | b_t
            jacc = len(inter) / len(union) if union else 0
            # Require: high Jaccard AND at least 2 *meaningful* (non-generic) shared tokens
            if jacc >= 0.45 and len(meaningful_inter) >= 2:
                overlaps.append({
                    "a_id": a_id, "a_slug": a_s,
                    "b_id": b_id, "b_slug": b_s,
                    "jaccard": round(jacc, 2),
                    "shared_tokens": sorted(inter),
                })
    return overlaps


def audit_topic_file(topic_path: Path) -> dict | None:
    try:
        d = json.loads(topic_path.read_text())
    except Exception as e:
        return {"error": str(e), "path": str(topic_path)}
    qs = d.get("questions") if isinstance(d, dict) else d
    if not isinstance(qs, list):
        return None
    analyzed = [analyze_question(q, fallback_order=i + 1)
                for i, q in enumerate(qs) if isinstance(q, dict)]
    non_stubs = [a for a in analyzed if not a.get("stub")]
    overlaps = find_overlaps(non_stubs)
    return {
        "topic": d.get("topicSlug", topic_path.parent.name) if isinstance(d, dict) else topic_path.parent.name,
        "question_count": len(analyzed),
        "stub_count": sum(1 for a in analyzed if a.get("stub")),
        "questions": analyzed,
        "overlaps": overlaps,
    }


def audit_module(module_slug: str, topics: list[str], pillar: str, module_number: str) -> dict:
    topic_reports = {}
    for t in topics:
        qa = ROOT / module_slug / t / "complete-qa.json"
        if qa.exists():
            r = audit_topic_file(qa)
            if r:
                topic_reports[t] = r
    return {
        "pillar": pillar,
        "module_number": module_number,
        "module_slug": module_slug,
        "topics": topic_reports,
    }


def main():
    idx = json.loads((ROOT / "_index.json").read_text())
    modules = idx.get("modules", [])
    summary = []
    for m in modules:
        mod_slug = m["moduleSlug"]
        pillar = m.get("pillar")
        module_num = m.get("moduleNumber")
        topics = m.get("topics") or []
        report = audit_module(mod_slug, topics, pillar, module_num)
        # Write per-module audit
        pillar_dir = OUT / pillar
        pillar_dir.mkdir(parents=True, exist_ok=True)
        fpath = pillar_dir / f"{module_num}_{mod_slug}.json"
        fpath.write_text(json.dumps(report, indent=2))
        # Module summary
        total_q = sum(t["question_count"] for t in report["topics"].values())
        total_stubs = sum(t["stub_count"] for t in report["topics"].values())
        total_issues = sum(len(q["issues"]) for t in report["topics"].values()
                           for q in t["questions"] if not q.get("stub"))
        crit = sum(1 for t in report["topics"].values() for q in t["questions"]
                   if not q.get("stub") for i in q["issues"] if i["severity"] == "CRITICAL")
        mod = sum(1 for t in report["topics"].values() for q in t["questions"]
                  if not q.get("stub") for i in q["issues"] if i["severity"] == "MODERATE")
        overlaps = sum(len(t["overlaps"]) for t in report["topics"].values())
        summary.append({
            "pillar": pillar,
            "module": module_num,
            "slug": mod_slug,
            "questions": total_q,
            "stubs": total_stubs,
            "issues": total_issues,
            "critical": crit,
            "moderate": mod,
            "overlaps": overlaps,
        })
    (OUT / "_summary.json").write_text(json.dumps(summary, indent=2))
    print(f"Wrote audit for {len(summary)} modules to {OUT}")
    print(f"{'Pil':<4} {'Mod':<4} {'Slug':<36} {'Q':<4} {'Stubs':<5} {'Iss':<4} {'CRIT':<5} {'MOD':<4} {'Overl':<5}")
    for s in summary:
        print(f"{s['pillar']:<4} {s['module']:<4} {s['slug']:<36} "
              f"{s['questions']:<4} {s['stubs']:<5} {s['issues']:<4} "
              f"{s['critical']:<5} {s['moderate']:<4} {s['overlaps']:<5}")


if __name__ == "__main__":
    main()
