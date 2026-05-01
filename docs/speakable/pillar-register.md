# Pillar register sheet

> Mirrors `SPEAKABLE-PLAN.md` §4 (the per-pillar register riders) and reads `content/java-backend-intermediate/_index.json` for the pillar → module mapping.
>
> **One open data inconsistency** flagged in `HUMAN-REVIEW-QUEUE.md`: in `_index.json`, `postgresql` (M12b) carries `pillar: P06` but `pillarName: Data & Persistence` (P03). This sheet treats it as **P03 by content**; the human review queue records the discrepancy for resolution.

---

## Summary table

| Pillar | Modules | Dominant archetypes | Default audience | Key voice note |
|---|---:|---|---|---|
| P01 Java Language & Core | 6 | A, B, C, E | beginner | Tiny code shape mandatory; mention JVM/runtime or API contract once. |
| P02 Spring Ecosystem | 6 | A, C, D | beginner | Trace order-of-events (lifecycle, filter chain, transaction boundary). |
| P03 Data & Persistence | 4 (incl. postgresql) | A, B, C, D | beginner | Surface a trade-off explicitly — consistency, availability, cost, schema. |
| P04 APIs, Microservices & Messaging | 3 | A, C, D, E | beginner | Name the contract / boundary / failure mode. |
| P05 Architecture & Design | 5 | E, A | familiar | Decision-first — open with the call being made, not the definition. |
| P06 System Design | 3 | F | familiar | Phased walkthrough only — beats are phases, not paragraphs. |
| P07 Security | 1 | A, C, D | beginner | Threat-model framing — attacker, asset, vulnerability, mitigation. |
| P08 Testing & Quality | 1 | A, B | beginner | Pyramid + risk thinking — what level, what it catches, what it can't. |
| P09 DevOps | 7 | A, D | beginner | Sequence + blast radius — pipeline order, rollback, failure cost. |
| P10 Cloud | 4 | B, E, A | beginner | Service-shopping voice — choice, why this service, cost dimension. |
| P11 Production | 2 | D, C, A | familiar | War-room voice — calm, evidence-driven, named tools. |
| P12 Interview Readiness | 2 | G | beginner | First-person warmth; STAR rigour; the reflection beat is the value. |

> Total: 44 modules across 12 pillars (matches `_index.json` `totalModules: 44`).

---

## P01 — Java Language & Core

- **Modules in pillar:** `core-java`, `java-oop`, `java-collections`, `java-streams`, `java-concurrency`, `jvm-internals`.
- **Topic must-includes:** thread basics & lifecycle; Thread vs Runnable vs Callable; Executor framework; synchronization & locks; volatile vs atomic; HashMap internals; ArrayList vs LinkedList; HashSet & TreeMap; equals & hashCode contract; Comparable vs Comparator; generics & type erasure; checked vs unchecked exceptions; try-with-resources; String immutability & String pool; `==` vs `equals`; OOP four pillars; abstract class vs interface; inner classes; static & final keywords; garbage collection generations; JIT compilation; reflection & annotations.
- **Voice tweaks:** beginner-friendly; every answer must drop **one tiny code shape** (a method signature, a single line, a small block) so the listener can anchor visually; mention the JVM or the API contract at least once so the depth is visible.
- **Pillar-specific standard examples:**
  - `Dog extends Animal` (inheritance)
  - `BankAccount.withdraw()` (encapsulation)
  - `List<String> names = new ArrayList<>()` (abstraction in one line)
  - `synchronized` block on a private lock object (concurrency)
  - `HashMap.put("key", value)` (collections)
- **Common archetypes:** A (concept-heavy), B (every `comparisons/` topic), C (`collections-internals`, `jvm-internals`), E (`java-oop / oop-principles` interface-vs-abstract calls).

---

## P02 — Spring Ecosystem

- **Modules in pillar:** `spring-core`, `spring-boot`, `spring-data-jpa`, `spring-security`, `spring-webflux`, `spring-batch`.
- **Topic must-includes:** IoC & DI; bean lifecycle; bean scopes; `@Component` / `@Service` / `@Repository` / `@Controller`; Spring AOP basics; `@Transactional` propagation & isolation; Spring Boot auto-configuration; `@RestController` & `@ResponseBody`; exception handling (`@ControllerAdvice`); profiles & properties; Actuator endpoints; SecurityFilterChain; persistence context; entity lifecycle.
- **Voice tweaks:** beginner-friendly; every answer must **trace the order of events** at least once — bean lifecycle ("instantiate → populate → BeanPostProcessor → init → ready"), filter chain order, transaction boundary open/commit/rollback. Spring's value is the timeline.
- **Pillar-specific standard examples:**
  - Constructor injection with `@RequiredArgsConstructor` + `final` fields
  - `@Transactional` rolling back on `RuntimeException` but not checked
  - `@RestController` + `@GetMapping("/users/{id}")`
  - Bean lifecycle: `@PostConstruct` → ready → `@PreDestroy`
  - `application.yml` with profiles (`dev`, `prod`)
