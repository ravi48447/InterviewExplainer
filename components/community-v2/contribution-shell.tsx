/**
 * contribution-shell.tsx — Contribution submission client shell (P13-WB..WD, T041..T180).
 *
 * Owns the submit action against @/lib/community. Wraps the ContributionForm.
 */

"use client";

import { useState } from "react";
import { CheckCircle2 } from "lucide-react";
import { submitContribution } from "@/lib/community";
import type { ContributionType } from "@/lib/community";
import { ContributionForm } from "./contribution-form";

const DEMO_USER = "demo-user";
const DEMO_AUTHOR = "Anonymous";

export function ContributionShell() {
  const [busy, setBusy] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-4">
      {submitted && (
        <div className="rounded-xl border border-emerald-500/30 bg-emerald-500/5 p-4 flex items-center gap-2">
          <CheckCircle2 className="h-5 w-5 text-emerald-600 dark:text-emerald-400" />
          <p className="text-sm text-foreground">
            Thanks! Your contribution was submitted and is pending review.
          </p>
        </div>
      )}
      <ContributionForm
        busy={busy}
        onSubmit={async (input) => {
          setBusy(true);
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
          } finally {
            setBusy(false);
          }
        }}
      />
    </div>
  );
}
