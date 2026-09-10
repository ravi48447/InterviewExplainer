'use client';

/**
 * MockTrendsCard — session history + score trend + streak, from the
 * persistence layer (survives tab close). Pure CSS/SVG visuals, no chart lib.
 */

import React, { useState, useEffect } from 'react';
import { TrendingUp, Flame, History, Mic, Code2, MessageSquare, ArrowRight, Trophy } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface SessionRec {
  sessionId: string;
  domain: string;
  mode: string;
  preset: string;
  presetMinutes: number;
  overallScore: number;
  turnsCount: number;
  weakConcepts: string[];
  savedAt: number;
}

export function MockTrendsCard() {
  const [sessions, setSessions] = useState<SessionRec[]>([]);
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    (async () => {
      const { getSessionRecords, streakInfo } = await import('@/lib/engine/persist.mjs');
      setSessions(getSessionRecords());
      setStreak(streakInfo().days);
    })();
  }, []);

  const scores = sessions.slice(0, 12).reverse();
  const avg = sessions.length ? Math.round(sessions.reduce((a, s) => a + s.overallScore, 0) / sessions.length) : 0;
  const best = sessions.length ? Math.max(...sessions.map((s) => s.overallScore)) : 0;

  // SVG sparkline
  const W = 560, H = 90, PAD = 8;
  const pts = scores.length > 1
    ? scores.map((s, i) => [
        PAD + (i * (W - 2 * PAD)) / (scores.length - 1),
        H - PAD - (s.overallScore / 100) * (H - 2 * PAD),
      ])
    : [];

  return (
    <Card className="border-white/10 overflow-hidden">
      <div className="p-5 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-semibold">
            <TrendingUp className="h-4 w-4 text-blue-400" /> Mock interview progress
          </div>
          {streak > 0 && (
            <span className="flex items-center gap-1 text-xs text-amber-400">
              <Flame className="h-3.5 w-3.5" /> {streak}-day streak
            </span>
          )}
        </div>

        {sessions.length === 0 ? (
          <div className="text-center py-8 space-y-3">
            <p className="text-sm text-slate-400">No sessions yet — your trend starts with your first mock.</p>
            <a href="/mock-interviews" className="inline-flex items-center gap-2 text-sm text-blue-400 hover:underline">
              Start a mock interview <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        ) : (
          <>
            {/* stat chips */}
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="rounded-xl bg-white/5 p-2.5">
                <div className="text-xl font-black">{sessions.length}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">sessions</div>
              </div>
              <div className="rounded-xl bg-white/5 p-2.5">
                <div className="text-xl font-black text-blue-400">{avg}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">avg score</div>
              </div>
              <div className="rounded-xl bg-white/5 p-2.5">
                <div className="text-xl font-black text-emerald-400">{best}</div>
                <div className="text-[10px] text-slate-400 uppercase tracking-wide">best</div>
              </div>
            </div>

            {/* sparkline */}
            {pts.length > 1 && (
              <svg viewBox={`0 0 ${W} ${H}`} className="w-full h-20">
                <polyline
                  fill="none"
                  stroke="url(#g)"
                  strokeWidth="3"
                  strokeLinejoin="round"
                  strokeLinecap="round"
                  points={pts.map((p) => p.join(',')).join(' ')}
                />
                {pts.map((p, i) => (
                  <circle key={i} cx={p[0]} cy={p[1]} r="3.5" fill={scores[i].overallScore >= 75 ? '#34d399' : scores[i].overallScore >= 50 ? '#60a5fa' : '#f87171'} />
                ))}
                <defs>
                  <linearGradient id="g" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#3b82f6" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            )}

            {/* recent sessions */}
            <div className="space-y-1.5 max-h-44 overflow-y-auto pr-1">
              {sessions.slice(0, 5).map((s) => (
                <a
                  key={s.sessionId}
                  href={`/mock-interviews/results?session=${s.sessionId}`}
                  className="flex items-center gap-3 rounded-xl bg-white/5 hover:bg-white/10 p-2.5 transition"
                >
                  {s.mode === 'coding' ? <Code2 className="h-4 w-4 text-emerald-400 shrink-0" /> : s.mode === 'behavioral' ? <MessageSquare className="h-4 w-4 text-rose-400 shrink-0" /> : <Mic className="h-4 w-4 text-blue-400 shrink-0" />}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs truncate">{s.domain?.replace(/-/g, ' ') ?? 'session'} · {s.presetMinutes} min</div>
                    <div className="text-[10px] text-slate-500">{new Date(s.savedAt).toLocaleDateString()} · {s.turnsCount} questions</div>
                  </div>
                  <span className={cn(
                    'text-sm font-bold',
                    s.overallScore >= 75 ? 'text-emerald-400' : s.overallScore >= 50 ? 'text-blue-400' : 'text-rose-400'
                  )}>{s.overallScore}</span>
                </a>
              ))}
            </div>
          </>
        )}
      </div>
    </Card>
  );
}
