/**
 * app/dashboard/resume/page.tsx — Canonical resume intelligence route (P11-WA).
 *
 * Server component shell rendering the canonical <ResumeShell/> (client),
 * which owns upload → analysis → job-match state. Noindex (candidate PII).
 */

import { ResumeShell } from "@/components/resume-v2";
import { buildResumeDashboardMetadata } from "@/lib/resume";

export const metadata = buildResumeDashboardMetadata();

export const revalidate = 0;

export default function ResumeDashboardPage() {
  return (
    <main className="page-container py-12">
      <div className="text-center mb-10">
        <h1 className="type-display text-3xl sm:text-4xl font-bold text-foreground">
          Resume intelligence
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Upload your resume to get an evidence-backed analysis, then paste a job description
          to see your match score and a personalized preparation plan.
        </p>
      </div>
      <ResumeShell />
    </main>
  );
}
