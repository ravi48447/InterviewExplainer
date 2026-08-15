"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock3,
  Code2,
  Compass,
  Filter,
  Layers3,
  RotateCcw,
  Search,
  Sparkles,
  Target,
  X,
} from "lucide-react";
import { DomainExplorerVisual, type DomainVisualGroup } from "@/components/domains/domain-explorer-visual";
import { FadeInUp } from "@/components/motion-wrapper";
import { PageContainer } from "@/components/page-container";
import { Skeleton } from "@/components/ui/skeleton";
import { TechIcon } from "@/components/tech-icon";
import { ENABLED_LANGUAGES } from "@/lib/launch-config";
import { EXPERIENCE_LEVELS, LEVEL_KEYS, type ExperienceLevelKey } from "@/lib/levels";
import type { ContentDomain } from "@/lib/types/content-domain";
import { cn } from "@/lib/utils";

type Filters = {
  search: string;
  track: string;
  level: "" | ExperienceLevelKey;
  language: string;
};

const EMPTY_FILTERS: Filters = { search: "", track: "", level: "", language: "" };

const TRACK_ACCENTS: Record<string, { color: string; tint: string }> = {
  backend: { color: "#3279C9", tint: "#F2F7FD" },
  frontend: { color: "#126B63", tint: "#EFF9F6" },
  fullstack: { color: "#7857D8", tint: "#F6F2FD" },
  "data-engineering": { color: "#D9603B", tint: "#FFF5F0" },
  "ml-ai": { color: "#9B5A8B", tint: "#FBF3F9" },
  "sql-analytics": { color: "#B56A0A", tint: "#FFF8EB" },
  "python-analysis": { color: "#B56A0A", tint: "#FFF8EB" },
  visualization: { color: "#7857D8", tint: "#F6F2FD" },
  cloud: { color: "#3279C9", tint: "#F2F7FD" },
  infrastructure: { color: "#126B63", tint: "#EFF9F6" },
  cicd: { color: "#126B63", tint: "#EFF9F6" },
  sre: { color: "#126B63", tint: "#EFF9F6" },
};

const FALLBACK_ACCENT = { color: "#60738F", tint: "#F5F8FC" };

