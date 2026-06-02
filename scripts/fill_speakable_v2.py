#!/usr/bin/env python3
"""
Programmatically fill speakable_v2 blocks for java-backend-fresher questions
that still have none. Uses content from existing question fields.

Usage:
    python3 scripts/fill_speakable_v2.py content/java-backend-fresher/git-basics/
    python3 scripts/fill_speakable_v2.py content/java-backend-fresher/  # all modules
    python3 scripts/fill_speakable_v2.py --all  # all JBF modules, commit each
"""
import json, glob, re, sys, os, textwrap

# ── helpers ────────────────────────────────────────────────────────────────

def detect_archetype(question: str) -> str:
    q = question.lower()
    if re.search(r'\bvs\.?\b|versus|\bdiff\w*\sbetween\b|compare|contrast', q):
        return "B"
    if re.search(r'\bwhen (to|should|do|would|is it)\b|which (is better|should|to use|one)\b|how (do you|to) (choose|decide|pick)\b', q):
        return "E"
    return "A"

def strip_backticks(text: str) -> str:
    """Remove backticks from text (TTS reads them aloud)."""
    return text.replace('`', '')

def shorten(text: str, max_words: int = 32) -> str:
    """Trim to max_words words, ending on a complete sentence if possible."""
    words = text.split()
    if len(words) <= max_words:
        return text
    chunk = " ".join(words[:max_words])
    # try to end at sentence boundary
    m = re.search(r'[.!?][^.!?]*$', chunk)
    if m and m.start() > len(chunk) // 2:
        return chunk[:m.start() + 1]
    return chunk.rstrip(',;') + "."

def make_hook(q: str, direct_answer: str) -> str:
    """Generate a hook ≤35 words from the question and direct answer."""
    da = strip_backticks(direct_answer)
    # Use first sentence of direct_answer as hook base
    first_sentence = re.split(r'(?<=[.!?])\s', da)[0]
    hook = shorten(first_sentence, 30)
    if not hook.endswith('.'):
        hook += "."
    return hook

def sentences_to_bullets(text: str, min_items: int = 2) -> list[str]:
    """Split text into bullet items."""
    text = strip_backticks(text)
    # Split on semicolons first
    parts = [p.strip() for p in text.split(';') if p.strip()]
    if len(parts) >= min_items:
        return [p.rstrip('.') for p in parts]
    # Split on ' — '
    parts = [p.strip() for p in re.split(r'\s+—\s+', text) if p.strip()]
    if len(parts) >= min_items:
        return [p.rstrip('.') for p in parts]
    # Split on '. ' sentences
    sentences = [s.strip() for s in re.split(r'\.\s+', text) if len(s.strip()) > 10]
    if len(sentences) >= min_items:
        return [s.rstrip('.') for s in sentences]
    # Pad to min_items by splitting at commas
    parts = [p.strip() for p in text.split(',') if p.strip()]
    if len(parts) >= min_items:
        return [p.rstrip('.') for p in parts]
    # Fallback: two halves
    mid = len(text) // 2
    space = text.rfind(' ', 0, mid)
    if space > 0:
        return [text[:space].rstrip('.'), text[space + 1:].rstrip('.')]
    return [text, "See also the related concept for comparison."]

def get_depth_marker(intent, idx: int) -> str:
    """Pick a depth marker phrase from intent."""
    markers = ["candidates miss:", "sharp edge:", "non-obvious:", "production trap:", "gotcha:"]
    marker = markers[idx % len(markers)]
    if not isinstance(intent, dict):
        return f"{marker} interviewers often probe this exact point."
    hint = intent.get("common_mistake") or intent.get("to_stand_out") or ""
    hint = strip_backticks(hint)
    if hint:
        hint_short = shorten(hint, 20)
        return f"{marker} {hint_short}"
    return f"{marker} interviewers often probe this exact point."

