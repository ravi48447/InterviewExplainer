'use client';

/**
 * Offer Ready — the creation wizard. Editorial premium.
 */

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Calendar, Building2, Clock, ArrowRight, ArrowLeft, CheckCircle2, Loader2, Sparkles, Flame, Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { TYPE, SURFACE, SHELL, Ambient, PHASE_STYLE, CTA, CTA_QUIET } from '@/lib/offer-ready/design';

const DOMAINS = [
  'ruby-backend-fresher', 'ruby-backend-intermediate', 'go-fresher', 'go-intermediate',
  'java-backend-fresher', 'java-backend-intermediate', 'java-fullstack-fresher',
  'java-fullstack-intermediate', 'python-backend-fresher', 'frontend-fresher',
];

const COMPANIES = [
  { id: 'amazon', label: 'Amazon' }, { id: 'google', label: 'Google' },
  { id: 'flipkart', label: 'Flipkart' }, { id: 'microsoft', label: 'Microsoft' },
  { id: 'swiggy', label: 'Swiggy' }, { id: 'razorpay', label: 'Razorpay' },
  { id: 'tcs', label: 'TCS' }, { id: 'deshaw', label: 'DE Shaw' },
  { id: 'walmart', label: 'Walmart' }, { id: 'qualcomm', label: 'Qualcomm' },
  { id: 'meta', label: 'Meta' }, { id: 'phonepe', label: 'PhonePe' },
];

const STEPS = [
  { n: 1, label: 'When', icon: Calendar },
  { n: 2, label: 'Where', icon: Building2 },
  { n: 3, label: 'How', icon: Target },
  { n: 4, label: 'Preview', icon: Sparkles },
];

const EASE = [0.22, 1, 0.36, 1] as const;

