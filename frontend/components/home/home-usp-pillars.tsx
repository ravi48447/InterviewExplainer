import Link from "next/link";
import { ArrowRight, Layers, Radio, FileText, MessageSquare, type LucideIcon } from "lucide-react";
import { PageContainer } from "@/components/page-container";
import { cn } from "@/lib/utils";
import { getHomeUSPPillars, type HomeUSPPillar } from "@/lib/home/home-data";

/**
 * HomeUSPPillars — the "why this, not the other prep site" band.
 *
 * Four differentiators as wider tiles on a surface band (visually distinct
 * from the card grids below). Each tile: bold icon + outcome + concrete proof
 * point + CTA. Renders null when no pillars are enabled.
 *
 * Visual rhythm: each pillar carries a subtle semantic tint on its icon
 * container (primary / success / warning / destructive) so the band reads
 * as four distinct pillars rather than a monotone quartet — while staying
 * within the single-accent system (tints, not new hues).
 */
const PILLAR_ICONS: Record<string, LucideIcon> = {
  layers: Layers,
  radio: Radio,
  "file-text": FileText,
  "message-square": MessageSquare,
};

const TINT_CLASSES: Record<HomeUSPPillar["tint"], { icon: string; cta: string; metric: string }> = {
  primary: {
    icon: "border-primary/20 bg-primary/5 text-primary",
    cta: "text-primary",
    metric: "border-primary/20 bg-primary/5 text-primary",
  },
  success: {
    icon: "border-success/20 bg-success/5 text-success",
    cta: "text-success",
    metric: "border-success/20 bg-success/5 text-success",
  },
  warning: {
    icon: "border-warning/20 bg-warning/5 text-warning",
    cta: "text-warning",
    metric: "border-warning/20 bg-warning/5 text-warning",
  },
  destructive: {
    icon: "border-destructive/20 bg-destructive/5 text-destructive",
    cta: "text-destructive",
    metric: "border-destructive/20 bg-destructive/5 text-destructive",
  },
};

export function HomeUSPPillars() {
  const pillars = getHomeUSPPillars();
  if (pillars.length === 0) return null;

  return (
    <section
      aria-labelledby="home-usp-heading"
      className="border-b border-border/60 bg-surface"
    >
      <PageContainer className="py-14 sm:py-16">
        <div className="max-w-2xl mb-8">
          <p className="type-label text-primary mb-3">Why Interview Explainer</p>
          <h2 id="home-usp-heading" className="type-section text-foreground">
            Built different from the generic prep sites.
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Four pillars that turn prep into outcome — each one a real product, not a feature list.
          </p>
        </div>

        <ul className="grid gap-4 sm:grid-cols-2">
          {pillars.map((p: HomeUSPPillar) => {
            const Icon = PILLAR_ICONS[p.icon] ?? Layers;
            const tint = TINT_CLASSES[p.tint] ?? TINT_CLASSES.primary;
            return (
              <li key={p.href}>
                <Link
                  href={p.href}
                  className="group flex h-full flex-col rounded-lg border border-border/60 bg-card p-5 transition-colors duration-200 ease-out hover:border-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <span className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border", tint.icon)}>
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <h3 className="text-base font-semibold text-foreground leading-tight">
                      {p.title}
                    </h3>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed flex-1">
                    {p.proof}
                  </p>
                  {p.metric && (
                    <span
                      className={cn(
                        "mt-4 inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-semibold",
                        tint.metric,
                      )}
                    >
                      {p.metric}
                    </span>
                  )}
                  <span className={cn("mt-4 inline-flex items-center gap-1 text-sm font-medium", tint.cta)}>
                    {p.cta}
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </PageContainer>
    </section>
  );
}
