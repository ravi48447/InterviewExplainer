/**
 * Speakable barrel — Phase 1.4.
 *
 * Public surface used by the Phase 1.9 renderer integration and the
 * Phase 1.8 admin review UI:
 *   - <Speakable source={...}/>  — wrapper that picks v2-or-legacy
 *   - <Legacy data={...}/>       — direct fallback (rarely used directly)
 *   - LayoutFor                  — discriminator → component map
 *   - {primitives}               — rare direct primitive usage
 */

export { Speakable, type SpeakableProps } from "./Speakable";
export { Legacy, type LegacyProps, type LegacyVariant } from "./Legacy";
export { LayoutFor, type LayoutKey, BeatDispatch, SpeakableShell } from "./layouts";
export * from "./primitives";
