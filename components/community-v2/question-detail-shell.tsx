/**
 * question-detail-shell.tsx — Client wrapper for the reported-question detail
 * route (P13-WF, T261..T320). Loads a question + its evidence by id.
 */

"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { fetchQuestion, fetchEvidence } from "@/lib/community";
import type { ReportedQuestion, EvidenceRecord } from "@/lib/community";
import { QuestionDetail } from "./question-detail";

export interface QuestionDetailShellProps {
  questionId: string;
}

export function QuestionDetailShell({ questionId }: QuestionDetailShellProps) {
  const [question, setQuestion] = useState<ReportedQuestion | null>(null);
  const [evidence, setEvidence] = useState<EvidenceRecord[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      const [q, ev] = await Promise.all([
        fetchQuestion(questionId),
        fetchEvidence(questionId),
      ]);
      if (cancelled) return;
      setQuestion(q);
      setEvidence(ev);
      if (!cancelled) setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [questionId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!question) {
    return (
      <p className="text-center text-sm text-muted-foreground py-24">
        This question is no longer available.
      </p>
    );
  }

  return <QuestionDetail question={question} evidence={evidence} />;
}
