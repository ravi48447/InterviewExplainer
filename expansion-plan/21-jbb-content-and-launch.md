# 21 — JBB: Content Write-Up & Public Launch

> **Executor:** AI coding agent operating across 12 parallel per-module
> sub-runs.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content writing (~400 questions) + public flip.

---

## §0 — Front-matter

```yaml
playbook:    21
version:     1.0
status:      ready
wave:        C
domain:      java-backend-beginner
modules:     12
q_target:    400
archetypes:  A:50% B:20% F:25% G:5%
difficulty:  E:60 M:35 H:5
version_pins:
  java: "21"
  spring_boot: "3.3"
  junit: "5.10"
content_rules:
  - "Every jargon term defined inline on first use"
  - "Every code block has public static void main"
  - "Code blocks ≤ 25 lines"
  - "Every Q ends with interviewer-intent section"
  - "Speakable ≤ 280 chars"
  - "No archetype C scenarios"
depends_on:  [19, 20]
tag:         jbb-launch-<YYYY-MM-DD>
```

---

## §1 — TL;DR

- **Input:** JBB scaffold exists, hidden, 0 real content.
- **Action:** Write the 12 modules to the depth + difficulty + archetype
  mix specified in playbook 19. Then flip the launch flag.
- **Output:** JBB live on the public site under
  `/interview/java-backend-beginner`, with the canonical SEO slug
  redirecting; quick-path tile on the homepage links to JBB for the
  "freshers" audience.

## Hard prerequisites

- [ ] Playbook 19 spec is the source of truth.
- [ ] Playbook 20 is DONE (scaffold, hidden, building).
- [ ] You have read the playbook-19 module table, archetype distribution,
      and content rules.

## Why this matters (2 sentences)

JBB is the **fresher funnel** — "java interview questions for freshers"
alone clears ~80k monthly searches and is the entry point for the
next generation of users who eventually upgrade to JBI / JBA. Shipping
JBB at full quality (400 Q, beginner voice rigorously enforced) closes
the credibility gap of "we only serve senior engineers" and feeds the
funnel for the next 5 years.

## Search phrases the launch targets

| Search phrase                                          | Target page                                  |
| ------------------------------------------------------ | -------------------------------------------- |
| `java interview questions for freshers`                | `/java-interview-questions-for-freshers`     |
| `core java interview questions for beginners`          | (alt → app URL)                              |
| `java basic interview questions`                        | (alt → app URL)                              |
| `oops concepts in java interview questions`            | `/interview/java-backend-beginner/java-oop-basics` |
| `collections framework in java interview questions`    | `/interview/java-backend-beginner/java-collections-basics` |
| `tell me about yourself java fresher`                  | `/interview/java-backend-beginner/behavioral-and-fresher-qa` |

## Current state

- JBB scaffold exists (post-playbook 20); zero real content; hidden
  from public.
- ~145 fresher Qs exist in `content/interview/java/backend/beginner`
  (the canonical hub tree) — those are NOT copied; this playbook
  writes fresh, locked-domain-shaped content.

## Target state (measurable)

- 12 modules at depth (400+ Q total).
- Difficulty mix 60/35/5 per module.
- Every code block runnable with `main()`.
- Every answer ends with "What the interviewer is really asking".
- Tile in `LAUNCH_QUICK_PATHS` visible.
- All altSlugs 301 to canonical SEO URL.
- Speakable per-module pass+warn ≥ 90 %.

## Universal per-question rules (RE-READ before writing)

These come from playbook 19's "Content rules (different from JBI)" — repeated
here because they bind the writer's hand:

1. Every Java jargon term is defined on first use inline.
2. Every code block has a `public static void main` entry point.
3. Code blocks are ≤ 25 lines.
4. Every answer ends with a section `kind: "interviewer-intent"` value:
   one short paragraph explaining what the interviewer is really after.
5. Speakable summary ≤ 280 characters.
6. **No** archetype C (scenarios).
7. Archetype mix per module follows playbook-19 table exactly (±5 %).

Add this to your `complete-qa.json` `sections` shape per question:

```json
{ "kind": "interviewer-intent", "value": "What the interviewer is really asking: <one paragraph, 2-3 sentences>" }
```

The schema (playbook 06) treats this as a free-form section kind, so no
schema change required.

## Per-module mini-blueprints

