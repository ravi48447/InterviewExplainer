"use client";

import { ShellError } from "@/components/shell/shell-error";

/**
 * Root route error boundary (P03-U, T228..T237).
 * Renders the canonical ShellError inside the shell (header/footer stay
 * mounted). For shell-level failures, app/global-error.tsx handles the
 * unrecoverable tier.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <ShellError error={error} reset={reset} />;
}
