# JBI Audit v2 — pillars=['P01', 'P06', 'P12']

Aligned to `content/ANSWER_QUALITY_SPEC_V2.md`. Archetype source: `scripts/out/suggested_archetypes.json`.

- Questions audited: **305**
- Complete stubs: **131** (separate from quality issues)
- Written answers: **174**
  - With CRITICAL: 18
  - With MAJOR: 174
  - Fully clean: 0

**Key philosophy change from v1:** universal word ceilings removed. Length is only flagged on radical deviation from the archetype's band (<50% lower or >200% upper).

## 1. Severity counts

| Severity | Count |
|---|---:|
| CRITICAL | 149 |
| MAJOR | 449 |
| MINOR | 27 |

## 2. Archetype distribution in this scope

| Archetype | Questions | CRITICAL | MAJOR | MINOR |
|---|---:|---:|---:|---:|
| `moderate-concept` | 115 | 61 | 206 | 18 |
| `comparison` | 82 | 45 | 73 | 0 |
| `scenario-based` | 41 | 16 | 56 | 1 |
| `system-design` | 16 | 0 | 52 | 8 |
| `direct-concept` | 15 | 15 | 0 | 0 |
| `behavioral` | 12 | 0 | 36 | 0 |
| `architecture` | 11 | 1 | 21 | 0 |
| `how-to-recipe` | 8 | 8 | 0 | 0 |
| `internals` | 2 | 2 | 0 | 0 |
| `debugging-pattern` | 2 | 1 | 3 | 0 |
| `tool-config` | 1 | 0 | 2 | 0 |

## 3. Top issue categories

| Category | Count | Zone |
|---|---:|:-:|
| `zone2_speakable_no_verdict` | 167 | Z2 |
| `zone1_direct_answer_no_bold` | 131 | Z1 |
| `stub_no_sections` | 131 | X |
| `zone3_dd_radically_short` | 55 | Z3 |
| `zone3_code_heavy_section` | 25 | Z3 |
| `zone1_missing_direct_answer` | 24 | Z1 |
| `zone1_missing_key_points` | 18 | Z1 |
| `zone2_speakable_no_bold` | 18 | Z2 |
| `zone3_orphan_code` | 16 | Z3 |
| `behavioral_missing_star_beats` | 12 | Z2 |
| `system_design_no_scale_math` | 10 | Z2 |
| `zone3_code_no_language` | 9 | Z3 |
| `zone2_speakable_near_duplicate_of_deepdive` | 4 | Z2 |
| `comparison_missing_table` | 4 | Z3 |
| `debugging_pattern_no_before_after` | 1 | Z3 |

## 4. Module heatmap

| Module | CRITICAL | MAJOR | MINOR | Top categories |
|---|---:|---:|---:|---|
| java-streams | 46 | 60 | 15 | `stub_no_sections`×31, `zone1_missing_direct_answer`×15, `zone1_missing_key_points`×15 |
| java-collections | 30 | 53 | 0 | `stub_no_sections`×30, `zone2_speakable_no_verdict`×21, `zone1_direct_answer_no_bold`×15 |
| java-concurrency | 28 | 64 | 0 | `stub_no_sections`×28, `zone1_direct_answer_no_bold`×24, `zone2_speakable_no_verdict`×24 |
| core-java | 27 | 111 | 3 | `zone2_speakable_no_verdict`×50, `zone1_direct_answer_no_bold`×32, `stub_no_sections`×24 |
| jvm-internals | 18 | 32 | 0 | `stub_no_sections`×18, `zone1_direct_answer_no_bold`×15, `zone2_speakable_no_verdict`×15 |
| system-design | 0 | 61 | 1 | `zone1_direct_answer_no_bold`×21, `zone2_speakable_no_verdict`×19, `zone3_orphan_code`×7 |
| behavioral | 0 | 36 | 0 | `zone1_direct_answer_no_bold`×12, `zone2_speakable_no_verdict`×12, `behavioral_missing_star_beats`×12 |
| system-design-cases | 0 | 32 | 8 | `zone1_direct_answer_no_bold`×12, `zone2_speakable_no_verdict`×11, `zone3_code_no_language`×8 |

## 5. Complete stubs in scope (131)

