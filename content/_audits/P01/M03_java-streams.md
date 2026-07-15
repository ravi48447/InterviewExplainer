# Audit — java-streams

**Pillar:** P01 Core Java
**Module:** M03 java-streams
**Topics present:** 8
**Questions:** 46 total → **15 "partial-schema" + 31 STUBS = 0 fully-complete questions**
**Benchmark sources:** Baeldung Streams series, Venkat Subramaniam "Functional Programming in Java", Brian Goetz stream design talks, Java 8+ API docs, JEP 395 (Records), JEP 409 (Sealed), JEP 431 (Sequenced Collections)

---

## Biggest finding — module has zero fully-complete questions

**The module has three failure modes and every question is in one of them:**

1. **STUBS (31 of 46)** — no content at all
2. **PARTIAL-SCHEMA CRITICALS (15 of 46)** — questions with zero `direct_answer`, missing `key_points`, incomplete `interviewer_intent`, and Zone 3 content sized 60–120 words with 2–5 code blocks
3. **ZERO** questions with the full 3-zone schema populated

**The 15 partial-schema questions all follow the same broken pattern:**
- `direct_answer`: 0 words (missing)
- `key_points`: missing
- `interviewer_intent`: incomplete
- `speakable_answer`: 100–170w (present but shorter than module target)
- Zone 3: 60–120w with 2–5 code blocks (code-heavy but prose-thin)

This isn't a content-quality issue — **these 15 questions were authored against an earlier/different schema**, before `direct_answer` + `key_points` + `interviewer_intent` were introduced. They're not broken *per se*, they're an earlier generation that was never migrated. They'll render with Zone 1 empty in the new UI.

---

## Style fingerprint for this module (from top sources)

Not applicable yet — cannot benchmark tone against sources when the module has no complete answer to benchmark. The 15 partial-schema questions have strong code coverage (2–5 blocks each) which is on-brand for streams. But:

- Zone 3 word counts (60–120w) are 1/6 to 1/4 of what top sources (Baeldung, Oracle tutorials) deliver (400–700w for streams topics)
- Bulleted structure would fit streams well; all 15 are prose speakables
- Benchmark-standard content like lazy-evaluation, short-circuit terminals, the `Collectors.toMap` merge-function trap, `findFirst` vs `findAny` is scattered or absent

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | NO COMPLETE QUESTIONS | **CRITICAL** | Module has zero fully-populated 3-zone questions. Every answer will render with a missing zone |
| S2 | SCHEMA MIGRATION DEBT | **CRITICAL** | 15 questions authored against an older schema that lacks `direct_answer`, `key_points`, complete `interviewer_intent`. Treat as a module-wide migration task, not 15 individual fixes |
| S3 | STUB DEBT | **CRITICAL** | 31 of 46 questions are stubs (67% unwritten). Almost entire coverage of Java 9+, optional-api topic (100% stubs), Java 21 features (100% stubs), scenario-based (100% stubs), comparisons (100% stubs) |
| S4 | DUPLICATE QUESTION INTENT | **MAJOR** | **Three questions on Optional best practices:** `optional-usage` (lambdas Q7), `optional-best-practices` (streams Q12), `optional-best-practices` (java-14-to-17 Q7). Note Q12 and java-14-to-17 Q7 have the **same slug** within the module but in different topics. This is a duplicate-slug collision |
| S5 | DUPLICATE SLUGS | **MAJOR** | `optional-best-practices` slug appears in two topics. `functional-interfaces-lambda` (java-14-to-17 Q6) duplicates `functional-interface-java-explained` (lambdas Q2 stub). `method-references` (streams Q13) duplicates `method-references-java-four-types` (lambdas Q5 stub). `lambda-fundamentals` (streams Q11) overlaps with the entire `lambdas-functional-interfaces` topic |
| S6 | TOPIC MISCLASSIFICATION | **MAJOR** | The `java-14-to-17-features` topic contains 2 questions that aren't Java 14–17 features: `functional-interfaces-lambda` (Java 8), `optional-best-practices` (Java 8). These belong in lambdas/optional topics. Real Java 14–17 features (switch expressions, records, sealed classes, pattern matching, text blocks) are partially covered |
| S7 | CROSS-MODULE DUPLICATION | **MAJOR** | `virtual-threads-java-21` here (stub) vs `what-are-virtual-threads-java-21` in M04 concurrency (also stub). `structured-concurrency-java-21` here vs `java21-virtual-threads-structured-concurrency` in M04. `parallel-stream-when-to-use-java` here vs `parallel-streams-when-they-help-vs-hurt` in M04. **Virtual threads belong in concurrency module, not streams** |
| S8 | TOPIC-NAME CONFUSION | **MODERATE** | `lambdas-functional-interfaces` topic contains 3 non-lambda partial-schema Qs: `lambdas-functional-interfaces` (Q3, matches topic name — weird), `streams-api` (Q6, matches the other topic name), `optional-usage` (Q7, overlaps with optional-api topic). These appear to be topic-level aggregator questions in the wrong place |

