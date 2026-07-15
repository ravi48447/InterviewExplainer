# Audit — redis-caching

**Pillar:** P03 Data Layer
**Module:** M14 redis-caching
**Topics present:** 11 of 13 (`caffeine-cache`, `comparisons` empty)
**Questions:** 13 (all written, no stubs)
**Benchmark sources:** Redis documentation (redis.io/docs), "Redis in Action" (Josiah Carlson), Spring Data Redis reference (docs.spring.io/spring-data/redis), Baeldung Redis/Spring Cache series, AWS ElastiCache for Redis docs, Redisson wiki

---

## Biggest finding — module-wide paragraph-wall direct answers

**All 13 direct answers are paragraph walls (64–86 words).** This is the most uniform style problem across any audited module — no variation, which means the content was authored against a pattern that produced long single-block direct answers rather than scannable answers with bold anchors.

For a Quick Answer / 30-second zone, 64–86 words of flat prose with zero bold anchors is the opposite of what top sources do. Baeldung, Redis docs, and Spring reference all open with a bolded term or key phrase before going into detail.

This is a mechanical module-wide fix — shorten each direct answer to 35–50 words, bold the Redis primitive or concept anchor (`**Redis**`, `**RDB**`, `**AOF**`, `**cluster**`, `**sentinel**`, `**cache-aside**`, `**write-through**`, `**stampede**`, `**Redisson**`), and use at most 2 sentences.

---

## Biggest finding — analogy gap in a highly analogy-friendly domain

**11 of 13 Qs lack analogies.** Caching is one of the most analogy-rich domains in software:

- Cache-aside = "check the fridge first, go to the grocery store if empty"
- Write-through = "write to the notebook and the cloud at the same time"
- Write-behind = "jot it on the notepad, sync to the ledger later"
- RDB = "snapshot photo of memory"; AOF = "diary of every command"
- Cluster = "library with books split across branches"; Sentinel = "night watchman"
- Stampede = "everyone lunch-rushing the same taco truck when the line opens"
- Distributed lock = "one bathroom key hanging on the wall"

Only Q1 redis-data-structures and Q2 redis-cluster-vs-sentinel have detected analogies.

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Opening bolds the Redis concept (`**Redis**`, `**AOF**`, `**RDB**`, `**cluster**`, `**write-through**`) | **Failing** — 13 of 13 direct answers have zero bold anchors |
| Concise direct answers (2–3 sentences, max 40–50 words) | **Failing** — 13 of 13 are 64–86 word paragraph walls |
| Code-heavy Zone 3 with Redis CLI commands (`SET`, `GET`, `EXPIRE`, `HSET`, `ZADD`) alongside Spring Data Redis examples | **Matching** — 11 of 13 Qs have 2–7 code blocks (strong) |
| Caching questions explicitly cite hit/miss ratios, TTL numbers, memory metrics | Mixed — some Qs reference these, most don't |
| Analogy always used for cache patterns | **Failing** — 11 of 13 missing analogies |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | MODULE-WIDE PARAGRAPH WALLS | **CRITICAL** | 13 of 13 direct answers are paragraph walls (64–86w, 0 bold anchors). This is not a per-question issue — it's a uniform content-style problem that makes Zone 1 fail its purpose across the entire module |
| S2 | EMPTY CAFFEINE-CACHE TOPIC | **MAJOR** | Module is named "redis-caching" but the topic `caffeine-cache` (in-memory local cache often layered with Redis) is empty. Either rename module to "redis-and-in-memory-caching" + author Caffeine content, or drop the topic |
| S3 | EMPTY COMPARISONS TOPIC | **MAJOR** | `comparisons` topic empty. 2 comparison Qs (`redis-vs-memcached`, `redis-pubsub-vs-kafka`) are filed under `scenario-based` instead — archetype mismatch |
| S4 | ANALOGY GAP MODULE-WIDE | **MAJOR** | 11 of 13 missing analogies in the most analogy-friendly domain in the project |
| S5 | 2 CODE-MISSING IN COMPARISONS | MODERATE | Q1 redis-vs-memcached (387w, 0 code) — a comparison without side-by-side operational commands |
| S6 | THIN TOPIC COVERAGE | MODERATE | 11 topics × ~1 Q each. Missing obvious depth: streams (XADD/XREAD), geospatial, HyperLogLog, Redis Modules (RediSearch, RedisJSON), Lua scripting |

---

## Per-question issues

### `redis-data-structures`

| Q | Issue | Severity |
|---|---|---|
| **Q1** redis-data-structures-overview | DA wall (64w), 685w / 6 code / analogy (good code coverage). Overview Q with 6 code blocks = data structures shown — well-shaped except DA. Analogy detected but `zone3_no_analogy` code says Zone 3 lacks analogy — mixed | MINOR + DA wall |

### `redis-advanced`

| Q | Issue | Severity |
|---|---|---|
| **Q1** rate-limiting-redis | DA wall (70w), 473w / 7 code / no analogy. Strong code coverage (token bucket + fixed window + sliding window likely) | MINOR + DA wall |
| **Q2** redis-cluster-vs-sentinel | DA wall (81w), 500w / 3 code / analogy. **Overlaps** with `redis-persistence` and `distributed-locking` (HA theme) | MINOR + DA wall |

