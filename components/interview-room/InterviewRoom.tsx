'use client';
/**
 * InterviewRoom — the immersive room shell, now on the DESIGN TOKEN system.
 *
 * Rules this file follows (the "premium product" contract):
 *  - colors: only token classes (bg-background/surface, border-border,
 *    text-foreground/muted-foreground, primary for the ONE accent) — zero hex
 *  - type: the type-* scale (display/title/section/body/caption) — no random sizes
 *  - spacing: 4px grid via the standard classes only
 *  - elevation: surface + border, no drop-shadow soup
 *  - one accent color (primary) — semantic colors only for status (emerald=live, rose=danger)
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Volume2, VolumeX, Pause, Play, RotateCcw, Brain, Gauge } from 'lucide-react';
import type { VoicePhase, DeliveryMetrics } from '@/lib/engine/voiceController';

export interface RoomPersona {
  id: string;
  name: string;
  role: string;
  vibe: string;
}

const PHASE_LABEL: Record<string, string> = {
  idle: 'Ready',
  preflight: 'Preparing…',
  synthesizing: 'Interviewer thinking…',
  speaking: 'Interviewer speaking',
  listening: 'Your turn — speak',
  thinking: 'Evaluating…',
  error: 'Audio error',
  asking: 'Question',
  coding: 'Coding round',
  review: 'Review',
  done: 'Complete',
  gated: 'Session limit',
};

export function InterviewRoom({
  persona,
  neural,
  phase,
  voiceError,
  timeLeftSec,
  totalSec,
  questionIndex,
  questionTotal,
  modeLabel,
  caption,
  interim,
  finalTranscript,
  delivery,
  onToggleMute,
  onTogglePause,
  onReplay,
  muted,
  paused,
  children,
}: {
  persona: RoomPersona;
  neural: boolean;
  phase: string;
  voiceError?: string | null;
  timeLeftSec: number;
  totalSec: number;
  questionIndex: number;
  questionTotal: number;
  modeLabel: string;
  caption: string;
  interim: string;
  finalTranscript: string;
  delivery: DeliveryMetrics | null;
  onToggleMute: () => void;
  onTogglePause: () => void;
  onReplay: () => void;
  muted: boolean;
  paused: boolean;
  children?: React.ReactNode;
}) {
  const isListening = phase === 'listening';
  const isSpeaking = phase === 'speaking';
  const progress = totalSec > 0 ? 1 - timeLeftSec / totalSec : 0;
  const mins = Math.floor(Math.max(0, timeLeftSec) / 60);
  const secs = Math.max(0, timeLeftSec) % 60;
  const lowTime = timeLeftSec < 60;

  return (
    <div className="flex min-h-[calc(100vh-3.5rem)] flex-col bg-background">
      {/* ============ context bar ============ */}
      <header className="sticky top-0 z-20 border-b border-border bg-surface/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-4xl items-center gap-4 px-4 lg:px-6">
          {/* persona */}
          <div className="flex min-w-0 items-center gap-3">
            <div className="relative shrink-0">
              <div
                className={`flex h-9 w-9 items-center justify-center rounded-lg text-sm font-semibold transition-colors ${
                  isSpeaking ? 'bg-foreground text-background' : 'bg-muted text-foreground'
                }`}
              >
                {persona.name.slice(0, 1)}
              </div>
              {isSpeaking && (
                <motion.span
                  className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface bg-emerald-500"
                  animate={{ scale: [1, 1.3, 1] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="truncate text-sm font-semibold text-foreground">{persona.name}</div>
              <div className="truncate text-caption text-muted-foreground">
                {persona.role} · {persona.vibe}
              </div>
            </div>
          </div>

          <div className="flex-1" />

          {/* status chips — quiet, uniform */}
          <div className="hidden items-center gap-1.5 text-caption text-muted-foreground md:flex">
            <span className={`rounded-md border px-1.5 py-0.5 ${isListening ? 'border-emerald-600/40 text-emerald-600' : 'border-border'}`}>
              {isListening ? 'rec' : 'idle'}
            </span>
            <span className="rounded-md border border-border px-1.5 py-0.5">
              {neural ? 'neural voice' : 'browser voice'}
            </span>
            <span className="rounded-md border border-border px-1.5 py-0.5">{modeLabel}</span>
          </div>

          {/* timer */}
          <div className="relative h-10 w-10 shrink-0">
            <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" className="stroke-border" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                className={lowTime ? 'stroke-destructive' : 'stroke-primary'}
                strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={`${progress * 97.4} 97.4`}
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-[11px] font-semibold tabular-nums ${lowTime ? 'text-destructive' : 'text-foreground'}`}>
              {mins}:{String(secs).padStart(2, '0')}
            </div>
          </div>
        </div>
        {/* progress rail */}
        <div className="h-0.5 bg-border/50">
          <motion.div
            className="h-full bg-primary"
            animate={{ width: `${(questionIndex / Math.max(1, questionTotal)) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      {/* ============ content column ============ */}
      <div className="mx-auto w-full max-w-4xl flex-1 px-4 py-6 lg:px-6">
        {/* interviewer bubble */}
        <AnimatePresence mode="wait">
          <motion.div
            key={caption.slice(0, 48)}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-5 rounded-lg border p-4 transition-colors lg:p-5 ${
              isSpeaking ? 'border-border bg-surface shadow-[inset_2px_0_0_hsl(var(--primary))]' : 'border-border bg-surface'
            }`}
          >
            <div className="mb-1.5 flex items-center gap-1.5 text-caption font-medium uppercase tracking-wider text-muted-foreground">
              <Brain className={`h-3.5 w-3.5 ${isSpeaking ? 'text-foreground' : 'text-muted-foreground'}`} />
              {PHASE_LABEL[phase] ?? 'Interviewer'}
            </div>
            <p className="text-base leading-relaxed text-foreground">{caption || '…'}</p>
          </motion.div>
        </AnimatePresence>

        {/* mode workspace */}
        {children}

        {/* answer transcript panel */}
        <div
          className={`mt-5 rounded-lg border p-4 transition-colors ${
            isListening ? 'border-emerald-600/40 bg-emerald-500/[0.04]' : 'border-border bg-surface'
          }`}
        >
          <div className="mb-2 flex items-center gap-2">
            <span className={`text-caption font-medium uppercase tracking-wider ${isListening ? 'text-emerald-600' : 'text-muted-foreground'}`}>
              {isListening ? 'Listening' : 'Your answer'}
            </span>
            {isListening && (
              <span className="flex h-3 items-end gap-0.5">
                {[0, 1, 2, 3].map((i) => (
                  <motion.span
                    key={i}
                    className="w-0.5 rounded-sm bg-emerald-500"
                    animate={{ height: [4, 12, 6, 10, 4] }}
                    transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.12 }}
                  />
                ))}
              </span>
            )}
          </div>
          <p className="min-h-12 text-sm leading-relaxed text-foreground">
            {finalTranscript || interim || (
              <span className="text-muted-foreground">
                {isListening ? '…listening' : 'Your words appear here as you speak'}
              </span>
            )}
          </p>

          {/* delivery metrics — uniform chips */}
          {delivery && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              <MetricChip label={`${delivery.words} words`} />
              <MetricChip label={`${delivery.paceWpm} wpm`} />
              <MetricChip
                label={`${delivery.fillers} fillers`}
                tone={delivery.fillerRate > 0.06 ? 'warn' : 'default'}
              />
              {delivery.longPauses > 0 && <MetricChip label={`${delivery.longPauses} long pauses`} />}
            </div>
          )}
        </div>

        {/* controls — one row, consistent sizes */}
        <div className="mt-4 flex items-center justify-center gap-2">
          <RoomControl onClick={onToggleMute} active={muted} title={muted ? 'Unmute' : 'Mute'}>
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </RoomControl>
          <RoomControl onClick={onTogglePause} active={paused} title={paused ? 'Resume' : 'Pause'}>
            {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
          </RoomControl>
          <RoomControl onClick={onReplay} title="Replay question">
            <RotateCcw className="h-4 w-4" />
          </RoomControl>
        </div>

        {voiceError && (
          <div className="mt-4 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-2.5 text-sm text-destructive">
            {voiceError === 'mic_denied'
              ? 'Microphone permission denied — allow mic access in your browser to answer by voice.'
              : voiceError === 'speech_recognition_unsupported'
                ? 'Live speech recognition needs Chrome or Edge. You can still answer by typing.'
                : voiceError}
          </div>
        )}
      </div>
    </div>
  );
}

function MetricChip({ label, tone = 'default' }: { label: string; tone?: 'default' | 'warn' }) {
  return (
    <span
      className={`rounded-md border px-2 py-0.5 text-caption ${
        tone === 'warn' ? 'border-amber-500/40 text-amber-600' : 'border-border text-muted-foreground'
      }`}
    >
      {label}
    </span>
  );
}

function RoomControl({
  children, onClick, active, title,
}: { children: React.ReactNode; onClick: () => void; active?: boolean; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      aria-label={title}
      className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors ${
        active
          ? 'border-primary/50 bg-primary/10 text-primary'
          : 'border-border bg-surface text-muted-foreground hover:bg-muted hover:text-foreground'
      }`}
    >
      {children}
    </button>
  );
}

export default InterviewRoom;
