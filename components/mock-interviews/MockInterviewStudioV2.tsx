'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useReducedMotion } from 'framer-motion';
import {
  ArrowRight,
  BarChart3,
  BriefcaseBusiness,
  Braces,
  Building2,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Clock3,
  Code2,
  Crown,
  FileText,
  Headphones,
  Keyboard,
  Loader2,
  MessageCircleMore,
  Mic,
  Radio,
  Route,
  ShieldCheck,
  Shuffle,
  Sparkles,
  Volume2,
  Waves,
} from 'lucide-react';
import { TechIcon } from '@/components/tech-icon';
import { useAuth } from '@/context/auth-context';
import { speakNeural, stopNeuralSpeech } from '@/lib/engine/neuralVoice';
import {
  STUDIO_DOMAINS,
  STUDIO_MODES,
  STUDIO_PERSONAS,
  STUDIO_PRESETS,
  type StudioDomainId,
  type StudioModeId,
  type StudioPersonaId,
  type StudioPresetId,
} from '@/lib/engine/studioConfig';

type RecentSession = {
  sessionId?: string;
  overallScore?: number;
  domain?: string;
};

type MicStatus = 'idle' | 'requesting' | 'testing' | 'ready' | 'quiet' | 'denied' | 'unsupported';

const VOICE_WAVE = [12, 20, 30, 18, 38, 26, 46, 32, 52, 36, 24, 44, 30, 50, 36, 22, 42, 28, 18];
const COLLAPSED_DOMAIN_IDS: StudioDomainId[] = [
  'java-backend-fresher',
  'java-backend-intermediate',
  'python-backend-fresher',
  'frontend-fresher',
];

function oneOf<T extends { id: string }>(items: T[], candidate: string | null, fallback: string): T {
  return items.find((item) => item.id === candidate) ?? items.find((item) => item.id === fallback)!;
}

function safeNumber(value: string | null, fallback: number, min: number, max: number) {
  if (value === null || value.trim() === '') return fallback;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Math.min(Math.max(Math.round(parsed), min), max) : fallback;
}

function domainIconName(domain: StudioDomainId) {
  if (domain.startsWith('java')) return 'java';
  if (domain.startsWith('python')) return 'python';
  if (domain.startsWith('go-')) return 'go';
  if (domain.startsWith('ruby')) return 'ruby';
  if (domain.startsWith('frontend')) return 'javascript';
  return 'dsa';
}

function modeIcon(mode: StudioModeId) {
  if (mode === 'technical') return <Code2 className="h-4 w-4" />;
  if (mode === 'coding') return <Braces className="h-4 w-4" />;
  if (mode === 'behavioral') return <MessageCircleMore className="h-4 w-4" />;
  return <Shuffle className="h-4 w-4" />;
}

