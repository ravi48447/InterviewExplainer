'use client';

/**
 * FirstVisitTour — 3-step coach-mark overlay (the "no tutorials" complaint fix).
 * Shows once per device (localStorage), skippable anytime.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ArrowRight, MousePointerClick, Sparkles, Trophy } from 'lucide-react';

const KEY = 'ie_tour_done_v1';

const STEPS = [
  {
    title: 'Pick a round',
    body: 'Quick mock for a 15-minute drill, DSA to defend complexity, or a full company loop — the interviewer adapts to every answer you give.',
    icon: MousePointerClick,
    accent: '#e8a33d',
  },
  {
    title: 'See the verdict quality first',
    body: 'Every answer is scored against our expert-written answers — with receipts. Peek a sample report before your first session.',
    icon: Sparkles,
    accent: '#9ab8d4',
  },
  {
    title: 'Connect your resume',
    body: 'Drop your resume in and the dashboard maps your gaps — then mocks target exactly what you\'re missing. One prep, everything connected.',
    icon: Trophy,
    accent: '#a3c291',
  },
];

export function FirstVisitTour() {
  const [show, setShow] = useState(false);
  const [step, setStep] = useState(0);

  useEffect(() => {
    try {
      if (!localStorage.getItem(KEY)) setShow(true);
    } catch {}
  }, []);

  const done = () => {
    try { localStorage.setItem(KEY, '1'); } catch {}
    setShow(false);
  };

  if (!show) return null;
  const s = STEPS[step];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#121110]/80 flex items-center justify-center p-6"
        onClick={done}
      >
        <motion.div
          initial={{ scale: 0.95, y: 12 }} animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-sm w-full bg-[#141311] border border-[#3a362e] p-7 space-y-5"
          onClick={(e) => e.stopPropagation()}
        >
          <button onClick={done} className="absolute top-3 right-3 text-stone-600 hover:text-stone-300">
            <X className="h-4 w-4" />
          </button>

          <div className="h-11 w-11 rounded-xl flex items-center justify-center border" style={{ borderColor: s.accent + '55', background: s.accent + '15' }}>
            <s.icon className="h-5 w-5" style={{ color: s.accent }} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-[family-name:var(--font-fraunces)] text-[#f5f1e8]">{s.title}</h3>
            <p className="text-[13px] text-stone-400 leading-relaxed">{s.body}</p>
          </div>

          <div className="flex items-center gap-2">
            {STEPS.map((_, i) => (
              <span key={i} className="h-1 flex-1 rounded-full" style={{ background: i <= step ? s.accent : '#26241f' }} />
            ))}
          </div>

          <div className="flex gap-3">
            <button onClick={done} className="text-xs text-stone-600 hover:text-stone-300 py-2.5">skip</button>
            <button
              onClick={() => (step < STEPS.length - 1 ? setStep(step + 1) : done())}
              className="flex-1 inline-flex items-center justify-center gap-2 bg-[#e8a33d] text-[#1a1408] text-sm font-semibold py-2.5 hover:bg-[#f0b355] transition-colors"
            >
              {step < STEPS.length - 1 ? 'Next' : 'Start prepping'} <ArrowRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
