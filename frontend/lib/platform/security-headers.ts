/**
 * security-headers.ts — Centralized security header values for Next.js.
 * P14-T101..T108 (CSP, HSTS, frame, referrer, permissions, MIME).
 *
 * These are the canonical header values; next.config + middleware apply them.
 * Production-only hardening (HSTS preload) is toggled by AppConfig.isProduction.
 */

import type { AppConfig, SecurityHeaders } from "./platform-types";

export function buildSecurityHeaders(config: AppConfig): SecurityHeaders {
  const csp = [
    "default-src 'self'",
    "base-uri 'self'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "object-src 'none'",
    "img-src 'self' data: https:",
    "font-src 'self' data:",
    // Inline styles/scripts allowed for Next.js SSR; nonces can replace this later.
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
    "connect-src 'self' https:",
    "frame-src 'self'",
    "upgrade-insecure-requests",
  ].join("; ");

  const strictTransportSecurity = config.isProduction
    ? "max-age=63072000; includeSubDomains; preload"
    : "max-age=0";

  return {
    contentSecurityPolicy: csp,
    strictTransportSecurity,
    xFrameOptions: "SAMEORIGIN",
    referrerPolicy: "strict-origin-when-cross-origin",
    permissionsPolicy: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
    xContentTypeOptions: "nosniff",
  };
}

/**
 * Headers suitable for Next.js `headers()` in next.config — returns the plain
 * `Record<string, string>` shape Next expects.
 */
export function nextSecurityHeaders(config: AppConfig): Record<string, string> {
  const h = buildSecurityHeaders(config);
  return {
    "Content-Security-Policy": h.contentSecurityPolicy,
    "Strict-Transport-Security": h.strictTransportSecurity,
    "X-Frame-Options": h.xFrameOptions,
    "Referrer-Policy": h.referrerPolicy,
    "Permissions-Policy": h.permissionsPolicy,
    "X-Content-Type-Options": h.xContentTypeOptions,
    // P14-T108: discourage clients from sniffing MIME or storing sensitive pages.
    "X-DNS-Prefetch-Control": "on",
    "Cross-Origin-Opener-Policy": "same-origin",
    "Cross-Origin-Resource-Policy": "same-origin",
  };
}