For each of the 12 modules, the writer needs (a) the topic list, (b) the
explicit canonical-question list, (c) the difficulty target, (d) a worked
example. Below is the blueprint for ALL 12.

### 21.1 — `java-syntax-essentials` (40 Q, 70/25/5 difficulty, A=50% B=20% F=25% G=5%)

Topics:
- `hello-world-and-basics` (8 Q)
- `data-types-and-variables` (8 Q)
- `operators-and-expressions` (5 Q)
- `control-flow` (6 Q)
- `arrays-and-strings` (8 Q)
- `comparisons` (5 Q)

Canonical "money" questions (write EXACTLY these titles):

1. How do you write your first Java program (Hello World)?
2. What are primitive data types in Java?
3. What is the difference between int, long, float, and double?
4. What is type casting in Java? (B)
5. How are int and Integer different in Java? (B)
6. What are the loop constructs in Java? (for, while, do-while, for-each)
7. What is the difference between break and continue? (B)
8. How do you declare and initialize an array in Java?
9. Why are Strings immutable in Java?
10. What is the difference between == and .equals() for Strings? (B) — link to comparisons topic
11. What is the difference between String, StringBuilder, and StringBuffer? (B)
12. What is the difference between print, println, and printf? (B)
13. What is autoboxing and unboxing? (A)

Worked archetype-A example (paste into `java-syntax-essentials/hello-world-and-basics/complete-qa.json`):

```json
{
  "module": "java-syntax-essentials",
  "topic": "hello-world-and-basics",
  "questions": [
    {
      "id": "first-java-program-hello-world",
      "title": "How do you write your first Java program (Hello World)?",
      "difficulty": "easy",
      "archetype": "A",
      "tags": ["java", "syntax", "fresher"],
      "sections": [
        { "kind": "headline", "value": "Every Java program lives inside a class and starts running from a special method called main; the JVM (the engine that runs Java bytecode) calls main when you run the program." },
        { "kind": "why",      "value": "Java is a class-based language, which means everything you write — variables, methods, logic — belongs to a class. When you run a Java file, the JVM looks for a method with the exact signature `public static void main(String[] args)` and calls it. `public` means anyone (including the JVM) can call it, `static` means the JVM doesn't need to create an object first, `void` means it returns nothing, and `String[] args` lets you pass command-line arguments." },
        { "kind": "code", "language": "java", "value": "public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println(\"Hello, World!\");\n    }\n}" },
        { "kind": "interviewer-intent", "value": "What the interviewer is really asking: do you understand that Java code lives in classes, that main is the entry point, and what each keyword in `public static void main` actually means. They're not testing your typing — they're testing whether you can explain the boilerplate." },
        { "kind": "followups", "value": [
          "Why is main static in Java?",
          "Can you have multiple main methods in one project?",
          "What happens if you remove the `public` keyword from main?"
        ]}
      ],
      "speakable": {
        "summary": "Every Java program lives in a class and starts at the main method with signature public static void main String args. The JVM calls main when you run the program. public lets the JVM call it, static avoids needing an object, void means no return value.",
        "isCanonical": true
      }
    }
  ]
}
```

### 21.2 — `java-oop-basics` (35 Q, 60/35/5, A=55% B=30% F=10% G=5%)

Topics:
- `classes-and-objects` (7 Q)
- `encapsulation` (5 Q)
- `inheritance` (6 Q)
- `polymorphism` (6 Q)
- `abstraction-interfaces-abstract-classes` (6 Q)
- `comparisons` (5 Q)

Canonical money questions:

1. What is a class and what is an object in Java?
2. What are the four pillars of OOP?
3. What is encapsulation and why is it important?
4. What is inheritance? How does Java implement it?
5. What is polymorphism? Compile-time vs runtime polymorphism. (B)
6. What is the difference between method overloading and method overriding? (B)
7. What is the difference between abstract class and interface? (B)
8. What is a constructor? Default vs parameterised constructor.
9. What is `this` keyword in Java?
10. What is `super` keyword in Java?
11. What is the difference between IS-A and HAS-A relationship? (B)
12. Why does Java not support multiple inheritance (with classes)? (A)

### 21.3 — `java-collections-basics` (30 Q, 60/35/5, A=40% B=40% D=5% F=10% G=5%)

Topics:
- `lists` (6 Q)
- `sets` (5 Q)
- `maps` (6 Q)
- `iteration` (4 Q)
- `comparisons` (6 Q)
- `simple-problems` (3 Q)

