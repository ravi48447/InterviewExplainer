# Audit — nosql-mongodb

**Pillar:** P03 Data Layer
**Module:** M13 nosql-mongodb
**Topics present:** 5 (of 9 — `nosql-fundamentals`, `nosql-patterns`, `scenario-based`, `comparisons` have 0 questions)
**Questions:** 20 (all written, no stubs) — **but 11 of 20 (55%) are Elasticsearch, not MongoDB**
**Benchmark sources:** MongoDB official docs ("Data Modeling", "Aggregation Framework"), MongoDB University M001/M121, Elastic docs ("Query DSL", "Mapping basics"), Daniel Lemire on inverted indexes, HighScalability MongoDB/ES deep-dives

---

## Biggest finding — module scope is mislabeled

The module is named `nosql-mongodb` but the question distribution is:

- MongoDB proper: 9 questions (45%)
- Elasticsearch: 11 questions (55%)

This is a scope problem. Choose one:

**Option A (recommended):** Rename to `nosql-databases` and add a proper Elasticsearch structure (separate topics for ES-fundamentals, ES-query-dsl, ES-cluster-ops).

**Option B:** Split into two modules (`nosql-mongodb` and `nosql-elasticsearch`) — cleaner for SEO and user navigation but requires more index/routing work.

**Option C:** Move all Elasticsearch questions to a new module and restore `nosql-mongodb` to 9 MongoDB questions, grown to ~15 with the missing topics filled.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| MongoDB content is **query-first** — every concept shown via mongo shell / Compass / aggregation pipeline code | **Failing** — 9 of 20 Zone 3s have zero code (4 of those are MongoDB — unacceptable for mongodb topics) |
| Elasticsearch content shows a mapping + query DSL side-by-side for every concept | **Mixed** — 7 of 11 ES questions have ≤1 code block |
| Opening paragraph bolds the key concept (`**document model**`, `**aggregation pipeline**`, `**inverted index**`, `**index mapping**`) | **Failing across the whole module** — 0 of 20 direct answers have bold anchors |
| MongoDB fundamentals framing (BASE vs ACID, when to pick NoSQL) opens the topic | **Failing** — `nosql-fundamentals` topic has 0 questions |
| Schema design patterns are the #1 published interview topic for MongoDB (bucket, subset, computed, outlier) | **Failing** — `nosql-patterns` topic has 0 questions |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | SCOPE MISLABEL | **CRITICAL** | Module name says `nosql-mongodb` but 55% is Elasticsearch. Users searching for MongoDB prep get mostly ES answers. Decision needed — see scope options above |
| S2 | EMPTY TOPICS | **CRITICAL** | 4 of 9 topics empty — `nosql-fundamentals` (CAP, BASE, when-NoSQL), `nosql-patterns` (bucket/subset/computed/outlier patterns — literally MongoDB's flagship published content), `scenario-based`, `comparisons` |
| S3 | MODULE-WIDE ZONE 1 | **MAJOR** | 17 of 20 `direct_answer`s are **paragraph walls** (60–95w, no bold). Worst ratio of any module in the project |
| S4 | INCOMPLETE INTERVIEWER_INTENT | **MAJOR** | 7 of 20 questions have incomplete `interviewer_intent`: both document-model Qs, all 4 mongodb-core Qs, the mongodb-indexes Q, and mongodb-atlas-vs-elasticsearch |
| S5 | CODE-MISSING ZONE 3 | **MAJOR** | 9 of 20 Zone 3s with zero code. For a module where the content IS the code (aggregation stages, index mappings, query DSL), this is a structural failure |
| S6 | THIN ZONE 3 | **MODERATE** | MongoDB-core and mongodb-with-spring Zone 3s are 237–308w. Benchmark MongoDB content at this depth runs 500–800w with multiple code blocks |
| S7 | MISPLACED QUESTION | **MINOR** | `mongodb-atlas-search-vs-elasticsearch` is a comparison question filed under `elasticsearch-basics`. Belongs in `comparisons` topic once that exists |
| S8 | MISSING ES OPENER | **MODERATE** | `elasticsearch-basics` topic has 11 specific questions but no "What is Elasticsearch / when do you reach for it?" meta-question. Benchmark ES interview prep always opens with this |

---

## Per-topic findings

### `nosql-fundamentals` (0 Qs) — **CRITICAL topic gap**

Suggest adding:
- `when-to-pick-nosql-vs-relational` — workload shape, schema stability, query pattern, join needs, consistency requirements
- `cap-theorem-and-base-vs-acid` — how MongoDB tuning (read/write concerns, replica set config) maps to the CAP spectrum
- `mongodb-consistency-and-durability` — write concerns, read concerns, linearizable reads

### `document-model` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** mongodb-document-model-vs-relational-model | Paragraph wall (71w, no bold — should anchor `**document**`, `**collection**`, `**flexible schema**`, `**denormalization**`). Zone 3 is 391w / **0 code** — a doc-vs-relational comparison without showing an actual document structure side-by-side with a SQL row is incomplete. `interviewer_intent` incomplete | **MAJOR** |
| **Q2** mongodb-embedding-vs-referencing-documents | Paragraph wall (95w — longest in module). Zone 3 is 413w / **0 code** / no analogy — this topic NEEDS embedded vs referenced JSON side-by-side. The Rule of Thumb snippet ("embed for 1:few, reference for 1:many unbounded") is the canonical interview output. `interviewer_intent` incomplete | **MAJOR** |

### `mongodb-core` (4 Qs) — mixed quality

| Q | Issue | Severity |
|---|---|---|
| **Q1** mongodb-aggregation-pipeline-match-group-lookup | Paragraph wall (69w). Zone 3 is **269w / 3 code blocks** — code coverage is good but word count is thin; aggregation pipeline is a huge topic that can justify 600w+. `interviewer_intent` incomplete | MODERATE |
| **Q2** mongodb-multi-document-acid-transactions | Paragraph wall (75w). Zone 3 280w / 1 code — thin. Needs: session-based transaction snippet showing `withTransaction`, the 4.0/4.2 boundary (replica sets → sharded clusters), retryable writes. `interviewer_intent` incomplete | MODERATE |
| **Q3** mongodb-performance-explain-query-optimization | Paragraph wall (80w). Zone 3 266w / 1 code — thin for a perf topic. Should show a full `.explain('executionStats')` output walkthrough. `interviewer_intent` incomplete | **MAJOR** |
| **Q4** mongodb-replica-sets-read-preferences | Paragraph wall (76w). Zone 3 308w / 1 code / analogy present. Needs: primary/secondary/arbiter diagram + read preference enum table (`primary`, `primaryPreferred`, `secondary`, `nearest`). `interviewer_intent` incomplete | MODERATE |

**Topic gap:** no sharding question. Sharding is Top-3 MongoDB interview territory (shard keys, chunks, balancer, zone sharding). Can go in mongodb-core or a new `mongodb-scaling` topic.

### `mongodb-with-spring` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** spring-data-mongodb-repository-queries | Paragraph wall (62w). Zone 3 **265w / 0 code** — Spring Data MongoDB content without showing `@Document`, `MongoRepository`, `@Query` annotation snippets is meaningless. Four `step` sections in prose only. `interviewer_intent` incomplete | **MAJOR** |
| **Q2** mongodb-change-streams-spring-data | Paragraph wall (68w). Zone 3 237w / **0 code** — Change Streams is by nature a code-heavy topic; `ReactiveMongoTemplate.changeStream(...)` snippet is essential. `interviewer_intent` incomplete | **MAJOR** |

### `mongodb-indexes` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** mongodb-indexing-compound-sparse-ttl | Paragraph wall (71w). Zone 3 284w / 1 code / analogy present. Thin. Should show: compound index prefix rule (ESR: Equality, Sort, Range), TTL index example with `expireAfterSeconds`, partial index expression. `interviewer_intent` incomplete | **MAJOR** |

**Topic gap:** topic is thin — 1 Q for a complex area. Suggest adding: `mongodb-index-strategies-covered-queries` (covered query = query + sort + projection all served from index), `mongodb-text-indexes-vs-atlas-search`.

### `nosql-patterns` (0 Qs) — **CRITICAL topic gap**

MongoDB's published [Building with Patterns](https://www.mongodb.com/blog/post/building-with-patterns-a-summary) series is the most-referenced NoSQL schema-design content. Absent from this module. Suggest:
- `mongodb-bucket-pattern` — time-series / log-aggregation grouping
- `mongodb-subset-pattern` — hot data in main doc, cold in separate collection
- `mongodb-computed-pattern` — pre-computed aggregates stored with doc
- `mongodb-outlier-pattern` — flag + separate collection for oversized docs
- `mongodb-schema-versioning` — `schema_version` field migration

### `elasticsearch-basics` (11 Qs)

Strong topic overall, but two structural issues:

**Missing opener question** — no "What is Elasticsearch, when would you reach for it?" fundamentals question. Q1 `elasticsearch-vs-postgresql-search` jumps straight to comparison.

**Q11 misplaced** — `mongodb-atlas-search-vs-elasticsearch` is structurally a comparison and belongs in `comparisons` topic.

| Q | Issue | Severity |
|---|---|---|
| **Q1** elasticsearch-vs-postgresql-search | Paragraph wall (69w). Zone 3 497w / 1 code / analogy — solid | MINOR |
| **Q2** elasticsearch-index-mapping | No bold (58w). Zone 3 528w / **0 code** / no analogy — mapping content without showing a JSON mapping definition is incomplete | **MAJOR** |
| **Q3** elasticsearch-match-vs-term-vs-bool | No bold (60w). Zone 3 379w / **0 code** — this is a query DSL comparison; MUST show side-by-side query JSON | **MAJOR** |
| **Q4** elasticsearch-spring-boot-integration | No bold (58w). Zone 3 313w / **0 code** — Spring Data ES `@Document`, `ElasticsearchRepository`, `NativeSearchQuery` snippets essential | **MAJOR** |
| **Q5** inverted-index-full-text-search | Paragraph wall (73w). Zone 3 254w / **0 code** / analogy present — text concept; analogy-first is OK but should show at least how an inverted index is laid out (term → doc-id postings list) | MODERATE |
| **Q6** elasticsearch-pagination-deep-results | Paragraph wall (65w). Zone 3 326w / **0 code** — pagination patterns `from+size` vs `search_after` vs scroll need side-by-side JSON requests | **MAJOR** |
| **Q7** elasticsearch-cluster-nodes-shards-replicas | Paragraph wall (64w). Zone 3 410w / **0 code** / no analogy — cluster topology diagram section is noted; consider adding `cat/nodes` or `cat/shards` REST output example | MODERATE |
| **Q8** elasticsearch-aggregations | Paragraph wall (62w). Zone 3 376w / 1 code / analogy in DA — OK, 1 more code block showing bucket vs metric aggs side-by-side would help | MODERATE |
| **Q9** elasticsearch-sync-primary-database | Paragraph wall (66w). Zone 3 435w / **0 code** / analogy present — should show one pattern concretely (Debezium CDC → Kafka → ES sink OR dual-write with idempotency) | **MAJOR** |
| **Q10** elasticsearch-analyzers-tokenizers | Paragraph wall (76w). Zone 3 535w / 2 code — solid depth. No analogy but topic is inherently concrete | MINOR |
| **Q11** mongodb-atlas-search-vs-elasticsearch | Paragraph wall (75w). Zone 3 391w / **0 code**. `interviewer_intent` incomplete. **MOVE to `comparisons` topic once created** | **MAJOR + MOVE** |

### `scenario-based` (0 Qs) — topic empty

Suggested questions:
- `migrating-mongodb-to-postgres-jsonb` — when/why, schema flattening strategy, cutover approach
- `handling-mongodb-schema-evolution-in-prod` — backfills, dual-read/dual-write, `schema_version` field
- `elasticsearch-for-autocomplete-typeahead` — edge n-grams, completion suggester, scoring tuning

### `comparisons` (0 Qs) — topic empty

Suggested questions:
- `mongodb-vs-postgres-jsonb` — when Postgres JSONB beats a dedicated document DB
- `mongodb-vs-dynamodb` — when AWS-native wins
- Move `mongodb-atlas-search-vs-elasticsearch` here from elasticsearch-basics

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **2** | S1 scope mislabel, S2 four topics empty |
| **MAJOR** | **12** | 2 from document-model, 1 from mongodb-core Q3, 2 from mongodb-with-spring, 1 from mongodb-indexes, 5 from elasticsearch-basics (Q2, Q3, Q4, Q6, Q9) + Q11 move, S3 module-wide bold gap, S4 interviewer_intent |
| **MODERATE** | **8** | 3 mongodb-core, 3 elasticsearch thin code, S6 thin Zone 3s, S8 missing ES opener |
| **MINOR** | **2** | Q1 elasticsearch-vs-postgres, Q10 analyzers |
| **CLEAN** | **0** | Every question has at least paragraph-wall or no-bold issue |

---

## Suggested fix order

1. **Decide module scope** (Option A/B/C above). Everything else depends on this.
2. **Author `nosql-fundamentals` + `nosql-patterns` topics** — 6 questions total. `nosql-patterns` is especially high-value — MongoDB's own published pattern series is standard interview reference material and our module has none of it.
3. **Add code to the 9 code-missing Zone 3s** — highest priority are the MongoDB-with-Spring questions (Q1, Q2) and the ES query-DSL questions (Q3, Q6) where absence of code makes the answer unusable.
4. **Fix incomplete `interviewer_intent` on 7 questions** — mechanical but important.
5. **Module-wide paragraph-wall fix** — 17 direct answers need bolding + possibly splitting. For mongodb specifically, the opener should bold: `**document model**`, `**aggregation pipeline**`, `**inverted index**`, `**index mapping**`, `**shard key**`, `**replica set**`, etc.
6. **Move Q11** once `comparisons` topic exists.
7. **Add missing ES opener** + add `mongodb-sharding` to mongodb-core.
