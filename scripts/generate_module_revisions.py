#!/usr/bin/env python3
"""
generate_module_revisions.py
============================

Authors one `_revision.json` per *source* module under both locked
domains (`java-backend-intermediate`, `java-fullstack-intermediate`).

Each revision is a single self-contained 5-section "skim sheet" the user
can read in ~10 minutes (or print as PDF) before drilling the interview
questions for that module:

    1. Why this module matters       (uses authored `_index.json.intro`)
    2. Mental model                  (curated per moduleSlug)
    3. Must-know concepts            (derived from `topics[]`)
    4. Likely interview hooks        (curated per moduleSlug)
    5. Speaking template             (curated per moduleSlug)

Modules with `contentSource` in `_index.json` are skipped because their
content (and therefore their revision) is reused from the source domain.

The generator OVERWRITES existing `_revision.json` files. Re-running it
is safe — output is fully deterministic from the curated dictionaries.
"""
from __future__ import annotations

import json
import os
import re
from pathlib import Path

# ── Paths ────────────────────────────────────────────────────────────────────
ROOT = Path(__file__).resolve().parent.parent
JBI = ROOT / "content" / "java-backend-intermediate"
JFI = ROOT / "content" / "java-fullstack-intermediate"


# ── Curated, module-specific content ─────────────────────────────────────────
# For each moduleSlug we author three sections that need real subject-matter
# expertise (mental model, interview hooks, speaking template). The other
# two sections are derived from `_index.json` automatically.
#
# Modules that appear in BOTH domains (e.g. `core-java` reused from JBI
# inside JFI) only need to be listed once — the JFI tree is skipped via
# `contentSource`. Slugs here always refer to the source domain.

