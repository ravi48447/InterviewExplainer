# 27 — JFI: Fullstack Integration Modules

> **Executor:** AI coding agent.
> **Working directory:** `/Users/ravi.r_flx/IEProject/InterviewExplainer/`.
> **Type:** content writing for cross-cutting fullstack modules — the
> highest-CTR JFI surface.

---

## §0 — Front-matter

```yaml
playbook:    27
version:     1.0
status:      ready
wave:        C
domain:      java-fullstack-intermediate
modules:
  - spring-boot-frontend-integration
  - realtime-and-files
  - frontend-testing-with-java-apis
q_targets:
  spring_boot_frontend_integration: 30
  realtime_and_files: 25
  frontend_testing_with_java_apis: 20
archetypes:  A:15 B:20 C:20 G:0
difficulty:  E:20 M:55 H:25
version_pins:
  spring_boot: "3.3"
  java: "21"
  spring_security: "6.3"
  react: "18.3"
  angular: "17.3"
  typescript: "5.4"
  axios: "1.7"
  pact_jvm: "4.6"
  playwright: "1.44"
  testcontainers: "1.19"
  msw: "2.3"
```

---

## §1 — TL;DR

- **Input:** JFI's killer differentiator is fullstack integration content
  (Spring Boot + React/Angular, auth flows, file uploads, websockets).
  Currently thin.
- **Action:** Write three integration modules with concrete code on both
  the Spring side and the React/Angular side.
- **Output:** Ranks for "spring boot react interview questions", "spring
  boot angular interview questions", "fullstack java interview questions".

---

## §2 — Why this matters

Fullstack integration is the **highest-CTR JFI surface** because most
online content treats backend and frontend as separate worlds —
real-world fullstack interviews probe the **seam** (auth flows, file
uploads, realtime, error envelopes). Owning that seam with answers
that show BOTH sides of the wire is a defensible position: a Spring-only
answer or React-only answer is half-credit in a fullstack loop, and
interviewers grade up answers that show end-to-end thinking.

---

## §3 — Glossary