export function MockInterviewStudio() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reduceMotion = useReducedMotion();
  const { user, loading: authLoading } = useAuth();
  const targetConceptParam = searchParams?.get('concepts') || '';
  const targetConcepts = useMemo(
    () => targetConceptParam.split(',').map((concept) => concept.trim()).filter(Boolean).slice(0, 8),
    [targetConceptParam],
  );

  const initialDomain = oneOf(STUDIO_DOMAINS, searchParams?.get('domain'), 'java-backend-fresher');
  const initialPreset = oneOf(STUDIO_PRESETS, searchParams?.get('preset'), 'standard');
  const initialMode = initialDomain.id === 'dsa'
    ? oneOf(STUDIO_MODES, 'coding', 'coding')
    : oneOf(STUDIO_MODES, searchParams?.get('mode'), 'technical');
  const initialPersona = oneOf(STUDIO_PERSONAS, searchParams?.get('persona'), 'skeptic');

  const [domain, setDomain] = useState<StudioDomainId>(initialDomain.id);
  const [preset, setPreset] = useState<StudioPresetId>(initialPreset.id);
  const [mode, setMode] = useState<StudioModeId>(initialMode.id);
  const [persona, setPersona] = useState<StudioPersonaId>(initialPersona.id);
  const [tier, setTier] = useState(() => safeNumber(searchParams?.get('tier'), initialPersona.tier, 1, 5));
  const [minutes, setMinutes] = useState(() => safeNumber(searchParams?.get('minutes'), initialPreset.minutes, 5, 90));
  const [questionCount, setQuestionCount] = useState(() => safeNumber(searchParams?.get('count'), initialPreset.questions, 3, 24));
  const [answerMode, setAnswerMode] = useState<'voice' | 'type'>(searchParams?.get('input') === 'type' ? 'type' : 'voice');
  const [seed] = useState(() => safeNumber(searchParams?.get('seed'), 41721, 1, 999999));
  const [speaking, setSpeaking] = useState(false);
  const [micStatus, setMicStatus] = useState<MicStatus>('idle');
  const [micLevel, setMicLevel] = useState(0);
  const [showAllDomains, setShowAllDomains] = useState(false);
  const [recentSession, setRecentSession] = useState<RecentSession | null>(null);
  const micCleanupRef = useRef<null | (() => void)>(null);

  const domainOption = oneOf(STUDIO_DOMAINS, domain, 'java-backend-fresher');
  const presetOption = oneOf(STUDIO_PRESETS, preset, 'standard');
  const modeOption = oneOf(STUDIO_MODES, mode, 'technical');
  const personaOption = oneOf(STUDIO_PERSONAS, persona, 'skeptic');
  const requiresPass = personaOption.plan !== 'free' || tier > 2 || minutes > 30 || !['technical', 'behavioral'].includes(mode);
  const hasPass = user?.plan === 'pro';

  const visibleDomains = useMemo(() => {
    if (showAllDomains) return STUDIO_DOMAINS;
    const base = STUDIO_DOMAINS.filter((item) => COLLAPSED_DOMAIN_IDS.includes(item.id));
    if (base.some((item) => item.id === domain)) return base;
    return [...base.slice(0, 3), domainOption];
  }, [domain, domainOption, showAllDomains]);

  const sessionQuery = useMemo(() => {
    const params = new URLSearchParams({
      domain,
      preset,
      mode,
      persona,
      tier: String(tier),
      minutes: String(minutes),
      count: String(questionCount),
      seed: String(seed),
    });
    if (targetConcepts.length) params.set('concepts', targetConcepts.join(','));
    return params.toString();
  }, [domain, preset, mode, persona, tier, minutes, questionCount, seed, targetConcepts]);

  const startHref = useMemo(() => {
    const params = new URLSearchParams(sessionQuery);
    params.set('prepared', '1');
    params.set('input', answerMode);
    return `/mock-interviews/audio?${params.toString()}`;
  }, [answerMode, sessionQuery]);
  const startLocked = requiresPass && !authLoading && !hasPass;
  const primaryHref = startLocked ? '/pricing' : startHref;

  useEffect(() => {
    const params = new URLSearchParams(sessionQuery);
    params.set('input', answerMode);
    router.replace(`/mock-interviews?${params.toString()}`, { scroll: false });
  }, [answerMode, router, sessionQuery]);

  useEffect(() => {
    import('@/lib/engine/persist.mjs')
      .then(({ getSessionRecords }) => {
        const records = getSessionRecords();
        if (Array.isArray(records) && records.length) setRecentSession(records[0] as RecentSession);
      })
      .catch(() => {});
  }, []);

  useEffect(() => () => {
    stopNeuralSpeech();
    micCleanupRef.current?.();
  }, []);

  const changePreset = useCallback((next: StudioPresetId) => {
    const selected = oneOf(STUDIO_PRESETS, next, 'standard');
    setPreset(selected.id);
    setMinutes(selected.minutes);
    setQuestionCount(selected.questions);
  }, []);

  const changeDomain = useCallback((next: StudioDomainId) => {
    setDomain(next);
    if (next === 'dsa') setMode('coding');
    else if (domain === 'dsa') setMode('technical');
  }, [domain]);

  const changePersona = useCallback((next: StudioPersonaId) => {
    const selected = oneOf(STUDIO_PERSONAS, next, 'skeptic');
    setPersona(selected.id);
    setTier(selected.tier);
    stopNeuralSpeech();
    setSpeaking(false);
  }, []);

  const previewVoice = async () => {
    if (speaking) {
      stopNeuralSpeech();
      setSpeaking(false);
      return;
    }
    setSpeaking(true);
    try {
      await speakNeural(personaOption.previewLine, {
        persona: personaOption.id,
        rate: personaOption.voice.rate,
        pitch: personaOption.voice.pitch,
      });
    } finally {
      setSpeaking(false);
    }
  };

  const runMicTest = useCallback(async () => {
    micCleanupRef.current?.();
    setMicLevel(0);

    if (!navigator.mediaDevices?.getUserMedia) {
      setMicStatus('unsupported');
      return;
    }

    setMicStatus('requesting');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      audioContext.createMediaStreamSource(stream).connect(analyser);
      const samples = new Uint8Array(analyser.fftSize);
      let frame = 0;
      let timer = 0;
      let heardVoice = false;
      let stopped = false;

      const cleanup = () => {
        if (stopped) return;
        stopped = true;
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timer);
        stream.getTracks().forEach((track) => track.stop());
        void audioContext.close();
        micCleanupRef.current = null;
      };
      micCleanupRef.current = cleanup;
      setMicStatus('testing');

      const sample = () => {
        analyser.getByteTimeDomainData(samples);
        let energy = 0;
        for (const value of samples) {
          const centred = (value - 128) / 128;
          energy += centred * centred;
        }
        const level = Math.min(1, Math.sqrt(energy / samples.length) * 6);
        if (level > 0.09) heardVoice = true;
        setMicLevel(level);
        frame = window.requestAnimationFrame(sample);
      };
      sample();

      timer = window.setTimeout(() => {
        cleanup();
        setMicLevel(heardVoice ? 0.78 : 0.18);
        setMicStatus(heardVoice ? 'ready' : 'quiet');
      }, 3200);
    } catch {
      micCleanupRef.current = null;
      setMicStatus('denied');
    }
  }, []);

  return (
    <div className="min-h-screen bg-studio-canvas text-foreground">
      <div className="mx-auto w-full max-w-[1720px] px-3 py-4 sm:px-5 lg:px-6 lg:py-5">
        <StudioHeader recentSession={recentSession} />

        {/* capability band — what you can do here, at a glance */}
        <div className="mt-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          <Capability
            icon={<Waves className="h-4 w-4" />}
            title="Adaptive rounds"
            copy="Follow-up probes based on your answers — not a fixed question list."
          />
          <Capability
            icon={<Braces className="h-4 w-4" />}
            title="Real coding rounds"
            copy="DSA problems with statements, examples and an editor — defend your complexity."
          />
          <Capability
            icon={<ShieldCheck className="h-4 w-4" />}
            title="Evidence reports"
            copy="Every score tied to the rubric — replay your answers, see what you missed."
          />
          <Capability
            icon={<Building2 className="h-4 w-4" />}
            title="Company loops"
            copy="Multi-round sequences for 98 companies, grounded in public sources."
          />
        </div>

        <div className="mt-5 grid items-stretch gap-4 lg:grid-cols-[minmax(20rem,.9fr)_minmax(28rem,1.1fr)] xl:grid-cols-[minmax(20rem,1fr)_minmax(29rem,34rem)_minmax(20rem,1fr)]">
          <aside className="flex flex-col overflow-hidden rounded-2xl border border-primary/15 bg-gradient-to-b from-primary/[0.055] via-surface to-surface shadow-[0_20px_50px_-42px_rgba(24,73,140,.65)]" aria-labelledby="role-round-title">
            <PanelHeading
              eyebrow="01 · Interview shape"
              title="Choose what to practise"
              copy="Select a real role and the kind of round you expect."
              icon={<BriefcaseBusiness className="h-4 w-4" />}
              tone="blue"
              id="role-round-title"
            />

            <div className="p-4 sm:p-5">
              <ChoiceHeading title="Role and level" meta={`${STUDIO_DOMAINS.length} real tracks`} />
              <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Role and level">
                {visibleDomains.map((item) => (
                  <DomainChoice key={item.id} item={item} active={domain === item.id} onClick={() => changeDomain(item.id)} />
                ))}
              </div>
              <button
                type="button"
                onClick={() => setShowAllDomains((current) => !current)}
                aria-expanded={showAllDomains}
                className="mt-2 flex min-h-9 w-full items-center justify-center gap-1.5 rounded-lg text-xs font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                {showAllDomains ? 'Show fewer roles' : `See all ${STUDIO_DOMAINS.length} roles`}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${showAllDomains ? 'rotate-180' : ''}`} />
              </button>

              <div className="my-5 h-px bg-border" />

              <ChoiceHeading title="Interview round" meta="Adaptive by mode" />
              <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Interview round">
                {STUDIO_MODES.map((item) => {
                  const disabled = domain === 'dsa' && item.id !== 'coding';
                  return <ModeChoice key={item.id} item={item} active={mode === item.id} disabled={disabled} onClick={() => !disabled && setMode(item.id)} />;
                })}
              </div>

              {targetConcepts.length > 0 && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-primary/20 bg-primary/[0.045] p-3 text-xs leading-5 text-content-secondary">
                  <Route className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                  <span><strong className="font-semibold text-foreground">Resume-targeted session.</strong> The engine will prioritise {targetConcepts.length} saved {targetConcepts.length === 1 ? 'gap' : 'gaps'}.</span>
                </div>
              )}
            </div>
          </aside>

          <main className="min-w-0">
            <section className="overflow-hidden rounded-2xl border border-studio-elevated bg-studio text-content-inverse shadow-[0_30px_70px_-38px_rgba(8,24,52,.9)]" aria-labelledby="equipment-check-title">
              <div className="border-b border-content-inverse/10 bg-content-inverse/[0.035] px-5 py-3.5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.08em] text-content-inverse/75">
                    <span className="relative flex h-2.5 w-2.5" aria-hidden="true">
                      {!reduceMotion && <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-success opacity-35" />}
                      <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-success" />
                    </span>
                    ROOM CHECK
                  </div>
                  <div className="flex items-center gap-1.5 text-[11px] text-content-inverse/70">
                    <RoomChip icon={modeIcon(mode)} label={modeOption.shortLabel} />
                    <RoomChip icon={<Clock3 className="h-3.5 w-3.5" />} label={`${minutes} min`} />
                  </div>
                </div>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-3">
                  <div className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-primary/45 bg-primary/20 text-lg font-semibold">
                    {personaOption.name[0]}
                    <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-2 border-studio bg-success" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-content-inverse/55">Interviewer ready</p>
                    <h2 id="equipment-check-title" className="truncate text-lg font-semibold tracking-tight text-content-inverse">{personaOption.name}</h2>
                    <p className="truncate text-xs text-content-inverse/60">{personaOption.role} · {personaOption.style}</p>
                  </div>
                  <span className="hidden rounded-full border border-content-inverse/10 bg-content-inverse/5 px-2.5 py-1 text-[10px] font-medium text-content-inverse/60 sm:block">Tier {tier}</span>
                </div>

                <div className="mt-5 text-center">
                  <h3 className="text-xl font-semibold tracking-[-0.025em] text-content-inverse sm:text-[1.45rem]">Check your sound before the room opens</h3>
                  <p className="mx-auto mt-1.5 max-w-md text-sm leading-6 text-content-inverse/62">
                    Listen to the interviewer, test your microphone, or choose typed answers. No interview question is shown before you begin.
                  </p>
                </div>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-xl border border-content-inverse/12 bg-content-inverse/[0.045] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/20 text-[#8db8ff]"><Headphones className="h-[18px] w-[18px]" /></span>
                      <span className="text-[10px] font-semibold tracking-[0.08em] text-success">OUTPUT</span>
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-content-inverse">Interviewer voice</h4>
                    <p className="mt-1 min-h-10 text-xs leading-5 text-content-inverse/55">Hear {personaOption.name}&apos;s pace and tone.</p>
                    <div className="mt-3 flex h-8 items-center gap-0.5" aria-hidden="true">
                      {VOICE_WAVE.map((height, index) => (
                        <span key={index} className={`w-1 origin-center rounded-full ${index > 4 && index < 15 ? 'bg-[#6ea8ff]' : 'bg-content-inverse/25'} ${speaking && !reduceMotion ? 'animate-pulse' : ''}`} style={{ height: `${Math.max(5, Math.round(height * 0.48))}px`, animationDelay: `${index * 35}ms` }} />
                      ))}
                    </div>
                    <button type="button" onClick={previewVoice} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-content-inverse/15 bg-content-inverse/7 text-xs font-semibold transition-colors hover:bg-content-inverse/12 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                      {speaking ? <Radio className="h-4 w-4 text-success" /> : <Volume2 className="h-4 w-4 text-[#8db8ff]" />}
                      {speaking ? 'Stop voice preview' : 'Play voice sample'}
                    </button>
                  </div>

                  <div className="rounded-xl border border-content-inverse/12 bg-content-inverse/[0.045] p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-success/15 text-[#6ed5a0]"><Mic className="h-[18px] w-[18px]" /></span>
                      <MicStatusBadge status={micStatus} />
                    </div>
                    <h4 className="mt-3 text-sm font-semibold text-content-inverse">Your microphone</h4>
                    <p className="mt-1 min-h-10 text-xs leading-5 text-content-inverse/55"><MicStatusCopy status={micStatus} /></p>
                    <div className="mt-3 grid h-8 grid-cols-8 items-end gap-1" aria-hidden="true">
                      {Array.from({ length: 8 }, (_, index) => {
                        const threshold = (index + 1) / 8;
                        const active = micStatus === 'testing' ? micLevel >= threshold - 0.1 : micStatus === 'ready' && index < 6;
                        return <span key={index} className={`rounded-sm transition-all ${active ? 'bg-success' : 'bg-content-inverse/12'}`} style={{ height: `${8 + index * 2}px` }} />;
                      })}
                    </div>
                    <button type="button" onClick={runMicTest} disabled={micStatus === 'requesting' || micStatus === 'testing'} className="mt-3 inline-flex min-h-10 w-full items-center justify-center gap-2 rounded-lg border border-content-inverse/15 bg-content-inverse/7 text-xs font-semibold transition-colors hover:bg-content-inverse/12 disabled:cursor-wait disabled:opacity-70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-success">
                      {micStatus === 'requesting' || micStatus === 'testing' ? <Loader2 className="h-4 w-4 animate-spin text-success" /> : <Waves className="h-4 w-4 text-[#6ed5a0]" />}
                      {micStatus === 'testing' ? 'Speak for a moment…' : micStatus === 'requesting' ? 'Opening microphone…' : 'Test microphone'}
                    </button>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-content-inverse/10 bg-black/10 p-3">
                  <p className="px-1 text-[10px] font-semibold tracking-[0.09em] text-content-inverse/50">ANSWER INPUT</p>
                  <div className="mt-2 grid grid-cols-2 gap-2" role="group" aria-label="Preferred answer input">
                    <InputChoice active={answerMode === 'voice'} icon={<Mic className="h-4 w-4" />} title="Speak answers" copy="Adaptive voice room" onClick={() => setAnswerMode('voice')} />
                    <InputChoice active={answerMode === 'type'} icon={<Keyboard className="h-4 w-4" />} title="Type answers" copy="No microphone needed" onClick={() => setAnswerMode('type')} />
                  </div>
                </div>

                <div className="mt-4 flex items-center gap-2 rounded-lg border border-content-inverse/10 bg-content-inverse/[0.035] px-3 py-2 text-[11px] text-content-inverse/60">
                  <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-success" /> The mic test is temporary. Audio is not saved during setup.
                </div>

                <Link href={primaryHref} className="mt-4 inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-primary px-5 text-sm font-semibold text-primary-foreground shadow-[0_14px_28px_-16px_rgba(36,116,255,.9)] transition-[transform,filter] hover:-translate-y-0.5 hover:brightness-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-foreground/80">
                  {startLocked ? 'Unlock this interview' : 'Enter interview room'} <ArrowRight className="h-4 w-4" />
                </Link>
                <p className="mt-2 text-center text-[11px] text-content-inverse/48">{domainOption.label} · {modeOption.shortLabel} · {questionCount} questions</p>
              </div>
            </section>
          </main>

          <aside className="overflow-hidden rounded-2xl border border-warning/20 bg-gradient-to-b from-warning/[0.055] via-surface to-surface shadow-[0_20px_50px_-42px_rgba(140,88,24,.6)] lg:col-span-2 xl:col-span-1" aria-labelledby="pace-interviewer-title">
            <PanelHeading eyebrow="02 · Room character" title="Set the pace and pressure" copy="Choose the session length and who sits across from you." icon={<Headphones className="h-4 w-4" />} tone="amber" id="pace-interviewer-title" />

            <div className="p-4 sm:p-5">
              <ChoiceHeading title="Session length" meta={`${minutes} min selected`} />
              <div className="mt-3 grid gap-2" role="group" aria-label="Session length">
                {STUDIO_PRESETS.map((item) => <PresetChoice key={item.id} item={item} active={preset === item.id} onClick={() => changePreset(item.id)} />)}
              </div>

              <div className="my-5 h-px bg-border" />

              <ChoiceHeading title="Interviewer style" meta="Voice + follow-up behaviour" />
              <div className="mt-3 grid grid-cols-2 gap-2" role="group" aria-label="Interviewer style">
                {STUDIO_PERSONAS.map((item) => <PersonaChoice key={item.id} item={item} active={persona === item.id} onClick={() => changePersona(item.id)} />)}
              </div>

              <div className={`mt-4 rounded-xl border p-3 ${requiresPass ? 'border-warning/25 bg-warning/[0.055]' : 'border-success/20 bg-success/[0.045]'}`}>
                <div className="flex items-center justify-between gap-3">
                  <span className="inline-flex items-center gap-2 text-xs font-semibold text-foreground">
                    {requiresPass ? <Crown className="h-4 w-4 text-warning" /> : <ShieldCheck className="h-4 w-4 text-success" />}
                    {requiresPass ? (authLoading ? 'Checking access' : hasPass ? 'Included with Pro' : 'Interview Pass required') : 'Included in Free'}
                  </span>
                  <span className="text-[10px] font-semibold text-content-muted">TIER {tier}</span>
                </div>
                <p className="mt-1.5 text-[11px] leading-4 text-content-secondary">{requiresPass ? 'Advanced rounds, longer sessions, and specialist interviewers use Interview Pass.' : 'Start now and receive feedback after the free preview.'}</p>
              </div>

              <section className="mt-5 border-t border-border pt-4" aria-labelledby="connected-practice-title">
                <div className="flex items-center justify-between gap-3">
                  <h3 id="connected-practice-title" className="text-sm font-semibold">Connected practice</h3>
                  <span className="text-[10px] font-medium text-content-muted">Progress carries through</span>
                </div>
                <div className="mt-3 grid gap-2">
                  <FlowLink href="/dashboard/resume" icon={<FileText className="h-4 w-4" />} title="Target resume gaps" copy="Build a mock from missing evidence" tone="blue" />
                  <FlowLink href="/mock-interviews/company" icon={<Building2 className="h-4 w-4" />} title="Practise a company loop" copy="Run role-specific interview sets" tone="green" />
                  <FlowLink href={recentSession?.sessionId ? `/mock-interviews/results?session=${encodeURIComponent(recentSession.sessionId)}` : '/mock-interviews/results?session=demo'} icon={<BarChart3 className="h-4 w-4" />} title={recentSession?.sessionId ? 'Open latest evidence report' : 'Preview the evidence report'} copy={typeof recentSession?.overallScore === 'number' ? `Latest score · ${recentSession.overallScore}/100` : 'Replay answers and choose next drills'} tone="amber" />
                </div>
              </section>
            </div>
          </aside>
        </div>

        {/* footer — real detail: how scoring works, where data lives, what's free */}
        <footer className="mt-5 grid gap-4 border-t border-border pt-4 text-xs text-content-muted lg:grid-cols-3">
          <div>
            <div className="mb-1.5 font-medium text-foreground">How scoring works</div>
            <p className="leading-relaxed">Every answer is checked against the authored expert rubric for that question — concept coverage, depth and structure. No black-box AI judge; every point in your report is traceable to the rubric.</p>
          </div>
          <div>
            <div className="mb-1.5 font-medium text-foreground">Your data</div>
            <p className="leading-relaxed">Sessions, reports and mastery live in your browser and sync to your account when signed in. Nothing is shared; deleting a session removes its report.</p>
          </div>
          <div>
            <div className="mb-1.5 font-medium text-foreground">Free vs Interview Pass</div>
            <p className="leading-relaxed">Quick, rapid, DSA and behavioral rounds are free. Pass unlocks longer sessions, specialist interviewers and company loops. Corpus: 1,688 questions · 796 concepts · 507 DSA problems.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

function StudioHeader({ recentSession }: { recentSession: RecentSession | null }) {
  return (
    <header className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-end lg:justify-between">
      <div>
        <p className="inline-flex items-center gap-2 text-xs font-semibold tracking-[0.13em] text-primary"><Sparkles className="h-3.5 w-3.5" /> ADAPTIVE MOCK INTERVIEWS</p>
        <h1 className="mt-1.5 text-[1.85rem] font-semibold leading-tight tracking-[-0.035em] text-foreground sm:text-[2.15rem]">Practise the interview before it happens</h1>
        <p className="mt-1.5 max-w-4xl text-sm leading-6 text-content-secondary sm:text-[0.95rem]">Choose the role and round, test your voice setup, then answer adaptive questions and receive a replayable evidence report.</p>
      </div>
      <nav className="flex flex-wrap items-center gap-2" aria-label="Studio shortcuts">
        <Link href="/dashboard/resume" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-content-secondary shadow-xs transition-colors hover:border-primary/25 hover:text-foreground"><FileText className="h-4 w-4 text-primary" /> Use resume gaps</Link>
        <Link href="/mock-interviews/company" className="inline-flex min-h-10 items-center gap-2 rounded-lg border border-border bg-surface px-3 text-sm font-medium text-content-secondary shadow-xs transition-colors hover:border-success/30 hover:text-foreground"><Building2 className="h-4 w-4 text-success" /> Company practice</Link>
        {recentSession?.sessionId && <Link href={`/mock-interviews/results?session=${encodeURIComponent(recentSession.sessionId)}`} className="inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary hover:bg-primary/5">Latest report <ArrowRight className="h-4 w-4" /></Link>}
      </nav>
    </header>
  );
}

/** Capability chip: mid-size text, one idea per card. */
function Capability({ icon, title, copy }: { icon: React.ReactNode; title: string; copy: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl border border-border bg-surface px-4 py-3">
      <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-foreground">{icon}</span>
      <div className="min-w-0">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <p className="mt-0.5 text-[13px] leading-relaxed text-content-secondary">{copy}</p>
      </div>
    </div>
  );
}

function PanelHeading({ eyebrow, title, copy, icon, tone, id }: { eyebrow: string; title: string; copy: string; icon: React.ReactNode; tone: 'blue' | 'amber'; id: string }) {
  const styles = tone === 'blue' ? 'border-primary/15 bg-primary/[0.035] text-primary' : 'border-warning/20 bg-warning/[0.035] text-warning';
  return <div className={`border-b px-4 py-4 sm:px-5 ${styles}`}><p className="flex items-center gap-2 text-[10px] font-bold tracking-[0.13em]">{icon} {eyebrow.toUpperCase()}</p><h2 id={id} className="mt-1.5 text-lg font-semibold tracking-tight text-foreground">{title}</h2><p className="mt-1 text-xs leading-5 text-content-secondary">{copy}</p></div>;
}

function ChoiceHeading({ title, meta }: { title: string; meta: string }) {
  return <div className="flex items-center justify-between gap-3"><h3 className="text-sm font-semibold text-foreground">{title}</h3><span className="text-[11px] font-medium text-content-muted">{meta}</span></div>;
}

function DomainChoice({ item, active, onClick }: { item: (typeof STUDIO_DOMAINS)[number]; active: boolean; onClick: () => void }) {
  const iconName = domainIconName(item.id);
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`group relative min-h-[5.15rem] rounded-xl border p-3 text-left transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? 'border-primary bg-primary/[0.065] shadow-[0_12px_24px_-20px_rgba(30,101,210,.9)]' : 'border-border bg-surface hover:border-primary/30 hover:bg-primary/[0.025]'}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg border ${active ? 'border-primary/20 bg-surface' : 'border-border bg-surface-subtle'}`}>{iconName === 'dsa' ? <Code2 className="h-4 w-4 text-primary" /> : <TechIcon name={iconName} className="h-5 w-5" />}</span>
      <span className="mt-2 block pr-4 text-[13px] font-semibold leading-4 text-foreground">{item.label}</span>
      <span className={`mt-1 block text-[11px] font-medium ${active ? 'text-primary' : 'text-content-muted'}`}>{item.level}</span>
      <span className={`absolute right-2.5 top-2.5 flex h-4 w-4 items-center justify-center rounded-full border ${active ? 'border-primary bg-primary text-primary-foreground' : 'border-border-strong bg-surface'}`}>{active && <Check className="h-2.5 w-2.5" />}</span>
    </button>
  );
}

