# Audit — java-collections

**Pillar:** P01 Core Java
**Module:** M02 java-collections
**Topics present:** 7
**Questions:** 51 total → **21 written + 30 STUBS**
**Benchmark sources:** Baeldung Java Collections series (40+ articles), OpenJDK source for HashMap/ArrayList/ConcurrentHashMap, Oracle tutorials, Josh Bloch "Effective Java" collection chapters

---

## Biggest finding — the module is two modules glued together

**The module is titled `java-collections` but more than half its topics are DSA (Data Structures & Algorithms) content:**

| Topic | Type | Qs | Stubs |
|---|---|---|---|
| `collections-internals` | **Collections** | 21 | 0 |
| `algorithm-complexity` | **DSA** | 4 | 4 |
| `sorting-and-searching` | **DSA** | 4 | 4 |
| `trees-and-graphs` | **DSA** | 5 | 5 |
| `dynamic-programming` | **DSA** | 4 | 4 |
| `problem-solving-patterns` | **DSA** | 5 | 5 |
| `scenario-based` | **DSA** (coding round) | 5 | 5 |
| `comparisons` | Collections | 3 | 3 |

**27 of the 30 stubs are DSA content that doesn't belong in a collections module.** Trees and graphs, dynamic programming, Dijkstra, two-pointer technique, sliding window, LRU cache, two-sum — these are algorithm-interview topics, not Java-Collections-API topics.

Two options:

1. **Split into two modules**: `java-collections` (keep collections-internals + comparisons = 24 Qs) and a new `algorithms-and-dsa` module under P01 or elsewhere, with the 27 DSA stubs as its starting backbone.
2. **Rename module** to `collections-and-algorithms` and embrace the combined scope.

Either way, **a user expecting Java Collections prep who sees Dijkstra and fibonacci-DP as stubs will get confused**. This should be resolved before any content work on the DSA stubs.

---

## Second finding — 7 CRITICAL questions with empty direct_answer

Within the `collections-internals` topic, 7 otherwise-substantive questions have empty `direct_answer`:

- Q1 `list-vs-set-vs-map-overview` (323w Zone 3, 0 code)
- Q12 `iterator-vs-listiterator-java` (378w, 1 code, analogy present)
- Q13 `treeset-treemap-navigable` (300w, 1 code)
- Q19 `collections-utility-class-methods` (286w, 1 code)
- Q20 `map-compute-merge-methods` (309w, 2 code)
- Q21 `stream-api-with-collections` (262w, 2 code)

Unlike streams module, these have `key_points` and `interviewer_intent` complete — so this looks like a targeted batch of questions where the `direct_answer` was never authored, not a schema migration issue. 7 specific fills to do.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| HashMap internals always show the `Node<K,V>` structure, bucket array, treeify threshold (8), untreeify threshold (6) | Q5 `hashmap-collision-handling` has 664w / 1 code — decent but add the threshold constants |
| ArrayList vs LinkedList always includes the Big-O table: add, remove, get, contains | Q2 is 497w / **0 code** — missing the table or an indexed access comparison |
| `Comparable` vs `Comparator` always shows the two implementation patterns side-by-side | Q9 has 377w / 1 code — OK |
| Concurrent collections always name `ConcurrentHashMap` bucket striping + Java 8 tree bucket | Q6 `hashmap-vs-hashtable-vs-concurrenthashmap` has 519w / 1 code — decent |
| Opening bolds the collection type (`**HashMap**`, `**LinkedHashMap**`, `**TreeMap**`) | **Failing** — 0 of 21 direct answers have bold anchors (where present) |
| Analogies common (HashMap buckets = "hotel rooms by hash of guest name", TreeMap = "sorted filing cabinet") | **Failing** — 2 of 21 Zone 3s have detected analogies |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | SCOPE MISMATCH | **CRITICAL** | 5 of 7 topics are DSA content, not collections. Needs module-split or rename decision before any content work on those stubs |
| S2 | EMPTY DIRECT_ANSWERS | **CRITICAL** | 7 questions in `collections-internals` have empty `direct_answer` despite other zones being populated. Targeted batch-fill |
| S3 | DSA STUB DEBT | **MAJOR** | 27 DSA stubs if we keep them in scope. Covers foundational DSA: complexity, sorting, trees/graphs, DP, patterns, classic problems |
| S4 | MODULE-WIDE ZONE 1 | **MAJOR** | 14 of 14 non-CRITICAL direct_answers have 0 bold anchors (21 total minus 7 empty). 4 short speakables (103–125w) |
| S5 | CODE-MISSING CONTENT-CRITICAL | **MAJOR** | 7 questions with 282–497w Zone 3 have zero code — especially ArrayList-vs-LinkedList, HashSet internals, ArrayDeque, WeakHashMap, CopyOnWriteArrayList, choosing-right-collection, list-vs-set-vs-map |
| S6 | ANALOGY GAP | MODERATE | 2 of 21 have analogies. Collections map cleanly to analogies (HashMap = "hotel rooms by hash", TreeMap = "sorted index", LinkedHashMap = "registration order kept", CopyOnWriteArrayList = "new copy every time, old readers see old copy", WeakHashMap = "keys are disposable") |
| S7 | DUPLICATE CROSS-MODULE | MODERATE | Q2 `hashmap-vs-concurrenthashmap-comparison` (stub in comparisons topic) overlaps with Q6 `hashmap-vs-hashtable-vs-concurrenthashmap-java` (written in collections-internals). Overlap with M04 concurrency `concurrenthashmap-internals` Q. Decide scope |