| Term | Definition |
| --- | --- |
| **fullstack integration** | Questions that require understanding BOTH the Spring Boot side (Java/Kotlin) AND the frontend side (React/Angular/TS) — the seam between layers. |
| **CORS (Cross-Origin Resource Sharing)** | Browser security policy requiring the server to send `Access-Control-Allow-Origin` headers for requests from a different origin (protocol + host + port). |
| **CORS preflight** | HTTP `OPTIONS` request the browser sends before a non-simple cross-origin request; the server must respond with the allowed methods and headers. |
| **CSRF (Cross-Site Request Forgery)** | Attack where a malicious page uses the victim's browser cookies to make authenticated requests to the target site; mitigated by SameSite cookies and CSRF tokens. |
| **SPA (Single-Page Application)** | Web app where navigation is handled client-side (React Router, Angular Router) with a single HTML entry point; requires the server to return `index.html` for all routes. |
| **JWT (JSON Web Token)** | Compact signed token used for stateless authentication; header.payload.signature, verified without a DB lookup. |
| **access token** | Short-lived JWT (typically 5–15 minutes) sent as `Authorization: Bearer` header; stored in memory (not localStorage). |
| **refresh token** | Long-lived token used to get a new access token; stored in an HttpOnly Secure SameSite cookie to prevent XSS theft. |
| **HttpOnly cookie** | A cookie inaccessible to JavaScript via `document.cookie`; used for storing refresh tokens to prevent XSS exfiltration. |
| **SameSite=Strict** | Cookie attribute that prevents the browser from sending the cookie with cross-site requests; the primary CSRF mitigation for modern apps. |
| **BFF (Backend For Frontend)** | A dedicated API gateway that combines calls from multiple microservices and returns frontend-shaped responses; reduces over-fetching and avoids CORS. |
| **`ProblemDetail`** | RFC 7807 JSON error format (`type`, `title`, `status`, `detail`); Spring 6 / Boot 3 supports it natively via `ResponseEntityExceptionHandler`. |
| **WebSocket** | Full-duplex TCP connection established via HTTP Upgrade; enables bidirectional real-time communication between browser and server. |
| **STOMP over WebSocket** | Sub-protocol that adds publish/subscribe semantics on top of raw WebSocket; Spring `WebSocketBrokerConfigurer` supports it natively via `@MessageMapping`. |
| **SSE (Server-Sent Events)** | One-way server → client streaming using `text/event-stream`; simpler than WebSocket for push-only scenarios; browsers auto-reconnect. |
| **`SseEmitter`** | Spring class that wraps an SSE connection; the controller returns it and calls `.send()` asynchronously to push events. |
| **multipart upload** | HTTP `multipart/form-data` request that includes file bytes alongside form fields; handled by Spring's `@RequestParam MultipartFile`. |
| **chunked / resumable upload** | Upload that sends the file in multiple parts; if the connection drops, the upload resumes from the last confirmed chunk (used by TUS protocol). |
| **presigned URL** | Time-limited S3 URL that authorises a single upload or download without exposing AWS credentials to the client. |
| **contract testing** | Testing technique (Pact, Spring Cloud Contract) that verifies the consumer and provider agree on the API contract without deploying both simultaneously. |
| **Pact** | Consumer-driven contract testing framework; the consumer writes a Pact file describing expected interactions; the provider verifies against it. |
| **consumer-driven contract** | The consumer (frontend) defines the expected response shape; the provider (Spring API) runs the Pact verifier against the consumer's expectations. |
| **MSW (Mock Service Worker)** | API mocking library that intercepts at the network layer (Service Worker in browser, `node:http` in Node); tests hit the mock, not the real API. |
| **Playwright** | Cross-browser E2E testing framework by Microsoft; supports Chromium, Firefox, WebKit; useful for fullstack E2E with a running Spring backend. |
| **Testcontainers** | Java library that starts Docker containers (PostgreSQL, Redis, etc.) as part of integration tests; pairs with Playwright for fullstack E2E smoke tests. |
| **OpenAPI codegen** | Generating TypeScript client code from an `openapi.yaml` spec; ensures frontend and backend types stay in sync automatically. |
| **`proxy.conf.json`** | Angular CLI configuration that forwards `/api/**` requests to the Spring Boot backend during local development, avoiding CORS. |
| **Vite proxy** | `server.proxy` in `vite.config.ts` that forwards requests to a backend URL during development. |
| **OAuth2 / OIDC** | OAuth2 is an authorisation framework; OIDC (OpenID Connect) adds authentication on top; Spring Security 6 supports both for social login and enterprise SSO. |
| **token rotation** | Issuing a new refresh token on every refresh call and invalidating the old one; prevents refresh token replay attacks. |
| **`withCredentials: true`** | Axios / fetch option that includes cookies in cross-origin requests; required for the refresh token cookie to be sent to `/auth/refresh`. |

---

## §4 — Hard prerequisites

- [ ] JFI domain exists (verify: `rg "'java-fullstack-intermediate'" frontend/lib/content-reader.ts`).
- [ ] React + Angular modules have content (playbooks 24, 25 DONE).
- [ ] JBI `spring-boot`, `spring-security`, `rest-api`, `spring-webflux`,
      `unit-testing` modules have content (playbooks 12–17).
- [ ] Three integration module slugs declared in JFI `_index.json`.

---

## §5 — Current state

- Three integration modules are likely scaffolded but empty.
- Existing fullstack content elsewhere online is half-answers (Spring
  only OR React only) — clear opportunity.
- Cross-links from these modules to JBI `spring-security` /
  `spring-webflux` / `unit-testing` may not exist yet.

---

## §6 — Target state (measurable)

- `spring-boot-frontend-integration`: 30 Q, BOTH Spring AND frontend code in every Q.
- `realtime-and-files`: 25 Q with WS / SSE / multipart examples.
- `frontend-testing-with-java-apis`: 20 Q with Pact / MSW / Playwright + Testcontainers.
- Auth-flow questions ALL cover: login + storage + refresh + logout (four pillars).
- Speakable per-module pass+warn ≥ 90 %.
- All 10 money comparisons live.

