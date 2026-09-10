'use client';

/**
 * Offer Ready — the landing. Editorial premium: warm, human, quiet.
 */

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  Calendar, Target, Brain, Flame, Trophy, ArrowRight, Clock,
  Users, Building2, Check,
} from 'lucide-react';
import { TYPE, SURFACE, SHELL, Ambient, PHASE_STYLE, CTA, CTA_QUIET, RULE } from '@/lib/offer-ready/design';

const PHASES = [
  { id: 'foundation', icon: Target, name: 'Foundation', when: 'Week 1', what: 'Weak concepts become strengths. Daily drills your mastery data picks, DSA basics, redemption queued quietly.' },
  { id: 'depth', icon: Brain, name: 'Depth', when: 'Week 2', what: 'Live coding with dry-run debates. System design at your gap areas. Calibration coaching begins.' },
  { id: 'pressure', icon: Flame, name: 'Pressure', when: 'Week 3', what: 'Tier 4/5 sessions, rapid drills, peer role-swaps. Exposure training — performance under stress.' },
  { id: 'rehearsal', icon: Trophy, name: 'Rehearsal', when: 'Final days', what: 'The full company loop, a patch session on exactly what broke, then rest before the real thing.' },
];

const INSIDE = [
  'Weakness-targeted quick mocks', 'DSA with complexity debate',
  'Peer role-swap rounds', 'Adaptive day-by-day plan',
  'Tier-4/5 pressure sessions', '97 company loops, camera rounds',
  'Readiness scoring with receipts', 'Gentle scoring — never harsh',
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function OfferReadyLanding() {
  return (
    <div className={SHELL}>
      <Ambient />
      <main className="relative max-w-2xl mx-auto px-5 sm:px-6">

        {/* ============ HERO ============ */}
        <section className="pt-24 pb-20 space-y-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className={TYPE.eyebrow}
          >
            InterviewExplainer <span className="text-stone-600">·</span> Offer Ready
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.08, duration: 0.8, ease: EASE }}
            className={`${TYPE.displayLg} text-[#f5f1e8]`}
          >
            You have an interview.
            <br />
            We have the
            <br />
            <span className="italic text-[#e8a33d]">thirty days</span> before it.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.18, duration: 0.7, ease: EASE }}
            className={`${TYPE.lead} max-w-md text-[15px]`}
          >
            A day-by-day campaign that ends with a full dress rehearsal — built on
            exposure training, retrieval practice, and honest calibration.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.26, duration: 0.7, ease: EASE }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <Link href="/offer-ready/start" className={`group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-none ${CTA} text-sm`}>
              <Calendar className="h-4 w-4" />
              Build my campaign
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <div className="flex gap-3">
              <Link href="/mock-interviews" className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-none text-sm ${CTA_QUIET}`}>
                Browse mock modes
              </Link>
              <Link href="/offer-ready/campaign/demo" className={`inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-none text-sm ${CTA_QUIET}`}>
                See a live campaign
              </Link>
            </div>
          </motion.div>
        </section>

        {/* ============ THE JOURNEY ============ */}
        <section className={`${RULE} pt-14 pb-16 space-y-12`}>
          <div className="space-y-2">
            <div className={TYPE.eyebrow}>The method</div>
            <h2 className={`${TYPE.h1} text-[#f5f1e8]`}>Four phases. One outcome.</h2>
          </div>

          <div className="space-y-0">
            {PHASES.map((p, i) => {
              const s = PHASE_STYLE[p.id];
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.55, ease: EASE }}
                  className={`group grid grid-cols-[3.5rem_1fr] sm:grid-cols-[5rem_1fr_5rem] gap-4 sm:gap-6 py-8 ${i > 0 ? RULE : ''}`}
                >
                  <div className="text-right">
                    <div className={`${TYPE.num} text-lg ${s.text}`}>{String(i + 1).padStart(2, '0')}</div>
                    <div className="text-[10px] uppercase tracking-widest text-stone-600 mt-1">{p.when}</div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2.5">
                      <p.icon className={`h-4 w-4 ${s.text}`} />
                      <h3 className={`${TYPE.h2} text-[#f5f1e8]`}>{p.name}</h3>
                    </div>
                    <p className="text-sm text-stone-400 leading-relaxed max-w-md">{p.what}</p>
                  </div>
                  <div className="hidden sm:flex items-start justify-end pt-1">
                    <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                  </div>
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* ============ WHAT'S INSIDE ============ */}
        <section className={`${RULE} pt-14 pb-16 space-y-8`}>
          <div className="space-y-2">
            <div className={TYPE.eyebrow}>The arsenal</div>
            <h2 className={`${TYPE.h1} text-[#f5f1e8]`}>Everything works for you here</h2>
          </div>
          <div className="grid sm:grid-cols-2 gap-x-8 gap-y-3.5">
            {INSIDE.map((f, i) => (
              <motion.div
                key={f}
                initial={{ opacity: 0, y: 8 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ delay: i * 0.03, duration: 0.4 }}
                className="flex items-center gap-3 text-sm text-stone-300"
              >
                <span className="h-4 w-4 rounded-full border border-[#3a362e] flex items-center justify-center shrink-0">
                  <Check className="h-2.5 w-2.5 text-[#e8a33d]" />
                </span>
                {f}
              </motion.div>
            ))}
          </div>
        </section>

        {/* ============ SAMPLE WEEK ============ */}
        <section className={`${RULE} pt-14 pb-16 space-y-8`}>
          <div className="space-y-2">
            <div className={TYPE.eyebrow}>A real week</div>
            <h2 className={`${TYPE.h1} text-[#f5f1e8]`}>This is what it asks of you</h2>
          </div>
          <div className="divide-y divide-[#1f1d18] border-y border-[#1f1d18]">
            {[
              { day: 'Mon', t: 'Weakness drill', o: 'Redeem: connection pooling', m: '15 min', phase: 'foundation' },
              { day: 'Tue', t: 'DSA practice', o: 'One problem + complexity defense', m: '30 min', phase: 'foundation' },
              { day: 'Wed', t: 'Live coding', o: 'Camera on, dry-run gauntlet', m: '45 min', phase: 'depth' },
              { day: 'Thu', t: 'Recovery', o: 'Light review only. Spacing beats cramming.', m: '—', phase: 'depth' },
              { day: 'Fri', t: 'System design', o: 'One architecture problem at scale', m: '45 min', phase: 'depth' },
            ].map((d, i) => {
              const s = PHASE_STYLE[d.phase];
              return (
                <motion.div
                  key={d.day}
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }}
                  transition={{ delay: i * 0.05 }}
                  className="flex items-baseline gap-5 py-4"
                >
                  <span className="text-[11px] uppercase tracking-widest text-stone-600 w-8 shrink-0">{d.day}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-[#f5f1e8]">{d.t}</div>
                    <div className="text-xs text-stone-500 mt-0.5">{d.o}</div>
                  </div>
                  <span className="text-[11px] text-stone-600 shrink-0">{d.m}</span>
                  <span className={`h-1.5 w-1.5 rounded-full ${s.dot} shrink-0`} />
                </motion.div>
              );
            })}
          </div>
          <p className="text-[13px] text-stone-500 italic">
            The plan re-shapes daily from your mastery data. Miss a day and it re-flows — never guilt-trips.
          </p>
        </section>

        {/* ============ CLOSING ============ */}
        <section className={`${RULE} pt-16 pb-28 space-y-8`}>
          <h2 className={`${TYPE.displayLg} text-[#f5f1e8]`}>
            Walk in like<br />you've been there.
          </h2>
          <p className={`${TYPE.lead} max-w-md text-[15px]`}>
            Because you have. The campaign ends with your certificate of readiness —
            sessions, loops, and the arc that got you there.
          </p>
          <Link href="/offer-ready/start"
            className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-none ${CTA} text-sm`}>
            Start the thirty days
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
          </Link>
        </section>
      </main>
    </div>
  );
}
