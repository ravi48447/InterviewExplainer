/**
 * opportunity-card.tsx — Single opportunity listing card (P12-WB..WE, T041..T180).
 *
 * Renders a job opportunity with title, company, location, work mode,
 * compensation, match score, and match reasons. Used in the discovery list.
 */

import Link from "next/link";
import { MapPin, Briefcase, Banknote, Star } from "lucide-react";
import { Tag } from "@/components/ui/tag";
import type { Opportunity, WorkMode, SeniorityBand } from "@/lib/opportunity";

export interface OpportunityCardProps {
  opportunity: Opportunity;
  href: string;
}

const WORK_MODE_LABEL: Record<WorkMode, string> = {
  remote: "Remote",
  hybrid: "Hybrid",
  onsite: "On-site",
};

const SENIORITY_LABEL: Record<SeniorityBand, string> = {
  intern: "Intern",
  entry: "Entry-level",
  mid: "Mid-level",
  senior: "Senior",
  staff: "Staff",
  lead: "Lead",
  manager: "Manager",
  director: "Director",
};

function formatComp(min: number, max: number) {
  const fmt = (n: number) =>
    n >= 100000 ? `${(n / 100000).toFixed(n % 100000 === 0 ? 0 : 1)}L` : `${n / 1000}k`;
  return `${fmt(min)}–${fmt(max)}`;
}

export function OpportunityCard({ opportunity: opp, href }: OpportunityCardProps) {
  const score = opp.matchScore;
  const scoreColor =
    score == null
      ? ""
      : score >= 75
      ? "text-success"
      : score >= 50
      ? "text-warning"
      : "text-destructive";

  return (
    <Link
      href={href}
      className="block rounded-xl border border-border bg-card p-5 hover:border-primary/50 hover:shadow-sm transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="text-base font-bold text-foreground truncate">{opp.title}</h3>
          </div>
          <p className="text-sm text-muted-foreground mt-0.5">{opp.company}</p>
        </div>
        {score != null && (
          <div className="text-center shrink-0">
            <Star className={`h-4 w-4 mx-auto ${scoreColor}`} aria-hidden="true" />
            <span className={`text-sm font-bold ${scoreColor}`}>{score}%</span>
          </div>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 text-xs text-muted-foreground">
        {opp.seniority && (
          <span className="flex items-center gap-1">
            <Briefcase className="h-3.5 w-3.5" />
            {SENIORITY_LABEL[opp.seniority]}
          </span>
        )}
        <span className="flex items-center gap-1">
          <MapPin className="h-3.5 w-3.5" />
          {opp.workMode === "remote" && opp.locations.length === 0
            ? "Remote"
            : [WORK_MODE_LABEL[opp.workMode], ...opp.locations].join(" · ")}
        </span>
        {opp.compensation && (
          <span className="flex items-center gap-1">
            <Banknote className="h-3.5 w-3.5" />
            {formatComp(opp.compensation.min, opp.compensation.max)}
          </span>
        )}
      </div>

      {opp.skills.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {opp.skills.slice(0, 5).map((s) => (
            <Tag key={s}>{s}</Tag>
          ))}
          {opp.skills.length > 5 && (
            <span className="text-xs text-muted-foreground">+{opp.skills.length - 5}</span>
          )}
        </div>
      )}

      {opp.matchReasons && opp.matchReasons.length > 0 && (
        <p className="text-xs text-muted-foreground mt-3 italic">
          {opp.matchReasons.slice(0, 2).join(" · ")}
        </p>
      )}
    </Link>
  );
}
