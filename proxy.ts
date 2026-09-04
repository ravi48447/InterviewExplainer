import { NextRequest, NextResponse } from "next/server";
import {
  getSeoModuleBySlug,
  getCanonicalFromAlt,
  looksLikeSeoSlug,
  getDsaModuleFromSeoSlug,
  getDsaCanonicalFromAlt,
  isDsaSeoSlug,
} from "@/lib/seo-slugs";
import { PILLAR_HUB_SLUGS } from "@/lib/seo-pillars";
import { getAppConfig, buildSecurityHeaders } from "@/lib/platform";

/**
 * Proxy — URL canonicalisation + personalised level redirect
 *
 * (Renamed from `middleware.ts` for Next.js 16. See
 *  https://nextjs.org/docs/messages/middleware-to-proxy)
 *
 * Three URL systems live here:
 *
 * 1. /{domainSlug}/{stackSlug}/{questionSlug}
 *    Canonical "App URL" for every study page. This is what logged-in users
 *    traverse (e.g. /java-backend-intermediate/spring-boot/what-is-ioc).
 *
 * 2. /{seoSlug}, /{seoSlug}/{questionSlug}
 *    System-2 "SEO URL" per content/ARCHITECTURE.md. Google-indexed canonical.
 *    Internally rewritten to /seo/{seoSlug}[/{questionSlug}] so the dynamic
 *    routes don't collide with [domainSlug]. Alt-slugs 301 → canonical seoSlug.
 *
 * 3. /interview/{lang}/{track}/{level}/{stack}/{questionSlug}
 *    Legacy URL shape. Published curriculum domains redirect to their
 *    canonical App URL so every landing page reaches the shared full-content
 *    module and question layouts.
 *
 * Philosophy (MASTER_PLAN.md):
 *   - Unauthenticated / no preference → always serve intermediate (SEO default)
 *   - Logged-in user with saved level → silently 302 to their level's URL
 */

const KNOWN_LEVELS = new Set(["beginner", "intermediate", "advanced"]);

function stripNumericPrefix(segment: string): string {
  return segment.replace(/^\d+-/, "");
}

const LEGACY_LEVEL_MAP: Record<string, string> = {
  "0-1": "beginner",
  "1-3": "beginner",
  "3-5": "intermediate",
  "5+": "advanced",
  "5plus": "advanced",
};

const KNOWN_LANGS = new Set([
  "java", "python", "javascript", "typescript",
  "go", "kotlin", "csharp", "ruby",
]);

const KNOWN_TRACKS = new Set([
  "backend", "frontend", "fullstack",
  "data-engineering", "ml-ai", "devops", "cicd", "cloud", "infrastructure", "sre",
  "sql-analytics", "analysis",
]);

/**
 * Domains that have been fully migrated to the new locked architecture.
 * For these domains:
 *   - Legacy /interview/{lang}/{track}/{level}/... → 301 → /{domainSlug}/...
 *   - Old stack slugs (pre-rename) → 301 → new locked module slugs
 *   - Canonical App URL is rendered directly, no redirect to /interview/
 */
const MIGRATED_DOMAINS = new Set([
  "frontend-fresher",
  "frontend-intermediate",
  "go-fresher",
  "go-intermediate",
  "java-backend-fresher",
  "java-backend-intermediate",
  "java-fullstack-fresher",
  "java-fullstack-intermediate",
  "javascript-frontend-beginner",
  "javascript-frontend-intermediate",
  "python-backend-fresher",
  "python-backend-intermediate",
  "python-fullstack-beginner",
  "python-fullstack-intermediate",
  "ruby-backend-fresher",
  "ruby-backend-intermediate",
  "ruby-fullstack-beginner",
  "ruby-fullstack-intermediate",
]);

/**
 * Per-domain stack-slug rename map.
 * Old URL slug → new locked module slug.
 * Applied as a 301 so browsers, bookmarks and Google re-index to the new URL.
 */