CURATED: dict[str, dict[str, str]] = {
    # ── Java Language & Core ────────────────────────────────────────────
    "core-java": {
        "mental_model": (
            "Three layers, **always the same**:\n\n"
            "1. **Language semantics** — pass-by-value, equals/hashCode, immutability, the type system.\n"
            "2. **Runtime model** — heap vs stack, the GC root set, the class loader chain.\n"
            "3. **API contracts** — `Optional`, `try-with-resources`, generics + erasure, reflection.\n\n"
            "Senior interviewers test you at the **boundary** between these layers (e.g. why `==` on autoboxed "
            "`Integer` 127 ≠ 128, why generic arrays are illegal, why `String` is immutable)."
        ),
        "interview_hooks": (
            "- **`equals` / `hashCode` contract** — break it and `HashMap` silently misbehaves; mention it before "
            "the interviewer prompts you.\n"
            "- **Type erasure** — name `ClassCastException` at runtime as the cost; mention `TypeToken` / "
            "`Class<T>` workarounds.\n"
            "- **Pass-by-value** — Java *only*. Reference values are copied; the object is shared. Be ready with "
            "an example of a mutable parameter inside a method.\n"
            "- **`final` vs `finally` vs `finalize`** — three different things; `finalize` is deprecated since 9."
        ),
        "speaking_template": (
            "> *\"In Java the contract is X — here's the language guarantee, here's how the JVM implements it, "
            "and here's the one place it bites: <named exception> when <named edge case>. The fix is <pattern> — "
            "for instance Y in our codebase used <approach> to keep <equals/hashCode | immutability | "
            "type-safety> intact.\"*"
        ),
    },
    "java-oop": {
        "mental_model": (
            "Four pillars + one principle set:\n\n"
            "- **Encapsulation** — package-private + getters; minimise mutability.\n"
            "- **Inheritance** — *IS-A*; in Java, classes single, interfaces many.\n"
            "- **Polymorphism** — compile-time (overloading) vs runtime (overriding); only the latter dispatches dynamically.\n"
            "- **Abstraction** — `abstract class` for partial impl, `interface` for capability/contract.\n"
            "- **SOLID** — five orthogonal principles; cite them by name (S/O/L/I/D)."
        ),
        "interview_hooks": (
            "- **Composition over inheritance** — quote it, then defend it with one concrete example.\n"
            "- **Abstract class vs interface in Java 8+** — both can have method bodies; use abstract for **state**, "
            "interface for **capability**.\n"
            "- **Liskov** in code — substitution must hold without surprise (no narrower exceptions, no stricter preconditions).\n"
            "- **`equals` symmetry / transitivity** — break it and you'll be asked to find the bug."
        ),
        "speaking_template": (
            "> *\"I'd model this as <abstraction> + <implementation>, leaning on <interface | abstract class> "
            "because <reason rooted in cohesion / state / capability>. The SOLID principle most stressed here is "
            "<S/O/L/I/D> — the alternative would have been <inheritance | composition>, but it would have broken "
            "<contract / testability>.\"*"
        ),
    },
    "java-collections": {
        "mental_model": (
            "Pick by **access pattern + thread-safety + ordering**:\n\n"
            "| Need | Pick |\n|---|---|\n"
            "| O(1) get/put, no order | `HashMap` |\n"
            "| Insertion order | `LinkedHashMap` |\n"
            "| Sorted | `TreeMap` (red-black, O(log n)) |\n"
            "| Concurrent | `ConcurrentHashMap` (lock striping in 8+) |\n"
            "| Random access list | `ArrayList` |\n"
            "| FIFO + concurrent | `ArrayBlockingQueue` / `LinkedBlockingQueue` |\n\n"
            "Always mention **load factor** (0.75) and the **rehash threshold** for `HashMap`."
        ),
        "interview_hooks": (
            "- **`HashMap` resize** — doubles the bucket array; with bad `hashCode()` this turns into linked-list scans (now red-black tree from Java 8).\n"
            "- **`fail-fast` vs `fail-safe`** iterators — `ConcurrentHashMap` is fail-safe; `HashMap.iterator()` throws `ConcurrentModificationException`.\n"
            "- **`equals` ↔ `hashCode`** — break the contract, lose the entry.\n"
            "- **`Comparable` vs `Comparator`** — natural order vs external; comparators are first-class with `Comparator.comparing(...)`."
        ),
        "speaking_template": (
            "> *\"I'd reach for <collection> because the workload is <read-heavy / mutation-heavy / concurrent>; "
            "the alternative <other> would cost us <O(n) for X | locking on writes>. Under contention I'd switch "
            "to <ConcurrentHashMap | CopyOnWriteArrayList> and document the read/write ratio.\"*"
        ),
    },
    "java-streams": {
        "mental_model": (
            "Streams are a **lazy pipeline**: source → 0..N intermediate (map/filter/peek) → 1 terminal (collect/reduce/forEach).\n\n"
            "- Intermediate ops are **lazy** — no work until a terminal triggers.\n"
            "- A stream is **single-use** — re-collecting requires re-creating.\n"
            "- **Parallel streams** split via the `ForkJoinPool.commonPool` — *do not* use them with side-effecting collectors.\n\n"
            "Modern Java additions to remember: **records**, **sealed types**, **pattern matching**, **virtual threads** (Project Loom)."
        ),
        "interview_hooks": (
            "- **Streams are not faster by default** — pipeline overhead can lose to a tight `for` on small inputs.\n"
            "- **`map` vs `flatMap`** — `flatMap` flattens nested streams; classic mistake on `Optional<Optional<T>>`.\n"
            "- **`Collectors.toMap`** throws on duplicate keys unless you supply a merge function.\n"
            "- **Records ≠ JavaBeans** — final fields, no setters; great for DTOs and value objects.\n"
            "- **Virtual threads** are still threads — but cheap; `Thread.startVirtualThread(...)` and `Executors.newVirtualThreadPerTaskExecutor()`."
        ),
        "speaking_template": (
            "> *\"With streams I'd express the transformation declaratively as <map → filter → collect>; the "
            "trade-off is readability over a tight loop. For records and pattern matching I'd lean on them where "
            "the code is data-shape-driven; for virtual threads I'd reach for them on IO-bound, "
            "high-concurrency paths and stay on platform threads for CPU-bound work.\"*"
        ),
    },
    "java-concurrency": {
        "mental_model": (
            "Three layers — and you must name them in order:\n\n"
            "1. **Memory model** — happens-before, `volatile`, `synchronized`, final-field freeze.\n"
            "2. **Synchronisers** — locks (`ReentrantLock`), latches, semaphores, barriers, `StampedLock`.\n"
            "3. **Executors** — `ExecutorService`, `ForkJoinPool`, `CompletableFuture`, virtual threads.\n\n"
            "Pick the **lowest level** that solves your problem; senior interviewers reward `CompletableFuture` over raw threads, and an executor over `new Thread(...)`."
        ),
        "interview_hooks": (
            "- **`synchronized` vs `ReentrantLock`** — Lock gives `tryLock`, fairness, multiple conditions; mention each.\n"
            "- **Double-checked locking** — broken pre-Java 5 without `volatile`; quote it as a memory-model interview classic.\n"
            "- **`ConcurrentHashMap`** — lock striping in 7, CAS-based bins in 8+.\n"
            "- **Virtual threads** — cheap, scheduled on carrier threads; *avoid* `synchronized` blocks on hot paths (pinning).\n"
            "- **Producer-consumer** — `BlockingQueue` is the canonical Java answer; mention `LinkedBlockingQueue` vs `ArrayBlockingQueue` (bounded vs unbounded)."
        ),
        "speaking_template": (
            "> *\"The contention is on <shared resource>. I'd guard it with <synchronized | ReentrantLock | "
            "atomic | concurrent collection> because <reason: granularity / fairness / read-heavy>. For the "
            "wider workflow I'd compose it with `CompletableFuture` so the I/O is non-blocking, and I'd watch "
            "<thread-pool starvation | pinning under virtual threads>.\"*"
        ),
    },
    "jvm-internals": {
        "mental_model": (
            "Five mental zones to draw on a whiteboard:\n\n"
            "- **Class loader chain** — bootstrap → platform → app → custom.\n"
            "- **Heap** — young (Eden + survivors) / old; humongous in G1.\n"
            "- **Metaspace** — class metadata (replaced PermGen in 8).\n"
            "- **Stacks** — per-thread, frame-per-call.\n"
            "- **JIT** — C1 (fast compile) + C2 (aggressive optimiser); tiered compilation balances them.\n\n"
            "Pick the GC by **goal**: **G1** balanced default, **ZGC / Shenandoah** for sub-ms pauses, **Parallel** for batch."
        ),
        "interview_hooks": (
            "- **Stop-the-world** is the language; minor pauses on young GC, major on full GC.\n"
            "- **Escape analysis** can stack-allocate small objects — don't mistake this for guaranteed.\n"
            "- **OOM is a label, not a cause** — heap, metaspace, native, direct byte buffers each fail differently.\n"
            "- **JFR / async-profiler** — name the modern tools; `jstack` / `jmap` are your fallback.\n"
            "- **GC tuning** is mostly **right-sizing the heap** plus picking a collector — most apps need neither."
        ),
        "speaking_template": (
            "> *\"The symptom is <pause / OOM / high CPU>. I'd grab a <heap dump | thread dump | flight "
            "recording>, look at <retained-size | blocked threads | GC log pauses>, and the suspect is most "
            "likely <leak / unbounded cache / wrong GC>. Fix is <code change | -Xmx | switch to G1/ZGC>.\"*"
        ),
    },
    # ── Spring Ecosystem ────────────────────────────────────────────────
    "spring-core": {
        "mental_model": (
            "Spring Core in three layers:\n\n"
            "1. **IoC container** — `BeanDefinition` → `BeanFactory` → `ApplicationContext`.\n"
            "2. **Lifecycle** — instantiate → populate → aware → BPP-before → `@PostConstruct` → BPP-after → ready.\n"
            "3. **Cross-cutting** — AOP proxies (JDK or CGLIB), `@Transactional`, events.\n\n"
            "Senior questions probe the **proxy boundary**: same-bean self-invocation skips the aspect; this is where 80% of `@Transactional` bugs live."
        ),
        "interview_hooks": (
            "- **Constructor injection** > setter > field — *because* `final`, fail-fast cycles, easy testing.\n"
            "- **`@Transactional` self-invocation** doesn't go through the proxy — readiness fact.\n"
            "- **`@Configuration` proxyBeanMethods** — true → CGLIB, inter-`@Bean` calls return singletons; false → faster start, no inter-call guarantee.\n"
            "- **Circular deps** — constructor cycles fail fast; setter cycles use **early references**.\n"
            "- **`@Primary` vs `@Qualifier`** — default vs explicit disambiguation."
        ),
        "speaking_template": (
            "> *\"I'd register this as a `@Component` / `@Configuration` `@Bean`, prefer constructor injection so "
            "<reason>, and apply <`@Transactional` / `@Async` / aspect> via the proxy — knowing the proxy boundary "
            "means I'd avoid same-bean self-invocation and split the responsibility into <bean A> + <bean B>.\"*"
        ),
    },
    "spring-boot": {
        "mental_model": (
            "Boot = Spring + opinionated **auto-configuration** + an **embedded server** + **starter** dependencies.\n\n"
            "- `@SpringBootApplication` = `@Configuration` + `@EnableAutoConfiguration` + `@ComponentScan`.\n"
            "- **`spring.factories` / `AutoConfiguration.imports`** — how starters register their config.\n"
            "- **`@ConditionalOnX`** — what makes auto-config opt-in.\n"
            "- **`application.properties` / yml + profiles** — environment-aware config.\n"
            "- **Actuator** — `/actuator/health`, `/info`, `/metrics`, `/env` (secured!)."
        ),
        "interview_hooks": (
            "- **Disable an auto-config** — `@SpringBootApplication(exclude = ...)` or `spring.autoconfigure.exclude=`.\n"
            "- **`@ConfigurationProperties` vs `@Value`** — typed binding vs single-key SpEL; prefer the former.\n"
            "- **Profiles** — comma-separated; `@Profile(\"!prod\")` works; never hardcode secrets.\n"
            "- **Graceful shutdown** — `server.shutdown=graceful` + `spring.lifecycle.timeout-per-shutdown-phase`.\n"
            "- **Layered jars / jib** — Docker-friendly, faster cache hits."
        ),
        "speaking_template": (
            "> *\"In Spring Boot I'd lean on the <starter>, override <single property> via "
            "`application-<env>.yml`, expose <actuator endpoints> behind <security>, and ship a layered Docker "
            "image so dependency layers stay cached. For startup tuning I'd profile with the conditions report "
            "and disable unused auto-configs.\"*"
        ),
    },
    "spring-data-jpa": {
        "mental_model": (
            "Three layers stacked tightly:\n\n"
            "- **JPA spec** — entities, persistence context (1L cache), JPQL, transactions.\n"
            "- **Hibernate** — implementation; flush modes, dirty checking, lazy proxies.\n"
            "- **Spring Data JPA** — repository abstraction, query derivation, `@Query`.\n\n"
            "**N+1** is always a fetch-strategy problem — solve it with `JOIN FETCH`, entity graphs, or projections."
        ),
        "interview_hooks": (
            "- **Lazy vs eager** — default `@ManyToOne` eager, `@OneToMany` lazy. Always opt-in eager only for navigations you *always* need.\n"
            "- **Entity equality** — by ID, but only after persist; for transient instances use a business key.\n"
            "- **`@Transactional` propagation** — `REQUIRED` default; `REQUIRES_NEW` opens a sibling tx but only via the proxy.\n"
            "- **Optimistic vs pessimistic locking** — `@Version` vs `select … for update`; choose by contention level.\n"
            "- **2L cache** — opt-in (`@Cacheable`); be explicit about regions and invalidation."
        ),
        "speaking_template": (
            "> *\"To avoid N+1 I'd use a `JOIN FETCH` query (or named entity graph) for the eager case and "
            "DTO projections for read-only paths. Transaction boundary lives at the service layer, propagation "
            "`REQUIRED` by default. For contention I'd start with optimistic `@Version` and escalate to "
            "pessimistic `for update` only on hot rows.\"*"
        ),
    },
    "spring-security": {
        "mental_model": (
            "Spring Security is **a chain of filters**, then **method security** on top:\n\n"
            "- **`SecurityFilterChain`** — request-level rules, AuthN, session strategy.\n"
            "- **`AuthenticationManager`** + providers — DAO, LDAP, OAuth2, JWT.\n"
            "- **Method security** — `@PreAuthorize`, `@PostAuthorize`, SpEL.\n"
            "- **Cross-cutting** — CORS, CSRF, headers, password encoders (`BCryptPasswordEncoder`).\n\n"
            "Boot 3 / Security 6 dropped `WebSecurityConfigurerAdapter`; everything is now bean-style."
        ),
        "interview_hooks": (
            "- **Stateless JWT** — no server session, signature verification on every request; never put secrets in the JWT.\n"
            "- **CSRF** — disable on stateless APIs only; keep enabled for cookie-session apps.\n"
            "- **Password storage** — BCrypt (default), Argon2 if you can afford the cost.\n"
            "- **Method security on `@Async`** — context propagation needs `DelegatingSecurityContextRunnable`.\n"
            "- **OAuth2** — Resource Server vs Authorisation Server vs Client; name the role you're playing."
        ),
        "speaking_template": (
            "> *\"I'd configure a `SecurityFilterChain` bean, route public/private paths explicitly, choose "
            "<JWT | session> based on <statelessness need>, encode passwords with BCrypt, and put method-level "
            "guards on the service. CSRF stays on for cookie auth, off for stateless JWT APIs.\"*"
        ),
    },
    "spring-webflux": {
        "mental_model": (
            "WebFlux = **reactive streams** (`Mono`/`Flux`) on top of **Netty** by default.\n\n"
            "- Mono = 0..1, Flux = 0..N, both **lazy**.\n"
            "- **Backpressure** is the request-N protocol — consumers signal demand.\n"
            "- **Schedulers** matter — `boundedElastic` for blocking, `parallel` for CPU.\n"
            "- **Don't block** in a reactive chain; if you must, isolate with `subscribeOn(boundedElastic())`."
        ),
        "interview_hooks": (
            "- **Reactive ≠ faster** — only wins on high-concurrency, IO-bound paths.\n"
            "- **`switchMap` vs `flatMap`** — switch cancels prior, flatMap interleaves.\n"
            "- **R2DBC vs JPA** — JPA is blocking; mixing kills the loop.\n"
            "- **Testing** — `StepVerifier` for assertion, `WebTestClient` for HTTP.\n"
            "- **Virtual threads make Webflux less compelling** for new projects — be ready to discuss the trade-off."
        ),
        "speaking_template": (
            "> *\"I'd compose the pipeline as `Mono.fromX` → operators → `subscribe`, isolate any blocking call "
            "on `boundedElastic`, propagate context with `contextWrite`, and verify timing with `StepVerifier`. "
            "For new code I'd weigh WebFlux against virtual threads + plain blocking code.\"*"
        ),
    },
    "spring-batch": {
        "mental_model": (
            "Batch = **Job → Step → Tasklet | Chunk(reader / processor / writer)**.\n\n"
            "- **Chunk** processing reads N, processes N, writes N — atomically per chunk.\n"
            "- **`JobRepository`** persists status — restart picks up from the last good chunk.\n"
            "- **Skip / retry** policies on transient errors.\n"
            "- **Partitioning** for parallel steps; **remote chunking** for distributed."
        ),
        "interview_hooks": (
            "- **Idempotency** — the same input must be safe to re-run; use natural keys + upsert.\n"
            "- **Restart vs rerun** — restart resumes; rerun starts fresh — both are first-class.\n"
            "- **Reader pagination** — never load everything; `JpaPagingItemReader` / cursor reader.\n"
            "- **`@StepScope` / `@JobScope`** — late binding for run-time params (`#{jobParameters['date']}`).\n"
            "- **Scheduler integration** — Quartz for complex cron, `@Scheduled` for simple."
        ),
        "speaking_template": (
            "> *\"I'd model this as <job> with a <chunk-oriented> step (size N tuned to <DB latency / payload "
            "size>), drive idempotency by <natural key + upsert>, allow skip on <classified transient errors>, "
            "and partition by <date / tenant> if the volume justifies it. The schedule sits behind <Quartz | "
            "@Scheduled>.\"*"
        ),
    },
    # ── Data & Persistence ──────────────────────────────────────────────
    "sql-databases": {
        "mental_model": (
            "Three lenses senior interviews probe:\n\n"
            "- **Query model** — joins, subqueries, CTEs, window functions.\n"
            "- **Storage / index model** — B-tree default, hash for equality, partial / covering indexes.\n"
            "- **Concurrency model** — ACID + isolation levels (read-committed default in PG, repeatable-read default in MySQL InnoDB).\n\n"
            "**EXPLAIN** is your evidence. Always read the plan, not the SQL."
        ),
        "interview_hooks": (
            "- **Index doesn't help when** — `WHERE func(col)`, leading wildcard `LIKE '%x'`, mismatched types, low selectivity.\n"
            "- **N+1** at the SQL layer is solved with **JOIN** or **`IN (subquery)`** — or aggregation in DB, not app.\n"
            "- **Phantom reads / lost updates** — name them with the isolation level that prevents each.\n"
            "- **Sharding** is a reorg, not an optimisation; mention it when read replicas + indexes have run out.\n"
            "- **Connection pooling** — HikariCP defaults are fine; size = `connections × instances` against DB max."
        ),
        "speaking_template": (
            "> *\"I'd write the query, run `EXPLAIN ANALYZE`, look for <seq-scan | sort | hash join> on the "
            "hot path, fix it with <index | rewrite | denormalisation>, and only after the query is tight do "
            "I think about <partitioning | sharding | replication>.\"*"
        ),
    },
    "postgresql": {
        "mental_model": (
            "Postgres = **relational core + power-user extras**.\n\n"
            "- **MVCC** — readers don't block writers; vacuum reclaims dead tuples.\n"
            "- **JSONB** — first-class document storage, indexable with GIN.\n"
            "- **Window functions, CTEs, recursive queries** — keep complex logic in SQL.\n"
            "- **Partitioning** — declarative since 10; range, list, hash.\n"
            "- **Replication** — streaming (physical) + logical (selective tables)."
        ),
        "interview_hooks": (
            "- **VACUUM** is mandatory — long transactions block it; bloat kills performance.\n"
            "- **JSONB indexing** — GIN with `jsonb_ops` vs `jsonb_path_ops`.\n"
            "- **`SERIAL` vs `IDENTITY`** — IDENTITY is the modern, spec-compliant default.\n"
            "- **`SELECT FOR UPDATE SKIP LOCKED`** — the classic queue-in-Postgres pattern.\n"
            "- **Hot standby** — read-only replica; mention `pg_basebackup` and `walsender`."
        ),
        "speaking_template": (
            "> *\"For Postgres I'd lean on <JSONB | partitioning | window function> because <fit-for-feature>, "
            "watch for <bloat | replication lag>, and tune <work_mem | shared_buffers | autovacuum> for the "
            "workload before reaching for sharding.\"*"
        ),
    },
    "nosql-mongodb": {
        "mental_model": (
            "MongoDB is a **document store** with a strong query language.\n\n"
            "- Schema = **embedded vs referenced** — embed for read locality, reference for write boundaries.\n"
            "- **Aggregation pipeline** = SQL's GROUP BY + window + projection, all in one.\n"
            "- **Indexes** — single, compound, multikey (arrays), text, geo.\n"
            "- **Replica set** — primary + secondaries; **sharding** for horizontal scale.\n"
            "- **Read concerns** — local / majority / linearizable; pick by consistency need."
        ),
        "interview_hooks": (
            "- **The 16 MB document limit** — rare in practice but interviewers love it.\n"
            "- **Compound index ordering** matters — leftmost prefix wins.\n"
            "- **No joins** — denormalise, or use `$lookup` knowing it's the perf cost.\n"
            "- **Multi-document transactions** — supported in 4+ replica sets, but design for atomic per-document.\n"
            "- **Sharding key** is permanent — picking it badly costs a re-sharding."
        ),
        "speaking_template": (
            "> *\"I'd model the entity as <embedded | referenced> because <access pattern>, index it on "
            "<compound key honouring leftmost prefix>, run reads against secondaries with read concern "
            "<level>, and shard on <key> if writes outgrow a single replica set.\"*"
        ),
    },
    "redis-caching": {
        "mental_model": (
            "Redis is a **single-threaded in-memory data structure server** — speed comes from O(1) ops + simple ops.\n\n"
            "- Data structures: strings / hashes / lists / sets / sorted sets / streams / HyperLogLog / bitmaps.\n"
            "- Persistence: **RDB** (snapshot) + **AOF** (log) — combine for durability + recovery speed.\n"
            "- HA: **Sentinel** for failover, **Cluster** for sharding.\n"
            "- **Cache patterns** — cache-aside (default), read-through, write-back; pick by tolerance for stale data."
        ),
        "interview_hooks": (
            "- **Cache stampede** — solve with mutex / probabilistic early-expiry / request coalescing.\n"
            "- **Hot keys** — split with hash tags or local read-replicas.\n"
            "- **Big keys** are the silent latency killer — set a max size in code.\n"
            "- **Eviction** — LRU/LFU per-key; `volatile-*` only on TTL-set keys.\n"
            "- **Distributed locking with Redlock** — Martin Kleppmann's critique is fair-game knowledge."
        ),
        "speaking_template": (
            "> *\"I'd cache <entity> via cache-aside with TTL <X>, tolerate eventual consistency on writes via "
            "<write-through | invalidation pattern>, pick the data structure as <hash for fielded reads | "
            "sorted set for leaderboards>, and guard against stampede with <single-flight + soft TTL>.\"*"
        ),
    },
    # ── APIs / Microservices / Messaging ────────────────────────────────
    "rest-api": {
        "mental_model": (
            "REST = a **set of constraints** over HTTP — not the sole way to design APIs, but the senior interview default.\n\n"
            "- **Resources** are nouns; **verbs** map to HTTP methods (`GET` / `POST` / `PUT` / `PATCH` / `DELETE`).\n"
            "- **Statelessness** — every request stands alone.\n"
            "- **Idempotency** — `GET` / `PUT` / `DELETE` should be safe to retry.\n"
            "- **Status codes** — 2xx success, 3xx redirect, 4xx client, 5xx server; pick the *most specific*.\n"
            "- **Pagination** — cursor over offset for stable paging."
        ),
        "interview_hooks": (
            "- **PUT vs PATCH** — full replace vs partial; PATCH is typically merge-patch.\n"
            "- **HATEOAS** — pure REST principle; in practice, OpenAPI replaced it for most teams.\n"
            "- **Idempotency keys** — the modern way to deduplicate retries on POST.\n"
            "- **Versioning** — URL path (most common) > header > query; commit to one.\n"
            "- **Error model** — RFC 7807 problem+json or a documented envelope; *be consistent*."
        ),
        "speaking_template": (
            "> *\"I'd model `/resources` as plural nouns, use <PUT | POST + idempotency-key> for safe retries, "
            "page via cursor, document the schema with OpenAPI, and standardise errors with problem+json. "
            "Versioning lives in the URL path because <ops simplicity / cache friendliness>.\"*"
        ),
    },
    "microservices": {
        "mental_model": (
            "Microservices = **independent deployability + bounded contexts**, paid for in operational complexity.\n\n"
            "- **Service boundary** = bounded context (DDD); never split by tech layer.\n"
            "- **Sync** (REST / gRPC) vs **Async** (Kafka / SNS) — pick by coupling tolerance.\n"
            "- **Resilience** — retry, circuit-breaker, bulkhead, timeout (Resilience4j).\n"
            "- **Discovery** — server-side (LB) vs client-side (Eureka).\n"
            "- **Tracing** — OpenTelemetry; correlation IDs are non-negotiable."
        ),
        "interview_hooks": (
            "- **Distributed transactions** — don't; use saga (orchestration vs choreography) and outbox.\n"
            "- **Strangler-fig** — the only sane monolith → microservices migration pattern.\n"
            "- **Service mesh** — sidecars (Istio / Linkerd) move resilience out of code, at infra cost.\n"
            "- **Contract testing** — Pact / Spring Cloud Contract — prevents the cross-service break.\n"
            "- **Cost** — every new service is a new pager; senior answer always weighs ops cost."
        ),
        "speaking_template": (
            "> *\"I'd start with a modular monolith, split out the service when <coupling pain / scale "
            "boundary> appears, communicate sync via <REST | gRPC> and async via <Kafka> with the outbox "
            "pattern, wrap calls in Resilience4j circuit-breakers, and stand up tracing on day one.\"*"
        ),
    },
    "messaging-events": {
        "mental_model": (
            "Three big questions for any event system:\n\n"
            "1. **Delivery semantics** — at-most / at-least / exactly-once.\n"
            "2. **Ordering** — per-partition (Kafka) vs per-queue (RabbitMQ).\n"
            "3. **Durability** — acks, replication factor, ISR, fsync vs not.\n\n"
            "Kafka = log; RabbitMQ = router; SQS = simple queue. Pick by **fit-for-purpose**, not hype."
        ),
        "interview_hooks": (
            "- **Exactly-once** is delivery + processing; both must be idempotent.\n"
            "- **Outbox pattern** — write event in same DB tx as state change, relay to broker.\n"
            "- **CQRS** — read/write split; events update a denormalised read model.\n"
            "- **Kafka partition count** is forever — picking it too low costs a topic re-create.\n"
            "- **Consumer rebalances** — the silent latency spike during deploys."
        ),
        "speaking_template": (
            "> *\"I'd publish events via the outbox so the DB write and broker write are atomic, partition the "
            "topic by <natural key> for ordering, run consumers as idempotent (`UPSERT` keyed by event id), "
            "and watch for consumer-lag + rebalance frequency in observability.\"*"
        ),
    },
    "graphql": {
        "mental_model": (
            "GraphQL = **single endpoint** + **typed schema** + **client-driven queries**.\n\n"
            "- **Resolvers** map fields to data; the resolver tree is the call graph.\n"
            "- **DataLoader** batches + caches per-request — fixes the N+1.\n"
            "- **Mutations** are RPC-flavoured; subscriptions are WebSocket / SSE.\n"
            "- **Federation** stitches multiple subgraphs into one API.\n"
            "- **Schema-first** vs code-first — pick a side and stick to it."
        ),
        "interview_hooks": (
            "- **Over-fetching** is REST's problem; GraphQL's problem is **over-asking**.\n"
            "- **Persisted queries** — security + caching + bandwidth.\n"
            "- **Auth** — at the resolver level; *not* in middleware.\n"
            "- **Depth / cost limits** — prevent malicious deep queries.\n"
            "- **Errors** — partial-success model; clients must handle field-level errors."
        ),
        "speaking_template": (
            "> *\"I'd model the schema around the read needs of the client, batch nested fetches with "
            "DataLoader, persist queries for cacheability, enforce depth + cost limits, and authorise inside "
            "resolvers so each field is independently checked.\"*"
        ),
    },
    "grpc": {
        "mental_model": (
            "gRPC = **HTTP/2 + Protocol Buffers + 4 RPC styles** (unary / server-stream / client-stream / bidi).\n\n"
            "- **Codegen** from `.proto` keeps client and server contract-locked.\n"
            "- **Deadlines** propagate through the call chain — set them.\n"
            "- **Interceptors** for auth, logging, metrics — both client and server side.\n"
            "- **Load-balancing** — client-side (look-aside) common in service meshes."
        ),
        "interview_hooks": (
            "- **Protobuf field numbers** are immutable — never reuse, even after delete.\n"
            "- **Backwards compatibility** — add new optional fields, never repurpose.\n"
            "- **Browser support** — gRPC-Web is required; pure gRPC won't work from a browser.\n"
            "- **Error codes** — gRPC status codes ≠ HTTP; learn the mapping.\n"
            "- **vs REST** — pick gRPC for internal service-to-service, REST for external APIs."
        ),
        "speaking_template": (
            "> *\"I'd define the contract in proto, version fields by adding new tags only, set deadlines "
            "per call, route through a service mesh for client-side LB, and reserve REST for the external "
            "edge where browser + caching matter.\"*"
        ),
    },
    "rabbitmq": {
        "mental_model": (
            "RabbitMQ = **AMQP broker** with rich routing.\n\n"
            "- **Exchanges** route — direct / topic / fanout / headers.\n"
            "- **Queues** durable + persistent + manual ack ⇒ at-least-once.\n"
            "- **Quorum queues** (3.8+) replace mirrored queues — Raft-replicated.\n"
            "- **Prefetch** + manual ack tunes throughput vs fairness.\n"
            "- **DLX** (dead-letter exchange) catches poison messages."
        ),
        "interview_hooks": (
            "- **Manual ack** — no ack ⇒ redelivery on consumer crash; classic interview trap.\n"
            "- **Publisher confirms** — at-least-once on the publish side.\n"
            "- **Quorum vs classic** — Raft vs single-master; pick quorum for new clusters.\n"
            "- **Topic exchange wildcards** — `*` one word, `#` zero+ words.\n"
            "- **Backpressure** — close to publish-side at the connection level when consumers fall behind."
        ),
        "speaking_template": (
            "> *\"I'd use a topic exchange routed on `<context>.<event>`, durable + quorum queues, manual ack "
            "with prefetch tuned, publisher confirms on the producer, and a DLX bound to a parking queue for "
            "ops to inspect.\"*"
        ),
    },
    # ── Architecture & Design ───────────────────────────────────────────
    "design-patterns": {
        "mental_model": (
            "Three families — name the family before the pattern.\n\n"
            "- **Creational** — Factory, Abstract Factory, Builder, Singleton, Prototype.\n"
            "- **Structural** — Adapter, Decorator, Facade, Proxy, Composite, Bridge, Flyweight.\n"
            "- **Behavioural** — Strategy, Observer, Template Method, Command, State, Iterator, Chain of Responsibility.\n\n"
            "**Spring uses many** by default — DI ≈ inversion-of-control, AOP ≈ proxy, `JdbcTemplate` ≈ template method."
        ),
        "interview_hooks": (
            "- **Singleton is a smell** when global state lurks — prefer DI scope.\n"
            "- **Strategy vs State** — same shape, different intent: strategy is interchangeable, state is contextual.\n"
            "- **Builder for records** — modern Java needs less of it.\n"
            "- **Composition is the meta-pattern** — most patterns are composition in disguise.\n"
            "- **Anti-patterns count too** — God object, anaemic domain, magic numbers."
        ),
        "speaking_template": (
            "> *\"This problem is a classic <pattern> from the <creational | structural | behavioural> family "
            "— it gives me <intent>. The trade-off is <indirection cost>, and I'd skip the pattern when "
            "<simpler-shape suffices>.\"*"
        ),
    },
    "architecture-patterns": {
        "mental_model": (
            "Four lenses for any architecture question:\n\n"
            "- **Layered** — easy, but couples to data model.\n"
            "- **Hexagonal / Ports & Adapters** — domain in the middle, infra on the edges.\n"
            "- **Clean** — concentric layers, dependency rule points inward.\n"
            "- **DDD** — bounded contexts, aggregates, ubiquitous language.\n\n"
            "Pick the **lightest** that solves the problem. Senior signal = articulate trade-offs."
        ),
        "interview_hooks": (
            "- **DDD aggregates** — one transactional boundary, identity by ID, rules inside.\n"
            "- **CQRS** — different models for read and write; events keep them in sync.\n"
            "- **Modular monolith** — the underrated default; 95% of teams don't need microservices.\n"
            "- **Conway's law** — architecture mirrors org structure.\n"
            "- **Reversible vs one-way doors** — invest the most thought in one-way doors (data model, public APIs)."
        ),
        "speaking_template": (
            "> *\"I'd start with a modular monolith using hexagonal boundaries, isolate the domain from "
            "infra, draw <bounded contexts> with explicit integration patterns, and only split into services "
            "when <independent deploy / scale / team boundary> demands it.\"*"
        ),
    },
    # ── System Design ───────────────────────────────────────────────────
    "system-design": {
        "mental_model": (
            "Always answer in **5 steps** — never skip a step.\n\n"
            "1. **Requirements** (functional + non-functional + scale).\n"
            "2. **Capacity** (QPS, storage, bandwidth).\n"
            "3. **API + data model**.\n"
            "4. **High-level design** (boxes + arrows).\n"
            "5. **Deep dive** on the bottleneck the interviewer cares about.\n\n"
            "Cite **CAP** + **PACELC** when consistency is on the line."
        ),
        "interview_hooks": (
            "- **Latency vs throughput** — they trade against each other; cite p99 not avg.\n"
            "- **Sharding** is a reorg, not an optimisation — earn it.\n"
            "- **Cache** before sharding; **read replicas** before sharding.\n"
            "- **Idempotency at scale** — keys + TTL + DB unique constraint.\n"
            "- **Back-of-envelope numbers** — 1 GB/s ≈ 8 Gbps; 1 ms = 1 disk seek; 100 µs = 1 SSD read."
        ),
        "speaking_template": (
            "> *\"At <X QPS, Y GB / day> I'd start with a load balancer in front of stateless app servers, a "
            "primary DB with read replicas, Redis for hot reads, Kafka for async work. The bottleneck will be "
            "<DB | cache | network> — the deep dive lives there.\"*"
        ),
    },
    "system-design-cases": {
        "mental_model": (
            "Each case has a **canonical bottleneck** — find it fast, deep-dive there.\n\n"
            "- **URL shortener** — write throughput + key-gen.\n"
            "- **News feed** — fan-out-on-write vs fan-out-on-read.\n"
            "- **Rate limiter** — token bucket vs leaky bucket.\n"
            "- **Chat** — long-poll / WebSocket / push gateway.\n"
            "- **Payments** — idempotency keys, double-entry ledgers, exactly-once.\n"
            "- **Notifications** — fan-out + per-user prefs + delivery semantics."
        ),
        "interview_hooks": (
            "- **Fan-out write** = cheap reads, expensive writes; **fan-out read** = opposite. Pick by `read:write` ratio.\n"
            "- **Exactly-once payment** = idempotency key + DB-unique constraint, never trust delivery alone.\n"
            "- **Geo-distributed** designs need consistency story — quorum read/write or Raft.\n"
            "- **Hot keys** in URL shorteners — use base62 + counter sharding.\n"
            "- **WebSocket scale** — sticky LB or central message bus."
        ),
        "speaking_template": (
            "> *\"For <case> the key constraint is <consistency | latency | scale>. I'd pick <fan-out / "
            "ledger / token-bucket> for that reason, partition by <key> for horizontal scale, and the "
            "bottleneck I'd deep-dive on is <component>.\"*"
        ),
    },
    "low-level-design": {
        "mental_model": (
            "LLD = take a fuzzy prompt, produce a **clean class diagram** in 30 minutes:\n\n"
            "- **Identify entities** — nouns in the prompt.\n"
            "- **Define behaviours** — verbs become methods.\n"
            "- **Apply patterns** — Strategy / State / Factory / Observer where intent matches.\n"
            "- **Code skeleton** — interfaces first, classes second, tests if time permits.\n"
            "- **Concurrency** — declare it: which methods are thread-safe and how."
        ),
        "interview_hooks": (
            "- **Encapsulation** — make state private; expose intentionally.\n"
            "- **Open-closed** — new behaviour by extension, not modification.\n"
            "- **Avoid premature interfaces** — extract one when you have ≥ 2 implementations.\n"
            "- **Mutability** — default to immutable; opt into mutability with reason.\n"
            "- **Don't model the database** — model the domain."
        ),
        "speaking_template": (
            "> *\"Entities: <A, B, C>. Relationships: <association / composition>. The behaviour split is "
            "<service A vs domain B>; I'd apply <pattern> for <intent>. Concurrency: <which methods need "
            "synchronisation> and the data is <immutable / atomic / locked>.\"*"
        ),
    },
    # ── Security / Testing / DevOps ─────────────────────────────────────
    "application-security": {
        "mental_model": (
            "Defence in depth, with the **OWASP Top 10** as the default threat catalogue:\n\n"
            "- **Injection** — parameterised queries, prepared statements.\n"
            "- **AuthN / AuthZ** — strong password storage (BCrypt / Argon2), least privilege.\n"
            "- **XSS / CSRF** — output encoding, CSRF tokens for cookie auth.\n"
            "- **Crypto at rest + in transit** — TLS 1.2+, AES-GCM.\n"
            "- **Dependencies** — SCA (OWASP Dependency-Check, Snyk, Trivy)."
        ),
        "interview_hooks": (
            "- **Storing JWTs in localStorage** = XSS-readable; httpOnly cookies are safer.\n"
            "- **Log4Shell-grade incidents** — patch fast, mitigate by config when patch isn't possible.\n"
            "- **Secrets** — never in code, never in env without a vault.\n"
            "- **CSRF on stateless APIs** — disable; on cookie sessions — enable.\n"
            "- **CSP** — most underused defence; even a basic policy stops most XSS classes."
        ),
        "speaking_template": (
            "> *\"I'd treat input as hostile, parameterise every query, store passwords with BCrypt cost 12+, "
            "ship a CSP header, run SCA in CI, rotate secrets via vault, and review the OWASP Top 10 against "
            "the design before shipping.\"*"
        ),
    },
    "unit-testing": {
        "mental_model": (
            "Pyramid order: **unit > integration > E2E**.\n\n"
            "- **Unit** — JUnit 5; isolate with Mockito.\n"
            "- **Integration** — `@SpringBootTest` + Testcontainers (real DB, real Kafka).\n"
            "- **E2E** — slow, flaky; reserve for the critical user journeys.\n"
            "- **Contract** — Pact / Spring Cloud Contract; the seam between services.\n"
            "- **Mutation** (PIT) — find what your tests *don't* cover."
        ),
        "interview_hooks": (
            "- **Don't mock what you don't own** — tests become coupled to upstream APIs.\n"
            "- **Testcontainers > H2** — same DB engine as prod or your test is lying.\n"
            "- **`@SpyBean` is a smell** — usually means the seam is wrong.\n"
            "- **Flakiness** — almost always async timing or shared state; fix the cause, don't `Thread.sleep`.\n"
            "- **TDD vs test-after** — TDD when the design is unclear; test-after when it's a refactor."
        ),
        "speaking_template": (
            "> *\"I'd unit-test the pure logic, integration-test the wiring with Testcontainers, contract-test "
            "the public API, and reserve E2E for the smoke-critical paths. Coverage is a signal, not a goal — "
            "mutation testing tells me whether tests *assert* anything.\"*"
        ),
    },
    "git-build-tools": {
        "mental_model": (
            "Git is **a content-addressable file system + a DAG of commits**.\n\n"
            "- **Commit** = tree + parent(s) + author + message.\n"
            "- **Branch** = a movable pointer to a commit.\n"
            "- **Rebase** rewrites history; **merge** preserves it. Use rebase locally, merge for the shared trunk.\n"
            "- **Bisect** finds the bad commit in O(log n).\n"
            "- **Hooks** + CI gates keep the trunk green."
        ),
        "interview_hooks": (
            "- **Force-push to shared branch** = destroy work; never on main.\n"
            "- **Rebase vs merge** — rebase your feature branch, merge the PR.\n"
            "- **Cherry-pick** — single commit across branches; good for backports.\n"
            "- **Reflog** is the parachute — almost nothing in Git is truly lost.\n"
            "- **Trunk-based vs GitFlow** — TBD wins for CD; GitFlow for release-train shops."
        ),
        "speaking_template": (
            "> *\"My team works trunk-based with short-lived branches, rebases before push, merges via PR, and "
            "uses `git bisect` to find regressions. We never force-push the trunk and protect it with required "
            "checks + signed commits.\"*"
        ),
    },
    "java-build-tools": {
        "mental_model": (
            "Maven and Gradle solve the same problem differently:\n\n"
            "- **Maven** — declarative XML, fixed lifecycle, batteries-included.\n"
            "- **Gradle** — programmable Groovy/Kotlin DSL, incremental builds, configurable cache.\n"
            "- **Bazel** — the third option for monorepos at scale.\n"
            "- **Wrapper** (`mvnw` / `gradlew`) is non-negotiable — pin the build tool version.\n"
            "- **Reproducible builds** — no `SNAPSHOT` in releases."
        ),
        "interview_hooks": (
            "- **Maven scopes** — compile / provided / runtime / test; mention `provided` for servlet APIs.\n"
            "- **Gradle config-cache** — modern speedup; opt-in via flag.\n"
            "- **Multi-module builds** — `<modules>` in Maven, `include 'a','b'` in Gradle.\n"
            "- **Dependency conflict** — Maven nearest-wins, Gradle highest-version-wins.\n"
            "- **Publishing** — `mvn deploy` vs `gradle publish`; both need credentials in settings, not in code."
        ),
        "speaking_template": (
            "> *\"For a new Spring Boot project I'd reach for <Maven for simplicity | Gradle for build speed>, "
            "pin the version via wrapper, manage deps with BOMs, fail the build on convergence conflicts, and "
            "publish via CI with credentials from the secret store.\"*"
        ),
    },
    "cicd": {
        "mental_model": (
            "CI ≠ CD ≠ CDeployment. Always disambiguate.\n\n"
            "- **CI** — every commit builds + tests on the trunk.\n"
            "- **Continuous Delivery** — every passing build is releasable.\n"
            "- **Continuous Deployment** — every passing build *is* released.\n"
            "- **Pipeline** stages: build → test → security scan → package → deploy → smoke → monitor.\n"
            "- **Rollback** is a feature, not an afterthought."
        ),
        "interview_hooks": (
            "- **Blue/green vs canary** — full-cutover vs progressive; pick by blast radius tolerance.\n"
            "- **Feature flags** > long-lived branches; merge quickly, expose progressively.\n"
            "- **Secrets** in CI — short-lived OIDC tokens > static keys.\n"
            "- **Pipeline as code** — Jenkinsfile / `.github/workflows`; review in PR.\n"
            "- **SLO-based deploy** — auto-rollback on regression; the modern target."
        ),
        "speaking_template": (
            "> *\"I'd run trunk-based with PR builds, deploy on merge to staging, gate prod on a manual "
            "approval (or auto-promote on green SLOs), use canary + auto-rollback, and feature-flag risky "
            "changes so deploys are decoupled from releases.\"*"
        ),
    },
    "terraform": {
        "mental_model": (
            "Terraform = **declarative infra**, with state as the source of truth.\n\n"
            "- **Providers** — pluggable (AWS, GCP, Azure, K8s, GitHub).\n"
            "- **State** — `terraform.tfstate`, **remote** in S3+DynamoDB / GCS / Terraform Cloud.\n"
            "- **Modules** — reusable units; pin versions.\n"
            "- **Workspaces** — environment isolation (dev / stage / prod).\n"
            "- **Plan → apply** is the immutable contract."
        ),
        "interview_hooks": (
            "- **State locking** — non-negotiable for teams; DynamoDB lock for S3 backend.\n"
            "- **Drift** — out-of-band changes break `plan`; fix with `import` or rebuild.\n"
            "- **Secrets** — never in `.tf`; pull from a vault data source.\n"
            "- **Destroy is permanent** — always read the plan before applying.\n"
            "- **`terraform_remote_state`** — share outputs between root modules."
        ),
        "speaking_template": (
            "> *\"State lives remotely with locking, modules are versioned, secrets come from <vault>, "
            "environments are split via workspaces, and every change goes plan → review → apply through CI "
            "— manual `apply` from a laptop is a smell.\"*"
        ),
    },
    "jenkins": {
        "mental_model": (
            "Jenkins = **a job orchestrator** with a pipeline DSL.\n\n"
            "- **Declarative pipeline** = recommended; **scripted** = full Groovy.\n"
            "- **Agents** — controllers shouldn't run jobs; pin agents by label.\n"
            "- **Shared libraries** — code reuse across `Jenkinsfile`s.\n"
            "- **Credentials** — bound at step level; never echoed.\n"
            "- **Multi-branch** — auto-discovers branches, builds PRs."
        ),
        "interview_hooks": (
            "- **Don't run on the controller** — security + scaling.\n"
            "- **Plugins are the failure surface** — pin versions, treat as code.\n"
            "- **Pipeline parallelism** — `parallel { ... }` block; quick win for slow tests.\n"
            "- **Stash / unstash** — workspace handoff between agents.\n"
            "- **Migration off Jenkins** is common; but legacy hosts make it sticky."
        ),
        "speaking_template": (
            "> *\"I'd run declarative pipelines with versioned shared libraries, pin agents by label, scope "
            "credentials per-step, and treat plugin upgrades as code review. For new shops I'd consider "
            "GitHub Actions or GitLab CI before standing up Jenkins.\"*"
        ),
    },
    "docker": {
        "mental_model": (
            "Docker = **process isolation** via Linux namespaces + cgroups.\n\n"
            "- **Image** = layered FS + manifest.\n"
            "- **Container** = running instance + writable top layer.\n"
            "- **Multi-stage builds** — separate build deps from runtime image.\n"
            "- **Non-root** by default; **distroless** as the modern best practice.\n"
            "- **`ENTRYPOINT` vs `CMD`** — entrypoint = executable, cmd = default args."
        ),
        "interview_hooks": (
            "- **Layer order** matters — least-frequently-changed first.\n"
            "- **`.dockerignore`** — both build speed and image-size win.\n"
            "- **`HEALTHCHECK`** — declared in Dockerfile, surfaced by orchestrator.\n"
            "- **Spring Boot layered jars / jib** — JVM-aware tooling.\n"
            "- **Don't run `latest`** — pin tags, prefer immutable digest references."
        ),
        "speaking_template": (
            "> *\"I'd build a multi-stage Dockerfile, base on distroless, run as non-root, declare a "
            "`HEALTHCHECK`, leverage Spring Boot layered jars for cache hits, and pin the digest in "
            "production manifests.\"*"
        ),
    },
    "kubernetes": {
        "mental_model": (
            "K8s = **control loops over a desired-state spec**.\n\n"
            "- **Pod** is the atom; **Deployment** owns replica sets.\n"
            "- **Service** = stable virtual IP; **Ingress** = HTTP routing.\n"
            "- **ConfigMap / Secret** for config; **PVC** for storage.\n"
            "- **Probes** — liveness restarts the pod, readiness gates traffic.\n"
            "- **HPA / VPA** — scale on CPU / memory / custom metrics."
        ),
        "interview_hooks": (
            "- **CrashLoopBackOff** debug — `kubectl describe` for events, `logs --previous` for the prior crash.\n"
            "- **Resource requests + limits** — requests reserve, limits cap; OOMKilled if you hit memory limit.\n"
            "- **StatefulSet vs Deployment** — stable identity + ordered start; for databases, kafka.\n"
            "- **Network policies** — deny by default, allow per-namespace.\n"
            "- **Helm vs Kustomize** — templates vs overlays; both fine, pick one."
        ),
        "speaking_template": (
            "> *\"I'd deploy stateless apps as a Deployment with readiness + liveness probes, set realistic "
            "requests/limits, expose via Service + Ingress, manage config in ConfigMap / Secrets, and scale "
            "with HPA on a metric that tracks user-perceived load.\"*"
        ),
    },
    "aws-cloud": {
        "mental_model": (
            "Pick the **smallest** AWS service that does the job.\n\n"
            "- **Compute** — Lambda < ECS Fargate < ECS / EKS < EC2.\n"
            "- **Datastore** — DynamoDB for KV, RDS for relational, S3 for blobs.\n"
            "- **Messaging** — SQS for queues, SNS for fan-out, EventBridge for rules, Kinesis for streams.\n"
            "- **Identity** — IAM roles for everything; never long-lived keys.\n"
            "- **Networking** — VPC, subnets, security groups, NACLs."
        ),
        "interview_hooks": (
            "- **IAM least-privilege** — explicit deny > implicit; trust policies trip people up.\n"
            "- **S3 consistency** — strong read-after-write since 2020; pre-2020 trivia is outdated.\n"
            "- **DynamoDB partition key** is permanent; pick to avoid hot partitions.\n"
            "- **Lambda cold starts** — provisioned concurrency or SnapStart for Java.\n"
            "- **Cost** — most expensive thing you forgot to turn off."
        ),
        "speaking_template": (
            "> *\"I'd run the service on <Lambda for spiky / Fargate for steady> behind <ALB | API Gateway>, "
            "store data in <DynamoDB | RDS> picked for <access pattern>, use SQS for buffering, attach IAM "
            "roles per-service, and put cost guardrails on day one.\"*"
        ),
    },
    "cloud-native": {
        "mental_model": (
            "Cloud-native ≠ cloud — it's the **patterns** that work in *any* cloud.\n\n"
            "- **12-factor app** — config in env, stateless processes, log to stdout, etc.\n"
            "- **Patterns** — sidecar, ambassador, circuit breaker, bulkhead.\n"
            "- **Deployment** — rolling, blue/green, canary, progressive delivery.\n"
            "- **DR** — RPO (data loss) + RTO (downtime); design backwards from those numbers.\n"
            "- **FinOps** — cost is a non-functional requirement."
        ),
        "interview_hooks": (
            "- **Active/active** vs **active/passive** — latency vs cost vs complexity.\n"
            "- **Stateless ≠ no state** — externalise state to managed stores.\n"
            "- **Multi-region** — DNS-based failover or anycast; both cost.\n"
            "- **Cost optimisation** — reservations + autoscaling + savings plans.\n"
            "- **Vendor lock-in** is partly a myth — use managed services, abstract carefully."
        ),
        "speaking_template": (
            "> *\"I'd build to 12-factor, run stateless services with externalised state, use canary deploys "
            "with auto-rollback, plan DR around explicit RPO/RTO, and bake cost dashboards into the SRE "
            "rituals.\"*"
        ),
    },
    "gcp": {
        "mental_model": (
            "GCP = **opinionated, managed-first** Google Cloud.\n\n"
            "- **Compute** — Cloud Run < GKE < GCE.\n"
            "- **Data** — Cloud SQL (relational), Spanner (global SQL), BigQuery (analytics), Firestore (KV/doc).\n"
            "- **Messaging** — Pub/Sub for everything async.\n"
            "- **IAM** — workload identity > service-account keys.\n"
            "- **Operations** — Cloud Monitoring + Logging + Trace, all integrated."
        ),
        "interview_hooks": (
            "- **Cloud Run autoscales to zero** — cheap, but cold starts.\n"
            "- **Spanner** is the only globally-consistent SQL — at a price.\n"
            "- **Workload identity** — no static keys for GKE workloads.\n"
            "- **Service-account JSON keys** are the security smell — rotate or eliminate.\n"
            "- **BigQuery on-demand vs flat-rate** — pick by predictability of spend."
        ),
        "speaking_template": (
            "> *\"For Spring Boot on GCP I'd ship Cloud Run with a min-instance for warmth, use Cloud SQL for "
            "transactional data, BigQuery for analytics, secrets in Secret Manager, identity via Workload "
            "Identity, and observability via Cloud Operations.\"*"
        ),
    },
    "azure": {
        "mental_model": (
            "Azure = **enterprise-first** Microsoft cloud.\n\n"
            "- **Compute** — Azure Spring Apps (managed Spring Boot), AKS, Functions.\n"
            "- **Data** — Azure SQL, Cosmos DB (multi-model), Blob Storage.\n"
            "- **Messaging** — Service Bus (queues / topics), Event Hubs (streams).\n"
            "- **Identity** — Entra ID (formerly AAD); managed identities for services.\n"
            "- **Observability** — Application Insights tied to Azure Monitor."
        ),
        "interview_hooks": (
            "- **Cosmos DB partition key** — hot partitions blow your RU bill; choose carefully.\n"
            "- **Managed Identity** > connection strings.\n"
            "- **Key Vault** + reference syntax in App Settings — pulls secrets at runtime.\n"
            "- **Spring on Azure** — Azure Spring Apps gives you Eureka + Config without standing them up.\n"
            "- **Hybrid scenarios** — Azure Arc / ExpressRoute show up in enterprise interviews."
        ),
        "speaking_template": (
            "> *\"I'd deploy Spring Boot to Azure Spring Apps or AKS, store transactional data in Azure SQL, "
            "use Service Bus for async, secure with Managed Identity + Key Vault, and instrument with "
            "Application Insights for end-to-end traces.\"*"
        ),
    },
    "observability": {
        "mental_model": (
            "Three pillars + one outcome:\n\n"
            "- **Metrics** — counter, gauge, histogram (Micrometer + Prometheus).\n"
            "- **Logs** — structured JSON + correlation ID; ship to ELK / Loki / Splunk.\n"
            "- **Traces** — OpenTelemetry, Jaeger / Zipkin / Tempo.\n"
            "- **Outcome** = SLI / SLO / error budget — *that's the language ops talks*.\n\n"
            "**Four golden signals**: latency, traffic, errors, saturation."
        ),
        "interview_hooks": (
            "- **Cardinality** kills metrics — never put `userId` in a label.\n"
            "- **MDC** propagates correlation IDs through `Logger`; lose it on async hops.\n"
            "- **Sampling** is a trade-off — head-based easy, tail-based smarter.\n"
            "- **Alert fatigue** — page on SLO burn-rate, not raw thresholds.\n"
            "- **Health checks** ≠ readiness — liveness restarts, readiness gates traffic."
        ),
        "speaking_template": (
            "> *\"I'd instrument the four golden signals with Micrometer → Prometheus, structured logs with "
            "correlation IDs in MDC, distributed tracing via OpenTelemetry, and define SLOs that drive "
            "burn-rate alerts — paging humans only on user-visible regressions.\"*"
        ),
    },
    "production-sre": {
        "mental_model": (
            "Production engineering revolves around **incident → postmortem → SLO**.\n\n"
            "- **Incident** — declare early; severity guides response, not ego.\n"
            "- **On-call** — runbooks per alert, paired rotation, fair distribution.\n"
            "- **Postmortem** — blameless, timeline + 5-whys, action items with owners.\n"
            "- **Toolkit** — `jstack`, `jmap`, `async-profiler`, JFR, eBPF.\n"
            "- **Capacity planning** — model peak + headroom + chaos drills."
        ),
        "interview_hooks": (
            "- **MTTR > MTBF** for modern systems — fast recovery beats rare failure.\n"
            "- **Error budget** — depleted = freeze risky deploys; pure SRE doctrine.\n"
            "- **Memory leaks in JVM** — heap dump + diff retained sets; `LinkedHashMap` cache without bounds is the classic.\n"
            "- **Thread dumps** — look for `BLOCKED` clusters, that's the contention.\n"
            "- **Chaos engineering** — start small, gameday quarterly."
        ),
        "speaking_template": (
            "> *\"For a P1 I'd declare, mitigate first (rollback / feature flag), preserve evidence, run a "
            "blameless postmortem within 48 h with concrete action items, track them to closure, and feed "
            "the lesson back into runbooks + alerts.\"*"
        ),
    },
    # ── Interview Readiness ─────────────────────────────────────────────
    "behavioral": {
        "mental_model": (
            "Behavioural rounds use **STAR**: Situation → Task → Action → Result.\n\n"
            "- **Situation** — set context in 2 sentences, no jargon.\n"
            "- **Task** — what *you* owned (not the team).\n"
            "- **Action** — concrete, in first person, ~3 specific moves.\n"
            "- **Result** — measurable; quantify when you can.\n\n"
            "Have **5 stories** ready that flex to: conflict, ambiguity, failure, leadership, technical depth."
        ),
        "interview_hooks": (
            "- **\"Tell me about a failure\"** — pick a real one, own your part, name the lesson.\n"
            "- **\"Difficult teammate\"** — show empathy + structure; never trash-talk.\n"
            "- **\"Most challenging project\"** — pick the *technically* hard one, not the politically hard one.\n"
            "- **\"Why this company\"** — research; tie to their stack / scale / mission, not perks.\n"
            "- **Avoid \"we\"** — interviewers want *your* contribution."
        ),
        "speaking_template": (
            "> *\"Situation: <one-sentence context>. Task: <my specific responsibility>. Action: <three "
            "concrete moves>. Result: <quantified outcome + what I learned>.\"*"
        ),
    },
    "engineering-practices": {
        "mental_model": (
            "Senior engineering = **what you do outside the IDE**.\n\n"
            "- **Code review** — catch design issues, not bracket placement; be kind, be specific.\n"
            "- **ADRs** — capture *why*, not just *what*. Future-you will thank you.\n"
            "- **Tech debt** — log it as a backlog item, link to symptoms; don't moralise.\n"
            "- **Mentoring** — pair on hard tickets, leave artefacts (docs, recordings).\n"
            "- **Cross-team** — write the doc *before* the meeting."
        ),
        "interview_hooks": (
            "- **\"How do you handle disagreement in code review?\"** — surface the underlying principle, ask, agree.\n"
            "- **\"How would you onboard onto a high-debt team?\"** — listen 30 days, write the map, fix one thing visibly.\n"
            "- **\"How do you prioritise tech debt?\"** — by *cost of carry* + risk, not aesthetics.\n"
            "- **\"How do you mentor?\"** — observable goals, weekly checkpoints, public credit.\n"
            "- **\"How do you write ADRs?\"** — context, decision, consequences; one page max."
        ),
        "speaking_template": (
            "> *\"My approach is <listen → map → fix one>. I'd write an ADR for the call, run the change "
            "through code review with a focus on <design / observability / failure modes>, and follow up "
            "with a 1-pager so the team can refer back.\"*"
        ),
    },
    # ── JFI-only frontend modules ───────────────────────────────────────
    "javascript-core": {
        "mental_model": (
            "Three layers, **always the same**:\n\n"
            "- **Language** — types (incl. `BigInt`), `==` vs `===`, hoisting, scoping (`var` / `let` / `const`).\n"
            "- **Runtime** — event loop + microtasks + macrotasks; `this` rules; closures.\n"
            "- **Modern syntax** — destructuring, optional chaining, nullish coalescing, modules (`import` / `export`).\n\n"
            "Senior signal: name **temporal dead zone**, **prototype chain**, and **tail-call** trivia confidently."
        ),
        "interview_hooks": (
            "- **`this` rules** — call site, arrow inherits, `bind` overrides.\n"
            "- **Closures** — variables captured by reference; classic loop+`var` bug.\n"
            "- **Promises** — micro-task queue, `await` is sugar over `.then`.\n"
            "- **Equality** — always `===` unless you mean it; `null == undefined` is the only sane `==`.\n"
            "- **Modules** — `import` is hoisted, evaluated once, supports tree-shaking when bundlers can prove side-effect-free."
        ),
        "speaking_template": (
            "> *\"I'd reach for <const + arrow function | class | module> because <reason rooted in scope / "
            "behaviour>; the runtime concern is <event-loop ordering | closure capture | this-binding>; the "
            "modern syntax I'd use is <optional chaining | destructuring | spread> for clarity.\"*"
        ),
    },
    "javascript-advanced": {
        "mental_model": (
            "Beyond the basics, JS has four lenses:\n\n"
            "- **Async patterns** — Promise.all / allSettled / race; cancellation via `AbortController`.\n"
            "- **Iteration** — generators, async iterators, `for await`.\n"
            "- **Memory** — closures retain refs; weak refs (`WeakMap` / `WeakSet`) for caches.\n"
            "- **Meta-programming** — `Proxy` + `Reflect`, decorators (Stage 3).\n"
            "- **Performance** — V8 hidden classes, inline caches, deopts."
        ),
        "interview_hooks": (
            "- **Promise chaining** — return the next promise, never `.then(() => promise)` then forget.\n"
            "- **`AbortController`** — modern cancellation; `fetch` accepts a signal.\n"
            "- **Generators** are pull, async iterators are push-pull; `for await` is the bridge.\n"
            "- **WeakMap** for object-keyed caches that don't leak.\n"
            "- **Don't reach for `Proxy`** unless you need transparent interception (ORM, validation)."
        ),
        "speaking_template": (
            "> *\"I'd model the async flow with `Promise.allSettled` for fan-out tolerance, propagate "
            "cancellation via `AbortController`, use generators for lazy pipelines, and reserve `Proxy` for "
            "transparent interception only when nothing simpler fits.\"*"
        ),
    },
    "typescript-essentials": {
        "mental_model": (
            "TypeScript = **structural type system** on top of JS.\n\n"
            "- **Compile-time only** — types are erased, no runtime cost.\n"
            "- **Inference** is the killer feature — annotate at boundaries, infer inside.\n"
            "- **Generics** — `<T>` for reusable abstractions.\n"
            "- **Utility types** — `Partial`, `Pick`, `Omit`, `Record`, `ReturnType`.\n"
            "- **`unknown` > `any`** — narrow before use."
        ),
        "interview_hooks": (
            "- **Structural vs nominal** — TS is structural; you can't enforce branded identity without `& { __brand }`.\n"
            "- **Discriminated unions** — the senior pattern for state machines.\n"
            "- **`strict` mode** — non-negotiable; turn it on day one.\n"
            "- **Type narrowing** — `typeof`, `in`, custom predicates (`x is T`).\n"
            "- **`any` is a smell** — it leaks, and the type system stops helping."
        ),
        "speaking_template": (
            "> *\"I'd model the domain with discriminated unions, narrow with custom type guards, expose "
            "minimal generic surfaces, and run with `strict` + `noUncheckedIndexedAccess`. `any` is a debt "
            "I track in code review.\"*"
        ),
    },
    "react-core": {
        "mental_model": (
            "React = **a function of state**: `UI = f(state)`.\n\n"
            "- **JSX** is sugar for `React.createElement`.\n"
            "- **Render** is pure; **effects** are where side-effects live.\n"
            "- **Reconciliation** uses keys; bad keys = reordering bugs.\n"
            "- **Hooks** are stateful functions — order matters, no conditionals.\n"
            "- **Concurrent features** — `useTransition`, `Suspense` for data."
        ),
        "interview_hooks": (
            "- **`useEffect` deps** — exhaustive-deps rule, never lie to React.\n"
            "- **Closures in handlers** — stale state if you forget the deps array.\n"
            "- **Controlled vs uncontrolled** inputs — pick one and stick to it.\n"
            "- **Re-render ≠ commit** — virtual DOM diff is cheap; the real cost is in commit phase.\n"
            "- **Strict mode** double-invokes effects in dev — *feature*, not a bug."
        ),
        "speaking_template": (
            "> *\"I'd lift state to the lowest common parent, model derived state as a memo (or just "
            "computed), gate side-effects in `useEffect` with exhaustive deps, and reach for `useTransition` "
            "/ `useDeferredValue` only when the user can perceive the lag.\"*"
        ),
    },
    "react-state-data": {
        "mental_model": (
            "Pick by **scope**:\n\n"
            "- **Local** — `useState` / `useReducer`.\n"
            "- **Cross-component** — context (sparingly) or Zustand / Jotai.\n"
            "- **Server state** — TanStack Query / SWR / RTK Query.\n"
            "- **Global app** — Redux Toolkit (still fine!), MobX (less common).\n\n"
            "**Server state ≠ client state**. The biggest junior mistake is jamming server data into Redux."
        ),
        "interview_hooks": (
            "- **Context re-renders** every consumer on any change — split contexts or memoise.\n"
            "- **Cache invalidation** — TanStack Query gives it for free; rolling your own is a trap.\n"
            "- **Optimistic updates** — TanStack Query / RTK Query both support; handle rollback.\n"
            "- **Forms** — React Hook Form is the modern default for performant uncontrolled-style forms.\n"
            "- **Selector pattern** — pick slices to avoid unnecessary re-renders."
        ),
        "speaking_template": (
            "> *\"Server state goes in TanStack Query for the cache + invalidation story; client UI state "
            "lives in component-local hooks or a small Zustand store; cross-cutting concerns (theme, auth) "
            "in context with selectors. I avoid Redux unless we already have it.\"*"
        ),
    },
    "react-routing-forms": {
        "mental_model": (
            "Two themes:\n\n"
            "- **Routing** — React Router v6+ uses data routers (`loader` / `action`); Next.js App Router has "
            "  layouts + server components.\n"
            "- **Forms** — controlled inputs are simple but expensive at scale; React Hook Form (uncontrolled "
            "  + refs) wins on performance.\n\n"
            "Validation lives in **Zod / Yup** with React Hook Form; share schemas with the backend if you can."
        ),
        "interview_hooks": (
            "- **Nested routes** — index routes + outlet; layouts in App Router.\n"
            "- **Protected routes** — redirect from `loader`; never block in render.\n"
            "- **Server-side validation** is the source of truth; client is UX sugar.\n"
            "- **Optimistic UI** for forms — show success, rollback on error.\n"
            "- **Accessibility** — labels, fieldset/legend, error association."
        ),
        "speaking_template": (
            "> *\"I'd use React Hook Form + Zod for the form, lift validation rules into a shared schema, "
            "submit through a route action, optimistic-update the UI, and ensure every field has an "
            "associated label + announced error.\"*"
        ),
    },
    "react-performance-patterns": {
        "mental_model": (
            "React perf = **render less, render smaller, render later**.\n\n"
            "- **`React.memo`** — skip re-render when props are referentially equal.\n"
            "- **`useMemo` / `useCallback`** — stabilise references when downstream cares.\n"
            "- **Virtualisation** — react-window / react-virtual for long lists.\n"
            "- **Code splitting** — `React.lazy` + `Suspense`.\n"
            "- **Concurrent features** — `useTransition` to mark non-urgent updates."
        ),
        "interview_hooks": (
            "- **Premature memoisation** is a common mistake — measure first.\n"
            "- **Profiler** is built in — open the React DevTools, record, find the blame.\n"
            "- **Long lists without virtualisation** — the most common perf bug.\n"
            "- **Image optimisation** — `srcSet`, `loading=\"lazy\"`, modern formats.\n"
            "- **Bundle analysis** — `webpack-bundle-analyzer` / Vite plugins; trim before you split."
        ),
        "speaking_template": (
            "> *\"I'd profile with React DevTools, virtualise long lists, code-split routes via "
            "`React.lazy`, memoise only where the profiler shows wasted renders, and mark optional "
            "updates with `useTransition` so urgent input stays snappy.\"*"
        ),
    },
    "react-testing": {
        "mental_model": (
            "Pyramid: **unit (RTL) → integration (RTL + MSW) → E2E (Playwright / Cypress)**.\n\n"
            "- **React Testing Library** — query by user-facing role / text, never by class / id.\n"
            "- **MSW** — mock the network, not the module.\n"
            "- **Snapshot tests** — for stable, declarative output only.\n"
            "- **Playwright > Cypress** for cross-browser + speed in 2026.\n"
            "- **Hooks** — extract to a custom hook and test via `renderHook`."
        ),
        "interview_hooks": (
            "- **`getByRole`** is the senior choice — accessibility audit for free.\n"
            "- **`act` warnings** — almost always async state without await.\n"
            "- **MSW** decouples tests from network instability.\n"
            "- **Component tests** in Storybook are gaining ground — interaction tests via Vitest browser mode.\n"
            "- **E2E flakes** — fix the cause (async timing) not the symptom (`waitForTimeout`)."
        ),
        "speaking_template": (
            "> *\"I'd unit-test components with RTL using role-based queries, mock APIs with MSW for "
            "integration, run Playwright on the smoke-critical user journeys, and treat snapshot tests as "
            "an exception, not a default.\"*"
        ),
    },
    "angular-core": {
        "mental_model": (
            "Angular = **opinionated TypeScript-first SPA** with DI baked in.\n\n"
            "- **Components** + **services** + **modules** (or **standalone components** in 14+).\n"
            "- **Change detection** — Zone.js by default; signals (16+) for fine-grained reactivity.\n"
            "- **DI** — hierarchical injectors; `providedIn: 'root'` for app-wide singletons.\n"
            "- **Templates** — structural directives (`*ngIf`, `*ngFor`), pipes, two-way binding.\n"
            "- **CLI** is non-optional — workspace, schematics, generate."
        ),
        "interview_hooks": (
            "- **`OnPush`** vs default change detection — `OnPush` runs on input change or async pipe.\n"
            "- **Standalone components** — Angular 14+; the new default.\n"
            "- **Signals** — fine-grained, no Zone.js needed; expect more questions about them in 2026.\n"
            "- **Lifecycle hooks** — `ngOnInit`, `ngOnDestroy`, `ngOnChanges` matter most.\n"
            "- **`async` pipe** — auto-subscribe + auto-unsubscribe; saves you from leaks."
        ),
        "speaking_template": (
            "> *\"I'd build with standalone components + signals where I can, use `OnPush` change detection, "
            "subscribe in templates with `async` pipe, and keep services thin and stateless or behind a "
            "tested store.\"*"
        ),
    },
    "angular-rxjs": {
        "mental_model": (
            "RxJS = **lazy push streams** with dozens of operators.\n\n"
            "- **Observable** = lazy producer; `subscribe` starts the work.\n"
            "- **Subject** = multicast; **BehaviorSubject** holds last value.\n"
            "- **Operators** — `map` / `filter` (transform), `mergeMap` / `switchMap` / `concatMap` / `exhaustMap` (flatten), `combineLatest` / `forkJoin` (combine).\n"
            "- **Schedulers** — when work runs (sync, async, animationFrame).\n"
            "- **Hot vs cold** — cold per-subscriber, hot multicast."
        ),
        "interview_hooks": (
            "- **`switchMap` cancels the previous** — perfect for type-ahead search.\n"
            "- **`mergeMap` interleaves** — be careful with order.\n"
            "- **`takeUntilDestroyed`** (16+) replaces the manual unsubscribe boilerplate.\n"
            "- **`shareReplay(1)`** for cached values across subscribers.\n"
            "- **`combineLatest` requires every source to emit** — common silent-bug source."
        ),
        "speaking_template": (
            "> *\"I'd model the stream with `switchMap` for cancellation-aware fetches, `combineLatest` for "
            "joined state, share with `shareReplay`, and clean up via `takeUntilDestroyed` so I never leak "
            "subscriptions.\"*"
        ),
    },
    "angular-forms-router": {
        "mental_model": (
            "Two big subsystems:\n\n"
            "- **Forms** — Reactive (preferred) vs Template-driven; both backed by `FormGroup` / `FormControl`.\n"
            "- **Router** — config or standalone routes; `loadChildren` for lazy chunks; guards for protection.\n\n"
            "**Resolvers** preload data before route activation; **preloading strategies** balance bundle size vs perceived speed."
        ),
        "interview_hooks": (
            "- **Reactive vs template-driven** — reactive scales, template-driven is fine for simple cases.\n"
            "- **Cross-field validators** — `FormGroup`-level validators access multiple controls.\n"
            "- **`CanActivate` vs `CanMatch`** — match runs earlier, cheaper.\n"
            "- **Lazy modules** with standalone — `loadComponent`.\n"
            "- **Title strategy** — Angular 14+ has `TitleStrategy` for SEO-friendly titles."
        ),
        "speaking_template": (
            "> *\"I'd model the form with Reactive Forms + a typed `FormGroup`, validate cross-field rules at "
            "the group level, lazy-load route children, protect with `CanMatch` for cheap rejection, and "
            "set per-route titles for SEO.\"*"
        ),
    },
    "angular-state-testing": {
        "mental_model": (
            "Angular state ≈ React state but **observable-shaped**.\n\n"
            "- **Local** — component fields + signals.\n"
            "- **Service singletons** — for shared state (`providedIn: 'root'`).\n"
            "- **NgRx** for redux-style; **Akita** / **Component Store** for lighter alternatives.\n"
            "- **Testing** — TestBed, ComponentFixture, marble tests for RxJS, e2e with Playwright."
        ),
        "interview_hooks": (
            "- **NgRx is heavy** — only justify it on apps with truly shared, derived state.\n"
            "- **`provideHttpClient(withFetch())`** + standalone testing setup is the modern pattern.\n"
            "- **Marble tests** — read like ASCII art; powerful for time-based RxJS.\n"
            "- **Spectator** — reduces TestBed boilerplate.\n"
            "- **Component testing** with Cypress Component Test Runner is gaining traction."
        ),
        "speaking_template": (
            "> *\"For state I'd start with services + signals, escalate to Component Store for feature-scoped "
            "stores, and reach for NgRx only when several features share derived state. Tests run in TestBed "
            "with marble tests for RxJS-heavy logic.\"*"
        ),
    },
    "html-accessibility": {
        "mental_model": (
            "Accessibility = **semantic HTML first**, ARIA second.\n\n"
            "- **Landmarks** — `<header>`, `<nav>`, `<main>`, `<aside>`, `<footer>`.\n"
            "- **Forms** — `<label>` + `<input>` association; `aria-describedby` for errors.\n"
            "- **Keyboard** — Tab order matches visual order; never trap focus.\n"
            "- **Screen readers** — test with NVDA / VoiceOver before shipping.\n"
            "- **WCAG 2.1 AA** is the legal floor in many jurisdictions."
        ),
        "interview_hooks": (
            "- **Use `<button>`, not `<div onClick>`** — saves 90% of accessibility bugs.\n"
            "- **Skip links** — `Skip to content` anchor for keyboard users.\n"
            "- **Focus management** in SPAs — set focus on route change.\n"
            "- **Colour contrast** — 4.5:1 for normal text; check with Lighthouse.\n"
            "- **`aria-live`** for dynamic content updates (toasts, errors)."
        ),
        "speaking_template": (
            "> *\"I'd reach for the semantic element first, layer ARIA only when semantics aren't enough, "
            "test keyboard navigation manually, run axe-core in CI, and verify with a screen reader before "
            "shipping. WCAG 2.1 AA is my baseline.\"*"
        ),
    },
    "css-modern-layouts": {
        "mental_model": (
            "Modern CSS = **Flexbox** for 1D, **Grid** for 2D, **Container Queries** for 2026.\n\n"
            "- **Flexbox** — distribute space along one axis.\n"
            "- **Grid** — `grid-template-columns: repeat(auto-fill, minmax(...))` for responsive.\n"
            "- **Container queries** — components respond to *their own* size, not viewport.\n"
            "- **Custom properties (CSS vars)** — runtime-mutable; design tokens.\n"
            "- **`:has()`** parent selector — landed in all modern browsers."
        ),
        "interview_hooks": (
            "- **`gap`** works in flex now — no more margin hacks.\n"
            "- **CSS layers** (`@layer`) — explicit cascade ordering, no specificity wars.\n"
            "- **Container queries** > media queries for component-driven design.\n"
            "- **Logical properties** — `margin-inline-start` for i18n-friendly RTL.\n"
            "- **Subgrid** — child grids inherit parent tracks."
        ),
        "speaking_template": (
            "> *\"I'd lay this out with CSS Grid for the page, Flexbox inside cards, container queries for "
            "components that need to respond to their own width, custom properties for tokens, and "
            "`@layer` to keep the cascade predictable.\"*"
        ),
    },
    "browser-internals": {
        "mental_model": (
            "Pipeline you should be able to draw:\n\n"
            "**HTML → DOM tree → CSSOM → Render tree → Layout (reflow) → Paint → Composite**.\n\n"
            "- **JS execution** blocks parsing unless `async` / `defer`.\n"
            "- **Critical rendering path** — minimise blocking resources above the fold.\n"
            "- **Event loop** — task queue + microtask queue + render step.\n"
            "- **Storage** — cookies / localStorage / sessionStorage / IndexedDB / Cache API.\n"
            "- **Service workers** for offline + push."
        ),
        "interview_hooks": (
            "- **Reflow vs repaint** — reflow recalculates layout; *expensive*.\n"
            "- **`will-change`** hints to compositor — use sparingly.\n"
            "- **`requestIdleCallback`** for background work; falls back to `setTimeout` in Safari.\n"
            "- **CORS** — preflight `OPTIONS` request for non-simple methods.\n"
            "- **Service worker scope** is path-based; can't hijack outside its scope."
        ),
        "speaking_template": (
            "> *\"I'd minimise CRP blockers (preload key fonts, defer JS), batch DOM mutations to avoid "
            "layout thrash, animate via transform / opacity (compositor-only), and use a service worker "
            "for offline + asset caching.\"*"
        ),
    },
    "web-performance-seo": {
        "mental_model": (
            "Two intersecting concerns:\n\n"
            "- **Performance** — Core Web Vitals: LCP, INP, CLS.\n"
            "- **SEO** — semantic HTML + meta tags + structured data + sitemap.\n\n"
            "Senior signal: tie perf to *user-visible metrics*, not synthetic scores."
        ),
        "interview_hooks": (
            "- **LCP < 2.5s** — image / font / hero element optimisation.\n"
            "- **INP** replaced FID in 2024 — measures interaction *responsiveness*.\n"
            "- **CLS < 0.1** — reserve space for images / ads / late-loaded UI.\n"
            "- **SSR / SSG** for SEO-critical pages; CSR fine for app shells.\n"
            "- **Structured data** — JSON-LD; powers rich snippets."
        ),
        "speaking_template": (
            "> *\"I'd measure with field data (Web Vitals lib) not just lab, optimise LCP via preloading the "
            "hero, fix CLS by reserving space, keep INP low by avoiding long tasks, ship SSR for "
            "SEO-critical routes, and add JSON-LD where rich snippets help.\"*"
        ),
    },
    "frontend-build-tools": {
        "mental_model": (
            "Two generations:\n\n"
            "- **Bundlers** — webpack (config-heavy), Rollup (libraries), Parcel (zero-config).\n"
            "- **Native ESM** — Vite (Rollup for prod, esbuild for dev), Turbopack (Next.js).\n\n"
            "Pick by **dev speed** + **plugin ecosystem** + **prod output quality**."
        ),
        "interview_hooks": (
            "- **Tree-shaking** requires ES modules + side-effect-free code.\n"
            "- **Code splitting** — dynamic `import()` is the universal API.\n"
            "- **Source maps** — different modes (cheap / hidden / inline) for dev vs prod.\n"
            "- **Module Federation** for micro-frontends — sharing chunks at runtime.\n"
            "- **Lockfile** discipline — don't commit `node_modules`, do commit lockfile."
        ),
        "speaking_template": (
            "> *\"I'd default to Vite for new projects (dev speed), webpack for legacy + complex configs, "
            "split chunks via dynamic import, ensure tree-shaking with `sideEffects: false`, and analyse "
            "the bundle before optimising.\"*"
        ),
    },
    "frontend-devops-ssr": {
        "mental_model": (
            "Three render modes — pick per route:\n\n"
            "- **CSR** — fastest TTI for SPAs, worst SEO.\n"
            "- **SSR** — first paint with HTML; HTTP cost per request.\n"
            "- **SSG** — pre-built; cheapest at scale, stale-by-design.\n"
            "- **ISR** — Next.js's incremental static regeneration.\n"
            "- **Edge / streaming SSR** — partial HTML over the wire."
        ),
        "interview_hooks": (
            "- **Hydration mismatch** — server / client rendered different HTML; classic React debug.\n"
            "- **Streaming SSR** in React 18 with `Suspense` — partial reveal.\n"
            "- **CDN caching** for SSG; `s-maxage` + `stale-while-revalidate`.\n"
            "- **Edge runtime** caveats — no Node APIs, smaller libs.\n"
            "- **Image optimisation** — Next/Image, Sharp, CDN-resized."
        ),
        "speaking_template": (
            "> *\"I'd pick CSR for the dashboard (auth-gated), SSR for the marketing pages (SEO + freshness), "
            "SSG for the docs, and put a CDN in front with `stale-while-revalidate`. Hydration mismatch I'd "
            "catch in CI with a strict-mode render comparison.\"*"
        ),
    },
    "auth-flows-frontend": {
        "mental_model": (
            "Frontend auth has three tracks:\n\n"
            "- **Session cookies** — httpOnly + Secure + SameSite=Lax.\n"
            "- **Token-based** — short-lived access tokens, refresh tokens.\n"
            "- **OAuth2 / OIDC** — auth code + PKCE for SPAs.\n\n"
            "**Never store tokens in localStorage** if you can avoid it — XSS-readable."
        ),
        "interview_hooks": (
            "- **PKCE** — proof key for code exchange; mandatory for public SPAs.\n"
            "- **Silent refresh** — iframe-based or refresh-token rotation.\n"
            "- **CSRF + cookies** — `SameSite=Lax` mostly defends; double-submit token if not.\n"
            "- **Logout** — clear the cookie *and* revoke the refresh token.\n"
            "- **Federated identity** — Auth0 / Cognito / Okta abstract a lot, but you still own the redirect handling."
        ),
        "speaking_template": (
            "> *\"I'd use OIDC auth-code + PKCE, store the access token in memory (not localStorage), refresh "
            "via httpOnly cookie, set `SameSite=Lax` for CSRF, and revoke on logout server-side. Federated "
            "via Auth0 keeps the auth surface minimal in our code.\"*"
        ),
    },
    "api-integration": {
        "mental_model": (
            "Frontend ↔ backend integration: pick the right tool per concern.\n\n"
            "- **Fetch / Axios** — low-level HTTP.\n"
            "- **TanStack Query / SWR** — caching, revalidation, optimistic updates.\n"
            "- **Zod / Yup** — runtime contract validation.\n"
            "- **OpenAPI / GraphQL codegen** — typed clients from the contract."
        ),
        "interview_hooks": (
            "- **Retry storms** — exponential backoff + jitter on 5xx; never on 4xx.\n"
            "- **Race conditions** — last-write-wins via TanStack Query's `staleTime` + `cacheTime`.\n"
            "- **Pagination** — cursor for stable, offset for jumpable.\n"
            "- **Streaming responses** — `ReadableStream` + AsyncIterator for chat / LLM UIs.\n"
            "- **Validate at the boundary** — never trust the API blindly, parse with Zod."
        ),
        "speaking_template": (
            "> *\"I'd hit the API via TanStack Query, validate responses with Zod at the boundary, retry "
            "with backoff on transient errors, paginate with cursors, and stream when the payload is large "
            "or progressive.\"*"
        ),
    },
    "realtime-uploads": {
        "mental_model": (
            "Two related but distinct surfaces:\n\n"
            "- **Realtime** — WebSocket, SSE, polling; pick by direction + scale.\n"
            "- **Uploads** — chunked, resumable, progress-aware; signed URLs to S3/GCS.\n\n"
            "**Direct-to-storage** uploads (signed URL) keep your app server out of the byte path."
        ),
        "interview_hooks": (
            "- **WebSocket vs SSE** — WS for bidirectional, SSE for server→client only (cheaper).\n"
            "- **Heartbeats** — proxies kill idle TCP; 30 s pings keep them alive.\n"
            "- **Resumable uploads** — `tus` protocol or multipart S3.\n"
            "- **CORS for uploads** — preflight + signed URL signature includes content-type.\n"
            "- **Backpressure** — slow consumer mustn't crash producer."
        ),
        "speaking_template": (
            "> *\"For realtime I'd pick SSE for one-way (notifications) and WebSocket for chat. Uploads go "
            "direct to object storage via signed URL, chunked + resumable for large files, with progress "
            "events surfaced to the UI.\"*"
        ),
    },
}

