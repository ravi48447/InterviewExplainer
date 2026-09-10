#!/usr/bin/env python3
"""
Generate speakable_v2 blocks for java-backend-fresher questions.
Processes files one at a time using the Anthropic API.

Usage:
    python3 scripts/generate_speakable_jbf.py <file_or_dir> [--module <module>] [--pillar <pillar>]
    python3 scripts/generate_speakable_jbf.py content/java-backend-fresher/git-basics/
    python3 scripts/generate_speakable_jbf.py content/java-backend-fresher/git-basics/branching/complete-qa.json
"""
import json, glob, sys, os, re, time, argparse
import anthropic

client = anthropic.Anthropic()

SYSTEM_PROMPT = """You generate speakable_v2 blocks for Java interview questions aimed at freshers (0-2 YOE).

Return ONLY a JSON array of speakable_v2 objects, one per question, in the same order as input.
No markdown, no explanation, just the JSON array.

Each speakable_v2 object:
{
  "archetype": "A" or "B" or "E",
  "pillar": "<pillar>",
  "audience_assumption": "beginner",
  "voice": "friendly",
  "standard_example": "<module-specific example>",
  "familiarity_anchors": ["<2-4 terms>"],
  "hook": "<≤35 words, starts with contrast or surprising fact>",
  "beats": [<3-5 beats>],
  "cap": "<1 sentence takeaway>",
  "followup_handoff": ["<question1>", "<question2>"],
  "tts_overrides": {},
  "speakable_status": "pending_review"
}

Archetypes:
- A = concept: beats use kinds: what_it_is, why_it_exists, parts_or_states, example, pitfalls
- B = comparison ("X vs Y", "difference between"): beats use kinds: what_each_is, differences, when_to_pick, tiny_example
- E = use-when ("when to use", "how to choose"): beats use kinds: optimising_for, options, tradeoffs, decision, rethink_if

Beat layouts:
- paragraph: {"kind":"...","layout":"paragraph","text":"..."}
- bullets: {"kind":"...","layout":"bullets","items":["item1","item2"]} — MUST have ≥2 items
- grouped_paragraphs: {"kind":"...","layout":"grouped_paragraphs","groups":[{"heading":"...","text":"..."}]}
- mini_table: {"kind":"...","layout":"mini_table","columns":["axis","Col1","Col2"],"rows":[{"axis":"...","values":["val1","val2"]}]} — max 3 columns, values.length = columns.length - 1

HARD QUALITY RULES (violations cause test failures):
1. hook MUST be ≤35 words
2. Average sentence length ≤16 words (keep sentences short and punchy)
3. Contractions are required: use it's, don't, you'd, that's, can't freely
4. NEVER use backticks in speakable text (TTS reads them aloud as "backtick")
5. bullets items array MUST have ≥2 items — never 1
6. mini_table columns MUST be ≤3, values array length MUST = columns.length - 1
7. Every question MUST have exactly ONE depth marker in its beats — choose one:
   "sharp edge:", "non-obvious:", "candidates miss:", "production trap:", or "gotcha:"
8. audience_assumption MUST be "beginner", voice MUST be "friendly"
"""

def get_pillar_for_module(module_name: str) -> str:
    pillar_map = {
        "java-syntax-basics": "P01",
        "java-oop-fundamentals": "P01",
        "java-strings": "P01",
        "java-collections-fundamentals": "P01",
        "java-exceptions": "P01",
        "java-multithreading-basics": "P01",
        "java-jvm-memory": "P01",
        "java-io-basics": "P01",
        "java8-features": "P01",
        "spring-boot-intro": "P02",
        "spring-core-di": "P02",
        "spring-data-jpa-basics": "P02",
        "spring-testing": "P02",
        "spring-security-fresher": "P02",
        "sql-fundamentals": "P03",
        "jdbc-basics": "P03",
        "database-design-basics": "P03",
        "rest-api-basics": "P04",
        "spring-mvc-rest": "P04",
        "design-principles": "P05",
        "design-patterns-intro": "P05",
        "lld-basics": "P05",
        "dsa-fundamentals": "P06",
        "problem-solving-patterns": "P06",
        "web-security-basics": "P07",
        "junit-testing": "P08",
        "mockito-basics": "P08",
        "git-basics": "P09",
        "maven-gradle-basics": "P09",
        "docker-cloud-intro": "P10",
        "debugging-logging": "P11",
        "fresher-behavioral-hr": "P12",
        "technical-interview-prep": "P12",
    }
    return pillar_map.get(module_name, "P01")

