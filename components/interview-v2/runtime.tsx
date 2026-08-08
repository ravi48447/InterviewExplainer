/**
 * runtime.tsx — Interview runtime (P10-WE..WH, T121..T200).
 *
 * The live interview surface: current question, countdown timer, answer
 * textarea, skip/submit, and progress. Driven by useInterviewSession.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Clock, Send, SkipForward, AlertCircle, Loader2, ArrowRight } from "lucide-react";

export interface RuntimeProps {
  questionNumber: number;
  totalQuestions: number;
  questionTitle: string;
  questionText: string;
  timeLimit: number;
  stackName: string;
  difficulty: string;
  onSubmit: (answer: string, timeSpent: number) => void;
  onSkip: (timeSpent: number) => void;
  onAdvance: () => void;
  onFinish: () => Promise<void>;
  isLast: boolean;
  evaluating: boolean;
}

export function Runtime({
  questionNumber,
  totalQuestions,
  questionTitle,
  questionText,
  timeLimit,
  stackName,
  difficulty,
  onSubmit,
  onSkip,
  onAdvance,
  onFinish,
  isLast,
  evaluating,
}: RuntimeProps) {
  const [answer, setAnswer] = useState("");
  const [secondsLeft, setSecondsLeft] = useState(timeLimit);
  const startRef = useRef<number>(Date.now());
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Reset per question.
  useEffect(() => {
    setAnswer("");
    setSecondsLeft(timeLimit);
    startRef.current = Date.now();
  }, [questionNumber, timeLimit]);

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [questionNumber]);

  const elapsed = Math.round((Date.now() - startRef.current) / 1000);

  const handleSubmit = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onSubmit(answer, elapsed);
    if (isLast) {
      onFinish();
    } else {
      onAdvance();
    }
  };

  const handleSkip = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    onSkip(elapsed);
    if (isLast) {
      onFinish();
    } else {
      onAdvance();
    }
  };

  const timeUp = secondsLeft === 0;
  if (timeUp && answer.trim().length > 0) {
    // Auto-submit when time runs out.
    handleSubmit();
  }

  const minutes = Math.floor(secondsLeft / 60);
  const secs = secondsLeft % 60;
  const lowTime = secondsLeft <= 30;

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress + timer */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm font-semibold text-muted-foreground">
          Question {questionNumber} of {totalQuestions}
        </span>
        <div className={`flex items-center gap-1.5 text-sm font-bold ${lowTime ? "text-red-600 dark:text-red-400" : "text-foreground"}`}>
          <Clock className="h-4 w-4" />
          {minutes}:{secs.toString().padStart(2, "0")}
        </div>
      </div>

      <div className="h-1 rounded-full bg-border mb-6 overflow-hidden">
        <div
          className="h-full bg-primary transition-all"
          style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
        />
      </div>

      {/* Question */}
      <div className="rounded-xl border border-border bg-card p-6 mb-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {stackName}
          </span>
          <span className="text-xs text-muted-foreground">·</span>
          <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {difficulty}
          </span>
        </div>
        <h2 className="text-lg font-bold text-foreground mb-2">{questionTitle}</h2>
        <p className="text-sm text-muted-foreground">{questionText}</p>
      </div>

      {/* Answer */}
      <div className="space-y-2">
        <label htmlFor="answer" className="text-sm font-semibold text-foreground">
          Your answer
        </label>
        <textarea
          id="answer"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type your answer here…"
          rows={8}
          className="w-full rounded-lg border border-border bg-card px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-y"
        />
      </div>

      {timeUp && (
        <div className="flex items-center gap-2 mt-3 text-sm text-amber-600 dark:text-amber-400">
          <AlertCircle className="h-4 w-4" />
          Time is up — submitting your answer.
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center justify-between gap-3 mt-6">
        <button
          type="button"
          onClick={handleSkip}
          disabled={evaluating}
          className="inline-flex items-center gap-1.5 px-4 py-2.5 border border-border rounded-lg text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-surface disabled:opacity-50"
        >
          <SkipForward className="h-4 w-4" />
          Skip
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          disabled={evaluating || answer.trim().length === 0}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-primary-foreground rounded-lg text-sm font-semibold hover:opacity-90 disabled:opacity-50"
        >
          {evaluating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <>
              {isLast ? "Finish & evaluate" : "Submit & next"}
              {isLast ? <ArrowRight className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            </>
          )}
        </button>
      </div>
    </div>
  );
}
