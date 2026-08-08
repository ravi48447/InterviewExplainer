/**
 * analysis-results.tsx — Resume analysis composite (P11-WE..WG, T221..T360).
 *
 * Renders the full resume analysis: overall score, per-dimension findings,
 * and the extracted claims with evidence. Pulls typed contracts from
 * @/lib/resume only (P11-T001).
 */

import { Award, TrendingUp, AlertTriangle, ListChecks, Lightbulb } from "lucide-react";
import type { ResumeAnalysisResult, ResumeAnalysisDimension, ResumeAnalysisFinding, ResumeClaim } from "@/lib/resume";
import { EvidenceCard } from "./evidence-card";

export interface AnalysisResultsProps {
  result: ResumeAnalysisResult;
  /** Optional extracted claims to display as evidence cards. */
  claims?: ResumeClaim[];
}

const DIMENSION_LABEL: Record<ResumeAnalysisDimension, string> = {
  clarity: "Clarity",
  impact: "Impact",
  "ats-compatibility": "ATS compatibility",
  "skill-coverage": "Skill coverage",
  "experience-articulation": "Experience articulation",
  formatting: "Formatting",
};

function findingColor(score: number) {
  return score >= 75
    ? "text-emerald-600 dark:text-emerald-400"
    : score >= 50
    ? "text-amber-600 dark:text-amber-400"
    : "text-red-600 dark:text-red-400";
}

export function AnalysisResults({ result, claims }: AnalysisResultsProps) {
  const good = result.findings.filter((f) => f.status === "good");
  const needsWork = result.findings.filter((f) => f.status === "needs-work");
  const critical = result.findings.filter((f) => f.status === "critical");

  return (
    <div className="space-y-6">
      {/* Overall score */}
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <Award className="h-8 w-8 text-primary mx-auto mb-2" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Overall analysis score
        </h2>
        <p className={`text-4xl font-black mt-1 ${findingColor(result.overallScore)}`}>
          {result.overallScore}
        </p>
      </div>

      {/* Per-dimension findings */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Dimension findings</h3>
        </div>
        <div className="space-y-3">
          {result.findings.map((f: ResumeAnalysisFinding) => (
            <div key={f.dimension} className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-foreground">
                  {DIMENSION_LABEL[f.dimension] ?? f.dimension}
                </span>
                <span className={`text-lg font-bold ${findingColor(f.score)}`}>{f.score}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className="h-full bg-primary rounded-full transition-all"
                  style={{ width: `${f.score}%` }}
                />
              </div>
              {f.summary && (
                <p className="text-xs text-muted-foreground mt-2">{f.summary}</p>
              )}
              {f.improvements.length > 0 && (
                <ul className="mt-2 space-y-1">
                  {f.improvements.map((imp, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-1.5">
                      <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-amber-500" />
                      {imp}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Strengths & risks summary */}
      <div className="grid gap-4 md:grid-cols-2">
        {good.length > 0 && (
          <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
              <h3 className="text-sm font-bold text-foreground">Strong areas</h3>
            </div>
            <ul className="space-y-1.5">
              {good.map((f) => (
                <li key={f.dimension} className="text-sm text-foreground">
                  {DIMENSION_LABEL[f.dimension] ?? f.dimension} · {f.score}
                </li>
              ))}
            </ul>
          </div>
        )}
        {(needsWork.length > 0 || critical.length > 0) && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
              <h3 className="text-sm font-bold text-foreground">Needs attention</h3>
            </div>
            <ul className="space-y-1.5">
              {[...critical, ...needsWork].map((f) => (
                <li key={f.dimension} className="text-sm text-foreground">
                  {DIMENSION_LABEL[f.dimension] ?? f.dimension} · {f.score}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Top improvements */}
      {result.topImprovements.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <div className="flex items-center gap-2 mb-3">
            <Lightbulb className="h-5 w-5 text-amber-500" />
            <h3 className="text-sm font-bold text-foreground">Top improvements</h3>
          </div>
          <ul className="space-y-2">
            {result.topImprovements.map((imp, i) => (
              <li key={i} className="text-sm text-foreground">
                {imp}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Evidence-backed claims */}
      {claims && claims.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ListChecks className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Extracted claims</h3>
          </div>
          <div className="space-y-3">
            {claims.map((c) => (
              <EvidenceCard key={c.id} claim={c} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
