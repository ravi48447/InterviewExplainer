# Audit — system-design

**Pillar:** P06 Distributed Systems & Architecture
**Module:** M20 system-design
**Topics present:** 10 (of 12 — `microservices-design` and `comparisons` are empty)
**Questions:** 21 (all written, no stubs)
**Benchmark sources:** Alex Xu "System Design Interview" Vols 1–2, Donne Martin's system-design-primer, Hussein Nasser videos, Educative.io "Grokking the System Design Interview", designing-data-intensive-applications (Kleppmann), ByteByteGo

---

## Module is content-strong, structurally thin

21 written questions with Zone 3 depth averaging **~690w** — one of the more substantive modules in the project. No stubs, no CRITICALs, no broken schemas. The issues are:

1. **Most topics have only 1 question** (8 of 10 topics) — limiting coverage within natural groupings
2. **System-design content is heavy on concepts, thin on code/pseudocode** where it should show implementation
3. **Two foundational topics empty:** `microservices-design` and `comparisons`

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Capacity-planning answers always show the math: "100M DAU × 10 req/sec = 10⁹ req/day / 86400 ≈ 12K QPS" | Q1 capacity-planning is 812w / **0 code**. Math exists in prose but isn't code-block-formatted. Should be |
| Consistent hashing always shown with ring diagram + pseudocode for bucket lookup | Q1 consistent-hashing 795w / **0 code** / analogy present. Missing the ring visualization |
| Circuit breaker always shows the state machine + Resilience4j/Hystrix code | Q1 circuit-breaker has 1 code — OK |
| Rate limiter answers always show token-bucket or sliding-window implementation in code | Scenario Q5 rate-limiter has 2 code blocks — good |
| CAP theorem answers always include the 3-choices diagram + real-world mapping (Cassandra=AP, Spanner=CP) | Q1 CAP 777w / **0 code** — acceptable (CAP is diagram-only in most sources) but missing the "pick 2 in failure mode" triangle |
| Opening bolds the pattern (`**circuit breaker**`, `**consistent hashing**`, `**load balancer**`, `**CDN**`) | **Failing** — 0 of 21 direct answers have bold anchors |
| Analogies are currency (circuit breaker = "fuse in electrical panel", rate limiter = "turnstile", CDN = "satellite post offices") | Only 5 of 21 have detected analogies |
| System-design speakables in interview prep are narrative-prose | **Mismatch** — all 21 use bulleted-subheaders. For system-design this is unusual; architecture-patterns module correctly uses prose. Consider converting |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | THIN TOPIC COVERAGE | **MAJOR** | 8 of 10 topics have 1 question each. `scalability`, `cap-theorem`, `capacity-planning`, `database-design-at-scale`, `load-balancing`, `ecs-and-fargate`, `s3-storage`, `aws-messaging`, `serverless` — all single-Q topics. Either merge-up into broader topics or expand each to 2–3 Qs |
| S2 | EMPTY TOPICS | **MAJOR** | `microservices-design` (0 Qs) and `comparisons` (0 Qs). microservices-design is a major gap because M19 architecture-patterns and M16 microservices both cover adjacent content — this topic should own the system-design-level microservices decisions (service granularity, data decomposition, inter-service patterns) |
| S3 | SPEAKABLE FORMAT | **MODERATE** | All 21 speakables are bulleted-subheaders. For system-design archetype, top sources use narrative prose. Architecture-patterns module (M19) uses prose correctly. Decide on module-wide format |
| S4 | CODE-MISSING IN IMPL QUESTIONS | **MAJOR** | 11 of 21 Zone 3s have zero code. Some are acceptable (CAP, consistent hashing can be diagram-only) but 4 "design-X-in-Java" scenario questions have no Java code — that's archetype-fail |
| S5 | MODULE-WIDE ZONE 1 | MODERATE | 21 of 21 direct answers have zero bold anchors; 7 paragraph walls |
| S6 | ANALOGY UNDER-USE | MODERATE | Only 5 of 21 have detected analogies. System design is textbook analogy territory |
| S7 | CROSS-MODULE OVERLAPS | MINOR | `api-gateway-pattern` here overlaps with M16 microservices, `event-sourcing-audit-log` overlaps with M17 and M19, `circuit-breaker-pattern` overlaps with M16. Decide scope split — system-design owns the pattern-level teaching; others own implementation/runtime aspects |

---

## Per-question issues

### `design-fundamentals` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** consistent-hashing | Paragraph wall (68w). 795w / **0 code** / analogy. Missing ring diagram + bucket-lookup pseudocode | **MAJOR** |
| **Q2** api-gateway-pattern | 713w / **0 code** / no analogy. Cross-module overlap with M16. A gateway Q without a routing/rewrite config snippet is thin | **MAJOR** |

### `scalability` (1 Q) — thin topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** horizontal-vs-vertical-scaling | 887w / **0 code** / no analogy. A side-by-side comparison with strong word count but missing comparison-artifact (diagram / cost math) | MODERATE |

**Topic gap:** add `stateless-vs-stateful-services`, `sharding-strategies`, `celebrity-problem-hotkey-mitigation`.

### `high-availability` (2 Qs) — well-shaped

| Q | Issue | Severity |
|---|---|---|
| **Q1** circuit-breaker-pattern | Paragraph wall (62w). 739w / 1 code / analogy — good | MINOR |
| **Q2** design-retry-exponential-backoff-java | 447w / 2 code / no analogy. Should include a jitter-aware exponential backoff snippet | MINOR |

