import type { Metadata } from "next";
import { buildNoindexMetadata } from "@/lib/seo";
import { ShellNotFound } from "@/components/shell/shell-not-found";

// P02-T524 / P03-T244: 404 page must be noindex.
export const metadata: Metadata = buildNoindexMetadata("Page Not Found");

/**
 * Root not-found (P03-V, T238..T247).
 * Renders the canonical ShellNotFound inside the shell. The shell frame
 * (header/footer) stays mounted so the user can recover.
 */
export default function NotFound() {
  return <ShellNotFound />;
}
