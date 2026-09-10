# Audit — spring-data-jpa

**Pillar:** P02 Spring Ecosystem
**Module:** M08 spring-data-jpa
**Topics present:** 10 (of 14 — `spring-data-jpa`, `batch-processing`, `comparisons`, plus the schema suggests others are likely 0-Q too)
**Questions:** 25 (all written, no stubs)
**Benchmark sources:** Baeldung ("A Guide to JPA with Spring", "Hibernate Caching Overview", "Optimistic Locking in JPA"), Vlad Mihalcea (jpa-guide, high-performance-java-persistence), Hibernate official docs, Thorben Janssen's JPA tutorials, JavaCodeGeeks JPA interview series

---

## Biggest finding — code is missing where code is the concept

**14 of 25 Zone 3s have zero code blocks.** JPA is the most code-centric topic in the entire stack. Every JPA interview on Baeldung / Vlad Mihalcea / Thorben Janssen shows at least one annotation snippet per concept. A JPA answer without entity annotations, queries, or repository code reads as abstract framework documentation, not interview-grade preparation.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Entity code snippet in nearly every answer (`@Entity` + `@ManyToOne` + `@JoinColumn` minimum) | **Failing** — 14 of 25 Zone 3s have zero code |
| Query DSL comparison pages show JPQL / Criteria / native SQL / Spring Data method naming side-by-side | **Failing** — Q1 query-optimization is a JPQL-vs-Criteria-vs-native comparison with zero code |
| N+1 explanations always show the 1+N log output (`select user0_...`, then `select orders0_ where user_id=?` × N) | Need to verify on Q1 n-plus-one — structural signal says 0 code blocks |
| Lazy-loading pitfalls shown with the exact `LazyInitializationException` and the repro code | **Failing** — Q4 hibernate `LazyInitializationException` has 0 code |
| Opening bolds the fetch/loading/cascade annotations (`**FetchType.LAZY**`, `**@ManyToOne**`, `**CascadeType.PERSIST**`) | **Failing across the whole module** — 0 of 25 direct answers have bold anchors |
| Analogies for abstract concepts (persistence context = "first-level cache", dirty checking = "photograph diff") | **Failing** — 0 of 25 Zone 3s have detected analogy |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | MISSING TOPIC | **CRITICAL** | **Topic literally named `spring-data-jpa` has 0 questions** in a module named `spring-data-jpa`. Current Qs under `custom-repositories` (3 Qs) are the closest match. Either delete the empty topic or fill it with Spring Data-specific questions (`@Repository` inference, `findByX` method naming, custom `@Query`, `@RepositoryRestResource`) |
| S2 | EMPTY TOPICS | **MAJOR** | `batch-processing` (0 Qs) and `comparisons` (0 Qs). Batch-processing especially relevant because module covers bulk updates/deletes; could cover `@Modifying`, `JdbcTemplate.batchUpdate`, StatelessSession |
| S3 | MODULE-WIDE CODE GAP | **MAJOR** | **14 of 25 Zone 3s have zero code blocks.** Worst offenders span every topic — this is a module-wide content problem, not a per-question one |
| S4 | MODULE-WIDE ZONE 1 | **MAJOR** | 25 of 25 `direct_answer`s have zero bold anchors; 2 are paragraph walls (Q2 hibernate-sql-generation, Q1 entity-relationships) |
| S5 | NO ANALOGIES | **MODERATE** | 0 of 25 Zone 3s have detected analogy. JPA is high-analogy territory (persistence context = first-level cache of "in-progress edits", dirty checking = "what changed since the photo I took on load", flush modes = "when do you hit save") |
| S6 | SPEAKABLE TOO SHORT | MINOR | 3 questions have sub-120w speakables (Q1 specifications, Q2 repository-methods, Q1 audit-logging). For a module where the rest of the speakables are 120–190w, these read as truncated |
| S7 | TOPIC OVERLAP | MINOR | `hibernate-onetomany-fetch-strategies` (entity-relationships Q1) and `n-plus-one-query-problem` overlap heavily — both explain why `FetchType.EAGER` on `@OneToMany` causes query storms. Decide: Q1 covers the annotation mechanics, n+1 Q covers the diagnostic + fix workflow |
| S8 | THIN TOPICS | MINOR | `database-migrations` (1 Q), `multi-tenancy` (1 Q), `caching` (1 Q) — each topic-by-name that has only a single question. Consider expanding or consolidating |

---

## Per-question issues

