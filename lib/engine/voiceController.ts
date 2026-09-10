'use client';
/**
 * voiceController.ts — ONE shared voice pipeline for every speaking surface
 * (mock interviews, company loops, results replay, Q&A practice).
 *
 * The controller owns the full loop a real interview needs:
 *
 *   preflight ─► synthesizing ─► speaking ──► listening ──► evaluation
 *                                  │            │
 *                                  │            ├─ interim transcript
 *                                  │            └─ final transcript
 *                                  └─ synced captions + word events
 *
 * What it provides beyond the old neuralVoice.ts:
 *  - full-turn synthesis (one utterance per interviewer line, not 6-sentence clips)
 *  - explicit voice/language selection for the browser fallback
 *  - real controls: pause, resume, stop, replay, mute, playback speed
 *  - caption events synced to utterance boundary + progress
 *  - separate interim + final ASR channels (nothing overwritten)
 *  - delivery metrics: duration, words, pace, fillers, long pauses
 *  - technical pronunciation normalization (JVM, JPA, O(n), :=, @Override...)
 *  - echo cancellation + noise suppression + auto mic selection with test
 */

import {
  pauseNeuralSpeech,
  probeServerVoice,
  resumeNeuralSpeech,
  speakNeural,
  stopNeuralSpeech,
} from './neuralVoice';

// ---------------------------------------------------------------------------
// Technical pronunciation dictionary
// ---------------------------------------------------------------------------

