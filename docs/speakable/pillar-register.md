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

---

## Python Backend Intermediate — Track register

> Track ID: `python-backend`. appRoot: `/python-backend-intermediate`. All 12 pillars use the same P01–P12 numbering as Java Backend; pillar *names* differ. The 7 archetypes, voice rules, lint rubric, and word ceilings are identical to the Java track.

### Summary table

| Pillar | Modules | Dominant archetypes | Default audience | Key voice note |
|---|---:|---|---|---|
| P01 Python Language & Core | 6 | A, B, C | beginner | One tiny Python code shape per answer — one-liner, comprehension, or dunder call. Duck typing and "everything is an object" are the twin anchors. |
| P02 Web Frameworks | 4 | A, C, D | beginner | Trace the request lifecycle (URL → middleware → view → ORM → serialiser → response). Convention over configuration for Django; explicit DI for FastAPI. |
| P03 Data & Persistence | 4 | A, B, C, D | beginner | Surface the trade-off: consistency vs query flexibility vs schema rigidity. Name the ORM session state or the cache eviction policy. |
| P04 APIs & Async | 3 | A, C, D, E | beginner | Always name the I/O model — sync WSGI, async ASGI, or the event loop. Blocking-in-async is the universal gotcha. |
| P05 Task Queues & Messaging | 3 | A, C, D | beginner | Broker + worker + result backend — every Celery/Kafka answer must name all three. Failure mode is always: what happens to the message when the worker dies? |
| P06 Architecture & Design | 2 | E, A | familiar | Decision-first — open with the call, not the definition. Python's first-class functions and protocols make some patterns simpler than Java's. |
| P07 System Design | 2 | F | familiar | Concrete capacity numbers — req/s, GB/day, cache hit rate. Python service examples (FastAPI behind ALB, Celery scaling on queue depth). |
| P08 Security | 1 | A, C, D | beginner | Threat-model framing — attacker, asset, vulnerability, mitigation. Name the Django or FastAPI middleware that prevents each OWASP top 10 item. |
| P09 Testing & Quality | 2 | A, B, D | beginner | Pyramid + risk thinking. "Patch where it's used, not where it's defined" is the depth marker for every mocking question. |
| P10 DevOps for Python | 3 | A, D | beginner | Sequence + blast radius. Python-specific: layer caching in Dockerfile (requirements before source), Poetry lock for reproducibility, PYTHONUNBUFFERED. |
| P11 Cloud & Production | 3 | D, C, A | familiar | War-room voice — calm, evidence-driven, named tools. py-spy for production profiling without restart; structlog for structured logging; Sentry for errors. |
| P12 Interview Readiness | 2 | G | beginner | First-person warmth; STAR rigour; reflection beat mandatory. Stories anchored to Python projects — a Django migration that went wrong, an asyncio bug, an N+1 they fixed. |

> Total: 35 modules across 12 pillars (matches `_index.json` `totalModules: 38` — 3 additional modules are M08b Flask, M14b WebSockets, M16b RabbitMQ which are standalone).

---

### Python P01 — Python Language & Core

- **Modules in pillar:** `core-python`, `python-oop`, `data-structures-algorithms`, `generators-functional`, `concurrency-async`, `cpython-internals`.
- **Topic must-includes:** built-in types (list/dict/set/tuple comparisons); string immutability and interning; exception handling (try/except/else/finally, raise from); the iterator protocol; generators with yield; decorators and @functools.wraps; closures and LEGB scope; the GIL and its implications; asyncio event loop model; async/await coroutines; CPython reference counting; cyclic GC; Python OOP (dunder methods, __slots__, @property, @classmethod vs @staticmethod); SOLID in Python; duck typing vs ABCs.
- **Voice tweaks:** beginner-friendly; every answer must drop **one tiny Python code shape** — a comprehension, a with statement, a dunder method call, or an async def — so the listener can anchor visually. "Everything is an object" and "duck typing" are the twin philosophical anchors for P01; use them. When comparing Python to Java (e.g., GIL vs JVM threads), the Java comparison clarifies but the Python explanation must stand alone.
- **Pillar-specific standard examples:**
  - `class GoldenRetriever(Dog): def speak(self): return 'woof'` (inheritance)
  - `[x*2 for x in items if x > 0]` (comprehension idiom)
  - `with open('data.csv') as f:` (context manager)
  - `def fibonacci(): a, b = 0, 1; while True: yield a; a, b = b, a+b` (generator)
  - `async def fetch(url): async with session.get(url) as r: return await r.json()` (async/await)
  - `concurrent.futures.ProcessPoolExecutor` for CPU-bound vs `ThreadPoolExecutor` for I/O-bound (GIL answer)
- **Common archetypes:** A (every "what is" Python concept), B (`comparisons/` — list vs tuple, threading vs multiprocessing vs asyncio, == vs is), C (`cpython-internals` — reference counting, GIL internals, asyncio event loop), D (scenario-based — debugging a memory leak, diagnosing a frozen event loop).
- **Depth markers for P01:**
  - GIL (B): The gotcha — CPU-bound threads still serialize even with the GIL released during I/O; the free-threaded build (3.13) changes this but not for production yet.
  - asyncio (C): Failure mode — `time.sleep()` inside a coroutine blocks the entire event loop; use `asyncio.sleep()`.
  - CPython GC (C): Failure mode — `__del__` on an object in a reference cycle is never guaranteed to be called before process exit.
  - Closures (A): Depth marker — the late-binding gotcha: `[lambda: i for i in range(3)]` — all three lambdas return 2, not 0, 1, 2.

---

### Python P02 — Web Frameworks

- **Modules in pillar:** `django-core`, `django-rest-framework`, `fastapi`, `flask`.
- **Topic must-includes:** Django MTV architecture; Django request lifecycle (URL → middleware → view → template/response); Django middleware (order, process_request vs process_response); class-based views vs function-based views; Django ORM QuerySet lazy evaluation; select_related vs prefetch_related; DRF serializers (ModelSerializer, validation hooks, nested); DRF ViewSets and Routers; DRF permissions and authentication; FastAPI path operations; FastAPI Depends() DI; Pydantic v2 validation; async FastAPI endpoints; WSGI vs ASGI; Flask application context; Flask Blueprints; Django vs FastAPI vs Flask comparison.
- **Voice tweaks:** beginner-friendly; every answer must **trace the order of events** at least once — Django's request-response cycle ("URL dispatcher → middleware stack → view function → ORM query → serialiser → HTTP response"), FastAPI's dependency resolution graph. Django's value is convention and batteries; FastAPI's value is async-first and type safety via Pydantic — every comparison answer names both sides' value proposition, not just one.
- **Pillar-specific standard examples:**
  - `Order.objects.filter(status='pending').select_related('customer')[:20]` (Django ORM queryset)
  - `class OrderSerializer(ModelSerializer): class Meta: model = Order; fields = ['id', 'status']` (DRF)
  - `@app.get('/users/{id}', response_model=UserOut) async def get_user(id: int, db = Depends(get_db)):` (FastAPI)
  - `gunicorn app:app` (WSGI) vs `uvicorn app:app` (ASGI) — same code, different server
