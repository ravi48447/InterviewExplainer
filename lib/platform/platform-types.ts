/**
 * platform-types.ts — Typed contracts for the shared production platform layer
 * (P14-A..BN, T001..T743).
 *
 * Centralizes cross-cutting concerns (environments, secrets, auth roles,
 * rate limits, data classification, cache policy, observability) so product
 * systems never reinvent them. Pure type module — server-safe, no network.
 */

// ─── Environments (P14-T026..T035) ──────────────────────────────────────────

export type Environment =
  | "local"
  | "development"
  | "test"
  | "preview"
  | "staging"
  | "production";

export const ENVIRONMENT_ORDER: Environment[] = [
  "local",
  "development",
  "test",
  "preview",
  "staging",
  "production",
];

export const PRODUCTION_ENVS: Environment[] = ["production", "staging"];

// ─── Configuration (P14-T036..T045) ──────────────────────────────────────────

export interface AppConfig {
  env: Environment;
  /** Canonical origin (scheme + host), used for SEO + redirects. */
  canonicalOrigin: string;
  isProduction: boolean;
  /** Whether the process should fail fast on missing critical config. */
  strict: boolean;
}

export type ConfigSource = "env" | "file" | "defaults";

// ─── Secrets (P14-T046..T057) ────────────────────────────────────────────────

export type SecretScope = "global" | "per-environment" | "per-service";

export interface SecretRef {
  key: string;
  /** Logical name documented for operators (never the value). */
  description: string;
  scope: SecretScope;
  /** Whether the secret is required to boot. */
  required: boolean;
  /** Rotation cadence in days, if applicable. */
  rotationDays?: number;
}

// ─── Authorization roles (P14-T069..T077) ────────────────────────────────────

export type UserRole = "user" | "editor" | "moderator" | "admin";

export interface RolePermissions {
  role: UserRole;
  canEditContent: boolean;
  canModerateCommunity: boolean;
  canManageUsers: boolean;
  canViewAdmin: boolean;
}

export const ROLE_PERMISSIONS: Record<UserRole, RolePermissions> = {
  user: {
    role: "user",
    canEditContent: false,
    canModerateCommunity: false,
    canManageUsers: false,
    canViewAdmin: false,
  },
  editor: {
    role: "editor",
    canEditContent: true,
    canModerateCommunity: false,
    canManageUsers: false,
    canViewAdmin: false,
  },
  moderator: {
    role: "moderator",
    canEditContent: false,
    canModerateCommunity: true,
    canManageUsers: false,
    canViewAdmin: true,
  },
  admin: {
    role: "admin",
    canEditContent: true,
    canModerateCommunity: true,
    canManageUsers: true,
    canViewAdmin: true,
  },
};

// ─── Rate limits (P14-T137..T147) ────────────────────────────────────────────

export type RateLimitScope = "user" | "ip" | "service";

export interface RateLimitRule {
  /** Stable identifier for the rule. */
  id: string;
  /** Endpoint or feature group this rule applies to. */
  endpoint: string;
  /** Number of requests allowed within the window. */
  limit: number;
  /** Window size in seconds. */
  windowSeconds: number;
  scope: RateLimitScope;
  /** Whether the limit is a hard block (true) or a soft throttle (false). */
  hard: boolean;
}

export const DEFAULT_RATE_LIMITS: RateLimitRule[] = [
  { id: "auth", endpoint: "/api/auth/*", limit: 10, windowSeconds: 60, scope: "ip", hard: true },
  { id: "ai", endpoint: "/api/mock-interviews/evaluate", limit: 20, windowSeconds: 60, scope: "user", hard: true },
  { id: "search", endpoint: "/api/search", limit: 60, windowSeconds: 60, scope: "ip", hard: false },
  { id: "resume-upload", endpoint: "/api/resume", limit: 5, windowSeconds: 60, scope: "user", hard: true },
  { id: "contribution", endpoint: "/api/community/contributions", limit: 10, windowSeconds: 60, scope: "user", hard: true },
  { id: "session-create", endpoint: "/api/mock-interviews/sessions", limit: 15, windowSeconds: 60, scope: "user", hard: true },
];

// ─── Data classification (P14-T165..T180) ────────────────────────────────────

export type DataSensitivity = "public" | "internal" | "personal" | "sensitive";

export interface DataAsset {
  id: string;
  name: string;
  system: string;
  sensitivity: DataSensitivity;
  /** Retention in days; undefined = indefinite until user deletion. */
  retentionDays?: number;
  /** Purpose statement (P14-T180). */
  purpose: string;
}

// ─── Cache policy (P14-T222..T238) ───────────────────────────────────────────

export type CacheTier = "public-cdn" | "server-shared" | "per-user" | "no-cache";

export interface CachePolicy {
  /** Route or API group. */
  key: string;
  tier: CacheTier;
  /** TTL in seconds. */
  ttlSeconds: number;
  /** Whether stale-while-revalidate is allowed. */
  swr: boolean;
}

export const DEFAULT_CACHE_POLICIES: CachePolicy[] = [
  { key: "content-pages", tier: "public-cdn", ttlSeconds: 3600, swr: true },
  { key: "community-public", tier: "public-cdn", ttlSeconds: 3600, swr: true },
  { key: "search", tier: "server-shared", ttlSeconds: 300, swr: true },
  { key: "ai-results", tier: "server-shared", ttlSeconds: 86400, swr: false },
  { key: "dashboard", tier: "per-user", ttlSeconds: 0, swr: false },
  { key: "resume", tier: "per-user", ttlSeconds: 0, swr: false },
];

// ─── Security headers (P14-T101..T108) ───────────────────────────────────────

export interface SecurityHeaders {
  contentSecurityPolicy: string;
  strictTransportSecurity: string;
  xFrameOptions: string;
  referrerPolicy: string;
  permissionsPolicy: string;
  xContentTypeOptions: string;
}

// ─── Observability (P14-T318..T360 area) ─────────────────────────────────────

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LogEvent {
  level: LogLevel;
  message: string;
  /** Structured context (no PII per P14-T179). */
  context?: Record<string, string | number | boolean | null>;
  /** Span/trace correlation id, if running under tracing. */
  traceId?: string;
}

export interface HealthCheckResult {
  name: string;
  status: "ok" | "degraded" | "down";
  latencyMs?: number;
  message?: string;
}