| Module | Topic | Question |
|---|---|---|
| core-java | comparisons | Abstract class vs Interface in Java — detailed comparison |
| core-java | comparisons | Checked vs Unchecked exceptions in Java — comparison |
| core-java | comparisons | Heap vs Stack memory in Java — comparison |
| core-java | exception-handling | What is the difference between throw and throws in Java? |
| core-java | exception-handling | When does the finally block NOT execute in Java? |
| core-java | exception-handling | What are the best practices for exception handling in Java? |
| core-java | generics-wildcards | What are generics in Java and why do we use them? |
| core-java | generics-wildcards | What is the difference between bounded and unbounded wildcards in Java? |
| core-java | generics-wildcards | What is the PECS principle in Java generics? |
| core-java | generics-wildcards | Why can't you create a generic array in Java? |
| core-java | java-io-nio | Java I/O streams — byte streams vs character streams |
| core-java | java-io-nio | Java NIO vs IO — what's the difference? |
| core-java | java-io-nio | What are channels and buffers in Java NIO? |
| core-java | java-io-nio | How do you read a large file efficiently in Java? |
| core-java | java-io-nio | Serializable vs Externalizable in Java — what's the difference? |
| core-java | oop-principles | How does Java solve the diamond problem with default methods? |
| core-java | oop-principles | What is the equals() and hashCode() contract in Java? |
| core-java | oop-principles | What is the difference between an anonymous inner class and a lambda in Java? |
| core-java | reflection-annotations | What is reflection in Java and when do we use it? |
| core-java | reflection-annotations | What is the performance cost of Java reflection? |
| core-java | reflection-annotations | What are meta-annotations in Java? (@Retention, @Target, @Documented) |
| core-java | string-handling | Why is String immutable in Java? |
| core-java | string-handling | How does the String.intern() method work in Java? |
| core-java | string-handling | What is the difference between equals() and contentEquals() on String? |
| java-collections | algorithm-complexity | What is Big-O notation? |
| java-collections | algorithm-complexity | Time complexity of common Java collection operations |
| java-collections | algorithm-complexity | What is amortized complexity? (ArrayList.add, HashMap.put) |
| java-collections | algorithm-complexity | How to analyze the time complexity of a recursive algorithm? |
| java-collections | comparisons | Array vs ArrayList in Java — comparison |
| java-collections | comparisons | HashMap vs ConcurrentHashMap — comparison |
| java-collections | comparisons | Stack vs Queue in Java — comparison |
| java-collections | dynamic-programming | What is dynamic programming? (Java introduction) |
| java-collections | dynamic-programming | Memoization vs tabulation in DP — what's the difference? |
| java-collections | dynamic-programming | Fibonacci series using DP in Java |
| java-collections | dynamic-programming | 0/1 Knapsack problem using DP in Java |
| java-collections | problem-solving-patterns | Sliding window technique in Java |
| java-collections | problem-solving-patterns | Two-pointers technique in Java |
| java-collections | problem-solving-patterns | Fast and slow pointers (Floyd's cycle detection) in Java |
| java-collections | problem-solving-patterns | Top-K elements using a heap in Java |
| java-collections | problem-solving-patterns | Backtracking pattern in Java |
| java-collections | scenario-based | Reverse a linked list in Java — iterative and recursive |
| java-collections | scenario-based | Detect a loop in a linked list in Java |
| java-collections | scenario-based | Two Sum problem in Java |
| java-collections | scenario-based | Implement an LRU Cache in Java |
| java-collections | scenario-based | How do you check if two strings are anagrams in Java? |
| java-collections | sorting-and-searching | Java sorting algorithms — overview |
| java-collections | sorting-and-searching | How do you sort custom objects in Java? |
| java-collections | sorting-and-searching | What is Timsort and why does Java use it? |
| java-collections | sorting-and-searching | How do you do binary search in Java? |
| java-collections | trees-and-graphs | Binary tree vs binary search tree in Java |
| java-collections | trees-and-graphs | Tree traversal in Java — inorder, preorder, postorder |
| java-collections | trees-and-graphs | BFS vs DFS in Java — when to use each? |
| java-collections | trees-and-graphs | Graph representation in Java — adjacency list vs matrix |
| java-collections | trees-and-graphs | Implement Dijkstra's shortest-path algorithm in Java |
| java-concurrency | comparisons | Future vs CompletableFuture — comparison |
| java-concurrency | comparisons | volatile vs synchronized — comparison |
| java-concurrency | comparisons | Virtual threads vs platform threads — comparison |
| java-concurrency | completable-future | What is CompletableFuture in Java? |
| java-concurrency | completable-future | thenCompose vs thenCombine in CompletableFuture |
| java-concurrency | completable-future | Exception handling in CompletableFuture |
| java-concurrency | concurrency-patterns | Producer-consumer pattern in Java |
| java-concurrency | concurrency-patterns | Double-checked locking pattern in Java |
| java-concurrency | concurrency-patterns | Thread-safe singleton patterns in Java |
| java-concurrency | concurrent-collections | Why do we need concurrent collections in Java? |
| java-concurrency | concurrent-collections | LinkedBlockingQueue vs ArrayBlockingQueue in Java |
| java-concurrency | java-memory-model | What is the Java Memory Model (JMM)? |
| java-concurrency | java-memory-model | volatile vs Atomic variables in Java |
| java-concurrency | java-memory-model | Data race vs race condition — are they the same? |
| java-concurrency | scenario-based | How do you detect deadlock in Java using a thread dump? |
| java-concurrency | scenario-based | How do you avoid deadlock in Java? |
| java-concurrency | synchronization-and-locks | What is synchronization in Java? |
| java-concurrency | synchronization-and-locks | Synchronized method vs synchronized block in Java |
| java-concurrency | thread-pools-and-executor | Why use thread pools in Java? |
| java-concurrency | thread-pools-and-executor | FixedThreadPool vs CachedThreadPool vs SingleThreadExecutor |
| java-concurrency | thread-pools-and-executor | RejectedExecutionHandler in Java thread pools |
| java-concurrency | threads-and-lifecycle | What is a thread in Java? |
| java-concurrency | threads-and-lifecycle | Thread.start() vs Thread.run() in Java |
| java-concurrency | threads-and-lifecycle | Thread.sleep() vs Object.wait() in Java |
| java-concurrency | threads-and-lifecycle | Thread interruption in Java — interrupt, isInterrupted, interrupted |
| java-concurrency | virtual-threads | What are virtual threads in Java 21? |
| java-concurrency | virtual-threads | When should you use virtual threads in Java? |
| java-concurrency | virtual-threads | Virtual threads pinning problem in Java |
| java-streams | comparisons | Stream vs Collection in Java — comparison |
| java-streams | comparisons | Optional vs null in Java — comparison |
| java-streams | comparisons | Imperative vs functional Java code — comparison |
| java-streams | java-14-to-17-features | Pattern matching for instanceof in Java |
| java-streams | java-21-features | Virtual threads in Java 21 — what are they? |
| java-streams | java-21-features | Structured concurrency in Java 21 |
| java-streams | java-21-features | Pattern matching for switch in Java 21 |
| java-streams | java-21-features | Sequenced collections in Java 21 |
| java-streams | java-9-to-11-features | What is the Java 9 Module System (JPMS)? |
| java-streams | java-9-to-11-features | Java 9 factory methods — List.of, Set.of, Map.of |
| java-streams | java-9-to-11-features | Java 10 `var` — local variable type inference |
| java-streams | java-9-to-11-features | Java 11 HttpClient API |
| java-streams | lambdas-functional-interfaces | What is a lambda expression in Java? |
| java-streams | lambdas-functional-interfaces | What is a functional interface in Java? |
| java-streams | lambdas-functional-interfaces | Predicate, Function, Consumer, Supplier in Java |
| java-streams | lambdas-functional-interfaces | Method references in Java — four types |
| java-streams | optional-api | What is Optional in Java and why was it added? |
| java-streams | optional-api | Optional.of vs ofNullable vs empty in Java |
| java-streams | optional-api | Optional.orElse vs orElseGet — what's the difference? |
| java-streams | optional-api | Should Optional be used as a return type? (Best practices) |
| java-streams | scenario-based | How do you group objects by a field using Java Streams? |
| java-streams | scenario-based | How do you convert a List to a Map in Java Streams? |
| java-streams | scenario-based | Flatten a list of lists using Java Streams |
| java-streams | scenario-based | When to use parallel vs sequential streams in Java |
| java-streams | streams-api | What is the Java Stream API? |
| java-streams | streams-api | Intermediate vs terminal operations in Java Streams |
| java-streams | streams-api | How does lazy evaluation work in Java Streams? |
| java-streams | streams-api | flatMap vs map in Java Streams — what's the difference? |
| java-streams | streams-api | Collectors.groupingBy and partitioningBy in Java |
| java-streams | streams-api | When should you use parallel streams in Java? |
| java-streams | streams-api | reduce() vs collect() in Java Streams |
| jvm-internals | comparisons | Minor GC vs Full GC — comparison |
| jvm-internals | comparisons | AOT vs JIT compilation — comparison |
| jvm-internals | garbage-collection | What is garbage collection in Java? |
| jvm-internals | garbage-collection | Generational garbage collection in Java (young vs old gen) |
| jvm-internals | garbage-collection | G1 GC vs CMS GC in Java |
| jvm-internals | garbage-collection | ZGC and Shenandoah — low-latency GC in Java |
| jvm-internals | garbage-collection | Full GC vs Minor GC in Java — what's the difference? |
| jvm-internals | jvm-architecture | What is the difference between JVM, JRE, and JDK? |
| jvm-internals | jvm-architecture | Heap vs stack memory in the JVM |
| jvm-internals | jvm-architecture | Metaspace vs PermGen in Java 8 |
| jvm-internals | jvm-tuning | JVM flags — -Xms, -Xmx, and friends |
| jvm-internals | jvm-tuning | Tuning JVM for microservices in containers |
| jvm-internals | memory-analysis | Heap dump analysis with Eclipse MAT |
| jvm-internals | memory-analysis | How do you find a memory leak in Java production? |
| jvm-internals | profiling-and-debugging | How do you profile a Java application? |
| jvm-internals | profiling-and-debugging | Java Flight Recorder (JFR) — what is it? |
| jvm-internals | scenario-based | How do you investigate an OutOfMemoryError in production? |
| jvm-internals | scenario-based | How do you reduce GC pause times in Java? |

## 6. Per-question findings

### `behavioral`

#### `career-growth`

- **Learning a New Technology Under Deadline** · archetype=`behavioral` (conf 1.00) · speakable=243w · deep_dive=347w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 61-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'action', 'result']. Present: ['task'].
- **Staying Current with Java and Backend Technology** · archetype=`behavioral` (conf 1.00) · speakable=251w · deep_dive=344w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 49-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['task', 'result']. Present: ['situation', 'action'].

