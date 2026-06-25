"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Search, ArrowRight, Clock, Loader2, BookOpen, Filter,
  Sparkles, TrendingUp, Code2, Layers, X,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SearchResult {
  title: string;
  slug: string;
  domainSlug: string;
  stackSlug: string;
  questionSlug: string;
  difficulty: string;
  readingTime: number;
  language: string;
  track: string;
  level: string;
  stack: string;
  type: "interview" | "tool";
  score: number;
}

const DIFFICULTY_CONFIG: Record<string, { label: string; color: string; bg: string; border: string }> = {
  easy:   { label: "Easy",   color: "text-emerald-700", bg: "bg-emerald-50",  border: "border-emerald-200" },
  medium: { label: "Medium", color: "text-amber-700",   bg: "bg-amber-50",    border: "border-amber-200" },
  hard:   { label: "Hard",   color: "text-red-700",     bg: "bg-red-50",      border: "border-red-200" },
};

const POPULAR_SEARCHES = [
  "HashMap", "Spring Boot", "OOPS", "REST API", "Microservices",
  "SQL Joins", "Docker", "System Design", "Collections", "Multithreading",
];

const CATEGORIES = [
  { label: "All", value: "" },
  { label: "Interview", value: "interview" },
  { label: "Tools", value: "tool" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);
  const [activeCategory, setActiveCategory] = useState("");
  const [activeDifficulty, setActiveDifficulty] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) {
      setResults([]);
      setSearched(false);
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const res = await fetch(`/api/search?q=${encodeURIComponent(q)}&limit=50`);
      if (res.ok) {
        const data = await res.json();
        setResults(data);
      } else {
        setResults([]);
      }
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleInput = (value: string) => {
    setQuery(value);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => doSearch(value), 250);
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
    doSearch(term);
    inputRef.current?.focus();
  };

  const clearSearch = () => {
    setQuery("");
    setResults([]);
    setSearched(false);
    setActiveCategory("");
    setActiveDifficulty("");
    inputRef.current?.focus();
  };

  const filteredResults = results.filter((r) => {
    if (activeCategory && r.type !== activeCategory) return false;
    if (activeDifficulty && r.difficulty !== activeDifficulty) return false;
    return true;
  });

  const stats = {
    total: filteredResults.length,
    easy: filteredResults.filter((r) => r.difficulty === "easy").length,
    medium: filteredResults.filter((r) => r.difficulty === "medium").length,
    hard: filteredResults.filter((r) => r.difficulty === "hard").length,
  };

  function getHref(r: SearchResult): string {
    if (r.type === "tool") {
      return `/tools/${r.stackSlug}`;
    }
    if (r.domainSlug && r.stackSlug) {
      return `/${r.domainSlug}/${r.stackSlug}/${r.questionSlug}`;
    }
    return `/search?q=${encodeURIComponent(r.title)}`;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/20">
      <main className="w-full min-w-0 px-6 pt-12 pb-32">
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-100 text-blue-700 text-xs font-bold rounded-full mb-4 uppercase tracking-widest">
            <Search className="h-3.5 w-3.5" />
            Search
          </div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground mb-3">
            Find Any{" "}
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Question
            </span>
          </h1>
          <p className="text-muted-foreground text-sm max-w-lg mx-auto">
            Search across all interview questions, tools, and technologies.
            Instant results powered by local content search.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-6">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => handleInput(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") doSearch(query); }}
            placeholder="Search questions... (e.g. HashMap, Spring Boot, Docker)"
            className="w-full pl-14 pr-14 py-5 rounded-2xl bg-background border border-border focus:border-blue-400 focus:ring-4 focus:ring-blue-100 focus:outline-none text-foreground placeholder:text-slate-400 text-base font-medium transition-all shadow-lg shadow-slate-200/50"
          />
          {loading && (
            <Loader2 className="absolute right-14 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-600 animate-spin" />
          )}
          {query && (
            <button
              onClick={clearSearch}
              className="absolute right-5 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-surface transition-colors"
            >
              <X className="h-4 w-4 text-slate-400" />
            </button>
          )}
        </div>

        {/* Popular Searches */}
        {!searched && (
          <div className="mb-10 animate-fade-in-up">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Popular Searches
              </span>
            </div>
            <div className="flex flex-wrap gap-2">
              {POPULAR_SEARCHES.map((term) => (
                <button
                  key={term}
                  onClick={() => handlePopularClick(term)}
                  className="px-4 py-2 rounded-xl bg-background border border-border text-sm font-semibold text-foreground hover:border-blue-300 hover:text-blue-600 hover:bg-blue-50 transition-all shadow-sm"
                >
                  {term}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters — show when results exist */}
        {searched && results.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-6 animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
            <div className="flex items-center gap-1.5 mr-2">
              <Filter className="h-3.5 w-3.5 text-slate-400" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Filter</span>
            </div>

            {/* Type filters */}
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => setActiveCategory(cat.value)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                  activeCategory === cat.value
                    ? "bg-blue-600 text-primary-foreground dark:text-foreground border-blue-600"
                    : "bg-background text-secondary border-border hover:border-blue-300",
                )}
              >
                {cat.label}
              </button>
            ))}

            <div className="w-px h-5 bg-slate-200 mx-1" />

            {/* Difficulty filters */}
            {(["easy", "medium", "hard"] as const).map((d) => {
              const cfg = DIFFICULTY_CONFIG[d];
              return (
                <button
                  key={d}
                  onClick={() => setActiveDifficulty(activeDifficulty === d ? "" : d)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-bold border transition-all",
                    activeDifficulty === d
                      ? `${cfg.bg} ${cfg.color} ${cfg.border}`
                      : "bg-background text-secondary border-border hover:border-border",
                  )}
                >
                  {cfg.label}
                </button>
              );
            })}
          </div>
        )}

        {/* Results */}
          {searched && !loading && (
            <div className="animate-fade-in-up" style={{ animationDuration: '0.2s' }}>
              {results.length === 0 ? (
                <div className="text-center py-20 bg-background rounded-2xl border border-border shadow-sm">
                  <Search className="h-12 w-12 mx-auto mb-4 text-slate-200" />
                  <h3 className="text-lg font-bold text-foreground mb-2">
                    No results for &ldquo;{query}&rdquo;
                  </h3>
                  <p className="text-sm text-muted-foreground mb-6">
                    Try different keywords or browse our content below.
                  </p>
                  <div className="flex items-center justify-center gap-3">
                    <Link
                      href="/domains"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-primary-foreground dark:text-foreground text-sm font-bold rounded-xl hover:bg-blue-700 transition-colors"
                    >
                      <Layers className="h-4 w-4" />
                      Browse Domains
                    </Link>
                    <Link
                      href="/topics"
                      className="inline-flex items-center gap-2 px-5 py-2.5 border border-border text-foreground text-sm font-bold rounded-xl hover:bg-surface transition-colors"
                    >
                      <BookOpen className="h-4 w-4" />
                      Browse Topics
                    </Link>
                  </div>
                </div>
              ) : (
                <div>
                  {/* Results header with stats */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-bold text-foreground">
                        {stats.total} result{stats.total !== 1 ? "s" : ""}
                      </span>
                      {stats.total < results.length && (
                        <span className="text-xs text-slate-400">
                          (filtered from {results.length})
                        </span>
                      )}
                    </div>
                    <div className="hidden sm:flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1 text-emerald-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-emerald-500" />
                        {stats.easy} Easy
                      </span>
                      <span className="flex items-center gap-1 text-amber-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-amber-500" />
                        {stats.medium} Medium
                      </span>
                      <span className="flex items-center gap-1 text-red-600 font-bold">
                        <span className="w-2 h-2 rounded-full bg-red-500" />
                        {stats.hard} Hard
                      </span>
                    </div>
                  </div>

                  {/* Result Cards */}
                  <div className="space-y-2">
                    {filteredResults.map((r, idx) => {
                      const diff = DIFFICULTY_CONFIG[r.difficulty] ?? DIFFICULTY_CONFIG.medium;
                      return (
                        <div key={`${r.domainSlug}-${r.stackSlug}-${r.slug}`}>
                          <Link
                            href={getHref(r)}
                            className="group flex items-center justify-between p-4 sm:p-5 rounded-xl bg-background border border-border hover:border-blue-300 hover:shadow-md transition-all"
                          >
                            <div className="flex-1 min-w-0 mr-4">
                              <h3 className="text-sm font-bold text-foreground group-hover:text-blue-600 transition-colors line-clamp-1 mb-1.5">
                                {r.title}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <span className={cn(
                                  "text-[10px] font-bold uppercase px-2 py-0.5 rounded border",
                                  diff.color, diff.bg, diff.border,
                                )}>
                                  {diff.label}
                                </span>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Clock className="h-2.5 w-2.5" />
                                  {r.readingTime}m
                                </span>
                                <span className="hidden sm:inline text-[11px] text-slate-400 flex items-center gap-1">
                                  <Code2 className="h-2.5 w-2.5" />
                                  {r.stack}
                                </span>
                                {r.type === "interview" && (
                                  <span className="hidden md:inline text-[10px] text-slate-400 font-medium">
                                    {r.language} · {r.track} · {r.level}
                                  </span>
                                )}
                                {r.type === "tool" && (
                                  <span className="text-[10px] text-blue-500 font-bold uppercase bg-blue-50 px-1.5 py-0.5 rounded">
                                    Tool
                                  </span>
                                )}
                              </div>
                            </div>
                            <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                          </Link>
                        </div>
                      );
                    })}
                  </div>

                  {filteredResults.length === 0 && results.length > 0 && (
                    <div className="text-center py-12 bg-background rounded-2xl border border-border">
                      <Filter className="h-8 w-8 mx-auto mb-3 text-slate-200" />
                      <p className="text-sm font-semibold text-secondary mb-2">
                        No results match your filters
                      </p>
                      <button
                        onClick={() => { setActiveCategory(""); setActiveDifficulty(""); }}
                        className="text-xs font-bold text-blue-600 hover:underline"
                      >
                        Clear all filters
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

        {/* Quick Links — shown when not searched */}
        {!searched && (
          <div className="animate-fade-in-up anim-delay-2">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">
                Quick Links
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {[
                { href: "/domains", icon: Layers, title: "All Learning Paths", desc: "Browse all languages, tracks & levels" },
                { href: "/topics", icon: BookOpen, title: "Topics", desc: "Explore concepts & fundamentals" },
                { href: "/dsa", icon: Code2, title: "DSA Problems", desc: "Data structures & algorithms practice" },
                { href: "/tools", icon: TrendingUp, title: "Tools & Technologies", desc: "Docker, Kafka, Redis & more" },
              ].map(({ href, icon: Icon, title, desc }) => (
                <Link
                  key={href}
                  href={href}
                  className="group flex items-center gap-4 p-5 rounded-xl bg-background border border-border hover:border-blue-300 hover:shadow-md transition-all"
                >
                  <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center shrink-0 group-hover:bg-blue-100 transition-colors">
                    <Icon className="h-5 w-5 text-blue-600" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-foreground group-hover:text-blue-600 transition-colors">{title}</h3>
                    <p className="text-xs text-muted-foreground">{desc}</p>
                  </div>
                  <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
