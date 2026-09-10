# Audit — java-concurrency

**Pillar:** P01 Core Java
**Module:** M04 java-concurrency
**Topics present:** 11 topics
**Questions:** 52 total → **29 written + 23 STUBS (44% unwritten)**
**Benchmark sources:** "Java Concurrency in Practice" (Brian Goetz), Baeldung concurrency series (50+ articles), JEP 444 (virtual threads GA), Ron Pressler's virtual threads talks, JCStress, jaiguru's concurrency interview series

---

## Biggest finding — 44% of the module is stubs

**This is by far the most stub-heavy module in the project.** 23 of 52 questions are unwritten, concentrated in high-interview-value areas:

- **virtual-threads: 3 of 4 stubs (75% unwritten)** — Java 21 virtual threads is the single most-asked-about Java topic in 2024–25 interviews. Near-total absence is critical.
- **comparisons: 3 of 3 stubs (100%)**
- **completable-future: 3 of 5 stubs** (including the fundamental "what is CompletableFuture" + the canonical `thenCompose` vs `thenCombine` comparison)
- **java-memory-model: 3 of 5 stubs** (including "what is JMM" itself + volatile-vs-atomic + data-race-vs-race-condition)
- **concurrency-patterns: 3 of 5 stubs** (including thread-safe singleton — textbook interview question)
- **thread-pools-and-executor: 3 of 6 stubs**
- **threads-and-lifecycle: 4 of 7 stubs** (including the opener "what is a thread in Java")

**For a core Java interview module this level of incompleteness is the dominant concern.** Quality improvements to the existing 29 answers are secondary.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Concurrency answers always include a code example (Runnable impl, `synchronized` method, CompletableFuture chain) | **Matching for 27 of 29 written Qs** — only Q2 concurrenthashmap and Q2 countdownlatch are code-missing. Code coverage is actually the strongest signal in this module |
| Opening bolds the concurrency primitive (`**synchronized**`, `**volatile**`, `**ReentrantLock**`, `**CompletableFuture**`) | **Failing** — 0 of 29 direct answers have bold anchors |
| Analogies are core currency for concurrency (locks = "bathroom key", volatile = "shared whiteboard", happens-before = "the email must arrive before the reply") | **Failing** — 3 of 29 have analogies. Concurrency is the most analogy-rich topic and ours has the lowest detection rate |
| Zone 3 depth 500–900w typical for concurrency interview prep (JCIP-influenced) | **Failing** — our average Zone 3 is ~335w. Consistently thin across the module |
| Virtual threads content shows `Thread.ofVirtual()`, `Executors.newVirtualThreadPerTaskExecutor()`, + the pinning problem | Only the structured-concurrency Q is written (360w, 1 code). Rest are stubs |
| Exception-handling in async chains always shown explicitly (`handle`, `exceptionally`, `whenComplete`) | **Stubbed** (Q5 completable-future) |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | MASSIVE STUB DEBT | **CRITICAL** | **23 of 52 questions (44%) are stubs.** The module is incomplete, not imperfect |
| S2 | VIRTUAL THREADS GAP | **CRITICAL** | 3 of 4 virtual-threads questions are stubs. Java 21 virtual threads is the #1 Java interview topic right now. The one written Q (`java21-virtual-threads-structured-concurrency`) at 360w is also thin for the topic |
| S3 | COMPARISONS TOPIC 100% STUBS | **MAJOR** | All 3 comparisons stubs. Two of the three (`future-vs-completablefuture-comparison`, `virtual-vs-platform-threads-comparison`) duplicate existing topic questions — redirect or remove |
| S4 | CORE-CONCEPT STUBS | **MAJOR** | "Fundamental" openers like `what-is-thread-in-java`, `what-is-synchronization-java`, `why-use-thread-pool-java`, `what-is-completablefuture-java`, `what-is-java-memory-model-jmm`, `what-are-virtual-threads-java-21`, `why-concurrent-collections-java` are all stubs. Each topic is missing its "conceptual opener" |
| S5 | DUPLICATE QUESTION INTENT | MODERATE | `future-vs-completablefuture-comparison` (comparisons stub) duplicates `java-future-vs-completablefuture-comparison` (completable-future Q2). Same applies to `virtual-vs-platform-threads-comparison` — likely a copy of `what-are-virtual-threads-java-21` angle |
| S6 | MODULE-WIDE ANALOGY DEFICIT | **MAJOR** | Only 3 of 29 written Qs have detected analogies. Concurrency concepts are notoriously abstract and benefit most from analogy. This is a bigger gap than in any other module |
| S7 | ZONE 3 UNIFORMLY THIN | **MODERATE** | Average Zone 3 is ~335w across written questions. For a topic as complex as concurrency, top sources consistently go 500–900w. Our content reads as flashcard-length rather than interview-depth |
| S8 | MODULE-WIDE ZONE 1 | **MODERATE** | 29 of 29 direct answers have zero bold anchors; 2 paragraph walls |

---

## Stub map (priority guide)

