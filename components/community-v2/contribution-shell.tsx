/**
 * contribution-shell.tsx — Contribution submission client shell (P13-WB..WD, T041..T180).
 *
 * Owns the submit action against @/lib/community. Wraps the ContributionForm.
 */

"use client";

import { useState } from "react";
import { CheckCircle2, AlertCircle } from "lucide-react";
import { submitContribution } from "@/lib/community";
import type { ContributionType } from "@/lib/community";
import { ContributionForm } from "./contribution-form";
import { ErrorState } from "@/components/ui/error-state";

const DEMO_USER = "demo-user";
const DEMO_AUTHOR = "Anonymous";

export function ContributionShell() {
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {submitted && (
        <div
          className="rounded-xl border border-success/30 bg-success/5 p-4 flex items-center gap-2"
          role="status"
        >
          <CheckCircle2 className="h-5 w-5 text-success" />
          <p className="text-sm text-foreground">
            Thanks! Your contribution was submitted and is pending review.
          </p>
        </div>
      )}
      {error && (
        <ErrorState
          title="Submission failed"
          description="We couldn't submit your contribution. Please try again."
          retryLabel="Dismiss"
          onRetry={() => setError(false)}
          icon={AlertCircle}
        />
      )}
      <ContributionForm
        busy={busy}
        onSubmit={async (input) => {
          setBusy(true);
          setError(false);
          try {
            await submitContribution({
              authorId: DEMO_USER,
              authorName: DEMO_AUTHOR,
              type: input.type as ContributionType,
              company: input.company,
              role: input.role,
              content: input.content,
              difficulty: input.difficulty,
              round: input.round || undefined,
              tags: input.tags,
            });
            setSubmitted(true);
          } catch {
            setError(true);
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
