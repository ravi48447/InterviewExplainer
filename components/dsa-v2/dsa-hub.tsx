/**
 * Phase 11 — DSA hub page architecture (V2 learning-site treatment).
 *
 * Composes the canonical hub payload (`DSAHubPageData`) with the existing
 * `components/dsa/*` primitives. Server component — no client state.
 *
 * The hub is the front door of the DSA learning track, so it owns the most
 * considered visual hierarchy on the surface: a hero with a hairline stat
 * band, a sticky in-page nav strip that jumps to each browse dimension, and
 * section bands that alternate bg-background ↔ bg-surface so the eye gets a
 * rhythm (mirroring the homepage). All cards use the softened
 * `border-border/60` + `hover:border-primary/30` treatment so the surface
 * reads as one restrained system rather than a loose collection of widgets.
 */
import Link from "next/link"
import {
  ArrowRight,
  Layers,
  BookOpen,
  Workflow,
  Building2,
  ListChecks,
  Sparkles,
} from "lucide-react"
import type {
  DSAHubPageData,
  DSAExploreItem,
  DSAModule,
  DSASheet,
  DSAHubNavItem,
} from "@/lib/dsa"
import { DSAProblemList } from "@/components/dsa/DSAProblemRow"
import { PageContainer } from "@/components/page-container"
import { SectionHeader } from "@/components/ui/section-header"

export function DSAHub({ data }: { data: DSAHubPageData }) {
  const { stats, hubNav, heroStats, categories, patterns, companies, modules, sheets, featuredProblems } = data
  const navItems = hubNav?.length ? hubNav : defaultNav

  return (
    <div className="flex flex-col">
      {/* ── Hero band ───────────────────────────────────────────────────── */}
      <section className="border-b border-border/60 bg-background">
        <PageContainer className="py-14 sm:py-16">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" />
              DSA Practice Hub
            </span>
            <h1 className="type-display text-foreground mt-4">
              Data Structures &amp; Algorithms — interview problems, solved properly
            </h1>
            <p className="reading-container type-body text-muted-foreground mt-5">
              {stats.totalProblems} curated problems across {stats.totalModules} modules, each worked
              brute-force → optimal in Java and Python with line-by-line walkthroughs. Browse by
              category, pattern, module, sheet, or company.
            </p>
          </div>

          {/* Hairline stat band — mirrors the homepage trust band */}
          {heroStats.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-3 lg:grid-cols-6">
              {heroStats.map((s) => (
                <div key={s.label} className="bg-card px-5 py-4">
                  <dt className="type-label text-muted-foreground">{s.label}</dt>
                  <dd className="mt-1 font-display text-2xl font-bold tabular-nums text-foreground">
                    {s.value}
                  </dd>
                </div>
              ))}
            </dl>
          )}
        </PageContainer>
      </section>

      {/* ── In-page navigation strip ────────────────────────────────────── */}
      <nav
        aria-label="Browse DSA"
        className="border-b border-border/60 bg-surface"
      >
        <PageContainer>
          <ul className="flex items-center gap-1 overflow-x-auto py-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {navItems.map((item) => (
              <li key={item.slug} className="shrink-0">
                <a
                  href={item.href}
                  className="inline-flex items-center rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-background hover:text-foreground"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </PageContainer>
      </nav>

      {/* ── Body: alternating section bands ─────────────────────────────── */}
      <div className="flex flex-col">
        {/* Categories */}
        {categories.length > 0 && (
          <Section id="categories" title="By Category" description="Group problems by the data structure or algorithm family they exercise." icon={<Layers className="h-4 w-4" />} tone="surface">
            <ExploreGrid items={categories} />
          </Section>
        )}

        {/* Modules */}
        {modules.length > 0 && (
          <Section id="modules" title="Curriculum Modules" description="A guided path through the curriculum — theory first, then pattern practice, then full interview reps." icon={<BookOpen className="h-4 w-4" />} tone="background">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {modules.map((m) => (
                <ModuleCard key={m.moduleSlug} module={m} />
              ))}
            </div>
          </Section>
        )}

        {/* Patterns */}
        {patterns.length > 0 && (
          <Section id="patterns" title="By Pattern" description="The way interviews actually test it — learn the technique, then apply it across problems." icon={<Workflow className="h-4 w-4" />} tone="surface">
            <ExploreGrid items={patterns} hrefPrefix="/dsa/pattern/" />
          </Section>
        )}

        {/* Sheets */}
        {sheets.length > 0 && (
          <Section id="sheets" title="Practice Sheets" description="Curated problem sets — Blind 75, NeetCode 150, and more — with progress tracking." icon={<ListChecks className="h-4 w-4" />} tone="background">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {sheets.map((s) => (
                <SheetCard key={s.sheetSlug} sheet={s} />
              ))}
            </div>
          </Section>
        )}

        {/* Companies */}
        {companies.length > 0 && (
          <Section id="companies" title="By Company" description="High-frequency problems asked by FAANG and other top tech employers." icon={<Building2 className="h-4 w-4" />} tone="surface">
            <ExploreGrid items={companies} hrefPrefix="/dsa/company/" />
          </Section>
        )}

        {/* Featured problems */}
        {featuredProblems.length > 0 && (
          <Section id="featured" title="Featured Problems" description="Editorial-quality walkthroughs, each worked brute-force → optimal." icon={<Sparkles className="h-4 w-4" />} tone="background">
            <DSAProblemList problems={featuredProblems} />
          </Section>
        )}
      </div>
    </div>
  )
}

