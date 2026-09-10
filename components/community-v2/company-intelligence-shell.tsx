/**
 * company-intelligence-shell.tsx — Client wrapper for the company intelligence
 * route (P13-WG..WI, T321..T420). Loads aggregated company profile by name.
 */

"use client";

import { useEffect, useState } from "react";
import { Inbox } from "lucide-react";
import {
  fetchCompanyIntelligence,
  fetchContributions,
  aggregateCompanyIntelligence,
} from "@/lib/community";
import type { CompanyInterviewIntelligence } from "@/lib/community";
import { CompanyIntelligence } from "./company-intelligence";
import { CardSkeleton } from "@/components/ui/skeleton";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";

export interface CompanyIntelligenceShellProps {
  company: string;
}

export function CompanyIntelligenceShell({ company }: CompanyIntelligenceShellProps) {
  const [intel, setIntel] = useState<CompanyInterviewIntelligence | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(false);
      try {
        // Try the aggregated endpoint first; fall back to client-side aggregation
        // from the raw contributions list.
        let result = await fetchCompanyIntelligence(company);
        if (!result) {
          const contributions = await fetchContributions({ company });
          if (contributions.length > 0) {
            result = aggregateCompanyIntelligence(company, contributions);
          }
        }
        if (!cancelled) {
          setIntel(result);
          setLoading(false);
        }
      } catch {
        if (!cancelled) {
          setError(true);
          setLoading(false);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [company, retryCount]);

  if (loading) {
    return (
      <div className="space-y-4" aria-label="Loading company intelligence">
        <CardSkeleton className="p-6" />
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
        <CardSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorState
        title="Couldn't load company intelligence"
        description={`We were unable to fetch interview intelligence for ${company}. Please try again.`}
        retryLabel="Retry"
        onRetry={() => {
          setError(false);
          setLoading(true);
          setRetryCount((c) => c + 1);
        }}
      />
    );
  }

  if (!intel) {
    return (
      <EmptyState
        icon={<Inbox />}
        title={`No intelligence for ${company} yet`}
        description="Be the first to share an interview experience for this company."
      />
    );
  }

  return <CompanyIntelligence intelligence={intel} />;
}
