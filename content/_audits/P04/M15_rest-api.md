# Audit — rest-api

**Pillar:** P04 Web & Distributed Systems
**Module:** M15 rest-api
**Topics present:** 11 (of 14 — `rest-client-and-feign`, `http-caching-and-compression`, `comparisons` have 0 questions)
**Questions:** 52 (all written, no stubs)
**Benchmark sources:** MDN ("HTTP methods", "HTTP caching"), Baeldung ("A Guide to Spring MVC", "Spring @RequestMapping", "Introduction to WebSockets with Spring"), Spring docs, graphql-java docs, grpc.io, REST API Design Rulebook (Mark Massé)

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Opening bolds the HTTP method/status/pattern being discussed — `**PUT**` vs `**PATCH**`, `**202 Accepted**`, `**@RestController**` | **Failing across the whole module** — 0 of 52 direct_answers have bold anchors |
| REST content is **example-first** — every concept has a `curl`/JSON/request-body snippet | **Failing for 13 questions** — 13 substantive Zone 3s have zero code. Critical for REST where code = the concept |
| Benchmark sites split WebSockets from REST scenarios — our 10 WebSocket Qs sit under `scenario-based` | Organization issue — scenario-based topic is ~77% WebSockets, deserves its own topic |
| GraphQL / gRPC content consistently shows schema files + resolver/stub code | **Matching well** — our graphql & grpc topics are the **best-shaped content in the project** |
| `/rest` topic always covers RestTemplate → WebClient → OpenFeign client options | **Failing** — `rest-client-and-feign` topic has 0 questions |
| HTTP caching (ETag, Cache-Control, conditional GET) is always in a REST module | **Failing** — `http-caching-and-compression` topic has 0 questions |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | MISSING TOPIC | **MAJOR** | **`rest-client-and-feign` has 0 questions.** Standard interview territory: `RestTemplate` vs `WebClient` (reactive) vs `OpenFeign`, connection pooling, retry + circuit breaker integration. Suggest 3 questions |
| S2 | MISSING TOPIC | **MAJOR** | **`http-caching-and-compression` has 0 questions.** Must-have content: `Cache-Control`, `ETag` + `If-None-Match` conditional requests, `Vary`, `Last-Modified`, gzip/br compression. Suggest 2 questions |
| S3 | MISSING TOPIC | **MAJOR** | **`comparisons` has 0 questions.** Q11 in `graphql-with-spring` (`grpc-vs-rest-vs-graphql`) is really a comparisons-topic question and should be moved |
| S4 | TOPIC ORGANIZATION | **MAJOR** | **`scenario-based` is 77% WebSockets** (10 of 13). These should be their own topic `websockets-and-realtime`. Remaining 3 (rate-limiting, CORS/CSRF security, protobuf generation) can stay in `scenario-based` or move out |
| S5 | MODULE-WIDE ZONE 1 | **MAJOR** | 52 of 52 `direct_answers` have zero bold anchors. 4 are paragraph walls (Q1 grpc-service-types, Q6 grpc-deadlines, Q11 grpc-vs-rest-vs-graphql) |
| S6 | CODE-MISSING ZONE 3 | **MAJOR** | 13 substantive Zone 3s (>400w) with **zero code**. REST content without code samples is the highest-friction format — users can't copy/paste |
| S7 | ERROR-HANDLING THIN | **MODERATE** | `error-handling` topic has only 1 question (`@ControllerAdvice`). Missing: RFC 7807 `ProblemDetail` (Spring 6+ / Boot 3+ standard), error-envelope design, validation error translation |
| S8 | API-DESIGN THIN | **MODERATE** | `api-design` topic has only 1 question (DTO). Missing: resource vs action URL design, naming conventions (plural nouns, kebab-case), consistent error envelope, API lifecycle/deprecation |

---

## Per-topic summary (focusing on substantive issues, skipping the universal "no-bold" entries)

