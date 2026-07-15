# Audit — spring-security

**Pillar:** P02 Spring Ecosystem
**Module:** M09 spring-security
**Topics present:** 8 (of 11 — `sso-and-saml`, `security-configuration`, `comparisons` have 0 questions)
**Questions:** 19 (all written, no stubs)
**Benchmark sources:** Spring Security reference docs, Baeldung Spring Security series (30+ articles), OWASP Top 10 (2021), Auth0 JWT handbook, RFC 6749 (OAuth 2.0), RFC 7636 (PKCE), OWASP ASVS

---

## Module is structurally strong overall

No CRITICAL issues. No broken questions. No stubs. Zone 3 content is substantive — several 900–1150w deep-dives in the scenario-based topic, rich code coverage on the configuration-heavy questions (userdetailsservice has 5 code blocks, oauth2-resource-server has 7, cors-configuration has 5). This is one of the better-developed modules in the project.

The issues are about **completeness** (missing topics, missing canonical questions) and **consistency** (bold anchors, speakable length parity, analogies).

---

## Style fingerprint for this module (from top sources)

| What top sources do consistently | Our content |
|---|---|
| Opening bolds the security concept (`**CSRF**`, `**JWT**`, `**OAuth 2.0**`, `**@PreAuthorize**`) | **Failing** — 0 of 19 direct answers have bold anchors |
| Auth & authz questions always show `SecurityFilterChain` + `@PreAuthorize` / `HttpSecurity` config code | Mostly matching — userdetailsservice/oauth2-resource/cors/testing have strong code coverage; but 6 questions with 500–975w Zone 3 have zero code |
| JWT interview prep shows JJWT or Nimbus JOSE snippet + filter code | **Failing** — Q2 `jwt-security-signing` has 831w / 0 code. Q1 has good code (3 blocks) |
| OAuth 2.0 Authorization Code flow always shown as a sequence diagram or step-by-step with URLs | Q1 oauth2 has 3 "phase" sections + 975w but 0 code — acceptable if fully diagram/sequence based, but typical top-source answers include at least one `curl` to the token endpoint |
| CSRF / XSS / SQLi content always shows the attack + the Spring mitigation | Matching on SQLi (problem/before/diagnosis/after pattern is textbook); XSS has 0 analogy + 963w with 2 code (OK) |
| Security prep always includes SAML + OIDC SSO question | **Failing** — `sso-and-saml` topic is empty |

---

## Module-level structural issues

| # | Tag | Severity | Issue |
|---|---|---|---|
| S1 | EMPTY TOPICS | **MAJOR** | **3 topics empty:** `sso-and-saml` (SAML + OIDC flows, IdP/SP language, Spring Security SAML ext), `security-configuration` (SecurityFilterChain API, lambda DSL, replacing WebSecurityConfigurerAdapter — deprecated since Spring Security 5.7), `comparisons` |
| S2 | MODULE-WIDE ZONE 1 | **MAJOR** | 19 of 19 direct answers have zero bold anchors; 8 are paragraph walls (highest offenders: Q1 csrf 72w, Q1 secrets-mgmt 64w, Q2 session-vs-token 73w) |
| S3 | CODE-MISSING CONTENT-CRITICAL | **MAJOR** | 6 questions with substantive 500–975w Zone 3 and zero code. Particularly Q2 session-vs-token, Q1/Q2 authorization (a `@PreAuthorize` / `hasRole()` comparison WITHOUT showing the annotations is off-brand), Q2 jwt-security-signing |
| S4 | SHORT SPEAKABLES | **MODERATE** | 4 questions have sub-120w speakables when the module average is 140–200w: filter-chain (111w), userdetailsservice (105w), oauth2-resource-server (94w), cors-configuration (91w). These look like the speakable was authored before the Zone 3 was expanded |
| S5 | ANALOGY GAP | **MODERATE** | Only 4 of 19 Zone 3s have detected analogies. Security is high-analogy territory (filter chain = "airport security checkpoints in sequence", JWT = "tamper-sealed boarding pass", OAuth = "valet key for your car", CSRF = "forged signature on a check") |
| S6 | TESTING TOPIC THIN | **MINOR** | 1 question covers security testing. Missing: custom `@WithMockCustomUser` factory, `SecurityMockMvcRequestPostProcessors`, testing OAuth2 resource server with `jwt()` RequestPostProcessor |
| S7 | MISSING CANONICAL OAUTH2 DETAIL | MODERATE | 2 OAuth questions cover the overall flow + resource server config, but **PKCE** (RFC 7636, mandatory for public clients since OAuth 2.1) is not explicitly covered. Standard 2024+ interview probe |