#### `conflict-resolution`

- **Handling Technical Disagreements** · archetype=`behavioral` (conf 1.00) · speakable=251w · deep_dive=401w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 62-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'task', 'action', 'result']. Present: [].

#### `delivering-under-pressure`

- **Prioritizing Multiple Urgent Tasks** · archetype=`behavioral` (conf 1.00) · speakable=246w · deep_dive=391w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 47-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'task', 'result']. Present: ['action'].
- **Ensuring Code Quality Under Time Pressure** · archetype=`behavioral` (conf 1.00) · speakable=240w · deep_dive=301w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 67-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'task', 'result']. Present: ['action'].

#### `failure-and-learning`

- **Project Failure and Lessons Learned** · archetype=`behavioral` (conf 1.00) · speakable=248w · deep_dive=471w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 56-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'task', 'action', 'result']. Present: [].

#### `star-method`

- **Debugging a Complex Production Issue** · archetype=`behavioral` (conf 1.00) · speakable=250w · deep_dive=363w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 59-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['task', 'result']. Present: ['situation', 'action'].

#### `technical-leadership`

- **Significantly Improving System Performance** · archetype=`behavioral` (conf 1.00) · speakable=240w · deep_dive=375w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 59-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'task', 'action', 'result']. Present: [].
- **Taking End-to-End Project Ownership** · archetype=`behavioral` (conf 1.00) · speakable=252w · deep_dive=413w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 65-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'task', 'action', 'result']. Present: [].
- **Approach to Code Reviews** · archetype=`behavioral` (conf 1.00) · speakable=231w · deep_dive=328w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 53-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'task', 'action', 'result']. Present: [].
- **Advocating for Technical Debt Reduction** · archetype=`behavioral` (conf 1.00) · speakable=242w · deep_dive=484w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 59-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'task', 'action', 'result']. Present: [].
- **Mentoring a Junior Developer** · archetype=`behavioral` (conf 1.00) · speakable=266w · deep_dive=486w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 62-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `behavioral_missing_star_beats` [speakable_answer] — Behavioral speakable missing STAR beats: ['situation', 'task', 'action', 'result']. Present: [].

### `core-java`

#### `exception-handling`

- **Exception Hierarchy — Throwable, Error, Exception, RuntimeException** · archetype=`moderate-concept` (conf 0.30) · speakable=200w · deep_dive=466w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Checked vs Unchecked Exceptions in Java** · archetype=`comparison` (conf 0.95) · speakable=126w · deep_dive=503w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 50-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_near_duplicate_of_deepdive` [speakable_answer] — 86% word-set of speakable is inside deep dive — it reads as a duplicate, not a summary.
- **Creating Custom Exceptions in Java** · archetype=`moderate-concept` (conf 0.30) · speakable=197w · deep_dive=389w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 389w is <50% of moderate-concept lower band (800).
- **try-with-resources and AutoCloseable** · archetype=`moderate-concept` (conf 0.30) · speakable=165w · deep_dive=454w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 61-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Java Optional: Eliminating NullPointerException** · archetype=`moderate-concept` (conf 0.30) · speakable=160w · deep_dive=268w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 48-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 268w is <50% of moderate-concept lower band (800).

#### `generics-wildcards`

- **Java Generics and Type Erasure** · archetype=`moderate-concept` (conf 0.30) · speakable=167w · deep_dive=734w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 50-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `zone2_speakable_near_duplicate_of_deepdive` [speakable_answer] — 85% word-set of speakable is inside deep dive — it reads as a duplicate, not a summary.

#### `oop-principles`

- **The Four Pillars of OOP — Encapsulation, Inheritance, Polymorphism, Abstraction** · archetype=`moderate-concept` (conf 0.30) · speakable=333w · deep_dive=995w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_orphan_code` [before_code] — 'Theater: private field, but the caller controls all logic' has code but < 2 sentences framing it.
  - **MAJOR** · Z3 · `zone3_orphan_code` [after_code] — 'Real encapsulation: the class owns its invariants' has code but < 2 sentences framing it.
  - **MAJOR** · Z3 · `zone3_orphan_code` [before_code] — 'Inheritance misused — hierarchy collapses' has code but < 2 sentences framing it.
  - **MAJOR** · Z3 · `zone3_orphan_code` [before_code] — 'Without polymorphism — adding ApplePay edits this method' has code but < 2 sentences framing it.
  - **MAJOR** · Z3 · `zone3_orphan_code` [after_code] — 'With polymorphism — new type = new class, zero existing code touched' has code but < 2 sentences framing it.
  - **MAJOR** · Z3 · `zone3_orphan_code` [after_code] — 'Declare the interface type — never the concrete class' has code but < 2 sentences framing it.
