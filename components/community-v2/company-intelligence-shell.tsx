/**
 * company-intelligence-shell.tsx — Client wrapper for the company intelligence
 * route (P13-WG..WI, T321..T420). Loads aggregated company profile by name.
 */

"use client";

import { useEffect, useState } from "react";
import { Loader2, Inbox } from "lucide-react";
import {
  fetchCompanyIntelligence,
  fetchContributions,
  aggregateCompanyIntelligence,
} from "@/lib/community";
import type { CompanyInterviewIntelligence } from "@/lib/community";
import { CompanyIntelligence } from "./company-intelligence";

export interface CompanyIntelligenceShellProps {
  company: string;
}

export function CompanyIntelligenceShell({ company }: CompanyIntelligenceShellProps) {
  const [intel, setIntel] = useState<CompanyInterviewIntelligence | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
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
    })();
    return () => {
      cancelled = true;
    };
  }, [company]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (!intel) {
    return (
      <div className="text-center py-24">
        <Inbox className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
        <p className="text-sm font-medium text-foreground">
          No community intelligence for {company} yet.
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          Be the first to share an interview experience.
        </p>
      </div>
    );
  }

  return <CompanyIntelligence intelligence={intel} />;
}
