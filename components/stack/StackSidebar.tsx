import React from "react";
import { Zap, BarChart2, BookMarked } from "lucide-react";

export function StackSidebar({
  mergedSubcatsCount,
  allQuestionsCount,
  totalContentQ,
  totalTime,
  completionPct,
  easyCt,
  medCt,
  hardCt,
}: {
  mergedSubcatsCount: number;
  allQuestionsCount: number;
  totalContentQ: number;
  totalTime: number;
  completionPct: number;
  easyCt: number;
  medCt: number;
  hardCt: number;
}) {
  return (
    <aside className="hidden xl:flex w-[260px] shrink-0 flex-col gap-4 self-start sticky top-5 px-3 py-5 h-[calc(100vh-1.25rem)] overflow-y-auto custom-scrollbar">
      {/* Quick Stats */}
      <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 dark:bg-surface border-b border-border flex items-center gap-2">
          <Zap className="h-3.5 w-3.5 text-warning dark:text-warning" />
          <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Overview</h3>
        </div>
        <div className="p-3 space-y-2">
          {[
            { label: "Topics", value: mergedSubcatsCount },
            { label: "Available", value: allQuestionsCount },
            { label: "Total Curriculum", value: totalContentQ },
            { label: "Est. Time", value: `${totalTime}m` },
          ].map(({ label, value }) => (
            <div key={label} className="flex justify-between text-xs rounded-lg px-3 py-2 border border-border bg-surface">
              <span className="text-muted-foreground font-medium">{label}</span>
              <span className="font-extrabold text-foreground">{value}</span>
            </div>
          ))}
          <div className="rounded-lg border border-default dark:border-default/20 bg-primary/10 px-3 py-2">
            <p className="text-[10px] font-extrabold uppercase tracking-widest text-primary dark:text-primary">
              Readiness
            </p>
            <p className="mt-0.5 text-sm font-extrabold text-primary dark:text-primary">{completionPct}% complete</p>
          </div>
        </div>
      </div>

      {/* Difficulty Mix */}
      <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-primary border-b border-default dark:border-default flex items-center gap-2">
          <BarChart2 className="h-3.5 w-3.5 text-primary-foreground" />
          <h3 className="text-[11px] font-bold text-primary-foreground uppercase tracking-wide">Difficulty Mix</h3>
        </div>
        <div className="p-3 space-y-2.5">
          {[
            { label: "Easy", count: easyCt, color: "hsl(var(--difficulty-easy))" },
            { label: "Medium", count: medCt, color: "hsl(var(--difficulty-medium))" },
            { label: "Hard", count: hardCt, color: "hsl(var(--difficulty-hard))" },
          ].map(({ label, count, color }) => (
            <div key={label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="font-bold" style={{ color }}>{label}</span>
                <span className="font-extrabold text-foreground">{count}</span>
              </div>
              <div className="w-full h-1.5 bg-surface rounded-full overflow-hidden border border-border">
                <div
                  className="h-full rounded-full"
                  style={{ width: allQuestionsCount ? `${(count / allQuestionsCount) * 100}%` : "0%", backgroundColor: color }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Study tips */}
      <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-warning border-b border-default dark:border-default flex items-center gap-2">
          <BookMarked className="h-3.5 w-3.5 text-warning-foreground" />
          <h3 className="text-[11px] font-bold text-warning-foreground uppercase tracking-wide">Study Tips</h3>
        </div>
        <div className="p-3">
          <div className="space-y-2">
            {[
              "Finish one topic before jumping to another.",
              "Practice answers aloud before checking notes.",
              "Mark hard questions and revisit them tomorrow.",
            ].map((tip, i) => (
              <div key={tip} className="flex items-start gap-2 rounded-lg border border-border bg-surface px-2.5 py-2">
                <span className="mt-0.5 inline-flex h-4 w-4 items-center justify-center rounded-full dark:bg-surface text-[10px] font-bold text-foreground">
                  {i + 1}
                </span>
                <p className="text-[11px] text-foreground leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}