- **Encapsulation and Access Modifiers in Java (private, protected, public, default)** · archetype=`moderate-concept` (conf 0.30) · speakable=237w · deep_dive=963w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `zone2_speakable_near_duplicate_of_deepdive` [speakable_answer] — 87% word-set of speakable is inside deep dive — it reads as a duplicate, not a summary.
  - **MAJOR** · Z3 · `zone3_orphan_code` [before_code] — 'Fake Encapsulation — Caller Drives All Logic' has code but < 2 sentences framing it.
- **Inheritance in Java — IS-A Relationship, super Keyword, and Method Overriding** · archetype=`moderate-concept` (conf 0.30) · speakable=311w · deep_dive=1277w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **this vs super Keyword in Java** · archetype=`comparison` (conf 0.95) · speakable=344w · deep_dive=486w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 56-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Constructor Chaining in Java — this() and super()** · archetype=`moderate-concept` (conf 0.30) · speakable=319w · deep_dive=429w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Method Overloading vs Method Overriding in Java** · archetype=`comparison` (conf 0.95) · speakable=158w · deep_dive=493w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 52-word direct_answer has zero bold anchors — unscannable.
- **Compile-Time vs Runtime Polymorphism in Java** · archetype=`comparison` (conf 0.95) · speakable=342w · deep_dive=843w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Abstraction in Java — When to Use Abstract Class vs Interface** · archetype=`comparison` (conf 1.00) · speakable=319w · deep_dive=671w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_orphan_code` [before_code] — 'Coupled — Concrete Type Locks Every Caller to ArrayList' has code but < 2 sentences framing it.
  - **MAJOR** · Z3 · `zone3_orphan_code` [after_code] — 'Abstracted — Callers Depend Only on the List Contract' has code but < 2 sentences framing it.
- **Abstract Class vs Interface in Java** · archetype=`comparison` (conf 0.95) · speakable=216w · deep_dive=642w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 56-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Default and Static Methods in Interfaces** · archetype=`moderate-concept` (conf 0.30) · speakable=163w · deep_dive=336w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 62-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 336w is <50% of moderate-concept lower band (800).
- **Composition vs Inheritance — Why 'Favor Composition Over Inheritance'** · archetype=`comparison` (conf 0.95) · speakable=306w · deep_dive=798w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Association vs Aggregation vs Composition in Java** · archetype=`comparison` (conf 0.95) · speakable=298w · deep_dive=641w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Object Class Methods — toString, hashCode, equals, clone, finalize** · archetype=`moderate-concept` (conf 0.30) · speakable=178w · deep_dive=605w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 56-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Shallow Copy vs Deep Copy in Java** · archetype=`comparison` (conf 0.95) · speakable=232w · deep_dive=563w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Immutability in Java — How and Why** · archetype=`moderate-concept` (conf 0.30) · speakable=173w · deep_dive=359w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 64-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 359w is <50% of moderate-concept lower band (800).
- **The static Keyword in Java** · archetype=`moderate-concept` (conf 0.30) · speakable=164w · deep_dive=439w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 49-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Enums in Java — More Than Constants** · archetype=`moderate-concept` (conf 0.30) · speakable=181w · deep_dive=369w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 369w is <50% of moderate-concept lower band (800).
- **Inner Classes in Java — Static, Non-Static, Local, and Anonymous** · archetype=`moderate-concept` (conf 0.30) · speakable=180w · deep_dive=486w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Marker Interfaces in Java — Serializable, Cloneable, Remote** · archetype=`moderate-concept` (conf 0.30) · speakable=162w · deep_dive=494w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Serialization in Java — Serializable, serialVersionUID, and Transient** · archetype=`moderate-concept` (conf 0.30) · speakable=173w · deep_dive=467w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `reflection-annotations`

- **Java Reflection API** · archetype=`moderate-concept` (conf 0.30) · speakable=136w · deep_dive=78w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 86% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 78w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Custom Annotations** · archetype=`moderate-concept` (conf 0.30) · speakable=127w · deep_dive=81w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 86% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 81w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Compile-Time Annotation Processing** · archetype=`moderate-concept` (conf 0.30) · speakable=140w · deep_dive=77w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 85% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 77w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.

#### `scenario-based`

- **Java Is Always Pass-by-Value** · archetype=`scenario-based` (conf 0.90) · speakable=173w · deep_dive=355w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 50-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **== vs .equals() in Java** · archetype=`comparison` (conf 0.95) · speakable=170w · deep_dive=379w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 32-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **final vs finally vs finalize in Java** · archetype=`comparison` (conf 0.95) · speakable=184w · deep_dive=376w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 57-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Type Casting in Java — Widening vs Narrowing, ClassCastException** · archetype=`comparison` (conf 0.95) · speakable=177w · deep_dive=444w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Varargs in Java — Variable Arguments and Heap Pollution** · archetype=`scenario-based` (conf 0.90) · speakable=193w · deep_dive=416w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Autoboxing, Unboxing, and the Integer Cache** · archetype=`scenario-based` (conf 0.90) · speakable=145w · deep_dive=355w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 50-word direct_answer has zero bold anchors — unscannable.
- **HashMap Internals: Buckets, Hashing, and Resizing** · archetype=`scenario-based` (conf 0.90) · speakable=189w · deep_dive=1185w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 60-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [step] — Section 'The Fix: Use Records for Keys, Immutability for Safety' (step) is 64% code — add explanation.
- **HashMap Resize and Rehash Internals** · archetype=`scenario-based` (conf 0.90) · speakable=163w · deep_dive=702w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 52-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Java Date/Time API (java.time) — LocalDate, ZonedDateTime, Duration, Period** · archetype=`scenario-based` (conf 0.90) · speakable=181w · deep_dive=444w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Predicate, Consumer, Supplier, Function — The 4 Core Functional Interfaces** · archetype=`scenario-based` (conf 0.90) · speakable=145w · deep_dive=376w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 53-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Functional Interfaces and Lambdas in Java** · archetype=`scenario-based` (conf 0.90) · speakable=162w · deep_dive=520w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 52-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Method References in Java — Four Types Explained** · archetype=`scenario-based` (conf 0.90) · speakable=142w · deep_dive=510w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 46-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `zone2_speakable_near_duplicate_of_deepdive` [speakable_answer] — 90% word-set of speakable is inside deep dive — it reads as a duplicate, not a summary.
- **Java Streams: Lazy Evaluation and Common Operations** · archetype=`scenario-based` (conf 0.90) · speakable=160w · deep_dive=589w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 48-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **map() vs flatMap() in Java Streams** · archetype=`comparison` (conf 0.95) · speakable=152w · deep_dive=439w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 50-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Java Stream Collectors — groupingBy, partitioningBy, toMap** · archetype=`scenario-based` (conf 0.90) · speakable=163w · deep_dive=437w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 47-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Parallel Streams in Java — When They Help vs When They Hurt** · archetype=`comparison` (conf 0.95) · speakable=194w · deep_dive=418w
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Stream Collectors — joining, reducing, collectingAndThen, toUnmodifiableList** · archetype=`moderate-concept` (conf 0.30) · speakable=153w · deep_dive=449w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 46-word direct_answer has zero bold anchors — unscannable.
- **Java var: Local Variable Type Inference** · archetype=`scenario-based` (conf 0.90) · speakable=174w · deep_dive=170w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 53-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 170w is <50% of scenario-based lower band (600).
- **Java Records: Immutable Data Carriers** · archetype=`scenario-based` (conf 0.90) · speakable=161w · deep_dive=332w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 47-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Java Records — What the Compiler Generates** · archetype=`scenario-based` (conf 0.90) · speakable=168w · deep_dive=345w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 61-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Sealed Classes and Pattern Matching** · archetype=`scenario-based` (conf 0.90) · speakable=182w · deep_dive=541w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 55-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Java Garbage Collection: GC Roots, Mark-and-Sweep, and Generational GC** · archetype=`scenario-based` (conf 0.90) · speakable=222w · deep_dive=838w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 45-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **WeakReference vs SoftReference vs PhantomReference** · archetype=`comparison` (conf 0.95) · speakable=178w · deep_dive=549w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 62-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `string-handling`

- **String vs StringBuilder vs StringBuffer** · archetype=`comparison` (conf 0.95) · speakable=144w · deep_dive=572w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 53-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **String Pool and Interning** · archetype=`moderate-concept` (conf 0.30) · speakable=168w · deep_dive=766w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 64-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

### `java-collections`

#### `collections-internals`

- **List vs Set vs Map — When to Use Each Collection Type** · archetype=`comparison` (conf 1.00) · speakable=175w · deep_dive=331w
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **ArrayList vs LinkedList — When to Use Each** · archetype=`comparison` (conf 1.00) · speakable=185w · deep_dive=510w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 45-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **HashMap vs TreeMap vs LinkedHashMap** · archetype=`comparison` (conf 0.95) · speakable=159w · deep_dive=488w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 35-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **How HashSet Works Internally in Java** · archetype=`moderate-concept` (conf 0.30) · speakable=157w · deep_dive=387w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 48-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 387w is <50% of moderate-concept lower band (800).
- **How HashMap Handles Collisions (Chaining to Tree at 8)** · archetype=`moderate-concept` (conf 0.30) · speakable=171w · deep_dive=702w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 51-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **HashMap vs Hashtable vs ConcurrentHashMap** · archetype=`comparison` (conf 0.95) · speakable=193w · deep_dive=541w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 43-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **PriorityQueue — Heap Structure and Use Cases** · archetype=`moderate-concept` (conf 0.30) · speakable=155w · deep_dive=382w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 45-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 382w is <50% of moderate-concept lower band (800).
- **ArrayDeque vs LinkedList as Queue/Stack** · archetype=`comparison` (conf 0.95) · speakable=156w · deep_dive=342w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 44-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `comparison_missing_table` — Comparison archetype requires a comparison_table section — spec says 'table is required'.
- **Comparable vs Comparator in Java** · archetype=`comparison` (conf 0.95) · speakable=140w · deep_dive=460w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 40-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Sorting with Comparator: thenComparing and reversed** · archetype=`moderate-concept` (conf 0.30) · speakable=140w · deep_dive=287w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 32-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 287w is <50% of moderate-concept lower band (800).
- **Fail-Fast vs Fail-Safe Iterators in Java** · archetype=`comparison` (conf 0.95) · speakable=141w · deep_dive=458w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 41-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Iterator vs ListIterator — Traversal and Modification** · archetype=`comparison` (conf 0.95) · speakable=122w · deep_dive=426w
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **TreeSet and TreeMap — Sorted Collections and NavigableSet/NavigableMap** · archetype=`moderate-concept` (conf 0.30) · speakable=158w · deep_dive=341w
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 341w is <50% of moderate-concept lower band (800).
- **EnumMap and EnumSet — Performance Advantages** · archetype=`moderate-concept` (conf 0.30) · speakable=133w · deep_dive=318w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 48-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 318w is <50% of moderate-concept lower band (800).
- **WeakHashMap — Garbage Collection-Friendly Cache** · archetype=`moderate-concept` (conf 0.30) · speakable=170w · deep_dive=373w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 48-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 373w is <50% of moderate-concept lower band (800).
- **CopyOnWriteArrayList — When and Why** · archetype=`moderate-concept` (conf 0.30) · speakable=154w · deep_dive=411w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 44-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Collections.unmodifiableList vs List.of vs List.copyOf** · archetype=`comparison` (conf 0.95) · speakable=177w · deep_dive=321w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 46-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Choosing the Right Collection — Decision Guide** · archetype=`moderate-concept` (conf 0.30) · speakable=171w · deep_dive=304w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 45-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 304w is <50% of moderate-concept lower band (800).
- **Collections Utility Class — sort, shuffle, frequency, unmodifiable** · archetype=`moderate-concept` (conf 0.30) · speakable=162w · deep_dive=362w
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 362w is <50% of moderate-concept lower band (800).
- **Map compute(), merge(), computeIfAbsent() — Atomic Map Operations** · archetype=`moderate-concept` (conf 0.30) · speakable=161w · deep_dive=358w
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 358w is <50% of moderate-concept lower band (800).
- **Stream API with Collections — toList, toSet, toMap, groupingBy** · archetype=`moderate-concept` (conf 0.30) · speakable=181w · deep_dive=316w
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 316w is <50% of moderate-concept lower band (800).

### `java-concurrency`

#### `completable-future`

- **Future vs CompletableFuture in Java** · archetype=`comparison` (conf 0.95) · speakable=159w · deep_dive=285w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 53-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 285w is <50% of comparison lower band (600).
- **CompletableFuture Chains: thenApply, thenCompose, exceptionally** · archetype=`moderate-concept` (conf 0.30) · speakable=187w · deep_dive=319w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 32-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 319w is <50% of moderate-concept lower band (800).

#### `concurrency-patterns`

- **CountDownLatch vs CyclicBarrier vs Semaphore** · archetype=`comparison` (conf 0.95) · speakable=158w · deep_dive=354w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 53-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **ThreadLocal — Use Cases and Pitfalls** · archetype=`moderate-concept` (conf 0.30) · speakable=175w · deep_dive=401w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 72-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `concurrent-collections`

- **ConcurrentHashMap Internals** · archetype=`moderate-concept` (conf 0.30) · speakable=155w · deep_dive=413w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 59-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **BlockingQueue and the Producer-Consumer Pattern** · archetype=`moderate-concept` (conf 0.30) · speakable=143w · deep_dive=333w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 37-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 333w is <50% of moderate-concept lower band (800).

#### `java-memory-model`

- **Java Memory Model and Happens-Before** · archetype=`moderate-concept` (conf 0.30) · speakable=194w · deep_dive=417w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 52-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **volatile — Visibility Guarantee in Java** · archetype=`moderate-concept` (conf 0.30) · speakable=150w · deep_dive=371w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 57-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 371w is <50% of moderate-concept lower band (800).

#### `scenario-based`

- **Parallel Streams — When They Help vs Hurt** · archetype=`comparison` (conf 0.95) · speakable=157w · deep_dive=337w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 72-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `comparison_missing_table` — Comparison archetype requires a comparison_table section — spec says 'table is required'.
- **Race Condition — How to Identify and Fix** · archetype=`debugging-pattern` (conf 0.90) · speakable=143w · deep_dive=371w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 59-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `debugging_pattern_no_before_after` — debugging-pattern archetype expects before_code/after_code sections; neither found.
- **Liveness Hazards: Deadlock, Livelock, and Starvation** · archetype=`scenario-based` (conf 0.90) · speakable=205w · deep_dive=365w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 47-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `synchronization-and-locks`

- **How the synchronized Keyword and Monitors Work** · archetype=`moderate-concept` (conf 0.30) · speakable=143w · deep_dive=397w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 42-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 397w is <50% of moderate-concept lower band (800).
- **synchronized vs ReentrantLock — Which Lock to Use?** · archetype=`comparison` (conf 0.95) · speakable=146w · deep_dive=321w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 53-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **ReentrantReadWriteLock — Use Cases and Pitfalls** · archetype=`moderate-concept` (conf 0.30) · speakable=171w · deep_dive=360w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 47-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 360w is <50% of moderate-concept lower band (800).
- **StampedLock and Optimistic Reads** · archetype=`moderate-concept` (conf 0.30) · speakable=159w · deep_dive=345w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 52-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 345w is <50% of moderate-concept lower band (800).
- **wait/notify vs Condition.await/signal** · archetype=`comparison` (conf 0.95) · speakable=140w · deep_dive=453w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 40-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **AtomicInteger vs synchronized — When to Use Each** · archetype=`comparison` (conf 1.00) · speakable=155w · deep_dive=357w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 58-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `comparison_missing_table` — Comparison archetype requires a comparison_table section — spec says 'table is required'.

#### `thread-pools-and-executor`

- **Java ExecutorService — Thread Pool Types** · archetype=`moderate-concept` (conf 0.30) · speakable=190w · deep_dive=332w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 58-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 332w is <50% of moderate-concept lower band (800).
- **Thread Pool Sizing: CPU-Bound vs IO-Bound** · archetype=`comparison` (conf 0.95) · speakable=170w · deep_dive=400w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 40-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `comparison_missing_table` — Comparison archetype requires a comparison_table section — spec says 'table is required'.
- **ForkJoinPool and RecursiveTask** · archetype=`moderate-concept` (conf 0.30) · speakable=158w · deep_dive=320w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 39-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 320w is <50% of moderate-concept lower band (800).

#### `threads-and-lifecycle`

- **Thread vs Runnable vs Callable** · archetype=`comparison` (conf 0.95) · speakable=151w · deep_dive=300w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 42-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Java Thread Lifecycle — The 6 States** · archetype=`moderate-concept` (conf 0.30) · speakable=157w · deep_dive=364w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 41-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 364w is <50% of moderate-concept lower band (800).
- **Daemon Threads in Java — Background Workers That Don't Block Shutdown** · archetype=`moderate-concept` (conf 0.30) · speakable=121w · deep_dive=350w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 42-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 350w is <50% of moderate-concept lower band (800).

#### `virtual-threads`

- **Java 21 Virtual Threads and Structured Concurrency** · archetype=`moderate-concept` (conf 0.30) · speakable=176w · deep_dive=375w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 51-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 375w is <50% of moderate-concept lower band (800).

### `java-streams`

#### `java-14-to-17-features`

- **Switch Expressions and Enhanced Switch** · archetype=`moderate-concept` (conf 0.30) · speakable=130w · deep_dive=13w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 94% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 13w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Text Blocks and String Features** · archetype=`moderate-concept` (conf 0.30) · speakable=137w · deep_dive=9w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 97% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 9w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Java Records (Java 16+)** · archetype=`moderate-concept` (conf 0.30) · speakable=146w · deep_dive=16w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 95% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 16w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Sealed Classes and Pattern Matching** · archetype=`moderate-concept` (conf 0.30) · speakable=152w · deep_dive=15w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 95% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 15w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Functional Interfaces and Lambda Expressions** · archetype=`moderate-concept` (conf 0.30) · speakable=148w · deep_dive=11w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 95% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 11w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Optional — Proper Usage and Anti-Patterns** · archetype=`moderate-concept` (conf 0.30) · speakable=153w · deep_dive=11w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 96% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 11w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.

#### `lambdas-functional-interfaces`

- **Lambdas and Functional Interfaces** · archetype=`moderate-concept` (conf 0.30) · speakable=129w · deep_dive=70w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 86% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 70w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Java Streams API** · archetype=`moderate-concept` (conf 0.30) · speakable=136w · deep_dive=75w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 89% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 75w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Optional — Proper Usage** · archetype=`moderate-concept` (conf 0.30) · speakable=124w · deep_dive=61w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 87% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 61w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.

#### `streams-api`

- **Stream API — Intermediate and Terminal Operations** · archetype=`moderate-concept` (conf 0.30) · speakable=167w · deep_dive=13w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 95% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 13w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Advanced Collectors and Custom Collectors** · archetype=`moderate-concept` (conf 0.30) · speakable=149w · deep_dive=9w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 96% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 9w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Stream Performance and Parallel Streams** · archetype=`moderate-concept` (conf 0.30) · speakable=163w · deep_dive=13w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 94% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 13w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Lambda Expressions and Functional Interfaces** · archetype=`moderate-concept` (conf 0.30) · speakable=152w · deep_dive=11w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 94% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 11w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Optional — Proper Usage** · archetype=`moderate-concept` (conf 0.30) · speakable=154w · deep_dive=13w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 95% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 13w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.
- **Method References and Effective Use** · archetype=`moderate-concept` (conf 0.30) · speakable=131w · deep_dive=9w
  - **CRITICAL** · Z1 · `zone1_missing_key_points` — No key_points section — Zone 1 is incomplete.
  - **MAJOR** · Z1 · `zone1_missing_direct_answer` — No direct_answer field — Quick Answer has no lede.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [deep_explanation] — Section 'Concept Explained' (deep_explanation) is 97% code — add explanation.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 9w is <50% of moderate-concept lower band (800).
  - **MINOR** · Z2 · `zone2_speakable_no_bold` [speakable_answer] — No bold anchors — listener/scanner loses structure.

### `jvm-internals`

#### `garbage-collection`

- **JVM Garbage Collectors Compared — G1, ZGC, Shenandoah, Parallel** · archetype=`moderate-concept` (conf 0.30) · speakable=206w · deep_dive=422w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 35-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **GC Tuning and GC Log Analysis** · archetype=`moderate-concept` (conf 0.30) · speakable=172w · deep_dive=387w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 37-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 387w is <50% of moderate-concept lower band (800).

#### `jvm-architecture`

- **JVM Runtime Data Areas — Heap, Stack, Metaspace, Code Cache** · archetype=`moderate-concept` (conf 0.30) · speakable=161w · deep_dive=381w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 38-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 381w is <50% of moderate-concept lower band (800).
- **ClassLoader Hierarchy and Parent Delegation** · archetype=`moderate-concept` (conf 0.30) · speakable=177w · deep_dive=426w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 69-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **JIT Compilation and Tiered Compilation in HotSpot** · archetype=`moderate-concept` (conf 0.30) · speakable=172w · deep_dive=429w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 40-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `jvm-tuning`

- **JVM Startup Optimization and Virtual Threads (Java 21)** · archetype=`moderate-concept` (conf 0.30) · speakable=223w · deep_dive=464w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 37-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **JVM Settings for Spring Boot in Docker/Kubernetes** · archetype=`tool-config` (conf 0.70) · speakable=198w · deep_dive=480w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 37-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `memory-analysis`

- **Java Memory Leak Detection — Heap Dump Analysis** · archetype=`moderate-concept` (conf 0.30) · speakable=179w · deep_dive=451w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 36-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **StackOverflowError vs OutOfMemoryError in Java** · archetype=`comparison` (conf 0.95) · speakable=186w · deep_dive=492w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 63-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `profiling-and-debugging`

- **Java Profiling in Production — async-profiler and JFR** · archetype=`moderate-concept` (conf 0.30) · speakable=203w · deep_dive=442w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 44-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Thread Dumps and Deadlock Analysis** · archetype=`moderate-concept` (conf 0.30) · speakable=184w · deep_dive=447w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 41-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `scenario-based`

- **Java Reflection and Performance Cost** · archetype=`scenario-based` (conf 0.90) · speakable=184w · deep_dive=357w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 65-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **NIO vs Traditional IO** · archetype=`comparison` (conf 0.95) · speakable=216w · deep_dive=472w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 71-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Java Module System (JPMS)** · archetype=`scenario-based` (conf 0.90) · speakable=221w · deep_dive=412w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 49-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Annotation Processing at Compile Time and Runtime** · archetype=`scenario-based` (conf 0.90) · speakable=180w · deep_dive=619w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 55-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

### `system-design`

#### `caching-at-scale`

- **Distributed Caching Strategy — Patterns and Trade-offs** · archetype=`architecture` (conf 0.55) · speakable=325w · deep_dive=1008w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 38-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **CDN and Edge Caching: Reducing Latency for Global Users** · archetype=`architecture` (conf 0.55) · speakable=287w · deep_dive=620w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 59-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Design a Thread-Safe LRU Cache in Java** · archetype=`system-design` (conf 0.80) · speakable=304w · deep_dive=647w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 59-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_orphan_code` [code_example] — 'Get and Put with Read-Write Locking' has code but < 2 sentences framing it.
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 647w is <50% of system-design lower band (1500).
- **Design an In-Memory Key-Value Store with TTL** · archetype=`system-design` (conf 0.80) · speakable=271w · deep_dive=569w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 50-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_orphan_code` [code_example] — 'KV Store with Hybrid Expiration' has code but < 2 sentences framing it.
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 569w is <50% of system-design lower band (1500).

#### `cap-theorem`

- **CAP Theorem: Consistency, Availability, and Partition Tolerance Trade-offs** · archetype=`architecture` (conf 0.55) · speakable=296w · deep_dive=772w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 72-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `capacity-planning`

- **Back-of-Envelope Estimation: Capacity Planning for System Design** · archetype=`architecture` (conf 0.55) · speakable=279w · deep_dive=810w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 61-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `database-design-at-scale`

- **Database Replication: Master-Slave, Master-Master, and Quorum Reads** · archetype=`architecture` (conf 0.55) · speakable=294w · deep_dive=835w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 60-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `design-fundamentals`

- **Consistent Hashing: How Distributed Systems Distribute Data** · archetype=`architecture` (conf 0.55) · speakable=303w · deep_dive=799w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 68-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **API Gateway Pattern: Single Entry Point for Microservices** · archetype=`architecture` (conf 0.55) · speakable=273w · deep_dive=704w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 56-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `event-driven-design`

- **Message Queues vs Event Streams: RabbitMQ vs Kafka Trade-offs** · archetype=`comparison` (conf 0.95) · speakable=274w · deep_dive=672w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 65-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Audit Log Design and Event Sourcing** · archetype=`architecture` (conf 0.80) · speakable=312w · deep_dive=574w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 40-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [approach] — Section 'Simple Audit Log Implementation' (approach) is 100% code — add explanation.
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [design_diagram] — Section 'Event Sourcing with Temporal Queries and Snapshots' (design_diagram) is 100% code — add explanation.
- **Design a Pub/Sub Event Bus in Java** · archetype=`system-design` (conf 0.80) · speakable=283w · deep_dive=590w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 50-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_orphan_code` [code_example] — 'Event Bus Core — Subscribe, Publish, Unsubscribe' has code but < 2 sentences framing it.
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 590w is <50% of system-design lower band (1500).

