"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import {
  Check,
  ChevronRight,
  Clock,
  Play,
  Route,
  Search,
  Sparkles,
  BookOpen,
  Target,
  BadgeCheck,
  Layers3,
  ArrowRight,
} from "lucide-react";
import type { Domain, DomainCategory } from "@/lib/api";
import { EXPERIENCE_LEVELS, levelKeyFromLegacy, type ExperienceLevelKey } from "@/lib/levels";
import { parseDomainSlug } from "@/lib/domain-display";
import { TechIcon } from "@/components/tech-icon";
import { getCourseLmsCopy } from "@/lib/course-lms";
import { Skeleton } from "@/components/ui/skeleton";
import { CurriculumSerpentineJourney } from "@/components/course/curriculum-serpentine-journey";

/** Fine technical grid shared with the light homepage visual language. */
const BG_HERO_GRID: React.CSSProperties = {
  backgroundImage: [
    "linear-gradient(to right, rgba(30,122,242,0.055) 1px, transparent 1px)",
    "linear-gradient(to bottom, rgba(30,122,242,0.055) 1px, transparent 1px)",
  ].join(", "),
  backgroundSize: "36px 36px",
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
        `/api/content/domain-stacks?domainSlug=${encodeURIComponent(domainSlug)}&v=locked-v2`,
      )
        .then((r) => (r.ok ? r.json() : null))
        .catch(() => null);

      if (jsonResult?.categories?.length > 0) {
        const nextCategories = jsonResult.categories as DomainCategory[];
        setCategories(nextCategories);
        // Begin with the whole route visible. A detailed module drawer opens
        // only after the learner deliberately selects a station.
        setExpandedPillarIds(new Set());
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
      // Re-clicking closes the current pillar; choosing another transfers the
      // open state. The card itself remains top-anchored so modules unfold
      // only beneath its header.
      return prev.has(id) ? new Set() : new Set([id]);
    });
  }, []);

  const langIcon =
    parsed?.langSlug === "python"
      ? "python"
      : parsed?.langSlug === "ruby"
        ? "ruby"
        : parsed?.langSlug === "java" || domainSlug.includes("java")
          ? "java"
          : parsed?.langSlug ?? "typescript";

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f8fc] text-[#0f2346]">
        <div className="mx-auto w-full max-w-[1320px] space-y-6 px-5 py-12">
          <Skeleton className="h-5 w-48 bg-slate-200" />
          <Skeleton className="h-64 w-full rounded-[15px] bg-white" />
          <Skeleton className="h-72 w-full rounded-[15px] bg-white" />
        </div>
      </div>
    );
  }

  if (!domain) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f8fc] text-[#60738f]">
        Course not found.
      </div>
    );
  }

  const displayTitle = copy.heroTitle ?? domain.name;

  const estHours = Math.round(estMinutes / 60);

  return (
    <div className="relative min-h-screen overflow-x-clip bg-[#f5f8fc] text-[#0f2346] selection:bg-blue-100">
      <section className="relative overflow-hidden border-b border-[#cbd9e8] bg-[#f9fbfe]">
        <div className="pointer-events-none absolute inset-0 bg-[url('/domain-learning-hero-bg.png')] bg-cover bg-[72%_center] bg-no-repeat" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-white/76" aria-hidden />

        <div className="relative mx-auto w-full max-w-[1500px] px-5 pb-5 pt-4 sm:px-8 lg:px-10">
          <nav className="mb-2 flex flex-wrap items-center gap-1.5 text-[11px] font-medium text-[#60738f]">
            <Link href="/" className="transition-colors hover:text-[#1e7af2]">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link href="/domains" className="transition-colors hover:text-[#1e7af2]">Learning paths</Link>
            <ChevronRight className="h-3.5 w-3.5" />
            <span className="text-[#0f2346]">{displayTitle}</span>
          </nav>

          <div className="py-3 text-center lg:py-4">
            <div className="mx-auto max-w-[980px]">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50/80 px-3 py-1 text-[10px] font-semibold text-[#1e7af2]">
                <Sparkles className="h-3.5 w-3.5" />
                {copy.kicker}
              </div>

              <div className="flex items-center justify-center gap-3">
                <div className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-[10px] border border-blue-200 bg-white p-2 shadow-sm sm:flex">
                  <TechIcon name={langIcon} className="h-7 w-7" />
                </div>
                <div className="min-w-0">
                  <h1 className="text-[1.9rem] font-semibold leading-[1.08] tracking-[-0.032em] text-[#0f2346] sm:text-[2.25rem] lg:text-[2.5rem]">
                    {displayTitle}
                  </h1>
                  <p className="mx-auto mt-2 max-w-[820px] text-[13px] leading-5 text-[#526b89] sm:text-sm">
                    {copy.heroSub}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap justify-center gap-2">
                {domain.language && (
                  <span className="rounded-full border border-[#d7e1ee] bg-white px-3 py-1.5 text-xs font-semibold text-[#334a68]">
                    {domain.language}
                  </span>
                )}
                {domain.track && (
                  <span className="rounded-full border border-[#d7e1ee] bg-white px-3 py-1.5 text-xs font-semibold text-[#334a68]">
                    {domain.track}
                  </span>
                )}
                <span className="rounded-full border border-[#d7e1ee] bg-white px-3 py-1.5 text-xs font-semibold text-[#334a68]">
                  {levelMeta.label} · {levelMeta.range}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                  <BadgeCheck className="h-3.5 w-3.5" />
                  Speakable answers
                </span>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-3">
                {firstStackHref && (
                  <Link
                    href={firstStackHref}
                    className="group inline-flex min-h-11 items-center gap-2 rounded-[10px] bg-[#1e7af2] px-5 py-3 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(30,122,242,0.9)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#116be0]"
                  >
                    <Play className="h-4 w-4 fill-current" />
                    Start with the first module
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                  </Link>
                )}
                <a
                  href="#interview-road"
                  className="inline-flex min-h-11 items-center gap-2 rounded-[10px] border border-[#c9d8ea] bg-white px-5 py-3 text-sm font-semibold text-[#0f2346] transition-all duration-200 hover:-translate-y-0.5 hover:border-blue-300 hover:text-[#1e7af2]"
                >
                  <Route className="h-4 w-4 text-[#e87500]" />
                  Explore the learning road
                </a>
              </div>

              <p className="mt-2 flex items-center justify-center gap-2 text-[10px] text-[#60738f]">
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                Real repository curriculum · no account required to browse
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="interview-road" className="relative scroll-mt-20 overflow-hidden bg-[#f5f8fc]">
        <div className="pointer-events-none absolute inset-0 opacity-35" style={BG_HERO_GRID} aria-hidden />
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.12]"
          style={{
            backgroundImage: "url('/road-atlas-bg.svg')",
            backgroundSize: "cover",
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
          }}
          aria-hidden
        />
        <div className="pointer-events-none absolute -left-28 top-72 h-80 w-80 rounded-full bg-blue-200/25 blur-[90px]" aria-hidden />
        <div className="pointer-events-none absolute -right-20 top-[38rem] h-72 w-72 rounded-full bg-orange-100/35 blur-[85px]" aria-hidden />
        <div className="pointer-events-none absolute left-[38%] top-[70rem] h-80 w-80 rounded-full bg-violet-100/30 blur-[90px]" aria-hidden />

        <div className="relative mx-auto w-full max-w-[1500px] px-5 pb-20 pt-4 sm:px-8 lg:px-10">
          <div className="overflow-hidden rounded-[15px] border border-[#cbd9e8] bg-white/94 shadow-[0_16px_42px_-36px_rgba(15,35,70,.7)]">
            <div className="grid min-h-[68px] items-center divide-y divide-[#dce5ef] lg:grid-cols-[repeat(4,minmax(110px,1fr))_minmax(280px,2.25fr)] lg:divide-x lg:divide-y-0">
              {[
                { label: "Pillars", value: categories.length, icon: Target, color: "#1e7af2" },
                { label: "Modules", value: totalStacks, icon: Layers3, color: "#16a566" },
                { label: "Questions", value: totalQs, icon: BookOpen, color: "#7357d7" },
                { label: "Estimated time", value: `~${estHours}h`, icon: Clock, color: "#e87500" },
              ].map((item) => <div key={item.label} className="flex items-center justify-center gap-3 px-4 py-3"><span className="flex h-9 w-9 items-center justify-center rounded-full" style={{backgroundColor:`${item.color}12`,color:item.color}}><item.icon className="h-4 w-4" /></span><div><div className="text-lg font-semibold leading-none tabular-nums text-[#0f2346]">{item.value}</div><div className="mt-1 text-[9px] font-semibold uppercase tracking-[.1em] text-[#71839b]">{item.label}</div></div></div>)}
              <div className="flex items-center gap-4 px-5 py-3">
                <div className="min-w-0 flex-1"><div className="text-[9px] font-bold uppercase tracking-[.12em] text-[#71839b]">Next checkpoint</div><div className="mt-1 truncate text-[11px] font-semibold text-[#173250]">{categories[0]?.name ?? levelMeta.label}</div><div className="mt-2 h-1.5 overflow-hidden rounded-full bg-[#e0e8f1]"><div className="h-full w-[35%] rounded-full bg-[#1e7af2]" /></div></div>
                <span className="text-[10px] font-semibold text-[#60738f]">35%</span>
              </div>
            </div>
            <div className="flex flex-col gap-3 border-t border-[#dce5ef] px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
              <div><h2 className="text-base font-semibold text-[#0f2346]">Your interview road</h2><p className="text-[10px] text-[#71839b]">Open a pillar to inspect its real modules and question counts.</p></div>
              <div className="relative w-full sm:max-w-[330px]">
                <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-[#60738f]" />
                <input
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Find a module or skill"
                  aria-label="Find a module or skill"
                  className="min-h-10 w-full rounded-[9px] border border-[#c9d8ea] bg-white py-2.5 pl-11 pr-4 text-xs text-[#0f2346] outline-none placeholder:text-[#8292a8] focus:border-[#1e7af2] focus:ring-4 focus:ring-blue-100"
                />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <CurriculumSerpentineJourney
              categories={categories}
              pillarRows={pillarsWithFilteredStacks}
              domainSlug={domainSlug}
              expandedPillarIds={expandedPillarIds}
              onTogglePillar={togglePillar}
              filterActive={query.trim().length > 0}
            />
          </div>

          {firstStackHref && (
            <div className="relative mt-10 grid overflow-hidden rounded-[15px] border border-[#bcd5ee] bg-[#0f2346] text-white shadow-[0_24px_60px_-38px_rgba(15,35,70,.8)] md:grid-cols-[1fr_auto]">
              <div className="pointer-events-none absolute inset-0 opacity-20 [background-image:linear-gradient(rgba(255,255,255,.18)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.18)_1px,transparent_1px)] [background-size:34px_34px]" aria-hidden />
              <div className="relative p-6 sm:p-8">
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#80baff]">Your first checkpoint</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.025em]">Turn the roadmap into interview fluency.</h3>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-blue-100/80">Start with the foundation module, speak each answer aloud, and use the connected road to progress in the order interviewers deepen the discussion.</p>
              </div>
              <div className="relative flex items-center border-t border-white/10 bg-white/[0.055] p-6 md:min-w-[260px] md:border-l md:border-t-0">
              <Link href={firstStackHref} className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] bg-[#1e7af2] px-5 py-3 text-sm font-semibold text-white hover:bg-[#116be0]">
                Start learning
                <ArrowRight className="h-4 w-4" />
              </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {firstStackHref ? (
        <div className="fixed bottom-0 left-0 right-0 z-40 border-t border-[#d7e1ee] bg-white/95 p-3 backdrop-blur-xl lg:hidden">
          <Link
            href={firstStackHref}
            className="flex min-h-12 w-full items-center justify-center gap-2 rounded-[10px] bg-[#1e7af2] text-sm font-semibold text-white shadow-lg"
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
