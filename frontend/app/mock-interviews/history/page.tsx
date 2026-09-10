/**
 * app/mock-interviews/history/page.tsx — Canonical history route (P10-WJ).
 *
 * Server shell. Until a persistence API exists for past sessions, this shows
 * a clean empty state pointing to /mock-interviews/start. Noindex.
 */

import Link from "next/link";
import { ArrowRight, History } from "lucide-react";
import { buildInterviewHistoryMetadata } from "@/lib/interview";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata = buildInterviewHistoryMetadata();

export default function InterviewHistoryPage() {
  return (
    <main className="page-container py-16">
      <div className="max-w-2xl mx-auto">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link href="/mock-interviews">Mock Interviews</Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>History</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>

        <div className="text-center min-h-[300px] flex flex-col items-center justify-center rounded-xl border border-dashed border-border p-8">
          <History className="h-10 w-10 text-muted-foreground mb-4" />
          <h1 className="type-display text-2xl font-bold text-foreground mb-2">Your interview history</h1>
          <p className="text-sm text-muted-foreground max-w-md mx-auto mb-6">
            Your completed mock interview sessions will appear here with scores and trends.
            Start a session to begin building your history.
          </p>
          <Link
            href="/mock-interviews/start"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:bg-primary/90 transition-colors duration-200 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            Start a mock interview
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </main>
  );
}
