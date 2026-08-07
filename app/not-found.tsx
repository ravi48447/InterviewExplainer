import Link from "next/link";
import type { Metadata } from "next";
import { SearchX } from "lucide-react";
import { buildNoindexMetadata } from "@/lib/seo";

// P02-T524: 404 page must be noindex (not accidentally indexed).
export const metadata: Metadata = buildNoindexMetadata("Page Not Found");

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] px-6 text-center">
      <SearchX className="w-14 h-14 text-muted-foreground mb-6" strokeWidth={1.5} />
      <h1 className="text-4xl font-bold text-foreground mb-2">404</h1>
      <h2 className="text-lg font-medium text-foreground mb-3">Page not found</h2>
      <p className="text-sm text-muted-foreground max-w-md mb-8">
        The page you are looking for does not exist or has been moved. Try browsing our
        question library instead.
      </p>
      <div className="flex flex-wrap gap-3 justify-center">
        <Link
          href="/domains"
          className="px-5 py-2.5 bg-primary text-primary-foreground text-sm font-medium rounded-lg hover:opacity-90 transition-opacity"
        >
          Browse Domains
        </Link>
        <Link
          href="/"
          className="px-5 py-2.5 border border-border text-foreground text-sm font-medium rounded-lg hover:bg-muted transition-colors"
        >
          Go Home
        </Link>
      </div>
    </div>
  );
}
