/**
 * evidence-display.tsx — Evidence record list (P13-WE, T181..T260).
 *
 * Renders corroborating evidence records for a question or contribution,
 * with trust-weighted styling. Higher-trust sources (verified-offer,
 * recruiter-confirm) get stronger emphasis.
 */

import { ShieldCheck, FileCheck, UserCheck, Globe, MessageSquare, FileX } from "lucide-react";
import type { EvidenceRecord, EvidenceType } from "@/lib/community";
import { EmptyState } from "@/components/ui/empty-state";

export interface EvidenceDisplayProps {
  evidence: EvidenceRecord[];
}

const TYPE_META: Record<EvidenceType, { label: string; icon: typeof ShieldCheck; color: string }> = {
  "verified-offer": { label: "Verified offer", icon: ShieldCheck, color: "text-success" },
  "recruiter-confirm": { label: "Recruiter confirmed", icon: UserCheck, color: "text-success" },
  "community-report": { label: "Community report", icon: MessageSquare, color: "text-info" },
  "public-source": { label: "Public source", icon: Globe, color: "text-muted-foreground" },
};

export function EvidenceDisplay({ evidence }: EvidenceDisplayProps) {
  if (evidence.length === 0) {
    return (
      <EmptyState
        icon={<FileX />}
        title="No evidence yet"
        description="No corroborating evidence has been linked to this question."
      />
    );
  }
  // Sort by trust descending.
  const sorted = [...evidence].sort((a, b) => b.trust - a.trust);

  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center gap-2 mb-3">
        <FileCheck className="h-5 w-5 text-primary" />
        <h3 className="type-display text-sm font-extrabold text-foreground">Evidence ({evidence.length})</h3>
      </div>
      <ul className="space-y-2">
        {sorted.map((e) => {
          const meta = TYPE_META[e.type];
          const Icon = meta.icon;
          return (
            <li key={e.id} className="flex items-start gap-2.5 rounded-lg border border-border bg-muted/30 p-3">
              <Icon className={`h-4 w-4 shrink-0 mt-0.5 ${meta.color}`} />
              <div className="min-w-0 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-semibold text-foreground">{meta.label}</span>
                  <span className={`text-xs font-medium ${meta.color}`}>
                    {Math.round(e.trust * 100)}% trust
                  </span>
                </div>
                <p className="text-sm text-foreground mt-0.5">{e.summary}</p>
                {e.source && (
                  <p className="text-xs text-muted-foreground mt-1">Source: {e.source}</p>
                )}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