export default function DomainsPage() {
  const searchParams = useSearchParams();
  const requestedLanguage = searchParams?.get("language")?.toLowerCase() ?? "";
  const [domains, setDomains] = useState<ContentDomain[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [requestKey, setRequestKey] = useState(0);
  const [filters, setFilters] = useState<Filters>({ ...EMPTY_FILTERS, language: requestedLanguage });

  useEffect(() => {
    setFilters((current) => ({ ...current, language: requestedLanguage }));
  }, [requestedLanguage]);

  const loadDomains = useCallback(() => {
    setLoading(true);
    setError("");
    const controller = new AbortController();

    fetch("/api/content/all-domains", { signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error("Unable to load interview paths.");
        return response.json() as Promise<ContentDomain[]>;
      })
      .then((data) => {
        const enabled = new Set((ENABLED_LANGUAGES as readonly string[]).map((item) => item.toLowerCase()));
        setDomains(data.filter((domain) => enabled.has(domain.language.toLowerCase())));
      })
      .catch((reason: unknown) => {
        if (reason instanceof DOMException && reason.name === "AbortError") return;
        setError(reason instanceof Error ? reason.message : "Unable to load interview paths.");
      })
      .finally(() => setLoading(false));

    return () => controller.abort();
  }, []);

  useEffect(() => loadDomains(), [loadDomains, requestKey]);

  const languages = useMemo(
    () => Array.from(new Set(domains.map((domain) => domain.language))).sort((a, b) => a.localeCompare(b)),
    [domains],
  );

  const tracks = useMemo(() => {
    const unique = new Map<string, string>();
    domains.forEach((domain) => unique.set(domain.trackSlug, domain.track));
    return Array.from(unique, ([slug, name]) => ({ slug, name })).sort((a, b) => a.name.localeCompare(b.name));
  }, [domains]);

  const filteredDomains = useMemo(() => {
    const search = filters.search.trim().toLowerCase();
    return domains.filter((domain) => {
      const matchesSearch = !search || [domain.name, domain.language, domain.track, domain.levelLabel]
        .some((value) => value.toLowerCase().includes(search));
      return matchesSearch
        && (!filters.language || domain.language.toLowerCase() === filters.language.toLowerCase())
        && (!filters.track || domain.trackSlug === filters.track)
        && (!filters.level || domain.level === filters.level);
    });
  }, [domains, filters]);

  const liveCount = useMemo(() => domains.filter((domain) => domain.hasContent).length, [domains]);
  const totalQuestions = useMemo(
    () => domains.reduce((total, domain) => total + (domain.hasContent ? domain.questionCount : 0), 0),
    [domains],
  );

  const visualGroups = useMemo<DomainVisualGroup[]>(() => {
    const accents: DomainVisualGroup["accent"][] = ["violet", "blue", "teal", "orange"];
    return languages.slice(0, 4).map((language, index) => ({
      label: language,
      count: domains.filter((domain) => domain.language === language).length,
      accent: accents[index],
    }));
  }, [domains, languages]);

  const hasFilters = Boolean(filters.search || filters.track || filters.level || filters.language);
  const clearFilters = () => setFilters(EMPTY_FILTERS);
  const selectLanguage = (language: string) => {
    setFilters((current) => ({ ...current, language: current.language === language.toLowerCase() ? "" : language.toLowerCase() }));
  };

  return (
    <main id="main" className="min-h-screen bg-background">
      <section aria-labelledby="domain-explorer-heading" className="border-b border-[#D7E1EE] bg-[linear-gradient(145deg,#FCFEFF_0%,#F7FBFF_55%,#FFFDF9_100%)] dark:bg-card">
        <PageContainer wide className="max-w-[1440px] py-12 sm:py-16">
          <div className="grid items-center gap-10 xl:grid-cols-[0.88fr_1.12fr] xl:gap-12">
            <FadeInUp className="max-w-[590px]">
              <span className="inline-flex items-center gap-2 rounded-full border border-[#7857D8]/20 bg-[#7857D8]/[0.06] px-3 py-1.5 text-[11px] font-medium text-[#6846C7] dark:text-[#bcaaff]">
                <Sparkles className="h-3.5 w-3.5 text-[#E87500]" aria-hidden="true" />
                Step 1 · Find your preparation focus
              </span>
              <h1 id="domain-explorer-heading" className="mt-5 font-display text-[clamp(2.2rem,4vw,3.35rem)] font-semibold leading-[1.08] tracking-[-0.038em] text-foreground">
                Explore interview paths built around <span className="text-[#7857D8] dark:text-[#bcaaff]">your stack.</span>
              </h1>
              <p className="mt-5 max-w-[550px] text-[14px] leading-6 text-muted-foreground sm:text-[15px] sm:leading-7">
                Choose a language, role, and experience level. Every live path leads to structured concepts, real questions, and focused interview preparation.
              </p>

              <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="#domain-library" className="inline-flex h-11 items-center justify-center gap-2 rounded-lg bg-[#D9603B] px-5 text-[13px] font-semibold text-white shadow-md transition-[transform,background-color] duration-150 ease-out hover:-translate-y-0.5 hover:bg-[#bd4f30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#D9603B] focus-visible:ring-offset-2">
                  Browse live paths <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </a>
                <span className="inline-flex items-center gap-2 text-[11px] text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-[#126B63]" aria-hidden="true" />
                  Real repository content only
                </span>
              </div>

              <dl className="mt-8 grid max-w-lg grid-cols-3 gap-2.5">
                <HeroStat value={loading ? "–" : String(liveCount)} label="Live paths" accent="teal" />
                <HeroStat value={loading ? "–" : String(languages.length)} label="Languages" accent="violet" />
                <HeroStat value={loading ? "–" : formatCount(totalQuestions)} label="Questions" accent="blue" />
              </dl>
            </FadeInUp>

            <FadeInUp delay={0.08}>
              <DomainExplorerVisual groups={visualGroups} />
            </FadeInUp>
          </div>
          <FadeInUp delay={0.12} className="mt-8 grid overflow-hidden rounded-2xl border border-[#D7E1EE] bg-white/80 shadow-[0_10px_28px_rgba(15,35,70,.055)] sm:grid-cols-3">
            {[
              { step: "01", icon: Code2, title: "Select your stack", detail: "Pick the language or domain your role uses.", color: "text-[#1974D2] bg-[#EAF3FF]" },
              { step: "02", icon: Layers3, title: "Match your level", detail: "Start at the experience level you are interviewing for.", color: "text-[#7857D8] bg-[#F0ECFF]" },
              { step: "03", icon: Target, title: "Open the path", detail: "Learn concepts, practise questions, then test yourself.", color: "text-[#137A69] bg-[#E6F7F1]" },
            ].map(({ step, icon: Icon, title, detail, color }, index) => <div key={step} className={cn("relative flex gap-4 px-5 py-5 sm:px-6", index > 0 && "border-t border-[#E3EAF2] sm:border-l sm:border-t-0")}><span className={cn("grid h-11 w-11 shrink-0 place-items-center rounded-2xl", color)}><Icon className="h-5 w-5" /></span><span><span className="text-[10px] font-bold tracking-[.12em] text-[#8090A5]">STEP {step}</span><strong className="mt-0.5 block text-[13px] text-[#10264A]">{title}</strong><span className="mt-1 block text-[11px] leading-4 text-[#5B718D]">{detail}</span></span></div>)}
          </FadeInUp>
        </PageContainer>
      </section>

      <section id="domain-library" aria-labelledby="domain-library-heading" className="scroll-mt-20 bg-white py-12 sm:py-14">
        <PageContainer wide className="max-w-[1240px]">
          <FadeInUp>
            <div className="mb-7 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#D9603B]">Path library</p>
                <h2 id="domain-library-heading" className="mt-2 font-display text-[1.45rem] font-semibold tracking-[-0.02em] text-foreground sm:text-[1.8rem]">Choose where you want to begin</h2>
                <p className="mt-2 max-w-2xl text-[13px] leading-6 text-muted-foreground">Filter the real paths available in the repository. Live cards open the complete learning domain.</p>
              </div>
              {!loading && !error && (
                <p className="text-[11px] text-muted-foreground" aria-live="polite">
                  Showing <strong className="font-semibold text-foreground">{filteredDomains.length}</strong> of {domains.length} paths
                </p>
              )}
            </div>

            {!error && (
              <div className="mb-7 rounded-2xl border border-[#D7E1EE] bg-[#FBFDFF] p-4 shadow-[0_10px_28px_rgba(15,35,70,.055)] sm:p-5">
                <div className="grid gap-3 lg:grid-cols-[1fr_auto_auto] lg:items-center">
                  <label className="relative block">
                    <span className="sr-only">Search interview paths</span>
                    <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <input
                      value={filters.search}
                      onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                      placeholder="Search language, role, or path..."
                      className="h-11 w-full rounded-lg border border-border bg-background pl-10 pr-10 text-[13px] text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-[#7857D8] focus:ring-2 focus:ring-[#7857D8]/10"
                    />
                    {filters.search && (
                      <button type="button" onClick={() => setFilters((current) => ({ ...current, search: "" }))} className="absolute right-3 top-1/2 grid h-7 w-7 -translate-y-1/2 place-items-center rounded-md text-muted-foreground hover:bg-muted hover:text-foreground" aria-label="Clear search">
                        <X className="h-3.5 w-3.5" aria-hidden="true" />
                      </button>
                    )}
                  </label>

                  <label className="relative">
                    <span className="sr-only">Filter by career track</span>
                    <Layers3 className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
                    <select value={filters.track} onChange={(event) => setFilters((current) => ({ ...current, track: event.target.value }))} className="h-11 min-w-[190px] appearance-none rounded-lg border border-border bg-background pl-9 pr-9 text-[12px] font-medium text-foreground outline-none focus:border-[#7857D8] focus:ring-2 focus:ring-[#7857D8]/10">
                      <option value="">All career tracks</option>
                      {tracks.map((track) => <option key={track.slug} value={track.slug}>{track.name}</option>)}
                    </select>
                  </label>

                  <div className="flex items-center gap-1 rounded-lg border border-border bg-background p-1" aria-label="Experience level filter">
                    <FilterButton active={!filters.level} onClick={() => setFilters((current) => ({ ...current, level: "" }))}>All levels</FilterButton>
                    {LEVEL_KEYS.map((level) => (
                      <FilterButton key={level} active={filters.level === level} onClick={() => setFilters((current) => ({ ...current, level }))}>
                        {EXPERIENCE_LEVELS[level].label}
                      </FilterButton>
                    ))}
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  <span className="flex shrink-0 items-center gap-1.5 pr-1 text-[10px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
                    <Code2 className="h-3.5 w-3.5" aria-hidden="true" /> Language
                  </span>
                  <button type="button" onClick={() => setFilters((current) => ({ ...current, language: "" }))} className={languageChipClass(!filters.language)}>All</button>
                  {languages.map((language) => (
                    <button key={language} type="button" onClick={() => selectLanguage(language)} className={languageChipClass(filters.language === language.toLowerCase())}>
                      <TechIcon name={language.toLowerCase()} className="h-3.5 w-3.5" /> {language}
                    </button>
                  ))}
                  {hasFilters && (
                    <button type="button" onClick={clearFilters} className="ml-auto inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg px-3 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground">
                      <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" /> Clear
                    </button>
                  )}
                </div>
              </div>
            )}
          </FadeInUp>

          {loading ? (
            <DomainGridSkeleton />
          ) : error ? (
            <DomainError message={error} onRetry={() => setRequestKey((value) => value + 1)} />
          ) : filteredDomains.length === 0 ? (
            <DomainEmpty onClear={clearFilters} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
              {filteredDomains.map((domain) => <DomainPathCard key={domain.slug} domain={domain} />)}
            </div>
          )}

          {!loading && !error && domains.length > 0 && (
            <FadeInUp className="mt-10 grid gap-3 rounded-2xl border border-[#d9e6e2] bg-[#f4faf8] p-5 dark:border-border dark:bg-card sm:grid-cols-3 sm:p-6">
              {[
                { icon: Compass, title: "Choose one focus", detail: "Start with the role closest to your next interview." },
                { icon: BookOpen, title: "Learn in sequence", detail: "Move from concepts to examples and real questions." },
                { icon: Target, title: "Practice for the round", detail: "Use the path to expose gaps before the interview." },
              ].map(({ icon: Icon, title, detail }, index) => (
                <div key={title} className="flex gap-3 rounded-xl bg-white/70 p-3 dark:bg-background/50">
                  <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-lg", index === 0 ? "bg-[#7857D8]/10 text-[#7857D8]" : index === 1 ? "bg-[#126B63]/10 text-[#126B63]" : "bg-[#D9603B]/10 text-[#D9603B]")}><Icon className="h-4 w-4" aria-hidden="true" /></span>
                  <span><strong className="block text-[12px] font-semibold text-foreground">{title}</strong><span className="mt-1 block text-[10px] leading-4 text-muted-foreground">{detail}</span></span>
                </div>
              ))}
            </FadeInUp>
          )}

          {!loading && !error && domains.length > 0 && (
            <FadeInUp className="mt-6 overflow-hidden rounded-2xl border border-[#D7E1EE] bg-[linear-gradient(105deg,#F2F8FF_0%,#FCFEFF_54%,#F1FBF7_100%)] p-6 shadow-sm sm:flex sm:items-center sm:justify-between sm:p-8">
              <div><p className="text-[10px] font-semibold uppercase tracking-[.14em] text-[#1974D2]">Still unsure?</p><h2 className="mt-2 text-[22px] font-semibold tracking-[-.03em] text-[#10264A]">Tell us your role. We’ll shape the first week.</h2><p className="mt-2 max-w-xl text-[12px] leading-5 text-[#58708F]">A short selection flow turns your stack and experience into a focused starting sequence.</p></div>
              <Link href="/select" className="mt-5 inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-[#1974D2] px-5 text-[12px] font-semibold text-white shadow-[0_8px_18px_rgba(25,116,210,.22)] transition hover:-translate-y-0.5 hover:bg-[#1268D5] sm:mt-0">Build my path <ArrowRight className="h-4 w-4" /></Link>
            </FadeInUp>
          )}
        </PageContainer>
      </section>
    </main>
  );
}

function HeroStat({ value, label, accent }: { value: string; label: string; accent: "blue" | "teal" | "violet" }) {
  const accents = { blue: "text-[#3279C9]", teal: "text-[#126B63]", violet: "text-[#7857D8]" } as const;
  return (
    <div className="rounded-xl border border-[#e3ddea] bg-white/80 px-3 py-3 shadow-xs dark:border-border dark:bg-card">
      <dd className={cn("font-display text-lg font-semibold tabular-nums sm:text-xl", accents[accent])}>{value}</dd>
      <dt className="mt-0.5 text-[9px] font-medium text-muted-foreground sm:text-[10px]">{label}</dt>
    </div>
  );
}

function FilterButton({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button type="button" aria-pressed={active} onClick={onClick} className={cn("h-8 whitespace-nowrap rounded-md px-3 text-[10px] font-semibold transition-colors", active ? "bg-[#E87500] text-white shadow-sm" : "text-muted-foreground hover:bg-muted hover:text-foreground")}>
      {children}
    </button>
  );
}

function languageChipClass(active: boolean) {
  return cn(
    "inline-flex h-8 shrink-0 items-center gap-1.5 rounded-lg border px-3 text-[11px] font-medium transition-colors",
    active ? "border-[#E87500] bg-[#fff5eb] text-[#a95500] dark:bg-[#E87500]/10 dark:text-[#ffad5d]" : "border-border bg-background text-muted-foreground hover:border-foreground/20 hover:text-foreground",
  );
}

function DomainPathCard({ domain }: { domain: ContentDomain }) {
  const accent = TRACK_ACCENTS[domain.trackSlug] ?? FALLBACK_ACCENT;
  const description = domain.level === "beginner"
    ? `Build the ${domain.language} ${domain.track.toLowerCase()} fundamentals interviewers expect.`
    : `Study architecture, patterns, and real-world ${domain.language} ${domain.track.toLowerCase()} decisions.`;

  const content = (
    <article className={cn("group relative flex h-full min-h-[270px] flex-col overflow-hidden rounded-2xl border bg-card p-5 shadow-[0_8px_20px_rgba(15,35,70,.045)] transition-[transform,border-color,box-shadow] duration-200 ease-out", domain.hasContent ? "border-[#D7E1EE] hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(15,35,70,.11)]" : "border-dashed border-border opacity-70")}>
      <span className="absolute inset-x-0 top-0 h-1.5" style={{ backgroundColor: accent.color }} aria-hidden="true" />
      <span className="absolute -right-7 top-8 h-28 w-28 rounded-full opacity-35 blur-2xl" style={{ backgroundColor: accent.color }} aria-hidden="true" />
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl" style={{ backgroundColor: accent.tint, color: accent.color }}>
            <TechIcon name={domain.language.toLowerCase()} className="h-5 w-5" />
          </span>
          <div className="min-w-0">
            <p className="truncate text-[10px] font-semibold uppercase tracking-[0.09em]" style={{ color: accent.color }}>{domain.track}</p>
            <h3 className="mt-1 truncate text-[15px] font-semibold text-foreground">{domain.name}</h3>
          </div>
        </div>
        {domain.hasContent ? (
          <span className="rounded-full border border-[#cfe3dc] bg-[#f1faf7] px-2 py-1 text-[9px] font-semibold text-[#126B63]">Live</span>
        ) : (
          <span className="inline-flex items-center gap-1 rounded-full border border-border bg-muted/50 px-2 py-1 text-[9px] font-semibold text-muted-foreground"><Clock3 className="h-3 w-3" /> Soon</span>
        )}
      </div>

      <p className="mt-4 max-w-[88%] text-[12px] leading-5 text-muted-foreground">{description}</p>

      <div className="mt-4 flex flex-wrap items-center gap-2 text-[10px] text-muted-foreground">
        <span className="rounded-md border border-border bg-background px-2 py-1 font-medium text-foreground">{domain.levelLabel} · {domain.levelRange}</span>
        {domain.hasContent && <><span>{domain.stackCount} stacks</span><span aria-hidden="true">·</span><span>{domain.questionCount.toLocaleString()} questions</span></>}
      </div>

      {domain.hasContent && <div className="mt-5 grid grid-cols-3 gap-1.5" aria-label="Learning path preview"><PathStep label="Learn" color={accent.color}/><PathStep label="Practise" color={accent.color}/><PathStep label="Interview" color={accent.color}/></div>}

      <div className="mt-auto flex items-center justify-between border-t border-border pt-4">
        <span className="text-[11px] font-semibold text-foreground">{domain.hasContent ? "Explore learning path" : "Content in preparation"}</span>
        {domain.hasContent && <ArrowRight className="h-4 w-4 text-muted-foreground transition-transform duration-150 group-hover:translate-x-0.5 group-hover:text-foreground" aria-hidden="true" />}
      </div>
    </article>
  );

  return domain.hasContent ? <Link href={`/${domain.slug}`} className="block h-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#7857D8] focus-visible:ring-offset-2 rounded-2xl">{content}</Link> : content;
}

function PathStep({ label, color }: { label: string; color: string }) {
  return <span className="rounded-lg border border-[#E0E8F1] bg-[#FAFCFE] px-2 py-2 text-center text-[9px] font-semibold text-[#536B8C]"><i className="mx-auto mb-1 block h-1.5 w-1.5 rounded-full" style={{ backgroundColor: color }} />{label}</span>;
}

function DomainGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3" aria-label="Loading interview paths">
      {Array.from({ length: 6 }, (_, index) => <Skeleton key={index} className="h-[238px] rounded-2xl" />)}
    </div>
  );
}

