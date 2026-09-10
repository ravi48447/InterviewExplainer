/**
 * job-match-results.tsx — Job match & gap report composite (P11-WF..WH, T321..T580).
 *
 * Renders the overall match score (as a circular gauge), a coverage summary
 * bar, requirement mappings (strong/moderate/weak/no-match), skill gaps,
 * interview risk areas, and the derived prep plan. Pulls typed contracts
 * from @/lib/resume only (P11-T001).
 */

import { Target, CheckCircle2, XCircle, ShieldAlert, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScoreRing } from "@/components/ui/score-ring";
import type { JobMatchResult, RequirementMapping, MatchStatus, InterviewRiskArea } from "@/lib/resume";
import { GapItem } from "./gap-item";
import { RecommendationItem } from "./recommendation-item";

export interface JobMatchResultsProps {
  result: JobMatchResult;
}

const STATUS_META: Record<MatchStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  strong: { label: "Strong match", color: "text-success", icon: CheckCircle2 },
  moderate: { label: "Moderate", color: "text-warning", icon: CheckCircle2 },
  weak: { label: "Weak", color: "text-warning", icon: XCircle },
  "no-match": { label: "No match", color: "text-destructive", icon: XCircle },
};

const RISK_COLOR = {
  high: "border-destructive/40 bg-destructive/5 text-destructive",
  medium: "border-warning/40 bg-warning/5 text-warning",
  low: "border-border bg-muted text-muted-foreground",
} as const;

export function JobMatchResults({ result }: JobMatchResultsProps) {
  const score = result.overallMatchScore;
  const total = result.mappings.length;
  const matched = result.mappings.filter((m) => m.matchStatus === "strong" || m.matchStatus === "moderate");
  const coveragePct = total > 0 ? Math.round((matched.length / total) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Score header — circular gauge + coverage summary */}
      <div className="rounded-xl border border-border bg-card p-6 flex flex-col items-center gap-4 sm:flex-row sm:items-center sm:gap-6" aria-live="polite">
        <ScoreRing value={score} suffix="%" size={132} label="overall match" ariaLabel={`Overall match score ${score} percent`} />
        <div className="flex-1 text-center sm:text-left">
          <h2 className="flex items-center justify-center sm:justify-start gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
            <Target className="h-4 w-4" aria-hidden="true" />
            Requirement coverage
          </h2>
          <p className="mt-2 text-2xl font-bold text-foreground tabular-nums">
            {matched.length}<span className="text-muted-foreground font-medium">/{total}</span>
            <span className="text-base font-medium text-muted-foreground"> requirements covered</span>
          </p>
          {/* Coverage bar */}
          <div className="mt-3 h-2 rounded-full bg-border overflow-hidden">
            <div
              className="h-full rounded-full bg-primary transition-[width] duration-700 ease-out motion-reduce:transition-none"
              style={{ width: `${coveragePct}%` }}
            />
          </div>
          <div className="mt-3 flex flex-wrap justify-center sm:justify-start gap-1.5">
            <Badge variant="outline" className="text-success border-success/30">
              {result.mappings.filter((m) => m.matchStatus === "strong").length} strong
            </Badge>
            <Badge variant="outline" className="text-warning border-warning/30">
              {result.mappings.filter((m) => m.matchStatus === "moderate").length} moderate
            </Badge>
            <Badge variant="outline" className="text-warning border-warning/30">
              {result.mappings.filter((m) => m.matchStatus === "weak").length} weak
            </Badge>
            <Badge variant="outline" className="text-destructive border-destructive/30">
              {result.mappings.filter((m) => m.matchStatus === "no-match").length} no match
            </Badge>
          </div>
        </div>
      </div>

      {/* Requirement mappings */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h3 className="text-lg font-bold text-foreground mb-4">Requirement coverage</h3>
        <div className="space-y-2">
          {result.mappings.map((m: RequirementMapping) => {
            const meta = STATUS_META[m.matchStatus];
            const Icon = meta.icon;
            return (
            <div key={m.requirementId} className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-3">
              <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${meta.color}`} aria-hidden="true" />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground">{m.requirementText}</p>
                <div className="flex flex-wrap items-center gap-2 mt-1">
                  <Badge variant="outline" className={meta.color}>
                    {meta.label}
                  </Badge>
                  {m.evidence.length > 0 && (
                    <span className="text-xs text-muted-foreground">
                      {m.evidence.length} evidence{m.evidence.length > 1 ? "s" : ""}
                    </span>
                  )}
                </div>
                {m.evidence.length > 0 && (
                  <ul className="mt-2 space-y-1">
                    {m.evidence.slice(0, 3).map((e, i) => (
                      <li key={i} className="text-xs text-muted-foreground pl-3 border-l-2 border-border">
                        {e}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
            );
          })}
        </div>
      </div>

      {/* Skill gaps */}
      {result.gaps.length > 0 && (
        <div>
          <h3 className="text-lg font-bold text-foreground mb-3">Skill gaps ({result.gaps.length})</h3>
          <div className="space-y-2">
            {result.gaps.map((g) => (
              <GapItem key={g.id} gap={g} />
            ))}
          </div>
        </div>
      )}

      {/* Interview risk areas */}
      {result.riskAreas.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <ShieldAlert className="h-5 w-5 text-warning" />
            <h3 className="text-lg font-bold text-foreground">Interview risk areas</h3>
          </div>
          <div className="space-y-2">
            {result.riskAreas.map((r: InterviewRiskArea) => (
              <div key={r.id} className={`rounded-lg border p-3 ${RISK_COLOR[r.riskLevel]}`}>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold">{r.area}</p>
                  <Badge variant="outline" className="capitalize border-current">
                    {r.riskLevel} risk
                  </Badge>
                </div>
                {r.reason && <p className="text-xs mt-1 opacity-80">{r.reason}</p>}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prep plan */}
      {result.preparationPriorities.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ClipboardList className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-bold text-foreground">Preparation plan</h3>
          </div>
          <div className="space-y-2">
            {result.preparationPriorities.map((p) => (
              <RecommendationItem key={p.id} priority={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
