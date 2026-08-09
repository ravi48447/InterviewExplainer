/**
 * Phase 11 — DSA module page architecture.
 *
 * V2 learning-site treatment: aligns with the hub rhythm (PageContainer,
 * hairline stat band, softened borders) so module pages read as part of the
 * same learning surface.
 */
import { DSAProblemList } from "@/components/dsa/DSAProblemRow"
import { DSAContentSections } from "@/components/dsa/DSAContentSections"
import { DSABreadcrumb } from "@/components/dsa/DSABreadcrumb"
import { PageContainer } from "@/components/page-container"
import type { DSAModulePageData } from "@/lib/dsa"

export function DSAModuleView({ data }: { data: DSAModulePageData }) {
  const { breadcrumbs, heroStats, problems, editorial, moduleName } = data
  return (
    <PageContainer className="py-14 sm:py-16">
      <DSABreadcrumb trail={breadcrumbs} />

      <header className="mb-12">
        <h1 className="type-display text-foreground">{moduleName}</h1>
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

      <section className="mb-12">
        <h2 className="type-section text-foreground">Problems ({problems.length})</h2>
        <div className="mt-4">
          <DSAProblemList problems={problems} />
        </div>
      </section>

      <DSAContentSections
        content={editorial}
        kicker="Module guide"
        heading={`How to master ${moduleName}`}
      />
    </PageContainer>
  )
}
