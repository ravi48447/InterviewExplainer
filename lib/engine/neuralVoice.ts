'use client';

/**
 * neuralVoice.ts — human-voice speech with graceful degradation.
 *
 * Priority: Piper neural voice (server, /api/engine/tts) → browser TTS.
 * The neural path: fetch wav -> Audio playback with persona pacing +
 * natural pauses (split at sentence boundaries, interleave silence).
 * If the server voice is unavailable, we degrade to tuned browser TTS
 * — the session never breaks.
 */

// persona -> voice + pacing (server voices)
const PERSONA_VOICE: Record<string, { voice: string; gapMs: number }> = {
  mentor: { voice: 'amy', gapMs: 420 },
  skeptic: { voice: 'ryan', gapMs: 380 },
  rapid: { voice: 'amy', gapMs: 200 },
  detail: { voice: 'amy', gapMs: 460 },
  architect: { voice: 'ryan', gapMs: 440 },
  silent: { voice: 'lessac', gapMs: 520 },
  panelist: { voice: 'lessac', gapMs: 300 },
};

let audioCtx: AudioContext | null = null;
const cache = new Map<string, HTMLAudioElement>();

function ensureCtx(): AudioContext | null {
  try {
    if (!audioCtx) audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
    return audioCtx;
  } catch {
    return null;
  }
}

/** Fetch a neural wav (cached in-browser by URL + HTTP cache). */
async function fetchVoiceWav(text: string, voice: string): Promise<Blob | null> {
  const url = `/api/engine/tts?voice=${voice}&text=${encodeURIComponent(text)}`;
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    const ct = res.headers.get('content-type') ?? '';
    if (!ct.includes('audio')) return null; // fallback JSON
    return await res.blob();
  } catch {
    return null;
  }
}

let serverVoiceAvailable: boolean | null = null;

/** Probe once per session whether server voice works. */
export async function probeServerVoice(): Promise<boolean> {
  if (serverVoiceAvailable !== null) return serverVoiceAvailable;
  const blob = await fetchVoiceWav('Ready.', 'amy');
  serverVoiceAvailable = !!blob;
  return serverVoiceAvailable;
}

/**
 * Speak with a neural voice. Splits text into sentences and plays them with
 * natural inter-sentence gaps — the pacing fix that kills the robot feel.
 * Falls back to browser TTS (rate/pitch tuned) when server voice is absent.
 */
export async function speakNeural(
  text: string,
  opts: { persona?: string; rate?: number; pitch?: number; onEnd?: () => void } = {}
): Promise<void> {
  const t = String(text ?? '').trim();
  if (!t) {
    opts.onEnd?.();
    return;
  }

  const persona = opts.persona ?? 'mentor';
  const cfg = PERSONA_VOICE[persona] ?? PERSONA_VOICE.mentor;

  // try neural first
  try {
    if (await probeServerVoice()) {
      const sentences = splitSentences(t);
      const ctx = ensureCtx();
      if (!ctx) throw new Error('no audio ctx');
      if (ctx.state === 'suspended') await ctx.resume();

      let offset = 0;
      for (const s of sentences) {
        const blob = await fetchVoiceWav(s, cfg.voice);
        if (!blob) throw new Error('voice fetch failed');
        const buf = await blob.arrayBuffer();
        const audio = await ctx.decodeAudioData(buf);
        const src = ctx.createBufferSource();
        src.buffer = audio;
        src.connect(ctx.destination);
        src.start(ctx.currentTime + offset);
        offset += audio.duration + cfg.gapMs / 1000;
      }
      // fire onEnd after the last sentence
      const totalMs = offset * 1000;
      setTimeout(() => opts.onEnd?.(), totalMs);
      return;
    }
  } catch {
    // fall through to browser TTS
  }

  // fallback: browser TTS with persona tuning
  speakBrowser(t, cfg.voice === 'ryan' ? { rate: opts.rate ?? 0.95, pitch: 0.9 } : { rate: opts.rate ?? 0.98, pitch: 1.02 }, opts.onEnd);
}

function splitSentences(text: string): string[] {
  // split at sentence ends, keep punctuation; merge very short fragments
  const raw = text.match(/[^.!?…]+[.!?…]*/g) ?? [text];
  const out: string[] = [];
  for (const piece of raw) {
    const s = piece.trim();
    if (!s) continue;
    if (out.length && s.length < 12) out[out.length - 1] += ' ' + s; // merge fragments
    else out.push(s);
  }
  return out.slice(0, 6); // cap: protect latency on long prompts
}

function speakBrowser(text: string, v: { rate: number; pitch: number }, onEnd?: () => void) {
  try {
    if (!('speechSynthesis' in window)) { onEnd?.(); return; }
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = v.rate;
    u.pitch = v.pitch;
    // Select an explicit English voice instead of the engine default (which
    // can be a non-English or unavailable system voice on some platforms).
    const voices = window.speechSynthesis.getVoices();
    const pick =
      voices.find((x) => /en[-_](US|GB)/i.test(x.lang) && /natural|neural|premium|enhanced/i.test(x.name)) ??
      voices.find((x) => /en[-_](US|GB)/i.test(x.lang)) ??
      voices.find((x) => /^en/i.test(x.lang));
    if (pick) u.voice = pick;
    u.lang = pick?.lang ?? 'en-US';
    u.onend = () => onEnd?.();
    u.onerror = () => onEnd?.();
    window.speechSynthesis.speak(u);
  } catch {
    onEnd?.();
  }
}

/** Is the neural path active? (for UI: show the "natural voice" badge) */
export function isNeuralActive(): boolean {
  return serverVoiceAvailable === true;
}

/** reset probe (used when a new session starts) */
export function resetVoiceProbe() {
  serverVoiceAvailable = null;
}
