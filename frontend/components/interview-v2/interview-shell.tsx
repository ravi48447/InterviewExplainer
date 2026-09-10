/**
 * interview-shell.tsx — Canonical mock interview orchestrator (P10-WL, T261..T280).
 *
 * Drives the setup → runtime → results flow via useInterviewSession. The
 * route (app/mock-interviews/start) renders this single client component,
 * removing the inline state machine from the legacy route (P10-T261).
 */

"use client";

import { useState } from "react";
import { useInterviewSession } from "@/lib/interview";
import type { InterviewType } from "@/lib/interview";
import { SetupForm } from "./setup-form";
import { Runtime } from "./runtime";
import { Results } from "./results";

export interface InterviewShellProps {
  domains: Array<{ slug: string; name: string }>;
}

export function InterviewShell({ domains }: InterviewShellProps) {
  const {
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
  } = useInterviewSession();
  const [starting, setStarting] = useState(false);

  const handleStart = async (
    type: InterviewType,
    domainSlug: string,
    questionCount: number,
  ): Promise<boolean> => {
    setStarting(true);
    const ok = await start({ type, domainSlug, questionCount });
    setStarting(false);
    return ok;
  };

  // Completed → show results.
  if (status === "completed" && evaluation) {
    return <Results evaluation={evaluation} questions={session?.questions ?? []} onRestart={reset} />;
  }

  // In progress → runtime.
  if (status === "in_progress" && session && currentQuestion) {
    return (
      <Runtime
        questionNumber={currentIndex + 1}
        totalQuestions={session.questions.length}
        questionTitle={currentQuestion.title}
        questionText={currentQuestion.question}
        timeLimit={session.config.globalTimeLimit ?? currentQuestion.timeLimit}
        stackName={currentQuestion.stackName}
        difficulty={currentQuestion.difficulty}
        onSubmit={submitAnswer}
        onSkip={skipQuestion}
        onAdvance={advance}
        onFinish={finish}
        isLast={currentIndex >= session.questions.length - 1}
        evaluating={evaluating}
      />
    );
  }

  // Setup (default).
  return <SetupForm domains={domains} onStart={handleStart} starting={starting} />;
}