### `redis-persistence`

| Q | Issue | Severity |
|---|---|---|
| **Q1** redis-persistence-rdb-vs-aof | DA wall (73w), 447w / 2 code / no analogy. Classic interview Q; should have AOF config snippet + RDB snapshot command + analogy | MINOR + DA wall |

### `spring-data-redis`

| Q | Issue | Severity |
|---|---|---|
| **Q1** spring-cache-abstraction-redis | DA wall (75w), 423w / 5 code / no analogy. `@Cacheable` `@CacheEvict` `@CachePut` — this Q is essentially the "how does Spring Cache work with Redis" standard | MINOR + DA wall |
| **Q2** spring-session-redis | DA wall (75w), 394w / 4 code. `@EnableRedisHttpSession` + session-id cookie flow | MINOR + DA wall |

### `cache-patterns`

| Q | Issue | Severity |
|---|---|---|
| **Q1** cache-stampede-thundering-herd | DA wall (69w), 611w / 3 code / no analogy. **Prime analogy candidate** (taco truck / lunch rush). Solutions: request coalescing, probabilistic early expiration, locks | MINOR + DA wall |

### `caching-strategies`

| Q | Issue | Severity |
|---|---|---|
| **Q1** cache-strategies-comparison | DA wall (86w — worst), 475w / 2 code / no analogy. Cache-aside vs write-through vs write-behind vs read-through — pure analogy topic + should have 4 diagram/code samples, not 2 | MODERATE + DA wall |

### `caffeine-cache` (0 Qs) — **empty topic, module-naming gap**

### `distributed-caching`

| Q | Issue | Severity |
|---|---|---|
| **Q1** distributed-locking-redisson | DA wall (83w), 608w / 5 code / no analogy. Redisson `RLock`, `RReadWriteLock`, watchdog mechanism | MINOR + DA wall |

### `cache-invalidation`

| Q | Issue | Severity |
|---|---|---|
| **Q1** cache-invalidation-strategies | DA wall (71w), 528w / 4 code / no analogy. TTL-based, event-driven, version-stamping | MINOR + DA wall |

### `performance-optimization`

| Q | Issue | Severity |
|---|---|---|
| **Q1** redis-memory-optimization | DA wall (80w), 630w / 3 code / no analogy. `maxmemory`, eviction policies (allkeys-lru, volatile-lru, allkeys-lfu), `OBJECT ENCODING` | MINOR + DA wall |

### `scenario-based` (miscategorized)

| Q | Issue | Severity |
|---|---|---|
| **Q1** redis-vs-memcached | DA wall (72w), 387w / **0 code** / analogy. **Archetype mismatch** — this is a comparison Q, belongs in `comparisons` topic. Also a comparison without code/benchmark/feature-matrix is weak | **MAJOR** + DA wall + miscategorized |
| **Q2** redis-pubsub-vs-kafka | DA wall (81w), 535w / 3 code / analogy. Same miscategorization — comparison Q in scenario-based | MINOR + DA wall + miscategorized |

### `comparisons` (0 Qs) — empty, should absorb Q1/Q2 from scenario-based

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **1** | S1 module-wide paragraph walls |
| **MAJOR** | **4** | S2 empty caffeine-cache, S3 empty comparisons, S4 module-wide analogy gap, Q1 redis-vs-memcached (no code + miscategorized) |
| **MODERATE** | **3** | Q1 cache-strategies-comparison (thin code), S5 code-missing in comparisons, S6 thin topic coverage |
| **MINOR** | **13** | All 13 Qs have the DA-wall issue captured in S1 (not double-counted as individual MAJOR) |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone1_direct_answer_paragraph_wall` × 13 (100%)
- `zone1_direct_answer_no_bold_anchors` × 13 (100%)
- `zone3_no_analogy` × 11
- `zone3_no_code_examples` × 2

---

## Suggested fix order

1. **Module-wide direct-answer rewrite pass** (S1) — 13 mechanical edits: shorten each direct answer to 35–50 words, add 2–4 bold anchors, break into 2 sentences. This single pass takes the module from failing to solid on Zone 1.
2. **Move `redis-vs-memcached` + `redis-pubsub-vs-kafka` to `comparisons` topic** — resolves S3 partially and fixes archetype mismatch.
3. **Fill comparisons topic** with 1–2 more: `redis-vs-hazelcast`, `redis-vs-memcached` (moved), `write-through-vs-write-behind-vs-cache-aside`.
4. **Decide module scope for caffeine-cache** (S2) — either author 2–3 Qs (Caffeine + Spring Cache abstraction, L1/L2 caching with Caffeine + Redis, Caffeine eviction policies) or drop the topic from `_index.json`.
5. **Add code to Q1 redis-vs-memcached** — side-by-side CLI for common operations + a benchmark/feature matrix.
6. **Add analogies to 11 questions** — mechanical pass with the domain-specific analogies listed above.
7. **Consider depth expansion**: Redis streams (XADD/XREAD), Lua scripting, geospatial, HyperLogLog are notable absences for an "intermediate" Redis module.