function ModeChoice({ item, active, disabled, onClick }: { item: (typeof STUDIO_MODES)[number]; active: boolean; disabled: boolean; onClick: () => void }) {
  const tone = item.id === 'technical' ? 'text-primary bg-primary/9' : item.id === 'coding' ? 'text-success bg-success/10' : item.id === 'behavioral' ? 'text-warning bg-warning/10' : 'text-content-secondary bg-muted';
  const pass = item.id === 'coding' || item.id === 'mixed';
  return (
    <button type="button" onClick={onClick} disabled={disabled} aria-pressed={active} className={`relative min-h-[5.35rem] rounded-xl border p-3 text-left transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-40 ${active ? 'border-success/55 bg-success/[0.055] shadow-[0_12px_24px_-21px_rgba(38,146,93,.9)]' : 'border-border bg-surface hover:border-success/30'}`}>
      <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${tone}`}>{modeIcon(item.id)}</span>
      <span className="mt-2 block text-[13px] font-semibold leading-4 text-foreground">{item.shortLabel}</span>
      <span className="mt-1 block line-clamp-2 text-[11px] leading-[1.45] text-content-muted">{disabled ? 'Coding only for DSA' : item.description}</span>
      {pass && <span className="absolute right-2.5 top-2.5 text-[8px] font-bold tracking-[0.08em] text-warning">PASS</span>}
    </button>
  );
}

function PresetChoice({ item, active, onClick }: { item: (typeof STUDIO_PRESETS)[number]; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`grid min-h-[4.25rem] w-full grid-cols-[2.4rem_minmax(0,1fr)_auto] items-center gap-3 rounded-xl border px-3 text-left transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? 'border-warning/55 bg-warning/[0.055] shadow-[0_12px_22px_-20px_rgba(190,112,20,.9)]' : 'border-border bg-surface hover:border-warning/30'}`}>
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${active ? 'bg-warning/13 text-warning' : 'bg-surface-subtle text-content-muted'}`}><Clock3 className="h-4 w-4" /></span>
      <span className="min-w-0"><span className="block text-[13px] font-semibold text-foreground">{item.label}</span><span className="mt-0.5 block truncate text-[11px] text-content-muted">{item.description}</span></span>
      <span className="text-right"><span className={`block text-sm font-semibold ${active ? 'text-warning' : 'text-foreground'}`}>{item.minutes}m</span><span className="block text-[10px] text-content-muted">{item.questions} questions</span>{item.id === 'deep' && <span className="mt-0.5 block text-[8px] font-bold tracking-[0.08em] text-warning">PASS</span>}</span>
    </button>
  );
}

