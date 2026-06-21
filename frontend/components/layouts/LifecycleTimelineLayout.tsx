/**
 * Layout 6: LIFECYCLE TIMELINE
 * For: Spring bean lifecycle, GC phases, request processing pipeline
 * Sections: phases (each with title + content + code), scope_comparison, speakable
 */
"use client";
import { useState } from "react";
import { Clock, ChevronRight } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import type { AnswerSection } from "@/lib/api";

interface LifecycleTimelineLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function LifecycleTimelineLayout({
  title,
  sections,
  directAnswer,
}: LifecycleTimelineLayoutProps) {
  const overview      = sections.find(s => s.sectionType === 'overview' || s.sectionType === 'core_concepts');
  const phases        = sections.filter(s => s.sectionType === 'phase' || s.sectionType === 'lifecycle_phase');
  const deepExplain   = sections.find(s => s.sectionType === 'deep_explanation');
  const scopeCompare  = sections.find(s => s.sectionType === 'scope_comparison' || s.sectionType === 'comparison_table');
  const codeExample   = sections.find(s => s.sectionType === 'code_example');
  const speakable     = sections.find(s => s.sectionType === 'speakable_answer');

  const [activePhase, setActivePhase] = useState<number | null>(phases.length > 0 ? 0 : null);

  // If no structured phases, fall back to general layout
  const hasPhases = phases.length > 0;

  return (
    <div className="space-y-8">
      {directAnswer && (
        <div className="rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4">
          <p className="text-sm font-semibold text-slate-800">{directAnswer}</p>
        </div>
      )}

      {/* Overview */}
      {overview && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-slate-50 border-b border-slate-200">
            <Clock className="h-4 w-4 text-blue-600" />
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Overview</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Interactive Timeline */}
      {hasPhases && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Lifecycle Phases</span>
          </div>
          {/* Phase selector */}
          <div className="flex overflow-x-auto border-b border-slate-100 bg-white">
            {phases.map((phase, i) => (
              <button
                key={i}
                onClick={() => setActivePhase(i)}
                className={`flex items-center gap-2 px-4 py-3 text-xs font-medium whitespace-nowrap transition-colors border-r border-slate-100 ${
                  activePhase === i
                    ? "bg-blue-50 text-blue-700 border-b-2 border-b-blue-500"
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-700"
                }`}
              >
                <span className={`w-5 h-5 rounded-full text-[11px] font-bold flex items-center justify-center ${
                  activePhase === i ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"
                }`}>{i + 1}</span>
                {phase.sectionTitle || `Phase ${i + 1}`}
                {i < phases.length - 1 && <ChevronRight className="h-3 w-3 text-slate-300 ml-1" />}
              </button>
            ))}
          </div>
          {/* Active phase content */}
          {activePhase !== null && phases[activePhase] && (
            <div className="px-5 py-5 bg-white">
              <MarkdownContent content={phases[activePhase].content} stripTopHeading />
            </div>
          )}
        </div>
      )}

      {/* Deep explanation (fallback when no structured phases) */}
      {!hasPhases && deepExplain && (
        <div className="rounded-xl border border-blue-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 border-b border-blue-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Lifecycle Explained</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={deepExplain.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Code Example */}
      {codeExample && (
        <div className="rounded-xl border border-slate-700 bg-slate-900 overflow-hidden">
          <div className="px-5 py-3 border-b border-slate-700">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Code Reference</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={codeExample.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Scope Comparison */}
      {scopeCompare && (
        <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Comparison</span>
          </div>
          <div className="px-5 py-4 overflow-x-auto">
            <MarkdownContent content={scopeCompare.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Interview Answer */}
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
