/**
 * app/dashboard/pipeline/page.tsx — Application pipeline route (P12-WG).
 *
 * Server component shell rendering the canonical <PipelineShell/> (client).
 * Noindex (authenticated).
 */

import { PipelineShell } from "@/components/opportunity-v2";
import { buildPipelineMetadata } from "@/lib/opportunity";

export const metadata = buildPipelineMetadata();

export const revalidate = 0;

export default function PipelinePage() {
  return (
    <main className="page-container py-12">
      <div className="text-center mb-10">
        <h1 className="type-display text-3xl sm:text-4xl font-bold text-foreground">
          Application pipeline
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Track every application from saved through offer.
        </p>
      </div>
      <PipelineShell />
    </main>
  );
}