Money questions:

1. What is the Collections Framework in Java?
2. What is the difference between Collection and Collections?
3. What is the difference between ArrayList and LinkedList? (B)
4. How does ArrayList grow internally?
5. What is the difference between HashSet, LinkedHashSet, and TreeSet? (B)
6. What is HashMap? How is it different from Hashtable? (B)
7. How does HashMap work internally (at a beginner level)?
8. What is the difference between List, Set, and Map? (B)
9. How do you iterate over a List? Map?
10. What is the difference between Iterator and ListIterator? (B)
11. What is the difference between Comparable and Comparator? (B) — cross-link from java-syntax
12. How would you remove duplicates from a List? (D)
13. How would you check if a string is an anagram of another? (D)

### 21.4 — `java-exceptions-and-io` (25 Q, 60/35/5, A=60% B=20% E=5% F=10% G=5%)

Topics:
- `try-catch-finally` (6 Q)
- `checked-vs-unchecked` (5 Q)
- `custom-exceptions` (3 Q)
- `file-io-basics` (6 Q)
- `comparisons` (3 Q)
- `common-bugs` (2 Q — archetype E)

Money questions:

1. What is an exception? Why do we have them?
2. What is the difference between try, catch, and finally?
3. What is try-with-resources? Why is it preferred?
4. What is the difference between checked and unchecked exceptions? (B)
5. What is the difference between throw and throws? (B)
6. What is the difference between final, finally, and finalize? (B)
7. How do you create a custom exception?
8. How do you read a file in Java? (Files.readAllLines / BufferedReader)
9. How do you write to a file in Java?
10. What is a NullPointerException? How do you avoid it? (E)
11. What is an ArrayIndexOutOfBoundsException? (E)

### 21.5 — `java-concurrency-intro` (20 Q, 60/35/5, A=65% B=25% F=5% G=5%)

Topics:
- `threads-basics` (6 Q)
- `runnable-and-thread` (4 Q)
- `synchronization-basics` (5 Q)
- `comparisons` (3 Q)
- `common-pitfalls` (2 Q)

Money questions:

1. What is a thread in Java?
2. How do you create a thread in Java? (Thread vs Runnable) (B)
3. What is the difference between extending Thread and implementing Runnable? (B)
4. What is a daemon thread?
5. What is the difference between sleep() and wait()? (B)
6. What is synchronized in Java?
7. Why is concurrency hard? (race condition concept, no deep dive)
8. What is the difference between process and thread? (B)
9. What is the lifecycle of a thread?
10. Can a thread restart after it finishes?

### 21.6 — `jdbc-and-jpa-intro` (25 Q, 60/35/5, A=50% B=25% F=20% G=5%)

Topics:
- `jdbc-basics` (8 Q)
- `connection-pooling-intro` (3 Q)
- `prepared-vs-statement` (3 Q)
- `jpa-and-orm-basics` (6 Q)
- `comparisons` (5 Q)

Money questions:

1. What is JDBC?
2. What are the steps to connect to a database in JDBC?
3. What is a PreparedStatement? Why is it preferred over Statement? (B)
4. What is a ResultSet?
5. What is SQL injection? How does PreparedStatement prevent it?
6. What is connection pooling? Why do we need it?
7. What is ORM?
8. What is JPA? What is Hibernate? (B)
9. What is an Entity in JPA?
10. What is the difference between EntityManager.persist and merge? (B) — keep beginner-level

### 21.7 — `spring-boot-starter` (35 Q, 60/35/5, A=45% B=20% F=30% G=5%)

Topics:
- `what-is-spring-boot` (6 Q)
- `first-rest-controller` (7 Q)
- `dependency-injection-basics` (5 Q)
- `application-properties` (5 Q)
- `embedded-server-intro` (4 Q)
- `comparisons` (4 Q)
- `behavioral-spring` (4 Q)

Money questions:

1. What is Spring Boot?
2. What is the difference between Spring and Spring Boot? (B)
3. What does @SpringBootApplication do?
4. How do you create a simple REST controller in Spring Boot?
5. What is @RestController? How is it different from @Controller? (B)
6. What is dependency injection? Why does Spring use it?
7. What is the difference between @Autowired, @Inject, and constructor injection? (B)
8. What is application.properties? application.yml? (B)
9. What is an embedded server? Why does Spring Boot use Tomcat by default?
10. What does @GetMapping vs @PostMapping vs @PutMapping vs @DeleteMapping mean? (B)

