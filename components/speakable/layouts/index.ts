/**
 * Per-archetype layout barrel — Phase 1.3.
 *
 * Each layout takes its narrowed Speakable* shape. The wrapper
 * Speakable.tsx (Phase 1.4) switches on `archetype` and selects from
 * `LayoutFor` exhaustively (TS `never` check on the discriminator).
 */

import type {
  SpeakableA,
  SpeakableB,
  SpeakableC,
  SpeakableD,
  SpeakableE,
  SpeakableF,
  SpeakableG,
} from "@/lib/speakable/schema";

import { Conceptual } from "./Conceptual";
import { Comparison } from "./Comparison";
import { Internals } from "./Internals";
import { Scenario } from "./Scenario";
import { Design } from "./Design";
import { SystemDesign } from "./SystemDesign";
import { Behavioral } from "./Behavioral";

export { Conceptual, Comparison, Internals, Scenario, Design, SystemDesign, Behavioral };
export { SpeakableShell } from "./shell";
export { BeatDispatch } from "./dispatch";

/** Discriminator → component map. The Speakable wrapper indexes here. */
export const LayoutFor = {
  A: Conceptual,
  B: Comparison,
  C: Internals,
  D: Scenario,
  E: Design,
  F: SystemDesign,
  G: Behavioral,
} as const satisfies {
  A: (props: { data: SpeakableA }) => React.ReactNode;
  B: (props: { data: SpeakableB }) => React.ReactNode;
  C: (props: { data: SpeakableC }) => React.ReactNode;
  D: (props: { data: SpeakableD }) => React.ReactNode;
  E: (props: { data: SpeakableE }) => React.ReactNode;
  F: (props: { data: SpeakableF }) => React.ReactNode;
  G: (props: { data: SpeakableG }) => React.ReactNode;
};

export type LayoutKey = keyof typeof LayoutFor;
