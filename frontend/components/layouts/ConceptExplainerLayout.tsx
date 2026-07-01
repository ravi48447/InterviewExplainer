/**
 * Layout 1: CONCEPT EXPLAINER
 * For: "What is X", definition questions, core Java/JVM concepts
 * V2 section types: overview, phase, code_example, key_points, speakable_answer
 */
import { Lightbulb, BookOpen, Star, Sparkles, Hash } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { CopyButton } from "@/components/CopyButton";
import { InterviewSignal } from "./shared/InterviewSignal";
import { SelfCheck } from "./shared/SelfCheck";
import type { AnswerSection } from "@/lib/api";

interface ConceptExplainerLayoutProps {
  title: string;
  questionText: string;
  sections: AnswerSection[];
  directAnswer?: string;
  followupQuestions?: string[];
}

function findSection(sections: AnswerSection[], type: string): string | null {
  const s = sections.find(s => s.sectionType === type);
  if (!s?.content?.trim()) return null;
  return s.content;
}

export function ConceptExplainerLayout({
  title,
  questionText,
  sections,
  directAnswer,
  followupQuestions,
}: ConceptExplainerLayoutProps) {
  // Main explanation — V2 uses 'overview', legacy uses 'explanation'/'deep_explanation'
  const explanation =
    findSection(sections, 'deep_explanation') ??
    findSection(sections, 'explanation') ??
    findSection(sections, 'detailed_explanation') ??
    findSection(sections, 'overview') ??
    findSection(sections, 'core_concepts');

  // Phase sections (lifecycle, GC stages, AOP proxy creation, etc.)
  const phases = sections.filter(s => s.sectionType === 'phase' && s.content?.trim());

  const analogy        = findSection(sections, 'analogy');
  const keyPoints      = findSection(sections, 'important_points') ?? findSection(sections, 'key_points');
  const codeExample    = findSection(sections, 'code_example');
  const interviewScript = findSection(sections, 'speakable_answer') ?? findSection(sections, 'interview_script');
  const interviewSignal = findSection(sections, 'interview_signal');

  const selfCheckRaw   = findSection(sections, 'self_check');
  const selfCheckItems = selfCheckRaw
    ? selfCheckRaw.split('\n').filter(l => l.trim()).map(l => l.replace(/^[-•○]\s*/, '').trim()).filter(Boolean)
    : (followupQuestions ?? []).slice(0, 4);

  return (
    <div className="space-y-7">

      {/* One-Line Answer */}
      {directAnswer && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 dark:from-background dark:to-background/50">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-[11px] font-bold text-blue-800 dark:text-blue-400 uppercase tracking-widest">In One Line</span>
          </div>
          <p className="text-[15px] font-semibold text-foreground leading-relaxed">{directAnswer}</p>
        </div>
      )}

      {/* Real-World Analogy */}
      {analogy && (
        <div className="rounded-xl border border-amber-200 dark:border-amber-500/20 bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/20/60 px-5 py-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[11px] font-bold text-amber-800 dark:text-amber-400 uppercase tracking-widest">Real-World Analogy</span>
          </div>
          <div className="italic text-foreground text-[15px] leading-relaxed">
            <MarkdownContent content={analogy} stripTopHeading />
          </div>
        </div>
      )}

      {/* Main Concept Explanation */}
      {explanation && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-border dark:from-background dark:to-background/50">
            <BookOpen className="h-4 w-4 text-blue-600 dark:text-blue-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">How It Works</span>
          </div>
          <div className="px-5 py-5 text-[15px] leading-relaxed">
            <MarkdownContent content={explanation} stripTopHeading />
          </div>
        </div>
      )}

      {/* Phase / Lifecycle / Stage sections (numbered timeline) */}
      {phases.length > 0 && (
        <div className="rounded-xl border border-indigo-200 dark:border-indigo-500/20 bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-indigo-50 to-purple-50 border-b border-indigo-200 dark:border-indigo-500/20 dark:from-background dark:to-background/50">
            <Hash className="h-4 w-4 text-indigo-600 dark:text-indigo-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">
              Step-by-Step Breakdown
            </span>
          </div>
          <div className="divide-y divide-slate-100 dark:divide-slate-800/60">
            {phases.map((phase, i) => (
              <div key={phase.id} className="flex gap-4 px-5 py-4">
                <div className="flex-none w-7 h-7 rounded-full bg-indigo-600 dark:bg-indigo-800 text-white text-sm font-bold flex items-center justify-center mt-0.5">
                  {i + 1}
                </div>
                <div className="flex-1 min-w-0">
                  {phase.sectionTitle && (
                    <p className="text-sm font-bold text-foreground mb-1.5">{phase.sectionTitle}</p>
                  )}
                  <div className="text-[14px] leading-relaxed text-foreground">
                    <MarkdownContent content={phase.content} stripTopHeading />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Key Points + Code (side-by-side on desktop) */}
      {(keyPoints || codeExample) && (
        <div className={`grid gap-4 ${keyPoints && codeExample ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {keyPoints && (
            <div className="rounded-xl border border-purple-200 dark:border-purple-500/20 bg-purple-50 dark:bg-purple-950/20/40 overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-3 bg-purple-100 dark:bg-purple-950/20/60 border-b border-purple-200 dark:border-purple-500/20">
                <Star className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                <span className="text-[11px] font-bold text-purple-800 dark:text-purple-400 uppercase tracking-wide">Key Points</span>
              </div>
              <div className="px-4 py-4 text-[14px] leading-relaxed">
                <MarkdownContent content={keyPoints} stripTopHeading />
              </div>
            </div>
          )}
          {codeExample && (
            <div className="rounded-xl border border-border dark:bg-surface overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wide">Code Example</span>
                <CopyButton text={codeExample.replace(/^#[^\n]*\n+/, '').trim()} />
              </div>
              <div className="px-4 py-4">
                <MarkdownContent content={codeExample} stripTopHeading />
              </div>
            </div>
          )}
        </div>
      )}

      {/* Interview Signal */}
      {interviewSignal && (
        <InterviewSignal>
          <MarkdownContent content={interviewSignal} stripTopHeading />
        </InterviewSignal>
      )}

      {/* Say This In Interview — moved last so it's the finale */}
      {interviewScript && (
        <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-500/30 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 bg-gradient-to-r from-emerald-100 to-teal-100 border-b-2 border-emerald-200 dark:border-emerald-500/20">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">Say This In Interview</span>
            </div>
            <CopyButton text={interviewScript.replace(/^#[^\n]*\n+/, '').trim()} />
          </div>
          <div className="px-5 py-5 text-[15px] leading-[1.8]">
            <MarkdownContent content={interviewScript.replace(/^#[^\n]*\n+/, '').trim()} stripTopHeading />
          </div>
        </div>
      )}

      {/* Self-Check */}
      {selfCheckItems.length > 0 && (
        <SelfCheck questions={selfCheckItems} />
      )}
    </div>
  );
}