### Tier 1: Write immediately (core interview territory)

| Stub slug | Why critical |
|---|---|
| `what-are-virtual-threads-java-21` | #1 Java 21 interview question |
| `when-to-use-virtual-threads-java` | Mandatory follow-up — when NOT to use them |
| `virtual-threads-pinning-problem-java` | Top deep-dive probe on virtual threads |
| `thread-safe-singleton-patterns-java` | Textbook interview question (enum, DCL, Bill Pugh) |
| `double-checked-locking-java` | Canonical pre-Java-5 bug + modern `volatile` fix |
| `thencompose-vs-thencombine-java` | Top CompletableFuture interview probe |
| `completablefuture-exception-handling-java` | `handle`/`exceptionally`/`whenComplete` distinctions |
| `volatile-vs-atomic-java` | JMM classic — both-about-visibility-but-different-guarantees |
| `data-race-vs-race-condition-java` | Precise-definitions question — JMM |
| `how-to-detect-deadlock-java-thread-dump` | `jstack`, `jconsole`, `jps`, thread-dump reading |
| `how-to-avoid-deadlock-java` | Lock ordering, timeouts, `tryLock`, avoid nested locks |

### Tier 2: Should write but topical openers

| Stub slug | Why |
|---|---|
| `what-is-thread-in-java` | Conceptual opener but actual interview rarely asks straight-up |
| `what-is-synchronization-java` | Same — usually paired with `synchronized` mechanics |
| `why-use-thread-pool-java` | Opener — answered indirectly by Q2 executorservice-thread-pool-types |
| `what-is-completablefuture-java` | Opener — answered indirectly by Q3 chains, Q2 comparison |
| `what-is-java-memory-model-jmm` | Opener — JMM questions usually focus on happens-before |
| `why-concurrent-collections-java` | Opener |
| `what-are-virtual-threads-java-21` | See Tier 1 |

**Decision option:** some "what-is" openers could be removed or consolidated into the existing comparison/mechanics question in each topic rather than authored separately.

### Tier 3: Worth writing but lower priority

| Stub slug | Why |
|---|---|
| `thread-start-vs-run-java` | Classic beginner interview trap |
| `thread-sleep-vs-wait-java` | Classic interview comparison |
| `thread-interrupt-mechanism-java` | Interrupt protocol, `InterruptedException`, cooperative cancellation |
| `synchronized-method-vs-block-java` | Partially covered by Q2 synchronized-keyword-monitors — may merge |
| `fixed-vs-cached-vs-single-threadpool-java` | Partially covered by Q2 executorservice-thread-pool-types — may merge |
| `rejectedexecutionhandler-java` | Important but niche (AbortPolicy, CallerRunsPolicy, DiscardPolicy, DiscardOldestPolicy) |
| `linkedblockingqueue-vs-arrayblockingqueue-java` | Concrete collection comparison |
| `producer-consumer-pattern-java` | Covered by Q3 blockingqueue-producer-consumer — may merge |

### Tier 4: Likely duplicates — remove or redirect

| Stub slug | Issue |
|---|---|
| `future-vs-completablefuture-comparison` | = completable-future Q2 |
| `volatile-vs-synchronized-comparison` | likely = reasonable comparison but covered by Q3 volatile-visibility + Q2 synchronized-keyword |
| `virtual-vs-platform-threads-comparison` | = `what-are-virtual-threads-java-21` with a comparative frame |

**Decision:** either delete these three or repurpose the `comparisons` topic to host dedicated side-by-side comparison questions (with tables + "when-to-use" guidance) distinct from the feature-topic's mechanics question.

---

## Per-question issues (written questions only)

The 29 written questions are uniformly structurally sound (II complete, 5 key points each, speakables present) but **uniformly thin in Zone 3** and **uniformly missing bold + analogy**. Listing only the notable specifics:

### `threads-and-lifecycle` (3 written of 7)

| Q | Issue | Severity |
|---|---|---|
| Q2 thread-vs-runnable-vs-callable | 278w / **0 code** — a 3-construct comparison without showing the 3 constructs is the archetype fail | **MAJOR** |
| Q3 java-thread-lifecycle-states | 323w / 1 code / no analogy. Thread-state diagram as ASCII or analogy ("states of an employee: hired → working → on break → terminated") | MINOR |
| Q5 daemon-threads-java-explained | 334w / 1 code / short speakable (111w) / no analogy | MINOR |

### `synchronization-and-locks` (6 written of 8)

| Q | Issue | Severity |
|---|---|---|
| Q2 synchronized-keyword-monitors | 385w / 1 code / no analogy. "Monitor = every Java object has a lock built in" is core | MINOR |
| Q4 synchronized-vs-reentrantlock | 287w / **0 code** — a comparison without the comparative code is off-brand | **MAJOR** |
| Q5 reentrant-read-write-lock | 353w / 1 code / no analogy | MINOR |
| Q6 stampedlock-optimistic-reads | 331w / 1 code / no analogy. Optimistic reads are niche enough that the code is essential | MINOR |
| Q7 wait-notify-vs-condition-await-signal | 416w / 2 code / analogy / short speakable (115w) | MINOR |
| Q8 atomicinteger-vs-synchronized | 348w / 1 code / no analogy | MINOR |

