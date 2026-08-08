/**
 * job-match-results.tsx — Job match & gap report composite (P11-WF..WH, T321..T580).
 *
 * Renders the overall match score, requirement mappings (strong/moderate/weak/
 * no-match), skill gaps, interview risk areas, and the derived prep plan.
 * Pulls typed contracts from @/lib/resume only (P11-T001).
 */

import { Target, CheckCircle2, XCircle, ShieldAlert, ClipboardList } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { JobMatchResult, RequirementMapping, MatchStatus, InterviewRiskArea } from "@/lib/resume";
import { GapItem } from "./gap-item";
import { RecommendationItem } from "./recommendation-item";

export interface JobMatchResultsProps {
  result: JobMatchResult;
}

const STATUS_META: Record<MatchStatus, { label: string; color: string; icon: typeof CheckCircle2 }> = {
  strong: { label: "Strong match", color: "text-emerald-600 dark:text-emerald-400", icon: CheckCircle2 },
  moderate: { label: "Moderate", color: "text-amber-600 dark:text-amber-400", icon: CheckCircle2 },
  weak: { label: "Weak", color: "text-orange-600 dark:text-orange-400", icon: XCircle },
  "no-match": { label: "No match", color: "text-red-600 dark:text-red-400", icon: XCircle },
};

const RISK_COLOR = {
  high: "border-red-500/40 bg-red-500/5 text-red-600 dark:text-red-400",
  medium: "border-amber-500/40 bg-amber-500/5 text-amber-600 dark:text-amber-400",
  low: "border-blue-500/40 bg-blue-500/5 text-blue-600 dark:text-blue-400",
} as const;

export function JobMatchResults({ result }: JobMatchResultsProps) {
  const score = result.overallMatchScore;
  const scoreColor =
    score >= 75
      ? "text-emerald-600 dark:text-emerald-400"
      : score >= 50
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  const matched = result.mappings.filter((m) => m.matchStatus === "strong" || m.matchStatus === "moderate");

  return (
    <div className="space-y-6">
      {/* Score header */}
      <div className="rounded-xl border border-border bg-card p-6 text-center">
        <Target className="h-8 w-8 text-primary mx-auto mb-2" />
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Overall match
        </h2>
        <p className={`text-4xl font-black mt-1 ${scoreColor}`}>{score}%</p>
        <p className="text-xs text-muted-foreground mt-2">
          {matched.length}/{result.mappings.length} requirements covered
        </p>
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
                <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${meta.color}`} />
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
            <ShieldAlert className="h-5 w-5 text-amber-500" />
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
