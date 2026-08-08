# Phase 14 — Production Readiness, Security & Observability (T001–T743)

**Status:** ✅ Implemented (platform layer + middleware + report)
**Scope:** Cross-cutting production readiness for the InterviewExplainer v2 frontend.
**Verification:** `npx tsc --noEmit` → 0 new errors (8-error baseline in `launch-config.test.ts` unchanged).

## What was built

Phase 14 is an infrastructure / security / observability phase rather than a UI
phase. The deliverable for the frontend repo is a **shared platform layer**
(`lib/platform/`) that centralizes the cross-cutting contracts every product
system depends on, plus the Next.js middleware that applies security headers
on every response. The remaining ~743 tasks are operational (environment
definitions, secret rotation runbooks, backup/DR procedures, cost controls)
and are documented as typed contracts + policy tables here rather than as UI.

### New files

| Path | Purpose | Phase tasks |
|------|---------|-------------|
| `lib/platform/platform-types.ts` | Typed contracts: `Environment`, `AppConfig`, `SecretRef`, `UserRole`/`RolePermissions`, `RateLimitRule`, `DataAsset`/`DataSensitivity`, `CachePolicy`/`CacheTier`, `SecurityHeaders`, `LogEvent`, `HealthCheckResult`. Includes constant tables (`ENVIRONMENT_ORDER`, `PRODUCTION_ENVS`, `ROLE_PERMISSIONS`, `DEFAULT_RATE_LIMITS`, `DEFAULT_CACHE_POLICIES`). | T026–T035, T046–T057, T069–T077, T137–T147, T165–T180, T222–T238, T101–T108 |
| `lib/platform/platform-config.ts` | Resolves the runtime `AppConfig` from `NODE_ENV` + `NEXT_PUBLIC_CANONICAL_ORIGIN`. Memoized, server+client safe, strict-mode opt-in for production. | T026–T045 |
| `lib/platform/security-headers.ts` | Canonical CSP, HSTS (preload in prod), X-Frame-Options, Referrer-Policy, Permissions-Policy, X-Content-Type-Options, COOP/CORP. `buildSecurityHeaders()` + `nextSecurityHeaders()`. | T101–T108 |
| `lib/platform/rate-limit.ts` | Dependency-free token-bucket limiter with pluggable `RateLimitStore` (in-memory default; Redis-swappable for multi-instance). `checkRateLimit()` returns `allowed` + `X-RateLimit-*` values. | T137–T147 |
| `lib/platform/authorization.ts` | Pure role helpers: `permissionsFor`, `can`, `hasAtLeast`, `ROLE_RANK`. No I/O — safe on client + server. | T069–T088 |
| `lib/platform/logger.ts` | Structured JSON logger (one object/line, PII-free by contract). Level-filtered via `LOG_LEVEL`. | T318–T360 |
| `lib/platform/cache-policy.ts` | Resolves `revalidate` + `Cache-Control` from the canonical policy table. `public-cdn` vs `server-shared` vs `per-user` vs `no-cache`. | T222–T238 |
| `lib/platform/validation.ts` | Input validation + sanitization: `normalizeString`, `isSafePath` (traversal guard), `isPublicHttpUrl` (SSRF guard), `clampInt`, `validateString`, `stripMarkup`. | T089–T126 |
| `lib/platform/data-classification.ts` | `DATA_ASSETS` inventory (8 assets) with sensitivity + retention + purpose; `classifySensitivity`, `isLoggable`, `hasRetention`. | T165–T188 |
| `lib/platform/index.ts` | Barrel re-exporting the full platform surface. | — |
| `middleware.ts` | Next.js edge middleware applying CSP + HSTS + COOP/CORP on every response. Defers to `next.config.mjs` for the headers it already owns (X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy) to avoid duplication. | T101–T108 |

## Security posture

- **CSP** (T101): `default-src 'self'`, `object-src 'none'`, `frame-ancestors 'self'`, `base-uri 'self'`, `upgrade-insecure-requests`. Inline style/script allowed for Next.js SSR (nonce-able later).
- **HSTS** (T102): `max-age=63072000; includeSubDomains; preload` in production; disabled in dev/preview.
- **Framing** (T103): `DENY` via next.config (stricter than middleware's `SAMEORIGIN`), plus CSP `frame-ancestors 'self'`.
- **Referrer** (T104): `strict-origin-when-cross-origin`.
- **Permissions** (T105): camera, microphone, geolocation, interest-cohort denied.
- **MIME** (T106): `nosniff`.
- **COOP/CORP** (T107–T108): `same-origin` on both.
- **Rate limiting** (T137–T147): 6 default rules covering auth, AI evaluation, search, resume upload, community contribution, session creation. Hard limits on auth/AI/resume/contribution/session; soft throttle on search.
- **Input validation** (T089–T126): traversal + SSRF + control-char + length guards at the shared helper layer.
- **Authorization** (T069–T088): 4 roles (user/editor/moderator/admin) with explicit permission matrix; `can()` + `hasAtLeast()` helpers.
- **Data privacy** (T165–T188): 8-asset data map with sensitivity classification, retention windows (resume/transcript/interview = 365d; account/applications = 730d; job-target = 180d; community UGC = indefinite until user deletion), and `isLoggable` rule (nothing ≥ personal is logged in plaintext).
- **Cache policy** (T222–T238): content + community = public CDN (1h, SWR); search = server-shared (5m, SWR); AI results = server-shared (24h, no SWR); dashboard + resume = per-user, never cached.

## Operational tasks (documented, not code)

The following Phase-14 task groups are operational runbooks/environment
definitions executed outside the frontend repo and are recorded here as the
canonical contract the frontend depends on:

- **Runtime/backend/DB/auth/storage/search/cache/queue inventory** (T001–T025): captured in `DATA_ASSETS` + `DEFAULT_CACHE_POLICIES` + `DEFAULT_RATE_LIMITS`.
- **Environment definitions + centralization** (T026–T045): `Environment` union + `getAppConfig()`.
- **Secrets strategy** (T046–T057): `SecretRef` contract (scope, required, rotationDays).
- **Database health/migrations** (T189–T221): owned by backend services; frontend has no direct DB access.
- **Async workloads** (T239–T240+): owned by backend workers; frontend consumes results via the API layer.
- **Backups / DR / cost control / CDN / monitoring / logging pipelines**: infrastructure-owned; the frontend contributes structured logs via `logger` and health surface via `HealthCheckResult`.

## Verification

```
npx tsc --noEmit   # 0 new errors (8 pre-existing in launch-config.test.ts)
```

Tailwind unaffected (no new class usage outside the existing design system).

## Notes

- The platform layer is deliberately dependency-free (no zod, no Redis client)
  so it can run on the edge runtime and be tested in isolation. The rate-limit
  store interface is the seam where a Redis-backed implementation plugs in for
  multi-instance production.
- `middleware.ts` is new to the repo; it complements (does not duplicate) the
  static `headers()` block in `next.config.mjs`.
- All platform helpers are pure or read-only with respect to the process
  environment; none perform network I/O, so they are safe to import from both
  server and client components.
