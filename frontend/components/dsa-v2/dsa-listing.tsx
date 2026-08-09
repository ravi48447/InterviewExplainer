/**
 * Phase 11 — DSA listing page architecture (category / pattern / company).
 *
 * Shared shell for the three listing-style DSA pages. Renders hero stats,
 * the problem list, editorial content sections, and a sibling explore bar —
 * all from the canonical `DSAListingPageData` payload.
 *
 * V2 learning-site treatment: PageContainer, hairline stat band, softened
 * borders, and the homepage rhythm so every internal browse page reads as
 * part of the same learning surface as the hub.
 */
import { DSAProblemList } from "@/components/dsa/DSAProblemRow"
import { DSAContentSections } from "@/components/dsa/DSAContentSections"
import { DSAExploreBar } from "@/components/dsa/DSAExploreBar"
import { DSABreadcrumb } from "@/components/dsa/DSABreadcrumb"
import { PageContainer } from "@/components/page-container"
import type { DSAListingPageData } from "@/lib/dsa"

export function DSAListing({ data, kicker, heading }: { data: DSAListingPageData; kicker: string; heading: string }) {
  const { breadcrumbs, heroStats, problems, editorial, name } = data
  return (
    <PageContainer className="py-14 sm:py-16">
      <DSABreadcrumb trail={breadcrumbs} />

      {/* Hero */}
      <header className="mb-12">
        <h1 className="type-display text-foreground">{name}</h1>
        {heroStats.length > 0 && (
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-3 lg:grid-cols-4">
            {heroStats.map((s) => (
              <div key={s.label} className="bg-card px-5 py-4">
                <dd className="font-display text-2xl font-bold tabular-nums text-primary">
                  {s.value}
                </dd>
                <dt className="type-label mt-1 text-muted-foreground">{s.label}</dt>
              </div>
            ))}
          </dl>
        )}
      </header>

      {/* Problem list */}
      <section className="mb-12">
        <h2 className="type-section text-foreground">Problems ({problems.length})</h2>
        <div className="mt-4">
          <DSAProblemList problems={problems} />
        </div>
      </section>

      {/* Editorial content */}
      <DSAContentSections content={editorial} kicker={kicker} heading={heading} />

      {/* Sibling explore */}
      <DSAExploreBar exclude={data.slug} />
    </PageContainer>
  )
}
