/**
 * platform-config.ts — Resolves the runtime AppConfig from the environment.
 * P14-T026..T045. Server-safe: only reads process.env.NODE_ENV and the
 * NEXT_PUBLIC_CANONICAL_ORIGIN convention; never throws for missing optional
 * values (strict mode is opt-in).
 */

import type { AppConfig, Environment } from "./platform-types";

function resolveEnv(nodeEnv: string | undefined): Environment {
  switch (nodeEnv) {
    case "production":
      return "production";
    case "staging":
      return "staging";
    case "test":
      return "test";
    case "preview":
      return "preview";
    case "development":
      return "development";
    default:
      return "local";
  }
}

function resolveCanonicalOrigin(env: Environment, explicit?: string): string {
  if (explicit && /^https?:\/\//.test(explicit)) return explicit.replace(/\/$/, "");
  switch (env) {
    case "production":
      return "https://interviewexplainer.app";
    case "staging":
      return "https://staging.interviewexplainer.app";
    case "preview":
      return "https://preview.interviewexplainer.app";
    case "test":
      return "http://localhost:3000";
    default:
      return "http://localhost:3000";
  }
}

let cached: AppConfig | null = null;

/**
 * Returns the resolved app config. Memoized per process. Safe to call from
 * both server and client components — only reads public env conventions.
 */
export function getAppConfig(): AppConfig {
  if (cached) return cached;

  const nodeEnv = process.env.NODE_ENV;
  const env = resolveEnv(nodeEnv);
  const canonicalOrigin = resolveCanonicalOrigin(
    env,
    process.env.NEXT_PUBLIC_CANONICAL_ORIGIN,
  );
  const isProduction = env === "production";
  const strict = process.env.PLATFORM_STRICT === "1" && isProduction;

  cached = { env, canonicalOrigin, isProduction, strict };
  return cached;
}

/**
 * Resets the cached config. Exposed for tests that swap NODE_ENV.
 */
export function resetAppConfigCache(): void {
  cached = null;
}