### 21.8 — `rest-api-basics` (25 Q, 60/35/5, A=45% B=25% F=25% G=5%)

Topics:
- `http-methods-and-status-codes` (7 Q)
- `requests-and-responses` (5 Q)
- `json-and-content-types` (4 Q)
- `simple-controllers` (5 Q)
- `comparisons` (4 Q)

Money questions:

1. What is a REST API?
2. What are the common HTTP methods and what do they mean?
3. What are common HTTP status codes (200, 201, 400, 401, 403, 404, 500)?
4. What is the difference between PUT and PATCH? (B)
5. What is the difference between GET and POST? (B)
6. What is JSON? How is it different from XML? (B)
7. What is the difference between query parameter and path parameter? (B)
8. What is Postman / curl? How would you test an endpoint?
9. What is `Content-Type: application/json`?
10. What is the difference between request body and request header? (B)

### 21.9 — `git-and-build-basics` (25 Q, 70/30/0, A=30% B=25% E=5% F=40%)

Topics:
- `git-basics` (8 Q)
- `branching-and-merging` (5 Q)
- `remote-and-push` (4 Q)
- `maven-or-gradle-hello-world` (5 Q)
- `comparisons` (3 Q)

Money questions:

1. What is Git? Why do we use it?
2. What is the difference between Git and GitHub? (B)
3. What are the basic Git commands? (init / add / commit / push / pull)
4. What is the difference between `git pull` and `git fetch`? (B)
5. What is a branch in Git? How do you create one?
6. What is the difference between merge and rebase? (B)
7. What is a merge conflict? How do you resolve one? (E)
8. What is the difference between Maven and Gradle? (B)
9. What is `pom.xml`? `build.gradle`?
10. How do you add a dependency in Maven?

### 21.10 — `oop-and-design-basics` (25 Q, 50/45/5, A=50% B=30% F=10% G=10%)

Topics:
- `design-thinking` (4 Q)
- `simple-class-design` (5 Q)
- `design-patterns-intuition` (4 Q)
- `solid-principles-intro` (5 Q)
- `comparisons` (4 Q)
- `behavioral-design` (3 Q)

Money questions:

1. How would you design a simple BankAccount class?
2. How would you design a Library class with Books and Members?
3. What are SOLID principles (at a beginner level)?
4. What is the Single Responsibility Principle?
5. What is the difference between composition and inheritance (intuition)? (B)
6. What is the Singleton pattern (intuition)?
7. What is the Factory pattern (intuition)?
8. How would you design a class hierarchy for shapes (Shape → Circle, Square)?

### 21.11 — `unit-testing-basics` (20 Q, 60/35/5, A=45% B=20% E=5% F=25% G=5%)

Topics:
- `what-is-unit-testing` (5 Q)
- `junit-5-basics` (6 Q)
- `assertions-and-test-structure` (4 Q)
- `intro-to-mocking` (3 Q)
- `comparisons` (2 Q)

Money questions:

1. What is unit testing? Why do we do it?
2. What is the difference between unit, integration, and end-to-end tests? (B)
3. What is JUnit 5? How is it different from JUnit 4? (B)
4. What is the structure of a JUnit 5 test?
5. What is an assertion?
6. What is `assertEquals` vs `assertTrue` vs `assertThrows`?
7. What is a mock? When do you use one?
8. What is Mockito (at a beginner level)?
9. What is `@BeforeEach` vs `@BeforeAll`? (B)
10. What is test-driven development (TDD)?

### 21.12 — `behavioral-and-fresher-qa` (95 Q, 50/45/5, G=95% A=5%)

Topics:
- `tell-me-about-yourself` (10 Q variants)
- `why-this-company` (8 Q)
- `strengths-and-weaknesses` (8 Q)
- `college-project-story` (10 Q)
- `internship-story` (6 Q)
- `teamwork-and-conflict` (10 Q)
- `learning-and-curiosity` (8 Q)
- `failure-and-recovery` (6 Q)
- `goals-and-five-years` (5 Q)
- `meta-and-followups` (5 Q)
- `hr-round-questions` (15 Q)
- `salary-and-negotiation-basics` (4 Q)

For every behavioral question:

