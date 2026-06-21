"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Compass,
  Layers,
  BookOpen,
  ArrowRight,
  Network,
  Boxes,
  Blocks,
  Leaf,
  Link2,
  Database,
  Cloud,
  Cog,
  Shield,
  type LucideIcon,
} from "lucide-react";

/**
 * Compact, expandable "Prep by Topic" section rendered on the homepage.
 *
 * Shows all 9 pillar hubs in a 2-column grid with small cards. First 4 are
 * visible by default; clicking the toggle expands the section to show the
 * remaining 5. All 9 cards are rendered in SSR markup (just CSS-hidden
 * past the 4th in the collapsed state) so Google crawls every link
 * regardless of whether a human expands the section.
 *
 * Stats (question count, module count) are computed server-side in
 * app/page.tsx and passed in via props — this component stays purely
 * presentational so it can live as a small client island.
 */

export interface FeaturedPillarCard {
  pillarSlug: string;
  title: string;
  tagline: string;
  moduleCount: number;
  questionCount: number;
}

/**
 * Tier grouping for the pillar tree. Each tier renders as one column; the
 * home page groups the 9+ pillars into three tiers (Foundation, Architecture,
 * Operations) so a first-time visitor sees the hub landscape as a clear
 * 3-column *tree* — not a flat 2x5 grid that looks like unsorted chaos.
 */
export interface FeaturedPillarTier {
  title: string;
  tagline: string;
  /** Pillars in this tier, in display order. */
  pillars: FeaturedPillarCard[];
}

interface FeaturedPrepSectionProps {
  /** Flat fallback list (legacy) — used only if `tiers` is not provided. */
  pillars?: FeaturedPillarCard[];
  /** Preferred: pre-grouped tier data from the home page. */
  tiers?: FeaturedPillarTier[];
  /** Browse-all index URL. Defaults to /prep. */
  indexHref?: string;
}

const ICON_BY_SLUG: Record<string, LucideIcon> = {
  "system-design": Network,
  "low-level-design": Boxes,
  "architecture-design": Blocks,
  spring: Leaf,
  "microservices-architecture": Link2,
  "data-persistence": Database,
  cloud: Cloud,
  devops: Cog,
  security: Shield,
};

function renderPillarCard(p: FeaturedPillarCard) {
  const Icon = ICON_BY_SLUG[p.pillarSlug] ?? Compass;
  return (
    <Link
      key={p.pillarSlug}
      href={`/${p.pillarSlug}`}
      className="group relative flex items-center gap-3 px-4 py-3 rounded-lg border border-slate-200 bg-white hover:border-indigo-300 hover:shadow-md transition-all duration-200"
    >
      <div className="shrink-0 w-9 h-9 rounded-md bg-gradient-to-br from-indigo-500 to-blue-600 flex items-center justify-center">
        <Icon className="h-4 w-4 text-white" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors leading-tight truncate">
          {p.title}
        </div>
        <div className="mt-0.5 text-xs text-slate-500 leading-snug line-clamp-2">
          {p.tagline}
        </div>
        <div className="mt-1.5 flex items-center gap-3 text-[11px] text-slate-500">
          <span className="inline-flex items-center gap-1">
            <BookOpen className="h-3 w-3" />
            <span className="font-bold text-slate-700">{p.questionCount}</span>
            <span>Q&amp;A</span>
          </span>
          <span className="inline-flex items-center gap-1">
            <Layers className="h-3 w-3" />
            <span className="font-bold text-slate-700">{p.moduleCount}</span>
            <span>modules</span>
          </span>
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-indigo-500 group-hover:translate-x-0.5 transition-all shrink-0" />
    </Link>
  );
}

export function FeaturedPrepSection({
  pillars,
  tiers,
  indexHref = "/prep",
}: FeaturedPrepSectionProps) {
  // Flat/legacy mode kept for backward compatibility — renders a single
  // 2-col grid with a "Show more" toggle if no tiers are provided.
  const flat = pillars ?? [];
  const [expanded, setExpanded] = useState(false);
  const initialVisible = 4;
  const hiddenCount = Math.max(0, flat.length - initialVisible);

  const hasTiers = Array.isArray(tiers) && tiers.length > 0;

  return (
    <section
      aria-labelledby="featured-prep-heading"
      className="py-20 bg-gradient-to-br from-white via-indigo-50/40 to-white"
    >
      <div className="w-full px-6 sm:px-12 lg:px-20">
        <div className="w-full min-w-0">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-5 py-2 bg-indigo-100 border-2 border-indigo-300 rounded-full mb-6">
              <Compass className="h-5 w-5 text-indigo-600" />
              <span className="text-sm font-bold text-indigo-700">
                Standalone topic hubs
              </span>
            </div>
            <h2
              id="featured-prep-heading"
              className="text-4xl sm:text-5xl font-black text-slate-900 mb-4"
            >
              Every Interview Round, One Hub Away
            </h2>
            <p className="text-lg text-slate-600 max-w-3xl mx-auto">
              Every prep category below is a self-contained, standalone
              question set. Pick your interview round, pick your hub, drill
              the modules.
            </p>
          </div>

          {hasTiers ? (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {tiers!.map((tier) => (
                  <div
                    key={tier.title}
                    className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
                  >
                    <div className="mb-4 pb-4 border-b border-slate-100">
                      <h3 className="text-lg font-black text-slate-900 leading-tight">
                        {tier.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500 leading-snug">
                        {tier.tagline}
                      </p>
                    </div>
                    <div className="space-y-2.5">
                      {tier.pillars.map(renderPillarCard)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-10 flex justify-center">
                <Link
                  href={indexHref}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm hover:from-indigo-700 hover:to-blue-700 shadow-sm transition-colors"
                >
                  Browse the full prep index
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </>
          ) : (
            <div className="w-full min-w-0">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {flat.slice(0, expanded ? flat.length : initialVisible).map(
                  renderPillarCard,
                )}
              </div>

              <div className="mt-6 flex flex-col sm:flex-row items-center justify-center gap-3">
                {hiddenCount > 0 && (
                  <button
                    type="button"
                    onClick={() => setExpanded((v) => !v)}
                    aria-expanded={expanded}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-white border-2 border-indigo-200 text-indigo-700 font-bold text-sm hover:bg-indigo-50 hover:border-indigo-300 transition-colors"
                  >
                    {expanded ? (
                      <>
                        Show less
                        <ChevronUp className="h-4 w-4" />
                      </>
                    ) : (
                      <>
                        Show {hiddenCount} more{" "}
                        {hiddenCount === 1 ? "category" : "categories"}
                        <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </button>
                )}
                <Link
                  href={indexHref}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold text-sm hover:from-indigo-700 hover:to-blue-700 shadow-sm transition-colors"
                >
                  Browse the full prep index
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
