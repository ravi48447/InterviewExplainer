'use client';

/**
 * Live 1:1 Mock Interview — peer rooms with Director-assist.
 *
 * Host (interviewer): creates a room, shares the link, runs the session with
 *   the Director suggesting next moves + the hidden rubric checklist on-screen.
 * Guest (candidate): joins via link, clean focus view with live audio.
 *
 * Media: WebRTC 1:1 (audio-first). Signaling: /api/engine/room long-poll.
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Mic, MicOff, Video, VideoOff, PhoneOff, Users, Link2, Copy, Check,
  Loader2, Radio, Brain, CheckCircle2, ArrowRight, AlertTriangle, Sparkles,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useRoom } from '@/lib/engine/useRoom';
import { recordEvidence } from '@/lib/engine/mastery.mjs';

interface PublicQuestion {
  id: string;
  question: string;
  title?: string;
  difficulty?: string;
  isProbe?: boolean;
  isStretch?: boolean;
  isPoke?: boolean;
  isTradeoff?: boolean;
  isCircleBack?: boolean;
}

export default function LiveMockInterviewPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const joinRoomId = searchParams?.get('room');
  const joinToken = searchParams?.get('t');

  const [phase, setPhase] = useState<'idle' | 'creating' | 'waiting' | 'live' | 'ended'>('idle');
  const [shareUrl, setShareUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [micOn, setMicOn] = useState(true);
  const [camOn, setCamOn] = useState(false);
  const [localPreview, setLocalPreview] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Director session (host drives it; assistant suggests next moves)
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [sessionSeed, setSessionSeed] = useState<number | null>(null);
  const [current, setCurrent] = useState<PublicQuestion | null>(null);
  const [interviewerLine, setInterviewerLine] = useState('');
  const [lastAve, setLastAve] = useState<any>(null);
  const [rubricTicks, setRubricTicks] = useState<Set<string>>(new Set());
  const [candidateHeard, setCandidateHeard] = useState('');
  const [relayedQuestion, setRelayedQuestion] = useState<{ question: any; rendered: string } | null>(null);
  const [askedCount, setAskedCount] = useState(0);
  const turnsRef = useRef<any[]>([]);
  const askedIdsRef = useRef<Set<string>>(new Set());
  const usedProbeIdsRef = useRef<Set<string>>(new Set());
  const dodgedRef = useRef<any[]>([]);
  const recentSignalsRef = useRef<string[]>([]);
  const moveLogRef = useRef<any[]>([]);

  const localVideoRef = useRef<HTMLVideoElement | null>(null);
  const remoteVideoRef = useRef<HTMLVideoElement | null>(null);
  const recognitionRef = useRef<any>(null);

  const room = useRoom();

  // guest: thin poll for host-relayed question cards (the hook handles media signals)
  useEffect(() => {
    if (room.role !== 'guest' || !room.roomId) return;
    let stop = false;
    let lastV = 0;
    const tick = async () => {
      if (stop) return;
      try {
        // guestToken isn't exposed; use a secondary call via the shared room state
        // simplest robust path: the room API GET with the roomId from URL params
        const rid = new URLSearchParams(location.search).get('room');
        const t = new URLSearchParams(location.search).get('t');
        if (rid && t) {
          const res = await fetch(`/api/engine/room?roomId=${rid}&token=${t}&v=${lastV}`);
          if (res.ok) {
            const data = await res.json();
            lastV = data.v ?? lastV;
            const q = (data.signals ?? []).filter((s: any) => s.type === 'question').slice(-1)[0];
            if (q) setRelayedQuestion({ question: q.data.question, rendered: q.data.rendered });
            const tr = (data.signals ?? []).filter((s: any) => s.type === 'transcript').slice(-1)[0];
            if (tr) setCandidateHeard(tr.data.text ?? '');
          }
        }
      } catch {}
      if (!stop) setTimeout(tick, 2500);
    };
    tick();
    return () => { stop = true; };
  }, [room.role, room.roomId]);

  // ---- media setup ----
  const setupLocal = useCallback(async (withCam: boolean) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: withCam });
      setLocalPreview(stream);
      room.setLocalMedia(stream);
      if (localVideoRef.current) localVideoRef.current.srcObject = stream;
      return stream;
    } catch {
      setError('Microphone/camera unavailable. You can still proceed with the typed flow.');
      return null;
    }
  }, [room]);

  // ---- host: create room ----
  const createRoom = useCallback(async () => {
    setPhase('creating');
    setError(null);
    try {
      await setupLocal(camOn);
      const { roomId, guestToken } = await room.create();
      const url = `${location.origin}/mock-interviews/live?room=${roomId}&t=${guestToken}`;
      setShareUrl(url);
      setPhase('waiting');
    } catch (e: any) {
      setError(e?.message || 'Could not create the room.');
      setPhase('idle');
    }
  }, [room, camOn, setupLocal]);

  // ---- guest: join ----
  useEffect(() => {
    if (!joinRoomId || !joinToken || phase !== 'idle') return;
    (async () => {
      try {
        await setupLocal(false);
        await room.join(joinRoomId, joinToken);
        setPhase('live');
      } catch (e: any) {
        setError(e?.message || 'Could not join — the room may be full or expired.');
      }
    })();
  }, [joinRoomId, joinToken]);

  // host: when peer joins, start the WebRTC offer + the Director session
  useEffect(() => {
    if (room.role === 'host' && room.peerJoined && phase === 'waiting') {
      (async () => {
        try {
          await room.startCall();
          const res = await fetch('/api/engine/session', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'live-assist', questionCount: 6 }),
          });
          const data = await res.json();
          if (data.first?.question) {
            setSessionId(data.sessionId);
            setSessionSeed(data.sessionSeed);
            setCurrent(data.first.question);
            setInterviewerLine(data.first.rendered);
            setAskedCount(1);
            askedIdsRef.current.add(data.first.question.id);
          }
        } catch (e: any) {
          setError('Session engine failed to start: ' + (e?.message ?? e));
        }
        setPhase('live');
      })();
    }
  }, [room.role, room.peerJoined, phase]);

  // attach remote stream
  useEffect(() => {
    if (room.remoteStream && remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = room.remoteStream;
    }
  }, [room.remoteStream]);

  // ---- guest: live transcription (the host hears it; candidate sees their words) ----
  useEffect(() => {
    if (phase !== 'live' || room.role !== 'guest') return;
    const SR = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SR) return;
    const rec = new SR();
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (ev: any) => {
      let text = '';
      for (let i = ev.resultIndex; i < ev.results.length; i++) text += ev.results[i][0].transcript + ' ';
      setCandidateHeard(text.trim());
      // relay live words to the host console
      const rid = new URLSearchParams(location.search).get('room');
      const tk = new URLSearchParams(location.search).get('t');
      if (rid && tk) {
        fetch('/api/engine/room', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'signal', roomId: rid, token: tk, type: 'transcript', data: { text: text.trim() } }),
        }).catch(() => {});
      }
    };
    rec.onend = () => { if (phase === 'live') rec.start(); };
    rec.start();
    recognitionRef.current = rec;
    return () => { try { rec.stop(); } catch {} };
  }, [phase, room.role]);

  // ---- host: AVE on candidate transcript, advance Director ----
  const hostSubmitAnswer = useCallback(async () => {
    if (!sessionId || !current || !candidateHeard) return;
    const transcript = candidateHeard;
    setCandidateHeard('');
    try {
      const res = await fetch('/api/engine/turn', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          questionId: current.id,
          transcript,
          clientState: {
            sessionSeed,
            questionCount: 6,
            askedIds: [...askedIdsRef.current],
            usedProbeIds: [...usedProbeIdsRef.current],
            dodged: dodgedRef.current,
            recentSignals: recentSignalsRef.current.slice(-6),
            moveLog: moveLogRef.current,
          },
        }),
      });
      const data = await res.json();
      setLastAve(data.ave);
      recentSignalsRef.current.push(data.ave.signal);
      turnsRef.current.push({ questionId: current.id, transcript, move: data.next?.move ?? 'answer' });
      moveLogRef.current.push({ turn: turnsRef.current.length, move: data.next?.move, questionId: data.next?.question?.id ?? null, reason: data.next?.move });
      if (data.next?.move === 'wrap' || !data.next?.question) {
        endSession();
        return;
      }
      setCurrent(data.next.question);
      setInterviewerLine(data.next.rendered);
      // relay the question to the guest (they see the same card live)
      try {
        await fetch('/api/engine/room', {
          method: 'POST', headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action: 'signal', roomId: room.roomId, token: (room as any).hostToken ?? undefined, type: 'question', data: { question: data.next.question, rendered: data.next.rendered } }),
        });
      } catch {}
      setAskedCount((n) => n + 1);
      askedIdsRef.current.add(data.next.question.id);
      setRubricTicks(new Set());
      speak(data.next.rendered);
    } catch (e: any) {
      setError('Turn failed: ' + (e?.message ?? e));
    }
  }, [sessionId, current, candidateHeard, sessionSeed]);

  const speak = useCallback((text: string) => {
    try {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const u = new SpeechSynthesisUtterance(text);
        u.rate = 0.98;
        window.speechSynthesis.speak(u);
      }
    } catch {}
  }, []);

  const endSession = useCallback(async () => {
    setPhase('ended');
    try {
      const res = await fetch('/api/engine/report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sessionId,
          clientState: { moveLog: moveLogRef.current },
          turns: turnsRef.current,
        }),
      });
      if (res.ok) {
        const report = await res.json();
        sessionStorage.setItem(`ie_mock_report_${sessionId}`, JSON.stringify(report));
        try {
          for (const q of report.perQuestion ?? []) {
            if (q.coverage?.hit?.length) recordEvidence(q.coverage.hit, 'spoken');
          }
        } catch {}
      }
    } catch {}
    await room.end();
  }, [sessionId, room]);

  const toggleMic = () => {
    const tracks = localPreview?.getAudioTracks() ?? [];
    tracks.forEach((t) => (t.enabled = !t.enabled));
    setMicOn((v) => !v);
  };
  const toggleCam = () => {
    const tracks = localPreview?.getVideoTracks() ?? [];
    tracks.forEach((t) => (t.enabled = !t.enabled));
    setCamOn((v) => !v);
  };

  const copyLink = () => {
    navigator.clipboard?.writeText(shareUrl ?? '');
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  // ---------------- render ----------------
  const isHost = room.role === 'host';

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="max-w-5xl mx-auto px-4 py-8 space-y-5">
        {error && (
          <div className="rounded-lg border border-amber-500/30 bg-amber-500/10 p-3 text-sm text-amber-200 flex items-start gap-2">
            <AlertTriangle className="h-4 w-4 mt-0.5 shrink-0" /> {error}
          </div>
        )}

        {/* IDLE: choose role */}
        {phase === 'idle' && !joinRoomId && (
          <div className="text-center py-16 space-y-6">
            <div className="mx-auto h-20 w-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-blue-500/20 border border-indigo-500/30 flex items-center justify-center">
              <Users className="h-8 w-8 text-indigo-400" />
            </div>
            <h1 className="text-2xl font-bold">Live 1:1 Mock Interview</h1>
            <p className="text-muted-foreground max-w-lg mx-auto text-sm">
              One of you interviews, the other answers. The interviewer gets Director-assist:
              suggested next moves + the expert rubric, so any peer can run a real session.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" onClick={createRoom} className="gap-2">
                <Radio className="h-4 w-4" /> Create a room (interviewer)
              </Button>
              <Button size="lg" variant="outline" disabled className="gap-2 opacity-60">
                <Link2 className="h-4 w-4" /> Join with a link
              </Button>
            </div>
          </div>
        )}

        {/* WAITING (host): share link */}
        {phase === 'waiting' && (
          <div className="rounded-lg border border-border bg-surface p-6 space-y-4 max-w-xl mx-auto">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              <h2 className="font-semibold">Waiting for your candidate…</h2>
            </div>
            <p className="text-sm text-muted-foreground">Share this link — they join as the candidate (one seat).</p>
            <div className="flex gap-2">
              <code className="flex-1 truncate rounded-lg bg-background border border-border px-3 py-2 text-xs">
                {shareUrl}
              </code>
              <Button size="sm" onClick={copyLink} className="gap-1">
                {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? 'Copied' : 'Copy'}
              </Button>
            </div>
            <div className="flex items-center justify-between pt-2">
              <label className="text-xs text-muted-foreground flex items-center gap-2 cursor-pointer">
                <Video className="h-3.5 w-3.5" /> camera {camOn ? 'on' : 'off'}
                <input type="checkbox" checked={camOn} onChange={(e) => setCamOn(e.target.checked)} className="hidden" onClick={(e) => setCamOn((e.target as any).checked)} />
              </label>
              <Button variant="ghost" size="sm" onClick={() => room.end().then(() => setPhase('idle'))}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* LIVE: the call */}
        {phase === 'live' && (
          <div className={cn('grid gap-4', isHost ? 'lg:grid-cols-[1fr_380px]' : 'max-w-2xl mx-auto')}>
            {/* media */}
            <div className="space-y-3">
              <div className="relative rounded-lg border border-border bg-background overflow-hidden aspect-video">
                <video ref={remoteVideoRef} autoPlay playsInline className={cn('w-full h-full object-cover', !room.remoteStream && 'opacity-0')} />
                {!room.remoteStream && (
                  <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/80 text-sm gap-2">
                    <Loader2 className="h-4 w-4 animate-spin" /> connecting media…
                  </div>
                )}
                <div className="absolute bottom-3 left-3 bg-black/50 backdrop-blur px-2 py-1 rounded-lg text-xs">
                  {isHost ? 'Candidate' : 'Interviewer'}
                </div>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Button variant={micOn ? 'outline' : 'destructive'} size="sm" onClick={toggleMic} className="gap-1.5">
                  {micOn ? <Mic className="h-4 w-4" /> : <MicOff className="h-4 w-4" />} {micOn ? 'Mute' : 'Unmute'}
                </Button>
                {camOn && (
                  <Button variant={camOn ? 'outline' : 'destructive'} size="sm" onClick={toggleCam} className="gap-1.5">
                    {camOn ? <Video className="h-4 w-4" /> : <VideoOff className="h-4 w-4" />} Camera
                  </Button>
                )}
                <Button variant="destructive" size="sm" onClick={endSession} className="gap-1.5">
                  <PhoneOff className="h-4 w-4" /> End
                </Button>
              </div>
              {localVideoRef.current && <video ref={localVideoRef} autoPlay muted playsInline className="hidden" />}
            </div>

            {/* host console: Director-assist */}
            {isHost && (
              <aside className="rounded-lg border border-indigo-500/20 bg-muted/[0.04] p-4 space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-indigo-300">
                  <Brain className="h-4 w-4" /> Director assist
                  <span className="ml-auto text-xs text-muted-foreground font-normal">Q {askedCount}/6</span>
                </div>

                {current ? (
                  <>
                    <div className="rounded-lg bg-background border border-border p-3 space-y-2">
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground/80">Ask next</div>
                      <p className="text-sm leading-relaxed">{interviewerLine}</p>
                      <Button size="sm" variant="ghost" onClick={() => speak(interviewerLine)} className="gap-1 text-xs">
                        speak it
                      </Button>
                    </div>

                    <div className="rounded-lg bg-background border border-border p-3 space-y-1.5">
                      <div className="text-[10px] uppercase tracking-wide text-muted-foreground/80">Rubric — tick as covered</div>
                      {lastAve?.coverage?.hit?.length ? (
                        lastAve.coverage.hit.map((h: string) => (
                          <button
                            key={h}
                            onClick={() => setRubricTicks((s) => new Set(s).add(h))}
                            className="flex items-start gap-1.5 text-left w-full text-xs hover:bg-surface rounded p-1"
                          >
                            <span className={cn('mt-0.5 h-3.5 w-3.5 rounded border flex items-center justify-center shrink-0', rubricTicks.has(h) ? 'bg-emerald-500 border-emerald-500' : 'border-slate-600')}>
                              {rubricTicks.has(h) && <CheckCircle2 className="h-2.5 w-2.5 text-muted-foreground" />}
                            </span>
                            {h}
                          </button>
                        ))
                      ) : (
                        <p className="text-xs text-muted-foreground/80 text-center py-2">AVE runs when you submit the candidate's words.</p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <textarea
                        value={candidateHeard}
                        onChange={(e) => setCandidateHeard(e.target.value)}
                        rows={3}
                        placeholder="Candidate's answer (auto-heard or type)…"
                        className="w-full rounded-lg bg-background border border-border p-2.5 text-xs outline-none focus:border-indigo-500/50"
                      />
                      <Button size="sm" onClick={hostSubmitAnswer} disabled={!candidateHeard.trim()} className="w-full gap-1.5">
                        <ArrowRight className="h-3.5 w-3.5" /> Score &amp; next question
                      </Button>
                    </div>

                    {lastAve && (
                      <div className="text-[11px] text-muted-foreground border-t border-border pt-2 space-y-1">
                        <div>last: <b className="text-foreground">{lastAve.score}</b> · {lastAve.signal?.replace(/_/g, ' ')}</div>
                        {lastAve.mistakeFlags?.length > 0 && <div className="text-amber-400">⚠ mistake flagged</div>}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="text-xs text-muted-foreground/80 text-center py-8">Session engine starting…</div>
                )}
              </aside>
            )}

            {/* guest: focus view */}
            {!isHost && relayedQuestion && (
              <div className="rounded-lg border border-border bg-surface p-5 space-y-2">
                <div className="text-[10px] uppercase tracking-[0.15em] text-muted-foreground">the interviewer asks</div>
                <p className="text-sm leading-relaxed text-foreground">{relayedQuestion.rendered}</p>
              </div>
            )}
            {!isHost && (
              <div className="rounded-lg border border-border bg-surface p-5">
                <div className="text-xs text-muted-foreground/80 uppercase tracking-wide mb-2">Your answer</div>
                <div className="min-h-[80px] text-sm text-foreground/70">
                  {candidateHeard || <span className="text-muted-foreground/80">Speak — your words appear here (the interviewer hears them live).</span>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ENDED */}
        {phase === 'ended' && (
          <div className="text-center py-16 space-y-4">
            <CheckCircle2 className="h-12 w-12 text-emerald-400 mx-auto" />
            <h2 className="text-xl font-bold">Session ended</h2>
            {sessionId && isHost && (
              <Button onClick={() => router.push(`/mock-interviews/results?session=${sessionId}`)} className="gap-2">
                <Sparkles className="h-4 w-4" /> View report
              </Button>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
