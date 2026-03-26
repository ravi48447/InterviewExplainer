"use client";

import React, { useEffect, useState, useMemo } from "react";
import { fetchDomains, fetchTracks, fetchExperienceLevels, Domain, Track, ExperienceLevel } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Compass, ArrowRight, Filter, ChevronDown,
  Search, X, BookOpen, Layers,
  Globe, Server, Code2, Database, Cpu, Briefcase
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const trackIcon: Record<string, React.ReactNode> = {
  frontend: <Globe className="h-3.5 w-3.5" />,
  backend: <Server className="h-3.5 w-3.5" />,
  fullstack: <Code2 className="h-3.5 w-3.5" />,
  data: <Database className="h-3.5 w-3.5" />,
  devops: <Cpu className="h-3.5 w-3.5" />,
  business: <Briefcase className="h-3.5 w-3.5" />,
};
const trackColor: Record<string, string> = {
  frontend: "#6366f1",
  backend: "#0ea5e9",
  fullstack: "#8b5cf6",
  data: "#f59e0b",
  devops: "#10b981",
  business: "#ef4444",
};

export default function DomainsPage() {
  const [domains, setDomains] = useState<Domain[]>([]);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [expLevels, setExpLevels] = useState<ExperienceLevel[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ search: "", track: "", experience: "" });
  const [expandedLang, setExpandedLang] = useState<Record<string, boolean>>({});

  useEffect(() => {
    const load = async () => {
      try {
        const [d, t, e] = await Promise.all([fetchDomains(), fetchTracks(), fetchExperienceLevels()]);
        setDomains(d); setTracks(t); setExpLevels(e);
        // Do NOT auto-expand any section — let the user choose
      } catch (err) { console.error(err); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const filtered = useMemo(() => domains.filter(d => {
    const s = filters.search.toLowerCase();
    const matchesSearch = !s || d.name.toLowerCase().includes(s) || (d.language?.toLowerCase() ?? "").includes(s);
    return matchesSearch &&
      (!filters.track || d.trackSlug === filters.track) &&
      (!filters.experience || d.experienceLabel === filters.experience);
  }), [domains, filters]);

  // Popularity order — most-used first; unknowns go to end
  const LANG_ORDER = ["Python", "JavaScript", "Java", "TypeScript", "React", "Go", "C++", "Ruby", "Business Analyst", "Other"];

  const grouped = useMemo(() => filtered.reduce((acc, d) => {
    const raw = d.language;
    // null / "na" / empty → show as "Business Analyst"
    const k = (!raw || raw.toLowerCase() === "na") ? "Business Analyst" : raw;
    if (!acc[k]) acc[k] = [];
    acc[k].push(d);
    return acc;
  }, {} as Record<string, Domain[]>), [filtered]);

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
  const uniqueExp = useMemo(() =>
    expLevels.filter((e, i, self) => self.findIndex(s => s.label === e.label) === i),
    [expLevels]);
  const hasFilter = !!(filters.track || filters.experience || filters.search);
  const toggle = (lang: string) => setExpandedLang(p => ({ ...p, [lang]: !p[lang] }));
  const resetAll = () => setFilters({ search: "", track: "", experience: "" });

  if (loading) return (
    <div className="min-h-screen bg-[#fafafa]">
      <div className="max-w-[1200px] mx-auto py-16 px-6 space-y-6">
        <Skeleton className="h-8 w-40 rounded-xl" />
        <div className="grid grid-cols-4 gap-8">
          <Skeleton className="h-80 col-span-1 rounded-2xl" />
          <div className="col-span-3 space-y-4">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#fafafa] font-sans text-slate-800 selection:bg-blue-100">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-8 py-10">

        {/* ─── HERO HEADER ─── */}
        <header className="mb-10 rounded-[18px] bg-white border border-slate-200 shadow-sm overflow-hidden relative">
          <div className="absolute -right-24 -top-24 w-96 h-96 bg-[#2e64e5]/5 rounded-full blur-3xl pointer-events-none" />
          {/* Main row */}
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 px-8 pt-8 pb-6">
            <div>
              <div className="flex items-center gap-2 text-[#2e64e5] font-bold uppercase tracking-widest text-[10px] mb-3">
                <Compass className="h-3.5 w-3.5" />
                <span>Interview Preparation Hub</span>
              </div>
              <h1 className="text-[2rem] font-black tracking-tight text-slate-900 mb-2">
                Choose Your Learning Path
              </h1>
              <p className="text-[14px] text-slate-500 max-w-[500px] leading-[1.7]">
                Curated prep paths by technology, role, and experience level — tailored to what hiring managers actually ask.
              </p>
            </div>
            <div className="flex gap-3 shrink-0">
              <div className="rounded-[12px] bg-[#f8f9fa] border border-slate-200 px-5 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Paths</p>
                <p className="text-[1.6rem] font-black text-slate-800 leading-none">{domains.length}</p>
              </div>
              <div className="rounded-[12px] bg-blue-50 border border-blue-100 px-5 py-4 text-center">
                <p className="text-[10px] font-bold uppercase tracking-widest text-[#2e64e5] mb-1">Tracks</p>
                <p className="text-[1.6rem] font-black text-slate-800 leading-none">{tracks.length}</p>
              </div>
            </div>
          </div>
          {/* Benefit strip — compact */}
          <div className="border-t border-slate-100 bg-[#fafafa] px-8 py-2.5 flex flex-wrap gap-x-6 gap-y-1.5">
            {[
              "✅ Top-company interview questions",
              "🎯 Matched to your experience level",
              "⚡ Structured Easy → Hard progression",
            ].map(b => (
              <span key={b} className="text-[12px] font-medium text-slate-500">{b}</span>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-[240px_1fr_220px] gap-6 items-start">

          {/* ─── FILTER SIDEBAR ─── */}
          <aside className="sticky top-6">
            <div className="bg-white border border-slate-200 rounded-[18px] shadow-sm overflow-hidden">
              <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
                <h3 className="text-[12px] font-bold uppercase tracking-widest text-slate-700 flex items-center gap-2">
                  <Filter className="h-3.5 w-3.5 text-slate-400" /> Filter Paths
                </h3>
                {hasFilter && (
                  <button onClick={resetAll} className="text-[11px] font-bold text-[#2e64e5] hover:text-blue-700 flex items-center gap-1 transition-colors">
                    Clear <X className="h-3 w-3" />
                  </button>
                )}
              </div>

              <div className="p-5 space-y-6">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="Search by name or language..."
                    value={filters.search}
                    onChange={e => setFilters(f => ({ ...f, search: e.target.value }))}
                    className="w-full bg-[#f8f9fa] border border-slate-200 rounded-[10px] h-10 pl-9 pr-4 text-[13px] placeholder:text-slate-400 focus:border-[#2e64e5]/50 focus:outline-none focus:ring-2 focus:ring-[#2e64e5]/10 transition-all"
                  />
                </div>

                {/* Role Track */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Role Track</p>
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => setFilters(f => ({ ...f, track: "" }))}
                      className={cn(
                        "w-full flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-[13px] font-semibold text-left transition-colors",
                        filters.track === "" ? "bg-[#2e64e5] text-white" : "text-slate-600 hover:bg-slate-50"
                      )}
                    >
                      <Layers className="h-3.5 w-3.5 shrink-0" /> All Tracks
                    </button>
                    {tracks.map(t => {
                      const slug = t.slug.toLowerCase();
                      const color = trackColor[slug] ?? "#64748b";
                      const icon = trackIcon[slug] ?? <Layers className="h-3.5 w-3.5" />;
                      const active = filters.track === t.slug;
                      return (
                        <button
                          key={t.id}
                          onClick={() => setFilters(f => ({ ...f, track: active ? "" : t.slug }))}
                          className={cn(
                            "w-full flex items-center gap-2.5 px-3 py-2 rounded-[9px] text-[13px] font-semibold text-left transition-colors",
                            active ? "text-white" : "text-slate-600 hover:bg-slate-50"
                          )}
                          style={active ? { backgroundColor: color } : undefined}
                        >
                          <span style={active ? { color: "white" } : { color }}>{icon}</span>
                          {t.name}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Experience Level */}
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-3">Experience Level</p>
                  <div className="grid grid-cols-2 gap-2">
                    {uniqueExp.map(e => (
                      <button
                        key={e.id}
                        onClick={() => setFilters(f => ({ ...f, experience: f.experience === e.label ? "" : e.label }))}
                        className={cn(
                          "px-2 py-2 rounded-[9px] text-[12px] font-bold border text-center transition-all",
                          filters.experience === e.label
                            ? "bg-[#2e64e5] border-[#2e64e5] text-white shadow-sm"
                            : "bg-[#f8f9fa] border-slate-200 text-slate-600 hover:border-[#2e64e5]/30"
                        )}
                      >
                        {e.label} Yrs
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {hasFilter && (
                <div className="px-5 py-3 border-t border-slate-100 bg-slate-50/80">
                  <p className="text-[11px] text-slate-500 font-medium">
                    Showing <span className="font-bold text-slate-700">{filtered.length}</span> of {domains.length} paths
                  </p>
                </div>
              )}

              {/* Study tips — inline at bottom of filter card */}
              <div className="px-5 pb-5 pt-2 border-t border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2.5">How to Pick</p>
                <div className="space-y-2">
                  {[
                    ["1", "Choose your main language"],
                    ["2", "Match your experience level"],
                    ["3", "Finish one path before switching"],
                  ].map(([n, tip]) => (
                    <div key={n} className="flex items-start gap-2">
                      <span className="text-[9px] font-black text-slate-300 mt-0.5 shrink-0">{n}.</span>
                      <p className="text-[12px] text-slate-500 leading-snug">{tip}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* ─── MAIN CONTENT ─── */}
          <div>
            {/* Active filter pill strip */}
            {hasFilter && (
              <div className="flex flex-wrap gap-2 mb-5">
                {filters.search && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white border border-slate-200 rounded-full px-3 py-1 text-slate-600 shadow-sm">
                    Search: &ldquo;{filters.search}&rdquo;
                    <button onClick={() => setFilters(f => ({ ...f, search: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.track && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white border border-slate-200 rounded-full px-3 py-1 text-slate-600 shadow-sm">
                    {filters.track}
                    <button onClick={() => setFilters(f => ({ ...f, track: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
                {filters.experience && (
                  <span className="flex items-center gap-1.5 text-[11px] font-bold bg-white border border-slate-200 rounded-full px-3 py-1 text-slate-600 shadow-sm">
                    {filters.experience} Yrs
                    <button onClick={() => setFilters(f => ({ ...f, experience: "" }))}><X className="h-3 w-3" /></button>
                  </span>
                )}
              </div>
            )}

            {/* Quick Jump — styled as a clean pill bar */}
            {!hasFilter && langKeys.length > 0 && (
              <div className="mb-5 flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-300 shrink-0">Jump:</span>
                {langKeys.map(lang => (
                  <button
                    key={lang}
                    onClick={() => setExpandedLang(p => ({ ...p, [lang]: true }))}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-slate-200 text-[12px] font-semibold text-slate-600 hover:border-[#2e64e5]/50 hover:text-[#2e64e5] hover:bg-blue-50/40 transition-all shadow-sm"
                  >
                    {lang}
                    <span className="text-[10px] font-bold text-slate-300">{grouped[lang].length}</span>
                  </button>
                ))}
              </div>
            )}

            {/* Language accordion sections */}
            <div className="space-y-3">
              {langKeys.map(lang => (
                <div key={lang} className="bg-white border border-slate-200 rounded-[14px] overflow-hidden shadow-sm">
                  <button
                    onClick={() => toggle(lang)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-slate-50/50 transition-colors group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-[10px] bg-[#2e64e5]/8 border border-[#2e64e5]/10 flex items-center justify-center">
                        <span className="text-[13px] font-black text-[#2e64e5]">{lang.slice(0, 2).toUpperCase()}</span>
                      </div>
                      <div>
                        <h2 className="text-[16px] font-bold text-slate-800 group-hover:text-[#2e64e5] transition-colors leading-tight">{lang}</h2>
                        <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                          {grouped[lang].length} preparation path{grouped[lang].length !== 1 ? "s" : ""}
                        </p>
                      </div>
                    </div>
                    <div className={cn(
                      "w-8 h-8 rounded-full border flex items-center justify-center transition-all",
                      expandedLang[lang]
                        ? "bg-[#2e64e5] border-[#2e64e5] text-white"
                        : "border-slate-200 text-slate-400 group-hover:border-[#2e64e5]/30 group-hover:text-[#2e64e5]"
                    )}>
                      <ChevronDown className={cn("h-4 w-4 transition-transform duration-300", expandedLang[lang] && "rotate-180")} />
                    </div>
                  </button>

                  <AnimatePresence>
                    {expandedLang[lang] && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.22 }}
                        className="overflow-hidden"
                      >
                        <div className="px-5 pb-5 pt-2 grid grid-cols-1 sm:grid-cols-2 gap-3 border-t border-slate-100 bg-[#fafafa]">
                          {grouped[lang].map((domain, idx) => (
                            <DomainCard key={domain.id} domain={domain} index={idx} />
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="text-center py-24 bg-white rounded-[14px] border border-slate-200">
                <Compass className="h-10 w-10 text-slate-200 mx-auto mb-4" />
                <h3 className="text-[15px] font-bold text-slate-700">No matching paths found</h3>
                <p className="text-[13px] text-slate-400 mt-1">Try adjusting your filters or search terms.</p>
                <button onClick={resetAll} className="mt-4 text-[12px] font-bold text-[#2e64e5] hover:text-blue-700 transition-colors">
                  Clear all filters
                </button>
              </div>
            )}
          </div>

          {/* ─── RIGHT SIDEBAR — single merged card + tip ─── */}
          <aside className="hidden lg:flex flex-col gap-4 sticky top-6">

            {/* Merged: Where to Start + What to Expect */}
            <div className="bg-white rounded-[14px] border border-slate-200 shadow-sm overflow-hidden">
              <div className="px-5 py-4 border-b border-slate-100">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">🚦 Find Your Level</p>
              </div>
              <div className="divide-y divide-slate-50">
                {([
                  { exp: "0–1 Yrs",  role: "Fresher / Trainee",  color: "#22c55e", tip: "Fundamentals & core concepts" },
                  { exp: "1–3 Yrs",  role: "Junior Developer",   color: "#2e64e5", tip: "Applied patterns & real-world usage" },
                  { exp: "3–5 Yrs",  role: "Mid / Senior Dev",   color: "#f59e0b", tip: "Architecture & design trade-offs" },
                  { exp: "5+ Yrs",   role: "Lead / Principal",   color: "#ef4444", tip: "System depth & cross-domain thinking" },
                ] as const).map(({ exp, role, color, tip }) => (
                  <div key={exp} className="flex items-center gap-3 px-5 py-3 hover:bg-slate-50/50 transition-colors">
                    <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: color }} />
                    <div className="min-w-0">
                      <p className="text-[12.5px] font-bold text-slate-700 leading-none">{role}</p>
                      <p className="text-[10.5px] text-slate-400 mt-0.5">{exp} &middot; {tip}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-slate-100 px-5 py-3 bg-[#fafafa]">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">You'll be tested on</p>
                <div className="flex flex-wrap gap-1.5">
                  {["Concepts", "Depth", "Trade-offs", "Real-world", "Follow-ups"].map(s => (
                    <span key={s} className="text-[10px] font-semibold text-slate-500 bg-white border border-slate-200 rounded-full px-2.5 py-0.5">{s}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Pro tip — compact */}
            <div className="bg-[#2e64e5]/5 rounded-[14px] border border-[#2e64e5]/10 px-5 py-4">
              <p className="text-[10px] font-black uppercase tracking-widest text-[#2e64e5] mb-1.5">💡 Pro Tip</p>
              <p className="text-[12.5px] text-slate-600 leading-[1.6]">
                One completed stack beats five half-finished ones. Go deep, not wide.
              </p>
            </div>

          </aside>

        </div>
      </div>
    </div>
  );
}

function briefFor(domain: Domain): string {
  const level = domain.experienceLabel ?? "";
  const lang  = domain.language ?? "this technology";
  const track = domain.track ?? "";
  if (domain.description) return domain.description;
  const levelMap: Record<string, string> = {
    "0-1": "Covers core fundamentals and common entry-level interview questions.",
    "1-3": "Bridges theory and practice — tackles mid-level system and design questions.",
    "3-5": "Focuses on senior patterns, architecture decisions, and trade-off discussions.",
    "5+":  "Principal-level depth: leadership, scalability, and cross-cutting concerns.",
  };
  return levelMap[level] ?? `Structured ${lang} interview prep for the ${track} track.`;
}

function DomainCard({ domain, index = 0 }: { domain: Domain; index?: number }) {
  const slug  = domain.trackSlug?.toLowerCase() ?? "";
  const color = trackColor[slug] ?? "#64748b";
  const brief = briefFor(domain);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04 }}
      className="h-full"
    >
      <Link href={`/${domain.slug}`} className="block group outline-none focus:ring-2 focus:ring-[#2e64e5]/30 rounded-[12px] h-full">
        <div className="relative p-4 rounded-[12px] bg-white border border-slate-200 hover:border-[#2e64e5]/40 hover:shadow-md transition-all duration-300 flex flex-col gap-2.5 h-full">

          {/* Badges row */}
          <div className="flex items-center gap-2 flex-wrap">
            {domain.track && (
              <span
                className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full flex items-center gap-1"
                style={{ color, backgroundColor: color + "15" }}
              >
                {trackIcon[slug] ?? null}{domain.track}
              </span>
            )}
            {domain.experienceLabel && (
              <span className="text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 border border-amber-100">
                {domain.experienceLabel} Yrs
              </span>
            )}
          </div>

          {/* Title */}
          <h3 className="text-[14.5px] font-bold text-slate-800 group-hover:text-[#2e64e5] transition-colors leading-snug">
            {domain.name}
          </h3>

          {/* Brief description */}
          <p className="text-[12px] text-slate-500 leading-[1.55] flex-1">
            {brief}
          </p>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 mt-1">
            <span className="text-[11px] font-semibold text-slate-400 flex items-center gap-1.5">
              <BookOpen className="h-3 w-3" /> View Stacks
            </span>
            <div className="w-6 h-6 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 group-hover:bg-[#2e64e5]/10 group-hover:text-[#2e64e5] transition-colors">
              <ArrowRight className="h-3.5 w-3.5" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
