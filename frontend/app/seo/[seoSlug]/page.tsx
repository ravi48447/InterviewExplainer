/**
 * Module Route — V2 canonical (P05-T044).
 *
 * Server component consuming the canonical hierarchy architecture. Renders
 * a module landing page: H1, description, and a question list for the
 * module. Modules are backed by SEO_MODULES (seo-slugs.ts) via the hierarchy
 * resolver (P05-T027), with a content-tree fallback. The /seo/[seoSlug]
 * path is the public surface for SEO module landing pages.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  resolveModule,
  buildModuleMetadata,
} from "@/lib/hierarchy";
import { HierarchyHeader, QuestionList } from "@/components/hierarchy";
import type { QuestionListItem } from "@/components/hierarchy";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}): Promise<Metadata> {
  const { seoSlug } = await params;
  // Modules are keyed by moduleSlug in SEO_MODULES; the seoSlug route param
  // maps to the module's canonical SEO slug. We resolve via the hierarchy
  // resolver which handles both seoSlug and moduleSlug lookups.
  return buildModuleMetadata("", "", seoSlug);
}

export default async function ModulePage({
  params,
}: {
  params: Promise<{ seoSlug: string }>;
}) {
  const { seoSlug } = await params;

  // The hierarchy resolver's resolveModule expects (domainSlug, stackSlug,
  // moduleSlug). The seoSlug route maps to a module — we resolve it via the
  // SEO_MODULES registry which is keyed by moduleSlug. We try the seoSlug
  // directly as the module slug (the common case for SEO landing pages).
  const module = resolveModule("", "", seoSlug);
  if (!module) notFound();

  const questions: QuestionListItem[] = (module.questions ?? []).map((slug) => ({
    slug,
    title: questionToTitle(slug),
    href: `/${module.domainSlug}/${module.stackSlug}/${slug}`,
  }));

  return (
    <div className="page-container">
      <HierarchyHeader
        title={module.title}
        description={module.description}
      />
      <section className="py-8">
        <QuestionList
          questions={questions}
          showDifficulty
          emptyMessage="No questions available for this module yet."
        />
      </section>
    </div>
  );
}

function questionToTitle(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