### `rest-fundamentals` (5 Qs) — strong topic, code-missing is the main gap

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** what-makes-api-restful-constraints | 531w / 0 code — but REST constraints are inherently non-code. Analogy present. Stays as-is | MINOR (bold only) |
| **Q2** http-status-codes-decision-guide | 531w / 1 code — the defining artifact for this Q is a decision table; confirm present. Missing analogy OK (concrete topic) | MINOR |
| **Q3** idempotency-in-rest-apis | 518w / **0 code** — must show an idempotency-key pattern (client sends `Idempotency-Key` header, server dedupes). Standard in Stripe/Twilio docs | **MODERATE** |
| **Q4** put-vs-patch-http-difference | 544w / **0 code** — must show a `PUT` full-replacement body vs a `PATCH` JSON Merge Patch / JSON Patch body side-by-side. This is the comparison's entire point | **MODERATE** |
| **Q5** http-methods-get-post-put-delete-patch | 499w / **0 code** — must show at least one `curl` example per method. Table without examples is reference-doc-style, not interview-style | **MODERATE** |

### `spring-mvc-controllers` (7 Qs) — solid structure, code-missing on the two core questions

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** spring-mvc-request-lifecycle | 615w / **0 code** — `DispatcherServlet` → `HandlerMapping` → `HandlerAdapter` → `Controller` → `ViewResolver` flow begs for at least one snippet (maybe a minimal filter/interceptor to illustrate the order). Missing analogy — "air-traffic controller routing planes to gates" is the benchmark one | **MODERATE** |
| **Q2** restcontroller-vs-controller-responsebody | 457w / **0 code** / analogy in speakable — must show `@Controller + @ResponseBody` vs `@RestController` side-by-side code. That IS the comparison | **MODERATE** |
| **Q3** handlerinterceptor-vs-filter | 647w / 2 code — good. Missing analogy (optional) | MINOR |
| **Q4** cors-configuration-spring-mvc | 632w / 2 code — good | MINOR |
| **Q5** async-controllers-deferred-result-completable-future | 748w / **0 code** / analogy in Zone 3 — `CompletableFuture<ResponseEntity>` + `DeferredResult<ResponseEntity>` + `Callable<ResponseEntity>` all need tiny snippets. The 3-way comparison without code is opaque | **MODERATE** |
| **Q6** content-negotiation-spring-mvc | 509w / 2 code / analogy present | MINOR |
| **Q7** response-entity-spring-mvc | 435w / 2 code / analogy present | MINOR |

### `request-and-response-handling` (3 Qs)

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** validation-valid-constraintvalidator | 471w / 2 code — good. Missing link to error-handling topic (how invalid input turns into a proper ProblemDetail response) | MINOR |
| **Q2** pagination-cursor-vs-offset | 415w / 1 code — good. Overlaps with `graphql-pagination-cursor-vs-offset` (Q8 graphql) — confirm they're framed differently (REST links/cursor headers vs GraphQL `edges`/`pageInfo`) | MINOR |
| **Q3** file-upload-download-spring-boot | 421w / 2 code — good | MINOR |

### `api-design` (1 Q) — topic too thin

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** dto-pattern-request-response | 504w / 2 code — good individually, but the topic itself is thin | MINOR |

**Topic gap** — add at least: `rest-resource-naming-conventions` (plural nouns, kebab-case, no verbs in URLs, sub-resources), `rest-error-envelope-design` (consistent shape, RFC 7807 ProblemDetail).

### `error-handling` (1 Q) — topic too thin

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** exception-handler-controller-advice | 495w / 1 code / analogy — good individually | MINOR |

**Topic gap** — add: `problem-detail-rfc-7807-spring-6` (Spring 6/Boot 3 standard — `ProblemDetail` + `ErrorResponse`), `validation-error-translation` (MethodArgumentNotValidException → structured response).

### `openapi-and-swagger` (1 Q)

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** openapi-swagger-springdoc | 532w / 3 code / analogy — **CLEAN** apart from bold anchors | MINOR (bold only) |