---

## Per-question issues

### `security-fundamentals` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** spring-security-filter-chain | 799w / 1 code / no analogy. Speakable 111w (short). Missing canonical filter-chain analogy ("airport security checkpoints"). Should name the top filters by position: `SecurityContextPersistenceFilter` → `LogoutFilter` → `UsernamePasswordAuthenticationFilter` → `FilterSecurityInterceptor` | MINOR |
| **Q2** security-context-security-context-holder | 586w / 1 code / no analogy. `SecurityContextHolder.MODE_*` strategies (ThreadLocal default vs INHERITABLETHREADLOCAL vs GLOBAL) deserve a callout — common reactive/async pitfall | MINOR |

### `authentication` (3 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** userdetailsservice-userdetails-custom-implementation | 597w / **5 code** / analogy / II complete — **best-shaped question in the topic**. Only: speakable 105w is short; bold anchors missing | MINOR |
| **Q2** session-vs-token-based-authentication | Paragraph wall (73w). 756w / **0 code** / analogy. Session-vs-token comparison without showing the session cookie flow vs `Authorization: Bearer <JWT>` header flow is the unit of comparison missing. Add one minimal code block per side | **MAJOR** |
| **Q3** password-hashing-bcrypt-vs-argon2 | 816w / 2 code. Missing analogy. Should show: `PasswordEncoder` factory, BCryptPasswordEncoder vs Argon2PasswordEncoder constructor + cost parameter | MINOR |

### `authorization` (2 Qs) — **both code-missing**

| Q | Issue | Severity |
|---|---|---|
| **Q1** authentication-vs-authorization-spring-security | 574w / **0 code** / analogy present. An auth vs authz explainer without any `HttpSecurity` config example or `@PreAuthorize` illustration is incomplete | **MAJOR** |
| **Q2** preauthorize-vs-secured-vs-rolesallowed | 508w / **0 code** / no analogy. A 3-annotation comparison that doesn't show the 3 annotations in code is the archetype fail — the entire comparison hinges on the SpEL support in `@PreAuthorize` vs the string-only API of `@Secured` / `@RolesAllowed` | **MAJOR** |

### `jwt` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** jwt-authentication-spring-security | 713w / 3 code — solid. Missing analogy (JWT = "tamper-sealed boarding pass" is the standard) | MINOR |
| **Q2** jwt-security-signing-expiry-refresh | Paragraph wall (62w). 831w / **0 code** / no analogy. JWT signing/expiry/refresh without showing the JWT header.payload.signature structure + JJWT signing code + refresh-token-rotation pseudocode is the core of the topic missing | **MAJOR** |

### `oauth2` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** oauth2-authorization-code-flow | 975w / **0 code** / no analogy. 3 "phase" sections explain the flow in prose — acceptable if they contain the URL sequence. Better with at least one `curl` to `/oauth2/token` showing the code-for-token exchange. Also: **PKCE is missing** — critical for 2024+ interviews | **MAJOR** |
| **Q2** oauth2-resource-server-spring-security | Paragraph wall (63w). 621w / **7 code** (highest in module) — content is strong. Speakable 94w (short) | MODERATE |

### `cors-and-csrf` (2 Qs)

| Q | Issue | Severity |
|---|---|---|
| **Q1** csrf-spring-security-protection | Paragraph wall (72w — longest in module). 915w / 1 code / no analogy. CSRF content without showing the synchronizer-token cookie + `X-XSRF-TOKEN` header pattern in code is a gap. Canonical analogy missing ("forged signature on a pre-signed check that the bank trusts because the cookie is sent automatically") | **MAJOR** |
| **Q2** cors-configuration-spring-security | Paragraph wall (69w). 771w / 5 code / analogy in speakable. Speakable 91w (short). Strong Zone 3 | MODERATE |

### `sso-and-saml` (0 Qs) — **MAJOR topic gap**

Suggested content:
- `saml-vs-oidc-sso-when-to-choose` — SAML (enterprise, XML, IdP-initiated common) vs OIDC (modern, JSON, API-friendly)
- `spring-security-saml-integration` — `spring-security-saml2-service-provider`, metadata exchange, relay state
- `oidc-discovery-and-id-token-validation` — `.well-known/openid-configuration`, JWKS, nonce, audience validation

### `security-configuration` (0 Qs) — **MAJOR topic gap**

