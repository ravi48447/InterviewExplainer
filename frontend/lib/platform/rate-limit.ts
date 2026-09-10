/**
 * rate-limit.ts — In-memory token-bucket / fixed-window rate limiter.
 * P14-T137..T147. This is a lightweight, dependency-free limiter suitable for
 * edge middleware and server actions. For multi-instance production, swap the
 * `store` for a Redis-backed implementation (same interface).
 */

import type { RateLimitRule } from "./platform-types";

export interface RateLimitStore {
  /** Returns [count, windowStart]. Must be atomic. */
  incr(key: string, windowSeconds: number): Promise<[number, number]>;
}

interface Entry { count: number; windowStart: number }

/** Default in-memory store. Not shared across instances. */
export class MemoryRateLimitStore implements RateLimitStore {
  private map = new Map<string, Entry>();

  async incr(key: string, windowSeconds: number): Promise<[number, number]> {
    const now = Math.floor(Date.now() / 1000);
    const windowStart = Math.floor(now / windowSeconds) * windowSeconds;
    const existing = this.map.get(key);
    if (!existing || existing.windowStart !== windowStart) {
      this.map.set(key, { count: 1, windowStart });
      return [1, windowStart];
    }
    existing.count += 1;
    return [existing.count, windowStart];
  }
}

export interface RateLimitResult {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetAt: number;
}

/**
 * Evaluate a rule for a caller. Returns whether the request is allowed plus
 * the headers a response should carry (X-RateLimit-*).
 */
export async function checkRateLimit(
  rule: RateLimitRule,
  callerId: string,
  store: RateLimitStore = defaultStore,
): Promise<RateLimitResult> {
  const key = `${rule.id}:${callerId}`;
  const [count, windowStart] = await store.incr(key, rule.windowSeconds);
  const remaining = Math.max(0, rule.limit - count);
  const resetAt = windowStart + rule.windowSeconds;
  return {
    allowed: count <= rule.limit,
    limit: rule.limit,
    remaining,
    resetAt,
  };
}

/** Shared default store for the process. */
export const defaultStore = new MemoryRateLimitStore();