function PersonaChoice({ item, active, onClick }: { item: (typeof STUDIO_PERSONAS)[number]; active: boolean; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`relative min-h-[5rem] rounded-xl border p-2.5 text-left transition-[border-color,background-color,box-shadow,transform] hover:-translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring ${active ? 'border-primary bg-primary/[0.055] shadow-[0_12px_22px_-20px_rgba(30,101,210,.9)]' : 'border-border bg-surface hover:border-primary/25'}`}>
      <div className="flex items-center gap-2"><span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-xs font-bold ${active ? 'bg-primary text-primary-foreground' : 'bg-surface-subtle text-content-secondary'}`}>{item.name[0]}</span><span className="min-w-0"><span className="block truncate text-[13px] font-semibold text-foreground">{item.name}</span><span className="block truncate text-[10px] text-content-muted">{item.role}</span></span></div>
      <span className="mt-2 block line-clamp-2 text-[11px] leading-4 text-content-secondary">{item.style}</span>
      {item.plan !== 'free' && <Crown className="absolute right-2 top-2 h-3 w-3 text-warning" aria-label="Interview Pass" />}
    </button>
  );
}

function RoomChip({ icon, label }: { icon: React.ReactNode; label: string }) {
  return <span className="inline-flex min-h-7 items-center gap-1.5 rounded-full border border-content-inverse/12 bg-content-inverse/5 px-2.5">{icon} {label}</span>;
}

function InputChoice({ active, icon, title, copy, onClick }: { active: boolean; icon: React.ReactNode; title: string; copy: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} aria-pressed={active} className={`flex min-h-[4.1rem] items-center gap-2.5 rounded-lg border px-3 text-left text-content-inverse transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${active ? 'border-primary bg-primary/20' : 'border-content-inverse/10 bg-content-inverse/[0.035] hover:bg-content-inverse/[0.07]'}`}>
      <span className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${active ? 'bg-primary text-primary-foreground' : 'bg-content-inverse/8 text-content-inverse/60'}`}>{icon}</span>
      <span><span className="block text-xs font-semibold text-content-inverse">{title}</span><span className="mt-0.5 block text-[11px] text-content-inverse/55">{copy}</span></span>
      {active && <CheckCircle2 className="ml-auto h-4 w-4 shrink-0 text-[#8db8ff]" />}
    </button>
  );
}

