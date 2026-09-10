/**
 * /api/engine/tts — neural voice synthesis (Piper).
 *
 * The fix for the #1 realism gap: browser TTS is robotic; these are local
 * neural voices (MIT-licensed Piper, runs on-CPU at 30× real-time).
 *
 *   GET ?text=...&voice=amy|ryan|lessac
 *   -> audio/wav (cached on disk by text hash — generated once, served forever)
 *
 * Voice map (personas): mentor/rapid/detail -> amy (warm female),
 * skeptic/architect -> ryan (male), silent/panelist -> lessac (second female).
 * Rates/length scales carry persona pacing without touching the model.
 */

import { NextRequest, NextResponse } from 'next/server';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const execFileAsync = promisify(execFile);

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const ROOT = process.cwd();
const PIPER_DIR = path.join(ROOT, 'tools', 'piper');
const VOICES = path.join(PIPER_DIR, 'voices');
const CACHE = path.join(ROOT, '.data', 'tts-cache');

const VOICE_FILES: Record<string, string> = {
  amy: 'en_US-amy-medium.onnx',
  ryan: 'en_US-ryan-medium.onnx',
  lessac: 'en_US-lessac-medium.onnx',
};

/** persona pacing: length_scale < 1 = faster, > 1 = slower */
const VOICE_RATES: Record<string, { lengthScale: number }> = {
  amy: { lengthScale: 1.0 },
  ryan: { lengthScale: 1.0 },
  lessac: { lengthScale: 1.05 },
};

function piperAvailable(): boolean {
  return fs.existsSync(path.join(PIPER_DIR, 'piper')) &&
    fs.existsSync(path.join(VOICES, VOICE_FILES.amy));
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const text = (url.searchParams.get('text') ?? '').slice(0, 600).trim();
    const voice = url.searchParams.get('voice') ?? 'amy';
    if (!text) return NextResponse.json({ error: 'text_required' }, { status: 400 });

    // graceful fallback signal: if piper isn't installed (e.g. prod box without
    // the tools dir), tell the client to use browser TTS instead
    if (!piperAvailable()) {
      return NextResponse.json({ fallback: 'browser-tts' }, { status: 200 });
    }
    const voiceFile = VOICE_FILES[voice] ? voice : 'amy';

    // cache: hash(text+voice) -> wav; generated once, served forever
    fs.mkdirSync(CACHE, { recursive: true });
    const hash = crypto.createHash('sha1').update(voice + '|' + text).digest('hex');
    const cached = path.join(CACHE, `${hash}.wav`);
    if (fs.existsSync(cached)) {
      const buf = fs.readFileSync(cached);
      return new NextResponse(new Uint8Array(buf), {
        headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'public, max-age=86400' },
      });
    }

    // generate via piper: text piped via STDIN (piper reads lines from stdin)
    const rate = VOICE_RATES[voiceFile]?.lengthScale ?? 1.0;
    await new Promise<void>((resolve, reject) => {
      const child = execFile(
        path.join(PIPER_DIR, 'piper'),
        ['--model', path.join(VOICES, VOICE_FILES[voiceFile]), '--length_scale', String(rate), '--output_file', cached],
        { env: { ...process.env, LD_LIBRARY_PATH: PIPER_DIR }, timeout: 45000 },
        (err) => (err ? reject(err) : resolve())
      );
      child.stdin?.write(text + '\n');
      child.stdin?.end();
    });

    if (!fs.existsSync(cached) || fs.statSync(cached).size === 0) {
      return NextResponse.json({ fallback: 'browser-tts' }, { status: 200 });
    }
    const buf = fs.readFileSync(cached);
    return new NextResponse(new Uint8Array(buf), {
      headers: { 'Content-Type': 'audio/wav', 'Cache-Control': 'public, max-age=86400' },
    });
  } catch (e) {
    // never break the session — the client falls back to browser TTS
    return NextResponse.json({ fallback: 'browser-tts' }, { status: 200 });
  }
}
