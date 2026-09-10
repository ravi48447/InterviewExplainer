"use client";

import { ErrorState } from "@/components/ui/error-state";

/**
 * Contribution route error boundary.
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
        title="Contribution form unavailable"
        description="Something went wrong loading the contribution form. Please try again."
        retryLabel="Try again"
        onRetry={reset}
      />
    </main>
  );
}
