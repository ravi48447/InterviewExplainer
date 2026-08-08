import Link from "next/link";
import { ArrowRight, Radio, Mic, Gauge, BookOpen } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";
import { ScoreRing } from "@/components/ui/score-ring";
import { getHomeMockShowcase } from "@/lib/home/home-data";

/**
 * HomeMockShowcase — a featured-product band for AI mock interviews.
 *
 * A flagship USP that was previously buried in a text-only capabilities list.
 * Demonstrates the product with a ScoreRing + voice-waveform visual rather
 * than describing it. Visually distinct (primary-tinted band) so it reads as a
 * featured product, not a catalog entry. Renders null when disabled.
 */
export function HomeMockShowcase() {
  const data = getHomeMockShowcase();
  if (!data) return null;

  const POINT_ICONS = [Mic, Gauge, BookOpen];

  return (
    <section
      aria-labelledby="home-mock-heading"
      className="border-b border-border bg-primary/5"
    >
      <PageContainer className="py-16 sm:py-20">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Visual proof — ScoreRing + voice waveform */}
          <div className="order-2 lg:order-1 flex flex-col items-center">
            <div className="relative rounded-xl border border-border bg-card p-8 shadow-sm w-full max-w-sm">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface">
                  <Radio className="h-4 w-4 text-primary" aria-hidden="true" />
                </span>
                <span className="text-sm font-semibold text-foreground">AI Interviewer</span>
                <span className="ml-auto flex items-center gap-1" aria-hidden="true">
                  <span className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                  <span className="text-xs font-medium text-muted-foreground">live</span>
                </span>
              </div>

              <div className="flex flex-col items-center text-center">
                <ScoreRing
                  value={data.sampleScore}
                  size={132}
                  stroke={9}
                  label="overall score"
                  ariaLabel="Sample mock interview score"
                />
                <p className="mt-4 text-sm text-muted-foreground max-w-xs">
                  &ldquo;Walk me through how you&apos;d design a rate limiter.&rdquo;
                </p>
              </div>

              {/* Voice waveform visual */}
              <div className="mt-6 flex items-end justify-center gap-1 h-10" aria-hidden="true">
                {[0.4, 0.7, 0.3, 0.9, 0.5, 0.8, 0.35, 0.6, 0.45, 0.75, 0.3, 0.55, 0.4, 0.65, 0.5].map((h, i) => (
                  <span
                    key={i}
                    className="w-1 rounded-full bg-primary/60"
                    style={{ height: `${h * 100}%` }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Copy + points */}
          <div className="order-1 lg:order-2">
            <p className="type-label text-primary mb-3">AI Mock Interviews</p>
            <h2 id="home-mock-heading" className="type-section text-foreground leading-tight">
              {data.headline}
            </h2>
            <p className="mt-3 text-base text-muted-foreground leading-relaxed">
              {data.supporting}
            </p>

            <ul className="mt-6 space-y-4">
              {data.points.map((pt, i) => {
                const Icon = POINT_ICONS[i] ?? Mic;
                return (
                  <li key={pt.title} className="flex items-start gap-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-card">
                      <Icon className="h-4 w-4 text-primary" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-foreground">{pt.title}</p>
                      <p className="text-sm text-muted-foreground">{pt.detail}</p>
                    </div>
                  </li>
                );
              })}
            </ul>

            <Link
              href={data.cta.href}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "mt-8")}
            >
              {data.cta.label}
              <ArrowRight className="ml-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
