'use client';

/**
 * Offer Ready — the certificate. Editorial, ceremonial: ink on paper.
 */

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { Trophy, CheckCircle2, Loader2 } from 'lucide-react';
import { TYPE, SHELL, Ambient } from '@/lib/offer-ready/design';

const EASE = [0.22, 1, 0.36, 1] as const;

export default function CertificatePage() {
  const { id } = useParams<{ id: string }>();
  const [cert, setCert] = useState<any>(null);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    (async () => {
      const res = await fetch('/api/engine/campaign', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'certificate', campaignId: id }),
      });
      if (!res.ok) { setMissing(true); return; }
      setCert(await res.json());
    })();
  }, [id]);

  if (missing) return (
    <div className={SHELL}><Ambient />
      <main className="relative max-w-xl mx-auto px-5 py-24 text-center space-y-3">
        <Trophy className="h-9 w-9 text-muted-foreground/80 mx-auto" />
        <p className="text-muted-foreground">Certificate unlocks when your campaign completes.</p>
      </main>
    </div>
  );
  if (!cert) return (
    <div className={SHELL}><Ambient />
      <main className="relative max-w-xl mx-auto px-5 py-24 text-center text-muted-foreground flex items-center justify-center gap-2">
        <Loader2 className="h-4 w-4 animate-spin" /> preparing your certificate…
      </main>
    </div>
  );

  const W = 420, H = 64;
  const arc = cert.readinessArc ?? [];
  const pts = arc.length > 1
    ? arc.map((v: number, i: number) => [12 + (i * (W - 24)) / (arc.length - 1), H - 12 - (v / 100) * (H - 24)])
    : [];

  return (
    <div className={SHELL}>
      <Ambient />
      <main className="relative min-h-screen flex items-center justify-center px-5 py-16">
        <motion.article
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: EASE }}
          className="relative w-full max-w-lg border border-border bg-surface px-8 sm:px-12 py-12 space-y-10"
        >
          {/* double rule — the certificate feel */}
          <div className="absolute inset-2 border border-border pointer-events-none" />

          {/* masthead */}
          <header className="relative space-y-2 text-center">
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">
              InterviewExplainer
            </div>
            <div className="h-px w-16 mx-auto bg-border" />
            <div className="text-[10px] uppercase tracking-[0.3em] text-primary">
              Offer Ready
            </div>
          </header>

          {/* title */}
          <div className="relative text-center space-y-3">
            <h1 className={`${TYPE.display} text-3xl text-foreground`}>Certificate of Readiness</h1>
            <p className="text-[13px] text-muted-foreground">
              {cert.company} · {cert.level} · interview on {cert.interviewDate}
            </p>
          </div>

          {/* the arc */}
          {pts.length > 1 && (
            <div className="relative border-y border-border py-5">
              <div className="text-[9px] uppercase tracking-[0.25em] text-muted-foreground/80 mb-3 text-center">the readiness arc</div>
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-16">
                <polyline fill="none" stroke="#e8a33d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  points={pts.map((p: number[]) => p.join(',')).join(' ')} />
                {pts.length > 1 && (
                  <circle cx={pts[pts.length - 1][0]} cy={pts[pts.length - 1][1]} r="3" fill="#e8a33d" />
                )}
              </svg>
            </div>
          )}

          {/* stats — editorial table, no boxes */}
          <div className="relative grid grid-cols-3 divide-x divide-border text-center">
            {[
              { val: cert.daysCompleted, label: 'days' },
              { val: cert.sessionsCompleted, label: 'sessions' },
              { val: cert.loopsRun, label: 'full loops' },
            ].map((s) => (
              <div key={s.label} className="space-y-1 px-2">
                <div className={`${TYPE.num} text-3xl text-foreground`}>{s.val}</div>
                <div className="text-[9px] uppercase tracking-[0.2em] text-muted-foreground/80">{s.label}</div>
              </div>
            ))}
          </div>

          {/* the score */}
          <div className="relative text-center space-y-2 py-4 border-t border-b border-border">
            <div className={`${TYPE.num} text-7xl text-foreground`}>{cert.finalReadiness}</div>
            <div className="text-[10px] uppercase tracking-[0.25em] text-muted-foreground">final readiness</div>
          </div>

          {/* the line */}
          <p className="relative text-center text-[15px] text-foreground/70 italic leading-relaxed">
            {cert.line}
          </p>

          {/* seal */}
          <footer className="relative flex items-center justify-between pt-2">
            <div className="text-[9px] text-muted-foreground/80">
              issued {new Date(cert.issuedAt).toLocaleDateString('en-IN')}
              <br />
              {cert.campaignId}
            </div>
            <div className="h-12 w-12 rounded-full border border-border flex items-center justify-center">
              <CheckCircle2 className="h-5 w-5 text-primary" />
            </div>
          </footer>
        </motion.article>
      </main>
    </div>
  );
}
