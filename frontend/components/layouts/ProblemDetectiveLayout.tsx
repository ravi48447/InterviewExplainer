/**
 * Layout 8: PROBLEM DETECTIVE
 * For: Debugging, N+1, deadlock, OOM, slow queries, connection pool exhaustion
 * Sections: problem_statement, symptoms, root_cause, solution (before/after code), prevention, interview_script
 */
"use client";
import { useState } from "react";
import { AlertOctagon, List, Microscope, Wrench, Shield, Mic } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import { DiffViewer } from "./shared/DiffViewer";
import type { AnswerSection } from "@/lib/api";

interface ProblemDetectiveLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function ProblemDetectiveLayout({
  title,
  sections,
  directAnswer,
}: ProblemDetectiveLayoutProps) {
  const problemStatement = sections.find(s => s.sectionType === 'problem_statement');
  const symptoms         = sections.find(s => s.sectionType === 'symptoms');
  const rootCause        = sections.find(s => s.sectionType === 'root_cause' || s.sectionType === 'deep_explanation');
  const beforeCode       = sections.find(s => s.sectionType === 'before_code' || s.sectionType === 'bad_code');
  const afterCode        = sections.find(s => s.sectionType === 'after_code' || s.sectionType === 'solution_code');
  const solutionSections = sections.filter(s => s.sectionType === 'solution' || s.sectionType === 'solution_option');
  const prevention       = sections.find(s => s.sectionType === 'prevention' || s.sectionType === 'best_practices');
  const speakable        = sections.find(s => s.sectionType === 'speakable_answer');
  const explanation      = sections.find(s => s.sectionType === 'explanation' || s.sectionType === 'core_concepts');

  const [activeSolution, setActiveSolution] = useState(0);

  return (
    <div className="space-y-8">
      {/* Problem Statement */}
      {(problemStatement || directAnswer) && (
        <div className="rounded-xl border-2 border-default dark:border-default/20 bg-surface overflow-hidden  ">
          <div className="flex items-center gap-2 px-5 py-3 bg-red-100 dark:bg-red-950/20 border-b-2 border-default dark:border-default/20">
            <AlertOctagon className="h-4 w-4 text-red-600 dark:text-red-400" />
            <span className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-widest">The Problem</span>
          </div>
          <div className="px-5 py-4">
            {problemStatement
              ? <MarkdownContent content={problemStatement.content} stripTopHeading />
              : <p className="text-base text-foreground">{directAnswer}</p>
            }
          </div>
        </div>
      )}

      {/* Symptoms */}
      {symptoms && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-amber-50 dark:bg-amber-500/10 dark:bg-amber-950/20/60 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-amber-100 dark:bg-amber-950/20/50 border-b border-default dark:border-default/20">
            <List className="h-4 w-4 text-amber-600 dark:text-amber-400" />
            <span className="text-xs font-bold text-amber-800 dark:text-amber-400 uppercase tracking-wide">How to Recognize It (Symptoms)</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={symptoms.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Explanation / context */}
      {explanation && (
        <div className="rounded-xl border border-border bg-background shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-surface border-b border-border">
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Background & Context</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={explanation.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Root Cause */}
      {rootCause && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-blue-50 dark:bg-blue-500/10 border-b border-default dark:border-default/20">
            <Microscope className="h-4 w-4 text-primary dark:text-primary" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Root Cause</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={rootCause.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Before/After Diff */}
      {beforeCode && afterCode && (
        <div>
          <div className="text-xs font-bold text-foreground uppercase tracking-wide mb-3 flex items-center gap-2">
            <Wrench className="h-4 w-4 text-muted-foreground" />
            The Fix
          </div>
          <DiffViewer
            before={beforeCode.content}
            after={afterCode.content}
            beforeLabel={beforeCode.sectionTitle || "Before (Problem)"}
            afterLabel={afterCode.sectionTitle || "After (Fixed)"}
          />
        </div>
      )}

      {/* Solution Tabs */}
      {solutionSections.length > 1 && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex items-center gap-1 px-4 py-2 bg-surface border-b border-border">
            <Wrench className="h-4 w-4 text-muted-foreground mr-1" />
            {solutionSections.map((sol, i) => (
              <button
                key={i}
                onClick={() => setActiveSolution(i)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeSolution === i ? "bg-background shadow-sm text-primary dark:text-primary" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {sol.sectionTitle || `Solution ${i + 1}`}
              </button>
            ))}
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={solutionSections[activeSolution]?.content ?? ''} stripTopHeading />
          </div>
        </div>
      )}

      {/* Single solution (no before/after) */}
      {solutionSections.length === 1 && !beforeCode && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-background shadow-sm overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-emerald-50 dark:bg-emerald-500/10 border-b border-default dark:border-default/20">
            <Wrench className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">Solution</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={solutionSections[0].content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Prevention */}
      {prevention && (
        <div className="rounded-xl border border-default dark:border-default/20 bg-emerald-50 dark:bg-emerald-500/10 dark:bg-emerald-950/20/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-emerald-100 dark:bg-emerald-950/20/50 border-b border-default dark:border-default/20">
            <Shield className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-bold text-emerald-800 dark:text-emerald-400 uppercase tracking-wide">How to Prevent It</span>
          </div>
          <div className="px-5 py-4">
            <MarkdownContent content={prevention.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Speakable */}
      {speakable && (
        <div className="rounded-xl border-2 border-default dark:border-default/30 dark:border-default/60 bg-surface border border-default dark:to-teal-950/40 overflow-hidden">
          <div className="flex items-center gap-2 px-5 py-3 bg-emerald-100 dark:bg-emerald-900/30 border-b-2 border-default dark:border-default/20 dark:border-default/60">
            <Mic className="h-4 w-4 text-emerald-700 dark:text-emerald-400" />
            <span className="text-xs font-bold text-foreground uppercase tracking-wide">3-Sentence Interview Answer</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={speakable.content.replace(/^#[^\n]*\n+/, '').trim()} />
          </div>
        </div>
      )}
    </div>
  );
}
