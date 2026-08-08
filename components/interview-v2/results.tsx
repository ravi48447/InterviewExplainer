/**
 * results.tsx — Interview results + evaluation (P10-WI..WK, T201..T260).
 *
 * Renders the session evaluation: overall score, per-question feedback,
 * keywords covered/missed, strengths, and improvements.
 */

"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, XCircle, TrendingUp, RotateCcw, Clock, Award } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tag } from "@/components/ui/tag";
import type { SessionEvaluation, InterviewQuestion } from "@/lib/interview";

export interface ResultsProps {
  evaluation: SessionEvaluation;
  questions: InterviewQuestion[];
  onRestart: () => void;
}

export function Results({ evaluation, questions, onRestart }: ResultsProps) {
  const score = evaluation.overallScore;
  const scoreColor =
    score >= 80
      ? "text-success"
      : score >= 60
      ? "text-warning"
      : "text-destructive";

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Score header */}
      <div className="rounded-xl border border-border bg-card p-8 text-center">
        <Award className="h-10 w-10 text-primary mx-auto mb-3" />
        <h1 className="type-display text-3xl font-bold text-foreground">Your results</h1>
        <p className={`text-5xl font-extrabold mt-4 ${scoreColor}`} aria-live="polite" aria-atomic="true">{score}%</p>
        <p className="text-sm text-muted-foreground mt-3 max-w-md mx-auto">{evaluation.summary}</p>
        <div className="flex items-center justify-center gap-6 mt-6 text-sm">
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            {evaluation.answeredQuestions}/{evaluation.totalQuestions} answered
          </div>
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            avg {evaluation.averageTime}s
          </div>
        </div>
      </div>

      {/* Per-question feedback */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-foreground">Question feedback</h2>
        {evaluation.results.map((r, i) => {
          const q = questions.find((x) => x.id === r.questionId);
          return (
            <div key={r.questionId} className="rounded-xl border border-border bg-card p-5">
              <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                    Question {i + 1}
                  </p>
                  <h3 className="text-sm font-bold text-foreground line-clamp-2">
                    {q?.title ?? r.questionId}
                  </h3>
                </div>
                <Badge variant={r.score >= 80 ? "difficulty-easy" : r.score >= 60 ? "difficulty-medium" : "difficulty-hard"}>
                  {r.score}%
                </Badge>
              </div>

              <p className="text-sm text-muted-foreground mb-3">{r.feedback}</p>

              {r.strengths.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-success mb-1">Strengths</p>
                  <ul className="space-y-0.5">
                    {r.strengths.map((s, j) => (
                      <li key={j} className="text-xs text-foreground flex items-start gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-success shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {r.improvements.length > 0 && (
                <div className="mb-2">
                  <p className="text-xs font-semibold text-warning mb-1">To improve</p>
                  <ul className="space-y-0.5">
                    {r.improvements.map((s, j) => (
                      <li key={j} className="text-xs text-foreground flex items-start gap-1.5">
                        <TrendingUp className="h-3.5 w-3.5 text-warning shrink-0 mt-0.5" />
                        {s}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {r.keywordsMissed.length > 0 && (
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="text-xs text-muted-foreground">Missed keywords:</span>
                  {r.keywordsMissed.map((k) => (
                    <Tag key={k} variant="outline" className="text-[11px]">
                      {k}
                    </Tag>
                  ))}
                </div>
              )}

              {q?.reviewUrl && (
                <Link
                  href={q.reviewUrl}
                  className="inline-flex items-center gap-1 mt-3 text-xs font-semibold text-primary hover:underline"
                >
                  Review this question
                  <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex items-center justify-center gap-3">
        <Button
          onClick={onRestart}
          variant="outline"
        >
          <RotateCcw className="h-4 w-4 mr-2" />
          New session
        </Button>
        <Button asChild>
          <Link href="/dashboard">
            Back to dashboard
            <ArrowRight className="h-4 w-4 ml-2" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
