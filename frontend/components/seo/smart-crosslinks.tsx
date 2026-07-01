import Link from "next/link";
import {
  ArrowRight,
  Compass,
  GitBranch,
  Library,
  Sparkles,
} from "lucide-react";
import type { SeoModuleEntry } from "@/lib/seo-slugs";
import type { PillarHubEntry } from "@/lib/seo-pillars";

/**
 * "Continue your prep" block rendered on every SEO module landing.
 *
 * Unifies three cross-link surfaces into one visually coherent card:
 *   1. Top — authored "next-up" modules from MODULE_RELATED (3-4 items).
 *      These are *hand-picked* by interview-round adjacency, not scraped
 *      from the same pillar. Renders largest so it's the primary pull.
 *   2. Mid — parent pillar hub link ("Browse every {pillar} module").
 *   3. Bottom — structured-track CTA ("Open the full roadmap") +
 *      browse-all-categories secondary link.
 *
 * Replaces the three separate sections on the old landing (sibling-modules,
 * related-pillars, footer-CTA), which fragmented the user's path forward
 * into three disconnected blocks.
 */

interface RelatedModuleWithCount extends SeoModuleEntry {
  questionCount: number;
}

export interface SmartCrosslinksProps {
  /** Module this page belongs to — used for copy (e.g. "After Java OOP, drill…"). */
  moduleTitle: string;
  /** 3-4 hand-picked next-up modules, in authored order. */
  relatedModules: RelatedModuleWithCount[];
  /** Parent pillar for "Browse all {pillar} modules" link, or null. */
  pillar: PillarHubEntry | null;
  /** Complete-track CTA config (from seo-pillars COMPLETE_TRACK_CTA). */
  completeTrack: {
    title: string;
    tagline: string;
    href: string;
    ctaLabel: string;
    secondaryHref: string;
    secondaryLabel: string;
  };
}

export function SmartCrosslinks({
  moduleTitle,
  relatedModules,
  pillar,
  completeTrack,
}: SmartCrosslinksProps) {
  if (relatedModules.length === 0 && !pillar) return null;

  const [primary, ...rest] = relatedModules;
  const pillarTitle = pillar?.title.replace(/\s+Interview Prep.*$/, "") ?? "";

  return (
    <section
      aria-labelledby="smart-crosslinks-heading"
      className="mb-8 rounded-2xl border border-border bg-background shadow-sm overflow-hidden"
    >
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800/60 bg-gradient-to-r from-indigo-50 via-blue-50 to-white">
        <div className="flex items-center gap-2 mb-1">
          <Sparkles className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
          <h2
            id="smart-crosslinks-heading"
            className="text-[13px] font-black uppercase tracking-widest text-foreground"
          >
            Continue your prep
          </h2>
        </div>
        <p className="text-[12px] text-muted-foreground leading-snug">
          Interviewers rarely ask {moduleTitle} in isolation. These are the
          modules that most often come up in the same loop.
        </p>
      </div>

      {/* Related modules — primary (large) + rest (compact row) */}
      {primary && (
        <div className="p-5 space-y-4">
          {/* Primary next-up card */}
          <Link
            href={`/${primary.seoSlug}`}
            className="group block rounded-xl border-2 border-border bg-gradient-to-br from-white to-indigo-50/30 dark:from-zinc-900/60 dark:to-zinc-950/60 dark:ring-white/10 dark:border-white/10 p-4 hover:border-indigo-400 dark:border-indigo-700 hover:shadow-md transition-all"
          >
            <div className="flex items-start gap-4">
              <div className="shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
                <GitBranch className="h-5 w-5 text-white" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-black uppercase tracking-widest text-indigo-600 dark:text-indigo-400">
                    Most relevant next step
                  </span>
                  {primary.questionCount > 0 && (
                    <span className="text-[10px] font-bold text-muted-foreground">
                      {primary.questionCount}+ Q&amp;A
                    </span>
                  )}
                </div>
                <div className="text-base font-black text-foreground group-hover:text-indigo-700 dark:text-indigo-400 transition-colors leading-tight">
                  {primary.title} Interview Questions
                </div>
                {primary.intro && (
                  <div className="mt-1 text-[12px] text-muted-foreground leading-snug line-clamp-2">
                    {primary.intro}
                  </div>
                )}
                <div className="mt-2 inline-flex items-center gap-1 text-[12px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:gap-2 transition-all">
                  Open module
                  <ArrowRight className="h-3.5 w-3.5" />
                </div>
              </div>
            </div>
          </Link>

          {/* Secondary picks — 3 compact cards */}
          {rest.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {rest.slice(0, 3).map((m) => (
                <Link
                  key={m.seoSlug}
                  href={`/${m.seoSlug}`}
                  className="group block rounded-lg border border-border bg-background px-3.5 py-3 hover:border-blue-300 dark:border-blue-700 hover:bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/20/40 transition-colors"
                >
                  <div className="flex items-baseline justify-between gap-2 mb-1">
                    <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                      Also useful
                    </span>
                    {m.questionCount > 0 && (
                      <span className="text-[10px] font-bold text-muted-foreground">
                        {m.questionCount}
                      </span>
                    )}
                  </div>
                  <div className="text-[13px] font-black text-foreground group-hover:text-blue-700 dark:text-blue-400 transition-colors leading-snug line-clamp-2">
                    {m.title}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Pillar link + complete track — unified footer tree */}
      <div className="px-5 py-4 border-t border-slate-100 dark:border-slate-800/60 bg-surface/60 space-y-2.5">
        {pillar && (
          <Link
            href={`/${pillar.pillarSlug}`}
            className="group flex items-center gap-3 px-3 py-2.5 rounded-lg bg-background border border-border hover:border-indigo-300 dark:border-indigo-700 hover:shadow-sm transition-all"
          >
            <Library className="h-4 w-4 text-indigo-500 dark:text-indigo-400 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground leading-none mb-0.5">
                Browse the pillar
              </div>
              <div className="text-[13px] font-bold text-foreground group-hover:text-indigo-700 dark:text-indigo-400 leading-snug truncate">
                Every {pillarTitle} module
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-indigo-500 dark:text-indigo-400 group-hover:translate-x-0.5 transition-all shrink-0" />
          </Link>
        )}

        <Link
          href={completeTrack.href}
          className="group flex items-center gap-3 px-3 py-2.5 rounded-lg dark:bg-surface hover:dark:bg-surface transition-colors"
        >
          <Compass className="h-4 w-4 text-indigo-300 dark:text-indigo-300 shrink-0" />
          <div className="flex-1 min-w-0">
            <div className="text-[11px] font-black uppercase tracking-widest text-indigo-300 dark:text-indigo-300 leading-none mb-0.5">
              Full roadmap
            </div>
            <div className="text-[13px] font-bold text-white leading-snug truncate">
              {completeTrack.title}
            </div>
          </div>
          <ArrowRight className="h-4 w-4 text-indigo-300 dark:text-indigo-300 group-hover:translate-x-0.5 transition-all shrink-0" />
        </Link>

        <div className="flex justify-end">
          <Link
            href={completeTrack.secondaryHref}
            className="inline-flex items-center gap-1 text-[12px] font-bold text-muted-foreground hover:text-foreground transition-colors"
          >
            {completeTrack.secondaryLabel}
            <ArrowRight className="h-3 w-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}
