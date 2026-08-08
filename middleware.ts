/**
 * middleware.ts — Next.js middleware: applies platform security headers to
 * every response (P14-T101..T108). Runs on the edge runtime so headers land
 * before the route handler. Does not itself authenticate — that stays on the
 * server. Intentionally minimal: no dynamic imports, no DB access.
 */

import { NextResponse, type NextRequest } from "next/server";
import { getAppConfig, buildSecurityHeaders } from "@/lib/platform";

export function middleware(_request: NextRequest): NextResponse {
  const config = getAppConfig();
  const headers = buildSecurityHeaders(config);
  const response = NextResponse.next();
  // next.config.mjs already sets X-Frame-Options (DENY, stricter), X-Content-Type-Options,
  // Referrer-Policy, and Permissions-Policy. Middleware layers the headers next.config
  // does not own: CSP, HSTS, and the cross-origin isolation policies (P14-T101..T108).
  response.headers.set("Content-Security-Policy", headers.contentSecurityPolicy);
  response.headers.set("Strict-Transport-Security", headers.strictTransportSecurity);
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return response;
}

export const config = {
  // Apply to all routes except static asset paths, which the CDN handles.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml).*)"],
};
