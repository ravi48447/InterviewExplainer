"use client";

import React, { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  ChevronRight, ChevronDown, FolderOpen, Folder,
  Layers, BookOpen, Circle, CheckCircle2, ArrowLeft,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { StackSubcategory, QuestionSummary } from "@/lib/api";

interface HierarchyStack {
  id: number;
  slug: string;
  name: string;
  questionCount: number;
}

interface HierarchyCategory {
  id: number;
  name: string;
  slug: string;
  stacks: HierarchyStack[];
}

interface HierarchyProps {
  domainSlug: string;
  activeStackSlug: string;
  activeSubcatSlug?: string | null;
  activeQuestionSlug?: string | null;
}

export default function StackHierarchyNav({
  domainSlug,
  activeStackSlug,
  activeSubcatSlug,
  activeQuestionSlug,
}: HierarchyProps) {
  const [categories, setCategories]   = useState<HierarchyCategory[]>([]);
  const [subcats, setSubcats]         = useState<StackSubcategory[]>([]);
  const [expandedCats, setExpandedCats]     = useState<Set<string>>(new Set());
  const [expandedSubcats, setExpandedSubcats] = useState<Set<string>>(new Set());

  // Load stack list from JSON content directory
  useEffect(() => {
    fetch(`/api/content/domain-stacks?domainSlug=${domainSlug}`)
      .then(r => r.ok ? r.json() : { categories: [] })
      .then(data => {
        const cats: HierarchyCategory[] = data.categories ?? [];
        setCategories(cats);
        // Auto-expand the category that contains the active stack
        const activeCat = cats.find(c => c.stacks.some(s => s.slug === activeStackSlug));
        if (activeCat) setExpandedCats(new Set([activeCat.slug]));
      })
      .catch(() => {});
  }, [domainSlug, activeStackSlug]);

  // Load subcategories + questions for active stack from JSON content
  useEffect(() => {
    fetch(`/api/content/stack-questions?domainSlug=${domainSlug}&stackSlug=${activeStackSlug}`)
      .then(r => r.ok ? r.json() : [])
      .then((data: StackSubcategory[]) => {
        setSubcats(data);
        // Auto-expand subcats that have questions; always expand the active one
        const toExpand = new Set(data.filter(sc => sc.questionCount > 0).map(sc => sc.slug));
        if (activeSubcatSlug) toExpand.add(activeSubcatSlug);
        setExpandedSubcats(toExpand);
      })
      .catch(() => {});
  }, [domainSlug, activeStackSlug, activeSubcatSlug]);

  const toggleCat    = (slug: string) => setExpandedCats(prev => { const n = new Set(prev); n.has(slug) ? n.delete(slug) : n.add(slug); return n; });
  const toggleSubcat = (slug: string) => setExpandedSubcats(prev => { const n = new Set(prev); n.has(slug) ? n.delete(slug) : n.add(slug); return n; });

  return (
    <div className="flex flex-col gap-3">
      {/* Back to domain */}
      <div className="rounded-xl border border-border bg-background/90 shadow-sm overflow-hidden">
        <Link
          href={`/${domainSlug}`}
          className="flex items-center gap-2 px-4 py-3 text-xs font-bold text-muted-foreground hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-500/10 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to All Stacks
        </Link>
      </div>

      {/* Hierarchy tree */}
      <div className="rounded-xl border border-border bg-background/90 shadow-sm overflow-hidden">
        <div className="px-4 py-2.5 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/40 dark:to-slate-900/20 border-b border-border">
          <div className="flex items-center gap-2">
            <Layers className="h-3.5 w-3.5 text-muted-foreground" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">Study Navigation</span>
          </div>
        </div>

        <div className="overflow-y-auto max-h-[calc(100vh-240px)]">
          {categories.length === 0 && (
            <div className="px-4 py-6 text-[11px] text-muted-foreground text-center">Loading stacks…</div>
          )}

          {categories.map(cat => {
            const isExpanded    = expandedCats.has(cat.slug);
            const hasActiveStack = cat.stacks.some(s => s.slug === activeStackSlug);

            return (
              <div key={cat.slug}>
                {/* Category header */}
                <button
                  onClick={() => toggleCat(cat.slug)}
                  className={cn(
                    "w-full flex items-center justify-between px-3 py-2 text-[11px] font-black uppercase tracking-widest transition-colors",
                    hasActiveStack
                      ? "bg-blue-50 dark:bg-blue-500/10 text-blue-700 dark:text-blue-400"
                      : "text-muted-foreground hover:bg-surface hover:text-foreground"
                  )}
                >
                  <span>{cat.name}</span>
                  {isExpanded ? <ChevronDown className="h-3 w-3 opacity-60" /> : <ChevronRight className="h-3 w-3 opacity-60" />}
                </button>

                {/* Stacks */}
                {isExpanded && cat.stacks.map(stack => {
                  const isActive = stack.slug === activeStackSlug;
                  return (
                    <div key={stack.slug}>
                      <Link
                        href={`/${domainSlug}/${stack.slug}`}
                        className={cn(
                          "flex items-center gap-2 pl-5 pr-3 py-2 text-xs transition-colors border-l-2",
                          isActive
                            ? "border-blue-500 dark:border-blue-700 bg-blue-50 dark:bg-blue-500/10 dark:bg-blue-950/20/70 text-blue-700 dark:text-blue-400 font-bold"
                            : "border-transparent text-muted-foreground hover:bg-surface hover:text-foreground font-medium"
                        )}
                      >
                        <BookOpen className={cn("h-3.5 w-3.5 shrink-0", isActive ? "text-blue-500 dark:text-blue-400" : "text-muted-foreground")} />
                        <span className="flex-1 truncate">{stack.name}</span>
                        <span className="text-[11px] text-muted-foreground font-medium shrink-0">{stack.questionCount}</span>
                      </Link>

                      {/* Subcategories — only shown for active stack */}
                      {isActive && (
                        <div className="border-l-2 border-blue-200 dark:border-blue-500/20 ml-5">
                          {subcats.map(sc => {
                            const isActiveSc = sc.slug === activeSubcatSlug;
                            const isExpSc    = expandedSubcats.has(sc.slug);

                            return (
                              <div key={sc.slug}>
                                {/* Subcategory row */}
                                <button
                                  onClick={() => toggleSubcat(sc.slug)}
                                  className={cn(
                                    "w-full flex items-center gap-2 pl-3 pr-2 py-1.5 text-[11px] transition-colors",
                                    isActiveSc
                                      ? "bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 font-bold"
                                      : "text-muted-foreground hover:bg-surface font-semibold"
                                  )}
                                >
                                  {isExpSc
                                    ? <FolderOpen className="h-3 w-3 shrink-0 text-blue-500 dark:text-blue-400" />
                                    : <Folder className="h-3 w-3 shrink-0 text-blue-400 dark:text-blue-300" />}
                                  <span className="flex-1 text-left truncate">{sc.name}</span>
                                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 shrink-0">
                                    {sc.questionCount}
                                  </span>
                                  {isExpSc
                                    ? <ChevronDown className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />
                                    : <ChevronRight className="h-2.5 w-2.5 shrink-0 text-muted-foreground" />}
                                </button>

                                {/* Questions */}
                                {isExpSc && (
                                  <div className="ml-3 border-l border-border">
                                    {sc.questions.map((q, idx) => {
                                      const isActiveQ = q.slug === activeQuestionSlug;
                                      return (
                                        <Link
                                          key={`${idx}-${q.slug}`}
                                          href={`/${domainSlug}/${activeStackSlug}/${q.slug}`}
                                          className={cn(
                                            "flex items-start gap-2 pl-3 pr-2 py-1.5 text-[11px] transition-colors",
                                            isActiveQ
                                              ? "bg-blue-600 text-white font-bold"
                                              : "text-muted-foreground hover:bg-blue-50 dark:bg-blue-500/10 hover:text-blue-700 dark:text-blue-400"
                                          )}
                                        >
                                          <span className={cn("shrink-0 mt-0.5", isActiveQ ? "text-blue-200 dark:text-blue-300" : "text-muted-foreground")}>
                                            {isActiveQ
                                              ? <CheckCircle2 className="h-3 w-3" />
                                              : <Circle className="h-3 w-3" />}
                                          </span>
                                          <span className="leading-snug line-clamp-2">{q.title}</span>
                                        </Link>
                                      );
                                    })}
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