def get_example_for_module(module_name: str) -> str:
    examples = {
        "java-syntax-basics": "Java 17 application with basic data types and control flow",
        "java-oop-fundamentals": "Java 17 e-commerce domain with Product, Order, and Customer classes",
        "java-strings": "Java 17 app processing user input and generating reports",
        "java-collections-fundamentals": "Java 17 app processing a list of orders with collections",
        "java-exceptions": "Java 17 service handling file I/O and network calls",
        "java-multithreading-basics": "Java 17 multi-threaded service handling concurrent requests",
        "java-jvm-memory": "Java 17 Spring Boot app running in production on JVM 17",
        "java-io-basics": "Java 17 app reading configuration files and writing logs",
        "java8-features": "Java 17 app using streams and lambdas to process data",
        "spring-boot-intro": "Spring Boot 3.2 REST API application",
        "spring-core-di": "Spring Boot 3.2 app with Service and Repository beans",
        "spring-data-jpa-basics": "Spring Boot 3.2 app with Hibernate and PostgreSQL",
        "spring-testing": "Spring Boot 3.2 REST API with JUnit 5 integration tests",
        "spring-security-fresher": "Spring Boot 3.2 REST API with JWT-based authentication",
        "sql-fundamentals": "Spring Boot app with JPA over a relational database",
        "jdbc-basics": "Spring Boot app connecting to PostgreSQL with JDBC",
        "database-design-basics": "Spring Boot app backed by a normalized PostgreSQL schema",
        "rest-api-basics": "Spring Boot 3.2 REST API serving a mobile client",
        "spring-mvc-rest": "Spring Boot 3.2 REST API with MVC controllers",
        "design-principles": "Java 17 Spring Boot app applying SOLID principles",
        "design-patterns-intro": "Spring Boot app applying design patterns to a cart service",
        "lld-basics": "Java class hierarchy for a parking lot or ATM system",
        "dsa-fundamentals": "Java 17 app solving common interview DSA problems",
        "problem-solving-patterns": "Java 17 app solving array and string interview problems",
        "web-security-basics": "Spring Boot 3.2 REST API with OWASP-compliant security",
        "junit-testing": "Spring Boot service tested with JUnit 5 and Mockito",
        "mockito-basics": "Spring Boot service with mocked dependencies in unit tests",
        "git-basics": "Java project managed with Git and feature branches",
        "maven-gradle-basics": "Maven multi-module Spring Boot project",
        "docker-cloud-intro": "Spring Boot app packaged as a Docker image",
        "debugging-logging": "Spring Boot app with SLF4J and Logback logging",
        "fresher-behavioral-hr": "Fresher Java developer in a first job interview",
        "technical-interview-prep": "Java fresher preparing for a backend developer interview",
    }
    return examples.get(module_name, "Java 17 Spring Boot application")

