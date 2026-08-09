"use client";

import { Search } from "lucide-react";
import { ErrorState } from "@/components/ui/error-state";

export default function SearchError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-surface px-6 py-16">
      <div className="mx-auto max-w-2xl">
        <ErrorState
          role="alert"
          icon={Search}
          title="Search isn’t loading"
          description="We couldn’t load the search experience. Check your connection and try again."
          retryLabel="Retry search"
          onRetry={reset}
        />
      </div>
    </div>
  );
}
