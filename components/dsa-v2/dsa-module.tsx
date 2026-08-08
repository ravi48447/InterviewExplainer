/**
 * Phase 11 — DSA module page architecture.
 */
import { DSAProblemList } from "@/components/dsa/DSAProblemRow"
import { DSAContentSections } from "@/components/dsa/DSAContentSections"
import { DSABreadcrumb } from "@/components/dsa/DSABreadcrumb"
import type { DSAModulePageData } from "@/lib/dsa"

export function DSAModuleView({ data }: { data: DSAModulePageData }) {
  const { breadcrumbs, heroStats, problems, editorial, moduleName } = data
  return (
    <div className="page-container py-6 lg:py-8">
      <DSABreadcrumb trail={breadcrumbs} />

      <header className="mb-8">
        <h1 className="type-display text-foreground mb-2">{moduleName}</h1>
        <div className="flex flex-wrap gap-3 mb-4">
          {heroStats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card px-4 py-2">
              <span className="font-semibold text-primary">{s.value}</span>{" "}
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </header>

      <section className="mb-10">
        <h2 className="type-section text-foreground mb-3">Problems ({problems.length})</h2>
        <DSAProblemList problems={problems} />
      </section>

      <DSAContentSections
        content={editorial}
        kicker="Module guide"
        heading={`How to master ${moduleName}`}
      />
    </div>
  )
}
