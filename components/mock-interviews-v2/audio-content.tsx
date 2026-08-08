'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Square, CheckCircle2, Clock,
  AlertCircle, ChevronRight, Send, Radio, Sparkles,
  User, Bot, FileText, SkipForward
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ReadAloudButton } from '@/components/speakable/ReadAloudButton';
import { CardSkeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/ui/error-state';
import { Tag } from '@/components/ui/tag';
import { Badge } from '@/components/ui/badge';
import { PageContainer } from '@/components/page-container';

interface Question {
  id: string;
  title: string;
  question: string;
  answer: string;
  keywords: string[];
  difficulty: string;
  type: string;
  timeLimit: number;
}

export function AudioMockInterviewContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainSlug = searchParams?.get('domain');
  const difficulty = searchParams?.get('difficulty') || 'mixed';

  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [transcription, setTranscription] = useState('');
  const [answers, setAnswers] = useState<Record<number, { text: string; duration: number; questionId: string }>>({});
  const [interviewStarted, setInterviewStarted] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const [showTranscript, setShowTranscript] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [selectedVoice, setSelectedVoice] = useState<SpeechSynthesisVoice | null>(null);

  const recognitionRef = useRef<any>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const activeUtteranceRef = useRef<SpeechSynthesisUtterance | null>(null);
  const speechTimeoutRef = useRef<number | null>(null);

  // Fetch domain-specific questions on mount
  useEffect(() => {
    async function fetchQuestions() {
      if (!domainSlug) {
        setError('No domain selected');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(
          `/api/mock-interviews/questions?domain=${domainSlug}&difficulty=${difficulty}&count=7`
        );

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          throw new Error(errorData.error || `Failed to fetch questions: ${response.status}`);
        }

        const data = await response.json();

        if (!data.success || !data.data?.questions) {
          throw new Error('Invalid response format');
        }

        setQuestions(data.data.questions);
        setLoading(false);
      } catch (err: any) {
        console.error('Error fetching questions:', err);
        setError(err.message || 'Failed to load questions. Please try again.');
        setLoading(false);
      }
    }

    fetchQuestions();
  }, [domainSlug, difficulty]);

  const currentQuestion = questions[currentQuestionIndex];
  const progress = questions.length > 0 ? ((currentQuestionIndex + 1) / questions.length) * 100 : 0;

  // Initialize timer when question changes
  useEffect(() => {
    if (interviewStarted && currentQuestion) {
      setTimeRemaining(currentQuestion.timeLimit);
    }
  }, [currentQuestionIndex, interviewStarted, currentQuestion]);

  // Initialize Speech Recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'en-US';

        recognitionRef.current.onresult = (event: any) => {
          let interimTranscript = '';
          let finalTranscript = '';

          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              finalTranscript += transcript + ' ';
            } else {
              interimTranscript += transcript;
            }
          }

          setTranscription((prev) => {
            const newText = finalTranscript ? prev + finalTranscript : prev + interimTranscript;
            return newText;
          });
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech recognition error:', event.error);
        };
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    const chooseVoice = () => {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return;
      const preferred =
        voices.find(v =>
          /en(-|_|$)/i.test(v.lang) &&
          /female|samantha|google us english|zira|aria|allison/i.test(v.name),
        ) ??
        voices.find(v => /en(-|_|$)/i.test(v.lang)) ??
        voices[0];
      setSelectedVoice(preferred ?? null);
    };

    chooseVoice();
    window.speechSynthesis.onvoiceschanged = chooseVoice;

    return () => {
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
      clearSpeechTimeout();
      activeUtteranceRef.current = null;
    };
  }, []);

  // Timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isRecording && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            handleStopRecording();
            return 0;
          }
          return prev - 1;
        });
        setRecordingTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isRecording, timeRemaining]);

  const clearSpeechTimeout = () => {
    if (speechTimeoutRef.current) {
      window.clearTimeout(speechTimeoutRef.current);
      speechTimeoutRef.current = null;
    }
  };

  const completeSpeech = (autoStartRecording: boolean) => {
    clearSpeechTimeout();
    activeUtteranceRef.current = null;
    setIsAIPlaying(false);
    if (autoStartRecording && !isRecording) {
      setTimeout(() => {
        void handleStartRecording();
      }, 450);
    }
  };

  // Text-to-Speech for AI questions
  const speakQuestion = (text: string, autoStartRecording = true) => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      setSpeechError('Voice playback is not supported in this browser. You can still record manually.');
      if (autoStartRecording && !isRecording) {
        void handleStartRecording();
      }
      return;
    }

    setSpeechError(null);
    window.speechSynthesis.cancel();
    clearSpeechTimeout();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (selectedVoice) {
      utterance.voice = selectedVoice;
      utterance.lang = selectedVoice.lang;
    } else {
      utterance.lang = 'en-US';
    }

    utterance.onstart = () => setIsAIPlaying(true);
    utterance.onend = () => completeSpeech(autoStartRecording);
    utterance.onerror = () => {
      setSpeechError('Could not play AI voice. Continue by recording manually.');
      completeSpeech(autoStartRecording);
    };

    activeUtteranceRef.current = utterance;
    setIsAIPlaying(true);
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);

    const maxWaitMs = Math.min(30000, Math.max(7000, text.length * 85));
    speechTimeoutRef.current = window.setTimeout(() => {
      if (activeUtteranceRef.current === utterance) {
        window.speechSynthesis.cancel();
        setSpeechError('Voice playback timed out. Continue by recording manually.');
        completeSpeech(autoStartRecording);
      }
    }, maxWaitMs);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      clearSpeechTimeout();
      activeUtteranceRef.current = null;
      setIsAIPlaying(false);
    }
  };

  // Audio level visualization
  const startAudioVisualization = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      audioContextRef.current = new AudioContext();
      const source = audioContextRef.current.createMediaStreamSource(stream);
      analyserRef.current = audioContextRef.current.createAnalyser();
      analyserRef.current.fftSize = 256;
      source.connect(analyserRef.current);

      const bufferLength = analyserRef.current.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      const updateLevel = () => {
        if (analyserRef.current && isRecording) {
          analyserRef.current.getByteFrequencyData(dataArray);
          const average = dataArray.reduce((a, b) => a + b) / bufferLength;
          setAudioLevel(average / 255);
          animationFrameRef.current = requestAnimationFrame(updateLevel);
        }
      };

      updateLevel();
    } catch (error) {
      console.error('Error accessing microphone:', error);
    }
  };

  const handleStartRecording = async () => {
    if (!currentQuestion || isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);

      setIsRecording(true);
      setRecordingTime(0);
      setTimeRemaining(currentQuestion.timeLimit);
      setTranscription('');

      mediaRecorderRef.current.start();
      startAudioVisualization();

      if (recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (err) {
          console.warn('Speech recognition start warning:', err);
        }
      }
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);

      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());

      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }

      if (audioContextRef.current) {
        audioContextRef.current.close();
      }

      setAudioLevel(0);

      // Save answer
      setAnswers({
        ...answers,
        [currentQuestionIndex]: {
          text: transcription,
          duration: recordingTime,
          questionId: currentQuestion.id,
        },
      });
    }
  };

  const handleNextQuestion = () => {
    stopSpeaking();

    if (isRecording) {
      handleStopRecording();
    }

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setTranscription('');
      setRecordingTime(0);
      setTimeRemaining(0);

      // Auto-play next question after a brief pause
      setTimeout(() => {
        speakQuestion(questions[currentQuestionIndex + 1].question, true);
      }, 1000);
    } else {
      // Interview complete
      handleSubmitInterview();
    }
  };

  const handleSkipQuestion = () => {
    if (isRecording) {
      handleStopRecording();
    }
    handleNextQuestion();
  };

  const handleSubmitInterview = async () => {
    try {
      // Prepare answers for evaluation
      const userAnswers = Object.values(answers).map((ans, idx) => ({
        questionId: ans.questionId,
        answer: ans.text,
        timeSpent: ans.duration,
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
        // Store results in sessionStorage for results page
        sessionStorage.setItem('mockResults', JSON.stringify(data.data));
        router.push(`/mock-interviews/results?score=${data.data.overallFeedback.averageScore}&type=audio&domain=${domainSlug}`);
      } else {
        alert('Failed to evaluate answers. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting interview:', error);
      alert('Failed to submit interview. Please try again.');
    }
  };

  const handleStartInterview = () => {
    if (!currentQuestion) return;
    setInterviewStarted(true);
    speakQuestion(currentQuestion.question, true);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="bg-background">
        <PageContainer className="py-20">
          <div className="max-w-2xl mx-auto space-y-6" aria-live="polite" aria-busy="true">
            <CardSkeleton className="p-8 h-64" />
            <CardSkeleton className="p-4 h-32" />
          </div>
        </PageContainer>
      </div>
    );
  }

  if (error || !domainSlug) {
    return (
      <div className="bg-background">
        <PageContainer className="py-20">
          <ErrorState
            title="Unable to load interview"
            description={error || 'No domain selected'}
            retryLabel="Go back"
            onRetry={() => router.push('/mock-interviews')}
            className="max-w-2xl mx-auto"
          />
        </PageContainer>
      </div>
    );
  }

  if (!interviewStarted) {
    return (
      <div className="bg-background">
        <PageContainer className="py-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto rounded-xl border border-border bg-card p-8 sm:p-10"
          >
            <div className="text-center mb-8">
              <div className="flex h-20 w-20 items-center justify-center rounded-xl border border-border bg-surface mx-auto mb-4">
                <Radio className="h-10 w-10 text-primary" />
              </div>
              <h1 className="type-title text-foreground mb-2">
                AI Voice Mock Interview
              </h1>
              <p className="text-muted-foreground">
                Real-time conversation with AI interviewer • {questions.length} domain-specific questions
              </p>
            </div>

            <div className="space-y-4 mb-8">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-surface">
                <Sparkles className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground mb-1">How It Works</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• AI will speak each question out loud</li>
                    <li>• Answer verbally - your speech is automatically transcribed</li>
                    <li>• Each question has a time limit</li>
                    <li>• Your answers are evaluated based on content, clarity, and structure</li>
                  </ul>
                </div>
              </div>

              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-surface">
                <AlertCircle className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-bold text-foreground mb-1">Requirements</h3>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Microphone access required</li>
                    <li>• Find a quiet environment</li>
                    <li>• Use headphones to avoid echo</li>
                    <li>• Works best in Chrome or Edge browsers</li>
                  </ul>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 rounded-lg border border-border bg-surface text-center">
                  <p className="text-2xl font-bold text-foreground mb-1 tabular-nums">{questions.length}</p>
                  <p className="type-label text-muted-foreground">Questions</p>
                </div>
                <div className="p-4 rounded-lg border border-border bg-surface text-center">
                  <p className="text-2xl font-bold text-foreground mb-1 tabular-nums">
                    ~{Math.floor(questions.reduce((acc, q) => acc + q.timeLimit, 0) / 60)} min
                  </p>
                  <p className="type-label text-muted-foreground">Total Duration</p>
                </div>
              </div>
            </div>

            <Button
              onClick={handleStartInterview}
              size="lg"
              className="w-full py-6 text-lg font-bold"
            >
              <Radio className="h-5 w-5 mr-2" />
              Start Voice Interview
            </Button>
          </motion.div>
        </PageContainer>
      </div>
    );
  }

  return (
    <div className="bg-background min-h-screen">
      {/* Header — token-based, readable badge numbers (no white-on-light bug) */}
      <div className="sticky top-0 z-[var(--z-sticky)] bg-background/95 backdrop-blur-xl border-b border-border">
        <PageContainer className="py-4">
          <div className="flex items-center justify-between mb-3 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-border bg-surface">
                <span className="text-sm font-bold text-foreground tabular-nums">{currentQuestionIndex + 1}</span>
              </div>
              <div className="min-w-0">
                <p className="type-label text-muted-foreground truncate">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <p className="text-sm font-bold text-foreground">AI Voice Interview</p>
              </div>
            </div>

            {isRecording && (
              <div
                aria-live="polite"
                aria-atomic="true"
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded-lg font-mono text-base font-bold tabular-nums shrink-0",
                  timeRemaining < 30 ? "bg-destructive/10 text-destructive animate-pulse" :
                  timeRemaining < 60 ? "bg-warning/10 text-warning" :
                  "bg-primary/10 text-primary"
                )}
              >
                <Clock className="h-5 w-5" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          {/* Progress Bar — token track (bg-muted), primary fill */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-primary rounded-full transition-[width] duration-300 ease-out"
            />
          </div>
        </PageContainer>
      </div>

      {/* Main Content */}
      <PageContainer className="py-8">
        {/* AI Question Display */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className={cn(
              "flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-border bg-surface transition-colors duration-200 ease-out",
              isAIPlaying && "animate-pulse"
            )}>
              <Bot className="h-7 w-7 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <p className="type-label text-primary">
                  AI Interviewer
                </p>
                {isAIPlaying && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1"
                  >
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    <div className="w-1 h-1 bg-primary rounded-full" />
                    <div className="w-1 h-1 bg-primary rounded-full" />
                  </motion.div>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-4 leading-tight">
                {currentQuestion.question}
              </h2>
              <div className="flex flex-wrap items-center gap-3">
                <Button
                  onClick={() => speakQuestion(currentQuestion.question, false)}
                  disabled={isAIPlaying || isRecording}
                  variant="outline"
                  size="sm"
                  className="font-semibold"
                >
                  <Volume2 className="h-4 w-4 mr-2" />
                  {isAIPlaying ? 'Speaking...' : 'Replay Question'}
                </Button>
                {isAIPlaying && (
                  <Button
                    onClick={stopSpeaking}
                    variant="outline"
                    size="sm"
                    aria-label="Stop AI voice"
                    className="font-semibold text-destructive"
                  >
                    <Square className="h-4 w-4 mr-2" />
                    Stop
                  </Button>
                )}
                {/* Phase 1.6 — read the model answer aloud once the
                    candidate has practiced. Uses Speakable's shared
                    button so v2-approved questions go through
                    toSpeech() automatically when they ship. */}
                {answers[currentQuestionIndex] && currentQuestion.answer ? (
                  <ReadAloudButton
                    source={{
                      kind: "legacy",
                      legacy: { type: "speakable_answer", content: currentQuestion.answer },
                    }}
                    label="Hear model answer"
                    stopLabel="Stop answer"
                    voice={selectedVoice}
                    disabled={isAIPlaying || isRecording}
                  />
                ) : null}
              </div>
              {speechError && (
                <p className="mt-3 text-xs font-semibold text-warning border border-warning/30 bg-warning/10 rounded-lg px-3 py-2">
                  {speechError}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-lg border border-border bg-surface flex items-center justify-between gap-3">
            <div className="text-sm text-muted-foreground min-w-0">
              <span className="font-bold text-foreground">Time Limit:</span> {Math.floor(currentQuestion.timeLimit / 60)} min {currentQuestion.timeLimit % 60} sec
            </div>
            <Badge variant="outline" className="uppercase tracking-wider shrink-0">
              {currentQuestion.difficulty}
            </Badge>
          </div>
        </motion.div>

        {/* Recording Interface */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 mb-6">
          <div className="flex items-center justify-between mb-6 gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <div className={cn(
                "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-border bg-surface transition-colors duration-200 ease-out",
                isRecording && "animate-pulse"
              )}>
                <User className="h-6 w-6 text-primary" />
              </div>
              <div className="min-w-0">
                <p className="type-label text-muted-foreground">Your Answer</p>
                <p className="text-lg font-bold text-foreground">
                  {isRecording ? 'Recording...' : 'Ready to Record'}
                </p>
              </div>
            </div>

            {isRecording && (
              <div className="text-right shrink-0" aria-live="polite" aria-atomic="true">
                <p className="text-2xl font-bold text-foreground tabular-nums">{formatTime(recordingTime)}</p>
                <p className="type-label text-muted-foreground">Recording Time</p>
              </div>
            )}
          </div>

          {/* Audio Level Visualizer — primary bars, not surface */}
          {isRecording && (
            <div className="mb-6">
              <div className="flex items-end justify-center gap-1 h-24">
                {[...Array(40)].map((_, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      height: `${Math.random() * audioLevel * 100 + 10}%`,
                    }}
                    transition={{
                      duration: 0.1,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    className="w-1 bg-primary rounded-full"
                  />
                ))}
              </div>
            </div>
          )}

          {/* Recording Controls */}
          <div className="flex items-center gap-3 mb-6">
            {!isRecording ? (
              <Button
                onClick={handleStartRecording}
                disabled={isAIPlaying}
                size="lg"
                className="flex-1 py-6 text-lg font-bold"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={handleStopRecording}
                aria-label="Stop recording"
                size="lg"
                variant="destructive"
                className="flex-1 py-6 text-lg font-bold"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop Recording
              </Button>
            )}
            <Button
              onClick={handleSkipQuestion}
              disabled={isAIPlaying}
              variant="outline"
              aria-label="Skip question"
              className="font-semibold px-6 py-6 touch-target"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Transcription Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-bold text-foreground">Live Transcription</h3>
              </div>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                aria-label={showTranscript ? 'Hide transcription' : 'Show transcription'}
                aria-expanded={showTranscript}
                className="text-xs font-bold text-primary hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded touch-target"
              >
                {showTranscript ? 'Hide' : 'Show'}
              </button>
            </div>

            <AnimatePresence>
              {showTranscript && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-lg border border-border bg-surface min-h-[120px] max-h-[300px] overflow-y-auto">
                    {transcription ? (
                      <p className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
                        {transcription}
                      </p>
                    ) : (
                      <p className="text-sm text-muted-foreground italic">
                        {isRecording ? 'Listening... Start speaking' : 'Your speech will appear here'}
                      </p>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Next Button */}
          {!isRecording && transcription && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <Button
                onClick={handleNextQuestion}
                size="lg"
                className="w-full py-4 font-bold"
              >
                {currentQuestionIndex === questions.length - 1 ? (
                  <>
                    Submit Interview
                    <Send className="h-4 w-4 ml-2" />
                  </>
                ) : (
                  <>
                    Next Question
                    <ChevronRight className="h-4 w-4 ml-2" />
                  </>
                )}
              </Button>
            </motion.div>
          )}
        </div>

        {/* Questions Progress — token tints, no raw slate */}
        <div className="rounded-xl border border-border bg-card p-6">
          <h3 className="type-section text-foreground mb-4">Interview Progress</h3>
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={cn(
                  "p-3 rounded-lg border text-center transition-colors duration-200 ease-out",
                  idx === currentQuestionIndex
                    ? "bg-primary/10 border-primary"
                    : answers[idx]
                    ? "bg-success/10 border-success/30"
                    : "bg-surface border-border"
                )}
              >
                <div className={cn(
                  "flex h-8 w-8 items-center justify-center rounded-lg mx-auto mb-2",
                  idx === currentQuestionIndex
                    ? "bg-primary text-primary-foreground"
                    : answers[idx]
                    ? "bg-success text-success-foreground"
                    : "bg-muted text-muted-foreground"
                )}>
                  {answers[idx] ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-bold tabular-nums">{idx + 1}</span>
                  )}
                </div>
                <p className="text-xs font-bold text-muted-foreground capitalize truncate">{q.difficulty}</p>
              </div>
            ))}
          </div>
        </div>
      </PageContainer>
    </div>
  );
}
