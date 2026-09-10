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
  Mic, Sparkles, ArrowRight, Timer as TimerIcon, Lock, Trophy, CheckCircle2,
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
import { saveFullReport, saveSessionRecord } from '@/lib/engine/persist.mjs';
import { recordEvidence } from '@/lib/engine/mastery.mjs';
import { getSessionRecords } from '@/lib/engine/persist.mjs';
import {
  STUDIO_MODES,
  STUDIO_PERSONAS,
  STUDIO_PRESETS,
} from '@/lib/engine/studioConfig';

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

const PRESET_ICONS = { quick: Zap, standard: Target, deep: Brain } as const;
const MODE_ICONS = { mixed: Brain, technical: Code2, behavioral: MessageSquare, coding: Play } as const;

const PRESETS = STUDIO_PRESETS.map((item) => ({
  key: item.id,
  mins: item.minutes,
  qs: item.questions,
  label: `${item.minutes} min`,
  sub: `${item.label} · ${item.questions} questions`,
  icon: PRESET_ICONS[item.id],
}));

const MODES = STUDIO_MODES.map((item) => ({
  key: item.id,
  label: item.shortLabel,
  icon: MODE_ICONS[item.id],
  desc: item.description,
}));

const PERSONAS = Object.fromEntries(
  STUDIO_PERSONAS.map((item) => [item.id, {
    id: item.id,
    name: item.name,
    role: item.role,
    vibe: item.style,
    voice: item.voice,
  }]),
) as Record<string, RoomPersona & { voice: { rate: number; pitch: number } }>;
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
  const preparedParam = searchParams?.get('prepared');
  const preferredInput = searchParams?.get('input') === 'type' ? 'type' : 'voice';
  const seedParam = searchParams?.get('seed');
  const minutesParam = searchParams?.get('minutes');
  const requestedSeed = seedParam ? Number(seedParam) : Number.NaN;
  const requestedMinutes = minutesParam ? Number(minutesParam) : Number.NaN;
  const targetConceptParam = searchParams?.get('concepts') || '';
  const targetConcepts = useMemo(
    () => targetConceptParam
      .split(',')
      .map((concept) => concept.trim())
      .filter(Boolean)
      .slice(0, 8),
    [targetConceptParam],
  );

  const { authed, pushLocal } = useEngineSync();

  // setup
  const [preset, setPreset] = useState(presetParam && ['quick', 'standard', 'deep'].includes(presetParam) ? presetParam : 'standard');
  const [mode, setMode] = useState(
    domainSlug === 'dsa'
      ? 'coding'
      : (modeParam && ['mixed', 'technical', 'behavioral', 'coding'].includes(modeParam) ? modeParam : 'technical'),
  );
  const [domain, setDomain] = useState(domainSlug || 'java-backend-fresher');
  const [tier, setTier] = useState(Number(searchParams?.get('tier')) || 2);
  const [personaChoice, setPersonaChoice] = useState<string>(personaParam && PERSONAS[personaParam] ? personaParam : 'skeptic');
  const [sessionMinutes, setSessionMinutes] = useState(
    Number.isFinite(requestedMinutes) && requestedMinutes >= 5 && requestedMinutes <= 90
      ? Math.round(requestedMinutes)
      : (PRESETS.find((item) => item.key === presetParam)?.mins ?? 30),
  );
  const countParam = Number(searchParams?.get('count')) || 0;

  // session
  const [phase, setPhase] = useState<'setup' | 'ritual' | 'locked' | 'starting' | 'asking' | 'listening' | 'thinking' | 'coding' | 'review' | 'done' | 'gated'>(preparedParam === '1' ? 'ritual' : 'setup');
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSeed, setSessionSeed] = useState<number | null>(null);
  const [current, setCurrent] = useState<PublicQuestion | null>(null);
  const [interviewerLine, setInterviewerLine] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [askedCount, setAskedCount] = useState(0);
  const totalPlanned = countParam >= 3
    ? Math.min(Math.max(Math.round(countParam), 3), 24)
    : (PRESETS.find((p) => p.key === preset)?.qs ?? 10);

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
  const [showMorePersonas, setShowMorePersonas] = useState(false);

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
    v.stopSpeech();
    setFinalTranscript('');
    setInterim('');
    setDelivery(null);
    setTyped('');
    setPhase('listening');
    await v.startListening();
  }, [ensureVoice, persona.id]);

  const beginTypedAnswer = useCallback(() => {
    voiceRef.current?.stopSpeech();
    setFinalTranscript('');
    setInterim('');
    setDelivery(null);
    setTyped('');
    setPhase('listening');
  }, []);

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
    targetConcepts,
    askedIds: [...askedIdsRef.current],
    usedProbeIds: [...usedProbeIdsRef.current],
    dodged: dodgedRef.current,
    recentSignals: recentSignalsRef.current.slice(-6),
    moveLog: moveLogRef.current,
    persona: persona.id,
    preset,
    mode,
    tier,
    minutes: sessionMinutes,
  });

  const startSession = useCallback(async () => {
    setError(null);
    setPhase('starting');
    try {
      const v = ensureVoice(persona.id);
      const pre = await v.preflight({ testMic: preferredInput === 'voice' });
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
          sessionSeed: Number.isFinite(requestedSeed) ? requestedSeed : undefined,
          minutes: sessionMinutes,
          targetConcepts,
        }),
      });
      const data = await res.json();
      if (res.status === 403) {
        setUpsell({ ...data, plans: undefined });
        setPhase(preparedParam === '1' ? 'locked' : 'setup');
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
      setTimeLeft(sessionMinutes * 60);

      // greeting + first question in one voice flow
      await say(data.opener ? `${data.opener} ${data.first.rendered}` : data.first.rendered);
      setPhase(firstQ.isCoding ? 'coding' : 'asking');
    } catch (e: any) {
      setError(e?.message || 'Could not start.');
      setPhase('setup');
    }
  }, [domain, preset, mode, tier, personaChoice, persona.id, ensureVoice, say, totalPlanned, requestedSeed, sessionMinutes, preferredInput, targetConcepts, preparedParam]);

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
        if (data.ave && data.ave.signal !== 'gated') {
          setLastAve(data.ave);
          recentSignalsRef.current.push(data.ave.signal);
          turnsRef.current.push({
            questionId: current.id,
            transcript: answerText,
            isBehavioral: !!current.isBehavioral || mode === 'behavioral',
            meta,
            move: 'gate',
            score: data.ave.score,
          });
          moveLogRef.current.push({
            turn: turnsRef.current.length,
            move: 'gate',
            questionId: null,
            reason: 'free preview boundary after four scored answers',
          });
        }
        setGateInfo(data);
        setUpsell(data.upsell);
        setPhase('review');
        return;
      }
      if (!res.ok) throw new Error(data.message || data.error || 'Turn failed.');

      setLastAve(data.ave);
      recentSignalsRef.current.push(data.ave?.signal);
      turnsRef.current.push({
        questionId: current.id,
        transcript: answerText,
        isBehavioral: !!current.isBehavioral || mode === 'behavioral',
        meta,
        move: data.next?.move ?? 'answer',
        score: data.ave?.score,
      });
      moveLogRef.current.push({
        turn: turnsRef.current.length,
        move: data.next?.move,
        questionId: data.next?.question?.id ?? null,
        reason: data.next?.reason ?? null,
      });

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
      await say(line);
      setPhase(data.next.question.isCoding ? 'coding' : 'asking');
    } catch (e: any) {
      setError(e?.message || 'Turn failed.');
      setPhase('asking');
    }
  }, [current, sessionId, sessionSeed, say, totalPlanned, preset, persona.id, mode, tier, sessionMinutes, targetConcepts]);

  const finishSession = useCallback(async (finalAve?: any) => {
    if (!sessionId) return;
    setPhase('thinking');
    try {
      const res = await fetch('/api/engine/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          clientState: {
            moveLog: moveLogRef.current,
            domain: domainRef.current,
            mode,
            preset,
            presetMinutes: sessionMinutes,
            persona: persona.id,
            tier,
          },
          turns: turnsRef.current,
        }),
      });
      const report = await res.json().catch(() => null);
      if (!res.ok || !report) throw new Error(report?.message || report?.error || 'Could not build the report.');
      if (report) {
        sessionStorage.setItem(`ie_mock_report_${sessionId}`, JSON.stringify(report));
        saveFullReport(sessionId, report);
        saveSessionRecord({
          sessionId,
          domain: domainRef.current,
          mode,
          preset,
          presetMinutes: sessionMinutes,
          overallScore: report.overallScore,
          turnsCount: report.turnsCount,
          weakConcepts: (report.weakConcepts ?? [])
            .slice(0, 8)
            .map((concept: any) => concept?.label ?? concept?.id ?? String(concept)),
        });
        try {
          for (const q of report.perQuestion ?? []) {
            const ids = q.coverage?.hitIds ?? q.coverage?.hit ?? [];
            if (ids.length) recordEvidence(ids, 'spoken');
          }
        } catch {}
        if (authed) pushLocal();
        router.push(`/mock-interviews/results?session=${sessionId}`);
      }
    } catch (e: any) {
      setError(e?.message || 'Could not build the report. Your session is still available in this tab.');
      setPhase(turnsRef.current.length ? 'review' : 'asking');
    }
  }, [sessionId, mode, preset, sessionMinutes, persona.id, tier, router, authed, pushLocal]);

  // countdown
  useEffect(() => {
    if (['setup', 'locked', 'review', 'done', 'gated'].includes(phase) || timeLeft <= 0) return;
    const t = window.setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => window.clearTimeout(t);
  }, [phase, timeLeft]);

  useEffect(() => {
    if (timeLeft === 60 && !nudgedRef.current && !['setup', 'done'].includes(phase)) {
      nudgedRef.current = true;
      say('One minute left — start wrapping up.');
    }
    if (timeLeft === 0 && sessionId && !['setup', 'locked', 'review', 'done', 'thinking', 'gated'].includes(phase)) {
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
  const changeSetupHref = useMemo(() => {
    const params = new URLSearchParams({
      domain,
      mode,
      preset,
      persona: personaChoice,
      tier: String(tier),
      minutes: String(sessionMinutes),
      count: String(totalPlanned),
      input: preferredInput,
    });
    if (Number.isFinite(requestedSeed)) params.set('seed', String(requestedSeed));
    if (targetConcepts.length) params.set('concepts', targetConcepts.join(','));
    return `/mock-interviews?${params.toString()}`;
  }, [domain, mode, preset, personaChoice, tier, sessionMinutes, totalPlanned, preferredInput, requestedSeed, targetConcepts]);

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

          {error && <div className="mb-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">{error}</div>}
          {upsell && (
            <div className="mb-6 rounded-lg border border-primary/40 bg-primary/[0.04] p-4">
              <div className="mb-1 flex items-center gap-2 text-sm font-semibold text-primary"><Lock className="h-4 w-4" /> Interview Pass required</div>
              <p className="mb-3 text-sm text-muted-foreground">{upsell.message ?? 'This tier/persona is part of Interview Pass.'}</p>
              <Link href="/pricing" className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-1.5 text-sm font-medium text-primary-foreground">
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
                  onClick={() => {
                    setPreset(p.key);
                    setSessionMinutes(p.mins);
                  }}
                  className={`rounded-lg border p-3 text-left transition-all ${preset === p.key ? 'border-foreground/50 bg-muted ring-1 ring-foreground/20' : 'border-border bg-surface hover:bg-muted'}`}
                >
                  <p.icon className={`mb-1.5 h-4 w-4 ${preset === p.key ? 'text-foreground' : 'text-muted-foreground'}`} />
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
                  className={`rounded-lg border p-3 text-left transition-all ${mode === m.key ? 'border-foreground/50 bg-muted ring-1 ring-foreground/20' : 'border-border bg-surface hover:bg-muted'}`}
                >
                  <div className="mb-1 flex items-center gap-2">
                    <m.icon className={`h-4 w-4 ${mode === m.key ? 'text-foreground' : 'text-muted-foreground'}`} />
                    <span className="text-sm font-semibold">{m.label}</span>
                  </div>
                  <div className="text-caption text-muted-foreground">{m.desc}</div>
                </button>
              ))}
            </div>
          </SetupSection>

          {/* step 3: interviewer — 3 visible, the rest behind 'more' */}
          <SetupSection title="3 · Your interviewer">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {Object.values(PERSONAS).filter((p) => ['skeptic', 'mentor', 'rapid'].includes(p.id)).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersonaChoice(p.id)}
                  className={`rounded-lg border p-3 text-left transition-all ${personaChoice === p.id ? 'border-foreground/50 bg-muted ring-1 ring-foreground/20' : 'border-border bg-surface hover:bg-muted'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${personaChoice === p.id ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}>{p.name[0]}</span>
                    <div>
                      <div className="text-sm font-semibold">{p.name}</div>
                      <div className="text-caption text-muted-foreground">{p.role}</div>
                    </div>
                  </div>
                  <div className="mt-1.5 text-caption italic text-muted-foreground">{p.vibe}</div>
                </button>
              ))}
              {showMorePersonas && Object.values(PERSONAS).filter((p) => !['skeptic', 'mentor', 'rapid'].includes(p.id)).map((p) => (
                <button
                  key={p.id}
                  onClick={() => setPersonaChoice(p.id)}
                  className={`rounded-lg border p-3 text-left transition-all ${personaChoice === p.id ? 'border-foreground/50 bg-muted ring-1 ring-foreground/20' : 'border-border bg-surface hover:bg-muted'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className={`flex h-7 w-7 items-center justify-center rounded-lg text-xs font-bold ${personaChoice === p.id ? 'bg-foreground text-background' : 'bg-muted text-foreground'}`}>{p.name[0]}</span>
                    <div>
                      <div className="text-sm font-semibold">{p.name}</div>
                      <div className="text-caption text-muted-foreground">{p.role}</div>
                    </div>
                  </div>
                  <div className="mt-1.5 text-caption italic text-muted-foreground">{p.vibe}</div>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMorePersonas((v) => !v)}
              className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground"
            >
              {showMorePersonas ? 'Fewer interviewers' : 'More interviewers (architect, detail, panel)'}
            </button>
          </SetupSection>

          <button
            onClick={startSession}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-lg bg-primary py-2.5 text-sm font-medium text-primary-foreground transition-colors hover:opacity-90"
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
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl rounded-xl border border-border bg-surface p-5 shadow-lg sm:p-7">
          <div className="flex items-center gap-2 text-sm font-semibold text-success">
            <CheckCircle2 className="h-4 w-4" /> Session prepared
          </div>
          <div className="mt-5 flex items-center gap-3 border-b border-border pb-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-full bg-primary/10 text-base font-semibold text-primary">
              {persona.name[0]}
            </span>
            <div>
              <h1 className="text-xl font-semibold tracking-tight text-foreground">Your interview with {persona.name} is ready</h1>
              <p className="mt-0.5 text-sm text-content-secondary">{persona.role} · {persona.vibe}</p>
            </div>
          </div>
          <dl className="grid gap-3 py-5 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-xs text-content-muted">Round</dt>
              <dd className="mt-1 font-semibold text-foreground">{modeLabel}</dd>
            </div>
            <div>
              <dt className="text-xs text-content-muted">Length</dt>
              <dd className="mt-1 font-semibold text-foreground">{sessionMinutes} min</dd>
            </div>
            <div>
              <dt className="text-xs text-content-muted">Questions</dt>
              <dd className="mt-1 font-semibold text-foreground">{totalPlanned}</dd>
            </div>
          </dl>
          <div className="rounded-lg border border-border bg-surface-subtle px-4 py-3 text-sm leading-6 text-content-secondary">
            {preferredInput === 'voice'
              ? 'We will check microphone access, play the interviewer voice, and transcribe your answer live. Typing remains available at any time.'
              : 'The interviewer voice will still play, but no microphone is required. You can type every answer in the room.'}
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link href={changeSetupHref} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-content-secondary hover:bg-muted hover:text-foreground">
              Change setup
            </Link>
            <button onClick={startSession} className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              {preferredInput === 'voice' ? <Mic className="h-4 w-4" /> : <Keyboard className="h-4 w-4" />}
              Enter interview room
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================ LOCKED CONFIGURATION ============================
  if (phase === 'locked') {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-xl rounded-xl border border-border bg-surface p-5 shadow-lg sm:p-7">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Lock className="h-5 w-5" />
          </span>
          <p className="mt-5 text-xs font-semibold tracking-[0.12em] text-primary">Interview Pass</p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight">This interview setup is a Pass feature</h1>
          <p className="mt-2 text-sm leading-6 text-content-secondary">
            {upsell?.message || `${modeLabel}, ${sessionMinutes} minutes, or the ${persona.name} interviewer goes beyond the free practice setup.`}
          </p>
          <dl className="mt-5 grid gap-3 border-y border-border py-4 text-sm sm:grid-cols-3">
            <div><dt className="text-xs text-content-muted">Interviewer</dt><dd className="mt-1 font-semibold">{persona.name}</dd></div>
            <div><dt className="text-xs text-content-muted">Round</dt><dd className="mt-1 font-semibold">{modeLabel}</dd></div>
            <div><dt className="text-xs text-content-muted">Length</dt><dd className="mt-1 font-semibold">{sessionMinutes} min</dd></div>
          </dl>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Link href={changeSetupHref} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-4 text-sm font-medium text-content-secondary hover:bg-muted hover:text-foreground">
              Choose a free setup
            </Link>
            <Link href="/pricing" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90">
              See Interview Pass <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  // ============================ PREVIEW COMPLETE / REPORT RETRY ============================
  if (phase === 'review') {
    const previewComplete = !!gateInfo;
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10 text-foreground">
        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl rounded-xl border border-border bg-surface p-5 shadow-lg sm:p-7">
          <div className={`flex items-center gap-2 text-sm font-semibold ${previewComplete ? 'text-primary' : 'text-destructive'}`}>
            {previewComplete ? <CheckCircle2 className="h-4 w-4" /> : <Sparkles className="h-4 w-4" />}
            {previewComplete ? 'Free preview complete' : 'Your report needs one more try'}
          </div>
          <h1 className="mt-4 text-2xl font-semibold tracking-tight text-foreground">
            {previewComplete ? 'Your practice still produced useful feedback.' : 'Your answers are safe in this tab.'}
          </h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-content-secondary">
            {previewComplete
              ? `You completed ${turnsRef.current.length} scored ${turnsRef.current.length === 1 ? 'answer' : 'answers'}. Open the report to see the concepts you covered, what you missed, and the best next study step.`
              : 'The interview finished, but the report request did not complete. Retry it now without repeating the interview.'}
          </p>

          {error && (
            <div className="mt-4 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <div className="mt-6 grid gap-3 border-y border-border py-5 sm:grid-cols-3">
            <div>
              <div className="text-xs text-content-muted">Interviewer</div>
              <div className="mt-1 text-sm font-semibold">{persona.name}</div>
            </div>
            <div>
              <div className="text-xs text-content-muted">Round</div>
              <div className="mt-1 text-sm font-semibold">{modeLabel}</div>
            </div>
            <div>
              <div className="text-xs text-content-muted">Answers scored</div>
              <div className="mt-1 text-sm font-semibold">{turnsRef.current.length}</div>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-2 sm:flex-row sm:items-center">
            <button
              onClick={() => { setError(null); finishSession(); }}
              disabled={!turnsRef.current.length}
              className="inline-flex min-h-11 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-primary-foreground hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Trophy className="h-4 w-4" /> {previewComplete ? 'View my feedback' : 'Retry report'}
            </button>
            {previewComplete ? (
              <Link href="/pricing" className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-border px-5 text-sm font-medium text-content-secondary hover:bg-muted hover:text-foreground">
                <Lock className="h-4 w-4" /> Unlock full interviews
              </Link>
            ) : (
              <button onClick={() => { setError(null); setPhase(current?.isCoding ? 'coding' : 'asking'); }} className="inline-flex min-h-11 items-center justify-center rounded-lg border border-border px-5 text-sm font-medium text-content-secondary hover:bg-muted hover:text-foreground">
                Return to room
              </button>
            )}
          </div>
          <Link href="/mock-interviews" className="mt-4 inline-flex text-xs font-medium text-content-muted hover:text-foreground">
            Back to Interview Studio
          </Link>
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
      totalSec={sessionMinutes * 60}
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

      {error && (
        <div className="mt-5 rounded-lg border border-destructive/30 bg-destructive/5 px-4 py-3 text-sm text-destructive">
          {error}
        </div>
      )}

      {/* action bar */}
      <div className="mt-5 flex flex-col sm:flex-row gap-2">
        {phase === 'asking' && (
          <>
            <button
              onClick={beginAnswer}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Mic className="h-4 w-4" /> Answer by voice
            </button>
            <button
              onClick={beginTypedAnswer}
              className="flex items-center gap-2 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              <Keyboard className="h-4 w-4" /> Type instead
            </button>
          </>
        )}
        {phase === 'listening' && (
          <>
            <button
              onClick={submitAnswer}
              className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-primary py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
            >
              <Send className="h-4 w-4" /> Submit answer
            </button>
            <input
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              placeholder="…or type to refine your answer"
              className="flex-1 rounded-lg border border-border bg-surface px-3.5 py-2 text-sm text-foreground outline-none focus:border-foreground/40"
            />
          </>
        )}
        {phase === 'coding' && (
          <button
            onClick={() => { const answer = code || typed; advance(answer, { typed: true }); }}
            className="flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
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
          className="mt-4 flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2.5 text-sm"
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
