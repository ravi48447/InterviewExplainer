/**
 * offer-ready/design.tsx — the Offer Ready design system.
 *
 * Editorial premium: warm ivory + amber on deep charcoal, serif display
 * type, hairline rules, flat surfaces. No gradients-as-decoration, no glows,
 * no neon. Feels made by a person with taste, not generated.
 */

// ---------- type ----------

/** Editorial display: warm serif for headlines + numbers — the human signal. */
export const TYPE = {
  display: 'font-[family-name:var(--font-fraunces)] font-medium tracking-tight leading-[1.05]',
  displayLg: 'font-[family-name:var(--font-fraunces)] font-medium tracking-tight leading-[1.02] text-4xl sm:text-5xl lg:text-6xl',
  h1: 'font-[family-name:var(--font-fraunces)] font-medium tracking-tight text-2xl sm:text-3xl',
  h2: 'font-[family-name:var(--font-fraunces)] font-medium tracking-tight text-lg',
  num: 'font-[family-name:var(--font-fraunces)] font-medium tabular-nums',
  eyebrow: 'text-[11px] font-medium uppercase tracking-[0.18em] text-stone-500',
  lead: 'text-stone-400 leading-relaxed',
};

// ---------- color ----------
// palette: warm charcoal (not blue-slate), ivory text, amber accent, muted phase tones

export const INK = {
  bg: '#121110',        // warm charcoal
  surface: 'rgba(255,252,245,0.025)',
  hairline: 'rgba(255,252,245,0.09)',
  text: '#f5f1e8',      // warm ivory
  dim: '#a8a29e',
  faint: '#78716c',
  accent: '#d97706',    // warm amber — used sparingly
};

// ---------- surfaces ----------

/** Flat, quiet surfaces. Hairline borders. No glass, no blur, no glow. */
export const SURFACE = {
  card: 'bg-[#161513] border border-[#26241f]',
  cardHover: 'hover:border-[#3a362e] transition-colors duration-200',
  inset: 'bg-[#100f0d] border border-[#1f1d18]',
  hero: 'bg-[#141311] border border-[#26241f]',
};

/** Section rule: the editorial hairline that structures the page. */
export const RULE = 'border-t border-[#26241f]';

// ---------- phases ----------
// muted, natural tones — olive / slate-blue / clay / plum-brown. No neon.

export const PHASE_STYLE: Record<string, { text: string; border: string; bg: string; dot: string }> = {
  foundation: { text: 'text-[#7d9a6b]', border: 'border-[#3d4a34]', bg: 'bg-[#161a13]', dot: 'bg-[#7d9a6b]' },
  depth: { text: 'text-[#7a93ad]', border: 'border-[#33404d]', bg: 'bg-[#131820]', dot: 'bg-[#7a93ad]' },
  pressure: { text: 'text-[#c08a5a]', border: 'border-[#4d3a28]', bg: 'bg-[#1a1510]', dot: 'bg-[#c08a5a]' },
  rehearsal: { text: 'text-[#a98ba3]', border: 'border-[#463643]', bg: 'bg-[#181318]', dot: 'bg-[#a98ba3]' },
};

// ---------- accent ----------
// one warm accent, used sparingly: CTAs + "today" + readiness number.

export const CTA =
  'bg-[#e8a33d] text-[#1a1408] font-semibold hover:bg-[#f0b355] transition-colors duration-200';

export const CTA_QUIET = 'border border-[#3a362e] text-stone-300 hover:border-[#55503f] hover:text-stone-100 transition-colors duration-200';

// ---------- shell ----------

export const SHELL = 'min-h-screen bg-[#121110] text-[#f5f1e8] relative';

/** Quiet ambient: a single warm light from the top. No colored blobs. */
export function Ambient() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0">
      <div className="absolute inset-x-0 top-0 h-64 bg-[radial-gradient(ellipse_60%_100%_at_50%_0%,rgba(232,163,61,0.05),transparent)]" />
    </div>
  );
}
