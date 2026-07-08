import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Clock,
  Flame,
  Target,
  Zap,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/lib/contentV2-types";

/**
 * JBI-style problem sidebar. One compact rail that carries the whole
 * "where am I, what matters, what's next" panel — replacing the old
 * `ProblemTOC` (which tracked in-page scroll) plus the dense hero
 * fact-strip (which duplicated most of this).
 *
 * Why the shape changed:
 *   The user feedback was that the DSA page felt like "too many small
 *   boxes in parallel". The JBI system-design question pages keep all
 *   navigation + meta in a single rail so the main column can carry a
 *   clean narrative (Zone 1/2/3) without competing chrome. This
 *   component mirrors that split.
 *
 * Contents, top-to-bottom:
 *   1. Back-to-module link
 *   2. Progress bar — "Problem 3 of 8"
 *   3. Quick Info — difficulty, optimal complexity, frequency, read time
 *   4. Companies — tag chips
 *   5. In-this-module — numbered list of sibling problems
 *   6. Prev/Next — chevron links at the bottom
 */
export type ProblemSidebarProps = {
  backHref?: string;
  backLabel?: string;
  currentSlug: string;
  /** Sibling problems in the owning module, in curriculum order. */
  siblings: { slug: string; title: string }[];
  difficulty: Difficulty;
  optimalComplexity?: { time: string; space: string };
  frequencyLabel?: string;
  readingTimeMinutes?: number;
  companies?: string[];
  prev?: { slug: string; title: string } | null;
  next?: { slug: string; title: string } | null;
};

const DIFF_META: Record<Difficulty, { label: string; className: string }> = {
  easy: {
    label: "Easy",
    className: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-default dark:border-default/20",
  },
  medium: {
    label: "Medium",
    className: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-default dark:border-default/20",
  },
  hard: {
    label: "Hard",
    className: "bg-rose-50 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-rose-200 dark:border-rose-500/20",
  },
};

function toDisplayName(slug: string) {
  return slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

export function ProblemSidebar({
  backHref,
  backLabel,
  currentSlug,
  siblings,
  difficulty,
  optimalComplexity,
  frequencyLabel,
  readingTimeMinutes,
  companies,
  prev,
  next,
}: ProblemSidebarProps) {
  const currentIdx = siblings.findIndex((s) => s.slug === currentSlug);
  const total = siblings.length;
  const diff = DIFF_META[difficulty];

  return (
    <nav
      aria-label="Problem navigation"
      className="text-[13px] text-foreground"
    >
      {backHref && (
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground hover:text-blue-700 dark:text-blue-400 transition-colors mb-4"
        >
          <ArrowLeft className="h-3 w-3" />
          {backLabel ?? "Back"}
        </Link>
      )}

      {/* ── Progress ───────────────────────────────────────────── */}
      {total > 0 && currentIdx >= 0 && (
        <div className="mb-5">
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Progress
            </span>
            <span className="text-[12px] font-bold text-blue-700 dark:text-blue-400 tabular-nums">
              {currentIdx + 1}/{total}
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-blue-500 dark:bg-blue-800 rounded-full transition-all"
              style={{ width: `${((currentIdx + 1) / total) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* ── Quick Info ─────────────────────────────────────────── */}
      <div className="space-y-2 mb-5 pb-5 border-b border-border">
        <Row
          icon={<Target className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />}
          label="Difficulty"
          value={
            <span
              className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${diff.className}`}
            >
              {diff.label}
            </span>
          }
        />
        {optimalComplexity && (
          <Row
            icon={<Zap className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" />}
            label="Optimal"
            value={
              <span className="font-mono text-[11.5px] font-bold text-foreground">
                {optimalComplexity.time} · {optimalComplexity.space}
              </span>
            }
          />
        )}
        {frequencyLabel && (
          <Row
            icon={<Flame className="h-3.5 w-3.5 text-amber-500 dark:text-amber-400" />}
            label="Frequency"
            value={
              <span className="text-[11.5px] font-medium text-secondary">
                {frequencyLabel}
              </span>
            }
          />
        )}
        {readingTimeMinutes != null && (
          <Row
            icon={<Clock className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400" />}
            label="Read"
            value={
              <span className="text-[11.5px] font-medium text-secondary">
                {readingTimeMinutes}–{Math.min(readingTimeMinutes + 2, 20)} min
              </span>
            }
          />
        )}
      </div>

      {/* ── Companies ──────────────────────────────────────────── */}
      {companies && companies.length > 0 && (
        <div className="mb-5 pb-5 border-b border-border">
          <div className="flex items-center gap-1.5 mb-2">
            <Building2 className="h-3 w-3 text-slate-500 dark:text-slate-400" />
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400">
              Asked at
            </span>
          </div>
          <div className="flex flex-wrap gap-1">
            {companies.slice(0, 6).map((c) => (
              <span
                key={c}
                className="text-[11px] font-medium text-secondary bg-background border border-border rounded-full px-2 py-0.5"
              >
                {toDisplayName(c)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── In this module ────────────────────────────────────── */}
      {siblings.length > 0 && (
        <div className="mb-5">
          <p className="text-[10px] font-bold uppercase tracking-widest text-slate-500 dark:text-slate-400 mb-2">
            In this module
          </p>
          <ul className="space-y-0.5 -mx-1">
            {siblings.map((s, i) => {
              const active = s.slug === currentSlug;
              return (
                <li key={s.slug}>
                  <Link
                    href={`/dsa/problem/${s.slug}`}
                    className={cn(
                      "block py-1.5 px-2 rounded-md text-[12.5px] leading-snug transition-colors",
                      active
                        ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400 font-semibold"
                        : "text-secondary hover:text-foreground hover:bg-surface/70",
                    )}
                  >
                    <span
                      className={cn(
                        "mr-1.5 text-[10.5px] tabular-nums",
                        active ? "text-blue-600 dark:text-blue-300" : "text-slate-500 dark:text-slate-400",
                      )}
                    >
                      {i + 1}.
                    </span>
                    {s.title}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* ── Prev / Next ─────────────────────────────────────── */}
      {(prev || next) && (
        <div className="pt-4 border-t border-border grid grid-cols-2 gap-2">
          {prev ? (
            <Link
              href={`/dsa/problem/${prev.slug}`}
              className="group flex items-start gap-1 text-[11.5px] text-muted-foreground hover:text-blue-700 dark:text-blue-400"
            >
              <ArrowLeft className="h-3 w-3 mt-0.5 shrink-0" />
              <span>
                <span className="block text-[9.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:text-blue-400">
                  Prev
                </span>
                <span className="block leading-snug line-clamp-2">
                  {prev.title}
                </span>
              </span>
            </Link>
          ) : (
            <span />
          )}
          {next ? (
            <Link
              href={`/dsa/problem/${next.slug}`}
              className="group flex items-start gap-1 text-right text-[11.5px] text-muted-foreground hover:text-blue-700 dark:text-blue-400 justify-end"
            >
              <span>
                <span className="block text-[9.5px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:text-blue-400">
                  Next
                </span>
                <span className="block leading-snug line-clamp-2">
                  {next.title}
                </span>
              </span>
              <ArrowRight className="h-3 w-3 mt-0.5 shrink-0" />
            </Link>
          ) : (
            <span />
          )}
        </div>
      )}
    </nav>
  );
}

function Row({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between gap-2">
      <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
        {icon}
        {label}
      </span>
      {value}
    </div>
  );
}