### `jpa-fundamentals` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** jpa-vs-hibernate-difference | 422w Zone 3 / **0 code** / analogy present. A spec-vs-impl comparison without at least one `EntityManager` vs `Session` snippet is incomplete | MODERATE |
| **Q2** jpa-entity-lifecycle | 510w / 1 code — acceptable. Bold missing on DA: `**New/Transient**`, `**Managed/Persistent**`, `**Detached**`, `**Removed**`, `**EntityManager**` | MINOR |
| **Q3** jpa-inheritance-mapping-strategies | 298w / **0 code** — SINGLE_TABLE / JOINED / TABLE_PER_CLASS need side-by-side entity snippets + what each generates in schema. Analogy present (good) | MODERATE |

### `hibernate-internals` (4 Qs) — **weakest topic in module**

| Q | Issue | Severity |
|---|---|---|
| **Q1** hibernate-session-vs-entitymanager | 466w / **0 code** / no analogy. Must show: `Session session = emf.unwrap(Session.class)`, `Session.createNativeQuery(...)` Hibernate-only methods. **Session = Hibernate, EntityManager = JPA standard — bold these** | **MAJOR** |
| **Q2** hibernate-sql-generation-dirty-checking-flush-modes | Paragraph wall (67w). 653w / **0 code** / no analogy. **The most code-dependent question in the topic with zero code.** Must show: dirty-checking via state snapshot, `FlushMode.COMMIT` vs `AUTO` behavior, `session.flush()` explicit call | **MAJOR** |
| **Q3** lazy-vs-eager-loading | 486w / **0 code** / no analogy. Must show: `@ManyToOne(fetch = FetchType.LAZY)` annotation + what the generated proxy looks like + the Hibernate-specific log output | **MAJOR** |
| **Q4** lazy-initialization-exception-causes-fixes | 526w / **0 code** / no analogy. **The canonical `LazyInitializationException` stack trace** is a must-include. Every top source shows: the exception itself, the detached-entity repro, the `@Transactional` boundary fix, `JOIN FETCH` fix, `@EntityGraph` fix | **MAJOR** |

### `spring-data-jpa` (0 Qs) — **self-named topic empty**

See S1. Suggested content:
- `spring-data-repository-interface-hierarchy` — `CrudRepository` → `PagingAndSortingRepository` → `JpaRepository`, what each adds
- `spring-data-method-name-query-inference` — the full grammar + pitfalls (fuzzy matches, property navigation, in-query case)
- `spring-data-projections-vs-dto` — interface projection vs class projection vs constructor projection, performance differences

### `entity-relationships` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** hibernate-onetomany-fetch-strategies | Paragraph wall (61w). 526w / **0 code** / no analogy. Must show: `@OneToMany(mappedBy = ..., fetch = ...)` annotation, the generated SQL per fetch strategy, `@BatchSize` + `@Fetch(FetchMode.SUBSELECT)` optimization | **MAJOR** |
| **Q2** jpa-entity-relationships-onetomany-manytomany | 257w / **0 code** — relationship mapping content WITHOUT entity code is meaningless. The `@OneToMany` + `@ManyToOne` bidirectional pattern, `mappedBy` owner-side rule, `@ManyToMany` with `@JoinTable` must all be shown | **MAJOR** |
| **Q3** jpa-cascade-types-orphan-removal | 282w / **0 code**. CascadeTypes and `orphanRemoval = true` are annotation semantics; the annotations themselves must be in the answer | **MAJOR** |

### `transactions` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** transactional-internals-propagation | 626w / **0 code** / analogy in speakable. Overlaps partially with spring-core's `transactional-propagation-types`. Decide scope: spring-core covers propagation enum; this one covers internals (proxy, commit/rollback, `TransactionSynchronizationManager`). Must show: the self-invocation proxy trap with code | MODERATE |
| **Q2** optimistic-vs-pessimistic-locking | 261w / **0 code** — must show: `@Version` field for optimistic, `LockModeType.PESSIMISTIC_WRITE` with `@Lock` annotation for pessimistic, the `OptimisticLockException` handling pattern | **MAJOR** |

### `n-plus-one-problem` (2 Qs) — critical topic, one major gap

| Q | Issue | Severity |
|---|---|---|
| **Q1** n-plus-one-query-problem | 576w / **0 code** / no analogy. **THE most code-dependent question in the entire module with zero code.** Must show: (1) the 1+N SQL log output, (2) a `JOIN FETCH` JPQL query, (3) `@EntityGraph` variant | **CRITICAL-for-topic** (still MAJOR in severity tier) |
| **Q2** entity-graph-solving-n-plus-one | 473w / 1 code / recommendation closer present — good solve-side. Missing analogy | MINOR |

### `query-optimization` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** hibernate-criteria-api-vs-jpql-vs-native-sql | 301w / **0 code** — a 3-way query DSL comparison without showing any of the 3 DSLs is opaque. Side-by-side code is the topic's entire point | **MAJOR** |
| **Q2** dto-projections-interface-class-based | 269w / 1 code — acceptable but thin for the topic | MINOR |
| **Q3** modifying-bulk-updates-deletes | 273w / 2 code — OK | MINOR |

