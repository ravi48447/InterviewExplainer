/**
 * app/dashboard/opportunities/[id]/page.tsx — Opportunity detail route (P12-WF).
 *
 * Server component shell rendering the canonical <OpportunityDetailShell/>.
 * Noindex (authenticated).
 */

import { OpportunityDetailShell } from "@/components/opportunity-v2";
import { buildOpportunityDetailMetadata } from "@/lib/opportunity";

export const revalidate = 0;

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return buildOpportunityDetailMetadata(id);
}

export default async function OpportunityDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="page-container py-12">
      <OpportunityDetailShell opportunityId={id} />
    </main>
  );
}
