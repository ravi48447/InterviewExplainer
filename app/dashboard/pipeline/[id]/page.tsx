/**
 * app/dashboard/pipeline/[id]/page.tsx — Application detail route (P12-WK).
 *
 * Server component shell rendering the canonical <ApplicationDetailShell/>.
 * Noindex (authenticated).
 */

import { ApplicationDetailShell } from "@/components/opportunity-v2";
import { buildPipelineMetadata } from "@/lib/opportunity";

export const metadata = buildPipelineMetadata();

export const revalidate = 0;

export default async function ApplicationDetailRoute({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <main className="page-container py-12">
      <ApplicationDetailShell applicationId={id} />
    </main>
  );
}
