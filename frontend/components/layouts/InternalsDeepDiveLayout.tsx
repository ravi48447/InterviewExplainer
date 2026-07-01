/**
 * Layout 3: INTERNALS DEEP DIVE
 * For: "How does X work internally?", under-the-hood questions
 * Used in: HashMap resizing, ArrayList growth, class loading, type erasure
 * Sections: problem_statement (optional), steps (numbered), source_reference, performance_implication, interview_signal
 */
import { Cpu, ArrowRight, Zap, Code } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { InterviewSignal } from "./shared/InterviewSignal";
import type { AnswerSection } from "@/lib/api";

interface InternalsDeepDiveLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function InternalsDeepDiveLayout({
  title,
  sections,
  directAnswer,
}: InternalsDeepDiveLayoutProps) {
  const overview          = sections.find(s => s.sectionType === 'overview' || s.sectionType === 'core_concepts');
  const stepByStep        = sections.find(s => s.sectionType === 'step_by_step' || s.sectionType === 'deep_explanation');
  const codeExample       = sections.find(s => s.sectionType === 'code_example');
  const sourceRef         = sections.find(s => s.sectionType === 'source_reference');
  const perfImplication   = sections.find(s => s.sectionType === 'performance_implication' || s.sectionType === 'best_practices');
  const interviewSignal   = sections.find(s => s.sectionType === 'interview_signal' || s.sectionType === 'important_points');
  const speakable         = sections.find(s => s.sectionType === 'speakable_answer');

  return (
    <div className="space-y-8">
      {/* Quick Answer */}
      {directAnswer && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 dark:from-background dark:to-background/50">
          <p className="text-sm font-semibold text-foreground">{directAnswer}</p>
        </div>
      )}

      {/* Overview */}
      {overview && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-surface border-b border-border">
            <Cpu className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">How It Works</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Step-by-Step Internal Walkthrough */}
      {stepByStep && (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200 dark:border-indigo-500/20 dark:from-background dark:to-background/50">
            <ArrowRight className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Step-by-Step Internals</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={stepByStep.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Code Example */}
      {codeExample && (
        <div className="rounded-xl border border-border dark:bg-surface overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 border-b border-border">
            <Code className="h-4 w-4 text-muted-foreground" />
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-wide">Code Reference</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={codeExample.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Source Reference */}
      {sourceRef && (
        <div className="rounded-xl border border-border bg-surface px-5 py-4">
          <div className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide mb-2">Source Code Reference</div>
          <MarkdownContent content={sourceRef.content} stripTopHeading />
        </div>
      )}

      {/* Performance Implication */}
      {perfImplication && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/20/60 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-amber-100 dark:bg-amber-950/20/50 border-b border-amber-200 dark:border-amber-500/20">
            <Zap className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">Performance Implication</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={perfImplication.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Interview Signal */}
      {interviewSignal && (
        <InterviewSignal title="What Impresses Interviewers">
          <MarkdownContent content={interviewSignal.content} stripTopHeading />
        </InterviewSignal>
      )}

      {/* Speakable Answer */}
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
