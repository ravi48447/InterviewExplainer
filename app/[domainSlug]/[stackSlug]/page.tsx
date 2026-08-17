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
  BookOpen,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { StackHeader } from "@/components/stack/StackHeader";
import { StackSidebar } from "@/components/stack/StackSidebar";
import { ModuleRevisionPanel } from "@/components/ModuleRevisionPanel";
import ContentTreeNav from "@/components/ContentTreeNav";
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
        setExpandedSubcats(new Set(subcats.map(sc => sc.slug)));
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

  // Expand newly discovered subcategories that have questions
  useEffect(() => {
    const withQ = mergedSubcats.filter(sc => sc.questions.length > 0).map(sc => sc.slug);
    setExpandedSubcats(prev => new Set([...prev, ...withQ]));
  }, [mergedSubcats]);

  // Auto-expand the Revision row whenever a module revision is available.
  useEffect(() => {
    if (moduleRevision && moduleRevision.sections.length > 0) {
      setExpandedSubcats(prev => new Set([...prev, REVISION_SUBCAT_SLUG]));
    }
  }, [moduleRevision]);

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
      className={cn("min-h-screen font-sans", premiumCourse ? "bg-[#111111]" : "bg-[#111111]")}
      style={{
        backgroundImage: [
          "linear-gradient(rgba(255,255,255,0.04) 1px, transparent 1px)",
          "linear-gradient(90deg, rgba(255,255,255,0.04) 1px, transparent 1px)",
        ].join(", "),
        backgroundSize: "40px 40px",
      }}
    >
      <div className="mx-auto w-full max-w-[1780px] min-w-0 min-h-screen flex gap-5 px-4 py-5">

        {/* ─── LEFT SIDEBAR ─── */}
        <div className="hidden lg:block shrink-0 self-start sticky top-5 h-[calc(100vh-1.25rem)] overflow-y-auto custom-scrollbar">
          <ContentTreeNav
            domainSlug={domainSlug}
            activeStackSlug={stackSlug}
          />
        </div>

        {/* ─── MAIN COLUMN ─── */}
        <main className="flex-1 min-w-0">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-xs mb-4 text-muted-foreground">
            <Link href="/" className="flex items-center gap-1 hover:text-muted-foreground transition-colors">
              <Home className="h-3 w-3" /> Home
            </Link>
            <ChevronRight className="h-3 w-3 text-foreground" />
            <Link href={`/${domainSlug}`} className="hover:text-muted-foreground transition-colors">
              {domainSlug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}
            </Link>
            <ChevronRight className="h-3 w-3 text-foreground" />
            <span className="font-semibold text-muted-foreground">{stack.name}</span>
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
            <div className="mb-5 flex items-center gap-3">
              {curriculumNav.previousModule ? (
                <Link
                  href={`/${domainSlug}/${curriculumNav.previousModule.moduleSlug}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/8 border border-white/15 text-[13px] font-semibold text-muted-foreground hover:bg-background/15 hover:text-foreground transition-all"
                >
                  <ChevronRight className="h-4 w-4 rotate-180 shrink-0" />
                  {curriculumNav.previousModule.title}
                </Link>
              ) : null}
              <div className="flex-1" />
              {curriculumNav.nextModule ? (
                <Link
                  href={`/${domainSlug}/${curriculumNav.nextModule.moduleSlug}`}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-background/8 border border-white/15 text-[13px] font-semibold text-muted-foreground hover:bg-background/15 hover:text-foreground transition-all"
                >
                  {curriculumNav.nextModule.title}
                  <ChevronRight className="h-4 w-4 shrink-0" />
                </Link>
              ) : null}
            </div>
          )}


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
          <section className="mb-4 rounded-xl border border-white/10 bg-background/95 backdrop-blur-sm shadow-xl">
            <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/60 flex items-center justify-between gap-3 flex-wrap">
              <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                Study filters
              </p>
              <div className="flex items-center gap-2 text-[11px]">
                <span className="rounded-md border border-border bg-surface px-2 py-1 font-bold text-foreground">
                  {displayedSubcats.length} topics
                </span>
                <span className="rounded-md border border-default dark:border-default/20 bg-blue-50 dark:bg-blue-500/10 px-2 py-1 font-bold text-primary dark:text-primary">
                  {visibleQuestionCount} visible
                </span>
              </div>
            </div>
            <div className="px-4 py-3 space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={() => setActiveSubcat(null)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold transition-all border",
                    activeSubcat === null
                      ? "bg-blue-600 dark:bg-blue-800 text-white border-default dark:border-default"
                      : "bg-background text-muted-foreground border-border hover:border-default dark:border-default hover:text-primary dark:text-primary"
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
                        ? "bg-blue-600 dark:bg-blue-800 text-white border-default dark:border-default"
                        : "bg-background text-muted-foreground border-border hover:border-default dark:border-default hover:text-primary dark:text-primary"
                    )}
                  >
                    {sc.name}
                    <span className={cn(
                      "ml-1.5 text-[10px] font-bold",
                      activeSubcat === sc.slug ? "text-primary dark:text-primary" : "text-muted-foreground"
                    )}>
                      {sc.questions.length > 0 ? `${sc.questions.length}/${sc.contentCount}` : sc.contentCount}
                    </span>
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-3 flex-wrap">
                <div className="flex items-center gap-1.5">
                  <Filter className="h-3.5 w-3.5 text-muted-foreground" />
                  {["all", "easy", "medium", "hard"].map(d => (
                    <button
                      key={d}
                      onClick={() => setDifficultyFilter(d)}
                      className={cn(
                        "px-2.5 py-1 rounded-md text-[11px] font-bold transition-all border capitalize",
                        difficultyFilter === d
                          ? d === "all" ? "bg-slate-700 dark:bg-slate-800 text-white border-border"
                            : d === "easy" ? "bg-green-600 dark:bg-green-800 text-white border-green-600 dark:border-green-700"
                            : d === "medium" ? "bg-amber-500 dark:bg-amber-800 text-white border-default dark:border-default"
                            : "bg-red-500 dark:bg-red-800 text-white border-default dark:border-default"
                          : "bg-background text-muted-foreground border-border hover:border-border"
                      )}
                    >
                      {d === "all" ? "All" : d}
                    </button>
                  ))}
                </div>

                <div className="relative flex-1 min-w-[220px]">
                  <Search className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                  <input
                    type="search"
                    value={questionQuery}
                    onChange={(e) => setQuestionQuery(e.target.value)}
                    placeholder="Search questions in this module..."
                    className="w-full rounded-lg border border-border bg-background py-2 pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:border-default dark:border-default focus:outline-none focus:ring-2 focus:ring-ring/60"
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
                  <div className="rounded-2xl overflow-hidden bg-background border border-default dark:border-default/20/80 shadow-[0_4px_24px_rgba(30,64,175,0.25)]">
                    <button
                      onClick={() => toggleSubcat(REVISION_SUBCAT_SLUG)}
                      className="relative w-full flex items-center gap-4 px-5 py-4 transition-colors border-b border-default dark:border-default/60 bg-surface border border-default hover: hover: hover: overflow-hidden"
                    >
                      <span className="absolute right-14 top-1/2 -translate-y-1/2 text-[3.5rem] font-black text-white/[0.06] select-none pointer-events-none leading-none tabular-nums">
                        00
                      </span>
                      <div className="w-1 h-9 rounded-full shrink-0 bg-surface border border-default" />
                      <div className="flex-1 text-left min-w-0 relative z-10">
                        <div className="flex flex-wrap items-center gap-2">
                          <h2 className="text-[14px] font-black leading-tight tracking-tight text-white flex items-center gap-2">
                            <BookOpen className="h-3.5 w-3.5" />
                            Revision
                          </h2>
                          <span className="rounded-md border border-default dark:border-default/40 bg-blue-300 dark:bg-blue-800/15 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-primary dark:text-primary">
                            Read me first
                          </span>
                        </div>
                        <p className="text-[10px] mt-0.5 font-medium text-primary dark:text-primary">
                          {moduleRevision.sections.length} concepts
                          {moduleRevision.estimatedMinutes ? ` · ~${moduleRevision.estimatedMinutes} min` : ""}
                          {" · skim before drilling questions"}
                        </p>
                      </div>
                      <span className="text-[11px] font-black px-2.5 py-1 rounded-lg shrink-0 relative z-10 bg-blue-400 dark:bg-blue-800/20 text-white dark:text-primary border border-default dark:border-default/40">
                        {moduleRevision.sections.length}
                      </span>
                      {isRevExpanded
                        ? <ChevronUp className="h-4 w-4 text-primary dark:text-primary shrink-0 relative z-10" />
                        : <ChevronDown className="h-4 w-4 text-primary dark:text-primary shrink-0 relative z-10" />}
                    </button>
                    {isRevExpanded && (
                      <ModuleRevisionPanel
                        revision={moduleRevision}
                        stackLabel={stack?.name ?? stackSlug}
                      />
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
                    "rounded-2xl overflow-hidden bg-background",
                    hasQuestions
                      ? "border border-border/80 shadow-[0_4px_24px_rgba(0,0,0,0.35)]"
                      : "border border-dashed border-border/50 shadow-lg opacity-60"
                  )}
                >
                  {/* Subcategory header */}
                  <button
                    onClick={() => toggleSubcat(sc.slug)}
                    className={cn(
                      "relative w-full flex items-center gap-4 px-5 py-4 transition-colors border-b overflow-hidden",
                      hasQuestions
                        ? "bg-surface border border-default hover:from-slate-800 hover:via-slate-700 hover:to-slate-800 border-border/60"
                        : "bg-slate-700 dark:bg-slate-800/60 hover:bg-slate-700 dark:bg-slate-800/80 border-slate-600 dark:border-slate-700/40 opacity-70"
                    )}
                  >
                    {/* Decorative large module number */}
                    <span className="absolute right-24 sm:right-32 top-1/2 -translate-y-1/2 text-[3.5rem] font-black text-white/[0.04] select-none pointer-events-none leading-none tabular-nums">
                      {String(scIdx + 1).padStart(2, '0')}
                    </span>

                    {/* Left colored accent bar */}
                    <div className={cn(
                      "w-1 h-9 rounded-full shrink-0",
                      hasQuestions ? "bg-surface border border-default dark:" : "bg-slate-600 dark:bg-slate-800"
                    )} />

                    <div className="flex-1 text-left min-w-0 relative z-10">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className={cn(
                          "text-[14px] font-black leading-tight tracking-tight",
                          hasQuestions ? "text-white" : "text-muted-foreground",
                        )}>
                          {sc.name}
                        </h2>
                      </div>
                      <p className={cn("text-[10px] mt-0.5 font-medium", hasQuestions ? "text-muted-foreground" : "text-muted-foreground")}>
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
                            { d: "easy", color: "bg-green-900 dark:bg-green-800/60 text-green-600 dark:text-green-300 border border-green-800 dark:border-green-700/50" },
                            { d: "medium", color: "bg-amber-900 dark:bg-amber-800/60 text-amber-600 dark:text-amber-300 border border-default dark:border-default/50" },
                            { d: "hard", color: "bg-red-900 dark:bg-red-800/60 text-red-600 dark:text-red-300 border border-default dark:border-default/50" },
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
                      hasQuestions ? "bg-blue-500 dark:bg-blue-800/20 text-white dark:text-primary border border-default dark:border-default/40" : "bg-slate-700 dark:bg-slate-800/50 text-muted-foreground"
                    )}>
                      {sc.contentCount}
                    </span>

                    {isExpanded
                      ? <ChevronUp className="h-4 w-4 text-muted-foreground shrink-0 relative z-10" />
                      : <ChevronDown className="h-4 w-4 text-muted-foreground shrink-0 relative z-10" />}
                  </button>

                  {/* Question list */}
                  {isExpanded && (
                    <div>
                      {filteredQ.length > 0 ? (
                        <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
                          {filteredQ.map((q, idx) => {
                            const rowBg =
                              q.difficulty === "easy"
                                ? "bg-green-50/60 hover:bg-green-50 dark:bg-green-500/5 dark:hover:bg-green-50 dark:bg-green-950/10"
                                : q.difficulty === "medium"
                                ? "bg-amber-50/60 hover:bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-500/5 dark:hover:bg-amber-50 dark:bg-amber-950/10"
                                : q.difficulty === "hard"
                                ? "bg-red-50 dark:bg-red-500/10 hover:bg-red-50/80 dark:bg-red-500/5 dark:hover:bg-red-50 dark:bg-red-950/10"
                                : "bg-background hover:bg-surface dark:hover:bg-slate-800/50";
                            return (
                            <div key={`${idx}-${q.slug}`}>
                              <Link
                                href={`/${domainSlug}/${stackSlug}/${q.slug}`}
                                className={cn("group flex items-center gap-4 px-5 py-4 transition-colors", rowBg)}
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
                                  <h3 className="text-[13.5px] font-semibold text-foreground group-hover:text-primary dark:group-hover:text-primary dark:text-slate-200 dark:group-hover:text-primary transition-colors leading-snug line-clamp-1">
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
                                <div className="shrink-0 rounded-lg border border-border bg-background px-2.5 py-1 text-[10px] font-bold text-muted-foreground group-hover:border-default dark:border-default group-hover:bg-blue-600 dark:bg-blue-800 group-hover:text-white transition-all">
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
                </div>
              );
            })}
          </div>

          {/* Completion Banner */}
          {allQuestions.length > 0 && !hasActiveFilters && (
            <section className="mb-8 p-7 rounded-2xl bg-surface border border-default border border-border flex flex-col sm:flex-row items-center justify-between gap-6 relative overflow-hidden shadow-xl">
              <div className="absolute -right-8 top-1/2 -translate-y-1/2 opacity-[0.08] pointer-events-none">
                <Award className="w-64 h-64 text-foreground" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="h-5 w-5 text-amber-700 dark:text-amber-300" />
                  <span className="text-xs font-bold text-amber-700 dark:text-amber-300 uppercase tracking-wide">
                    Complete the Path
                  </span>
                </div>
                <h2 className="text-xl font-black text-white mb-1">
                  {allQuestions.length} questions across {mergedSubcats.length} topics
                </h2>
                <p className="text-sm text-muted-foreground max-w-md">
                  Total: <strong>{totalContentQ}</strong> questions in curriculum ·{" "}
                  <strong>{allQuestions.length}</strong> available now
                </p>
              </div>
              {firstQuestion && (
                <div className="relative z-10 shrink-0 flex flex-col sm:flex-row gap-2">
                  <Link
                    href={`/${domainSlug}/${stackSlug}/${firstQuestion.slug}`}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-blue-600 dark:bg-blue-800 text-foreground font-black text-sm hover:bg-blue-700 dark:bg-blue-800 transition-all shadow-lg"
                  >
                    <Play className="h-5 w-5 fill-current" />
                    Begin from Start
                  </Link>
                  {curriculumNav.nextModule ? (
                    <Link
                      href={`/${domainSlug}/${curriculumNav.nextModule.moduleSlug}`}
                      className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-background border border-border text-foreground font-black text-sm hover:bg-surface transition-all shadow-sm"
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

        {/* ─── RIGHT SIDEBAR — Stats ─── */}
        <StackSidebar
          mergedSubcatsCount={mergedSubcats.length}
          allQuestionsCount={allQuestions.length}
          totalContentQ={totalContentQ}
          totalTime={totalTime}
          completionPct={completionPct}
          easyCt={easyCt}
          medCt={medCt}
          hardCt={hardCt}
        />
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
