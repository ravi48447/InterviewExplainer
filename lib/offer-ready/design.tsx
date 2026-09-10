/**
 * offer-ready/design.tsx — the Offer Ready design system.
 *
 * Restructured onto the platform's DESIGN TOKENS (the same system the
 * product shell and interview room use). The editorial voice stays —
 * serif display type for headlines and numbers, hairline rules, flat
 * surfaces, one accent used sparingly — but every color now resolves
 * through CSS variables so the surfaces work in both themes and match
 * the rest of the product.
 *
 * Discipline (Linear/Stripe/Vercel):
 *   - quiet chrome: type weight carries hierarchy
 *   - color = meaning: primary is the ONE accent (CTA, today, readiness)
 *   - sizes: text-sm body, text-lg/2xl headings, tabular-nums everywhere
 */

// ---------- type ----------

/** Editorial display: serif for headlines + numbers — the human signal. */
export const TYPE = {
  display: 'font-[family-name:var(--font-fraunces)] font-medium tracking-tight leading-[1.05] text-foreground',
  displayLg: 'font-[family-name:var(--font-fraunces)] font-medium tracking-tight leading-[1.05] text-2xl sm:text-3xl lg:text-4xl text-foreground',
  h1: 'font-[family-name:var(--font-fraunces)] font-medium tracking-tight text-xl sm:text-2xl text-foreground',
  h2: 'font-medium tracking-tight text-base text-foreground',
  num: 'font-medium tabular-nums tracking-tight',
  eyebrow: 'text-[11px] font-medium uppercase tracking-[0.14em] text-muted-foreground',
  lead: 'text-sm leading-relaxed text-muted-foreground',
};

// ---------- surfaces ----------

/** Flat, quiet surfaces. Hairline borders. No glass, no blur, no glow. */
export const SURFACE = {
  card: 'bg-surface border border-border',
  cardHover: 'hover:bg-muted/60 transition-colors duration-200',
  inset: 'bg-background border border-border',
  hero: 'bg-surface border border-border',
};

/** Section rule: the editorial hairline that structures the page. */
export const RULE = 'border-t border-border';

// ---------- phases ----------
// Status colors ONLY (Vercel discipline): each phase means something.

export const PHASE_STYLE: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  foundation: { text: 'text-emerald-700', border: 'border-emerald-600/40', bg: 'bg-emerald-500/[0.06]', dot: 'bg-emerald-600' },
  depth: { text: 'text-primary', border: 'border-primary/40', bg: 'bg-primary/[0.05]', dot: 'bg-primary' },
  pressure: { text: 'text-amber-700', border: 'border-amber-500/40', bg: 'bg-amber-500/[0.06]', dot: 'bg-amber-500' },
  rehearsal: { text: 'text-muted-foreground', border: 'border-border', bg: 'bg-muted/50', dot: 'bg-muted-foreground' },
};

// ---------- accent ----------
// one accent, used sparingly: CTAs + "today" + readiness number.

export const CTA =
  'bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity duration-200';

export const CTA_QUIET =
  'border border-border bg-surface text-foreground hover:bg-muted transition-colors duration-200';

// ---------- shell ----------

export const SHELL = 'min-h-[calc(100vh-3.5rem)] bg-background text-foreground relative';

/** Quiet ambient: nothing. Color belongs to meaning; the shell is calm. */
export function Ambient() {
  return null;
}