def make_beats_A(direct_answer: str, intent: dict, idx: int) -> list[dict]:
    """Archetype A: concept beats."""
    da = strip_backticks(direct_answer)
    depth = get_depth_marker(intent, idx)

    # Split direct_answer into 2-3 chunks
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', da) if s.strip()]

    beats = []

    # what_it_is: first 1-2 sentences
    chunk1 = " ".join(sentences[:2]) if len(sentences) >= 2 else sentences[0]
    beats.append({"kind": "what_it_is", "layout": "paragraph", "text": chunk1})

    # parts_or_states or why_it_exists: middle content as bullets
    if len(sentences) >= 3:
        middle = " ".join(sentences[1:-1]) if len(sentences) > 3 else sentences[1]
        items = sentences_to_bullets(middle, 2)
        beats.append({"kind": "parts_or_states", "layout": "bullets", "items": items})
    else:
        # generate 2 bullets from the answer
        items = sentences_to_bullets(da, 2)
        beats.append({"kind": "parts_or_states", "layout": "bullets", "items": items})

    # example: last sentence + depth marker
    last = sentences[-1] if sentences else da
    beats.append({"kind": "example", "layout": "paragraph", "text": f"{depth} {last}"})

    # pitfalls: from intent
    cm = strip_backticks(intent.get("common_mistake", ""))
    ts = strip_backticks(intent.get("to_stand_out", ""))
    if cm or ts:
        pitfall_items = []
        if cm:
            pitfall_items.append(shorten(cm, 20))
        if ts:
            pitfall_items.append(shorten(ts, 20))
        if len(pitfall_items) == 1:
            pitfall_items.append("Always verify your answer with a concrete example.")
        beats.append({"kind": "pitfalls", "layout": "bullets", "items": pitfall_items})

    return beats

def make_beats_B(direct_answer: str, intent: dict, idx: int) -> list[dict]:
    """Archetype B: comparison beats."""
    da = strip_backticks(direct_answer)
    depth = get_depth_marker(intent, idx)
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', da) if s.strip()]

    beats = []

    # what_each_is: the two things being compared
    chunk1 = sentences[0] if sentences else da
    beats.append({"kind": "what_each_is", "layout": "paragraph", "text": chunk1})

    # differences: bullets
    diff_text = " ".join(sentences[1:]) if len(sentences) > 1 else da
    diff_items = sentences_to_bullets(diff_text, 2)
    beats.append({"kind": "differences", "layout": "bullets", "items": diff_items})

    # when_to_pick: from intent
    ts = strip_backticks(intent.get("to_stand_out", ""))
    pick_text = ts if ts else f"Pick based on your specific requirements. {depth}"
    beats.append({"kind": "when_to_pick", "layout": "paragraph", "text": f"{pick_text}"})

    # tiny_example: depth marker
    beats.append({"kind": "tiny_example", "layout": "paragraph", "text": f"{depth}"})

    return beats

def make_beats_E(direct_answer: str, intent: dict, idx: int) -> list[dict]:
    """Archetype E: use-when beats."""
    da = strip_backticks(direct_answer)
    depth = get_depth_marker(intent, idx)
    sentences = [s.strip() for s in re.split(r'(?<=[.!?])\s+', da) if s.strip()]

    beats = []

    beats.append({"kind": "optimising_for", "layout": "paragraph", "text": sentences[0] if sentences else da})

    options_text = " ".join(sentences[1:]) if len(sentences) > 1 else da
    options_items = sentences_to_bullets(options_text, 2)
    beats.append({"kind": "options", "layout": "bullets", "items": options_items})

    ts = strip_backticks(intent.get("to_stand_out", ""))
    tradeoff = ts if ts else "Consider your context carefully before choosing."
    beats.append({"kind": "tradeoffs", "layout": "paragraph", "text": tradeoff})

    beats.append({"kind": "decision", "layout": "paragraph", "text": f"{depth}"})

    return beats

def make_followup(question: str, intent: dict) -> list[str]:
    """Generate 2 follow-up questions."""
    ts = intent.get("to_stand_out", "")
    testing = intent.get("testing", "")

    # Simple heuristics
    q = question.lower()
    followups = []

    if ts:
        # Extract noun from to_stand_out
        words = ts.split()[:5]
        followups.append(f"Can you elaborate on {' '.join(words[:3])}?")

    if testing:
        followups.append(f"What would you say if asked: {testing[:60].rstrip('?')}?")

    # Fallback
    while len(followups) < 2:
        if "what is" in q:
            followups.append("How does this affect performance in practice?")
        elif "why" in q:
            followups.append("What would happen if this weren't the case?")
        else:
            followups.append("Can you give a real-world example of this?")

    return followups[:2]