function DomainError({ message, onRetry }: { message: string; onRetry: () => void }) {
  return (
    <div role="alert" className="rounded-2xl border border-[#f0d2c5] bg-[#fff8f4] px-6 py-14 text-center">
      <Compass className="mx-auto h-9 w-9 text-[#D9603B]" aria-hidden="true" />
      <h3 className="mt-3 text-sm font-semibold text-foreground">We couldn’t load the path library</h3>
      <p className="mx-auto mt-2 max-w-md text-[12px] leading-5 text-muted-foreground">{message}</p>
      <button type="button" onClick={onRetry} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg bg-[#126B63] px-4 text-[12px] font-semibold text-white hover:bg-[#0e5b54]"><RotateCcw className="h-4 w-4" /> Try again</button>
    </div>
  );
}

function DomainEmpty({ onClear }: { onClear: () => void }) {
  return (
    <div className="rounded-2xl border border-border bg-card px-6 py-14 text-center">
      <Search className="mx-auto h-9 w-9 text-muted-foreground" aria-hidden="true" />
      <h3 className="mt-3 text-sm font-semibold text-foreground">No paths match these filters</h3>
      <p className="mt-2 text-[12px] text-muted-foreground">Try another language, track, experience level, or search term.</p>
      <button type="button" onClick={onClear} className="mt-5 inline-flex h-10 items-center gap-2 rounded-lg border border-border bg-background px-4 text-[12px] font-semibold text-foreground hover:bg-muted"><X className="h-4 w-4" /> Clear filters</button>
    </div>
  );
}

function formatCount(value: number) {
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k+`;
  return String(value);
}
