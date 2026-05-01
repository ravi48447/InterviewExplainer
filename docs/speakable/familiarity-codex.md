# Familiarity & Voice Codex

> Mirrors `SPEAKABLE-PLAN.md` §6 and §2.3 / §2.7 in human-readable form. The lint script (Phase 1) reads the machine-readable companions:
>
> - `codex/phrasings.json` — canonical phrasings library (101 topics)
> - `codex/examples.json` — standard examples library (101 entries, 1:1 with phrasings)
> - `codex/banned.json` — three-layer banned vocabulary
>
> This doc is the **principle and policy** layer; the JSONs are the truth the lint walks.

---

## 1. The principle

> **Invisible familiarity (§2.3).** The reader has already half-absorbed the topic from popular sites. We **silently** reuse the canonical phrasings, standard examples, and patterns they recognise — but we **never reference** their prior reading. No "you've seen this", no "the textbook line is", no "every tutorial says". The user feels familiarity unconsciously and gets framing + depth as our value-add.

> **Speakable IS the answer, not coaching (§2.7).** The Speakable text is what the *user reads as study material*. It is the answer, fully formed, in spoken voice. It **never** addresses the reader, instructs them, or talks meta about the answer. Phrases like *"you should say…"*, *"tell the interviewer…"*, *"in your response…"*, *"the candidate should…"*, *"to impress the interviewer…"* are forbidden (Layer 3 banned vocab below). The reader internalises the answer by reading it; we don't coach them about how to give it.

These two principles produce the codex's central rule:

- The Speakable's definition-equivalent beat **must contain ≥ 1 canonical anchor** for its topic from `codex/phrasings.json` (lint 7.2.1).
- The Speakable's example beat **must use the standard example** for its topic from `codex/examples.json`, unless `familiarity_override: true` is set with a justification (lint 7.2.2).
- The Speakable **must contain zero hits** from Layer 2 (meta-references) and zero from Layer 3 (coaching) (lint 7.2.3 / 7.2.4).
- Layer 1 (generic hi-tech vocab) is rate-limited to ≤ 2 hits per 1000 words (lint 7.2.5).

---

## 2. Voice rules (mechanically checkable)

These are the surface-level voice rules the lint applies (`lint-rules.md` §7.3). Every Speakable, regardless of pillar or archetype, holds to all of them.

| Rule | Pass criterion |
|---|---|
| **Average sentence length** | ≤ 16 words across the cleaned text |
| **Reading level** | Flesch-Kincaid Grade ≤ 9 |
| **Contractions ratio** | ≥ 30 % (use `don't`, `it's`, `you'll`, `we've`, `that's`) |
| **Active voice ratio** | ≥ 90 % (avoid "is computed by", "was reviewed by") |
| **One concept per sentence** | ≤ 2 commas + zero semicolons in any single sentence |
| **No second-person imperatives** | Zero hits of "notice that", "remember to", "consider this", "keep in mind" |
| **Pronouns** | "we" and "you" allowed (declarative, not directive); "one" and "the developer" forbidden |
| **No meta-references** | Zero Layer 2 (see below) |
| **No coaching phrasing** | Zero Layer 3 (see below) |

These rules are universal. The per-pillar register tweaks (`docs/speakable/pillar-register.md`) sit on top of them — they don't override them.

---

## 3. Three-layer banned vocabulary

Verbatim from `codex/banned.json`. Lint enforcement summarised in `lint-rules.md` §7.2.3 / §7.2.4 / §7.2.5.

### Layer 1 — generic hi-tech vocabulary
**Tolerance:** ≤ 2 hits per 1000 words.

`leverage`, `utilize`, `surface area`, `blast radius`, `footprint`, `non-trivial`, `orthogonal`, `first-class`, `in-flight`, `out of the box`, `battle-tested`, `production-grade`, `the canonical`, `literally means`, `in this article we will discuss`.

### Layer 2 — meta-references to the user's prior reading
**Tolerance:** zero. One hit = lint fail.

`you've seen this`, `you've read this`, `the textbook line`, `the famous example`, `every tutorial`, `as you've read`, `the classic line`, `as you know`, `as we all know`, `you may have heard`.

