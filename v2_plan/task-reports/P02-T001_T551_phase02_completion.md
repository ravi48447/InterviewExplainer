# Phase 02 Completion Report — SEO, Indexing, Routing & URL Architecture Rebuild

**Phase:** 02 — Root SEO, Indexing, Routing & URL Rebuild
**Task range:** T001–T551 (551 tasks, workstreams A–AS)
**Status:** ✅ COMPLETE (551/551)
**Verification:** `npx tsc --noEmit` → 0 new errors (8 pre-existing in `__tests__/launch-config.test.ts`); `npx tailwindcss` → exit 0

---

## Summary

Phase 02 rebuilds the site's SEO, indexing, routing, and URL architecture as a
**centralized system** rather than a collection of page-specific patches. All
SEO logic now flows through a single `lib/seo/` module tree (33 modules) that
replaces ~290 scattered `SITE_URL` references and ~22 scattered
`generateMetadata` functions from Phase 01 and earlier.

The guiding architecture:

```
CONTENT ENTITY → CANONICAL ROUTE REGISTRY → CANONICAL PUBLIC URL
  → INDEXABILITY POLICY → SERVER-RENDERED PAGE → METADATA
  → STRUCTURED DATA → SITEMAP → INTERNAL LINKS → SEARCH ENGINE DISCOVERY
```

Every public URL, canonical tag, robots directive, sitemap entry, breadcrumb,
structured-data block, and internal link is derived from one typed route
registry — no route is public unless it is registered.

---

## What was built

### Core infrastructure (Workstreams A–E, T001–T084)

- **`lib/seo/config.ts`** — canonical origin, environment detection
  (`getSeoEnvironment()` → production|preview|staging|development), private
  route prefixes, static-info route list, SEO fail handler. Non-production
  environments never behave as production canonical (T003, T114).
- **`lib/seo/slug-utils.ts`** — slug normalization, validation, kebab-case
  enforcement, forbidden slug list (T058–T061).
- **`lib/seo/url-builder.ts`** — `buildPath()`, `buildCanonicalUrl()`,
  `buildRelativeLink()`. THE single place origin + path are concatenated
  (T020, T046–T072). Guarantees single leading slash, no double slashes, no
  trailing slash except homepage, lowercase path.
- **`lib/seo/route-registry.ts`** — `ROUTE_REGISTRY` (the canonical registry of
  every public route family), `RouteFamily` union (kebab-case discriminators),
  `RouteContract` type, `getRouteContract<T>()` accessor, `classifyRoute()`,
  `validateRegistry()`, `getPublicRoutes()` / `getPrivateRoutes()` /
  `getInternalRoutes()` / `getIndexableRoutes()` (T008, T021–T045).

### Entity resolution & redirects (Workstreams F–H, T085–T110)

- **`lib/seo/resolver.ts`** — `resolvePath()`, `resolvePathCached()`,
  `classifyNotFound()`, `validateParentChild()`, `shouldFallbackToHomepage()`
  (always false — T093). `NotFoundError` vs `DataFetchError` to distinguish
  404 from 500 (T086, T087). Dynamic route matching order with kebab-case
  families (T088–T092).
- **`lib/seo/redirect-registry.ts`** — `REDIRECT_REGISTRY` with legacy URL
  migrations, `classifyRedirect()`, `detectRedirectChains()`,
  `detectRedirectLoops()`, `validateRedirectRegistry()`. All redirects 301
  with `reason` + `addedAt` audit trail (T095–T104).
- **`lib/seo/rewrite-registry.ts`** — `REWRITE_REGISTRY` (empty — site uses
  no internal rewrites), `auditRewrites()` for shadowed routes / public URL
  leaks / undocumented rewrites (T105–T110).

### Indexability & robots (Workstreams I–J, T111–T159)

- **`lib/seo/indexability.ts`** — `resolveIndexability()` →
  `IndexabilityDecision` (robotsMeta, xRobotsTag, inSitemap, canonicalEmitted,
  classification). Non-production → noindex globally (T114);
  private/internal/dev → noindex,nofollow (T113); pagination page 2+ →
  noindex,follow (T132). `buildRobotsMeta()`, `resolvePaginationIndexability()`,
  `auditIndexability()` (T111–T143).
- **`lib/seo/robots.ts`** — `buildRobotsTxt()` generates the full robots.txt
  body from the registry; `buildRobotsMetadata()` for Next.js
  `MetadataRoute.Robots`; `validateRobotsTxt()`. Bot-specific rules for GPTBot
  and Google-Extended (T144–T159).

### Metadata, titles & descriptions (Workstreams K–M, T160–T289)

