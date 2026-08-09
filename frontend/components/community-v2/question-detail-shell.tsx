/**
 * question-detail-shell.tsx — Client wrapper for the reported-question detail
 * route (P13-WF, T261..T320). Loads a question + its evidence by id.
 */

"use client";

import { useEffect, useState } from "react";
import { MessageSquareOff } from "lucide-react";
import { fetchQuestion, fetchEvidence } from "@/lib/community";
import type { ReportedQuestion, EvidenceRecord } from "@/lib/community";
import { QuestionDetail } from "./question-detail";
import { CardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

export interface QuestionDetailShellProps {
  questionId: string;
}

export function QuestionDetailShell({ questionId }: QuestionDetailShellProps) {
  const [question, setQuestion] = useState<ReportedQuestion | null>(null);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        const [q, ev] = await Promise.all([
          fetchQuestion(questionId),
          fetchEvidence(questionId),
        ]);
        if (cancelled) return;
        setQuestion(q);
        setEvidence(ev);
        if (!cancelled) setLoading(false);
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [questionId, retryCount]);

  if (loading) {
    return (
      <div className="space-y-4" aria-label="Loading question">
        <CardSkeleton className="p-6" />
        <CardSkeleton className="p-6" />
        <CardSkeleton className="p-5" />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load question"
        description="We were unable to fetch this question. Please try again."
        retryLabel="Retry"
        onRetry={() => {
          setError(false);
          setLoading(true);
          setRetryCount((c) => c + 1);
        }}
      />
    );
  }

  if (!question) {
    return (
      <EmptyState
        icon={<MessageSquareOff />}
        title="Question not found"
        description="This question is no longer available."
      />
    );
  }

  return <QuestionDetail question={question} evidence={evidence} />;
}