### Layer 3 — coaching / instructional phrasing
**Tolerance:** zero. One hit = lint fail. (Principle 2.7.)

`you should say`, `you can say`, `you can answer`, `you should answer`, `tell the interviewer`, `in your answer`, `in your response`, `respond by saying`, `the candidate should`, `to impress the interviewer`, `I would frame this as`, `the way to answer this is`, `make sure to mention`, `don't forget to say`, `explain it as`, `describe it like this`, `answer it like`, `how to answer this`, `your reply should`.

---

## 4. Per-pillar topic register

For every pillar, every topic carries:

- **Canonical phrasings** — the 3+ phrases the answer should silently echo. The lint requires ≥ 1 to land in the definition-equivalent beat.
- **Standard example** — the example the answer should use unless `familiarity_override: true` is set.

Source for every entry below: agent-seeded (Plan §15B.1). Future human pass refines.

### P01 — Java Language & Core (22 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| Thread basics & lifecycle (`thread-basics-and-lifecycle`) | "smallest unit of execution within a process"; "lifecycle states: New, Runnable, Running, Blocked/Waiting, Terminated" | `extends Thread` vs `implements Runnable` |
| Thread vs Runnable vs Callable (`thread-vs-runnable-vs-callable`) | "Callable returns a value and can throw checked exceptions"; "Future holds the eventual result" | `Future<Integer> f = executor.submit(() -> compute())` |
| Executor framework (`executor-framework`) | "decouples task submission from thread management"; "shutdown vs shutdownNow" | `Executors.newFixedThreadPool(8)` handing out 100 tasks |
| Synchronization & locks (`synchronization-and-locks`) | "intrinsic lock on the object's monitor"; "ReentrantLock with explicit lock and unlock" | `synchronized` block on a private final `Object` lock |
| volatile vs atomic (`volatile-vs-atomic`) | "volatile guarantees visibility but not atomicity"; "AtomicInteger uses compare-and-swap under the hood" | `AtomicInteger.incrementAndGet()` vs `volatile int counter` |
| HashMap internals (`hashmap-internals`) | "array of buckets"; "key-value pair"; "treeify at bucket size 8 in Java 8+" | `map.put("key", value)` — collision in a bucket |
| ArrayList vs LinkedList (`arraylist-vs-linkedlist`) | "array under the hood vs nodes with pointers"; "cache locality favours ArrayList" | `List<Integer> = new ArrayList<>()` vs `new LinkedList<>()` |
| HashSet & TreeMap (`hashset-and-treemap`) | "HashSet is backed by a HashMap"; "TreeMap is a red-black tree giving sorted order" | `TreeMap<String, Integer>` for sorted-by-key iteration |
| equals & hashCode contract (`equals-and-hashcode-contract`) | "if equals returns true, hashcode must match"; "breaking the contract breaks every hash-based collection" | `Point` with x and y — `equals` on both, `hashCode = Objects.hash(x, y)` |
| Comparable vs Comparator (`comparable-vs-comparator`) | "Comparable is the natural order on the class"; "Comparator is a separate strategy you can swap" | `list.sort(Comparator.comparing(Person::getAge))` |
| Generics & type erasure (`generics-and-type-erasure`) | "type parameters disappear at runtime"; "you can't do new T() because T is gone" | `List<String>` at compile time becomes `List` at runtime |
| Checked vs unchecked exceptions (`checked-vs-unchecked-exceptions`) | "checked = compiler forces handling, RuntimeException = doesn't" | `IOException` (checked) vs `NullPointerException` (unchecked) |
| try-with-resources (`try-with-resources`) | "automatically closes anything that implements AutoCloseable"; "close runs in reverse order" | `try (var br = Files.newBufferedReader(path)) { ... }` |
| String immutability & String pool (`string-immutability-and-string-pool`) | "Strings are immutable in Java"; "the String pool interns string literals" | `"abc" == "abc"` returns true (pool); `new String("abc")` doesn't |
| `==` vs `equals` (`equals-vs-double-equals`) | "double-equals compares references, equals compares contents"; "two String literals share a pool reference" | `"hello" == "hello"` (true), but `new String("hello") == "hello"` (false) |
| OOP four pillars (`oop-four-pillars`) | "data plus the methods that work on that data"; "blueprint vs instance" | `Dog extends Animal`; `List<String> = new ArrayList<>()` |
| Abstract class vs interface (`abstract-class-vs-interface`) | "interface is pure contract, abstract class can mix in state"; "default methods since Java 8 narrowed the gap" | `Shape` (abstract `draw()`) vs `Drawable` (interface) |
| Inner classes (`inner-classes`) | "static nested vs inner vs local vs anonymous"; "lambdas replaced most anonymous-class use" | `Iterator` implementation as a non-static inner class of `MyList` |
| static & final keywords (`static-and-final-keywords`) | "static belongs to the class, instance belongs to the object"; "final variable can't be reassigned" | `public static final int MAX = 100;` |
| Garbage collection generations (`garbage-collection-generations`) | "young generation for short-lived objects"; "minor GC vs major GC vs full GC" | young → survivor → old, with G1 default since Java 9 |
| JIT compilation (`jit-compilation`) | "interpreter to start, JIT compiles hot paths to native code"; "tiered compilation by default" | a tight loop interpreted, then C1-compiled, then C2-compiled |
| Reflection & annotations (`reflection-and-annotations`) | "annotations are metadata read by reflection or processors"; "RetentionPolicy decides if annotation survives to runtime" | `@Override` read by the compiler; `@Retention(RUNTIME)` read by the framework |