```json
{
  "id": "tell-me-about-yourself-java-fresher",
  "title": "Tell me about yourself.",
  "difficulty": "easy",
  "archetype": "G",
  "tags": ["behavioral", "self-intro", "fresher"],
  "sections": [
    { "kind": "headline", "value": "<one-line fresher hook>" },
    { "kind": "why",      "value": "Situation: <education>\nTask: <what kind of role you wanted>\nAction: <a college project + tech stack — Java/Spring/MySQL>\nResult: <what you learned + a metric or proof point>" },
    { "kind": "interviewer-intent", "value": "What the interviewer is really asking: a 60-second narrative they can repeat to their team — degree → project → tech → ambition. Don't list courses; tell a story." },
    { "kind": "followups", "value": [
      "Which course was most useful?",
      "Why did you choose Java over Python?",
      "Walk me through one bug you debugged in that project."
    ]}
  ],
  "speakable": { "summary": "<≤280 chars first-person fresher narrative>", "isCanonical": true }
}
```

## Execution loop

For each module 21.1 → 21.12 (parallelizable):

1. Open the topic's `complete-qa.json` placeholder.
2. Append archetype-correct questions using the canonical list above.
3. Run `python3 scripts/validate_complete_qa.py <file>`.
4. Run `python3 scripts/audit_speakable.py <file>` — accept PASS/WARN, fix FAIL.
5. Commit per ~15 questions:
   ```bash
   git add content/java-backend-beginner/<module>
   git commit -m "content(jbb/<module>): +N questions covering <topic>"
   ```

## Step — Flip launch flags

ONLY after every module hits its Q target AND speakable pass+warn ≥ 90 %.

### A — Add JBB to `LAUNCH_QUICK_PATHS`

In `frontend/lib/launch-config.ts`, add:

```typescript
{
  title:      'Java for Freshers',
  audience:   'beginner',
  language:   'java',
  href:       '/interview/java-backend-beginner',
  description:'Java backend interview prep for 0–2 YOE engineers and fresh grads.',
},
```

### B — Verify tests

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer/frontend
npm test 2>&1 | tail -10
# launch-config test should still pass — JBB is a known reader slug.
```

### C — Final commit + tag

```bash
git add frontend/lib/launch-config.ts
git commit -m "feat(jbb): launch java-backend-beginner publicly"
git tag jbb-launch-$(date +%F)
```

## Quality gates (measurable)

| Gate                                                  | Threshold     | Verify with                                                              |
| ----------------------------------------------------- | ------------- | ------------------------------------------------------------------------ |
| Per-module Q targets met                              | 12 of 12      | jq counts per module                                                     |
| Per-module archetype mix within ±5 % of spec          | 12 of 12      | jq aggregated by `.questions[].archetype`                                 |
| Per-module difficulty mix within ±10 % of spec        | 12 of 12      | jq aggregated by `.questions[].difficulty`                                |
| Speakable pass+warn (domain-wide)                     | ≥ 90 %        | `python3 scripts/audit_speakable.py --domain java-backend-beginner --report` |
| `npm run build` exits 0                               | exit 0        | build log                                                                |
| `/interview/java-backend-beginner` returns 200        | 200           | curl                                                                      |
| 5 SEO/alt URLs 301 to canonical app URL                | 5 of 5        | curl loop                                                                 |
| JBB tile present in homepage quick paths              | yes           | manual visual check                                                       |

## Failure modes & rollback

- **Behavioral module skewed too "we"-heavy:** rewrite to "I"; recheck.
- **Code samples without `main`:** add `main`; re-validate.
- **`interviewer-intent` section missing from > 5 % of Qs:** add it. The
  beginner audience needs this signal.

To unlaunch:

```bash
# Remove JBB tile (1 commit), JBB content + scaffold stays
git revert <commit-from-step-C>
```

## Definition of Done

- [ ] All 12 modules pass per-module quality gates.
- [ ] Domain-wide speakable pass+warn ≥ 90 %.
- [ ] JBB tile live on homepage.
- [ ] Smoke test on canonical SEO URL returns app page after redirect.
- [ ] Tag `jbb-launch-<YYYY-MM-DD>` created.
- [ ] `00-INDEX.md` row for `21` flipped to `DONE`.

## Estimated effort

- **Ideal:** 80 hours (parallel across 12 modules; behavioral module is
  the heaviest at 95 Q).
- **Hard stop:** 120 hours.
