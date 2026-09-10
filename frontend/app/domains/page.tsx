"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { type ContentDomain } from "@/lib/types/content-domain";
import { EXPERIENCE_LEVELS, LEVEL_KEYS, type ExperienceLevelKey } from "@/lib/levels";
import { ENABLED_LANGUAGES } from "@/lib/launch-config";
import Link from "next/link";
import {
  Compass, ArrowRight, Filter, ChevronDown, ChevronRight,
  Search, X, BookOpen, Layers, Clock,
  Globe, Server, Code2, Database, Cpu, Briefcase, Home, TrendingUp, Target, Award, Lightbulb,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { TechIcon } from "@/components/tech-icon";

const trackIcon: Record<string, React.ReactNode> = {
  frontend:           <Globe     className="h-4 w-4" />,
  backend:            <Server    className="h-4 w-4" />,
  fullstack:          <Code2     className="h-4 w-4" />,
  'data-engineering': <Database  className="h-4 w-4" />,
  'ml-ai':            <Cpu       className="h-4 w-4" />,
  cicd:               <Cpu       className="h-4 w-4" />,
  cloud:              <Cpu       className="h-4 w-4" />,
  infrastructure:     <Cpu       className="h-4 w-4" />,
  sre:                <Cpu       className="h-4 w-4" />,
  'sql-analytics':    <Database  className="h-4 w-4" />,
  'python-analysis':  <Database  className="h-4 w-4" />,
  visualization:      <Database  className="h-4 w-4" />,
  'case-studies':     <Database  className="h-4 w-4" />,
  analysis:           <Briefcase className="h-4 w-4" />,
};

// Domain track accent colors — categorical identifiers (not UI chrome).
// Mapped to the restrained --chart-* semantic palette (P01-T021): one
// accent family, perceptually distinct, theme-aware. Tracks that shared a
// hue in V1 now share a chart token so the categorical set stays compact.
// We keep the resolved hsl() strings for inline-style accents (the color bar
// + tag tint), since Tailwind can't generate arbitrary chart-token tints
// from a CSS variable at the opacity we need without a util class.
const trackColor: Record<string, string> = {
  frontend:           "hsl(var(--chart-1))",  // indigo
  backend:            "hsl(var(--chart-1))",  // indigo (same family, FE/BE share)
  fullstack:          "hsl(var(--chart-4))",  // violet
  'data-engineering': "hsl(var(--chart-3))",  // amber
  'ml-ai':            "hsl(var(--chart-5))",  // rose
  cicd:               "hsl(var(--chart-2))",  // green
  cloud:              "hsl(var(--chart-1))",  // indigo
  infrastructure:     "hsl(var(--chart-2))",  // green
  sre:                "hsl(var(--chart-2))",  // green
  'sql-analytics':    "hsl(var(--chart-3))",  // amber
  'python-analysis':  "hsl(var(--chart-3))",  // amber
  visualization:      "hsl(var(--chart-4))",  // violet
  'case-studies':     "hsl(var(--chart-3))",  // amber
  analysis:           "hsl(var(--chart-5))",  // rose
};

const LANG_ORDER = [
  "Java", "Python", "JavaScript", "TypeScript", "Go", "Kotlin",
  "C#", "Ruby", "DevOps", "Data Analyst", "Business Analyst",
];

export default function DomainsPage() {
  const searchParams = useSearchParams();
  const langParam = searchParams?.get('language')?.toLowerCase() ?? '';

  const [domains, setDomains]         = useState<ContentDomain[]>([]);
  const [loading, setLoading]         = useState(true);
  const [filters, setFilters]         = useState({ search: "", track: "", level: "", language: langParam });
  const [expandedLang, setExpandedLang] = useState<Record<string, boolean>>({});

  // Sync language filter if URL param changes
  useEffect(() => {
    if (langParam) setFilters(f => ({ ...f, language: langParam }));
  }, [langParam]);

  useEffect(() => {
    fetch("/api/content/all-domains")
      .then(r => r.ok ? r.json() : [])
      .then((data: ContentDomain[]) => {
        // Launch gate: only expose languages listed in launch-config.ts.
        // See ROADMAP.md for the plan to unlock the others.
        const enabled = new Set(
          (ENABLED_LANGUAGES as readonly string[]).map(s => s.toLowerCase())
        );
        const visible = data.filter(d => enabled.has(d.language.toLowerCase()));
        setDomains(visible);
        // Auto-expand matching language or first group
        const firstLang =
          visible.find(d => d.language.toLowerCase() === langParam)?.language
          ?? visible[0]?.language
          ?? '';
        if (firstLang) setExpandedLang({ [firstLang]: true });
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [langParam]);

  // Derive unique tracks from content
  const uniqueTracks = useMemo(() => {
    const seen = new Set<string>();
    return domains
      .filter(d => { const k = d.trackSlug; if (seen.has(k)) return false; seen.add(k); return true; })
      .map(d => ({ slug: d.trackSlug, name: d.track }));
  }, [domains]);

  const filtered = useMemo(() => domains.filter(d => {
    const s = filters.search.toLowerCase();
    return (
      (!s || d.name.toLowerCase().includes(s) || d.language.toLowerCase().includes(s) || d.track.toLowerCase().includes(s)) &&
      (!filters.track    || d.trackSlug === filters.track) &&
      (!filters.level    || d.level === filters.level) &&
      (!filters.language || d.language.toLowerCase() === filters.language.toLowerCase())
    );
  }), [domains, filters]);

  const grouped = useMemo(() =>
    filtered.reduce((acc, d) => {
      if (!acc[d.language]) acc[d.language] = [];
      acc[d.language].push(d);
      return acc;
    }, {} as Record<string, ContentDomain[]>),
  [filtered]);

  const langKeys = useMemo(() => {
    const keys = Object.keys(grouped);
    return keys.sort((a, b) => {
      const ai = LANG_ORDER.indexOf(a);
      const bi = LANG_ORDER.indexOf(b);
      if (ai === -1 && bi === -1) return a.localeCompare(b);
      if (ai === -1) return 1;
      if (bi === -1) return -1;
      return ai - bi;
    });
  }, [grouped]);

  const totalQuestions = useMemo(() => domains.filter(d => d.hasContent).reduce((s, d) => s + d.questionCount, 0), [domains]);
  const liveCount     = useMemo(() => domains.filter(d => d.hasContent).length, [domains]);
  const hasFilter = !!(filters.track || filters.level || filters.search || filters.language);
  const toggle    = (lang: string) => setExpandedLang(p => ({ ...p, [lang]: !p[lang] }));
  const resetAll  = () => setFilters({ search: "", track: "", level: "", language: "" });

  if (loading) return (
    <div className="min-h-screen bg-background">
      <div className="page-container py-16 space-y-6">
        <Skeleton className="h-8 w-40 rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5">
          <Skeleton className="h-96 rounded-lg" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-lg" />)}
          </div>
          <Skeleton className="hidden lg:block h-96 rounded-lg" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="page-container py-14 sm:py-16">

        {/* Breadcrumb */}
        <nav className="mb-6 flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/" className="flex items-center gap-1 transition-colors hover:text-foreground">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="font-semibold text-foreground">Learning Paths</span>
        </nav>

        {/* Hero */}
        <header className="mb-10">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
            <Compass className="h-3.5 w-3.5" />
            Interview Preparation Hub
          </span>
          <h1 className="type-display text-foreground mt-4">
            Choose Your Learning Path
          </h1>
          <p className="reading-container type-body mt-5 text-muted-foreground">
            Master technical interviews with <span className="font-semibold text-foreground">domain-specific questions</span> tailored
            to your <span className="font-semibold text-foreground">tech stack</span> and <span className="font-semibold text-foreground">experience level</span>.
          </p>

          {/* Stat band — hairline grid, like the homepage trust band */}
          <dl className="mt-8 grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border/60 bg-border/60 sm:grid-cols-4">
            <div className="bg-card px-5 py-4">
              <dd className="font-display text-2xl font-bold tabular-nums text-primary">{liveCount}</dd>
              <dt className="type-label mt-1 text-muted-foreground">Live Paths</dt>
            </div>
            <div className="bg-card px-5 py-4">
              <dd className="font-display text-2xl font-bold tabular-nums text-primary">
                {totalQuestions > 1000 ? `${(totalQuestions / 1000).toFixed(1)}k+` : totalQuestions}
              </dd>
              <dt className="type-label mt-1 text-muted-foreground">Questions</dt>
            </div>
            <div className="bg-card px-5 py-4">
              <dd className="font-display text-2xl font-bold tabular-nums text-primary">{domains.length}</dd>
              <dt className="type-label mt-1 text-muted-foreground">Total Paths</dt>
            </div>
            <div className="bg-card px-5 py-4">
              <dd className="font-display text-2xl font-bold tabular-nums text-primary">{langKeys.length}</dd>
              <dt className="type-label mt-1 text-muted-foreground">Languages</dt>
            </div>
          </dl>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-6">

          {/* ── Left Filter Sidebar ── */}
          <aside className="space-y-5">
            <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
              <div className="flex items-center gap-2 border-b border-border/60 bg-surface px-4 py-3">
                <Filter className="h-3.5 w-3.5 text-primary" />
                <h3 className="type-label text-foreground">Filter Your Path</h3>
              </div>

              <div className="space-y-5 p-4">
                {/* Language */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Code2 className="h-3 w-3 text-primary" /> Programming Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}
                    className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm font-medium text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                  >
                    <option value="">All Languages ({langKeys.length})</option>
                    {langKeys.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Search className="h-3 w-3 text-primary" /> Search Paths
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Find a path..."
                      value={filters.search}
                      onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                      className="h-10 w-full rounded-lg border border-border bg-background pl-10 pr-3 text-sm font-medium text-foreground transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/10"
                    />
                  </div>
                </div>

                {/* Track */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <Layers className="h-3 w-3 text-primary" /> Career Track
                  </label>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setFilters(f => ({ ...f, track: "" }))}
                      className={cn("w-full rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors",
                        filters.track === "" ? "bg-primary text-primary-foreground" : "border border-border/60 text-muted-foreground hover:bg-surface"
                      )}>All Tracks</button>
                    {uniqueTracks.map(t => {
                      const color  = trackColor[t.slug] ?? "hsl(var(--muted-foreground))";
                      const icon   = trackIcon[t.slug] ?? <Layers className="h-4 w-4" />;
                      const active = filters.track === t.slug;
                      return (
                        <button key={t.slug}
                          onClick={() => setFilters(f => ({ ...f, track: active ? "" : t.slug }))}
                          className={cn("flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-xs font-bold transition-colors",
                            active ? "bg-primary text-primary-foreground" : "border border-border/60 text-muted-foreground hover:bg-surface"
                          )}
                        >
                          <span style={{ color: active ? "inherit" : color }}>{icon}</span>
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Level — 2-level model */}
                <div>
                  <label className="mb-2 flex items-center gap-1.5 text-xs font-bold text-muted-foreground">
                    <TrendingUp className="h-3 w-3 text-primary" /> Experience Level
                  </label>
                  <div className="space-y-1.5">
                    {LEVEL_KEYS.map(key => {
                      const meta   = EXPERIENCE_LEVELS[key];
                      const active = filters.level === key;
                      return (
                        <button key={key}
                          onClick={() => setFilters(f => ({ ...f, level: active ? "" : key }))}
                          className={cn("flex w-full items-center gap-2.5 rounded-lg border px-3 py-2 text-xs font-bold transition-colors",
                            active ? "border-transparent bg-primary text-primary-foreground" : "border-border/60 bg-card text-muted-foreground hover:bg-surface"
                          )}
                        >
                          <span className="inline-block h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: meta.color }} />
                          <span>{meta.label}</span>
                          <span className={cn("ml-auto text-[11px] font-normal", active ? "text-primary-foreground/80" : "text-muted-foreground")}>
                            {meta.range}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {hasFilter && (
                <div className="border-t border-border/60 bg-surface px-4 py-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-medium text-muted-foreground">
                      Showing <span className="font-extrabold text-foreground">{filtered.length}</span> of {domains.length}
                    </span>
                    <button onClick={resetAll} className="font-bold text-primary hover:text-primary/80">Clear All</button>
                  </div>
                </div>
              )}
            </div>

            {/* Study Roadmap */}
            <div className="rounded-lg border border-border/60 bg-surface p-4">
              <h4 className="type-label mb-3 flex items-center gap-2 text-foreground">
                <BookOpen className="h-4 w-4 text-primary" /> Study Roadmap
              </h4>
              <div className="space-y-2.5">
                {["Select your language", "Match experience level", "Complete one path fully"].map((step, i) => (
                  <div key={step} className="flex items-start gap-2 rounded-lg border border-border/60 bg-card p-2">
                    <div className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full font-bold",
                      i < 2 ? "border border-primary/30 bg-primary/10 text-primary" : "border border-success/30 bg-success/10 text-success"
                    )}>{i + 1}</div>
                    <p className="text-xs font-medium text-muted-foreground">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="space-y-5">
            {/* Active Filter Pills */}
            {hasFilter && (
              <div className="flex flex-wrap gap-2">
                {filters.language && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-foreground">
                    <TechIcon name={filters.language.toLowerCase()} className="h-3 w-3" />
                    {filters.language}
                    <button onClick={() => setFilters(f => ({ ...f, language: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-foreground">
                    &ldquo;{filters.search}&rdquo;
                    <button onClick={() => setFilters(f => ({ ...f, search: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.track && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-foreground">
                    {uniqueTracks.find(t => t.slug === filters.track)?.name ?? filters.track}
                    <button onClick={() => setFilters(f => ({ ...f, track: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.level && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-border/60 bg-card px-3 py-1 text-xs font-medium text-foreground">
                    {EXPERIENCE_LEVELS[filters.level as ExperienceLevelKey]?.label}
                    <button onClick={() => setFilters(f => ({ ...f, level: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Quick Jump */}
            {!hasFilter && langKeys.length > 0 && (
              <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
                <div className="flex items-center gap-2 border-b border-border/60 bg-surface px-4 py-3">
                  <Code2 className="h-4 w-4 text-primary" />
                  <h3 className="type-label text-foreground">Quick Jump by Language</h3>
                </div>
                <div className="flex flex-wrap gap-2 p-4">
                  {langKeys.map(lang => {
                    const liveInLang = (grouped[lang] ?? []).filter(d => d.hasContent).length;
                    const totalInLang = grouped[lang]?.length ?? 0;
                    return (
                      <button key={lang}
                        onClick={() => {
                          setExpandedLang(p => ({ ...p, [lang]: !p[lang] }));
                          setTimeout(() => document.getElementById(`lang-${lang}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
                        }}
                        className={cn("inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-bold transition-colors",
                          expandedLang[lang] ? "border-primary bg-primary text-primary-foreground" : "border-border/60 bg-card text-muted-foreground hover:bg-surface"
                        )}
                      >
                        <TechIcon name={lang.toLowerCase()} className="h-4 w-4" />
                        {lang}
                        <span className={cn("rounded-full px-2 py-0.5 text-xs font-bold", expandedLang[lang] ? "bg-primary-foreground/20" : "bg-surface text-muted-foreground")}>
                          {liveInLang > 0 ? `${liveInLang}/${totalInLang}` : "Soon"}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Language Sections */}
            <div className="space-y-4">
              {langKeys.map(lang => (
                <div key={lang} id={`lang-${lang}`} className="overflow-hidden rounded-lg border border-border/60 bg-card">
                  <button onClick={() => toggle(lang)}
                    className="flex w-full items-center justify-between border-none px-5 py-4 transition-colors hover:bg-surface/50">
                    <div className="flex items-center gap-4">
                      <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-border/60 bg-surface">
                        <TechIcon name={lang.toLowerCase()} className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-semibold text-foreground">{lang}</h2>
                        <p className="text-xs font-medium text-muted-foreground">
                          {grouped[lang].filter(d => d.hasContent).length} live · {grouped[lang].filter(d => !d.hasContent).length} coming soon
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="rounded-lg border border-border/60 bg-surface px-3 py-1.5 text-xs font-bold text-muted-foreground">
                        {grouped[lang].length} paths
                      </span>
                      <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-200", expandedLang[lang] && "rotate-180 text-primary")} />
                    </div>
                  </button>

                  {expandedLang[lang] && (
                    <div className="animate-fade-in-up overflow-hidden" style={{ animationDuration: '0.25s' }}>
                      <div className="grid grid-cols-1 gap-4 border-t border-border/60 bg-surface/30 px-4 pb-4 pt-4 sm:grid-cols-2">
                        {grouped[lang].map((domain, idx) => (
                          <DomainCard key={domain.slug} domain={domain} index={idx} />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {filtered.length === 0 && !loading && (
              <div className="rounded-lg border border-border/60 bg-card py-16 text-center">
                <Compass className="mx-auto mb-3 h-10 w-10 text-muted-foreground" />
                <h3 className="text-sm font-semibold text-foreground">No paths found</h3>
                <p className="mt-1 text-sm text-muted-foreground">Try adjusting your filters</p>
                <button onClick={resetAll} className="mt-4 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="hidden space-y-5 lg:block">
            {/* Experience Level Guide */}
            <div className="overflow-hidden rounded-lg border border-border/60 bg-card">
              <div className="flex items-center gap-2 border-b border-border/60 bg-surface px-4 py-3">
                <TrendingUp className="h-3.5 w-3.5 text-primary" />
                <h3 className="type-label text-foreground">Experience Levels</h3>
              </div>
              <div className="space-y-2 p-3">
                {LEVEL_KEYS.map(key => {
                  const meta = EXPERIENCE_LEVELS[key];
                  const descs: Record<ExperienceLevelKey, string> = {
                    beginner:     "Core fundamentals & basics",
                    intermediate: "Architecture & real-world patterns",
                  };
                  return (
                    <button key={key}
                      onClick={() => setFilters(f => ({ ...f, level: f.level === key ? "" : key }))}
                      className={cn("flex w-full items-center gap-3 rounded-lg border px-3 py-2.5 text-left transition-colors",
                        filters.level === key ? "border-primary bg-surface" : "border-transparent hover:bg-surface"
                      )}
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg text-[11px] font-bold text-primary-foreground"
                        style={{ backgroundColor: meta.color }}>
                        {meta.range}
                      </div>
                      <div className="flex-1">
                        <div className="text-xs font-bold text-foreground">{meta.label}</div>
                        <div className="text-[11px] text-muted-foreground">{descs[key]}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Interview Focus */}
            <div className="rounded-lg border border-border/60 bg-surface p-4">
              <h4 className="type-label mb-3 flex items-center gap-2 text-foreground">
                <Target className="h-4 w-4 text-primary" /> Interview Focus Areas
              </h4>
              <div className="space-y-2">
                {["Core Concepts", "System Design", "Trade-offs", "Real-world"].map(label => (
                  <div key={label} className="rounded-lg border border-border/60 bg-card px-3 py-2 text-xs font-semibold text-foreground">
                    {label}
                  </div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="rounded-lg border border-border/60 bg-surface p-4">
              <div className="type-label mb-2 flex items-center gap-2 text-foreground">
                <Lightbulb className="h-4 w-4 text-primary" />
                Pro Study Tip
              </div>
              <p className="rounded-lg border border-border/60 bg-card p-3 text-xs leading-relaxed text-muted-foreground">
                Focus on completing one path thoroughly before moving to another.{" "}
                <span className="font-bold text-foreground">Depth beats breadth</span> in technical interviews.
              </p>
            </div>

            {/* Platform Stats */}
            <div className="rounded-lg border border-border/60 bg-surface p-4">
              <h4 className="type-label mb-3 flex items-center gap-2 text-foreground">
                <Award className="h-4 w-4 text-primary" /> Platform Stats
              </h4>
              <div className="space-y-2">
                {[
                  { label: "Live Paths",       value: liveCount },
                  { label: "Coming Soon",      value: domains.length - liveCount },
                  { label: "Questions",        value: totalQuestions > 1000 ? `${(totalQuestions / 1000).toFixed(1)}k+` : totalQuestions },
                  { label: "Exp. Levels",      value: 2 },
                ].map(s => (
                  <div key={s.label} className="flex items-center justify-between rounded-lg border border-border/60 bg-card p-2 text-xs">
                    <span className="font-medium text-muted-foreground">{s.label}</span>
                    <span className="font-semibold text-primary">{s.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function DomainCard({ domain, index = 0 }: { domain: ContentDomain; index?: number }) {
  const color  = trackColor[domain.trackSlug] ?? "hsl(var(--muted-foreground))";
  const meta   = EXPERIENCE_LEVELS[domain.level];

  const brief: Record<ExperienceLevelKey, string> = {
    beginner:     `Fundamentals & core concepts for ${domain.language} ${domain.track} developers.`,
    intermediate: `Architecture, patterns & real-world scenarios for ${domain.language} ${domain.track}.`,
  };

  const cardInner = (
    <div className={cn(
      "h-full rounded-lg border p-5 transition-colors",
      domain.hasContent
        ? "border-border/60 bg-card hover:border-primary/30 group"
        : "border-dashed border-border/60 bg-surface opacity-60 cursor-default"
    )}>
      <div className="mb-3 flex items-start justify-between">
        <div className="mt-1 h-1 w-8 rounded-full" style={{ backgroundColor: domain.hasContent ? color : "hsl(var(--muted-foreground))" }} />
        {!domain.hasContent && (
          <span className="inline-flex items-center gap-1 rounded-full border border-border/60 bg-surface px-2 py-0.5 text-[10px] font-bold text-muted-foreground">
            <Clock className="h-2.5 w-2.5" /> Coming Soon
          </span>
        )}
      </div>

      <div className="mb-3 flex flex-wrap items-center gap-2">
        <span className="rounded px-2 py-0.5 text-xs font-semibold"
          style={{ color: domain.hasContent ? color : "hsl(var(--muted-foreground))", backgroundColor: (domain.hasContent ? color : "currentColor") + "15" }}>
          {domain.track}
        </span>
        <span className={cn("rounded border px-2 py-0.5 text-xs font-semibold",
          domain.hasContent ? "border-border/60 bg-surface text-foreground" : "border-border/60 bg-surface text-muted-foreground"
        )}>
          {meta.label} · {meta.range}
        </span>
      </div>

      <h3 className={cn("mb-1 text-sm font-semibold",
        domain.hasContent ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
      )}>
        {domain.name}
      </h3>
      <p className="text-xs leading-relaxed text-muted-foreground">
        {brief[domain.level]}
      </p>

      {domain.hasContent ? (
        <>
          <div className="mb-4 flex items-center gap-3 text-[11px] font-medium text-muted-foreground">
            <span>{domain.stackCount} stacks</span>
            <span>·</span>
            <span>{domain.questionCount.toLocaleString()} questions</span>
          </div>
          <div className="flex items-center justify-between border-t border-border/60 pt-3">
            <span className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
              <BookOpen className="h-3.5 w-3.5" /> View Stacks
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition-colors group-hover:text-foreground" />
          </div>
        </>
      ) : (
        <div className="border-t border-border/60 pt-3">
          <p className="text-[11px] text-muted-foreground">Content in preparation — check back soon.</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="h-full">
      {domain.hasContent
        ? <Link href={`/${domain.slug}`} className="block h-full">{cardInner}</Link>
        : <div className="h-full">{cardInner}</div>
      }
    </div>
  );
}
