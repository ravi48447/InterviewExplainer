import React from "react";
import Link from "next/link";
import { Play, ArrowUpRight, BookCheck, Layers, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export function StackHeader({
  premiumCourse,
  stack,
  activeSubcatName,
  mergedSubcatsLength,
  allQuestionsLength,
  totalTime,
  pendingCount,
  firstQuestionSlug,
  curriculumNavNextModuleSlug,
  domainSlug,
  stackSlug,
  completionPct,
  totalContentQ,
  easyCt,
  medCt,
  hardCt,
}: {
  premiumCourse: boolean;
  stack: { name: string; description?: string | null };
  activeSubcatName?: string | null;
  mergedSubcatsLength: number;
  allQuestionsLength: number;
  totalTime: number;
  pendingCount: number;
  firstQuestionSlug?: string | null;
  curriculumNavNextModuleSlug?: string | null;
  domainSlug: string;
  stackSlug: string;
  completionPct: number;
  totalContentQ: number;
  easyCt: number;
  medCt: number;
  hardCt: number;
}) {
  return (
    <header className="mb-5 rounded-2xl overflow-hidden shadow-xl">
      {/* Dark gradient top */}
      <div className={cn(
        "px-7 py-7",
        premiumCourse
          ? "bg-surface border border-default"
          : "bg-surface border border-default",
      )}>
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-[10px] font-black uppercase tracking-[0.24em] mb-2",
              premiumCourse ? "text-amber-600 dark:text-amber-300" : "text-primary dark:text-primary",
            )}>
              Interview Track
            </p>
            <h1 className="text-[1.85rem] font-black text-white tracking-tight leading-tight">
              {stack.name}
              {activeSubcatName && (
                <span className="font-bold text-primary dark:text-primary">
                  {" "}— {activeSubcatName}
                </span>
              )}
            </h1>
            {stack.description && (
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed max-w-2xl">
                {stack.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <span className="rounded-md border border-white/20 bg-background/10 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                {mergedSubcatsLength} topics
              </span>
              <span className="rounded-md border border-default dark:border-default/30 bg-blue-500 dark:bg-blue-800/15 px-2.5 py-1 text-[11px] font-semibold text-white dark:text-primary">
                {allQuestionsLength} questions
              </span>
              <span className="rounded-md border border-default dark:border-default/30 bg-amber-500 dark:bg-amber-800/15 px-2.5 py-1 text-[11px] font-semibold text-amber-950 dark:text-amber-300">
                ~{totalTime} min
              </span>
              {pendingCount > 0 && (
                <span className="rounded-md border border-white/10 bg-background/5 px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  {pendingCount} pending
                </span>
              )}
            </div>
            {firstQuestionSlug && (
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <Link
                  href={`/${domainSlug}/${stackSlug}/${firstQuestionSlug}`}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-all",
                    premiumCourse
                      ? "bg-amber-500 dark:bg-amber-800 text-white hover:bg-amber-400 dark:bg-amber-800"
                      : "bg-blue-500 dark:bg-blue-800 text-white hover:bg-blue-400 dark:bg-blue-800",
                  )}
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start Practicing
                </Link>
                {curriculumNavNextModuleSlug && (
                  <Link
                    href={`/${domainSlug}/${curriculumNavNextModuleSlug}`}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-white/20 text-foreground/70 text-sm font-semibold hover:bg-background/10 transition-colors"
                  >
                    Next module
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Readiness ring */}
          <div className="hidden lg:flex flex-col items-center justify-center w-28 h-28 rounded-2xl border border-white/10 bg-background/5 shrink-0 gap-1">
            <span className="text-3xl font-black text-white leading-none">{completionPct}%</span>
            <span className="text-[9px] font-bold text-muted-foreground uppercase tracking-wider">coverage</span>
            <div className="mt-1 w-14 h-1 rounded-full bg-background/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-surface border border-default"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-[9px] text-muted-foreground">{allQuestionsLength}/{totalContentQ}</span>
          </div>
        </div>
      </div>

      {/* Dark stats strip */}
      <div className={cn(
        "px-7 py-3 border-t flex items-center gap-5 flex-wrap",
        premiumCourse
          ? "bg-zinc-900 border-zinc-800 dark:border-zinc-700"
          : "dark:bg-surface border-border/60",
      )}>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <BookCheck className="h-3.5 w-3.5 text-primary dark:text-primary" />
          {mergedSubcatsLength} topics
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Layers className="h-3.5 w-3.5 text-muted-foreground" />
          {allQuestionsLength}/{totalContentQ} loaded
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
          <Clock className="h-3.5 w-3.5 text-amber-600 dark:text-amber-300" />
          {totalTime} min
        </div>
        <div className="ml-auto flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-green-500 dark:bg-green-800 inline-block" />{easyCt} easy
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-amber-500 dark:bg-amber-800 inline-block" />{medCt} med
          </span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <span className="w-2 h-2 rounded-full bg-red-500 dark:bg-red-800 inline-block" />{hardCt} hard
          </span>
        </div>
      </div>
    </header>
  );
}
