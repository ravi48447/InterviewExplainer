/**
 * community-data.ts — Community knowledge & interview intelligence data layer
 * (P13-BA..BN, T001..T722).
 *
 * Adapts backend community APIs to the canonical typed contracts via the
 * default apiClient (axios instance). Public read endpoints (company
 * intelligence, reported questions) are GET; contribution submission is POST;
 * moderation is PATCH. Graceful fallbacks when endpoints absent.
 *
 * Client-safe (axios-based).
 */

import apiClient from "@/lib/api-client";
import type {
  CommunityFilter,
  CompanyInterviewIntelligence,
  Contribution,
  ContributionStatus,
  ContributionType,
  EvidenceRecord,
  ModerationAction,
  ReportedQuestion,
} from "./community-types";

const COMMUNITY_BASE = "/community";
const MOD_BASE = "/moderation";

// ─── Reported questions (public read) ───────────────────────────────────────

export async function fetchReportedQuestions(
  filter: CommunityFilter = {},
  page = 0,
  pageSize = 20,
): Promise<ReportedQuestion[]> {
  try {
    const res = await apiClient.get<ReportedQuestion[]>(`${COMMUNITY_BASE}/questions`, {
      params: {
        q: filter.query,
        company: filter.company,
        category: filter.category,
        tags: filter.tags?.join(","),
        page,
        pageSize,
      },
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

export async function fetchQuestion(id: string): Promise<ReportedQuestion | null> {
  try {
    const res = await apiClient.get<ReportedQuestion>(`${COMMUNITY_BASE}/questions/${id}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ─── Contributions (submit + list) ──────────────────────────────────────────

export async function fetchContributions(
  filter: CommunityFilter = {},
): Promise<Contribution[]> {
  try {
    const res = await apiClient.get<Contribution[]>(`${COMMUNITY_BASE}/contributions`, {
      params: {
        q: filter.query,
        company: filter.company,
        type: filter.type,
        tags: filter.tags?.join(","),
      },
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

export async function submitContribution(
  contribution: Omit<Contribution, "id" | "status" | "upvotes" | "submittedAt">,
): Promise<Contribution | null> {
  try {
    const res = await apiClient.post<Contribution>(
      `${COMMUNITY_BASE}/contributions`,
      contribution,
    );
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function upvoteContribution(id: string): Promise<boolean> {
  try {
    await apiClient.post(`${COMMUNITY_BASE}/contributions/${id}/upvote`);
    return true;
  } catch {
    return false;
  }
}

// ─── Company interview intelligence (public aggregated profile) ─────────────

export async function fetchCompanyIntelligence(
  company: string,
): Promise<CompanyInterviewIntelligence | null> {
  try {
    const res = await apiClient.get<CompanyInterviewIntelligence>(
      `${COMMUNITY_BASE}/companies/${encodeURIComponent(company)}`,
    );
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function fetchFeaturedCompanies(): Promise<string[]> {
  try {
    const res = await apiClient.get<string[]>(`${COMMUNITY_BASE}/companies/featured`);
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

// ─── Evidence records ───────────────────────────────────────────────────────

export async function fetchEvidence(questionId?: string): Promise<EvidenceRecord[]> {
  try {
    const res = await apiClient.get<EvidenceRecord[]>(`${COMMUNITY_BASE}/evidence`, {
      params: { questionId },
    });
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

// ─── Moderation ─────────────────────────────────────────────────────────────

export async function moderateContribution(
  contributionId: string,
  action: ModerationAction,
  reason?: string,
): Promise<Contribution | null> {
  try {
    const res = await apiClient.patch<Contribution>(
      `${MOD_BASE}/contributions/${contributionId}`,
      { action, reason },
    );
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ─── Pure helpers (client-safe, no network) ─────────────────────────────────

/**
 * Map a moderation action to the resulting contribution status (P13-WJ, T481..T540).
 */
export function statusForAction(action: ModerationAction): ContributionStatus {
  switch (action) {
    case "approve":
      return "approved";
    case "reject":
      return "rejected";
    case "flag":
    case "delete":
      return "flagged";
    case "unflag":
      return "pending";
  }
}

/**
 * Aggregate a list of contributions into a company intelligence profile
 * (P13-WG..WI, T321..T420). Client-side fallback when the aggregated endpoint
 * is unavailable.
 */
export function aggregateCompanyIntelligence(
  company: string,
  contributions: Contribution[],
): CompanyInterviewIntelligence {
  const approved = contributions.filter((c) => c.status === "approved");
  const questions = approved.filter((c) => c.type === "reported-question");
  const difficultyScores = approved
    .map((c) => (c.difficulty === "hard" ? 100 : c.difficulty === "medium" ? 60 : 30))
    .filter((n) => n != null);
  const difficultyScore = difficultyScores.length
    ? Math.round(difficultyScores.reduce((a, b) => a + b, 0) / difficultyScores.length)
    : 0;

  const tagCounts = new Map<string, number>();
  for (const c of approved) for (const t of c.tags) tagCounts.set(t, (tagCounts.get(t) ?? 0) + 1);
  const topTags = [...tagCounts.entries()]
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);

  const rounds = approved.map((c) => c.round).filter((r): r is string => Boolean(r));
  const typicalRounds = [...new Set(rounds)].slice(0, 5);

  const outcomes = approved.map((c) => c.outcome).filter((o): o is "offer" | "no-offer" => Boolean(o));
  const offers = outcomes.filter((o) => o === "offer").length;
  const offerRate = outcomes.length ? offers / outcomes.length : undefined;

  const topQuestions: ReportedQuestion[] = questions
    .map((q, i) => ({
      id: `q-${i}`,
      company,
      role: q.role,
      question: q.content,
      category: "technical" as const,
      difficulty: q.difficulty ?? "medium",
      tags: q.tags,
      reportCount: 1,
      upvotes: q.upvotes,
      lastReportedAt: q.submittedAt,
    }))
    .sort((a, b) => b.upvotes - a.upvotes)
    .slice(0, 5);

  return {
    company,
    contributionCount: approved.length,
    difficultyScore,
    typicalRounds,
    topQuestions,
    topTags,
    offerRate,
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Filter helper for client-side narrowing of a contribution list (P13-WF).
 */
export function filterContributions(
  contributions: Contribution[],
  filter: CommunityFilter,
): Contribution[] {
  return contributions.filter((c) => {
    if (filter.company && c.company.toLowerCase() !== filter.company.toLowerCase()) return false;
    if (filter.type && c.type !== filter.type) return false;
    if (filter.query) {
      const q = filter.query.toLowerCase();
      const hay = `${c.company} ${c.role} ${c.content} ${c.tags.join(" ")}`.toLowerCase();
      if (!hay.includes(q)) return false;
    }
    if (filter.tags && filter.tags.length > 0) {
      if (!filter.tags.every((t) => c.tags.includes(t))) return false;
    }
    return true;
  });
}

/** Re-export type for convenience. */
export type { ContributionType };