Critical because Spring Security **deprecated `WebSecurityConfigurerAdapter` in 5.7** and removed it in 6.0. Content here is highly interviewable. Suggest:
- `securityfilterchain-bean-vs-configureradapter` — the modern lambda DSL, migration guide
- `method-security-enablemethodsecurity-vs-enableglobalmethodsecurity` — `@EnableMethodSecurity` replaces `@EnableGlobalMethodSecurity` (Spring Security 5.6+)
- `spring-security-http-firewall` — `StrictHttpFirewall`, default rejections (`%2F`, `;`, etc.) that cause 403s in production

### `testing` (1 Q)

| Q | Issue | Severity |
|---|---|---|
| **Q1** testing-with-withmockuser-security-mock-mvc | 804w / **5 code** — strong. Missing analogy (optional — concrete topic) | MINOR |

**Topic gap:** add `testing-oauth2-jwt-resource-server-mock-mvc` — `SecurityMockMvcRequestPostProcessors.jwt(...)`, mocking `Authentication` objects.

### `scenario-based` (5 Qs) — **strongest topic in module**

| Q | Issue | Severity |
|---|---|---|
| **Q1** owasp-top-10 | 972w / **0 code** / analogy present. Acceptable given the survey nature of the topic — but one tiny snippet per top category (e.g. parameterized-query one-liner, password-hashing one-liner) would raise this to exemplary | MODERATE |
| **Q2** sql-injection-jpa-prevention | 796w / 2 code / problem/before/diagnosis/after pattern — **textbook shape**. CLEAN apart from bold | MINOR |
| **Q3** xss-stored-reflected-dom | Paragraph wall (62w). 963w / 2 code / no analogy. Good depth | MODERATE |
| **Q4** rate-limiting-brute-force-prevention | Paragraph wall (69w). 1153w / 2 code / recommendation closer. Missing analogy (rate-limiting = "bouncer at the door with a counter") | MODERATE |
| **Q5** secrets-management-never-hardcode | Paragraph wall (64w). 1153w / 4 code / no analogy. Topic is inherently concrete so analogy is optional | MODERATE |

### `comparisons` (0 Qs) — topic empty

Suggest: `oauth2-vs-oidc` (auth vs authz confusion is one of the top interview pitfalls), `basic-auth-vs-jwt-vs-session`, `rbac-vs-abac-spring-security`.

---

## Tally

| Severity | Count | Notes |
|---|---|---|
| **CRITICAL** | **0** | |
| **MAJOR** | **7** | Q2 session-vs-token, Q1/Q2 authorization, Q2 jwt-security-signing, Q1 oauth2 flow (+ PKCE gap), Q1 csrf, S1 missing topics, S2 module-wide bold, S3 code-missing theme |
| **MODERATE** | **8** | Q2 oauth2-resource-server, Q1/Q3/Q4/Q5 scenario-based, S4 short speakables, S5 analogy gap, S7 PKCE |
| **MINOR** | **4** | Well-shaped questions needing only bold-anchor + optional analogy |
| **CLEAN** | **0** | No question is currently entirely free of the module-wide gaps |

## Most common issue codes

- `zone1_direct_answer_no_bold_anchors` × 11
- `zone1_direct_answer_paragraph_wall` × 8
- `zone3_no_code_examples` × 6
- `zone3_no_analogy` × 15
- `zone2_speakable_short` × 4

---

## Suggested fix order

1. **Author `security-configuration` topic** — highest-interview-value gap. `WebSecurityConfigurerAdapter` deprecation + migration is asked in every post-2022 Spring Security interview. 3 questions minimum.
2. **Author `sso-and-saml` topic** — 2–3 questions minimum covering SAML, OIDC, SSO patterns.
3. **Add code to the 6 content-critical code-missing questions** — especially Q1/Q2 authorization, Q2 jwt-security-signing, Q1 csrf. These are the questions where the absent code changes the answer from good to incomplete.
4. **Add PKCE coverage** to Q1 oauth2-authorization-code-flow (or as a new question: `pkce-oauth2-public-clients`).
5. **Expand the 4 short speakables** — target 140–180w parity with the rest of the module. Zone 3 content is already there to draw from.
6. **Module-wide bold-anchor + paragraph-wall fix pass**.
7. **Selective analogies** — filter-chain, JWT, OAuth, CSRF especially benefit. Skip where content is concrete (SQLi, secrets-management).
8. **Author `comparisons` topic** and one more testing question.