---

## Per-question issues — `collections-internals` only (the real module)

| Q | Issue | Severity |
|---|---|---|
| **Q1** list-vs-set-vs-map-overview | **Empty direct_answer.** 323w Zone 3 / **0 code**. Overview question — needs a 3-way example showing what fits where | **CRITICAL** |
| **Q2** arraylist-vs-linkedlist | 497w / **0 code** / no analogy. Must show: the Big-O comparison table, indexed access test, iteration patterns | **MAJOR** |
| **Q3** hashmap-vs-treemap-vs-linkedhashmap | 454w / 1 code / no analogy. 3-way map comparison. Add ordering and Big-O per type | MINOR |
| **Q4** how-hashset-works-internally-java | 332w / **0 code**. Internals question without showing the dummy-value-in-wrapped-HashMap pattern | **MAJOR** |
| **Q5** hashmap-collision-handling | 664w / 1 code / no analogy. **Module's strongest Zone 3.** Add: treeify threshold (8), untreeify (6), bucket → red-black tree transition | MINOR |
| **Q6** hashmap-vs-hashtable-vs-concurrenthashmap-java | 519w / 1 code / no analogy. Classic 3-way. Check: legacy Hashtable synchronization, CHM bucket striping, Java 8 changes | MINOR |
| **Q7** priorityqueue-heap-structure | 352w / 1 code — good | MINOR |
| **Q8** arraydeque-vs-linkedlist-queue-stack | 329w / **0 code**. ArrayDeque vs LinkedList as Queue/Stack is a canonical comparison. Show both as queue, as stack | **MAJOR** |
| **Q9** comparable-vs-comparator | 377w / 1 code / short speakable (106w). Canonical two-pattern question | MINOR |
| **Q10** comparator-thenComparing-reversed | 241w / 3 code / analogy — solid. Short speakable (113w) | MINOR |
| **Q11** fail-fast-vs-fail-safe-iterators-java | 425w / 1 code / short speakable (117w) / no analogy. Canonical `ConcurrentModificationException` repro code should be shown | MINOR |
| **Q12** iterator-vs-listiterator-java | **Empty direct_answer.** 378w / 1 code / analogy (best detected analogy in topic). Short speakable (103w) | **CRITICAL** |
| **Q13** treeset-treemap-navigable | **Empty direct_answer.** 300w / 1 code. NavigableSet/NavigableMap methods (ceiling, floor, higher, lower) should be shown | **CRITICAL** |
| **Q14** enummap-enumset-performance | 282w / 1 code | MINOR |
| **Q15** weakhashmap-gc-cache | 364w / **0 code** / no analogy. WeakReference + GC-triggered eviction pattern deserves a code sketch | **MAJOR** |
| **Q16** copyonwritearraylist-when-and-why | 406w / **0 code** / analogy. Show: iterator snapshot semantics, the CopyOnWrite cost on every mutation | **MAJOR** |
| **Q17** unmodifiable-list-vs-list-of-vs-list-copyof | 287w / **0 code**. 3-way comparison without showing the 3 factory calls | **MAJOR** |
| **Q18** choosing-the-right-collection | 302w / **0 code**. Decision-framework question — a decision-tree code-comment artifact could land this | **MAJOR** |
| **Q19** collections-utility-class-methods | **Empty direct_answer.** 286w / 1 code. `Collections.unmodifiableList`, `synchronizedList`, `sort`, `reverse`, `shuffle`, `min/max`, `frequency` tour | **CRITICAL** |
| **Q20** map-compute-merge-methods | **Empty direct_answer.** 309w / 2 code. `compute`, `computeIfAbsent`, `computeIfPresent`, `merge`, `putIfAbsent` — Java 8 Map API upgrade | **CRITICAL** |
| **Q21** stream-api-with-collections | **Empty direct_answer.** 262w / 2 code. Overlaps with M03 streams module — decide scope (this one is collection-as-source angle; M03 is stream-operation angle) | **CRITICAL** |

