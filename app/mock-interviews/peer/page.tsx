'use client';

/**
 * Peer Practice — role-swap interviews with real people.
 *
 * Join the matching queue by domain/level; when matched, one becomes the
 * interviewer (Director-assist console), the other the candidate. Both get
 * scored — the interviewer on probing variety and pacing, the candidate by AVE.
 *
 * Interview Pass feature (free users see the gate).
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Users, Loader2, Search, X, ArrowRight, Mic, ShieldCheck, Sparkles,
  Clock, Globe, Crown, CheckCircle2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

const DOMAINS = [
  'ruby-backend-fresher', 'ruby-backend-intermediate', 'go-fresher', 'go-intermediate',
  'java-backend-fresher', 'java-backend-intermediate', 'java-fullstack-fresher',
  'python-backend-fresher', 'frontend-fresher',
];

interface PhaseState {
  phase: 'setup' | 'searching' | 'matched';
  position?: number;
  waitSec?: number;
  match?: {
    matchId: string;
    host: { name: string; role: string };
    guest: { name: string; role: string };
    domain: string;
  };
}

export default function PeerPracticePage() {
  const [domain, setDomain] = useState('ruby-backend-fresher');
  const [level, setLevel] = useState('fresher');
  const [role, setRole] = useState('either');
  const [timezone, setTimezone] = useState('Asia/Kolkata');
  const [state, setState] = useState<PhaseState>({ phase: 'setup' });
  const [stats, setStats] = useState<{ waiting: number; avgWaitSeconds: number; byDomain: Record<string, number> } | null>(null);
  const [authed, setAuthed] = useState<boolean | null>(null);
  const pollRef = useRef<number | null>(null);

  useEffect(() => {
    (async () => {
      const [me, q] = await Promise.all([fetch('/api/auth/me'), fetch('/api/engine/match')]);
      setAuthed(me.ok);
      if (q.ok) setStats(await q.json());
      try { setTimezone(Intl.DateTimeFormat().resolvedOptions().timeZone); } catch {}
    })();
  }, []);

  const poll = useCallback(async () => {
    const res = await fetch('/api/engine/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'check' }),
    });
    if (res.ok) {
      const data = await res.json();
      if (data.matched) {
        setState({ phase: 'matched', match: data.match });
        if (pollRef.current) window.clearInterval(pollRef.current);
      } else if (data.queued) {
        setState((s) => ({ ...s, phase: 'searching', position: data.position, waitSec: data.waitSeconds }));
      }
    }
  }, []);

  const join = async () => {
    setState({ phase: 'searching' });
    const res = await fetch('/api/engine/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'join', name: 'You', domain, level, role, timezone }),
    });
    const data = await res.json();
    if (data.matched) {
      setState({ phase: 'matched', match: data.match });
    } else if (data.queued) {
      setState((s) => ({ ...s, phase: 'searching', position: data.position }));
      pollRef.current = window.setInterval(poll, 3000);
    }
  };

  const leave = async () => {
    if (pollRef.current) window.clearInterval(pollRef.current);
    await fetch('/api/engine/match', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'leave' }),
    });
    setState({ phase: 'setup' });
  };

  useEffect(() => () => { if (pollRef.current) window.clearInterval(pollRef.current); }, []);

  const enterRoom = () => {
    if (!state.match) return;
    const iAmHost = state.match.host.name === 'You';
    const myRole = iAmHost ? state.match.host.role : state.match.guest.role;
    location.href = `/mock-interviews/live?peer=1&role=${myRole === 'interviewer' ? 'host' : 'guest'}&domain=${state.match.domain}`;
  };

  return (
    <div className="min-h-screen bg-[#121110] text-[#f5f1e8]">
      <main className="max-w-2xl mx-auto px-4 py-10 space-y-6">
        <header className="text-center space-y-3 pt-4">
          <div className="mx-auto h-16 w-16 rounded-2xl bg-[#a98ba3]/10 border border-[#463643] flex items-center justify-center">
            <Users className="h-7 w-7 text-[#9ab8d4]" />
          </div>
          <h1 className="text-2xl font-black">Peer Practice</h1>
          <p className="text-sm text-stone-400 max-w-md mx-auto">
            Role-swap interviews with real people. Take both seats — interviewing
            trains your eye for what good answers look like.
          </p>
        </header>

        {/* SETUP */}
        {state.phase === 'setup' && (
          <div className="space-y-5">
            {authed === false ? (
              <div className="rounded-2xl border border-amber-500/25 bg-amber-500/10 p-4 text-sm text-amber-200 flex items-start gap-2">
                <Crown className="h-4 w-4 mt-0.5 shrink-0" />
                <div>Peer rooms need an account (free) — and live matching is part of Interview Pass.
                  <a href="/login" className="underline ml-1">Sign in</a> to continue.</div>
              </div>
            ) : null}

            <section className="space-y-3">
              <label className="text-sm font-semibold">Domain</label>
              <select value={domain} onChange={(e) => setDomain(e.target.value)}
                className="w-full rounded-xl bg-[#100f0d] border border-[#26241f] px-3 py-2.5 text-sm">
                {DOMAINS.map((d) => <option key={d} value={d}>{d.replace(/-/g, ' ')}</option>)}
              </select>
            </section>

            <section className="space-y-3">
              <label className="text-sm font-semibold">Your level</label>
              <div className="grid grid-cols-3 gap-2">
                {['fresher', 'intermediate', 'senior'].map((l) => (
                  <button key={l} onClick={() => setLevel(l)}
                    className={cn('rounded-xl border py-2.5 text-sm capitalize transition',
                      level === l ? 'border-indigo-500/60 bg-indigo-500/10' : 'border-[#26241f] bg-[#141311] hover:bg-[#1a1917]')}>
                    {l}
                  </button>
                ))}
              </div>
            </section>

            <section className="space-y-3">
              <label className="text-sm font-semibold">Preferred seat</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'either', label: 'Either', sub: 'flexible' },
                  { id: 'interviewer', label: 'Interviewer', sub: 'with assist' },
                  { id: 'candidate', label: 'Candidate', sub: 'get interviewed' },
                ].map((r) => (
                  <button key={r.id} onClick={() => setRole(r.id)}
                    className={cn('rounded-xl border py-2.5 text-sm transition',
                      role === r.id ? 'border-indigo-500/60 bg-indigo-500/10' : 'border-[#26241f] bg-[#141311] hover:bg-[#1a1917]')}>
                    <div>{r.label}</div>
                    <div className="text-[10px] text-stone-400">{r.sub}</div>
                  </button>
                ))}
              </div>
            </section>

            <Button size="lg" onClick={join} disabled={authed === false} className="w-full gap-2">
              <Search className="h-4 w-4" /> Find a peer
            </Button>

            {stats && (
              <div className="flex items-center justify-center gap-4 text-xs text-stone-600">
                <span className="flex items-center gap-1"><Users className="h-3 w-3" /> {stats.waiting} waiting</span>
                {stats.avgWaitSeconds > 0 && <span className="flex items-center gap-1"><Clock className="h-3 w-3" /> avg wait {stats.avgWaitSeconds}s</span>}
                <span className="flex items-center gap-1"><Globe className="h-3 w-3" /> your timezone: {timezone}</span>
              </div>
            )}
          </div>
        )}

        {/* SEARCHING */}
        {state.phase === 'searching' && (
          <div className="text-center space-y-6 py-12">
            <div className="relative mx-auto h-28 w-28">
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-indigo-500/30"
                animate={{ scale: [1, 1.4, 1], opacity: [0.8, 0.2, 0.8] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
              />
              <motion.div
                className="absolute inset-0 rounded-full border-2 border-[#a98ba3]/50"
                animate={{ scale: [1.2, 1, 1.2], opacity: [0.3, 0.9, 0.3] }}
                transition={{ repeat: Infinity, duration: 2.4 }}
              />
              <Search className="absolute inset-0 m-auto h-8 w-8 text-[#9ab8d4]" />
            </div>
            <div className="space-y-1">
              <p className="font-semibold">Finding your peer…</p>
              <p className="text-xs text-stone-600">
                position {state.position ?? '—'} in queue · waited {state.waitSec ?? 0}s · matching on domain + level + timezone
              </p>
            </div>
            <Button variant="outline" onClick={leave} className="gap-1.5">
              <X className="h-4 w-4" /> Leave queue
            </Button>
            <p className="text-[11px] text-stone-700 max-w-sm mx-auto">
              Tip: while you wait, run a solo Director session — your weak concepts get
              shared with your peer interviewer for a targeted first question.
            </p>
          </div>
        )}

        {/* MATCHED */}
        {state.phase === 'matched' && state.match && (
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="space-y-5">
            <div className="text-center space-y-2">
              <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
              <h2 className="text-xl font-bold">Match found!</h2>
            </div>
            <div className="rounded-2xl border border-emerald-500/25 bg-emerald-500/[0.05] p-5 space-y-4">
              <div className="flex items-center justify-around text-center">
                <div>
                  <div className="font-bold">{state.match.host.name}</div>
                  <div className="text-xs text-[#9ab8d4] capitalize">{state.match.host.role}</div>
                </div>
                <div className="text-stone-600">vs</div>
                <div>
                  <div className="font-bold">{state.match.guest.name}</div>
                  <div className="text-xs text-emerald-300 capitalize">{state.match.guest.role}</div>
                </div>
              </div>
              <div className="text-center text-xs text-stone-400 capitalize">
                {state.match.domain.replace(/-/g, ' ')} · Director-assist for the interviewer
              </div>
              <Button size="lg" onClick={enterRoom} className="w-full gap-2">
                <Mic className="h-4 w-4" /> Enter the room <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
            <p className="text-[11px] text-stone-600 text-center flex items-center justify-center gap-1">
              <ShieldCheck className="h-3 w-3" /> Both sides are scored — interviewer quality (probe variety, pacing) + candidate concepts.
            </p>
          </motion.div>
        )}
      </main>
    </div>
  );
}
