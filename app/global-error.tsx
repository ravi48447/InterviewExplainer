"use client";

import { RootShellError } from "@/components/shell/shell-error";

/**
 * Global root error boundary (P03-U, T237).
 * This replaces the entire shell (html/body) when the shell itself fails to
 * render — the "unrecoverable" tier of the error hierarchy. It must render its
 * own <html>/<body> since Next.js doesn't wrap it in the root layout.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return <RootShellError error={error} reset={reset} />;
}
