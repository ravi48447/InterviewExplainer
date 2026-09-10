/**
 * opportunity-data.ts — Job discovery & application pipeline data layer
 * (P12-BA..BN, T001..T732).
 *
 * Adapts backend opportunity APIs to the canonical typed contracts via the
 * default apiClient (axios instance). Loaders return graceful null/empty
 * states when endpoints are absent (P09/10 fallback convention).
 *
 * Client-safe (axios-based).
 */

import apiClient from "@/lib/api-client";
import type {
  Application,
  ApplicationEvent,
  ApplicationStatus,
  CareerTarget,
  Opportunity,
  OpportunityFilter,
  OpportunitySearchResult,
  PipelineColumn,
} from "./opportunity-types";
import { PIPELINE_ORDER, STATUS_LABEL } from "./opportunity-types";

const OPP_BASE = "/opportunities";
const APP_BASE = "/applications";
const TARGET_BASE = "/career-targets";

// ─── Career target ───────────────────────────────────────────────────────────

export async function fetchCareerTarget(userId: string): Promise<CareerTarget | null> {
  try {
    const res = await apiClient.get<CareerTarget>(TARGET_BASE, { params: { userId } });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function saveCareerTarget(
  target: Omit<CareerTarget, "id" | "updatedAt">,
): Promise<CareerTarget | null> {
  try {
    const res = await apiClient.post<CareerTarget>(TARGET_BASE, target);
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ─── Opportunity discovery ──────────────────────────────────────────────────

export async function fetchOpportunities(
  userId: string,
  filter: OpportunityFilter = {},
  page = 0,
  pageSize = 20,
): Promise<OpportunitySearchResult> {
  try {
    const res = await apiClient.get<OpportunitySearchResult>(OPP_BASE, {
      params: {
        userId,
        q: filter.query,
        seniority: filter.seniority,
        workMode: filter.workMode,
        locations: filter.locations?.join(","),
        skills: filter.skills?.join(","),
        remoteOnly: filter.remoteOnly,
        minCompensation: filter.minCompensation,
        page,
        pageSize,
      },
    });
    return (
      res.data ?? {
        opportunities: [],
        total: 0,
        hasMore: false,
      }
    );
  } catch {
    return { opportunities: [], total: 0, hasMore: false };
  }
}

export async function fetchOpportunity(id: string): Promise<Opportunity | null> {
  try {
    const res = await apiClient.get<Opportunity>(`${OPP_BASE}/${id}`);
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ─── Application pipeline ───────────────────────────────────────────────────

export async function fetchApplications(userId: string): Promise<Application[]> {
  try {
    const res = await apiClient.get<Application[]>(APP_BASE, { params: { userId } });
    return Array.isArray(res.data) ? res.data : [];
  } catch {
    return [];
  }
}

export async function createApplication(
  userId: string,
  opportunityId: string,
  resumeId?: string,
  note?: string,
): Promise<Application | null> {
  try {
    const res = await apiClient.post<Application>(APP_BASE, {
      userId,
      opportunityId,
      resumeId,
      note,
      status: "applied" as ApplicationStatus,
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function saveOpportunity(
  userId: string,
  opportunityId: string,
): Promise<Application | null> {
  try {
    const res = await apiClient.post<Application>(`${APP_BASE}/save`, {
      userId,
      opportunityId,
      status: "saved" as ApplicationStatus,
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

export async function updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
  note?: string,
): Promise<Application | null> {
  try {
    const res = await apiClient.patch<Application>(`${APP_BASE}/${applicationId}`, {
      status,
      note,
    });
    return res.data ?? null;
  } catch {
    return null;
  }
}

// ─── Pure pipeline helpers (client-safe, no network) ────────────────────────

/**
 * Group applications into ordered pipeline columns for the kanban view
 * (P12-WG..WI, T321..T420).
 */
export function buildPipeline(applications: Application[]): PipelineColumn[] {
  return PIPELINE_ORDER.map((status) => ({
    status,
    label: STATUS_LABEL[status],
    applications: applications.filter((a) => a.status === status),
  }));
}

/**
 * Compute simple funnel stats from the application list (P12-WJ, T421..T480).
 */
export function computePipelineStats(applications: Application[]) {
  const byStatus = (s: ApplicationStatus) => applications.filter((a) => a.status === s).length;
  return {
    total: applications.length,
    saved: byStatus("saved"),
    applied: byStatus("applied"),
    screening: byStatus("screening"),
    interviewing: byStatus("interviewing"),
    offer: byStatus("offer"),
    rejected: byStatus("rejected"),
    withdrawn: byStatus("withdrawn"),
    activeCount: applications.filter(
      (a) => a.status !== "rejected" && a.status !== "withdrawn",
    ).length,
  };
}

/**
 * Append a synthetic event to an application's timeline (client-side preview
 * before the backend confirms). (P12-WK, T481..T540.)
 */
export function withEvent(app: Application, status: ApplicationStatus, note?: string): Application {
  const event: ApplicationEvent = {
    id: `evt-${Date.now()}`,
    applicationId: app.id,
    status,
    note,
    occurredAt: new Date().toISOString(),
  };
  return {
    ...app,
    status,
    updatedAt: event.occurredAt,
    events: [...app.events, event],
  };
}