### `custom-repositories` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** spring-data-specifications-dynamic-queries | 215w / 3 code — good code coverage. Speakable 92w is too short for the topic | MINOR |
| **Q2** spring-data-jpa-repository-methods | 294w / **0 code** — repository method naming answers without showing the method signatures is silly. Speakable also short (113w) | MODERATE |
| **Q3** pagination-sorting-spring-data | 258w / **0 code** — `Pageable`, `Sort`, `Page<T>` return type are annotation-and-API driven; must show snippets | MODERATE |

### `database-migrations` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** flyway-liquibase-database-migrations | 294w / **0 code** — a Flyway-vs-Liquibase comparison without showing a `V1__create_users.sql` file (Flyway) or an `db.changelog.xml` (Liquibase) is incomplete | MODERATE |

### `batch-processing` (0 Qs) — topic empty

Suggested content: `jpa-batch-insert-update`, `@Modifying-vs-jdbc-batch-update`, `stateless-session-hibernate` for large exports.

### `multi-tenancy` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** multi-datasource-spring-boot | 282w / **0 code** — `@Primary` datasource, `AbstractRoutingDataSource`, per-tenant schema approach must be shown with config | MODERATE |

**Topic note:** 1 question is thin for a topic with 3 genuinely distinct patterns (DB-per-tenant, schema-per-tenant, shared-schema-with-discriminator).

### `caching` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** hibernate-caching-l1-l2-query-cache | 345w / **0 code** — L2 cache configuration is `hibernate.cache.use_second_level_cache=true` + `@Cacheable` + provider-specific config (Ehcache, Infinispan, Redis). Must show | MODERATE |

### `scenario-based` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** audit-logging-created-date-last-modified-date | 219w / 1 code — acceptable. Speakable 108w short. Missing: `@EnableJpaAuditing`, `@EntityListeners(AuditingEntityListener.class)` — if not in the one code block, add | MINOR |
| **Q2** hikaricp-connection-pooling-spring | 348w / **0 code** — HikariCP config is pure properties (`spring.datasource.hikari.maximum-pool-size`, `minimum-idle`, `idle-timeout`, `max-lifetime`). Must show properties + recommended values | MODERATE |

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **1** | S1 self-named topic `spring-data-jpa` is empty |
| **MAJOR** | **11** | Code-missing in content-critical areas: Q1 hibernate-session, Q2 hibernate-sql-gen, Q3 lazy/eager, Q4 LazyInit, Q1 onetomany-fetch, Q2 entity-rel, Q3 cascade, Q2 optimistic-vs-pessimistic, Q1 criteria-vs-jpql, S3 module-wide code gap, S4 module-wide bold gap |
| **MODERATE** | **11** | Remaining code-missing (thin Zone 3s), analogy gap, jpa-vs-hibernate, inheritance mapping, transactional internals, Q2 repository-methods, Q3 pagination, flyway-liquibase, multi-datasource, hibernate-caching, hikaricp |
| **MINOR** | **6** | Short speakables + the 2 already-clean questions (Q2 entity-graph, Q2 repo Q3 modifying, etc.) |
| **CLEAN** | **0** | No question passes every check |

## Most common issue codes

- `zone3_no_code_examples` × 14
- `zone1_direct_answer_no_bold_anchors` × 22
- `zone3_no_analogy` × 10
- `zone1_direct_answer_paragraph_wall` × 2
- `zone2_speakable_short` × 3

---

## Suggested fix order

1. **Fill the self-named `spring-data-jpa` topic** (S1) — 3 questions minimum on repository hierarchy / method naming / projections. Embarrassing gap given the module name.
2. **Batch code-addition pass on hibernate-internals topic (4 Qs, all MAJOR)** — this is the highest-ROI fix. Each Zone 3 needs 1–2 code blocks showing the annotation or generated SQL. ~30 minutes of mechanical work for massive quality uplift.
3. **Batch code-addition pass on entity-relationships + n-plus-one + transactions** — the content is already there, it just needs the canonical code anchors.
4. **Fix Q1 `n-plus-one-query-problem`** specifically — arguably the single most-important JPA interview question and currently has zero code. Needs the classic 1+N SQL log + JOIN FETCH fix + @EntityGraph fix.
5. **Decide on `hibernate-onetomany-fetch-strategies` vs `n-plus-one-query-problem` overlap** (S7). Consolidate or sharpen scope.
6. **Author `batch-processing` and `comparisons` topics** (2–3 Qs each).
7. **Module-wide bold-anchor pass** — 25 direct answers, mechanical.
8. **Add analogies where they fit naturally** — persistence context, dirty checking, flush modes, L1/L2 cache are the high-value candidates; skip where concept is concrete (bulk updates, pagination).
