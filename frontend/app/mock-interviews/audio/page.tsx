'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Square, Play, Pause, CheckCircle2, Clock,
  AlertCircle, ChevronRight, Send, Radio, Sparkles, MessageSquare,
  User, Bot, FileText, Zap, SkipForward, Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { ReadAloudButton } from '@/components/speakable/ReadAloudButton';

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

function AudioMockInterviewContent() {
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
        console.log('Fetching questions for:', { domainSlug, difficulty });
        const response = await fetch(
          `/api/mock-interviews/questions?domain=${domainSlug}&difficulty=${difficulty}&count=7`
        );

        console.log('Response status:', response.status);

        if (!response.ok) {
          const errorData = await response.json().catch(() => ({}));
          console.error('API Error:', errorData);
          throw new Error(errorData.error || `Failed to fetch questions: ${response.status}`);
        }

        const data = await response.json();
        console.log('Questions received:', data);

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
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6 dark:bg-none dark:bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-background rounded-2xl border-2 border-border shadow-2xl p-8 text-center"
        >
          <Loader2 className="h-12 w-12 text-purple-600 dark:text-purple-400 animate-spin mx-auto mb-4" />
          <h2 className="text-2xl font-black text-foreground mb-2">Loading Questions...</h2>
          <p className="text-muted-foreground">Preparing your domain-specific interview</p>
        </motion.div>
      </div>
    );
  }

  if (error || !domainSlug) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6 dark:bg-none dark:bg-background">
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

  if (!interviewStarted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 flex items-center justify-center p-6 dark:bg-none dark:bg-background">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl w-full bg-background rounded-2xl border-2 border-border shadow-2xl p-8"
        >
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Radio className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-3xl font-black text-foreground mb-2">
              AI Voice Mock Interview
            </h1>
            <p className="text-muted-foreground">
              Real-time conversation with AI interviewer • {questions.length} domain-specific questions
            </p>
          </div>

          <div className="space-y-4 mb-8">
            <div className="flex items-start gap-3 p-4 rounded-xl bg-purple-50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-500/20">
              <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-foreground mb-1">How It Works</h3>
                <ul className="text-sm text-foreground space-y-1">
                  <li>• AI will speak each question out loud</li>
                  <li>• Answer verbally - your speech is automatically transcribed</li>
                  <li>• Each question has a time limit</li>
                  <li>• Your answers are evaluated based on content, clarity, and structure</li>
                </ul>
              </div>
            </div>

            <div className="flex items-start gap-3 p-4 rounded-xl bg-blue-50 dark:bg-blue-500/10 border border-blue-200 dark:border-blue-500/20">
              <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-foreground mb-1">Requirements</h3>
                <ul className="text-sm text-foreground space-y-1">
                  <li>• Microphone access required</li>
                  <li>• Find a quiet environment</li>
                  <li>• Use headphones to avoid echo</li>
                  <li>• Works best in Chrome or Edge browsers</li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-surface border border-border text-center">
                <p className="text-2xl font-black text-foreground mb-1">{questions.length}</p>
                <p className="text-xs font-bold text-muted-foreground">Questions</p>
              </div>
              <div className="p-4 rounded-xl bg-surface border border-border text-center">
                <p className="text-2xl font-black text-foreground mb-1">
                  ~{Math.floor(questions.reduce((acc, q) => acc + q.timeLimit, 0) / 60)} min
                </p>
                <p className="text-xs font-bold text-muted-foreground">Total Duration</p>
              </div>
            </div>
          </div>

          <Button
            onClick={handleStartInterview}
            className="w-full py-6 text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 shadow-lg"
          >
            <Radio className="h-5 w-5 mr-2" />
            Start Voice Interview
          </Button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/20 dark:bg-none dark:bg-background">
      {/* Header */}
      <div className="sticky top-0 z-50 bg-background/95 backdrop-blur-xl border-b border-border shadow-sm">
        <div className="w-full min-w-0 px-6 py-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
                  <span className="text-white text-sm font-black">{currentQuestionIndex + 1}</span>
                </div>
                <div>
                  <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">
                    Question {currentQuestionIndex + 1} of {questions.length}
                  </p>
                  <p className="text-sm font-black text-foreground">AI Voice Interview</p>
                </div>
              </div>
            </div>

            {isRecording && (
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-lg font-mono text-lg font-bold",
                timeRemaining < 30 ? "bg-red-100 dark:bg-red-950/20 text-red-700 dark:text-red-400 animate-pulse" :
                timeRemaining < 60 ? "bg-orange-100 dark:bg-orange-950/20 text-orange-700" :
                "bg-blue-100 dark:bg-blue-950/20 text-blue-700 dark:text-blue-400"
              )}>
                <Clock className="h-5 w-5" />
                {formatTime(timeRemaining)}
              </div>
            )}
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3 }}
              className="h-full bg-gradient-to-r from-purple-500 to-pink-600"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="w-full min-w-0 px-6 py-8">
        {/* AI Question Display */}
        <motion.div
          key={currentQuestionIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-background rounded-2xl border-2 border-border shadow-lg p-8 mb-6"
        >
          <div className="flex items-start gap-4 mb-6">
            <div className={cn(
              "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-all",
              isAIPlaying
                ? "bg-gradient-to-br from-purple-500 to-pink-600 scale-110 animate-pulse"
                : "bg-gradient-to-br from-purple-500 to-pink-600"
            )}>
              <Bot className="h-7 w-7 text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <p className="text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                  AI Interviewer
                </p>
                {isAIPlaying && (
                  <motion.div
                    animate={{ opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    className="flex items-center gap-1"
                  >
                    <div className="w-1 h-1 bg-purple-600 dark:bg-purple-800 rounded-full" />
                    <div className="w-1 h-1 bg-purple-600 dark:bg-purple-800 rounded-full" />
                    <div className="w-1 h-1 bg-purple-600 dark:bg-purple-800 rounded-full" />
                  </motion.div>
                )}
              </div>
              <h2 className="text-2xl font-black text-foreground mb-4 leading-tight">
                {currentQuestion.question}
              </h2>
              <div className="flex items-center gap-4">
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
                    className="font-semibold text-red-600 dark:text-red-400"
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
                <p className="mt-3 text-xs font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded-lg px-3 py-2">
                  {speechError}
                </p>
              )}
            </div>
          </div>

          <div className="p-4 rounded-xl bg-surface border border-border flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              <span className="font-bold">Time Limit:</span> {Math.floor(currentQuestion.timeLimit / 60)} min {currentQuestion.timeLimit % 60} sec
            </div>
            <div className="text-xs font-bold text-muted-foreground uppercase tracking-wider px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-800">
              {currentQuestion.difficulty}
            </div>
          </div>
        </motion.div>

        {/* Recording Interface */}
        <div className="bg-background rounded-2xl border-2 border-border shadow-lg p-8 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center transition-all",
                isRecording
                  ? "bg-gradient-to-br from-red-500 to-rose-600 animate-pulse"
                  : "bg-gradient-to-br from-blue-500 to-cyan-600"
              )}>
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Your Answer</p>
                <p className="text-lg font-black text-foreground">
                  {isRecording ? 'Recording...' : 'Ready to Record'}
                </p>
              </div>
            </div>

            {isRecording && (
              <div className="text-right">
                <p className="text-2xl font-black text-foreground">{formatTime(recordingTime)}</p>
                <p className="text-xs font-bold text-muted-foreground">Recording Time</p>
              </div>
            )}
          </div>

          {/* Audio Level Visualizer */}
          {isRecording && (
            <div className="mb-6">
              <div className="flex items-center justify-center gap-1 h-24">
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
                    className="w-1 bg-gradient-to-t from-purple-500 to-pink-600 rounded-full"
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
                className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 shadow-lg"
              >
                <Mic className="h-5 w-5 mr-2" />
                Start Recording
              </Button>
            ) : (
              <Button
                onClick={handleStopRecording}
                className="flex-1 py-6 text-lg font-bold bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 shadow-lg"
              >
                <Square className="h-5 w-5 mr-2" />
                Stop Recording
              </Button>
            )}
            <Button
              onClick={handleSkipQuestion}
              disabled={isAIPlaying}
              variant="outline"
              className="font-semibold px-6 py-6"
            >
              <SkipForward className="h-5 w-5" />
            </Button>
          </div>

          {/* Transcription Display */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <h3 className="text-sm font-black text-foreground">Live Transcription</h3>
              </div>
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:text-blue-400"
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
                  <div className="p-4 rounded-xl bg-surface border border-border min-h-[120px] max-h-[300px] overflow-y-auto">
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
                className="w-full py-4 font-bold bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
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

        {/* Questions Progress */}
        <div className="bg-background rounded-2xl border-2 border-border shadow-lg p-6">
          <h3 className="text-lg font-black text-foreground mb-4">Interview Progress</h3>
          <div className="grid grid-cols-5 gap-3">
            {questions.map((q, idx) => (
              <div
                key={q.id}
                className={cn(
                  "p-3 rounded-xl border-2 text-center transition-all",
                  idx === currentQuestionIndex
                    ? "bg-purple-50 border-purple-500"
                    : answers[idx]
                    ? "bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30"
                    : "bg-surface border-border"
                )}
              >
                <div className={cn(
                  "w-8 h-8 rounded-lg flex items-center justify-center mx-auto mb-2",
                  idx === currentQuestionIndex
                    ? "bg-gradient-to-br from-purple-500 to-pink-600 text-white"
                    : answers[idx]
                    ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white"
                    : "bg-slate-200 dark:bg-slate-800 text-muted-foreground"
                )}>
                  {answers[idx] ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-sm font-black">{idx + 1}</span>
                  )}
                </div>
                <p className="text-xs font-bold text-muted-foreground capitalize truncate">{q.difficulty}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
export default function AudioMockInterviewPage() {
  return <AudioMockInterviewContent />;
}
