#!/usr/bin/env python3
"""
Enrich java-backend-fresher answer sections using Claude Sonnet.

Replaces thin 3-section content with rich 4-5 section answers:
  - Archetype A (concept): overview + code_example + key_points + speakable_answer
  - Archetype B (comparison): overview + comparison_table + when_to_use + key_points + speakable_answer
  - Archetype E (use-when): overview + step×2 OR tradeoffs + key_points + speakable_answer

Also improves direct_answer and interviewer_intent for each question.

Usage:
    python3 scripts/enrich_jbf_answers.py content/java-backend-fresher/git-basics/branching/complete-qa.json
    python3 scripts/enrich_jbf_answers.py content/java-backend-fresher/git-basics/
    python3 scripts/enrich_jbf_answers.py --all
    python3 scripts/enrich_jbf_answers.py content/java-backend-fresher/git-basics/ --commit
"""
import json, glob, sys, os, re, time, argparse, warnings
from concurrent.futures import ThreadPoolExecutor, as_completed
import threading

_print_lock = threading.Lock()

def tprint(*args, **kwargs):
    with _print_lock:
        print(*args, **kwargs, flush=True)

warnings.filterwarnings("ignore", message="Unverified HTTPS request")

try:
    import httpx
    import anthropic
except ImportError:
    print("ERROR: Missing dependencies. Run: pip install anthropic httpx")
    sys.exit(1)

# SSL bypass for corporate networks
http_client = httpx.Client(verify=False)
client = anthropic.Anthropic(http_client=http_client)
print("WARNING: SSL verification disabled (corporate network mode)", flush=True)

