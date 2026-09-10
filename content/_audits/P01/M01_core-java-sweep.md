# Audit — core-java (non-`oop-principles` topics)

**Pillar:** P01 Core Java
**Module:** M01 core-java
**Topics covered in this report:** `generics-wildcards`, `exception-handling`, `string-handling`, `reflection-annotations`, `java-io-nio`, `scenario-based`, `comparisons` (7 of 8 topics; `oop-principles` already curated in a separate report)
**Questions in scope:** 55 (5 + 8 + 5 + 6 + 5 + 23 + 3)
**Stubs:** 24 (44% of in-scope questions)
**Benchmark sources:** Baeldung Java series, Oracle Java Tutorials + JLS, "Effective Java" (Bloch, 3rd ed), "Java Generics and Collections" (Naftalin & Wadler), Angelika Langer generics FAQ, geeksforgeeks.org Java collections internals, oracle.com/java/technologies javadocs

---

## Headline findings

1. **3 CRITICAL schema-broken questions** in `reflection-annotations` — empty `direct_answer`, missing `key_points`, missing `interviewer_intent`. Same old-schema pattern seen in M03 java-streams.
2. **`java-io-nio` topic is 100% stubs** (5 of 5). `comparisons` is 100% stubs (3 of 3). `generics-wildcards` is 80% stubs (4 of 5).
3. **`scenario-based` topic is an overflow dumping ground** — 23 Qs, many of which don't belong in "scenarios" at all (HashMap internals, streams, records, sealed classes, garbage collection). Needs major re-topic-ing.
4. **Code-missing pattern in `scenario-based`** — 10 of 19 written Qs have 0 code blocks in substantive Zone 3s. Includes `==` vs `equals`, `final/finally/finalize`, type-casting, hashmap-resize, method references — all textbook interview Qs that demand code.
5. **Cross-module topic leakage** — HashMap internals (scenario Q7, Q8) belongs in M02 collections; streams content (Q10–Q17) belongs in M03 java-streams; GC and weak refs (Q22, Q23) belong in M05 jvm-internals.

---

## Biggest finding — 3 schema-broken reflection questions

All three Qs in `reflection-annotations` that aren't stubs have the **same broken shape**: 0-word `direct_answer`, missing `key_points`, incomplete `interviewer_intent`, short speakable (116–138w), thin Zone 3 (121–135w).

| Q | direct_answer | key_points | II | speakable | Zone 3 |
|---|---|---|---|---|---|
| Q2 reflection-basics | 0w | missing | incomplete | 138w prose | 135w / 3 code |
| Q4 custom-annotations | 0w | missing | incomplete | 116w prose | 121w / 4 code |
| Q6 annotation-processing | 0w | missing | incomplete | 137w prose | 126w / 3 code |

This is the **M03 java-streams pattern** — questions written against an older schema before `direct_answer` / `key_points` were introduced. Full migration needed on all 3.

---

## Biggest finding — `scenario-based` is an overflow dumping ground

23 questions in `scenario-based` — far larger than any other topic in the module. Content breakdown:

| Category | Qs | Current placement | Should be in |
|---|---|---|---|
| **HashMap internals** | Q7 (1101w, 9 code), Q8 (683w, 0 code) | scenario-based | M02 java-collections |
| **Streams + functional interfaces** | Q10, Q11, Q12, Q13, Q14, Q15, Q16, Q17 (8 Qs) | scenario-based | M03 java-streams |
| **JVM / GC / memory** | Q22 (gc-works), Q23 (weak/soft/phantom) | scenario-based | M05 jvm-internals |
| **Java keywords / syntax** | Q1 pass-by-value, Q2 == vs equals, Q3 final/finally/finalize, Q4 type-casting, Q5 varargs, Q6 autoboxing | scenario-based | Split into keywords-and-references + equality + primitives-and-casting topics |
| **Modern Java features** | Q18 var, Q19+Q20 records, Q21 sealed classes, Q9 date-time API | scenario-based | A new `modern-java-features` topic |
| **True scenarios** | (arguably none) | — | — |

**Of 23 Qs, zero are "scenario" style** (no "you're debugging X, how do you fix it" or "design Y"). The topic name is mislabeled at best, and the content is actually 5+ distinct topics merged into one.

---

## Biggest finding — stub concentration

| Topic | Written | Stubs | % stubs |
|---|---|---|---|
| java-io-nio | 0 | 5 | **100%** |
| comparisons | 0 | 3 | **100%** |
| generics-wildcards | 1 | 4 | **80%** |
| reflection-annotations | 3 (all broken) | 3 | 50% (100% unusable) |
| string-handling | 2 | 3 | 60% |
| exception-handling | 4 | 4 | 50% |
| scenario-based | 23 | 0 | 0% |

