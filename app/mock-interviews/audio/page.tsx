'use client';
/**
 * audio/page.tsx — THE INTERVIEW ROOM.
 *
 * One immersive room: the interviewer has presence (persona, voice, live
 * speaking indicator), your words appear as you speak (interim → final),
 * captions track the question, delivery is measured, and every mode gets a
 * real workspace (technical checklist, DSA editor, behavioral STAR).
 *
 * Session logic is stateless-server (clientState reconstructs the Director)
 * — unchanged from the engine contract; only the experience changed.
 */

import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Zap, Target, Brain, Code2, MessageSquare, Play, Bot, Send, Keyboard,
  Mic, Sparkles, ArrowRight, Wind, Timer as TimerIcon, Lock, Trophy,
} from 'lucide-react';
import Link from 'next/link';
import { useEngineSync } from '@/lib/engine/useEngineSync';
import {
  InterviewRoom,
  type RoomPersona,
} from '@/components/interview-room/InterviewRoom';
import {
  TechnicalWorkspace, DsaWorkspace, BehavioralWorkspace,
} from '@/components/interview-room/ModeWorkspaces';
import {
  VoiceController, type VoicePhase, type DeliveryMetrics,
} from '@/lib/engine/voiceController';
import { saveSessionRecord } from '@/lib/engine/persist.mjs';
import { recordEvidence } from '@/lib/engine/mastery.mjs';
import { getSessionRecords } from '@/lib/engine/persist.mjs';

interface PublicQuestion {
  id: string; question: string; title: string; difficulty?: string;
  learnUrl?: string | null;
  isProbe?: boolean; isStretch?: boolean; isPoke?: boolean; isTradeoff?: boolean;
  isCircleBack?: boolean; isBehavioral?: boolean; isCoding?: boolean;
  starterCode?: string | null; codingLang?: string | null;
  concepts?: string[]; conceptLabels?: string[];
  examples?: { input: string; output: string }[];
  constraints?: string;
}

const PRESETS = [
  { key: 'quick', mins: 15, qs: 5, label: '15 min', sub: 'Quick warm-up · 5 questions', icon: Zap },
  { key: 'standard', mins: 30, qs: 10, label: '30 min', sub: 'Standard mock · 10 questions', icon: Target },
  { key: 'deep', mins: 60, qs: 20, label: '60 min', sub: 'Full interview · 20 questions', icon: Brain },
];

const MODES = [
  { key: 'mixed', label: 'Full mix', icon: Brain, desc: 'Technical + behavioral — the real loop' },
  { key: 'technical', label: 'Technical', icon: Code2, desc: 'Adaptive Q&A with follow-up probes' },
  { key: 'behavioral', label: 'Behavioral', icon: MessageSquare, desc: 'STAR-tracked storytelling' },
  { key: 'coding', label: 'Coding / DSA', icon: Play, desc: 'Real problems with editor + verification' },
];

const PERSONAS: Record<string, RoomPersona & { voice: { rate: number; pitch: number } }> = {
  mentor: { id: 'mentor', name: 'Aisha', role: 'Senior Engineer', vibe: 'warm but thorough', voice: { rate: 0.96, pitch: 1.05 } },
  skeptic: { id: 'skeptic', name: 'Marcus', role: 'Staff Engineer', vibe: 'doubts every claim', voice: { rate: 0.98, pitch: 0.92 } },
  rapid: { id: 'rapid', name: 'Priya', role: 'Hiring Manager', vibe: 'fast, interrupting', voice: { rate: 1.12, pitch: 1.0 } },
  architect: { id: 'architect', name: 'Dana', role: 'Principal Architect', vibe: 'systems-scale thinking', voice: { rate: 0.92, pitch: 0.95 } },
  detail: { id: 'detail', name: 'Elena', role: 'Tech Lead', vibe: 'depth over breadth', voice: { rate: 0.94, pitch: 1.1 } },
  silent: { id: 'silent', name: 'The Panel', role: 'Silent Judge', vibe: 'minimal reactions', voice: { rate: 1.0, pitch: 1.0 } },
};
const FALLBACK_PERSONA = PERSONAS.skeptic;

