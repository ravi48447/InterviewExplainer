/**
 * app/dashboard/page.tsx — Canonical dashboard route (P09-WK, T241..T280).
 *
 * Server component shell rendering the canonical <DashboardShell/> (client).
 * Metadata is noindex (personalized). The shell owns data loading, auth/guest
 * handling, and composition of the Phase 09 sections (P09-T241).
 */

import { DashboardShell } from "@/components/dashboard-v2";
import { buildDashboardMetadata } from "@/lib/dashboard";

export const metadata = buildDashboardMetadata();

export const revalidate = 0;

export default function DashboardPage() {
  return <DashboardShell />;
}