### P02 — Spring Ecosystem (11 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| IoC & DI (`ioc-and-di`) | "Inversion of Control hands wiring to the container"; "constructor injection is the modern default" | constructor with `final` fields + `@RequiredArgsConstructor` |
| Spring bean lifecycle (`spring-bean-lifecycle`) | "instantiate, populate, BeanPostProcessor before init, init, ready"; "@PostConstruct after DI" | instantiate → populate → `@PostConstruct` → ready → `@PreDestroy` |
| Spring bean scopes (`spring-bean-scopes`) | "singleton (default) and prototype, plus web scopes"; "singleton means one per ApplicationContext" | `@Service` singleton (default) vs `@Scope("prototype")` for per-call |
| Stereotype annotations (`spring-stereotype-annotations`) | "`@Service` for business logic, `@Repository` for persistence"; "Spring scans them all the same way" | `OrderService` (`@Service`) → `OrderRepository` (`@Repository`) → `OrderController` (`@RestController`) |
| Spring AOP basics (`spring-aop-basics`) | "cross-cutting concerns like logging, security, transactions"; "self-invocation bypasses the proxy" | `@Around("@annotation(Timed)")` logging method duration |
| `@Transactional` propagation & isolation (`transactional-propagation-and-isolation`) | "REQUIRED joins the existing transaction or starts one"; "REQUIRES_NEW always starts a new one" | `@Transactional(propagation = REQUIRES_NEW)` on the audit method |
| Spring Boot auto-configuration (`spring-boot-auto-configuration`) | "@EnableAutoConfiguration scans the classpath"; "@ConditionalOnClass / @ConditionalOnProperty drive conditional bean wiring" | `spring-boot-starter-data-jpa` pulling Hibernate + HikariCP + auto-config |
| `@RestController` & `@ResponseBody` (`restcontroller-and-responsebody`) | "@RestController = @Controller + @ResponseBody on every method"; "Jackson serialises the return value" | `@RestController` with `@GetMapping("/users/{id}")` returning a User |
| `@ControllerAdvice` (`exception-handling-controlleradvice`) | "@ControllerAdvice catches exceptions across controllers"; "@ExceptionHandler maps an exception to a response" | `@ControllerAdvice` mapping `IllegalArgumentException → 400` |
| Profiles & properties (`profiles-and-properties`) | "spring.profiles.active selects a profile"; "application-{profile}.yml gets layered on top" | `application.yml` + `application-prod.yml` with `spring.profiles.active=prod` |
| Actuator endpoints (`actuator-endpoints`) | "/health, /info, /metrics, /env"; "secure them or scope them to an internal port" | `/actuator/health` returning UP; `/actuator/metrics` for Micrometer |

