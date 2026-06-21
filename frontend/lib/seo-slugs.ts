/**
 * seo-slugs.ts
 *
 * Single source of truth for the System-2 "SEO URL" namespace defined in
 * content/ARCHITECTURE.md.
 *
 *   App URL   (System-1, study path):  /{domainSlug}/{moduleSlug}
 *   SEO URL   (System-2, canonical):   /{seoSlug}
 *   Alt SEO   (301 → canonical):       /{altSeoSlug}
 *
 * Entries are derived from each locked domain's `_index.json` at module-load
 * time so adding or renaming a module only requires editing the content
 * index — this registry stays in sync automatically.
 *
 * Reused modules (entries with `contentSource`) are SKIPPED intentionally:
 * they reuse another domain's physical content and must not create a second
 * SEO URL (Google would see duplicate content under two canonical hosts).
 * The reusing track still has its own App URL, only SEO URLs are deduped.
 */

import jbiIndex from "../../content/java-backend-intermediate/_index.json";
import jfiIndex from "../../content/java-fullstack-intermediate/_index.json";
import jbfIndex from "../../content/java-backend-fresher/_index.json";
import jffIndex from "../../content/java-fullstack-fresher/_index.json";
import dsaIndex from "../../content/dsa/_index.json";
import goiIndex from "../../content/go-intermediate/_index.json";
import gofIndex from "../../content/go-fresher/_index.json";
import rbiIndex from '../../content/ruby-backend-intermediate/_index.json';
import rbfIndex from '../../content/ruby-backend-fresher/_index.json';

export interface SeoModuleEntry {
  /** Canonical SEO slug (e.g. "spring-boot-interview-questions") */
  seoSlug: string;
  /** Domain this module lives under (e.g. "java-backend-intermediate") */
  domainSlug: string;
  /** Module slug on the App URL side (e.g. "spring-boot") */
  moduleSlug: string;
  /** Human-readable title, e.g. "Spring Boot" */
  title: string;
  /** Pillar identifier, e.g. "Spring Ecosystem" */
  pillarName: string;
  /** Alt SEO slugs that 301 → seoSlug */
  altSlugs: string[];
  /**
   * Long-form introduction paragraph for the landing page. 150-250 words,
   * hand-tuned per module in `_index.json` — explains what the domain is,
   * what's covered, and how it sits next to sibling SEO surfaces. Rendered
   * as the first prose block under the hero on the SEO landing page.
   */
  intro?: string;
}

interface RawModuleEntry {
  moduleNumber?: string;
  pillar?: string;
  pillarName?: string;
  moduleSlug?: string;
  title?: string;
  seoSlug?: string;
  altSlugs?: string[];
  intro?: string;
  contentSource?: { domain: string; moduleSlug: string };
}

interface RawIndexFile {
  appRoot?: string;
  modules?: RawModuleEntry[];
}

