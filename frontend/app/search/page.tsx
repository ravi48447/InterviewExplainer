"use client";

import React, { useState, useCallback } from "react";
import { searchQuestions, QuestionSummary, difficultyColor, difficultyLabel } from "@/lib/api";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Search, ArrowRight, Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<QuestionSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const doSearch = useCallback(async (q: string) => {
    if (q.trim().length < 2) { setResults([]); setSearched(false); return; }
    setLoading(true);
    setSearched(true);
    try {
      const data = await searchQuestions(q, 30);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") doSearch(query);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="fixed inset-0 bg-[radial-gradient(circle_at_50%_20%,rgba(var(--primary),0.06),transparent_60%)] pointer-events-none" />

      <main className="relative z-10 container max-w-3xl mx-auto px-6 pt-20 pb-32">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-5xl font-black tracking-tighter text-white mb-3">
            Search <span className="text-primary">Questions</span>
          </h1>
          <p className="text-muted-foreground text-sm">
            Powered by PostgreSQL full-text search across 500k+ questions
          </p>
        </div>

        {/* Search Input */}
        <div className="relative mb-10">
          <Search className="absolute left-5 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground/50" />
          <input
            type="text"
            value={query}
            onChange={e => {
              setQuery(e.target.value);
              if (e.target.value.trim().length >= 2) doSearch(e.target.value);
              else { setResults([]); setSearched(false); }
            }}
            onKeyDown={handleKeyDown}
            placeholder="Search questions... (e.g. HashMap, OOPS, Spring Boot)"
            className="w-full pl-14 pr-5 py-5 rounded-2xl bg-white/[0.04] border border-white/10 focus:border-primary/40 focus:outline-none text-white placeholder:text-muted-foreground/40 text-base font-medium transition-all"
            autoFocus
          />
          {loading && (
            <Loader2 className="absolute right-5 top-1/2 -translate-y-1/2 h-4 w-4 text-primary animate-spin" />
          )}
        </div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {searched && !loading && (
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              {results.length === 0 ? (
                <div className="text-center py-16 text-muted-foreground">
                  <Search className="h-10 w-10 mx-auto mb-4 opacity-20" />
                  <p className="text-sm">No questions found for &quot;{query}&quot;</p>
                  <p className="text-xs mt-2 opacity-50">Try different keywords</p>
                </div>
              ) : (
                <div>
                  <div className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/40 mb-4">
                    {results.length} result{results.length !== 1 ? "s" : ""}
                  </div>
                  <div className="space-y-2">
                    {results.map((q, idx) => (
                      <motion.div
                        key={q.id}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.02 }}
                      >
                        <Link href={`/${q.domainSlug || 'all'}/${q.stackSlug || 'global'}/${q.slug}`}
                          className="group flex items-center justify-between p-5 rounded-xl bg-white/[0.02] border border-white/5 hover:border-primary/20 hover:bg-white/[0.04] transition-all">
                          <div className="flex-1 min-w-0 mr-4">
                            <h3 className="text-sm font-bold text-white/80 group-hover:text-white transition-colors line-clamp-1">
                              {q.title}
                            </h3>
                            <div className="flex items-center gap-3 mt-1">
                              <span className="text-[9px] font-bold uppercase"
                                style={{ color: difficultyColor(q.difficulty) }}>
                                {difficultyLabel(q.difficulty)}
                              </span>
                              <span className="text-[9px] text-muted-foreground/40 flex items-center gap-1">
                                <Clock className="h-2 w-2" />
                                {q.estimatedReadTime ?? 5}m
                              </span>
                            </div>
                          </div>
                          <ArrowRight className="h-4 w-4 text-muted-foreground/20 group-hover:text-primary group-hover:translate-x-1 transition-all shrink-0" />
                        </Link>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