- **Common archetypes:** A (every "what is X in Django/FastAPI"), C ("how does DRF authentication work", "how does FastAPI DI resolve"), D ("a DRF endpoint is returning 403 — debug it", "a FastAPI background task is silently failing"), E ("Django vs FastAPI for this use case").

---

### Python P03 — Data & Persistence

- **Modules in pillar:** `sqlalchemy-alembic`, `postgresql-python`, `mongodb-python`, `redis-caching`.
- **Topic must-includes:** SQLAlchemy Session unit of work; identity map; relationship loading (lazy, selectin, subquery — and N+1 for each); Alembic migration workflow; psycopg2 vs asyncpg; PostgreSQL indexing and EXPLAIN ANALYZE; connection pooling; MongoDB document model vs relational; PyMongo aggregation pipeline; Motor for async; Redis data structures (string, list, hash, set, sorted set); caching patterns (cache-aside, write-through, write-behind); TTL and eviction; Redis pub/sub.
- **Voice tweaks:** beginner-friendly; every answer must **surface the trade-off** — normalisation vs query speed, consistency vs availability, memory vs durability. The N+1 fix (select_related / JOIN FETCH / selectin loading) is the single most asked production question in this pillar; every module has at least one N+1 scenario question.
- **Pillar-specific standard examples:**
  - `with Session(engine) as s: user = s.get(User, 1); user.email = 'x'; s.commit()` (SQLAlchemy unit of work)
  - `for post in Post.objects.all(): post.author.name` → N+1; fix: `select_related('author')` (Django ORM version)
  - `EXPLAIN ANALYZE SELECT * FROM orders WHERE customer_id = 42` (PostgreSQL diagnosis)
  - `r.set('session:abc', json.dumps(data), ex=3600)` (Redis session cache with TTL)
- **Common archetypes:** A (fundamentals — ACID, lazy loading, Redis data structures), B (comparisons — eager vs lazy, MongoDB vs PostgreSQL, optimistic vs pessimistic locking), C (internals — SQLAlchemy identity map, Redis eviction under memory pressure), D (scenario — slow query, cache miss storm, lost Alembic migration head).

---

### Python P04 — APIs & Async

- **Modules in pillar:** `rest-api-python`, `asyncio-deep-dive`, `websockets-sse`.
- **Topic must-includes:** REST constraints; HTTP verb idempotency; status codes (200/201/204/400/401/403/422/429/503); API versioning trade-offs; cursor-based pagination; JWT validation with PyJWT; OAuth 2.0 with Authlib; rate limiting with Redis; asyncio event loop internals (the selector, I/O callbacks, the run-forever loop); coroutine vs Task vs Future; asyncio.gather vs create_task vs wait; loop.run_in_executor for blocking code; asyncio failure modes (blocking call, forgotten await, swallowed exception in a Task); WebSocket lifecycle; SSE vs WebSocket vs polling comparison.
- **Voice tweaks:** beginner-friendly; every async answer must **name the I/O model** — "this is a single-threaded event loop; one blocking call freezes every concurrent request". The "blocking in async" failure mode is the depth marker for almost every asyncio question.
- **Pillar-specific standard examples:**
  - `POST /orders → 201 Created with Location: /orders/123` (REST canonical)
  - `await asyncio.gather(fetch(url1), fetch(url2), fetch(url3))` (concurrent async fetches)
  - `loop.run_in_executor(None, blocking_db_call, arg)` (bridging sync library into async)
  - `asyncio.create_task(send_notification(user_id))` with `task.add_done_callback(handle_error)` (fire-and-forget with error handling)
- **Common archetypes:** A (REST fundamentals, JWT structure), C (asyncio internals — event loop, Task lifecycle), D (scenario — blocking event loop, rate-limit breach, WebSocket reconnection), E (WebSocket vs SSE decision, sync vs async handler).

---

### Python P05 — Task Queues & Messaging

- **Modules in pillar:** `celery`, `kafka-python`, `rabbitmq-python`.
- **Topic must-includes:** Celery task definition (@shared_task, bind=True, max_retries, countdown); broker choices (Redis vs RabbitMQ); result backend configuration; task routing to named queues; Celery Canvas (chain, group, chord); Celery Beat for periodic tasks; Flower for monitoring; Kafka producer with delivery callback; Kafka consumer with manual offset commit; consumer group rebalance; dead-letter topics; RabbitMQ exchange types; AMQP acknowledgement; Celery vs Kafka decision.
- **Voice tweaks:** beginner-friendly; every answer must name the **three components** — broker (holds the queue), worker (runs the task), result backend (stores the outcome). The failure mode is always: "what happens to the message when the worker dies mid-task?" — this is the depth marker for every queuing question.
- **Pillar-specific standard examples:**
  - `@app.task(bind=True, max_retries=3) def send_email(self, user_id): try: ... except Exception as exc: raise self.retry(exc=exc, countdown=60)` (Celery retry pattern)
  - Kafka: `producer.produce('orders', key=order_id, value=payload, on_delivery=delivery_callback)` (Kafka with delivery confirmation)
  - Celery vs Kafka: email task → Celery; order-placed event consumed by 3 services → Kafka
- **Common archetypes:** A (Celery basics, Kafka fundamentals), C (Kafka consumer group internals, Celery beat scheduler), D (scenario — silent task failure, consumer lag, broker restart), E (Celery vs Kafka decision — app-level job vs system-level event).

---

### Python P06 — Architecture & Design

