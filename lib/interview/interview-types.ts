/**
 * interview-types.ts — Canonical mock interview model (P10-WA..WL, T001..T060).
 *
 * One typed model for interview sessions, question selection, and evaluation
 * that replaces the inline types in the legacy mock-interviews client routes.
 */

export type InterviewType =
  | "partial-mock"
  | "full-mock"
  | "coding-mock"
  | "system-design-mock"
  | "behavioral-mock";

export type QuestionCategory =
  | "technical"
  | "behavioral"
  | "system-design"
  | "coding"
  | string;

export type SessionStatus =
  | "setup"
  | "in_progress"
  | "completed"
  | "abandoned";

export interface InterviewQuestion {
  id: string;
  questionId: string;
  domainSlug: string;
  stackSlug: string;
  stackName: string;
  title: string;
  slug: string;
  question: string;
  answer: string;
  difficulty: "easy" | "medium" | "hard";
  type: QuestionCategory;
  timeLimit: number;
  keywords: string[];
  reviewUrl?: string;
}

export interface SessionConfig {
  type: InterviewType;
  domainSlug: string;
  stackSlugs?: string[];
  questionCount: number;
  /** Seconds per question; overrides the per-question default when set. */
  globalTimeLimit?: number;
}

export interface AnswerRecord {
  questionId: string;
  answer: string;
  timeSpent: number;
  /** Whether the user skipped. */
  skipped: boolean;
}

export interface QuestionEvaluation {
  questionId: string;
  userAnswer: string;
  correctAnswer: string;
  score: number;
  feedback: string;
  strengths: string[];
  improvements: string[];
  keywordsCovered: string[];
  keywordsMissed: string[];
}

export interface SessionEvaluation {
  results: QuestionEvaluation[];
  overallScore: number;
  totalQuestions: number;
  answeredQuestions: number;
  averageTime: number;
  summary: string;
}

export interface InterviewSession {
  id: string;
  config: SessionConfig;
  status: SessionStatus;
  questions: InterviewQuestion[];
  answers: AnswerRecord[];
  startedAt: string | null;
  completedAt: string | null;
  evaluation: SessionEvaluation | null;
}

// ─── Setup options surfaced to the UI ────────────────────────────────────────

export interface MockTypeOption {
  id: InterviewType;
  title: string;
  description: string;
  duration: string;
  difficulty: string;
  recommended?: boolean;
  badge?: string;
}
