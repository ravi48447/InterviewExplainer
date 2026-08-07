"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, ArrowRight, X } from "lucide-react";

export interface ProblemRow {
  slug: string;
  title: string;
  difficulty: "easy" | "medium" | "hard";
  category: string;
  patterns: string[];
  companies: string[];
  moduleSlug: string;
  moduleTitle: string;
  authored: boolean;
}

const DIFF = {
  easy:   { dot: "bg-emerald-500", badge: "bg-emerald-50 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-default/20", label: "Easy" },
  medium: { dot: "bg-amber-500",   badge: "bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-default/20",       label: "Medium" },
  hard:   { dot: "bg-red-500",     badge: "bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-default/20",             label: "Hard" },
};

export function DSAProblemExplorer({
  problems,
  moduleMap,
}: {
  problems: ProblemRow[];
  moduleMap: { slug: string; title: string }[];
}) {
  const [diff, setDiff] = useState<string>("all");
  const [module, setModule] = useState<string>("all");
  const [search, setSearch] = useState<string>("");

  const counts = useMemo(() => ({
    easy:   problems.filter((p) => p.difficulty === "easy").length,
    medium: problems.filter((p) => p.difficulty === "medium").length,
    hard:   problems.filter((p) => p.difficulty === "hard").length,
  }), [problems]);

  const filtered = useMemo(() => {
    return problems.filter((p) => {
      if (diff !== "all" && p.difficulty !== diff) return false;
      if (module !== "all" && p.moduleSlug !== module) return false;
      if (search) {
        const q = search.toLowerCase();
        if (!p.title.toLowerCase().includes(q) && !p.category.toLowerCase().includes(q)) return false;
      }
      return true;
    });
  }, [problems, diff, module, search]);

  const hasFilter = diff !== "all" || module !== "all" || search !== "";

  return (
    <div>
      {/* ── Filter bar ── */}
      <div className="flex flex-wrap items-center gap-2 mb-4">
        {/* Difficulty chips */}
        <div className="flex items-center gap-1.5">
          {(["all", "easy", "medium", "hard"] as const).map((d) => (
            <button
              key={d}
              onClick={() => setDiff(d)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-colors border ${
                diff === d
                  ? d === "all"    ? "bg-primary text-primary-foreground border-primary"
                  : d === "easy"   ? "bg-emerald-600 dark:bg-emerald-800 text-primary-foreground dark:text-foreground border-default dark:border-default"
                  : d === "medium" ? "bg-amber-500 dark:bg-amber-800 text-primary-foreground dark:text-foreground border-default dark:border-default"
                  :                  "bg-red-600 dark:bg-red-800 text-primary-foreground dark:text-foreground border-default dark:border-default"
                  : "bg-background text-secondary border-border hover:border-border hover:bg-surface"
              }`}
            >
              {d === "all"
                ? `All (${problems.length})`
                : `${DIFF[d].label} (${counts[d]})`}
            </button>
          ))}
        </div>

        {/* Module select */}
        <select
          value={module}
          onChange={(e) => setModule(e.target.value)}
          className="ml-1 px-3 py-1.5 rounded-lg border border-border text-xs font-semibold text-secondary bg-background focus:outline-none focus:border-primary hover:border-border transition-colors"
        >
          <option value="all">All Modules</option>
          {moduleMap.map((m) => (
            <option key={m.slug} value={m.slug}>{m.title}</option>
          ))}
        </select>

        {/* Search */}
        <div className="relative ml-auto shrink-0 w-48 lg:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <input
            type="search"
            placeholder="Search…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-border bg-background py-2 pl-10 pr-4 text-sm text-foreground shadow-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
          />
          {search && (
            <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {hasFilter && (
          <button
            onClick={() => { setDiff("all"); setModule("all"); setSearch(""); }}
            className="text-xs text-primary font-semibold hover:text-primary transition-colors"
          >
            Reset
          </button>
        )}
      </div>

      {/* ── Result count ── */}
      <div className="text-xs text-muted-foreground mb-2 font-medium">
        {filtered.length} problem{filtered.length !== 1 ? "s" : ""}
      </div>

      {/* ── Table header ── */}
      <div className="grid grid-cols-[1.75rem_1fr_5.5rem_auto] sm:grid-cols-[1.75rem_1fr_5.5rem_auto_auto] gap-x-4 px-3 py-2 border-b border-border/60 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        <span>#</span>
        <span>Problem</span>
        <span>Difficulty</span>
        <span className="hidden sm:block">Module</span>
        <span />
      </div>

      {/* ── Rows ── */}
      <div className="divide-y divide-border/60">
        {filtered.map((p, i) => {
          const d = DIFF[p.difficulty];
          if (!p.authored) {
            return (
              <div
                key={p.slug}
                className="grid grid-cols-[1.75rem_1fr_5.5rem_auto] sm:grid-cols-[1.75rem_1fr_5.5rem_auto_auto] gap-x-4 items-center px-3 py-2.5 opacity-40 cursor-not-allowed"
              >
                <span className="text-[11px] text-muted-foreground font-mono tabular-nums">{i + 1}</span>
                <span className="text-sm text-muted-foreground truncate">{p.title}</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit ${d.badge}`}>{d.label}</span>
                <span className="text-xs text-muted-foreground hidden sm:block truncate">{p.moduleTitle}</span>
                <span className="text-[10px] font-bold text-muted-foreground border border-border px-1.5 py-0.5 rounded">Soon</span>
              </div>
            );
          }
          return (
            <Link
              key={p.slug}
              href={`/dsa/problem/${p.slug}`}
              className="grid grid-cols-[1.75rem_1fr_5.5rem_auto] sm:grid-cols-[1.75rem_1fr_5.5rem_auto_auto] gap-x-4 items-center px-3 py-2.5 hover:bg-primary/10 group transition-colors"
            >
              <span className="text-[11px] text-muted-foreground font-mono tabular-nums">{i + 1}</span>
              <span className="text-sm font-medium text-foreground group-hover:text-primary transition-colors truncate">{p.title}</span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md border w-fit ${d.badge}`}>{d.label}</span>
              <span className="text-xs text-muted-foreground hidden sm:block truncate">{p.moduleTitle}</span>
              <ArrowRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-primary transition-colors" />
            </Link>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-muted-foreground text-sm">
          No problems match your filters.{" "}
          <button onClick={() => { setDiff("all"); setModule("all"); setSearch(""); }} className="text-primary font-semibold hover:underline">
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
}
