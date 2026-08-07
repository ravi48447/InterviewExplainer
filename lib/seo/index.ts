/**
 * lib/seo/index.ts — Central SEO Module Barrel (P02-T001)
 *
 * Single import surface for all SEO functionality. All pages, components,
 * and config files import from here:
 *
 *   import { buildMetadata, buildBreadcrumbs, urlFor } from '@/lib/seo'
 *
 * This replaces the 290 scattered SITE_URL references (T012) and 22
 * scattered generateMetadata functions (T005) with one canonical system.
 */

// Config (Workstream A/B)
export {
  PRODUCTION_ORIGIN,
  getSeoEnvironment,
  getCanonicalOrigin,
  normalizeOrigin,
  isIndexableEnvironment,
  shouldEmitSitemaps,
  SITE_CONFIG,
  DEFAULT_INDEXABILITY,
  PRIVATE_ROUTE_PREFIXES,
  STATIC_INFO_ROUTES,
  seoFail,
} from './config'

// Route Registry (Workstream C)
export {
  ROUTE_REGISTRY,
  getRouteContract,
  getPublicRoutes,
  getPrivateRoutes,
  getInternalRoutes,
  getIndexableRoutes,
  classifyRoute,
  isStaticInfoRoute,
  validateRegistry,
  type RouteFamily,
  type RouteVisibility,
  type IndexabilityClass,
  type RouteContract,
} from './route-registry'

// URL Builder (Workstream D)
export {
  buildPath,
  buildAbsoluteUrl,
  urlFor,
  absoluteFromPath,
  relativeFromPath,
  stripQueryParams,
} from './url-builder'

// Slug Utils (Workstream E)
export {
  isValidSlug,
  normalizeSlug,
  assertNonEmptySlug,
  slugFromName,
  detectDuplicateSlugs,
  detectCrossHierarchyAmbiguity,
  registerSlugMigration,
  resolveHistoricalSlug,
  getHistoricalSlugMappings,
  changeSlug,
  type SlugWithDisplay,
} from './slug-utils'

// Entity Resolver (Workstream F)
export {
  resolvePath,
  resolvePathCached,
  classifyNotFound,
  validateParentChild,
  shouldFallbackToHomepage,
  NotFoundError,
  DataFetchError,
  type ResolutionResult,
  type ResolutionStatus,
} from './resolver'

// Redirect Registry (Workstream G)
export {
  REDIRECT_REGISTRY,
  classifyRedirect,
  detectRedirectChains,
  detectRedirectLoops,
  getRetiredRedirects,
  validateRedirectRegistry,
  normalizeRedirectDestination,
  type RedirectEntry,
  type RedirectType,
} from './redirect-registry'

// Rewrite Registry (Workstream H)
export {
  REWRITE_REGISTRY,
  auditRewrites,
  getNextRewrites,
  detectRewriteFailure,
  type RewriteEntry,
} from './rewrite-registry'

// Indexability (Workstream I)
export {
  buildRobotsMeta,
  resolveIndexability,
  shouldEmitCanonical,
  resolvePaginationIndexability,
  auditIndexability,
  getRobotsMetaConfig,
  type IndexabilityDecision,
} from './indexability'

// Robots (Workstream J)
export {
  buildRobotsTxt,
  buildRobotsMetadata,
  validateRobotsTxt,
} from './robots'

// Metadata Factory (Workstream K)
export {
  buildMetadata,
  buildHomepageMetadata,
  buildStaticInfoMetadata,
  buildNoindexMetadata,
  getTitleTemplate,
  type MetadataInput,
} from './metadata-factory'

// Title System (Workstream L)
export {
  generateTitle,
  validateTitle,
  registerTitle,
  getTitleDuplicates,
  auditTitles,
  TITLE_LIMITS,
  type TitleValidation,
  type TitleAuditResult,
} from './title-system'

// Description System (Workstream M)
export {
  generateDescription,
  validateDescription,
  registerDescription,
  getDescriptionDuplicates,
  auditDescriptions,
  DESCRIPTION_LIMITS,
  type DescriptionValidation,
  type DescriptionAuditResult,
} from './description-system'