Module would go from ~54 written Qs to ~30 written if the broken reflection Qs and stubs were stripped.

---

## Style fingerprint (for these topics)

| What top sources do consistently | Our content |
|---|---|
| Generics Qs show `List<? extends T>` + `List<? super T>` + PECS explanation with a concrete example | **Unauthored** — 4 of 5 stubs including the PECS Q |
| Exception Qs show the class hierarchy (Throwable → Error / Exception → RuntimeException) + a try-catch-finally example | **Failing** — Q1 exception-hierarchy has 0 code |
| String Qs demonstrate immutability with a `== ` vs `.equals()` example + string-pool diagram | **Failing** — Q3 string-pool is 731w of prose with 0 code |
| HashMap internals Q includes the bucket-array + load-factor + rehash code flow | Q7 (1101w, 9 code) matches; Q8 hashmap-resize (683w, 0 code) doesn't |
| Modern-feature Qs (records, sealed, var) show the feature syntax + generated-code equivalent | Partial — Q19 records has 1 code but Q20 generated-code (DA wall, 1 code) could be deeper |
| Opening bolds the Java primitive (`**checked exception**`, `**String**`, `**HashMap**`, `**record**`, `**var**`) | **Failing** — 19 of 20 direct answers have 0 or 1 bold anchor |
| Analogies common (exception = "alarm system", HashMap = "coat check with numbered tickets", reflection = "X-ray of a class", lambda = "shorthand recipe") | 10 of 20 have detected analogies — moderate |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | SCHEMA-BROKEN QUESTIONS | **CRITICAL** | 3 reflection Qs have empty `direct_answer` + missing `key_points` + incomplete `interviewer_intent`. Full migration required |
| S2 | ENTIRE TOPICS ARE STUBS | **MAJOR** | `java-io-nio` (5/5 stubs), `comparisons` (3/3 stubs). IO/NIO includes channels, buffers, large-file reading — standard interview content |
| S3 | GENERICS NEARLY UNAUTHORED | **MAJOR** | 4 of 5 stubs. Only type-erasure exists. PECS, bounded wildcards, generic arrays are all absent |
| S4 | SCENARIO-BASED IS AN OVERFLOW BUCKET | **MAJOR** | 23 Qs spanning 5+ legitimate topics merged into one. Needs re-topic-ing: pull HashMap → M02, streams → M03, GC/weak refs → M05, keep keywords + modern-Java features in M01 under new topic names |
| S5 | CODE-MISSING IN SCENARIO-BASED | **MAJOR** | 10 of 19 written Qs in scenario-based have 0 code in Zone 3. Textbook comparison Qs (== vs equals, final/finally/finalize, type-casting, method-references) must have code |
| S6 | MODULE-WIDE ZONE 1 | MODERATE | ~20 of 20 DAs have 0 or 1 bold anchor; 6 paragraph walls |
| S7 | ANALOGY GAP | MODERATE | 10 of 20 missing analogies |

---

## Per-topic issues

### `generics-wildcards` (1 written of 5)

| Q | Issue | Severity |
|---|---|---|
| **Q1** generics-in-java-introduction-and-benefits | STUB — topic opener missing | STUB |
| **Q2** java-generics-type-erasure-explained | 612w / 2 code / analogy. DA no bold anchors. Only written Q in topic | MINOR |
| **Q3** bounded-vs-unbounded-wildcards-java | STUB — top interview Q | STUB |
| **Q4** pecs-principle-producer-extends-consumer-super | STUB — top interview Q for senior candidates | STUB |
| **Q5** why-cant-create-generic-array-java | STUB | STUB |

### `exception-handling` (4 written of 8)

| Q | Issue | Severity |
|---|---|---|
| **Q1** exception-hierarchy-java | 433w / **0 code** / no analogy. DA has 1 bold. An exception hierarchy Q without a class-hierarchy diagram or code is incomplete | **MAJOR** |
| **Q2** checked-vs-unchecked-exceptions-java-when-to-use | 461w / **0 code** / analogy. Zone 2 short (110w). Textbook interview Q must show code | **MAJOR** |
| **Q3** throw-vs-throws-java-difference | STUB — classic interview Q | STUB |
| **Q4** custom-exceptions-java | 384w / 1 code. DA has 2 bold anchors — **CLEAN** by auditor | CLEAN |
| **Q5** try-with-resources-autocloseable | DA wall (61w). 414w / 2 code / no analogy | MODERATE |
| **Q6** finally-block-execution-rules-java | STUB | STUB |
| **Q7** java-optional-prevent-null-pointer-exception | 247w / 1 code / no analogy | MINOR |
| **Q8** best-practices-for-exception-handling-java | STUB | STUB |

