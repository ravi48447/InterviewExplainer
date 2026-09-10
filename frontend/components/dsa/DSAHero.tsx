import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

/**
 * Standard hero block for DSA pages — the LIGHT learning-site treatment.
 *
 * Previously this was a dark `bg-hero` block with a grid texture and violet
 * radial glow. That look conflicted with the rest of the hub, which uses
 * alternating `bg-background` / `bg-surface` sections with hairline dividers
 * and a single indigo accent. This version keeps the same slot structure
 * (eyebrow / title / tagline / pills / stats / body / cta) but renders on the
 * light page background so every DSA surface reads as one continuous site.
 */
export function DSAHero({
  eyebrow,
  eyebrowIcon: EyebrowIcon,
  title,
  tagline,
  body,
  pills,
  stats,
  cta,
}: {
  eyebrow: string;
  eyebrowIcon?: LucideIcon;
  title: string;
  tagline: string;
  body?: ReactNode;
  pills?: ReactNode;
  stats?: ReactNode;
  cta?: ReactNode;
}) {
  return (
    <header className="mb-8 relative overflow-hidden rounded-lg border border-border/60 bg-surface">
      <div className="relative px-6 sm:px-8 pt-7 pb-8">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary mb-4">
          {EyebrowIcon && <EyebrowIcon className="h-3.5 w-3.5" />}
          {eyebrow}
        </div>

        {/* Title */}
        <h1 className="type-display text-foreground mb-2.5">{title}</h1>

        {/* Tagline */}
        <p className="type-prose text-muted-foreground mb-4 max-w-2xl">
          {tagline}
        </p>

        {/* Pills */}
        {pills && (
          <div className="flex flex-wrap items-center gap-2 mb-4">{pills}</div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
            {stats}
          </div>
        )}

        {/* Body */}
        {body && (
          <div className="text-sm leading-relaxed text-muted-foreground mb-4 max-w-2xl space-y-2">
            {body}
          </div>
        )}

        {/* CTA */}
        {cta && <div className="flex flex-wrap gap-2.5 mt-2">{cta}</div>}
      </div>
    </header>
  );
}

/**
 * Stat card used inside DSAHero's `stats` prop — light treatment.
 */
export function DSAStatCard({
  icon: Icon,
  label,
  value,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border/60 bg-card px-4 py-3 transition-colors hover:border-primary/30">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 shrink-0">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0">
        <div className="font-display text-base font-bold text-foreground leading-none">
          {value}
        </div>
        <div className="text-[11px] font-medium text-muted-foreground leading-none mt-1.5 truncate">
          {label}
        </div>
      </div>
    </div>
  );
}
