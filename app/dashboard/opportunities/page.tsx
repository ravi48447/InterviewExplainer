/**
 * app/dashboard/opportunities/page.tsx — Job discovery route (P12-WA).
 *
 * Server component shell rendering the canonical <OpportunityShell/> (client).
 * Noindex (authenticated / personalized).
 */

import { OpportunityShell } from "@/components/opportunity-v2";
import { buildOpportunitiesMetadata } from "@/lib/opportunity";

export const metadata = buildOpportunitiesMetadata();

export const revalidate = 0;

export default function OpportunitiesPage() {
  return (
    <main className="page-container py-12">
      <div className="text-center mb-10">
        <h1 className="type-display text-3xl sm:text-4xl font-bold text-foreground">
          Job opportunities
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Roles matched to your career target. Filter by seniority, work mode, and skills.
        </p>
      </div>
      <OpportunityShell />
    </main>
  );
}
