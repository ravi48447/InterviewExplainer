/**
 * index.ts — Barrel for the shared production platform layer (Phase 14).
 * Importers use `@/lib/platform` for types, config, security headers,
 * authorization, rate limiting, logging, cache policy, validation, and data
 * classification.
 */

export * from "./platform-types";
export { getAppConfig, resetAppConfigCache } from "./platform-config";
export { buildSecurityHeaders, nextSecurityHeaders } from "./security-headers";
export {
  checkRateLimit,
  MemoryRateLimitStore,
  defaultStore,
} from "./rate-limit";
export type { RateLimitStore, RateLimitResult } from "./rate-limit";
export {
  permissionsFor,
  can,
  hasAtLeast,
  ROLE_RANK,
} from "./authorization";
export { logger } from "./logger";
export {
  getCachePolicy,
  nextRevalidate,
  cacheControlHeader,
  describeTier,
} from "./cache-policy";
export {
  normalizeString,
  isSafePath,
  isPublicHttpUrl,
  clampInt,
  validateString,
  stripMarkup,
} from "./validation";
export type { ValidationResult } from "./validation";
export {
  DATA_ASSETS,
  classifySensitivity,
  isLoggable,
  hasRetention,
} from "./data-classification";