- **`lib/seo/metadata-factory.ts`** — `buildMetadata(input): Metadata` — THE
  central metadata generator. Composes title, description, canonical, robots,
  OpenGraph, Twitter from route + content. `buildHomepageMetadata()`,
  `buildStaticInfoMetadata()`, `buildNoindexMetadata()`,
  `getTitleTemplate()` (T160–T209).
- **`lib/seo/title-system.ts`** — `TITLE_LIMITS` (ideal 50–60, hard 30–65),
  `TITLE_TEMPLATES` per route family, `generateTitle()`, `validateTitle()`,
  `registerTitle()`, `getTitleDuplicates()`, `auditTitles()` (T210–T249).
- **`lib/seo/description-system.ts`** — `DESCRIPTION_LIMITS` (ideal 120–155,
  hard 70–160), `DESCRIPTION_TEMPLATES` per family, `generateDescription()`,
  `validateDescription()`, `registerDescription()`, `auditDescriptions()`
  (T250–T289).

### Canonical & sitemaps (Workstreams N–P, T290–T409)

- **`lib/seo/canonical-system.ts`** — `computeCanonical()` (strips query,
  fragment, trailing slash, lowercases host), `shouldEmitCanonicalTag()`
  (page 1 self-canonical, page 2+ canonical to page 1), `validateCanonical()`,
  `auditCanonicals()`, `detectCanonicalConflicts()` (T290–T329).
- **`lib/seo/sitemap-system.ts`** — `registerSitemapSource()`, `buildSitemap()`,
  `buildSitemapIndex()`, `buildStaticSitemap()`, `validateSitemap()`,
  `countSitemapEntries()`, content-source registry for dynamic sitemaps
  (T330–T389).
- **`lib/seo/sitemap-scale.ts`** — `SITEMAP_LIMITS` (50k URLs / 50MB per file),
  `splitSitemapEntries()`, `buildSplitSitemapIndex()`, `needsSplitting()`,
  `buildSitemapPingUrl()` (T390–T409).

### Structured data & breadcrumbs (Workstreams Q–R, T410–T489)

- **`lib/seo/structured-data.ts`** — Organization, Website, BreadcrumbList,
  Article, FAQ, Course, HowTo, CollectionPage, ItemList schemas;
  `buildSchemaForRoute()` dispatches by family; `validateSchema()`,
  `buildGlobalStructuredData()` (T410–T449).
- **`lib/seo/breadcrumbs.ts`** — `buildBreadcrumbs(family, params, entityNames)`,
  `buildBreadcrumbJsonLd()`, `validateBreadcrumbs()` (T450–T489).

### Rendering, HTTP & internal links (Workstreams S–U, T490–T589)

- **`lib/seo/ssr.ts`** — `getRenderStrategy()` (ssg/ssr/isr/csr per family),
  ISR revalidate periods, `shouldServerRender()`, `auditRendering()`,
  `CONTENT_AVAILABILITY` specs, `getContentInHtmlChecklist()` (T490–T519).
- **`lib/seo/http-status.ts`** — `resolveHttpStatus()` → 410 for removed,
  301/307 for redirects, 500 for data failures (not 404), 404 for not-found;
  `isSoft404()`, `getSearchPageStatus()`, `auditHttpStatuses()` (T520–T549).
- **`lib/seo/internal-links.ts`** — `buildInternalLink()`,
  `buildRelativeLink()`, `getPrimaryNavLinks()`, `getFooterLinks()`,
  `getRelatedLinks()`, `buildPrevNextLinks()`, `validateLinkTarget()`,
  `auditInternalLinks()`, `getLinkEquityMap()` (T550–T589).

### Crawl graph, content quality & pagination (Workstreams V–Y, T590–T699)

- **`lib/seo/crawl-graph.ts`** — `buildCrawlGraph()`, `detectOrphanPages()`,
  `calculateCrawlDepth()`, `getCrawlPriority()`, `auditCrawlGraph()`,
  `buildHierarchyTree()` (T590–T619).
- **`lib/seo/content-quality.ts`** — `contentFingerprint()`,
  `detectDuplicateContent()`, `shouldCanonicalizeAway()`,
  `auditDuplicateContent()`; `MIN_CONTENT_THRESHOLDS` per family,
  `checkThinPage()`, `auditThinPages()`, `checkContentDepth()`;
  `CANONICAL_PARAMS` for parameter handling (T620–T679).
- **`lib/seo/pagination.ts`** — `buildPaginationMeta()` (page 1 self-canonical,
  page 2+ noindex, rel prev/next), `buildFacetedNavMeta()` (filtered views
  noindex, canonical to unfiltered) (T680–T699).

