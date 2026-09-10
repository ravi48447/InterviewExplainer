# Audit — microservices

**Pillar:** P04 Web & Distributed
**Module:** M16 microservices
**Topics present:** 13 (of 17 — `resilience-patterns`, `contract-testing`, `scenario-based`, `comparisons` are empty)
**Questions:** 18 (all written, no stubs)
**Benchmark sources:** Chris Richardson "Microservices Patterns", Sam Newman "Building Microservices" (2nd ed), Spring Cloud reference docs, Resilience4j docs, Baeldung Spring Cloud series, Martin Fowler microservices articles

---

## Module is content-strong, structurally clean — but massive cross-module overlap

One of the better-authored modules in the project:

- 18 written questions, no stubs
- **2 CLEAN questions** (circuit-breaker-resilience4j, saga-pattern-distributed-transactions) — tied with git-build-tools for most CLEAN Qs in any audited module
- Zone 3 depth averages ~740w — strong
- Code coverage is good — most Qs have 2–5 code blocks
- Only 1 auto-detected overlap in the module

**But cross-module scope is a real problem**: the module shares heavy content with M19 architecture-patterns and M20 system-design:

| Concept | M16 microservices | M19 architecture-patterns | M20 system-design |
|---|---|---|---|
| Monolith vs microservices | Q1 `microservices-vs-monolith-when-to-split` (673w) | Q1 `monolith-vs-microservices-vs-modular-monolith` (617w) | — |
| Database per service | Q1 `database-per-microservice-patterns` (648w) | Q2 `shared-database-vs-database-per-service` (908w) | — |
| API gateway | Q1 `api-gateway-spring-cloud-gateway` (736w) | — | Q2 `api-gateway-pattern` (713w) |
| Circuit breaker | Q1 + Q2 (2 Qs) | — | Q1 `circuit-breaker-pattern` (739w) |
| Saga | Q1 `saga-pattern-distributed-transactions` (767w) | — | — (event-driven design Q1 tangentially) |
| Strangler fig | Q1 `strangler-fig-pattern-monolith-migration` (832w) | Q3 `strangler-fig-pattern-migration` (927w) |

**4 cross-module duplicate concepts.** Needs a scope-split decision: does M16 own the Spring-Cloud implementation angle and M19 own the pattern theory? Or does one module own the full lifecycle and others cross-link?

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Spring Cloud specifics shown with annotation + properties (`@EnableEurekaClient`, `spring.cloud.gateway.routes[0].id`) | **Matching** — most Qs have 2–5 code blocks |
| Opening bolds the pattern or component (`**Eureka**`, `**circuit breaker**`, `**sidecar**`, `**API gateway**`) | **Failing** — 0 of 18 direct answers have bold anchors |
| Analogies common (circuit breaker = "fuse", saga = "conductor coordinating an orchestra", sidecar = "translator walking next to you") | Only 5 of 18 have detected analogies |
| Resilience pattern questions include the state diagram | Q1 circuit-breaker has 4 code + analogy — matching |
| Service mesh / sidecar content references Istio/Linkerd | Q1 sidecar-pattern-service-mesh has 923w — good depth |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | CROSS-MODULE OVERLAPS | **MAJOR** | 4 pattern concepts covered here AND in M19/M20. Needs explicit scope split decision before any edits |
| S2 | INTRA-MODULE OVERLAP | **MAJOR** | circuit-breaker topic has 2 Qs: `circuit-breaker-resilience4j` (Q1, 947w) and `resilience4j-circuit-breaker-spring-cloud` (Q2, 828w) — Jaccard 0.6 auto-detected. Very similar scope |
| S3 | EMPTY TOPICS | **MAJOR** | 4 empty topics: `resilience-patterns` (general patterns beyond circuit-breaker — retry, bulkhead, timeout, rate-limit), `contract-testing` (Spring Cloud Contract / Pact), `scenario-based`, `comparisons` |
| S4 | SPEAKABLE FORMAT MIXED WITHIN TOPIC | **MODERATE** | api-gateway topic: Q1 uses bulleted-subheaders, Q2 uses prose. Same inconsistency across circuit-breaker, communication-patterns, config-management. Module-wide: 9 prose + 9 bulleted |
| S5 | THIN TOPICS | **MODERATE** | Most topics are 1-Q: fundamentals, service-design, service-discovery, load-balancing, feign-client, service-mesh, saga-pattern, migration-strategies. 8 of 13 topics single-Q |
| S6 | MODULE-WIDE ZONE 1 | MODERATE | 16 of 18 direct answers have 0 bold anchors (2 CLEAN pass by chance) |
| S7 | ANALOGY GAP | MINOR | 13 of 18 missing analogies |

---

## Per-question issues

### `fundamentals` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** microservices-vs-monolith-when-to-split | 673w / **0 code** / no analogy. A decision question without a decision framework artifact (code comment / checklist / team-size-vs-service-count chart). **Overlaps with M19 Q1** | **MAJOR** (overlap + no code) |

### `service-design` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** database-per-microservice-patterns | 648w / 3 code / no analogy. **Overlaps with M19 Q2 `shared-database-vs-database-per-service`** | MINOR + OVERLAP |

### `api-gateway` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** api-gateway-spring-cloud-gateway | 736w / 5 code / no analogy. **Overlaps with M20 `api-gateway-pattern`** — decide: M16 owns Spring Cloud Gateway impl, M20 owns the pattern theory | MINOR + OVERLAP |
| **Q2** spring-cloud-gateway-routing-filters | 768w / 2 code / analogy. Prose speakable (format mismatch with Q1) | MINOR + FORMAT |

