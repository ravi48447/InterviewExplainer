/**
 * Phase 11 — DSA sheet page architecture.
 *
 * Resolves each group's `problemSlugs` to `DSAProblemIndex` entries from the
 * in-memory index and renders them with `DSAProblemRow` (which requires a
 * 1-based `position`).
 *
 * V2 learning-site treatment: PageContainer, hairline stat band, softened
 * borders, and group panels that read as clear sections rather than a flat
 * divided list.
 */
import { ListChecks } from "lucide-react"
import { DSABreadcrumb } from "@/components/dsa/DSABreadcrumb"
import { DSAProblemRow } from "@/components/dsa/DSAProblemRow"
import { PageContainer } from "@/components/page-container"
import { getDSAIndex } from "@/lib/contentV2"
import type { DSAProblemIndex } from "@/lib/contentV2-types"
import type { DSASheetPageData } from "@/lib/dsa"

export function DSASheetView({ data }: { data: DSASheetPageData }) {
  const { breadcrumbs, heroStats, groups, sheetName, totalProblems } = data
  const index = getDSAIndex()
  const bySlug = new Map<string, DSAProblemIndex>((index?.problems ?? []).map((p) => [p.slug, p]))

  let runningPosition = 0

  return (
    <PageContainer className="py-14 sm:py-16">
      <DSABreadcrumb trail={breadcrumbs} />

      <header className="mb-12">
        <div className="flex items-center gap-2">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
            <ListChecks className="h-5 w-5 text-primary" />
          </span>
          <h1 className="type-display text-foreground">{sheetName}</h1>
        </div>
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

      <div className="space-y-8">
        {groups.map((group) => (
          <section key={group.groupSlug}>
            <div className="flex items-baseline gap-2">
              <h2 className="type-section text-foreground">{group.title}</h2>
              <span className="text-sm text-muted-foreground">({group.problemSlugs.length})</span>
            </div>
            {group.blurb && (
              <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{group.blurb}</p>
            )}
            <div className="mt-4 divide-y divide-border/60 overflow-hidden rounded-lg border border-border/60 bg-card">
              {group.problemSlugs.map((slug) => {
                const problem = bySlug.get(slug)
                runningPosition += 1
                if (!problem) return null
                return <DSAProblemRow key={slug} problem={problem} position={runningPosition} />
              })}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-8 text-sm text-muted-foreground">{totalProblems} problems total.</p>
    </PageContainer>
  )
}
