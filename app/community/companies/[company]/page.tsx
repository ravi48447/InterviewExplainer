/**
 * app/community/companies/[company]/page.tsx — Company interview intelligence
 * route (P13-WG). Indexable (public aggregated profile).
 */

import { CompanyIntelligenceShell } from "@/components/community-v2";
import { buildCompanyIntelligenceMetadata } from "@/lib/community";

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  return buildCompanyIntelligenceMetadata(company);
}

export default async function CompanyIntelligencePage({
  params,
}: {
  params: Promise<{ company: string }>;
}) {
  const { company } = await params;
  return (
    <main className="page-container py-12">
      <CompanyIntelligenceShell company={company} />
    </main>
  );
}
