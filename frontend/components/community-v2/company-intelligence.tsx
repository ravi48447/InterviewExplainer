/**
 * company-intelligence.tsx — Aggregated company interview profile (P13-WG..WI, T321..T420).
 *
 * Renders the public company intelligence page: difficulty score, typical
 * rounds, offer rate, top reported questions, and tag frequency.
 */

import Link from "next/link";
import { Building2, Gauge, Clock, TrendingUp, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tag } from "@/components/ui/tag";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import type { CompanyInterviewIntelligence, ReportedQuestion } from "@/lib/community";

export interface CompanyIntelligenceProps {
  intelligence: CompanyInterviewIntelligence;
}

const DIFFICULTY_COLOR = (score: number) =>
  score >= 70
    ? "text-destructive"
    : score >= 40
    ? "text-warning"
    : "text-success";

export function CompanyIntelligence({ intelligence: intel }: CompanyIntelligenceProps) {
  const diffColor = DIFFICULTY_COLOR(intel.difficultyScore);

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/community">Community</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/community">Companies</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{intel.company}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      {/* Header */}
      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Building2 className="h-6 w-6 text-primary" />
              <h1 className="type-display text-2xl sm:text-3xl font-extrabold text-foreground">
                {intel.company}
              </h1>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on {intel.contributionCount} community contribution{intel.contributionCount === 1 ? "" : "s"}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-5">
          <Stat
            icon={Gauge}
            label="Difficulty"
            value={`${intel.difficultyScore}`}
            valueClass={diffColor}
          />
          {intel.averageProcessDays != null && (
            <Stat icon={Clock} label="Avg process" value={`${intel.averageProcessDays}d`} />
          )}
          {intel.offerRate != null && (
            <Stat
              icon={TrendingUp}
              label="Offer rate"
              value={`${Math.round(intel.offerRate * 100)}%`}
            />
          )}
          <Stat icon={Building2} label="Rounds" value={`${intel.typicalRounds.length}`} />
        </div>
      </div>

      {/* Typical rounds */}
      {intel.typicalRounds.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="type-display text-sm font-extrabold text-foreground mb-3">Typical rounds</h2>
          <div className="flex flex-wrap gap-2">
            {intel.typicalRounds.map((r, i) => (
              <Badge key={r} variant="default" className="flex items-center gap-1.5">
                <span className="text-xs text-muted-foreground">{i + 1}.</span>
                {r}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {/* Top questions */}
      {intel.topQuestions.length > 0 && (
        <div>
          <h2 className="type-display text-lg font-extrabold text-foreground mb-3">Top reported questions</h2>
          <div className="space-y-2">
            {intel.topQuestions.map((q: ReportedQuestion) => (
              <Link
                key={q.id}
                href={`/community/questions/${q.id}`}
                className="block rounded-lg border border-border bg-card p-4 hover:border-primary/50 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              >
                <div className="flex items-start justify-between gap-3">
                  <p className="text-sm font-medium text-foreground">{q.question}</p>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="capitalize text-xs">
                    {q.difficulty}
                  </Badge>
                  <span className="text-xs text-muted-foreground">
                    {q.upvotes} upvote{q.upvotes === 1 ? "" : "s"}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Top tags */}
      {intel.topTags.length > 0 && (
        <div className="rounded-xl border border-border bg-card p-5">
          <h2 className="type-display text-sm font-extrabold text-foreground mb-3">Frequently asked topics</h2>
          <div className="flex flex-wrap gap-2">
            {intel.topTags.map((t) => (
              <Tag key={t.tag} variant="default">
                {t.tag} · {t.count}
              </Tag>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  valueClass,
}: {
  icon: typeof Gauge;
  label: string;
  value: string;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-border bg-muted/30 p-3 text-center">
      <Icon className="h-4 w-4 text-muted-foreground mx-auto mb-1" />
      <p className={`text-lg font-bold ${valueClass ?? "text-foreground"}`}>{value}</p>
      <p className="text-xs text-muted-foreground">{label}</p>
    </div>
  );
}
