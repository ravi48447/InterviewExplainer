"use client";

import { ErrorState } from "@/components/ui/error-state";

/**
 * Community route error boundary — provides a reset action.
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
        title="Community unavailable"
        description="Something went wrong loading the community page. Please try again."
        retryLabel="Try again"
        onRetry={reset}
      />
    </main>
  );
}