SYSTEM_PROMPT = """You enrich Java backend fresher interview question content.

AUDIENCE: Java freshers (0-2 YOE). They know Java basics but haven't worked in production.
Write at beginner level — clear, grounded in real examples, no unexplained jargon.
Tone: like a senior dev mentoring a CS final-year student. Friendly, direct, practical.

═══════════════════════════════════════════════════════════════
OUTPUT FORMAT
═══════════════════════════════════════════════════════════════

Return ONLY a JSON array. One object per input question, in the same order.
No markdown fences. No explanation. No trailing commas. Valid JSON only.

Shape (N questions):
[
  {
    "direct_answer": "...",
    "interviewer_intent": {
      "testing": "...",
      "common_mistake": "...",
      "to_stand_out": "..."
    },
    "sections": [ <section objects in archetype order> ]
  },
  ...
]

═══════════════════════════════════════════════════════════════
ARCHETYPE RULES — sections in this exact order
═══════════════════════════════════════════════════════════════

ARCHETYPE A (concept / "what is X" / "how does X work"):
  1. overview        — 600-900 chars prose, explain WHY + HOW, one analogy, bold key terms
  2. code_example    — 15-20 lines Java 17, raw code (no fences), inline comments on key lines
  3. when_to_use     — 400-600 chars: "Use this when..." with 2-3 concrete real-world scenarios
  4. common_mistakes — 400-600 chars: 2-3 specific mistakes freshers make, written as a list with **bold** mistake name then explanation
  5. key_points      — JSON array of 5-7 strings starting with **term**: explanation
  6. speakable_answer — 900-1400 chars conversational prose, no backticks, contractions OK

ARCHETYPE B (comparison / "X vs Y" / "difference between"):
  1. overview          — 500-700 chars prose framing both options and what problem each solves
  2. comparison_table  — {"headers":["Aspect","OptionA","OptionB"],"rows":[["dim","v1","v2"],...]} 3-5 rows
  3. when_to_use       — 400-600 chars: "Use X when... Use Y when..." concrete decision rules
  4. common_mistakes   — 400-600 chars: 2-3 specific mistakes freshers make when choosing between the two
  5. key_points        — JSON array of 5-7 strings starting with **term**: explanation
  6. speakable_answer  — 900-1400 chars conversational prose, no backticks

ARCHETYPE E (use-when / decision / "when should you" / "how to choose"):
  Choose E1 or E2 based on the question:
  E1 — sequential decision ("how to choose", "when should you use"):
    1. overview        — 500-700 chars framing the decision
    2. step            — 300-500 chars, title="Step 1: <Factor>", first decision criterion
    3. step            — 300-500 chars, title="Step 2: <Factor>", second decision criterion
    4. common_mistakes — 400-600 chars: freshers mistakes when making this decision
    5. key_points      — JSON array of 5-7 strings
    6. speakable_answer — 900-1400 chars

  E2 — trade-off analysis ("what are the trade-offs", "pros and cons"):
    1. overview        — 500-700 chars framing the concept
    2. tradeoffs       — 600-900 chars structured pros/cons with **bold** headers per trade-off
    3. common_mistakes — 400-600 chars: 2-3 anti-patterns freshers fall into
    4. key_points      — JSON array of 5-7 strings
    5. speakable_answer — 900-1400 chars

═══════════════════════════════════════════════════════════════
SECTION SCHEMAS
═══════════════════════════════════════════════════════════════

overview / when_to_use / tradeoffs / step:
  {"type":"<type>","title":"<descriptive title>","content":"<string>"}
  - content is plain prose with markdown bold (**term**) allowed
  - NO markdown headers (###), NO bullet lists inside

common_mistakes:
  {"type":"common_mistakes","title":"Common Mistakes","content":"<string>"}
  - 2-3 specific mistakes freshers make, NOT generic advice
  - Format: **Mistake Name**: explanation of why freshers do this and what's wrong (1-2 sentences each)
  - Total 400-600 chars

code_example:
  {"type":"code_example","title":"<descriptive title>","content":"<raw Java 17 code>"}
  - content is RAW Java code — no ```java fences, no markdown
  - 15-20 lines, syntactically correct, must compile
  - Use realistic names: OrderService, CustomerRepository, UserController — not Foo/Bar
  - Java 17 features: records, var, List.of(), Optional, text blocks where natural
  - Inline comments ONLY on the key/non-obvious lines
  - No placeholder code: no // TODO, no throw new UnsupportedOperationException()
  - No import statements unless essential to understand the example

comparison_table:
  {"type":"comparison_table","title":"<title>","content":{"headers":["Aspect","OptionA","OptionB"],"rows":[["row1c1","row1c2","row1c3"]]}}
  - content MUST be a dict with "headers" (array) and "rows" (array of arrays)
  - NOT a markdown table string — a proper JSON object
  - First header = dimension/axis (e.g. "Feature", "Aspect", "Behavior")
  - 3-5 rows, each row has exactly len(headers) cells
  - Cell values: short phrases 3-8 words, no full sentences

key_points:
  {"type":"key_points","title":"Key Points","content":["**term**: explanation","..."]}
  - content MUST be a JSON array of strings — NOT a string
  - 5-7 items
  - Each starts with **bold term**: then explanation

speakable_answer:
  {"type":"speakable_answer","title":"How to Answer","content":"<string>"}
  - Written as spoken verbal answer for a Java fresher interview
  - Contractions: it's, don't, you'd, that's, can't, we're — use them
  - NO backticks anywhere — say the word name instead (e.g. "the at-Transactional annotation")
  - NO markdown headers (###) inside content
  - Short sentences, average ≤16 words
  - Structure: (1) direct answer 1-2 sentences, (2) explanation + example, (3) one pitfall, (4) closing

═══════════════════════════════════════════════════════════════
DIRECT ANSWER + INTERVIEWER INTENT
═══════════════════════════════════════════════════════════════

direct_answer: 2-3 sharp sentences. Include the key technical terms. No markdown formatting.
  Target: 150-300 chars. Crisp. The "5-second answer" to the question.

interviewer_intent:
  testing: precise skill/knowledge being assessed (1 sentence)
  common_mistake: specific wrong assumption or anti-pattern freshers fall into (1 sentence)
  to_stand_out: one concrete differentiator that shows depth (1 sentence, actionable)

═══════════════════════════════════════════════════════════════
JAVA 17 + FRESHER CODE STANDARDS
═══════════════════════════════════════════════════════════════

Prefer in code:
  - records over manual POJOs: record Order(Long id, String item) {}
  - var for obvious local types: var orders = repo.findAll();
  - List.of(), Map.of() for immutable collections
  - Optional<T> for nullable returns
  - @Service, @Repository, @RestController, @Transactional annotations
  - Meaningful names: userId, orderList, customerRepository

Avoid in code:
  - Raw types (List without <T>)
  - Thread.sleep() or System.exit()
  - Abstract classes unless the question is about them
  - Complex Spring internals not yet known to freshers

Explain in prose (on first use):
  - JVM (Java Virtual Machine), JDK (Java Development Kit)
  - ORM (Object Relational Mapping), JPA (Java Persistence API)
  - JDBC (Java Database Connectivity), CDI (Context and Dependency Injection)

Do NOT assume knowledge of:
  - Reactive programming, WebFlux
  - Kafka internals, event sourcing
  - Kubernetes, cloud-native patterns
  - CAP theorem, distributed transactions

═══════════════════════════════════════════════════════════════
HARD RULES (failures here break the pipeline)
═══════════════════════════════════════════════════════════════

1. OUTPUT: valid JSON array of N objects — no preamble, no trailing text
2. COUNT: outer array length MUST equal number of input questions
3. ORDER: sections in each object MUST follow archetype order exactly
4. CODE: code_example.content = raw Java code, NEVER wrapped in ```fences```
5. TABLE: comparison_table.content = {"headers":[...],"rows":[[...]]} — NEVER markdown pipe table
6. BULLETS: key_points.content = JSON array of strings — NEVER a plain string
7. COMPILE: Java code must be syntactically valid — no placeholders
8. NO BACKTICKS in speakable_answer content — use plain English names
9. CHAR RANGES: stay within stated ranges — under-generating is a failure
10. TITLES: every section must have a non-generic title (not just "Overview")
"""

