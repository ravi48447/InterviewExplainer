"use client";

import React, { useEffect, useState } from "react";
import {
  Domain,
  DomainCategory,
  TechStack,
  QuestionSummary,
  difficultyColor,
  difficultyLabel,
} from "@/lib/api";
import { EXPERIENCE_LEVELS, levelKeyFromLegacy, type ExperienceLevelKey } from "@/lib/levels";
import { parseDomainSlug } from "@/lib/domain-display";
import { useAuth } from "@/context/auth-context";
import Link from "next/link";
import { ArrowLeft, ChevronRight, Layers, BookOpen, ChevronDown, Clock, Target, Zap, CheckCircle2, TrendingUp, BookMarked, ArrowUpRight, Filter, SlidersHorizontal, GraduationCap, Award, Sparkles } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { isPremiumCourseLms } from "@/lib/course-lms";
import { CourseLmsExperience } from "@/components/course/CourseLmsExperience";

/** Derive level key from any domain slug variant (legacy or new) */
function extractLevelKey(slug: string): ExperienceLevelKey {
  // Smart parse first (handles multi-word slugs like data-analyst-sql-analytics-beginner)
  const parsed = parseDomainSlug(slug);
  if (parsed) return parsed.levelKey;

  // Fallback for legacy numeric slugs
  const parts = slug.split('-');
  const suffix = parts.slice(2).join('-');
  return levelKeyFromLegacy(suffix);
}

export default function DomainPage({ params }: { params: Promise<{ domainSlug: string }> }) {
  const { domainSlug } = React.use(params);
  if (isPremiumCourseLms(domainSlug)) {
    return <CourseLmsExperience domainSlug={domainSlug} />;
  }
  return <DomainClassicPage domainSlug={domainSlug} />;
}