### P03 — Data & Persistence (8 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| ACID properties (`acid-properties`) | "Atomic — all or nothing"; "Durable — survives a crash" | `BEGIN; UPDATE accounts ... ; UPDATE accounts ... ; COMMIT;` |
| SQL transaction isolation levels (`sql-transaction-isolation-levels`) | "READ_COMMITTED prevents dirty reads but allows non-repeatable reads"; "REPEATABLE_READ allows phantoms" | phantom read scenario at REPEATABLE_READ |
| JPA cascades (`jpa-cascades`) | "CascadeType.PERSIST, MERGE, REMOVE, REFRESH, DETACH, ALL"; "ALL is a footgun" | `@OneToMany(cascade = ALL, orphanRemoval = true)` on `Order → OrderLine` |
| Lazy vs eager loading (`lazy-vs-eager-loading`) | "lazy = fetch the relation when you touch it"; "lazy outside a transaction throws LazyInitializationException" | `@OneToMany(fetch = LAZY)` on `Order.items` causing `LazyInitializationException` |
| N+1 query problem (`n-plus-one-query-problem`) | "one query for the parent list, N more for each child collection"; "fix with JOIN FETCH, entity graphs, or @BatchSize" | `for (Order o : orders) o.getItems().size()` — 1 + N queries |
| Indexing & EXPLAIN (`indexing-and-explain`) | "index turns a full scan into a B-tree lookup"; "EXPLAIN shows the query plan" | `EXPLAIN ANALYZE` on `SELECT ... WHERE email = 'x'` before/after creating an index |
| Connection pooling (`connection-pooling`) | "HikariCP is the modern default"; "more connections is not faster — they queue at the database" | HikariCP with `maximumPoolSize: 20` on a 4-core service |
| Optimistic vs pessimistic locking (`optimistic-vs-pessimistic-locking`) | "optimistic checks a version on update; pessimistic locks the row up front" | `@Version Long version` field on the entity |

### P04 — APIs, Microservices & Messaging (11 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| REST principles (`rest-principles`) | "stateless, uses HTTP verbs, resources via URLs"; "GET safe and idempotent, PUT idempotent, POST not" | `POST /orders → 201 Created with Location: /orders/123` |
| Idempotency (`idempotency`) | "same request, same effect, no matter how many times"; "idempotency key in the request lets the server dedupe" | `POST /payments` with `Idempotency-Key` header |
| HTTP status codes (`http-status-codes`) | "2xx success, 3xx redirect, 4xx client error, 5xx server error"; "201 Created with Location header" | 200 vs 201 vs 204; 400 vs 401 vs 403 vs 404 |
| API versioning (`api-versioning`) | "URI versioning (/v1/...), header versioning, content-negotiation versioning" | `GET /v1/users` vs `GET /users` with `Accept: application/vnd.api+json;v=1` |
| Pagination patterns (`pagination-patterns`) | "offset/limit (simple, slow on deep pages)"; "cursor-based (stable across inserts)" | `?cursor=eyJpZCI6MTIzfQ&limit=20` |
| JWT structure (`jwt-structure`) | "header.payload.signature, base64url-encoded"; "signature proves the issuer with the key" | `eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqb2UifQ.<sig>` |
| OAuth 2.0 flows (`oauth2-flows`) | "Authorization Code with PKCE for browsers and native apps"; "Client Credentials for service-to-service" | Authorization Code with PKCE for a SPA hitting an API |
| Rate limiting (`rate-limiting`) | "token bucket and leaky bucket are the workhorses"; "return 429 Too Many Requests" | 100 req/min per API key with token bucket; 429 + `Retry-After: 60` |
| Circuit breaker (`circuit-breaker`) | "closed → open → half-open"; "half-open lets one request through to test recovery" | Resilience4j CircuitBreaker around a downstream call to billing |
| Kafka basics: partitions & consumer groups (`kafka-basics-partitions-consumer-groups`) | "topic split into partitions for parallelism"; "one consumer per partition within a group" | topic with 12 partitions, consumer group of 4 (3 partitions each) |
| Exactly-once vs at-least-once (`exactly-once-vs-at-least-once`) | "at-most-once may lose, at-least-once may duplicate"; "exactly-once needs idempotent processing" | idempotent producer + transactional commit on the consumer side |