- **Common archetypes:** A (every "what is" Spring concept), C (every "how does X work internally" Spring topic), D (`spring-boot / troubleshooting`).

---

## P03 — Data & Persistence

- **Modules in pillar:** `sql-databases`, `postgresql` (currently mistagged as P06 in `_index.json` — see review queue), `nosql-mongodb`, `redis-caching`.
- **Topic must-includes:** ACID properties; SQL transaction isolation levels; JPA cascades; lazy vs eager loading; N+1 query problem; indexing & EXPLAIN; connection pooling; optimistic vs pessimistic locking; document model trade-offs; Redis data structures; eviction policies.
- **Voice tweaks:** beginner-friendly; every answer must **surface a trade-off explicitly** — usually consistency vs availability, normalisation vs read speed, or memory vs durability. Naming the trade-off is half the answer.
- **Pillar-specific standard examples:**
  - `BEGIN ... SELECT ... UPDATE ... COMMIT` for transactions
  - `EXPLAIN ANALYZE` on a slow query
  - `db.users.find({status: "active"})` for MongoDB
  - `SET key value EX 60` for a Redis TTL
  - `@Version` field on a JPA entity for optimistic locking
- **Common archetypes:** A (fundamentals), B (lots of `comparisons/` topics — JOIN types, isolation levels, MongoDB vs SQL), C (`hibernate-internals`, MongoDB sharding), D (slow-query debugging).

---

## P04 — APIs, Microservices & Messaging

- **Modules in pillar:** `rest-api`, `microservices`, `messaging-events`.
- **Topic must-includes:** REST principles; idempotency; HTTP status codes; API versioning; pagination patterns; JWT structure; OAuth 2.0 flows; rate limiting; circuit breaker; Kafka basics + partitions + consumer groups; exactly-once vs at-least-once delivery; saga pattern; outbox pattern; service discovery.
- **Voice tweaks:** beginner-friendly; every answer must **name the contract / boundary / failure mode** — the URL, the message schema, the retry policy, what happens at the network seam. Microservices answers without a named failure mode are warning-flagged.
- **Pillar-specific standard examples:**
  - `POST /orders` returning `201 Created` with `Location` header
  - `Authorization: Bearer <jwt>` header
  - Kafka topic with 12 partitions, consumer group with 4 consumers (3 partitions each)
  - Circuit breaker around a downstream call: closed → open → half-open
  - Idempotency key in `POST /payments` to make retry safe
- **Common archetypes:** A (REST, JWT, Kafka basics), C (Kafka consumer-group internals), D (`a downstream is timing out — debug`), E (`saga vs 2PC`).

---

## P05 — Architecture & Design

- **Modules in pillar:** `graphql`, `grpc`, `rabbitmq`, `design-patterns`, `architecture-patterns`.
- **Topic must-includes:** SOLID principles; design patterns (singleton / factory / builder / strategy / observer); composition over inheritance; layered architecture; hexagonal / clean architecture; CQRS basics; event-driven design; DRY vs KISS; gRPC vs REST trade-offs; GraphQL N+1 with DataLoader.
- **Voice tweaks:** **familiar** audience — not beginner. The Speakable opens with the **decision being made**, not with definitions. "I'd reach for the strategy pattern here because…" rather than "Strategy is a behavioural pattern that…".
- **Pillar-specific standard examples:**
  - Strategy pattern for pluggable payment methods
  - Hexagonal: domain core + `OrderRepository` port + JPA adapter
  - Saga choreography for order creation across 3 services
  - DataLoader to batch the N+1 in a GraphQL resolver
  - gRPC streaming for a server-push leaderboard
- **Common archetypes:** E (decision-first by mandate), A (some pattern definitions), B (`graphql vs rest`, `rabbitmq vs kafka`).

---

## P06 — System Design

