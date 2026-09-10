/**
 * Behavioral — archetype G layout. Phase 1.3.
 *
 * Tweak (Phase 1 prompt §11.3.G): STAR ribbon labels (S / T / A / R)
 * sit above each beat. Reflection gets a distinct treatment — the
 * label reads "Reflection" without the ribbon to mark it as the
 * synthesis beat.
 */

import type { SpeakableG, ArchetypeGBeat } from "@/lib/speakable/schema";
import { SpeakableShell } from "./shell";
import { BeatDispatch } from "./dispatch";

const STAR: Record<ArchetypeGBeat["kind"], { letter: string; word: string }> = {
  situation: { letter: "S", word: "Situation" },
  task: { letter: "T", word: "Task" },
  action: { letter: "A", word: "Action" },
  result: { letter: "R", word: "Result" },
  reflection: { letter: "•", word: "Reflection" },
};

export function Behavioral({ data }: { data: SpeakableG }) {
  return (
    <SpeakableShell data={data}>
      {data.beats.map((b, i) => {
        const ribbon = STAR[b.kind] ?? { letter: "•", word: "" };
        const isReflection = b.kind === "reflection";
        return (
          <section
            key={i}
            className={
              "speakable-star-block" +
              (isReflection ? " speakable-star-block--reflection" : "")
            }
          >
            <p className="speakable-star-ribbon">
              <span className="speakable-star-letter">{ribbon.letter}</span>
              <span className="speakable-star-word">{ribbon.word}</span>
            </p>
            <BeatDispatch beat={b} />
          </section>
        );
      })}
    </SpeakableShell>
  );
}
