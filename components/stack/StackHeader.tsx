import React from "react";
import Link from "next/link";
import { Play, ArrowUpRight, BookCheck, Layers, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Tag } from "@/components/ui/tag";

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
    <header className="mb-5 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-[0_12px_40px_rgba(15,23,42,0.07)]">
      <div className={cn(
        "relative px-6 py-7 sm:px-8",
        premiumCourse
          ? "bg-gradient-to-br from-amber-50 via-white to-orange-50/70"
          : "bg-gradient-to-br from-blue-50/90 via-white to-emerald-50/45",
      )}>
        <div className="pointer-events-none absolute -right-10 -top-16 h-52 w-52 rounded-full border-[28px] border-blue-100/60" />
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1 min-w-0">
            <p className={cn(
              "text-[10px] font-extrabold uppercase tracking-[0.24em] mb-2",
              premiumCourse ? "text-amber-700" : "text-blue-700",
            )}>
              Interview Track
            </p>
            <h1 className="type-display text-[2rem] leading-tight tracking-tight text-slate-950 sm:text-[2.35rem]">
              {stack.name}
              {activeSubcatName && (
                <span className="font-bold text-blue-700">
                  {" "}— {activeSubcatName}
                </span>
              )}
            </h1>
            {stack.description && (
              <p className="mt-2 max-w-2xl text-sm leading-relaxed text-slate-600">
                {stack.description}
              </p>
            )}
            <div className="mt-4 flex items-center gap-2 flex-wrap">
              <Tag className="border border-slate-200 bg-white px-2.5 py-1 text-[11px] font-semibold text-slate-600 shadow-sm">
                {mergedSubcatsLength} topics
              </Tag>
              <Tag className="border border-blue-100 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
                {allQuestionsLength} questions
              </Tag>
              <Tag className="border border-orange-100 bg-orange-50 px-2.5 py-1 text-[11px] font-semibold text-orange-700">
                ~{totalTime} min
              </Tag>
              {pendingCount > 0 && (
                <Tag className="border border-slate-200 bg-slate-50 px-2.5 py-1 text-[11px] font-semibold text-slate-500">
                  {pendingCount} pending
                </Tag>
              )}
            </div>
            {firstQuestionSlug && (
              <div className="mt-5 flex items-center gap-3 flex-wrap">
                <Link
                  href={`/${domainSlug}/${stackSlug}/${firstQuestionSlug}`}
                  className={cn(
                    "inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-lg transition-colors duration-200 ease-out",
                    premiumCourse
                      ? "bg-amber-600 text-white hover:bg-amber-700"
                      : "bg-blue-600 text-white hover:bg-blue-700",
                  )}
                >
                  <Play className="h-4 w-4 fill-current" />
                  Start Practicing
                </Link>
                {curriculumNavNextModuleSlug && (
                  <Link
                    href={`/${domainSlug}/${curriculumNavNextModuleSlug}`}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-600 transition-colors hover:border-blue-200 hover:text-blue-700"
                  >
                    Next module
                    <ArrowUpRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            )}
          </div>

          {/* Readiness ring */}
          <div className="relative z-10 hidden h-28 w-28 shrink-0 flex-col items-center justify-center gap-1 rounded-2xl border border-blue-100 bg-white/80 shadow-sm lg:flex">
            <span className="text-3xl font-extrabold leading-none text-blue-700">{completionPct}%</span>
            <span className="text-[9px] font-bold uppercase tracking-wider text-slate-500">coverage</span>
            <div className="mt-1 h-1 w-14 overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-blue-600"
                style={{ width: `${completionPct}%` }}
              />
            </div>
            <span className="text-[9px] text-slate-500">{allQuestionsLength}/{totalContentQ}</span>
          </div>
        </div>
      </div>

      <div className={cn(
        "flex flex-wrap items-center gap-5 border-t border-slate-200 bg-slate-50/80 px-6 py-3 sm:px-8",
        premiumCourse
          ? "bg-amber-50/60"
          : "bg-slate-50/80",
      )}>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <BookCheck className="h-3.5 w-3.5 text-blue-600" />
          {mergedSubcatsLength} topics
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <Layers className="h-3.5 w-3.5 text-slate-400" />
          {allQuestionsLength}/{totalContentQ} loaded
        </div>
        <div className="flex items-center gap-1.5 text-[11px] text-slate-600">
          <Clock className="h-3.5 w-3.5 text-orange-600" />
          {totalTime} min
        </div>
        <div className="ml-auto flex items-center gap-3 text-[11px]">
          <span className="flex items-center gap-1 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-success inline-block" />{easyCt} easy
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-warning inline-block" />{medCt} med
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <span className="w-2 h-2 rounded-full bg-destructive inline-block" />{hardCt} hard
          </span>
        </div>
      </div>
    </header>
  );
}