# ── Helpers ─────────────────────────────────────────────────────────────────


def _load_index(domain_dir: Path) -> dict[str, dict]:
    idx = json.loads((domain_dir / "_index.json").read_text())
    out: dict[str, dict] = {}
    for m in idx.get("modules", []):
        out[m["moduleSlug"]] = m
    return out


def _topic_oneliner(topic_slug: str) -> str:
    """Polish a topic slug into a friendly bullet line."""
    label = re.sub(r"[-_]", " ", topic_slug).strip().capitalize()
    return label


def _section_topics_overview(intro: str, topics: list[str]) -> str:
    """Section 3 body: derived from `topics[]` — gives module-specific shape."""
    drill_topics = [t for t in topics if t not in ("scenario-based", "scenario_based")]
    if not drill_topics:
        return intro
    lines = ["The interview surface for this module breaks into these focus areas:\n"]
    for t in drill_topics:
        label = _topic_oneliner(t)
        lines.append(f"- **{label}** — drill the named patterns, the failure modes, and the recommended Java / framework idiom.")
    if "scenario-based" in topics or "scenario_based" in topics:
        lines.append(
            "- **Scenario-based** — applied questions tying multiple topics together. "
            "Drill these *last*, after the fundamentals are sharp."
        )
    return "\n".join(lines)