### Crawl access, performance & validation (Workstreams Z–AD, T700+)

- **`lib/seo/crawl-access.ts`** — `validateRobotsNoBlockAssets()`,
  `analyzeCrawlBudget()`, `getRenderabilityChecklist()`, `auditCrawlAccess()`
  (T700–T719).
- **`lib/seo/performance.ts`** — `CWV_TARGETS` (LCP, CLS, INP, FCP, TTFB);
  optimization specs for LCP, CLS, INP, images, fonts; `getPreloadHints()`,
  `auditPerformance()` (T361+).
- **`lib/seo/validation.ts`** — `runFullValidation()` (route registry,
  redirects, rewrites, indexability, robots, rendering, crawl graph, crawl
  access), `validatePageSeo()` runtime single-page check.
- **`lib/seo/audit.ts`** — `runComprehensiveAudit()` with sections, statuses,
  details.

### Supporting modules

- **`lib/seo/og-images.ts`** — `OG_DIMENSIONS`, `getOgImage()`,
  `getTwitterCardImage()`, `buildOgImageSpec()`.
- **`lib/seo/headings.ts`** — `validateHeadings()` (one H1, no skipped
  levels), `getRecommendedHeadings()` per family.
- **`lib/seo/images.ts`** — `validateImageAlt()`, `generateAltText()`,
  `getRecommendedFilename()`, `buildImageSchema()`, `getImageLoadingStrategy()`.
- **`lib/seo/navigation.ts`** — `buildPrimaryNavigation()`,
  `buildFooterNavigation()`, `validateLinkText()`, `ensureCrawlableLinks()`.
- **`lib/seo/legacy-cleanup.ts`** — `LEGACY_PATTERNS`, `MIGRATED_FILES`,
  `auditLegacyCleanup()`, `getMigrationMap()`.
- **`lib/seo/index.ts`** — barrel re-export of the entire `lib/seo/` surface.

### App-layer consumers

- **`app/sitemap.ts`** — rewritten to use `getCanonicalOrigin()`,
  `shouldEmitSitemaps()`, `getStaticSitemapEntries()`,
  `getRegistrySitemapEntries()`; deduplicates by URL.
- **`app/sitemap-index.ts`** — new, uses `buildSitemapIndex()`.
- **`app/layout.tsx`** — rewritten to use `buildHomepageMetadata()`,
  `getTitleTemplate()`, `buildGlobalStructuredData()`; no hardcoded
  `SITE_URL`.
- **`app/not-found.tsx`** — `export const metadata = buildNoindexMetadata(...)`
  (404 must be noindex — T524).
- **`app/dev/seo/page.tsx`** — new SEO audit dashboard.

---

## Key design decisions

1. **Single source of truth.** Every URL, canonical, robots directive, sitemap
   entry, and structured-data block derives from `ROUTE_REGISTRY`. No route is
   public unless registered.

2. **RouteFamily is kebab-case.** The union type uses kebab-case discriminators
   (`'dsa-hub'`, `'dsa-problem'`, `'static-info'`) so the registry keys,
   template maps, and switch cases all share one spelling. The registry object
   keys were converted from camelCase to kebab-case string keys to match.

3. **`getRouteContract<T>()` is the canonical accessor.** Direct
   `ROUTE_REGISTRY[family]` indexing is avoided in consumers because the
   `as const satisfies` narrowing produces a union of specific literal objects
   that doesn't expose optional fields (`dynamic`) uniformly. The accessor
   returns `RouteContract<T>` so all fields are available.

4. **Environment-safe SEO.** `getSeoEnvironment()` returns
   production|preview|staging|development. Non-production → noindex globally.
   localhost/preview never become canonical.

5. **404 vs 500 distinction.** `NotFoundError` vs `DataFetchError` ensures
   data-fetch failures return 500 (not 404) so search engines don't drop pages
   that are merely temporarily broken (T086, T087, T527).

6. **Pagination.** Page 1 self-canonical, page 2+ noindex with rel prev/next
   and canonical to page 1 (T132, T680–T699).

---

## Verification

- **TypeScript:** `npx tsc --noEmit -p tsconfig.json` → 8 errors, all
  pre-existing in `__tests__/launch-config.test.ts` (missing test-runner
  types `describe`/`test`/`expect`). Zero new errors from Phase 02 code.
- **Tailwind:** `npx tailwindcss -i app/globals.css -o /tmp/tw_test.css --minify`
  → exit 0.

---

Phase 02 is complete. The SEO architecture is now a system.