### P05 — Architecture & Design (8 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| SOLID principles (`solid-principles`) | "Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion"; "depend on abstractions, not concretions" | `ReportPrinter` doing only printing (SRP); `PaymentProcessor` depending on `PaymentMethod` (DIP) |
| Design patterns classics (`design-patterns-classics`) | "Singleton, Factory, Builder, Strategy, Observer"; "patterns are vocabulary, not imports" | `PaymentMethod` strategy: `CardPayment` / `UpiPayment` / `CashPayment` |
| Composition over inheritance (`composition-over-inheritance`) | "has-a versus is-a"; "composition gives you behaviour by holding it" | `Car` has-a `Engine` vs `Car extends EngineVehicle` |
| Layered architecture (`layered-architecture`) | "presentation, application, domain, infrastructure"; "dependencies flow inward" | `Controller → Service → Repository → Database` |
| Hexagonal / clean architecture (`hexagonal-clean-architecture`) | "ports and adapters"; "domain core knows nothing about frameworks" | `OrderService` (domain) + `OrderRepository` (port) + `JpaOrderRepository` (adapter) |
| CQRS basics (`cqrs-basics`) | "Command Query Responsibility Segregation"; "two models so each can be optimised independently" | `OrderCommand` (write) → `OrderEventStore`; `OrderProjection` (read) → denormalised view |
| Event-driven design (`event-driven-design`) | "publish events, react to events"; "eventual consistency is the default" | `OrderPlaced` event consumed by Inventory + Email + Analytics |
| DRY vs KISS (`dry-vs-kiss`) | "Don't Repeat Yourself"; "premature DRY couples; KISS keeps the seam" | two slightly-different validators force-merged into one branchy method |

### P06 — System Design (9 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| Capacity estimation (`capacity-estimation`) | "writes per second, reads per second, GB per day, peak factor"; "average vs peak — 5x is a common rule" | 10M URLs/day → 115 writes/s avg, 600 peak, 30K reads/s |
| FR vs NFR (`fr-vs-nfr`) | "FR = what the system does"; "NFRs constrain the architecture more than FRs" | FR: 'redirect on GET' / NFR: 'p99 redirect under 50 ms' |
| CAP theorem & trade-offs (`cap-theorem-and-tradeoffs`) | "Consistency, Availability, Partition tolerance — pick two during a partition"; "PACELC extends CAP" | DynamoDB favours availability (AP); Spanner favours consistency (CP) |
| Caching strategies (`caching-strategies`) | "cache-aside, read-through, write-through, write-back"; "watch out for cache stampede and hot keys" | cache-aside read: `GET cache → miss → SELECT db → SETEX cache` |
| Load balancing (`load-balancing`) | "round-robin, least-connections, IP hash, weighted"; "L4 vs L7 — transport vs application" | ALB at L7 routing `/api/*` to one target group, `/static/*` to another |
| Sharding & replication (`sharding-and-replication`) | "shard for write scale, replicate for read scale and HA"; "consistent hashing reduces re-shuffling" | shard by user_id with 16 shards; one leader + two read replicas per shard |
| URL shortener design (`url-shortener-design`) | "base-62 short keys"; "30 to 50 to 1 read-to-write ratio is typical" | `POST /shorten → base-62 7-char key; GET /{key} → 301` |
| Rate limiter design (`rate-limiter-design`) | "token bucket for steady allowance, sliding window for HTTP-shaped traffic"; "Redis is the usual store" | 1M req/s, 1KB per token-bucket entry → 1GB hot state in Redis |
| News feed design (`news-feed-design`) | "fan-out-on-write for normal users, fan-out-on-read for celebrities"; "the celebrity problem is the bottleneck" | 100M DAU, fan-out-on-write for normal users, fan-out-on-read for celebrities |