- **Modules in pillar:** `design-patterns-python`, `clean-architecture`.
- **Topic must-includes:** SOLID in Python (SRP with service objects, OCP with ABCs/Protocols, LSP with duck typing, ISP with small interfaces, DIP with Repository pattern); creational patterns (singleton via module, factory via classmethods); structural (adapter, facade, decorator — the language feature vs the GoF pattern); behavioral (strategy via first-class functions, observer via callbacks, command pattern); Pythonic patterns (descriptor protocol, context manager as RAII, generator pipeline); layered architecture for Django/FastAPI; hexagonal via Python Protocol; CQRS; event-driven with domain events; DDD entities and value objects.
- **Voice tweaks:** **familiar** audience — opens with the decision being made. "I'd use a Protocol here rather than an ABC because..." rather than "A Protocol is a structural type that...". When comparing Python's approach to Java's, lead with the Python idiom: "In Python, Strategy is just passing a function."
- **Pillar-specific standard examples:**
  - Strategy: `def process_payment(amount, strategy: Callable[[Decimal], None]): strategy(amount)` — passing a function is the Pythonic strategy
  - Hexagonal: `class OrderRepository(Protocol): def save(self, order: Order) -> None: ...` — port as Protocol, adapter as class
  - Factory: `@classmethod def from_dict(cls, data: dict) -> 'Order': return cls(...)` — the Python factory idiom

---

### Python P07 — System Design

- **Modules in pillar:** `system-design-fundamentals`, `system-design-cases`.
- **Topic must-includes:** Same as Java P06 but examples reference Python services — FastAPI behind ALB, Celery workers scaling on SQS queue depth, Redis for distributed rate limiting, asyncio for high-concurrency notification service.
- **Voice tweaks:** **familiar** audience; concrete numbers mandatory (same rule as Java). Python context: when the question is "design a system that sends 10M notifications/day", the answer should mention "Celery workers on ECS with SQS as broker, not Redis, because SQS persists messages across restarts."
- **Pillar-specific standard examples:** Same as Java P06 system design (URL shortener, rate limiter, news feed, chat) but implementation details reference Python libraries.

---

### Python P08 — Security

- **Modules in pillar:** `application-security`.
- **Topic must-includes:** OWASP top 10 as they manifest in Python (SQL injection via raw f-string queries, XSS in Jinja2 without |safe, CSRF in Django without the middleware, insecure deserialization via pickle, broken auth via JWT algorithm confusion); Django's security checklist (DEBUG=False, ALLOWED_HOSTS, SECURE_SSL_REDIRECT, CSRF_COOKIE_SECURE); FastAPI security (OAuth2PasswordBearer, HTTPBearer); bcrypt vs argon2 for password hashing; secrets management (os.environ, python-dotenv for dev, AWS Secrets Manager for prod); JWT security (algorithm confusion attack — alg:none, HS256 vs RS256).
- **Voice tweaks:** beginner-friendly; threat-model framing identical to Java P07. Python-specific: always name the library that prevents the vulnerability (`psycopg2` parameterised queries prevent SQL injection; `django.middleware.csrf.CsrfViewMiddleware` prevents CSRF; `itsdangerous` for signed tokens).
- **Pillar-specific standard examples:** Same structure as Java P07 but Python libraries: `bcrypt.hashpw(password, bcrypt.gensalt(rounds=12))` instead of Spring's `BCryptPasswordEncoder`.

---

### Python P09 — Testing & Quality

- **Modules in pillar:** `pytest`, `type-checking`.
- **Topic must-includes:** pytest fixture system (scope, yield, conftest.py, parametrize); unittest.mock.patch (patch by usage site, not definition site); MagicMock vs Mock vs AsyncMock; integration testing with pytest-django (transactional=True) and Testcontainers; factory_boy for test data; code coverage with pytest-cov; TDD red-green-refactor cycle; mypy strictness levels; Python type annotation syntax (Optional, Union, TypeVar, Generic, Protocol, TypedDict, Literal); Pyright vs mypy; Pydantic as runtime validation complement to mypy.
- **Voice tweaks:** beginner-friendly; pyramid + risk thinking same as Java P08. The Python-specific depth marker: "patch where it's used, not where it's defined" — this is the single most common pytest.mock mistake and should be the gotcha in every mocking comparison question.
- **Pillar-specific standard examples:**
  - `with patch('myapp.services.email.send') as mock:` (patch at usage site)
  - `@pytest.fixture(scope='session') def db_engine(): engine = create_engine(TEST_DB_URL); yield engine; engine.dispose()` (session-scoped fixture with teardown)
  - `@pytest.mark.parametrize('input,expected', [(2, 4), (3, 9)]) def test_square(input, expected): assert square(input) == expected` (parametrize)

---

### Python P10 — DevOps for Python

- **Modules in pillar:** `docker-python`, `cicd-python`, `packaging-dependencies`.
- **Topic must-includes:** Python-specific Dockerfile (copy requirements.txt first for layer caching, PYTHONDONTWRITEBYTECODE=1, PYTHONUNBUFFERED=1, non-root user, tini as PID 1 wrapper); multi-stage build for slim production image; gunicorn vs uvicorn as process manager; Docker Compose for local stack (FastAPI + Postgres + Redis + Celery); GitHub Actions for Python (ruff lint, mypy, pytest, docker build/push); deployment strategies for Python web services; pyproject.toml as the project metadata standard; Poetry dependency groups (main, dev, test); pip-compile for deterministic builds.
- **Voice tweaks:** beginner-friendly; sequence + blast radius same as Java P09. Python-specific: the layer-caching order is a depth marker — "copy requirements.txt before the source code so a code change doesn't invalidate the pip install layer."
- **Pillar-specific standard examples:**
  - Multi-stage: `FROM python:3.12-slim AS builder\nCOPY requirements.txt .\nRUN pip install --no-cache-dir -r requirements.txt\nFROM python:3.12-slim\nCOPY --from=builder /usr/local/lib ...`
  - GitHub Actions: `- uses: actions/setup-python@v5; pip install poetry; poetry install; poetry run pytest --cov`
  - `poetry add fastapi sqlalchemy --group main; poetry add pytest mypy ruff --group dev`

---

### Python P11 — Cloud & Production

- **Modules in pillar:** `aws-python`, `observability`, `production-sre`.
- **Topic must-includes:** boto3 client vs resource; credential chain (env vars → ~/.aws → instance metadata — never hardcode); S3 presigned URLs; Lambda in Python (handler signature, context.remaining_time_in_millis, cold starts, /tmp for temp storage); DynamoDB with boto3 (put_item, query on GSI, conditional updates); SQS consumer loop pattern; structured logging with structlog or logging + JSON formatter; OpenTelemetry instrumentation for FastAPI/Django; Prometheus metrics with prometheus-client; Sentry init with release tracking and sampling; py-spy for production profiling; SLI/SLO/SLA; incident response; blameless postmortem.
- **Voice tweaks:** **familiar** audience; war-room voice — calm, evidence-driven, named tools. Python-specific: "I ran py-spy top --pid 1234 and saw 80% of time in the ORM query builder" is the depth marker for production profiling. Always name the Python tool, not a generic "profiler."
- **Pillar-specific standard examples:**
  - `sentry_sdk.init(dsn=DSN, traces_sample_rate=0.05, release=os.environ['GIT_SHA'])` (Sentry production config)
  - `{"level":"INFO","trace_id":"abc","event":"order.placed","order_id":42}` (structured log line)
  - `py-spy top --pid $(pgrep -f gunicorn)` (production profiling without restart)

