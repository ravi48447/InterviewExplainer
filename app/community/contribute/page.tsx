/**
 * app/community/contribute/page.tsx — Contribution submission route (P13-WB).
 * Noindex (authenticated form).
 */

import { ContributionShell } from "@/components/community-v2";
import { buildContributionFormMetadata } from "@/lib/community";

export const metadata = buildContributionFormMetadata();

export const revalidate = 0;

export default function ContributePage() {
  return (
    <main className="page-container py-12">
      <div className="text-center mb-10">
        <h1 className="type-display text-3xl sm:text-4xl font-bold text-foreground">
          Share your interview experience
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Report a real interview question or experience. Submissions are reviewed
          by moderators before publishing.
        </p>
      </div>
      <ContributionShell />
    </main>
  );
}
