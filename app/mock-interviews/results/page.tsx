'use client';

/**
 * Session Report — real per-question verdicts with receipts.
 * Reads the report stashed by the session page (sessionStorage), renders
 * per-question breakdown, expert suggested answers, move-log replay, and
 * the radar delta. No mock scores.
 */

import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Brain, CheckCircle2, AlertTriangle, ChevronDown, Target,
  Sparkles, ShieldCheck, TrendingUp, Volume2, VolumeX, BookOpen, RotateCcw,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { buildReplayTimeline, replaySummary, transcriptWithTiming } from '@/lib/engine/replay.mjs';
import { Button } from '@/components/ui/button';

interface ReportQ {
  questionId: string;
  question: string;
  title?: string;
  move: string | null;
  score: number;
  coverage: { hit: string[]; missed: string[]; ratio: number };
  mistakeFlags: string[];
  suggested: { spoken: string; checklist: string[] };
  nextDrills: string[];
}

interface Report {
  sessionId: string | null;
  overallScore: number;
  turnsCount: number;
  perQuestion: ReportQ[];
  strongConcepts: { id: string; label: string; hits: number }[];
  weakConcepts: { id: string; label: string }[];
  moveLog: { turn: number; move: string; questionId: string | null; reason: string }[];
  methodology: string;
}

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const sessionId = searchParams?.get('session');
  const [report, setReport] = useState<Report | null>(null);
  const [open, setOpen] = useState<number | null>(0);
  const [notFound, setNotFound] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [playhead, setPlayhead] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [timeline, setTimeline] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);

  // build the replay timeline from the report
  useEffect(() => {
    if (!report?.perQuestion?.length) return;
    const turns = report.perQuestion.map((q: any) => ({
      questionId: q.questionId, question: q.question,
      transcript: (q as any).transcript ?? q.suggested?.spoken ?? '',
      move: q.move, score: q.score,
      ave: { score: q.score, coverage: q.coverage, mistakeFlags: q.mistakeFlags ?? [], signal: null },
    }));
    const tl = buildReplayTimeline(turns, report.moveLog ?? []);
    setTimeline(tl);
    setSummary(replaySummary(tl));
  }, [report]);

  // playhead ticker
  useEffect(() => {
    if (!playing || !timeline) return;
    if (playhead >= timeline.totalSeconds) { setPlaying(false); return; }
    const t = setTimeout(() => setPlayhead((p) => p + 0.5), 500);
    return () => clearTimeout(t);
  }, [playing, playhead, timeline]);

  const speakReview = () => {
    if (!report) return;
    if (speaking) { try { window.speechSynthesis.cancel(); } catch {} setSpeaking(false); return; }
    const parts = [`Your overall score is ${report.overallScore} out of 100.`];
    if (report.strongConcepts?.length) parts.push(`You were strong on ${report.strongConcepts.slice(0, 3).map((c) => c.label).join(', ')}.`);
    if (report.weakConcepts?.length) parts.push(`Focus next on ${report.weakConcepts.slice(0, 3).map((c) => c.label).join(', ')}.`);
    const u = new SpeechSynthesisUtterance(parts.join(' '));
    u.rate = 1.0;
    u.onend = () => setSpeaking(false);
    try { window.speechSynthesis.speak(u); setSpeaking(true); } catch {}
  };

  useEffect(() => {
    if (!sessionId) return;
    // demo report: no login, no session — the full verdict experience
    if (sessionId === 'demo') {
      import('@/lib/offer-ready/demoEcosystem').then(({ DEMO_REPORT }) => {
        setReport(DEMO_REPORT as any);
      });
      return;
    }
    const raw = sessionStorage.getItem(`ie_mock_report_${sessionId}`);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        setReport(parsed);
        // durable copy for reloads after the tab closes
        import('@/lib/engine/persist.mjs').then(({ saveFullReport }) => saveFullReport(sessionId, parsed)).catch(() => {});
        return;
      } catch {}
    }
    // tab closed / fresh load: the durable report store
    import('@/lib/engine/persist.mjs').then(({ getFullReport }) => {
      const durable = getFullReport(sessionId);
      if (durable) setReport(durable);
    }).catch(() => {});
    // persist.mjs keeps session records (score + meta) even if the full
    // report payload is gone (tab closed) — show the summary view then
    import('@/lib/engine/persist.mjs').then(({ getSessionRecord }) => {
      const rec = getSessionRecord(sessionId);
      if (rec) {
        setReport({
          sessionId: rec.sessionId,
          overallScore: rec.overallScore,
          turnsCount: rec.turnsCount,
          perQuestion: [],
          strongConcepts: [],
          weakConcepts: (rec.weakConcepts ?? []).map((c: string) => ({ id: c, label: c })),
          moveLog: [],
          methodology: 'Summary recovered from your saved sessions. Run a new mock for the full breakdown.',
        } as any);
        return;
      }
      setNotFound(true);
    });
  }, [sessionId]);

  if (notFound) {
    return (
      <Shell>
        <div className="text-center py-20 space-y-4">
          <AlertTriangle className="h-10 w-10 text-amber-400 mx-auto" />
          <p className="text-stone-400">Report not found — it may have expired with the tab.</p>
          <Button variant="outline" onClick={() => history.back()} className="gap-2">
            <ArrowLeft className="h-4 w-4" /> Back
          </Button>
        </div>
      </Shell>
    );
  }

  if (!report) {
    return (
      <Shell>
        <div className="py-20 text-center text-stone-400">Loading report…</div>
      </Shell>
    );
  }

  const scoreColor = report.overallScore >= 75 ? 'text-emerald-400' : report.overallScore >= 50 ? 'text-amber-400' : 'text-rose-400';

  return (
    <Shell>
      {/* header */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 rounded-2xl border border-[#26241f] bg-[#141311] p-6 space-y-3">
          <div className="flex items-center gap-3">
            <Brain className="h-8 w-8 text-blue-400" />
            <div>
              <h1 className="text-xl font-bold">Session Report</h1>
              <p className="text-xs text-stone-400">{report.turnsCount} questions · adaptive</p>
            </div>
          </div>
          <div className="flex items-end gap-3">
            <span className={cn('text-5xl font-black', scoreColor)}>{report.overallScore}</span>
            <span className="text-stone-400 pb-2">/ 100 concept-coverage score</span>
            <button onClick={speakReview} className="ml-auto inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#1a1917] hover:bg-white/15 text-xs shrink-0">
              {speaking ? <><VolumeX className="h-3.5 w-3.5" /> stop</> : <><Volume2 className="h-3.5 w-3.5" /> hear review</>}
            </button>
          </div>
          <p className="text-xs text-stone-600 flex items-start gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            {report.methodology}
          </p>
        </div>

        {/* concepts */}
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-6 space-y-3">
          <div className="text-sm font-semibold flex items-center gap-2">
            <Target className="h-4 w-4 text-blue-400" /> Concepts
          </div>
          <div className="flex-1 space-y-2 max-h-56 overflow-y-auto pr-1">
            {report.strongConcepts.slice(0, 8).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-xs">
                <span className="text-stone-300 truncate">{c.label}</span>
                <span className="flex items-center gap-1 text-emerald-400">
                  <CheckCircle2 className="h-3 w-3" /> {c.hits}×
                </span>
              </div>
            ))}
            {report.weakConcepts.slice(0, 8).map((c) => (
              <div key={c.id} className="flex items-center justify-between text-xs">
                <span className="text-stone-400 truncate">{c.label}</span>
                <span className="text-rose-400">missed</span>
              </div>
            ))}
          </div>
          {report.weakConcepts.length > 0 && (
            <p className="text-[11px] text-stone-600">
              Weak concepts are queued to your dashboard for the next session.
            </p>
          )}
        </div>
      </div>

      {/* ============ REPLAY TIMELINE — re-hear the session, marked ============ */}
      {timeline && summary && (
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-5 space-y-5 mt-6">
          <div className="flex items-baseline justify-between">
            <div className="text-xs uppercase tracking-[0.18em] text-stone-500">session replay</div>
            <div className="text-[11px] text-stone-600 tabular-nums">
              avg {summary.avgScore} · best {summary.bestTurn} · {summary.mistakeCount} mistake{summary.mistakeCount === 1 ? '' : 's'} flagged
            </div>
          </div>

          {/* the scrub bar with markers */}
          <div className="relative h-14">
            {/* base track */}
            <div className="absolute top-6 left-0 right-0 h-1 bg-[#26241f] rounded" />
            {/* progress fill */}
            <div className="absolute top-6 left-0 h-1 bg-[#e8a33d] rounded transition-all duration-500"
              style={{ width: `${timeline.totalSeconds ? (playhead / timeline.totalSeconds) * 100 : 0}%` }} />
            {/* playhead handle */}
            <div className="absolute top-3.5 w-4 h-4 rounded-full bg-[#e8a33d] border-2 border-[#121110] cursor-pointer shadow-sm transition-all duration-500"
              style={{ left: `calc(${timeline.totalSeconds ? (playhead / timeline.totalSeconds) * 100 : 0}% - 8px)` }}
              onClick={() => setPlaying(!playing)} />

            {/* events on the track */}
            {timeline.events.map((e: any, i: number) => {
              const left = timeline.totalSeconds ? (e.at / timeline.totalSeconds) * 100 : 0;
              if (e.type === 'question') {
                return <div key={i} title={`Q${e.turn}: ${e.label}`} className="absolute top-4 h-5 w-px bg-[#9ab8d4]" style={{ left: `${left}%` }} />;
              }
              if (e.type === 'verdict') {
                const tone = e.score >= 75 ? '#a3c291' : e.score >= 55 ? '#e8a33d' : e.score >= 35 ? '#c08a5a' : '#d49b9b';
                return <div key={i} title={`Q${e.turn} verdict: ${e.band} (${e.score})`} className="absolute top-2.5 h-3 w-3 rounded-full border-2" style={{ left: `calc(${left}% - 6px)`, borderColor: tone, background: playhead >= e.at ? tone : '#121110' }} />;
              }
              if (e.type === 'mistake') {
                return <div key={i} title={`⚠ ${e.label}`} className="absolute top-1 h-2.5 w-2.5 rotate-45 bg-[#d49b9b]" style={{ left: `calc(${left}% - 5px)` }} />;
              }
              if (e.type === 'callback') {
                return <div key={i} title={e.label} className="absolute bottom-0 h-2.5 w-2.5 rounded-full border border-[#c3aabf]" style={{ left: `calc(${left}% - 5px)`, background: playhead >= e.at ? '#c3aabf' : '#121110' }} />;
              }
              return null;
            })}
          </div>

          {/* controls + current context */}
          <div className="flex items-center gap-4">
            <button onClick={() => setPlaying(!playing)} className="h-9 w-9 rounded-full border border-[#3a362e] flex items-center justify-center hover:border-[#55503f] transition-colors">
              {playing ? '❚❚' : '▶'}
            </button>
            <div className="flex-1 min-w-0">
              <div className="text-xs text-stone-400 tabular-nums">
                {fmtTime(playhead)} / {fmtTime(timeline.totalSeconds)}
              </div>
              {/* current event caption */}
              <div className="text-[11px] text-stone-600 truncate">
                {currentCaption(timeline, playhead) ?? 'press play — or scrub the markers'}
              </div>
            </div>
            {summary.weakestTurn && (
              <button
                onClick={() => setPlayhead(timeline.events.find((e: any) => e.type === 'verdict' && e.turn === summary.weakestTurn.turn)?.at ?? 0)}
                className="text-[10px] px-2.5 py-1.5 border border-[#4a2d2d] text-[#d49b9b] hover:bg-[#1a1112] transition-colors shrink-0">
                jump to weakest (Q{summary.weakestTurn.turn})
              </button>
            )}
          </div>

          {/* legend */}
          <div className="flex flex-wrap gap-x-4 gap-y-1 text-[9px] text-stone-600">
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#a3c291]" /> strong</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#e8a33d]" /> solid</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full bg-[#d49b9b]" /> mistake flagged</span>
            <span className="flex items-center gap-1"><span className="h-2.5 w-2.5 rounded-full border border-[#c3aabf]" /> circle-back</span>
            <span className="flex items-center gap-1"><span className="h-3 w-px bg-[#9ab8d4]" /> question</span>
          </div>

          {/* weakest-turn receipts under the replay */}
          {summary.weakestTurn && summary.weakestTurn.missed?.length > 0 && (
            <div className="border-t border-[#1f1d18] pt-3 text-[11px] text-stone-500">
              <span className="text-[#d49b9b]">Weakest turn</span> missed: {summary.weakestTurn.missed.slice(0, 4).join(', ')}
            </div>
          )}
        </div>
      )}

      {/* per-question accordion */}
      <div className="space-y-3 mt-6">
        <h2 className="text-sm font-semibold text-stone-300 flex items-center gap-2">
          <TrendingUp className="h-4 w-4" /> Question by question
        </h2>
        {report.perQuestion.map((q, i) => (
          <div key={q.questionId + i} className="rounded-2xl border border-[#26241f] bg-[#141311] overflow-hidden">
            <button
              onClick={() => setOpen(open === i ? null : i)}
              className="w-full flex items-center gap-3 p-4 text-left hover:bg-[#141311]"
            >
              <span className={cn(
                'h-9 w-9 rounded-full flex items-center justify-center text-sm font-bold shrink-0',
                q.score >= 75 ? 'bg-emerald-500/15 text-emerald-400' :
                q.score >= 50 ? 'bg-amber-500/15 text-amber-400' : 'bg-rose-500/15 text-rose-400'
              )}>{q.score}</span>
              <div className="flex-1 min-w-0">
                <div className="text-sm text-stone-200 truncate">{q.question}</div>
                <div className="text-[11px] text-stone-600 flex gap-2 mt-0.5">
                  <span>{q.coverage.hit.length}/{q.coverage.hit.length + q.coverage.missed.length} concepts</span>
                  {q.move && <span>· {q.move}</span>}
                  {q.mistakeFlags?.length > 0 && <span className="text-amber-400">· mistake flagged</span>}
                </div>
              </div>
              <ChevronDown className={cn('h-4 w-4 text-stone-600 transition-transform', open === i && 'rotate-180')} />
            </button>
            {open === i && (
              <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} className="border-t border-[#1f1d18] px-4 py-4 space-y-4">
                {/* receipts */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="rounded-lg bg-emerald-500/5 border border-emerald-500/20 p-3">
                    <div className="text-emerald-400 font-semibold mb-1.5">You covered</div>
                    {q.coverage.hit.length ? q.coverage.hit.map((h) => (
                      <div key={h} className="flex items-start gap-1.5 text-stone-300">
                        <CheckCircle2 className="h-3 w-3 mt-0.5 text-emerald-400 shrink-0" /> {h}
                      </div>
                    )) : <span className="text-stone-600">none detected</span>}
                  </div>
                  <div className="rounded-lg bg-rose-500/5 border border-rose-500/20 p-3">
                    <div className="text-rose-400 font-semibold mb-1.5">Missed</div>
                    {q.coverage.missed.length ? q.coverage.missed.map((m) => (
                      <div key={m} className="flex items-start gap-1.5 text-stone-400">
                        <AlertTriangle className="h-3 w-3 mt-0.5 text-rose-400 shrink-0" /> {m}
                      </div>
                    )) : <span className="text-stone-600">nothing — full coverage</span>}
                  </div>
                </div>

                {/* suggested improved answer */}
                <div className="rounded-lg bg-[#e8a33d]/[0.04] border border-[#3a362e] p-3">
                  <div className="text-[#e8a33d] font-semibold mb-1.5 text-xs flex items-center gap-1.5">
                    <Sparkles className="h-3.5 w-3.5" /> How our expert answers it
                  </div>
                  <p className="text-sm text-stone-300 leading-relaxed">{q.suggested.spoken}</p>
                  {q.suggested.checklist?.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {q.suggested.checklist.slice(0, 5).map((c) => (
                        <li key={c} className="text-xs text-stone-400 flex items-start gap-1.5">
                          <CheckCircle2 className="h-3 w-3 mt-0.5 text-blue-400/70 shrink-0" /> {c}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                {/* drills */}
                {q.nextDrills?.length > 0 && (
                  <div className="text-xs text-stone-400">
                    <span className="font-semibold">Practice next:</span>{' '}
                    {q.nextDrills.join(' · ')}
                  </div>
                )}
              </motion.div>
            )}
          </div>
        ))}
      </div>

      {/* move log replay */}
      {report.moveLog?.length > 0 && (
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-4 mt-6">
          <h2 className="text-sm font-semibold text-stone-300 mb-3">Why the interviewer asked what it asked</h2>
          <ol className="space-y-1.5 text-xs text-stone-400">
            {report.moveLog.map((m, i) => (
              <li key={i} className="flex gap-2">
                <span className="text-stone-600 w-6 text-right">{m.turn}</span>
                <span className="px-1.5 rounded bg-[#e8a33d]/10 text-[#e8a33d] w-20 text-center shrink-0">{m.move}</span>
                <span className="truncate">{m.reason}</span>
              </li>
            ))}
          </ol>
        </div>
      )}

      <div className="flex gap-2 pt-4">
        <Button variant="outline" onClick={() => history.back()} className="gap-2">
          <ArrowLeft className="h-4 w-4" /> Back
        </Button>
        <Button onClick={() => location.href = '/mock-interviews'} className="gap-2">
          <RotateCcw className="h-4 w-4" /> New session
        </Button>
      </div>
    </Shell>
  );
}

function fmtTime(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(Math.floor(s % 60)).padStart(2, '0')}`;
}

function currentCaption(timeline: any, at: number) {
  const evs = timeline.events ?? [];
  let cur = null;
  for (const e of evs) if (e.at <= at) cur = e;
  if (!cur) return null;
  if (cur.type === 'question') return `Q${cur.turn} asked: "${cur.label}"`;
  if (cur.type === 'answer-start') return `Q${cur.turn} — your answer`;
  if (cur.type === 'verdict') return `Q${cur.turn} verdict: ${cur.band} (${cur.score}) — missed: ${cur.missed?.slice(0, 2).join(', ') || 'nothing'}`;
  if (cur.type === 'mistake') return `⚠ ${cur.label}`;
  if (cur.type === 'callback') return cur.label;
  return null;
}

function Shell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-[#121110] text-[#f5f1e8]">
      <main className="max-w-3xl mx-auto px-4 py-10">{children}</main>
    </div>
  );
}
