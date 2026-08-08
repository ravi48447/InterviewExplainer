/**
 * Phase 11 — DSA hub page architecture.
 *
 * Composes the canonical hub payload (`DSAHubPageData`) with the existing
 * `components/dsa/*` primitives. Server component — no client state.
 */
import Link from "next/link"
import { ArrowRight, Layers, BookOpen, Workflow, Building2, ListChecks } from "lucide-react"
import type { DSAHubPageData, DSAExploreItem, DSAModule, DSASheet } from "@/lib/dsa"
import { DSAProblemList } from "@/components/dsa/DSAProblemRow"

export function DSAHub({ data }: { data: DSAHubPageData }) {
  const { stats, heroStats, categories, patterns, companies, modules, sheets, featuredProblems } = data
  return (
    <div className="page-container py-8 lg:py-10">
      {/* Hero */}
      <header className="mb-10">
        <p className="text-sm font-semibold text-primary mb-2">DSA Practice Hub</p>
        <h1 className="type-display text-foreground mb-3">
          Data Structures & Algorithms — interview problems, solved properly
        </h1>
        <p className="reading-container text-muted-foreground mb-6">
          {stats.totalProblems} curated problems across {stats.totalModules} modules, each worked
          brute-force → optimal in Java and Python with line-by-line walkthroughs. Browse by
          category, pattern, module, sheet, or company.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {heroStats.map((s) => (
            <div key={s.label} className="rounded-lg border border-border bg-card p-4">
              <div className="type-section text-primary font-semibold">{s.value}</div>
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </div>
          ))}
        </div>
      </header>

      {/* Categories */}
      <Section id="categories" title="By Category" icon={<Layers className="h-4 w-4" />}>
        <ExploreGrid items={categories} />
      </Section>

      {/* Modules */}
      {modules.length > 0 && (
        <Section id="modules" title="Curriculum Modules" icon={<BookOpen className="h-4 w-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {modules.map((m) => (
              <ModuleCard key={m.moduleSlug} module={m} />
            ))}
          </div>
        </Section>
      )}

      {/* Patterns */}
      {patterns.length > 0 && (
        <Section id="patterns" title="By Pattern" icon={<Workflow className="h-4 w-4" />}>
          <ExploreGrid items={patterns} hrefPrefix="/dsa/pattern/" />
        </Section>
      )}

      {/* Sheets */}
      {sheets.length > 0 && (
        <Section id="sheets" title="Practice Sheets" icon={<ListChecks className="h-4 w-4" />}>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {sheets.map((s) => (
              <SheetCard key={s.sheetSlug} sheet={s} />
            ))}
          </div>
        </Section>
      )}

      {/* Companies */}
      {companies.length > 0 && (
        <Section id="companies" title="By Company" icon={<Building2 className="h-4 w-4" />}>
          <ExploreGrid items={companies} hrefPrefix="/dsa/company/" />
        </Section>
      )}

      {/* Featured problems */}
      {featuredProblems.length > 0 && (
        <Section id="featured" title="Featured Problems" icon={<ArrowRight className="h-4 w-4" />}>
          <DSAProblemList problems={featuredProblems} />
        </Section>
      )}
    </div>
  )
}

function Section({ id, title, icon, children }: { id: string; title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section id={id} className="mb-10 scroll-mt-24">
      <div className="flex items-center gap-2 mb-4">
        <span className="text-primary">{icon}</span>
        <h2 className="type-section text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  )
}

function ExploreGrid({ items, hrefPrefix = "/dsa/" }: { items: DSAExploreItem[]; hrefPrefix?: string }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={item.href}
          className="group flex items-center justify-between rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all"
        >
          <div>
            <div className="font-semibold text-foreground group-hover:text-primary transition-colors">{item.label}</div>
            <div className="text-xs text-muted-foreground">{item.count} problems</div>
          </div>
          <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
        </Link>
      ))}
    </div>
  )
}

function ModuleCard({ module }: { module: DSAModule }) {
  return (
    <Link
      href={`/dsa/module/${module.moduleSlug}`}
      className="group block rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <div className="flex items-center gap-2 mb-1">
        <span className="text-xs font-bold text-primary">{module.moduleNumber}</span>
        <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">{module.title}</h3>
      </div>
      <p className="text-sm text-muted-foreground line-clamp-2">{module.shortDescription ?? module.tagline}</p>
      <div className="mt-2 text-xs text-muted-foreground capitalize">{module.level} · {module.focus}</div>
    </Link>
  )
}

function SheetCard({ sheet }: { sheet: DSASheet }) {
  return (
    <Link
      href={`/dsa/sheet/${sheet.sheetSlug}`}
      className="group block rounded-lg border border-border bg-card p-4 hover:border-primary/40 hover:shadow-sm transition-all"
    >
      <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors mb-1">{sheet.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2">{sheet.tagline ?? sheet.description}</p>
      <div className="mt-2 text-xs text-muted-foreground">{sheet.totalProblems} problems</div>
    </Link>
  )
}