---

## §7 — Search phrases → topic map

| Search phrase | Module | Owner topic |
| --- | --- | --- |
| `spring boot react interview questions` | spring-boot-frontend-integration | `auth-flow-end-to-end` |
| `spring boot angular interview questions` | spring-boot-frontend-integration | `auth-flow-end-to-end` |
| `jwt spring boot react tutorial interview` | spring-boot-frontend-integration | `auth-flow-end-to-end` |
| `cors spring boot react interview questions` | spring-boot-frontend-integration | `cors-and-csrf` |
| `spa spring boot serve static files` | spring-boot-frontend-integration | `serving-spa-from-spring` |
| `websocket spring boot interview questions` | realtime-and-files | `websockets-with-spring` |
| `server sent events spring boot` | realtime-and-files | `server-sent-events` |
| `file upload spring boot react interview` | realtime-and-files | `file-upload` |
| `contract testing java frontend interview` | frontend-testing-with-java-apis | `contract-testing` |
| `playwright spring boot testcontainers e2e` | frontend-testing-with-java-apis | `e2e-testing-fullstack` |
| `openapi typescript client generation` | frontend-testing-with-java-apis | `api-schema-and-types` |

---

## §8 — Dependency context

**Upstream:** Playbooks 24 (React), 25 (Angular), 26 (TS/Tailwind) and
JBI pillar playbooks 12–17. The integration modules here link FROM JFI
TO JBI — they are the bridge that turns a JFI user into a JBI user.

**Downstream:** Playbook 28 (JFI launch) validates the cross-link count
from these modules to JBI before flipping the public flag.

---

## §9 — Execution steps

### Step 1 — Verify three modules are scaffolded

```bash
cd /Users/ravi.r_flx/IEProject/InterviewExplainer

for m in spring-boot-frontend-integration realtime-and-files frontend-testing-with-java-apis; do
  jq --arg m "$m" '.modules[] | select(.slug == $m) | .slug' \
    content/java-fullstack-intermediate/_index.json
done
```

If any is missing, add it to `_index.json` before writing content.

**Verify:**
```bash
ls content/java-fullstack-intermediate/spring-boot-frontend-integration/
ls content/java-fullstack-intermediate/realtime-and-files/
ls content/java-fullstack-intermediate/frontend-testing-with-java-apis/
```

---

### Step 2 — Write `cors-and-csrf` (6 Q)

Must-have Qs:
1. How does Spring Boot handle CORS? — `@CrossOrigin` vs `CorsRegistry` in `WebMvcConfigurer`
2. What is a CORS preflight request and when does the browser send one?
3. How would you configure CORS for a React SPA on a different origin?
4. What is CSRF and why does JWT-in-header defeat most CSRF attacks?
5. How does `SameSite=Strict` protect against CSRF?
6. `Cookie-based session vs JWT` comparison — when each for SPAs

**The classic bug is calling `setCorsOrigins("*")` while also setting
`allowCredentials(true)`.** A browser will reject a CORS response with
`Access-Control-Allow-Origin: *` when credentials are requested — the
spec forbids the wildcard in that combination. Fix: use the exact allowed
origin string, never `*`, when credentials (cookies) are involved.

```java
// Correct Spring CORS config for a credential-bearing SPA
@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5173", "https://myapp.com")
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowCredentials(true);          // only with exact origin, never wildcard
    }
}
```

**Verify:**
```bash
python3 scripts/validate_qa.py \
  content/java-fullstack-intermediate/spring-boot-frontend-integration/cors-and-csrf/complete-qa.json
```

---

### Step 3 — Write `serving-spa-from-spring` (4 Q)

Cover: putting React/Angular build output into `src/main/resources/static`,
the `ResourceHandlerRegistry` catch-all that returns `index.html` for
all unknown routes, and the production build pipeline (npm → Maven copy).

