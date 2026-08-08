import Link from "next/link";
import fs from "fs";
import path from "path";
import { ArrowRight, Flame } from "lucide-react";
import type { DSAProblemIndex } from "@/lib/contentV2-types";
import { DifficultyPill } from "./DSAPills";

const DSA_ROOT = path.join(process.cwd(), "..", "content", "dsa");

/**
 * Checks on-disk whether the rich problem JSON has been authored.
 * Server-only: calls fs.existsSync directly. Do not import into client code.
 */
export function problemHasAuthoredContent(problem: DSAProblemIndex): boolean {
  try {
    return fs.existsSync(
      path.join(DSA_ROOT, problem.category, `${problem.slug}.json`),
    );
  } catch {
    return false;
  }
}

const COMPANY_DISPLAY: Record<string, string> = {
  amazon: "Amazon",
  google: "Google",
  meta: "Meta",
  microsoft: "Microsoft",
  apple: "Apple",
  netflix: "Netflix",
  uber: "Uber",
  linkedin: "LinkedIn",
  airbnb: "Airbnb",
};

const FREQ_META: Record<string, { label: string; className: string }> = {
  "very-high": { label: "Hot", className: "text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20" },
  high: { label: "Freq", className: "text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-default dark:border-default/20" },
};

/**
 * LeetCode-style problem row.
 *
 * Authored problems → clickable link with hover state.
 * Unwritten problems → static muted row with "Queued" badge.
 *
 * Shows: number · title · company chips · difficulty · frequency · arrow.
 */
export function DSAProblemRow({
  position,
  problem,
  showCategory = false,
}: {
  position: number;
  problem: DSAProblemIndex;
  showCategory?: boolean;
}) {
  const authored = problemHasAuthoredContent(problem);
  const companies = ((problem as DSAProblemIndex & { company_tags?: string[] }).company_tags ?? []).slice(0, 3);
  const freq = (problem as DSAProblemIndex & { frequency?: string }).frequency;
  const freqMeta = freq ? FREQ_META[freq] : undefined;

  const inner = (
    <div className="flex items-center gap-3 w-full min-w-0">
      {/* Number */}
      <span className="text-[11px] font-mono tabular-nums text-slate-500 dark:text-slate-400 w-7 shrink-0 text-right">
        {String(position).padStart(2, "0")}
      </span>

      {/* Title + category */}
      <div className="flex-1 min-w-0">
        <span
          className={`text-[13.5px] font-semibold leading-snug block truncate ${
            authored
              ? "text-foreground group-hover:text-blue-700 dark:text-blue-400"
              : "text-slate-500 dark:text-slate-400"
          }`}
        >
          {problem.title}
        </span>
        {showCategory && (
          <span className="text-[11px] text-slate-500 dark:text-slate-400 capitalize">
            {problem.category.replace(/-/g, " ")}
          </span>
        )}
      </div>

      {/* Company chips — hidden on narrow screens */}
      {companies.length > 0 && (
        <div className="hidden lg:flex items-center gap-1 shrink-0">
          {companies.map((c) => (
            <span
              key={c}
              className="text-[10px] font-medium text-muted-foreground bg-surface border border-border rounded px-1.5 py-0.5"
            >
              {COMPANY_DISPLAY[c] ?? c}
            </span>
          ))}
        </div>
      )}

      {/* Frequency badge */}
      {freqMeta && (
        <span
          className={`hidden sm:inline-flex items-center gap-1 text-[10px] font-bold rounded border px-1.5 py-0.5 shrink-0 ${freqMeta.className}`}
        >
          <Flame className="h-2.5 w-2.5" />
          {freqMeta.label}
        </span>
      )}

      {/* Difficulty */}
      <DifficultyPill difficulty={problem.difficulty} />

      {/* Status */}
      {authored ? (
        <span className="hidden sm:inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-default dark:border-default/20 rounded px-1.5 py-0.5 shrink-0">
          Explained
        </span>
      ) : (
        <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 bg-surface border border-border rounded px-1.5 py-0.5 shrink-0">
          Queued
        </span>
      )}

      {/* Arrow */}
      {authored && (
        <ArrowRight className="h-3.5 w-3.5 text-slate-500 dark:text-slate-400 group-hover:text-blue-500 dark:text-blue-400 shrink-0 transition-colors" />
      )}
    </div>
  );

  const base =
    "group flex items-center px-3.5 py-2.5 rounded-xl border transition-all";

  if (authored) {
    return (
      <Link
        href={`/dsa/problem/${problem.slug}`}
        className={`${base} border-border bg-background hover:border-blue-300 dark:border-blue-500/30 hover:shadow-sm hover:bg-blue-50/40 dark:bg-blue-500/10`}
      >
        {inner}
      </Link>
    );
  }
  return (
    <div className={`${base} border-slate-100 dark:border-slate-800/60 bg-surface/60 opacity-75`}>
      {inner}
    </div>
  );
}

/**
 * List of problem rows — single column (each row is full-width).
 * Matches LeetCode's vertical list style.
 */
export function DSAProblemList({
  problems,
  showCategory = false,
  startIndex = 1,
}: {
  problems: DSAProblemIndex[];
  showCategory?: boolean;
  startIndex?: number;
}) {
  if (problems.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-border bg-surface p-6 text-sm text-muted-foreground text-center">
        No problems indexed here yet.
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-1.5">
      {problems.map((p, i) => (
        <DSAProblemRow
          key={p.slug}
          position={startIndex + i}
          problem={p}
          showCategory={showCategory}
        />
      ))}
    </div>
  );
}
