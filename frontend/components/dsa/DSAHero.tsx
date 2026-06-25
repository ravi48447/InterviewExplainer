import { ReactNode } from "react";
import { LucideIcon } from "lucide-react";

const BG_GRID = {
  backgroundImage: [
    "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "32px 32px",
} as React.CSSProperties;

/**
 * Standard hero block for DSA pages.
 *
 * Dark #0f1014 background with grid texture and violet radial glow —
 * consistent across every DSA surface (category, pattern, company,
 * difficulty, module, sheet).
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
    <header className="mb-8 relative overflow-hidden rounded-2xl bg-[#0f1014] text-primary-foreground dark:text-foreground border border-white/[0.06] shadow-xl shadow-violet-950/10 ring-1 ring-white/[0.04]">
      {/* Grid texture */}
      <div className="pointer-events-none absolute inset-0" style={BG_GRID} aria-hidden />
      {/* Violet radial glow */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 65% 70% at 20% -10%, rgba(139,92,246,0.22) 0%, transparent 60%)" }}
        aria-hidden
      />
      {/* Indigo counter-glow, far corner */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 50% 60% at 100% 110%, rgba(99,102,241,0.14) 0%, transparent 55%)" }}
        aria-hidden
      />
      {/* Bottom fade */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-[#0f1014] to-transparent" aria-hidden />

      <div className="relative px-6 sm:px-8 pt-7 pb-8">
        {/* Eyebrow */}
        <div className="inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-1.5 mb-4">
          {EyebrowIcon && <EyebrowIcon className="h-3.5 w-3.5 text-violet-400" />}
          <span className="text-xs font-bold uppercase tracking-widest text-violet-300">{eyebrow}</span>
        </div>

        {/* Title */}
        <h1 className="text-3xl sm:text-[2.25rem] font-black text-primary-foreground dark:text-foreground mb-2.5 leading-[1.1] tracking-tight">
          {title}
        </h1>

        {/* Tagline */}
        <p className="text-sm sm:text-base text-zinc-400 mb-4 leading-relaxed max-w-2xl">
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
          <div className="text-sm leading-relaxed text-zinc-400 mb-4 max-w-2xl space-y-2">
            {body}
          </div>
        )}

        {/* CTA */}
        {cta && <div className="flex flex-wrap gap-2.5 mt-2">{cta}</div>}
      </div>

      {/* Feature strip */}
    </header>
  );
}

/**
 * Stat card used inside DSAHero's `stats` prop.
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
    <div className="flex items-center gap-3 rounded-xl bg-background/[0.05] border border-white/[0.08] px-4 py-3 transition-colors hover:bg-background/[0.07] hover:border-violet-500/25">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-violet-500/15 shrink-0">
        <Icon className="h-4 w-4 text-violet-300" />
      </div>
      <div className="min-w-0">
        <div className="text-base font-black text-primary-foreground dark:text-foreground leading-none">{value}</div>
        <div className="text-[11px] font-medium text-zinc-500 leading-none mt-1.5 truncate">
          {label}
        </div>
      </div>
    </div>
  );
}