// Canonical System (Workstream N)
export {
  computeCanonical,
  shouldEmitCanonicalTag,
  buildAlternates,
  validateCanonical,
  auditCanonicals,
  detectCanonicalConflicts,
  type CanonicalValidation,
  type CanonicalAuditResult,
} from './canonical-system'

// Sitemap System (Workstream O)
export {
  registerSitemapSource,
  getStaticSitemapEntries,
  getRegistrySitemapEntries,
  buildSitemap,
  buildSitemapIndex,
  buildStaticSitemap,
  validateSitemap,
  countSitemapEntries,
  type SitemapEntry,
  type ContentSitemapSource,
} from './sitemap-system'

// Sitemap Scale (Workstream P)
export {
  splitSitemapEntries,
  buildSplitSitemapIndex,
  generateSitemapFileNames,
  needsSplitting,
  buildSitemapPingUrl,
  getAllSitemapUrls,
  validateSitemapSplit,
  SITEMAP_LIMITS,
} from './sitemap-scale'

// Structured Data (Workstream Q)
export {
  buildOrganizationSchema,
  buildWebsiteSchema,
  buildBreadcrumbSchema,
  buildArticleSchema,
  buildFaqSchema,
  buildCourseSchema,
  buildHowToSchema,
  buildCollectionPageSchema,
  buildItemListSchema,
  buildSchemaForRoute,
  validateSchema,
  buildGlobalStructuredData,
} from './structured-data'

// Breadcrumbs (Workstream R)
export {
  buildBreadcrumbs,
  buildBreadcrumbJsonLd,
  validateBreadcrumbs,
  type BreadcrumbItem,
} from './breadcrumbs'

// SSR (Workstream S)
export {
  getRenderStrategy,
  getRevalidatePeriod,
  shouldServerRender,
  ISR_REVALIDATE,
  getContentInHtmlChecklist,
  auditRendering,
  type RenderStrategy,
} from './ssr'

// HTTP Status (Workstream T)
export {
  resolveHttpStatus,
  isSoft404,
  getSearchPageStatus,
  auditHttpStatuses,
  getNotFoundStatus,
  isExcludedFrom404,
  type HttpStatusCode,
  type StatusResolution,
} from './http-status'

// Internal Links (Workstream U)
export {
  buildInternalLink,
  buildRelativeLink,
  getPrimaryNavLinks,
  getFooterLinks,
  getRelatedLinks,
  buildPrevNextLinks,
  validateLinkTarget,
  auditInternalLinks,
  getLinkEquityMap,
  type InternalLink,
} from './internal-links'

// Crawl Graph (Workstream V)
export {
  buildCrawlGraph,
  detectOrphanPages,
  calculateCrawlDepth,
  getCrawlPriority,
  auditCrawlGraph,
  buildHierarchyTree,
  type CrawlNode,
  type HierarchyNode,
} from './crawl-graph'

// Content Quality (Workstream W/X)
export {
  contentFingerprint,
  detectDuplicateContent,
  shouldCanonicalizeAway,
  auditDuplicateContent,
  checkThinPage,
  auditThinPages,
  checkContentDepth,
  MIN_CONTENT_THRESHOLDS,
  CANONICAL_PARAMS,
  type ThinPageCheck,
} from './content-quality'

// Pagination (Workstream Y)
export {
  buildPaginationMeta,
  buildFacetedNavMeta,
  buildPageUrl,
  type PaginationMeta,
  type FacetedNavMeta,
} from './pagination'

// Crawl Access (Workstream Z)
export {
  validateRobotsNoBlockAssets,
  analyzeCrawlBudget,
  getRenderabilityChecklist,
  auditCrawlAccess,
} from './crawl-access'

// Performance (Workstream AA)
export {
  CWV_TARGETS,
  getLcpOptimizationSpec,
  getClsPreventionSpec,
  getInpOptimizationSpec,
  getImageOptimizationSpec,
  getFontLoadingSpec,
  getPreloadHints,
  auditPerformance,
  type PerformanceAuditResult,
  type PreloadHint,
} from './performance'

// Validation (Workstream AB)
export { runFullValidation, validatePageSeo, type FullValidationResult, type PageSeoValidation } from './validation'

// Audit (Workstream AD)
export { runComprehensiveAudit, type SeoAuditReport } from './audit'