### P07 — Security (6 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| Authentication vs authorization (`authentication-vs-authorization`) | "authentication = who you are; authorization = what you can do"; "AuthN runs before AuthZ" | login (AuthN) sets the session; `@PreAuthorize("hasRole('ADMIN')")` (AuthZ) gates the endpoint |
| OAuth 2.0 flows (detail) (`oauth2-flows-detail`) | "Authorization Code with PKCE for browsers and native apps"; "treat the access token like a password" | browser SPA → Authorization Code with PKCE → access token + refresh token |
| JWT signing (`jwt-signing`) | "HS256 is symmetric; RS256 is asymmetric"; "rotate keys with a kid header and a JWKS endpoint" | RS256 with the public key served from `/.well-known/jwks.json` |
| CSRF & XSS (`csrf-and-xss`) | "CSRF tricks the browser into making an authenticated request"; "XSS injects script into the page" | CSRF: hidden form on attacker.com posting to bank.com; XSS: `<script>` in a comment field |
| Password hashing (bcrypt) (`password-hashing-bcrypt`) | "bcrypt with a tunable work factor"; "argon2 is the newer recommendation"; "salt prevents rainbow tables" | `BCrypt.hashpw(password, BCrypt.gensalt(12))` |
| TLS handshake (`tls-handshake`) | "ClientHello with cipher suites, ServerHello with chosen suite plus certificate"; "TLS 1.3 collapses to one round trip" | TLS 1.3: ClientHello → ServerHello + cert + Finished — 1 RTT |

### P08 — Testing & Quality (5 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| Test pyramid (`test-pyramid`) | "lots of unit tests, fewer integration tests, very few end-to-end tests"; "ice-cream cone is the anti-pattern" | 1000 unit tests + 100 integration + 10 e2e |
| Unit vs integration vs contract (`unit-vs-integration-vs-contract`) | "unit tests one class with collaborators mocked"; "contract tests assert the API both sides agree on" | `OrderServiceTest` (unit) vs `OrderControllerIT` (integration) vs `OrderApiPactTest` (contract) |
| Mocking vs stubbing (`mocking-vs-stubbing`) | "mock = verify how it was called"; "stub = canned answers, no verification" | `Mockito.when(repo.findById(1L)).thenReturn(Optional.of(user))` |
| Code coverage (`code-coverage`) | "line, branch, condition coverage"; "use it as a smoke detector, not a target" | 85% line + 70% branch on a 50-class service |
| TDD basics (`tdd-basics`) | "red, green, refactor"; "the test drives the design" | write the failing `assertEquals` first, then the smallest production code that passes |

### P09 — DevOps (5 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| CI/CD pipeline stages (`cicd-pipeline-stages`) | "build, test, package, deploy"; "fail fast at the cheapest stage" | GitHub Actions: build → unit-test → image-scan → integration → deploy |
| Docker layers & multi-stage (`docker-layers-multi-stage-builds`) | "each Dockerfile instruction is a cached layer"; "order layers by churn — least-churning at the bottom" | `FROM maven AS build → RUN mvn package → FROM eclipse-temurin:21-jre → COPY --from=build` |
| Kubernetes pod & service (`kubernetes-pod-and-service`) | "pod = one or more containers sharing network and storage"; "service = stable virtual IP fronting a set of pods" | Deployment of 3 pods + Service ClusterIP fronting them |
| Blue-green & canary (`blue-green-and-canary`) | "blue-green: two full environments; switch the router"; "canary: a small slice of traffic to the new version first" | canary 5% → 25% → 100% with auto-rollback on p99 regression |
| Rolling updates (`rolling-updates`) | "replace pods a few at a time"; "maxSurge and maxUnavailable bound the disruption" | `maxSurge: 1, maxUnavailable: 0` — never lose capacity during rollout |

### P10 — Cloud (5 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| Region vs AZ (`region-vs-az`) | "region = geographic; AZ = isolated datacenter inside a region"; "deploy across AZs for HA, across regions for DR" | `us-east-1` with `us-east-1a/b/c` — deploy to all three for HA |
| IAM basics (`iam-basics`) | "users, groups, roles, policies"; "least privilege by default" | IAM role attached to a Lambda; trust policy lets Lambda assume it |
| S3 consistency model (`s3-consistency-model`) | "strong read-after-write consistency for new objects (since 2020)"; "list operations may briefly lag" | PutObject then GetObject on the same key — strong consistency since 2020 |
| Autoscaling (`autoscaling`) | "horizontal vs vertical"; "scale on a leading metric"; "cooldown prevents flapping" | HPA scaling from 3 → 12 pods on CPU > 70% |
| VPC & networking basics (`vpc-and-networking-basics`) | "VPC = isolated virtual network"; "subnets are AZ-scoped; route tables direct traffic" | public subnet (web tier) + private subnet (app tier) + NAT gateway |

