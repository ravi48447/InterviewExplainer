/**
 * Layout 9: REFERENCE CARDS
 * For: Spring annotations, HTTP status codes, JVM flags, Kafka config props
 * Sections: items[] each with name + description + code, categories
 */
"use client";
import { useState, useMemo } from "react";
import { Search, Copy, Check } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import type { AnswerSection } from "@/lib/api";

interface ReferenceCardsLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function ReferenceCardsLayout({
  title,
  sections,
  directAnswer,
}: ReferenceCardsLayoutProps) {
  const intro        = sections.find(s => s.sectionType === 'overview' || s.sectionType === 'core_concepts');
  const refSections  = sections.filter(s => s.sectionType === 'reference_group' || s.sectionType === 'reference_items');
  const deepDive     = sections.find(s => s.sectionType === 'deep_explanation');
  const speakable    = sections.find(s => s.sectionType === 'speakable_answer');
  const categories   = [...new Set(refSections.map(s => s.sectionTitle ?? 'General'))];

  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [search, setSearch] = useState('');
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null);

  const visibleSections = useMemo(() => {
    let filtered = refSections;
    if (activeCategory !== 'All') {
      filtered = filtered.filter(s => (s.sectionTitle ?? 'General') === activeCategory);
    }
    if (search.trim()) {
      filtered = filtered.filter(s =>
        s.content.toLowerCase().includes(search.toLowerCase()) ||
        (s.sectionTitle ?? '').toLowerCase().includes(search.toLowerCase())
      );
    }
    return filtered;
  }, [refSections, activeCategory, search]);

  const copyItem = (content: string, idx: number) => {
    navigator.clipboard.writeText(content);
    setCopiedIdx(idx);
    setTimeout(() => setCopiedIdx(null), 1500);
  };

  return (
    <div className="space-y-6">
      {directAnswer && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-surface px-5 py-4  ">
          <p className="text-sm font-semibold text-foreground">{directAnswer}</p>
        </div>
      )}

      {intro && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-surface border-b border-border">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Overview</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={intro.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Deep Dive */}
      {deepDive && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-default dark:border-default/20">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Deep Dive</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={deepDive.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Reference Cards (if structured) */}
      {refSections.length > 0 && (
        <div>
          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="relative flex-1 min-w-[200px] lg:max-w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 dark:text-slate-400 pointer-events-none" />
              <input
                type="search"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full rounded-2xl border border-slate-200 dark:border-slate-500/20 bg-slate-50 dark:bg-slate-950/20 py-2 pl-10 pr-4 text-sm text-slate-900 dark:text-slate-100 shadow-sm dark:shadow-md placeholder:text-slate-500 dark:placeholder:text-slate-400 focus:border-slate-400 dark:focus:border-white/40 focus:outline-none focus:ring-2 focus:ring-slate-200 dark:focus:ring-white/10 transition-all"
              />
            </div>
            <div className="flex gap-1 flex-wrap">
              {['All', ...categories].map(cat => (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${
                    activeCategory === cat
                      ? "bg-blue-600 text-white"
                      : "bg-surface text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {visibleSections.map((section, i) => (
              <div key={i} className="relative rounded-xl border border-border bg-background shadow-sm overflow-hidden hover:border-default dark:border-default hover:shadow-md transition-all">
                <div className="flex items-center justify-between px-4 py-3 bg-surface border-b border-border">
                  <span className="text-xs font-bold text-foreground">{section.sectionTitle || `Item ${i + 1}`}</span>
                  <button
                    onClick={() => copyItem(section.content, i)}
                    className="text-muted-foreground hover:text-muted-foreground transition-colors"
                    title="Copy"
                  >
                    {copiedIdx === i ? <Check className="h-3.5 w-3.5 text-emerald-500 dark:text-emerald-400" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="px-4 py-3 text-sm">
                  <MarkdownContent content={section.content} stripTopHeading />
                </div>
              </div>
            ))}
            {visibleSections.length === 0 && (
              <div className="col-span-2 py-8 text-center text-muted-foreground text-sm">No items match your search.</div>
            )}
          </div>
        </div>
      )}

      {/* Speakable */}
      {speakable && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-surface overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 dark:bg-emerald-900/30 border-b border-default dark:border-default/20">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Interview Answer</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={speakable.content.replace(/^#[^\n]*\n+/, '').trim()} />
          </div>
        </div>
      )}
    </div>
  );
}