---

## Stub map (priority guide)

### Tier 1: Core interview content — write immediately

| Stub slug | Topic | Why |
|---|---|---|
| `flatmap-vs-map-java-streams` | streams-api | **#1 stream interview question** |
| `collectors-groupingby-partitioningby-java` | streams-api | Standard 2nd-round probe |
| `reduce-vs-collect-java-streams` | streams-api | Mutable vs immutable reduction |
| `lazy-evaluation-streams-java` | streams-api | Conceptual foundation |
| `what-is-java-stream-api` | streams-api | Topic opener |
| `intermediate-vs-terminal-operations-java` | streams-api | Conceptual foundation |
| `parallel-stream-when-to-use-java` | streams-api | Heavy interview topic — move from M04 if needed |
| `group-objects-by-field-java-streams` | scenario-based | Classic coding-round problem |
| `convert-list-to-map-java-streams` | scenario-based | Classic + the `toMap` merge-fn trap |
| `flatten-list-of-lists-java-streams` | scenario-based | flatMap anchor problem |
| `pattern-matching-for-switch-java-21` | java-21-features | Java 21 headline feature |
| `sequenced-collections-java-21` | java-21-features | JEP 431 — new 2023 API |
| `java-records` | java-14-to-17-features | **#1 Java 16+ interview question** (partial-schema currently) |
| `sealed-classes` | java-14-to-17-features | Pair with records for ADT/pattern matching (partial-schema currently) |
| `pattern-matching-instanceof-java` | java-14-to-17-features | Pair with sealed classes |

### Tier 2: Important but secondary

| Stub slug | Topic |
|---|---|
| `predicate-function-consumer-supplier-java` | lambdas-functional-interfaces (standard 4-interface tour) |
| `method-references-java-four-types` | lambdas-functional-interfaces (static / instance-bound / instance-unbound / constructor) |
| `what-is-lambda-expression-java` | lambdas-functional-interfaces (opener) |
| `functional-interface-java-explained` | lambdas-functional-interfaces (`@FunctionalInterface`) |
| `what-is-optional-in-java` | optional-api (opener) |
| `optional-of-ofNullable-empty-java` | optional-api (factory comparison) |
| `optional-orelse-vs-orelseget-java` | optional-api (**eager vs lazy trap — top probe**) |
| `optional-as-return-type-best-practices-java` | optional-api (Brian Goetz guidance) |
| `java-9-module-system-jpms` | java-9-to-11-features |
| `java-11-http-client-api` | java-9-to-11-features |
| `java-10-var-local-variable-type-inference` | java-9-to-11-features |
| `java-9-factory-methods-list-of-set-of-map-of` | java-9-to-11-features |

### Tier 3: Comparisons — build from other topics once filled

| Stub slug | Resolution |
|---|---|
| `stream-vs-collection-java-comparison` | dedicated side-by-side (lazy/push/traversal) |
| `optional-vs-null-java-comparison` | dedicated — philosophy + migration guidance |
| `imperative-vs-functional-java-comparison` | worthwhile standalone |

---

## Partial-schema question migration map (15 questions)

All 15 follow the same broken pattern. Required migration: **populate `direct_answer` (40–60w), populate `key_points` (5 bullets), populate `interviewer_intent` fully, expand Zone 3 from 60–120w to 400–600w.**