def generate_speakable_for_file(fpath: str, module_name: str) -> tuple[int, int]:
    """Returns (patched, skipped)."""
    with open(fpath) as f:
        data = json.load(f)

    is_list = isinstance(data, list)
    questions = data if is_list else data.get("questions", [])

    # Find questions needing speakable_v2
    to_patch = [q for q in questions if not q.get("speakable_v2")]
    if not to_patch:
        return 0, len(questions)

    pillar = get_pillar_for_module(module_name)
    standard_example = get_example_for_module(module_name)

    # Build the user message
    q_summaries = []
    for i, q in enumerate(to_patch):
        q_summaries.append({
            "index": i,
            "id": q.get("id", ""),
            "question": q.get("question", ""),
            "direct_answer": q.get("direct_answer", ""),
            "interviewer_intent": q.get("interviewer_intent", {}),
        })

    user_msg = f"""Generate speakable_v2 blocks for these {len(to_patch)} Java fresher interview questions.

Module: {module_name}
Pillar: {pillar}
Standard example: {standard_example}

Questions:
{json.dumps(q_summaries, indent=2)}

Return a JSON array with {len(to_patch)} speakable_v2 objects, one per question, in order."""

    try:
        resp = client.messages.create(
            model="claude-haiku-4-5-20251001",
            max_tokens=8192,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_msg}],
        )
        raw = resp.content[0].text.strip()

        # Strip markdown fences if present
        raw = re.sub(r'^```(?:json)?\s*', '', raw)
        raw = re.sub(r'\s*```$', '', raw)

        sv2_blocks = json.loads(raw)
        if not isinstance(sv2_blocks, list) or len(sv2_blocks) != len(to_patch):
            print(f"  WARN: expected {len(to_patch)} blocks, got {len(sv2_blocks) if isinstance(sv2_blocks, list) else 'invalid'} in {fpath}")
            return 0, len(questions)

        # Apply the blocks
        patch_idx = 0
        for q in questions:
            if not q.get("speakable_v2"):
                q["speakable_v2"] = sv2_blocks[patch_idx]
                patch_idx += 1

        # Write back
        with open(fpath, "w") as f:
            if is_list:
                json.dump(data, f, indent=2, ensure_ascii=False)
            else:
                json.dump(data, f, indent=2, ensure_ascii=False)
            f.write("\n")

        return len(to_patch), 0

    except json.JSONDecodeError as e:
        print(f"  ERROR: JSON parse failed for {fpath}: {e}")
        print(f"  Raw response start: {raw[:200]}")
        return 0, len(questions)
    except Exception as e:
        print(f"  ERROR: {e} for {fpath}")
        return 0, len(questions)


def process_path(target: str) -> tuple[int, int, int]:
    """Process a file or directory. Returns (total_patched, total_skipped, files_changed)."""
    if os.path.isfile(target):
        files = [target]
    else:
        files = sorted(glob.glob(f"{target}/**/complete-qa.json", recursive=True))
        if not files:
            files = sorted(glob.glob(f"{target}/complete-qa.json"))

    total_patched = 0
    total_skipped = 0
    files_changed = 0

    for fpath in files:
        # Determine module name from path
        parts = fpath.replace("content/java-backend-fresher/", "").split("/")
        module_name = parts[0] if parts else "unknown"

        # Check if any questions need patching
        try:
            d = json.load(open(fpath))
            qs = d if isinstance(d, list) else d.get("questions", [])
            needs = sum(1 for q in qs if not q.get("speakable_v2"))
            if needs == 0:
                total_skipped += len(qs)
                continue
        except Exception as e:
            print(f"  SKIP (read error): {fpath}: {e}")
            continue

        print(f"  Processing {needs}/{len(qs)} questions in {fpath.replace('content/java-backend-fresher/', '')}")
        p, s = generate_speakable_for_file(fpath, module_name)
        total_patched += p
        total_skipped += s
        if p > 0:
            files_changed += 1
            print(f"    ✓ {p} blocks written")

        # Small delay to avoid rate limiting
        time.sleep(0.5)

    return total_patched, total_skipped, files_changed


def main():
    parser = argparse.ArgumentParser(description="Generate speakable_v2 for JBF questions")
    parser.add_argument("target", help="File path or directory to process")
    parser.add_argument("--commit", action="store_true", help="Git add+commit after processing")
    args = parser.parse_args()

    target = args.target.rstrip("/")
    print(f"Processing: {target}")

    p, s, fc = process_path(target)
    print(f"\nDone: {p} blocks written, {s} skipped, {fc} files changed")

    if args.commit and fc > 0:
        # Determine commit scope
        if "java-backend-fresher" in target:
            rel = target.replace("content/java-backend-fresher/", "")
            module = rel.split("/")[0]
            pillar = get_pillar_for_module(module)
            os.system(f"git add content/java-backend-fresher/{module}/")
            os.system(f'git commit -m "speakable(JBF-{pillar}): {module} — {p} questions (pending_review)"')
            print(f"Committed: speakable(JBF-{pillar}): {module}")


if __name__ == "__main__":
    main()
