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
  Globe, Server, Code2, Database, Cpu, Briefcase, Home, TrendingUp, Target, Award, Lightbulb
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

const trackColor: Record<string, string> = {
  frontend:           "#6366f1",
  backend:            "#0ea5e9",
  fullstack:          "#8b5cf6",
  'data-engineering': "#f59e0b",
  'ml-ai':            "#ec4899",
  cicd:               "#10b981",
  cloud:              "#0ea5e9",
  infrastructure:     "#10b981",
  sre:                "#14b8a6",
  'sql-analytics':    "#f59e0b",
  'python-analysis':  "#f59e0b",
  visualization:      "#a855f7",
  'case-studies':     "#f97316",
  analysis:           "#ef4444",
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
    <div className="min-h-screen bg-surface">
      <div className="w-full min-w-0 py-16 px-6 lg:px-12 xl:px-20 space-y-6">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5">
          <Skeleton className="h-96 rounded-2xl" />
          <div className="space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
          <Skeleton className="hidden lg:block h-96 rounded-2xl" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background font-sans text-foreground">
      <div className="w-full min-w-0 px-6 py-6">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors flex items-center gap-1">
            <Home className="h-3 w-3" /> Home
          </Link>
          <ChevronRight className="h-3 w-3" />
          <span className="text-foreground font-semibold">Learning Paths</span>
        </nav>

        {/* Hero */}
        <header className="mb-6 bg-card rounded-xl border border-border shadow-sm overflow-hidden">
          <div className="relative px-6 py-5 bg-gradient-to-br from-surface to-background border-b border-border">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1">
                <div className="flex items-center gap-2 text-[11px] font-bold text-primary uppercase tracking-wide mb-2">
                  <Compass className="h-3.5 w-3.5" />
                  Interview Preparation Hub
                </div>
                <h1 className="text-3xl font-semibold text-foreground mb-2 tracking-tight">
                  Choose Your Learning Path
                </h1>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
                  Master technical interviews with <span className="font-bold text-foreground">domain-specific questions</span> tailored
                  to your <span className="font-bold text-foreground">tech stack</span> and <span className="font-bold text-foreground">experience level</span>.
                </p>
              </div>
              <div className="flex gap-3 shrink-0">
                <div className="text-center px-5 py-3 bg-primary/10 rounded-xl border border-primary/20">
                  <div className="text-[11px] text-primary font-semibold mb-1">Live Paths</div>
                  <div className="text-2xl font-black text-primary">{liveCount}</div>
                </div>
                <div className="text-center px-5 py-3 bg-success/10 rounded-xl border border-success/20">
                  <div className="text-[11px] text-success font-semibold mb-1">Questions</div>
                  <div className="text-2xl font-black text-success">{totalQuestions > 1000 ? `${(totalQuestions / 1000).toFixed(1)}k+` : totalQuestions}</div>
                </div>
              </div>
            </div>
          </div>

          {/* How It Works */}
          <div className="px-6 py-3 bg-surface border-t border-border">
            <div className="flex flex-wrap items-center justify-center gap-4 gap-y-3">
              {[
                { n: 1, text: "Select Language",  sub: "Choose your stack" },
                { n: 2, text: "Match Your Level", sub: "Fresher / Intermediate" },
                { n: 3, text: "Start Learning",   sub: "Access questions instantly" },
              ].map(({ n, text, sub }, i) => (
                <React.Fragment key={n}>
                  {i > 0 && <div className="text-muted-foreground/30 text-lg hidden sm:block">→</div>}
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-lg bg-primary/10 border border-primary/20 text-primary font-bold flex items-center justify-center text-xs shrink-0">{n}</div>
                    <div>
                      <div className="text-xs font-bold text-foreground">{text}</div>
                      <div className="text-[11px] text-muted-foreground">{sub}</div>
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[280px_1fr_280px] gap-5">

          {/* ── Left Filter Sidebar ── */}
          <aside className="space-y-4">
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-surface border-b border-border">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-primary" />
                  Filter Your Path
                </h3>
              </div>

              <div className="p-4 space-y-4">
                {/* Language */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Code2 className="h-3 w-3 text-primary" /> Programming Language
                  </label>
                  <select
                    value={filters.language}
                    onChange={e => setFilters(f => ({ ...f, language: e.target.value }))}
                    className="w-full bg-background border border-border rounded-lg h-10 px-3 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all text-foreground"
                  >
                    <option value="">All Languages ({langKeys.length})</option>
                    {langKeys.map(lang => <option key={lang} value={lang}>{lang}</option>)}
                  </select>
                </div>

                {/* Search */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Search className="h-3 w-3 text-primary" /> Search Paths
                  </label>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                      type="text"
                      placeholder="Find a path..."
                      value={filters.search}
                      onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                      className="w-full bg-background border border-border rounded-lg h-10 pl-10 pr-3 text-sm font-medium focus:border-primary focus:ring-2 focus:ring-primary/10 focus:outline-none transition-all text-foreground"
                    />
                  </div>
                </div>

                {/* Track */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Layers className="h-3 w-3 text-primary" /> Career Track
                  </label>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => setFilters(f => ({ ...f, track: "" }))}
                      className={cn("w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all",
                        filters.track === "" ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-hover border border-border"
                      )}>All Tracks</button>
                    {uniqueTracks.map(t => {
                      const color  = trackColor[t.slug] ?? "#64748b";
                      const icon   = trackIcon[t.slug] ?? <Layers className="h-4 w-4" />;
                      const active = filters.track === t.slug;
                      return (
                        <button key={t.slug}
                          onClick={() => setFilters(f => ({ ...f, track: active ? "" : t.slug }))}
                          className={cn("w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2",
                            active ? "bg-primary text-primary-foreground shadow-sm" : "text-muted-foreground hover:bg-hover border border-border"
                          )}
                        >
                          <span style={{ color: active ? "inherit" : color }}>{icon}</span>
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Level — new 3-level model */}
                <div>
                  <label className="text-xs font-bold text-muted-foreground mb-2 flex items-center gap-1.5">
                    <TrendingUp className="h-3 w-3 text-primary" /> Experience Level
                  </label>
                  <div className="space-y-1.5">
                    {LEVEL_KEYS.map(key => {
                      const meta   = EXPERIENCE_LEVELS[key];
                      const active = filters.level === key;
                      return (
                        <button key={key}
                          onClick={() => setFilters(f => ({ ...f, level: active ? "" : key }))}
                          className={cn("w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold border transition-all",
                            active ? "bg-primary text-primary-foreground shadow-sm border-transparent" : "bg-card border-border text-muted-foreground hover:bg-hover"
                          )}
                        >
                          <span className={cn("inline-block w-2 h-2 rounded-full shrink-0")} style={{ backgroundColor: meta.color }} />
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
                <div className="px-4 py-3 bg-surface border-t border-border">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-muted-foreground font-medium">
                      Showing <span className="font-black text-foreground">{filtered.length}</span> of {domains.length}
                    </span>
                    <button onClick={resetAll} className="text-primary hover:text-primary/80 font-bold">Clear All</button>
                  </div>
                </div>
              )}
            </div>

            {/* Study Roadmap */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <BookOpen className="h-4 w-4 text-primary" /> Study Roadmap
              </h4>
              <div className="space-y-2.5">
                {["Select your language", "Match experience level", "Complete one path fully"].map((step, i) => (
                  <div key={step} className="flex items-start gap-2 bg-card rounded-lg p-2 border border-border">
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center text-primary-foreground font-bold shrink-0 ${
                      i === 0 ? "bg-primary/20 text-primary border border-primary/30" :
                      i === 1 ? "bg-primary/20 text-primary border border-primary/30" :
                                "bg-success/20 text-success border border-success/30"
                    }`}>{i + 1}</div>
                    <p className="text-xs text-muted-foreground font-medium">{step}</p>
                  </div>
                ))}
              </div>
            </div>
          </aside>

          {/* ── Main Content ── */}
          <div className="space-y-4">
            {/* Active Filter Pills */}
            {hasFilter && (
              <div className="flex flex-wrap gap-2">
                {filters.language && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-border rounded-full text-xs font-medium text-foreground">
                    <TechIcon name={filters.language.toLowerCase()} className="h-3 w-3" />
                    {filters.language}
                    <button onClick={() => setFilters(f => ({ ...f, language: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.search && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-border rounded-full text-xs font-medium text-foreground">
                    "{filters.search}"
                    <button onClick={() => setFilters(f => ({ ...f, search: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.track && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-border rounded-full text-xs font-medium text-foreground">
                    {uniqueTracks.find(t => t.slug === filters.track)?.name ?? filters.track}
                    <button onClick={() => setFilters(f => ({ ...f, track: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.level && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-card border border-border rounded-full text-xs font-medium text-foreground">
                    {EXPERIENCE_LEVELS[filters.level as ExperienceLevelKey]?.label}
                    <button onClick={() => setFilters(f => ({ ...f, level: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Quick Jump */}
            {!hasFilter && langKeys.length > 0 && (
              <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div className="px-4 py-3 bg-surface border-b border-border">
                  <div className="flex items-center gap-2">
                    <Code2 className="h-4 w-4 text-primary" />
                    <h3 className="text-xs font-bold text-foreground uppercase tracking-wide">Quick Jump by Language</h3>
                  </div>
                </div>
                <div className="p-4 flex flex-wrap gap-2">
                  {langKeys.map(lang => {
                    const liveInLang = (grouped[lang] ?? []).filter(d => d.hasContent).length;
                    const totalInLang = grouped[lang]?.length ?? 0;
                    return (
                      <button key={lang}
                        onClick={() => {
                          setExpandedLang(p => ({ ...p, [lang]: !p[lang] }));
                          setTimeout(() => document.getElementById(`lang-${lang}`)?.scrollIntoView({ behavior: "smooth", block: "start" }), 100);
                        }}
                        className={cn("inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold border transition-all shadow-sm",
                          expandedLang[lang] ? "bg-primary text-primary-foreground border-primary scale-105" : "bg-card border-border text-muted-foreground hover:bg-hover"
                        )}
                      >
                        <TechIcon name={lang.toLowerCase()} className="h-4 w-4" />
                        {lang}
                        <span className={cn("text-xs font-bold px-2 py-0.5 rounded-full", expandedLang[lang] ? "bg-primary-foreground/20" : "bg-surface text-muted-foreground")}>
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
                <div key={lang} id={`lang-${lang}`} className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                  <button onClick={() => toggle(lang)}
                    className="w-full flex items-center justify-between px-5 py-4 hover:bg-surface/50 transition-all border-none">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-xl bg-surface flex items-center justify-center shadow-sm border border-border">
                        <TechIcon name={lang.toLowerCase()} className="h-6 w-6" />
                      </div>
                      <div className="text-left">
                        <h2 className="text-lg font-semibold text-foreground">{lang}</h2>
                        <p className="text-xs text-muted-foreground font-medium">
                          {grouped[lang].filter(d => d.hasContent).length} live · {grouped[lang].filter(d => !d.hasContent).length} coming soon
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1.5 rounded-lg bg-surface border border-border text-xs font-bold text-muted-foreground">
                        {grouped[lang].length} paths
                      </span>
                      <ChevronDown className={cn("h-5 w-5 text-muted-foreground transition-transform duration-300", expandedLang[lang] && "rotate-180 text-primary")} />
                    </div>
                  </button>

                  {expandedLang[lang] && (
                    <div className="animate-fade-in-up overflow-hidden" style={{ animationDuration: '0.25s' }}>
                      <div className="px-4 pb-4 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-border bg-surface/30">
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
              <div className="text-center py-16 bg-card rounded-xl border border-border shadow-sm">
                <Compass className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
                <h3 className="text-sm font-semibold text-foreground">No paths found</h3>
                <p className="text-sm text-muted-foreground mt-1">Try adjusting your filters</p>
                <button onClick={resetAll} className="mt-4 px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity">
                  Clear Filters
                </button>
              </div>
            )}
          </div>

          {/* ── Right Sidebar ── */}
          <aside className="hidden lg:block space-y-4">
            {/* Experience Level Guide */}
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
              <div className="px-4 py-3 bg-surface border-b border-border">
                <h3 className="text-xs font-bold text-foreground uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="h-3.5 w-3.5 text-primary" /> Experience Levels
                </h3>
              </div>
              <div className="p-3 space-y-2">
                {LEVEL_KEYS.map(key => {
                  const meta = EXPERIENCE_LEVELS[key];
                  const descs: Record<ExperienceLevelKey, string> = {
                    beginner:     "Core fundamentals & basics",
                    intermediate: "Architecture & real-world patterns",
                  };
                  return (
                    <button key={key}
                      onClick={() => setFilters(f => ({ ...f, level: f.level === key ? "" : key }))}
                      className={cn("w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all text-left border",
                        filters.level === key ? "border-primary bg-surface shadow-sm" : "border-transparent hover:bg-hover"
                      )}
                    >
                      <div className="w-10 h-10 rounded-lg flex items-center justify-center shadow-md text-primary-foreground text-[11px] font-bold shrink-0"
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
            <div className="bg-surface rounded-xl border border-border shadow-sm p-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Target className="h-4 w-4 text-primary" /> Interview Focus Areas
              </h4>
              <div className="space-y-2">
                {[
                  { label: "Core Concepts",  color: "bg-surface border-border text-foreground" },
                  { label: "System Design",  color: "bg-surface border-border text-foreground" },
                  { label: "Trade-offs",     color: "bg-surface border-border text-foreground" },
                  { label: "Real-world",     color: "bg-surface border-border text-foreground" },
                ].map(s => (
                  <div key={s.label} className={`text-xs font-semibold ${s.color} border rounded-lg px-3 py-2 shadow-sm`}>{s.label}</div>
                ))}
              </div>
            </div>

            {/* Pro Tip */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-4">
              <div className="text-xs font-bold text-foreground uppercase tracking-wide mb-2 flex items-center gap-2">
                <Lightbulb className="h-4 w-4 text-primary" />
                Pro Study Tip
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed bg-card rounded-lg p-3 border border-border">
                Focus on completing one path thoroughly before moving to another.{" "}
                <span className="font-bold text-foreground">Depth beats breadth</span> in technical interviews.
              </p>
            </div>

            {/* Platform Stats */}
            <div className="bg-surface rounded-xl border border-border shadow-sm p-4">
              <h4 className="text-xs font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
                <Award className="h-4 w-4 text-primary" /> Platform Stats
              </h4>
              <div className="space-y-2">
                {[
                  { label: "Live Paths",       value: liveCount },
                  { label: "Coming Soon",      value: domains.length - liveCount },
                  { label: "Questions",        value: totalQuestions > 1000 ? `${(totalQuestions / 1000).toFixed(1)}k+` : totalQuestions },
                  { label: "Exp. Levels",      value: 2 },
                ].map(s => (
                  <div key={s.label} className="flex justify-between items-center text-xs bg-card rounded-lg p-2 border border-border">
                    <span className="text-muted-foreground font-medium">{s.label}</span>
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
  const color  = trackColor[domain.trackSlug] ?? "#64748b";
  const meta   = EXPERIENCE_LEVELS[domain.level];

  const brief: Record<ExperienceLevelKey, string> = {
    beginner:     `Fundamentals & core concepts for ${domain.language} ${domain.track} developers.`,
    intermediate: `Architecture, patterns & real-world scenarios for ${domain.language} ${domain.track}.`,
  };

  const cardInner = (
    <div className={cn(
      "h-full border rounded-lg p-4 transition-all",
      domain.hasContent
        ? "bg-card border-border hover:bg-hover/30 hover:border-muted-foreground/30 shadow-sm group"
        : "bg-surface border-border border-dashed opacity-50 cursor-default"
    )}>
      <div className="flex items-start justify-between mb-2">
        <div className="h-1 w-8 rounded-full mt-1" style={{ backgroundColor: domain.hasContent ? color : "hsl(var(--muted-foreground))" }} />
        {!domain.hasContent && (
          <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-surface border border-border text-muted-foreground">
            <Clock className="h-2.5 w-2.5" /> Coming Soon
          </span>
        )}
      </div>

      <div className="flex items-center gap-2 mb-2 flex-wrap">
        <span className="text-xs font-semibold px-2 py-0.5 rounded"
          style={{ color: domain.hasContent ? color : "hsl(var(--muted-foreground))", backgroundColor: (domain.hasContent ? color : "currentColor") + "15" }}>
          {domain.track}
        </span>
        <span className={cn("text-xs font-semibold px-2 py-0.5 rounded border",
          domain.hasContent ? "bg-surface border-border text-foreground" : "bg-surface text-muted-foreground border-border"
        )}>
          {meta.label} · {meta.range}
        </span>
      </div>

      <h3 className={cn("text-sm font-semibold mb-1",
        domain.hasContent ? "text-foreground group-hover:text-primary" : "text-muted-foreground"
      )}>
        {domain.name}
      </h3>
      <p className={cn("text-xs leading-relaxed mb-3", domain.hasContent ? "text-muted-foreground" : "text-muted-foreground")}>
        {brief[domain.level]}
      </p>

      {domain.hasContent ? (
        <>
          <div className="flex items-center gap-3 text-[11px] text-muted-foreground font-medium mb-3">
            <span>{domain.stackCount} stacks</span>
            <span>·</span>
            <span>{domain.questionCount.toLocaleString()} questions</span>
          </div>
          <div className="flex items-center justify-between pt-3 border-t border-border">
            <span className="text-xs font-medium text-muted-foreground flex items-center gap-1.5">
              <BookOpen className="h-3.5 w-3.5" /> View Stacks
            </span>
            <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </>
      ) : (
        <div className="pt-3 border-t border-border">
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