# Generic fallbacks for modules without curated content. Still uses the
# module title + topic list so it stays *module-specific* rather than
# anonymous boilerplate.

def _fallback_mental_model(title: str, topics: list[str]) -> str:
    drill = ", ".join(_topic_oneliner(t) for t in topics[:4]) or title
    return (
        f"For **{title}**, group your knowledge into three buckets and recite each in one sentence:\n\n"
        f"1. **Concepts** — what {title.lower()} *is* and why it exists.\n"
        f"2. **Patterns / APIs** — the named tools and idioms (e.g. {drill}).\n"
        "3. **Trade-offs** — when to use it, when *not* to, and the alternative.\n\n"
        "Senior interviewers reward fluent transitions across these three layers."
    )


def _fallback_interview_hooks(title: str) -> str:
    return (
        f"Common probes interviewers use to test depth on **{title}**:\n\n"
        "- **Failure modes** — what breaks first under load, partial-failure scenarios, and the symptom you'd see in logs.\n"
        "- **Trade-offs** — every choice has a cost; name yours and the alternative explicitly.\n"
        "- **Operational concerns** — observability, deploy, rollback, blast radius.\n"
        "- **Modern best practices vs legacy** — what changed in the last 2-3 years.\n"
        "- **Concrete example** — always have one production-shaped story you can tell."
    )