### `hateoas` (1 Q)

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** hateoas-spring-boot | 498w / 1 code / analogy — good. Consider one more snippet showing `EntityModel` → `Link` assembly | MINOR |

### `rest-client-and-feign` (0 Qs) — **MAJOR topic gap**

Suggested questions:
- `resttemplate-vs-webclient-when-to-pick` — RestTemplate (blocking, in maintenance mode since Spring 5), WebClient (reactive, drop-in for blocking use), OpenFeign (declarative). Connection pooling configuration.
- `openfeign-with-spring-boot-resilience` — `@FeignClient`, integration with Resilience4j, retry, fallback.
- `webclient-error-handling-and-timeouts` — `onStatus(...)`, `responseTimeout`, connection vs read timeout distinction.

### `http-caching-and-compression` (0 Qs) — **MAJOR topic gap**

Suggested questions:
- `http-caching-headers-cache-control-etag` — `Cache-Control: max-age/no-cache/private/public`, `ETag` + `If-None-Match` → `304 Not Modified`, `Vary` for per-header caching.
- `response-compression-spring-boot` — `server.compression.enabled`, content-type gating, gzip vs br.

### `versioning` (1 Q)

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** api-versioning-uri-header-media-type | 497w / 1 code / recommendation present — good | MINOR |

### `graphql-with-spring` (11 Qs) — **best-shaped topic in this module**

Every question has: ✓ bulleted-subheader speakable, ✓ analogy, ✓ recommendation closer, ✓ 200–300w speakable length. Universal fingerprint matches the benchmark GraphQL content almost exactly.

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** graphql-vs-rest-when-to-choose | 662w / **0 code** — comparison table likely exists but should show a side-by-side: REST multi-endpoint vs single GraphQL query fetching the same data | MODERATE |
| **Q2**–Q7, Q9, Q10 | All have adequate code (3–5 blocks each) and full speakable shape | MINOR |
| **Q8** graphql-pagination-cursor-vs-offset | 593w / **0 code** — Relay-spec `edges`/`pageInfo` or Spring-GraphQL's `ScrollSubrange` snippet needed | MODERATE |
| **Q11** grpc-vs-rest-vs-graphql | 610w / **0 code**, paragraph wall (63w) — **belongs in `comparisons` topic**, not here. Also needs at least one snippet per protocol | MODERATE + MOVE |

### `grpc-basics` (8 Qs) — also very well-shaped

Every Q has ✓ recommendation closer, ✓ 200–300w speakables. Analogies present in about half.

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** grpc-service-types-java | Paragraph wall (62w, no bold). 497w / 2 code — good. Bold the 4 service types: `**unary**`, `**server streaming**`, `**client streaming**`, `**bidirectional streaming**` | MODERATE |
| **Q2** grpc-server-spring-boot-setup | 516w / **5 code** — excellent | MINOR (bold only) |
| **Q3** grpc-interceptors-auth-logging | 447w / 3 code / analogy | MINOR |
| **Q4** grpc-error-handling-status-codes | 452w / 3 code | MINOR |
| **Q5** grpc-vs-rest-performance | 489w / **0 code** / analogy — perf comparison without benchmark numbers is incomplete. Add measured latency/throughput numbers if available | MODERATE |
| **Q6** grpc-deadlines-cancellation-java | Paragraph wall (67w, no bold). 582w / 2 code / analogy — good. Bold `**deadlines**` (not timeouts), `**context propagation**`, `**CancelledException**` | MODERATE |
| **Q7** grpc-health-checking-protocol | 526w / 3 code | MINOR |
| **Q8** testing-grpc-services-java | 508w / 3 code | MINOR |

### `scenario-based` (13 Qs) — reorganize

