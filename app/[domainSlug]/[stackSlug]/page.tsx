/**
 * Stack Route — V2 canonical (P05-T042).
 *
 * Server component consuming the canonical hierarchy architecture. Renders
 * a stack landing page: H1, description, and a list of subcategory modules
 * with their question counts. The hierarchy resolver is the SINGLE data
 * source (P05-T021/T022). Uses resolveBreadcrumbs for navigation context.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  resolveStack,
  resolveBreadcrumbs,
  buildStackMetadata,
} from "@/lib/hierarchy";
import { getSubcategoriesWithQuestions } from "@/lib/content-reader";
import { HierarchyHeader, HierarchyCardGrid } from "@/components/hierarchy";
import type { HierarchyCardItem } from "@/components/hierarchy";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domainSlug: string; stackSlug: string }>;
}): Promise<Metadata> {
  const { domainSlug, stackSlug } = await params;
  return buildStackMetadata(domainSlug, stackSlug);
}

export default async function StackPage({
  params,
}: {
  params: Promise<{ domainSlug: string; stackSlug: string }>;
}) {
  const { domainSlug, stackSlug } = await params;
  const stack = resolveStack(domainSlug, stackSlug);
  if (!stack) notFound();

  // Resolve subcategories (modules) with their questions for the card grid.
  let subcats: { slug: string; name: string; questionCount: number }[] = [];
  try {
    subcats = getSubcategoriesWithQuestions(domainSlug, stackSlug).map((s) => ({
      slug: s.slug,
      name: s.name,
      questionCount: s.questionCount,
    }));
  } catch {
    // empty grid handled below
  }

  const items: HierarchyCardItem[] = subcats
    .filter((s) => s.slug !== "_root")
    .map((s) => ({
      title: s.name,
      description: `${s.questionCount} question${s.questionCount === 1 ? "" : "s"}`,
      href: `/${domainSlug}/${stackSlug}`,
      count: s.questionCount,
      countLabel: "questions",
    }));

  // If no subcategories, show the stack as a flat question list link.
  if (items.length === 0) {
    items.push({
      title: stack.title,
      description: stack.description,
      href: `/${domainSlug}/${stackSlug}`,
    });
  }

  return (
    <div className="page-container">
      <HierarchyHeader
        title={stack.title}
        description={stack.description}
      />
      <section className="py-8">
        <HierarchyCardGrid
          items={items}
          emptyMessage="No modules available for this stack yet."
        />
      </section>
    </div>
  );
}
