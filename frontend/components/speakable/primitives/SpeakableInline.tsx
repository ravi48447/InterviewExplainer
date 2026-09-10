/**
 * SpeakableInline — inline markdown for Speakable v2 beat text.
 *
 * The speakable_v2 authoring format carries lightweight inline markdown
 * (`**bold**` and `` `code` ``) in beat text — the TTS serializer
 * (lib/speakable/toSpeech.ts `stripMarkdown`) already removes these markers
 * for read-aloud, and speakable.css already styles `strong` and
 * `.speakable-code-chip`. This component renders those markers visually so
 * the on-screen card matches the authored emphasis. Plain text (no markers)
 * passes through unchanged, so it is safe for legacy content.
 */

import type { ReactNode } from "react";

const TOKEN = /(\*\*[^*]+\*\*|`[^`]+`)/g;

export function renderSpeakableInline(text: string): ReactNode {
  if (!text || (!text.includes("**") && !text.includes("`"))) return text;

  const nodes: ReactNode[] = [];
  let lastIndex = 0;
  let key = 0;
  let match: RegExpExecArray | null;

  TOKEN.lastIndex = 0;
  while ((match = TOKEN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    const token = match[0];
    if (token.startsWith("**")) {
      nodes.push(<strong key={key++}>{token.slice(2, -2)}</strong>);
    } else {
      nodes.push(
        <code key={key++} className="speakable-code-chip">
          {token.slice(1, -1)}
        </code>
      );
    }
    lastIndex = TOKEN.lastIndex;
  }
  if (lastIndex < text.length) nodes.push(text.slice(lastIndex));

  return nodes;
}

export function SpeakableInline({ text }: { text: string }) {
  return <>{renderSpeakableInline(text)}</>;
}
