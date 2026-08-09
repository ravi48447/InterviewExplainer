/**
 * interview-data.ts — Canonical interview loaders (P10-WB..WG, T061..T180).
 *
 * Fetches questions from /api/mock-interviews/questions and submits answers
 * to /api/mock-interviews/evaluate. Components import from @/lib/interview
 * only (P10-T061).
 *
 * Client-safe (fetch-based).
 */

import apiClient from "@/lib/api-client";
import type {
  InterviewQuestion,
  SessionConfig,
  AnswerRecord,
  QuestionEvaluation,
  SessionEvaluation,
  MockTypeOption,
  InterviewType,
} from "./interview-types";

// ─── Mock type catalog (mirrors the legacy UI list) ──────────────────────────

export const MOCK_TYPES: MockTypeOption[] = [
  {
    id: "partial-mock",
    title: "Quick Practice Round",
    description:
      "Answer 5–7 timed questions from your chosen domain. Review your answers against expert responses.",
    duration: "15–20 min",
    difficulty: "All Levels",
    recommended: true,
    badge: "POPULAR",
  },
  {
    id: "full-mock",
    title: "Full Practice Session",
    description:
      "A longer self-paced session covering multiple topic areas with a review at the end.",
    duration: "40–60 min",
    difficulty: "All Levels",
  },
  {
    id: "coding-mock",
    title: "Technical Deep-Dive",
    description:
      "Focus on the technical concepts that matter most for engineering interviews.",
    duration: "20–30 min",
    difficulty: "Intermediate+",
  },
  {
    id: "system-design-mock",
    title: "System Design Interview",
    description:
      "Practice architecture and scalability questions for senior engineering roles.",
    duration: "45–60 min",
    difficulty: "Advanced",
  },
  {
    id: "behavioral-mock",
    title: "Behavioral Interview",
    description:
      "Practice STAR-method answers to common behavioral and situational questions.",
    duration: "20–30 min",
    difficulty: "All Levels",
  },
];

export function getMockType(id: InterviewType): MockTypeOption | undefined {
  return MOCK_TYPES.find((m) => m.id === id);
}

// ─── Question loading ────────────────────────────────────────────────────────

export async function loadInterviewQuestions(
  config: Pick<SessionConfig, "domainSlug" | "stackSlugs" | "questionCount">,
): Promise<InterviewQuestion[]> {
  try {
    const res = await apiClient.get<InterviewQuestion[]>("/mock-interviews/questions", {
      params: {
        domain: config.domainSlug,
        stacks: config.stackSlugs?.join(","),
        count: config.questionCount,
      },
    });
    return res.data ?? [];
  } catch {
    return [];
  }
}

// ─── Evaluation ──────────────────────────────────────────────────────────────

export async function evaluateSession(
  questions: InterviewQuestion[],
  answers: AnswerRecord[],
): Promise<SessionEvaluation> {
  try {
    const res = await apiClient.post<QuestionEvaluation[]>(
      "/mock-interviews/evaluate",
      { answers },
    );
    const results = res.data ?? [];
    const answered = answers.filter((a) => !a.skipped && a.answer.trim().length > 0);
    const overallScore =
      results.length > 0
        ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
        : 0;
    const averageTime =
      answered.length > 0
        ? Math.round(answered.reduce((sum, a) => sum + a.timeSpent, 0) / answered.length)
        : 0;

    return {
      results,
      overallScore,
      totalQuestions: questions.length,
      answeredQuestions: answered.length,
      averageTime,
      summary: buildSummary(overallScore, answered.length, questions.length),
    };
  } catch {
    return {
      results: [],
      overallScore: 0,
      totalQuestions: questions.length,
      answeredQuestions: 0,
      averageTime: 0,
      summary: "Evaluation could not be completed. Please try again.",
    };
  }
}

function buildSummary(score: number, answered: number, total: number): string {
  if (answered === 0) return "No answers were submitted for evaluation.";
  if (score >= 80) return `Strong performance — you scored ${score}% across ${answered} of ${total} questions.`;
  if (score >= 60) return `Decent effort — you scored ${score}%. Review the missed keywords to improve.`;
  return `You scored ${score}%. Focus on the key concepts highlighted in the feedback.`;
}

export type { SessionEvaluation, QuestionEvaluation };
