/**
 * cache-policy.ts — Resolves Cache-Control + Next revalidate values from the
 * canonical cache policy table (P14-T222..T238). Centralizes the decision so
 * routes and API handlers never hand-roll cache headers.
 */

import type { CachePolicy, CacheTier } from "./platform-types";
import { DEFAULT_CACHE_POLICIES } from "./platform-types";

const POLICY_BY_KEY = new Map(DEFAULT_CACHE_POLICIES.map((p) => [p.key, p]));

export function getCachePolicy(key: string): CachePolicy | null {
  return POLICY_BY_KEY.get(key) ?? null;
}

/** Next.js `revalidate` value (seconds). 0 = always dynamic. */
export function nextRevalidate(key: string): number {
  const policy = getCachePolicy(key);
  if (!policy) return 0;
  if (policy.tier === "no-cache" || policy.tier === "per-user") return 0;
  return policy.ttlSeconds;
}

/** Cache-Control header value for an HTTP response. */
export function cacheControlHeader(key: string, isAuthed: boolean): string {
  const policy = getCachePolicy(key);
  if (!policy) return "no-store";
  if (isAuthed || policy.tier === "per-user" || policy.tier === "no-cache") {
    return "no-store";
  }
  if (policy.tier === "public-cdn") {
    return policy.swr
      ? `public, max-age=${policy.ttlSeconds}, stale-while-revalidate=60`
      : `public, max-age=${policy.ttlSeconds}`;
  }
  // server-shared
  return policy.swr
    ? `private, max-age=${policy.ttlSeconds}, stale-while-revalidate=30`
    : `private, max-age=${policy.ttlSeconds}`;
}

/** Tier label for diagnostics. */
export function describeTier(tier: CacheTier): string {
  switch (tier) {
    case "public-cdn": return "Public CDN cache (shared, indexable content)";
    case "server-shared": return "Server shared cache (non-personalized API)";
    case "per-user": return "Per-user (never shared, always dynamic)";
    case "no-cache": return "No caching";
  }
}