---

### Python P12 — Interview Readiness

- **Modules in pillar:** `behavioral`, `engineering-practices`.
- **Topic must-includes:** Identical to Java P12 — STAR method, self-introduction, conflict, failure, weakness, code review, technical debt, ADR, mentoring. Python-specific stories: the asyncio bug you spent three hours on, the Django migration that locked the table, the N+1 you found in production, the time you introduced type hints to a 40k-line Django codebase.
- **Voice tweaks:** Identical to Java P12 — first-person warmth, STAR rigour, reflection beat mandatory. The Python flavour: stories should feel like they happened at a real Django/FastAPI shop, not a generic "backend company." If the conflict was about "Django vs FastAPI", say so — it's the most common Python architecture debate and interviewers recognise it immediately.
- **Common archetypes:** G (almost exclusively). `engineering-practices` has a thin A layer for ADR and code-review concepts.

---

## Ruby Backend Intermediate — Track register

> Track ID: `ruby-backend-intermediate`. appRoot: `/ruby-backend-intermediate`. All 12 pillars use the same P01–P12 numbering; pillar *names* differ. The 7 archetypes, voice rules, lint rubric, and word ceilings are identical to the Java track. Version pin: **Ruby 3.3 / Rails 7.2**.

### Summary table

| Pillar | Modules | Dominant archetypes | Default audience | Key voice note |
|---|---:|---|---|---|
| P01 Ruby Language & Core | 6 | A, B, C, D | beginner | One tiny idiomatic Ruby shape per answer — block, symbol method, one-liner, enumerable chain. "Everything is an object" is the constant anchor. |
| P02 Rails Framework | 6 | A, C, D, E | beginner | Trace the request lifecycle every time (router → middleware → controller → model → view). Rails' value is convention — name the default and the override. |
| P03 Data & Active Record | 5 | A, B, C, D | beginner | Surface the trade-off — includes vs eager_load, scope vs class method, after_save vs after_commit. N+1 is the most-asked production question; every module has one. |
| P04 APIs & Serialization | 3 | A, B, C, D | beginner | Name the contract and the failure mode — the JSON shape, the auth header, what happens when the token expires. |
| P05 Background Jobs & Async | 3 | A, B, C, D | beginner | Three components mandatory: queue backend (Redis), worker process (Sidekiq), job result. Failure mode: "what happens when the worker crashes mid-perform?" |
| P06 Architecture & Design | 2 | E, A, B | familiar | Decision-first — "I'd reach for a service object here because...". In Ruby, Strategy is just passing a Proc; say so. |
| P07 System Design | 2 | F, A | familiar | Concrete capacity numbers — req/s, GB, ms. Rails context: Sidekiq workers, Redis cache, Rack::Attack, Russian doll caching. |
| P08 Security | 2 | A, C, D | beginner | Threat-model framing. "Rails protects you by default — these are the ways engineers accidentally turn that protection off." |
| P09 Testing | 3 | A, B, D | beginner | Pyramid + risk thinking. "Use `build_stubbed` for unit tests — no DB hit, 10x faster suite." Patch at usage site, not definition site. |
| P10 DevOps & Cloud | 1 | A, D, B | beginner | Sequence + blast radius. Layer-caching order: copy Gemfile before source. Asset precompile in build stage. |
| P11 Production & Observability | 1 | D, C, A | familiar | War-room voice — calm, evidence-driven, named tools. "I ran rbspy record --pid $(pgrep -f puma)" is the depth marker. |
| P12 Interview Readiness | 2 | G | beginner | First-person warmth; STAR rigour; reflection beat mandatory. Stories anchored to real Rails shops — N+1 in prod, Rails upgrade pain, Sidekiq idempotency lesson. |

> Total: 32 modules across 12 pillars (+ 1 behavioral module).

---

### Ruby P01 — Ruby Language & Core

- **Modules in pillar:** `ruby-language-core`, `ruby-oop-advanced`, `blocks-procs-lambdas`, `modules-and-mixins`, `metaprogramming`, `ruby-concurrency`.
- **Topic must-includes:** everything-is-an-object; BasicObject → Object → Module → Class hierarchy; Symbol vs String (interning, immutability, when each); freeze / frozen? / dup / clone; frozen_string_literal pragma; truthiness rules (only nil and false are falsy); `==` vs `equal?` vs `eql?` vs `<=>` and Comparable; duck typing and `respond_to?`; open classes and monkey-patching; `attr_accessor` internals; block vs Proc vs lambda (four key differences: return behaviour, arity enforcement, `===`, `lambda?`); `yield` and `block_given?`; `&block` and symbol-to-proc `&:method`; closures and captured variables; `Proc#curry`; `include` vs `extend` vs `prepend` MRO impact; Enumerable (just implement `each`, get everything); Comparable (just implement `<=>`); `method_missing` + `respond_to_missing?`; `define_method`; `send` vs `public_send`; `class_eval`; MRI GVL and what it prevents; Thread + Mutex; Fiber (cooperative); Ractor (Ruby 3, share-nothing); async gem basics; Puma vs Unicorn concurrency models.
- **Voice tweaks:** beginner-friendly; every answer must drop **one tiny idiomatic Ruby shape** — a block, a symbol method, a one-liner, an enumerable chain — so the listener can anchor visually. "Everything is an object" is the constant philosophical anchor. Never use Java as the primary frame; a brief aside is acceptable.
- **Pillar-specific standard examples:**
  - `[1, 2, 3].map { |n| n * 2 }.select(&:odd?)` (blocks + enumerable chain)
  - `User.new.tap { |u| u.name = 'Alice' }` (tap pattern)
  - `greet = ->(name) { "Hello, #{name}" }; greet.("Alice")` (stabby lambda call)
  - `module Greetable; def greet = "Hi, I'm #{name}"; end; class Person; include Greetable; end` (mixin)
  - `def method_missing(name, *); super unless name.to_s.start_with?('find_by_'); end` (method_missing)
- **Common archetypes:** A (every "what is" concept), B (`blocks-procs-lambdas` comparisons, Symbol vs String, include vs extend), C (GVL internals, Fiber cooperative scheduling, closure mechanics), D (scenario — frozen object error, thread-safety bug).

---

### Ruby P02 — Rails Framework