| Q | Location | Current Zone 3 | Code blocks | Action |
|---|---|---|---|---|
| `lambdas-functional-interfaces` | lambdas topic Q3 | 104w | 4 | **DELETE or MERGE** — it's a topic-aggregator Q in the wrong shape; content overlaps with the 6 other lambda Qs in the topic |
| `streams-api` | lambdas topic Q6 | 116w | 4 | **MOVE to streams-api topic** as opener OR delete (stub `what-is-java-stream-api` exists there already) |
| `optional-usage` | lambdas topic Q7 | 103w | 3 | **MERGE/MOVE** — duplicates `optional-best-practices` + belongs in optional-api topic |
| `stream-api-operations` | streams-api Q3 | 82w | 5 | Migrate to full schema; expand Zone 3 |
| `collectors-advanced` | streams-api Q7 | 61w | 3 | Migrate + expand (groupingBy, partitioningBy, mapping, flatMapping, filtering, teeing) |
| `stream-performance` | streams-api Q9 | 92w | 4 | Migrate + expand |
| `lambda-fundamentals` | streams-api Q11 | 90w | 4 | **DELETE or MERGE** — belongs in lambdas topic; overlaps with 6 lambda Qs + the partial-schema Q3 in lambdas |
| `optional-best-practices` | streams-api Q12 | 94w | 4 | **DELETE** (duplicate of java-14-to-17 Q7) |
| `method-references` | streams-api Q13 | 71w | 2 | **MOVE to lambdas topic** OR merge with stub `method-references-java-four-types` |
| `switch-expressions` | java-14-17 Q1 | 88w | 3 | Migrate + expand |
| `text-blocks-string-templates` | java-14-17 Q3 | 71w | 3 | Migrate. **Name caveat:** string templates (JEP 430) is a Java 21 *preview* — don't conflate with text blocks (Java 15) |
| `java-records` | java-14-17 Q4 | 90w | 4 | **Top priority migration** — records are asked in every 2022+ Java interview |
| `sealed-classes` | java-14-17 Q5 | 86w | 3 | **Top priority migration** — pair with records for pattern matching |
| `functional-interfaces-lambda` | java-14-17 Q6 | 80w | 3 | **DELETE or MOVE to lambdas topic** — not a Java 14–17 feature |
| `optional-best-practices` | java-14-17 Q7 | 87w | 3 | **MOVE to optional-api topic** — not a Java 14–17 feature. Keep this copy, delete the streams-api Q12 dup |

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **15** | All 15 partial-schema questions (+ S1/S2/S3 module-wide flags) |
| **MAJOR** | **6** | S4 duplicate intent, S5 duplicate slugs, S6 topic misclassification, S7 cross-module dup, + topic-name confusion in lambdas topic |
| **MODERATE** | **2** | Short speakables, topic aggregator placement |
| **MINOR** | **0** | |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone1_no_direct_answer` × 15
- `zone1_no_key_points` × 12
- `zone1_interviewer_intent_incomplete` × 15
- `zone2_speakable_short` × 4

---

## Suggested fix order

1. **Before any content work: schema decision.** The 15 partial-schema questions need a policy: migrate + expand each, or delete + replace. Likely mix: migrate the high-value ones (records, sealed, switch-expr, collectors-advanced, stream-performance) and delete the duplicates/aggregators (lambdas-functional-interfaces Q3, streams-api Q6, lambda-fundamentals Q11, optional-usage Q7 — these look like an earlier topic-index-as-question model).
2. **Resolve the duplicate slug collision** — `optional-best-practices` appears twice within the module. The same-slug-different-topic collision is probably breaking URL routing somewhere.
3. **Cross-module coordination with M04 concurrency** — virtual threads and structured concurrency belong in M04, not here. Delete the 2 stubs from `java-21-features` topic (virtual-threads-java-21, structured-concurrency-java-21) and let M04 own them. Keep `pattern-matching-for-switch-java-21`, `sequenced-collections-java-21` here.
4. **Write the Tier 1 stubs** — `flatMap-vs-map`, `collectors-groupingBy-partitioningBy`, `reduce-vs-collect`, `lazy-evaluation`, scenario-based trio. These are the questions every stream interview asks.
5. **Fill `optional-api` topic** — 4 stubs all reasonable. `orElse-vs-orElseGet` especially (eager-vs-lazy trap is a top 2nd-round probe).
6. **Decide on Java 9–11 features topic** — the 4 stubs (JPMS, HttpClient, var, List.of/Set.of/Map.of). Useful but lower priority than Java 14+ features which are more interview-central now.
7. **Author `comparisons` topic** — or defer until the Tier 1 content exists to compare.

**Bottom line:** This is the single most incomplete module in the project. Before any polish work, it needs a completeness pass at the authoring level.