const STACK_SLUG_RENAMES: Record<string, Record<string, string>> = {
  "java-backend-intermediate": {
    "collections-data-structures": "java-collections",
    "jvm-performance":              "jvm-internals",
    "spring-data-hibernate":        "spring-data-jpa",
    "rest-api-web":                 "rest-api",
    "security":                     "application-security",
    "devops-cicd":                  "cicd",
    "aws":                          "aws-cloud",
    "production-operations":        "production-sre",
    // Split-module aliases (old URL served by one of the new modules):
    "advanced-java":                "java-streams",
    "testing":                      "unit-testing",
    "architecture-design-patterns": "design-patterns",
    "database":                     "sql-databases",
    "event-driven":                 "messaging-events",
    "event-driven-architecture":    "messaging-events",
    "kafka":                        "messaging-events",
    "caching-performance":          "redis-caching",
    "redis":                        "redis-caching",
    "cloud-deployment":             "aws-cloud",
    "git":                          "git-build-tools",
    "maven-gradle":                 "java-build-tools",
    // Merge redirect (Apr 2026): advanced-testing folded into unit-testing.
    "advanced-testing":             "unit-testing",
    // Granular-split redirects (Apr 2026): umbrella App URLs kept pointing to
    // the umbrella module, but we now also publish focused alias URLs that
    // happen to match the new standalone moduleSlugs. Example:
    //   /java-backend-intermediate/gcp  (new) → /java-backend-intermediate/gcp (real)
    // Nothing to rename here because the new modules already have matching
    // App URLs. Aliases below are for common user-typed variants only.
    "google-cloud":                 "gcp",
    "microsoft-azure":              "azure",
    "iac":                          "terraform",
    "infrastructure-as-code":       "terraform",
    "amqp":                         "rabbitmq",
    "protobuf":                     "grpc",
    "oop":                          "java-oop",
  },
  // JFI is a greenfield track — no legacy URL shapes to rename. Its reused
  // modules share slugs with JBI (core-java, spring-boot, …) and resolve
  // content via _index.json.contentSource in the content-reader.
  "java-fullstack-intermediate": {},
};

/**
 * Domain-level SEO slugs — canonical and alt slugs that map to a domain's
 * App URL root (not a module SEO URL). These are NOT in `seo-slugs.ts` because
 * they don't resolve to a /seo/{slug} internal route; they simply 301 to the
 * domain landing page.
 *
 * Key: public SEO slug (canonical first, then alts pointing at same domain).
 * Value: canonical App URL root (must start with /).
 */
const DOMAIN_LEVEL_SEO_REDIRECTS: Record<string, string> = {
  "java-interview-questions-for-freshers":            "/java-backend-fresher",
  "core-java-interview-questions-for-beginners":      "/java-backend-fresher",
  "java-basic-interview-questions":                   "/java-backend-fresher",
  "java-fresher-interview-questions":                 "/java-backend-fresher",
  "java-developer-interview-questions-for-freshers":  "/java-backend-fresher",
};

// Paths that must NOT be touched at all.
// Note: /interview is intentionally NOT in this list because we want to
// inspect it and potentially 301 migrated domains.
const SKIP_PREFIXES = [
  "/dsa", "/tools", "/topics", "/compare", "/companies",
  "/dashboard", "/login", "/signup", "/profile", "/domains", "/search",
  "/mock-interviews", "/about", "/support", "/privacy", "/terms", "/cookies",
  "/api", "/_next", "/favicon", "/robots", "/sitemap", "/not-found",
  "/error", "/loading",
  // /prep is an internal-only route; direct hits to /prep and its dynamic
  // children must not be passed through the /{domainSlug} parser below.
  "/prep",
];

/**
 * Registered pillar-hub slugs (e.g. "cloud", "devops", "spring").
 * Sourced from seo-pillars.ts so the two registries stay in sync.
 * Each one is served by /app/prep/[pillarSlug]/page.tsx via an internal
 * rewrite — the browser URL stays as the short root slug.
 */
const PILLAR_HUB_SLUG_SET = new Set<string>(PILLAR_HUB_SLUGS);

interface ParsedDomain {
  lang: string;
  track: string;
  level: string;
  rawLevelSuffix: string;
}