- **Modules in pillar:** `rails-mvc-core`, `action-controller`, `rails-routing`, `action-view-and-helpers`, `active-support-and-railtie`, `hotwire-turbo-stimulus`.
- **Topic must-includes:** Rails MVC architecture; Rack protocol and how middleware chains work; request lifecycle (router → middleware → controller → model → view/serializer → response); Zeitwerk autoloader; `before_action` / `after_action` / `around_action` execution order; strong parameters (`params.require.permit`) and mass assignment protection; `respond_to` and format negotiation; `render` vs `redirect_to`; `rescue_from`; RESTful routes (`resources`, `resource`, `member`, `collection`); route constraints; `namespace` vs `scope` vs `module` in routes; layouts and `content_for`/`yield`; partials and locals; `form_with` and CSRF token; helpers vs decorators vs ViewComponent; `ActiveSupport::Concern`; `Time.current` vs `Time.now`; `blank?` / `present?` / `presence`; Turbo Drive/Frames/Streams; Stimulus controller lifecycle; Hotwire vs SPA trade-offs.
- **Voice tweaks:** beginner-friendly; every answer must **trace the order of events** at least once. Rails' value is convention; name both the default and the override. "Rails protects you by default — these are the ways engineers accidentally turn protection off" applies here too (especially CSRF, strong params).
- **Pillar-specific standard examples:**
  - `before_action :authenticate_user!, only: [:create, :update, :destroy]`
  - `params.require(:user).permit(:name, :email, addresses: [:street, :city])`
  - `resources :orders do; member { post :cancel }; collection { get :pending }; end`
  - `<%= turbo_stream.append "messages", partial: "message", locals: { message: @message } %>`
- **Common archetypes:** A ("what is X in Rails"), C (Rack middleware internals, Zeitwerk), D (CSRF mismatch, N+1 in controller, 422 Unprocessable Entity debug), E (Turbo vs React decision).

---

### Ruby P03 — Data & Active Record

- **Modules in pillar:** `active-record-core`, `active-record-associations`, `active-record-query`, `active-record-migrations`, `sequel-and-raw-sql`.
- **Topic must-includes:** Active Record pattern vs Data Mapper; CRUD + bang variants; validations (presence, uniqueness, custom validator objects); dirty tracking; callbacks full list + execution order; `after_commit` vs `after_save` (transaction scope); scopes vs class methods; `default_scope` danger; STI trade-offs; counter_cache; optimistic locking (`:lock_version`); pessimistic locking (`with_lock`); `belongs_to` (required by default), `has_many`, `has_one`, `has_many :through` vs `has_and_belongs_to_many`; polymorphic associations; `inverse_of`; `dependent:` options; N+1 diagnosis (Bullet gem) and fixes — `includes` (auto-chooses), `preload` (separate IN query), `eager_load` (LEFT OUTER JOIN — use when WHERE on association); Arel; `find_each` / `find_in_batches`; `pluck` vs `select`; `exists?` vs `any?` vs `count`; migrations (change vs up/down, reversible, zero-downtime patterns); `schema.rb` vs `structure.sql`; Sequel gem vs Active Record trade-offs.
- **Voice tweaks:** beginner-friendly; every answer must **surface a trade-off**. N+1 is the most-asked question in this pillar — every module has at least one N+1 scenario question. Show the SQL generated, not just the Ruby.
- **Pillar-specific standard examples:**
  - `User.includes(posts: :comments).where(active: true)`
  - `Order.where(status: :pending).joins(:customer).where(customers: { tier: 'gold' })`
  - `Post.find_each(batch_size: 500) { |p| p.update(cached_score: compute(p)) }`
  - `after_commit :send_welcome_email, on: :create`
- **Common archetypes:** A (CRUD, validations, associations), B (includes vs preload vs eager_load, scope vs class method, STI vs polymorphic), C (query execution pipeline, N+1 tracing), D (slow query — trace via EXPLAIN ANALYZE, fix with index + eager load).

---

### Ruby P04 — APIs & Serialization

- **Modules in pillar:** `rails-api-mode`, `graphql-ruby`, `authentication-and-authorization`.
- **Topic must-includes:** `ActionController::API` vs Base; CORS via `rack-cors`; serialization choices (Jbuilder, ActiveModelSerializer, `jsonapi-serializer`, Alba) with trade-offs; API versioning strategies; pagination (Kaminari, Pagy, cursor-based); Rack::Attack for rate limiting; Devise + `devise-jwt` for token auth; Doorkeeper for OAuth 2.0; JWT structure and algorithm confusion attack (always specify algorithm); Pundit policy objects; CanCanCan Ability class; graphql-ruby types/resolvers/mutations; N+1 in GraphQL with `graphql-batch` / DataLoader; GraphQL subscriptions over ActionCable.
- **Voice tweaks:** beginner-friendly; every answer must **name the contract and the failure mode**. API answers without a named failure mode are warning-flagged.
- **Pillar-specific standard examples:**
  - `class UserSerializer; include Alba::Resource; attributes :id, :name, :email; end`
  - `Rack::Attack.throttle('api/ip', limit: 100, period: 1.minute) { |req| req.ip }`
  - `class PostPolicy < ApplicationPolicy; def update? = record.user_id == user.id; end`
- **Common archetypes:** A (JWT, Devise basics), B (Jbuilder vs AMS vs JSONAPI Serializer, Pundit vs CanCanCan, session vs JWT), C (JWT internals, GraphQL DataLoader), D (403 on Pundit check — debug, JWT expired — debug).

---

### Ruby P05 — Background Jobs & Async

- **Modules in pillar:** `sidekiq-deep`, `active-job-and-action-mailer`, `action-cable-and-pub-sub`.
- **Topic must-includes:** Sidekiq architecture (Redis list, polling); worker definition; `perform_async` / `perform_in` / `perform_at`; queue naming and priority; retry mechanism with exponential backoff; dead set; idempotency (mandatory — retries are guaranteed); Sidekiq middleware; `Sidekiq::Web` UI; `sidekiq-cron`; Sidekiq vs Resque vs GoodJob vs Delayed::Job; ActiveJob adapters; `deliver_later` vs `deliver_now`; ActionCable channel lifecycle; Redis pub/sub for multi-process broadcast; `turbo_stream_from`; SSE vs WebSocket vs polling; scaling ActionCable.
- **Voice tweaks:** beginner-friendly; every answer must name the **three components**: queue backend (Redis), worker process (Sidekiq), job result/side effect. Failure mode depth marker: "what happens to the job when the worker crashes mid-perform?"
- **Pillar-specific standard examples:**
  - `class SendEmailWorker; include Sidekiq::Worker; sidekiq_options retry: 3, queue: :critical; def perform(user_id); ...; end; end`
  - Idempotency pattern: `return if order.invoiced?` as first line of `perform`
