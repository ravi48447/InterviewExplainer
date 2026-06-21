/**
 * Layout 13: ALGORITHM WORKSHOP
 * For: DSA problems — two sum, LRU cache, graph traversal, etc.
 * Sections: problem, constraints, examples, approaches (brute/optimal), complexity_table, java_tip, pattern_badge
 */
"use client";
import { useState } from "react";
import { Tag, Cpu, Lightbulb, ArrowUpRight } from "lucide-react";
import MarkdownContent from "@/components/MarkdownContent";
import type { AnswerSection } from "@/lib/api";

interface ComplexityRow {
  approach: string;
  time: string;
  space: string;
  preferred?: boolean;
}

interface AlgorithmWorkshopLayoutProps {
  title: string;
  sections: AnswerSection[];
  directAnswer?: string;
}

export function AlgorithmWorkshopLayout({
  title,
  sections,
  directAnswer,
}: AlgorithmWorkshopLayoutProps) {
  const problem          = sections.find(s => s.sectionType === 'problem_statement' || s.sectionType === 'core_concepts');
  const constraints      = sections.find(s => s.sectionType === 'constraints');
  const examples         = sections.find(s => s.sectionType === 'examples');
  const approaches       = sections.filter(s => s.sectionType === 'approach' || s.sectionType === 'algorithm_approach');
  const complexityTable  = sections.find(s => s.sectionType === 'complexity_table');
  const patternBadge     = sections.find(s => s.sectionType === 'pattern_badge' || s.sectionType === 'pattern');
  const javaTip          = sections.find(s => s.sectionType === 'java_tip' || s.sectionType === 'best_practices');
  const similarProblems  = sections.find(s => s.sectionType === 'similar_problems');
  const deepExplain      = sections.find(s => s.sectionType === 'deep_explanation' || s.sectionType === 'explanation');

  const [activeApproach, setActiveApproach] = useState(approaches.length > 0 ? approaches.length - 1 : 0); // default to optimal (last)

  const APPROACH_ICONS: Record<number, string> = { 0: '🐌', 1: '⚡', 2: '🚀' };

  return (
    <div className="space-y-8">
      {/* Problem + constraints */}
      <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
        <div className="px-5 py-3 bg-gradient-to-r from-slate-50 to-blue-50 border-b border-slate-200 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Problem</span>
          {patternBadge && (
            <span className="flex items-center gap-1 px-2.5 py-1 bg-violet-100 text-violet-700 rounded-full text-[11px] font-bold border border-violet-200">
              <Tag className="h-3 w-3" />
              {patternBadge.content.replace(/^#[^\n]*\n+/, '').trim()}
            </span>
          )}
        </div>
        <div className="px-5 py-5 space-y-4">
          {problem && <MarkdownContent content={problem.content} stripTopHeading />}
          {directAnswer && !problem && <p className="text-sm text-slate-700">{directAnswer}</p>}
          {constraints && (
            <div className="rounded-lg bg-slate-50 border border-slate-200 px-4 py-3 text-sm text-slate-600">
              <span className="font-bold text-slate-700 block mb-1">Constraints:</span>
              <MarkdownContent content={constraints.content} stripTopHeading />
            </div>
          )}
        </div>
      </div>

      {/* Examples */}
      {examples && (
        <div className="rounded-xl border border-indigo-200 bg-indigo-50/40 overflow-hidden">
          <div className="px-5 py-3 bg-indigo-100/50 border-b border-indigo-200">
            <span className="text-xs font-bold text-indigo-800 uppercase tracking-wide">Examples</span>
          </div>
          <div className="px-5 py-4 font-mono text-sm">
            <MarkdownContent content={examples.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Approaches (tabbed) */}
      {approaches.length > 0 && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="flex items-center gap-1 px-4 py-2 bg-slate-50 border-b border-slate-200">
            <Cpu className="h-4 w-4 text-slate-500 mr-1" />
            {approaches.map((a, i) => (
              <button
                key={i}
                onClick={() => setActiveApproach(i)}
                className={`px-3 py-1 rounded text-xs font-medium transition-colors ${
                  activeApproach === i ? "bg-white shadow-sm text-blue-700 border border-blue-200" : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {APPROACH_ICONS[i] ?? ''} {a.sectionTitle || (i === 0 ? 'Brute Force' : i === approaches.length - 1 ? 'Optimal' : `Approach ${i + 1}`)}
              </button>
            ))}
          </div>
          <div className="px-5 py-5 bg-white">
            <MarkdownContent content={approaches[activeApproach]?.content ?? ''} stripTopHeading />
          </div>
        </div>
      )}

      {/* Deep explanation (fallback) */}
      {approaches.length === 0 && deepExplain && (
        <div className="rounded-xl border border-blue-200 bg-white shadow-sm overflow-hidden">
          <div className="px-5 py-3 bg-blue-50 border-b border-blue-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Solution Approach</span>
          </div>
          <div className="px-5 py-5">
            <MarkdownContent content={deepExplain.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Complexity Table */}
      {complexityTable ? (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Time & Space Complexity</span>
          </div>
          <div className="px-5 py-4 overflow-x-auto">
            <MarkdownContent content={complexityTable.content} stripTopHeading />
          </div>
        </div>
      ) : approaches.length > 1 && (
        <div className="rounded-xl border border-slate-200 overflow-hidden">
          <div className="px-5 py-3 bg-slate-50 border-b border-slate-200">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wide">Complexity Summary</span>
          </div>
          <table className="w-full text-sm">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-5 py-2 text-left text-[11px] font-bold text-slate-500 uppercase">Approach</th>
                <th className="px-5 py-2 text-left text-[11px] font-bold text-slate-500 uppercase">Time</th>
                <th className="px-5 py-2 text-left text-[11px] font-bold text-slate-500 uppercase">Space</th>
              </tr>
            </thead>
            <tbody>
              {approaches.map((a, i) => (
                <tr key={i} className={i === approaches.length - 1 ? "bg-emerald-50" : ""}>
                  <td className="px-5 py-2 font-medium text-slate-700 flex items-center gap-1">
                    {a.sectionTitle || (i === 0 ? 'Brute Force' : 'Optimal')}
                    {i === approaches.length - 1 && (
                      <span className="ml-1 text-[10px] font-bold text-emerald-600 bg-emerald-100 px-1.5 py-0.5 rounded">PREFERRED</span>
                    )}
                  </td>
                  <td className="px-5 py-2 text-slate-600 font-mono text-xs">—</td>
                  <td className="px-5 py-2 text-slate-600 font-mono text-xs">—</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Java Tip */}
      {javaTip && (
        <div className="rounded-xl border border-amber-200 bg-amber-50/60 px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <Lightbulb className="h-4 w-4 text-amber-600" />
            <span className="text-[11px] font-bold text-amber-800 uppercase tracking-wide">Java-Specific Tip</span>
          </div>
          <div className="text-sm text-slate-700">
            <MarkdownContent content={javaTip.content} stripTopHeading />
          </div>
        </div>
      )}

      {/* Similar Problems */}
      {similarProblems && (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-4">
          <div className="flex items-center gap-2 mb-2">
            <ArrowUpRight className="h-4 w-4 text-slate-500" />
            <span className="text-[11px] font-bold text-slate-600 uppercase tracking-wide">Similar Problems</span>
          </div>
          <MarkdownContent content={similarProblems.content} stripTopHeading />
        </div>
      )}
    </div>
  );
}