- **Modules in pillar:** `system-design`, `system-design-cases`, `low-level-design`. (Plus `postgresql` tagged here in `_index.json` — see review queue; treated as P03 by content.)
- **Topic must-includes:** capacity estimation; FR vs NFR; CAP theorem & trade-offs; caching strategies; load balancing; sharding & replication; URL shortener; rate limiter; news feed; chat system; payment system; notification service; parking lot LLD; vending machine LLD; elevator system LLD.
- **Voice tweaks:** **familiar** audience; **phased walkthrough only** — every beat is a phase the interviewer can interrupt at; **capacity numbers mandatory** (req/s, GB, ms, %). Vague phrases like "lots of users" fail the depth check.
- **Pillar-specific standard examples:**
  - URL shortener at 10M URLs/day (~115 writes/s avg, ~600 peak; 30K reads/s)
  - Rate limiter at 1M req/s across N edge nodes
  - News feed: fan-out-on-write vs fan-out-on-read at 100M DAU
  - Parking lot: `Vehicle`, `Spot`, `Ticket`, `PaymentStrategy`
  - Vending machine: state machine across `Idle`, `HasMoney`, `Dispensing`
- **Common archetypes:** F (almost exclusively — every case study and LLD), with occasional A for the fundamentals page.

---

## P07 — Security

- **Modules in pillar:** `application-security`.
- **Topic must-includes:** authentication vs authorization; OAuth 2.0 flows; JWT signing; CSRF & XSS; password hashing (bcrypt); TLS handshake basics; OWASP top 10; secrets management; secure deserialization.
- **Voice tweaks:** beginner-friendly; every answer must implicitly carry the **threat-model framing** — who's the attacker, what's the asset, what's the vulnerability, what's the mitigation. Security answers without a named threat are warning-flagged.
- **Pillar-specific standard examples:**
  - bcrypt with work-factor 12 for password hashing
  - JWT with `HS256` (shared secret) vs `RS256` (asymmetric)
  - CSRF token on state-changing form submissions
  - XSS via reflected query param into innerHTML
  - TLS 1.3 handshake: ClientHello → ServerHello + cert → finished
- **Common archetypes:** A (every "what is X" security concept), C (TLS handshake internals, JWT internals), D (`a CSRF was reported — debug`).

---

## P08 — Testing & Quality

- **Modules in pillar:** `unit-testing`.
- **Topic must-includes:** test pyramid; unit vs integration vs contract test; mocking vs stubbing; code coverage; TDD basics; Testcontainers; Spring Boot test slices; Pact contract testing.
- **Voice tweaks:** beginner-friendly; every answer must carry the **pyramid + risk** thinking — what level of test catches what bug, what it can't, where the cost is. "Mock when crossing a process boundary, not when crossing a class one."
- **Pillar-specific standard examples:**
  - JUnit 5 `@Test` with `@DisplayName` and `assertThat`
  - Mockito `when(repo.findById(1L)).thenReturn(Optional.of(user))`
  - Testcontainers `@Container PostgreSQLContainer<>` for integration test
  - `@WebMvcTest(UserController.class)` for a Spring MVC slice test
  - Pact contract verifying `GET /users/{id}` schema
- **Common archetypes:** A (concepts: pyramid, TDD), B (unit vs integration vs contract; mock vs stub).

---

## P09 — DevOps

- **Modules in pillar:** `git-build-tools`, `java-build-tools`, `cicd`, `terraform`, `jenkins`, `docker`, `kubernetes`.
- **Topic must-includes:** CI/CD pipeline stages; Docker layers & multi-stage builds; Kubernetes pod & service; blue-green & canary; rolling updates; git workflows (rebase vs merge); Maven vs Gradle; Terraform plan/apply; secrets in pipelines.
- **Voice tweaks:** beginner-friendly; every answer must trace **sequence + blast radius** — pipeline order, what runs in parallel vs serial, what happens on failure, how rollback works, and how big the blast is if it fires. The DevOps voice is the calm "here's the order, here's the safety net".
- **Pillar-specific standard examples:**
  - Multi-stage Dockerfile: `FROM maven AS build` → `FROM eclipse-temurin:21-jre`
  - GitHub Actions: `on: push` → `jobs: build → test → deploy`
  - `kubectl rollout undo deployment/api`
  - Canary: 5% → 25% → 100% with SLO checks at each step
  - `terraform plan` showing 3 add / 1 change / 0 destroy before apply