function DomainClassicPage({ domainSlug }: { domainSlug: string }) {
  const { user } = useAuth();
  const [domain, setDomain] = useState<Domain | null>(null);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"default" | "questions">("default");

  // Derive level from slug immediately — no async needed
  const levelKey   = extractLevelKey(domainSlug);
  const levelMeta  = EXPERIENCE_LEVELS[levelKey];

  useEffect(() => {
    const load = async () => {
      // JSON content is the single source of truth for domain stacks
      const jsonResult = await fetch(`/api/content/domain-stacks?domainSlug=${domainSlug}`)
        .then(r => r.ok ? r.json() : null)
        .catch(() => null);

      if (jsonResult?.categories?.length > 0) {
        setCategories(jsonResult.categories as DomainCategory[]);
      }

      // Derive domain metadata from slug using smart parser
      const domainParsed = parseDomainSlug(domainSlug);
      const lang  = domainParsed?.language ?? domainSlug.split('-')[0].charAt(0).toUpperCase() + domainSlug.split('-')[0].slice(1);
      const track = domainParsed?.track ?? (() => {
        const parts = domainSlug.split('-');
        return parts.length > 2
          ? parts.slice(1, -1).map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
          : parts[1]?.charAt(0).toUpperCase() + (parts[1]?.slice(1) ?? '');
      })();

      // Compute total questions from already-loaded categories for dynamic description
      const totalQ = jsonResult?.categories?.reduce(
        (sum: number, c: { stacks: { questionCount: number }[] }) =>
          sum + c.stacks.reduce((s: number, st: { questionCount: number }) => s + st.questionCount, 0), 0
      ) ?? 0;
      const totalS = jsonResult?.categories?.reduce(
        (sum: number, c: { stacks: unknown[] }) => sum + c.stacks.length, 0
      ) ?? 0;

      const displayName = track ? `${lang} ${track}` : lang;
      setDomain({
        id: 0,
        name: displayName,
        slug: domainSlug,
        description: totalQ > 0
          ? `${levelMeta.label} (${levelMeta.range}) interview prep — ${totalS} tech stacks, ${totalQ} curated questions covering everything ${displayName} interviewers ask.`
          : `${levelMeta.label} (${levelMeta.range}) interview preparation for ${displayName} developers.`,
        language: lang,
        languageSlug: domainParsed?.langSlug ?? domainSlug.split('-')[0],
        track: track,
        trackSlug: domainParsed?.trackSlug ?? (domainSlug.split('-')[1] ?? ''),
        experienceLabel: levelMeta.range,
      });

      setLoading(false);
    };
    load();
  }, [domainSlug, user]);

  if (loading) return (
    <div className="w-full max-w-[1600px] mx-auto py-20 px-6 lg:px-12 xl:px-20 space-y-8">
      <Skeleton className="h-6 w-40" />
      <Skeleton className="h-20 w-2/3 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        {[1, 2, 3, 4, 5, 6].map(i => <Skeleton key={i} className="h-32 rounded-2xl" />)}
      </div>
    </div>
  );

  if (!domain) return (
    <div className="min-h-screen flex items-center justify-center text-muted-foreground">
      Domain not found.
    </div>
  );

  const totalStacks = categories.reduce((acc, c) => acc + c.stacks.length, 0);
  const totalQs = categories.reduce((acc, c) => acc + c.stacks.reduce((s, st) => s + st.questionCount, 0), 0);

  const filteredCategories = selectedCategory === "all"
    ? categories
    : categories.filter(c => c.id.toString() === selectedCategory);

  const sortedCategories = filteredCategories.map(cat => ({
    ...cat,
    stacks: sortBy === "questions"
      ? [...cat.stacks].sort((a, b) => b.questionCount - a.questionCount)
      : cat.stacks
  }));

  const benefits = [
    "Structured interview preparation",
    "Practice real technical questions",
    "Understand what interviewers look for",
    "Build confidence with guided answers",
    "Track your progress across stacks",
  ];

  const tips = [
    { icon: "🎯", text: "Expand any stack, skim questions, then open ones you don't know." },
    { icon: "🧠", text: "Read the Speakable Answer section first to get a quick mental model." },
    { icon: "⚡", text: "Focus on medium difficulty questions — they appear most in interviews." },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/20 font-sans text-foreground selection:bg-blue-200">
      <div className="w-full max-w-[1600px] mx-auto min-h-screen flex gap-6 px-6 py-6">

        {/* ─── LEFT SIDEBAR ─── */}
        <aside className="hidden lg:flex w-[280px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">
          {/* Navigation */}
          <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/40 dark:to-slate-900/20 border-b border-border">
              <Link href="/domains"
                className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-muted-foreground hover:text-[#2e64e5] transition-colors">
                <ArrowLeft className="h-3 w-3" />
                All Paths
              </Link>
            </div>
            <div className="p-4">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Study Path</h3>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                {domain.name} preparation guide
              </p>
            </div>
          </div>

          {/* Filter by Category */}
          <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-blue-100 to-blue-50 border-b border-blue-200 dark:border-blue-500/20">
              <div className="flex items-center gap-2">
                <Filter className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Filter Topics</h3>
              </div>
            </div>
            <div className="p-3">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-background border border-blue-200 dark:border-blue-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-foreground font-medium"
              >
                <option value="all">All Modules ({categories.length})</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id.toString()}>
                    {cat.name} ({cat.stacks.length})
                  </option>
                ))}
              </select>

              <div className="mt-3 pt-3 border-t border-blue-200 dark:border-blue-500/20">
                <label className="flex items-center gap-2 text-xs font-medium text-foreground">
                  <SlidersHorizontal className="h-3 w-3 text-blue-600 dark:text-blue-400" />
                  Sort By:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as "default" | "questions")}
                  className="w-full mt-2 px-3 py-2 text-sm bg-background border border-blue-200 dark:border-blue-500/20 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-foreground font-medium"
                >
                  <option value="default">Default Order</option>
                  <option value="questions">Most Questions First</option>
                </select>
              </div>
            </div>
          </div>

          {/* Progress Tracker */}
          <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Award className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Your Progress</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-muted-foreground">Topics Completed</span>
                <span className="font-bold text-foreground">0/{totalStacks}</span>
              </div>
              <div className="w-full bg-emerald-100 dark:bg-emerald-950/20 rounded-full h-2 overflow-hidden">
                <div className="bg-gradient-to-r from-emerald-500 to-teal-500 h-full rounded-full" style={{ width: '0%' }} />
              </div>
            </div>
          </div>

          {/* Study Tips */}
          <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-gradient-to-br from-amber-50 to-yellow-50 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="h-4 w-4 text-amber-600 dark:text-amber-400" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Tip</h3>
            </div>
            <p className="text-xs text-foreground leading-relaxed">
              Focus on understanding concepts deeply rather than memorizing answers. Practice explaining them out loud.
            </p>
          </div>
        </aside>

        {/* ─── MAIN COLUMN ─── */}
        <main className="flex-1 min-w-0">
          {/* Domain Hero Header */}
          <header className="mb-6 rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-lg overflow-hidden">
            {/* Top Section with Gradient */}
            <div className="relative px-6 py-5 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20">
              <div className="flex flex-wrap gap-2 mb-3">
                {domain.language && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20 shadow-sm">
                    {domain.language}
                  </span>
                )}
                {domain.track && (
                  <span className="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg bg-purple-100 dark:bg-purple-950/20 text-purple-700 dark:text-purple-400 border border-purple-200 dark:border-purple-500/20 shadow-sm">
                    {domain.track}
                  </span>
                )}
                <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg border shadow-sm ${levelMeta.colorClass}`}>
                  {levelMeta.label} · {levelMeta.range}
                </span>
              </div>

              <h1 className="text-3xl font-black tracking-tight text-foreground mb-3">
                {domain.name}
              </h1>

              {domain.description ? (
                <p className="text-sm text-foreground leading-relaxed max-w-3xl">
                  {domain.description}
                </p>
              ) : (
                <p className="text-sm text-foreground leading-relaxed max-w-3xl">
                  Master the core concepts and advanced topics required to excel in {domain.name} interviews.
                </p>
              )}
            </div>

            {/* Stats Bar */}
            <div className="px-6 py-4 bg-gradient-to-r from-slate-50 to-white dark:from-slate-900/40 dark:to-background border-t border-border">
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950/20 flex items-center justify-center">
                    <Layers className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Topics</div>
                    <div className="text-lg font-bold text-foreground">{totalStacks}</div>
                  </div>
                </div>

                <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />

                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950/20 flex items-center justify-center">
                    <BookOpen className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Total Questions</div>
                    <div className="text-lg font-bold text-foreground">{totalQs}</div>
                  </div>
                </div>

                <div className="h-10 w-px bg-slate-200 dark:bg-slate-800" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ backgroundColor: levelMeta.color + '20' }}>
                    <TrendingUp className="h-5 w-5" style={{ color: levelMeta.color }} />
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground font-medium">Level</div>
                    <div className="text-sm font-bold text-foreground">{levelMeta.label} <span className="text-muted-foreground font-normal">({levelMeta.range})</span></div>
                  </div>
                </div>
              </div>
            </div>
          </header>

          {/* Modules (collapsible) */}
          <div className="space-y-3 pb-10">
            {sortedCategories.map((category, catIdx) => (
              <ModuleAccordion key={category.id} category={category} domainSlug={domainSlug} index={catIdx} />
            ))}
          </div>

          {sortedCategories.length === 0 && (
            <div className="text-center py-20 text-muted-foreground bg-background/90 backdrop-blur-sm rounded-xl border border-border shadow-sm">
              <p className="text-sm">No stacks found for this filter.</p>
            </div>
          )}
        </main>

        {/* ─── RIGHT SIDEBAR ─── */}
        <aside className="hidden xl:flex w-[300px] shrink-0 flex-col gap-4 self-start sticky top-6 h-[calc(100vh-1.5rem)] overflow-y-auto custom-scrollbar">

          {/* Learning Stats */}
          <div className="rounded-xl border border-purple-200 dark:border-purple-500/20 bg-gradient-to-br from-purple-50 to-pink-50 dark:from-purple-950/20 dark:to-pink-950/20 shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/40 dark:to-pink-900/40 border-b border-purple-200 dark:border-purple-500/20">
              <div className="flex items-center gap-2">
                <Zap className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">At a Glance</h3>
              </div>
            </div>
            <div className="p-4">
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="bg-background rounded-lg p-3 border border-purple-200 dark:border-purple-500/20 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1">Stacks</div>
                  <div className="text-2xl font-black text-foreground leading-none">{totalStacks}</div>
                </div>
                <div className="bg-background rounded-lg p-3 border border-purple-200 dark:border-purple-500/20 shadow-sm">
                  <div className="text-[10px] font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400 mb-1">Questions</div>
                  <div className="text-2xl font-black text-foreground leading-none">{totalQs}</div>
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-purple-200 dark:border-purple-500/20">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-medium">Level</span>
                  <span className="font-bold" style={{ color: levelMeta.color }}>
                    {levelMeta.label} ({levelMeta.range})
                  </span>
                </div>
                {domain?.language && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Language</span>
                    <span className="font-bold text-foreground">{domain.language}</span>
                  </div>
                )}
                {domain?.track && (
                  <div className="flex justify-between text-xs">
                    <span className="text-muted-foreground font-medium">Track</span>
                    <span className="font-bold text-foreground">{domain.track}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* What You'll Learn */}
          <div className="rounded-xl border border-teal-200 dark:border-teal-500/20 bg-gradient-to-br from-teal-50 to-cyan-50 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <Target className="h-4 w-4 text-teal-600 dark:text-teal-400" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">What You'll Learn</h3>
            </div>
            <div className="space-y-2">
              {benefits.map((b, i) => (
                <div key={i} className="flex items-start gap-2 text-xs text-foreground">
                  <CheckCircle2 className="h-3.5 w-3.5 text-teal-600 dark:text-teal-400 mt-0.5 shrink-0" />
                  <span>{b}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Study Strategy */}
          <div className="rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-gradient-to-br from-indigo-50 to-blue-50 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookMarked className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Study Strategy</h3>
            </div>
            <div className="space-y-3">
              {tips.map((tip, i) => (
                <div key={i} className="flex items-start gap-2 bg-background/60 rounded-lg p-2 border border-indigo-100 dark:border-indigo-500/20">
                  <span className="text-sm leading-none mt-0.5">{tip.icon}</span>
                  <p className="text-xs text-foreground leading-relaxed">{tip.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="rounded-xl border border-border bg-background/90 backdrop-blur-sm shadow-sm overflow-hidden">
            <div className="px-4 py-3 bg-gradient-to-r from-slate-100 to-slate-50 dark:from-slate-900/40 dark:to-slate-900/20 border-b border-border">
              <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Actions</h3>
            </div>
            <div className="p-3 space-y-2">
              <Link href="/domains" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-blue-200 dark:border-blue-500/20">
                <span>Browse All Paths</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
              <Link href="/dashboard" className="flex items-center justify-between px-3 py-2 text-xs font-semibold text-foreground hover:text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:bg-blue-500/10 rounded-lg transition-all border border-transparent hover:border-blue-200 dark:border-blue-500/20">
                <span>My Dashboard</span>
                <ArrowUpRight className="h-3 w-3" />
              </Link>
            </div>
          </div>

        </aside>

      </div>
    </div>
  );
}

const MODULE_COLORS = [
  'from-blue-500 to-indigo-600',
  'from-emerald-500 to-teal-600',
  'from-purple-500 to-violet-600',
  'from-amber-500 to-orange-600',
  'from-rose-500 to-pink-600',
  'from-cyan-500 to-sky-600',
  'from-lime-500 to-green-600',
  'from-fuchsia-500 to-purple-600',
  'from-red-500 to-rose-600',
  'from-indigo-500 to-blue-600',
  'from-teal-500 to-emerald-600',
];

function ModuleAccordion({ category, domainSlug, index }: { category: DomainCategory; domainSlug: string; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const totalQs = category.stacks.reduce((s, st) => s + st.questionCount, 0);
  const colorGrad = MODULE_COLORS[index % MODULE_COLORS.length];

  return (
    <div className={cn(
      "border rounded-xl transition-all duration-300 overflow-hidden",
      isOpen
        ? "border-border shadow-lg bg-background"
        : "border-border shadow-sm hover:shadow-md hover:border-border bg-background"
    )}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-4 p-4 sm:px-5 text-left hover:bg-surface/50 transition-colors focus:outline-none group"
      >
        <div className={cn(
          "shrink-0 w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md transition-transform duration-200",
          colorGrad,
          isOpen && "scale-110"
        )}>
          <span className="text-white text-sm font-black">{index + 1}</span>
        </div>

        <div className="flex-1 min-w-0">
          <h2 className="text-[16px] font-black text-foreground tracking-tight group-hover:text-blue-700 dark:text-blue-400 transition-colors leading-tight">
            {category.name}
          </h2>
          <p className="text-xs text-muted-foreground mt-0.5">
            {category.stacks.length} {category.stacks.length === 1 ? 'topic' : 'topics'} · {totalQs} questions
          </p>
        </div>

        <div className={cn(
          "w-8 h-8 rounded-full border flex items-center justify-center transition-all shrink-0",
          isOpen
            ? "border-blue-400 dark:border-blue-700 bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400"
            : "border-border bg-background text-muted-foreground group-hover:border-blue-300 dark:border-blue-700 group-hover:text-blue-500 dark:text-blue-400"
        )}>
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", isOpen && "rotate-180")} />
        </div>
      </button>

      {isOpen && (
        <div className="border-t border-slate-100 dark:border-slate-800/60 bg-surface/30 px-3 sm:px-4 py-3 space-y-2">
          {category.stacks.map((stack, idx) => (
            <StackAccordion key={stack.id} domainSlug={domainSlug} stack={stack} index={idx} />
          ))}
        </div>
      )}
    </div>
  );
}

function StackAccordion({ domainSlug, stack, index }: { domainSlug: string; stack: TechStack; index: number }) {
  const [isOpen, setIsOpen] = useState(false);
  const [questions, setQuestions] = useState<QuestionSummary[]>([]);
  const [loadingQs, setLoadingQs] = useState(false);

  useEffect(() => {
    if (isOpen && questions.length === 0) {
      setLoadingQs(true);
      fetch(`/api/content/stack-questions?domainSlug=${domainSlug}&stackSlug=${stack.slug}`)
        .then(r => r.ok ? r.json() : [])
        .then((subcats: Array<{ questions: QuestionSummary[] }>) => {
          const flat = subcats.flatMap(sc => sc.questions);
          setQuestions(flat);
        })
        .catch(console.error)
        .finally(() => setLoadingQs(false));
    }
  }, [isOpen, stack.slug, domainSlug, questions.length]);

  const easyCt  = questions.filter(q => q.difficulty === 'easy').length;
  const medCt   = questions.filter(q => q.difficulty === 'medium').length;
  const hardCt  = questions.filter(q => q.difficulty === 'hard').length;

  return (
    <div
      className={`border rounded-[12px] transition-all duration-300 overflow-hidden ${
        isOpen ? "border-[#2e64e5]/30 shadow-md ring-1 ring-[#2e64e5]/5 bg-background" : "border-border shadow-sm hover:border-border hover:shadow-md bg-[#f8f9fa]"
      }`}
    >
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 text-left hover:bg-surface/50 transition-colors focus:outline-none group"
        >
          <div className="flex-1 pr-4 flex gap-3 items-start sm:items-center mb-3 sm:mb-0">
            <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-colors ${
              isOpen ? "bg-[#2e64e5]/10 text-[#2e64e5]" : "bg-background border border-border text-muted-foreground group-hover:bg-[#2e64e5]/5 group-hover:text-[#2e64e5]"
            }`}>
              <Layers className="h-3.5 w-3.5" />
            </div>
            <div className="min-w-0">
              <h3 className="text-[15px] font-bold text-foreground tracking-tight group-hover:text-[#2e64e5] transition-colors leading-tight mb-0.5">
                {stack.name}
              </h3>
              {stack.description && (
                <p className="text-[12px] text-muted-foreground leading-snug line-clamp-2 max-w-xl">
                  {stack.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 shrink-0 pl-11 sm:pl-0">
            {isOpen && questions.length > 0 && (
              <div className="hidden sm:flex items-center gap-1 mr-2">
                {easyCt > 0 && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-100 dark:bg-green-950/20 text-green-700 dark:text-green-400">{easyCt}</span>}
                {medCt > 0 && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-amber-100 dark:bg-amber-950/20 text-amber-700 dark:text-amber-400">{medCt}</span>}
                {hardCt > 0 && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400">{hardCt}</span>}
              </div>
            )}
            <div className="flex flex-col sm:items-end gap-0.5 hidden sm:flex">
              <span className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Questions</span>
              <span className="text-[12px] font-semibold text-muted-foreground">{stack.questionCount}</span>
            </div>
          </div>
        </button>

        <div className="flex items-center gap-2 p-4 pt-0 sm:pt-4 sm:pl-0 sm:border-l-0 border-slate-100 dark:border-slate-800/60 bg-inherit shrink-0">
          <Link
            href={`/${domainSlug}/${stack.slug}`}
            className="flex items-center justify-center h-8 px-3 rounded-md bg-background border border-border text-[#2e64e5] text-[11px] font-bold uppercase tracking-wider hover:border-[#2e64e5] hover:bg-[#2e64e5]/5 transition-colors shadow-sm focus:outline-none focus:ring-2 focus:ring-[#2e64e5]/30 group/btn"
          >
            Start <ChevronRight className="h-3.5 w-3.5 ml-1 group-hover/btn:translate-x-0.5 transition-transform" />
          </Link>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all focus:outline-none focus:ring-2 focus:ring-[#2e64e5]/30 ${
              isOpen ? "border-[#2e64e5] bg-[#2e64e5] text-white" : "border-border bg-background text-muted-foreground hover:border-[#2e64e5]/30 hover:text-[#2e64e5]"
            }`}
          >
            <ChevronDown className={`h-4 w-4 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="border-t border-slate-100 dark:border-slate-800/60 bg-background">
          {loadingQs ? (
             <div className="p-6 flex items-center justify-center gap-2 text-muted-foreground text-[13px] font-medium animate-pulse">
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800 animation-delay-100"></div>
               <div className="w-1.5 h-1.5 rounded-full bg-slate-300 dark:bg-slate-800 animation-delay-200"></div>
             </div>
          ) : questions.length > 0 ? (
             <div className="relative py-3 px-3 sm:px-4">
               <div className="absolute left-[34px] top-6 bottom-6 w-px bg-surface hidden sm:block"></div>

               <div className="flex flex-col gap-1.5 relative z-10">
                 {questions.map((q, idx) => (
                    <Link
                      key={`${idx}-${q.slug}`}
                      href={`/${domainSlug}/${stack.slug}/${q.slug}`}
                      className="group/link flex flex-col sm:flex-row sm:items-center justify-between p-2.5 sm:pr-4 rounded-[8px] hover:bg-[#f8f9fa] transition-all duration-200"
                    >
                       <div className="flex items-start sm:items-center gap-3 mb-2 sm:mb-0 max-w-full overflow-hidden">
                          <div className="shrink-0 w-5 h-5 rounded-full bg-background border border-border flex items-center justify-center text-[9px] font-bold text-muted-foreground group-hover/link:border-[#2e64e5] group-hover/link:text-[#2e64e5] shadow-sm transition-all sm:ml-2">
                             {idx + 1}
                          </div>
                          <h4 className="text-[13.5px] font-medium text-foreground group-hover/link:text-foreground transition-colors leading-tight truncate">
                            {q.title}
                          </h4>
                       </div>

                       <div className="flex items-center gap-3 pl-8 sm:pl-0 shrink-0 opacity-80 group-hover/link:opacity-100 transition-opacity">
                          <span className="text-[9px] font-bold uppercase tracking-widest px-2 py-0.5 rounded text-white shadow-sm"
                             style={{ backgroundColor: difficultyColor(q.difficulty) }}
                          >
                             {difficultyLabel(q.difficulty)}
                          </span>
                          <span className="text-[11px] font-medium text-muted-foreground flex items-center gap-1 min-w-[45px]">
                             <Clock className="w-3 h-3 text-muted-foreground" />
                             {q.estimatedReadTime || 5}m
                          </span>
                       </div>
                    </Link>
                 ))}
               </div>

               <div className="mt-3 text-center border-t border-slate-100 dark:border-slate-800/60 pt-3">
                  <Link href={`/${domainSlug}/${stack.slug}`} className="text-[#2e64e5] hover:text-blue-700 dark:text-blue-400 text-[12px] font-bold tracking-wide flex items-center justify-center gap-1 group/more">
                    Open Topic <ChevronRight className="h-3.5 w-3.5 group-hover/more:translate-x-0.5 transition-transform" />
                  </Link>
               </div>
             </div>
          ) : (
             <div className="p-6 text-center text-muted-foreground text-[13px]">No questions available.</div>
          )}
        </div>
      )}
    </div>
  );
}