PILLAR_MAP = {
    "java-syntax-basics": "P01", "java-oop-fundamentals": "P01",
    "java-strings": "P01", "java-collections-fundamentals": "P01",
    "java-exceptions": "P01", "java-multithreading-basics": "P01",
    "java-jvm-memory": "P01", "java-io-basics": "P01", "java8-features": "P01",
    "spring-boot-intro": "P02", "spring-core-di": "P02",
    "spring-data-jpa-basics": "P02", "spring-testing": "P02", "spring-security-fresher": "P02",
    "sql-fundamentals": "P03", "jdbc-basics": "P03", "database-design-basics": "P03",
    "rest-api-basics": "P04", "spring-mvc-rest": "P04",
    "design-principles": "P05", "design-patterns-intro": "P05", "lld-basics": "P05",
    "dsa-fundamentals": "P06", "problem-solving-patterns": "P06",
    "web-security-basics": "P07",
    "junit-testing": "P08", "mockito-basics": "P08",
    "git-basics": "P09", "maven-gradle-basics": "P09",
    "docker-cloud-intro": "P10",
    "debugging-logging": "P11",
    "fresher-behavioral-hr": "P12", "technical-interview-prep": "P12",
}

EXAMPLE_MAP = {
    "java-syntax-basics": "Java 17 application with basic data types",
    "java-oop-fundamentals": "Java 17 e-commerce domain with Product and Order classes",
    "java-strings": "Java 17 app processing user input and generating reports",
    "java-collections-fundamentals": "Java 17 app processing a list of orders",
    "java-exceptions": "Java 17 service handling file I/O and network calls",
    "java-multithreading-basics": "Java 17 multi-threaded service",
    "java-jvm-memory": "Java 17 Spring Boot app in production",
    "java-io-basics": "Java 17 app reading config files and writing logs",
    "java8-features": "Java 17 app using streams and lambdas",
    "spring-boot-intro": "Spring Boot 3.2 REST API application",
    "spring-core-di": "Spring Boot 3.2 app with Service and Repository beans",
    "spring-data-jpa-basics": "Spring Boot 3.2 app with Hibernate and PostgreSQL",
    "spring-testing": "Spring Boot 3.2 REST API with JUnit 5 tests",
    "spring-security-fresher": "Spring Boot 3.2 REST API with JWT auth",
    "sql-fundamentals": "Spring Boot app with JPA over a relational database",
    "jdbc-basics": "Spring Boot app connecting to PostgreSQL with JDBC",
    "database-design-basics": "Spring Boot app with normalized PostgreSQL schema",
    "rest-api-basics": "Spring Boot 3.2 REST API serving a mobile client",
    "spring-mvc-rest": "Spring Boot 3.2 REST API with MVC controllers",
    "design-principles": "Java 17 Spring Boot app applying SOLID principles",
    "design-patterns-intro": "Spring Boot app applying patterns to a cart service",
    "lld-basics": "Java class hierarchy for a parking lot system",
    "dsa-fundamentals": "Java 17 app solving common DSA interview problems",
    "problem-solving-patterns": "Java 17 app solving array and string problems",
    "web-security-basics": "Spring Boot 3.2 REST API with OWASP-compliant security",
    "junit-testing": "Spring Boot service tested with JUnit 5 and Mockito",
    "mockito-basics": "Spring Boot service with mocked dependencies",
    "git-basics": "Java project managed with Git and feature branches",
    "maven-gradle-basics": "Maven multi-module Spring Boot project",
    "docker-cloud-intro": "Spring Boot app packaged as a Docker image",
    "debugging-logging": "Spring Boot app with SLF4J and Logback logging",
    "fresher-behavioral-hr": "Fresher Java developer in a first job interview",
    "technical-interview-prep": "Java fresher preparing for a backend interview",
}