**The classic bug is deploying a Spring Boot JAR with a React SPA and
getting 404 on deep links (`/dashboard/profile`).** Spring Boot's static
resource handler returns 404 for unknown paths because it maps to the
filesystem, not the SPA router. Fix: add a catch-all `@Controller` that
returns `forward:/index.html` for all non-API, non-asset paths.

```java
@Controller
public class SpaController {
    @RequestMapping(value = {"/", "/{path:[^\\.]*}", "/{path:.*}/{subpath:[^\\.]*}"})
    public String redirect() {
        return "forward:/index.html";
    }
}
```

---

### Step 4 — Write `dev-proxy-config` (4 Q)

Cover the local dev proxy for both React (Vite) and Angular, and why it's
needed (avoids CORS during local development while the backend runs
separately).

Vite proxy:
```typescript
// vite.config.ts
import { defineConfig } from 'vite';
export default defineConfig({
  server: {
    proxy: {
      '/api': { target: 'http://localhost:8080', changeOrigin: true },
    },
  },
});
```

Angular proxy (`proxy.conf.json`):
```json
{
  "/api": {
    "target": "http://localhost:8080",
    "changeOrigin": true
  }
}
```

---

### Step 5 — Write `auth-flow-end-to-end` (8 Q)

This is the flagship topic. All four pillars must be covered:
1. **Login** — Spring `AuthenticationManager` validates credentials, issues JWT
2. **Storage** — access token in memory, refresh token in HttpOnly Secure SameSite cookie
3. **Refresh** — Axios interceptor retries on 401, calls `/auth/refresh`, rotates cookie
4. **Logout** — server-side cookie invalidation + client-side memory clear

**The #1 security trap is storing the access token in `localStorage`.**
`localStorage` is accessible to any JavaScript on the page — one XSS
vulnerability reads the token and exfiltrates it. Storing in memory
(a module-level variable or React state) limits the blast radius: the
attacker can call your API but can't exfiltrate the token for later use.

See §10 for the full worked example JSON for Q `jwt-refresh-flow-spring-react`.

**Verify:**
```bash
python3 scripts/validate_qa.py \
  content/java-fullstack-intermediate/spring-boot-frontend-integration/auth-flow-end-to-end/complete-qa.json

python3 scripts/audit_speakable.py \
  --topic auth-flow-end-to-end \
  --module spring-boot-frontend-integration \
  --report
```

---

### Step 6 — Write `error-handling-end-to-end` (4 Q)

Cover: Spring `ResponseEntityExceptionHandler` + `@RestControllerAdvice` returning
`ProblemDetail` (RFC 7807), Axios interceptor that maps HTTP error codes to UI
error messages, validation errors (`MethodArgumentNotValidException`) mapped to
field-level error objects the frontend can render.

Decision rule: *Use RFC 7807 `ProblemDetail` for structured error responses in new
Spring Boot 3.x APIs. Only use custom error envelopes for APIs that predate Spring 6
or that must support clients unable to parse the standard format.*

---

### Step 7 — Write `comparisons` topic (4 Q)

All 4 money comparisons:
1. `Cookie-based session vs JWT for SPAs` — B archetype
2. `BFF vs direct SPA → API` — B archetype
3. `Same-origin (static from Spring) vs CORS (separate hosts)` — B archetype
4. `RFC 7807 ProblemDetail vs custom error envelope` — B archetype

Each opens with *"Use X when …; use Y when …"*.

---

### Step 8 — Write `websockets-with-spring` (6 Q)

Cover: STOMP over WebSocket via `@MessageMapping`, native WebSocket via
`WebSocketHandler`, frontend client using `@stomp/stompjs`, broadcast
vs point-to-point messaging, session-based identity in WS, reconnect on
disconnect.

**The classic bug is not handling WebSocket reconnect on the frontend.**
STOMP reconnect is not automatic — if the server restarts or the network
drops, the client hangs silently. The `@stomp/stompjs` client exposes a
`reconnectDelay` option; set it (e.g. 5000 ms) and implement an
`onDisconnect` callback that notifies the user.

