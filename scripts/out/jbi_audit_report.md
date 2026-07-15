# Java Backend Intermediate — Answer Quality Audit

**Scope:** all 34 modules, 12 pillars. **Questions audited:** 784.

- **Complete stubs (zero sections):** 131 — listed in §6. These are content gaps, not quality issues.
- **Written answers audited:** 653.
  - With CRITICAL issue(s): 29
  - With MAJOR issue(s): 268
  - Fully clean (zero issues): 21
- **Total issues flagged:** 1740.

All checks are aligned to `content/ANSWER_QUALITY_SPEC.md`. Three UI zones are evaluated:
- **Zone 1** — Quick Answer (`direct_answer` + `key_points`)
- **Zone 2** — Interview Answer (`speakable_answer`)
- **Zone 3** — Deep Dive (`overview`, `phase`, `step`, `before_code`, `after_code`, `comparison_table`, `concept_map`, `problem_statement`, `code_example`, `component`, ...)

Severity legend: **CRITICAL** (answer broken/unusable) · **MAJOR** (violates the constitution; users will notice) · **MINOR** (polish).

## 1. Severity summary

| Severity | Count |
|---|---:|
| CRITICAL | 161 |
| MAJOR | 387 |
| MINOR | 1192 |

## 2. Issues by zone

| Zone | Count |
|---|---:|
| Z1 | 657 |
| Z2 | 160 |
| Z3 | 318 |
| X | 605 |

## 3. Top issue categories (systemic problems to fix first)

| # | Category | Count | Zone |
|---:|---|---:|:-:|
| 1 | `direct_answer_no_bold` | 576 | Z1 |
| 2 | `interviewer_intent_incomplete` | 216 | X |
| 3 | `missing_company_tags` | 204 | X |
| 4 | `stub_no_sections` | 131 | X |
| 5 | `deep_dive_too_short` | 112 | Z3 |
| 6 | `speakable_not_shorter_than_deepdive` | 106 | Z2 |
| 7 | `deep_dive_thin_sections` | 69 | Z3 |
| 8 | `deep_dive_code_heavy` | 59 | Z3 |
| 9 | `zone1_zone2_high_overlap` | 50 | X |
| 10 | `direct_answer_missing` | 43 | Z1 |
| 11 | `speakable_no_bold` | 39 | Z2 |
| 12 | `key_points_missing` | 29 | Z1 |
| 13 | `deep_dive_single_section` | 29 | Z3 |
| 14 | `deep_dive_code_no_language` | 24 | Z3 |
| 15 | `deep_dive_orphan_code` | 13 | Z3 |
| 16 | `comparison_missing_table` | 10 | Z3 |
| 17 | `speakable_slightly_long` | 9 | Z2 |
| 18 | `key_points_bullets_no_bold` | 8 | Z1 |
| 19 | `speakable_has_code_fence` | 5 | Z2 |
| 20 | `direct_answer_equals_speakable_opener` | 4 | X |
| 21 | `deep_dive_no_scaffold` | 2 | Z3 |
| 22 | `speakable_missing` | 1 | Z2 |
| 23 | `key_points_bullets_too_long` | 1 | Z1 |

## 4. Pillar heatmap

| Pillar | Name | CRITICAL | MAJOR | MINOR |
|---|---|---:|---:|---:|
| P01 | Java Language & Core | 149 | 112 | 464 |
| P02 | Spring Ecosystem | 12 | 69 | 147 |
| P03 | Data & Persistence | 0 | 78 | 136 |
| P04 | APIs, Microservices & Messaging | 0 | 37 | 134 |
| P05 | Architecture & Design | 0 | 9 | 51 |
| P06 | System Design | 0 | 9 | 47 |
| P08 | Testing & Quality | 0 | 3 | 31 |
| P09 | DevOps | 0 | 45 | 92 |
| P10 | Cloud | 0 | 13 | 36 |
| P11 | Production | 0 | 4 | 31 |
| P12 | Interview Readiness | 0 | 8 | 23 |

## 5. Module heatmap (top offenders)

| Module | CRITICAL | MAJOR | MINOR | Top categories |
|---|---:|---:|---:|---|
| java-streams | 46 | 60 | 119 | `interviewer_intent_incomplete`×46, `missing_company_tags`×46, `stub_no_sections`×31 |
| java-collections | 30 | 15 | 89 | `missing_company_tags`×36, `stub_no_sections`×30, `interviewer_intent_incomplete`×30 |
| java-concurrency | 28 | 12 | 95 | `stub_no_sections`×28, `interviewer_intent_incomplete`×28, `missing_company_tags`×28 |
| core-java | 27 | 24 | 101 | `direct_answer_no_bold`×32, `interviewer_intent_incomplete`×27, `missing_company_tags`×27 |
| jvm-internals | 18 | 1 | 60 | `stub_no_sections`×18, `interviewer_intent_incomplete`×18, `missing_company_tags`×18 |
| spring-boot | 10 | 33 | 60 | `direct_answer_no_bold`×19, `missing_company_tags`×17, `direct_answer_missing`×10 |
| spring-core | 2 | 13 | 31 | `direct_answer_no_bold`×13, `direct_answer_missing`×9, `interviewer_intent_incomplete`×9 |
| sql-databases | 0 | 40 | 73 | `direct_answer_no_bold`×38, `deep_dive_thin_sections`×21, `deep_dive_too_short`×20 |
| nosql-mongodb | 0 | 22 | 45 | `direct_answer_no_bold`×20, `interviewer_intent_incomplete`×10, `deep_dive_too_short`×10 |
| cicd | 0 | 22 | 32 | `direct_answer_no_bold`×25, `speakable_not_shorter_than_deepdive`×18, `deep_dive_thin_sections`×5 |
| rest-api | 0 | 19 | 82 | `direct_answer_no_bold`×52, `interviewer_intent_incomplete`×20, `speakable_not_shorter_than_deepdive`×12 |
| spring-data-jpa | 0 | 19 | 32 | `direct_answer_no_bold`×25, `deep_dive_too_short`×14, `missing_company_tags`×7 |
| messaging-events | 0 | 16 | 35 | `direct_answer_no_bold`×34, `deep_dive_too_short`×11, `speakable_not_shorter_than_deepdive`×2 |
| redis-caching | 0 | 16 | 18 | `direct_answer_no_bold`×13, `speakable_not_shorter_than_deepdive`×9, `deep_dive_code_heavy`×5 |
| aws-cloud | 0 | 13 | 36 | `direct_answer_no_bold`×34, `speakable_not_shorter_than_deepdive`×12, `deep_dive_code_no_language`×2 |
| docker | 0 | 10 | 14 | `direct_answer_no_bold`×12, `speakable_not_shorter_than_deepdive`×9, `comparison_missing_table`×1 |
| system-design | 0 | 8 | 25 | `direct_answer_no_bold`×21, `speakable_not_shorter_than_deepdive`×4, `deep_dive_code_heavy`×4 |
| behavioral | 0 | 8 | 23 | `direct_answer_no_bold`×12, `deep_dive_thin_sections`×11, `speakable_not_shorter_than_deepdive`×4 |
| git-build-tools | 0 | 7 | 31 | `direct_answer_no_bold`×22, `interviewer_intent_incomplete`×8, `speakable_not_shorter_than_deepdive`×7 |
| kubernetes | 0 | 6 | 15 | `direct_answer_no_bold`×12, `speakable_not_shorter_than_deepdive`×6, `speakable_slightly_long`×3 |
| design-patterns | 0 | 6 | 14 | `direct_answer_no_bold`×13, `deep_dive_code_heavy`×6, `deep_dive_thin_sections`×1 |
| spring-security | 0 | 4 | 19 | `direct_answer_no_bold`×19, `speakable_has_code_fence`×3, `key_points_bullets_no_bold`×1 |
| observability | 0 | 4 | 13 | `direct_answer_no_bold`×13, `speakable_not_shorter_than_deepdive`×4 |
| architecture-patterns | 0 | 3 | 37 | `direct_answer_no_bold`×28, `speakable_no_bold`×7, `deep_dive_code_heavy`×3 |
| unit-testing | 0 | 3 | 31 | `direct_answer_no_bold`×15, `missing_company_tags`×10, `speakable_no_bold`×5 |
| microservices | 0 | 2 | 17 | `direct_answer_no_bold`×17, `deep_dive_code_heavy`×2 |
| system-design-cases | 0 | 1 | 22 | `direct_answer_no_bold`×12, `deep_dive_code_no_language`×6, `zone1_zone2_high_overlap`×3 |
| production-sre | 0 | 0 | 18 | `direct_answer_no_bold`×16, `direct_answer_equals_speakable_opener`×1, `speakable_slightly_long`×1 |
| spring-batch | 0 | 0 | 5 | `direct_answer_no_bold`×5 |

## 6. Complete stubs — no answer.sections at all (131)

These questions exist with titles/metadata but have zero answer content. They need full authoring, not editing.