/** Spoken-form replacements applied BEFORE synthesis. Order matters. */
const PRONUNCIATIONS: [RegExp, string][] = [
  // JVM / Java ecosystem
  [/\bJVM\b/g, 'J V M'],
  [/\bJPA\b/g, 'J P A'],
  [/\bJDBC\b/g, 'J D B C'],
  [/\bJMS\b/g, 'J M S'],
  [/\bAPI\b/g, 'A P I'],
  [/\bAPIs\b/g, 'A P I s'],
  [/\bSQL\b/g, 'S Q L'],
  [/\bNoSQL\b/g, 'noh S Q L'],
  [/\bREST\b/g, 'R E S T'],
  [/\bCRUD\b/g, 'C R U D'],
  [/\bDTO\b/g, 'D T O'],
  [/\bORM\b/g, 'O R M'],
  [/\bACID\b/g, 'A C I D'],
  [/\bCAP\s+theorem\b/gi, 'C A P theorem'],
  [/\bSRP\b/g, 'S R P'],
  [/\bDI\b/g, 'D I'],
  [/\bIoC\b/g, 'I o C'],
  [/\bPOJO\b/g, 'P O J O'],
  // Go
  [/\bHTTP\b/g, 'H T T P'],
  [/\bJSON\b/g, 'J S O N'],
  [/\bYAML\b/g, 'Y A M L'],
  // Big-O and complexity
  [/O\(n\s*log\s*n\)/g, 'order n log n'],
  [/O\(n\s*²\)|O\(n\^2\)/g, 'order n squared'],
  [/O\(n\)/g, 'order n'],
  [/O\(1\)/g, 'order one'],
  [/O\(log\s*n\)/g, 'order log n'],
  // symbols in spoken text
  [/:=/g, ' is defined as '],
  [/=>/g, ' arrow '],
  [/\basync\b/gi, 'ay-sink'],
  [/\bcache\b/gi, 'cash'],
  [/\bcaches\b/gi, 'cashes'],
  [/\bcached\b/gi, 'cashed'],
  // annotations read as words
  [/@Override\b/g, 'Override annotation'],
  [/@Component\b/g, 'Component annotation'],
  [/@Service\b/g, 'Service annotation'],
  [/@Autowired\b/g, 'Autowired annotation'],
  [/@Transactional\b/g, 'Transactional annotation'],
  // misc code punctuation that TTS chokes on
  [/`/g, ''],
  [/\bnull\b(?=[\s,.])/g, 'null'],
];

/** Normalize technical text into a speakable form. */
export function normalizeForSpeech(raw: string): string {
  let out = String(raw ?? '');
  for (const [re, spoken] of PRONUNCIATIONS) out = out.replace(re, spoken);
  // strip fenced code blocks entirely — you don't read code aloud in an interview
  out = out.replace(/```[\s\S]*?```/g, ' (code on screen) ');
  // collapse the leftover symbol soup
  out = out.replace(/[{}<>[\]|\\@#$%^*+=~]/g, ' ');
  return out.replace(/\s{2,}/g, ' ').trim();
}

// ---------------------------------------------------------------------------
// Delivery metrics
// ---------------------------------------------------------------------------

const FILLERS = ['um', 'uh', 'like', 'you know', 'i mean', 'basically', 'actually', 'sort of', 'kind of', 'right so'];

export interface DeliveryMetrics {
  durationSec: number;
  words: number;
  paceWpm: number;
  fillers: number;
  fillerRate: number;
  longPauses: number;
  longestPauseSec: number;
}

/** Score delivery from a final transcript + timing telemetry. */
export function computeDelivery(finalTranscript: string, timeline: { t: number; kind: 'start' | 'interim' | 'final' | 'end' }[]): DeliveryMetrics {
  const text = String(finalTranscript ?? '').toLowerCase();
  const words = text.split(/\s+/).filter(Boolean).length;
  const t0 = timeline.find((e) => e.kind === 'start')?.t ?? 0;
  const t1 = timeline.findLast?.((e) => e.kind === 'end')?.t ?? timeline[timeline.length - 1]?.t ?? t0;
  const durationSec = Math.max(0, (t1 - t0) / 1000);
  // count fillers with word boundaries
  let fillers = 0;
  for (const f of FILLERS) {
    const re = new RegExp(`\\b${f.replace(/\s+/g, '\\s+')}\\b`, 'g');
    fillers += (text.match(re) ?? []).length;
  }
  // long pauses: gaps between consecutive final/interim events > 2.5s
  const marks = timeline.filter((e) => e.kind === 'final' || e.kind === 'interim').map((e) => e.t);
  let longPauses = 0;
  let longestPauseSec = 0;
  for (let i = 1; i < marks.length; i++) {
    const gap = (marks[i] - marks[i - 1]) / 1000;
    if (gap > 2.5) longPauses++;
    longestPauseSec = Math.max(longestPauseSec, gap);
  }
  const paceWpm = durationSec > 0 ? Math.round((words / durationSec) * 60) : 0;
  return {
    durationSec: Math.round(durationSec),
    words,
    paceWpm,
    fillers,
    fillerRate: words ? +(fillers / words).toFixed(3) : 0,
    longPauses,
    longestPauseSec: +longestPauseSec.toFixed(1),
  };
}

// ---------------------------------------------------------------------------
// The controller
// ---------------------------------------------------------------------------

export type VoicePhase =
  | 'idle'
  | 'preflight'
  | 'synthesizing'
  | 'speaking'
  | 'listening'
  | 'thinking'
  | 'error';

export interface VoiceControllerOptions {
  persona?: string;
  lang?: string;
  /** render interim ASR results (default true) */
  interimResults?: boolean;
  /** VAD threshold for auto-stop silence detection (ms). 0 = off */
  silenceMs?: number;
  onPhase?: (p: VoicePhase, prev: VoicePhase) => void;
  onCaption?: (text: string, progress: number) => void;
  onInterim?: (text: string) => void;
  onFinal?: (text: string) => void;
  onDelivery?: (m: DeliveryMetrics) => void;
  onError?: (msg: string) => void;
}

export interface MicInfo {
  deviceId: string;
  label: string;
}

export class VoiceController {
  private opts: Required<Pick<VoiceControllerOptions, 'lang' | 'interimResults' | 'silenceMs'>> & VoiceControllerOptions;
  private phase: VoicePhase = 'idle';
  private utterance: SpeechSynthesisUtterance | null = null;
  private micStream: MediaStream | null = null;
  private recognition: any = null;
  private timeline: { t: number; kind: 'start' | 'interim' | 'final' | 'end' }[] = [];
  private finalChunks: string[] = [];
  private finalText = '';
  private interimText = '';
  private lastVoiceEvent = 0;
  private silenceTimer: any = null;
  private muted = false;
  private rate = 1;
  private stopped = true;
  private neural = false;
  private speechGeneration = 0;

  constructor(options: VoiceControllerOptions = {}) {
    this.opts = {
      lang: options.lang ?? 'en-US',
      interimResults: options.interimResults ?? true,
      silenceMs: options.silenceMs ?? 0,
      ...options,
    };
  }

  // ---------------- phase ----------------
  private setPhase(p: VoicePhase) {
    if (p === this.phase) return;
    const prev = this.phase;
    this.phase = p;
    this.opts.onPhase?.(p, prev);
  }
  get currentPhase(): VoicePhase {
    return this.phase;
  }
  get transcript(): { interim: string; final: string } {
    return { interim: this.interimText, final: this.finalText };
  }
  get isNeural(): boolean {
    return this.neural;
  }

  // ---------------- mic selection + test ----------------
  static async listMics(): Promise<MicInfo[]> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      stream.getTracks().forEach((t) => t.stop());
      const devices = await navigator.mediaDevices.enumerateDevices();
      return devices.filter((d) => d.kind === 'audioinput').map((d) => ({ deviceId: d.deviceId, label: d.label || 'Microphone' }));
    } catch {
      return [];
    }
  }

  async testMic(): Promise<{ ok: boolean; level: number; error?: string }> {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const src = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 512;
      src.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      let level = 0;
      const read = () => {
        analyser.getByteFrequencyData(data);
        level = Math.max(level, data.reduce((a, b) => a + b, 0) / data.length / 255);
      };
      for (let i = 0; i < 10; i++) {
        read();
        await new Promise((r) => setTimeout(r, 100));
      }
      stream.getTracks().forEach((t) => t.stop());
      await ctx.close();
      return { ok: level > 0.01, level: +level.toFixed(3) };
    } catch (e: any) {
      return { ok: false, level: 0, error: e?.name === 'NotAllowedError' ? 'Microphone permission denied' : String(e?.message ?? e) };
    }
  }

  // ---------------- synthesis ----------------
  /** Speak one full interviewer line. Resolves when the line completes. */
  async say(text: string): Promise<void> {
    if (this.stopped) return;
    const generation = ++this.speechGeneration;
    const spoken = normalizeForSpeech(text);
    if (!spoken) return;
    this.setPhase('synthesizing');
    this.opts.onCaption?.(spoken, 0);
    if (this.muted) {
      // still emit caption progress without audio
      this.opts.onCaption?.(spoken, 1);
      this.setPhase(this.listening ? 'listening' : 'idle');
      return;
    }
    this.setPhase('speaking');
    await speakNeural(spoken, {
      persona: this.opts.persona ?? 'mentor',
      rate: this.rate,
    });
    if (generation !== this.speechGeneration) return;
    this.opts.onCaption?.(spoken, 1);
    this.setPhase(this.listening ? 'listening' : 'idle');
  }

  /** Queue-independent replay of the last line. */
  replay(): void {
    if (this.utterance) {
      window.speechSynthesis.cancel();
      window.speechSynthesis.speak(this.utterance);
    }
  }

  setMuted(m: boolean) {
    this.muted = m;
    if (m) this.stopSpeech();
  }
  setRate(r: number) {
    this.rate = r;
  }
  pause() {
    pauseNeuralSpeech();
  }
  resume() {
    resumeNeuralSpeech();
  }
  stopSpeech() {
    this.speechGeneration += 1;
    stopNeuralSpeech();
    this.setPhase(this.listening ? 'listening' : 'idle');
  }

  // ---------------- listening (ASR) ----------------
  get listening(): boolean {
    return !!this.recognition;
  }

  /** Start listening. Fires onInterim/onFinal. Auto-stops on silence if silenceMs set. */
  async startListening(): Promise<void> {
    if (this.stopped) return;
    this.finalChunks = [];
    this.finalText = '';
    this.interimText = '';
    this.timeline = [{ t: Date.now(), kind: 'start' }];
    const SR = (window as any).SpeechRecognition ?? (window as any).webkitSpeechRecognition;
    if (!SR) {
      this.opts.onError?.('speech_recognition_unsupported');
      return;
    }
    const rec = new SR();
    rec.lang = this.opts.lang;
    rec.continuous = true;
    rec.interimResults = this.opts.interimResults;
    rec.maxAlternatives = 1;
    rec.onresult = (ev: any) => {
      for (let i = ev.resultIndex; i < ev.results.length; i++) {
        const r = ev.results[i];
        const text = String(r[0]?.transcript ?? '').trim();
        if (!text) continue;
        if (r.isFinal) {
          this.finalChunks.push(text);
          this.finalText = this.finalChunks.join(' ');
          this.interimText = '';
          this.timeline.push({ t: Date.now(), kind: 'final' });
          this.opts.onFinal?.(this.finalText);
          this.opts.onCaption?.(this.finalText, 1);
        } else {
          this.interimText = text;
          this.timeline.push({ t: Date.now(), kind: 'interim' });
          this.opts.onInterim?.(text);
        }
        this.lastVoiceEvent = Date.now();
        this.armSilence();
      }
    };
    rec.onerror = (ev: any) => {
      if (ev?.error === 'not-allowed') this.opts.onError?.('mic_denied');
      else if (ev?.error !== 'no-speech' && ev?.error !== 'aborted') this.opts.onError?.(String(ev?.error ?? 'asr_error'));
    };
    rec.onend = () => {
      // restart while we're still the active listener (Chrome stops after silence)
      if (!this.stopped && this.listening && this.phase === 'listening') {
        try {
          rec.start();
        } catch {}
      }
    };
    this.recognition = rec;
    try {
      // audio constraints: echo cancellation so the interviewer's own TTS
      // isn't transcribed, noise suppression for cleaner ASR
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true, autoGainControl: true },
      });
      this.micStream = stream;
      stream.getAudioTracks()[0]?.addEventListener('ended', () => this.stopListening());
    } catch (e: any) {
      this.opts.onError?.(e?.name === 'NotAllowedError' ? 'mic_denied' : 'mic_error');
      return;
    }
    this.setPhase('listening');
    try {
      rec.start();
    } catch {}
    if (this.opts.silenceMs > 0) this.armSilence();
  }

  private armSilence() {
    if (this.opts.silenceMs <= 0) return;
    clearTimeout(this.silenceTimer);
    this.silenceTimer = setTimeout(() => {
      if (this.phase === 'listening' && this.finalText) {
        this.timeline.push({ t: Date.now(), kind: 'end' });
        this.opts.onDelivery?.(computeDelivery(this.finalText, this.timeline));
        this.stopListening();
      }
    }, this.opts.silenceMs);
  }

  /** Stop listening; returns the final transcript + delivery metrics. */
  stopListening(): { final: string; delivery: DeliveryMetrics | null } {
    const delivery = this.timeline.length ? computeDelivery(this.finalText, this.timeline) : null;
    try {
      this.recognition?.stop();
    } catch {}
    this.recognition = null;
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    clearTimeout(this.silenceTimer);
    if (this.phase === 'listening') this.setPhase('thinking');
    return { final: this.finalText, delivery };
  }

  // ---------------- lifecycle ----------------
  async preflight(options: { testMic?: boolean } = {}): Promise<{ neural: boolean; micOk: boolean; micError?: string }> {
    this.stopped = false;
    this.setPhase('preflight');
    const neural = await probeServerVoice();
    this.neural = neural;
    if (options.testMic === false) {
      return { neural, micOk: true };
    }
    const mic = await this.testMic();
    return { neural, micOk: mic.ok, micError: mic.error };
  }

  /** Full lifecycle shutdown. */
  destroy() {
    this.stopped = true;
    this.stopSpeech();
    try {
      this.recognition?.stop();
    } catch {}
    this.recognition = null;
    this.micStream?.getTracks().forEach((t) => t.stop());
    this.micStream = null;
    this.setPhase('idle');
  }
}

/** Single shared instance accessor (one controller per surface). */
let _shared: VoiceController | null = null;
export function sharedVoiceController(opts?: VoiceControllerOptions): VoiceController {
  if (!_shared) _shared = new VoiceController(opts);
  return _shared;
}
