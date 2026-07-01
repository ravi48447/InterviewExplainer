'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock, Code2, GitBranch, MessageSquare, Mic, Square, Play, Pause,
  ChevronRight, AlertCircle, CheckCircle2, Send, Volume2, Edit3, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const mockTypeNames: Record<string, string> = {
  'full-mock': 'Full Mock Interview',
  'partial-mock': 'Partial Mock Interview',
  'coding-mock': 'Coding Interview',
  'system-design-mock': 'System Design Interview',
  'behavioral-mock': 'Behavioral Interview',
};

interface Question {
  id: string;
  title: string;
  question: string;
  answer: string;
  keywords: string[];
  difficulty: string;
  type: string;
  timeLimit: number;
  reviewUrl?: string;
}

function MockInterviewStartContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const mockType = searchParams?.get('type') || 'partial-mock';
  const domainSlug = searchParams?.get('domain');
  const difficulty = searchParams?.get('difficulty') || 'mixed';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [answers, setAnswers] = useState<Record<number, { text: string; questionId: string }>>({});
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [mockStarted, setMockStarted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  // Fetch domain-specific questions
  useEffect(() => {
    async function fetchQuestions() {
      if (!domainSlug) {
        setError('No domain selected');
        setLoading(false);
        return;
      }

      try {
        const count = mockType === 'full-mock' ? 12 : 7;
        const response = await fetch(
          `/api/mock-interviews/questions?domain=${domainSlug}&difficulty=${difficulty}&count=${count}`
        );

        if (!response.ok) {
          throw new Error('Failed to fetch questions');
        }

        const data = await response.json();
        setQuestions(data.data.questions);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching questions:', err);
        setError('Failed to load questions. Please try again.');
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [domainSlug, difficulty, mockType]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Initialize timer when question changes
  useEffect(() => {
    if (mockStarted && currentQuestion) {
      setTimeRemaining(currentQuestion.timeLimit);
      setIsTimerRunning(true);
    }
  }, [currentQuestionIndex, mockStarted, currentQuestion]);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isTimerRunning && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, timeRemaining]);

  // Recording timer
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording) {
      interval = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    } else {
      setRecordingTime(0);
    }
    return () => clearInterval(interval);
  }, [isRecording]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartMock = () => {
    if (!currentQuestion) return;
    setMockStarted(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6 dark:from-background dark:to-background/50 dark:via-background/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-background rounded-2xl border-2 border-border shadow-2xl p-8 text-center"
        >
          <Loader2 className="h-12 w-12 text-pink-600 dark:text-pink-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-black text-foreground mb-2">Loading Questions...</h2>
          <p className="text-muted-foreground">Preparing your domain-specific interview</p>
        </motion.div>
      </div>
    );
  }

  if (error || !domainSlug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6 dark:from-background dark:to-background/50 dark:via-background/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-background rounded-2xl border-2 border-border shadow-2xl p-8 text-center"
        >
          <AlertCircle className="h-12 w-12 text-red-600 dark:text-red-400 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-foreground mb-2">Error</h2>
          <p className="text-muted-foreground mb-6">{error || 'No domain selected'}</p>
          <Button onClick={() => router.push('/mock-interviews')} variant="outline">
            Go Back
          </Button>
        </motion.div>
      </div>
    );
  }

  const handleNextQuestion = () => {
    // Save current answer
    setAnswers({
      ...answers,
      [currentQuestionIndex]: {
        text: currentAnswer,
        questionId: currentQuestion.id,
      },
    });
    setCurrentAnswer('');

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowSubmitConfirm(true);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      // Save current answer
      setAnswers({
        ...answers,
        [currentQuestionIndex]: {
          text: currentAnswer,
          questionId: currentQuestion.id,
        },
      });
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      // Load previous answer
      setCurrentAnswer(answers[currentQuestionIndex - 1]?.text || '');
    }
  };

  const handleSubmitMock = async () => {
    try {
      // Save final answer
      const finalAnswers = {
        ...answers,
        [currentQuestionIndex]: {
          text: currentAnswer,
          questionId: currentQuestion.id,
        },
      };

      // Prepare answers for evaluation
      const userAnswers = Object.values(finalAnswers).map((ans) => ({
        questionId: ans.questionId,
        answer: ans.text,
        timeSpent: 180, // Default time if not tracked
      }));

      // Call evaluation API
      const response = await fetch('/api/mock-interviews/evaluate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          answers: userAnswers,
          questions: questions,
        }),
      });

      const data = await response.json();

      if (data.success) {
        // Store results in sessionStorage
        sessionStorage.setItem('mockResults', JSON.stringify(data.data));
        router.push(
          `/mock-interviews/results?score=${data.data.overallFeedback.averageScore}&type=${mockType}&domain=${domainSlug}`
        );
      } else {
        alert('Failed to evaluate answers. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting interview:', error);
      alert('Failed to submit interview. Please try again.');
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  if (!mockStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6 dark:from-background dark:to-background/50 dark:via-background/80">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-background rounded-2xl border-2 border-border shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              {mockType === 'coding-mock' && <Code2 className="h-10 w-10 text-white" />}
              {mockType === 'system-design-mock' && <GitBranch className="h-10 w-10 text-white" />}
              {mockType === 'behavioral-mock' && <MessageSquare className="h-10 w-10 text-white" />}
              {mockType === 'full-mock' && <Play className="h-10 w-10 text-white" />}
            </div>
            <h1 className="text-3xl font-black text-foreground mb-2">
              {mockTypeNames[mockType]}
            </h1>
            <p className="text-muted-foreground">
              You're about to start a mock interview with {questions.length} question{questions.length > 1 ? 's' : ''}
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-foreground mb-1">Instructions</h3>
                <ul className="text-sm text-foreground space-y-1">
                  <li>• Each question has a time limit - manage your time wisely</li>
                  <li>• You can navigate between questions, but the timer keeps running</li>
                  <li>• Your answers are auto-saved as you type</li>
                  <li>• Try to simulate real interview conditions for best practice</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {questions.map((q, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-surface border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    {q.type === 'coding' && <Code2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />}
                    {q.type === 'system-design' && <GitBranch className="h-4 w-4 text-purple-600 dark:text-purple-400" />}
                    {q.type === 'behavioral' && <MessageSquare className="h-4 w-4 text-orange-600 dark:text-orange-400" />}
                    <span className="text-xs font-bold text-muted-foreground uppercase">{q.type}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-semibold text-foreground">{q.timeLimit} minutes</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleStartMock}
            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700 shadow-lg"
          >
            <Play className="h-5 w-5 mr-2" />
            Start Mock Interview
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:from-background dark:to-background/50 dark:via-background/80">
      {/* Header with Timer and Progress */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="w-full min-w-0 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-pink-500 to-rose-600 flex items-center justify-center">
                  <span className="text-white text-sm font-black">{currentQuestionIndex + 1}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Question {currentQuestionIndex + 1} of {questions.length}</p>
                  <p className="text-sm font-black text-foreground">{mockTypeNames[mockType]}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold",
                timeRemaining < 60 ? "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 animate-pulse" :
                timeRemaining < 300 ? "bg-orange-100 dark:bg-orange-950/20 text-orange-700" :
                "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
              )}>
                <Clock className="h-5 w-5" />
                {formatTime(timeRemaining)}
              </div>

              <Button
                variant="outline"
                onClick={() => setIsTimerRunning(!isTimerRunning)}
                className="font-semibold"
              >
                {isTimerRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-pink-500 to-rose-600"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-w-0 px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Question Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Question Card */}
            <motion.div
              key={currentQuestionIndex}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-background rounded-2xl border-2 border-border shadow-lg p-8"
            >
              <div className="flex items-center gap-3 mb-6">
                <div className={cn(
                  "w-12 h-12 rounded-xl flex items-center justify-center",
                  currentQuestion.type === 'coding' && "bg-gradient-to-br from-blue-500 to-cyan-600",
                  currentQuestion.type === 'system-design' && "bg-gradient-to-br from-purple-500 to-indigo-600",
                  currentQuestion.type === 'behavioral' && "bg-gradient-to-br from-orange-500 to-amber-600"
                )}>
                  {currentQuestion.type === 'coding' && <Code2 className="h-6 w-6 text-white" />}
                  {currentQuestion.type === 'system-design' && <GitBranch className="h-6 w-6 text-white" />}
                  {currentQuestion.type === 'behavioral' && <MessageSquare className="h-6 w-6 text-white" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-1">
                    {currentQuestion.type.replace('-', ' ')}
                  </p>
                  <p className="text-sm font-semibold text-muted-foreground">
                    {currentQuestion.timeLimit} minute{currentQuestion.timeLimit > 1 ? 's' : ''} to answer
                  </p>
                </div>
              </div>

              <h2 className="text-2xl font-black text-foreground mb-4 leading-tight">
                {currentQuestion.question}
              </h2>

              {currentQuestion.type === 'coding' && (
                <div className="p-4 rounded-xl bg-surface border border-border text-sm text-foreground">
                  <p className="font-semibold mb-2">Tips:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Explain your thought process as you write</li>
                    <li>• Consider edge cases and time/space complexity</li>
                    <li>• Write clean, readable code with proper variable names</li>
                  </ul>
                </div>
              )}

              {currentQuestion.type === 'system-design' && (
                <div className="p-4 rounded-xl bg-surface border border-border text-sm text-foreground">
                  <p className="font-semibold mb-2">Areas to cover:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• Requirements clarification (functional & non-functional)</li>
                    <li>• High-level architecture and components</li>
                    <li>• Data models and storage solutions</li>
                    <li>• Scalability, reliability, and trade-offs</li>
                  </ul>
                </div>
              )}

              {currentQuestion.type === 'behavioral' && (
                <div className="p-4 rounded-xl bg-surface border border-border text-sm text-foreground">
                  <p className="font-semibold mb-2">Use the STAR method:</p>
                  <ul className="space-y-1 text-xs">
                    <li>• <span className="font-bold">Situation:</span> Set the context</li>
                    <li>• <span className="font-bold">Task:</span> Describe your responsibility</li>
                    <li>• <span className="font-bold">Action:</span> Explain what you did</li>
                    <li>• <span className="font-bold">Result:</span> Share the outcome</li>
                  </ul>
                </div>
              )}
            </motion.div>

            {/* Answer Panel */}
            <div className="bg-background rounded-2xl border-2 border-border shadow-lg p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-black text-foreground">Your Answer</h3>

                {currentQuestion.type === 'behavioral' && (
                  <Button
                    onClick={toggleRecording}
                    variant={isRecording ? "destructive" : "outline"}
                    size="sm"
                    className="font-semibold"
                  >
                    {isRecording ? (
                      <>
                        <Square className="h-4 w-4 mr-2" />
                        Stop Recording ({formatTime(recordingTime)})
                      </>
                    ) : (
                      <>
                        <Mic className="h-4 w-4 mr-2" />
                        Record Answer
                      </>
                    )}
                  </Button>
                )}
              </div>

              <textarea
                value={currentAnswer}
                onChange={(e) => setCurrentAnswer(e.target.value)}
                placeholder={
                  currentQuestion.type === 'coding'
                    ? '// Write your code here...\n\nfunction solution() {\n  \n}'
                    : currentQuestion.type === 'system-design'
                    ? 'Describe your system design approach here...\n\n1. Requirements:\n   - \n\n2. High-level architecture:\n   - \n\n3. Data models:\n   - '
                    : 'Share your experience using the STAR method...\n\nSituation:\n\nTask:\n\nAction:\n\nResult:'
                }
                className="w-full h-96 p-4 rounded-xl border-2 border-border focus:border-blue-500 dark:border-blue-700 focus:ring-2 focus:ring-blue-200 transition-all resize-none font-mono text-sm"
              />

              <div className="flex items-center justify-between mt-4">
                <p className="text-xs text-muted-foreground">
                  {currentAnswer.length} characters • Auto-saved
                </p>
                <div className="flex items-center gap-2">
                  <Button
                    onClick={handlePreviousQuestion}
                    disabled={currentQuestionIndex === 0}
                    variant="outline"
                    className="font-semibold"
                  >
                    Previous
                  </Button>
                  <Button
                    onClick={handleNextQuestion}
                    className="font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700"
                  >
                    {currentQuestionIndex === questions.length - 1 ? (
                      <>
                        Submit Mock
                        <Send className="h-4 w-4 ml-2" />
                      </>
                    ) : (
                      <>
                        Next Question
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </>
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Overview Panel */}
          <div className="space-y-6">
            {/* Questions Overview */}
            <div className="bg-background rounded-2xl border-2 border-border shadow-lg p-6 sticky top-24">
              <h3 className="text-lg font-black text-foreground mb-4">Questions</h3>
              <div className="space-y-2">
                {questions.map((q, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      if (currentQuestion) {
                        setAnswers({
                          ...answers,
                          [currentQuestionIndex]: {
                            text: currentAnswer,
                            questionId: currentQuestion.id,
                          },
                        });
                      }
                      setCurrentQuestionIndex(idx);
                      setCurrentAnswer(answers[idx]?.text || '');
                    }}
                    className={cn(
                      "w-full text-left p-3 rounded-xl border-2 transition-all",
                      idx === currentQuestionIndex
                        ? "bg-blue-50 dark:bg-blue-500/10 border-blue-500"
                        : answers[idx]
                        ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 hover:border-emerald-400 dark:border-emerald-700"
                        : "bg-surface border-border hover:border-border"
                    )}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className={cn(
                        "text-xs font-black px-2 py-0.5 rounded",
                        idx === currentQuestionIndex
                          ? "bg-blue-600 dark:bg-blue-800 text-white"
                          : answers[idx]
                          ? "bg-emerald-600 dark:bg-emerald-800 text-white"
                          : "bg-slate-300 dark:bg-slate-800 text-foreground"
                      )}>
                        Q{idx + 1}
                      </span>
                      {answers[idx] && idx !== currentQuestionIndex && (
                        <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      )}
                    </div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1">
                      {q.type.replace('-', ' ')}
                    </p>
                    <p className="text-xs text-muted-foreground">{q.timeLimit} min</p>
                  </button>
                ))}
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <Button
                  onClick={() => setShowSubmitConfirm(true)}
                  variant="outline"
                  className="w-full font-bold text-rose-600 dark:text-rose-400 border-rose-300 dark:border-rose-500/30 hover:bg-rose-50 dark:bg-rose-500/10"
                >
                  Submit Interview
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      <AnimatePresence>
        {showSubmitConfirm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground dark:bg-background/50 flex items-center justify-center z-50 p-6"
            onClick={() => setShowSubmitConfirm(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-background rounded-2xl border-2 border-border shadow-2xl p-8 max-w-md w-full"
            >
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-rose-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Send className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-2xl font-black text-foreground mb-2 text-center">Submit Mock Interview?</h3>
              <p className="text-muted-foreground text-center mb-6">
                You've answered {Object.keys(answers).length + 1} out of {questions.length} questions. Your answers will be evaluated and you'll receive detailed feedback.
              </p>
              <div className="flex gap-3">
                <Button
                  onClick={() => setShowSubmitConfirm(false)}
                  variant="outline"
                  className="flex-1 font-semibold"
                >
                  Keep Working
                </Button>
                <Button
                  onClick={handleSubmitMock}
                  className="flex-1 font-bold bg-gradient-to-r from-pink-600 to-rose-600 hover:from-pink-700 hover:to-rose-700"
                >
                  Submit Now
                </Button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
export default function MockInterviewStartPage() {
  return <MockInterviewStartContent />;
}