| Module | Topic | Question |
|---|---|---|
| core-java | comparisons | Abstract class vs Interface in Java — detailed comparison |
| core-java | comparisons | Checked vs Unchecked exceptions in Java — comparison |
| core-java | comparisons | Heap vs Stack memory in Java — comparison |
| core-java | exception-handling | What are the best practices for exception handling in Java? |
| core-java | exception-handling | What is the difference between throw and throws in Java? |
| core-java | exception-handling | When does the finally block NOT execute in Java? |
| core-java | generics-wildcards | What are generics in Java and why do we use them? |
| core-java | generics-wildcards | What is the PECS principle in Java generics? |
| core-java | generics-wildcards | What is the difference between bounded and unbounded wildcards in Java? |
| core-java | generics-wildcards | Why can't you create a generic array in Java? |
| core-java | java-io-nio | How do you read a large file efficiently in Java? |
| core-java | java-io-nio | Java I/O streams — byte streams vs character streams |
| core-java | java-io-nio | Java NIO vs IO — what's the difference? |
| core-java | java-io-nio | Serializable vs Externalizable in Java — what's the difference? |
| core-java | java-io-nio | What are channels and buffers in Java NIO? |
| core-java | oop-principles | How does Java solve the diamond problem with default methods? |
| core-java | oop-principles | What is the difference between an anonymous inner class and a lambda in Java? |
| core-java | oop-principles | What is the equals() and hashCode() contract in Java? |
| core-java | reflection-annotations | What are meta-annotations in Java? (@Retention, @Target, @Documented) |
| core-java | reflection-annotations | What is reflection in Java and when do we use it? |
| core-java | reflection-annotations | What is the performance cost of Java reflection? |
| core-java | string-handling | How does the String.intern() method work in Java? |
| core-java | string-handling | What is the difference between equals() and contentEquals() on String? |
| core-java | string-handling | Why is String immutable in Java? |
| java-collections | algorithm-complexity | How to analyze the time complexity of a recursive algorithm? |
| java-collections | algorithm-complexity | Time complexity of common Java collection operations |
| java-collections | algorithm-complexity | What is Big-O notation? |
| java-collections | algorithm-complexity | What is amortized complexity? (ArrayList.add, HashMap.put) |
| java-collections | comparisons | Array vs ArrayList in Java — comparison |
| java-collections | comparisons | HashMap vs ConcurrentHashMap — comparison |
| java-collections | comparisons | Stack vs Queue in Java — comparison |
| java-collections | dynamic-programming | 0/1 Knapsack problem using DP in Java |
| java-collections | dynamic-programming | Fibonacci series using DP in Java |
| java-collections | dynamic-programming | Memoization vs tabulation in DP — what's the difference? |
| java-collections | dynamic-programming | What is dynamic programming? (Java introduction) |
| java-collections | problem-solving-patterns | Backtracking pattern in Java |
| java-collections | problem-solving-patterns | Fast and slow pointers (Floyd's cycle detection) in Java |
| java-collections | problem-solving-patterns | Sliding window technique in Java |
| java-collections | problem-solving-patterns | Top-K elements using a heap in Java |
| java-collections | problem-solving-patterns | Two-pointers technique in Java |
| java-collections | scenario-based | Detect a loop in a linked list in Java |
| java-collections | scenario-based | How do you check if two strings are anagrams in Java? |
| java-collections | scenario-based | Implement an LRU Cache in Java |
| java-collections | scenario-based | Reverse a linked list in Java — iterative and recursive |
| java-collections | scenario-based | Two Sum problem in Java |
| java-collections | sorting-and-searching | How do you do binary search in Java? |
| java-collections | sorting-and-searching | How do you sort custom objects in Java? |
| java-collections | sorting-and-searching | Java sorting algorithms — overview |
| java-collections | sorting-and-searching | What is Timsort and why does Java use it? |
| java-collections | trees-and-graphs | BFS vs DFS in Java — when to use each? |
| java-collections | trees-and-graphs | Binary tree vs binary search tree in Java |
| java-collections | trees-and-graphs | Graph representation in Java — adjacency list vs matrix |
| java-collections | trees-and-graphs | Implement Dijkstra's shortest-path algorithm in Java |
| java-collections | trees-and-graphs | Tree traversal in Java — inorder, preorder, postorder |
| java-concurrency | comparisons | Future vs CompletableFuture — comparison |
| java-concurrency | comparisons | Virtual threads vs platform threads — comparison |
| java-concurrency | comparisons | volatile vs synchronized — comparison |
| java-concurrency | completable-future | Exception handling in CompletableFuture |
| java-concurrency | completable-future | What is CompletableFuture in Java? |
| java-concurrency | completable-future | thenCompose vs thenCombine in CompletableFuture |
| java-concurrency | concurrency-patterns | Double-checked locking pattern in Java |
| java-concurrency | concurrency-patterns | Producer-consumer pattern in Java |
| java-concurrency | concurrency-patterns | Thread-safe singleton patterns in Java |
| java-concurrency | concurrent-collections | LinkedBlockingQueue vs ArrayBlockingQueue in Java |
| java-concurrency | concurrent-collections | Why do we need concurrent collections in Java? |
| java-concurrency | java-memory-model | Data race vs race condition — are they the same? |
| java-concurrency | java-memory-model | What is the Java Memory Model (JMM)? |
| java-concurrency | java-memory-model | volatile vs Atomic variables in Java |
| java-concurrency | scenario-based | How do you avoid deadlock in Java? |
| java-concurrency | scenario-based | How do you detect deadlock in Java using a thread dump? |
| java-concurrency | synchronization-and-locks | Synchronized method vs synchronized block in Java |
| java-concurrency | synchronization-and-locks | What is synchronization in Java? |
| java-concurrency | thread-pools-and-executor | FixedThreadPool vs CachedThreadPool vs SingleThreadExecutor |
| java-concurrency | thread-pools-and-executor | RejectedExecutionHandler in Java thread pools |
| java-concurrency | thread-pools-and-executor | Why use thread pools in Java? |
| java-concurrency | threads-and-lifecycle | Thread interruption in Java — interrupt, isInterrupted, interrupted |
| java-concurrency | threads-and-lifecycle | Thread.sleep() vs Object.wait() in Java |
| java-concurrency | threads-and-lifecycle | Thread.start() vs Thread.run() in Java |
| java-concurrency | threads-and-lifecycle | What is a thread in Java? |
| java-concurrency | virtual-threads | Virtual threads pinning problem in Java |
| java-concurrency | virtual-threads | What are virtual threads in Java 21? |
| java-concurrency | virtual-threads | When should you use virtual threads in Java? |
| java-streams | comparisons | Imperative vs functional Java code — comparison |
| java-streams | comparisons | Optional vs null in Java — comparison |
| java-streams | comparisons | Stream vs Collection in Java — comparison |
| java-streams | java-14-to-17-features | Pattern matching for instanceof in Java |
| java-streams | java-21-features | Pattern matching for switch in Java 21 |
| java-streams | java-21-features | Sequenced collections in Java 21 |
| java-streams | java-21-features | Structured concurrency in Java 21 |
| java-streams | java-21-features | Virtual threads in Java 21 — what are they? |
| java-streams | java-9-to-11-features | Java 10 `var` — local variable type inference |
| java-streams | java-9-to-11-features | Java 11 HttpClient API |
| java-streams | java-9-to-11-features | Java 9 factory methods — List.of, Set.of, Map.of |
| java-streams | java-9-to-11-features | What is the Java 9 Module System (JPMS)? |
| java-streams | lambdas-functional-interfaces | Method references in Java — four types |
| java-streams | lambdas-functional-interfaces | Predicate, Function, Consumer, Supplier in Java |
| java-streams | lambdas-functional-interfaces | What is a functional interface in Java? |
| java-streams | lambdas-functional-interfaces | What is a lambda expression in Java? |
| java-streams | optional-api | Optional.of vs ofNullable vs empty in Java |
| java-streams | optional-api | Optional.orElse vs orElseGet — what's the difference? |
| java-streams | optional-api | Should Optional be used as a return type? (Best practices) |
| java-streams | optional-api | What is Optional in Java and why was it added? |
| java-streams | scenario-based | Flatten a list of lists using Java Streams |
| java-streams | scenario-based | How do you convert a List to a Map in Java Streams? |
| java-streams | scenario-based | How do you group objects by a field using Java Streams? |
| java-streams | scenario-based | When to use parallel vs sequential streams in Java |
| java-streams | streams-api | Collectors.groupingBy and partitioningBy in Java |
| java-streams | streams-api | How does lazy evaluation work in Java Streams? |
| java-streams | streams-api | Intermediate vs terminal operations in Java Streams |
| java-streams | streams-api | What is the Java Stream API? |
| java-streams | streams-api | When should you use parallel streams in Java? |
| java-streams | streams-api | flatMap vs map in Java Streams — what's the difference? |
| java-streams | streams-api | reduce() vs collect() in Java Streams |
| jvm-internals | comparisons | AOT vs JIT compilation — comparison |
| jvm-internals | comparisons | Minor GC vs Full GC — comparison |
| jvm-internals | garbage-collection | Full GC vs Minor GC in Java — what's the difference? |
| jvm-internals | garbage-collection | G1 GC vs CMS GC in Java |
| jvm-internals | garbage-collection | Generational garbage collection in Java (young vs old gen) |
| jvm-internals | garbage-collection | What is garbage collection in Java? |
| jvm-internals | garbage-collection | ZGC and Shenandoah — low-latency GC in Java |
| jvm-internals | jvm-architecture | Heap vs stack memory in the JVM |
| jvm-internals | jvm-architecture | Metaspace vs PermGen in Java 8 |
| jvm-internals | jvm-architecture | What is the difference between JVM, JRE, and JDK? |
| jvm-internals | jvm-tuning | JVM flags — -Xms, -Xmx, and friends |
| jvm-internals | jvm-tuning | Tuning JVM for microservices in containers |
| jvm-internals | memory-analysis | Heap dump analysis with Eclipse MAT |
| jvm-internals | memory-analysis | How do you find a memory leak in Java production? |
| jvm-internals | profiling-and-debugging | How do you profile a Java application? |
| jvm-internals | profiling-and-debugging | Java Flight Recorder (JFR) — what is it? |
| jvm-internals | scenario-based | How do you investigate an OutOfMemoryError in production? |
| jvm-internals | scenario-based | How do you reduce GC pause times in Java? |

## 7. Written answers with CRITICAL issues (29)

These have some content but are missing at least one whole zone, which means the page renders without Quick Answer, Interview Answer, or Deep Dive.

| Module | Topic | Question | Critical issues |
|---|---|---|---|
| core-java | reflection-annotations | Java Reflection API | `key_points_missing` |
| core-java | reflection-annotations | Custom Annotations | `key_points_missing` |
| core-java | reflection-annotations | Compile-Time Annotation Processing | `key_points_missing` |
| java-streams | lambdas-functional-interfaces | Lambdas and Functional Interfaces | `key_points_missing` |
| java-streams | lambdas-functional-interfaces | Java Streams API | `key_points_missing` |
| java-streams | lambdas-functional-interfaces | Optional — Proper Usage | `key_points_missing` |
| java-streams | streams-api | Stream API — Intermediate and Terminal Operations | `key_points_missing` |
| java-streams | streams-api | Advanced Collectors and Custom Collectors | `key_points_missing` |
| java-streams | streams-api | Stream Performance and Parallel Streams | `key_points_missing` |
| java-streams | streams-api | Lambda Expressions and Functional Interfaces | `key_points_missing` |
| java-streams | streams-api | Optional — Proper Usage | `key_points_missing` |
| java-streams | streams-api | Method References and Effective Use | `key_points_missing` |
| java-streams | java-14-to-17-features | Switch Expressions and Enhanced Switch | `key_points_missing` |
| java-streams | java-14-to-17-features | Text Blocks and String Features | `key_points_missing` |
| java-streams | java-14-to-17-features | Java Records (Java 16+) | `key_points_missing` |
| java-streams | java-14-to-17-features | Sealed Classes and Pattern Matching | `key_points_missing` |
| java-streams | java-14-to-17-features | Functional Interfaces and Lambda Expressions | `key_points_missing` |
| java-streams | java-14-to-17-features | Optional — Proper Usage and Anti-Patterns | `key_points_missing` |
| spring-core | dependency-injection | Constructor Injection vs Field Injection vs Setter Injection | `key_points_missing`, `speakable_missing` |
| spring-boot | profiles-and-properties | Configuring Server Port | `key_points_missing` |
| spring-boot | profiles-and-properties | DataSource Properties | `key_points_missing` |
| spring-boot | profiles-and-properties | HikariCP Configuration | `key_points_missing` |
| spring-boot | profiles-and-properties | JPA and Hibernate Properties | `key_points_missing` |
| spring-boot | profiles-and-properties | spring.jpa.hibernate.ddl-auto Values | `key_points_missing` |
| spring-boot | profiles-and-properties | Application Context Path | `key_points_missing` |
| spring-boot | profiles-and-properties | Tomcat Thread Pool Configuration | `key_points_missing` |
| spring-boot | profiles-and-properties | SQL Query Logging | `key_points_missing` |
| spring-boot | profiles-and-properties | Maximum Server Connections | `key_points_missing` |
| spring-boot | profiles-and-properties | Connection and Read Timeouts | `key_points_missing` |

## 8. Per-question findings (written answers only)

_Issues grouped by module → topic → question. Empty questions omitted._

### Module: `architecture-patterns`

#### Topic: `architectural-styles`

- **Backend for Frontend (BFF) Pattern** (`backend-for-frontend-bff-pattern`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Service Mesh Architecture** (`service-mesh-architecture`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Layered Architecture in Spring Boot — Controller → Service → Repository** (`layered-architecture-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `clean-architecture`

- **Clean Architecture Layers and the Dependency Rule** (`clean-architecture-layers-dependency-rule`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Use Case / Interactor Pattern in Java** (`use-case-interactor-pattern-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Organizing a Spring Boot Project with Clean Architecture** (`spring-boot-clean-architecture-project-structure`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Build the Use Case Layer — Application Logic Without Spring', 0.61)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 3 fenced block(s) missing language tag — breaks syntax highlighting.
- **Rich Domain Model vs Anemic Domain Model** (`rich-domain-model-vs-anemic-domain-model`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **Unit Testing with Clean Architecture in Java** (`unit-testing-clean-architecture-java`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Test Interactors with In-Memory Stubs, Not Mockito Chains', 0.7)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **Clean Architecture vs Layered Architecture** (`clean-architecture-vs-layered-architecture`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Handling Cross-Cutting Concerns in Clean Architecture** (`cross-cutting-concerns-clean-architecture`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Repository Pattern in Clean Architecture** (`repository-pattern-clean-architecture`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **When NOT to Use Clean Architecture** (`when-not-to-use-clean-architecture`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `cqrs-and-event-sourcing`

- **Event Sourcing Pattern — Storing State as a Sequence of Events** (`event-sourcing-pattern`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `domain-driven-design`

- **Bounded Context — What It Is and Why It Matters** (`bounded-context-ddd`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **Entity vs Value Object in Domain-Driven Design** (`entity-vs-value-object-ddd`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Aggregate and Aggregate Root — Rules and Design** (`aggregate-aggregate-root-ddd`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Domain Events — What They Are and How to Implement Them** (`domain-events-ddd-java`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **Repository Pattern in Domain-Driven Design** (`repository-pattern-ddd`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Domain Services vs Application Services in DDD** (`domain-services-vs-application-services-ddd`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **Ubiquitous Language — What It Is and How to Build It** (`ubiquitous-language-ddd`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **Anti-Corruption Layer Pattern in DDD** (`anti-corruption-layer-ddd`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **DDD Tactical Patterns with Spring Boot — Practical Recipe** (`ddd-tactical-patterns-spring-boot`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 2 section(s) >60% code: [('step', 'Step 1 — Model the Aggregate as Pure Java with No Framework Imports', 0.68), ('step', 'Step 2 — Define the Repository Interface in the Domain and Implement in Infrastructure', 0.67)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Strategic DDD: Context Mapping Patterns** (`strategic-ddd-context-mapping-patterns`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `hexagonal-architecture`

- **Hexagonal Architecture (Ports and Adapters) — Clean Boundaries** (`hexagonal-architecture-ports-adapters`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **Ports and Adapters — Hexagonal Architecture** (`ports-and-adapters-hexagonal-architecture`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `microservices-patterns`

- **Monolithic vs Microservices vs Modular Monolith** (`monolith-vs-microservices-vs-modular-monolith`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Shared Database vs Database per Service** (`shared-database-vs-database-per-service`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Strangler Fig Pattern — Incrementally Migrating from Monolith to Microservices** (`strangler-fig-pattern-migration`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `aws-cloud`

#### Topic: `aws-core-services`

- **Core AWS Services Overview for Java Developers** (`core-aws-services-overview`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Deploying with AWS CodePipeline and CodeBuild** (`aws-codepipeline-codebuild-deployment`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'The buildspec.yml: Compile, Test, Build Image, Push to ECR', 0.61)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **CloudWatch Metrics and Alarms for Spring Boot** (`cloudwatch-metrics-alarms-spring-boot`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 51% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Auto Scaling Groups — How They Work** (`auto-scaling-groups-how-they-work`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 51% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **VPC Fundamentals for Java Developers (Subnets, Security Groups)** (`vpc-fundamentals-java-developers`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.

#### Topic: `aws-messaging`

- **SQS vs SNS vs EventBridge — Messaging Service Comparison** (`sqs-sns-eventbridge-comparison`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 52% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `ecs-and-fargate`

- **Deploying Spring Boot to AWS ECS Fargate** (`deploy-spring-boot-ecs-fargate`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 51% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `gcp-and-azure-overview`

- **Azure Core Services for Java Backend Developers** (`azure-core-services-java-backend`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Deploying Spring Boot to Azure Spring Apps** (`azure-spring-apps-deployment`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Azure Service Bus vs Event Hubs — Messaging Choice for Java** (`azure-service-bus-vs-event-hub-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Azure Key Vault Integration with Spring Boot** (`azure-key-vault-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Azure Blob Storage with Spring Boot (azure-storage-blob)** (`azure-blob-storage-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Azure SQL Database vs Cosmos DB for Java Apps** (`azure-sql-vs-cosmos-db-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Azure Active Directory Authentication with Spring Security** (`azure-active-directory-spring-security`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Azure Container Registry + AKS Deployment Pipeline** (`azure-container-registry-aks-pipeline`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Azure Application Insights for Spring Boot Observability** (`azure-application-insights-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Azure Functions with Java — Serverless Spring** (`azure-functions-java-serverless`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Managed Identity for Passwordless Azure Resource Access** (`azure-managed-identity-passwordless`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **Azure API Management for Spring Boot Microservices** (`azure-api-management-spring-boot-microservices`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Core GCP Services for Java Backend Developers** (`core-gcp-services-java-backend-developer`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Deploying a Spring Boot Application to Google Cloud Run** (`deploy-spring-boot-app-cloud-run`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Integrating Google Cloud Pub/Sub with Spring Boot** (`google-cloud-pubsub-with-spring`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Cloud Spanner vs Cloud SQL: When to Use Each** (`cloud-spanner-vs-cloud-sql`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Integrating GCP Secret Manager with Spring Boot** (`gcp-secret-manager-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Google BigQuery Explained and Java Query Examples** (`bigquery-java-query`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 59% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Using Google Cloud Storage in Java Applications** (`gcp-cloud-storage-java-application`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 61% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Implementing GCP IAM Authentication in Spring Boot** (`gcp-iam-authentication-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **GKE vs Cloud Run: Choosing the Right Platform for Java Applications** (`gke-vs-cloud-run-java-apps`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Monitoring Java Applications on GCP with Cloud Monitoring** (`monitor-java-applications-gcp-cloud-monitoring`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `iam-and-security`

- **IAM Roles and Policies — Least Privilege Principle** (`iam-roles-least-privilege`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 51% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **AWS Secrets Manager vs Parameter Store** (`secrets-manager-vs-parameter-store`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 61% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `rds-with-spring`

- **RDS vs Aurora vs DynamoDB — When to Choose** (`rds-aurora-dynamodb-comparison`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `s3-storage`

- **S3 Integration with Spring Boot** (`s3-integration-spring-boot`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 67% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `serverless`

- **AWS Lambda with Spring Cloud Function** (`lambda-spring-cloud-function`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `behavioral`

#### Topic: `career-growth`

- **Learning a New Technology Under Deadline** (`learn-new-technology-quickly`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 347 words across 5 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 4 section(s) under 60 words: [('step', 50), ('step', 31), ('step', 53)]. Spec: 'merge with adjacent'.
- **Staying Current with Java and Backend Technology** (`stay-current-with-java-technology`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 344 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 50)]. Spec: 'merge with adjacent'.

#### Topic: `conflict-resolution`

- **Handling Technical Disagreements** (`handle-technical-disagreements`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 63% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 48)]. Spec: 'merge with adjacent'.

#### Topic: `delivering-under-pressure`

- **Prioritizing Multiple Urgent Tasks** (`prioritize-multiple-urgent-tasks`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Ensuring Code Quality Under Time Pressure** (`ensure-code-quality-under-pressure`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 301 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 57)]. Spec: 'merge with adjacent'.

#### Topic: `failure-and-learning`

- **Project Failure and Lessons Learned** (`project-failure-and-lessons-learned`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('step', 34), ('step', 55)]. Spec: 'merge with adjacent'.

#### Topic: `star-method`

- **Debugging a Complex Production Issue** (`debug-complex-production-issue`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 3 section(s) under 60 words: [('step', 55), ('step', 43), ('step', 57)]. Spec: 'merge with adjacent'.

#### Topic: `technical-leadership`

- **Significantly Improving System Performance** (`improve-system-performance`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 3 section(s) under 60 words: [('step', 55), ('step', 25), ('step', 47)]. Spec: 'merge with adjacent'.
- **Taking End-to-End Project Ownership** (`end-to-end-project-ownership`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 61% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('step', 51), ('step', 58)]. Spec: 'merge with adjacent'.
- **Approach to Code Reviews** (`approach-code-reviews`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 328 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 52)]. Spec: 'merge with adjacent'.
- **Advocating for Technical Debt Reduction** (`advocate-for-technical-debt`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('step', 25)]. Spec: 'merge with adjacent'.
- **Mentoring a Junior Developer** (`mentor-junior-developer`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 55% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('step', 37)]. Spec: 'merge with adjacent'.

### Module: `cicd`

#### Topic: `cicd-fundamentals`

- **Matrix Strategy for Multi-Version Java Testing in GitHub Actions** (`matrix-strategy-multi-version-java-testing`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 56% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Triggering Workflows on Pull Requests and Protecting Branches** (`trigger-workflows-pull-requests-protect-branches`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 50% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `github-actions`

- **Building a Java CI/CD Pipeline with GitHub Actions** (`java-cicd-pipeline-github-actions`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Managing Secrets in GitHub Actions** (`manage-secrets-github-actions`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Caching Maven and Gradle Dependencies in GitHub Actions** (`cache-maven-gradle-dependencies-github-actions`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 60% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Deploying a Spring Boot Application with GitHub Actions** (`deploy-spring-boot-github-actions`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **GitHub Actions Reusable Workflows Explained** (`github-actions-reusable-workflows`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Setting Up SonarQube Code Quality Checks in GitHub Actions** (`sonarqube-code-quality-github-actions`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Environment-Specific Deployments with GitHub Actions** (`environment-specific-deployments-github-actions`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `infrastructure-as-code`

- **Terraform Core Concepts: Providers, Resources, State, and Modules** (`terraform-core-concepts-providers-resources-state-modules`) — 0 CRITICAL, 2 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 199 words across 5 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('reference_group', 'Modules: Reusable Infrastructure Packages', 0.64)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_slightly_long` [speakable_answer] — Speakable is 442 words — upper bound. Trim unless topic is genuinely deep.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 4 section(s) under 60 words: [('overview', 39), ('reference_group', 34), ('reference_group', 37)]. Spec: 'merge with adjacent'.
- **Terraform State Management and Why Remote State Matters** (`terraform-state-management-remote-state`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 69% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Using terraform plan and apply Safely** (`terraform-plan-and-apply-safely`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 80% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_slightly_long` [speakable_answer] — Speakable is 354 words — upper bound. Trim unless topic is genuinely deep.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 5 section(s) under 60 words: [('overview', 31), ('step', 45), ('step', 53)]. Spec: 'merge with adjacent'.
- **Terraform Modules: What They Are and How to Create One** (`what-is-terraform-module-how-to-create-one`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 70% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 53)]. Spec: 'merge with adjacent'.
- **Managing Terraform Variables and Workspaces** (`terraform-variables-and-workspaces`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 321 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **terraform import vs terraform taint: Key Differences** (`terraform-import-vs-terraform-taint`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 272 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 36)]. Spec: 'merge with adjacent'.
- **Handling Terraform State Locking** (`terraform-state-locking`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 70% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Provisioning Java Spring Boot App Infrastructure with Terraform** (`provision-spring-boot-infrastructure-with-terraform`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 65% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 5 section(s) under 60 words: [('overview', 56), ('step', 57), ('step', 50)]. Spec: 'merge with adjacent'.
- **Terraform Data Sources: What They Are and When to Use Them** (`terraform-data-sources-when-to-use`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 72% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Testing Terraform Configurations** (`how-to-test-terraform-configurations`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 73% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `jenkins-pipelines`

- **Declarative Jenkins Pipeline for Spring Boot** (`declarative-jenkins-pipeline-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Jenkinsfile Structure and Syntax** (`jenkinsfile-structure-declarative`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 57% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Jenkins Credentials and Secrets Management** (`jenkins-credentials-secrets-management`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 58% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **SonarQube Integration with Jenkins** (`jenkins-sonarqube-integration`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 55% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Deploying to Kubernetes from Jenkins** (`jenkins-deploy-kubernetes`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **GitHub Actions vs Jenkins: Key Differences** (`github-actions-vs-jenkins`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 52% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `core-java`

#### Topic: `exception-handling`

- **Checked vs Unchecked Exceptions in Java** (`checked-vs-unchecked-exceptions-java-when-to-use`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **try-with-resources and AutoCloseable** (`try-with-resources-autocloseable`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 92% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Java Optional: Eliminating NullPointerException** (`java-optional-prevent-null-pointer-exception`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 268 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 89% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `generics-wildcards`

- **Java Generics and Type Erasure** (`java-generics-type-erasure-explained`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 88% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `oop-principles`

- **The Four Pillars of OOP — Encapsulation, Inheritance, Polymorphism, Abstraction** (`oop-four-pillars-java`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 3 *_code section(s) with <12 words of prose: [('before_code', 'Theater: private field, but the caller controls all logic'), ('before_code', 'Inheritance misused — hierarchy collapses')] — code blocks should be framed, not dumped.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('step', 58)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 86% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Encapsulation and Access Modifiers in Java (private, protected, public, default)** (`encapsulation-access-modifiers-java`) — 0 CRITICAL, 1 MAJOR, 0 MINOR
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('before_code', 'Fake Encapsulation — Caller Drives All Logic')] — code blocks should be framed, not dumped.
- **this vs super Keyword in Java** (`this-vs-super-keyword-java`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 71% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Constructor Chaining in Java — this() and super()** (`constructor-chaining-java`) — 0 CRITICAL, 1 MAJOR, 0 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 74% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
- **Method Overloading vs Method Overriding in Java** (`method-overloading-vs-overriding-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Abstraction in Java — When to Use Abstract Class vs Interface** (`abstraction-abstract-class-vs-interface`) — 0 CRITICAL, 1 MAJOR, 0 MINOR
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 2 *_code section(s) with <12 words of prose: [('before_code', 'Coupled — Concrete Type Locks Every Caller to ArrayList'), ('after_code', 'Abstracted — Callers Depend Only on the List Contract')] — code blocks should be framed, not dumped.
- **Abstract Class vs Interface in Java** (`abstract-class-vs-interface-java-when-to-use`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Default and Static Methods in Interfaces** (`java-default-static-methods-interfaces`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 336 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 88% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Object Class Methods — toString, hashCode, equals, clone, finalize** (`object-class-methods-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Immutability in Java — How and Why** (`how-to-create-immutable-class-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **The static Keyword in Java** (`static-keyword-java-explained`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Inner Classes in Java — Static, Non-Static, Local, and Anonymous** (`inner-classes-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · X · `zone1_zone2_high_overlap` — 88% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `reflection-annotations`

- **Java Reflection API** (`reflection-basics`) — 1 CRITICAL, 4 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 78 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.86)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Custom Annotations** (`custom-annotations`) — 1 CRITICAL, 4 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 81 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.86)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Compile-Time Annotation Processing** (`annotation-processing`) — 1 CRITICAL, 4 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 77 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.85)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `scenario-based`

- **Java Is Always Pass-by-Value** (`java-pass-by-value-not-reference`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **== vs .equals() in Java** (`difference-between-equals-and-double-equals-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **final vs finally vs finalize in Java** (`final-finally-finalize-java-difference`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 95% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Autoboxing, Unboxing, and the Integer Cache** (`java-autoboxing-unboxing-integer-cache`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **HashMap Internals: Buckets, Hashing, and Resizing** (`how-does-hashmap-work-internally-java`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'The Fix: Use Records for Keys, Immutability for Safety', 0.64)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **HashMap Resize and Rehash Internals** (`hashmap-resize-rehash-internals`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Predicate, Consumer, Supplier, Function — The 4 Core Functional Interfaces** (`predicate-consumer-supplier-function`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Functional Interfaces and Lambdas in Java** (`java-functional-interfaces-lambdas-explained`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Method References in Java — Four Types Explained** (`java-method-references-four-types`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Java Streams: Lazy Evaluation and Common Operations** (`java-streams-lazy-evaluation-common-operations`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **map() vs flatMap() in Java Streams** (`java-stream-map-vs-flatmap-difference`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Java Stream Collectors — groupingBy, partitioningBy, toMap** (`java-stream-collectors-groupingby-tomap`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 93% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Stream Collectors — joining, reducing, collectingAndThen, toUnmodifiableList** (`stream-collectors-joining-reducing`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Java var: Local Variable Type Inference** (`java-var-local-variable-type-inference-limitations`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 170 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Java Records: Immutable Data Carriers** (`java-record-classes-what-they-are-when-to-use`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 332 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Java Records — What the Compiler Generates** (`java-records-generated-code`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 345 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 91% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Sealed Classes and Pattern Matching** (`sealed-classes-pattern-matching`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 85% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Java Garbage Collection: GC Roots, Mark-and-Sweep, and Generational GC** (`how-java-garbage-collection-works`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **WeakReference vs SoftReference vs PhantomReference** (`weak-soft-phantom-references`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `string-handling`

- **String vs StringBuilder vs StringBuffer** (`string-vs-stringbuilder-vs-stringbuffer-java`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 87% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **String Pool and Interning** (`string-pool-interning`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `design-patterns`

#### Topic: `behavioral-patterns`

- **Observer Pattern — How Spring Events Use It** (`observer-pattern-spring-events-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Strategy Pattern — Replacing If-Else Chains** (`strategy-pattern-replace-if-else-java`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Extract Each Branch into Its Own Class Behind a Shared Interface', 0.67)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('step', 56)]. Spec: 'merge with adjacent'.
- **Template Method Pattern — Spring's JdbcTemplate** (`template-method-pattern-spring-jdbctemplate`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `creational-patterns`

- **Singleton Pattern — Thread-Safe Implementations (DCL vs Enum)** (`singleton-thread-safe-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Factory Method vs Abstract Factory — When to Use Each** (`factory-method-vs-abstract-factory-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Builder Pattern in Java — Fluent API Design** (`builder-pattern-fluent-api-java`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Separate Required Fields from Optional Defaults', 0.66)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `design-patterns-legacy`

- **Repository Pattern vs DAO Pattern in Spring Data** (`repository-vs-dao-pattern-spring-data`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'What a True DDD Repository Looks Like vs a Spring Data DAO', 0.63)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Circuit Breaker Pattern — Resilience4j Implementation** (`circuit-breaker-pattern-resilience4j-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Specification Pattern for Complex Query Building** (`specification-pattern-complex-queries-java`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Encapsulate Each Filter as a Reusable Specification Lambda', 0.71)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **CQRS Pattern — Separate Read/Write Models in Spring** (`cqrs-pattern-spring-java`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('component', 'The Command Side: Rich Domain Model with Business Invariants', 0.68)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `solid-principles`

- **SOLID Principles in Java — Practical Application and Trade-offs** (`solid-principles-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `structural-patterns`

- **Decorator Pattern — Adding Behavior Without Subclassing** (`decorator-pattern-java-behavior-without-subclassing`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'The Mechanics: Same Interface, Wrapped Delegation, Composable Stacks', 0.73)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Proxy Pattern — How Spring AOP Implements It** (`proxy-pattern-spring-aop-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `docker`

#### Topic: `docker-compose`

- **Docker Compose for Local Spring Boot + PostgreSQL + Redis Dev** (`docker-compose-spring-boot-postgres-redis`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 62% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `docker-fundamentals`

- **JVM Memory in Docker: -Xmx vs Container Limits and OOMKilled** (`jvm-memory-docker-container-limits`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Docker Volumes: Named Volumes vs Bind Mounts** (`docker-volumes-named-vs-bind-mounts`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 59% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Docker Health Checks for Spring Boot with Actuator** (`docker-health-checks-spring-boot`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 59% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Debugging Spring Boot in Docker: Logs, Exec, and Remote Debug** (`debugging-spring-boot-in-docker`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Container Resource Limits for JVM Apps: CPU and Memory Configuration** (`docker-container-resource-limits-jvm`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 61% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_slightly_long` [speakable_answer] — Speakable is 373 words — upper bound. Trim unless topic is genuinely deep.

#### Topic: `docker-networking`

- **Docker Networking: Bridge vs Host vs Overlay** (`docker-networking-bridge-host-overlay`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `docker-security`

- **Running Non-Root User in Docker: Security Best Practice for Java** (`docker-non-root-user-java-security`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 65% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Docker Image Security: Scanning and Best Practices for Java** (`docker-image-scanning-security-best-practices`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 55% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Docker Secrets vs Environment Variables for Sensitive Config** (`docker-environment-variables-vs-secrets`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 61% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `multi-stage-builds`

- **Multi-Stage Dockerfile for Spring Boot: Smaller, Faster Images** (`multistage-dockerfile-spring-boot`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 58% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **Docker Layer Caching: How It Works and Optimization Tips** (`docker-layer-caching-optimization`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `git-build-tools`

#### Topic: `code-quality-gates`

- **Git hooks for enforcing code quality** (`git-hooks-code-quality`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `git-internals`

- **Git interactive rebase — squashing and editing commits** (`git-interactive-rebase-squashing-commits`) — 0 CRITICAL, 0 MAJOR, 3 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Monorepo vs polyrepo strategies** (`monorepo-vs-polyrepo`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Git bisect for finding the commit that introduced a bug** (`git-bisect-find-bug-commit`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `git-workflows`

- **Git merge vs rebase — when to use each** (`git-merge-vs-rebase`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Git flow vs trunk-based development** (`git-flow-vs-trunk-based-development`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **How to resolve merge conflicts effectively** (`resolving-merge-conflicts`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Cherry-pick vs merge vs rebase for backporting fixes** (`cherry-pick-vs-merge-vs-rebase-backporting`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 55% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `gradle-build`

- **Writing a Gradle Build Script for a Spring Boot Project** (`gradle-build-script-spring-boot`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 66% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Gradle Dependency Management Explained** (`gradle-dependency-management`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **The Gradle Wrapper: What It Is and Why to Use It** (`gradle-wrapper-why-use-it`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Configuring Gradle for Multi-Module Projects** (`gradle-multi-module-project`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Gradle Incremental Build: How It Works** (`gradle-incremental-build`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `maven-build`

- **Maven Lifecycle Phases Explained** (`maven-lifecycle-phases`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Maven Dependency Scopes: compile, test, provided, runtime** (`maven-dependency-scopes`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 64% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Maven POM Inheritance and Aggregation** (`maven-pom-inheritance-aggregation`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Maven Transitive Dependencies and Conflict Resolution** (`maven-transitive-dependencies-conflict-resolution`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Creating a Multi-Module Maven Project** (`maven-multi-module-project`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Maven Profiles for Environment-Specific Builds** (`maven-profiles-environment-builds`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Publishing an Artifact to Nexus with Maven** (`publish-artifact-nexus-maven`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Maven vs Gradle: Key Differences** (`maven-vs-gradle-comparison`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Publishing a Java Library to Maven Central with Gradle** (`publish-java-library-maven-central-gradle`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `java-collections`

#### Topic: `collections-internals`

- **List vs Set vs Map — When to Use Each Collection Type** (`list-vs-set-vs-map-overview`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 331 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **ArrayList vs LinkedList — When to Use Each** (`arraylist-vs-linkedlist`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **HashMap vs TreeMap vs LinkedHashMap** (`hashmap-vs-treemap-vs-linkedhashmap`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **How HashSet Works Internally in Java** (`how-hashset-works-internally-java`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 90% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **How HashMap Handles Collisions (Chaining to Tree at 8)** (`hashmap-collision-handling`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 93% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **HashMap vs Hashtable vs ConcurrentHashMap** (`hashmap-vs-hashtable-vs-concurrenthashmap-java`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 92% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **PriorityQueue — Heap Structure and Use Cases** (`priorityqueue-heap-structure`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **ArrayDeque vs LinkedList as Queue/Stack** (`arraydeque-vs-linkedlist-queue-stack`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 342 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 90% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Comparable vs Comparator in Java** (`comparable-vs-comparator`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Sorting with Comparator: thenComparing and reversed** (`comparator-thencomparing-reversed`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 287 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Fail-Fast vs Fail-Safe Iterators in Java** (`fail-fast-vs-fail-safe-iterators-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Iterator vs ListIterator — Traversal and Modification** (`iterator-vs-listiterator-java`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **TreeSet and TreeMap — Sorted Collections and NavigableSet/NavigableMap** (`treeset-treemap-navigable`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 341 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 87% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **EnumMap and EnumSet — Performance Advantages** (`enummap-enumset-performance`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 318 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **WeakHashMap — Garbage Collection-Friendly Cache** (`weakhashmap-gc-cache`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **CopyOnWriteArrayList — When and Why** (`copyonwritearraylist-when-and-why`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Collections.unmodifiableList vs List.of vs List.copyOf** (`unmodifiable-list-vs-list-of-vs-list-copyof`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 321 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Choosing the Right Collection — Decision Guide** (`choosing-the-right-collection`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 304 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 93% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Collections Utility Class — sort, shuffle, frequency, unmodifiable** (`collections-utility-class-methods`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 100% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Map compute(), merge(), computeIfAbsent() — Atomic Map Operations** (`map-compute-merge-methods`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Stream API with Collections — toList, toSet, toMap, groupingBy** (`stream-api-with-collections`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 316 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 93% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

### Module: `java-concurrency`

#### Topic: `completable-future`

- **Future vs CompletableFuture in Java** (`java-future-vs-completablefuture-comparison`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 285 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **CompletableFuture Chains: thenApply, thenCompose, exceptionally** (`completablefuture-chains`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 319 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `concurrency-patterns`

- **CountDownLatch vs CyclicBarrier vs Semaphore** (`countdownlatch-vs-cyclicbarrier-vs-semaphore`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 92% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **ThreadLocal — Use Cases and Pitfalls** (`threadlocal-use-cases-pitfalls`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 93% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `concurrent-collections`

- **ConcurrentHashMap Internals** (`concurrenthashmap-internals`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **BlockingQueue and the Producer-Consumer Pattern** (`blockingqueue-producer-consumer`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 333 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 95% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `java-memory-model`

- **Java Memory Model and Happens-Before** (`java-memory-model-happens-before`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **volatile — Visibility Guarantee in Java** (`volatile-visibility-guarantee`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 94% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `scenario-based`

- **Parallel Streams — When They Help vs Hurt** (`parallel-streams-when-they-help-vs-hurt`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 337 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Race Condition — How to Identify and Fix** (`race-condition-identify-and-fix`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Liveness Hazards: Deadlock, Livelock, and Starvation** (`liveness-hazards-deadlock-livelock-starvation`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 92% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `synchronization-and-locks`

- **How the synchronized Keyword and Monitors Work** (`synchronized-keyword-monitors`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 90% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **synchronized vs ReentrantLock — Which Lock to Use?** (`synchronized-vs-reentrantlock`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 321 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 85% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **ReentrantReadWriteLock — Use Cases and Pitfalls** (`reentrant-read-write-lock`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 96% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **StampedLock and Optimistic Reads** (`stampedlock-optimistic-reads`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 345 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 92% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **wait/notify vs Condition.await/signal** (`wait-notify-vs-condition-await-signal`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **AtomicInteger vs synchronized — When to Use Each** (`atomicinteger-vs-synchronized`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 90% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `thread-pools-and-executor`

- **Java ExecutorService — Thread Pool Types** (`executorservice-thread-pool-types`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 332 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 89% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Thread Pool Sizing: CPU-Bound vs IO-Bound** (`threadpool-sizing-cpu-io-bound`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 92% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **ForkJoinPool and RecursiveTask** (`forkjoinpool-recursive-task`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 320 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `threads-and-lifecycle`

- **Thread vs Runnable vs Callable** (`thread-vs-runnable-vs-callable`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 300 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 98% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Java Thread Lifecycle — The 6 States** (`java-thread-lifecycle-states`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Daemon Threads in Java — Background Workers That Don't Block Shutdown** (`daemon-threads-java-explained`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 95% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `virtual-threads`

- **Java 21 Virtual Threads and Structured Concurrency** (`java21-virtual-threads-structured-concurrency`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 92% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

### Module: `java-streams`

#### Topic: `java-14-to-17-features`

- **Switch Expressions and Enhanced Switch** (`switch-expressions`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 13 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.94)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 13)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Text Blocks and String Features** (`text-blocks-string-templates`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 9 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.97)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 9)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Java Records (Java 16+)** (`java-records`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 16 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.95)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 16)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Sealed Classes and Pattern Matching** (`sealed-classes`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 15 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.95)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 15)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Functional Interfaces and Lambda Expressions** (`functional-interfaces-lambda`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 11 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.95)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 11)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Optional — Proper Usage and Anti-Patterns** (`optional-best-practices`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 11 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.96)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 11)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `lambdas-functional-interfaces`

- **Lambdas and Functional Interfaces** (`lambdas-functional-interfaces`) — 1 CRITICAL, 4 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 70 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.86)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Java Streams API** (`streams-api`) — 1 CRITICAL, 4 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 75 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.89)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Optional — Proper Usage** (`optional-usage`) — 1 CRITICAL, 4 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 61 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.87)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `streams-api`

- **Stream API — Intermediate and Terminal Operations** (`stream-api-operations`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 13 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.95)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 13)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Advanced Collectors and Custom Collectors** (`collectors-advanced`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 9 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.96)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 9)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Stream Performance and Parallel Streams** (`stream-performance`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 13 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.94)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 13)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Lambda Expressions and Functional Interfaces** (`lambda-fundamentals`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 11 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.94)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 11)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Optional — Proper Usage** (`optional-best-practices`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 13 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.95)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 13)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Method References and Effective Use** (`method-references`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 9 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.97)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 9)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

### Module: `jvm-internals`

#### Topic: `garbage-collection`

- **JVM Garbage Collectors Compared — G1, ZGC, Shenandoah, Parallel** (`gc-algorithms-comparison`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 92% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **GC Tuning and GC Log Analysis** (`gc-tuning-gclog-analysis`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 92% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `jvm-architecture`

- **JVM Runtime Data Areas — Heap, Stack, Metaspace, Code Cache** (`jvm-memory-areas`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **ClassLoader Hierarchy and Parent Delegation** (`classloader-hierarchy`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 95% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **JIT Compilation and Tiered Compilation in HotSpot** (`jit-compilation-tiered-compilation`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `jvm-tuning`

- **JVM Startup Optimization and Virtual Threads (Java 21)** (`jvm-startup-optimization-virtual-threads`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 89% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **JVM Settings for Spring Boot in Docker/Kubernetes** (`spring-boot-jvm-container-settings`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `memory-analysis`

- **Java Memory Leak Detection — Heap Dump Analysis** (`memory-leak-detection-heap-dump`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **StackOverflowError vs OutOfMemoryError in Java** (`java-stackoverflow-vs-outofmemoryerror`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 94% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `profiling-and-debugging`

- **Java Profiling in Production — async-profiler and JFR** (`java-profiling-async-profiler`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 93% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **Thread Dumps and Deadlock Analysis** (`thread-dumps-deadlock-analysis`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 91% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `scenario-based`

- **Java Reflection and Performance Cost** (`java-reflection-performance`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 86% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **NIO vs Traditional IO** (`java-nio-vs-traditional-io`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Java Module System (JPMS)** (`java-module-system-jpms`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Annotation Processing at Compile Time and Runtime** (`annotation-processing-runtime`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 94% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

### Module: `kubernetes`

#### Topic: `kubernetes-configuration`

- **ConfigMaps and Secrets: Spring Boot Config Management in Kubernetes** (`kubernetes-configmaps-secrets-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kubernetes Namespaces and RBAC for Multi-Team Environments** (`kubernetes-namespaces-rbac-multi-team`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 61% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `kubernetes-fundamentals`

- **Deploying Spring Boot to Kubernetes: Step-by-Step** (`deploying-spring-boot-kubernetes-step-by-step`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Debugging OOMKilled Spring Boot in Kubernetes** (`spring-boot-oomkilled-kubernetes-debugging`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `kubernetes-networking`

- **Kubernetes Service Types: ClusterIP vs NodePort vs LoadBalancer vs Ingress** (`kubernetes-service-types-clusterip-nodeport-loadbalancer-ingress`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 60% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kubernetes Pod Networking: How Pods Communicate Across Nodes** (`kubernetes-pod-networking-cross-node`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `kubernetes-scaling`

- **Horizontal Pod Autoscaler (HPA) for Spring Boot Services** (`horizontal-pod-autoscaler-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_slightly_long` [speakable_answer] — Speakable is 363 words — upper bound. Trim unless topic is genuinely deep.

#### Topic: `kubernetes-workloads`

- **Kubernetes Core Objects: Pod, Deployment, Service, ConfigMap** (`kubernetes-core-objects-pod-deployment-service`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 65% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_slightly_long` [speakable_answer] — Speakable is 375 words — upper bound. Trim unless topic is genuinely deep.
- **Kubernetes Probes: Liveness vs Readiness vs Startup for Spring Boot** (`liveness-readiness-startup-probes-spring-boot`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 58% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kubernetes Resource Requests and Limits for JVM Apps** (`kubernetes-resource-requests-limits-jvm`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_slightly_long` [speakable_answer] — Speakable is 353 words — upper bound. Trim unless topic is genuinely deep.
- **Kubernetes Rolling Updates and Rollbacks** (`kubernetes-rolling-updates-rollbacks`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **StatefulSets and PersistentVolumes for Stateful Java Services** (`kubernetes-persistent-volumes-statefulsets`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `messaging-events`

#### Topic: `event-sourcing`

- **Event Sourcing: Storing State as an Immutable Event Log** (`event-sourcing-storing-state-as-events`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `kafka-architecture`

- **Event Schema Evolution: Backward and Forward Compatibility** (`event-schema-evolution-backward-compatibility`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kafka Integration Testing with @EmbeddedKafka** (`embedded-kafka-testing-spring-boot`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 302 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `kafka-patterns`

- **Outbox Pattern: Reliable Event Publishing with Spring Boot** (`outbox-pattern-reliable-event-publishing`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Consumer Group Fan-Out: Multiple Services Consuming the Same Events** (`consumer-group-fan-out-event-patterns`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **KafkaTemplate and ProducerFactory Configuration** (`kafka-template-producer-factory-config`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 307 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@KafkaListener — Partitions, Consumer Groups, and Concurrency** (`kafka-listener-partitions-groupid-concurrency`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 309 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kafka Acknowledgment Modes — Manual vs Auto** (`acknowledgment-mode-manual-vs-auto`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 326 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@RetryableTopic — Non-Blocking Retry in Spring Kafka** (`retryable-topic-non-blocking-retry`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 323 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Transactional Kafka with Spring — Consume-Process-Produce Atomically** (`transactional-kafka-producers-spring`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 348 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kafka Serialization — JSON vs Avro in Spring** (`kafka-json-avro-serialization-spring`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 262 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Consumer Group Rebalancing — Causes and Mitigation** (`kafka-consumer-group-rebalancing`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 306 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kafka Producer Throughput — Batching and Compression** (`kafka-producer-batching-compression`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 335 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kafka Consumer Lag Monitoring and Alerting** (`kafka-consumer-lag-monitoring`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kafka Message Headers — Metadata and Context Propagation** (`kafka-headers-message-metadata`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 321 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `message-guarantees`

- **Delivery Semantics: Exactly-Once vs At-Least-Once vs At-Most-Once** (`exactly-once-vs-at-least-once-delivery`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Idempotent Consumers: Safe Duplicate Event Processing** (`idempotent-consumers-event-deduplication`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Dead Letter Exchanges and Retry Strategies in RabbitMQ** (`dead-letter-exchange-retry`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Building the Three-Queue Topology — Main, Retry, and Graveyard', 0.74)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `messaging-fundamentals`

- **Event-Driven vs Request-Driven Architecture Trade-offs** (`event-driven-vs-request-driven-architecture`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 60% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Domain Events vs Integration Events: When to Use Each** (`domain-events-vs-integration-events`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 52% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `rabbitmq`

- **Dead Letter Queue: Handling Failed Events in Spring** (`dead-letter-queue-spring-kafka-rabbitmq`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **RabbitMQ Exchange Types: Direct, Fanout, Topic, and Headers** (`rabbitmq-exchange-types`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `key_points_bullets_no_bold` [key_points] — 1/5 bullets have no **bold anchor** concept name.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 88% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
- **RabbitMQ vs Kafka: Choosing the Right Message Broker** (`rabbitmq-vs-kafka`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Setting Up Spring AMQP: RabbitTemplate and @RabbitListener** (`spring-amqp-setup`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **RabbitMQ Acknowledgment Modes: Auto vs Manual** (`rabbitmq-acknowledgment-modes`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **RabbitMQ Message Durability and Persistence** (`rabbitmq-message-durability`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **RabbitMQ Publisher Confirms: Reliable Message Publishing** (`rabbitmq-publisher-confirms`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **RabbitMQ Clustering and High Availability** (`rabbitmq-clustering-high-availability`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Testing Spring AMQP with Embedded RabbitMQ** (`spring-amqp-testing-embedded`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `scenario-based`

- **Saga Pattern: Distributed Transactions via Choreography and Orchestration** (`saga-pattern-distributed-transactions-choreography`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Eventual Consistency: Handling Race Conditions in Event-Driven Systems** (`eventual-consistency-race-conditions-event-driven`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Competing Consumers Pattern in RabbitMQ** (`competing-consumers-pattern`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Kafka Listener Error Handling — SeekToCurrentErrorHandler** (`default-error-handler-seek-to-current`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 313 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `spring-kafka`

- **Spring Cloud Stream: Binder Abstraction for Event-Driven Services** (`spring-cloud-stream-event-driven-microservices`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `microservices`

#### Topic: `api-gateway`

- **API Gateway with Spring Cloud Gateway** (`api-gateway-spring-cloud-gateway`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Cross-Cutting Filters — Auth, Rate Limiting, and Circuit Breaking', 0.62)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Spring Cloud Gateway: Routing and Filters** (`spring-cloud-gateway-routing-filters`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `circuit-breaker`

- **Circuit Breaker Pattern with Resilience4j** (`circuit-breaker-resilience4j`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Resilience4j Circuit Breaker in Spring Cloud** (`resilience4j-circuit-breaker-spring-cloud`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `communication-patterns`

- **REST vs gRPC vs Messaging — Inter-Service Communication** (`rest-vs-grpc-vs-messaging-interservice`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Spring Cloud Stream: Messaging Abstraction** (`spring-cloud-stream-messaging-abstraction`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `config-management`

- **Spring Cloud Config Server: Centralized Configuration** (`spring-cloud-config-server-centralized-configuration`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Config Profiles and Environment-Specific Configuration** (`spring-cloud-config-profiles-environment-specific-configuration`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `distributed-tracing`

- **Distributed Tracing with Micrometer Tracing (Spring Boot 3)** (`distributed-tracing-correlation-id`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Distributed Tracing with Micrometer Tracing and Zipkin** (`distributed-tracing-micrometer-zipkin`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `feign-client`

- **Feign vs RestTemplate vs WebClient** (`feign-client-vs-resttemplate-vs-webclient`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `load-balancing`

- **Spring Cloud LoadBalancer: Client-Side Load Balancing** (`spring-cloud-loadbalancer-client-side`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `migration-strategies`

- **Strangler Fig Pattern — Monolith to Microservices Migration** (`strangler-fig-pattern-monolith-migration`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `saga-pattern`

- **Saga Pattern — Distributed Transactions in Microservices** (`saga-pattern-distributed-transactions`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Orchestration — A Central Coordinator That Knows the Whole Story', 0.68)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `service-design`

- **Database-per-Service Pattern in Microservices** (`database-per-microservice-patterns`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `service-discovery`

- **Eureka vs Consul: Service Discovery Comparison** (`eureka-service-discovery-vs-consul`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `service-mesh`

- **Sidecar Pattern and Service Mesh (Istio)** (`sidecar-pattern-service-mesh`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `nosql-mongodb`

#### Topic: `document-model`

- **MongoDB Document Model vs Relational Model** (`mongodb-document-model-vs-relational-model`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Embedding vs Referencing Documents — Design Decision** (`mongodb-embedding-vs-referencing-documents`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 77% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `elasticsearch-basics`

- **Elasticsearch vs PostgreSQL for Search** (`elasticsearch-vs-postgresql-search`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 55% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 49)]. Spec: 'merge with adjacent'.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **Elasticsearch Index Mapping: What It Is and How to Configure It** (`elasticsearch-index-mapping`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Elasticsearch Query Types: match vs term vs bool** (`elasticsearch-match-vs-term-vs-bool`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_no_scaffold` — Deep dive only has narrative sections (['overview', 'reference_group']) — no phase/step/code_example/comparison_table for structure.
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 59)]. Spec: 'merge with adjacent'.
- **Integrating Elasticsearch with Spring Boot** (`elasticsearch-spring-boot-integration`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 313 words across 5 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 3 section(s) under 60 words: [('overview', 49), ('step', 48), ('step', 57)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `direct_answer_equals_speakable_opener` — direct_answer is identical to speakable opener — duplicated content.
- **Inverted Index: The Foundation of Full-Text Search** (`inverted-index-full-text-search`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 254 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Elasticsearch Pagination: Handling Deep Result Sets** (`elasticsearch-pagination-deep-results`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 324 words across 4 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('problem_statement', 45)]. Spec: 'merge with adjacent'.
- **Elasticsearch Cluster Architecture: Nodes, Shards, and Replicas** (`elasticsearch-cluster-nodes-shards-replicas`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 74% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 55)]. Spec: 'merge with adjacent'.
- **Elasticsearch Aggregations: How to Aggregate and Analyze Data** (`elasticsearch-aggregations`) — 0 CRITICAL, 0 MAJOR, 3 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 54)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `direct_answer_equals_speakable_opener` — direct_answer is identical to speakable opener — duplicated content.
- **Keeping Elasticsearch in Sync with the Primary Database** (`elasticsearch-sync-primary-database`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 75% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 58)]. Spec: 'merge with adjacent'.
- **Elasticsearch Analyzers and Tokenizers Explained** (`elasticsearch-analyzers-tokenizers`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z1 · `key_points_bullets_too_long` [key_points] — 1/5 bullets exceed 45 words — defeats the 30-second scan.
- **MongoDB Atlas Search vs Elasticsearch** (`mongodb-atlas-search-vs-elasticsearch`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `mongodb-core`

- **MongoDB Aggregation Pipeline: $match, $group, $lookup** (`mongodb-aggregation-pipeline-match-group-lookup`) — 0 CRITICAL, 2 MAJOR, 4 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 294 words across 4 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 3 section(s) >60% code: [('recipe', 'Recipe 1 — $match + $group: Count orders per customer in the last 30 days', 1.0), ('recipe', 'Recipe 2 — $lookup: Join orders with customer details', 1.0)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 3 section(s) under 60 words: [('recipe', 0), ('recipe', 0), ('recipe', 0)]. Spec: 'merge with adjacent'.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 3 fenced block(s) missing language tag — breaks syntax highlighting.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **MongoDB Transactions (Multi-Document ACID)** (`mongodb-multi-document-acid-transactions`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 284 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'Configuring and using @Transactional with MongoDB in Spring Boot')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **MongoDB Performance: explain() and Query Optimization** (`mongodb-performance-explain-query-optimization`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 299 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'Using explain() in the MongoDB shell and interpreting the output')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **MongoDB Replica Sets and Read Preferences** (`mongodb-replica-sets-read-preferences`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 332 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'Configuring read preferences in Spring Boot')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `mongodb-indexes`

- **Indexing in MongoDB: Compound, Sparse, and TTL Indexes** (`mongodb-indexing-compound-sparse-ttl`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 296 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'Declaring indexes on a Spring Data MongoDB entity')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `mongodb-with-spring`

- **Spring Data MongoDB Repository Queries** (`spring-data-mongodb-repository-queries`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 292 words across 5 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 4 section(s) under 60 words: [('step', 28), ('step', 21), ('step', 25)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Change Streams with Spring Data MongoDB** (`mongodb-change-streams-spring-data`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 235 words across 5 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 4 section(s) under 60 words: [('step', 22), ('step', 26), ('step', 20)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

### Module: `observability`

#### Topic: `alerting`

- **Alerting Strategy: SLOs, SLAs, and Error Budgets for Java Services** (`alerting-strategy-slos-slas-error-budgets-java-services`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `distributed-log-aggregation`

- **Log Aggregation with the ELK Stack for Java Services** (`log-aggregation-elk-stack-elasticsearch-logstash-kibana`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Log Aggregation in Kubernetes for Java Apps** (`kubernetes-log-aggregation`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 51% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `distributed-tracing`

- **Distributed Tracing with Spring Cloud Sleuth and Zipkin/Jaeger** (`distributed-tracing-spring-cloud-sleuth-zipkin-jaeger`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Production Debugging with Distributed Traces — Finding Latency Bottlenecks** (`production-debugging-distributed-traces-latency-bottlenecks`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **OpenTelemetry vs Micrometer vs Spring Sleuth — Choosing the Right Library** (`opentelemetry-vs-micrometer-vs-sleuth-comparison`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `health-checks-and-probes`

- **Health Checks vs Readiness Checks — What to Expose on /actuator/health** (`health-checks-vs-readiness-checks-actuator-health`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 52% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `metrics-and-micrometer`

- **Three Pillars of Observability: Metrics, Logs, and Traces** (`three-pillars-observability-metrics-logs-traces`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Micrometer Metrics: Counters, Timers, and Gauges in Spring Boot** (`micrometer-counters-timers-gauges-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `prometheus-and-grafana`

- **Grafana Dashboards for Spring Boot Service Health** (`grafana-dashboards-spring-boot-service-health`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `structured-logging`

- **Structured Logging with SLF4J and Logback in Spring Boot** (`slf4j-logback-structured-logging-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Log Levels: TRACE, DEBUG, INFO, WARN, ERROR** (`log-levels-when-to-use-each`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Structured Logging with Logback and Correlation IDs** (`structured-logging-logback-correlation-ids`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 52% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `production-sre`

#### Topic: `chaos-engineering`

- **Chaos Engineering: What It Is and How to Apply It** (`chaos-engineering-what-is-it-how-to-apply`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `direct_answer_equals_speakable_opener` — direct_answer is identical to speakable opener — duplicated content.

#### Topic: `debugging-production`

- **Diagnosing CPU Spikes in Java Applications** (`cpu-spikes-java-applications-debugging`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `memory-leaks`

- **Reducing Java Application Memory Footprint** (`reduce-java-application-memory-footprint`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `performance-troubleshooting`

- **Sizing Thread Pools for Optimal Throughput** (`how-to-size-thread-pools-for-optimal-throughput`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Diagnosing and Fixing Slow Database Queries in Spring Boot** (`diagnose-and-fix-slow-database-query-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Latency vs Throughput: Definitions and Optimization Strategies** (`latency-vs-throughput-optimization-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Benchmarking Java Code with JMH** (`how-to-benchmark-java-code-with-jmh`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Common Spring Boot Performance Anti-Patterns** (`common-spring-boot-performance-anti-patterns`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Optimizing JSON Serialization and Deserialization in Java** (`optimize-json-serialization-deserialization-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Implementing Async Processing to Improve API Response Time** (`async-processing-improve-api-response-time-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `scenario-based`

- **Cache Stampede: What It Is and How to Prevent It** (`what-is-cache-stampede-how-to-prevent-it`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z2 · `speakable_slightly_long` [speakable_answer] — Speakable is 360 words — upper bound. Trim unless topic is genuinely deep.
- **Blue-Green vs Canary Deployment: Key Differences** (`blue-green-vs-canary-deployment-difference`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Managing Database Schema Migrations in Production with Flyway and Liquibase** (`database-schema-migrations-production-flyway-liquibase`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `sre-practices`

- **Implementing a Feature Flag System** (`how-to-implement-feature-flag-system`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Circuit Breaker Pattern in Production Java Services** (`circuit-breaker-pattern-production-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Implementing Zero-Downtime Deployments for Spring Boot** (`zero-downtime-deployments-spring-boot`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **SRE vs DevOps: What They Are and How They Differ** (`sre-vs-devops-difference`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `redis-caching`

#### Topic: `cache-invalidation`

- **Cache Invalidation Strategies in Spring Boot with Redis** (`cache-invalidation-strategies`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `cache-patterns`

- **Cache Stampede (Thundering Herd) Problem and Solutions** (`cache-stampede-thundering-herd`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 57% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_slightly_long` [speakable_answer] — Speakable is 353 words — upper bound. Trim unless topic is genuinely deep.

#### Topic: `caching-strategies`

- **Cache-Aside vs Write-Through vs Write-Behind Caching Strategies** (`cache-strategies-comparison`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 66% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `distributed-caching`

- **Distributed Locking with Redisson in Spring Boot** (`distributed-locking-redisson`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 2 section(s) >60% code: [('step', 'Step 2 — Configure Redisson Client', 0.7), ('step', 'Step 3 — Acquire and Release the Lock', 0.74)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('step', 42), ('step', 37)]. Spec: 'merge with adjacent'.

#### Topic: `performance-optimization`

- **Redis Memory Optimization: Eviction Policies and maxmemory Configuration** (`redis-memory-optimization`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'Redis Memory Configuration')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `redis-advanced`

- **Rate Limiting with Redis: INCR+EXPIRE and Sliding Window** (`rate-limiting-redis`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 62% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 3 section(s) >60% code: [('step', 'Step 2 — Spring Boot Fixed Window Implementation', 0.93), ('step', 'Step 3 — Sliding Window with Sorted Set', 0.75)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('step', 15), ('step', 50)]. Spec: 'merge with adjacent'.
- **Redis Cluster vs Redis Sentinel: High Availability and Horizontal Scaling** (`redis-cluster-vs-sentinel`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 57% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `redis-data-structures`

- **Redis Data Structures: String, Hash, List, Set, ZSet, and Stream** (`redis-data-structures-overview`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_no_scaffold` — Deep dive only has narrative sections (['overview', 'reference_group']) — no phase/step/code_example/comparison_table for structure.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('reference_group', 'Stream', 0.66)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `redis-persistence`

- **Redis Persistence: RDB vs AOF** (`redis-persistence-rdb-vs-aof`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 66% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `scenario-based`

- **Redis vs Memcached: Choosing the Right Cache** (`redis-vs-memcached`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Redis Pub/Sub vs Apache Kafka** (`redis-pubsub-vs-kafka`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 56% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `spring-data-redis`

- **Spring Cache Abstraction with Redis (@Cacheable, @CacheEvict)** (`spring-cache-abstraction-redis`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 4 section(s) >60% code: [('step', 'Step 1 — Add Dependencies', 0.66), ('step', 'Step 2 — Enable Caching and Configure RedisCacheManager', 0.79)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 4 section(s) under 60 words: [('step', 39), ('step', 37), ('step', 44)]. Spec: 'merge with adjacent'.
- **Spring Session + Redis for Distributed Session Storage** (`spring-session-redis`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 63% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 3 section(s) >60% code: [('step', 'Step 2 — Enable Redis HTTP Session', 0.83), ('step', 'Step 3 — Configure Redis and Session in application.yml', 0.7)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 4 section(s) under 60 words: [('step', 33), ('step', 22), ('step', 39)]. Spec: 'merge with adjacent'.

### Module: `rest-api`

#### Topic: `api-design`

- **DTO Pattern — Why Never Expose Entities Directly in REST APIs** (`dto-pattern-request-response`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `error-handling`

- **@ExceptionHandler and @ControllerAdvice for Centralised Error Handling** (`exception-handler-controller-advice`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `graphql-with-spring`

- **GraphQL vs REST — When to Choose Each** (`graphql-vs-rest-when-to-choose`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Setting Up Spring for GraphQL (spring-graphql)** (`setting-up-spring-for-graphql`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `key_points_bullets_no_bold` [key_points] — 1/5 bullets have no **bold anchor** concept name.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Query, Mutation, Subscription — Core Operation Types** (`graphql-query-mutation-subscription-differences`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 50% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **How DataFetcher and DataLoader Work** (`datafetcher-and-dataloader-graphql-java`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **N+1 Problem in GraphQL and the BatchLoader Solution** (`graphql-n-plus-one-problem-batchloader`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 51% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **GraphQL Schema Design Best Practices** (`graphql-schema-design-best-practices`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Authentication and Authorization in GraphQL with Spring Security** (`graphql-authentication-authorization-spring-boot`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 59% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Enforce Authorization at the Resolver Level — Where Granularity Lives', 0.61)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **GraphQL Pagination — Cursor-Based vs Offset-Based** (`graphql-pagination-cursor-vs-offset`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **GraphQL Error Handling in Spring Boot** (`graphql-error-handling-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Testing GraphQL Endpoints in Spring Boot** (`testing-graphql-endpoints-spring-boot`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 50% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **gRPC vs REST vs GraphQL** (`grpc-vs-rest-vs-graphql`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 51% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `grpc-basics`

- **gRPC Service Types — Unary, Server Streaming, Client Streaming, Bidirectional** (`grpc-service-types-java`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Setting Up a gRPC Server in Spring Boot** (`grpc-server-spring-boot-setup`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 50% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **gRPC Interceptors for Auth and Logging** (`grpc-interceptors-auth-logging`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 2 section(s) >60% code: [('step', 'Step 1 — Build a Logging Interceptor That Captures Entry and Exit', 0.69), ('step', 'Step 2 — Build an Auth Interceptor That Validates JWT and Propagates Identity', 0.62)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **gRPC Error Handling with Status Codes** (`grpc-error-handling-status-codes`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 52% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Server-Side Error Mapping — Inline and Centralized Approaches', 0.69)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **gRPC vs REST Performance Comparison** (`grpc-vs-rest-performance`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 60% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Deadlines and Cancellation in gRPC** (`grpc-deadlines-cancellation-java`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **gRPC Health Checking Protocol** (`grpc-health-checking-protocol`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **Testing gRPC Services in Java** (`testing-grpc-services-java`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Step 2 — Integration Test: In-Process Server Without Network', 0.64)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `hateoas`

- **HATEOAS — Hypermedia-Driven REST APIs with Spring HATEOAS** (`hateoas-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `openapi-and-swagger`

- **OpenAPI Documentation with SpringDoc** (`openapi-swagger-springdoc`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `request-and-response-handling`

- **Validation with @Valid and Custom ConstraintValidator** (`validation-valid-constraintvalidator`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **API Pagination — Cursor-Based vs Offset-Based** (`pagination-cursor-vs-offset`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **File Upload and Download in Spring Boot — MultipartFile and Streaming** (`file-upload-download-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `rest-fundamentals`

- **REST Architectural Constraints — What Makes an API Truly RESTful** (`what-makes-api-restful-constraints`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **HTTP Status Codes — Decision Guide for REST APIs** (`http-status-codes-decision-guide`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Idempotency in REST APIs** (`idempotency-in-rest-apis`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **PUT vs PATCH — When to Use Each in REST APIs** (`put-vs-patch-http-difference`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **HTTP Methods Deep Dive — GET, POST, PUT, DELETE, PATCH Semantics** (`http-methods-get-post-put-delete-patch`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `scenario-based`

- **Protocol Buffers — Defining and Generating Java Code** (`protocol-buffers-define-generate-java`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 52% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 93% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **REST API Security — CORS, CSRF, and JWT** (`rest-api-security-cors-csrf`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Rate Limiting in Spring Boot REST API** (`rest-rate-limiting-implementation`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **WebSocket vs HTTP Polling vs SSE — When to Use Each** (`websocket-vs-http-polling-vs-sse`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Spring Boot WebSocket with STOMP — Step-by-Step Setup** (`spring-boot-websocket-stomp-setup`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **WebSocket Handshake and HTTP Upgrade Process — Internals** (`websocket-handshake-upgrade-process`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 2 fenced block(s) missing language tag — breaks syntax highlighting.
- **Spring WebSocket Message Broker Configuration — Full Broker Setup** (`spring-message-broker-configuration`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **WebSocket Security and Authentication in Spring Boot** (`websocket-security-authentication`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Scaling WebSockets Across Nodes with Redis Pub/Sub** (`scaling-websockets-redis-pubsub`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **SockJS Fallback for Older Browsers — Concept Explained** (`sockjs-fallback-older-browsers`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 59% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **WebSocket vs SSE — Detailed Technical Comparison** (`websocket-vs-sse-detailed-comparison`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Testing WebSocket Endpoints in Spring Boot** (`testing-websocket-endpoints-spring`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **WebSocket Heartbeats and Connection Management** (`websocket-heartbeats-connection-management`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 87% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `spring-mvc-controllers`

- **Spring MVC Request Lifecycle (DispatcherServlet Flow)** (`spring-mvc-request-lifecycle`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@RestController vs @Controller + @ResponseBody** (`restcontroller-vs-controller-responsebody`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **HandlerInterceptor vs Servlet Filter** (`handlerinterceptor-vs-filter`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **CORS Configuration in Spring MVC** (`cors-configuration-spring-mvc`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z1 · `key_points_bullets_no_bold` [key_points] — 1/5 bullets have no **bold anchor** concept name.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Async Controllers with DeferredResult and CompletableFuture** (`async-controllers-deferred-result-completable-future`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Content Negotiation in Spring MVC — JSON, XML, and Custom Media Types** (`content-negotiation-spring-mvc`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `key_points_bullets_no_bold` [key_points] — 1/5 bullets have no **bold anchor** concept name.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **ResponseEntity — Controlling HTTP Status, Headers, and Body** (`response-entity-spring-mvc`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `versioning`

- **REST API Versioning — URI vs Header vs Media Type** (`api-versioning-uri-header-media-type`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `spring-batch`

#### Topic: `batch-error-handling`

- **Spring Batch Retry and Skip Logic for Fault-Tolerant Batch Jobs** (`spring-batch-retry-skip-logic`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `batch-fundamentals`

- **Spring Batch Core Concepts: Job, Step, Chunk, and Tasklet** (`spring-batch-core-concepts-job-step-chunk-tasklet`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `comparisons`

- **Spring Batch vs Spring Integration: When to Use Each** (`spring-batch-vs-spring-integration`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `item-reader-writer-processor`

- **ItemReader, ItemProcessor, and ItemWriter: Chunk Processing in Spring Batch** (`spring-batch-itemreader-itemprocessor-itemwriter-chunk-processing`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `job-and-step-structure`

- **Spring Batch Job Parameters and Restarting Failed Jobs** (`spring-batch-job-parameters-restart-failed-jobs`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `spring-boot`

#### Topic: `actuator`

- **Spring Boot Actuator — Endpoints and Security** (`spring-boot-actuator-endpoints-security`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z1 · `key_points_bullets_no_bold` [key_points] — 1/5 bullets have no **bold anchor** concept name.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `auto-configuration`

- **Spring Boot Auto-Configuration — How It Works Internally** (`spring-boot-auto-configuration-internals`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Spring Boot Startup Sequence (SpringApplication.run Phases)** (`spring-boot-startup-sequence`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@SpringBootApplication — What It Combines** (`spring-boot-application-annotation`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Custom Auto-Configuration (spring.factories / AutoConfiguration.imports)** (`custom-auto-configuration-spring-factories`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **Customizing Spring Boot Startup — Banner, Listeners, and FailureAnalyzer** (`spring-boot-startup-customization`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `comparisons`

- **Spring Framework vs Spring Boot — What's the Difference?** (`spring-boot-vs-spring-framework-difference`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.

#### Topic: `configuration-management`

- **application.properties vs application.yml vs Environment Variables** (`application-properties-vs-yml-vs-env-vars`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@ConfigurationProperties vs @Value** (`configuration-properties-vs-value`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Spring Boot Logging — Logback Configuration, Log Levels, and Structured Logs** (`spring-boot-logging-configuration`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `embedded-servers`

- **Embedded Server Configuration (Tomcat, Jetty, Undertow)** (`spring-boot-embedded-server-configuration`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `profiles-and-properties`

- **Configuring Server Port** (`server-port`) — 1 CRITICAL, 3 MAJOR, 2 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 72 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **DataSource Properties** (`datasource-properties`) — 1 CRITICAL, 4 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 56 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.69)] — add explanation.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 56)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **HikariCP Configuration** (`hikari-pool-config`) — 1 CRITICAL, 3 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 87 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **JPA and Hibernate Properties** (`jpa-properties`) — 1 CRITICAL, 3 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 96 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **spring.jpa.hibernate.ddl-auto Values** (`ddl-auto`) — 1 CRITICAL, 3 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 142 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Application Context Path** (`context-path`) — 1 CRITICAL, 3 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 80 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Tomcat Thread Pool Configuration** (`max-threads`) — 1 CRITICAL, 3 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 105 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **SQL Query Logging** (`show-sql`) — 1 CRITICAL, 3 MAJOR, 3 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 80 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Maximum Server Connections** (`max-connections`) — 1 CRITICAL, 3 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 107 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Connection and Read Timeouts** (`connection-timeout`) — 1 CRITICAL, 4 MAJOR, 4 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 57 words across 1 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_single_section` — Only 1 deep-dive section — progressive depth is impossible with one block.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('deep_explanation', 'Concept Explained', 0.68)] — add explanation.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('deep_explanation', 57)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `scenario-based`

- **Spring Boot Docker — Building Optimized Images with Layered JARs** (`spring-boot-docker-layered-jars`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@Scheduled — Cron Jobs and Fixed-Rate Tasks in Spring Boot** (`scheduled-annotation-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **@Async — Asynchronous Method Execution in Spring Boot** (`async-annotation-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **CommandLineRunner vs ApplicationRunner — Running Code at Startup** (`commandlinerunner-applicationrunner`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Spring Boot DevTools — Hot Reload and Live Restart in Development** (`spring-boot-devtools`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `testing`

- **Spring Boot Testing: @SpringBootTest, Slices, and Context Caching** (`spring-boot-testing-slices-context-caching`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `troubleshooting`

- **Graceful Shutdown in Spring Boot** (`spring-boot-graceful-shutdown`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Global Exception Handling with @ControllerAdvice and @ExceptionHandler** (`global-exception-handling-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

### Module: `spring-core`

#### Topic: `aop`

- **How Spring AOP Works (Proxy, JDK vs CGLIB)** (`how-spring-aop-works`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Pointcut Expressions — Targeting Methods in Spring AOP** (`pointcut-expressions-spring-aop`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z1 · `key_points_bullets_no_bold` [key_points] — 1/5 bullets have no **bold anchor** concept name.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `bean-lifecycle`

- **Bean Scopes: Singleton vs Prototype vs Request vs Session** (`spring-bean-scopes`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Prototype Bean in Singleton — The Scoping Trap** (`prototype-in-singleton-problem`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Spring Bean Lifecycle** (`spring-bean-lifecycle`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@PostConstruct and @PreDestroy — Bean Initialization and Destruction Callbacks** (`postconstruct-predestroy-spring`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **@Lazy Annotation — Deferred Bean Initialization** (`lazy-annotation-spring`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 50% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Circular Dependencies in Spring — How to Detect and Fix** (`circular-dependency-spring`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `custom-components`

- **@Component vs @Service vs @Repository vs @Controller** (`component-vs-service-vs-repository-vs-controller`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@ComponentScan — How Spring Discovers Beans** (`component-scan-spring`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `dependency-injection`

- **Inversion of Control (IoC) and Dependency Injection in Spring** (`spring-ioc-dependency-injection-explained`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Constructor Injection vs Field Injection vs Setter Injection** (`constructor-vs-field-vs-setter-injection`) — 2 CRITICAL, 0 MAJOR, 1 MINOR
  - **CRITICAL** · Z1 · `key_points_missing` — No key_points section — Zone 1 is incomplete per spec.
  - **CRITICAL** · Z2 · `speakable_missing` — No speakable_answer — Zone 2 (Interview Answer) is empty.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **How @Autowired Works Internally** (`how-autowired-works-internally`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@Qualifier and @Primary — Resolving Ambiguous Injection** (`qualifier-and-primary-ambiguous-injection`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@Value and Property Injection — Externalized Configuration** (`value-annotation-property-injection`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `scenario-based`

- **@Transactional — Propagation Types** (`transactional-propagation-types`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Spring Profiles (@Profile, spring.profiles.active)** (`spring-profiles-profile-annotation`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `spring-events`

- **Spring Events (@EventListener, ApplicationEventPublisher)** (`spring-events-eventlistener-applicationeventpublisher`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 50% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `spring-internals`

- **BeanPostProcessor — How Spring Modifies Beans Before Use** (`beanpostprocessor-spring`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Spring IoC Container: BeanFactory vs ApplicationContext** (`beanfactory-vs-applicationcontext`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@Conditional and Custom Conditions** (`conditional-and-custom-conditions`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Spring Expression Language (SpEL) — Dynamic Values in Configuration** (`spring-expression-language-spel`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `direct_answer_missing` — No direct_answer field — Quick Answer box has no lede.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

### Module: `spring-data-jpa`

#### Topic: `caching`

- **Hibernate Caching: L1 vs L2 vs Query Cache** (`hibernate-caching-l1-l2-query-cache`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 348 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `custom-repositories`

- **Spring Data Specifications for Dynamic Queries** (`spring-data-specifications-dynamic-queries`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_has_code_fence` [speakable_answer] — Contains ``` fenced code — spec forbids code blocks in speakable, only inline `code`.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 244 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Spring Data JPA Repository — findBy, @Query, Native Queries, and Derived Methods** (`spring-data-jpa-repository-methods`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 304 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Pagination and Sorting with Spring Data JPA — Pageable, Page, Slice** (`pagination-sorting-spring-data`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 292 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `database-migrations`

- **Database Migrations with Flyway and Liquibase in Spring Boot** (`flyway-liquibase-database-migrations`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 313 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `entity-relationships`

- **@OneToMany Fetch Strategies: JOIN vs SUBSELECT vs SELECT (EXTRA)** (`hibernate-onetomany-fetch-strategies`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **JPA Entity Relationships — @OneToMany, @ManyToOne, @ManyToMany Mapping** (`jpa-entity-relationships-onetomany-manytomany`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 289 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **JPA Cascade Types and orphanRemoval — When to Use Each** (`jpa-cascade-types-orphan-removal`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 326 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `hibernate-internals`

- **Hibernate Session vs JPA EntityManager** (`hibernate-session-vs-entitymanager`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `comparison_missing_table` — Question is a comparison but deep dive has NO comparison_table — spec says 'table is required'.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **How Hibernate Generates SQL: Dirty Checking and Flush Modes** (`hibernate-sql-generation-dirty-checking-flush-modes`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Lazy vs Eager Loading in JPA** (`lazy-vs-eager-loading`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **LazyInitializationException — Causes and Fixes** (`lazy-initialization-exception-causes-fixes`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `jpa-fundamentals`

- **JPA vs Hibernate — Specification vs Implementation** (`jpa-vs-hibernate-difference`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **JPA Entity Lifecycle States** (`jpa-entity-lifecycle`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **JPA Inheritance Mapping Strategies** (`jpa-inheritance-mapping-strategies`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 330 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `multi-tenancy`

- **Multiple DataSources in Spring Boot — Configuration and Routing** (`multi-datasource-spring-boot`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 300 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `n-plus-one-problem`

- **N+1 Query Problem in Spring Data JPA** (`n-plus-one-query-problem`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Solving N+1 with @EntityGraph** (`entity-graph-solving-n-plus-one`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `query-optimization`

- **Hibernate Criteria API vs JPQL vs Native SQL** (`hibernate-criteria-api-vs-jpql-vs-native-sql`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 296 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **DTO Projections in Spring Data JPA** (`dto-projections-interface-class-based`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 298 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@Modifying Bulk Updates and Deletes in Spring Data JPA** (`modifying-bulk-updates-deletes`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_has_code_fence` [speakable_answer] — Contains ``` fenced code — spec forbids code blocks in speakable, only inline `code`.
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 288 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `scenario-based`

- **Audit Logging with @CreatedDate and @LastModifiedDate** (`audit-logging-created-date-last-modified-date`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 244 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **HikariCP Connection Pool — Configuration and Tuning in Spring Boot** (`hikaricp-connection-pooling-spring`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z1 · `key_points_bullets_no_bold` [key_points] — 1/5 bullets have no **bold anchor** concept name.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `transactions`

- **@Transactional Internals — Proxy and Propagation** (`transactional-internals-propagation`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Optimistic vs Pessimistic Locking in JPA** (`optimistic-vs-pessimistic-locking`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 285 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `spring-security`

#### Topic: `authentication`

- **UserDetailsService and UserDetails — Custom Implementation** (`userdetailsservice-userdetails-custom-implementation`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_has_code_fence` [speakable_answer] — Contains ``` fenced code — spec forbids code blocks in speakable, only inline `code`.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Session-Based vs Token-Based Authentication** (`session-vs-token-based-authentication`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Password Hashing — BCrypt vs Argon2** (`password-hashing-bcrypt-vs-argon2`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `authorization`

- **Authentication vs Authorization in Spring Security** (`authentication-vs-authorization-spring-security`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@PreAuthorize vs @Secured vs @RolesAllowed** (`preauthorize-vs-secured-vs-rolesallowed`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `cors-and-csrf`

- **CSRF — What It Is and Spring Security CSRF Protection** (`csrf-spring-security-protection`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **CORS Configuration with Spring Security** (`cors-configuration-spring-security`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z1 · `key_points_bullets_no_bold` [key_points] — 1/5 bullets have no **bold anchor** concept name.
  - **MAJOR** · Z2 · `speakable_has_code_fence` [speakable_answer] — Contains ``` fenced code — spec forbids code blocks in speakable, only inline `code`.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `jwt`

- **How to Implement JWT Authentication from Scratch in Spring Security** (`jwt-authentication-spring-security`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **JWT Security — Signing, Expiry, and Refresh Token Rotation** (`jwt-security-signing-expiry-refresh`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `oauth2`

- **OAuth2 Authorization Code Flow** (`oauth2-authorization-code-flow`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **OAuth2 Resource Server Configuration in Spring Security** (`oauth2-resource-server-spring-security`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_has_code_fence` [speakable_answer] — Contains ``` fenced code — spec forbids code blocks in speakable, only inline `code`.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `scenario-based`

- **OWASP Top 10 — Critical Web Vulnerabilities** (`owasp-top-10`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **SQL Injection — How It Works and JPA Prevention** (`sql-injection-jpa-prevention`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **XSS — Stored vs Reflected vs DOM-Based** (`xss-stored-reflected-dom`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Rate Limiting to Prevent Brute Force Attacks** (`rate-limiting-brute-force-prevention`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Secrets Management — Never Hardcode Credentials** (`secrets-management-never-hardcode`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `security-fundamentals`

- **Spring Security Filter Chain — How Requests Flow Through** (`spring-security-filter-chain`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **SecurityContext and SecurityContextHolder — How They Work** (`security-context-security-context-holder`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `testing`

- **Testing with @WithMockUser and SecurityMockMvcRequestPostProcessors** (`testing-with-withmockuser-security-mock-mvc`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `sql-databases`

#### Topic: `advanced-sql-features`

- **SQL Window Functions — ROW_NUMBER, RANK, DENSE_RANK, LAG, LEAD** (`sql-window-functions-row-number-rank`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `connection-pooling`

- **Database Connection Pooling Explained** (`database-connection-pooling`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 57% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 59)]. Spec: 'merge with adjacent'.
- **Spring Boot + MySQL Connection Pool Tuning** (`spring-boot-mysql-connection-pool-tuning`) — 0 CRITICAL, 2 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 314 words across 5 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Add validation and monitoring', 0.66)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('step', 58), ('step', 52)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `indexes-and-performance`

- **Database Indexes: How They Work and What Types Exist** (`database-indexes-types`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 57% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Database Indexes — B-Tree, Hash, Composite, and Covering Indexes** (`database-indexes-btree-hash`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **MySQL Index Types: B-tree, Full-text, and Composite** (`mysql-index-types-btree-fulltext-composite`) — 0 CRITICAL, 2 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 65 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'Creating and Using Different MySQL Index Types')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 58)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `joins-and-subqueries`

- **SQL Joins — INNER, LEFT, RIGHT, FULL OUTER, CROSS, and SELF Joins** (`sql-joins-inner-outer-cross-self`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **SQL Subqueries vs Joins — Performance and When to Use Each** (`sql-subqueries-vs-joins`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 59% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `partitioning-and-sharding`

- **Database Sharding: What It Is and When to Use It** (`database-sharding`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 55% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Partitioning in MySQL** (`mysql-partitioning`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 90 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'RANGE Partitioning by Date — Events Table')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `postgresql-features`

- **MySQL vs PostgreSQL for Java Developers** (`mysql-vs-postgresql-java-developers`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 190 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **PostgreSQL Window Functions — RANK, ROW_NUMBER, LAG/LEAD** (`postgresql-window-functions`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 219 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 41)]. Spec: 'merge with adjacent'.
- **Reading EXPLAIN ANALYZE — PostgreSQL Query Optimization** (`postgresql-explain-analyze`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 59% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 30)]. Spec: 'merge with adjacent'.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **PostgreSQL Index Types — B-Tree, GIN, GiST, BRIN, Hash** (`postgresql-indexes-btree-gin-gist`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 104 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('when_to_use', '', 0.98)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('overview', 40), ('when_to_use', 2)]. Spec: 'merge with adjacent'.
- **PostgreSQL Transaction Isolation Levels** (`postgresql-transactions-isolation-levels`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 126 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('when_to_use', '', 0.97)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('overview', 35), ('when_to_use', 4)]. Spec: 'merge with adjacent'.
- **PostgreSQL JSONB — Queries, Indexing, and When to Use It** (`postgresql-jsonb-queries-indexing`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 58% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 35)]. Spec: 'merge with adjacent'.
- **PostgreSQL Connection Pooling with PgBouncer** (`postgresql-connection-pooling-pgbouncer`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 210 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 37)]. Spec: 'merge with adjacent'.
- **PostgreSQL Locking — Row Locks, Advisory Locks, Deadlock Prevention** (`postgresql-locking-deadlocks`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 184 words across 4 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('diagnosis', '', 0.94)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('diagnosis', 5)]. Spec: 'merge with adjacent'.
- **PostgreSQL Table Partitioning — Range, List, and Hash** (`postgresql-partitioning-large-tables`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 216 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 49)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `direct_answer_equals_speakable_opener` — direct_answer is identical to speakable opener — duplicated content.
- **N+1 Query Problem — Detection and Solutions with JPA + PostgreSQL** (`postgresql-query-optimization-n-plus-one`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 298 words across 4 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('diagnosis', '', 0.74)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('problem_statement', 38), ('diagnosis', 14)]. Spec: 'merge with adjacent'.
- **Full-Text Search in PostgreSQL — tsvector, tsquery, and GIN** (`postgresql-full-text-search`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 35 words across 4 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 3 section(s) >60% code: [('step', 'Step 1: Create a tsvector column with GIN index', 1.0), ('step', 'Step 2: Query with tsquery', 1.0)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 4 section(s) under 60 words: [('overview', 35), ('step', 0), ('step', 0)]. Spec: 'merge with adjacent'.

#### Topic: `query-optimization`

- **SQL EXPLAIN Plan — Reading and Optimizing Query Execution Plans** (`sql-explain-plan-query-optimization`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **Using EXPLAIN to Optimize MySQL Queries** (`mysql-explain-query-optimization`) — 0 CRITICAL, 2 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 135 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('query_example', 'Reading EXPLAIN Output and Fixing a Slow Query', 0.98)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('query_example', 8)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **MySQL Query Cache and Query Optimization** (`mysql-query-cache-query-optimization`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 100 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'Application-Layer Caching in Spring Boot')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `replication`

- **MySQL Replication: Primary-Replica Setup** (`mysql-replication-primary-replica`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 87 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'Spring Boot Read/Write Routing with AbstractRoutingDataSource')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `scenario-based`

- **OLTP vs OLAP: Understanding the Two Database Workload Types** (`oltp-vs-olap`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 59)]. Spec: 'merge with adjacent'.
- **Designing Databases for High Read Throughput** (`high-read-throughput-design`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 334 words across 5 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('overview', 50), ('step', 58)]. Spec: 'merge with adjacent'.
- **Soft Deletes in Database Design** (`soft-deletes-database-design`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 38)]. Spec: 'merge with adjacent'.
- **Eventual Consistency: What It Is and How to Design for It** (`eventual-consistency-design`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 57% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **InnoDB vs MyISAM Storage Engines** (`innodb-vs-myisam-storage-engines`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 231 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 50)]. Spec: 'merge with adjacent'.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

#### Topic: `sql-fundamentals`

- **Database Normalization Forms Explained** (`database-normalization-forms`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 297 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 49)]. Spec: 'merge with adjacent'.
- **SQL vs NoSQL: When to Use Each** (`sql-vs-nosql-databases`) — 0 CRITICAL, 0 MAJOR, 3 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 50)]. Spec: 'merge with adjacent'.
- **Modeling Many-to-Many Relationships in Databases** (`many-to-many-relationship-modeling`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 53% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 1 section(s) under 60 words: [('overview', 50)]. Spec: 'merge with adjacent'.
- **Database Normalization — 1NF, 2NF, 3NF, and When to Denormalize** (`database-normalization-1nf-2nf-3nf`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `transactions-and-acid`

- **ACID Properties — Atomicity, Consistency, Isolation, Durability** (`acid-properties-transactions`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Transaction Isolation Levels — Read Uncommitted to Serializable** (`transaction-isolation-levels-sql`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **MySQL Transaction Isolation Levels** (`mysql-transaction-isolation-levels`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 252 words across 3 sections — thinner than the 500-word floor for shallow topics.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].
- **InnoDB Locking: Row Lock, Gap Lock, and Next-Key Lock** (`innodb-locking-row-gap-next-key`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_too_short` — Deep dive is only 77 words across 2 sections — thinner than the 500-word floor for shallow topics.
  - **MAJOR** · Z3 · `deep_dive_orphan_code` — 1 *_code section(s) with <12 words of prose: [('code_example', 'InnoDB Lock Types in Practice')] — code blocks should be framed, not dumped.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `interviewer_intent_incomplete` — Missing interviewer_intent keys: ['testing', 'common_mistake', 'to_stand_out'].

### Module: `system-design`

#### Topic: `caching-at-scale`

- **Distributed Caching Strategy — Patterns and Trade-offs** (`design-distributed-cache`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **CDN and Edge Caching: Reducing Latency for Global Users** (`cdn-edge-caching`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Design a Thread-Safe LRU Cache in Java** (`design-thread-safe-lru-cache-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Design an In-Memory Key-Value Store with TTL** (`design-in-memory-kv-store-ttl-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `cap-theorem`

- **CAP Theorem: Consistency, Availability, and Partition Tolerance Trade-offs** (`cap-theorem-trade-offs`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `capacity-planning`

- **Back-of-Envelope Estimation: Capacity Planning for System Design** (`back-of-envelope-estimation`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `database-design-at-scale`

- **Database Replication: Master-Slave, Master-Master, and Quorum Reads** (`database-replication-strategies`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `design-fundamentals`

- **Consistent Hashing: How Distributed Systems Distribute Data** (`consistent-hashing`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **API Gateway Pattern: Single Entry Point for Microservices** (`api-gateway-pattern`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `event-driven-design`

- **Message Queues vs Event Streams: RabbitMQ vs Kafka Trade-offs** (`message-queues-vs-event-streams`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Audit Log Design and Event Sourcing** (`design-event-sourcing-audit-log`) — 0 CRITICAL, 2 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 54% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 2 section(s) >60% code: [('approach', 'Simple Audit Log Implementation', 1.0), ('design_diagram', 'Event Sourcing with Temporal Queries and Snapshots', 1.0)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('approach', 0), ('design_diagram', 0)]. Spec: 'merge with adjacent'.
- **Design a Pub/Sub Event Bus in Java** (`design-pubsub-event-bus-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `high-availability`

- **Circuit Breaker Pattern: Preventing Cascade Failures in Distributed Systems** (`circuit-breaker-pattern`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Design a Retry Mechanism with Exponential Backoff** (`design-retry-exponential-backoff-java`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 72% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 86% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `load-balancing`

- **Load Balancing Strategies: Round Robin, Least Connections, Consistent Hashing** (`load-balancing-strategies`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `scalability`

- **Horizontal vs Vertical Scaling: When to Scale Out vs Scale Up** (`horizontal-vs-vertical-scaling`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `scenario-based`

- **Design a Background Job Queue System** (`design-job-queue-system`) — 0 CRITICAL, 1 MAJOR, 3 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 2 section(s) >60% code: [('approach', 'PostgreSQL-Based Queue (Small Scale)', 0.96), ('design_diagram', 'Worker Lifecycle and Retry Flow', 1.0)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_thin_sections` — 2 section(s) under 60 words: [('approach', 5), ('design_diagram', 0)]. Spec: 'merge with adjacent'.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **Read/Write Separation and CQRS Pattern** (`design-read-write-separation-cqrs`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Design a Task Scheduler / Job Queue in Java** (`design-task-scheduler-job-queue-java`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 60% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Task Abstraction and Priority Ordering', 0.76)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Design a Connection Pool Manager in Java** (`design-connection-pool-manager-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Design a Rate Limiter Component in Java (Code-Level)** (`design-rate-limiter-component-java`) — 0 CRITICAL, 2 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 55% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Sliding Window Counter — Eliminating Boundary Bursts', 0.78)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

### Module: `system-design-cases`

#### Topic: `chat-system`

- **Design a Chat/Messaging System (WhatsApp)** (`design-chat-messaging-system`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.

#### Topic: `notification-service`

- **Design a Notification Service (Email, SMS, Push)** (`design-notification-service`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.

#### Topic: `payment-system`

- **Idempotent Payment API Design** (`design-api-idempotency-payments`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Design an E-Commerce Order Management System** (`design-ecommerce-order-management`) — 0 CRITICAL, 0 MAJOR, 3 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 96% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `rate-limiter`

- **Design a Distributed Rate Limiter** (`design-rate-limiter`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_slightly_long` [speakable_answer] — Speakable is 362 words — upper bound. Trim unless topic is genuinely deep.

#### Topic: `scenario-based`

- **Design a Real-Time Gaming Leaderboard** (`design-leaderboard-system`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z2 · `speakable_not_shorter_than_deepdive` [speakable_answer] — Speakable is 50% of deep-dive length — spec says 20–33%. Either speakable is bloated or deep-dive is thin.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Design a File Storage Service (Google Drive/Dropbox)** (`design-file-storage-service`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **Design a Video Streaming Platform (YouTube/Netflix)** (`design-video-streaming-platform`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 3 fenced block(s) missing language tag — breaks syntax highlighting.
- **Design a Ride-Sharing Service (Uber)** (`design-ride-sharing-service`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.

#### Topic: `search-autocomplete`

- **Design Search Autocomplete for a Product Catalog** (`design-search-autocomplete`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 85% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

#### Topic: `social-media-feed`

- **Design a Social Media Feed (Twitter/Instagram Timeline)** (`design-social-media-feed`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.

#### Topic: `url-shortener`

- **Design a URL Shortener (bit.ly)** (`design-url-shortener`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `zone1_zone2_high_overlap` — 86% word-set overlap between key_points and speakable — they should cover the same concepts differently, not identically.

### Module: `unit-testing`

#### Topic: `integration-testing`

- **Testing Kafka with @EmbeddedKafka** (`testing-kafka-embedded-kafka`) — 0 CRITICAL, 1 MAJOR, 2 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'The Full Pattern — Produce, Consume, Assert With Awaitility', 0.65)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **Integration Testing in Spring Boot — @SpringBootTest, @DataJpaTest, @WebMvcTest** (`integration-testing-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `mocking-with-mockito`

- **Mockito: @Mock vs @Spy vs @MockBean** (`mockito-mock-spy-mockbean`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Mockito Deep Dive — @Mock, @Spy, verify(), ArgumentCaptor** (`mockito-mock-spy-verify-argumentcaptor`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `spring-boot-testing`

- **@SpringBootTest and Its Slice Variants** (`springboottest-and-slice-variants`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **MockMvc for Controller Testing** (`mockmvc-controller-testing`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Testing Request Mapping, Validation, and Error Handling in One Test', 0.66)] — add explanation.
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Test Slices: @WebMvcTest vs @DataJpaTest vs @SpringBootTest** (`spring-test-slices-comparison`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z3 · `deep_dive_code_no_language` — 1 fenced block(s) missing language tag — breaks syntax highlighting.
- **Testing Spring Security (with and without Auth)** (`testing-spring-security`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **MockMvc — Testing REST Controllers Without Starting a Server** (`mockmvc-testing-controllers`) — 0 CRITICAL, 1 MAJOR, 1 MINOR
  - **MAJOR** · Z3 · `deep_dive_code_heavy` — 1 section(s) >60% code: [('step', 'Testing Request Mapping, Validation, and Error Handling in One Test', 0.66)] — add explanation.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `testcontainers`

- **Testing with @DataJpaTest and Testcontainers** (`datajpatest-with-testcontainers`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **Testcontainers: Real Databases in Integration Tests** (`testcontainers-real-database-integration`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
- **Testcontainers — Running Real Databases in Tests** (`testcontainers-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z2 · `speakable_no_bold` [speakable_answer] — No **bold terms** — readers lose anchor points when scanning.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `unit-testing-advanced`

- **Testing Async / CompletableFuture Code** (`testing-async-completablefuture`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Code Coverage with JaCoCo — What to Measure and What to Ignore** (`code-coverage-jacoco-spring-boot`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.

#### Topic: `unit-testing-basics`

- **Unit vs Integration vs End-to-End Testing** (`unit-vs-integration-vs-e2e-testing`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **@ParameterizedTest and @MethodSource in JUnit 5** (`parameterized-test-method-source`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Test-Driven Development: Red-Green-Refactor Cycle** (`tdd-red-green-refactor`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
- **Test-Driven Development (TDD) — Red-Green-Refactor in Java** (`test-driven-development-tdd-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **JUnit 5 Assertions and AssertJ — Fluent Test Assertions** (`junit5-assertions-assertj`) — 0 CRITICAL, 0 MAJOR, 2 MINOR
  - **MINOR** · Z1 · `direct_answer_no_bold` — direct_answer has zero bolded anchors — readers can't scan it.
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Parameterized Tests in JUnit 5 — @ValueSource, @CsvSource, @MethodSource** (`parameterized-tests-junit5`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Testing Exceptions in JUnit 5 — assertThrows and Exception Messages** (`testing-exceptions-junit5`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
- **Unit Testing Best Practices — Naming, Arrange-Act-Assert, Test Isolation** (`unit-testing-best-practices-java`) — 0 CRITICAL, 0 MAJOR, 1 MINOR
  - **MINOR** · X · `missing_company_tags` — No company_tags populated.
