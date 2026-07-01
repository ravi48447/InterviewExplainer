/**
 * Layout 12: DESIGN WHITEBOARD
 * For: System design questions, rate limiter, cache design, distributed transactions
 * Sections: requirements, algorithm_options (tabbed), design_diagram, edge_cases, scoring_rubric
 */
"use client";
import { useState } from "react";
import { Pin, Layers, AlertCircle, Trophy } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import type { AnswerSection } from "@/lib/api";

interface DesignWhiteboardLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function DesignWhiteboardLayout({
  title,
  sections,
  directAnswer,
}: DesignWhiteboardLayoutProps) {
  const requirements    = sections.find(s => s.sectionType === 'requirements' || s.sectionType === 'constraints');
  const overview        = sections.find(s => s.sectionType === 'overview' || s.sectionType === 'core_concepts');
  const approaches      = sections.filter(s => s.sectionType === 'algorithm_option' || s.sectionType === 'approach');
  const diagram         = sections.find(s => s.sectionType === 'design_diagram' || s.sectionType === 'diagram');
  const tradeoffs       = sections.find(s => s.sectionType === 'tradeoffs');
  const edgeCases       = sections.find(s => s.sectionType === 'edge_cases' || s.sectionType === 'important_points');
  const deepExplain     = sections.find(s => s.sectionType === 'deep_explanation' || s.sectionType === 'explanation');
  const implementation  = sections.find(s => s.sectionType === 'implementation' || s.sectionType === 'code_example');
  const scoringRubric   = sections.find(s => s.sectionType === 'scoring_rubric');
  const speakable       = sections.find(s => s.sectionType === 'speakable_answer');

  const [activeApproach, setActiveApproach] = useState(0);

  return (
    <div className="space-y-8">
      {/* Context */}
      {directAnswer && (
        <div className="rounded-xl border border-border bg-background px-5 py-4 shadow-sm">
          <p className="text-sm text-foreground">{directAnswer}</p>
        </div>
      )}

      {/* Requirements Board */}
      {requirements && (
        <div className="rounded-xl border-2 border-blue-200 dark:border-blue-500/20 bg-gradient-to-br from-blue-50 to-indigo-50 overflow-hidden dark:from-background dark:to-background/50">
          <div className="flex items-center gap-2 px-5 py-3 bg-blue-100 dark:bg-blue-950/20 border-b-2 border-blue-200 dark:border-blue-500/20">
            <Pin className="h-4 w-4 text-blue-700 dark:text-blue-400" />
            <span className="text-xs font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest">Requirements & Constraints</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={requirements.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Overview */}
      {overview && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-surface border-b border-border">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Design Overview</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Algorithm/Approach Options (tabbed) */}
      {approaches.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-border dark:from-background dark:to-background/50">
            <Layers className="h-4 w-4 text-muted-foreground mr-1" />
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mr-2">Approaches:</span>
            {approaches.map((a, i) => (
              <button
                key={i}
                onClick={() => setActiveApproach(i)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeApproach === i ? "bg-background shadow-sm text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-500/20" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {a.sectionTitle || `Approach ${i + 1}`}
              </button>
            ))}
          </div>
          <div className="px-5 py-5 bg-background">
            <MarkdownContent content={approaches[activeApproach]?.content ?? ''} stripTopHeading />
          </div>
        </div>
      )}

      {/* Design Diagram */}
      {diagram && (
        <div className="rounded-xl border-2 border-border bg-slate-950 dark:bg-slate-800 overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">System Diagram</span>
          </div>
          <div className="px-5 py-5 font-mono text-sm">
            <MarkdownContent content={diagram.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Deep Explanation */}
      {deepExplain && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-blue-200 dark:border-blue-500/20">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Deep Dive</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={deepExplain.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Trade-offs */}
      {tradeoffs && (
        <div className="rounded-xl border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/10 dark:bg-orange-950/20/40 overflow-hidden">
          <div className="px-5 py-3 bg-orange-100 dark:bg-orange-950/20/50 border-b border-orange-200 dark:border-orange-500/20">
            <span className="text-xs font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wide">Trade-offs</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={tradeoffs.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Edge Cases */}
      {edgeCases && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 dark:bg-red-950/20/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-red-100 dark:bg-red-950/20/50 border-b border-red-200 dark:border-red-500/20">
            <AlertCircle className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">Edge Cases to Mention</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={edgeCases.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Implementation */}
      {implementation && (
        <div className="rounded-xl border border-border dark:bg-surface overflow-hidden">
          <div className="px-5 py-3 border-b border-border">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Java Implementation</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={implementation.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Scoring Rubric */}
      {scoringRubric && (
        <div className="rounded-xl border border-yellow-200 dark:border-yellow-500/20 bg-yellow-50 dark:bg-yellow-950/20/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-yellow-100 dark:bg-yellow-950/20/50 border-b border-yellow-200 dark:border-yellow-500/20">
            <Trophy className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
            <span className="text-xs font-bold text-yellow-800 dark:text-yellow-400 uppercase tracking-wide">What Earns Full Marks</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={scoringRubric.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Speakable */}
      {speakable && (
        <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-500/30 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 dark:bg-emerald-900/30 border-b-2 border-emerald-200 dark:border-emerald-500/20 dark:border-emerald-800/60">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Interview Answer Framework</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={speakable.content.replace(/^#[^\n]*\n+/, '').trim()} />
          </div>
        </div>
      )}
    </div>
  );
}