---

### Step 9 — Write `server-sent-events` (5 Q)

Cover: `SseEmitter` vs `Flux<ServerSentEvent<T>>` (WebFlux), browser
`EventSource` API, reconnection with `Last-Event-ID`, fanout with
`ApplicationEventPublisher`, shutting down on client disconnect.

Decision rule: *Use SSE when the server needs to push updates to the
browser (notifications, progress bars, live scores) but doesn't need
to receive messages back. Use WebSocket when bidirectional communication
is needed (chat, live collaboration, multiplayer).*

---

### Step 10 — Write `file-upload` (6 Q)

Cover: Spring `@RequestParam MultipartFile`, size limits (`spring.servlet.multipart.max-file-size`),
presigned S3 upload (frontend uploads directly to S3, skipping Spring), chunked upload
with the TUS protocol, virus scanning hook point, storing metadata in DB while the file
lands in S3.

**The classic bug is routing large file uploads through the Spring server
when the target is S3.** For files > 10 MB, upload directly from the
browser to S3 using a presigned URL — routing through Spring doubles the
bandwidth cost and can exhaust the server's memory if Spring buffers the
multipart body.

---

### Step 11 — Write `file-download` (4 Q)

Cover: `InputStreamResource` for streaming large files, `Range` header
support (resumable downloads), `Content-Disposition: attachment` vs
`inline`, signed URL for private S3 downloads.

---

### Step 12 — Write `contract-testing` (5 Q)

Cover: Pact — consumer writes a Pact file defining expected response shape;
provider runs the Pact verifier against `@SpringBootTest`; Spring Cloud
Contract (alternative for Spring-first shops); why contract testing beats
integration tests for API contracts.

Lead with the decision rule: *Use Pact when the consumer and provider are
maintained by different teams (often frontend vs backend); use Spring
Cloud Contract when the provider team owns both sides and prefers a
server-side spec.*

---

### Step 13 — Write `mocking-the-backend` (4 Q)

Cover: MSW for realistic browser-level mocking, `jest.mock()` / axios mock
adapter for unit-level mocking, when to use each, setting up a shared
handler library across tests.

---

### Step 14 — Write `e2e-testing-fullstack` (5 Q) and `api-schema-and-types` (4 Q)

**E2E:** Playwright test that starts the Spring Boot app via Testcontainers
(or uses `@SpringBootTest` on a fixed port), launches the browser against
it, and performs a full user journey (login → interact → logout).

**API schema:** `springdoc-openapi` generates `openapi.yaml` at build time;
`openapi-typescript` or `openapi-generator-cli` generates TypeScript types
from the YAML; the CI pipeline fails if the generated types diverge from
the committed snapshot.

**Verify (module-level):**
```bash
for m in spring-boot-frontend-integration realtime-and-files frontend-testing-with-java-apis; do
  total=$(find content/java-fullstack-intermediate/$m \
    -name complete-qa.json \
    -exec jq '.questions | length' {} \; \
    | awk '{s+=$1} END {print s}')
  echo "$m: $total Q"
done
# Expected: 30 / 25 / 20
```

---

## §10 — Reference Q JSON

Paste into `auth-flow-end-to-end/complete-qa.json`:

