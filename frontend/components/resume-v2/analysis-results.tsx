/**
 * analysis-results.tsx — Resume analysis composite (P11-WE..WG, T221..T360).
 *
 * Renders the full resume analysis: overall score (as a circular gauge),
 * per-dimension findings (as a structured grid with mini progress bars),
 * grouped strengths/needs-attention, top improvements, and the extracted
 * claims with evidence. Pulls typed contracts from @/lib/resume only
 * (P11-T001).
 */

import { Award, TrendingUp, AlertTriangle, ListChecks, Lightbulb } from "lucide-react";
import type { ResumeAnalysisResult, ResumeAnalysisDimension, ResumeAnalysisFinding, ResumeClaim } from "@/lib/resume";
import { Tag } from "@/components/ui/tag";
import { ScoreRing } from "@/components/ui/score-ring";
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
    ? "text-success"
    : score >= 50
    ? "text-warning"
    : "text-destructive";
}

function findingBarClass(score: number) {
  return score >= 75
    ? "bg-success"
    : score >= 50
    ? "bg-warning"
    : "bg-destructive";
}

export function AnalysisResults({ result, claims }: AnalysisResultsProps) {
  const good = result.findings.filter((f) => f.status === "good");
  const needsWork = result.findings.filter((f) => f.status === "needs-work");
  const critical = result.findings.filter((f) => f.status === "critical");

  return (
    <div className="space-y-6">
      {/* Overall score — circular gauge replaces the flat number */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center gap-3" aria-live="polite">
        <span className="inline-flex items-center gap-1.5 type-label text-muted-foreground">
          <Award className="h-3.5 w-3.5" aria-hidden="true" />
          Overall analysis score
        </span>
        <ScoreRing value={result.overallScore} size={132} label="out of 100" ariaLabel={`Overall analysis score ${result.overallScore} out of 100`} />
      </div>

      {/* Per-dimension findings — structured grid with mini progress bars */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-center gap-2 mb-4">
          <ListChecks className="h-5 w-5 text-primary" />
          <h3 className="text-lg font-bold text-foreground">Dimension findings</h3>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {result.findings.map((f: ResumeAnalysisFinding) => (
            <div key={f.dimension} className="rounded-lg border border-border bg-muted/30 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-medium text-foreground">
                  {DIMENSION_LABEL[f.dimension] ?? f.dimension}
                </span>
                <span className={`text-lg font-bold tabular-nums ${findingColor(f.score)}`}>{f.score}</span>
              </div>
              <div className="mt-2 h-1.5 rounded-full bg-border overflow-hidden">
                <div
                  className={`h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none ${findingBarClass(f.score)}`}
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
                      <Lightbulb className="h-3.5 w-3.5 shrink-0 mt-0.5 text-warning" />
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
          <div className="rounded-xl border border-success/30 bg-success/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="h-5 w-5 text-success" />
              <h3 className="text-sm font-bold text-foreground">Strong areas</h3>
            </div>
            <ul className="space-y-1.5">
              {good.map((f) => (
                <li key={f.dimension} className="text-sm text-foreground flex items-center justify-between">
                  <span>{DIMENSION_LABEL[f.dimension] ?? f.dimension}</span>
                  <span className="text-xs font-semibold text-success tabular-nums">{f.score}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
        {(needsWork.length > 0 || critical.length > 0) && (
          <div className="rounded-xl border border-warning/30 bg-warning/5 p-5">
            <div className="flex items-center gap-2 mb-3">
              <AlertTriangle className="h-5 w-5 text-warning" />
              <h3 className="text-sm font-bold text-foreground">Needs attention</h3>
            </div>
            <ul className="space-y-1.5">
              {[...critical, ...needsWork].map((f) => (
                <li key={f.dimension} className="text-sm text-foreground flex items-center justify-between">
                  <span>{DIMENSION_LABEL[f.dimension] ?? f.dimension}</span>
                  <span className="text-xs font-semibold text-warning tabular-nums">{f.score}</span>
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
            <Lightbulb className="h-5 w-5 text-warning" />
            <h3 className="text-sm font-bold text-foreground">Top improvements</h3>
          </div>
          <ol className="space-y-2">
            {result.topImprovements.map((imp, i) => (
              <li key={i} className="text-sm text-foreground flex items-start gap-2.5">
                <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full border border-border bg-surface text-xs font-bold text-muted-foreground tabular-nums">
                  {i + 1}
                </span>
                <span>{imp}</span>
              </li>
            ))}
          </ol>
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
