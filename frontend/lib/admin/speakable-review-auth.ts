/**
 * Phase 1.8 admin auth — bare-minimum gate.
 *
 * Compares a query-param `?key=...` against the env `SPEAKABLE_ADMIN_KEY`.
 * **Not production-grade** — see HUMAN-REVIEW-QUEUE.md AUTH-1. Used only
 * to prevent accidental access during local dev. A real auth scheme
 * (NextAuth + role check, middleware, etc.) must replace this before any
 * external use.
 */

import { NextRequest } from "next/server";

export interface AuthResult {
  ok: boolean;
  reason?: string;
}

export function checkAdminKey(req: NextRequest): AuthResult {
  const expected = process.env.SPEAKABLE_ADMIN_KEY;
  if (!expected) {
    return {
      ok: false,
      reason: "SPEAKABLE_ADMIN_KEY env var not set on the server.",
    };
  }
  const supplied = req.nextUrl.searchParams.get("key");
  if (!supplied) {
    return { ok: false, reason: "Missing ?key=... query parameter." };
  }
  if (supplied !== expected) {
    return { ok: false, reason: "Invalid admin key." };
  }
  return { ok: true };
}
