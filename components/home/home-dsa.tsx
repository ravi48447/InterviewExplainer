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

  return (
    <section
      id="dsa"
      aria-labelledby="home-dsa-heading"
      className="border-b border-border bg-background"
    >
      <PageContainer className="py-16 sm:py-20">
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

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {patterns.map((p) => {
            const Icon = PATTERN_ICONS[p.icon] ?? Layers;
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group flex h-full flex-col rounded-lg border border-border bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
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
