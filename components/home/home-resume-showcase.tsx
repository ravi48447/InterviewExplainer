import Link from "next/link";
import { ArrowRight, FileText, Gauge, AlertCircle, Target } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";
import { ScoreRing } from "@/components/ui/score-ring";
import { getHomeResumeShowcase } from "@/lib/home/home-data";

/**
 * HomeResumeShowcase — a featured-product band for resume intelligence.
 *
 * A flagship USP that was entirely absent from the homepage. Demonstrates the
 * product with a ScoreRing + job-match coverage visual.
 *
 * Visual differentiation from HomeMockShowcase: the mock band uses a split
 * grid (proof left / copy right). This band uses a *centered spotlight*
 * layout — a compact proof card on top, copy + points in a 3-up row below —
 * so the two flagship bands back-to-back don't feel like the same mold
 * repeating. Renders null when the dashboard hub is disabled.
 */
export function HomeResumeShowcase() {
  const data = getHomeResumeShowcase();
  if (!data) return null;

  const POINT_ICONS = [Gauge, AlertCircle, Target];

  return (
    <section
      aria-labelledby="home-resume-heading"
      className="border-b border-border bg-background"
    >
      <PageContainer className="py-16 sm:py-20">
        {/* Centered headline block */}
        <div className="max-w-2xl mx-auto text-center">
          <p className="type-label text-primary mb-3">Resume Intelligence</p>
          <h2 id="home-resume-heading" className="type-section text-foreground leading-tight">
            {data.headline}
          </h2>
          <p className="mt-3 text-base text-muted-foreground leading-relaxed">
            {data.supporting}
          </p>
        </div>

        {/* Compact proof spotlight — centered, narrower than the mock band's card */}
        <div className="mt-10 flex justify-center">
          <div className="relative w-full max-w-sm rounded-xl border border-border bg-card p-7 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface">
                <FileText className="h-4 w-4 text-primary" aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold text-foreground">Resume vs. Job Description</span>
              <span className="ml-auto inline-flex items-center gap-1.5 rounded-full border border-success/30 bg-success/10 px-2.5 py-1 text-xs font-medium text-success">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success/60" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-success" />
                </span>
                Live analysis
              </span>
            </div>

            <div className="flex flex-col items-center text-center">
              <ScoreRing
                value={data.sampleScore}
                size={128}
                stroke={9}
                label="overall match"
                suffix="%"
                ariaLabel="Sample resume match score"
              />
            </div>

            {/* Coverage bar */}
            <div className="mt-5">
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs font-semibold text-muted-foreground">Requirements coverage</p>
                <p className="text-xs font-bold text-foreground tabular-nums">{data.sampleCoverage}%</p>
              </div>
              <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out"
                  style={{ width: `${data.sampleCoverage}%` }}
                />
              </div>
              <div className="mt-3 flex items-center justify-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-success" /> 9 strong
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-warning" /> 4 partial
                </span>
                <span className="flex items-center gap-1.5 text-muted-foreground">
                  <span className="h-2 w-2 rounded-full bg-destructive" /> 3 missing
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* 3-up points row — distinct from the mock band's vertical list */}
        <ul className="mt-10 grid gap-5 sm:grid-cols-3 max-w-4xl mx-auto">
          {data.points.map((pt, i) => {
            const Icon = POINT_ICONS[i] ?? Gauge;
            return (
              <li key={pt.title} className="flex flex-col items-center text-center sm:items-start sm:text-left">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-surface">
                  <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
                <p className="mt-3 text-sm font-semibold text-foreground">{pt.title}</p>
                <p className="mt-1 text-sm text-muted-foreground leading-relaxed">{pt.detail}</p>
              </li>
            );
          })}
        </ul>

        <div className="mt-10 flex justify-center">
          <Link
            href={data.cta.href}
            className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
          >
            {data.cta.label}
            <ArrowRight className="ml-1" aria-hidden="true" />
          </Link>
        </div>
      </PageContainer>
    </section>
  );
}
