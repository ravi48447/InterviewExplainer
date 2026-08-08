/**
 * Phase 11 — DSA listing page architecture (category / pattern / company).
 *
 * Shared shell for the three listing-style DSA pages. Renders hero stats,
 * the problem list, editorial content sections, and a sibling explore bar —
 * all from the canonical `DSAListingPageData` payload.
 */
import { DSAProblemList } from "@/components/dsa/DSAProblemRow"
import { DSAContentSections } from "@/components/dsa/DSAContentSections"
import { DSAExploreBar } from "@/components/dsa/DSAExploreBar"
import { DSABreadcrumb } from "@/components/dsa/DSABreadcrumb"
import type { DSAListingPageData } from "@/lib/dsa"

export function DSAListing({ data, kicker, heading }: { data: DSAListingPageData; kicker: string; heading: string }) {
  const { breadcrumbs, heroStats, problems, editorial, name } = data
  return (
    <div className="page-container py-6 lg:py-8">
      <DSABreadcrumb trail={breadcrumbs} />

      {/* Hero */}
      <header className="mb-8">
        <h1 className="type-display text-foreground mb-2">{name}</h1>
        <div className="flex flex-wrap gap-3 mb-4">
          {heroStats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card px-4 py-2">
              <span className="font-semibold text-primary">{s.value}</span>{" "}
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </header>

      {/* Problem list */}
      <section className="mb-10">
        <h2 className="type-section text-foreground mb-3">Problems ({problems.length})</h2>
        <DSAProblemList problems={problems} />
      </section>

      {/* Editorial content */}
      <DSAContentSections content={editorial} kicker={kicker} heading={heading} />

      {/* Sibling explore */}
      <DSAExploreBar exclude={data.slug} />
    </div>
  )
}
