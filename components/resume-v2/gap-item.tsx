/**
 * gap-item.tsx — Skill-gap display row (P11-WF, T221..T320).
 *
 * Renders one skill gap with severity styling, kind (preparation vs
 * eligibility), and the recommended remediation. Used in the match results
 * and prep plan.
 */

import { AlertTriangle, AlertCircle, Info, Lock } from "lucide-react";
import type { SkillGap } from "@/lib/resume";

export interface GapItemProps {
  gap: SkillGap;
}

const SEVERITY_META = {
  critical: {
    label: "Critical",
    icon: AlertCircle,
    border: "border-red-500/40",
    bg: "bg-red-500/5",
    text: "text-red-600 dark:text-red-400",
  },
  moderate: {
    label: "Moderate",
    icon: AlertTriangle,
    border: "border-amber-500/40",
    bg: "bg-amber-500/5",
    text: "text-amber-600 dark:text-amber-400",
  },
  minor: {
    label: "Minor",
    icon: Info,
    border: "border-blue-500/40",
    bg: "bg-blue-500/5",
    text: "text-blue-600 dark:text-blue-400",
  },
} as const;

export function GapItem({ gap }: GapItemProps) {
  const meta = SEVERITY_META[gap.severity];
  const Icon = meta.icon;
  return (
    <div className={`rounded-lg border ${meta.border} ${meta.bg} p-4`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <Icon className={`h-5 w-5 shrink-0 mt-0.5 ${meta.text}`} />
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{gap.requirementText}</p>
            <div className="flex items-center gap-2 mt-1.5">
              <span className={`text-xs font-medium ${meta.text}`}>{meta.label} gap</span>
              {gap.kind === "eligibility-gap" && (
                <span className="text-xs text-muted-foreground flex items-center gap-1">
                  <Lock className="h-3 w-3" />
                  eligibility
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
      {gap.recommendation && (
        <p className="text-xs text-muted-foreground mt-2.5 pl-7">{gap.recommendation}</p>
      )}
    </div>
  );
}