| Q | Substantive issue | Severity |
|---|---|---|
| **Q1** protocol-buffers-define-generate-java | 509w / 3 code — belongs in `grpc-basics` rather than scenario-based | MINOR + MOVE |
| **Q2** rest-api-security-cors-csrf | 550w / 2 code — OK | MINOR |
| **Q3** rest-rate-limiting-implementation | 619w / **0 code** — must show Bucket4j / Redis-backed sliding-window snippet. Rate-limiting without code is pure theory | **MODERATE** |
| **Q4** websocket-vs-http-polling-vs-sse | 599w / **0 code** / analogy — this is a comparison question; at least show `EventSource` (SSE) vs `new WebSocket(...)` (client-side) to anchor the difference | MODERATE |
| **Q5** spring-boot-websocket-stomp-setup | 608w / 4 code — **CLEAN** | MINOR (bold only) |
| **Q6** websocket-handshake-upgrade-process | 733w / 2 code | MINOR |
| **Q7** spring-message-broker-configuration | 569w / 3 code | MINOR |
| **Q8** websocket-security-authentication | 624w / 3 code | MINOR |
| **Q9** scaling-websockets-redis-pubsub | 791w / 3 code | MINOR |
| **Q10** sockjs-fallback-older-browsers | 438w / 1 code — possibly thin on code; SockJS fallback sequence visualization helps | MINOR |
| **Q11** websocket-vs-sse-detailed-comparison | 569w / 1 code — overlaps heavily with Q4 (websocket-vs-http-polling-vs-sse). Consider merging or sharpening scope | MINOR + OVERLAP |
| **Q12** testing-websocket-endpoints-spring | 523w / 3 code — **CLEAN** | MINOR (bold only) |
| **Q13** websocket-heartbeats-connection-management | 776w / 3 code | MINOR |

**Recommendation:** move Q1 (protobuf) into grpc-basics; promote Q4–Q13 into a new `websockets-and-realtime` topic; keep Q2/Q3 in scenario-based.

### `comparisons` (0 Qs) — topic empty

Questions that belong here (all currently filed elsewhere):
- `grpc-vs-rest-vs-graphql` (move from graphql-with-spring)
- Could add: `rest-vs-soap` (legacy comparison still asked), `stateful-vs-stateless-api`

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | No content-breaking issues — module is structurally healthy |
| **MAJOR** | **6** | 3 missing topics (client, caching, comparisons), 1 topic-org issue (WebSockets in scenario-based), 1 module-wide bold gap, 1 module-wide code gap |
| **MODERATE** | **15** | 13 code-missing substantive Zone 3s + 2 paragraph walls with bold gap |
| **MINOR** | **31** | Bold anchors + small polish |
| **CLEAN** | **3** | `openapi-swagger-springdoc`, `spring-boot-websocket-stomp-setup`, `testing-websocket-endpoints-spring` (only need the bold-anchor pass) |

## Most common issue codes

- `zone3_no_analogy` — only 16 questions (many graphql/websocket Qs have analogies — this module is better than spring-*)
- `zone1_direct_answer_no_bold_anchors` × 48
- `zone3_no_code_examples` × 13
- `zone1_direct_answer_paragraph_wall` × 4

---

## Suggested fix order

1. **Add the 3 missing topics** — `rest-client-and-feign` (3 Qs), `http-caching-and-compression` (2 Qs), `comparisons` (2–3 Qs including moved `grpc-vs-rest-vs-graphql`).
2. **Reorganize WebSockets** — promote scenario-based Q4–Q13 into a new `websockets-and-realtime` topic. Move Q1 (protobuf) into grpc-basics.
3. **Thicken `error-handling` and `api-design`** — each gains 1–2 questions (RFC 7807 ProblemDetail, resource naming).
4. **Add code to the 13 code-missing Zone 3s** — prioritize the comparison questions (Q4 PUT vs PATCH, Q2 RestController vs Controller, Q5 async controllers, Q1 graphql-vs-rest, Q8 graphql pagination, Q4 websocket-vs-sse, Q3 rate-limiting).
5. **Fix the 4 paragraph walls** (Q11 graphql + Q1, Q6 grpc + Q1 core-fundamentals style).
6. **Module-wide bold-anchor pass** — 52 questions, mechanical.
