/**
 * Stack Route — V2 canonical (P05-T042).
 *
 * Server component consuming the canonical hierarchy architecture. Renders
 * a stack landing page: H1, description, and a list of subcategory modules
 * with their question counts. The hierarchy resolver is the SINGLE data
 * source (P05-T021/T022). Uses resolveBreadcrumbs for navigation context.
 */

import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  resolveStack,
  resolveBreadcrumbs,
  resolveDomain,
  buildStackMetadata,
} from "@/lib/hierarchy";
import { getSubcategoriesWithQuestions } from "@/lib/content-reader";
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
import { ErrorState } from "@/components/ui/error-state";

// Fully static (SSG). Every {domainSlug, stackSlug} pair is enumerated at
// build time (the build container has a filesystem). `dynamicParams = false`
// makes an unknown pair 404 instead of rendering on-demand, which would call
// `getSubcategoriesWithQuestions` (which walks `fs`) at request time —
// unavailable on Cloudflare Workers. `revalidate` is intentionally omitted so
// there is no ISR re-render path that could touch the filesystem.
export const dynamicParams = false;
export const dynamic = "force-static";

// Locked domains whose content tree is enumerated at build time. Kept as a
// static literal so `generateStaticParams` does not depend on an unexported
// registry; the per-domain stack list still comes from the content reader
// (which works at build time, where `fs` exists).
const SSG_DOMAINS = [
  "java-backend-intermediate",
  "java-fullstack-intermediate",
  "java-backend-fresher",
  "java-fullstack-fresher",
  "go-intermediate",
  "go-fresher",
  "ruby-backend-intermediate",
  "ruby-backend-fresher",
  "frontend-intermediate",
  "frontend-fresher",
] as const;

export async function generateStaticParams() {
  const { getVisibleStackSlugs } = await import("@/lib/content-reader");
  const params: { domainSlug: string; stackSlug: string }[] = [];
  for (const domainSlug of SSG_DOMAINS) {
    for (const stackSlug of getVisibleStackSlugs(domainSlug)) {
      params.push({ domainSlug, stackSlug });
    }
  }
  return params;
}

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
  let loadError = false;
  try {
    subcats = getSubcategoriesWithQuestions(domainSlug, stackSlug).map((s) => ({
      slug: s.slug,
      name: s.name,
      questionCount: s.questionCount,
    }));
  } catch {
    loadError = true;
  }

  if (loadError) {
    return (
      <div className="page-container py-12">
        <ErrorState
          title="Failed to load stack content"
          description="The content for this stack could not be loaded. Please try again."
          retryLabel="Retry"
          onRetry={() => {
            // Server component — trigger a re-render via router refresh
            if (typeof window !== "undefined") window.location.reload();
          }}
        />
      </div>
    );
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

  const domain = resolveDomain(domainSlug);

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
              { "@type": "ListItem", position: 2, name: domain?.title ?? domainSlug, item: `/${domainSlug}` },
              { "@type": "ListItem", position: 3, name: stack.title, item: `/${domainSlug}/${stackSlug}` },
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
            <BreadcrumbLink asChild>
              <Link href={`/${domainSlug}`}>{domain?.title ?? domainSlug}</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{stack.title}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
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