#### `high-availability`

- **Circuit Breaker Pattern: Preventing Cascade Failures in Distributed Systems** · archetype=`architecture` (conf 0.55) · speakable=301w · deep_dive=737w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 62-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Design a Retry Mechanism with Exponential Backoff** · archetype=`system-design` (conf 0.80) · speakable=340w · deep_dive=475w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 51-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_orphan_code` [code_example] — 'Generic Retry Component with Full Jitter' has code but < 2 sentences framing it.
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 475w is <50% of system-design lower band (1500).

#### `load-balancing`

- **Load Balancing Strategies: Round Robin, Least Connections, Consistent Hashing** · archetype=`architecture` (conf 0.55) · speakable=294w · deep_dive=776w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 43-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `scalability`

- **Horizontal vs Vertical Scaling: When to Scale Out vs Scale Up** · archetype=`comparison` (conf 0.95) · speakable=288w · deep_dive=888w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 46-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').

#### `scenario-based`

- **Design a Background Job Queue System** · archetype=`scenario-based` (conf 0.90) · speakable=279w · deep_dive=667w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 44-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [approach] — Section 'PostgreSQL-Based Queue (Small Scale)' (approach) is 96% code — add explanation.
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [design_diagram] — Section 'Worker Lifecycle and Retry Flow' (design_diagram) is 100% code — add explanation.
  - **MINOR** · Z3 · `zone3_code_no_language` [design_diagram] — Code block in 'Worker Lifecycle and Retry Flow' missing language tag.
- **Read/Write Separation and CQRS Pattern** · archetype=`scenario-based` (conf 0.90) · speakable=311w · deep_dive=954w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 43-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
- **Design a Task Scheduler / Job Queue in Java** · archetype=`scenario-based` (conf 0.90) · speakable=299w · deep_dive=495w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 52-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [step] — Section 'Task Abstraction and Priority Ordering' (step) is 76% code — add explanation.
  - **MAJOR** · Z3 · `zone3_orphan_code` [code_example] — 'The Scheduler Engine with Dispatcher Thread' has code but < 2 sentences framing it.
- **Design a Connection Pool Manager in Java** · archetype=`scenario-based` (conf 0.90) · speakable=280w · deep_dive=678w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 53-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_orphan_code` [code_example] — 'Core Pool Implementation with Semaphore Bounding' has code but < 2 sentences framing it.
- **Design a Rate Limiter Component in Java (Code-Level)** · archetype=`scenario-based` (conf 0.90) · speakable=277w · deep_dive=503w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 53-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_orphan_code` [code_example] — 'Token Bucket Implementation' has code but < 2 sentences framing it.
  - **MAJOR** · Z3 · `zone3_code_heavy_section` [step] — Section 'Sliding Window Counter — Eliminating Boundary Bursts' (step) is 78% code — add explanation.

### `system-design-cases`

#### `chat-system`

- **Design a Chat/Messaging System (WhatsApp)** · archetype=`system-design` (conf 1.00) · speakable=339w · deep_dive=1144w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 48-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MINOR** · Z3 · `zone3_code_no_language` [step] — Code block in 'WebSocket Gateways and the Session Registry Pattern' missing language tag.

#### `notification-service`

- **Design a Notification Service (Email, SMS, Push)** · archetype=`system-design` (conf 1.00) · speakable=323w · deep_dive=731w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 37-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 731w is <50% of system-design lower band (1500).

#### `payment-system`

- **Idempotent Payment API Design** · archetype=`system-design` (conf 0.95) · speakable=309w · deep_dive=757w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 35-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
- **Design an E-Commerce Order Management System** · archetype=`system-design` (conf 1.00) · speakable=343w · deep_dive=1146w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 44-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
  - **MINOR** · Z3 · `zone3_code_no_language` [step] — Code block in 'Order State Machine and Event Sourcing for Auditability' missing language tag.

#### `rate-limiter`

- **Design a Distributed Rate Limiter** · archetype=`system-design` (conf 1.00) · speakable=362w · deep_dive=931w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 45-word direct_answer has zero bold anchors — unscannable.

#### `scenario-based`

- **Design a Real-Time Gaming Leaderboard** · archetype=`system-design` (conf 0.95) · speakable=307w · deep_dive=610w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 38-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 610w is <50% of system-design lower band (1500).
- **Design a File Storage Service (Google Drive/Dropbox)** · archetype=`system-design` (conf 0.95) · speakable=311w · deep_dive=1062w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 50-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MINOR** · Z3 · `zone3_code_no_language` [step] — Code block in 'Sync Protocol: Change Logs and Conflict Resolution' missing language tag.
- **Design a Video Streaming Platform (YouTube/Netflix)** · archetype=`system-design` (conf 0.95) · speakable=321w · deep_dive=1021w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 55-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MINOR** · Z3 · `zone3_code_no_language` [step] — Code block in 'The Transcoding Pipeline: DAG-Based Parallel Processing' missing language tag.
  - **MINOR** · Z3 · `zone3_code_no_language` [step] — Code block in 'Adaptive Bitrate Streaming: Why Buffering Is a Solved Problem' missing language tag.
  - **MINOR** · Z3 · `zone3_code_no_language` [step] — Code block in 'CDN Cache Hierarchy: Keeping Origin Load Manageable' missing language tag.
- **Design a Ride-Sharing Service (Uber)** · archetype=`system-design` (conf 0.95) · speakable=320w · deep_dive=1011w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 65-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
  - **MINOR** · Z3 · `zone3_code_no_language` [step] — Code block in 'Ride Lifecycle: Every Transition Is a Durable Event' missing language tag.

#### `search-autocomplete`

- **Design Search Autocomplete for a Product Catalog** · archetype=`system-design` (conf 0.95) · speakable=334w · deep_dive=739w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 37-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z3 · `zone3_dd_radically_short` — Deep dive 739w is <50% of system-design lower band (1500).

#### `social-media-feed`

- **Design a Social Media Feed (Twitter/Instagram Timeline)** · archetype=`system-design` (conf 1.00) · speakable=329w · deep_dive=913w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 59-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
  - **MINOR** · Z3 · `zone3_code_no_language` [step] — Code block in 'Hybrid Fan-Out Architecture' missing language tag.

#### `url-shortener`

- **Design a URL Shortener (bit.ly)** · archetype=`system-design` (conf 1.00) · speakable=330w · deep_dive=760w
  - **MAJOR** · Z1 · `zone1_direct_answer_no_bold` — 41-word direct_answer has zero bold anchors — unscannable.
  - **MAJOR** · Z2 · `zone2_speakable_no_verdict` [speakable_answer] — No explicit verdict/recommendation phrase (e.g. 'my default is', 'I reach for').
  - **MAJOR** · Z2 · `system_design_no_scale_math` [speakable_answer] — System-design speakable has no scale numbers (req/sec, TB/day, latency). Spec requires scale math in the opener.