function resolveDomainSlug(idx: RawIndexFile, fallback: string): string {
  return typeof idx.appRoot === "string"
    ? idx.appRoot.replace(/^\//, "")
    : fallback;
}

function buildEntries(
  idx: RawIndexFile,
  fallbackDomainSlug: string,
): SeoModuleEntry[] {
  const domainSlug = resolveDomainSlug(idx, fallbackDomainSlug);
  return (idx.modules ?? [])
    // Skip reused modules — they share SEO namespace with their source domain.
    .filter((m) => !m?.contentSource)
    .filter((m): m is Required<Pick<RawModuleEntry, "seoSlug" | "moduleSlug" | "title" | "pillarName">> & RawModuleEntry =>
      Boolean(m && m.seoSlug && m.moduleSlug && m.title && m.pillarName),
    )
    .map((m) => ({
      seoSlug: m.seoSlug,
      domainSlug,
      moduleSlug: m.moduleSlug,
      title: m.title,
      pillarName: m.pillarName,
      altSlugs: Array.isArray(m.altSlugs) ? m.altSlugs : [],
      intro: typeof m.intro === "string" && m.intro.trim() ? m.intro.trim() : undefined,
    }));
}

/**
 * Registry of all modules exposed via their SEO URL. Merged across every
 * locked domain; reused modules are excluded per the dedup policy above.
 */
export const SEO_MODULES: readonly SeoModuleEntry[] = [
  ...buildEntries(jbiIndex as RawIndexFile, "java-backend-intermediate"),
  ...buildEntries(jfiIndex as RawIndexFile, "java-fullstack-intermediate"),
  ...buildEntries(jbfIndex as RawIndexFile, "java-backend-fresher"),
  ...buildEntries(jffIndex as RawIndexFile, "java-fullstack-fresher"),
  ...buildEntries(goiIndex as RawIndexFile, "go-intermediate"),
  ...buildEntries(gofIndex as RawIndexFile, "go-fresher"),
  ...buildEntries(rbiIndex as RawIndexFile, "ruby-backend-intermediate"),
  ...buildEntries(rbfIndex as RawIndexFile, "ruby-backend-fresher"),
];

// ─── Lookup helpers ──────────────────────────────────────────────────────────

const SEO_BY_SLUG: Map<string, SeoModuleEntry> = new Map(
  SEO_MODULES.map((m) => [m.seoSlug, m]),
);

/** Map of altSlug → canonical seoSlug for 301 redirects. */
const ALT_TO_CANONICAL: Map<string, string> = new Map();
for (const m of SEO_MODULES) {
  for (const alt of m.altSlugs) ALT_TO_CANONICAL.set(alt, m.seoSlug);
}

/** Fast map from domainSlug+moduleSlug → seoSlug (for canonical-tag lookup). */
const MODULE_TO_SEO: Map<string, string> = new Map(
  SEO_MODULES.map((m) => [`${m.domainSlug}::${m.moduleSlug}`, m.seoSlug]),
);

/** Returns the SEO module entry for a canonical SEO slug, or null. */
export function getSeoModuleBySlug(seoSlug: string): SeoModuleEntry | null {
  return SEO_BY_SLUG.get(seoSlug) ?? null;
}

/**
 * Returns the canonical seoSlug for an alt slug, or null if the given slug
 * is not an alt slug (either it's canonical already or unknown).
 */
export function getCanonicalFromAlt(altSlug: string): string | null {
  return ALT_TO_CANONICAL.get(altSlug) ?? null;
}

/**
 * Given a domain + module slug, returns the matching SEO slug, or null if the
 * module has not been migrated to the SEO URL system yet.
 */
export function getSeoSlugForModule(
  domainSlug: string,
  moduleSlug: string,
): string | null {
  return MODULE_TO_SEO.get(`${domainSlug}::${moduleSlug}`) ?? null;
}

/**
 * Returns true if `slug` looks like an SEO-namespace slug.
 *
 * The most common SEO URL shape is `*-interview-questions` (which we keep as
 * a cheap prefilter), but some modules ship with curated, non-suffixed SEO
 * slugs (e.g. `system-design-problems`, `low-level-design-interview-questions`,
 * alt slugs like `system-design-case-studies`). Consult the registry so those
 * paths aren't silently re-routed to the `/[domainSlug]/[stackSlug]` handler
 * and 404-spam the content API.
 */
export function looksLikeSeoSlug(slug: string): boolean {
  if (slug.endsWith("-interview-questions") && slug.length > "-interview-questions".length) {
    return true;
  }
  return (
    SEO_BY_SLUG.has(slug) ||
    ALT_TO_CANONICAL.has(slug) ||
    DSA_SEO_TO_MODULE.has(slug) ||
    DSA_ALT_TO_CANONICAL.has(slug)
  );
}

/** True iff `slug` is a known canonical SEO slug or one of its alt slugs. */
export function isKnownSeoSlug(slug: string): boolean {
  return SEO_BY_SLUG.has(slug) || ALT_TO_CANONICAL.has(slug);
}

/** Returns every SEO module entry whose pillar matches `pillarName`. */
export function getSeoModulesByPillar(pillarName: string): readonly SeoModuleEntry[] {
  return SEO_MODULES.filter((m) => m.pillarName === pillarName);
}

// ─── DSA SEO slugs (separate namespace from locked-domain modules) ───────────
//
// DSA modules live in `content/dsa/_index.json` under a `modules[]` array.
// Unlike locked-domain modules they don't render via /{domainSlug}/{moduleSlug}
// — they render via /dsa/module/{moduleSlug}. We still want each module to
// own a short root-level SEO URL (e.g. /big-o-interview-questions).
//
// The registry below is consumed by proxy.ts to rewrite the root SEO URL to
// the internal DSA module route. This keeps the pretty URL in the browser
// and avoids duplicate content (only one canonical per module).

interface RawDsaModule {
  moduleSlug?: string;
  seoSlug?: string;
  altSlugs?: string[];
}

interface RawDsaIndex {
  modules?: RawDsaModule[];
}

export interface DsaSeoEntry {
  seoSlug: string;
  moduleSlug: string;
  altSlugs: string[];
}

export const DSA_SEO_MODULES: readonly DsaSeoEntry[] = (
  (dsaIndex as RawDsaIndex).modules ?? []
)
  .filter(
    (m): m is Required<Pick<RawDsaModule, "seoSlug" | "moduleSlug">> & RawDsaModule =>
      Boolean(m?.seoSlug && m?.moduleSlug),
  )
  .map((m) => ({
    seoSlug: m.seoSlug,
    moduleSlug: m.moduleSlug,
    altSlugs: Array.isArray(m.altSlugs) ? m.altSlugs : [],
  }));

const DSA_SEO_TO_MODULE: Map<string, string> = new Map(
  DSA_SEO_MODULES.map((m) => [m.seoSlug, m.moduleSlug]),
);

const DSA_ALT_TO_CANONICAL: Map<string, string> = new Map();
for (const m of DSA_SEO_MODULES) {
  for (const alt of m.altSlugs) DSA_ALT_TO_CANONICAL.set(alt, m.seoSlug);
}

/**
 * If `slug` is the canonical SEO slug of a DSA module, return the matching
 * moduleSlug (used to rewrite `/big-o-interview-questions` → `/dsa/module/
 * complexity-big-o`). Returns null otherwise.
 */
export function getDsaModuleFromSeoSlug(slug: string): string | null {
  return DSA_SEO_TO_MODULE.get(slug) ?? null;
}

/**
 * If `slug` is an alt slug of a DSA module, return the canonical DSA SEO
 * slug (used to 301 alt → canonical). Returns null otherwise.
 */
export function getDsaCanonicalFromAlt(slug: string): string | null {
  return DSA_ALT_TO_CANONICAL.get(slug) ?? null;
}

/**
 * True iff `slug` is any DSA SEO or alt slug. Cheap membership test used by
 * the proxy to short-circuit into the DSA branch before the general SEO
 * branch runs.
 */
export function isDsaSeoSlug(slug: string): boolean {
  return DSA_SEO_TO_MODULE.has(slug) || DSA_ALT_TO_CANONICAL.has(slug);
}
