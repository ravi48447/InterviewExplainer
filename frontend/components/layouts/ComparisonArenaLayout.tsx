/**
 * Layout 2: COMPARISON ARENA
 * For: X vs Y questions, trade-off analysis
 * Used in: HashMap vs TreeMap, @Component vs @Service, REST vs gRPC, etc.
 * Sections: comparison_table, decision_guide, code_example (per option), interview_line
 */
"use client";
import { useState } from "react";
import { Swords, Compass, Code, Mic } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import type { AnswerSection } from "@/lib/api";

interface ComparisonArenaLayoutProps {
  title: string;
  questionText: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function ComparisonArenaLayout({
  title,
  questionText,
  sections,
  directAnswer,
}: ComparisonArenaLayoutProps) {
  const overview         = sections.find(s => s.sectionType === 'overview' || s.sectionType === 'core_concepts');
  const comparisonTable  = sections.find(s => s.sectionType === 'comparison_table');
  const decisionGuide    = sections.find(s => s.sectionType === 'decision_guide' || s.sectionType === 'when_to_use');
  const codeOptions      = sections.filter(s => s.sectionType === 'code_option' || s.sectionType === 'code_example');
  const interviewLine    = sections.find(s => s.sectionType === 'speakable_answer' || s.sectionType === 'interview_line');
  const deepExplanation  = sections.find(s => s.sectionType === 'deep_explanation' || s.sectionType === 'explanation');
  const companyExamples  = sections.find(s => s.sectionType === 'company_examples' || s.sectionType === 'real_world_example');

  const [activeCode, setActiveCode] = useState(0);

  return (
    <div className="space-y-8">
      {/* Overview / intro */}
      {overview && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-border dark:bg-none dark:bg-background">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Overview</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Header context */}
      {directAnswer && (
        <div className="rounded-xl border border-border bg-background px-5 py-4 shadow-sm">
          <div className="flex items-center gap-2 mb-2">
            <Swords className="h-4 w-4 text-muted-foreground" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest">The Core Difference</span>
          </div>
          <p className="text-base text-foreground">{directAnswer}</p>
        </div>
      )}

      {/* Comparison Table */}
      {comparisonTable && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-border dark:bg-none dark:bg-background">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Feature Comparison</span>
          </div>
          <div className="px-5 py-4 overflow-x-auto">
            <MarkdownContent content={comparisonTable.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Technical Explanation */}
      {deepExplanation && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-blue-200 dark:border-blue-500/20 dark:bg-none dark:bg-background">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Technical Deep Dive</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={deepExplanation.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Code Options (tabbed) */}
      {codeOptions.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-4 py-2 bg-surface border-b border-border">
            <Code className="h-4 w-4 text-muted-foreground" />
            <div className="flex gap-1">
              {codeOptions.map((opt, i) => (
                <button
                  key={i}
                  onClick={() => setActiveCode(i)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    activeCode === i ? "bg-background shadow-sm text-blue-700 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {opt.sectionTitle || `Option ${i + 1}`}
                </button>
              ))}
              {codeOptions.length > 1 && (
                <button
                  onClick={() => setActiveCode(-1)}
                  className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                    activeCode === -1 ? "bg-background shadow-sm text-blue-700 dark:text-blue-400" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  Side by Side
                </button>
              )}
            </div>
          </div>
          {activeCode === -1 ? (
            <div className={`grid grid-cols-${Math.min(codeOptions.length, 2)} divide-x divide-slate-200`}>
              {codeOptions.map((opt, i) => (
                <div key={i} className="p-4">
                  {opt.sectionTitle && <div className="text-[11px] font-bold text-muted-foreground uppercase mb-2">{opt.sectionTitle}</div>}
                  <MarkdownContent content={opt.content} stripTopHeading />
                </div>
              ))}
            </div>
          ) : (
            <div className="p-4">
              <MarkdownContent content={codeOptions[activeCode]?.content ?? ''} stripTopHeading />
            </div>
          )}
        </div>
      )}

      {/* Decision Guide */}
      {decisionGuide && (
        <div className="rounded-xl border border-emerald-200 dark:border-emerald-500/20 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-emerald-200 dark:border-emerald-500/20 bg-emerald-100 dark:bg-emerald-950/20/50">
            <Compass className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">When to Use Each</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={decisionGuide.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Company Examples */}
      {companyExamples && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 border-b border-border bg-surface">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Real-World Usage</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={companyExamples.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Interview Line */}
      {interviewLine && (
        <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-500/30 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-emerald-100 dark:bg-emerald-900/30 border-b-2 border-emerald-200 dark:border-emerald-500/20 dark:border-emerald-800/60">
            <Mic className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Interview Answer</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={interviewLine.content.replace(/^#[^\n]*\n+/, '').trim()} />
          </div>
        </div>
      )}
    </div>
  );
}
