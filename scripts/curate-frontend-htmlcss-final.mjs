#!/usr/bin/env node
/**
 * curate-frontend-htmlcss-final.mjs — apply the final pattern to the remaining
 * html-css-fundamentals topics.
 */

import { applyTopic } from "./curate-frontend-final-pattern.mjs";

let total = 0;

total += applyTopic({
  moduleSlug: "html-css-fundamentals",
  topicSlug: "css-grid-basics",
  topicTitle: "Css Grid Basics",
  anchors: [
    {
      slug: "html-css-fundamentals-css-grid-basics-grid-model",
      slugName: "CSS Grid",
      question: "How does CSS Grid layout work — and when is it the right choice over Flexbox?",
      title: "Css Grid Model",
      direct:
        "Grid is a TWO-dimensional layout system: you define rows AND columns, then place items into cells or spans. container { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; } creates the tracks; 1fr = one share of FREE space (the flexible unit). Placement tools: line-based (grid-column: 1 / 3 — span across lines), span syntax (grid-column: span 2), and named areas (grid-template-areas for a visual blueprint). Choose Grid for PAGE-LEVEL and two-axis layouts (dashboards, galleries, holy-grail); Flexbox for ONE-AXE content rows/columns (nav bars, button groups) — the axis count IS the decision rule.",
      summary:
        "Grid = two-dimensional tracks (rows + columns) with fr units, line/span placement, and area templates; use it when the layout needs both axes.",
      mistake:
        "Reaching for Grid for one-directional content (over-engineering) or Flexbox for two-axis page scaffolding, and confusing justify- with align- properties.",
      profile: "mechanism",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "css",
      speakable:
        "The model, verified:\n\n```css\n.container {\n  display: grid;\n  grid-template-columns: 200px 1fr 1fr;  /* 3 tracks: fixed, then 2 flexible */\n  grid-template-rows: auto 1fr;           /* 2 rows: content, then grow */\n  gap: 16px;                             /* row-gap + column-gap in one */\n  height: 100vh;\n}\n\n/* 1fr = one share of FREE space — flexible distribution.\n   repeat(3, 1fr) = 3 equal columns.\n   minmax(200px, 1fr) = flexible but never smaller than 200px. */\n\n.sidebar  { grid-area: 1 / 1 / 3 / 2; }    /* row-start / col-start / row-end / col-end — lines, not cells */\n.main     { grid-column: 2 / 4; grid-row: 1; }  /* span across two columns */\n.footer   { grid-column: 1 / -1; }         /* -1 = the END line — full width */\n```\n\nThe placement axes (the confusion killer): justify-* moves items along the ROW axis (inline/main — left-right), align-* along the COLUMN axis (block — top-down). place-items: center center centers in both. The -self versions target one item; the container versions set the default for all children.\n\nThe killer feature (what interviews probe): grid-template-areas — a visual ASCII blueprint of the layout where names map to regions and media queries just RE-TEMPLATE:\n```css\n@media (min-width: 800px) {\n  .layout { grid-template-areas:\n    'header header'\n    'side   main' }\n}\n```\n\nGrid vs Flexbox (the decision rule): COUNT THE AXES. One axis of content flow (a nav bar, a card row, centering a group) → Flexbox; two axes — items must align in rows AND columns, or a region spans specific tracks → Grid. Modern practice: Grid for the page scaffold, Flexbox for components inside it — they compose, not compete.",
      flow:
        "flowchart TD\n    G[display: grid] --> T[template tracks: rows + columns]\n    T --> FR[fr = share of free space]\n    T --> MM[minmax = flexible with floor]\n    P[place items] --> L[line-based: 1 / 3 spans lines]\n    P --> SP[span 2 syntax]\n    P --> AR[named areas — visual blueprint]\n    AXES{layout axes?} -->|one| FLEX[Flexbox]\n    AXES -->|two| GRID2[Grid]\n    J[justify-items: row axis]  A[align-items: column axis]",
      deep:
        "The auto-placement algorithm (the hidden machinery): items not explicitly placed flow into cells by grid-auto-flow (row by default), with auto-fill/auto-fit controlling whether implicit tracks are created: repeat(auto-fill, minmax(220px, 1fr)) builds AS MANY 220px-floor columns as fit — the one-line responsive card grid that needs zero media queries. auto-FIT collapses empty tracks to 0 (a single card stretches full width); auto-FILL keeps the empty tracks (layout stays stable as cards come and go) — the distinction interviewers probe.\n\nThe fr math (the depth marker): fr distributes FREE space — the space left after fixed tracks, gaps, and content-based minimums (min-content) are paid. Two gotchas: 1fr has an implicit floor of min-content (long unbreakable words blow out the track — the fix is minmax(0, 1fr), the single most-quoted Grid fix), and gap is paid BEFORE fr distribution, so more gap means smaller fr tracks.\n\nSubgrid (the 2023+ answer to nested alignment): a nested grid can inherit the PARENT's tracks with grid-template-columns: subgrid — finally making card CONTENT line up across cards (headers, bodies, footers of unequal height). Before subgrid, equal-height cards with aligned internals required hacks; it's the feature that closed Grid's last alignment gap vs the old table layouts it replaced.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "html-css-fundamentals",
  topicSlug: "flexbox-basics",
  topicTitle: "Flexbox Basics",
  anchors: [
    {
      slug: "html-css-fundamentals-flexbox-basics-flex-model",
      slugName: "Flexbox",
      question: "How does Flexbox work — the container properties, item flexibility, and the classic centering recipe?",
      title: "Flexbox Model",
      direct:
        "Flexbox is a ONE-dimensional layout: items flow along the main axis (row or column), sized by flex-grow/shrink/basis, with free space distributed along that axis and alignment on BOTH axes. flex: 1 = grow 1, shrink 1, basis 0% (equal shares of FULL width); flex: 1 1 auto sizes to content THEN redistributes the remainder. The centering recipe: display:flex; justify-content:center (main axis); align-items:center (cross axis) — two lines, both axes, no hacks. Choose flex for one-axis content flow and intrinsic sizing; Grid for two-axis scaffolds.",
      summary:
        "One-axis layout: main axis (justify-content), cross axis (align-items), and flex-grow/shrink/basis distribution of free space.",
      mistake:
        "flex: 1 vs flex: 1 1 auto confusion (basis 0 vs content sizing), and forgetting flex-direction flips which axis justify- controls.",
      profile: "mechanism",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "css",
      speakable:
        "The model, verified:\n\n```css\n.container {\n  display: flex;\n  flex-direction: row;       /* main axis: left→right (column flips it) */\n  justify-content: space-between;  /* ALONG main axis */\n  align-items: center;      /* cross axis — the vertical center in row */\n  gap: 12px;\n  flex-wrap: wrap;          /* allow rows to break */\n}\n\n/* THE ITEM TRIO — how free space is shared */\n.item {\n  flex-grow: 1;     /* take a share of FREE space (default 0) */\n  flex-shrink: 1;   /* yield space when overflowing (default 1) */\n  flex-basis: 0%;   /* starting size BEFORE grow/shrink (default auto) */\n}\n/* flex: 1  → 1 1 0%   — EQUAL columns regardless of content\n   flex: 1 1 auto → size to CONTENT first, then share the rest\n   flex: 0 0 200px → fixed — neither grows nor shrinks */\n\n/* THE CENTERING RECIPE (both axes, two lines) */\n.center { display: flex; justify-content: center; align-items: center; }\n```\n\nThe axis flip (the #1 confusion): justify-content ALWAYS works on the MAIN axis, align-items on the CROSS axis — when flex-direction is column, justify- becomes vertical and align- horizontal. Internalize 'main vs cross', not 'x vs y'.\n\nThe shrink mechanics (the overflow interview question): when items overflow the container, flex-shrink divides the DEFICIT proportionally to basis — flex-shrink: 0 pins an item (sidebars that shouldn't compress), min-width: 0 on flex items is the classic fix for content (long words, inputs) refusing to shrink below content size.",
      flow:
        "flowchart TD\n    F[display: flex] --> DIR[flex-direction sets main axis]\n    DIR --> JC[justify-content: main axis distribution]\n    DIR2[cross axis] --> AI[align-items: cross axis alignment]\n    SPACE[free space] --> G[grow distributes surplus]\n    OVER[overflow deficit] --> S[shrink yields proportionally]\n    B[basis: starting size] --> AUTO[auto = content size]\n    B0[basis 0 = equal shares]\n    ONE[one axis of flow] --> FLEXUSE[use Flexbox]\n    TWO[two axes / scaffold] --> GRIDUSE[use Grid]",
      deep:
        "The distribution algorithm (in order — why overrides happen): (1) basis determines hypothetical main size (content, fixed, or specified); (2) if the sum overflows, shrink subtracts the deficit weighted by shrink×basis; (3) if space remains, grow adds the surplus weighted by grow. Auto margins on a flex item absorb ALL free space BEFORE justify-content applies — margin-left: auto on a nav's last item pins it right, the classic one-line 'push one item' idiom that justify-content can't do.\n\nThe two shorthand traps (interview staples): flex-basis: 0% (flex: 1) makes columns equal REGARDLESS of content — right for grid-like rows; flex-basis: auto sizes to content first — right for toolbars where a wider label deserves a wider button. And flex: none (0 0 auto) is the explicit 'never resize' — the sticky sidebar.\n\nWhy flex-wrap changes the model: a wrapped container is a stack of LINES, each line sized independently — align-content (not align-items) then distributes the LINES in the container's cross axis (the property everyone forgets until a wrapped list needs vertical spacing). Nested flex for centering gotcha: an item that must center inside a stretched parent needs align-items on the PARENT, not margin tricks — stretch (the default) already fills the cross axis, which is why a single align-items: center does so much work.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "html-css-fundamentals",
  topicSlug: "forms-and-inputs",
  topicTitle: "Forms And Inputs",
  anchors: [
    {
      slug: "html-css-fundamentals-forms-and-inputs-form-controls",
      slugName: "HTML forms",
      question: "What makes a form accessible and correct — native validation, labels, and the submit flow?",
      title: "Forms And Inputs",
      direct:
        "Native semantics first: <label for> bound to input id (click target + screen reader announcement), type=email/number/url for free keyboard + validation, required/min/maxlength/pattern for constraint validation BEFORE submit (JS-free), <fieldset>/<legend> for radio/checkbox groups. The submit flow: <button type=submit> triggers validate → submit event → FormData serialization; type=button avoids the implicit-SUBMIT default (the classic mystery-reload bug); preventDefault for JS-handled submission. Accessible errors: aria-describedby pointing at the message, aria-invalid on the field, errors in TEXT (not color alone).",
      summary:
        "Label binding, native constraint validation, the submit flow, and accessible error reporting.",
      mistake:
        "Unlabeled inputs (placeholder-as-label), and button type omissions causing surprise form submissions.",
      profile: "implementation",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "html",
      speakable:
        "The accessible form skeleton, verified:\n\n```html\n<form action=\"/signup\" method=\"post\" novalidate>  <!-- novalidate when JS validates -->\n  <fieldset>\n    <legend>Delivery address</legend>          <!-- groups announce together -->\n\n    <label for=\"email\">Email</label>            <!-- for ↔ id: click target + name for SRs -->\n    <input id=\"email\" type=\"email\" required\n           autocomplete=\"email\"\n           aria-describedby=\"email-error\" />\n    <span id=\"email-error\" role=\"alert\"></span> <!-- errors announced on fill -->\n\n    <label for=\"qty\">Quantity</label>\n    <input id=\"qty\" type=\"number\" min=\"1\" max=\"9\" />\n    <!-- native validation: min/max/pattern/maxlength — free, JS-free -->\n  </fieldset>\n  <button type=\"submit\">Place order</button>   <!-- type defaults to SUBMIT! -->\n  <button type=\"button\">Cancel</button>          <!-- must opt out explicitly -->\n</form>\n```\n\nThe submit flow (what actually happens): submit button → browser runs constraint validation (checkValidity; invalid → :invalid styling + bubble messages, submit BLOCKED, 'invalid' event fires) → valid → 'submit' event fires → JS preventDefault() if handling manually → FormData gathers name/value pairs (un-named inputs are NOT submitted — the silent bug) → navigation or fetch.\n\nThe three free wins worth quoting: (1) constraint validation API — input.validity gives valid/valueMissing/patternMismatch booleans and setCustomValidity for real messages; (2) autocomplete tokens (email, given-name, street-address) let browsers and password managers fill correctly — a11y AND conversion; (3) input type drives keyboard (numeric pad on type=tel/number on mobile) — mobile UX for free.",
      flow:
        "flowchart LR\n    S[submit button] --> V[constraint validation]\n    V -->|invalid| IV[invalid event + :invalid, blocked]\n    V -->|valid| SU[submit event]\n    SU -->|no preventDefault| NAV[navigation with FormData]\n    SU -->|preventDefault| JS[JS handler: fetch + FormData]\n    N[no name attribute] --> X[input silently not submitted]\n    ARIA[aria-describedby + aria-invalid] --> ERR[errors announced in text]",
      deep:
        "Controlled vs native validation (the architecture split): native constraint validation blocks submission with zero JS but styles and messages are browser-limited; the standard production pattern is novalidate + JS validation on blur/submit using the SAME validity API (input.validity.valueMissing etc. for logic, setCustomValidity for messages) — so you keep the browser's semantics and field-level model while owning the UX. React's controlled inputs go further: state IS the value and validation lives in render — the trade is re-implementing what the browser does, bought for single-source-of-truth control.\n\nThe label details interviewers probe: a label wraps OR binds by for/id — wrapping an input inside <label> works without ids (but for/id is explicit and testable); one label per input, and placeholder is NOT a label (disappears on type, fails contrast rules, skipped by many screen readers — 'placeholder-as-label' is a flagged a11y bug, not a pattern). aria-labelledby covers the cases where a visible text label can't be adjacent (table-row forms).\n\nThe name/value contract: FormData takes name attributes — name on every submitted input; name but no id on radios within a group (the SHARED name is the grouping, checked selects the value); value on the button that submitted is included (button-per-action patterns depend on it); disabled inputs are skipped entirely (the 'why isn't this field posting' answer).",
    },
  ],
});

total += applyTopic({
  moduleSlug: "html-css-fundamentals",
  topicSlug: "responsive-design",
  topicTitle: "Responsive Design",
  anchors: [
    {
      slug: "html-css-fundamentals-responsive-design-responsive-strategy",
      slugName: "responsive design",
      question: "What is the modern responsive strategy — media queries, fluid units, and container queries?",
      title: "Responsive Strategy",
      direct:
        "Three layers: (1) FLUID units first — % / vw / rem / min()/max()/clamp() so components adapt without breakpoints; clamp(min, preferred, max) is the one-line fluid type scale. (2) Media queries for the COARSE reflows — layout-template swaps, hide/show chrome — written min-width (mobile-first: base styles for small, add capability upward). (3) Container queries for component-level responsiveness — @container matches the PARENT's size, not the viewport, so a card is 2-column in a wide slot and stacked in a narrow slot wherever it lands. Modern additions: picture/srcset for art direction and resolution, and prefers-reduced-motion for motion a11y.",
      summary:
        "Fluid units and clamp() first, min-width media queries for reflows, and container queries for component-scoped responsiveness.",
      mistake:
        "Pixel-locked layouts with breakpoint walls, and viewport units breaking zoom/mobile text-size (vw without a rem floor).",
      profile: "design",
      stage: "fundamentals",
      priority: "must-prepare",
      language: "css",
      speakable:
        "The three layers, verified:\n\n```css\n/* 1. FLUID FIRST — adapt without breakpoints */\n.wrapper { width: min(1100px, 100% - 2rem); }        /* floor + padding-safe */\n:root { --space: clamp(1rem, 2vw + 0.5rem, 2rem); } /* fluid, bounded */\nh1 { font-size: clamp(1.75rem, 1rem + 3vw, 3.5rem); } /* the one-line fluid type */\n\n/* 2. MEDIA QUERIES for coarse reflows — min-width, mobile-first */\n.layout { grid-template-areas: 'stacked'; }        /* base: small screens */\n@media (min-width: 48rem) {                          /* ADD capability upward */\n  .layout { grid-template-areas: 'side main'; }\n}\n\n/* 3. CONTAINER QUERIES — component responds to its SLOT */\n.card-wrap { container-type: inline-size; }          /* the boundary */\n@container (min-width: 30rem) {                       /* card's OWN width */\n  .card { display: grid; grid-template-columns: 1fr 2fr; }\n}\n```\n\nWhy min-width/mobile-first (the strategy point): base styles must hold on the most constrained device; enhancements ADD. max-width queries make each big-screen style an OVERRIDE of overrides — and the base becomes 'desktop first, hopefully mobile survives', which inverts the risk.\n\nThe container-query unlock (the modern answer): viewport queries can't style a card differently in a sidebar vs a main column — same viewport, different slots. @container makes the component self-adaptive and REUSABLE — the piece media queries never covered. container-type: inline-size is the common boundary (block-size containment is heavier and rarer).\n\nThe a11y/media pairings worth naming: prefers-reduced-motion: reduce (disable non-essential animation), prefers-color-scheme (dark mode), and the zoom caveat — vw-only text breaks browser text zoom (no rem floor): always clamp with rem bounds, never pure vw.",
      flow:
        "flowchart TD\n    FL[fluid units: % rem vw clamp] -->|no breakpoint needed| S1[smooth adapt]\n    MQ[@media min-width] -->|coarse reflow| S2[template swaps, mobile-first]\n    CQ[@container] -->|component slot| S3[card adapts to its parent, not viewport]\n    IMG[srcset + picture] --> S4[art direction + resolution]\n    RM[prefers-reduced-motion] --> A11Y[motion off]\n    VW[vw-only text] -->|no rem floor| BUG[breaks text zoom]",
      deep:
        "The unit decision table (the depth interviewers probe): px only for borders/hairlines; rem for type and spacing that MUST track user font-size settings (zoom-safe); em for spacing that should scale WITH its component's context; % for sizes relative to parent; vw/vh for viewport-tied chrome (fuller heroes) — never for body text (zoom breakage); ch for monospace-width fields (ex: input width: 40ch). The systematic trap: 100vh on mobile ignores dynamic toolbars — dvh (dynamic viewport height) is the 2023+ fix; svh/lvh give smallest/largest variants for stable layouts vs immersive ones.\n\nclamp() mechanics (why it's not just sugar): clamp(min, preferred, max) = max(min, min(preferred, max)) — the preferred value (usually a calc mixing rem and vw) interpolates smoothly, then the rem bounds ARREST it at both ends: fluid where it's safe, zoom-respecting at the extremes. The same trick works for spacing and for grid minmax(220px, 1fr) tracks.\n\nContainer query resolution details: queries match the NEAREST ancestor with a container-type (or named container: container: sidebar / @container sidebar (min-width: 30rem)) — containment (inline-size) is a real layout containment: the container's size no longer depends on its CONTENT's inline axis, which is what makes matching deterministic. Style queries (@container style(--variant: primary)) arrive after size queries — the feature to name when asked 'what's next'.",
    },
  ],
});

total += applyTopic({
  moduleSlug: "html-css-fundamentals",
  topicSlug: "scenario-based",
  topicTitle: "Html Css Scenario Based",
  anchors: [
    {
      slug: "html-css-fundamentals-scenario-based-layout-debug",
      slugName: "HTML/CSS debugging scenarios",
      question: "A layout breaks at a specific breakpoint — what's your debugging sequence for CSS issues?",
      title: "Layout Debug Sequence",
      direct:
        "A repeatable sequence: (1) REPRODUCE exactly — viewport width, zoom, which element first. (2) Identify the box that breaks — DevTools computed box: width/height, margin-collapse, which flex/grid track it sits in. (3) Test the suspects in order: overflow (the 100vw-scrollbar trap; min-width: 0 on flex/grid children), height assumptions (percentage heights need a defined parent chain), z-index/stacking contexts (position + z-index create contexts — 'why is my modal under the header' is a context question). (4) Confirm with a temporary outline (outline: 1px solid red — visible without changing layout, unlike border). Fix the CAUSE (the constraint), not the symptom (a random margin).",
      summary:
        "Reproduce, find the breaking box with DevTools computed styles, test the classic suspects (overflow, height chains, stacking contexts), fix the constraint.",
      mistake:
        "Fixing symptoms with magic margins/heights instead of the violated constraint, and debugging without a consistent reproduction.",
      profile: "debugging",
      stage: "practical",
      priority: "must-prepare",
      language: "css",
      speakable:
        "The sequence, with the checklist:\n\n```css\n/* THE PROBE — visible without changing layout (border shifts it!) */\n* { outline: 1px solid rgba(255, 0, 0, 0.3); }   /* temp: see every box */\n\n/* THE CLASSIC FIXES, by symptom */\n.flex-child { min-width: 0; }       /* flex/grid items refuse to shrink\n                                       below min-content — the #1 overflow fix */\n.parent { overflow: auto; }        /* reveal WHERE overflow starts */\n.modal { position: fixed; z-index: 50; }  /* escapes transforms — check\n                                                parent transform! it becomes\n                                                the containing block */\n```\n\nThe ordered suspects (recite this):\n1. OVERFLOW — 'why is there a horizontal scrollbar?' → 100vw includes the scrollbar width (use width: 100%), a flex/grid child with long unbreakable content (min-width: 0), or negative margins/fixed widths on small screens. Diagnose: scroll the page, outline boxes, find the first box wider than the viewport.\n2. HEIGHT — percentage heights need EVERY ancestor to a defined height; min-height: 100vh on a mid-chain element breaks the contract for its children. Flex alternative: stretch (the default align-items) fills the parent without height math.\n3. STACKING — 'my dropdown/modal is behind something': z-index only applies to positioned/flex/grid items, and each position+z-index (plus transform/filter/opacity < 1) opens a NEW stacking context — a z-index: 9999 child can't escape its parent's z-index: 1 context. The fix is the PARENT's z-index, not the child's.\n4. MARGIN COLLAPSE — vertical margins between siblings/parent-child collapse to the larger; the layout shifts 'mysteriously'. Padding and borders prevent collapsing; flex/grid containers never collapse children's margins.\n5. CASCADE/SPECIFICITY — last stylesheet wins at equal specificity; DevTools shows the struck-through losing rules — read WHICH rule actually applied before writing a new one (the !important spiral starts by skipping this step).",
      flow:
        "flowchart TD\n    R[reproduce: width, zoom, element] --> B[DevTools: computed box of the broken element]\n    B --> S1{overflow?} -->|yes| F1[min-width 0 / width 100% not 100vw]\n    B --> S2{height chain?} -->|broken| F2[define ancestor height or use flex stretch]\n    B --> S3{stacking?} -->|hidden| F3[raise the PARENT context z-index]\n    B --> S4{margins?} -->|collapse| F4[padding/border/flex parent]\n    B --> S5{cascade?} -->|wrong rule wins| F5[fix specificity, read struck-through rules]\n    FIX[fix the constraint, not the symptom]",
      deep:
        "The DevTools technique that separates seniors (evidence over guesses): the Computed pane shows the RESOLVED values (what actually applied — the 'set but not applied' trap is usually display: contents or a shorthand overriding a longhand); the Cascade layer of the Styles pane (with 'struck-through' losers and their specificity) answers WHY a rule lost — and @layer or :where() are the modern specificity MANAGEMENT tools (importing normalize into a @layer makes base styles lose to everything by design instead of by !important wars).\n\nThe reproduction discipline (why it comes first): zoom levels change effective viewport; browser text-size settings (not zoom) change rem-derived sizes — both create 'cannot reproduce' reports. Fix the reproduction: exact width (device toolbar), default zoom, clean profile (extensions inject CSS). THEN the failure is deterministic and the fix is provable.\n\nThe transform containing-block trap (the one that breaks position: fixed): a parent with transform/filter/perspective/contain makes itself the containing block for FIXED descendants — the 'modal scrolls with the page' bug is almost always an animated (transform) ancestor. The same family: backdrop-filter, will-change: transform. DevTools' 'highlight containing block' or reading the ancestor chain for these properties is the 30-second diagnosis.",
    },
  ],
});

console.log(`Curated html-css-fundamentals remaining: ${total} questions.`);
