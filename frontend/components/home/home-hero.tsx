import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";
import { ScoreRing } from "@/components/ui/score-ring";
import { HOME_HERO, getHomeContentStats } from "@/lib/home/home-data";

/**
 * HomeHero — orient in 3 seconds.
 *
 * One USP-forward H1 + concise supporting line + one primary CTA + a compact
 * proof element (ScoreRing + sample question) that *shows* the product's
 * intelligence rather than describing it. Trust microline derived from
 * content (no hardcoded stats). Server-rendered.
 *
 * Visual gravity: an eyebrow label anchors *what this is* before the promise;
 * the primary CTA carries an icon to read as the heavier action; the trust
 * row sits in a structured hairline-bordered strip so it reads as a real
 * signal, not an afterthought.
 */
export function HomeHero() {
  const stats = getHomeContentStats();
  const questionCount = stats.find((s) => s.label.startsWith("Curated"))?.value;
  const languages = stats.find((s) => s.label === "Languages live today")?.value;

  return (
    <section
      aria-labelledby="home-hero-heading"
      className="border-b border-border/60 bg-background"
    >
      <PageContainer className="py-16 sm:py-20 lg:py-24">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
          {/* Copy */}
          <div className="max-w-2xl">
            <p className="type-label text-primary mb-4 flex items-center gap-1.5">
              <Sparkles className="h-3.5 w-3.5" aria-hidden="true" />
              Interview prep, rethought
            </p>

            <h1
              id="home-hero-heading"
              className="type-display text-foreground leading-[1.05] tracking-tight"
            >
              {HOME_HERO.headline}
            </h1>

            <p className="mt-5 max-w-xl text-lg text-muted-foreground leading-relaxed">
              {HOME_HERO.supporting}
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link
                href={HOME_HERO.primaryCta.href}
                className={cn(buttonVariants({ variant: "primary", size: "lg" }), "shadow-sm")}
              >
                {HOME_HERO.primaryCta.label}
                <ArrowRight className="ml-1" aria-hidden="true" />
              </Link>
              <Link
                href={HOME_HERO.secondaryCta.href}
                className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
              >
                {HOME_HERO.secondaryCta.label}
              </Link>
            </div>

            {/* Structured trust row — reads as a real signal, not an afterthought. */}
            {(questionCount || languages) && (
              <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-2 border-t border-border pt-5 text-sm text-muted-foreground">
                {questionCount && (
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground tabular-nums">{questionCount}</span>
                    curated questions
                  </span>
                )}
                {questionCount && languages && (
                  <span className="h-3 w-px bg-border" aria-hidden="true" />
                )}
                {languages && (
                  <span className="flex items-center gap-1.5">
                    <span className="font-semibold text-foreground">{languages}</span>
                    live today
                  </span>
                )}
                {stats.find((s) => s.label === "DSA patterns covered")?.value && (
                  <>
                    <span className="h-3 w-px bg-border" aria-hidden="true" />
                    <span className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground tabular-nums">
                        {stats.find((s) => s.label === "DSA patterns covered")?.value}
                      </span>
                      DSA patterns
                    </span>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Compact proof element — shows the product's intelligence */}
          <div className="hidden lg:flex lg:justify-end">
            <div className="relative w-full max-w-sm rounded-xl border border-border/60 bg-card p-7">
              <div className="flex items-center gap-2 mb-6">
                <span className="flex h-8 w-8 items-center justify-center rounded-md border border-border bg-surface">
                  <span className="text-xs font-bold text-primary">Q</span>
                </span>
                <span className="text-sm font-semibold text-foreground">Sample question</span>
              </div>
              <p className="text-sm text-foreground leading-relaxed mb-6">
                &ldquo;Find the longest substring without repeating characters.&rdquo;
              </p>
              <div className="flex flex-col items-center text-center">
                <ScoreRing
                  value={82}
                  size={108}
                  stroke={8}
                  label="answer score"
                  ariaLabel="Sample answer score of 82"
                />
              </div>
              <p className="mt-4 text-xs text-muted-foreground text-center">
                Pattern: Sliding Window · O(n) optimal
              </p>
            </div>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
