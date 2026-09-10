/**
 * Pillar Route — V2 canonical (P05-T043).
 *
 * Server component consuming the canonical hierarchy architecture. Renders
 * a pillar hub landing page: H1, tagline, hero blurb, and a card grid of the
 * pillar's modules. Pillars are backed by the PILLAR_HUBS registry via the
 * hierarchy resolver (P05-T026). This is the canonical pillar route — the
 * /prep/[pillarSlug] path is the public surface for pillar hubs.
 */

import { Metadata } from "next";
import { notFound } from "next/navigation";
import {
  resolvePillar,
  resolvePillarHub,
  buildPillarMetadata,
} from "@/lib/hierarchy";
import { HierarchyHeader, HierarchyCardGrid } from "@/components/hierarchy";
import type { HierarchyCardItem } from "@/components/hierarchy";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ pillarSlug: string }>;
}): Promise<Metadata> {
  const { pillarSlug } = await params;
  return buildPillarMetadata(pillarSlug);
}

export default async function PillarPage({
  params,
}: {
  params: Promise<{ pillarSlug: string }>;
}) {
  const { pillarSlug } = await params;
  const pillar = resolvePillar(pillarSlug);
  if (!pillar) notFound();

  const hub = resolvePillarHub(pillarSlug);

  const items: HierarchyCardItem[] = (pillar.modules ?? []).map((moduleSlug) => ({
    title: moduleToTitle(moduleSlug),
    description: `${moduleToTitle(moduleSlug)} interview questions and answers.`,
    href: `/seo/${moduleSlug}`,
  }));

  return (
    <div className="page-container">
      <HierarchyHeader
        title={pillar.title}
        description={pillar.tagline}
      />
      {pillar.heroBlurb && (
        <section className="py-6">
          <p className="reading-container text-muted-foreground text-lg">
            {pillar.heroBlurb}
          </p>
        </section>
      )}
      <section className="py-8">
        <HierarchyCardGrid
          items={items}
          emptyMessage="No modules available for this pillar yet."
        />
      </section>
      {hub?.relatedPillars && hub.relatedPillars.length > 0 && (
        <section className="py-8 border-t border-border">
          <h2 className="type-section mb-4">Related Pillars</h2>
          <HierarchyCardGrid
            items={hub.relatedPillars.map((slug) => ({
              title: moduleToTitle(slug),
              href: `/prep/${slug}`,
            }))}
          />
        </section>
      )}
    </div>
  );
}

function moduleToTitle(slug: string): string {
  return slug
    .replace(/-/g, " ")
    .split(" ")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}
