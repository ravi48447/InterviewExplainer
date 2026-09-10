"use client";

import React, { useEffect, useState, useMemo } from "react";
import {
  fetchStack,
  TechStack,
  QuestionSummary,
  StackSubcategory,
  difficultyColor,
  difficultyLabel,
  type ModuleRevision,
} from "@/lib/api";
import Link from "next/link";
import {
  ChevronRight, Play, BookCheck, Clock, Layers,
  Award, Sparkles, Filter, Home, ChevronDown, ChevronUp,
  FolderOpen, Folder, BarChart2, Zap, BookMarked, AlertCircle,
  Compass, Hammer, ArrowUpRight, Search, X, Target, CheckCircle2,
  BookOpen, PanelLeftOpen, PanelLeftClose,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { StackHeader } from "@/components/stack/StackHeader";
import { ModuleRevisionPanel } from "@/components/ModuleRevisionPanel";
import { PILLAR_HUBS } from "@/lib/seo-pillars";
import { isPremiumCourseLms } from "@/lib/course-lms";

interface SubcategoryInfo {
  slug: string;
  name: string;
  questionCount: number; // from content files
}

/** Merged subcategory: content structure + DB questions */
interface MergedSubcat {
  slug: string;
  name: string;
  contentCount: number;
  questions: QuestionSummary[];
}

/**
 * Curriculum-priority sort:
 *   1. Anything else, in the *given* (curriculum) order
 *   2. `scenario-based` topic always last (interviewers ask it last too)
 *
 * The synthetic "Revision" entry is prepended *outside* this function in the
 * page render — it should not pass through here.
 */
function withScenarioLast<T extends { slug: string }>(items: T[]): T[] {
  const main: T[] = [];
  const scenarios: T[] = [];
  for (const it of items) {
    if (it.slug === "scenario-based" || it.slug === "scenario_based") scenarios.push(it);
    else main.push(it);
  }
  return [...main, ...scenarios];
}

function mergeSubcategoriesForStack(
  contentSubcats: SubcategoryInfo[],
  dbSubcats: StackSubcategory[],
): MergedSubcat[] {
  const dbMap = new Map(dbSubcats.map((sc) => [sc.slug, sc]));
  const contentMap = new Map(contentSubcats.map((c) => [c.slug, c]));
  const seen = new Set<string>();
  const ordered: MergedSubcat[] = [];

  const pushSlug = (slug: string) => {
    if (seen.has(slug)) return;
    seen.add(slug);
    const db = dbMap.get(slug);
    const content = contentMap.get(slug);
    ordered.push({
      slug,
      name: db?.name ?? content?.name ?? slug,
      contentCount: content?.questionCount ?? 0,
      questions: db?.questions ?? [],
    });
  };

  for (const sc of dbSubcats) pushSlug(sc.slug);
  for (const c of contentSubcats) {
    if (!seen.has(c.slug)) pushSlug(c.slug);
  }
  return withScenarioLast(ordered);
}

/** Synthetic slug used by the Revision-as-first-topic accordion row. */
const REVISION_SUBCAT_SLUG = "__revision__";

function revisionExcerpt(markdown: string, maxLength = 150): string {
  const plain = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/`([^`]+)`/g, "$1")
    .replace(/!?(?:\[([^\]]+)\])\([^)]*\)/g, "$1")
    .replace(/^#{1,6}\s+/gm, "")
    .replace(/[*_>~-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
  return plain.length > maxLength ? `${plain.slice(0, maxLength).trim()}…` : plain;
}

interface CurriculumModuleRef {
  moduleSlug: string;
  title: string;
  pillarName: string;
  moduleNumber: string;
}

export default function StackPage({
  params,
}: {
  params: Promise<{ domainSlug: string; stackSlug: string }>;
}) {
  const { domainSlug, stackSlug } = React.use(params);

  const [stack, setStack] = useState<TechStack | null>(null);
  const [dbSubcats, setDbSubcats] = useState<StackSubcategory[]>([]);
  const [contentSubcats, setContentSubcats] = useState<SubcategoryInfo[]>([]);
  const [moduleRevision, setModuleRevision] = useState<ModuleRevision | null>(null);
  const [loading, setLoading] = useState(true);

  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);
  const [expandedSubcats, setExpandedSubcats] = useState<Set<string>>(new Set());
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [questionQuery, setQuestionQuery] = useState("");
  const [topicRailExpanded, setTopicRailExpanded] = useState(false);
  const [curriculumNav, setCurriculumNav] = useState<{
    previousModule: CurriculumModuleRef | null;
    nextModule: CurriculumModuleRef | null;
  }>({
    previousModule: null,
    nextModule: null,
  });

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      // Run JSON content API + Spring Boot stack metadata in parallel.
      // JSON is primary for questions (local file, always fast).
      // Spring Boot provides rich stack metadata (name, description) if running.
      const [jsonResult, stackResult] = await Promise.allSettled([
        fetch(`/api/content/stack-questions?domainSlug=${domainSlug}&stackSlug=${stackSlug}`)
          .then(r => (r.ok ? r.json() : Promise.reject('not ok'))),
        fetchStack(stackSlug),
      ]);

      // ── Questions: JSON content only ──
      if (
        jsonResult.status === 'fulfilled' &&
        Array.isArray(jsonResult.value) &&
        jsonResult.value.length > 0
      ) {
        const subcats = jsonResult.value as StackSubcategory[];
        setDbSubcats(subcats);
        setExpandedSubcats(new Set(subcats.slice(0, 1).map(sc => sc.slug)));
      } else {
        console.warn('No subcategory data found for stack:', stackSlug);
      }

      // ── Stack metadata: Spring Boot first, derive from slug as fallback ──
      if (stackResult.status === 'fulfilled') {
        setStack(stackResult.value);
      } else {
        const derivedName = stackSlug
          .split('-')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        setStack({
          id: 0,
          name: derivedName,
          slug: stackSlug,
          description: null,
          iconUrl: null,
          questionCount: 0,
        });
      }

      setLoading(false);
    };
    load();
  }, [stackSlug, domainSlug]);

  useEffect(() => {
    // Explicit module-to-module progression for LMS tracks.
    fetch(
      `/api/content/curriculum-nav?domainSlug=${encodeURIComponent(domainSlug)}&stackSlug=${encodeURIComponent(stackSlug)}`,
      { cache: "no-store" },
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!data) return;
        setCurriculumNav({
          previousModule: data.previousModule ?? null,
          nextModule: data.nextModule ?? null,
        });
      })
      .catch(() => {});
  }, [domainSlug, stackSlug]);

  // Fetch content structure from Next.js API route
  useEffect(() => {
    fetch(`/api/content/stack-structure?domainSlug=${domainSlug}&stackSlug=${stackSlug}`)
      .then(r => r.json())
      .then(d => setContentSubcats(d.subcategories || []))
      .catch(() => {});
  }, [domainSlug, stackSlug]);

  // Module-level revision sheet (shown as first synthetic topic). Loaded
  // lazily and silently — modules without a `_revision.json` simply do not
  // render the Revision row.
  useEffect(() => {
    let alive = true;
    fetch(
      `/api/content/module-revision?domainSlug=${encodeURIComponent(domainSlug)}&stackSlug=${encodeURIComponent(stackSlug)}`,
      { cache: "no-store" },
    )
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (!alive) return;
        setModuleRevision(data?.revision ?? null);
      })
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, [domainSlug, stackSlug]);

  // Merge content structure with DB data — preserve curriculum order from stack-questions (`dbSubcats`), not A–Z slug order.
  const mergedSubcats: MergedSubcat[] = useMemo(
    () => mergeSubcategoriesForStack(contentSubcats, dbSubcats),
    [contentSubcats, dbSubcats],
  );

  const allQuestions = useMemo(
    () => mergedSubcats.flatMap(sc => sc.questions),
    [mergedSubcats]
  );

  const totalContentQ = useMemo(
    () => contentSubcats.reduce((s, c) => s + c.questionCount, 0),
    [contentSubcats]
  );

  const firstQuestion = allQuestions[0] ?? null;
  const totalTime = allQuestions.reduce((s, q) => s + (q.estimatedReadTime || 5), 0);
  const easyCt = allQuestions.filter(q => q.difficulty === "easy").length;
  const medCt = allQuestions.filter(q => q.difficulty === "medium").length;
  const hardCt = allQuestions.filter(q => q.difficulty === "hard").length;

  // A module is "empty" when neither content nor DB surfaces any question.
  // This typically happens for brand-new scaffolded modules in a locked
  // domain (e.g. JFI's React / Angular modules before Q&A is authored).
  // We only flag empty AFTER loading has finished AND after contentSubcats
  // has been fetched — otherwise we'd briefly show the placeholder during
  // the initial render pass.
  const contentStructureLoaded = contentSubcats.length > 0 || mergedSubcats.length > 0;
  const isModuleEmpty =
    !loading &&
    contentStructureLoaded &&
    allQuestions.length === 0 &&
    totalContentQ === 0;

  // Matching pillar hubs for this module — surfaced on the empty-state
  // banner so users land on something useful instead of a dead end.
  const matchingPillarHubs = useMemo(() => {
    return PILLAR_HUBS.filter(p => p.moduleSlugs.includes(stackSlug));
  }, [stackSlug]);

  const premiumCourse = isPremiumCourseLms(domainSlug);

  const displayedSubcats = useMemo(() => {
    const q = questionQuery.trim().toLowerCase();
    const src = activeSubcat
      ? mergedSubcats.filter(sc => sc.slug === activeSubcat)
      : mergedSubcats;

    let next = difficultyFilter === "all"
      ? src
      : src
      .map(sc => ({
        ...sc,
        questions: sc.questions.filter(q => q.difficulty === difficultyFilter),
      }))
      .filter(sc => {
        const hasQuestions = sc.questions.length > 0;
        const structureOnly = !hasQuestions && sc.contentCount > 0;
        return hasQuestions || structureOnly;
      });

    if (q.length > 0) {
      next = next
        .map(sc => {
          const topicMatch =
            sc.name.toLowerCase().includes(q) || sc.slug.toLowerCase().includes(q);
          const questionMatches = topicMatch
            ? sc.questions
            : sc.questions.filter(qq =>
                qq.title.toLowerCase().includes(q) || qq.slug.toLowerCase().includes(q),
              );
          return { ...sc, questions: questionMatches };
        })
        .filter(sc => {
          const topicMatch =
            sc.name.toLowerCase().includes(q) || sc.slug.toLowerCase().includes(q);
          return topicMatch || sc.questions.length > 0;
        });
    }

    return next;
  }, [mergedSubcats, activeSubcat, difficultyFilter, questionQuery]);

  const visibleQuestionCount = useMemo(
    () => displayedSubcats.reduce((sum, sc) => sum + sc.questions.length, 0),
    [displayedSubcats],
  );
  const loadedTopicCount = useMemo(
    () => mergedSubcats.filter(sc => sc.questions.length > 0).length,
    [mergedSubcats],
  );
  const completionPct = totalContentQ > 0
    ? Math.round((allQuestions.length / totalContentQ) * 100)
    : 0;
  const pendingCount = Math.max(totalContentQ - allQuestions.length, 0);
  const hasActiveFilters =
    activeSubcat !== null || difficultyFilter !== "all" || questionQuery.trim().length > 0;
  const activeSubcatName = activeSubcat
    ? mergedSubcats.find(sc => sc.slug === activeSubcat)?.name ?? null
    : null;
  const topicRailSubcats = useMemo(() => {
    if (topicRailExpanded || mergedSubcats.length <= 4) return mergedSubcats;

    const activeIndex = activeSubcat
      ? mergedSubcats.findIndex(sc => sc.slug === activeSubcat)
      : 0;
    const previewStart = Math.max(
      0,
      Math.min(activeIndex - 1, mergedSubcats.length - 4),
    );
    return mergedSubcats.slice(previewStart, previewStart + 4);
  }, [activeSubcat, mergedSubcats, topicRailExpanded]);

  const toggleSubcat = (slug: string) =>
    setExpandedSubcats(prev => {
      const n = new Set(prev);
      n.has(slug) ? n.delete(slug) : n.add(slug);
      return n;
    });

  if (loading)
    return (
      <div className="w-full min-w-0 py-24 px-6 lg:px-12 xl:px-20 space-y-12">
        <Skeleton className="h-4 w-32" />
        <Skeleton className="h-16 w-1/2 rounded-2xl" />
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map(i => (
            <Skeleton key={i} className="h-16 w-full rounded-2xl" />
          ))}
        </div>
      </div>
    );

  if (!stack)
    return (
      <div className="min-h-screen flex items-center justify-center text-muted-foreground">
        Stack not found.
      </div>
    );

  return (
    <div
      className="min-h-screen bg-[#f5f7fb] font-sans text-slate-950"
      style={{
        backgroundImage: [
          "radial-gradient(circle at 10% 0%, rgba(37,99,235,0.08), transparent 28%)",
          "radial-gradient(circle at 92% 18%, rgba(234,88,12,0.06), transparent 24%)",
        ].join(", "),
      }}
    >
      <div className="mx-auto min-h-screen w-full max-w-[1460px] px-4 py-5 sm:px-6 lg:px-8">
        <main className="min-w-0">
          {/* Breadcrumb */}
          <nav className="mb-4 flex items-center gap-1.5 text-xs text-slate-500">
            <Link href="/" className="flex items-center gap-1 transition-colors hover:text-slate-900">
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <Link href={`/${domainSlug}`} className="transition-colors hover:text-slate-900">
              {domainSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Link>
            <ChevronRight className="h-3 w-3 text-slate-300" />
            <span className="font-semibold text-slate-700">{stack.name}</span>
            {activeSubcat && (
              <>
                <ChevronRight className="h-3 w-3 text-foreground" />
                <span className={cn("font-semibold", premiumCourse ? "text-amber-600 dark:text-amber-300" : "text-primary dark:text-primary")}>
                  {mergedSubcats.find(sc => sc.slug === activeSubcat)?.name}
                </span>
              </>
            )}
          </nav>

          {/* Hero */}
          <StackHeader
            premiumCourse={premiumCourse}
            stack={stack}
            activeSubcatName={activeSubcatName}
            mergedSubcatsLength={mergedSubcats.length}
            allQuestionsLength={allQuestions.length}
            totalTime={totalTime}
            pendingCount={pendingCount}
            firstQuestionSlug={firstQuestion?.slug}
            curriculumNavNextModuleSlug={curriculumNav.nextModule?.moduleSlug}
            domainSlug={domainSlug}
            stackSlug={stackSlug}
            completionPct={completionPct}
            totalContentQ={totalContentQ}
            easyCt={easyCt}
            medCt={medCt}
            hardCt={hardCt}
          />

          {(curriculumNav.previousModule || curriculumNav.nextModule) && (
            <div className="mb-5 flex items-center gap-3 rounded-xl border border-slate-200 bg-white/75 p-2 shadow-sm backdrop-blur">
              {curriculumNav.previousModule ? (
                <Link
                  href={`/${domainSlug}/${curriculumNav.previousModule.moduleSlug}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  <ChevronRight className="h-4 w-4 rotate-180 shrink-0" />
                  {curriculumNav.previousModule.title}
                </Link>
              ) : null}
              <div className="flex-1" />
              {curriculumNav.nextModule ? (
                <Link
                  href={`/${domainSlug}/${curriculumNav.nextModule.moduleSlug}`}
                  className="flex items-center gap-2 rounded-lg px-3 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-100 hover:text-slate-950"
                >
                  {curriculumNav.nextModule.title}
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              ) : null}
            </div>
          )}

          <div className={cn(
            "grid items-start gap-5 transition-[grid-template-columns] duration-200",
            topicRailExpanded
              ? "lg:grid-cols-[310px_minmax(0,1fr)]"
              : "lg:grid-cols-[230px_minmax(0,1fr)]",
          )}>
            <aside className="sticky top-4 hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm lg:block">
              <div className="flex items-center gap-3 border-b border-slate-200 bg-slate-50/80 px-4 py-3.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-white">
                  <BookOpen className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] font-black uppercase tracking-[0.18em] text-blue-600">In this module</p>
                  <p className="truncate text-xs font-extrabold text-slate-900">{stack.name}</p>
                </div>
                <button
                  type="button"
                  onClick={() => setTopicRailExpanded(value => !value)}
                  className="rounded-lg border border-slate-200 bg-white p-1.5 text-slate-500 transition-colors hover:border-blue-200 hover:text-blue-600"
                  aria-label={topicRailExpanded ? "Make topic navigation compact" : "Expand topic navigation"}
                >
                  {topicRailExpanded ? <PanelLeftClose className="h-4 w-4" /> : <PanelLeftOpen className="h-4 w-4" />}
                </button>
              </div>

              <div className="p-2.5">
                <button
                  type="button"
                  onClick={() => setActiveSubcat(null)}
                  className={cn(
                    "mb-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                    activeSubcat === null ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                  )}
                >
                  <span className={cn(
                    "flex h-6 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-black",
                    activeSubcat === null ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500",
                  )}>ALL</span>
                  <span className="min-w-0 flex-1 text-xs font-bold">All topics</span>
                  <span className="text-[10px] font-black tabular-nums text-slate-400">{allQuestions.length}</span>
                </button>

                <ol className="space-y-1">
                  {topicRailSubcats.map((sc) => {
                    const index = mergedSubcats.findIndex(item => item.slug === sc.slug);
                    const selected = activeSubcat === sc.slug;
                    return (
                      <li key={sc.slug}>
                        <button
                          type="button"
                          onClick={() => setActiveSubcat(selected ? null : sc.slug)}
                          className={cn(
                            "group flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors",
                            selected ? "bg-blue-50 text-blue-700" : "text-slate-600 hover:bg-slate-50 hover:text-slate-950",
                          )}
                        >
                          <span className={cn(
                            "flex h-6 w-7 shrink-0 items-center justify-center rounded-md text-[10px] font-black tabular-nums",
                            selected ? "bg-blue-600 text-white" : "bg-slate-100 text-slate-500 group-hover:bg-white",
                          )}>
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <span className={cn("min-w-0 flex-1 text-xs font-bold", topicRailExpanded ? "" : "truncate")}>
                            {sc.name}
                          </span>
                          <span className="text-[10px] font-black tabular-nums text-slate-400">{sc.questions.length}</span>
                        </button>
                      </li>
                    );
                  })}
                </ol>

                {mergedSubcats.length > 4 && (
                  <button
                    type="button"
                    onClick={() => setTopicRailExpanded(value => !value)}
                    className="group relative mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-blue-200 bg-blue-50/50 px-3 py-2.5 text-[11px] font-extrabold text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
                    aria-expanded={topicRailExpanded}
                  >
                    <span className="absolute -top-3 left-5 right-5 h-3 bg-gradient-to-t from-white to-transparent" aria-hidden="true" />
                    {topicRailExpanded
                      ? "Show compact preview"
                      : `Show all ${mergedSubcats.length} topics`}
                    {topicRailExpanded
                      ? <ChevronUp className="h-3.5 w-3.5" />
                      : <ChevronDown className="h-3.5 w-3.5 transition-transform group-hover:translate-y-0.5" />}
                  </button>
                )}
              </div>

              <div className="border-t border-slate-200 bg-slate-50/70 px-4 py-3">
                <div className="flex items-center justify-between text-[10px] font-bold text-slate-500">
                  <span>Module coverage</span>
                  <span className="text-blue-700">{completionPct}%</span>
                </div>
                <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full rounded-full bg-blue-600" style={{ width: `${completionPct}%` }} />
                </div>
              </div>
            </aside>

            <div className="min-w-0">

          {isModuleEmpty && (
            <section
              aria-labelledby="coming-soon-heading"
              className="mb-5 rounded-xl border border-default dark:border-default/20 bg-gradient-to-br  via-white to-orange-50/60 dark:via-background dark:to-orange-950/20 shadow-sm overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-default dark:border-default/20 flex items-start gap-4 flex-wrap">
                <div className="shrink-0 w-11 h-11 rounded-lg bg-amber-500 dark:bg-amber-800 flex items-center justify-center">
                  <Hammer className="h-5 w-5 text-foreground" />
                </div>
                <div className="flex-1 min-w-[240px]">
                  <div className="text-[10px] font-black uppercase tracking-widest text-amber-700 dark:text-amber-400 mb-1">
                    Content in progress
                  </div>
                  <h2
                    id="coming-soon-heading"
                    className="text-lg font-black text-foreground mb-1 leading-snug"
                  >
                    {stack.name} questions are being authored
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                    This module is scaffolded but doesn't have question
                    content yet. We ship curated, interview-ready answers
                    one pillar at a time — check back soon, or explore a
                    related area below.
                  </p>
                </div>
              </div>

              <div className="px-6 py-4 flex items-center gap-3 flex-wrap">
                <Link
                  href={`/${domainSlug}`}
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg dark:bg-surface text-foreground font-bold text-sm hover:dark:bg-surface transition-colors"
                >
                  <Layers className="h-4 w-4" />
                  Back to roadmap
                </Link>
                <Link
                  href="/prep"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border text-foreground font-bold text-sm hover:bg-surface transition-colors"
                >
                  <Compass className="h-4 w-4" />
                  All prep categories
                </Link>
              </div>

              {matchingPillarHubs.length > 0 && (
                <div className="px-6 py-4 border-t border-default dark:border-default/20 bg-background/60">
                  <div className="text-[11px] font-black uppercase tracking-widest text-muted-foreground mb-2">
                    Related prep you can start now
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {matchingPillarHubs.map(p => (
                      <Link
                        key={p.pillarSlug}
                        href={`/${p.pillarSlug}`}
                        className="group flex items-start gap-2.5 rounded-lg border border-border bg-background px-3 py-2.5 hover:border-default dark:border-default/30 hover:shadow-sm transition-all"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="text-[13px] font-black text-foreground group-hover:text-amber-700 dark:text-amber-400 leading-snug">
                            {p.title.replace(/\s+Interview Prep$/, "")}
                          </div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground leading-snug line-clamp-1">
                            {p.tagline}
                          </div>
                        </div>
                        <ArrowUpRight className="h-3.5 w-3.5 text-muted-foreground group-hover:text-amber-500 dark:text-amber-400 shrink-0 mt-0.5" />
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Study toolbar */}
          <section className="mb-4 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-4 py-3">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-blue-600">Find your next question</p>
                <p className="mt-0.5 text-xs text-slate-500">Search the module or narrow it by interview difficulty.</p>
              </div>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="rounded-md border border-slate-200 bg-slate-50 px-2 py-1 font-bold text-slate-700">
                  {displayedSubcats.length} topics
                </span>
                <span className="rounded-md border border-blue-100 bg-blue-50 px-2 py-1 font-bold text-blue-700">
                  {visibleQuestionCount} visible
                </span>
              </div>
            </div>
            <div className="space-y-3 px-4 py-3">
              <div className="flex flex-wrap items-center gap-2 lg:hidden">
                <button
                  onClick={() => setActiveSubcat(null)}
                  className={cn(
                    "rounded-lg border px-3 py-1.5 text-xs font-bold transition-all",
                    activeSubcat === null
                      ? "border-blue-600 bg-blue-600 text-white"
                      : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                  )}
                >
                  All Topics
                </button>
                {mergedSubcats.map(sc => (
                  <button
                    key={sc.slug}
                    onClick={() => setActiveSubcat(sc.slug === activeSubcat ? null : sc.slug)}
                    className={cn(
                      "px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border",
                      activeSubcat === sc.slug
                        ? "border-blue-600 bg-blue-600 text-white"
                        : "border-slate-200 bg-white text-slate-600 hover:border-blue-200 hover:text-blue-700"
                    )}
                  >
                    {sc.name}
                    <span className={cn(
                      "ml-1.5 text-[10px] font-bold",
                      activeSubcat === sc.slug ? "text-blue-100" : "text-slate-400"
                    )}>
                      {sc.questions.length > 0 ? `${sc.questions.length}/${sc.contentCount}` : sc.contentCount}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-slate-400" />
                  {["all", "easy", "medium", "hard"].map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficultyFilter(d)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-bold transition-all border capitalize",
                        difficultyFilter === d
                          ? d === "all" ? "border-slate-800 bg-slate-800 text-white"
                            : d === "easy" ? "border-emerald-600 bg-emerald-600 text-white"
                            : d === "medium" ? "border-amber-500 bg-amber-500 text-white"
                            : "border-rose-500 bg-rose-500 text-white"
                          : "border-slate-200 bg-white text-slate-600 hover:border-slate-300"
                      )}
                    >
                      {d === "all" ? "All" : d}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 min-w-[220px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-slate-400" />
                  <input
                    type="search"
                    value={questionQuery}
                    onChange={(e) => setQuestionQuery(e.target.value)}
                    placeholder="Search questions in this module..."
                    className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-9 text-sm text-slate-900 placeholder:text-slate-400 focus:border-blue-300 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-100"
                  />
                  {questionQuery ? (
                    <button
                      type="button"
                      onClick={() => setQuestionQuery("")}
                      className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-muted-foreground hover:bg-surface hover:text-muted-foreground"
                      aria-label="Clear search"
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  ) : null}
                </div>
              </div>
            </div>
          </section>

          <section className="mb-4 grid gap-2 sm:grid-cols-3" aria-label="Recommended study flow">
            {[
              ["01", "Finish one topic", "Build one complete mental model before switching."],
              ["02", "Answer aloud", "Practise the explanation before opening detailed notes."],
              ["03", "Revisit hard questions", "Return tomorrow and test recall without prompts."],
            ].map(([number, title, detail]) => (
              <div key={number} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-3 py-3 shadow-sm">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-orange-50 text-[10px] font-black text-orange-700">{number}</span>
                <div>
                  <p className="text-xs font-extrabold text-slate-900">{title}</p>
                  <p className="mt-0.5 text-[11px] leading-relaxed text-slate-500">{detail}</p>
                </div>
              </div>
            ))}
          </section>

          {/* Subcategory groups */}
          <div className="space-y-4 pb-10">
            {displayedSubcats.length === 0 && !moduleRevision && (
              <div className="rounded-xl border border-dashed border-white/15 bg-background/5 px-6 py-10 text-center">
                <p className="text-sm font-bold text-muted-foreground">
                  No topics match your current filters.
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Try clearing search or switching difficulty/topic filters.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setActiveSubcat(null);
                    setDifficultyFilter("all");
                    setQuestionQuery("");
                  }}
                  className="mt-4 inline-flex items-center gap-1.5 rounded-lg border border-white/15 bg-background/8 px-3 py-1.5 text-xs font-bold text-muted-foreground hover:bg-background/15 hover:text-foreground transition-all"
                >
                  <X className="h-3.5 w-3.5" />
                  Clear all filters
                </button>
              </div>
            )}

            {/*
              Revision row: synthetic first "topic" backed by the module's
              `_revision.json`. Rendered above the regular topics so learners
              skim concepts before drilling. Hidden when the search query
              filters topics out — except when it explicitly matches "revision".
            */}
            {moduleRevision && moduleRevision.sections.length > 0 && (
              (() => {
                const q = questionQuery.trim().toLowerCase();
                const matchesQuery = q.length === 0 || "revision".includes(q) || moduleRevision.title.toLowerCase().includes(q);
                if (!matchesQuery) return null;
                const isRevExpanded = expandedSubcats.has(REVISION_SUBCAT_SLUG);
                return (
                  <div className="overflow-hidden rounded-2xl border border-blue-200 bg-white shadow-sm">
                    <button
                      onClick={() => toggleSubcat(REVISION_SUBCAT_SLUG)}
                      className="relative flex w-full items-center gap-4 overflow-hidden bg-blue-50/70 px-5 py-4 text-left transition-colors hover:bg-blue-50"
                    >
                      <span className="pointer-events-none absolute right-14 top-1/2 -translate-y-1/2 select-none text-[3.5rem] font-black leading-none text-blue-950/[0.04] tabular-nums">
                        00
                      </span>
                      <div className="h-9 w-1 shrink-0 rounded-full bg-blue-600" />
                      <div className="flex-1 text-left min-w-0 relative z-10">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="flex items-center gap-2 text-[14px] font-black leading-tight tracking-tight text-slate-950">
                            <BookOpen className="h-3.5 w-3.5" />
                            Revision
                          </h2>
                          <span className="rounded-md border border-blue-200 bg-white px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-blue-700">
                            Read me first
                          </span>
                        </div>
                        <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                          {moduleRevision.sections.length} concepts
                          {moduleRevision.estimatedMinutes ? ` · ~${moduleRevision.estimatedMinutes} min` : ""}
                          {" · skim before drilling questions"}
                        </p>
                      </div>
                      <span className="relative z-10 shrink-0 rounded-lg border border-blue-200 bg-white px-2.5 py-1 text-[11px] font-black text-blue-700">
                        {moduleRevision.sections.length}
                      </span>
                      {isRevExpanded
                        ? <ChevronUp className="relative z-10 h-4 w-4 shrink-0 text-blue-600" />
                        : <ChevronDown className="relative z-10 h-4 w-4 shrink-0 text-blue-600" />}
                    </button>
                    {isRevExpanded && (
                      <ModuleRevisionPanel
                        revision={moduleRevision}
                        stackLabel={stack?.name ?? stackSlug}
                      />
                    )}
                    {!isRevExpanded && moduleRevision.sections[0] && (
                      <div className="border-t border-blue-100 bg-white px-4 pb-3 pt-3">
                        <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50/70 px-3.5 py-3">
                          <span className="flex h-7 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-[10px] font-black text-blue-700">01</span>
                          <div className="min-w-0 flex-1">
                            <div className="flex flex-wrap items-center gap-2">
                              <p className="text-xs font-extrabold text-slate-900">
                                {moduleRevision.sections[0].title}
                              </p>
                              <span className="rounded bg-white px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-slate-400">
                                Concept preview
                              </span>
                            </div>
                            <p className="mt-1 line-clamp-2 text-[11px] leading-relaxed text-slate-500">
                              {revisionExcerpt(moduleRevision.sections[0].body)}
                            </p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => toggleSubcat(REVISION_SUBCAT_SLUG)}
                          className="mx-auto -mt-1 flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-[10px] font-extrabold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
                        >
                          Explore all {moduleRevision.sections.length} concepts
                          <ChevronDown className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })()
            )}

            {displayedSubcats.map((sc, scIdx) => {
              const isExpanded = expandedSubcats.has(sc.slug);
              const hasQuestions = sc.questions.length > 0;
              const filteredQ = difficultyFilter === "all"
                ? sc.questions
                : sc.questions.filter(q => q.difficulty === difficultyFilter);

              return (
                <div
                  key={sc.slug}
                  className={cn(
                    "overflow-hidden rounded-2xl bg-white",
                    hasQuestions
                      ? "border border-slate-200 shadow-sm"
                      : "border border-dashed border-slate-300 opacity-70"
                  )}
                >
                  {/* Subcategory header */}
                  <button
                    onClick={() => toggleSubcat(sc.slug)}
                    className={cn(
                      "relative flex w-full items-center gap-4 overflow-hidden px-5 py-4 text-left transition-colors",
                      hasQuestions
                        ? isExpanded ? "border-b border-slate-200 bg-slate-50/80 hover:bg-slate-50" : "bg-white hover:bg-slate-50/80"
                        : "bg-slate-50 hover:bg-slate-100"
                    )}
                  >
                    {/* Decorative large module number */}
                    <span className="pointer-events-none absolute right-24 top-1/2 -translate-y-1/2 select-none text-[3.5rem] font-black leading-none text-slate-950/[0.035] tabular-nums sm:right-32">
                      {String(scIdx + 1).padStart(2, '0')}
                    </span>

                    {/* Left colored accent bar */}
                    <div className={cn(
                      "w-1 h-9 rounded-full shrink-0",
                      hasQuestions ? scIdx % 3 === 0 ? "bg-blue-600" : scIdx % 3 === 1 ? "bg-emerald-600" : "bg-orange-500" : "bg-slate-300"
                    )} />

                    <div className="flex-1 text-left min-w-0 relative z-10">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className={cn(
                          "text-[14px] font-black leading-tight tracking-tight",
                          hasQuestions ? "text-slate-950" : "text-slate-500",
                        )}>
                          {sc.name}
                        </h2>
                      </div>
                      <p className="mt-0.5 text-[10px] font-medium text-slate-500">
                        {hasQuestions
                          ? `${sc.questions.length} questions ready${sc.contentCount > sc.questions.length ? ` · ${sc.contentCount - sc.questions.length} coming soon` : " · fully loaded"}`
                          : `${sc.contentCount} questions in progress`}
                      </p>
                    </div>

                    {/* Difficulty mini-badges */}
                    <div className="hidden sm:flex items-center gap-1 mr-1 relative z-10">
                      {sc.questions.length > 0 && (
                        <>
                          {[
                            { d: "easy", color: "border border-emerald-200 bg-emerald-50 text-emerald-700" },
                            { d: "medium", color: "border border-amber-200 bg-amber-50 text-amber-700" },
                            { d: "hard", color: "border border-rose-200 bg-rose-50 text-rose-700" },
                          ].map(({ d, color }) => {
                            const c = sc.questions.filter(q => q.difficulty === d).length;
                            return c > 0 ? (
                              <span key={d} className={cn("px-1.5 py-0.5 rounded-md text-[10px] font-bold", color)}>
                                {c}{d === "easy" ? "E" : d === "medium" ? "M" : "H"}
                              </span>
                            ) : null;
                          })}
                        </>
                      )}
                    </div>

                    <span className={cn(
                      "text-[11px] font-black px-2.5 py-1 rounded-lg shrink-0 relative z-10",
                      hasQuestions ? "border border-blue-100 bg-blue-50 text-blue-700" : "bg-slate-100 text-slate-500"
                    )}>
                      {sc.contentCount}
                    </span>

                    {isExpanded
                      ? <ChevronUp className="relative z-10 h-4 w-4 shrink-0 text-slate-500" />
                      : <ChevronDown className="relative z-10 h-4 w-4 shrink-0 text-slate-500" />}
                  </button>

                  {/* Question list */}
                  {isExpanded && (
                    <div>
                      {filteredQ.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {filteredQ.map((q, idx) => {
                            const rowBg =
                              q.difficulty === "easy"
                                ? "bg-emerald-50/25 hover:bg-emerald-50/60"
                                : q.difficulty === "medium"
                                ? "bg-amber-50/25 hover:bg-amber-50/60"
                                : q.difficulty === "hard"
                                ? "bg-rose-50/25 hover:bg-rose-50/60"
                                : "bg-white hover:bg-slate-50";
                            return (
                            <div key={`${idx}-${q.slug}`}>
                              <Link
                                href={`/${domainSlug}/${stackSlug}/${q.slug}`}
                                className={cn("group flex items-center gap-4 px-5 py-3.5 transition-colors", rowBg)}
                              >
                                {/* Difficulty accent bar */}
                                <div
                                  className="w-[3px] h-10 rounded-full shrink-0"
                                  style={{ backgroundColor: difficultyColor(q.difficulty) }}
                                />
                                <span className="w-6 text-[11px] font-mono text-muted-foreground shrink-0 text-right">
                                  {String(idx + 1).padStart(2, "0")}
                                </span>
                                <div className="flex-1 min-w-0">
                                  <h3 className="line-clamp-2 text-[13.5px] font-semibold leading-snug text-slate-800 transition-colors group-hover:text-blue-700">
                                    {q.title}
                                  </h3>
                                  <div className="mt-0.5 flex items-center gap-2">
                                    <span
                                      className="text-[10px] font-bold uppercase tracking-wider"
                                      style={{ color: difficultyColor(q.difficulty) }}
                                    >
                                      {difficultyLabel(q.difficulty)}
                                    </span>
                                    <span className="text-muted-foreground text-[10px]">·</span>
                                    <span className="text-[11px] text-muted-foreground flex items-center gap-0.5">
                                      <Clock className="h-2.5 w-2.5" />
                                      {q.estimatedReadTime ?? 5} min
                                    </span>
                                  </div>
                                </div>
                                <div className="shrink-0 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-[10px] font-bold text-slate-500 transition-all group-hover:border-blue-600 group-hover:bg-blue-600 group-hover:text-white">
                                  Open →
                                </div>
                              </Link>
                            </div>
                            );
                          })}
                        </div>
                      ) : sc.questions.length === 0 ? (
                        <div className="px-5 py-6 text-center">
                          <div className="inline-flex items-center gap-2 text-muted-foreground text-xs bg-surface px-4 py-2 rounded-lg border border-dashed border-border bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/20/50">
                            <AlertCircle className="h-3.5 w-3.5" />
                            <span>
                              {sc.contentCount} questions ready to import
                            </span>
                          </div>
                        </div>
                      ) : (
                        <div className="px-5 py-4 text-center text-xs text-muted-foreground">
                          No questions match this difficulty filter.
                        </div>
                      )}
                    </div>
                  )}

                  {!isExpanded && filteredQ.length > 0 && (
                    <div className="border-t border-slate-100 bg-white px-4 pb-3 pt-3">
                      <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50/65 px-3.5 py-3">
                        <span
                          className="h-8 w-1 shrink-0 rounded-full"
                          style={{ backgroundColor: difficultyColor(filteredQ[0].difficulty) }}
                        />
                        <span className="flex h-7 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-[10px] font-black text-slate-500 shadow-sm">
                          01
                        </span>
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2">
                            <span className="rounded bg-white px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-slate-400">
                              Question preview
                            </span>
                            <span
                              className="text-[9px] font-black uppercase tracking-wider"
                              style={{ color: difficultyColor(filteredQ[0].difficulty) }}
                            >
                              {difficultyLabel(filteredQ[0].difficulty)}
                            </span>
                          </div>
                          <p className="mt-1 line-clamp-1 text-xs font-bold text-slate-800">
                            {filteredQ[0].title}
                          </p>
                        </div>
                        <span className="hidden items-center gap-1 text-[10px] font-semibold text-slate-400 sm:flex">
                          <Clock className="h-3 w-3" />
                          {filteredQ[0].estimatedReadTime ?? 5} min
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleSubcat(sc.slug)}
                        className="mx-auto -mt-1 flex items-center gap-1.5 rounded-full border border-blue-200 bg-white px-4 py-1.5 text-[10px] font-extrabold text-blue-700 shadow-sm transition-colors hover:bg-blue-50"
                      >
                        Explore all {filteredQ.length} questions
                        <ChevronDown className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

            </div>
          </div>

          {/* Completion Banner */}
          {allQuestions.length > 0 && !hasActiveFilters && (
            <section className="relative mb-8 flex flex-col items-center justify-between gap-6 overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 to-slate-800 p-7 shadow-lg sm:flex-row">
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none">
                <Award className="w-64 h-64 text-foreground" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-amber-300" />
                  <span className="text-xs font-bold uppercase tracking-wide text-amber-300">
                    Complete the Path
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mb-1">
                  {allQuestions.length} questions across {mergedSubcats.length} topics
                </h2>
                <p className="max-w-md text-sm text-slate-300">
                  Total: <strong>{totalContentQ}</strong> questions in curriculum ·{" "}
                  <strong>{allQuestions.length}</strong> available now
                </p>
              </div>
              {firstQuestion && (
                <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-2">
                  <Link
                    href={`/${domainSlug}/${stackSlug}/${firstQuestion.slug}`}
                    className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-3 text-sm font-black text-white shadow-lg transition-all hover:bg-blue-500"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Begin from Start
                  </Link>
                  {curriculumNav.nextModule ? (
                    <Link
                      href={`/${domainSlug}/${curriculumNav.nextModule.moduleSlug}`}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-black text-white shadow-sm transition-all hover:bg-white/15"
                    >
                      Skip to next module
                      <ArrowUpRight className="h-4 w-4" />
                    </Link>
                  ) : null}
                </div>
              )}
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

function StatItem({ icon, label, value }: { icon: React.ReactNode; label: string; value: string | number }) {
  return (
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 rounded-lg bg-surface flex items-center justify-center shrink-0">
        {icon}
      </div>
      <div>
        <div className="text-[10px] text-muted-foreground font-medium">{label}</div>
        <div className="text-base font-bold text-foreground leading-tight">{value}</div>
      </div>
    </div>
  );
}