function MicStatusBadge({ status }: { status: MicStatus }) {
  const ready = status === 'ready';
  const testing = status === 'testing' || status === 'requesting';
  return <span className={`text-[10px] font-semibold tracking-[0.08em] ${ready ? 'text-success' : testing ? 'text-[#8db8ff]' : status === 'denied' ? 'text-warning' : 'text-content-inverse/45'}`}>{ready ? 'READY' : testing ? 'LISTENING' : status === 'quiet' ? 'CONNECTED' : status === 'denied' ? 'OPTIONAL' : 'INPUT'}</span>;
}

function MicStatusCopy({ status }: { status: MicStatus }) {
  if (status === 'requesting') return <>Allow microphone access to run the local check.</>;
  if (status === 'testing') return <>Speak normally while the level meter moves.</>;
  if (status === 'ready') return <>Voice detected. Your input level looks good.</>;
  if (status === 'quiet') return <>Mic connected. Move closer or speak a little louder.</>;
  if (status === 'denied') return <>Permission was unavailable. Typed answers still work.</>;
  if (status === 'unsupported') return <>This browser cannot test the mic here. Typed answers still work.</>;
  return <>Run a short local level check before entering.</>;
}

function FlowLink({ href, icon, title, copy, tone }: { href: string; icon: React.ReactNode; title: string; copy: string; tone: 'blue' | 'green' | 'amber' }) {
  const color = tone === 'blue' ? 'bg-primary/9 text-primary' : tone === 'green' ? 'bg-success/10 text-success' : 'bg-warning/10 text-warning';
  return (
    <Link href={href} className="group grid min-h-[3.8rem] grid-cols-[2.25rem_minmax(0,1fr)_1rem] items-center gap-2.5 rounded-xl border border-border bg-surface px-3 transition-[border-color,transform] hover:-translate-y-px hover:border-border-strong focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
      <span className={`flex h-9 w-9 items-center justify-center rounded-lg ${color}`}>{icon}</span>
      <span className="min-w-0"><span className="block text-[13px] font-semibold text-foreground">{title}</span><span className="mt-0.5 block truncate text-[11px] text-content-muted">{copy}</span></span>
      <ChevronRight className="h-4 w-4 text-content-muted transition-transform group-hover:translate-x-0.5" />
    </Link>
  );
}