### `thread-pools-and-executor` (3 written of 6)

| Q | Issue | Severity |
|---|---|---|
| Q2 executorservice-thread-pool-types | 299w / 1 code / no analogy. Each pool type needs its own code block | MODERATE |
| Q4 threadpool-sizing-cpu-io-bound | 393w / 1 code / no analogy. Must show: the Little's Law formula `threads = cores × (1 + wait/compute)` | MINOR |
| Q6 forkjoinpool-recursive-task | 318w / 1 code / no analogy | MINOR |

### `completable-future` (2 written of 5)

| Q | Issue | Severity |
|---|---|---|
| Q2 java-future-vs-completablefuture-comparison | 248w / **0 code** — CF Q without any `supplyAsync().thenApply()` chain is archetype-fail | **MAJOR** |
| Q3 completablefuture-chains | 281w / 2 code / analogy — best-shaped CF Q | MINOR |

### `concurrent-collections` (2 written of 4)

| Q | Issue | Severity |
|---|---|---|
| Q2 concurrenthashmap-internals | 388w / **0 code** / analogy. Internals content without showing the `Node<K,V>` structure / bucket striping is thin | **MAJOR** |
| Q3 blockingqueue-producer-consumer | 317w / 1 code / no analogy | MINOR |

### `java-memory-model` (2 written of 5)

| Q | Issue | Severity |
|---|---|---|
| Q2 happens-before | 414w / 1 code / no analogy. JMM happens-before analogy ("email chain — the reply can't arrive before the original") is standard | **MODERATE** |
| Q3 volatile-visibility-guarantee | 354w / 1 code / no analogy | MINOR |

### `virtual-threads` (1 written of 4)

| Q | Issue | Severity |
|---|---|---|
| Q2 java21-virtual-threads-structured-concurrency | 360w / 1 code / no analogy. Virtual threads deserve 600–900w Zone 3 given the interview centrality | **MODERATE** |

### `concurrency-patterns` (2 written of 5)

| Q | Issue | Severity |
|---|---|---|
| Q2 countdownlatch-vs-cyclicbarrier-vs-semaphore | 346w / **0 code** / analogy. 3-way synchronizer comparison without code — each has its own idiomatic example. Analogy: latch = "starting gun at race", barrier = "everyone waits at the gate then passes together", semaphore = "N parking spots" | **MAJOR** |
| Q3 threadlocal-use-cases-pitfalls | Paragraph wall (72w). 389w / 1 code / no analogy | MODERATE |

### `scenario-based` (3 written of 5)

| Q | Issue | Severity |
|---|---|---|
| Q1 parallel-streams-when-they-help-vs-hurt | Paragraph wall (72w). 320w / 1 code / no analogy | MODERATE |
| Q2 race-condition-identify-and-fix | 341w / 1 code / no analogy | MINOR |
| Q3 liveness-hazards-deadlock-livelock-starvation | 351w / 1 code / no analogy. Analogies are *the* canonical way to explain these 3 ("traffic-jam", "both step aside for each other forever", "beggar never served") | MODERATE |

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **2** | S1 (23 stubs) + S2 (virtual threads gap) |
| **MAJOR** | **6** | S3 comparisons stubs, S4 conceptual openers, S6 analogy deficit, Q2 thread-vs-runnable, Q4 sync-vs-reentrantlock, Q2 CF-comparison, Q2 ConcurrentHashMap, Q2 countdownlatch |
| **MODERATE** | **8** | Thin Zone 3 pattern, Q2 executorservice pools, Q2 happens-before, Q2 virtual-threads structured, threadlocal, parallel-streams, liveness-hazards |
| **MINOR** | **19** | Remaining written questions — need bold + analogy + Zone 3 thickening |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 29
- `zone3_no_analogy` × 26 (across written Qs)
- `zone3_no_code_examples` × 5
- `zone2_speakable_short` × 2
- `zone1_direct_answer_paragraph_wall` × 2

---

## Suggested fix order

1. **Write the Tier 1 stubs first** — especially the 3 virtual-threads stubs. This is the highest-interview-value investment in the project right now.
2. **Resolve `comparisons` topic stubs** (S3) — either delete the dups or author dedicated side-by-side comparisons.
3. **Decide on "what-is" Tier 2 openers** — author them OR collapse them into topic-anchor questions. Document the decision.
4. **Thicken existing written content** — target 500–700w Zone 3 for the interview-critical Qs. Add analogies aggressively (this module is the biggest analogy opportunity in the project).
5. **Add code to the 4 content-critical code-missing Qs** — thread-vs-runnable-vs-callable, synchronized-vs-reentrantlock, future-vs-completablefuture, ConcurrentHashMap internals, countdownlatch-vs-cyclicbarrier-vs-semaphore.
6. **Module-wide bold-anchor pass**.