def _fallback_speaking_template(title: str) -> str:
    return (
        f"> *\"For **{title}**, I'd articulate the goal first (what we're optimising for), pick the "
        "approach because <named trade-off>, and call out the failure mode I'd watch for (<symptom in "
        "logs / metric>). The fallback if it doesn't fit is <alternative>.\"*"
    )


def _build_revision(
    domain_label: str,
    module_slug: str,
    title: str,
    intro: str,
    topics: list[str],
) -> dict:
    curated = CURATED.get(module_slug, {})

    sections = [
        {
            "id": "core",
            "title": "Why this module matters",
            "body": intro.strip(),
        },
        {
            "id": "mental-model",
            "title": "Mental model",
            "body": curated.get("mental_model") or _fallback_mental_model(title, topics),
        },
        {
            "id": "must-know",
            "title": "Must-know concepts",
            "body": _section_topics_overview(intro, topics),
        },
        {
            "id": "interview-hooks",
            "title": "Likely interview hooks",
            "body": curated.get("interview_hooks") or _fallback_interview_hooks(title),
        },
        {
            "id": "speaking-template",
            "title": "Speaking template",
            "body": curated.get("speaking_template") or _fallback_speaking_template(title),
        },
    ]

    return {
        "title": f"{title} — Revision",
        "estimatedMinutes": 12,
        "sections": sections,
    }


