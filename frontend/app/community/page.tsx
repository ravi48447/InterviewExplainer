/**
 * app/community/page.tsx — Community landing route (P13-WA).
 *
 * Server component shell rendering the canonical <CommunityShell/> (client).
 * Indexable (user-generated content is a discovery surface).
 */

import { CommunityShell } from "@/components/community-v2";
import { buildCommunityLandingMetadata } from "@/lib/community";

export const metadata = buildCommunityLandingMetadata();

export const revalidate = 3600;

export default function CommunityPage() {
  return (
    <main className="page-container py-12">
      <div className="text-center mb-10">
        <h1 className="type-display text-3xl sm:text-4xl font-extrabold text-foreground">
          Real interview intelligence
        </h1>
        <p className="text-sm text-muted-foreground mt-2 max-w-xl mx-auto">
          Community-reported interview questions, company processes, and offer outcomes —
          backed by evidence.
        </p>
      </div>
      <CommunityShell />
    </main>
  );
}
