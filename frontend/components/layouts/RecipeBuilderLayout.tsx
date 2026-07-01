/**
 * Layout 7: RECIPE BUILDER (Step-by-Step Implementation)
 * For: "How to implement JWT", "How to configure multi-datasource", setup guides
 * Sections: steps (each: title + explanation + code + pitfall), full_code, interview_summary
 */
"use client";
import { useState } from "react";
import { ChevronLeft, ChevronRight, CheckCircle, Copy } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { PitfallBox } from "./shared/PitfallBox";
import type { AnswerSection } from "@/lib/api";

interface RecipeBuilderLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function RecipeBuilderLayout({
  title,
  sections,
  directAnswer,
}: RecipeBuilderLayoutProps) {
  const overview       = sections.find(s => s.sectionType === 'overview' || s.sectionType === 'core_concepts');
  const steps          = sections.filter(s => s.sectionType === 'step' || s.sectionType === 'implementation_step');
  const pitfalls       = sections.filter(s => s.sectionType === 'pitfall' || s.sectionType === 'common_mistakes');
  const fullCode       = sections.find(s => s.sectionType === 'full_code' || s.sectionType === 'code_example');
  const interviewSummary = sections.find(s => s.sectionType === 'interview_summary' || s.sectionType === 'speakable_answer');
  const deepExplain    = sections.find(s => s.sectionType === 'deep_explanation');

  const [activeStep, setActiveStep] = useState(0);
  const [showFullCode, setShowFullCode] = useState(false);
  const [copied, setCopied] = useState(false);

  const hasSteps = steps.length > 0;

  const copyCode = () => {
    if (fullCode?.content) {
      navigator.clipboard.writeText(fullCode.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="space-y-8">
      {directAnswer && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-gradient-to-r from-blue-50 to-indigo-50 px-5 py-4 dark:bg-none dark:bg-background">
          <p className="text-sm font-semibold text-foreground">{directAnswer}</p>
        </div>
      )}

      {/* Overview */}
      {overview && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-surface border-b border-border">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">What You're Building</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Step-by-Step */}
      {hasSteps && (
        <div className="rounded-xl border border-border overflow-hidden">
          {/* Progress Bar */}
          <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-border dark:bg-none dark:bg-background">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-bold text-foreground uppercase tracking-wide">Implementation Steps</span>
              <span className="text-xs text-muted-foreground font-medium">
                Step {activeStep + 1} of {steps.length}
              </span>
            </div>
            {/* Step dots */}
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setActiveStep(i)}
                  className={`h-2 rounded-full transition-all ${
                    i < activeStep ? "bg-emerald-500 flex-1" :
                    i === activeStep ? "bg-blue-600 flex-[2]" :
                    "bg-slate-200 dark:bg-slate-800 flex-1"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Step content */}
          <div className="bg-background">
            <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800/60">
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-blue-600 dark:bg-blue-800 text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {activeStep + 1}
                </span>
                <h3 className="text-base font-bold text-foreground">
                  {steps[activeStep]?.sectionTitle || `Step ${activeStep + 1}`}
                </h3>
              </div>
            </div>
            <div className="px-5 py-5 space-y-4">
              <MarkdownContent content={steps[activeStep]?.content ?? ''} stripTopHeading />
            </div>
          </div>

          {/* Prev / Next */}
          <div className="flex justify-between px-5 py-3 bg-surface border-t border-border">
            <button
              onClick={() => setActiveStep(v => Math.max(0, v - 1))}
              disabled={activeStep === 0}
              className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium text-muted-foreground hover:bg-slate-200 dark:hover:bg-slate-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft className="h-3 w-3" /> Previous
            </button>
            {activeStep < steps.length - 1 ? (
              <button
                onClick={() => setActiveStep(v => Math.min(steps.length - 1, v + 1))}
                className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-medium bg-blue-600 dark:bg-blue-800 text-white hover:bg-blue-700 dark:bg-blue-800 transition-colors"
              >
                Next <ChevronRight className="h-3 w-3" />
              </button>
            ) : (
              <span className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                <CheckCircle className="h-3 w-3" /> All steps done!
              </span>
            )}
          </div>
        </div>
      )}

      {/* Deep explanation fallback */}
      {!hasSteps && deepExplain && (
        <div className="rounded-xl border border-blue-200 dark:border-blue-500/20 bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-blue-200 dark:border-blue-500/20">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Implementation Guide</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={deepExplain.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Common pitfalls */}
      {pitfalls.length > 0 && (
        <div className="space-y-3">
          {pitfalls.map((p, i) => (
            <PitfallBox key={i} title={p.sectionTitle || "Common Pitfall"}>
              <MarkdownContent content={p.content} stripTopHeading />
            </PitfallBox>
          ))}
        </div>
      )}

      {/* Full Code Toggle */}
      {fullCode && (
        <div className="rounded-xl border border-border dark:bg-surface overflow-hidden">
          <div className="flex items-center justify-between px-5 py-3 border-b border-border">
            <button
              onClick={() => setShowFullCode(v => !v)}
              className="text-xs font-bold text-muted-foreground uppercase tracking-wide hover:text-white transition-colors"
            >
              {showFullCode ? "Hide" : "Show"} Complete Implementation
            </button>
            <button
              onClick={copyCode}
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-muted-foreground transition-colors"
            >
              <Copy className="h-3.5 w-3.5" />
              {copied ? "Copied!" : "Copy all"}
            </button>
          </div>
          {showFullCode && (
            <div className="px-5 py-4">
              <MarkdownContent content={fullCode.content} stripTopHeading />
            </div>
          )}
        </div>
      )}

      {/* Interview Summary */}
      {interviewSummary && (
        <div className="rounded-xl border-2 border-emerald-300 dark:border-emerald-500/30 dark:border-emerald-800/60 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/40 dark:to-teal-950/40 overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 dark:bg-emerald-900/30 border-b-2 border-emerald-200 dark:border-emerald-500/20 dark:border-emerald-800/60">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">
              What the Interviewer Sees You Know
            </span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={interviewSummary.content.replace(/^#[^\n]*\n+/, '').trim()} />
          </div>
        </div>
      )}
    </div>
  );
}