### `string-handling` (2 written of 5)

| Q | Issue | Severity |
|---|---|---|
| **Q1** why-string-is-immutable-in-java | STUB — top interview Q | STUB |
| **Q2** string-vs-stringbuilder-vs-stringbuffer-java | 538w / 1 code / no analogy. Comparison Q with only 1 code block | MINOR |
| **Q3** string-pool-interning | DA wall (64w). 731w / **0 code** / no analogy. String pool Q without a memory-diagram or `==` / `intern()` example is archetype-fail | **MAJOR** |
| **Q4** string-intern-method-java-explained | STUB | STUB |
| **Q5** string-equals-vs-contentequals-java | STUB | STUB |

### `reflection-annotations` (0 of 6 usable) — **entire topic broken**

| Q | Issue | Severity |
|---|---|---|
| **Q1** what-is-reflection-in-java-use-cases | STUB — topic opener missing | STUB |
| **Q2** reflection-basics | **Empty direct_answer, missing key_points, incomplete II** | **CRITICAL** |
| **Q3** reflection-performance-cost-java | STUB | STUB |
| **Q4** custom-annotations | **Empty DA, missing KP, incomplete II, Zone 2 short** | **CRITICAL** |
| **Q5** meta-annotations-retention-target | STUB | STUB |
| **Q6** annotation-processing | **Empty DA, missing KP, incomplete II** | **CRITICAL** |

### `java-io-nio` (0 of 5 written) — **entire topic empty**

All 5 Qs are stubs: IO streams overview, NIO vs IO comparison, channels-and-buffers, large-file reading, serialization vs externalizable. Cross-module overlap flagged: Q2 `java-nio-vs-io-comparison` duplicates the scenario-based Q4 `java-nio-vs-traditional-io` from M05 jvm-internals.

### `scenario-based` (23 Qs) — the overflow bucket

**Qs that arguably belong elsewhere:**

| Q | Current | Suggested | Status |
|---|---|---|---|
| Q7 how-does-hashmap-work-internally | scenario-based | M02 java-collections | 1101w / 9 code (**strong**) — worth relocating |
| Q8 hashmap-resize-rehash-internals | scenario-based | M02 java-collections | 683w / **0 code** (must add code) |
| Q10 predicate-consumer-supplier-function | scenario-based | M03 java-streams (functional-interfaces) | 296w / 0 code |
| Q11 java-functional-interfaces-lambdas | scenario-based | M03 java-streams | 438w / 1 code |
| Q12 java-method-references-four-types | scenario-based | M03 java-streams | 434w / **0 code** (must add 4-type code) |
| Q13 java-streams-lazy-evaluation | scenario-based | M03 java-streams | 552w / 1 code |
| Q14 java-stream-map-vs-flatmap | scenario-based | M03 java-streams | 372w / 2 code |
| Q15 java-stream-collectors-groupingby-tomap | scenario-based | M03 java-streams | 380w / 2 code |
| Q16 parallel-streams-java | scenario-based | M03 java-streams | 390w / **0 code** |
| Q17 stream-collectors-joining-reducing | scenario-based | M03 java-streams | 383w / **0 code**. DA only 19w |
| Q22 how-java-garbage-collection-works | scenario-based | M05 jvm-internals | 834w / **0 code** |
| Q23 weak-soft-phantom-references | scenario-based | M05 jvm-internals | DA wall. 526w / 1 code |

**Qs that genuinely belong in M01 (keywords / syntax / modern-Java):**

| Q | Issue | Severity |
|---|---|---|
| Q1 java-pass-by-value-not-reference | 341w / 1 code / analogy | MINOR |
| Q2 difference-between-equals-and-double-equals-java | 351w / **0 code** / no analogy. **Classic interview Q with no code is indefensible** | **MAJOR** |
| Q3 final-finally-finalize-java-difference | 330w / **0 code** / no analogy. **Classic 3-way comparison with no code** | **MAJOR** |
| Q4 type-casting-widening-narrowing | 413w / **0 code** / no analogy. DA has 5 bold anchors — best in module | **MAJOR** |
| Q5 varargs-java | 376w / 1 code / analogy — **CLEAN** | CLEAN |
| Q6 java-autoboxing-unboxing-integer-cache | 304w / 1 code / no analogy | MINOR |
| Q9 java-date-time-api | 415w / **0 code** / analogy. Java 8 date-time must show examples | **MAJOR** |
| Q18 java-var-local-variable-type-inference-limitations | 153w / **0 code** — Zone 3 too thin | **MAJOR** (thin) |
| Q19 java-record-classes-what-they-are-when-to-use | 293w / 1 code / no analogy | MINOR |
| Q20 java-records-generated-code | DA wall. 314w / 1 code / no analogy. Should show record + generated-equivalent code side-by-side (has only 1 code block) | MODERATE |
| Q21 sealed-classes-pattern-matching | 487w / 1 code / no analogy | MINOR |

