/**
 * app/mock-interviews/start/page.tsx — Canonical interview start route (P10-WC..WL).
 *
 * Server component shell. Fetches the domain list server-side and renders the
 * canonical <InterviewShell/> (client) which owns setup → runtime → results.
 * Noindex (not a content page).
 */

import { fetchDomains } from "@/lib/api";
import { InterviewShell } from "@/components/interview-v2";
import { buildInterviewSetupMetadata } from "@/lib/interview";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata = buildInterviewSetupMetadata();

export const revalidate = 3600;

export default async function InterviewStartPage() {
  let domains: Array<{ slug: string; name: string }> = [];
  try {
    const all = await fetchDomains();
    domains = all.map((d) => ({ slug: d.slug, name: d.name }));
  } catch {
    /* fall back to empty; the shell handles it */
  }

  return (
    <main className="page-container py-12">
      <Breadcrumb className="mb-6">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/mock-interviews">Mock Interviews</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage>Start</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="text-center mb-10">
        <h1 className="type-display text-3xl sm:text-4xl font-bold text-foreground">
          Start a mock interview
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Choose a format and domain, then answer timed questions with AI-powered feedback.
        </p>
      </div>
      <InterviewShell domains={domains} />
    </main>
  );
}
