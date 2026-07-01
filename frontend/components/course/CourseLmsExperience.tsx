"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Award,
  Check,
  ChevronRight,
  Clock,
  Crown,
  Play,
  Route,
  Search,
  Sparkles,
  Star,
  Users,
  Zap,
  BookOpen,
  Target,
  BadgeCheck,
} from "lucide-react";
import type { Domain, DomainCategory } from "@/lib/api";
import { EXPERIENCE_LEVELS, levelKeyFromLegacy, type ExperienceLevelKey } from "@/lib/levels";
import { parseDomainSlug } from "@/lib/domain-display";
import { cn } from "@/lib/utils";
import { TechIcon } from "@/components/tech-icon";
import { getCourseLmsCopy } from "@/lib/course-lms";
import { Skeleton } from "@/components/ui/skeleton";
import { CurriculumSerpentineJourney } from "@/components/course/curriculum-serpentine-journey";

/** Fixed-page decor: line grid (CSS) + optional `/course-mesh.svg` from `public/`. */
/** Fine white square grid — Udemy-style hero texture */
const BG_DARK_HERO_GRID: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(to right, rgba(255,255,255,0.055) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(255,255,255,0.055) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "32px 32px",
};


function extractLevelKey(slug: string): ExperienceLevelKey {
  const parsed = parseDomainSlug(slug);
  if (parsed) return parsed.levelKey;
  const parts = slug.split("-");
  const suffix = parts.slice(2).join("-");
  return levelKeyFromLegacy(suffix);
}