### P11 — Production (6 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| Log levels & structured logging (`log-levels-and-structured-logging`) | "ERROR for actionable, WARN for unusual, INFO for milestones"; "MDC propagates a correlation ID" | `{"level":"INFO","trace_id":"abc","event":"order.created","order_id":42}` |
| Distributed tracing (`distributed-tracing`) | "trace = the whole request, span = one hop"; "OpenTelemetry is the vendor-neutral standard" | client → api → orders → payments — 4 spans in one trace |
| SLI / SLO / SLA (`sli-slo-sla`) | "SLI = the measurement, SLO = the internal target, SLA = the customer contract"; "error budget = 1 minus the SLO" | SLI = 5xx rate; SLO = < 0.1% over 30 days; SLA = 99.9% with credits |
| Error budget (`error-budget`) | "remaining permissible unreliability for the period"; "burn rate alerts when consumption is faster than refill" | 99.9% SLO over 30 days = ~43 minutes of error budget per month |
| Incident response & runbooks (`incident-response-and-runbooks`) | "declare, page on-call, establish a commander"; "runbook gives the first 5 steps without thinking" | P0 declared → on-call paged → commander assigned → comms branch + investigation branch |
| Post-mortem & RCA (`post-mortem-and-rca`) | "blameless culture, 5-whys, contributing factors, action items with owners"; "what went well, what went poorly, where we got lucky" | 5-whys uncovering 'no rollback plan written before the deploy' |

### P12 — Interview Readiness (5 topics)

| Topic (id) | Canonical phrasings (sample) | Standard example |
|---|---|---|
| STAR method (`star-method`) | "Situation, Task, Action, Result, plus Reflection"; "specifics over generalities — names, numbers, weeks" | S: payment integration / T: ship in 3 weeks / A: cut scope, feature-flag / R: shipped on time / Reflection: escalate sooner |
| Self-introduction (`self-introduction`) | "name, current role, two or three highlights, what's drawing me to this role"; "30 to 60 seconds, not 3 minutes" | "I'm a backend engineer at X, mostly Java and Kafka, and I'm drawn to this role because of Y" |
| Conflict resolution (`conflict-resolution`) | "name the disagreement, describe the other side's want, describe my move toward shared ground, describe the outcome" | disagreed on REST vs gRPC; reframed as 'pick by latency budget' and chose gRPC together |
| Failure & learning (`failure-and-learning`) | "pick a real failure, own the part you owned, name what you'd do differently"; "specific, recent, with stakes" | shipped a migration without a reverse plan; lost 40 minutes during P0; now write the rollback first |
| Weakness question (`weakness-question`) | "name a real weakness, name what I'm doing about it, name the early signs of progress" | "I've avoided public speaking; I'm doing a brown-bag every month and the team's noticed" |

---

## 5. How agents use this codex

For each Speakable, the agent does this in order:

1. Identify the question's topic (one of the 101 ids in `phrasings.json`).
2. Pull the canonical phrasings; weave **at least one** into the definition-equivalent beat — not as a quote, just as natural phrasing.
3. Pull the standard example from `examples.json`; use it in the example beat unless `familiarity_override: true` (with a documented reason) is justified.
4. Apply the universal voice rules (sentence length, FK grade, contractions, active voice, no second-person imperatives).
5. Run `audit_speakable.py` (Phase 1). The script catches every Layer 2 / Layer 3 hit and rate-limits Layer 1.

If a question's topic is not in `phrasings.json`, the agent files a stub in `docs/speakable/HUMAN-REVIEW-QUEUE.md` (proposed phrasings + example) and proceeds with the topic's content as best understood.

---

## 6. Maintenance

- The codex is a living document. New topics get added via PR. Each PR updates `phrasings.json`, `examples.json`, and the relevant per-pillar table in this doc together.
- Phrasings tagged `agent-seeded` are the Phase 0 seed; they should be reviewed and either confirmed (`source: human-curated`), softened, or replaced as the content lead reads them.
- Banned vocab additions follow the same PR pattern; updates to `banned.json` propagate to the lint immediately.
