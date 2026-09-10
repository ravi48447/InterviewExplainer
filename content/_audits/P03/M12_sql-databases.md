# Audit — sql-databases

**Pillar:** P03 Data Layer
**Module:** M12 sql-databases
**Topics present:** 11 (of 14 — `database-migrations`, `backup-recovery`, `comparisons` have 0 questions)
**Questions:** 38 (all written, no stubs)
**Benchmark sources:** Use The Index, Luke (Markus Winand), PostgreSQL docs, MySQL 8.0 reference, Bill Karwin's "SQL Antipatterns", Vlad Mihalcea on SQL internals, Gwen Shapira / Alex Petrov on DB internals

---

## Biggest findings

1. **Organization inconsistency — MySQL content is scattered, PostgreSQL content is grouped.** PostgreSQL gets 11 questions under its own topic (`postgresql-features`). MySQL has ~10 questions spread across `indexes-and-performance`, `transactions-and-acid`, `query-optimization`, `connection-pooling`, `partitioning-and-sharding`, `replication`, `scenario-based`. Either give MySQL its own topic (mirror PostgreSQL structure) or distribute Postgres Qs across feature topics too — but pick one.
2. **Heavy topic overlap** — 3 detected auto-overlaps (transaction isolation, query optimization, explain-plan) plus several more visible by eye: 4 index questions, 2 normalization questions, 2 window-function questions.
3. **MySQL `query-cache` question** — the MySQL query cache was **deprecated in 5.7 and removed in 8.0**. Including it without flagging deprecation is misleading and out-of-date for 2024+ interviews.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Opening bolds the SQL concept (`**index**`, `**JOIN**`, `**isolation level**`, `**EXPLAIN ANALYZE**`) | **Failing** — 0 of 38 direct answers have bold anchors |
| Every index / query / JOIN explanation shows actual SQL | Mixed — 11 of 38 Zone 3s with zero code, mostly in generic & scenario questions |
| Use The Index Luke style: before-SQL → execution plan → after-SQL | Some questions follow this (postgres-locking, postgres-n+1); most don't |
| Isolation-level questions always show anomaly tables (dirty read / non-repeatable / phantom) | Generic isolation Q has a comparison table; MySQL isolation is thin (244w / 0 code) |
| Sharding / partitioning explanations include the partition key, range/list/hash schemes, and routing logic — always visual | Sharding Q has 537w / 0 code — missing visual |
| Query-plan reading uses actual EXPLAIN output | PG explain has 1 code block; MySQL explain has 1; still thin for the topic |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | ORGANIZATION | **MAJOR** | MySQL questions scattered vs PostgreSQL grouped (see finding above). Decide: create `mysql-features` topic mirroring `postgresql-features`, OR split PostgreSQL into feature topics too |
| S2 | OUT-OF-DATE CONTENT | **MAJOR** | `mysql-query-cache-query-optimization` covers a feature **removed from MySQL 8.0**. Either reframe as "why MySQL removed the query cache" (historical + alternatives: ProxySQL cache, app-level cache) or delete |
| S3 | EMPTY TOPICS | **MAJOR** | `database-migrations` (0 Qs — and same-named topic in spring-data-jpa module — cross-module planning needed), `backup-recovery` (0 Qs), `comparisons` (0 Qs) |
| S4 | TOPIC OVERLAPS | **MAJOR** | **Normalization:** Q1 `database-normalization-forms` (296w) vs Q4 `database-normalization-1nf-2nf-3nf` (642w) — same topic, the 1NF-3NF one is more substantive. **Indexes:** Q1 `database-indexes-types` + Q2 `database-indexes-btree-hash` + Q3 `mysql-index-types-btree-fulltext-composite` + Q4 postgres `postgresql-indexes-btree-gin-gist` — 4 questions on overlapping material. **Isolation:** Q2 `transaction-isolation-levels-sql` vs Q3 `mysql-transaction-isolation-levels` (auto-detected overlap 0.6). **Explain:** Q1 `sql-explain-plan-query-optimization` vs Q2 `mysql-explain-query-optimization` vs Q3 postgres `postgresql-explain-analyze` (auto-detected overlap). **Window functions:** Q2 `postgresql-window-functions` vs advanced-sql Q1 `sql-window-functions-row-number-rank` |
| S5 | INCOMPLETE INTERVIEWER_INTENT | **MAJOR** | 10 of 38 questions have incomplete `interviewer_intent` — almost entirely the MySQL-specific ones (mysql-index-types, mysql-transaction-isolation, innodb-locking, mysql-vs-postgresql, mysql-explain, mysql-query-cache, mysql-partitioning, mysql-replication, spring-boot-mysql-pool-tuning, innodb-vs-myisam). Clearly a batch-authoring gap |
| S6 | THIN POSTGRES ZONE 3 | **MODERATE** | PostgreSQL topic Zone 3s range 36–505w. Several are ultra-thin (Q11 full-text-search 36w, Q3 indexes 106w, Q5 isolation 128w, Q4 Q7 Q9 around 200w). Topic reads as a batch of flashcards in places |
| S7 | MODULE-WIDE ZONE 1 | **MAJOR** | 38 of 38 direct answers have zero bold anchors. 9 are paragraph walls. Worst paragraph-wall offenders: Q2 btree-hash-indexes (85w), Q2 mysql-partitioning (70w), Q1 one-to-many-modeling (covered elsewhere) |
| S8 | MODULE-WIDE ANALOGY GAP | MODERATE | 19 of 38 Zone 3s have no analogy — SQL is high-analogy territory (B-tree = "phone book", index = "back of the book", sharding = "branch offices", isolation = "shared document editing rules") |
| S9 | CODE-MISSING ZONE 3 | **MAJOR** | 11 questions with substantive Zone 3 but zero code. SQL content without SQL is the textbook contradiction |

