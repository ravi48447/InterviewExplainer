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
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
          <p className="text-sm font-semibold text-slate-800">{directAnswer}</p>
        </div>
      )}

      {intro && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Overview</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={intro.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Deep Dive */}
      {deepDive && (
        <div className="rounded-xl border border-blue-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 border-b border-blue-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Deep Dive</span>
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
            <div className="relative flex-1 min-w-[200px]">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-400" />
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search..."
                className="w-full pl-8 pr-3 py-2 text-sm border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
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
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
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
              <div key={i} className="relative rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden hover:border-blue-300 hover:shadow-md transition-all">
                <div className="flex items-center justify-between px-4 py-3 bg-slate-50 border-b border-slate-200">
                  <span className="text-xs font-bold text-slate-700">{section.sectionTitle || `Item ${i + 1}`}</span>
                  <button
                    onClick={() => copyItem(section.content, i)}
                    className="text-slate-400 hover:text-slate-600 transition-colors"
                    title="Copy"
                  >
                    {copiedIdx === i ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5" />}
                  </button>
                </div>
                <div className="px-4 py-3 text-sm">
                  <MarkdownContent content={section.content} stripTopHeading />
                </div>
              </div>
            ))}
            {visibleSections.length === 0 && (
              <div className="col-span-2 py-8 text-center text-slate-400 text-sm">No items match your search.</div>
            )}
          </div>
        </div>
      )}

      {/* Speakable */}
      {speakable && (
        <div className="rounded-xl border-2 border-emerald-300 bg-gradient-to-br from-emerald-50 to-teal-50 overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 border-b-2 border-emerald-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Interview Answer</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={speakable.content.replace(/^#[^\n]*\n+/, '').trim()} />
          </div>
        </div>
      )}
    </div>
  );
}
