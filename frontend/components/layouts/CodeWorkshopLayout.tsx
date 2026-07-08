/**
 * Layout 4: CODE WORKSHOP
 * For: Streams, lambdas, functional patterns, Java 8+ features
 * Sections: overview, pipeline_visual, recipe_cards, common_mistakes, quiz
 */
"use client";
import { useState } from "react";
import { Code2, AlertTriangle, BookOpen, Sparkles } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { PitfallBox } from "./shared/PitfallBox";
import { SelfCheck } from "./shared/SelfCheck";
import type { AnswerSection } from "@/lib/api";

interface CodeWorkshopLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
  followupQuestions?: string[];
}

export function CodeWorkshopLayout({
  title,
  sections,
  directAnswer,
  followupQuestions,
}: CodeWorkshopLayoutProps) {
  const overview       = sections.find(s => s.sectionType === 'core_concepts' || s.sectionType === 'overview');
  const explanation    = sections.find(s => s.sectionType === 'deep_explanation' || s.sectionType === 'explanation');
  const recipeSections = sections.filter(s => s.sectionType === 'recipe' || s.sectionType === 'code_example' || s.sectionType === 'pattern');
  const mistakes       = sections.filter(s => s.sectionType === 'common_mistakes' || s.sectionType === 'pitfall');
  const bestPractices  = sections.find(s => s.sectionType === 'best_practices');
  const speakable      = sections.find(s => s.sectionType === 'speakable_answer');
  const selfCheckRaw   = sections.find(s => s.sectionType === 'self_check');
  const selfCheckItems = selfCheckRaw?.content?.split('\n').filter(l => l.trim()).map(l => l.replace(/^[-•○]\s*/, '').trim()).filter(Boolean) ?? (followupQuestions ?? []).slice(0, 4);

  const [activeRecipe, setActiveRecipe] = useState(0);
  const [showMistakes, setShowMistakes] = useState(false);

  return (
    <div className="space-y-8">
      {/* Quick intro */}
      {directAnswer && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-surface px-5 py-4  ">
          <p className="text-sm font-semibold text-foreground">{directAnswer}</p>
        </div>
      )}

      {/* Overview / Core Concepts */}
      {overview && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-surface border-b border-border">
            <BookOpen className="h-4 w-4 text-primary dark:text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Core Concepts</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={overview.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Deep Explanation */}
      {explanation && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-default dark:border-default/20">
            <Sparkles className="h-4 w-4 text-primary dark:text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">How It Works</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={explanation.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Recipe Cards */}
      {recipeSections.length > 0 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-1 px-4 py-2 bg-surface border-b border-border">
            <Code2 className="h-4 w-4 text-muted-foreground mr-1" />
            {recipeSections.map((r, i) => (
              <button
                key={i}
                onClick={() => setActiveRecipe(i)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeRecipe === i ? "bg-background shadow-sm text-primary dark:text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {r.sectionTitle || `Pattern ${i + 1}`}
              </button>
            ))}
          </div>
          <div className="p-4">
            <MarkdownContent content={recipeSections[activeRecipe]?.content ?? ''} stripTopHeading />
          </div>
        </div>
      )}

      {/* Best Practices */}
      {bestPractices && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-950/20/40 overflow-hidden">
          <div className="px-5 py-3 bg-emerald-100 dark:bg-emerald-950/20/60 border-b border-default dark:border-default/20">
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">Best Practices</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={bestPractices.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Common Mistakes (collapsible) */}
      {mistakes.length > 0 && (
        <div>
          <button
            onClick={() => setShowMistakes(v => !v)}
            className="flex items-center gap-2 text-sm font-medium text-red-600 hover:text-red-700 dark:text-red-400 mb-3"
          >
            <AlertTriangle className="h-4 w-4" />
            {showMistakes ? "Hide" : "Show"} Common Mistakes ({mistakes.length})
          </button>
          {showMistakes && (
            <div className="space-y-3">
              {mistakes.map((m, i) => (
                <PitfallBox key={i} title={m.sectionTitle || "Common Mistake"}>
                  <MarkdownContent content={m.content} stripTopHeading />
                </PitfallBox>
              ))}
            </div>
          )}
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

      {/* Self-Check */}
      {selfCheckItems.length > 0 && <SelfCheck questions={selfCheckItems} />}
    </div>
  );
}
