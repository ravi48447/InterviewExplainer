import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PageContainer } from "@/components/page-container";
import { getHomeFinalCTA } from "@/lib/home/home-data";

/**
 * HomeFinalCTA — the homepage's own conversion moment.
 *
 * A world-class homepage doesn't trail off into a link directory; it
 * re-states the promise and gives the visitor one clear place to go before
 * the footer discovery. Centered, restrained, one primary + one secondary
 * action — mirrors the hero's CTA hierarchy so the page bookends cleanly.
 */
export function HomeFinalCTA() {
  const data = getHomeFinalCTA();

  return (
    <section
      aria-labelledby="home-final-cta-heading"
      className="border-b border-border bg-background"
    >
      <PageContainer className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="home-final-cta-heading"
            className="type-section text-foreground leading-tight"
          >
            {data.headline}
          </h2>
          <p className="mt-4 text-base text-muted-foreground leading-relaxed">
            {data.supporting}
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-center">
            <Link
              href={data.primaryCta.href}
              className={cn(buttonVariants({ variant: "primary", size: "lg" }), "shadow-sm")}
            >
              {data.primaryCta.label}
              <ArrowRight className="ml-1" aria-hidden="true" />
            </Link>
            <Link
              href={data.secondaryCta.href}
              className={cn(buttonVariants({ variant: "outline", size: "lg" }))}
            >
              {data.secondaryCta.label}
            </Link>
          </div>
        </div>
      </PageContainer>
    </section>
  );
}
