/**
 * Phase 11 — DSA sheet page architecture.
 *
 * Resolves each group's `problemSlugs` to `DSAProblemIndex` entries from the
 * in-memory index and renders them with `DSAProblemRow` (which requires a
 * 1-based `position`).
 */
import { ChevronRight } from "lucide-react"
import { DSABreadcrumb } from "@/components/dsa/DSABreadcrumb"
import { DSAProblemRow } from "@/components/dsa/DSAProblemRow"
import { getDSAIndex } from "@/lib/contentV2"
import type { DSAProblemIndex } from "@/lib/contentV2-types"
import type { DSASheetPageData } from "@/lib/dsa"

export function DSASheetView({ data }: { data: DSASheetPageData }) {
  const { breadcrumbs, heroStats, groups, sheetName, totalProblems } = data
  const index = getDSAIndex()
  const bySlug = new Map<string, DSAProblemIndex>((index?.problems ?? []).map((p) => [p.slug, p]))

  let runningPosition = 0

  return (
    <div className="page-container py-6 lg:py-8">
      <DSABreadcrumb trail={breadcrumbs} />

      <header className="mb-8">
        <h1 className="type-display text-foreground mb-2">{sheetName}</h1>
        <div className="flex flex-wrap gap-3 mb-4">
          {heroStats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card px-4 py-2">
              <span className="font-semibold text-primary">{s.value}</span>{" "}
              <span className="text-xs text-muted-foreground">{s.label}</span>
            </div>
          ))}
        </div>
      </header>

      {groups.map((group) => (
        <section key={group.groupSlug} className="mb-8">
          <div className="flex items-center gap-1.5 mb-3">
            <ChevronRight className="h-4 w-4 text-primary" />
            <h2 className="type-section text-foreground">{group.title}</h2>
            <span className="text-xs text-muted-foreground">({group.problemSlugs.length})</span>
          </div>
          {group.blurb && <p className="text-sm text-muted-foreground mb-3">{group.blurb}</p>}
          <div className="divide-y divide-border rounded-lg border border-border bg-card">
            {group.problemSlugs.map((slug) => {
              const problem = bySlug.get(slug)
              runningPosition += 1
              if (!problem) return null
              return <DSAProblemRow key={slug} problem={problem} position={runningPosition} />
            })}
          </div>
        </section>
      ))}

      <p className="text-sm text-muted-foreground">{totalProblems} problems total.</p>
    </div>
  )
}