export default function OfferReadyStartPage() {
  const [step, setStep] = useState(1);
  const [interviewDate, setInterviewDate] = useState('');
  const [company, setCompany] = useState('');
  const [level, setLevel] = useState<'fresher' | 'intermediate'>('fresher');
  const [domains, setDomains] = useState<string[]>(['ruby-backend-fresher']);
  const [minutesPerDay, setMinutesPerDay] = useState(30);
  const [daysPerWeek, setDaysPerWeek] = useState(5);
  const [preview, setPreview] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [created, setCreated] = useState<any>(null);

  const daysUntil = interviewDate ? Math.ceil((new Date(interviewDate).getTime() - Date.now()) / 86400000) : null;
  const trackName = daysUntil == null ? '' : daysUntil <= 10 ? 'Sprint track — intensive' : daysUntil <= 21 ? 'Two-phase campaign' : 'Full four-phase campaign';

  const toggleDomain = (d: string) =>
    setDomains((cur) => (cur.includes(d) ? cur.filter((x) => x !== d) : cur.length < 3 ? [...cur, d] : cur));

  const generatePreview = async () => {
    setBusy(true); setError(null);
    try {
      // send the wizard's ACTUAL selections so the preview represents the
      // chosen target (the old call hardcoded Ruby + defaults and ignored
      // every choice made in steps 1–3).
      const qs = new URLSearchParams({ preview: '1' });
      if (interviewDate) qs.set('interviewDate', interviewDate);
      if (level) qs.set('level', level);
      if (domains.length) qs.set('domains', domains.join(','));
      if (minutesPerDay) qs.set('minutesPerDay', String(minutesPerDay));
      if (daysPerWeek) qs.set('daysPerWeek', String(daysPerWeek));
      const res = await fetch(`/api/engine/campaign?${qs.toString()}`);
      setPreview((await res.json()).campaign);
      setStep(4);
    } catch { setError('Could not generate preview.'); } finally { setBusy(false); }
  };

  const createCampaign = async () => {
    setBusy(true); setError(null);
    try {
      const res = await fetch('/api/engine/campaign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', interviewDate, company: company || undefined, level, domains, minutesPerDay, daysPerWeek }),
      });
      const data = await res.json();
      if (res.status === 401) { setError('Sign in (free) to save your campaign.'); return; }
      if (!res.ok) throw new Error(data.error || 'creation failed');
      setCreated(data.campaign);
    } catch (e: any) { setError(e?.message || 'Could not create the campaign.'); } finally { setBusy(false); }
  };

  return (
    <div className={SHELL}>
      <Ambient />
      <main className="relative max-w-xl mx-auto px-5 sm:px-6 py-14 space-y-10">

        {/* header */}
        <div className="flex items-center gap-4">
          <Link href="/offer-ready" className="h-9 w-9 flex items-center justify-center text-stone-500 hover:text-stone-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <div>
            <div className={TYPE.eyebrow}>Offer Ready</div>
            <h1 className={`${TYPE.h2} text-foreground -mt-0.5`}>Build your campaign</h1>
          </div>
        </div>

        {/* steps as editorial contents line */}
        <div className="flex items-baseline gap-2 text-sm">
          {STEPS.map((s, i) => (
            <React.Fragment key={s.n}>
              <button onClick={() => s.n < step && setStep(s.n)}
                className={cn(
                  'transition-colors',
                  step === s.n ? 'text-primary' : step > s.n ? 'text-stone-400 hover:text-stone-200' : 'text-stone-700'
                )}>
                {step > s.n && <CheckCircle2 className="inline h-3 w-3 -mt-0.5 mr-1" />}
                {s.label}
              </button>
              {i < STEPS.length - 1 && <span className="text-stone-700">·</span>}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="border border-border bg-surface px-4 py-3 text-sm text-primary">
            {error}
          </div>
        )}

        <AnimatePresence mode="wait">
          {/* STEP 1 */}
          {step === 1 && (
            <motion.section key="s1" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}
              className="space-y-8">
              <div className="space-y-2">
                <div className={TYPE.eyebrow}>Step one</div>
                <h2 className={`${TYPE.h1} text-foreground`}>When's the interview?</h2>
              </div>
              <div className="space-y-4">
                <input type="date" value={interviewDate} min={new Date(Date.now() + 3 * 86400000).toISOString().slice(0, 10)}
                  onChange={(e) => setInterviewDate(e.target.value)}
                  className="w-full bg-transparent border-b-2 border-border focus:border-border outline-none px-1 py-3 text-lg text-foreground transition-colors" />
                {daysUntil != null && daysUntil > 0 && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm text-stone-400">
                    {daysUntil} days out — <span className="text-primary italic">{trackName}</span>
                  </motion.p>
                )}
              </div>
              <p className="text-[13px] text-stone-500 italic">
                No date yet? Come back when you have one — the campaign works backward from the real thing.
              </p>
              <button onClick={() => setStep(2)} disabled={!interviewDate}
                className={`group w-full inline-flex items-center justify-center gap-2.5 px-7 py-4 rounded-none ${CTA} text-sm disabled:opacity-30 disabled:pointer-events-none`}>
                Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </button>
            </motion.section>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <motion.section key="s2" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}
              className="space-y-8">
              <div className="space-y-2">
                <div className={TYPE.eyebrow}>Step two</div>
                <h2 className={`${TYPE.h1} text-foreground`}>Which company & level?</h2>
              </div>
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-y-2 gap-x-3">
                {COMPANIES.map((c) => (
                  <button key={c.id} onClick={() => setCompany(c.id)}
                    className={cn(
                      'text-left py-1.5 text-[13px] transition-colors border-b',
                      company === c.id ? 'text-primary border-border' : 'text-stone-400 border-transparent hover:text-stone-200'
                    )}>
                    {c.label}
                  </button>
                ))}
              </div>
              <div className="flex gap-6">
                {(['fresher', 'intermediate'] as const).map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={cn(
                      'py-1.5 text-sm border-b transition-colors capitalize',
                      level === l ? 'text-primary border-border' : 'text-stone-400 border-transparent hover:text-stone-200'
                    )}>
                    {l}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(1)} className={`inline-flex items-center gap-1.5 px-5 py-3.5 rounded-none ${CTA_QUIET} text-sm`}>
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setStep(3)}
                  className={`group flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-none ${CTA} text-sm`}>
                  Continue <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </button>
              </div>
            </motion.section>
          )}

          {/* STEP 3 */}
          {step === 3 && (
            <motion.section key="s3" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}
              className="space-y-8">
              <div className="space-y-2">
                <div className={TYPE.eyebrow}>Step three</div>
                <h2 className={`${TYPE.h1} text-foreground`}>Your prep reality</h2>
              </div>
              <div className="space-y-2">
                <div className="text-xs text-stone-500">Domains — up to 3</div>
                <div className="grid grid-cols-2 gap-x-6 gap-y-2">
                  {DOMAINS.map((d) => (
                    <button key={d} onClick={() => toggleDomain(d)}
                      className={cn(
                        'text-left py-1.5 text-[13px] border-b transition-colors',
                        domains.includes(d) ? 'text-primary border-border' : 'text-stone-500 border-transparent hover:text-stone-300'
                      )}>
                      {d.replace(/-/g, ' ')}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <div className="text-xs text-stone-500 flex items-center gap-1.5"><Clock className="h-3 w-3" /> Minutes / day</div>
                  <div className="flex gap-4">
                    {[15, 30, 45, 60].map((m) => (
                      <button key={m} onClick={() => setMinutesPerDay(m)}
                        className={cn('py-1 text-sm border-b transition-colors',
                          minutesPerDay === m ? 'text-primary border-border' : 'text-stone-500 border-transparent hover:text-stone-300')}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-xs text-stone-500">Days / week</div>
                  <div className="flex gap-4">
                    {[3, 4, 5, 6].map((d) => (
                      <button key={d} onClick={() => setDaysPerWeek(d)}
                        className={cn('py-1 text-sm border-b transition-colors',
                          daysPerWeek === d ? 'text-primary border-border' : 'text-stone-500 border-transparent hover:text-stone-300')}>
                        {d}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button onClick={() => setStep(2)} className={`inline-flex items-center gap-1.5 px-5 py-3.5 rounded-none ${CTA_QUIET} text-sm`}>
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button onClick={generatePreview} disabled={busy}
                  className={`group flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-none ${CTA} text-sm disabled:opacity-50`}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
                  Generate my preview
                </button>
              </div>
            </motion.section>
          )}

          {/* STEP 4 */}
          {step === 4 && preview && !created && (
            <motion.section key="s4" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35, ease: EASE }}
              className="space-y-8">
              <div className="space-y-2">
                <div className={TYPE.eyebrow}>Week one, shaped for you</div>
                <h2 className={`${TYPE.h1} text-foreground`}>Your first days</h2>
              </div>
              <div className="divide-y divide-border border-y border-border">
                {preview.days.map((d: any) => {
                  const s = PHASE_STYLE[d.phase] ?? PHASE_STYLE.foundation;
                  return (
                    <div key={d.date} className="flex items-baseline gap-5 py-4">
                      <span className="text-[11px] uppercase tracking-widest text-stone-600 w-12 shrink-0">
                        {new Date(d.date).toLocaleDateString('en-IN', { weekday: 'short' })}
                      </span>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{d.title}</div>
                        <div className="text-xs text-stone-500 mt-0.5">{d.oneThing}</div>
                      </div>
                      <span className={`h-1.5 w-1.5 rounded-full ${s.dot} shrink-0`} />
                    </div>
                  );
                })}
              </div>
              <p className="text-[13px] text-stone-500 italic">The full campaign adapts daily from your mastery data.</p>
              <div className="flex gap-3">
                <button onClick={() => setStep(3)} className={`inline-flex items-center gap-1.5 px-5 py-3.5 rounded-none ${CTA_QUIET} text-sm`}>
                  <ArrowLeft className="h-4 w-4" />
                </button>
                <button onClick={createCampaign} disabled={busy}
                  className={`group flex-1 inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-none ${CTA} text-sm disabled:opacity-50`}>
                  {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Flame className="h-4 w-4" />}
                  Start my campaign
                </button>
              </div>
            </motion.section>
          )}
        </AnimatePresence>

        {/* CREATED */}
        {created && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}
            className="border border-border bg-surface p-8 space-y-5 text-center">
            <CheckCircle2 className="h-8 w-8 mx-auto" style={{ color: 'hsl(var(--primary))' }} />
            <h2 className={`${TYPE.h1} text-foreground`}>Campaign created</h2>
            <p className="text-sm text-stone-400">
              {created.days.length} days to <span className="text-foreground">{created.companyName ?? 'your interview'}</span> on {created.interviewDate}.
            </p>
            <button onClick={() => (location.href = `/offer-ready/campaign/${created.id}`)}
              className={`group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-none ${CTA} text-sm`}>
              Open my dashboard <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </button>
          </motion.div>
        )}
      </main>
    </div>
  );
}
