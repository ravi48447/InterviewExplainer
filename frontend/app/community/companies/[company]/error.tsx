"use client";

import { ErrorState } from "@/components/ui/error-state";

/**
 * Company intelligence route error boundary.
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
        title="Company intelligence unavailable"
        description="Something went wrong loading this company's interview intelligence. Please try again."
        retryLabel="Try again"
        onRetry={reset}
      />
    </main>
  );
}
