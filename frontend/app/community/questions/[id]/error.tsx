"use client";

import { ErrorState } from "@/components/ui/error-state";

/**
 * Question detail route error boundary.
 */
export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="page-container py-12">
      <ErrorState
        title="Question unavailable"
        description="Something went wrong loading this question. Please try again."
        retryLabel="Try again"
        onRetry={reset}
      />
    </main>
  );
}
