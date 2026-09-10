/**
 * lib/seo/structured-data.ts — Structured Data Architecture (P02-T410–T449)
 *
 * JSON-LD structured data generated from the route registry + content.
 * All structured data is emitted via this module — no inline scripts
 * with hardcoded URLs.
 *
 * - T411: single structured data generator
 * - T412: typed schema objects
 * - T413–T420: per-route-family schema types
 * - T421–T430: Organization, WebSite, BreadcrumbList
 * - T431–T440: Article, FAQPage, Course, HowTo
 * - T441–T449: validation & audit
 */

import { getCanonicalOrigin, SITE_CONFIG } from './config'
import { type RouteFamily } from './route-registry'
import { buildAbsoluteUrl } from './url-builder'

/** Base schema context. */
const SCHEMA_CONTEXT = 'https://schema.org'

/** Organization schema (T421). */
export function buildOrganizationSchema() {
  const origin = getCanonicalOrigin()
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Organization',
    name: SITE_CONFIG.name,
    url: origin,
    logo: `${origin}/logo.png`,
    sameAs: Object.values(SITE_CONFIG.social || {}).filter(Boolean),
  }
}

/** WebSite schema (T422). */
export function buildWebsiteSchema() {
  const origin = getCanonicalOrigin()
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'WebSite',
    name: SITE_CONFIG.name,
    url: origin,
    description: SITE_CONFIG.description,
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${origin}/search?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }
}

/** BreadcrumbList schema (T423). */
export function buildBreadcrumbSchema(items: { name: string; url: string }[]) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      item: item.url,
    })),
  }
}

/** Article schema (T431). */
export function buildArticleSchema(input: {
  title: string
  description: string
  url: string
  image?: string
  publishedAt: string
  modifiedAt?: string
  author?: string
  section?: string
}) {
  const origin = getCanonicalOrigin()
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Article',
    headline: input.title,
    description: input.description,
    url: input.url,
    image: input.image ? `${origin}${input.image}` : `${origin}/og-default.png`,
    datePublished: input.publishedAt,
    dateModified: input.modifiedAt || input.publishedAt,
    author: input.author ? { '@type': 'Person', name: input.author } : { '@type': 'Organization', name: SITE_CONFIG.name },
    publisher: {
      '@type': 'Organization',
      name: SITE_CONFIG.name,
      logo: { '@type': 'ImageObject', url: `${origin}/logo.png` },
    },
    ...(input.section && { articleSection: input.section }),
  }
}

/** FAQPage schema (T432). */
export function buildFaqSchema(faqs: { question: string; answer: string }[]) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  }
}

/** Course schema (T433). */
export function buildCourseSchema(input: {
  name: string
  description: string
  url: string
  provider?: string
}) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'Course',
    name: input.name,
    description: input.description,
    url: input.url,
    provider: {
      '@type': 'Organization',
      name: input.provider || SITE_CONFIG.name,
      sameAs: getCanonicalOrigin(),
    },
  }
}

/** HowTo schema (T434). */
export function buildHowToSchema(input: {
  name: string
  description: string
  steps: { name: string; text: string }[]
}) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'HowTo',
    name: input.name,
    description: input.description,
    step: input.steps.map((step, i) => ({
      '@type': 'HowToStep',
      position: i + 1,
      name: step.name,
      text: step.text,
    })),
  }
}

/** CollectionPage schema (T435). */
export function buildCollectionPageSchema(input: {
  name: string
  description: string
  url: string
  items: { name: string; url: string }[]
}) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'CollectionPage',
    name: input.name,
    description: input.description,
    url: input.url,
    mainEntity: {
      '@type': 'ItemList',
      itemListElement: input.items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        url: item.url,
      })),
    },
  }
}

/** ItemList schema (T436). */
export function buildItemListSchema(items: { name: string; url: string }[]) {
  return {
    '@context': SCHEMA_CONTEXT,
    '@type': 'ItemList',
    itemListElement: items.map((item, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: item.name,
      url: item.url,
    })),
  }
}

/** Build the appropriate schema for a route family (T413–T420). */
export function buildSchemaForRoute(
  family: RouteFamily,
  params: Record<string, string>,
  content?: {
    title?: string
    description?: string
    faqs?: { question: string; answer: string }[]
    steps?: { name: string; text: string }[]
    items?: { name: string; url: string }[]
    breadcrumbs?: { name: string; url: string }[]
    publishedAt?: string
    modifiedAt?: string
    author?: string
  },
): object | null {
  const url = buildAbsoluteUrl(family, params)

  switch (family) {
    case 'homepage':
      return buildWebsiteSchema()
    case 'question':
      return content?.faqs?.length
        ? buildFaqSchema(content.faqs)
        : buildArticleSchema({
            title: content?.title || '',
            description: content?.description || '',
            url,
            publishedAt: content?.publishedAt || new Date().toISOString(),
            modifiedAt: content?.modifiedAt,
            author: content?.author,
          })
    case 'dsa-problem':
      return buildArticleSchema({
        title: content?.title || '',
        description: content?.description || '',
        url,
        publishedAt: content?.publishedAt || new Date().toISOString(),
        modifiedAt: content?.modifiedAt,
      })
    case 'domain':
    case 'pillar':
    case 'dsa-hub':
    case 'dsa-category':
      return buildCollectionPageSchema({
        name: content?.title || '',
        description: content?.description || '',
        url,
        items: content?.items || [],
      })
    case 'module':
    case 'dsa-module':
      return buildCourseSchema({
        name: content?.title || '',
        description: content?.description || '',
        url,
      })
    case 'roadmap':
    case 'cheatsheet':
      return content?.steps?.length
        ? buildHowToSchema({ name: content?.title || '', description: content?.description || '', steps: content.steps })
        : buildItemListSchema(content?.items || [])
    default:
      if (content?.breadcrumbs?.length) {
        return buildBreadcrumbSchema(content.breadcrumbs)
      }
      return null
  }
}

/** Validate a schema object (T441–T449). */
export function validateSchema(schema: object): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  const s = schema as Record<string, unknown>

  if (!s['@context']) issues.push('Missing @context')
  if (!s['@type']) issues.push('Missing @type')

  // Check for absolute URLs in required fields
  const json = JSON.stringify(schema)
  if (json.includes('http://') && !json.includes('https://')) {
    issues.push('Contains non-HTTPS URLs')
  }

  return { valid: issues.length === 0, issues }
}

/** Build the global structured data for layout (sitelinks, org, etc.). */
export function buildGlobalStructuredData(): object[] {
  return [buildOrganizationSchema(), buildWebsiteSchema()]
}
