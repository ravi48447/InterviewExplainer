#!/usr/bin/env node
/**
 * P01-T035 / T053 — Semantic color contrast validation.
 *
 * Computes WCAG 2.1 contrast ratios for every authoritative
 * text-on-surface pair declared in app/globals.css, for BOTH the
 * light (:root) and dark (.dark) themes. Flags any pair below the
 * WCAG AA threshold (4.5:1 for normal text, 3:1 for large/UI).
 *
 * Token values are read directly from the source of truth rather
 * than parsed out of CSS, so a mismatch here means the tokens in
 * globals.css drifted from this script — re-sync before re-running.
 */

// ── HSL → sRGB → linear → relative luminance (WCAG 2.1 §1.4.3) ──────────────
function hslToRgb(h, s, l) {
  h = ((h % 360) + 360) % 360;
  s /= 100;
  l /= 100;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0, g = 0, b = 0;
  if (h < 60)      { r = c; g = x; b = 0; }
  else if (h < 120){ r = x; g = c; b = 0; }
  else if (h < 180){ r = 0; g = c; b = x; }
  else if (h < 240){ r = 0; g = x; b = c; }
  else if (h < 300){ r = x; g = 0; b = c; }
  else             { r = c; g = 0; b = x; }
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function channelLin(c) {
  // c in [0,1]
  c /= 255;
  return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
}

function luminance(rgb) {
  const [r, g, b] = rgb.map(channelLin);
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

function contrastRatio(fgHsl, bgHsl) {
  const L1 = luminance(hslToRgb(...fgHsl));
  const L2 = luminance(hslToRgb(...bgHsl));
  const [hi, lo] = L1 > L2 ? [L1, L2] : [L2, L1];
  return (hi + 0.05) / (lo + 0.05);
}

// ── Token values (HSL triplets) — synced from app/globals.css ──────────────
// Light theme (:root)
const LIGHT = {
  background:        [220, 14, 98],
  surface:           [220, 14, 99],
  surfaceSubtle:     [220, 14, 96],
  surfaceElevated:   [0, 0, 100],
  muted:             [220, 14, 96],
  card:              [220, 14, 99],
  popover:           [0, 0, 100],
  elevated:          [0, 0, 100],
  hover:             [220, 14, 94],
  primary:           [221, 83, 53],
  success:           [160, 84, 36],
  warning:           [38, 92, 50],
  destructive:       [0, 84, 60],
  info:              [221, 83, 53],
  diffEasy:          [160, 70, 37],
  diffMedium:        [38, 92, 50],
  diffHard:          [0, 75, 58],
  heroBg:            [225, 24, 8],
  // text
  textPrimary:       [222, 47, 11],
  textSecondary:     [220, 14, 30],
  textMuted:         [220, 9, 46],
  textDisabled:      [220, 9, 70],
  textInverse:       [210, 40, 98],
  mutedForeground:   [220, 9, 46],
  cardForeground:    [222, 47, 11],
  popoverForeground: [222, 47, 11],
  primaryFg:         [0, 0, 100],
  successFg:         [0, 0, 100],
  warningFg:         [222, 47, 11],
  destructiveFg:     [0, 0, 100],
  infoFg:            [0, 0, 100],
  diffEasyFg:        [0, 0, 100],
  diffMediumFg:      [222, 47, 11],
  diffHardFg:        [0, 0, 100],
};

// Dark theme (.dark)
const DARK = {
  background:        [226, 21, 7],
  surface:           [225, 29, 11],
  surfaceSubtle:     [226, 21, 9],
  surfaceElevated:   [223, 27, 13],
  muted:             [226, 21, 9],
  card:              [223, 27, 13],
  popover:           [223, 27, 13],
  elevated:          [223, 26, 16],
  hover:             [223, 26, 18],
  primary:           [217, 91, 60],
  success:           [160, 84, 36],
  warning:           [38, 92, 50],
  destructive:       [350, 89, 60],
  info:              [217, 91, 60],
  diffEasy:          [160, 70, 37],
  diffMedium:        [38, 92, 50],
  diffHard:          [0, 75, 62],
  heroBg:            [225, 24, 8],
  // text
  textPrimary:       [210, 40, 98],
  textSecondary:     [214, 32, 91],
  textMuted:         [215, 25, 65],
  textDisabled:      [215, 25, 45],
  textInverse:       [210, 40, 98],
  mutedForeground:   [215, 25, 65],
  cardForeground:    [210, 40, 98],
  popoverForeground: [210, 40, 98],
  primaryFg:         [0, 0, 100],
  successFg:         [0, 0, 100],
  warningFg:         [222, 47, 11],
  destructiveFg:     [0, 0, 100],
  infoFg:            [0, 0, 100],
  diffEasyFg:        [0, 0, 100],
  diffMediumFg:      [222, 47, 11],
  diffHardFg:        [0, 0, 100],
};

// ── Pair definitions: foreground token → list of background tokens it sits on ─
const AA_NORMAL = 4.5;   // body text
const AA_LARGE  = 3.0;   // ≥18px or ≥14px bold; also UI components & graphical objects
const AAA_NORMAL = 7.0;

const pairs = [
  // Page-level text on each readable surface
  ["textPrimary",   ["background","surface","surfaceSubtle","surfaceElevated","muted","card","popover","elevated","hover"]],
  ["textSecondary", ["background","surface","surfaceSubtle","surfaceElevated","muted","card","popover","elevated","hover"]],
  ["textMuted",     ["background","surface","surfaceSubtle","muted","card","popover"]],
  ["mutedForeground",["background","surface","surfaceSubtle","muted","card","popover"]],
  ["cardForeground",["card"]],
  ["popoverForeground",["popover"]],
  // Action / semantic chips: their *-foreground sits on the chip color
  ["primaryFg",     ["primary"]],
  ["successFg",     ["success"]],
  ["warningFg",     ["warning"]],
  ["destructiveFg", ["destructive"]],
  ["infoFg",        ["info"]],
  ["diffEasyFg",    ["diffEasy"]],
  ["diffMediumFg",  ["diffMedium"]],
  ["diffHardFg",   ["diffHard"]],
  // Inverse text (light text meant for the dark hero/banner surface in both themes)
  ["textInverse",   ["heroBg"]],
];

function fmt(r) { return r.toFixed(2); }

function run(themeName, T) {
  console.log(`\n══ ${themeName} theme ══`);
  console.log(
    "pair".padEnd(34) +
    "ratio".padStart(8) +
    "AA-4.5".padStart(9) +
    "AA-3.0".padStart(9) +
    "AAA-7".padStart(8)
  );
  let fails = 0, warns = 0, passes = 0;
  for (const [fg, bgs] of pairs) {
    for (const bg of bgs) {
      const ratio = contrastRatio(T[fg], T[bg]);
      const okAA = ratio >= AA_NORMAL;
      const okLarge = ratio >= AA_LARGE;
      const okAAA = ratio >= AAA_NORMAL;
      let mark = "✓";
      let cls = "pass";
      if (!okLarge) { mark = "✗"; cls = "FAIL"; fails++; }
      else if (!okAA) { mark = "△"; cls = "warn"; warns++; }
      else passes++;
      const label = `${fg} on ${bg}`;
      console.log(
        label.padEnd(34) +
        fmt(ratio).padStart(8) +
        (okAA ? "  ok" : "  --").padStart(9) +
        (okLarge ? "  ok" : "  --").padStart(9) +
        (okAAA ? "  ok" : "  --").padStart(8) +
        `  ${mark}`
      );
    }
  }
  console.log(`\n  ${themeName}: ${passes} pass, ${warns} large-only (≥3:1,<4.5:1), ${fails} FAIL (<3:1)`);
  return { passes, warns, fails };
}

const l = run("Light", LIGHT);
const d = run("Dark", DARK);
const totalFails = l.fails + d.fails;
const totalWarns = l.warns + d.warns;
console.log(`\n══ Summary ══`);
console.log(`Light: ${l.passes} pass / ${l.warns} large-only / ${l.fails} fail`);
console.log(`Dark:  ${d.passes} pass / ${d.warns} large-only / ${d.fails} fail`);
console.log(`Total failures (below 3:1): ${totalFails}`);
console.log(`Total large-text-only (below 4.5:1): ${totalWarns}`);
process.exit(totalFails > 0 ? 1 : 0);