- **Common archetypes:** A (every `*-fundamentals` topic), D (every `scenario-based` topic — "the pipeline broke", "a pod is in CrashLoopBackOff"), B (`maven vs gradle`, `merge vs rebase`).

---

## P10 — Cloud

- **Modules in pillar:** `aws-cloud`, `cloud-native`, `gcp`, `azure`.
- **Topic must-includes:** region vs AZ; IAM basics; S3 consistency model; autoscaling; VPC & networking basics; EC2 vs ECS vs EKS vs Fargate vs Lambda; RDS vs DynamoDB vs Aurora; SQS vs SNS vs EventBridge vs Kinesis; 12-factor; cloud design patterns; multi-region active/active vs active/passive.
- **Voice tweaks:** beginner-friendly; the **service-shopping voice** — every answer names the choice being made, why this service rather than the neighbours, and the cost dimension that broke the tie. Cloud answers without "and the cost is" are flat.
- **Pillar-specific standard examples:**
  - S3 bucket fronted by CloudFront for static assets
  - IAM role assumed by a Lambda via instance profile
  - EC2 (control) vs Fargate (no node ops) vs Lambda (event-driven, 15-min cap)
  - SQS for buffered async work, SNS for fan-out, EventBridge for routing
  - Multi-region active/passive with Route 53 health-checked failover
- **Common archetypes:** B (every "X vs Y" service comparison), E (`monolith on EC2 or microservices on EKS for X`), A (core service definitions).

---

## P11 — Production

- **Modules in pillar:** `observability`, `production-sre`.
- **Topic must-includes:** log levels & structured logging; distributed tracing; SLI / SLO / SLA; error budget; incident response & runbooks; post-mortem & RCA; the four golden signals; jstack / async-profiler / JFR; on-call rotation design; chaos engineering.
- **Voice tweaks:** **familiar** audience; the **war-room voice** — calm, evidence-driven, named tools. No hedging ("might possibly", "could maybe"). Concrete percentile language ("p99 went from 80 ms to 240 ms"), concrete tools ("ran async-profiler for 30 seconds"), concrete time spans ("the spike lasted 4 minutes").
- **Pillar-specific standard examples:**
  - SLO: 99.9% availability, 30-day rolling window, ~43 minutes of error budget per month
  - Four golden signals on the dashboard: latency p99, traffic, errors %, saturation %
  - `jstack <pid>` on a hung JVM showing 47 threads parked on the same monitor
  - MDC + correlation ID propagated across service hops
  - Blameless post-mortem: timeline → contributing factors → action items with owners
- **Common archetypes:** D (every `debugging-production`, `performance-troubleshooting`, `incident-response` topic), C (some — distributed tracing internals), A (SLI/SLO/SLA fundamentals).

---

## P12 — Interview Readiness

- **Modules in pillar:** `behavioral`, `engineering-practices`.
- **Topic must-includes:** STAR method; self-introduction; conflict resolution; mistake / failure stories; weakness question; delivering under pressure; career growth narratives; code review practices; ADRs; technical debt strategy; mentoring stories; technical leadership.
- **Voice tweaks:** beginner-friendly with **first-person warmth**; STAR is mandatory for every story prompt; the **reflection beat** ("looking back, I'd have…") is what separates a rehearsed-sounding answer from a self-aware one. No jargon. The voice is one engineer talking to another over coffee, not a candidate addressing a panel.
- **Pillar-specific standard examples:**
  - "Tell me about a time you delivered under pressure" → 3-week payment integration with cut scope and feature-flagged rollout
  - "Tell me about a failure" → an incident I caused; rollback plan written during, not before
  - "Tell me about a disagreement" → reframed as a decision-to-make-together, not a position to defend
  - ADR template: context → decision → consequences
  - Code-review practice: anchor on intent first, style last
- **Common archetypes:** G (almost exclusively — every story prompt). The `engineering-practices` module also has a thin layer of A (ADR / code-review concepts).

---

## Cross-references

- Plan source: `SPEAKABLE-PLAN.md` §4 (registers) and §15A.4 (default audience locked at beginner).
- Lint enforcement: `docs/speakable/lint-rules.md` 7.2 (familiarity rules invoke per-pillar codex slices), 7.3 (voice rules apply uniformly), 7.6 (depth rules carry per-archetype variation).
- Codex per-pillar slices: `docs/speakable/familiarity-codex.md` and `codex/phrasings.json` are organised by pillar to match this register.
