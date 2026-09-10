/**
 * interview-session.ts — Session state machine (P10-WH..WK, T181..T260).
 *
 * A React hook that owns the in-memory interview session: setup → in_progress
 * → completed, with the answer buffer and evaluation. Keeps the runtime UI
 * free of orchestration logic (P10-T181).
 *
 * Client-only.
 */

"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import {
  loadInterviewQuestions,
  evaluateSession,
} from "./interview-data";
import type {
  InterviewQuestion,
  SessionConfig,
  AnswerRecord,
  SessionStatus,
  SessionEvaluation,
  InterviewSession,
} from "./interview-types";

const SESSION_KEY = "ie_interview_session";

function genId(): string {
  return `s_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export interface UseInterviewSession {
  session: InterviewSession | null;
  status: SessionStatus;
  currentIndex: number;
  currentQuestion: InterviewQuestion | null;
  start: (config: SessionConfig) => Promise<boolean>;
  submitAnswer: (answer: string, timeSpent: number) => void;
  skipQuestion: (timeSpent: number) => void;
  advance: () => void;
  finish: () => Promise<void>;
  reset: () => void;
  evaluation: SessionEvaluation | null;
  evaluating: boolean;
}

export function useInterviewSession(): UseInterviewSession {
  const [session, setSession] = useState<InterviewSession | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [evaluation, setEvaluation] = useState<SessionEvaluation | null>(null);
  const [evaluating, setEvaluating] = useState(false);
  const timerRef = useRef<Record<string, number>>({});

  const status: SessionStatus = session?.status ?? "setup";
  const currentQuestion = session?.questions[currentIndex] ?? null;

  const start = useCallback(async (config: SessionConfig): Promise<boolean> => {
    const questions = await loadInterviewQuestions(config);
    if (questions.length === 0) return false;
    const newSession: InterviewSession = {
      id: genId(),
      config,
      status: "in_progress",
      questions,
      answers: [],
      startedAt: new Date().toISOString(),
      completedAt: null,
      evaluation: null,
    };
    setSession(newSession);
    setCurrentIndex(0);
    setEvaluation(null);
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(newSession));
    } catch {
      /* ignore */
    }
    return true;
  }, []);

  const recordAnswer = useCallback(
    (answer: string, timeSpent: number, skipped: boolean) => {
      if (!session || !currentQuestion) return;
      const record: AnswerRecord = {
        questionId: currentQuestion.id,
        answer,
        timeSpent,
        skipped,
      };
      const updated: InterviewSession = {
        ...session,
        answers: [...session.answers.filter((a) => a.questionId !== record.questionId), record],
      };
      setSession(updated);
      try {
        sessionStorage.setItem(SESSION_KEY, JSON.stringify(updated));
      } catch {
        /* ignore */
      }
    },
    [session, currentQuestion],
  );

  const submitAnswer = useCallback(
    (answer: string, timeSpent: number) => recordAnswer(answer, timeSpent, false),
    [recordAnswer],
  );

  const skipQuestion = useCallback(
    (timeSpent: number) => recordAnswer("", timeSpent, true),
    [recordAnswer],
  );

  const advance = useCallback(() => {
    if (!session) return;
    if (currentIndex < session.questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  }, [session, currentIndex]);

  const finish = useCallback(async () => {
    if (!session) return;
    setEvaluating(true);
    const evalResult = await evaluateSession(session.questions, session.answers);
    setEvaluation(evalResult);
    const completed: InterviewSession = {
      ...session,
      status: "completed",
      completedAt: new Date().toISOString(),
      evaluation: evalResult,
    };
    setSession(completed);
    setEvaluating(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [session]);

  const reset = useCallback(() => {
    setSession(null);
    setCurrentIndex(0);
    setEvaluation(null);
    setEvaluating(false);
    try {
      sessionStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, []);

  // Restore an in-flight session on mount.
  useEffect(() => {
    if (session) return;
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      if (!raw) return;
      const restored = JSON.parse(raw) as InterviewSession;
      if (restored && restored.status === "in_progress" && restored.questions.length > 0) {
        setSession(restored);
        setCurrentIndex(Math.min(restored.answers.length, restored.questions.length - 1));
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    session,
    status,
    currentIndex,
    currentQuestion,
    start,
    submitAnswer,
    skipQuestion,
    advance,
    finish,
    reset,
    evaluation,
    evaluating,
  };
}