### `service-discovery` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** eureka-service-discovery-vs-consul | 754w / **0 code** / no analogy. Comparison without showing Eureka `@EnableEurekaClient` vs Consul registration config | **MAJOR** |

### `circuit-breaker` (2 Qs) — **intra-module overlap**

| Q | Issue | Severity |
|---|---|---|
| **Q1** circuit-breaker-resilience4j | 947w / 4 code / analogy — **CLEAN**. Longest Zone 3 in module | CLEAN |
| **Q2** resilience4j-circuit-breaker-spring-cloud | 828w / 3 code / no analogy. **Overlaps 0.6 with Q1**. Needs distinct scope — Q1 covers circuit breaker pattern + Resilience4j standalone; Q2 should focus on Spring-Cloud-Gateway-specific integration | MINOR + OVERLAP |

### `load-balancing` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** spring-cloud-loadbalancer-client-side | 770w / 1 code / no analogy. Prose speakable | MINOR |

### `feign-client` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** feign-client-vs-resttemplate-vs-webclient | 567w / 1 code / no analogy. 3-way comparison — should show each client in code | MINOR |

### `config-management` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** spring-cloud-config-server-centralized-configuration | 828w / 2 code / no analogy | MINOR |
| **Q2** spring-cloud-config-profiles-environment-specific-configuration | 693w / **0 code** / no analogy. Config profiles without showing the Git backend structure (`myapp-dev.yml`, `myapp-prod.yml`) | **MAJOR** |

### `distributed-tracing` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** distributed-tracing-correlation-id | 788w / 4 code / no analogy | MINOR |
| **Q2** distributed-tracing-micrometer-zipkin | 796w / 4 code / no analogy. Cross-module overlap with M31 observability | MINOR + OVERLAP |

### `resilience-patterns` (0 Qs) — **empty topic**

Suggested content: `retry-with-backoff-resilience4j`, `bulkhead-pattern-resilience4j`, `rate-limiter-resilience4j`, `timeout-limiter-resilience4j`, `combining-resilience-patterns-order`.

### `communication-patterns` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** rest-vs-grpc-vs-messaging-interservice | 697w / **0 code** / analogy. 3-way comparison without showing each client call | **MAJOR** |
| **Q2** spring-cloud-stream-messaging-abstraction | 774w / 2 code / analogy | MINOR |

### `service-mesh` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** sidecar-pattern-service-mesh | 923w / 2 code / no analogy. Analogy ("translator walking alongside you") | MINOR |

### `contract-testing` (0 Qs) — **empty topic**

Suggested content: `spring-cloud-contract-consumer-driven-contracts`, `pact-vs-spring-cloud-contract`, `contract-testing-vs-integration-testing`.

### `saga-pattern` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** saga-pattern-distributed-transactions | 767w / 3 code / analogy — **CLEAN**. Cross-module overlap with M17 scenario Q1 `saga-pattern-distributed-transactions-choreography` — decide split (M16 owns orchestration vs choreography both; M17 covers implementation via Kafka) | CLEAN + OVERLAP |

### `migration-strategies` (1 Q) — thin

| Q | Issue | Severity |
|---|---|---|
| **Q1** strangler-fig-pattern-monolith-migration | 832w / 3 code / no analogy. **Overlaps with M19 Q3 `strangler-fig-pattern-migration`** | MINOR + OVERLAP |

### `scenario-based` (0 Qs) — empty

Suggested: `design-microservices-for-ecommerce-checkout`, `debugging-slow-microservice-calls`, `tracing-a-request-across-10-services`.

### `comparisons` (0 Qs) — empty

Move candidates: `rest-vs-grpc-vs-messaging-interservice`, `eureka-service-discovery-vs-consul`, `feign-client-vs-resttemplate-vs-webclient`. Add: `monolith-modular-monolith-microservices` (if not in M19).

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **7** | S1 cross-module overlaps (pattern), S2 intra-module overlap, S3 empty topics, Q1 fundamentals (overlap + no code), Q1 service-discovery, Q2 config-profiles, Q1 rest-vs-grpc-vs-messaging |
| **MODERATE** | **5** | S4 format mix, S5 thin topics, S6 bold, Q1/Q2 overlaps (tracked above) |
| **MINOR** | **9** | Well-shaped Qs needing polish + overlap resolution |
| **CLEAN** | **2** | Q1 circuit-breaker-resilience4j, Q1 saga-pattern — best-shaped Qs in the module |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 16
- `zone3_no_analogy` × 13
- `zone3_no_code_examples` × 5

---

## Suggested fix order

1. **Cross-module scope decision FIRST** (S1). Meeting-style: decide once whether M16 owns Spring Cloud implementation vs M19 owns pattern theory vs M20 owns system-design angle. Document the decision in `content/_audits/README.md` as a cross-module rule.
2. **Resolve circuit-breaker intra-module overlap** (S2). Keep Q1 as pattern + Resilience4j standalone; repurpose Q2 to focus on Spring Cloud Gateway + Circuit Breaker filter integration (distinct angle).
3. **Author `resilience-patterns` topic** — highest-interview-value gap (retry/bulkhead/ratelimiter/timeout Resilience4j patterns).
4. **Author `contract-testing` topic** — Spring Cloud Contract is a standard modern interview topic.
5. **Add code to the 4 code-missing content-critical Qs** — Q1 fundamentals, Q1 eureka-vs-consul, Q2 config-profiles, Q1 rest-vs-grpc-vs-messaging.
6. **Unify speakable format** — pick bulleted-subheaders or prose module-wide.
7. **Module-wide bold-anchor pass** — 16 mechanical fixes.
8. **Decide thin-topic consolidation** (S5) — merge service-discovery + load-balancing + feign-client into a combined "service-communication" or leave as-is.
