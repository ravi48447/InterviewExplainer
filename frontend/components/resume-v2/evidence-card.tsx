/**
 * evidence-card.tsx — Evidence-backed claim display (P11-WD/WE, T141..T220).
 *
 * Renders a single resume claim with its source (resume line / project /
 * experience), confidence, and the canonical skills it backs. Used in the
 * analysis results and job-match detail.
 */

import { Quote, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import type { ResumeClaim } from "@/lib/resume";

export interface EvidenceCardProps {
  claim: ResumeClaim;
}

export function EvidenceCard({ claim }: EvidenceCardProps) {
  const confidencePct = Math.round(claim.confidence * 100);
  const confColor =
    confidencePct >= 75
      ? "text-success"
      : confidencePct >= 50
      ? "text-warning"
      : "text-destructive";

  return (
    <div className="rounded-lg border border-border bg-card p-4">
      <div className="flex items-start gap-3">
        <Quote className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
        <div className="flex-1 min-w-0">
          <p className="text-sm text-foreground leading-relaxed">{claim.text}</p>
          <div className="flex flex-wrap items-center gap-2 mt-3">
            <Badge variant="default" className="capitalize">
              {claim.type.replace(/-/g, " ")}
            </Badge>
            <span className="text-xs text-muted-foreground">via {claim.sourceSection}</span>
            <span className={`text-xs font-medium flex items-center gap-1 ${confColor}`}>
              <ShieldCheck className="h-3.5 w-3.5" />
              {confidencePct}% confidence
            </span>
          </div>
          {claim.associatedSkills.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {claim.associatedSkills.map((s) => (
                <Tag key={s} variant="default">
                  {s}
                </Tag>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
