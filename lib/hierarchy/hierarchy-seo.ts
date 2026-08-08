/**
 * hierarchy-seo.ts — Hierarchy SEO integration (P05-T092..T100, T201..T210).
 *
 * Builds canonical metadata, titles, and structured data for hierarchy pages
 * (domain, stack, pillar, module) using the Phase 02 SEO builders + the
 * canonical hierarchy resolvers. All hierarchy pages consume these functions
 * instead of constructing metadata ad-hoc.
 *
 * Design (P05-T092/T096/T100/T201/T210):
 *   - Unique titles per level (no duplicate <title> tags)
 *   - Breadcrumb schema for every indexed hierarchy page
 *   - Canonical URLs (no internal rendering URLs leaking)
 *   - Empty pages excluded from index (noindex on domain/stack/pillar with no children)
 */

import type { Metadata } from "next";
import { buildMetadata, type RouteFamily } from "@/lib/seo";
import {
  resolveDomain,
  resolveStack,
  resolvePillar,
  resolveModule,
} from "./hierarchy-resolver";
import type { HierarchyCrumb } from "./hierarchy-types";

const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://interviewexplainer.com";

// ─── URL builder ──────────────────────────────────────────────────────────────

export function hierarchyUrl(parts: string[]): string {
  return `${SITE_URL}/${parts.join("/")}`;
}

// ─── Domain metadata (P05-T092..T100) ─────────────────────────────────────────

export function buildDomainMetadata(domainSlug: string): Metadata {
  const domain = resolveDomain(domainSlug);
  if (!domain) {
    return buildMetadata({
      family: "domain" as RouteFamily,
      params: { domainSlug },
      title: "Domain Not Found",
      noindex: true,
    });
  }

  const childCount = domain.stacks.length;
  const isEmpty = childCount === 0;
  const title = `${domain.title} — Interview Questions & Answers`;
  const description = domain.description.slice(0, 160);

  return buildMetadata({
    family: "domain" as RouteFamily,
    params: { domainSlug },
    title,
    description,
    noindex: isEmpty, // P05-T100: exclude empty domain pages
  });
}

// ─── Stack metadata (P05-T201..T210) ──────────────────────────────────────────

export function buildStackMetadata(
  domainSlug: string,
  stackSlug: string
): Metadata {
  const stack = resolveStack(domainSlug, stackSlug);
  if (!stack) {
    return buildMetadata({
      family: "stack" as RouteFamily,
      params: { domainSlug, stackSlug },
      title: "Stack Not Found",
      noindex: true,
    });
  }

  const isEmpty = stack.modules.length === 0 && stack.pillars.length === 0;
  const title = `${stack.title} — ${resolveDomain(domainSlug)?.title ?? ""} Interview Questions`;
  const description = stack.description.slice(0, 160);

  return buildMetadata({
    family: "stack" as RouteFamily,
    params: { domainSlug, stackSlug },
    title,
    description,
    noindex: isEmpty, // P05-T100: exclude empty stack pages
  });
}

// ─── Pillar metadata (P05-T201..T210) ─────────────────────────────────────────

export function buildPillarMetadata(pillarSlug: string): Metadata {
  const pillar = resolvePillar(pillarSlug);
  if (!pillar) {
    return buildMetadata({
      family: "pillar" as RouteFamily,
      params: { pillarSlug },
      title: "Pillar Not Found",
      noindex: true,
    });
  }

  const isEmpty = pillar.modules.length === 0;
  const title = `${pillar.title} — Interview Questions & Prep`;
  const description = (pillar.metaDescription ?? pillar.tagline).slice(0, 160);

  return buildMetadata({
    family: "pillar" as RouteFamily,
    params: { pillarSlug },
    title,
    description,
    noindex: isEmpty,
  });
}

// ─── Module metadata ──────────────────────────────────────────────────────────

export function buildModuleMetadata(
  domainSlug: string,
  stackSlug: string,
  moduleSlug: string
): Metadata {
  const mod = resolveModule(domainSlug, stackSlug, moduleSlug);
  if (!mod) {
    return buildMetadata({
      family: "module" as RouteFamily,
      params: { seoSlug: moduleSlug },
      title: "Module Not Found",
      noindex: true,
    });
  }

  const isEmpty = mod.questions.length === 0;
  const title = `${mod.title} — Interview Questions`;
  const description = mod.description.slice(0, 160);

  return buildMetadata({
    family: "module" as RouteFamily,
    params: { seoSlug: moduleSlug },
    title,
    description,
    noindex: isEmpty,
  });
}

// ─── Breadcrumb structured data (P05-T096) ────────────────────────────────────

/**
 * Build BreadcrumbList JSON-LD for a hierarchy page (P05-T096).
 */
export function buildBreadcrumbStructuredData(crumbs: HierarchyCrumb[]): object {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.label,
      item: crumb.href.startsWith("http")
        ? crumb.href
        : `${SITE_URL}${crumb.href}`,
    })),
  };
}
