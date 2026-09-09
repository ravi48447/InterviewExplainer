'use client';

/**
 * Premium Mock Interview — the flagship product.
 *
 * - Duration presets: 15min quick / 30min standard / 60min full
 * - Modes: technical (adaptive Director), behavioral (STAR tracking),
 *          coding (live code editor with deterministic verification)
 * - Live transcript as you speak, gentle verdict cards, voice review of
 *   your answer vs the expert's, and study links into our Q&A library.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, Volume2, Square, Clock, AlertCircle, Send, Radio, Bot,
  SkipForward, Loader2, Brain, ShieldCheck, RotateCcw, CheckCircle2,
  BookOpen, Sparkles, Star, Code2, MessageSquare, Play, Pause, Zap,
  TrendingUp, Target, ArrowRight, VolumeX, Swords,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { recordEvidence } from '@/lib/engine/mastery.mjs';
import { saveSessionRecord } from '@/lib/engine/persist.mjs';
import { useEngineSync } from '@/lib/engine/useEngineSync';
import { speakNeural, resetVoiceProbe, isNeuralActive } from '@/lib/engine/neuralVoice';
import { PERSONA_LIST, getPersona } from '@/lib/engine/personas.mjs';
import { calibrationAnalysis } from '@/lib/engine/psychology.mjs';

interface PublicQuestion {
  id: string;
  question: string;
  title?: string;
  difficulty?: string;
  learnUrl?: string | null;
  isProbe?: boolean;
  isStretch?: boolean;
  isPoke?: boolean;
  isTradeoff?: boolean;
  isCircleBack?: boolean;
  isBehavioral?: boolean;
  isCoding?: boolean;
  starterCode?: string | null;
  codingLang?: string | null;
}

const FALLBACK_PERSONA = { name: 'Interviewer', title: 'Senior Engineer' };

const TIER_INFO: Record<number, { label: string; sub: string }> = {
  1: { label: 'Warm-up', sub: 'no clock, friendly' },
  2: { label: 'Standard', sub: 'clock + challenger' },
  3: { label: 'Pressure', sub: 'tight clock, fast pace' },
  4: { label: 'Adversarial', sub: 'skeptic drills deep' },
  5: { label: 'Panel', sub: 'the full loop feeling' },
};

function getTierDefault(t: number) {
  return t === 1 ? 'mentor' : t === 2 ? 'skeptic' : 'rapid';
}

const PRESETS = [
  { key: 'quick', mins: 15, qs: 5, label: '15 min', sub: 'Quick warm-up · 5 questions', icon: Zap },
  { key: 'standard', mins: 30, qs: 10, label: '30 min', sub: 'Standard mock · 10 questions', icon: Target },
  { key: 'deep', mins: 60, qs: 20, label: '60 min', sub: 'Full interview · 20 questions', icon: Brain },
];

const MODES = [
  { key: 'technical', label: 'Technical', icon: Code2, desc: 'Adaptive Q&A with follow-up probes' },
  { key: 'behavioral', label: 'Behavioral', icon: MessageSquare, desc: 'STAR-tracked storytelling' },
  { key: 'coding', label: 'Coding round', icon: Play, desc: 'Live code with expert verification' },
];

const TONE = {
  emerald: 'border-[#3d4a34] bg-[#161a13] text-[#a3c291]',
  blue: 'border-[#33404d] bg-[#131820] text-[#9ab8d4]',
  amber: 'border-[#4d3a28] bg-[#1a1510] text-[#d4a778]',
  rose: 'border-[#4a2d2d] bg-[#1a1112] text-[#d49b9b]',
};

export default function PremiumMockPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { authed, pushLocal } = useEngineSync();
  const domainSlug = searchParams?.get('domain');
  const presetParam = searchParams?.get('preset');
  const modeParam = searchParams?.get('mode');

  // setup
  const [preset, setPreset] = useState(presetParam && ['quick', 'standard', 'deep'].includes(presetParam) ? presetParam : 'standard');
  const [mode, setMode] = useState(modeParam && ['technical', 'behavioral', 'coding'].includes(modeParam) ? modeParam : 'technical');
  const [domain, setDomain] = useState(domainSlug || 'ruby-backend-fresher');
  const [tier, setTier] = useState(Number(searchParams?.get('tier')) || 2);
  const [personaChoice, setPersonaChoice] = useState<string | null>(null);
  const [prediction, setPrediction] = useState<number | null>(null);
  const [predictions, setPredictions] = useState<any[]>([]);
  const [showRitual, setShowRitual] = useState(true);
  const [gateInfo, setGateInfo] = useState<any>(null);
  const [codeDiscussion, setCodeDiscussion] = useState<{ points: any[]; idx: number; explainAnswer: string } | null>(null);
  const [dryRun, setDryRun] = useState<{ challenge: any; answer: string; feedback: any } | null>(null);
  const [upsell, setUpsell] = useState<any>(null);
  const [hardMode, setHardMode] = useState(false);
  const [rubricPreviewData, setRubricPreviewData] = useState<any>(null);
  const [freshnessLabel, setFreshnessLabel] = useState<string | null>(null);
  const [neuralOn, setNeuralOn] = useState(false);
  const [personaMeta, setPersonaMeta] = useState<any>(null);

  // session
  const [phase, setPhase] = useState<'setup' | 'ritual' | 'starting' | 'asking' | 'listening' | 'thinking' | 'coding' | 'review' | 'done' | 'gated'>('setup');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSeed, setSessionSeed] = useState<number | null>(null);
  const [current, setCurrent] = useState<PublicQuestion | null>(null);
  const [interviewerLine, setInterviewerLine] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [askedCount, setAskedCount] = useState(0);
  const totalPlanned = PRESETS.find((p) => p.key === preset)?.qs ?? 10;

  // answer state
  const [transcript, setTranscript] = useState('');
  const [code, setCode] = useState('');
  const [lastAve, setLastAve] = useState<any>(null);
  const [lastLearnUrl, setLastLearnUrl] = useState<string | null>(null);
  const [voiceReview, setVoiceReview] = useState(false);
  const [paused, setPaused] = useState(false);

  // refs for deterministic reconstruction
  const askedIdsRef = useRef<Set<string>>(new Set());
  const usedProbeIdsRef = useRef<Set<string>>(new Set());
  const dodgedRef = useRef<any[]>([]);
  const recentSignalsRef = useRef<string[]>([]);
  const moveLogRef = useRef<any[]>([]);
  const turnsRef = useRef<any[]>([]);
  const domainRef = useRef(domain);
  useEffect(() => { domainRef.current = domain; }, [domain]);

  // speech refs
  const recognitionRef = useRef<any>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const timerRef = useRef<number | null>(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);

  const nudgedRef = useRef(false);

  const speak = useCallback(async (text: string) => {
    // neural voice (Piper): natural sentence pacing; browser TTS as automatic fallback
    setIsSpeaking(true);
    try {
      const personaId = (personaMeta?.id as string) ?? personaChoice ?? 'mentor';
      await speakNeural(text, {
        persona: personaId,
        rate: personaMeta?.voice?.rate,
        pitch: personaMeta?.voice?.pitch,
        onEnd: () => setIsSpeaking(false),
      });
      setNeuralOn(isNeuralActive());
      return;
    } catch {}
    // browser fallback
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        const v = personaMeta?.voice ?? { rate: 0.98, pitch: 1.0 };
        u.rate = v.rate; u.pitch = v.pitch;
        u.onend = () => setIsSpeaking(false);
        u.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(u);
      }
    } catch {}
  }, []);

  // ---------- engine calls ----------
  const startRitual = useCallback(() => {
    // box-breathing + reappraisal overlay before the session
    setPhase('ritual' as any);
  }, []);

  const startSession = useCallback(async () => {
    resetVoiceProbe();
    setFreshnessLabel(null);
    setPhase('starting');
    setError(null);
    try {
      const res = await fetch('/api/engine/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          preset,
          mode,
          tier: hardMode ? 5 : tier,
          persona: hardMode ? 'skeptic' : personaChoice ?? undefined,
          questionCount: PRESETS.find((p) => p.key === preset)?.qs,
        }),
      });
      const data = await res.json();
      if (res.status === 403) { setUpsell({ ...data, plans: undefined }); setError(data.error === 'tier_locked' ? 'This pressure tier is part of Interview Pass.' : 'This interviewer persona is part of Interview Pass.'); setPhase('setup'); return; }
      if (!res.ok || !data.first?.question) throw new Error(data.error || 'start failed');
      if (data.persona) setPersonaMeta(data.persona);
      if (data.rubric) setRubricPreviewData(data.rubric);
      // freshness: session DNA vs everything you've faced before
      try {
        const { getSessionRecords } = await import('@/lib/engine/persist.mjs');
        const seen = new Set();
        for (const rec of getSessionRecords()) for (const w of rec.weakConcepts ?? []) seen.add(w);
        const { sessionFreshness } = await import('@/lib/engine/sessionConfig.mjs');
        const dna = sessionFreshness([{ id: data.first.question.id, concepts: [] }], [...seen]);
        setFreshnessLabel(dna.label);
      } catch {}
      setSessionId(data.sessionId);
      setSessionSeed(data.sessionSeed);
      setTimeLeft((PRESETS.find((p) => p.key === preset)?.mins ?? 30) * 60);
      setCurrent(data.first.question);
      setInterviewerLine(data.first.rendered);
      setAskedCount(1);
      askedIdsRef.current = new Set([data.first.question.id]);
      // human opening: persona greets, then the warm-up question
      speak(data.opener ? data.opener + ' ' + data.first.rendered : data.first.rendered);
      setPhase(data.first.question.isCoding ? 'coding' : 'asking');
    } catch (e: any) {
      setError(e?.message || 'Could not start.');
      setPhase('setup');
    }
  }, [domain, preset, mode, speak]);

  const clientState = () => ({
    sessionSeed,
    domain: domainRef.current,
    questionCount: totalPlanned,
    askedIds: [...askedIdsRef.current],
    usedProbeIds: [...usedProbeIdsRef.current],
    dodged: dodgedRef.current,
    recentSignals: recentSignalsRef.current.slice(-6),
    moveLog: moveLogRef.current,
  });

  const advance = useCallback(async (answerText: string, meta?: any) => {
    if (!current || !sessionId) return;
    setPhase('thinking');
    stopRecording();
    try {
      const res = await fetch('/api/engine/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: current.id,
          transcript: answerText,
          isBehavioral: mode === 'behavioral',
          meta,
          clientState: clientState(),
        }),
      });
      const data = await res.json();
      if (data.gated) {
        // clean upsell boundary — never mid-question
        setGateInfo(data);
        setUpsell(data.upsell);
        setPhase('review');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'turn failed');
      // calibration: record prediction vs actual
      if (prediction != null) {
        const entry = { predicted: prediction, actual: data.ave?.score ?? 0, ts: Date.now() };
        setPredictions((p) => [...p, entry]);
        try { localStorage.setItem('ie_predictions_v1', JSON.stringify([...(JSON.parse(localStorage.getItem('ie_predictions_v1') ?? '[]')), entry].slice(-100))); } catch {}
      }
      setPrediction(null);
      // coding discussion round if the last submission was code
      if (data.codeDiscussion?.points?.length) {
        setCodeDiscussion({ points: data.codeDiscussion.points, idx: 0, explainAnswer: '' });
      } else {
        setCodeDiscussion(null);
      }
      // hard mode: strict bands replace gentle framing
      if (hardMode && data.ave?.score != null) {
        const { hardBand } = await import('@/lib/engine/sessionConfig.mjs');
        setLastAve({ ...data.ave, band: hardBand(data.ave.score) });
      } else {
        setLastAve(data.ave);
      }
      setLastLearnUrl(data.learnUrl);
      recentSignalsRef.current.push(data.ave.signal);
      turnsRef.current.push({ questionId: current.id, transcript: answerText, move: data.next?.move ?? 'answer', score: data.ave.score });
      moveLogRef.current.push({ turn: turnsRef.current.length, move: data.next?.move, questionId: data.next?.question?.id ?? null, reason: data.next?.move });

      // speak the verdict softly (voice review)
      if (data.ave?.band?.line) {
        try {
          const u = new SpeechSynthesisUtterance(data.ave.band.line);
          u.rate = 1.0; u.volume = 0.85;
          window.speechSynthesis.speak(u);
        } catch {}
      }

      if (data.next?.move === 'wrap' || !data.next?.question) {
        finishSession(data.ave);
        return;
      }
      setCurrent(data.next.question);
      // the interviewer's human reaction first ("Hm. Okay, that holds."), then the next question
      setInterviewerLine(
        data.next?.reaction
          ? data.next.reaction + ' ' + data.next.rendered
          : data.next.rendered
      );
      setAskedCount((n) => n + 1);
      askedIdsRef.current.add(data.next.question.id);
      setTranscript('');
      setRecordingTime(0);
      speak(data.next.rendered);
      setPhase(data.next.question.isCoding ? 'coding' : 'asking');
    } catch (e: any) {
      setError(e?.message || 'Turn failed.');
      setPhase('asking');
    }
  }, [current, sessionId, mode, sessionSeed]);

  const submitCode = useCallback(async () => {
    if (!current || !sessionId || !code.trim()) return;
    setPhase('thinking');
    try {
      const cres = await fetch('/api/engine/code-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ questionId: current.id, code }),
      });
      const cdata = await cres.json();
      setLastAve({
        score: cdata.score,
        band: cdata.band,
        coverage: { hit: [], missed: [], ratio: 0 },
        checks: cdata.checks,
        suggestedCode: cdata.suggestedCode,
        isCoding: true,
      });
      setLastLearnUrl(cdata.learnUrl);
      turnsRef.current.push({ questionId: current.id, transcript: '[code] ' + code.slice(0, 400), move: 'coding', score: cdata.score });
      // coding contributes as studied evidence for its concepts
      try {
        const { recordEvidence } = await import('@/lib/engine/mastery.mjs');
        const rubricQ = current.id;
        recordEvidence([rubricQ], 'studied');
      } catch {}
      // dry-run debate: the interviewer makes you trace YOUR algorithm
      try {
        const dres = await fetch('/api/engine/company-loop', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ dryRun: { code, questionId: current.id } }),
        });
        const ddata = await dres.json();
        if (ddata.challenges?.length) {
          setDryRun({ challenge: ddata.challenges[0], answer: '', feedback: null });
        }
      } catch {}
      // next turn via the standard path (voice answer about the code)
      await advance('I implemented the solution as shown in my code. It uses the right approach with the key constructs.', { typed: true });
    } catch (e: any) {
      setError(e?.message || 'Code check failed.');
      setPhase('coding');
    }
  }, [current, sessionId, code]);

  const finishSession = useCallback(async (finalAve?: any) => {
    setPhase('done');
    try {
      const res = await fetch('/api/engine/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, clientState: { moveLog: moveLogRef.current }, turns: turnsRef.current }),
      });
      const report = res.ok ? await res.json() : null;
      if (report) {
        sessionStorage.setItem(`ie_mock_report_${sessionId}`, JSON.stringify(report));
        // persistent record (survives tab close) + spoken evidence
        saveSessionRecord({
          sessionId,
          domain: domainRef.current,
          mode,
          preset,
          presetMinutes: PRESETS.find((p) => p.key === preset)?.mins,
          overallScore: report.overallScore,
          turnsCount: report.turnsCount,
          weakConcepts: report.weakConcepts?.slice(0, 8) ?? [],
        });
        if (authed) pushLocal(); // persist to the account (server store)
        try {
          for (const q of report.perQuestion ?? []) {
            if (q.coverage?.hit?.length) {
              recordEvidence(
                q.coverage.hit.map((h: string) => h.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')),
                'spoken'
              );
            }
          }
        } catch {}
        router.push(`/mock-interviews/results?session=${sessionId}`);
      }
    } catch {}
  }, [sessionId, mode, preset, router]);

  // ---------- speech machinery ----------
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      streamRef.current = stream;
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      audioCtxRef.current = ctx;
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      analyserRef.current = analyser;

      const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SR) {
        const rec = new SR();
        rec.continuous = true;
        rec.interimResults = true;
        rec.lang = 'en-IN';
        rec.onresult = (ev: any) => {
          let text = '';
          for (let i = ev.resultIndex; i < ev.results.length; i++) text += ev.results[i][0].transcript + ' ';
          setTranscript(text.trim());
        };
        rec.onend = () => { if (isRecording && !paused) rec.start(); };
        rec.start();
        recognitionRef.current = rec;
      }
      setIsRecording(true);
      setPhase('listening');
      setRecordingTime(0);
      timerRef.current = window.setInterval(() => setRecordingTime((t) => t + 1), 1000);
      const buf = new Uint8Array(analyser.frequencyBinCount);
      const tick = () => {
        analyser.getByteFrequencyData(buf);
        const avg = buf.reduce((a, b) => a + b, 0) / buf.length;
        setAudioLevel(Math.min(1, avg / 90));
        rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    } catch {
      setError('Mic unavailable — type your answer below.');
    }
  }, [isRecording, paused]);

  const stopRecording = useCallback(() => {
    try { recognitionRef.current?.stop(); } catch {}
    try { streamRef.current?.getTracks().forEach((t) => t.stop()); } catch {}
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (timerRef.current) window.clearInterval(timerRef.current);
    setIsRecording(false);
    setAudioLevel(0);
  }, []);

  // countdown: session ends when the clock runs out (interviews are time-boxed)
  useEffect(() => {
    if (phase === 'setup' || phase === 'done' || timeLeft <= 0) return;
    const t = window.setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (timeLeft === 60 && !nudgedRef.current && phase !== 'setup' && phase !== 'done') {
      nudgedRef.current = true;
      speak('One minute left — start wrapping up your answer.');
    }
    if (timeLeft === 0 && sessionId && phase !== 'setup' && phase !== 'done' && phase !== 'thinking') {
      // time's up — the interviewer wraps like a real one
      try { window.speechSynthesis.cancel(); } catch {}
      speak("That's all the time we have today. Let's look at your report.");
      finishSession();
    }
  }, [timeLeft]);

  useEffect(() => () => {
    stopRecording();
    try { window.speechSynthesis?.cancel(); } catch {}
  }, [stopRecording]);

  const toggleVoiceReview = () => {
    if (voiceReview) {
      try { window.speechSynthesis.cancel(); } catch {}
      setVoiceReview(false);
    } else {
      // voice review of your answer vs the expert's
      const parts: string[] = [];
      if (lastAve?.band?.line) parts.push(lastAve.band.line);
      if (lastAve?.coverage?.missed?.length) parts.push(`You missed: ${lastAve.coverage.missed.slice(0, 3).join(', ')}.`);
      if (lastAve?.isCoding && lastAve?.suggestedCode) parts.push(`The expert solution is on screen.`);
      if (lastAve?.suggested?.spoken) parts.push(`Here's how our expert answers it: ${lastAve.suggested.spoken.slice(0, 400)}`);
      speak(parts.join(' ') || 'Good work.');
      setVoiceReview(true);
    }
  };

  const readAloud = (t: string) => speak(t);

  // ---------- render helpers ----------
  const moveChip = (q: PublicQuestion) => {
    if (q.isProbe) return { text: 'probing your answer', cls: 'bg-[#e8a33d]/10 text-[#e8a33d]' };
    if (q.isStretch) return { text: 'raising the bar', cls: 'bg-[#e8a33d]/10 text-[#e8a33d]' };
    if (q.isPoke) return { text: 'challenging a mistake', cls: 'bg-[#c08a5a]/15 text-[#d4a778]' };
    if (q.isCircleBack) return { text: 'circling back', cls: 'bg-[#7a93ad]/15 text-[#9ab8d4]' };
    if (q.isTradeoff) return { text: 'trade-off', cls: 'bg-[#a98ba3]/15 text-[#c3aabf]' };
    if (q.isBehavioral) return { text: 'behavioral · STAR', cls: 'bg-[#c08a5a]/15 text-[#d4a778]' };
    if (q.isCoding) return { text: 'coding round', cls: 'bg-[#7d9a6b]/15 text-[#a3c291]' };
    return null;
  };

  // ---------- render ----------
  return (
    <div className="min-h-screen bg-[#121110] text-[#f5f1e8]">
      <header className="border-b border-[#26241f] bg-[#121110]/95 sticky top-0 z-10">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
            <Bot className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-semibold">{personaMeta?.name ?? FALLBACK_PERSONA.name}</div>
            <div className="text-xs text-stone-400">{personaMeta?.title ?? 'Senior Engineer'} · tier {tier} · adaptive</div>
          </div>
          <div className="flex items-center gap-2 text-xs text-stone-400">
            {phase !== 'setup' && <span className="hidden sm:flex items-center gap-1.5"><Brain className="h-3.5 w-3.5" /> {askedCount}/{totalPlanned}</span>}
            {phase !== 'setup' && timeLeft > 0 && (
              <span className={cn('flex items-center gap-1.5 px-2 py-1 rounded-lg font-mono',
                timeLeft <= 60 ? 'bg-[#c08a5a]/15 text-[#d4a778]' : timeLeft <= 300 ? 'bg-[#c08a5a]/15 text-[#d4a778]' : 'bg-[#141311] text-stone-300')}>
                <Clock className="h-3 w-3" /> {fmt(timeLeft)}
              </span>
            )}
            {phase !== 'setup' && (
              <span className="hidden md:flex items-center gap-1.5 px-2 py-1 rounded-lg bg-[#141311] text-stone-400 capitalize">
                {domain.replace(/-/g, ' ')}
              </span>
            )}
          </div>
          {(phase === 'asking' || phase === 'listening' || phase === 'coding') && (
            <div className="flex items-center gap-1.5 text-xs text-emerald-400">
              <span className="h-2 w-2 rounded-full bg-[#7d9a6b] animate-pulse" /> live
            </div>
          )}
          {neuralOn && (
            <span className="hidden sm:flex items-center gap-1 text-[10px] text-[#a3c291]" title="Neural voice — natural pacing, not robotic TTS">
              <Volume2 className="h-3 w-3" /> natural voice
            </span>
          )}
          {freshnessLabel && (
            <span className="hidden md:block text-[10px] text-stone-600 max-w-40 truncate" title={freshnessLabel}>
              {freshnessLabel.split('—')[0].trim()}
            </span>
          )}
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 py-8 space-y-5">
        {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200 flex items-start gap-2">
            <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {/* ============ PRE-SESSION RITUAL ============ */}
        {phase === 'ritual' && (
          <RitualOverlay
            onDone={() => { setShowRitual(false); startSession(); }}
            onSkip={() => { setShowRitual(false); startSession(); }}
          />
        )}

        {/* ============ GATE / UPSELL ============ */}
        {phase === 'review' && gateInfo?.gated && (
          <UpsellCard upsell={upsell} onLater={() => { setPhase('done'); router.push('/mock-interviews'); }} />
        )}

        {/* ============ SETUP ============ */}
        {phase === 'setup' && (
          <div className="space-y-8">
            <div className="text-center space-y-3 pt-6">
              <h1 className="text-3xl font-black tracking-tight">Mock Interview</h1>
              <p className="text-stone-400 max-w-md mx-auto text-sm">
                An interviewer that adapts every turn. Pick a duration, pick a focus — the session
                never repeats, and every answer links back to your Q&A library.
              </p>
            </div>

            {/* duration presets */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-300">How long do you have?</h2>
              <div className="grid grid-cols-3 gap-3">
                {PRESETS.map((p) => (
                  <button
                    key={p.key}
                    onClick={() => setPreset(p.key)}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition',
                      preset === p.key
                        ? 'border-[#e8a33d]/50 bg-[#e8a33d]/10'
                        : 'border-[#26241f] bg-[#141311] hover:bg-[#1a1917]'
                    )}
                  >
                    <p.icon className={cn('h-5 w-5 mb-2', preset === p.key ? 'text-blue-400' : 'text-stone-400')} />
                    <div className="font-bold">{p.label}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{p.sub}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* mode */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-300">What kind of round?</h2>
              <div className="grid grid-cols-3 gap-3">
                {MODES.map((m) => (
                  <button
                    key={m.key}
                    onClick={() => setMode(m.key)}
                    className={cn(
                      'rounded-2xl border p-4 text-left transition',
                      mode === m.key
                        ? 'border-emerald-500/60 bg-emerald-500/10 ring-1 ring-emerald-500/40'
                        : 'border-[#26241f] bg-[#141311] hover:bg-[#1a1917]'
                    )}
                  >
                    <m.icon className={cn('h-5 w-5 mb-2', mode === m.key ? 'text-emerald-400' : 'text-stone-400')} />
                    <div className="font-bold text-sm">{m.label}</div>
                    <div className="text-[11px] text-stone-400 mt-0.5">{m.desc}</div>
                  </button>
                ))}
              </div>
            </section>

            {/* domain */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-300">Domain</h2>
              <select
                value={domain}
                onChange={(e) => setDomain(e.target.value)}
                className="w-full rounded-xl bg-[#100f0d] border border-[#26241f] px-3 py-2.5 text-sm"
              >
                {['ruby-backend-fresher', 'ruby-backend-intermediate', 'go-fresher', 'go-intermediate', 'java-backend-fresher', 'java-backend-intermediate', 'java-fullstack-fresher', 'python-backend-fresher', 'frontend-fresher'].map((d) => (
                  <option key={d} value={d}>{d.replace(/-/g, ' ')}</option>
                ))}
              </select>
              {mode === 'coding' && (
                <p className="text-[11px] text-stone-600">
                  Coding rounds use topics with expert code examples — 347 topics qualify today.
                </p>
              )}
            </section>

            {/* hard mode — "grade me harder" (top user request) */}
            <button
              onClick={() => setHardMode((h) => !h)}
              className={cn(
                'w-full flex items-center gap-3 rounded-xl border px-4 py-3 transition text-left',
                hardMode ? 'border-[#4a2d2d] bg-[#1a1112]' : 'border-[#26241f] bg-[#141311] hover:border-[#3a362e]'
              )}
            >
              <Swords className={cn('h-4 w-4 shrink-0', hardMode ? 'text-[#d49b9b]' : 'text-stone-600')} />
              <div className="flex-1">
                <div className="text-sm font-medium">Grade me harder</div>
                <div className="text-[11px] text-stone-600">
                  {hardMode ? 'Tier-5 pressure, skeptic persona, strict scoring — no gentle framing.' : 'Strict mode off. Verdicts use gentle bands.'}
                </div>
              </div>
              <span className={cn('h-5 w-9 rounded-full border relative transition-colors',
                hardMode ? 'bg-[#d49b9b]/30 border-[#d49b9b]/50' : 'bg-[#26241f] border-[#3a362e]')}>
                <span className={cn('absolute top-0.5 h-3.5 w-3.5 rounded-full transition-all',
                  hardMode ? 'left-[1.15rem] bg-[#d49b9b]' : 'left-0.5 bg-stone-600')} />
              </span>
            </button>

            {/* pressure tier */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-300">Pressure level</h2>
              <div className="grid grid-cols-5 gap-2">
                {[1, 2, 3, 4, 5].map((t) => {
                  const info = TIER_INFO[t];
                  const locked = t > 2;
                  return (
                    <button
                      key={t}
                      onClick={() => { if (!locked) setTier(t); else { setUpsell({ message: 'Tiers 3-5 (time pressure, adversarial, panel gauntlet) are part of Interview Pass.' }); } }}
                      className={cn(
                        'rounded-xl border p-2.5 text-left transition relative',
                        tier === t ? 'border-rose-500/60 bg-rose-500/10 ring-1 ring-rose-500/40' : 'border-[#26241f] bg-[#141311] hover:bg-[#1a1917]'
                      )}
                    >
                      {locked && <span className="absolute top-1.5 right-1.5 text-[9px] px-1 rounded bg-[#c08a5a]/20 text-[#d4a778]">PRO</span>}
                      <div className="text-xs font-bold">{info.label}</div>
                      <div className="text-[9px] text-stone-400 mt-0.5 leading-tight">{info.sub}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            {/* persona */}
            <section className="space-y-3">
              <h2 className="text-sm font-semibold text-stone-300">Interviewer persona</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {PERSONA_LIST.map((p) => {
                  const locked = !['mentor', 'skeptic'].includes(p.id);
                  return (
                    <button
                      key={p.id}
                      onClick={() => { if (!locked) setPersonaChoice(p.id); else setUpsell({ message: 'All seven personas are part of Interview Pass.' }); }}
                      className={cn(
                        'rounded-xl border p-2.5 text-left transition relative',
                        (personaChoice ?? getTierDefault(tier)) === p.id ? 'border-[#e8a33d]/50 bg-[#e8a33d]/10' : 'border-[#26241f] bg-[#141311] hover:bg-[#1a1917]'
                      )}
                    >
                      {locked && <span className="absolute top-1.5 right-1.5 text-[9px] px-1 rounded bg-[#c08a5a]/20 text-[#d4a778]">PRO</span>}
                      <div className="text-xs font-bold">{p.name}</div>
                      <div className="text-[9px] text-stone-400 mt-0.5 leading-tight">{p.title.split(' · ')[0]}</div>
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="pt-2">
              <Button size="lg" onClick={() => { if (showRitual) { startRitual(); } else startSession(); }} className="w-full gap-2">
                <Mic className="h-4 w-4" /> Start {PRESETS.find((p) => p.key === preset)?.label} session
              </Button>
              <p className="text-[11px] text-stone-600 flex items-center justify-center gap-1 mt-2">
                <ShieldCheck className="h-3 w-3" /> Deterministic engine — scored against our expert answers, never an AI judge.
              </p>
            </div>
          </div>
        )}

        {/* ============ INTERVIEW ============ */}
        {phase !== 'setup' && current && (
          <>
            {/* rubric preview — what you'll be graded against (fairness, pre-session) */}
            {rubricPreviewData && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-[#33404d] bg-[#131820] p-4 space-y-3">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.15em] text-[#9ab8d4]">
                  What you'll be graded against
                  <button onClick={() => setRubricPreviewData(null)} className="ml-auto text-stone-600 hover:text-stone-300 normal-case tracking-normal">dismiss</button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {rubricPreviewData.checklist.map((c: string) => (
                    <span key={c} className="text-[11px] px-2 py-0.5 bg-[#7a93ad]/10 border border-[#33404d] text-[#9ab8d4]">{c}</span>
                  ))}
                </div>
                <div className="flex gap-4 text-[10px] text-stone-600">
                  {rubricPreviewData.weights.map((w: any) => (
                    <span key={w.part}>{w.part} <b className="text-stone-400">{w.weight}</b></span>
                  ))}
                </div>
                <p className="text-[10px] text-stone-600 italic">{rubricPreviewData.honesty}</p>
              </motion.div>
            )}

            {/* interviewer question card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={interviewerLine}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-2xl border border-[#26241f] bg-[#141311] p-5"
              >
                <div className="flex items-start gap-3">
                  <Bot className="h-5 w-5 text-blue-400 shrink-0 mt-1" />
                  <div className="space-y-2 flex-1">
                    <p className="text-lg leading-relaxed">{interviewerLine}</p>
                    {moveChip(current) && (
                      <span className={cn('inline-block px-2.5 py-0.5 rounded-full text-[10px] uppercase tracking-wide', moveChip(current)!.cls)}>
                        {moveChip(current)!.text}
                      </span>
                    )}
                  </div>
                </div>
                <div className="mt-3 flex gap-2 flex-wrap">
                  <Button variant="ghost" size="sm" onClick={() => readAloud(interviewerLine)} className="gap-1 text-stone-400">
                    <Volume2 className="h-3.5 w-3.5" /> repeat
                  </Button>
                  <a href={`/mock-interviews/peer?topic=${encodeURIComponent(current.title ?? '')}`} className="inline-flex items-center gap-1 text-[11px] text-stone-500 hover:text-[#c3aabf] px-2">
                    stuck? ask a peer
                  </a>
                  {(phase === 'asking' || phase === 'listening') && (
                    <Button variant="ghost" size="sm" onClick={startRecording} className="gap-1 text-stone-400">
                      <Mic className="h-3.5 w-3.5" /> record answer
                    </Button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* coding round editor */}
            {phase === 'coding' && (
              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.03] p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wide flex items-center gap-1.5">
                    <Code2 className="h-3.5 w-3.5" /> live coding
                  </span>
                  <span className="text-[11px] text-stone-400">{current.codingLang || 'code'}</span>
                </div>
                <textarea
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  rows={12}
                  spellCheck={false}
                  placeholder={'# write your solution here…\n# verified against the expert code for this topic'}
                  className="w-full rounded-xl bg-[#100f0d] border border-emerald-500/20 p-3 font-mono text-xs outline-none focus:border-emerald-500/50"
                />
                <div className="flex gap-2">
                  <Button onClick={submitCode} disabled={!code.trim()} className="gap-2 flex-1">
                    <CheckCircle2 className="h-4 w-4" /> Submit solution
                  </Button>
                </div>
              </div>
            )}

            {/* confidence prediction (calibration) */}
            {(phase === 'asking' || phase === 'listening') && prediction == null && (
              <div className="rounded-xl border border-[#33404d] bg-[#131820] px-4 py-2.5 flex items-center gap-3">
                <span className="text-xs text-[#9ab8d4]">How well will this answer go?</span>
                <div className="flex gap-1.5 ml-auto">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button key={n} onClick={() => setPrediction(n)}
                      className="h-7 w-7 rounded-lg bg-[#1a1917] hover:bg-[#e8a33d]/30 text-xs font-bold"
                      title={['guess', 'shaky', 'okay', 'good', 'nail it'][n - 1]}>
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* answer area (voice + typed) */}
            {(phase === 'asking' || phase === 'listening') && (
              <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-5 space-y-4">
                {isRecording ? (
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-sm text-stone-400">
                      <span className="flex items-center gap-2">
                        <span className="relative flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500" />
                        </span>
                        Listening — your words appear live
                      </span>
                      <span className="flex items-center gap-1.5"><Clock className="h-3.5 w-3.5" /> {fmt(recordingTime)}</span>
                    </div>
                    <div className="h-16 flex items-center justify-center gap-[3px]">
                      {Array.from({ length: 28 }).map((_, i) => (
                        <div
                          key={i}
                          className="w-1.5 rounded-full bg-gradient-to-t from-blue-600 to-cyan-400"
                          style={{
                            height: `${Math.max(6, audioLevel * 64 * (0.5 + Math.abs(Math.sin((Date.now() / 240 + i) * 1.1))))}px`,
                            opacity: 0.55 + audioLevel * 0.45,
                          }}
                        />
                      ))}
                    </div>
                    <div className="min-h-[70px] max-h-48 overflow-y-auto rounded-xl bg-[#100f0d] border border-[#1f1d18] p-3 text-sm text-stone-300">
                      {transcript || <span className="text-stone-600">Speak — your words appear here…</span>}
                    </div>
                    <div className="flex gap-2">
                      <Button onClick={() => advance(transcript)} className="flex-1 gap-2" disabled={!transcript.trim()}>
                        <Send className="h-4 w-4" /> Submit answer
                      </Button>
                      <Button variant="outline" onClick={() => advance('(skipped)')} className="gap-1">
                        <SkipForward className="h-3.5 w-3.5" /> Skip
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-stone-400">
                      {transcript ? 'Review or re-record, then submit.' : 'Speak your answer — or type it.'}
                    </p>
                    <textarea
                      value={transcript}
                      onChange={(e) => setTranscript(e.target.value)}
                      rows={4}
                      placeholder="Type your answer here…"
                      className="w-full rounded-xl bg-[#100f0d] border border-[#26241f] p-3 text-sm outline-none focus:border-blue-500/50"
                    />
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={startRecording} className="gap-2 flex-1">
                        <Mic className="h-4 w-4" /> Record spoken answer
                      </Button>
                      <Button onClick={() => advance(transcript, { typed: true })} className="flex-1 gap-2" disabled={!transcript.trim()}>
                        <Send className="h-4 w-4" /> Submit
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* dry-run debate: trace YOUR algorithm */}
            {dryRun && phase !== 'thinking' && (
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/[0.04] p-5 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-300">
                  <Swords className="h-4 w-4" /> Dry run — defend your solution
                  <span className="ml-auto text-[10px] text-stone-600 uppercase">{dryRun.challenge.kind}</span>
                </div>
                <p className="text-sm leading-relaxed">{dryRun.challenge.question}</p>
                {dryRun.feedback ? (
                  <div className="space-y-2">
                    <div className={cn('rounded-xl px-4 py-2.5 text-sm', dryRun.feedback.score >= 75 ? 'bg-emerald-500/10 text-emerald-200 border border-emerald-500/30' : dryRun.feedback.score >= 45 ? 'bg-amber-500/10 text-amber-200 border border-amber-500/30' : 'bg-rose-500/10 text-rose-200 border border-rose-500/30')}>
                      {dryRun.feedback.score >= 75 ? 'Solid walkthrough.' : dryRun.feedback.followUp ?? 'Keep going.'}
                    </div>
                    {dryRun.feedback.debate?.counter ? (
                      <div className="rounded-xl border border-[#33404d] bg-[#131820] px-4 py-2.5 text-sm text-[#9ab8d4]">
                        <b>Interviewer pushes:</b> {dryRun.feedback.debate.counter}
                      </div>
                    ) : null}
                    <Button size="sm" variant="outline" onClick={() => setDryRun(null)} className="gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5" /> Done — continue the round
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <textarea
                      value={dryRun.answer}
                      onChange={(e) => setDryRun((d) => (d ? { ...d, answer: e.target.value } : d))}
                      rows={4}
                      placeholder="Walk the interviewer through — concrete values, step by step…"
                      className="w-full rounded-xl bg-[#100f0d] border border-amber-500/20 p-3 text-sm outline-none focus:border-amber-500/50"
                    />
                    <Button size="sm" className="gap-1.5"
                      onClick={async () => {
                        const res = await fetch('/api/engine/company-loop', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ dryRunAnswer: dryRun.answer, challenge: dryRun.challenge }),
                        });
                        const fb = await res.json();
                        setDryRun((d) => (d ? { ...d, feedback: fb } : d));
                      }}
                      disabled={!dryRun.answer.trim()}>
                      <Send className="h-3.5 w-3.5" /> Answer the interviewer
                    </Button>
                  </div>
                )}
              </div>
            )}

            {/* verdict card — gentle, with study link + voice review */}
            {lastAve && phase !== 'thinking' && (
              <AnimatePresence>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={cn('rounded-2xl border p-4 space-y-3', TONE[(lastAve.band?.tone as keyof typeof TONE) ?? 'blue'])}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl font-black">{lastAve.band?.band ?? lastAve.score}</span>
                    <span className="text-sm opacity-90">{lastAve.band?.line}</span>
                  </div>

                  {/* STAR chips */}
                  {lastAve.star && (
                    <div className="flex gap-1.5 flex-wrap">
                      {['Situation', 'Task', 'Action', 'Result'].map((p) => (
                        <span
                          key={p}
                          className={cn(
                            'px-2 py-0.5 rounded-full text-[10px]',
                            lastAve.star.have.includes(p) ? 'bg-emerald-500/20 text-emerald-300' : 'bg-[#1a1917] text-stone-400'
                          )}
                        >
                          {p[0]} · {p}
                        </span>
                      ))}
                      {lastAve.star.missing?.length > 0 && (
                        <span className="text-[10px] text-amber-300 self-center">missing: {lastAve.star.missing.join(', ')}</span>
                      )}
                    </div>
                  )}

                  {/* coding checks */}
                  {lastAve.isCoding && lastAve.checks && (
                    <div className="space-y-1">
                      {lastAve.checks.map((c: any) => (
                        <div key={c.id} className="flex items-start gap-2 text-xs">
                          <CheckCircle2 className={cn('h-3.5 w-3.5 mt-0.5', c.ok ? 'text-emerald-400' : 'text-rose-400')} />
                          <span className="opacity-90">{c.label} <span className="opacity-60">({c.detail})</span></span>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 flex-wrap pt-1">
                    <Button size="sm" variant="outline" onClick={toggleVoiceReview} className="gap-1.5">
                      {voiceReview ? <><VolumeX className="h-3.5 w-3.5" /> stop review</> : <><Volume2 className="h-3.5 w-3.5" /> hear the review</>}
                    </Button>
                    {lastLearnUrl && (
                      <a href={lastLearnUrl} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1917] hover:bg-white/15 text-xs font-medium">
                        <BookOpen className="h-3.5 w-3.5" /> study this topic
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            )}

            {phase === 'thinking' && (
              <div className="flex items-center justify-center text-stone-400 text-sm gap-2 py-4">
                <Loader2 className="h-4 w-4 animate-spin" /> Interviewer is considering your answer…
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

/** Box-breathing + reappraisal pre-session ritual overlay. */
function RitualOverlay({ onDone, onSkip }: { onDone: () => void; onSkip: () => void }) {
  const PHASES = [
    { phase: 'Breathe in', seconds: 4, scale: 'scale-100' },
    { phase: 'Hold', seconds: 4, scale: 'scale-100' },
    { phase: 'Breathe out', seconds: 4, scale: 'scale-75' },
    { phase: 'Hold', seconds: 4, scale: 'scale-75' },
  ];
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(4);
  const [cycles, setCycles] = useState(0);

  useEffect(() => {
    if (count > 0) {
      const t = setTimeout(() => setCount((c) => c - 1), 1000);
      return () => clearTimeout(t);
    }
    if (step === PHASES.length - 1) {
      if (cycles >= 2) { onDone(); return; }
      setCycles((c) => c + 1);
      setStep(0);
    } else setStep((s) => s + 1);
    setCount(4);
  }, [count, step, cycles]);

  const p = PHASES[step];
  const LINES = [
    "You're not nervous. You're ready — and excited.",
    'That energy is fuel. Your body is preparing you to perform.',
    'You have prepared. This is a rehearsal, not a judgment.',
  ];

  return (
    <div className="fixed inset-0 z-50 bg-[#121110]/95 flex items-center justify-center p-6">
      <div className="text-center space-y-8 max-w-sm">
        <div
          className={cn('mx-auto h-40 w-40 rounded-full bg-gradient-to-br from-[#c08a5a]/30 to-[#a98ba3]/30 border border-[#c08a5a]/40 transition-transform duration-[3500ms] ease-in-out', p.scale)}
        />
        <div className="space-y-1">
          <div className="text-2xl font-bold text-blue-200">{p.phase}</div>
          <div className="text-5xl font-black tabular-nums">{count}</div>
          <div className="text-xs text-stone-600">cycle {cycles + 1} of 3</div>
        </div>
        <p className="text-sm text-stone-400 italic">{LINES[cycles % LINES.length]}</p>
        <button onClick={onSkip} className="text-xs text-stone-600 hover:text-stone-300 underline">
          skip ritual
        </button>
      </div>
    </div>
  );
}

/** Clean-boundary upsell card when the free gate hits. */
function UpsellCard({ upsell, onLater }: { upsell: any; onLater: () => void }) {
  const plans = [
    { id: 'interview_pass', name: 'Interview Pass', price: '₹499', tag: 'The full real interview, unlocked',
      features: ['Unlimited mocks — all durations', 'All 7 personas · 5 pressure tiers', 'Panel gauntlet', 'Coding rounds + code discussion', 'Full reports + redemption loop'] },
    { id: 'interview_pro', name: 'Interview Pro', price: '₹1,499', tag: 'Everything + live loops',
      features: ['Everything in Pass', 'Company-loop simulators', 'Day-before rehearsal scheduling', 'Priority peer matching'] },
  ];
  return (
    <div className="space-y-4 max-w-xl mx-auto">
      <div className="text-center space-y-2 pt-4">
        <CheckCircle2 className="h-10 w-10 text-emerald-400 mx-auto" />
        <h2 className="text-xl font-bold">You just tasted the real thing.</h2>
        <p className="text-sm text-stone-400">{upsell?.message ?? 'Unlock the full experience.'}</p>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        {plans.map((p, i) => (
          <div key={p.id} className={cn('rounded-2xl border p-5 space-y-3', i === 0 ? 'border-[#e8a33d]/40 bg-[#e8a33d]/10' : 'border-[#26241f] bg-[#141311]')}>
            <div className="flex items-baseline justify-between">
              <span className="font-bold">{p.name}</span>
              <span className="text-lg font-black">{p.price}</span>
            </div>
            <p className="text-xs text-stone-400">{p.tag}</p>
            <ul className="space-y-1.5">
              {p.features.map((f) => (
                <li key={f} className="text-xs text-stone-300 flex items-start gap-1.5">
                  <CheckCircle2 className="h-3 w-3 mt-0.5 text-emerald-400 shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <Button className="w-full" variant={i === 0 ? 'default' : 'outline'} onClick={() => (location.href = '/pricing')}>
              Choose {p.name}
            </Button>
          </div>
        ))}
      </div>
      <div className="text-center">
        <button onClick={onLater} className="text-xs text-stone-600 hover:text-stone-300 underline">maybe later</button>
      </div>
    </div>
  );
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
}