const STAR_PARTS = [
  { part: 'S', name: 'Situation', test: /\b(when i|at my|last year|in my|during|we had|my team|the project)\b/i },
  { part: 'T', name: 'Task', test: /\b(i was asked|my task|my role|responsible for|i had to|i owned|goal was)\b/i },
  { part: 'A', name: 'Action', test: /\b(i led|i built|i implemented|i designed|i wrote|i migrated|i decided|i pushed)\b/i },
  { part: 'R', name: 'Result', test: /\b(result|impact|reduced|improved|increased|shipped|saved|grew|percent|%|faster)\b/i },
];

export default function PremiumMockPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const domainSlug = searchParams?.get('domain');
  const presetParam = searchParams?.get('preset');
  const modeParam = searchParams?.get('mode');
  const personaParam = searchParams?.get('persona');

  const { authed, pushLocal } = useEngineSync();

  // setup
  const [preset, setPreset] = useState(presetParam && ['quick', 'standard', 'deep'].includes(presetParam) ? presetParam : 'standard');
  const [mode, setMode] = useState(modeParam && ['mixed', 'technical', 'behavioral', 'coding'].includes(modeParam) ? modeParam : 'technical');
  const [domain, setDomain] = useState(domainSlug || 'ruby-backend-fresher');
  const [tier, setTier] = useState(Number(searchParams?.get('tier')) || 2);
  const [personaChoice, setPersonaChoice] = useState<string | null>(PERSONAS[personaParam ?? ''] ? personaParam : null);
  const countParam = Number(searchParams?.get('count')) || 0;

  // session
  const [phase, setPhase] = useState<'setup' | 'ritual' | 'starting' | 'asking' | 'listening' | 'thinking' | 'coding' | 'review' | 'done' | 'gated'>('setup');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSeed, setSessionSeed] = useState<number | null>(null);
  const [current, setCurrent] = useState<PublicQuestion | null>(null);
  const [interviewerLine, setInterviewerLine] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [askedCount, setAskedCount] = useState(0);
  const totalPlanned = countParam >= 3 ? countParam : (PRESETS.find((p) => p.key === preset)?.qs ?? 10);

  // voice (the ONE controller)
  const voiceRef = useRef<VoiceController | null>(null);
  const [voicePhase, setVoicePhase] = useState<VoicePhase>('idle');
  const [caption, setCaption] = useState('');
  const [interim, setInterim] = useState('');
  const [finalTranscript, setFinalTranscript] = useState('');
  const [delivery, setDelivery] = useState<DeliveryMetrics | null>(null);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const [neural, setNeural] = useState(false);
  const [muted, setMuted] = useState(false);
  const [paused, setPaused] = useState(false);
  const [rubricChecks, setRubricChecks] = useState<boolean[]>([]);

  // answer + flow state
  const [code, setCode] = useState('');
  const [typed, setTyped] = useState('');
  const [lastAve, setLastAve] = useState<any>(null);
  const [upsell, setUpsell] = useState<any>(null);
  const [gateInfo, setGateInfo] = useState<any>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  // refs for deterministic engine reconstruction
  const askedIdsRef = useRef<Set<string>>(new Set());
  const usedProbeIdsRef = useRef<Set<string>>(new Set());
  const dodgedRef = useRef<any[]>([]);
  const recentSignalsRef = useRef<string[]>([]);
  const moveLogRef = useRef<any[]>([]);
  const turnsRef = useRef<any[]>([]);
  const domainRef = useRef(domain);
  const nudgedRef = useRef(false);
  useEffect(() => { domainRef.current = domain; }, [domain]);

  const persona = useMemo(() => PERSONAS[personaChoice ?? 'skeptic'] ?? FALLBACK_PERSONA, [personaChoice]);

  // ---------------- voice controller lifecycle ----------------
  const ensureVoice = useCallback((personaId: string) => {
    if (!voiceRef.current) {
      voiceRef.current = new VoiceController({
        persona: personaId,
        lang: 'en-IN',
        interimResults: true,
        onPhase: (p) => setVoicePhase(p),
        onCaption: (text, prog) => setCaption(text),
        onInterim: (t) => setInterim(t),
        onFinal: (t) => { setFinalTranscript(t); setInterim(''); },
        onDelivery: (m) => setDelivery(m),
        onError: (msg) => setVoiceError(msg),
      });
    } else {
      voiceRef.current['opts'].persona = personaId;
    }
    return voiceRef.current;
  }, []);

  const say = useCallback(async (text: string, personaId?: string) => {
    const v = ensureVoice(personaId ?? persona.id);
    setCaption(text);
    await v.say(text);
  }, [ensureVoice, persona.id]);

  // listen flow: interviewer stops → you answer → submit
  const beginAnswer = useCallback(async () => {
    const v = ensureVoice(persona.id);
    setFinalTranscript('');
    setInterim('');
    setDelivery(null);
    setTyped('');
    setPhase('listening');
    await v.startListening();
  }, [ensureVoice, persona.id]);

  const submitAnswer = useCallback(async () => {
    const v = voiceRef.current;
    const result = v ? v.stopListening() : { final: typed, delivery: null };
    const answer = (result.final || typed).trim();
    if (!answer) return;
    setPhase('thinking');
    await advance(answer, result.delivery ? { wpm: result.delivery.paceWpm, fillers: result.delivery.fillers } : undefined);
  }, [typed]);

  // ---------------- engine calls ----------------
  const clientState = () => ({
    sessionSeed,
    domain: domainRef.current,
    questionCount: totalPlanned,
    askedIds: [...askedIdsRef.current],
    usedProbeIds: [...usedProbeIdsRef.current],
    dodged: dodgedRef.current,
    recentSignals: recentSignalsRef.current.slice(-6),
    moveLog: moveLogRef.current,
    persona: persona.id,
    minutes: PRESETS.find((p) => p.key === preset)?.mins ?? 30,
    plan: 'free',
  });

  const startSession = useCallback(async () => {
    setError(null);
    setPhase('starting');
    try {
      const v = ensureVoice(persona.id);
      const pre = await v.preflight();
      setNeural(pre.neural);
      if (!pre.micOk) setVoiceError(pre.micError ?? 'mic_error');

      const res = await fetch('/api/engine/session', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          domain,
          preset,
          mode,
          tier,
          persona: personaChoice ?? undefined,
          questionCount: totalPlanned,
        }),
      });
      const data = await res.json();
      if (res.status === 403) {
        setUpsell({ ...data, plans: undefined });
        setPhase('setup');
        return;
      }
      if (!res.ok || !data.first?.question) throw new Error(data.error || 'start failed');

      setSessionId(data.sessionId);
      setSessionSeed(data.sessionSeed);
      const firstQ = data.first.question;
      setCurrent(firstQ);
      setInterviewerLine(data.opener ? data.opener + ' ' + data.first.rendered : data.first.rendered);
      setAskedCount(1);
      askedIdsRef.current = new Set([firstQ.id]);
      setRubricChecks(new Array(Math.min(6, firstQ.conceptLabels?.length ?? 0)).fill(false));
      setTimeLeft(countParam >= 3 ? Math.round(countParam * 4.5) * 60 : (PRESETS.find((p) => p.key === preset)?.mins ?? 30) * 60);

      // greeting + first question in one voice flow
      await say(data.opener ? `${data.opener} ${data.first.rendered}` : data.first.rendered);
      setPhase(firstQ.isCoding ? 'coding' : 'asking');
    } catch (e: any) {
      setError(e?.message || 'Could not start.');
      setPhase('setup');
    }
  }, [domain, preset, mode, tier, personaChoice, persona.id, ensureVoice, say, totalPlanned, countParam]);

  const advance = useCallback(async (answerText: string, meta?: any) => {
    if (!current || !sessionId) return;
    setPhase('thinking');
    try {
      const res = await fetch('/api/engine/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: current.id,
          transcript: answerText,
          isBehavioral: current.isBehavioral,
          meta,
          clientState: clientState(),
        }),
      });
      const data = await res.json();
      if (data.gated) {
        setGateInfo(data);
        setUpsell(data.upsell);
        setPhase('review');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'turn failed');

      setLastAve(data.ave);
      recentSignalsRef.current.push(data.ave?.signal);
      turnsRef.current.push({ questionId: current.id, transcript: answerText, move: data.next?.move ?? 'answer', score: data.ave?.score });
      moveLogRef.current.push({ turn: turnsRef.current.length, move: data.next?.move, questionId: data.next?.question?.id ?? null });

      // brief reaction, then next question
      const line = data.next?.reaction
        ? `${data.next.reaction} ${data.next.rendered}`
        : data.next?.rendered ?? '';

      if (data.next?.move === 'wrap' || !data.next?.question) {
        await say("That's everything from my side. Let me put your report together.");
        finishSession(data.ave);
        return;
      }
      setCurrent(data.next.question);
      setInterviewerLine(line);
      setAskedCount((n) => n + 1);
      askedIdsRef.current.add(data.next.question.id);
      setRubricChecks(new Array(Math.min(6, data.next.question.conceptLabels?.length ?? 0)).fill(false));
      setPhase(data.next.question.isCoding ? 'coding' : 'asking');
      await say(line);
    } catch (e: any) {
      setError(e?.message || 'Turn failed.');
      setPhase('asking');
    }
  }, [current, sessionId, sessionSeed, say, totalPlanned, preset, persona.id]);

  const finishSession = useCallback(async (finalAve?: any) => {
    if (!sessionId) return;
    setPhase('thinking');
    try {
      const res = await fetch('/api/engine/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sessionId, clientState: { moveLog: moveLogRef.current }, turns: turnsRef.current }),
      });
      const report = res.ok ? await res.json() : null;
      if (report) {
        sessionStorage.setItem(`ie_mock_report_${sessionId}`, JSON.stringify(report));
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
        if (authed) pushLocal();
        try {
          for (const q of report.perQuestion ?? []) {
            if (q.coverage?.hit?.length) recordEvidence(q.coverage.hit, 'spoken');
          }
        } catch {}
        router.push(`/mock-interviews/results?session=${sessionId}`);
      }
    } catch {}
  }, [sessionId, mode, preset, router, authed, pushLocal]);

  // countdown
  useEffect(() => {
    if (['setup', 'done', 'gated'].includes(phase) || timeLeft <= 0) return;
    const t = window.setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (timeLeft === 60 && !nudgedRef.current && !['setup', 'done'].includes(phase)) {
      nudgedRef.current = true;
      say('One minute left — start wrapping up.');
    }
    if (timeLeft === 0 && sessionId && !['setup', 'done', 'thinking', 'gated'].includes(phase)) {
      voiceRef.current?.stopSpeech();
      say("That's all the time we have today. Let's look at your report.");
      finishSession();
    }
  }, [timeLeft]);

  // cleanup
  useEffect(() => () => { voiceRef.current?.destroy(); }, []);

  // STAR detection from live transcript
  const starParts = useMemo(
    () => STAR_PARTS.map((p) => ({ ...p, detected: p.test.test(finalTranscript || typed) })),
    [finalTranscript, typed]
  );

  const modeLabel = MODES.find((m) => m.key === mode)?.label ?? 'Technical';

  // ============================ SETUP SCREEN ============================
  if (phase === 'setup') {
    return (
      <div className="min-h-[calc(100vh-3.5rem)] bg-background text-foreground">
        <div className="max-w-2xl mx-auto px-4 py-10">
          <Link href="/mock-interviews" className="mb-6 flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
            ← Mock hub
          </Link>
          <h1 className="mb-2 font-display text-title tracking-tight text-foreground">The Interview Room</h1>
          <p className="mb-8 text-base text-muted-foreground">
            A real interview, not a quiz. Your interviewer listens, adapts, and pushes back.
          </p>

          {error && <div className="mb-4 rounded-xl border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
          {upsell && (
            <div className="mb-6 rounded-xl border border-primary/40 bg-primary/[0.04] p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary"><Lock className="h-4 w-4" /> Interview Pass required</div>
              <p className="mb-3 text-sm text-muted-foreground">{upsell.message ?? 'This tier/persona is part of Interview Pass.'}</p>
              <Link href="/pricing" className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground">
                See plans <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
          )}

          {/* step 1: goal */}
          <SetupSection title="1 · Choose your session">
            <div className="grid grid-cols-3 gap-2">
              {PRESETS.map((p) => (
                <button
                  key={p.key}
                  onClick={() => setPreset(p.key)}
                  className={`rounded-xl border p-3 text-left transition-all ${preset === p.key ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:bg-muted'}`}
                >
                  <p.icon className={`mb-1.5 h-4 w-4 ${preset === p.key ? 'text-primary' : 'text-muted-foreground'}`} />
                  <div className="text-sm font-semibold">{p.label}</div>
                  <div className="text-caption text-muted-foreground">{p.sub}</div>
                </button>
              ))}
            </div>
          </SetupSection>

          {/* step 2: mode */}
          <SetupSection title="2 · Round type">
            <div className="grid grid-cols-2 gap-2">
              {MODES.map((m) => (
                <button
                  key={m.key}
                  onClick={() => setMode(m.key)}
                  className={`rounded-xl border p-3 text-left transition-all ${mode === m.key ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:bg-muted'}`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <m.icon className={`h-4 w-4 ${mode === m.key ? 'text-primary' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-semibold">{m.label}</span>
                  </div>
                  <div className="text-caption text-muted-foreground">{m.desc}</div>
                </button>
              ))}
            </div>
          </SetupSection>

          {/* step 3: interviewer */}
          <SetupSection title="3 · Your interviewer">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(PERSONAS).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersonaChoice(p.id)}
                  className={`rounded-xl border p-3 text-left transition-all ${personaChoice === p.id ? 'border-primary bg-primary/10' : 'border-border bg-surface hover:bg-muted'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${personaChoice === p.id ? 'bg-primary text-primary-foreground' : 'bg-muted text-foreground'}`}>{p.name[0]}</span>
                    <div>
                      <div className="text-sm font-semibold">{p.name}</div>
                      <div className="text-caption text-muted-foreground">{p.role}</div>
                    </div>
                  </div>
                  <div className="mt-1.5 text-caption italic text-muted-foreground">{p.vibe}</div>
                </button>
              ))}
            </div>
          </SetupSection>

          <button
            onClick={startSession}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground transition-colors hover:opacity-90"
          >
            <Mic className="h-4 w-4" /> Enter the room
          </button>
          <p className="mt-3 text-center text-caption text-muted-foreground">
            Microphone required for voice mode · your words are transcribed live · typing always available
          </p>
        </div>
      </div>
    );
  }

  // ============================ PRE-SESSION RITUAL ============================
  if (phase === 'ritual') {
    return (
      <div className="flex min-h-[calc(100vh-3.5rem)] items-center justify-center bg-background px-4 text-foreground">
        <motion.div initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }} className="max-w-md w-full text-center">
          <Wind className="mx-auto mb-6 h-10 w-10 text-primary" />
          <h2 className="mb-2 font-display text-title tracking-tight">Before you begin</h2>
          <p className="mb-8 text-base leading-relaxed text-muted-foreground">
            Interviews reward composure, not just knowledge. Box-breathe with the ring:
            in 4 · hold 4 · out 4. Reframe the arousal as readiness — same body, different story.
          </p>
          <BreathingRing />
          <button onClick={startSession} className="mt-8 rounded-xl bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:opacity-90">
            I&apos;m ready
          </button>
        </motion.div>
      </div>
    );
  }

  // ============================ THE ROOM ============================
  return (
    <InterviewRoom
      persona={persona}
      neural={neural}
      phase={voicePhase === 'idle' ? phase : voicePhase}
      voiceError={voiceError}
      timeLeftSec={timeLeft}
      totalSec={countParam >= 3 ? countParam * 270 : (PRESETS.find((p) => p.key === preset)?.mins ?? 30) * 60}
      questionIndex={askedCount}
      questionTotal={totalPlanned}
      modeLabel={modeLabel}
      caption={caption || interviewerLine}
      interim={interim}
      finalTranscript={finalTranscript}
      delivery={delivery}
      muted={muted}
      paused={paused}
      onToggleMute={() => { const m = !muted; setMuted(m); voiceRef.current?.setMuted(m); }}
      onTogglePause={() => { const p = !paused; setPaused(p); p ? voiceRef.current?.pause() : voiceRef.current?.resume(); }}
      onReplay={() => say(interviewerLine)}
    >
      {/* mode workspace */}
      {current && (mode === 'coding' || current.isCoding) ? (
        <DsaWorkspace
          problem={{
            question: current.question,
            examples: current.examples,
            constraints: current.constraints,
            starterCode: current.starterCode,
            codingLang: current.codingLang,
          }}
          code={code || current.starterCode || ''}
          onCodeChange={setCode}
          lang={current.codingLang ?? 'java'}
        />
      ) : current && (current.isBehavioral || mode === 'behavioral') ? (
        <BehavioralWorkspace question={{ question: current.question }} starParts={starParts} />
      ) : current ? (
        <TechnicalWorkspace
          question={current}
          rubricChecklist={(current.conceptLabels ?? []).slice(0, 6)}
          checked={rubricChecks}
          onCheck={(i) => setRubricChecks((c) => c.map((v, j) => (j === i ? !v : v)))}
        />
      ) : null}

      {/* action bar */}
      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        {phase === 'asking' && (
          <>
            <button
              onClick={beginAnswer}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Mic className="h-4 w-4" /> Answer by voice
            </button>
            <button
              onClick={() => setPhase('listening')}
              className="flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-3.5 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Keyboard className="h-4 w-4" /> Type instead
            </button>
          </>
        )}
        {phase === 'listening' && (
          <>
            <button
              onClick={submitAnswer}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
            >
              <Send className="h-4 w-4" /> Submit answer
            </button>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="…or type to refine your answer"
              className="flex-1 rounded-xl border border-border bg-surface px-4 py-3.5 text-sm text-foreground outline-none focus:border-primary/50"
            />
          </>
        )}
        {phase === 'coding' && (
          <button
            onClick={() => { const answer = code || typed; advance(answer, { typed: true }); }}
            className="flex items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground hover:opacity-90"
          >
            <Send className="h-4 w-4" /> Submit solution
          </button>
        )}
      </div>

      {/* last verdict chip */}
      {lastAve && phase === 'asking' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 flex items-center gap-2 rounded-xl border border-border bg-surface px-4 py-2.5 text-sm"
        >
          <Trophy className="h-4 w-4 text-primary" />
          <span className="font-medium text-foreground">{lastAve.band?.line ?? 'Answer logged'}</span>
          {lastAve.coverage?.missed?.length > 0 && (
            <span className="text-muted-foreground">· missed: {lastAve.coverage.missed.slice(0, 2).join(', ')}</span>
          )}
        </motion.div>
      )}

      {phase === 'starting' && (
        <div className="flex items-center justify-center gap-2 py-16 text-sm text-muted-foreground">
          <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
            <Sparkles className="h-4 w-4" />
          </motion.div>
          Connecting to your interviewer…
        </div>
      )}
    </InterviewRoom>
  );
}

// ---------------------------------------------------------------------------
// helpers
// ---------------------------------------------------------------------------

function SetupSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-6">
      <div className="mb-2.5 text-caption font-medium uppercase tracking-wider text-muted-foreground">{title}</div>
      {children}
    </div>
  );
}

function BreathingRing() {
  return (
    <div className="relative h-40 w-40 mx-auto">
      {[0, 1, 2].map((i) => (
        <motion.div
          key={i}
          className="absolute inset-0 rounded-full border border-primary/40"
          animate={{ scale: [1, 1.35, 1.35, 1], opacity: [0.7, 0.7, 0.2, 0.7] }}
          transition={{ repeat: Infinity, duration: 12, delay: i * 0.4, times: [0, 0.45, 0.55, 1] }}
        />
      ))}
      <motion.div
        className="absolute inset-8 rounded-full border border-primary/50 bg-primary/10"
        animate={{ scale: [1, 1.2, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 12, times: [0, 0.45, 0.55, 1] }}
      />
    </div>
  );
}
