import Link from "next/link";
import { ArrowRight, Zap, Layers, MoveHorizontal, Frame, GitBranch, Network, Workflow, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { PageContainer } from "@/components/page-container";
import { Badge } from "@/components/ui/badge";
import { getHomeDSAPatterns } from "@/lib/home/home-data";

/**
 * HomeDSA — dedicated DSA pattern discovery (P04-T067, T269..T271).
 *
 * DSA was previously reachable only as a line item inside "What you can do
 * here" and a footer link — visitors had no visible path into pattern-based
 * coding practice. This section surfaces the six core interview patterns as
 * whole-card entry points so a candidate can jump straight to the technique
 * they want to drill.
 *
 * Visual treatment mirrors HomePathways/HomeTechnologies for consistency
 * (P04-T071/T072 — no unique colour per card) but uses a distinct section
 * band (bg-surface) so DSA reads as its own pillar, not a sub-item. Renders
 * null when DSA is disabled so the homepage never shows a dead section.
 */

const PATTERN_ICONS: Record<string, LucideIcon> = {
  "arrays-hashing": Layers,
  "two-pointers": MoveHorizontal,
  "sliding-window": Frame,
  trees: GitBranch,
  graphs: Network,
  "dynamic-programming": Workflow,
};

const TIER_VARIANT: Record<string, "success" | "warning" | "destructive"> = {
  Core: "success",
  Intermediate: "warning",
  Advanced: "destructive",
};

export function HomeDSA() {
  const patterns = getHomeDSAPatterns();
  if (patterns.length === 0) return null;

  // Split the spotlight pattern off so the section leads with visual hierarchy
  // instead of six equal cards. Falls back to "all in the grid" if no pattern
  // is flagged featured (or if it was filtered out by the launch config).
  const featured = patterns.find((p) => p.featured);
  const rest = featured ? patterns.filter((p) => p !== featured) : patterns;

  return (
    <section
      id="dsa"
      aria-labelledby="home-dsa-heading"
      className="border-b border-border/60 bg-surface"
    >
      <PageContainer className="py-14 sm:py-16">
        <SectionHeader
          as="h2"
          title="Drill DSA by pattern"
          description="The way interviews actually test it — organized by technique, not by random problem. Two pointers, sliding window, DP, and graphs, each with worked examples in Java and Python."
          actions={
            <Link
              href="/dsa"
              className="inline-flex items-center gap-1 text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            >
              Explore all DSA
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          }
        />

        {featured && (
          <FeaturedPatternCard pattern={featured} />
        )}

        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((p) => {
            const Icon = PATTERN_ICONS[p.icon] ?? Layers;
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group flex h-full flex-col rounded-lg border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex items-start gap-3">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
                      <Icon className="h-5 w-5 text-foreground" aria-hidden="true" />
                    </span>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-base font-semibold text-foreground leading-tight">
                        {p.name}
                      </h3>
                      <div className="mt-1.5 flex items-center gap-2">
                        <Badge variant={TIER_VARIANT[p.tier] ?? "warning"} className="text-xs font-medium">
                          {p.tier}
                        </Badge>
                        <span className="text-xs text-muted-foreground tabular-nums">
                          {p.count} problems
                        </span>
                      </div>
                    </div>
                  </div>
                  <p className="mt-3 flex-1 text-sm text-muted-foreground leading-relaxed">
                    {p.blurb}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Start practicing
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Quick entry to the difficulty tiers */}
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted-foreground">Jump in by difficulty:</span>
          <Link
            href="/dsa/easy"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-200 ease-out hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Zap className="h-3.5 w-3.5 text-success" aria-hidden="true" />
            Easy
          </Link>
          <Link
            href="/dsa/medium"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-200 ease-out hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Zap className="h-3.5 w-3.5 text-warning" aria-hidden="true" />
            Medium
          </Link>
          <Link
            href="/dsa/hard"
            className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1.5 text-xs font-medium text-foreground transition-colors duration-200 ease-out hover:border-primary/30 hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            <Zap className="h-3.5 w-3.5 text-destructive" aria-hidden="true" />
            Hard
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}

/**
 * FeaturedPatternCard — the wide spotlight that leads the DSA grid.
 *
 * DSA is the homepage's primary CTA destination, so the section earns a
 * moment of visual elevation: the foundation pattern ("Arrays & Hashing")
 * renders full-width with a larger icon tile, a "Start here" eyebrow, and
 * more room for its copy. The remaining five patterns sit in the standard
 * grid below, so a candidate still sees the full ladder at a glance.
 */
function FeaturedPatternCard({ pattern }: { pattern: NonNullable<ReturnType<typeof getHomeDSAPatterns>[number]> }) {
  const Icon = PATTERN_ICONS[pattern.icon] ?? Layers;
  return (
    <Link
      href={pattern.href}
      className="group mt-10 flex flex-col gap-6 rounded-lg border border-primary/30 bg-card p-6 transition-colors duration-200 ease-out hover:border-primary/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background sm:flex-row sm:items-center sm:gap-8 sm:p-8"
    >
      <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10 sm:h-16 sm:w-16">
        <Icon className="h-7 w-7 text-primary sm:h-8 sm:w-8" aria-hidden="true" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="type-label text-primary">Start here</p>
        <h3 className="mt-1.5 text-lg font-semibold text-foreground leading-tight sm:text-xl">
          {pattern.name}
        </h3>
        <p className="mt-2 max-w-2xl text-sm text-muted-foreground leading-relaxed">
          {pattern.blurb}
        </p>
        <div className="mt-3 flex items-center gap-2">
          <Badge variant={TIER_VARIANT[pattern.tier] ?? "warning"} className="text-xs font-medium">
            {pattern.tier}
          </Badge>
          <span className="text-xs text-muted-foreground tabular-nums">
            {pattern.count} problems
          </span>
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-2 self-start text-sm font-medium text-primary sm:self-center">
        Start practicing
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
      </div>
    </Link>
  );
}