- **Common archetypes:** A (Sidekiq basics), B (Sidekiq vs GoodJob, perform_async vs perform_in), C (Redis polling internals, retry backoff), D (silent job failure — debug dead set, ActionCable not broadcasting — debug Redis adapter).

---

### Ruby P06 — Architecture & Design

- **Modules in pillar:** `design-patterns-ruby`, `clean-architecture-ruby`.
- **Topic must-includes:** SOLID in Ruby; service objects (SRP extraction from models); form objects; query objects; decorators (`SimpleDelegator` or Draper); presenters; value objects; policy objects; interactor pattern; strategy via Proc/lambda; observer via `ActiveSupport::Notifications`; command object; hexagonal architecture with Ruby `Protocol`-style duck-typed ports; dry-rb ecosystem basics (`dry-validation`, `dry-types`, `dry-monads`); DDD entities and value objects; Concerns vs service objects — when each.
- **Voice tweaks:** **familiar** audience; opens with the decision. "In Ruby, Strategy is just passing a Proc." Lead with the Ruby idiom, not the GoF diagram.
- **Pillar-specific standard examples:**
  - `class CreateOrder; def initialize(params, mailer: OrderMailer); ...; end; def call; ...; end; end`
  - `class PremiumUser < SimpleDelegator; def discount = 0.2; end`
  - `Money = Struct.new(:amount, :currency) { def +(other) = Money.new(amount + other.amount, currency) }`
- **Common archetypes:** E (decision-first), B (service object vs concern vs model method, dry-monads vs plain Ruby), A (SOLID in Ruby context).

---

### Ruby P07 — System Design

- **Modules in pillar:** `system-design-fundamentals`, `system-design-cases`.
- **Topic must-includes:** CAP theorem; caching strategies in Rails (fragment caching, Russian doll caching, HTTP caching/ETags, Redis cache store); Rack::Attack for rate limiting; `ActiveRecord::Base.connected_to` for read replicas; Rails multi-DB support; Sidekiq scaling on queue depth; Flipper for feature flags; URL shortener at 10M URLs/day; rate limiter at 1M req/s; news feed fan-out; chat with ActionCable + Redis; multi-tenancy approaches (row-level, schema-per-tenant with Apartment gem); file upload pipeline (ActiveStorage + S3 + background variant generation); full-text search (pg_search, searchkick).
- **Voice tweaks:** **familiar** audience; concrete numbers mandatory. Ruby context: "design a notification service for 5M users" → "Sidekiq workers on ECS with Redis as broker, fan-out via Sidekiq batches, APNs/FCM via separate low-priority workers."
- **Pillar-specific standard examples:**
  - Russian doll caching: `cache [product, product.reviews] do ... end`
  - `ActiveRecord::Base.connected_to(role: :reading) { User.where(...) }`
- **Common archetypes:** F (almost exclusively — case studies), A (fundamentals page), E (architecture decisions — multi-tenancy approach, caching tier).

---

### Ruby P08 — Security

- **Modules in pillar:** `rails-security`, `auth-secrets-and-scanning`.
- **Topic must-includes:** Rails CSRF via `protect_from_forgery`; XSS via auto-escaping in ERB (`html_safe` danger); SQL injection prevention (never string interpolation in `where`); mass assignment protection via strong params; `X-Frame-Options` clickjacking; OWASP Top 10 mapped to Rails; session fixation and `reset_session`; `Content-Security-Policy` header; `bundler-audit` for CVE scanning; Brakeman for SAST; JWT algorithm confusion attack; `has_secure_password` + bcrypt; `ActiveSupport::SecurityUtils.secure_compare` for timing-safe comparison; secrets via `Rails.application.credentials` or ENV; Dependabot.
- **Voice tweaks:** beginner-friendly; threat-model framing always. "Rails protects you by default — these are the ways engineers accidentally turn that protection off."
- **Pillar-specific standard examples:**
  - `<%= @user_content %>` (auto-escaped, safe) vs `<%= raw @user_content %>` (XSS risk)
  - `User.where("email = '#{params[:email]}'")` (SQLi — wrong) vs `User.where(email: params[:email])` (right)
  - `ActiveSupport::SecurityUtils.secure_compare(token_db, token_request)`
- **Common archetypes:** A (what is X security concept), C (CSRF mechanism, JWT internals), D (Brakeman flagged SQLi — debug, XSS in bug bounty — reproduce and fix).

---

### Ruby P09 — Testing

- **Modules in pillar:** `rspec-advanced`, `factory-bot-capybara`, `test-doubles-contract`.
- **Topic must-includes:** `let` (lazy) vs `let!` (eager); `subject` and `described_class`; shared examples for DRY contract testing; custom matchers; `aggregate_failures`; FactoryBot `build_stubbed` vs `build` vs `create` cost hierarchy; factory traits and sequences; FactoryBot associations; Capybara `visit`/`fill_in`/`click_button` / `js: true` / headless Chrome; DatabaseCleaner (transaction for unit, truncation for JS system tests); `instance_double` / `class_double` (verifying doubles); WebMock `stub_request`; VCR cassettes; Pact contract testing; testing background jobs (`have_enqueued_job`).
- **Voice tweaks:** beginner-friendly; pyramid + risk thinking. Depth marker: "use `build_stubbed` for unit tests — no DB hit, 10x faster suite." Ruby-specific: "patch where it's used, not where it's defined" applies to RSpec doubles too.
- **Pillar-specific standard examples:**
  - `let(:user) { build_stubbed(:user, :premium) }`
  - `shared_examples 'a paginated endpoint' do; it { expect(response).to include_pagination_headers }; end`
  - `stub_request(:post, 'https://api.stripe.com/v1/charges').to_return(body: stripe_fixture)`
  - `expect(OrderMailer).to have_enqueued_mail(:welcome_email).with(order)`
- **Common archetypes:** A (RSpec syntax, FactoryBot basics), B (let vs let!, build vs create vs build_stubbed, mock vs stub vs spy), D (flaky test — DatabaseCleaner strategy, slow suite — switch to build_stubbed).

---

### Ruby P10 — DevOps & Cloud