def make_anchors(module: str, question: str) -> list[str]:
    q_words = set(question.lower().split())
    base = {
        "java-strings": ["strings", "String API", "immutability"],
        "java-io-basics": ["I/O", "streams", "files"],
        "git-basics": ["Git", "version control", "branches"],
        "maven-gradle-basics": ["Maven", "build tools", "pom.xml"],
        "mockito-basics": ["Mockito", "mocking", "unit testing"],
        "spring-boot-intro": ["Spring Boot", "auto-configuration", "REST"],
        "spring-data-jpa-basics": ["JPA", "Hibernate", "database"],
        "spring-testing": ["Spring testing", "JUnit", "integration tests"],
        "web-security-basics": ["security", "OWASP", "authentication"],
    }
    return base.get(module, [module.replace("-", " "), "Java", "interview"])[:3]


def generate_speakable_v2(q: dict, module: str, idx: int) -> dict:
    question = q.get("question", "")
    direct_answer = q.get("direct_answer", "What you need to know about this topic.")
    intent = q.get("interviewer_intent", {})
    if not isinstance(intent, dict):
        intent = {}

    archetype = detect_archetype(question)
    hook = make_hook(question, direct_answer)
    pillar = PILLAR_MAP.get(module, "P01")
    standard_example = EXAMPLE_MAP.get(module, "Java 17 Spring Boot application")
    familiarity_anchors = make_anchors(module, question)

    if archetype == "A":
        beats = make_beats_A(direct_answer, intent, idx)
    elif archetype == "B":
        beats = make_beats_B(direct_answer, intent, idx)
    else:
        beats = make_beats_E(direct_answer, intent, idx)

    cap = shorten(strip_backticks(direct_answer.split('.')[-2] if '.' in direct_answer else direct_answer), 20)
    if not cap.endswith('.'):
        cap += "."

    followup = make_followup(question, intent)

    return {
        "archetype": archetype,
        "pillar": pillar,
        "audience_assumption": "beginner",
        "voice": "friendly",
        "standard_example": standard_example,
        "familiarity_anchors": familiarity_anchors,
        "hook": hook,
        "beats": beats,
        "cap": cap,
        "followup_handoff": followup,
        "tts_overrides": {},
        "speakable_status": "pending_review",
    }


def process_file(fpath: str) -> int:
    """Returns count of questions patched."""
    with open(fpath) as f:
        data = json.load(f)

    is_list = isinstance(data, list)
    questions = data if is_list else data.get("questions", [])

    module = fpath.replace("content/java-backend-fresher/", "").split("/")[0]

    patched = 0
    for idx, q in enumerate(questions):
        if not q.get("speakable_v2"):
            q["speakable_v2"] = generate_speakable_v2(q, module, idx)
            patched += 1

    if patched > 0:
        with open(fpath, "w") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")

    return patched


def main():
    args = sys.argv[1:]
    if not args or args[0] == "--help":
        print(__doc__)
        sys.exit(0)

    do_commit = "--commit" in args
    targets = [a for a in args if not a.startswith("--")]

    if "--all" in args or not targets:
        targets = ["content/java-backend-fresher"]

    total = 0
    for target in targets:
        if os.path.isfile(target):
            files = [target]
        else:
            files = sorted(glob.glob(f"{target}/**/complete-qa.json", recursive=True))

        for fpath in files:
            p = process_file(fpath)
            if p > 0:
                total += p
                print(f"  {p:3d}  {fpath.replace('content/java-backend-fresher/', '')}")

    print(f"\nTotal: {total} questions filled")

    if do_commit:
        for target in targets:
            if os.path.isdir(target):
                rel = target.replace("content/java-backend-fresher/", "")
                module = rel.split("/")[0] if rel else "all"
                pillar = PILLAR_MAP.get(module, "PXX")
                os.system(f"git add {target}")
                os.system(f'git commit -m "speakable(JBF-{pillar}): {module} — {total} questions auto-filled (pending_review)"')


if __name__ == "__main__":
    main()
