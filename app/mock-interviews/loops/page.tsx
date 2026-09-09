'use client';

/**
 * Company Loops — full interview-loop simulators + the day-before rehearsal.
 * Amazon LP-heavy · Google DSA-heavy · Startup pragmatic. Interview Pro.
 */

import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building2, Calendar, ArrowRight, Play, Clock, Crown, Loader2, Sparkles,
  CalendarClock, Target,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface Loop {
  id: string;
  name: string;
  tagline: string;
  rounds: { label: string; minutes: number; mode: string }[];
  emphasis: string;
  plan: string;
}

interface Sched {
  loopName: string;
  interviewDate: string;
  days: { date: string; label: string; rounds: { label: string; minutes: number; mode: string }[]; minutes: number }[];
  emphasis: string;
  note: string;
}

export default function LoopsPage() {
  const [loops, setLoops] = useState<Loop[]>([]);
  const [sel, setSel] = useState<string | null>(null);
  const [date, setDate] = useState('');
  const [sched, setSched] = useState<Sched | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/engine/loops').then((r) => r.json()).then((d) => setLoops(d.loops ?? [])).catch(() => {});
  }, []);

  const planRehearsal = async () => {
    if (!sel || !date) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/engine/loops', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ loopId: sel, interviewDate: date }),
      });
      if (res.status === 401) {
        setError('Company-loop rehearsals are part of Interview Pro. Sign in to plan yours.');
        return;
      }
      const d = await res.json();
      if (!res.ok) throw new Error(d.error);
      setSched(d);
    } catch (e: any) {
      setError(e?.message || 'Could not plan the rehearsal.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#f5f1e8]">
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <header className="text-center space-y-3 pt-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 flex items-center justify-center">
            <Building2 className="h-7 w-7 text-blue-400" />
          </div>
          <h1 className="text-2xl font-black">Company Loops</h1>
          <p className="text-sm text-stone-400 max-w-lg mx-auto">
            Full interview-loop simulators — the real round structure, personas,
            and pacing. Plan a rehearsal ending the day before your actual interview.
          </p>
        </header>

        {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200 flex items-start gap-2">
            <Crown className="h-4 w-4 mt-0.5 shrink-0" /> {error}
            <a href="/pricing" className="underline ml-1 shrink-0">See plans</a>
          </div>
        )}

        {/* loop cards */}
        <div className="grid gap-4 md:grid-cols-3">
          {loops.map((l) => (
            <button
              key={l.id}
              onClick={() => { setSel(l.id); setSched(null); }}
              className={cn(
                'rounded-2xl border p-5 text-left space-y-3 transition',
                sel === l.id ? 'border-[#e8a33d]/50 bg-[#e8a33d]/10' : 'border-[#26241f] bg-[#141311] hover:bg-[#1a1917]'
              )}
            >
              <div className="flex items-center justify-between">
                <h3 className="font-bold">{l.name}</h3>
                {l.plan === 'interview_pro' && <span className="text-[9px] px-1.5 py-0.5 rounded bg-[#c08a5a]/20 text-[#d4a778]">PRO</span>}
              </div>
              <p className="text-xs text-stone-400">{l.tagline}</p>
              <div className="space-y-1">
                {l.rounds.map((r) => (
                  <div key={r.label} className="flex items-center gap-2 text-[11px] text-stone-300">
                    <span className="w-1 h-1 rounded-full bg-blue-400" /> {r.label}
                    <span className="text-stone-600 ml-auto">{r.minutes}m</span>
                  </div>
                ))}
              </div>
              <p className="text-[10px] text-stone-600 italic">{l.emphasis}</p>
            </button>
          ))}
        </div>

        {/* rehearsal planner */}
        {sel && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="rounded-2xl border border-[#26241f] bg-[#141311] p-5 space-y-4">
            <div className="font-semibold flex items-center gap-2">
              <CalendarClock className="h-4 w-4 text-blue-400" /> Day-before rehearsal planner
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="flex-1 rounded-xl bg-[#100f0d] border border-[#26241f] px-3 py-2.5 text-sm"
              />
              <Button onClick={planRehearsal} disabled={!date || busy} className="gap-2">
                {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Calendar className="h-4 w-4" />}
                Plan my rehearsal
              </Button>
            </div>

            {sched && (
              <div className="space-y-3 pt-2">
                <p className="text-xs text-stone-400">
                  {sched.loopName} · interview on {sched.interviewDate} · {sched.note}
                </p>
                {sched.days.map((d) => (
                  <div key={d.date} className="rounded-xl bg-[#100f0d] border border-[#26241f] p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-semibold">{d.label}</span>
                      <span className="text-[11px] text-stone-600">{d.minutes} min total</span>
                    </div>
                    <div className="space-y-2">
                      {d.rounds.map((r) => (
                        <a
                          key={r.label}
                          href={`/mock-interviews/audio?mode=${r.mode}&preset=${r.minutes <= 20 ? 'quick' : r.minutes <= 30 ? 'standard' : 'deep'}&domain=`}
                          className="flex items-center gap-3 rounded-lg bg-[#141311] hover:bg-[#1a1917] px-3 py-2.5 transition"
                        >
                          <Play className="h-3.5 w-3.5 text-blue-400 shrink-0" />
                          <span className="text-sm flex-1">{r.label}</span>
                          <span className="text-[11px] text-stone-600 capitalize">{r.mode} · {r.minutes}m</span>
                          <ArrowRight className="h-3.5 w-3.5 text-stone-600" />
                        </a>
                      ))}
                    </div>
                  </div>
                ))}
                <p className="text-[11px] text-stone-600 italic">{sched.emphasis}</p>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
