import Link from "next/link";
import { ArrowRight, Target, Code, Gauge, type LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { getHomeHowItWorks } from "@/lib/home/home-data";

/**
 * HomeHowItWorks — the orientation bridge between the hero and the pathways.
 *
 * A first-time visitor who lands cold doesn't yet know what "pattern-based
 * prep" *is*. This orients them in three beats — Pick → Practice → Get scored
 * — before they're asked to choose a path. Each step is a whole-card link so
 * impatient visitors can jump straight to a destination, while the 1-2-3
 * numbering teaches the mental model the rest of the page assumes.
 *
 * Visual treatment: a surface band with connected step numbers. The number
 * is the focal point (not the icon) so the *sequence* reads instantly.
 */
const STEP_ICONS: Record<string, LucideIcon> = {
  target: Target,
  code: Code,
  gauge: Gauge,
};

export function HomeHowItWorks() {
  const steps = getHomeHowItWorks();

  return (
    <section
      aria-labelledby="home-how-it-works-heading"
      className="border-b border-border bg-background"
    >
      <PageContainer className="py-14 sm:py-16">
        <div className="max-w-2xl mb-8">
          <p className="type-label text-primary mb-3">How it works</p>
          <h2 id="home-how-it-works-heading" className="type-section text-foreground">
            Three steps from prep to offer.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            No guessing what to study next — the path is built for you.
          </p>
        </div>

        <ol className="grid gap-4 sm:grid-cols-3">
          {steps.map((s) => {
            const Icon = STEP_ICONS[s.icon] ?? Target;
            return (
              <li key={s.step}>
                <Link
                  href={s.href}
                  className="group relative flex h-full flex-col rounded-lg border border-border bg-card p-6 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  {/* Step number — the focal point. Big, primary, tabular. */}
                  <div className="flex items-center justify-between">
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-base font-bold tabular-nums text-primary">
                      {s.step}
                    </span>
                    <Icon className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-foreground leading-tight">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-muted-foreground leading-relaxed flex-1">
                    {s.detail}
                  </p>
                  <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                    Go
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </PageContainer>
    </section>
  );
}
