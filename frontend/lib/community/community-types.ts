/**
 * community-types.ts — Typed contracts for real interview intelligence &
 * community knowledge (P13-A..BN, T001..T722).
 *
 * Pure type module — server-safe, no network. Consumed by lib/community data
 * layer and components/community-v2 only (P13-T001).
 */

// ─── Contributions (user-submitted interview reports) ───────────────────────

export type ContributionType =
  | "reported-question"
  | "experience-report"
  | "salary-report"
  | "interview-tip";

export type ContributionStatus = "pending" | "approved" | "rejected" | "flagged";

export interface Contribution {
  id: string;
  authorId: string;
  authorName: string;
  type: ContributionType;
  company: string;
  role: string;
  /** For reported-question: the question text. For reports: the body. */
  content: string;
  /** Difficulty as perceived by the contributor. */
  difficulty?: "easy" | "medium" | "hard";
  /** Interview round this was asked in, if applicable. */
  round?: string;
  /** Tags / topics associated with the contribution. */
  tags: string[];
  status: ContributionStatus;
  upvotes: number;
  /** Whether the contributor accepted an offer (anonymized outcome signal). */
  outcome?: "offer" | "no-offer" | "unknown";
  submittedAt: string;
  reviewedAt?: string;
}

// ─── Reported questions (structured) ────────────────────────────────────────

export type QuestionCategory =
  | "technical"
  | "system-design"
  | "behavioral"
  | "coding"
  | "domain-specific"
  | "hr";

export interface ReportedQuestion {
  id: string;
  company: string;
  role: string;
  question: string;
  category: QuestionCategory;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  /** Number of candidates reporting being asked this. */
  reportCount: number;
  /** Community-provided answer summary, if any. */
  answerSummary?: string;
  upvotes: number;
  lastReportedAt: string;
}

// ─── Evidence records (corroborating sources) ───────────────────────────────

export type EvidenceType =
  | "community-report"
  | "verified-offer"
  | "recruiter-confirm"
  | "public-source";

export interface EvidenceRecord {
  id: string;
  questionId?: string;
  contributionId?: string;
  type: EvidenceType;
  summary: string;
  source?: string;
  /** Trust weight 0..1 — verified-offer and recruiter-confirm rank highest. */
  trust: number;
  recordedAt: string;
}

// ─── Company interview intelligence (aggregated public profile) ─────────────

export interface CompanyInterviewIntelligence {
  company: string;
  /** Total contributions underpinning this profile. */
  contributionCount: number;
  /** Normalized 0..100 difficulty score (higher = harder). */
  difficultyScore: number;
  /** Average length of the interview process in days. */
  averageProcessDays?: number;
  /** Most common rounds, in order. */
  typicalRounds: string[];
  /** Top reported questions for the company. */
  topQuestions: ReportedQuestion[];
  /** Tag frequency map (skill → count). */
  topTags: { tag: string; count: number }[];
  /** Offer rate (0..1) where known. */
  offerRate?: number;
  updatedAt: string;
}

// ─── Moderation ─────────────────────────────────────────────────────────────

export type ModerationAction =
  | "approve"
  | "reject"
  | "flag"
  | "unflag"
  | "delete";

export interface ModerationLogEntry {
  id: string;
  contributionId: string;
  moderatorId: string;
  action: ModerationAction;
  reason?: string;
  actedAt: string;
}

// ─── Discovery filters ──────────────────────────────────────────────────────

export interface CommunityFilter {
  query?: string;
  company?: string;
  type?: ContributionType;
  category?: QuestionCategory;
  tags?: string[];
}
