'use client';

/**
 * Resume Analysis — the graph's entry point.
 * Paste-first (dependency-free). Skills map onto the concept registry,
 * readiness vs a target domain, gaps deep-link into content, hygiene report.
 * Claimed skills feed the mastery store (upgradeable via mock interviews).
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Sparkles, Target, AlertTriangle, CheckCircle2, Loader2,
  Upload, Wand2, TrendingUp, ShieldCheck, Mic, BookOpen,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { recordEvidence } from '@/lib/engine/mastery.mjs';
import { DEMO_RESUME, DEMO_RESUME_TEXT } from '@/lib/offer-ready/demoEcosystem';

interface Analysis {
  claimedConceptIds?: string[];
  skills: { id: string; label: string; topics?: string[] }[];
  skillsByDomain: Record<string, string[]>;
  targetDomain: string | null;
  readiness: { domain: string; score: number; ratio: number; covered: number; partial: number; missing: number; conceptCount: number } | null;
  gaps: { topicId: string; topic: string; title: string; importance: string; missingConcepts: string[]; missingConceptIds?: string[]; learnUrl: string }[];
  hygiene: { score: number; checks: { id: string; label: string; ok: boolean; detail: string }[] };
  seam: string;
}

const DOMAINS = [
  'ruby-backend-fresher',
  'ruby-backend-intermediate',
  'go-fresher',
  'go-intermediate',
  'java-backend-fresher',
  'java-backend-intermediate',
  'java-fullstack-fresher',
  'java-fullstack-intermediate',
  'python-backend-fresher',
  'frontend-fresher',
];

function studioHref(domain: string, conceptIds: string[] = []) {
  const params = new URLSearchParams({ domain });
  if (conceptIds.length) params.set('concepts', conceptIds.join(','));
  return `/mock-interviews?${params.toString()}`;
}

export default function ResumeAnalysisPage() {
  const [text, setText] = useState('');
  const [targetDomain, setTargetDomain] = useState('ruby-backend-fresher');
  const [busy, setBusy] = useState(false);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saved, setSaved] = useState(false);
  const [isDemo, setIsDemo] = useState(false);
  const [parseNote, setParseNote] = useState<string | null>(null);

  // demo mode: guests see the full analysis story without typing a word
  useEffect(() => {
    (async () => {
      const me = await fetch('/api/auth/me').catch(() => null);
      if (!me || !me.ok) {
        setAnalysis(DEMO_RESUME as any);
        setIsDemo(true);
        setText(DEMO_RESUME_TEXT);
      }
    })();
  }, []);

  const analyze = async () => {
    setBusy(true);
    setError(null);
    setSaved(false);
    try {
      const res = await fetch('/api/engine/resume', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text, targetDomain }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).error || 'analysis failed');
      const data: Analysis = await res.json();
      setAnalysis(data);
      // record claimed evidence into the mastery store (the loop's entry)
      if (data.claimedConceptIds?.length) {
        recordEvidence(data.claimedConceptIds, 'claimed');
      }
    } catch (e: any) {
      setError(e?.message || 'Analysis failed.');
    } finally {
      setBusy(false);
    }
  };

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setError(null);
    setAnalysis(null);
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append('file', f);
      fd.append('targetDomain', targetDomain);
      const res = await fetch('/api/engine/resume-upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (data.lowConfidence) {
        setError(data.message || 'Could not read this file reliably. Paste your resume text instead.');
        return;
      }
      if (!res.ok) throw new Error(data.error || 'upload failed');
      setAnalysis(data);
      if (data.parse?.method === 'pdf' || data.parse?.method === 'docx') {
        setParseNote(`Parsed ${data.parse.method.toUpperCase()} — ${data.parse.words} words (${data.parse.confidence} confidence).`);
      } else {
        setParseNote(null);
      }
      if (data.claimedConceptIds?.length) {
        recordEvidence(data.claimedConceptIds, 'claimed');
      }
    } catch (err: any) {
      setError(err?.message || 'Upload failed.');
    } finally {
      setBusy(false);
    }
  };

  const readinessColor = (s: number) => (s >= 60 ? 'text-emerald-400' : s >= 30 ? 'text-amber-400' : 'text-rose-400');

  return (
    <div className="min-h-screen bg-[#121110] text-[#f5f1e8]">
      <main className="max-w-3xl mx-auto px-4 py-10 space-y-6">
        <header className="space-y-2">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <FileText className="h-7 w-7 text-blue-400" /> Resume Analysis
          </h1>
          <p className="text-sm text-stone-400">
            Skills map onto our concept registry — the same concepts the mock interviewer scores you on.
            Gaps deep-link straight into learning content.
          </p>
        </header>

        {/* demo banner: purpose without login; real analysis hardens it */}
      {isDemo && (
        <div className="rounded-xl border border-[#3d4a34] bg-[#161a13] px-5 py-4 flex flex-col sm:flex-row sm:items-center gap-3">
          <div className="flex-1">
            <div className="text-sm text-[#f5f1e8]">
              Demo analysis — <span className="italic">Aisha's resume</span> (Backend, 4 yrs).
            </div>
            <div className="text-xs text-stone-500 mt-0.5">
              Paste your own resume below and analyze free — it works right here, no account needed.
            </div>
          </div>
          <button
            onClick={() => { setText(''); setAnalysis(null); setIsDemo(false); }}
            className="shrink-0 text-xs px-4 py-2 bg-[#e8a33d] text-[#1a1408] font-semibold">
            Try with my resume
          </button>
        </div>
      )}

      {error && (
          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {/* input */}
        <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-5 space-y-4">
          <div className="flex items-center justify-between">
            <label className="text-sm font-semibold">Paste your resume text</label>
            <label className="text-xs text-stone-400 cursor-pointer flex items-center gap-1 hover:text-stone-200">
              <Upload className="h-3.5 w-3.5" /> upload PDF / DOCX / TXT
              <input type="file" accept=".pdf,.docx,.txt,.md" onChange={onFile} className="hidden" />
            </label>
          </div>
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={10}
            placeholder={'Experience\n- Led a team of 5 building payment services in Rails with Sidekiq…\n\nSkills\nRuby, Rails, PostgreSQL, Redis, Docker…'}
            className="w-full rounded-xl bg-[#100f0d] border border-[#26241f] p-3 text-sm outline-none focus:border-blue-500/50"
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <select
              value={targetDomain}
              onChange={(e) => setTargetDomain(e.target.value)}
              className="rounded-xl bg-[#100f0d] border border-[#26241f] px-3 py-2 text-sm flex-1"
            >
              {DOMAINS.map((d) => (
                <option key={d} value={d}>
                  Target: {d.replace(/-/g, ' ')}
                </option>
              ))}
            </select>
            <Button onClick={analyze} disabled={busy || text.length < 40} className="gap-2 sm:w-48">
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <Wand2 className="h-4 w-4" />}
              {busy ? 'Analyzing…' : 'Analyze resume'}
            </Button>
          </div>
          <p className="text-[11px] text-stone-600 flex items-center gap-1">
            <ShieldCheck className="h-3 w-3" /> Analysis runs on our servers against the concept registry. No AI judge, no data resale — your text is not stored.
          </p>
        </div>

        {parseNote && (
          <div className="rounded-xl border border-[#33404d] bg-[#131820] px-4 py-2.5 text-xs text-[#9ab8d4] flex items-center gap-2">
            <FileText className="h-3.5 w-3.5" /> {parseNote}
          </div>
        )}

        {analysis && (
          <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            {/* readiness */}
            {analysis.readiness && (
              <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-6">
                <div className="flex items-center gap-3 mb-3">
                  <Target className="h-5 w-5 text-blue-400" />
                  <h2 className="font-semibold">Readiness — {analysis.readiness.domain.replace(/-/g, ' ')}</h2>
                </div>
                <div className="flex items-end gap-3 mb-4">
                  <span className={cn('text-5xl font-black', readinessColor(analysis.readiness.score))}>
                    {analysis.readiness.score}
                  </span>
                  <div className="text-xs text-stone-400 pb-2 space-y-0.5">
                    <div>{analysis.readiness.covered} concepts covered · {analysis.readiness.partial} partial · {analysis.readiness.missing} missing</div>
                    <div>of {analysis.readiness.conceptCount} concepts the target role tests</div>
                  </div>
                </div>
                {/* bar */}
                <div className="h-2.5 rounded-full bg-[#26241f] overflow-hidden flex">
                  <div className="bg-emerald-500" style={{ width: `${analysis.readiness.ratio * 100}%` }} />
                  <div className="bg-amber-500/60" style={{ width: `${(analysis.readiness.partial / Math.max(analysis.readiness.conceptCount, 1)) * 50}%` }} />
                </div>
                <p className="text-[11px] text-stone-600 mt-2">
                  Claimed skills count as partial. Prove them in a mock interview to upgrade claim → spoken evidence.
                </p>
              </div>
            )}

            {/* skills */}
            <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-6 space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-blue-400" /> Skills detected ({analysis.skills.length})
              </h2>
              <div className="flex flex-wrap gap-2">
                {analysis.skills.map((s) => (
                  <span key={s.id} className="px-2.5 py-1 rounded-full bg-[#e8a33d]/10 border border-[#3a362e] text-[#e8a33d] text-xs">
                    {s.label}
                  </span>
                ))}
              </div>
              {!saved && analysis.skills.length > 0 && (
                <p className="text-[11px] text-stone-600 flex items-center gap-1">
                  <CheckCircle2 className="h-3 w-3 text-emerald-400" /> Claimed evidence recorded — visible on your dashboard now.
                </p>
              )}
            </div>

            {/* gaps */}
            {analysis.gaps?.length > 0 && (
              <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-6 space-y-3">
                <h2 className="font-semibold flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-rose-400" /> Gaps vs target ({analysis.gaps.length})
                </h2>
                <div className="space-y-2 max-h-80 overflow-y-auto pr-1">
                  {analysis.gaps.map((g) => (
                    <div key={g.topicId} className="rounded-xl border border-[#1f1d18] bg-[#100f0d]/40 p-3">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <div className="text-sm font-medium truncate">{g.title || g.topic.replace(/-/g, ' ')}</div>
                          <div className="text-[11px] text-stone-600 truncate">
                            missing: {g.missingConcepts.slice(0, 3).join(', ')}
                            {g.missingConcepts.length > 3 ? ` +${g.missingConcepts.length - 3}` : ''}
                          </div>
                        </div>
                        <div className="flex gap-1.5 shrink-0">
                          <a href={g.learnUrl} className="px-2.5 py-1.5 rounded-lg bg-[#141311] hover:bg-[#1a1917] text-xs flex items-center gap-1">
                            <BookOpen className="h-3 w-3" /> Study
                          </a>
                          <a
                            href={studioHref(analysis.targetDomain || g.topicId.split('/')[0], g.missingConceptIds)}
                            className="px-2.5 py-1.5 rounded-lg bg-[#e8a33d]/15 hover:bg-[#e8a33d]/25 text-[#e8a33d] text-xs flex items-center gap-1"
                          >
                            <Mic className="h-3 w-3" /> Mock it
                          </a>
                        </div>
                      </div>
                      {g.importance === 'high' && (
                        <span className="inline-block mt-1.5 text-[10px] uppercase tracking-wide text-amber-400/80">high importance</span>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* hygiene */}
            <div className="rounded-2xl border border-[#26241f] bg-[#141311] p-6 space-y-3">
              <h2 className="font-semibold flex items-center gap-2">
                <FileText className="h-4 w-4 text-amber-400" /> Resume hygiene — {analysis.hygiene.score}/100
              </h2>
              <div className="space-y-2">
                {analysis.hygiene.checks.map((c) => (
                  <div key={c.id} className="flex items-start gap-2 text-sm">
                    {c.ok ? (
                      <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0 mt-0.5" />
                    )}
                    <div>
                      <span className={c.ok ? 'text-stone-300' : 'text-stone-200'}>{c.label}</span>
                      <span className="text-stone-600 text-xs block">{c.detail}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