```json
{
  "id": "jwt-refresh-flow-spring-react",
  "slug": "jwt-refresh-flow-spring-react",
  "title": "How would you implement a JWT access + refresh token flow between Spring Boot and a React SPA?",
  "question": "How would you implement a JWT access + refresh token flow between Spring Boot and a React SPA?",
  "difficulty": "hard",
  "importance": "critical",
  "archetype": "C",
  "reading_time_minutes": 7,
  "last_updated": "2024-06-01",
  "interviewer_intent": "Tests whether the candidate understands full-stack auth from both sides — Spring Security config AND frontend token handling — and knows the XSS vs CSRF trade-off.",
  "company_tags": ["Stripe", "Netflix", "Shopify", "Atlassian", "Airbnb"],
  "direct_answer": "**Issue a short-lived JWT access token in the response body and a long-lived refresh token in an HttpOnly Secure SameSite cookie.** The SPA stores the access token in memory, sends it as a Bearer header, and silently refreshes via `/auth/refresh` on 401. This eliminates the XSS risk of localStorage while keeping the API stateless.",
  "layout_type": "scenario",
  "tags": ["fullstack", "auth", "jwt", "spring-boot", "react", "security"],
  "order": 1,
  "seo": {
    "title": "JWT refresh token flow Spring Boot React — fullstack interview",
    "description": "How to implement JWT access + refresh tokens between Spring Boot and React: Spring Security config, Axios interceptor, HttpOnly cookie, token rotation."
  },
  "answer": {
    "sections": [
      {
        "kind": "headline",
        "value": "Issue a short-lived JWT access token in the response body and a long-lived refresh token in an HttpOnly Secure SameSite cookie. The SPA keeps the access token in memory, attaches it as a Bearer header, and silently refreshes on 401."
      },
      {
        "kind": "why",
        "value": "Access tokens in localStorage are XSS-stealable — one script injection and they're gone. Refresh tokens in localStorage are catastrophically XSS-stealable. Keeping the refresh in an HttpOnly cookie eliminates the SPA's biggest attack surface: JavaScript can't read `document.cookie` for HttpOnly cookies. In-memory access tokens limit the blast radius: if XSS runs, it can call the API but can't exfiltrate the token."
      },
      {
        "kind": "diagram",
        "language": "mermaid",
        "value": "sequenceDiagram\n  participant SPA\n  participant API as Spring API\n  SPA->>API: POST /auth/login {username, password}\n  API-->>SPA: { accessToken } + Set-Cookie: refresh=...; HttpOnly; Secure; SameSite=Strict\n  SPA->>SPA: store accessToken in memory only\n  SPA->>API: GET /api/me (Authorization: Bearer <accessToken>)\n  API-->>SPA: 200 {user}\n  Note over SPA,API: accessToken expires\n  SPA->>API: POST /auth/refresh (refresh cookie sent automatically)\n  API-->>SPA: { accessToken: NEW } + rotated refresh cookie\n  SPA->>API: GET /api/me (NEW accessToken)"
      },
      {
        "kind": "code",
        "language": "java",
        "value": "// Spring Boot 3: issue + rotate refresh token\n@PostMapping(\"/auth/refresh\")\npublic ResponseEntity<TokenResponse> refresh(\n    @CookieValue(\"refresh\") String refreshToken,\n    HttpServletResponse res\n) {\n    UserId uid = refreshService.validateAndRotate(refreshToken, res); // rotates cookie\n    String access = jwt.issueAccess(uid, Duration.ofMinutes(10));\n    return ResponseEntity.ok(new TokenResponse(access));\n}"
      },
      {
        "kind": "code",
        "language": "typescript",
        "value": "// React: in-memory access token + 401 retry interceptor\nlet accessToken: string | null = null;\nexport function setAccessToken(t: string | null) { accessToken = t; }\n\nexport const api = axios.create({ baseURL: '/api', withCredentials: true });\n\napi.interceptors.request.use((cfg) => {\n  if (accessToken) cfg.headers.Authorization = `Bearer ${accessToken}`;\n  return cfg;\n});\n\napi.interceptors.response.use(\n  (r) => r,\n  async (err) => {\n    if (err.response?.status === 401 && !err.config._retry) {\n      err.config._retry = true;\n      const { data } = await api.post('/auth/refresh');\n      setAccessToken(data.accessToken);\n      err.config.headers.Authorization = `Bearer ${data.accessToken}`;\n      return api.request(err.config);\n    }\n    return Promise.reject(err);\n  }\n);"
      },
      {
        "kind": "tradeoffs",
        "value": "Compared to a single long-lived localStorage token: far less XSS risk, more code paths to test. Compared to fully cookie-based session auth: API stays stateless and CDN-friendly but you must handle CSRF on `/auth/refresh` (use SameSite=Strict and bind a per-session CSRF token to the refresh cookie). For native mobile clients, swap the cookie for a securely stored refresh token — the API contract stays the same."
      },
      {
        "kind": "followups",
        "value": [
          "How would you log out so the refresh token is invalidated server-side?",
          "How do you handle 401 races when many requests fire at once before refresh completes?",
          "How do you migrate from localStorage tokens to this design without logging users out?",
          "Why is SameSite=Strict on the refresh cookie important?"
        ]
      }
    ]
  },
  "speakable": {
    "summary": "Issue a short-lived JWT access token in the response body and a long-lived refresh token in an HttpOnly Secure SameSite cookie. The SPA stores the access token in memory and silently refreshes via an Axios interceptor on 401. This eliminates localStorage XSS risk while keeping the API stateless.",
    "isCanonical": true
  }
}
```