export function CourseLmsExperience({ domainSlug }: { domainSlug: string }) {
  const copy = getCourseLmsCopy(domainSlug);
  const levelKey = extractLevelKey(domainSlug);
  const levelMeta = EXPERIENCE_LEVELS[levelKey];
  const parsed = parseDomainSlug(domainSlug);

  const [domain, setDomain] = useState<Domain | null>(null);
  const [categories, setCategories] = useState<DomainCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [expandedPillarIds, setExpandedPillarIds] = useState<Set<number>>(new Set());

  useEffect(() => {
    const load = async () => {
      const jsonResult = await fetch(
        `/api/content/domain-stacks?domainSlug=${encodeURIComponent(domainSlug)}`,
      )
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (jsonResult?.categories?.length > 0) {
        setCategories(jsonResult.categories as DomainCategory[]);
      }

      const domainParsed = parseDomainSlug(domainSlug);
      const lang =
        domainParsed?.language ??
        domainSlug.split("-")[0].charAt(0).toUpperCase() +
          domainSlug.split("-")[0].slice(1);
      const track =
        domainParsed?.track ??
        (() => {
          const parts = domainSlug.split("-");
          return parts.length > 2
            ? parts
                .slice(1, -1)
                .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                .join(" ")
            : parts[1]?.charAt(0).toUpperCase() + (parts[1]?.slice(1) ?? "");
        })();

      const totalQ =
        jsonResult?.categories?.reduce(
          (sum: number, c: { stacks: { questionCount: number }[] }) =>
            sum + c.stacks.reduce((s: number, st: { questionCount: number }) => s + st.questionCount, 0),
          0,
        ) ?? 0;
      const totalS =
        jsonResult?.categories?.reduce(
          (sum: number, c: { stacks: unknown[] }) => sum + c.stacks.length,
          0,
        ) ?? 0;

      setDomain({
        id: 0,
        name: `${lang} ${track}`,
        slug: domainSlug,
        description:
          totalQ > 0
            ? `${levelMeta.label} (${levelMeta.range}) — ${totalS} modules and ${totalQ} curated questions.`
            : `${levelMeta.label} (${levelMeta.range}) interview preparation for ${lang} ${track}.`,
        language: lang,
        languageSlug: domainParsed?.langSlug ?? domainSlug.split("-")[0],
        track,
        trackSlug: domainParsed?.trackSlug ?? (domainSlug.split("-")[1] ?? ""),
        experienceLabel: levelMeta.range,
      });

      setLoading(false);
    };
    load();
  }, [domainSlug, levelMeta.label, levelMeta.range]);

  const firstStackHref = useMemo(() => {
    const first = categories[0]?.stacks[0];
    if (!first) return null;
    return `/${domainSlug}/${first.slug}`;
  }, [categories, domainSlug]);

  const totalStacks = categories.reduce((a, c) => a + c.stacks.length, 0);
  const totalQs = categories.reduce(
    (a, c) => a + c.stacks.reduce((s, st) => s + st.questionCount, 0),
    0,
  );
  const estMinutes = Math.max(120, totalQs * 5);

  const pillarsWithFilteredStacks = useMemo(() => {
    const q = query.trim().toLowerCase();
    return categories.map((c) => ({
      ...c,
      stacks: q
        ? c.stacks.filter(
            (s) =>
              s.name.toLowerCase().includes(q) ||
              s.slug.toLowerCase().includes(q) ||
              (s.description?.toLowerCase().includes(q) ?? false),
          )
        : c.stacks,
    }));
  }, [categories, query]);

  const journeyModuleCount = useMemo(
    () => pillarsWithFilteredStacks.reduce((sum, p) => sum + p.stacks.length, 0),
    [pillarsWithFilteredStacks],
  );
  const journeyQuestionCount = useMemo(
    () =>
      pillarsWithFilteredStacks.reduce(
        (sum, p) => sum + p.stacks.reduce((s, st) => s + st.questionCount, 0),
        0,
      ),
    [pillarsWithFilteredStacks],
  );

  useEffect(() => {
    setExpandedPillarIds((prev) => {
      const next = new Set<number>();
      for (const id of prev) {
        const row = pillarsWithFilteredStacks.find((p) => p.id === id);
        if (row && row.stacks.length > 0) next.add(id);
      }
      return next;
    });
  }, [pillarsWithFilteredStacks]);

  const togglePillar = useCallback((id: number) => {
    setExpandedPillarIds((prev) => {
      const n = new Set(prev);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }, []);

  const langIcon =
    parsed?.langSlug === "python"
      ? "python"
      : parsed?.langSlug === "java" || domainSlug.includes("java")
        ? "java"
        : "typescript";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f1014] text-muted-foreground">
        <div className="w-full min-w-0 space-y-6 px-5 py-12">
          <Skeleton className="h-5 w-48 bg-zinc-800 dark:bg-zinc-800/80" />
          <Skeleton className="h-36 w-full rounded-3xl bg-zinc-800 dark:bg-zinc-800/60" />
          <Skeleton className="h-56 w-full rounded-3xl bg-zinc-800 dark:bg-zinc-800/40" />
        </div>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="min-h-screen flex items-center justify-center text-zinc-500 dark:text-zinc-400">
        Course not found.
      </div>
    );
  }

  const displayTitle = copy.heroTitle ?? domain.name;

  const estHours = Math.round(estMinutes / 60);

  return (
    <div className="relative min-h-screen overflow-x-clip text-muted-foreground selection:bg-background/20">
      {/* ── FIXED PAGE BACKGROUND ── */}
      <div className="pointer-events-none fixed inset-0 -z-10" aria-hidden>
        <div className="absolute inset-0 bg-[#f4f5f7] dark:bg-background" />
      </div>

      {/* ════════════════════════════════════════════════
          HERO — dark with grid
      ════════════════════════════════════════════════ */}
      <header className="relative overflow-hidden bg-[#0f1014] border-b border-white/[0.08] text-white">
        {/* fine square grid */}
        <div className="pointer-events-none absolute inset-0" style={BG_DARK_HERO_GRID} aria-hidden />
        {/* soft radial centre-glow so grid fades to dark at edges */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: "radial-gradient(ellipse 80% 60% at 50% 0%, rgba(255,255,255,0.03) 0%, transparent 70%)" }}
          aria-hidden
        />
        {/* bottom edge fade into outcomes */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-[#0f1014] to-transparent" aria-hidden />

        <div className="relative w-full min-w-0 px-4 pb-14 pt-6 sm:px-8 sm:pb-16 sm:pt-8 lg:px-12">

          {/* Breadcrumb */}
          <nav className="mb-5 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-zinc-600 dark:text-zinc-400">
            <Link href="/" className="transition-colors hover:text-muted-foreground">Home</Link>
            <ChevronRight className="h-3 w-3 text-zinc-700 dark:text-zinc-400" />
            <Link href="/domains" className="transition-colors hover:text-muted-foreground">Paths</Link>
            <ChevronRight className="h-3 w-3 text-zinc-700 dark:text-zinc-400" />
            <span className="text-muted-foreground">{displayTitle}</span>
          </nav>

          {/* Trust bar */}
          <div className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2 text-[11px] font-medium tracking-wide text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500 dark:border-emerald-500/50 dark:border-emerald-700/20 bg-emerald-500 dark:bg-emerald-800/10 px-3 py-1 text-white dark:text-emerald-300">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 dark:bg-emerald-800 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400 dark:bg-emerald-800" />
              </span>
              Live curriculum
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-amber-500 dark:border-amber-700/20 bg-amber-500 dark:bg-amber-800/10 px-3 py-1 text-amber-950 dark:text-amber-300/90">
              <Award className="h-3 w-3" />
              Free to browse
            </span>
            <span className="rounded-full border border-white/[0.08] bg-background/[0.04] px-3 py-1 text-zinc-500 dark:text-zinc-400">
              Progress tracked with account
            </span>
          </div>

          {/* Main two-col grid */}
          <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px] xl:grid-cols-[minmax(0,1fr)_340px]">

            {/* ── LEFT: headline + meta ── */}
            <div className="min-w-0">

              {/* Kicker pill */}
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-400 dark:border-amber-700/25 bg-amber-400 dark:bg-amber-800/10 px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-amber-950 dark:text-amber-300/90">
                <Sparkles className="h-3 w-3 text-amber-400 dark:text-amber-300" />
                {copy.kicker}
              </div>

              {/* Language icon + headline row */}
              <div className="flex items-start gap-4">
                <div className="relative hidden shrink-0 sm:block">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-white/[0.1] bg-background/[0.06] p-2.5 ring-1 ring-inset ring-white/[0.06]">
                    <TechIcon name={langIcon} className="h-10 w-10" />
                  </div>
                  <span className="absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-[#0f1014] bg-emerald-400 dark:bg-emerald-800" />
                </div>

                <div className="min-w-0 flex-1">
                  <h1 className="text-[2.15rem] font-black leading-[1.06] tracking-tight text-white sm:text-[2.6rem] lg:text-[3rem]">
                    {displayTitle}
                  </h1>

                  <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-muted-foreground">
                    {copy.heroSub}
                  </p>
                </div>
              </div>

              {/* Social proof row */}
              <div className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2">
                <div className="flex items-center gap-1.5">
                  <div className="flex">
                    {[1,2,3,4].map(i => (
                      <Star key={i} className="h-3.5 w-3.5 fill-amber-400 text-amber-400 dark:text-amber-300" />
                    ))}
                    <Star className="h-3.5 w-3.5 fill-amber-400/40 text-amber-400 dark:text-amber-300/60" />
                  </div>
                  <span className="text-sm font-bold text-amber-400 dark:text-amber-300">4.8</span>
                  <span className="text-[11px] text-zinc-600 dark:text-zinc-400">· 2,400+ learners</span>
                </div>
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <Users className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                  12,500 enrolled
                </span>
                <span className="flex items-center gap-1.5 text-[11px] text-zinc-500 dark:text-zinc-400">
                  <Clock className="h-3.5 w-3.5 text-zinc-600 dark:text-zinc-400" />
                  ~{estHours}h content
                </span>
                <span className="text-[11px] text-zinc-600 dark:text-zinc-400">Updated Apr 2025</span>
              </div>

              {/* Tag pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {domain.language && (
                  <span className="inline-flex items-center rounded-md border border-white/[0.1] bg-background/[0.06] px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {domain.language}
                  </span>
                )}
                {domain.track && (
                  <span className="inline-flex items-center rounded-md border border-white/[0.1] bg-background/[0.06] px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                    {domain.track}
                  </span>
                )}
                <span className="inline-flex items-center rounded-md border border-white/[0.1] bg-background/[0.06] px-2.5 py-1 text-[11px] font-semibold text-muted-foreground">
                  {levelMeta.label} · {levelMeta.range}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-500 dark:border-emerald-500/50 dark:border-emerald-700/20 bg-emerald-500 dark:bg-emerald-800/10 px-2.5 py-1 text-[11px] font-semibold text-white dark:text-emerald-300">
                  <BadgeCheck className="h-3 w-3" />
                  Speakable Answers
                </span>
              </div>

              {/* CTA row */}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {firstStackHref && (
                  <Link
                    href={firstStackHref}
                    className="group inline-flex items-center gap-2.5 rounded-xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500 px-7 py-3.5 text-[14px] font-black text-zinc-950 dark:text-zinc-400 shadow-[0_6px_24px_-6px_rgba(245,158,11,0.55)] transition-all hover:shadow-[0_10px_36px_-8px_rgba(245,158,11,0.65)] hover:brightness-105 active:scale-[0.98]"
                  >
                    <Play className="h-4 w-4 fill-current transition-transform group-hover:scale-110" />
                    Start learning free
                    <ChevronRight className="h-4 w-4 opacity-70 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
                <a
                  href="#interview-road"
                  className="inline-flex items-center gap-2 rounded-xl border border-white/[0.14] bg-background/[0.06] px-5 py-3.5 text-[14px] font-semibold text-white transition-all hover:border-white/[0.24] hover:bg-background/[0.1]"
                >
                  <Route className="h-4 w-4 text-amber-300 dark:text-amber-300/80" />
                  View the road
                </a>
              </div>
            </div>

            {/* ── RIGHT: course snapshot card ── */}
            <div className="relative overflow-hidden rounded-2xl border border-white/[0.1] bg-background/[0.05] lg:mt-6 lg:self-start">
              {/* amber top bar */}
              <div className="h-[3px] w-full bg-gradient-to-r from-amber-400 via-orange-400 to-amber-500" />

              {/* card header */}
              <div className="flex items-center gap-2.5 border-b border-white/[0.08] px-5 py-3.5 sm:px-6">
                <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-400 dark:bg-amber-800/15">
                  <Crown className="h-3.5 w-3.5 text-amber-400 dark:text-amber-300" />
                </span>
                <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-muted-foreground">Course snapshot</span>
              </div>

              {/* stats — 2×2 grid, each cell distinct */}
              <div className="grid grid-cols-2 divide-x divide-y divide-white/[0.06]">
                {[
                  { icon: <BookOpen className="h-4 w-4 text-amber-400 dark:text-amber-300" />, label: "Questions", value: `${totalQs}+`, color: "text-amber-300 dark:text-amber-300" },
                  { icon: <Target className="h-4 w-4 text-sky-400 dark:text-sky-300" />, label: "Pillars", value: String(categories.length), color: "text-sky-300 dark:text-sky-300" },
                  { icon: <Zap className="h-4 w-4 text-emerald-400 dark:text-emerald-300" />, label: "Modules", value: String(totalStacks), color: "text-emerald-300 dark:text-emerald-300" },
                  { icon: <Clock className="h-4 w-4 text-muted-foreground" />, label: "Est. depth", value: `~${estHours}h`, color: "text-muted-foreground" },
                ].map(({ icon, label, value, color }) => (
                  <div key={label} className="flex flex-col gap-1 px-5 py-4">
                    <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] text-zinc-500 dark:text-zinc-400">
                      {icon}{label}
                    </span>
                    <span className={`text-[1.6rem] font-black tabular-nums leading-none tracking-tight ${color}`}>{value}</span>
                  </div>
                ))}
              </div>

              {/* included features */}
              <div className="space-y-2.5 border-t border-white/[0.06] px-5 py-4 sm:px-6">
                {[
                  "Structured interview-first order",
                  "Speakable Answer™ technique",
                  "Module-level revision sheet (printable)",
                  "Difficulty-tagged questions",
                  "Free · no account required",
                ].map((f) => (
                  <div key={f} className="flex items-center gap-2.5 text-[12px] text-muted-foreground">
                    <Check className="h-3.5 w-3.5 shrink-0 text-emerald-400 dark:text-emerald-300" strokeWidth={2.5} />
                    {f}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ════════════════════════════════════════════════
          ROAD SECTION
      ════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden bg-[#1e2130]">
        {/* atlas map texture */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.28]" style={{
          backgroundImage: "url('/road-atlas-bg.svg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }} aria-hidden />
        {/* warm amber glow — bottom right, like city lights on a night map */}
        <div className="pointer-events-none absolute -bottom-32 -right-32 h-[28rem] w-[28rem] rounded-full bg-amber-500 dark:bg-amber-800/10 blur-[96px]" aria-hidden />
        {/* cool teal glow — top left */}
        <div className="pointer-events-none absolute -left-24 top-0 h-80 w-80 rounded-full bg-sky-600 dark:bg-sky-800/10 blur-[80px]" aria-hidden />
        {/* top edge separator line */}
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        {/* ── WHAT YOU'LL LEARN — inside road section ── */}
        <div className="relative w-full min-w-0 px-4 pb-8 pt-12 sm:px-8 lg:px-12">
          <div className="mb-6 flex items-center justify-center gap-3">
            <span className="text-3xl lg:text-4xl font-black tracking-tight text-white font-[Arial]">What you&apos;ll learn</span>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {copy.outcomes.map((line, i) => (
              <li key={line} className="flex gap-3 rounded-xl border border-white/10 bg-white/5 p-4 text-[14px] leading-relaxed text-slate-300">
                <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-amber-400 to-orange-400 text-[10px] font-black text-white shadow-sm">
                  {i + 1}
                </span>
                {line}
              </li>
            ))}
          </ul>
        </div>

        {/* ── CURRICULUM HEADER ── */}
        <div id="interview-road" className="scroll-mt-20 relative w-full min-w-0 border-t border-white/[0.06] px-4 pb-8 pt-10 sm:px-8 lg:px-12">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.28em] text-slate-400">Curriculum</p>

          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="flex items-center gap-3 text-2xl font-black tracking-tight text-white sm:text-[1.85rem] lg:text-[2.1rem]">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-amber-500/20 bg-amber-500/10 text-amber-400">
                  <Route className="h-5 w-5" strokeWidth={2} />
                </span>
                Interview Road
              </h2>
              <p className="mt-2.5 max-w-xl text-[14px] leading-relaxed text-slate-300">
                Pillars alternate left and right along a central highway — in the exact order interviewers probe your knowledge. Tap any pillar to open its modules. Each module opens with a{" "}
                <span className="font-semibold text-slate-200">2–3 page revision sheet</span> you can skim — or save as PDF — before drilling the interview questions.
              </p>

              {/* inline stats */}
              <div className="mt-5 flex flex-wrap gap-2.5">
                {[
                  { value: String(categories.length), label: "Pillars", dot: "bg-amber-400 dark:bg-amber-800" },
                  { value: String(journeyModuleCount), label: "Modules", dot: "bg-sky-400 dark:bg-sky-800" },
                  { value: `${journeyQuestionCount}+`, label: "Questions", dot: "bg-emerald-400 dark:bg-emerald-800" },
                ].map(({ value, label, dot }) => (
                  <div key={label} className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5">
                    <span className={`h-2 w-2 rounded-full ${dot}`} />
                    <span className="text-[1.1rem] font-black tabular-nums text-white">{value}</span>
                    <span className="text-[11px] font-medium text-slate-300">{label}</span>
                  </div>
                ))}
                {expandedPillarIds.size > 0 && (
                  <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-white/5 px-4 py-2.5 text-[11px] font-medium text-slate-300">
                    <span className="h-2 w-2 rounded-full bg-slate-500" />
                    {expandedPillarIds.size} open
                  </div>
                )}
              </div>
            </div>

            {/* search */}
            <div className="relative w-full shrink-0 lg:max-w-72">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search modules…"
                className="w-full rounded-2xl border border-white/20 bg-white/5 py-3 pl-11 pr-4 text-sm text-slate-100 shadow-md placeholder:text-slate-400 focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-white/10 backdrop-blur-sm"
              />
            </div>
          </div>
        </div>

        {/* ── THE ROAD ── */}
        <div className="w-full min-w-0 px-3 pb-20 sm:px-6 lg:px-10">
          <CurriculumSerpentineJourney
            categories={categories}
            pillarRows={pillarsWithFilteredStacks}
            domainSlug={domainSlug}
            expandedPillarIds={expandedPillarIds}
            onTogglePillar={togglePillar}
            filterActive={query.trim().length > 0}
          />
        </div>

        {/* bottom fade out */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#1e2130] to-transparent" />
      </div>

      {firstStackHref ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-border/80 bg-background/92 p-3 backdrop-blur-xl lg:hidden">
          <Link
            href={firstStackHref}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-400 via-amber-500 to-orange-600 py-3.5 text-sm font-bold text-zinc-950 dark:text-zinc-400 shadow-lg shadow-amber-900/20"
          >
            <Play className="h-4 w-4 fill-current" />
            Start learning
          </Link>
        </div>
      ) : null}
      {firstStackHref ? <div className="h-20 lg:hidden" aria-hidden /> : null}
    </div>
  );
}