### `cap-theorem` (1 Q) — thin topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** cap-theorem-trade-offs | Paragraph wall (72w). 777w / 0 code / no analogy. CAP is acceptable without code. But **PACELC extension** (Daniel Abadi) is standard in 2024+ interviews — latency-consistency tradeoff under normal operation. Missing | MODERATE |

**Topic gap:** add `pacelc-theorem`, `bases-vs-acid`.

### `capacity-planning` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** back-of-envelope-estimation | Paragraph wall (61w). 812w / **0 code** / no analogy. **Capacity planning is the one topic where numbers are essential.** The math exists in prose but not as a code-block. Format into `# QPS calculation` code blocks with the arithmetic | **MAJOR** |

**Topic gap:** add `storage-estimation-write-read-ratio`, `bandwidth-estimation`, `memory-cache-sizing`.

### `database-design-at-scale` (1 Q) — thin topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** database-replication-strategies | 843w / 1 code / no analogy — good | MINOR |

**Topic gap:** add `sharding-strategies-at-scale`, `consistent-hashing-in-database-sharding`, `multi-leader-vs-leaderless-replication`. Cross-module overlap with M12 sql-databases.

### `caching-at-scale` (4 Qs) — substantive topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-distributed-cache | 1011w / 2 code / no analogy — longest Zone 3 in module, good | MINOR |
| **Q2** cdn-edge-caching | 600w / **0 code** / analogy. Edge caching is concept-heavy, 0 code is acceptable but could show a CloudFront/Varnish config | MODERATE |
| **Q3** design-thread-safe-lru-cache-java | 629w / 1 code / no analogy. LRU in Java — needs full `LinkedHashMap` implementation or deque+map | MINOR |
| **Q4** design-in-memory-kv-store-ttl-java | 555w / **0 code** / no analogy. **A "design-in-java" question with zero Java code is archetype-fail** | **MAJOR** |

### `load-balancing` (1 Q) — thin topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** load-balancing-strategies | 768w / 1 code / no analogy — good | MINOR |

**Topic gap:** add `l4-vs-l7-load-balancers`, `global-load-balancing-geo-dns`, `health-check-patterns`.

### `event-driven-design` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** message-queues-vs-event-streams | Paragraph wall (65w). 668w / 2 code / analogy — good | MINOR |
| **Q2** design-event-sourcing-audit-log | 569w / 2 code / no analogy. Cross-module overlap with M17 + M19 | MINOR |
| **Q3** design-pubsub-event-bus-java | 573w / 1 code / analogy — good | MINOR |

### `microservices-design` (0 Qs) — **empty topic**

Suggested content:
- `microservices-service-granularity` — right-sizing services
- `service-to-service-communication-synchronous-vs-asynchronous`
- `data-decomposition-across-services` — how to split a shared DB
- `microservices-deployment-patterns` — sidecar, ambassador, adapter

### `scenario-based` (5 Qs) — scenario topic

| Q | Issue | Severity |
|---|---|---|
| **Q1** design-job-queue-system | 667w / 2 code / analogy — good | MINOR |
| **Q2** design-read-write-separation-cqrs | 952w / **0 code** / no analogy. A CQRS design question without at least a read-model projector code sketch | **MAJOR** |
| **Q3** design-task-scheduler-job-queue-java | 473w / 1 code / analogy — decent but Zone 3 is the thinnest scenario |  MINOR |
| **Q4** design-connection-pool-manager-java | 664w / **0 code** / no analogy. **Design-in-Java question with 0 Java code** — must show borrow/return semantics + the wait queue | **MAJOR** |
| **Q5** design-rate-limiter-component-java | 493w / 2 code / no analogy — token bucket implementation. Good | MINOR |

### `comparisons` (0 Qs) — **empty topic**

Move candidates: `horizontal-vs-vertical-scaling`, `message-queues-vs-event-streams`. Add new: `sql-vs-nosql-at-scale`, `consistency-models-comparison` (strong vs eventual vs causal vs linearizable).

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **7** | S1 thin topics, S2 empty topics, S4 code-missing in impl Qs (Q1 consistent-hashing, Q2 api-gateway, Q1 capacity-planning, Q4 kv-store, Q2 CQRS scenario, Q4 connection-pool) |
| **MODERATE** | **7** | S3 format, S5 bold, S6 analogy, Q1 horizontal-vs-vertical, Q1 CAP/PACELC, Q2 CDN, Q1 circuit-breaker wall |
| **MINOR** | **12** | Remaining well-shaped Qs needing polish |
| **CLEAN** | **0** | |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 21
- `zone3_no_code_examples` × 11
- `zone3_no_analogy` × 16
- `zone1_direct_answer_paragraph_wall` × 7

---

## Suggested fix order

1. **Author `microservices-design` topic** — the highest-ROI content gap. 4 questions minimum.
2. **Fix the 4 "design-in-Java" scenario/cache questions that have no Java code** — Q4 caching-at-scale (kv-store), Q4 scenario (connection-pool), Q2 scenario (CQRS), Q3 caching-at-scale (LRU expand). These are archetype-fails.
3. **Format Q1 capacity-planning math into code blocks** — mechanical fix, large readability win.
4. **Add PACELC** to CAP theorem Q (or as a new Q).
5. **Decide speakable format** module-wide (bulleted-subheaders vs prose).
6. **Expand thin topics** — scalability, database-design-at-scale, load-balancing to 2–3 Qs each.
7. **Author `comparisons` topic**.
8. **Module-wide bold-anchor + analogy + paragraph-wall pass** — once content is settled.
