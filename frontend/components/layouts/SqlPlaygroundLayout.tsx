/**
 * Layout 10: SQL PLAYGROUND
 * For: SQL queries, window functions, EXPLAIN ANALYZE, query optimization
 * Sections: sample_data, query_example (annotated), output_preview, optimization_checklist, function_reference
 */
"use client";
import { useState } from "react";
import { Database, Table, Zap, CheckSquare } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { AnnotatedCode } from "./shared/AnnotatedCode";
import type { AnswerSection } from "@/lib/api";

interface SqlPlaygroundLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function SqlPlaygroundLayout({
  title,
  sections,
  directAnswer,
}: SqlPlaygroundLayoutProps) {
  const overview          = sections.find(s => s.sectionType === 'overview' || s.sectionType === 'core_concepts');
  const sampleData        = sections.find(s => s.sectionType === 'sample_data');
  const queryExamples     = sections.filter(s => s.sectionType === 'query_example' || s.sectionType === 'code_example');
  const outputPreview     = sections.find(s => s.sectionType === 'output_preview');
  const optimizationList  = sections.find(s => s.sectionType === 'optimization_checklist' || s.sectionType === 'best_practices');
  const explainOutput     = sections.find(s => s.sectionType === 'explain_output' || s.sectionType === 'explain_analyze');
  const functionRef       = sections.find(s => s.sectionType === 'function_reference');
  const deepExplain       = sections.find(s => s.sectionType === 'deep_explanation');
  const speakable         = sections.find(s => s.sectionType === 'speakable_answer');
  const performanceTips   = sections.find(s => s.sectionType === 'performance_implication' || s.sectionType === 'important_points');

  const [activeQuery, setActiveQuery] = useState(0);

  return (
    <div className="space-y-8">
      {directAnswer && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-surface px-5 py-4  ">
          <p className="text-sm font-semibold text-foreground">{directAnswer}</p>
        </div>
      )}

      {/* Overview */}
      {overview && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-surface border-b border-border">
            <Database className="h-4 w-4 text-primary dark:text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Concept Overview</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Sample Data Table */}
      {sampleData && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-surface border-b border-border">
            <Table className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Sample Data</span>
          </div>
          <div className="px-5 py-4 overflow-x-auto">
            <MarkdownContent content={sampleData.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Query Examples (tabbed) */}
      {queryExamples.length > 0 && (
        <div className="rounded-xl border border-border dark:bg-surface overflow-hidden">
          <div className="flex items-center gap-1 px-4 py-2 border-b border-border">
            <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mr-2">Query</span>
            {queryExamples.map((q, i) => (
              <button
                key={i}
                onClick={() => setActiveQuery(i)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeQuery === i ? "bg-slate-700 dark:bg-slate-800 text-muted-foreground" : "text-muted-foreground hover:text-muted-foreground"
                }`}
              >
                {q.sectionTitle || `Example ${i + 1}`}
              </button>
            ))}
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={queryExamples[activeQuery]?.content ?? ''} stripTopHeading />
          </div>
        </div>
      )}

      {/* Output Preview */}
      {outputPreview && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-950/20/40 overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 dark:bg-emerald-950/20/50 border-b border-default dark:border-default/20">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">Query Output</span>
          </div>
          <div className="px-5 py-4 overflow-x-auto">
            <MarkdownContent content={outputPreview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* EXPLAIN ANALYZE output */}
      {explainOutput && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/20/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-amber-100 dark:bg-amber-950/20/50 border-b border-default dark:border-default/20">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">EXPLAIN ANALYZE Output</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={explainOutput.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Deep Explanation */}
      {deepExplain && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-default dark:border-default/20">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Deep Dive</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={deepExplain.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Performance Tips */}
      {performanceTips && (
        <div className="rounded-xl border border-orange-200 dark:border-orange-500/20 bg-orange-50 dark:bg-orange-500/10 dark:bg-orange-950/20/40 overflow-hidden">
          <div className="px-5 py-3 bg-orange-100 dark:bg-orange-950/20/50 border-b border-orange-200 dark:border-orange-500/20">
            <span className="text-xs font-bold text-orange-800 dark:text-orange-400 uppercase tracking-wide">Performance Notes</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={performanceTips.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Optimization Checklist */}
      {optimizationList && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-surface border-b border-border">
            <CheckSquare className="h-4 w-4 text-primary dark:text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Optimization Checklist</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={optimizationList.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Function Reference */}
      {functionRef && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-blue-50 dark:bg-blue-950/20/40 overflow-hidden">
          <div className="px-5 py-3 bg-blue-100 dark:bg-blue-950/20/50 border-b border-default dark:border-default/20">
            <span className="text-xs font-bold text-primary dark:text-primary uppercase tracking-wide">Function Reference</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={functionRef.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Speakable */}
      {speakable && (
        <div className="rounded-xl border-2 border-default dark:border-default/30 dark:border-default/60 bg-surface border border-default dark:to-teal-950/40 overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 dark:bg-emerald-900/30 border-b-2 border-default dark:border-default/20 dark:border-default/60">
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
