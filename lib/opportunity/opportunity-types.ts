/**
 * opportunity-types.ts — Typed contracts for job discovery & application
 * pipeline (P12-A..BN, T001..T732).
 *
 * Pure type module — server-safe, no network. Consumed by lib/opportunity
 * data layer and components/opportunity-v2 only (P12-T001).
 */

// ─── Career target (the candidate's intent signal) ──────────────────────────

export interface CareerTarget {
  id: string;
  userId: string;
  /** Free-text role the candidate is targeting, e.g. "Backend Engineer". */
  role: string;
  /** Seniority band, normalized. */
  seniority: SeniorityBand | null;
  /** Preferred locations (city or remote). */
  locations: string[];
  /** Canonical skill ids the candidate wants to use. */
  targetSkills: string[];
  /** Min compensation expectation, in INR annualized. */
  minCompensation?: number;
  remoteOnly: boolean;
  updatedAt: string;
}

export type SeniorityBand =
  | "intern"
  | "entry"
  | "mid"
  | "senior"
  | "staff"
  | "lead"
  | "manager"
  | "director";

// ─── Opportunity (a job listing surfaced to the candidate) ──────────────────

export type OpportunitySource = "internal" | "partner" | "aggregator" | "community";

export type WorkMode = "remote" | "hybrid" | "onsite";

export interface Compensation {
  /** Lower bound, INR annualized. */
  min: number;
  /** Upper bound, INR annualized. */
  max: number;
  currency: string;
  /** Equity component note, if disclosed. */
  equity?: string;
}

export interface Opportunity {
  id: string;
  externalId?: string;
  source: OpportunitySource;
  title: string;
  company: string;
  companyLogoUrl?: string;
  description: string;
  requirements: string[];
  /** Canonical skill ids extracted from the listing. */
  skills: string[];
  seniority: SeniorityBand | null;
  workMode: WorkMode;
  locations: string[];
  compensation?: Compensation;
  postedAt: string;
  closesAt?: string;
  applicationUrl?: string;
  /** Relevance score 0..100 computed against the career target. */
  matchScore?: number;
  /** Why this opportunity was surfaced (matched signals). */
  matchReasons?: string[];
}

// ─── Application pipeline ───────────────────────────────────────────────────

export type ApplicationStatus =
  | "saved"
  | "applied"
  | "screening"
  | "interviewing"
  | "offer"
  | "rejected"
  | "withdrawn";

export interface ApplicationEvent {
  id: string;
  applicationId: string;
  status: ApplicationStatus;
  note?: string;
  occurredAt: string;
}

export interface Application {
  id: string;
  userId: string;
  opportunityId: string;
  resumeId?: string;
  status: ApplicationStatus;
  appliedAt: string;
  updatedAt: string;
  events: ApplicationEvent[];
  /** Optional cover-note / referral text the candidate submitted. */
  note?: string;
}

// ─── Pipeline view models ───────────────────────────────────────────────────

export interface PipelineColumn {
  status: ApplicationStatus;
  label: string;
  applications: Application[];
}

/** Ordered status flow for the kanban. */
export const PIPELINE_ORDER: ApplicationStatus[] = [
  "saved",
  "applied",
  "screening",
  "interviewing",
  "offer",
  "rejected",
  "withdrawn",
];

export const STATUS_LABEL: Record<ApplicationStatus, string> = {
  saved: "Saved",
  applied: "Applied",
  screening: "Screening",
  interviewing: "Interviewing",
  offer: "Offer",
  rejected: "Rejected",
  withdrawn: "Withdrawn",
};

// ─── Discovery filters ──────────────────────────────────────────────────────

export interface OpportunityFilter {
  query?: string;
  seniority?: SeniorityBand;
  workMode?: WorkMode;
  locations?: string[];
  skills?: string[];
  remoteOnly?: boolean;
  minCompensation?: number;
}

export interface OpportunitySearchResult {
  opportunities: Opportunity[];
  total: number;
  hasMore: boolean;
}