---

## §11 — Diagram catalogue

| Diagram type | Q / topic | Title |
| --- | --- | --- |
| `sequenceDiagram` | `auth-flow-end-to-end/jwt-refresh-flow-spring-react` | How access + refresh tokens flow between SPA and Spring API |
| `sequenceDiagram` | `auth-flow-end-to-end/oauth2-spring-oidc` | OAuth2 PKCE flow from Angular to Spring Security |
| `flowchart` | `cors-and-csrf/cors-preflight-mechanics` | How a CORS preflight request is resolved by Spring |
| `sequenceDiagram` | `websockets-with-spring/stomp-websocket-flow` | STOMP subscribe / publish between browser and Spring broker |
| `sequenceDiagram` | `file-upload/presigned-s3-upload-flow` | Browser → presigned URL → S3; metadata → Spring API |
| `flowchart` | `contract-testing/pact-consumer-provider-flow` | How a Pact consumer file is generated and verified against the provider |
| `sequenceDiagram` | `e2e-testing-fullstack/playwright-testcontainers-flow` | Playwright browser → Spring Boot under Testcontainers |

---

## §12 — Voice rules

Opens from `_VOICE-RULES.md` (locked source of truth). Three
integration-module-specific examples:

| ✅ JBI voice | ❌ Textbook voice |
| --- | --- |
| "The classic bug is storing the refresh token in localStorage. One XSS vulnerability reads the token and exfiltrates it to an attacker-controlled server. Use an HttpOnly Secure SameSite cookie instead — JavaScript can't touch it." | "Be careful about where you store tokens." |
| "Use SSE when the server pushes updates to the browser (notifications, progress). Use WebSocket when bidirectional communication is needed (chat, live collaboration)." | "SSE and WebSocket are both real-time communication technologies." |
| "The classic bug is setting `allowedOrigins('*')` with `allowCredentials(true)` in Spring CORS config — the browser spec forbids the wildcard when credentials are sent." | "Configure CORS carefully in Spring Boot." |

Additional module rules:
- Every integration answer MUST show code on BOTH the Spring Boot side
  AND the frontend side. A Spring-only answer is rejected.
- Auth-flow questions cover all four pillars: login, storage, refresh, logout.
- Every comparison Q opens with *"Use X when …; use Y when …"*.

---

## §13 — Quality gates

| Gate | Threshold | Verify with |
| --- | --- | --- |
| `spring-boot-frontend-integration` Q count | ≥ 30 | `jq` aggregate |
| `realtime-and-files` Q count | ≥ 25 | `jq` aggregate |
| `frontend-testing-with-java-apis` Q count | ≥ 20 | `jq` aggregate |
| Every integration Q has BOTH Spring AND frontend code sections | 100 % | spot-check 10 |
| Auth-flow Q covers all 4 pillars (login, store, refresh, logout) | 4 of 4 | manual on `auth-flow-end-to-end` |
| All 10 money comparisons live | 10 of 10 | manual grep |
| Speakable per-module pass+warn | ≥ 90 % each | `python3 scripts/audit_speakable.py --module <m> --report` |
| Banned words in content | 0 | `rg -ni 'leverage\|seamless\|robust\|enterprise-grade' content/java-fullstack-intermediate/{spring-boot-frontend-integration,realtime-and-files,frontend-testing-with-java-apis}/` |
| Schema validation | all pass | `find content/java-fullstack-intermediate/spring-boot-frontend-integration realtime-and-files frontend-testing-with-java-apis -name complete-qa.json \| xargs -I{} python3 scripts/validate_qa.py {}` |
| Cross-link count to JBI per integration module | ≥ 3 each | `rg -c '/interview/java-backend-intermediate' content/java-fullstack-intermediate/{spring-boot-frontend-integration,realtime-and-files,frontend-testing-with-java-apis}/` |