### `comparisons` (0 of 3 written) — **entire topic empty**

All 3 Qs are stubs: abstract class vs interface, checked vs unchecked exception, heap vs stack. The first two would duplicate (a) oop-principles and (b) exception-handling if authored here — needs scope decision.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **3** | S1 reflection schema breakage (Q2, Q4, Q6 reflection-annotations) |
| **MAJOR** | **~12** | S2 empty topics, S3 generics gap, S4 scenario-based overflow, S5 code-missing pattern, Q1+Q2 exception-handling, Q3 string-pool, Q2+Q3+Q4+Q9+Q18 scenario-based keyword Qs |
| **MODERATE** | **~12** | S6 bold, S7 analogy, Q5 try-with-resources, Q7+Q8 hashmap (if stay), Q20 records, Q12 method-references, Q16 parallel-streams, Q17 collectors, Q22 GC |
| **MINOR** | **~10** | Polish-level |
| **CLEAN** | **2** | Q4 custom-exceptions, Q5 varargs |
| **STUB** | **24** | Across all 7 topics |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × ~16
- `zone3_no_code_examples` × ~12
- `zone3_no_analogy` × ~10
- `zone2_speakable_short` × 5
- `zone1_direct_answer_paragraph_wall` × 6
- `zone1_no_direct_answer` × 3

---

## Suggested fix order

1. **Migrate the 3 schema-broken reflection Qs** (S1). Same template as used for M03 java-streams migration — add `direct_answer`, `key_points`, fill `interviewer_intent`.
2. **Re-topic `scenario-based`** (S4). Move HashMap → M02, 8 streams Qs → M03, GC/weak-refs → M05. Split remaining 11 Qs into `keywords-and-operators` + `modern-java-features` + a real `scenario-based` topic (empty until true scenario Qs are authored).
3. **Fix code-missing in the keyword Qs** that stay in M01 (S5): Q2 `==` vs equals, Q3 final/finally/finalize, Q4 type-casting, Q9 date-time API, Q18 var. Each is a textbook comparison Q and demands code.
4. **Fix Q1 + Q2 exception-handling (code-missing)** — exception hierarchy + checked vs unchecked both need code.
5. **Fix Q3 string-pool-interning** — must show `==` vs `.equals()` vs `.intern()` behavior.
6. **Author `java-io-nio` topic** (5 stubs → 5 Qs).
7. **Author `generics-wildcards` (4 stubs)** — priority PECS + bounded wildcards.
8. **Author `comparisons` topic (3 stubs)** — or delete if content duplicates other topics.
9. **Fill exception-handling stubs** (4 Qs): throw vs throws, finally execution rules, best practices, custom-exceptions is already clean.
10. **Fill string-handling stubs** (3 Qs): immutability, intern method, equals vs contentEquals.
11. **Module-wide bold-anchor pass** + analogy pass.

---

## Overall shape of M01 after cleanup

Today M01 has 78 Qs across 8 topics with a combined "oop-principles looks solid, the rest is a mix". After re-topic-ing, migration, and stub-filling, M01 should target:

- `oop-principles` (already in good shape — 24 Qs)
- `keywords-and-operators` (new — pass-by-value, == vs equals, final/finally/finalize, type-casting, autoboxing, varargs ~8 Qs)
- `exception-handling` (8–10 Qs after stubs filled)
- `generics-wildcards` (5 Qs after stubs filled)
- `string-handling` (5 Qs after stubs filled)
- `reflection-annotations` (6 Qs after migration + stubs filled)
- `java-io-nio` (5 Qs after stubs filled)
- `modern-java-features` (new — records, sealed, var, date-time, pattern matching ~5 Qs)
- `comparisons` (3–5 Qs or delete)
- `scenario-based` (empty until real scenarios authored)

Projected end state: ~65 Qs across 9 topics, all non-stub, all correct archetype.
