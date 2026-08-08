/**
 * Domain Route — V2 canonical (P05-T041).
 *
 * Server component consuming the canonical hierarchy architecture
 * (@/lib/hierarchy). Renders a domain landing page: H1, description, and
 * a card grid of visible stacks. The hierarchy resolver is the SINGLE data
 * source — no client-side fetch, no competing definitions (P05-T021/T022).
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import { resolveDomain, buildDomainMetadata } from "@/lib/hierarchy";
import { HierarchyHeader, HierarchyCardGrid } from "@/components/hierarchy";
import type { HierarchyCardItem } from "@/components/hierarchy";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ domainSlug: string }>;
}): Promise<Metadata> {
  const { domainSlug } = await params;
  return buildDomainMetadata(domainSlug);
}

export default async function DomainPage({
  params,
}: {
  params: Promise<{ domainSlug: string }>;
}) {
  const { domainSlug } = await params;
  const domain = resolveDomain(domainSlug);
  if (!domain) notFound();

  const items: HierarchyCardItem[] = domain.stacks.map((stackSlug) => ({
    title: stackToTitle(stackSlug),
    description: `Interview questions for ${stackToTitle(stackSlug)}.`,
    href: `/${domainSlug}/${stackSlug}`,
  }));

  return (
    <div className="page-container">
      <HierarchyHeader
        title={domain.title}
        description={domain.description}
      />
      <section className="py-8">
        <HierarchyCardGrid
          items={items}
          emptyMessage="No stacks available for this domain yet."
        />
      </section>
    </div>
  );
}

function stackToTitle(slug: string): string {
  return slug
    .replace(/^\d+-/, "")
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
