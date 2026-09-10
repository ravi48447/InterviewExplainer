'use client';
/**
 * ModeWorkspaces.tsx — the per-mode workspaces inside the interview room.
 * Technical (concept checklist + speaking), DSA (statement/examples/editor),
 * Behavioral (STAR tracker).
 */

import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Circle, Lightbulb, Code2, ListChecks, Clock, Star } from 'lucide-react';

// ---------------------------------------------------------------------------
// Technical: rubric transparency + structured thinking space
// ---------------------------------------------------------------------------

export function TechnicalWorkspace({
  question,
  rubricChecklist,
  onCheck,
  checked,
}: {
  question: { question: string; learnUrl?: string | null; topic?: string };
  rubricChecklist: string[];
  onCheck?: (i: number) => void;
  checked: boolean[];
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 lg:p-5">
        <div className="mb-1.5 text-caption font-medium uppercase tracking-wider text-muted-foreground">Question</div>
        <h2 className="text-section font-semibold text-foreground leading-snug">{question.question}</h2>
      </div>
      {rubricChecklist.length > 0 && (
        <div className="rounded-lg border border-border bg-surface p-4">
          <div className="mb-2.5 flex items-center gap-2">
            <ListChecks className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-foreground">What the interviewer is listening for</span>
            <span className="text-caption text-muted-foreground">(tick as you cover them — not scored)</span>
          </div>
          <div className="grid gap-1.5 sm:grid-cols-2">
            {rubricChecklist.map((c, i) => (
              <button
                key={i}
                onClick={() => onCheck?.(i)}
                className={`flex items-start gap-2 rounded-lg border px-2.5 py-2 text-left text-sm transition-colors ${
                  checked[i]
                    ? 'border-emerald-600/40 bg-emerald-500/10 text-foreground'
                    : 'border-border bg-background text-muted-foreground hover:bg-muted'
                }`}
              >
                {checked[i] ? <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" /> : <Circle className="mt-0.5 h-4 w-4 shrink-0" />}
                <span>{c}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// DSA: real problem statement, examples, editor, complexity defence
// ---------------------------------------------------------------------------

export function DsaWorkspace({
  problem,
  code,
  onCodeChange,
  lang,
}: {
  problem: {
    question: string;
    examples?: { input: string; output: string }[];
    constraints?: string;
    starterCode?: string | null;
    codingLang?: string | null;
  };
  code: string;
  onCodeChange: (v: string) => void;
  lang: string;
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 lg:p-5">
        <div className="mb-2 flex items-center gap-2">
          <Code2 className="h-4 w-4 text-primary" />
          <span className="text-caption font-medium uppercase tracking-wider text-muted-foreground">DSA round</span>
        </div>
        <h2 className="whitespace-pre-wrap text-base font-medium leading-relaxed text-foreground">{problem.question}</h2>
        {problem.constraints && (
          <p className="mt-3 whitespace-pre-wrap border-t border-border pt-2.5 text-sm text-muted-foreground">{problem.constraints}</p>
        )}
      </div>

      {problem.examples && problem.examples.length > 0 && (
        <div className="space-y-2 rounded-lg border border-border bg-surface p-4">
          <div className="text-caption font-medium uppercase tracking-wider text-muted-foreground">Examples</div>
          {problem.examples.map((ex, i) => (
            <div key={i} className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-sm">
              <div><span className="text-muted-foreground">Input: </span><span className="text-foreground">{ex.input}</span></div>
              <div><span className="text-muted-foreground">Output: </span><span className="text-emerald-600">{ex.output}</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="overflow-hidden rounded-lg border border-border">
        <div className="flex items-center justify-between border-b border-border bg-surface px-4 py-2">
          <span className="flex items-center gap-1.5 text-caption font-medium uppercase tracking-wider text-muted-foreground">
            <Code2 className="h-3.5 w-3.5" /> Your solution
          </span>
          <span className="font-mono text-caption text-muted-foreground">{lang || 'java'}</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          spellCheck={false}
          rows={14}
          className="w-full resize-y bg-background p-4 font-mono text-sm leading-relaxed text-foreground outline-none"
          placeholder="Write your solution — think complexity out loud as you type…"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Behavioral: STAR tracker
// ---------------------------------------------------------------------------

export function BehavioralWorkspace({
  question,
  starParts,
}: {
  question: { question: string };
  starParts: { part: string; name: string; detected: boolean }[];
}) {
  return (
    <div className="space-y-4">
      <div className="rounded-lg border border-border bg-surface p-4 lg:p-5">
        <div className="mb-2 flex items-center gap-2">
          <Star className="h-4 w-4 text-primary" />
          <span className="text-caption font-medium uppercase tracking-wider text-muted-foreground">Behavioral round</span>
        </div>
        <h2 className="text-base font-medium leading-relaxed text-foreground">{question.question}</h2>
      </div>
      <div className="rounded-lg border border-border bg-surface p-4">
        <div className="mb-3 text-caption font-medium uppercase tracking-wider text-muted-foreground">STAR structure — live detection</div>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
          {starParts.map((p) => (
            <div
              key={p.part}
              className={`rounded-lg border p-3 text-center transition-colors ${
                p.detected ? 'border-emerald-600/40 bg-emerald-500/10' : 'border-border bg-background'
              }`}
            >
              <div className={`text-xl font-bold ${p.detected ? 'text-emerald-600' : 'text-muted-foreground/40'}`}>{p.part}</div>
              <div className={`text-caption ${p.detected ? 'text-emerald-600' : 'text-muted-foreground'}`}>{p.name}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-caption text-muted-foreground">
          Parts light up as your story covers them — Situation, Task, Action, Result. Metrics in the Result make it stick.
        </p>
      </div>
    </div>
  );
}
