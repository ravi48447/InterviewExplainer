/**
 * Layout 5: ARCHITECTURE MAP
 * For: JVM memory model, distributed system architecture, Kafka internals
 * Sections: diagram, components (expandable), tradeoffs, talking_points
 */
"use client";
import { useState } from "react";
import { Network, ChevronDown, ChevronUp, Scale, CheckSquare } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import type { AnswerSection } from "@/lib/api";

interface ArchitectureMapLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function ArchitectureMapLayout({
  title,
  sections,
  directAnswer,
}: ArchitectureMapLayoutProps) {
  const diagram          = sections.find(s => s.sectionType === 'diagram' || s.sectionType === 'architecture_diagram');
  const overview         = sections.find(s => s.sectionType === 'overview' || s.sectionType === 'core_concepts');
  const components       = sections.filter(s => s.sectionType === 'component' || s.sectionType === 'component_deep_dive');
  const tradeoffs        = sections.find(s => s.sectionType === 'tradeoffs' || s.sectionType === 'pros_cons');
  const talkingPoints    = sections.find(s => s.sectionType === 'talking_points' || s.sectionType === 'important_points');
  const deepExplanation  = sections.find(s => s.sectionType === 'deep_explanation' || s.sectionType === 'explanation');
  const speakable        = sections.find(s => s.sectionType === 'speakable_answer');
  const errorMapping     = sections.find(s => s.sectionType === 'error_mapping' || s.sectionType === 'common_mistakes');

  const [expandedComponents, setExpandedComponents] = useState<Set<number>>(new Set());

  const toggleComponent = (i: number) => {
    setExpandedComponents(prev => {
      const next = new Set(prev);
      next.has(i) ? next.delete(i) : next.add(i);
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Quick context */}
      {directAnswer && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-gradient-to-r from-blue-50 dark:from-blue-950/40 to-indigo-50 dark:to-indigo-950/40 px-5 py-4  ">
          <p className="text-sm font-semibold text-foreground">{directAnswer}</p>
        </div>
      )}

      {/* Architecture Diagram */}
      {diagram && (
        <div className="rounded-xl border-2 border-border bg-slate-950 dark:bg-slate-800 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
            <Network className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Architecture Diagram</span>
          </div>
          <div className="px-5 py-5 font-mono">
            <MarkdownContent content={diagram.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Overview */}
      {overview && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-surface border-b border-border">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">How It Works</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Deep Explanation */}
      {deepExplanation && !overview && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-blue-200 dark:border-blue-500/20">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Deep Dive</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={deepExplanation.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Expandable Components */}
      {components.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-3 bg-surface border-b border-border">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Component Deep Dives</span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {components.map((comp, i) => (
              <div key={i}>
                <button
                  onClick={() => toggleComponent(i)}
                  className="w-full flex items-center justify-between px-5 py-3 text-left hover:bg-surface transition-colors"
                >
                  <span className="text-sm font-semibold text-foreground">
                    {comp.sectionTitle || `Component ${i + 1}`}
                  </span>
                  {expandedComponents.has(i)
                    ? <ChevronUp className="h-4 w-4 text-muted-foreground" />
                    : <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  }
                </button>
                {expandedComponents.has(i) && (
                  <div className="px-5 pb-4 bg-surface/50">
                    <MarkdownContent content={comp.content} stripTopHeading />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Trade-offs */}
      {tradeoffs && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-50 dark:from-slate-950/40 to-orange-50 dark:to-orange-950/40 border-b border-border  ">
            <Scale className="h-4 w-4 text-orange-600 dark:text-orange-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Trade-offs</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={tradeoffs.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Error Mapping */}
      {errorMapping && (
        <div className="rounded-xl border border-red-200 dark:border-red-500/20 bg-red-50 dark:bg-red-500/10 dark:bg-red-950/20/40 overflow-hidden">
          <div className="px-5 py-3 bg-red-100 dark:bg-red-950/20/50 border-b border-red-200 dark:border-red-500/20">
            <span className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">Common Errors & What Causes Them</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={errorMapping.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Interview Talking Points */}
      {talkingPoints && (
        <div className="rounded-xl border border-violet-200 dark:border-violet-500/20 bg-violet-50/40 dark:bg-violet-500/10 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-violet-100 dark:bg-violet-950/20/50 border-b border-violet-200 dark:border-violet-500/20">
            <CheckSquare className="h-4 w-4 text-violet-700 dark:text-violet-400" />
            <span className="text-xs font-bold text-violet-800 dark:text-violet-400 uppercase tracking-wide">Interview Talking Points</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={talkingPoints.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Speakable */}
      {speakable && (
        <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-500/30 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 dark:bg-emerald-900/30 border-b-2 border-emerald-200 dark:border-emerald-500/20 dark:border-emerald-800/60">
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
