import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { HOME_HERO } from "@/lib/home/home-data";

/**
 * HomeHero — calm, focused, readable opening (P04-T031..T048).
 *
 * Replaces the V1 90vh dual-gradient hero + animated dashboard visual with a
 * restrained, server-rendered orientation block:
 *   - one primary H1 (P04-T021/T032/T259/T438)
 *   - one concise supporting sentence (P04-T022/T033)
 *   - one primary CTA + one secondary discovery action (P04-T034/T035)
 *   - no badge wall, no decorative stats, no gradient text (P04-T037/T038/T039/T193)
 *   - no surface layering of cards-in-gradients (P04-T040)
 *   - subtle background, never reducing readability (P04-T041)
 *   - max text width for scanning (P04-T042)
 *   - stable vertical rhythm, no layout shift (P04-T043/T046)
 *   - mobile-first, no excessive height (P04-T044/T045)
 *   - primary content server-rendered (P04-T047) — this is a server component
 *   - CTA uses canonical URL (P04-T048)
 */
export function HomeHero() {
  return (
    <section
      aria-labelledby="home-hero-heading"
      className="border-b border-border bg-background"
    >
      <div className="page-container py-16 sm:py-20 lg:py-24">
        {/* P04-T042: max text width for scanning. */}
        <div className="max-w-2xl">
          <h1
            id="home-hero-heading"
            className="type-display text-foreground leading-tight tracking-tight"
          >
            {HOME_HERO.headline}
          </h1>

          {/* P04-T022/T033: one concise supporting sentence, readable body size. */}
          <p className="mt-4 max-w-xl text-lg text-muted-foreground leading-relaxed">
            {HOME_HERO.supporting}
          </p>

          {/* P04-T023/T034/T035/T171/T172: one primary + one secondary CTA. */}
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <Link
              href={HOME_HERO.primaryCta.href}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }))}
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
        </div>
      </div>
    </section>
  );
}