---

## §14 — Anti-patterns checklist

| Anti-pattern | Why it fails | Fix |
| --- | --- | --- |
| Spring-only answer (no frontend code) | A fullstack loop gives half-credit for one side | Add the frontend counterpart; both sides required |
| Frontend-only answer (no Spring code) | Same as above; misses the seam | Add the Spring counterpart |
| Access token in `localStorage` | XSS-stealable; violates OWASP | Store in memory; refresh token in HttpOnly cookie |
| `allowedOrigins("*")` with `allowCredentials(true)` | Browser spec rejects this combination | Use exact origin strings; never wildcard with credentials |
| Auth-flow answer missing refresh logic | Interviewers explicitly probe silent refresh | Add Axios interceptor + 401 retry |
| WebSocket answer without reconnect | Production WebSocket always needs reconnect; missing it signals shallow knowledge | Add `reconnectDelay` + `onDisconnect` handler |
| File upload routed through Spring for S3 targets | Double bandwidth cost; memory risk for large files | Use presigned S3 URL for files > 10 MB |
| Missing `withCredentials: true` on Axios | Refresh token cookie not sent cross-origin | Always set `withCredentials: true` on the `axios.create` instance |
| Contract test that hits the real API | Contract tests must be offline; real API breaks isolation | Use Pact verifier or Spring Cloud Contract stubs |

---

## §15 — Failure modes & rollback

| Failure | Detection | Rollback |
| --- | --- | --- |
| A Q ships with only Spring code | Manual spot-check; `rg '"language": "typescript"' content/.../auth-flow-end-to-end/complete-qa.json` returns no match | Rewrite Q to add the frontend counterpart |
| Auth recommendation uses `localStorage` for access token | Manual review; grep for `localStorage.setItem` outside the comparison Q | Rewrite to in-memory access + HttpOnly cookie refresh |
| WebSocket example missing reconnect | Manual review; grep for `reconnectDelay` | Add `reconnectDelay: 5000` + disconnect handler |
| File upload sends large file through Spring instead of presigned URL | Manual review; any upload > 10 MB targeting S3 routed through Spring | Rewrite to presigned URL pattern |
| Speakable fail > 10 % | `audit_speakable.py --module <m> --report` | Fix summaries: no markdown, ≤ 320 chars, no tables |

---

## §16 — Definition of Done

- [ ] All 3 modules at target Q count: 30 / 25 / 20.
- [ ] Every Q has BOTH Spring AND frontend code sections.
- [ ] Auth-flow Q covers all 4 pillars (login, store, refresh, logout).
- [ ] All 10 money comparisons live.
- [ ] Speakable ≥ 90 % pass+warn per module.
- [ ] ≥ 3 cross-links to JBI per integration module.
- [ ] Schema validation passes on all 3 modules.
- [ ] No banned words in content.
- [ ] `00-INDEX.md` row for `27` flipped to `DONE`.

## §17 — Estimated effort

- **Ideal:** 30 hours.
- **Hard stop:** 45 hours.

## §18 — Appendix

- Cross-links produced: JFI `spring-boot-frontend-integration` → JBI `spring-security/jwt-auth`; JFI `realtime-and-files` → JBI `spring-webflux`; JFI `frontend-testing-with-java-apis` → JBI `unit-testing`.
- Tag at launch: `jfi-integration-modules-done-<YYYY-MM-DD>`.
- Verified by playbook 28 cross-link audit before JFI tile flips.