MODULE_EXAMPLES = {
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


def is_already_enriched(q: dict) -> bool:
    """True if question has been fully enriched (has common_mistakes section + ≥5 real sections)."""
    secs = (q.get("answer") or {}).get("sections", [])
    real = [s for s in secs if s.get("type") != "speakable_v2"]
    types = {s.get("type") for s in real}
    # Fully enriched = has common_mistakes section AND at least 5 sections
    return "common_mistakes" in types and len(real) >= 5


def validate_enrichment(obj: dict, idx: int) -> list[str]:
    """Non-fatal warnings about an enrichment object."""
    warnings_list = []
    secs = obj.get("sections", [])
    if not secs:
        warnings_list.append(f"  WARN[{idx}]: no sections")
        return warnings_list
    for s in secs:
        t = s.get("type", "?")
        content = s.get("content")
        if t == "key_points" and not isinstance(content, list):
            warnings_list.append(f"  WARN[{idx}]: key_points.content is not a list")
        if t == "comparison_table":
            if not isinstance(content, dict) or "headers" not in content or "rows" not in content:
                warnings_list.append(f"  WARN[{idx}]: comparison_table.content missing headers/rows")
        if t == "code_example" and isinstance(content, str) and "```" in content:
            warnings_list.append(f"  WARN[{idx}]: code_example contains markdown fences (will strip)")
        if t == "speakable_answer" and isinstance(content, str) and "`" in content:
            warnings_list.append(f"  WARN[{idx}]: speakable_answer contains backticks")
    return warnings_list


def fix_enrichment(obj: dict) -> dict:
    """Auto-fix common API output issues."""
    secs = obj.get("sections", [])
    for s in secs:
        t = s.get("type", "?")
        content = s.get("content")

        # Strip markdown fences from code_example
        if t == "code_example" and isinstance(content, str):
            content = re.sub(r'^```\w*\s*', '', content.strip())
            content = re.sub(r'\s*```$', '', content)
            s["content"] = content

        # If key_points.content is a string, try to parse as list
        if t == "key_points" and isinstance(content, str):
            lines = [l.strip().lstrip("- •*").strip() for l in content.splitlines() if l.strip()]
            if len(lines) >= 2:
                s["content"] = lines

        # Remove backticks from speakable_answer
        if t == "speakable_answer" and isinstance(content, str):
            s["content"] = content.replace("`", "'")

    return obj


BATCH_SIZE = 2  # max questions per API call — keeps responses small and fast


def _call_api(q_batch: list, module_name: str, standard_example: str, fpath: str) -> list | None:
    """Call API for a batch of questions. Returns list of enrichment objects or None on failure."""
    user_msg = f"""Enrich these {len(q_batch)} Java fresher interview questions.

Module: {module_name}
Standard example context: {standard_example}

Questions:
{json.dumps(q_batch, indent=2)}

Return a JSON array with exactly {len(q_batch)} enrichment objects, one per question, in order.
Each object: {{"direct_answer":"...","interviewer_intent":{{...}},"sections":[...]}}"""

    for attempt in range(4):
        try:
            resp = client.messages.create(
                model="claude-sonnet-4-6",
                max_tokens=12000,
                system=SYSTEM_PROMPT,
                messages=[{"role": "user", "content": user_msg}],
                timeout=120.0,
            )
            raw = resp.content[0].text.strip()
            raw = re.sub(r'^```(?:json)?\s*', '', raw)
            raw = re.sub(r'\s*```$', '', raw)
            enrichments = json.loads(raw)
            if not isinstance(enrichments, list) or len(enrichments) != len(q_batch):
                tprint(f"  ERROR: expected {len(q_batch)} objects, got "
                       f"{len(enrichments) if isinstance(enrichments, list) else 'invalid'} in {fpath}")
                return None
            return enrichments
        except json.JSONDecodeError as e:
            tprint(f"  ERROR: JSON parse failed for {fpath}: {e}")
            return None
        except Exception as e:
            if "429" in str(e) and attempt < 3:
                wait = 30 * (attempt + 1)
                tprint(f"  429 — waiting {wait}s ({attempt+1}/3)...")
                time.sleep(wait)
            else:
                tprint(f"  ERROR: {e} for {fpath}")
                return None
    return None


def enrich_file(fpath: str, module_name: str) -> tuple[int, int]:
    """Returns (enriched_count, skipped_count)."""
    with open(fpath) as f:
        data = json.load(f)

    is_list = isinstance(data, list)
    questions = data if is_list else data.get("questions", [])

    to_enrich = [(i, q) for i, q in enumerate(questions) if not is_already_enriched(q)]
    if not to_enrich:
        return 0, len(questions)

    standard_example = MODULE_EXAMPLES.get(module_name, "Java 17 Spring Boot application")

    q_data = []
    for i, q in to_enrich:
        archetype = (q.get("speakable_v2") or {}).get("archetype", "A")
        q_data.append({
            "index": i,
            "id": q.get("id", ""),
            "archetype": archetype,
            "question": q.get("question", ""),
            "direct_answer": q.get("direct_answer", ""),
            "interviewer_intent": q.get("interviewer_intent", {}),
        })

    # Process in batches of BATCH_SIZE
    all_enrichments = []
    for batch_start in range(0, len(q_data), BATCH_SIZE):
        batch = q_data[batch_start:batch_start + BATCH_SIZE]
        result = _call_api(batch, module_name, standard_example, fpath)
        if result is None:
            return len(all_enrichments), len(questions) - len(all_enrichments)
        all_enrichments.extend(result)

    enrichments = all_enrichments

    # Apply enrichments
    for patch_idx, (q_idx, q) in enumerate(to_enrich):
        obj = enrichments[patch_idx]

        # Validate + fix
        for w in validate_enrichment(obj, patch_idx):
            tprint(w)
        obj = fix_enrichment(obj)

        # Update direct_answer
        if obj.get("direct_answer"):
            q["direct_answer"] = obj["direct_answer"]

        # Update interviewer_intent
        if isinstance(obj.get("interviewer_intent"), dict):
            q["interviewer_intent"] = obj["interviewer_intent"]

        # Replace answer.sections — drop embedded speakable_v2 from new sections
        new_sections = [s for s in obj.get("sections", []) if s.get("type") != "speakable_v2"]
        if not q.get("answer") or not isinstance(q.get("answer"), dict):
            q["answer"] = {}
        q["answer"]["sections"] = new_sections

    # Write back immediately
    with open(fpath, "w") as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
        f.write("\n")

    return len(to_enrich), len(questions) - len(to_enrich)


def process_path(target: str) -> tuple[int, int, int]:
    """Returns (total_enriched, total_skipped, files_changed)."""
    if os.path.isfile(target):
        files = [target]
    else:
        files = sorted(glob.glob(f"{target}/**/complete-qa.json", recursive=True))
        if not files:
            files = sorted(glob.glob(f"{target}/complete-qa.json"))

    total_enriched = total_skipped = files_changed = 0
    pending = []

    for fpath in files:
        # Quick pre-check
        try:
            d = json.load(open(fpath))
            qs = d if isinstance(d, list) else d.get("questions", [])
            needs = sum(1 for q in qs if not is_already_enriched(q))
            if needs == 0:
                total_skipped += len(qs)
                continue
        except Exception as e:
            print(f"  SKIP (read error): {fpath}: {e}")
            continue

        rel = fpath.replace("content/java-backend-fresher/", "")
        module_name = rel.split("/")[0]
        pending.append((fpath, module_name, needs, len(qs)))

    # Process in parallel with ThreadPoolExecutor
    WORKERS = 3

    def _process(item):
        fpath, module_name, needs, total_qs = item
        rel = fpath.replace("content/java-backend-fresher/", "")
        tprint(f"  Enriching {needs}/{total_qs} questions: {rel}")
        e, s = enrich_file(fpath, module_name)
        if e > 0:
            tprint(f"    ✓ {e} enriched: {rel}")
        return e, s

    with ThreadPoolExecutor(max_workers=WORKERS) as executor:
        futures = {executor.submit(_process, item): item for item in pending}
        for future in as_completed(futures):
            try:
                e, s = future.result()
                total_enriched += e
                total_skipped += s
                if e > 0:
                    files_changed += 1
            except Exception as ex:
                tprint(f"  THREAD ERROR: {ex}")

    return total_enriched, total_skipped, files_changed


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


def main():
    parser = argparse.ArgumentParser(description="Enrich JBF answer sections with Sonnet")
    parser.add_argument("target", nargs="?", help="File path or directory")
    parser.add_argument("--all", action="store_true", help="Process all JBF modules")
    parser.add_argument("--commit", action="store_true", help="Git add+commit after processing")
    args = parser.parse_args()

    if args.all or not args.target:
        target = "content/java-backend-fresher"
    else:
        target = args.target.rstrip("/")

    print(f"Processing: {target}", flush=True)
    e, s, fc = process_path(target)
    print(f"\nDone: {e} questions enriched, {s} skipped, {fc} files changed")

    if args.commit and fc > 0:
        if os.path.isdir(target):
            rel = target.replace("content/java-backend-fresher/", "")
            module = rel.split("/")[0] if rel and rel != "content/java-backend-fresher" else "all"
            pillar = PILLAR_MAP.get(module, "PXX")
            os.system(f"git add {target}")
            os.system(f'git commit -m "enrich(JBF-{pillar}): {module} — {e} questions enriched (sonnet-4-6)"')
            print(f"Committed: enrich(JBF-{pillar}): {module}")


if __name__ == "__main__":
    main()