---

## Per-question issues (grouped, skipping universal bold-anchor mentions)

### `sql-fundamentals` (4 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** database-normalization-forms | 296w / 0 code. **Overlaps heavily with Q4.** Decide scope: Q1 could cover the *why* (redundancy → anomalies → denormalization trade-offs), Q4 covers 1NF/2NF/3NF specifics with examples | MODERATE + MERGE DECISION |
| **Q2** sql-vs-nosql-databases | 505w / **0 code** / analogy present. A comparison this big without a single SQL table schema vs JSON document snippet is off-brand for the topic | MODERATE |
| **Q3** many-to-many-relationship-modeling | 513w / **0 code** / no analogy. M:N modeling WITHOUT showing the junction-table schema is an interview miss. Must show: `CREATE TABLE student_course (student_id, course_id, PRIMARY KEY (...))` pattern | **MAJOR** |
| **Q4** database-normalization-1nf-2nf-3nf | 642w / 4 code — solid content. Only analogy missing (normalization = "splitting a mixed-use address into street/city/zip separately so updating the zip doesn't touch 50 rows") | MINOR |

### `joins-and-subqueries` (2 Qs)

Both questions well-structured. Paragraph walls in Zone 1 (67w, 66w) need bold anchors.

| Q | Issue | Severity |
|---|---|---|
| **Q1** sql-joins-inner-outer-cross-self | Paragraph wall. 971w / 4 code / analogy — **best-structured question in module**. Length is generous but justified for a 5-way comparison | MINOR |
| **Q2** sql-subqueries-vs-joins | Paragraph wall. 461w / 2 code / analogy — good | MINOR |

### `indexes-and-performance` (3 Qs) — topic overlap issue

| Q | Issue | Severity |
|---|---|---|
| **Q1** database-indexes-types | Paragraph wall (63w). 512w / **0 code** / no analogy. Overlaps with Q2 btree-hash. **Scope decision needed** — Q1 could be "index types catalog" (B-tree, Hash, Bitmap, Partial, Covering), Q2 the internals of B-tree vs Hash | MODERATE + SCOPE |
| **Q2** database-indexes-btree-hash | Paragraph wall (85w — longest in module). 662w / 3 code / analogy present. Solid content | MINOR |
| **Q3** mysql-index-types-btree-fulltext-composite | Zone 3 is **65w** — essentially empty. A question labeled as a 3-index-type comparison must show each. `interviewer_intent` incomplete | **CRITICAL** (stub-like content) |

### `transactions-and-acid` (4 Qs) — overlap + thin Zone 3s

| Q | Issue | Severity |
|---|---|---|
| **Q1** acid-properties-transactions | 801w / 1 code / analogy / recommendation — **CLEAN** apart from bold | MINOR |
| **Q2** transaction-isolation-levels-sql | Paragraph wall (63w). 661w / 3 code — solid. Missing analogy | MINOR |
| **Q3** mysql-transaction-isolation-levels | 244w / **0 code** / incomplete II. **Overlaps with Q2**; sharpen scope: Q2 covers ANSI isolation levels + anomalies, Q3 covers how InnoDB implements them (MVCC, gap locks at REPEATABLE READ, locking reads with `SELECT ... FOR UPDATE`) | **MAJOR** (stub-level content + overlap) |
| **Q4** innodb-locking-row-gap-next-key | Zone 3 is **77w** — essentially empty. Topic is high-difficulty MySQL interview fodder. `interviewer_intent` incomplete | **CRITICAL** (stub-like content) |

