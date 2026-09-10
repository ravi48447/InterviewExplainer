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
      <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-4">
        <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1.5">Question</div>
        <h2 className="text-lg font-bold text-stone-100 leading-snug">{question.question}</h2>
      </div>
      {rubricChecklist.length > 0 && (
        <div className="rounded-2xl border border-[#33404d] bg-[#131820] p-4">
          <div className="flex items-center gap-2 mb-2.5">
            <ListChecks className="h-4 w-4 text-[#9ab8d4]" />
            <span className="text-xs font-semibold text-[#9ab8d4]">What the interviewer is listening for</span>
            <span className="text-[10px] text-stone-500">(tick as you cover them — not scored)</span>
          </div>
          <div className="grid sm:grid-cols-2 gap-1.5">
            {rubricChecklist.map((c, i) => (
              <button
                key={i}
                onClick={() => onCheck?.(i)}
                className={`flex items-start gap-2 text-left text-xs rounded-lg px-2.5 py-2 border transition-colors ${
                  checked[i]
                    ? 'border-emerald-800/60 bg-emerald-950/30 text-emerald-200'
                    : 'border-[#1e2a33] bg-[#0f141a] text-stone-400 hover:border-[#33404d]'
                }`}
              >
                {checked[i] ? <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" /> : <Circle className="h-3.5 w-3.5 mt-0.5 shrink-0" />}
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
      <div className="rounded-2xl border border-[#3d4a34] bg-[#161a13] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Code2 className="h-4 w-4 text-[#a3c291]" />
          <span className="text-[10px] uppercase tracking-wider text-[#a3c291]">DSA round</span>
        </div>
        <h2 className="text-[15px] font-bold text-stone-100 leading-relaxed whitespace-pre-wrap">{problem.question}</h2>
        {problem.constraints && (
          <p className="mt-3 text-xs text-stone-400 whitespace-pre-wrap border-t border-[#26241f] pt-2.5">{problem.constraints}</p>
        )}
      </div>

      {problem.examples && problem.examples.length > 0 && (
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-4 space-y-2">
          <div className="text-[10px] uppercase tracking-wider text-stone-500">Examples</div>
          {problem.examples.map((ex, i) => (
            <div key={i} className="text-xs font-mono bg-[#0f0e0c] rounded-lg px-3 py-2 border border-[#1f1e1b]">
              <div><span className="text-stone-500">Input: </span><span className="text-stone-300">{ex.input}</span></div>
              <div><span className="text-stone-500">Output: </span><span className="text-emerald-300">{ex.output}</span></div>
            </div>
          ))}
        </div>
      )}

      <div className="rounded-2xl border border-[#26241f] overflow-hidden">
        <div className="flex items-center justify-between px-4 py-2 bg-[#141311] border-b border-[#26241f]">
          <span className="text-[10px] uppercase tracking-wider text-stone-500 flex items-center gap-1.5">
            <Code2 className="h-3 w-3" /> Your solution
          </span>
          <span className="text-[10px] text-stone-600 font-mono">{lang || 'java'}</span>
        </div>
        <textarea
          value={code}
          onChange={(e) => onCodeChange(e.target.value)}
          spellCheck={false}
          rows={14}
          className="w-full bg-[#0d0c0a] text-stone-200 font-mono text-[13px] leading-relaxed p-4 outline-none resize-y"
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
      <div className="rounded-2xl border border-[#4d3a28] bg-[#1a1510] p-4">
        <div className="flex items-center gap-2 mb-2">
          <Star className="h-4 w-4 text-[#d4a778]" />
          <span className="text-[10px] uppercase tracking-wider text-[#d4a778]">Behavioral round</span>
        </div>
        <h2 className="text-[15px] font-bold text-stone-100 leading-relaxed">{question.question}</h2>
      </div>
      <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-4">
        <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-3">STAR structure — live detection</div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {starParts.map((p) => (
            <div
              key={p.part}
              className={`rounded-xl border p-3 text-center transition-colors ${
                p.detected ? 'border-emerald-800/60 bg-emerald-950/30' : 'border-[#26241f] bg-[#100f0d]'
              }`}
            >
              <div className={`text-xl font-black ${p.detected ? 'text-emerald-300' : 'text-stone-700'}`}>{p.part}</div>
              <div className={`text-[10px] ${p.detected ? 'text-emerald-400' : 'text-stone-600'}`}>{p.name}</div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[10px] text-stone-600">
          Parts light up as your story covers them — Situation, Task, Action, Result. Metrics in the Result make it stick.
        </p>
      </div>
    </div>
  );
}