function parseDomainSlug(slug: string): ParsedDomain | null {
  const parts = slug.split("-");
  if (parts.length < 3) return null;

  const lang = parts[0];
  if (!KNOWN_LANGS.has(lang)) return null;

  for (let trackEnd = parts.length - 1; trackEnd >= 2; trackEnd--) {
    const track = parts.slice(1, trackEnd).join("-");
    const rawLevelSuffix = parts.slice(trackEnd).join("-");

    if (!KNOWN_TRACKS.has(track)) continue;

    const level =
      KNOWN_LEVELS.has(rawLevelSuffix)
        ? rawLevelSuffix
        : LEGACY_LEVEL_MAP[rawLevelSuffix] ?? null;

    if (!level) continue;
    return { lang, track, level, rawLevelSuffix };
  }
  return null;
}

/** Build a domain slug from lang/track/level parts. */
function buildDomainSlug(lang: string, track: string, level: string): string {
  return `${lang}-${track}-${level}`;
}

/**
 * Apply a stack-slug rename for a migrated domain.
 * Returns the canonical slug (same as input if no rename applies).
 */
function canonicalStackSlug(domainSlug: string, stackSlug: string): string {
  const renames = STACK_SLUG_RENAMES[domainSlug];
  if (!renames) return stackSlug;
  return renames[stackSlug] ?? stackSlug;
}

export function proxy(request: NextRequest) {
  const response = handleProxy(request);
  applySecurityHeaders(response);
  return response;
}

/**
 * Applies the platform security headers (CSP, HSTS, cross-origin isolation)
 * to every response leaving the proxy. next.config.mjs owns the headers this
 * does not (X-Frame-Options, X-Content-Type-Options, Referrer-Policy,
 * Permissions-Policy); this layers the ones next.config cannot set
 * dynamically. Mirrors the former middleware.ts behaviour (P14-T101..T108).
 */
function applySecurityHeaders(response: NextResponse) {
  const config = getAppConfig();
  const headers = buildSecurityHeaders(config);
  response.headers.set("Content-Security-Policy", headers.contentSecurityPolicy);
  response.headers.set("Strict-Transport-Security", headers.strictTransportSecurity);
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
}

function handleProxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === "/") return NextResponse.next();

  // ────────────────────────────────────────────────────────────────────────
  // Branch 0a: Block direct access to /seo/... — it is an internal-only
  // rewrite target. Anyone hitting it directly gets a 301 to the public
  // SEO URL so we never expose duplicate content to Google.
  // ────────────────────────────────────────────────────────────────────────
  if (pathname.startsWith("/seo/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/seo/, "");
    return NextResponse.redirect(url, { status: 301 });
  }

  // ────────────────────────────────────────────────────────────────────────
  // Branch 0c: Block direct access to /prep/{pillarSlug} — pillar hubs are
  // surfaced at the root (/cloud, /devops, ...) by Branch 0d below. Direct
  // hits to the internal /prep/{slug} form 301 to the canonical public URL
  // so there is no duplicate content for Google. /prep itself (the category
  // index) is served normally.
  // ────────────────────────────────────────────────────────────────────────
  if (pathname.startsWith("/prep/")) {
    const url = request.nextUrl.clone();
    url.pathname = pathname.replace(/^\/prep/, "");
    return NextResponse.redirect(url, { status: 301 });
  }

  if (SKIP_PREFIXES.some(p => pathname.startsWith(p))) return NextResponse.next();

  const segments = pathname.split("/").filter(Boolean);
  if (segments.length < 1) return NextResponse.next();

  // ────────────────────────────────────────────────────────────────────────
  // Branch 0d: Pillar-hub root slugs — /{pillarSlug}
  //   Rewrites /cloud, /devops, /spring, etc. to /prep/{pillarSlug} so the
  //   dynamic hub route renders while the browser URL stays clean. Only
  //   exact one-segment hits are rewritten; anything deeper falls through
  //   (pillar hubs have no nested pages today).
  // ────────────────────────────────────────────────────────────────────────
  if (segments.length === 1 && PILLAR_HUB_SLUG_SET.has(segments[0])) {
    const url = request.nextUrl.clone();
    url.pathname = `/prep/${segments[0]}`;
    return NextResponse.rewrite(url);
  }

  // ────────────────────────────────────────────────────────────────────────
  // Branch 0e: DSA module SEO URLs  —  /{dsaSeoSlug}
  //   DSA modules live at /dsa/module/{moduleSlug} but also get a short
  //   root-level SEO URL (e.g. /big-o-interview-questions). We handle these
  //   *before* the general SEO branch because DSA modules don't live in a
  //   locked-domain `_index.json` and therefore don't have a /seo/{slug}
  //   internal rewrite target.
  //     - Alt slug → 301 to canonical DSA SEO slug
  //     - Canonical DSA SEO slug → internal rewrite to /dsa/module/{moduleSlug}
  // ────────────────────────────────────────────────────────────────────────
  if (segments.length === 1 && isDsaSeoSlug(segments[0])) {
    const slug = segments[0];
    const canonicalAlt = getDsaCanonicalFromAlt(slug);
    if (canonicalAlt) {
      const url = request.nextUrl.clone();
      url.pathname = `/${canonicalAlt}`;
      return NextResponse.redirect(url, { status: 301 });
    }
    const moduleSlug = getDsaModuleFromSeoSlug(slug);
    if (moduleSlug) {
      const url = request.nextUrl.clone();
      url.pathname = `/dsa/module/${moduleSlug}`;
      return NextResponse.rewrite(url);
    }
  }

  // ────────────────────────────────────────────────────────────────────────
  // Branch 0f: Domain-level SEO slugs  —  /{domainSeoSlug}
  //   These are root-level slugs that represent an entire domain (e.g.
  //   /java-interview-questions-for-freshers) rather than a single module.
  //   They 301 to the canonical domain App URL (/java-backend-fresher).
  //   Checked before Branch 0b because `looksLikeSeoSlug` returns true for
  //   *-interview-questions slugs, but `getSeoModuleBySlug` would return null
  //   and they'd silently fall through to a 404.
  // ────────────────────────────────────────────────────────────────────────
  if (segments.length === 1 && DOMAIN_LEVEL_SEO_REDIRECTS[segments[0]]) {
    const url = request.nextUrl.clone();
    url.pathname = DOMAIN_LEVEL_SEO_REDIRECTS[segments[0]];
    return NextResponse.redirect(url, { status: 301 });
  }

  // ────────────────────────────────────────────────────────────────────────
  // Branch 0b: System-2 SEO URLs  —  /{seoSlug}[/{questionSlug}]
  //   - Alt SEO slug → 301 to canonical SEO slug (preserving sub-path)
  //   - Canonical SEO slug → internal rewrite to /seo/{seoSlug}[/...]
  //   - Unknown *-interview-questions slug → fall through (will 404)
  // ────────────────────────────────────────────────────────────────────────
  if (looksLikeSeoSlug(segments[0])) {
    const seoCandidate = segments[0];

    // Alt slug 301 → canonical (preserves the rest of the path + query).
    const canonical = getCanonicalFromAlt(seoCandidate);
    if (canonical) {
      const url = request.nextUrl.clone();
      url.pathname = ["", canonical, ...segments.slice(1)].join("/");
      return NextResponse.redirect(url, { status: 301 });
    }

    // Known canonical → rewrite internally to /seo/... so Next.js serves the
    // dedicated SEO route. The browser URL stays as the clean SEO form.
    if (getSeoModuleBySlug(seoCandidate)) {
      const url = request.nextUrl.clone();
      url.pathname = ["", "seo", ...segments].join("/");
      return NextResponse.rewrite(url);
    }

    // Unknown *-interview-questions slug — let Next.js 404 it via the
    // [domainSlug] fallback (which returns notFound for non-domains).
  }

  // ────────────────────────────────────────────────────────────────────────
  // Branch A: /interview/{lang}/{track}/{level}/...
  //   - If the resulting domain is migrated → 301 to canonical App URL.
  //   - Otherwise leave untouched (legacy domains still use /interview).
  // ────────────────────────────────────────────────────────────────────────
  if (segments[0] === "interview") {
    if (segments.length < 4) return NextResponse.next();
    const [, lang, track, rawLevel, ...rest] = segments;

    const level =
      KNOWN_LEVELS.has(rawLevel) ? rawLevel : LEGACY_LEVEL_MAP[rawLevel];
    if (!level || !KNOWN_LANGS.has(lang) || !KNOWN_TRACKS.has(track)) {
      return NextResponse.next();
    }

    const domainSlug = buildDomainSlug(lang, track, level);
    if (!MIGRATED_DOMAINS.has(domainSlug)) {
      // Non-migrated domain — keep /interview/ URL shape for now.
      return NextResponse.next();
    }

    // Migrated: rewrite any old stack slug to its new name and 301.
    const rewritten = [...rest];
    if (rewritten.length >= 1) {
      rewritten[0] = canonicalStackSlug(domainSlug, stripNumericPrefix(rewritten[0]));
    }

    const url = request.nextUrl.clone();
    url.pathname = ["", domainSlug, ...rewritten].join("/");
    return NextResponse.redirect(url, { status: 301 });
  }

  // ────────────────────────────────────────────────────────────────────────
  // Branch B: /{domainSlug}/{stackSlug}/{questionSlug}
  // ────────────────────────────────────────────────────────────────────────
  const [domainSlug, ...rest] = segments;
  const parsed = parseDomainSlug(domainSlug);
  if (!parsed) return NextResponse.next();

  // ── 301: Canonicalise legacy numeric level suffixes ──
  //    /java-backend-0-1/... → /java-backend-beginner/...
  //    /java-backend-5+/...  → /java-backend-advanced/...
  if (parsed.rawLevelSuffix !== parsed.level) {
    const canonicalDomainSlug = buildDomainSlug(parsed.lang, parsed.track, parsed.level);
    const canonicalRest = [...rest];
    if (MIGRATED_DOMAINS.has(canonicalDomainSlug) && canonicalRest.length >= 1) {
      canonicalRest[0] = canonicalStackSlug(canonicalDomainSlug, stripNumericPrefix(canonicalRest[0]));
    }
    const url = request.nextUrl.clone();
    url.pathname = ["", canonicalDomainSlug, ...canonicalRest].join("/");
    return NextResponse.redirect(url, { status: 301 });
  }

  // ── Migrated domain: render directly, after normalising the stack slug ──
  if (MIGRATED_DOMAINS.has(domainSlug)) {
    if (rest.length >= 1) {
      const raw = rest[0];
      const stripped = stripNumericPrefix(raw);
      const canonical = canonicalStackSlug(domainSlug, stripped);
      // 301 only if the URL's stack slug differs from canonical.
      if (canonical !== raw) {
        const url = request.nextUrl.clone();
        url.pathname = ["", domainSlug, canonical, ...rest.slice(1)].join("/");
        return NextResponse.redirect(url, { status: 301 });
      }
    }
    // Fall through to the personalised-level check below, no rewrite needed.
  } else {
    // ── 301: Non-migrated domain — keep the existing /interview/ rewrite ──
    if (rest.length >= 1) {
      const [stackSlug, ...questionParts] = rest;
      const strippedStack = stripNumericPrefix(stackSlug);
      const url = request.nextUrl.clone();
      url.pathname = [
        "",
        "interview",
        parsed.lang,
        parsed.track,
        parsed.level,
        strippedStack,
        ...questionParts,
      ].join("/");
      return NextResponse.redirect(url, { status: 301 });
    }
  }

  // ── 302: Personalised level redirect (logged-in users) ──────────────────
  const savedLevel = request.cookies.get("ie_level")?.value;
  if (
    savedLevel &&
    KNOWN_LEVELS.has(savedLevel) &&
    savedLevel !== parsed.level
  ) {
    const newDomainSlug = buildDomainSlug(parsed.lang, parsed.track, savedLevel);
    const url = request.nextUrl.clone();
    url.pathname = ["", newDomainSlug, ...rest].join("/");
    // 302 — don't break SEO on the intermediate URL.
    return NextResponse.redirect(url, { status: 302 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next|api|favicon\\.ico|robots\\.txt|sitemap|.*\\.png|.*\\.jpg|.*\\.svg|.*\\.ico|.*\\.css|.*\\.js|.*\\.woff2?).*)",
  ],
};