def write_revisions_for_domain(domain_dir: Path) -> tuple[int, int]:
    """Return (written, skipped_due_to_reuse)."""
    if not domain_dir.exists():
        return (0, 0)
    index = _load_index(domain_dir)
    written, skipped = 0, 0

    for module_slug, m in index.items():
        module_dir = domain_dir / module_slug
        # Reused modules: revision lives in the source domain — skip.
        if "contentSource" in m:
            skipped += 1
            continue
        if not module_dir.exists():
            continue
        revision = _build_revision(
            domain_label=domain_dir.name,
            module_slug=module_slug,
            title=m.get("title") or _topic_oneliner(module_slug),
            intro=m.get("intro") or "",
            topics=m.get("topics") or [],
        )
        out = module_dir / "_revision.json"
        out.write_text(json.dumps(revision, indent=2, ensure_ascii=False) + "\n")
        written += 1
    return written, skipped


def main() -> None:
    total_w, total_s = 0, 0
    for d in (JBI, JFI):
        w, s = write_revisions_for_domain(d)
        print(f"{d.name}: wrote {w}, skipped (reused) {s}")
        total_w += w
        total_s += s
    print(f"\nTotal: {total_w} _revision.json files written, {total_s} reused (skipped).")


if __name__ == "__main__":
    main()
