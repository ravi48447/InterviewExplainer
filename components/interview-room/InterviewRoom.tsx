'use client';
/**
 * InterviewRoom.tsx — the immersive interview room shell.
 *
 * A real interview has PRESENCE: you see the interviewer, they speak in
 * turns, your words appear as you say them, and time pressure is visible.
 * This shell hosts any mode workspace beneath it.
 */

import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mic, MicOff, Volume2, VolumeX, Pause, Play, RotateCcw,
  Timer, Brain, Wifi, WifiOff, Gauge, ChevronDown,
} from 'lucide-react';
import type { VoicePhase, DeliveryMetrics } from '@/lib/engine/voiceController';

export interface RoomPersona {
  id: string;
  name: string;
  role: string;
  vibe: string;
}

const PHASE_LABEL: Record<VoicePhase, string> = {
  idle: 'Ready',
  preflight: 'Preparing…',
  synthesizing: 'Interviewer thinking…',
  speaking: 'Interviewer speaking',
  listening: 'Your turn — speak',
  thinking: 'Evaluating…',
  error: 'Audio error',
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
  children, // mode workspace
}: {
  persona: RoomPersona;
  neural: boolean;
  phase: VoicePhase | 'asking' | 'review' | 'done' | 'gated' | 'coding' | 'starting' | 'thinking' | 'listening' | 'ritual' | 'setup';
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

  return (
    <div className="min-h-screen bg-[#0d0c0a] text-stone-200 flex flex-col">
      {/* ================= top bar: persona + session telemetry ================= */}
      <header className="border-b border-[#26241f] bg-[#12110e]/95 backdrop-blur sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-2.5 flex items-center gap-3">
          {/* interviewer presence */}
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative shrink-0">
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center font-bold text-[15px] transition-colors ${
                  isSpeaking ? 'bg-[#e8a33d] text-[#1a1408]' : 'bg-[#26241f] text-[#a3c291]'
                }`}
              >
                {persona.name.slice(0, 1)}
              </div>
              {isSpeaking && (
                <motion.span
                  className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-emerald-400 border-2 border-[#12110e]"
                  animate={{ scale: [1, 1.25, 1] }}
                  transition={{ repeat: Infinity, duration: 1.1 }}
                />
              )}
            </div>
            <div className="min-w-0">
              <div className="text-sm font-bold leading-tight truncate">{persona.name}</div>
              <div className="text-[10px] text-stone-500 truncate">{persona.role} · {persona.vibe}</div>
            </div>
          </div>

          <div className="flex-1" />

          {/* live status */}
          <div className="flex items-center gap-3 text-[10px]">
            <span
              className={`flex items-center gap-1 ${isListening ? 'text-emerald-400 font-semibold' : 'text-stone-500'}`}
            >
              {isListening ? <Mic className="h-3 w-3" /> : <MicOff className="h-3 w-3" />}
              {isListening ? 'rec' : 'idle'}
            </span>
            <span className="flex items-center gap-1 text-stone-500">
              {neural ? <Volume2 className="h-3 w-3 text-[#a3c291]" /> : <VolumeX className="h-3 w-3" />}
              {neural ? 'neural' : 'browser'}
            </span>
            <span className="hidden sm:flex items-center gap-1 text-stone-500">
              <Gauge className="h-3 w-3" /> {modeLabel}
            </span>
          </div>

          {/* timer ring */}
          <div className="relative h-10 w-10 shrink-0">
            <svg viewBox="0 0 36 36" className="h-10 w-10 -rotate-90">
              <circle cx="18" cy="18" r="15.5" fill="none" stroke="#26241f" strokeWidth="2.5" />
              <circle
                cx="18" cy="18" r="15.5" fill="none"
                stroke={timeLeftSec < 60 ? '#f87171' : '#a3c291'}
                strokeWidth="2.5" strokeLinecap="round"
                strokeDasharray={`${progress * 97.4} 97.4`}
              />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-[10px] font-bold ${timeLeftSec < 60 ? 'text-rose-400' : ''}`}>
              {mins}:{String(secs).padStart(2, '0')}
            </div>
          </div>
        </div>
        {/* question progress rail */}
        <div className="h-0.5 bg-[#1a1916]">
          <motion.div
            className="h-full bg-[#e8a33d]"
            animate={{ width: `${(questionIndex / Math.max(1, questionTotal)) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
      </header>

      {/* ================= interviewer speech bubble ================= */}
      <div className="max-w-3xl mx-auto w-full px-4 pt-5">
        <AnimatePresence mode="wait">
          <motion.div
            key={caption.slice(0, 40)}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className={`rounded-2xl p-4 border transition-colors ${
              isSpeaking ? 'border-[#e8a33d]/50 bg-[#171410]' : 'border-[#26241f] bg-[#141311]'
            }`}
          >
            <div className="flex items-start gap-3">
              <Brain className={`h-4 w-4 mt-0.5 shrink-0 ${isSpeaking ? 'text-[#e8a33d]' : 'text-stone-600'}`} />
              <div>
                <div className="text-[10px] uppercase tracking-wider text-stone-500 mb-1">
                  {PHASE_LABEL[(phase as VoicePhase) ?? 'idle'] ?? 'Interviewer'}
                </div>
                <p className="text-[15px] leading-relaxed text-stone-200">{caption || '…'}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* ================= mode workspace ================= */}
      <div className="max-w-3xl mx-auto w-full px-4 py-5 flex-1">{children}</div>

      {/* ================= your answer panel ================= */}
      <div className="border-t border-[#26241f] bg-[#100f0d] sticky bottom-0">
        <div className="max-w-3xl mx-auto px-4 py-3">
          {voiceError && (
            <div className="mb-2 text-[11px] text-rose-300 bg-rose-950/40 border border-rose-900/50 rounded-lg px-3 py-2">
              {voiceError === 'mic_denied'
                ? 'Microphone permission denied — allow mic access in your browser to answer by voice.'
                : voiceError === 'speech_recognition_unsupported'
                  ? 'Live speech recognition needs Chrome or Edge. You can still answer by typing below.'
                  : voiceError}
            </div>
          )}
          <div
            className={`rounded-xl border p-3 min-h-[64px] transition-colors ${
              isListening ? 'border-emerald-800/60 bg-emerald-950/20' : 'border-[#26241f] bg-[#141311]'
            }`}
          >
            <div className="flex items-center gap-2 mb-1.5">
              <span className={`text-[10px] uppercase tracking-wider ${isListening ? 'text-emerald-400' : 'text-stone-600'}`}>
                {isListening ? 'Listening' : 'Your answer'}
              </span>
              {isListening && (
                <span className="flex gap-0.5 items-end h-3">
                  {[0, 1, 2, 3].map((i) => (
                    <motion.span
                      key={i}
                      className="w-0.5 rounded bg-emerald-400"
                      animate={{ height: [4, 12, 6, 10, 4] }}
                      transition={{ repeat: Infinity, duration: 0.9, delay: i * 0.12 }}
                    />
                  ))}
                </span>
              )}
            </div>
            <p className="text-sm text-stone-300 leading-relaxed">
              {finalTranscript || interim || <span className="text-stone-600">{isListening ? '…listening' : 'Your words appear here as you speak'}</span>}
              {interim && finalTranscript && <span className="text-stone-500 italic"> {interim}</span>}
            </p>
          </div>

          {/* delivery chips */}
          {delivery && (
            <div className="flex flex-wrap gap-2 mt-2 text-[10px] text-stone-500">
              <span className="rounded-full border border-[#26241f] px-2 py-0.5">{delivery.words} words</span>
              <span className="rounded-full border border-[#26241f] px-2 py-0.5">{delivery.paceWpm} wpm</span>
              <span className={`rounded-full border px-2 py-0.5 ${delivery.fillerRate > 0.06 ? 'text-amber-400 border-amber-900/50' : 'border-[#26241f]'}`}>
                {delivery.fillers} fillers
              </span>
              {delivery.longPauses > 0 && (
                <span className="rounded-full border border-[#26241f] px-2 py-0.5">{delivery.longPauses} long pauses</span>
              )}
            </div>
          )}

          {/* controls */}
          <div className="flex items-center justify-center gap-2 mt-3">
            <ControlButton onClick={onToggleMute} active={muted} title={muted ? 'Unmute interviewer' : 'Mute interviewer'}>
              {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
            </ControlButton>
            <ControlButton onClick={onTogglePause} active={paused} title={paused ? 'Resume' : 'Pause'}>
              {paused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </ControlButton>
            <ControlButton onClick={onReplay} title="Replay question">
              <RotateCcw className="h-4 w-4" />
            </ControlButton>
          </div>
        </div>
      </div>
    </div>
  );
}

function ControlButton({
  children, onClick, active, title,
}: { children: React.ReactNode; onClick: () => void; active?: boolean; title: string }) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`h-9 w-9 rounded-xl border flex items-center justify-center transition-colors ${
        active ? 'border-[#e8a33d]/60 bg-[#241c10] text-[#e8a33d]' : 'border-[#26241f] bg-[#141311] text-stone-400 hover:text-stone-200'
      }`}
    >
      {children}
    </button>
  );
}

export default InterviewRoom;
