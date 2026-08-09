/**
 * question-detail.tsx — Reported question detail + evidence (P13-WF, T261..T320).
 *
 * Renders a single reported interview question with its category, difficulty,
 * tags, report count, optional answer summary, and corroborating evidence.
 */

import { MessageSquare, Users, ThumbsUp } from "lucide-react";
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
import type { ReportedQuestion } from "@/lib/community";
import { EvidenceDisplay } from "./evidence-display";
import type { EvidenceRecord } from "@/lib/community";

export interface QuestionDetailProps {
  question: ReportedQuestion;
  evidence: EvidenceRecord[];
}

export function QuestionDetail({ question: q, evidence }: QuestionDetailProps) {
  const lastReported = new Date(q.lastReportedAt).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="space-y-6">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/community">Community</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/community">Questions</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>{q.question.length > 40 ? q.question.slice(0, 40) + "…" : q.question}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          <Badge variant="primary" className="capitalize">
            {q.category.replace(/-/g, " ")}
          </Badge>
          <Badge variant="outline" className="capitalize">
            {q.difficulty}
          </Badge>
          <span className="text-xs text-muted-foreground">{q.company} · {q.role}</span>
        </div>
        <h1 className="type-display text-xl sm:text-2xl font-extrabold text-foreground leading-relaxed">
          {q.question}
        </h1>
        <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <Users className="h-4 w-4" />
            {q.reportCount} report{q.reportCount === 1 ? "" : "s"}
          </span>
          <span className="flex items-center gap-1.5">
            <ThumbsUp className="h-4 w-4" />
            {q.upvotes} upvote{q.upvotes === 1 ? "" : "s"}
          </span>
          <span>Last reported {lastReported}</span>
        </div>
        {q.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-3">
            {q.tags.map((t) => (
              <Tag key={t} variant="default" className="text-xs">
                {t}
              </Tag>
            ))}
          </div>
        )}
      </div>

      {q.answerSummary && (
        <div className="rounded-xl border border-border bg-card p-6">
          <div className="flex items-center gap-2 mb-3">
            <MessageSquare className="h-5 w-5 text-primary" />
            <h2 className="type-display text-sm font-extrabold text-foreground">Community answer summary</h2>
          </div>
          <p className="text-sm text-foreground leading-relaxed">{q.answerSummary}</p>
        </div>
      )}

      <EvidenceDisplay evidence={evidence} />
    </div>
  );
}
