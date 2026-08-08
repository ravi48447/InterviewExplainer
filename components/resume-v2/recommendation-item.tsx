/**
 * recommendation-item.tsx — Prep-plan priority row (P11-AE/AF/AG, T584..T620).
 *
 * Renders one preparation priority (P0/P1/P2) with its rationale and
 * estimated effort. Used in the prep plan list derived from a job match.
 */

import { Clock, Flame, TrendingUp, Leaf } from "lucide-react";
import type { PreparationPriority } from "@/lib/resume";

export interface RecommendationItemProps {
  priority: PreparationPriority;
}

const PRIORITY_META = {
  P0: {
    label: "Critical",
    icon: Flame,
    chip: "bg-destructive/10 text-destructive border-destructive/30",
    text: "text-destructive",
  },
  P1: {
    label: "Important",
    icon: TrendingUp,
    chip: "bg-warning/10 text-warning border-warning/30",
    text: "text-warning",
  },
  P2: {
    label: "Nice to have",
    icon: Leaf,
    chip: "bg-muted text-muted-foreground border-border",
    text: "text-muted-foreground",
  },
} as const;

export function RecommendationItem({ priority }: RecommendationItemProps) {
  const meta = PRIORITY_META[priority.priority];
  const Icon = meta.icon;
  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <span className={`shrink-0 rounded-md border px-2 py-1 text-xs font-bold ${meta.chip}`}>
            {priority.priority}
          </span>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-foreground">{priority.title}</p>
            {priority.rationale && (
              <p className="text-xs text-muted-foreground mt-1">{priority.rationale}</p>
            )}
          </div>
        </div>
        <Icon className={`h-5 w-5 shrink-0 ${meta.text}`} />
      </div>
      {priority.estimatedEffortHours != null && (
        <p className="text-xs text-muted-foreground mt-2.5 flex items-center gap-1.5">
          <Clock className="h-3.5 w-3.5" />
          ~{priority.estimatedEffortHours}h effort
        </p>
      )}
    </div>
  );
}