---

## DSA topics — content plan (if kept in this module)

If the DSA stubs remain in-scope, here's the natural structure:

### `algorithm-complexity` (4 stubs) — foundational

Critical for interviews. All 4 are standard — big-O intro, common operations table, amortized (ArrayList doubling, HashMap rehash), recursive analysis.

### `sorting-and-searching` (4 stubs)

Modern Java angle: `Arrays.sort`, `Collections.sort`, `Comparator.comparing`, Timsort internals. Binary search via `Collections.binarySearch`.

### `trees-and-graphs` (5 stubs) — biggest topic gap

Standard DSA interview territory. Each stub is a solid standalone. Worth noting: these aren't Java-specific, they're algorithm-specific. If this module stays `java-collections`, these are out-of-place; if it becomes `collections-and-algorithms`, they fit.

### `dynamic-programming` (4 stubs)

Fibonacci + 0/1 knapsack are the canonical introductory DP problems. This is thin for a DP topic — real DP coverage needs at least: LCS, coin change, edit distance, palindrome partitioning, kadane. But for "intermediate" scope 4 is defensible.

### `problem-solving-patterns` (5 stubs)

Best-shaped DSA topic in the module — sliding window, two pointers, fast/slow pointers, top-K, backtracking are *the* five patterns cited in every DSA interview prep source. Write these.

### `scenario-based` (5 stubs)

Classic coding-round problems. These should absolutely be written if DSA stays in scope — these are the "code on the whiteboard" questions.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **8** | S1 scope mismatch + 7 empty-direct_answer questions in collections-internals |
| **MAJOR** | **9** | S3 DSA stub debt, S4 module-wide bold, S5 code-missing (Q2, Q4, Q8, Q15, Q16, Q17, Q18) |
| **MODERATE** | **3** | Analogy gap, Q21 cross-module overlap, Q7 cross-module dup |
| **MINOR** | **7** | Structurally-OK collections-internals questions needing polish |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone1_no_direct_answer` × 7
- `zone1_direct_answer_no_bold_anchors` × 14
- `zone3_no_code_examples` × 7
- `zone3_no_analogy` × 6
- `zone2_speakable_short` × 4

---

## Suggested fix order

1. **Decide the module scope question (S1) FIRST.** Split into `java-collections` + `algorithms-and-dsa`, OR rename to `collections-and-algorithms`. This unblocks everything else because it determines whether the 27 DSA stubs are priority or out-of-scope.
2. **Fill the 7 empty `direct_answer`s in collections-internals** — mechanical, Zone 3 content already exists to summarize.
3. **Add code to the 6 content-critical code-missing collections questions** — Q2 ArrayList-vs-LinkedList, Q4 HashSet internals, Q8 ArrayDeque, Q15 WeakHashMap, Q16 CopyOnWriteArrayList, Q17 unmodifiable trio, Q18 choosing-right-collection.
4. **Module-wide bold-anchor pass on collections-internals** — 14 mechanical fixes.
5. **Add analogies to the 4–5 most-abstract collections questions** — HashMap hashing, TreeMap ordering, LinkedHashMap insertion-order, CopyOnWrite snapshot, WeakHashMap GC eviction.
6. **Decide comparisons-topic overlap with collections-internals Q6** (hashmap-vs-concurrenthashmap overlap) before writing it.
7. **If DSA stays in scope:** write DSA stubs in priority order: problem-solving-patterns (5 canonical patterns) → scenario-based (classic coding problems) → algorithm-complexity → trees-and-graphs → sorting-and-searching → dynamic-programming.