/** Section band — alternates bg-background ↔ bg-surface for rhythm, like the homepage. */
function Section({
  id,
  title,
  description,
  icon,
  children,
  tone = "background",
}: {
  id: string
  title: string
  description?: string
  icon: React.ReactNode
  children: React.ReactNode
  tone?: "background" | "surface"
}) {
  return (
    <section
      id={id}
      aria-labelledby={`${id}-heading`}
      className={cnTone(tone)}
    >
      <PageContainer className="py-14 sm:py-16">
        <SectionHeader
          as="h2"
          title={
            <span className="flex items-center gap-2">
              <span className="text-primary">{icon}</span>
              <span id={`${id}-heading`}>{title}</span>
            </span>
          }
          description={description}
        />
        <div className="mt-8">{children}</div>
      </PageContainer>
    </section>
  )
}

function cnTone(tone: "background" | "surface") {
  return tone === "surface"
    ? "border-b border-border/60 bg-surface"
    : "border-b border-border/60 bg-background"
}

function ExploreGrid({ items, hrefPrefix = "/dsa/" }: { items: DSAExploreItem[]; hrefPrefix?: string }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <Link
          key={item.slug}
          href={item.href}
          className="group flex items-center justify-between rounded-lg border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <div className="min-w-0">
            <div className="font-semibold text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
              {item.label}
            </div>
            <div className="mt-1 text-sm text-muted-foreground">{item.count} problems</div>
          </div>
          <ArrowRight
            className="h-4 w-4 shrink-0 text-muted-foreground transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-primary"
            aria-hidden
          />
        </Link>
      ))}
    </div>
  )
}

function ModuleCard({ module }: { module: DSAModule }) {
  return (
    <Link
      href={`/dsa/module/${module.moduleSlug}`}
      className="group flex h-full flex-col rounded-lg border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface font-display text-sm font-bold text-primary">
          {module.moduleNumber}
        </span>
        <h3 className="font-semibold text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
          {module.title}
        </h3>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {module.shortDescription ?? module.tagline}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-surface px-2 py-0.5 capitalize">
          {module.level}
        </span>
        <span className="text-muted-foreground/60">·</span>
        <span className="capitalize">{module.focus}</span>
        <ArrowRight
          className="ml-auto h-4 w-4 text-muted-foreground transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>
    </Link>
  )
}

function SheetCard({ sheet }: { sheet: DSASheet }) {
  return (
    <Link
      href={`/dsa/sheet/${sheet.sheetSlug}`}
      className="group flex h-full flex-col rounded-lg border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
    >
      <div className="flex items-center gap-2">
        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
          <ListChecks className="h-4 w-4 text-primary" />
        </span>
        <h3 className="font-semibold text-foreground transition-colors duration-200 ease-out group-hover:text-primary">
          {sheet.title}
        </h3>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-muted-foreground">
        {sheet.tagline ?? sheet.description}
      </p>
      <div className="mt-auto flex items-center justify-between pt-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1 rounded-md border border-border/60 bg-surface px-2 py-0.5 font-medium">
          {sheet.totalProblems} problems
        </span>
        <ArrowRight
          className="h-4 w-4 text-muted-foreground transition-all duration-200 ease-out group-hover:translate-x-0.5 group-hover:text-primary"
          aria-hidden
        />
      </div>
    </Link>
  )
}

/** Default in-page nav used when the hub payload doesn't supply hubNav. */
const defaultNav: DSAHubNavItem[] = [
  { slug: "categories", label: "Categories", href: "#categories", icon: "categories" },
  { slug: "modules", label: "Modules", href: "#modules", icon: "modules" },
  { slug: "patterns", label: "Patterns", href: "#patterns", icon: "patterns" },
  { slug: "sheets", label: "Sheets", href: "#sheets", icon: "sheets" },
  { slug: "companies", label: "Companies", href: "#companies", icon: "companies" },
  { slug: "featured", label: "Featured", href: "#featured", icon: "categories" },
]
