/**
 * ReadAloudButton — Phase 1.6.
 *
 * Renders a single-action button that reads a Speakable aloud using the
 * browser's SpeechSynthesisUtterance. Handles the v2-vs-legacy branch
 * itself so call sites can hand it any SpeakableEither and stop caring.
 *
 * Branch contract (per Phase 1 prompt §14):
 *   - source.kind === "v2" && status === "approved" → toSpeech(v2)
 *   - everything else → strip-markdown(legacy.content)
 *
 * Behaviour:
 *   - User-initiated only. No autoplay.
 *   - While speaking, the button toggles to "Stop reading".
 *   - Cancels any in-flight utterance on unmount.
 *   - Surfaces a small inline error chip if the browser doesn't
 *     support speech synthesis or playback fails.
 */

"use client";

import { useEffect, useRef, useState } from "react";
import { Square, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { SpeakableEither } from "@/lib/speakable/schema";
import { stripMarkdown, toSpeech } from "@/lib/speakable/toSpeech";

export interface ReadAloudButtonProps {
  source: SpeakableEither;
  /** Default: "Read aloud". */
  label?: string;
  /** Default: "Stop reading". */
  stopLabel?: string;
  /** Optional override for the SpeechSynthesisVoice (else browser default). */
  voice?: SpeechSynthesisVoice | null;
  /** Optional rate (0.1-10, default 0.95 for a calm interview cadence). */
  rate?: number;
  /** Optional className passthrough. */
  className?: string;
  /** Disabled passthrough. */
  disabled?: boolean;
}

export function ReadAloudButton({
  source,
  label = "Read aloud",
  stopLabel = "Stop reading",
  voice,
  rate = 0.95,
  className,
  disabled,
}: ReadAloudButtonProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null);

  useEffect(() => {
    return () => {
      // Belt-and-suspenders cleanup if the component unmounts mid-speech.
      if (typeof window !== "undefined" && "speechSynthesis" in window) {
        window.speechSynthesis.cancel();
      }
      utteranceRef.current = null;
    };
  }, []);

  const handleStart = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setError("Voice playback isn't supported in this browser.");
      return;
    }
    const text = textFor(source);
    if (!text) {
      setError("Nothing to read.");
      return;
    }
    setError(null);
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = rate;
    utterance.pitch = 1;
    utterance.volume = 1;
    if (voice) {
      utterance.voice = voice;
      utterance.lang = voice.lang;
    } else {
      utterance.lang = "en-US";
    }
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      utteranceRef.current = null;
      setIsSpeaking(false);
    };
    utterance.onerror = (e) => {
      // SpeechSynthesisErrorEvent has .error; some browsers don't.
      const code = (e as unknown as { error?: string }).error;
      utteranceRef.current = null;
      setIsSpeaking(false);
      if (code !== "interrupted" && code !== "canceled") {
        setError("Couldn't read the answer aloud. Try again.");
      }
    };

    utteranceRef.current = utterance;
    setIsSpeaking(true);
    window.speechSynthesis.resume();
    window.speechSynthesis.speak(utterance);
  };

  const handleStop = () => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    utteranceRef.current = null;
    setIsSpeaking(false);
  };

  return (
    <div className={cn("inline-flex flex-col items-start gap-1.5", className)}>
      {!isSpeaking ? (
        <Button
          onClick={handleStart}
          disabled={disabled}
          variant="outline"
          size="sm"
          className="font-semibold"
        >
          <Volume2 className="h-4 w-4 mr-2" />
          {label}
        </Button>
      ) : (
        <Button
          onClick={handleStop}
          variant="outline"
          size="sm"
          className="font-semibold text-red-600 dark:text-red-400 border-red-200 dark:border-red-500/20 hover:bg-red-50 dark:bg-red-500/10"
        >
          <Square className="h-4 w-4 mr-2" />
          {stopLabel}
        </Button>
      )}
      {error ? (
        <p className="text-[11px] font-semibold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 rounded px-2 py-1">
          {error}
        </p>
      ) : null}
    </div>
  );
}

/**
 * Pick the right text source per the Phase 1.6 branch contract.
 *   - v2 + approved → toSpeech(v2)
 *   - else          → markdown-stripped legacy.content
 */
function textFor(source: SpeakableEither): string {
  if (source.kind === "v2" && source.v2.speakable_status === "approved") {
    return toSpeech(source.v2);
  }
  if (source.kind === "v2") {
    // v2 present but not yet approved — speak nothing rather than read
    // a draft to the user. Return empty so the button surfaces "nothing".
    return "";
  }
  return stripMarkdown(source.legacy.content ?? "").replace(/\s+/g, " ").trim();
}