- **Modules in pillar:** `docker-rails-and-deployment`.
- **Topic must-includes:** Rails-specific Dockerfile (Gemfile before source for layer caching; asset precompile in build stage; non-root user; `RAILS_ENV=production`; multi-stage to drop build tools); Kamal deploy.yml; traefik reverse proxy; zero-downtime deploy patterns (add column before code deploy, remove after; feature flags); Heroku Procfile (`web: bundle exec puma`, `worker: bundle exec sidekiq`); GitHub Actions for Rails (setup-ruby with bundler-cache, rspec, rubocop, docker build/push); `DATABASE_URL` env var pattern; health check endpoint.
- **Voice tweaks:** beginner-friendly; sequence + blast radius. Layer-caching depth marker: "copy Gemfile before the source code so a code change doesn't invalidate the bundle install layer."
- **Pillar-specific standard examples:**
  - Multi-stage Dockerfile: `FROM ruby:3.3-slim AS builder\nCOPY Gemfile* .\nRUN bundle install\n...`
  - `web: bundle exec puma -C config/puma.rb` (Procfile)
- **Common archetypes:** A (Dockerfile, Kamal basics), D (container fails — master key missing, assets 404 — precompile in build stage), B (Kamal vs Heroku, Puma vs Unicorn in container).

---

### Ruby P11 — Production & Observability

