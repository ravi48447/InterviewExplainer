# Arbitrary Value Replacement Audit (P01-T275–T290)

Documents that all new (Batch 13–14) shared components use the token system exclusively — no arbitrary values where a token exists.

## Audit method

Grepped all new component files for arbitrary-value patterns (`[...]` in class strings, hex colors, raw rem/px where a token exists) and confirmed each resolves to a token.

## Results by category

### Color (T275) — ✅ PASS
All colors use `hsl(var(--token))` via Tailwind theme keys (`bg-card`, `text-foreground`, `border-border`, `text-muted-foreground`, `bg-primary/10`, etc.). No hex literals, no `bg-white`, no `text-gray-500`.

### Text (T276) — ✅ PASS
All text colors use semantic tokens. No arbitrary text color classes.

### Border (T277) — ✅ PASS
All borders use `border-border` / `border-primary/30` / `border-warning/40` etc. No arbitrary border colors.

### Radius (T278) — ✅ PASS
All radii use `rounded-md` / `rounded-sm` / `rounded-full` which resolve to `--radius-*` tokens via the Tailwind config. No arbitrary `rounded-[Xpx]`.

### Shadow (T279) — ✅ PASS
All shadows use `shadow-sm` / `shadow-md` resolving to `--shadow-*` tokens. No arbitrary `shadow-[...]`.

### Width (T280) — ✅ PASS
Container widths use `.page-container` / `.reading-container` / `.wide-container` (token-backed). `max-w-*` utilities resolve to `--reading-width`/`--content-width`/`--wide-width`. No arbitrary `max-w-[...]`.

### Spacing (T281) — ✅ PASS
All spacing uses Tailwind utilities (`p-4`, `gap-2`, `space-y-2`, `mb-3`) which resolve to `--space-*` tokens via the config. No arbitrary `p-[Xpx]` where a token exists.

**Exception:** `min-w-[...]` is not used; `.touch-target` uses raw `2.5rem`/`2.75rem` — these are touch-target minimums (WCAG 2.5.5), not general spacing, and are intentionally fixed (40px/44px), so a token is not appropriate.

### Typography (T282) — ✅ PASS
All type sizes use `text-sm` / `text-xs` / `text-lg` / `text-base`. Weights use `font-medium` / `font-semibold` / `font-bold`. No arbitrary `text-[Xpx]`.

### Hover (T283) — ✅ PASS
All hover states use tokenized classes: `hover:bg-muted`, `hover:border-border-strong`, `hover:text-foreground`, `hover:bg-muted/50`. No arbitrary hover values.

### Focus (T284) — ✅ PASS
All focus states use `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1`. No arbitrary focus ring values.

### Nested cards (T285) — ✅ PASS
No Card renders inside another Card in any new component.

### Gradients (T286) — ✅ PASS
No gradients (`bg-gradient-*`, `from-*`, `to-*`) in any new component.

### Borders (T287) — ✅ PASS
All borders are 1px (default) via `border-border`. No arbitrary border widths. The `border-w-*` scale exists for emphasis where needed.

### Badges (T288) — ✅ PASS
Badge uses only semantic + difficulty variants. No arbitrary color badges.

### Icons (T289) — ✅ PASS
All icons from `lucide-react`. No mixed icon libraries. Consistent sizing via `[&_svg]:size-4` (buttons) and explicit `h-X w-X` elsewhere.

### Motion (T290) — ✅ PASS
No `transition-all`. No `scale-*` transforms on hover. Motion uses `transition-colors` / `transition` with tokenized durations where applicable. Reduced-motion rule zeroes all durations centrally.

## Inline style exceptions (documented, justified)

- `app/dev/v2/page.tsx` sets `['--grid-min' as string]: '18rem'` and `['--grid-gap' as string]: '1rem'` — these set CSS custom properties (not arbitrary Tailwind values) to parameterize the `.grid-auto` / `.grid-*` primitives. This is the intended API for those primitives.
- `globals.css` `.touch-target` uses `2.5rem` / `2.75rem` — fixed WCAG minimums, not general spacing.

## Conclusion

All new shared components (Batch 13–14) are token-compliant. No arbitrary values exist where a token is defined. The audit passes.
