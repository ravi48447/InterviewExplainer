/**
 * dashboard-seo.ts — SEO metadata for the dashboard route (P09-WA, T001..T020).
 *
 * The dashboard is personalized and should not be indexed as a generic page.
 */

import type { Metadata } from "next";
import { buildMetadata } from "@/lib/seo";

export function buildDashboardMetadata(): Metadata {
  return {
    ...buildMetadata({
      family: "question",
      params: {},
      title: "Dashboard",
      description: "Your interview prep dashboard — progress, streaks, recommendations, and daily prep.",
    }),
    robots: { index: false, follow: true },
  };
}