### `postgresql-features` (11 Qs) — most questions thin on content

| Q | Issue | Severity |
|---|---|---|
| **Q1** mysql-vs-postgresql-java-developers | Paragraph wall. 190w / **0 code** / incomplete II. Comparison content 190w is thin for a flagship module-opener. Probably belongs in `comparisons` topic | MODERATE + POSSIBLE MOVE |
| **Q2** postgresql-window-functions | 220w / **0 code**. A window-function question WITHOUT a `ROW_NUMBER() OVER (PARTITION BY ...)` snippet is incomprehensible. Also overlaps with `sql-window-functions-row-number-rank` (advanced-sql topic) | MODERATE + OVERLAP |
| **Q3** postgresql-explain-analyze | 505w / 1 code — OK. Missing analogy | MINOR |
| **Q4** postgresql-indexes-btree-gin-gist | 106w / 1 code — Zone 3 is far too thin for a 3-index-type question. Each type needs its own example (B-tree = ordinary, GIN = jsonb/fts, GiST = geometry/range) | **MAJOR** |
| **Q5** postgresql-transactions-isolation-levels | 128w / 1 code — overlaps with `transaction-isolation-levels-sql` (generic) and `mysql-transaction-isolation-levels`. Scope should be Postgres-specific (Serializable Snapshot Isolation, read-committed default behavior, anomalies Postgres *doesn't* exhibit that MySQL does) | **MAJOR** (overlap + thin) |
| **Q6** postgresql-jsonb-queries-indexing | 447w / 1 code. Solid. Could show a GIN index on jsonb + `@>` query operator example | MINOR |
| **Q7** postgresql-connection-pooling-pgbouncer | 210w / **0 code**. PgBouncer is configured via `pgbouncer.ini` — show it. Transaction-pooling vs session-pooling distinction | MODERATE |
| **Q8** postgresql-locking-deadlocks | 183w / 6 code / analogy — **highest code-block count in module** and well-shaped. CLEAN-ish | MINOR |
| **Q9** postgresql-partitioning-large-tables | 217w / **0 code** — Declarative partitioning (`PARTITION BY RANGE`) syntax is the point. Must show | **MAJOR** |
| **Q10** postgresql-query-optimization-n-plus-one | 298w / 2 code — good. Overlaps with the spring-data-jpa `n-plus-one-query-problem` question — different angle (pure SQL vs ORM) so probably OK | MINOR |
| **Q11** postgresql-full-text-search | Zone 3 is **36w** — essentially empty for a topic that needs `to_tsvector`, `to_tsquery`, GIN index on tsvector column | **CRITICAL** (stub-like content) |

### `advanced-sql-features` (1 Q) — topic too thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** sql-window-functions-row-number-rank | Paragraph wall (69w). 574w / 4 code / analogy — good content. **Overlaps with postgresql-features Q2** | MINOR + OVERLAP |

**Topic gap:** advanced-sql-features with only 1 question is a missed opportunity. Missing: CTEs + recursive CTEs, `LATERAL` joins, `GROUPING SETS` / `ROLLUP` / `CUBE`, common antipatterns.

### `connection-pooling` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** database-connection-pooling | 516w / **0 code** / no analogy. Generic connection-pool Q without showing HikariCP config or JDBC `DataSource` wiring | **MAJOR** |
| **Q2** spring-boot-mysql-connection-pool-tuning | 320w / 4 code — good. Incomplete II. **Overlaps with spring-data-jpa hikaricp question** — decide scope or de-duplicate | MINOR + OVERLAP |

### `query-optimization` (3 Qs) — cluster of overlap + deprecated content

| Q | Issue | Severity |
|---|---|---|
| **Q1** sql-explain-plan-query-optimization | Paragraph wall (61w). 691w / 3 code — solid. Missing analogy. Overlaps with MySQL + PostgreSQL explain questions (auto-detected) | MINOR + OVERLAP |
| **Q2** mysql-explain-query-optimization | 135w / 1 code / incomplete II. Far too thin. Scope should be MySQL-specific (`EXPLAIN FORMAT=TREE`, the `type` column values: system/const/eq_ref/ref/range/index/all, Extra column values) | **MAJOR** (thin + overlap) |
| **Q3** mysql-query-cache-query-optimization | 100w / 1 code / incomplete II / paragraph wall. **DEPRECATED FEATURE** — removed in MySQL 8.0 | **MAJOR** (out-of-date) |

### `partitioning-and-sharding` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** database-sharding | 537w / **0 code** / no analogy. Must show: hash sharding (`shard_id = hash(key) % N`), range sharding, consistent hashing, hot-spot avoidance | **MAJOR** |
| **Q2** mysql-partitioning | Paragraph wall (70w). 92w / 1 code / incomplete II. Essentially a stub. Must show: `PARTITION BY RANGE`, `PARTITION BY HASH`, `PARTITION BY LIST` syntax | **CRITICAL** (stub-like content) |

### `replication` (1 Q) — topic too thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** mysql-replication-primary-replica | 87w / 1 code / incomplete II — essentially a stub for a replication topic. Must show: binary-log-based replication config, async vs semi-sync vs group replication, lag-monitoring queries | **CRITICAL** (stub-like content) |

### `database-migrations` (0 Qs) — topic empty

Already covered in spring-data-jpa (`flyway-liquibase-database-migrations`). Decide: delete this empty topic here, or move the Flyway/Liquibase Q to this module since it's database-layer content rather than Spring-specific.

### `backup-recovery` (0 Qs) — topic empty

Suggest adding: `postgres-pg-dump-pg-basebackup`, `mysql-mysqldump-vs-xtrabackup-vs-binary-log-pitr`, `point-in-time-recovery-strategies`.

### `scenario-based` (5 Qs) — code-missing pattern

| Q | Issue | Severity |
|---|---|---|
| **Q1** oltp-vs-olap | 545w / **0 code** / no analogy. Comparison without showing example OLTP-style query (single-row point read) vs OLAP-style (aggregation over billions of rows) | MODERATE |
| **Q2** high-read-throughput-design | 335w / **0 code** — must show patterns: read replicas, cache-aside, materialized views, CQRS sketch | MODERATE |
| **Q3** soft-deletes-database-design | Paragraph wall (62w). 529w / **0 code** / no analogy. Soft-delete content without showing `deleted_at TIMESTAMP` column + predicate-update pattern or `@SQLDelete` Hibernate annotation is incomplete | **MAJOR** |
| **Q4** eventual-consistency-design | 556w / **0 code** / no analogy — conceptual + pattern content (outbox table, CDC, sagas). At least one code-ish artifact (outbox-table schema) is essential | **MAJOR** |
| **Q5** innodb-vs-myisam-storage-engines | 225w / 0 code / analogy / incomplete II. Historical comparison (MyISAM is largely obsolete). Scope should be "why MyISAM lost to InnoDB" rather than full side-by-side | MINOR |

### `comparisons` (0 Qs) — topic empty

Suggest moving `mysql-vs-postgresql-java-developers` here, plus adding: `sql-vs-nosql-databases` (already exists in fundamentals — possible move), `rdbms-vs-data-warehouse`, `transactions-vs-event-sourcing`.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **5** | 5 questions with Zone 3 <150w (essentially stubs): mysql-index-types (65w), innodb-locking (77w), mysql-partitioning (92w), mysql-replication (87w), postgres-full-text-search (36w) |
| **MAJOR** | **15** | Deprecated content, topic overlaps, code-missing in critical areas, module-wide bold + code gaps, scattered MySQL org |
| **MODERATE** | **12** | Remaining code-missing questions, thin-content Zone 3s, analogy gap, topic scope issues |
| **MINOR** | **6** | Small polish across well-structured questions |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 28
- `zone3_no_code_examples` × 11
- `zone3_no_analogy` × 19
- `zone1_direct_answer_paragraph_wall` × 9
- `zone1_interviewer_intent_incomplete` × 10

---

## Suggested fix order

1. **Decide organization** (S1): group MySQL into its own topic like PostgreSQL, or distribute Postgres into feature topics. Pick one and restructure.
2. **Delete or rewrite `mysql-query-cache`** (S2) — out-of-date content damages credibility.
3. **Fix the 5 stub-level CRITICAL questions** — bring Zone 3s above 300w with code: mysql-index-types, innodb-locking, mysql-partitioning, mysql-replication, postgres-full-text-search.
4. **Resolve the topic overlaps** (S4): pick the stronger question in each cluster, sharpen scope of the weaker one, or merge. Most important ones — isolation-level cluster (3 Qs), index cluster (4 Qs), explain cluster (3 Qs).
5. **Complete the 10 incomplete `interviewer_intent` fields** — mostly mechanical.
6. **Add code to the content-critical code-missing Zone 3s** — Q3 many-to-many modeling (junction table), Q1 sharding (routing scheme), Q3 soft-deletes (deleted_at column), Q1 connection-pooling (HikariCP config), Q4 postgres-indexes-btree-gin-gist.
7. **Author the 3 empty topics** — or delete them from the module schema if out of scope.
8. **Thicken advanced-sql-features topic** — CTEs + recursive CTEs especially.
9. **Module-wide bold + paragraph-wall fix pass**.