- **Modules in pillar:** `observability-and-production`.
- **Topic must-includes:** Lograge (single-line JSON log replacing Rails' multi-line format); Semantic Logger; correlation IDs via Rack middleware or `Thread.current`; `rack-mini-profiler` for development profiling; Skylight / Scout / Datadog APM for production traces; `derailed_benchmarks` for memory; `memory_profiler` gem; `stackprof` for CPU; `rbspy` for production profiling without restart; Sentry error tracking (`Sentry.capture_exception`, release tracking, sampling); N+1 detection in production (strict_loading!, SQL log pattern matching); the four golden signals (p99 latency, req/s, 5xx error rate, DB pool saturation); SLI/SLO/SLA for Rails; `Rack::Timeout`; blameless post-mortem template.
- **Voice tweaks:** **familiar** audience; war-room voice. Depth marker: "I ran `rbspy record --pid $(pgrep -f puma) --duration 30` and saw 60% of samples in the ORM query builder."
- **Pillar-specific standard examples:**
  - Lograge: `config.lograge.enabled = true; config.lograge.formatter = Lograge::Formatters::Json.new` + correlation_id in `custom_options`
  - `Sentry.init { |c| c.dsn = ENV['SENTRY_DSN']; c.traces_sample_rate = 0.05; c.release = ENV['GIT_SHA'] }`
  - Four golden signals dashboard: p99 latency, req/s, 5xx rate, DB pool wait
- **Common archetypes:** D (production debugging, incident response), C (Lograge internals, APM tracing), A (SLI/SLO/SLA fundamentals).

---

### Ruby P12 — Interview Readiness

- **Modules in pillar:** `behavioral`, `engineering-practices`.
- **Topic must-includes:** STAR method; self-introduction for a Rails developer; conflict resolution; failure stories; weakness question; delivering under pressure (Rails upgrade, production incident); code review culture; ADRs; technical debt in a Rails app; mentoring stories; technical leadership.
  - **Ruby-specific story hooks:** the N+1 you found in production; the Rails upgrade (5→6, 6→7) that broke something unexpected; the Sidekiq job you wrote before you understood idempotency; the service object refactor that made the model actually testable; the time you used `method_missing` and later had to undo it.
- **Voice tweaks:** first-person warmth; STAR rigour; reflection beat mandatory. Stories should feel like they happened at a real Rails shop. If the conflict was "Rails monolith vs microservices," say so — it's the most common Ruby architecture debate.
- **Common archetypes:** G (almost exclusively). `engineering-practices` has a thin A layer for ADR and code-review concepts.

---

## Ruby Backend Fresher — Track register

> Track ID: `ruby-backend-fresher`. appRoot: `/ruby-backend-fresher`. Uses 8 of 12 pillars (P01, P02, P03, P04, P06, P08, P09, P12). Difficulty default: 60% easy / 35% medium / 5% hard. Version pin: **Ruby 3.3 / Rails 7.2**.

### Summary table

| Pillar | Modules | Dominant archetypes | Default audience | Key voice note |
|---|---:|---|---|---|
| P01 Ruby Language Basics | 5 | A, B | beginner | Define every term on first use. Anchor: "everything is an object" + "last expression is the return value". Every example must run standalone. |
| P02 Rails Basics | 2 | A, B | beginner | Trace request → response for every Rails answer. Keep at "how Rails plumbs things" — no Rack, no middleware internals. |
| P03 Active Record Basics | 1 | A, B | beginner | Show the Ruby method call AND the SQL it generates. Never show an association without mentioning the foreign key it relies on. |
| P04 REST API Basics | 1 | A, B | beginner | Every answer shows HTTP method + URL + expected status code. Keep it Postman-practical. |
| P06 OOP & Design Basics | 1 | A, B | beginner | Stay at "design thinking" level — four OOP pillars, DRY, method naming. No service objects. |
| P08 Testing Basics | 1 | A | beginner | One assertion per test. "A good test has a clear setup, one action, one assertion." |
| P09 Git & Bundler Basics | 1 | A | beginner | Anchor: working directory → staging → commit → remote. Bundler ensures every developer runs the same gem versions. |
| P12 Behavioral & Fresher Q&A | 1 | G | beginner | First-person warmth. STAR structure but conversational. Ruby-specific story hooks: "the first time blocks clicked for me was…" |

> Total: 13 modules across 8 pillars.

---

### Ruby Fresher P01 — Ruby Language Basics

- **Modules in pillar:** `ruby-language-basics`, `ruby-oop-basics`, `blocks-and-iterators`, `error-handling-basics`, `ruby-modules-basics`.
- **Topic must-includes (ruby-language-basics):** data types (Integer, Float, String, Symbol, Boolean, NilClass, Array, Hash); variables (local, instance, class, global, constants); string interpolation; single vs double-quoted strings; nil and truthiness (only nil and false are falsy; 0 and "" are truthy); Symbol vs String basics; Array operations (push/<<, pop, first, last, include?, flatten, compact, uniq); Hash operations ([], fetch, each, keys, values, merge, any?, all?); conditionals (if/elsif/unless/case); loops (while, until, times, upto); method definition with default/keyword/splat args; last-expression return; `puts` vs `print` vs `p`; freeze and frozen?; type conversions (to_s, to_i, to_f).
- **Topic must-includes (ruby-oop-basics):** class definition and instantiation; `initialize`; instance variables and instance methods; `attr_accessor` / `attr_reader` / `attr_writer`; class methods (`self.create`); inheritance with `<`; `super`; public/private/protected; duck typing; `self` in context; `to_s` override; class variables (`@@count`) and their danger; `Object#class`, `is_a?`, `respond_to?`; everything is an object.
- **Topic must-includes (blocks-and-iterators):** block syntax (`do...end` vs `{}`); `yield` and `block_given?`; `each`, `map`, `select`, `reject`, `find`, `reduce`, `any?`, `all?`, `none?`, `count`, `sort`, `sort_by`; `each_with_index`; symbol-to-proc `&:upcase`; chaining; `each` vs `map` return value difference.
- **Topic must-includes (error-handling-basics):** begin/rescue/ensure/end; `raise` with message vs class; `Exception` hierarchy (rescue catches StandardError by default); capturing `=> e`; `ensure` always runs; `retry` with counter; custom exception classes; `rescue` as statement modifier.
- **Topic must-includes (ruby-modules-basics):** module as namespace; `include` for instance methods; `extend` for class methods; Enumerable (implement `each`, get everything); Comparable (implement `<=>`, get comparison operators); `ancestors` chain; why Ruby uses mixins over multiple inheritance.
- **Voice tweaks:** define every term on first use; every code example must run standalone; anchor each answer with "in Ruby, X means…"; avoid internals.
- **Pillar-specific standard examples:**
  - `[1, 2, 3, 4].select(&:even?).map { |n| n * 10 }  # => [20, 40]`
  - `class Dog < Animal; def speak = "Woof!"; end`
  - `begin; risky(); rescue NetworkError => e; retry if (retries += 1) < 3; end`

---

### Ruby Fresher P02 — Rails Basics

- **Modules in pillar:** `rails-basics`, `rails-forms-and-views`.
- **Topic must-includes (rails-basics):** What is Rails? Convention over configuration, DRY, MVC; directory structure; routes (`resources :posts` generates 7 routes); controller basics (inherits from ApplicationController, actions as public methods, `params` hash); `render` vs `redirect_to`; instance variables in controllers available in views; Rails naming conventions; `before_action`; flash messages; `rails c`, `rails s`, `rails routes`; scaffold/generate basics; `db:migrate`, `db:rollback`.
- **Topic must-includes (rails-forms-and-views):** ERB syntax (`<%= %>`, `<% %>`, `<%# %>`); layouts and `yield`; partials and locals; `form_with model: @post`; `link_to`, `button_to`, `image_tag`; `content_for`; flash display in layout; simple table with `.each` in ERB; `humanize`, `titleize`, `pluralize`.
- **Voice tweaks:** trace the request lifecycle for every answer; no Rack/middleware internals; examples recognisable from a basic scaffold.

---

### Ruby Fresher P03 — Active Record Basics

- **Modules in pillar:** `active-record-basics`.
- **Topic must-includes:** ORM concept; Model naming convention (Post → posts, user_id FK); `rails generate model`; migrations (change method, `db:migrate`, `db:rollback`); schema.rb (don't edit manually); CRUD — `create`, `find`, `find_by`, `all`, `where`, `update`, `save`, `destroy`; `save` vs `save!` vs `create` vs `create!`; validations (`presence`, `uniqueness`, `format`); `valid?` and `errors.full_messages`; associations basics (`belongs_to`, `has_many`, `dependent: :destroy`); `has_many :through` at concept level; scopes basics; callbacks basics (`before_save`, `after_create`); `ActiveRecord::RecordNotFound`.
- **Voice tweaks:** show the Ruby method AND the SQL it generates; never show an association without mentioning the foreign key.

---

### Ruby Fresher P04 — REST API Basics

- **Modules in pillar:** `rest-api-basics`.
- **Topic must-includes:** REST concept (resources, statelessness); HTTP verbs (GET/POST/PUT/PATCH/DELETE); status codes (200, 201, 204, 400, 401, 403, 404, 422, 500); JSON (`JSON.parse`, `JSON.generate`, `render json:`); `ActionController::API`; route namespacing for versioning; reading `params` from JSON body; CSRF in API mode; Postman/curl basics; `before_action :authenticate_user!` pattern at concept level.
- **Voice tweaks:** every answer shows HTTP method + URL + expected status. "Keep it Postman-practical."

---

### Ruby Fresher P06 — OOP & Design Basics

- **Modules in pillar:** `oop-and-design-basics`.
- **Topic must-includes:** four OOP pillars (encapsulation, abstraction, inheritance, polymorphism) with Ruby examples; "fat model, skinny controller" at concept level; DRY — recognising duplication and extracting a method; Keep It Simple; `BankAccount` design exercise; when to use module vs class; method naming (? for predicates, ! for mutating); SOLID first two (SRP, OCP) at concept level.

---

### Ruby Fresher P08 — Testing Basics

- **Modules in pillar:** `rails-testing-basics`.
- **Topic must-includes:** why test (regression safety, documentation); test pyramid basics; Minitest assertions; RSpec `describe`/`it`/`expect`; `rails test` vs `bundle exec rspec`; model tests (validations); controller tests (response status); fixtures vs FactoryBot at concept level; test database; red-green-refactor cycle.

---

### Ruby Fresher P09 — Git & Bundler Basics

- **Modules in pillar:** `git-and-bundler-basics`.
- **Topic must-includes:** `git init/clone/status/add/commit/push/pull`; branches and PRs; `.gitignore`; merge conflict basics; `bundle install`, `bundle exec`, `bundle update`; Gemfile and version constraints (`~>`, `>=`); Gemfile.lock (commit it); `gem install` vs bundler; semantic versioning; `bundle outdated`; `.ruby-version` file.

---

### Ruby Fresher P12 — Behavioral & Fresher Q&A

- **Modules in pillar:** `behavioral-and-fresher-qa`.
- **Topic must-includes:** self-introduction (60-second About Me); "why Ruby/Rails?"; talking about projects (STAR basics); "favourite Ruby feature"; debugging story; "learned something new quickly"; weakness question; "where do you see yourself in 2 years?"; "why this company?"; questions to ask the interviewer; handling "I don't know" gracefully; how to stay current (RubyWeekly, Rails blog).
- **Voice tweaks:** first-person warmth; STAR but conversational; story hooks: "the first time blocks clicked for me was…", "I noticed the N+1 in the server log…"

---

## Cross-references (Ruby tracks)

- Full spec: `expansion-plan/81-ruby-backend-intermediate-spec.md` (RBI) and `expansion-plan/82-ruby-backend-fresher-spec.md` (RBF).
- Execution plan: `expansion-plan/57-ruby-track-fullsize.md` (content generation + locked-domain registration steps).
- Ruby-specific anti-pattern fingerprint and idiom rules: `expansion-plan/81-ruby-backend-intermediate-spec.md` §Ruby-specific anti-pattern checklist.
