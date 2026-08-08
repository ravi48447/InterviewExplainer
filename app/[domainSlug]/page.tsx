/**
 * Domain Route — V2 canonical (P05-T041).
 *
 * Server component consuming the canonical hierarchy architecture
 * (@/lib/hierarchy). Renders a domain landing page: H1, description, and
 * a card grid of visible stacks. The hierarchy resolver is the SINGLE data
 * source — no client-side fetch, no competing definitions (P05-T021/T022).
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { resolveDomain, buildDomainMetadata } from "@/lib/hierarchy";
import { HierarchyHeader, HierarchyCardGrid } from "@/components/hierarchy";
import type { HierarchyCardItem } from "@/components/hierarchy";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Home", item: "/" },
              { "@type": "ListItem", position: 2, name: domain.title, item: `/${domainSlug}` },
            ],
          }),
        }}
      />
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{domain.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
