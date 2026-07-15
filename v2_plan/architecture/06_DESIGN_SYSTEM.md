# Interview Explainer V2 — Design System

**Document:** `06_DESIGN_SYSTEM.md`
**Status:** Foundational / Visual System
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md`, `01_PRODUCT_PHILOSOPHY.md`, `02_AI_CONSTITUTION.md`, `03_USER_PSYCHOLOGY.md`, `04_UX_PRINCIPLES.md`, `05_INFORMATION_ARCHITECTURE.md`
**Purpose:** Define the visual foundations, density rules, typography system, color philosophy, surfaces, spacing, borders, radii, shadows, responsive behavior, and visual constraints that govern Interview Explainer V2.

---

# 1. Purpose of This Document

Interview Explainer V2 requires a deliberate visual system.

The current product contains substantial information.

As content and features grow, the design system must prevent the interface from becoming:

* dense,
* noisy,
* excessively colorful,
* over-containerized,
* visually fragmented,
* inconsistent,
* tiring to read,
* or increasingly complex with every new feature.

The design system exists to create:

* visual consistency,
* reading comfort,
* predictable hierarchy,
* implementation efficiency,
* accessibility,
* responsive stability,
* and long-term scalability.

The goal is not to make every page look identical.

The goal is to ensure that every page feels like part of one coherent product.

The central visual principle is:

> **Interview Explainer should feel calm enough for long study sessions, structured enough for complex preparation, and precise enough to inspire trust.**

---

# 2. The V2 Visual Direction

Interview Explainer V2 should feel:

* calm,
* intelligent,
* focused,
* spacious,
* precise,
* modern,
* professional,
* readable,
* restrained,
* and trustworthy.

It should not feel:

* crowded,
* neon,
* dashboard-heavy,
* gaming-oriented,
* excessively corporate,
* visually childish,
* template-driven,
* or artificially futuristic.

The visual identity should support the product's purpose:

> Helping users think clearly during a stressful preparation process.

The design must not become another source of cognitive load.

---

# 3. The Primary Design Problem

The major risk for Interview Explainer is not insufficient visual styling.

It is excessive visual competition.

A content-rich product naturally accumulates:

* navigation,
* cards,
* tags,
* progress,
* metadata,
* icons,
* filters,
* sidebars,
* CTAs,
* recommendations,
* search,
* and status indicators.

If each element receives strong visual treatment, the result becomes exhausting.

Therefore, V2 should operate on the principle:

> **Not everything important needs to look loud.**

Hierarchy should come primarily from:

1. Position.
2. Typography.
3. Spacing.
4. Grouping.
5. Contrast.
6. Surface.
7. Color.

Color should not be the first tool used to establish hierarchy.

---

# 4. The Visual Attention Budget

Every page has a limited attention budget.

Strong visual treatments consume that budget.

Examples include:

* saturated colors,
* large typography,
* thick borders,
* strong shadows,
* gradients,
* badges,
* icons,
* animation,
* and elevated surfaces.

A page should use only a small number of strong attention signals simultaneously.

If everything receives emphasis:

> Nothing is emphasized.

Each page should define:

* one dominant visual region,
* a small number of supporting regions,
* and quiet background structure.

---

# 5. The Quiet Interface Principle

The interface should become visually quieter as the user moves deeper into preparation.

Conceptually:

```text
Homepage
Moderate visual expression

↓

Preparation Hub
Structured visual hierarchy

↓

Module
Reduced decorative complexity

↓

Question Page
Reading-first visual quietness

↓

Mock Interview Session
Minimal distraction
```

This does not mean the design becomes unfinished.

It means the visual system adapts to user intent.

The deeper the focus:

> **The less the interface should compete with the task.**

---

# 6. Design Tokens Are Mandatory

Visual values should be represented through reusable design tokens.

Do not scatter arbitrary values throughout the application.

Token categories should include:

```text
Color
Typography
Spacing
Sizing
Radius
Border
Shadow
Motion
Breakpoints
Layering
Content Width
```

Tokens should support:

* light mode,
* dark mode,
* semantic states,
* responsive behavior,
* and future brand evolution.

Implementation may use:

* CSS custom properties,
* Tailwind configuration,
* theme objects,
* or an equivalent system.

The principle is:

> **Components consume semantic tokens, not arbitrary visual values.**

---

# 7. Semantic Tokens Over Raw Colors

Components should generally use semantic tokens such as:

```text
background
foreground
surface
surface-subtle
surface-elevated
border
border-strong
muted
muted-foreground
primary
primary-foreground
success
warning
danger
info
focus
```

Avoid components directly depending on arbitrary values such as:

```text
blue-500
gray-700
slate-900
```

unless those values are implementation details behind semantic tokens.

This allows:

* coherent theming,
* safer dark mode,
* easier future redesign,
* and consistent semantic meaning.

---

# 8. Color Philosophy

Color should communicate:

* identity,
* state,
* action,
* and limited emphasis.

Color should not be used to:

* decorate every section,
* differentiate every card,
* create artificial variety,
* or compensate for weak hierarchy.

The V2 color system should be restrained.

Most of the interface should be built from:

* neutral backgrounds,
* neutral text,
* subtle borders,
* and controlled surface variation.

Accent colors should remain intentional.

---

# 9. The Neutral Foundation

The majority of the interface should use a neutral visual foundation.

The exact final palette should be validated in implementation.

The conceptual system should include:

## Light Mode

* soft page background,
* clear primary text,
* slightly muted secondary text,
* subtle borders,
* limited surface separation.

## Dark Mode

* deep neutral background,
* slightly lighter content surfaces where needed,
* high but comfortable text contrast,
* subtle borders,
* restrained accent brightness.

Avoid pure extremes as the universal default.

Examples:

* pure white across every large surface can create glare,
* pure black across every dark surface can create harsh contrast.

The system should optimize for prolonged use.

---

# 10. Brand Accent

Interview Explainer should have one primary brand accent family.

The exact final hue should be validated against:

* existing brand recognition,
* accessibility,
* light mode,
* dark mode,
* links,
* buttons,
* focus states,
* and data visualization.

The primary accent should be used for:

* primary actions,
* selected states,
* active navigation,
* important links,
* and limited brand expression.

It should not appear on every card border and heading.

The accent becomes more valuable when it is scarce.

---

# 11. Semantic Colors

Semantic colors should have stable meaning.

Conceptually:

```text
Success
→ positive completion or successful state

Warning
→ caution or attention

Danger
→ destructive action, failure, critical error

Info
→ neutral informational state
```

Do not use semantic colors merely for decorative variety.

A green card should not mean one thing on one page and something unrelated elsewhere.

---

# 12. Difficulty Colors Must Be Restrained

Difficulty may use semantic differentiation.

However, the system should avoid highly saturated:

* green,
* yellow,
* red

badges appearing across every question list.

Difficulty indicators should remain secondary.

Possible strategies include:

* subtle text,
* quiet tinted background,
* small marker,
* or compact badge.

The exact component treatment belongs in the component library.

The design principle is:

> **Difficulty should be recognizable without dominating the page.**

---

# 13. Color Must Never Be the Only Signal

States must remain understandable without color alone.

Examples:

A selected navigation item should not rely only on a blue color.

It may also use:

* weight,
* indicator,
* background,
* or structure.

An error should include:

* appropriate text,
* icon where useful,
* and accessible semantics.

This is mandatory for accessibility.

---

# 14. Dark Mode Is Not an Inversion

Dark mode must be designed as its own coherent theme.

Do not simply invert:

* white to black,
* black to white,
* and preserve all accent intensities.

Dark mode requires careful control of:

* surface elevation,
* border contrast,
* text contrast,
* code blocks,
* shadows,
* hover states,
* and saturated colors.

The objective is:

> **A calm dark reading environment, not a glowing control panel.**

---

# 15. Dark Mode Must Avoid the Neon Dashboard Effect

Common dark-mode failure patterns include:

* bright blue borders around every card,
* glowing buttons,
* saturated status colors,
* excessive gradients,
* high-contrast panels,
* and multiple luminous accents.

Interview Explainer V2 should avoid this.

Dark mode should primarily use:

* neutral depth,
* subtle surface changes,
* typography,
* and limited accent usage.

---

# 16. Light Mode Must Avoid Sterile White Emptiness

A calm interface does not require:

* pure white everywhere,
* no borders,
* no hierarchy,
* or excessive blank space.

Light mode should retain:

* clear grouping,
* subtle surface relationships,
* readable contrast,
* and visual warmth where appropriate.

Minimalism without hierarchy becomes ambiguity.

The goal is structured calmness.

---

# 17. Typography Is the Primary Hierarchy System

V2 should rely more heavily on typography and spacing than on:

* cards,
* colored backgrounds,
* and decorative containers.

Typography should establish:

* page hierarchy,
* content structure,
* reading rhythm,
* metadata priority,
* and interaction hierarchy.

A user should be able to understand much of the page structure even if all borders were removed.

---

# 18. Font Family

The primary interface font should be a highly readable modern sans-serif.

A strong default is:

```text
Inter
```

or an equivalent high-quality system-compatible sans-serif.

The final selection should prioritize:

* readability,
* broad character support,
* variable font support where useful,
* performance,
* and consistency across operating systems.

Avoid selecting a font primarily because it looks distinctive in screenshots.

Interview Explainer is a reading product.

Readability has priority over novelty.

---

# 19. System Font Fallback

The font stack must include robust fallbacks.

Conceptually:

```text
Primary UI Font
→ System Sans Serif
→ Generic Sans Serif
```

The application should remain usable if:

* the web font fails,
* loads slowly,
* or is unavailable.

Typography must not collapse because one asset fails.

---

# 20. Monospace Typography

Code should use a dedicated monospace stack.

Potential primary choices include:

```text
JetBrains Mono
Geist Mono
IBM Plex Mono
```

The final choice should prioritize:

* code readability,
* character distinction,
* performance,
* and compatibility.

Code typography should remain visually distinct from prose without becoming decorative.

---

# 21. Typography Scale

The design system should use a limited, intentional typography scale.

A conceptual scale may include:

```text
Display
Page Title
Section Heading
Subsection Heading
Body Large
Body
Body Small
Label
Caption
Code
```

The implementation should avoid dozens of nearly identical font sizes.

Each typography role must have a clear purpose.

---

# 22. Suggested Typography Direction

The exact values should be validated visually and responsively.

A conceptual starting direction:

```text
Display:
48–56px desktop
36–44px mobile
Used rarely

Page Title:
32–40px desktop
28–34px mobile

Section Heading:
24–30px

Subsection Heading:
18–22px

Body Large:
17–18px

Body:
16px

Body Small:
14px

Caption:
12–13px

Code:
13–15px
```

These are starting ranges.

They are not permission to use arbitrary values between them.

The final token scale should be intentionally defined.

---

# 23. Reading Body Text

Long-form answer content should prioritize comfort.

A strong default target is approximately:

```text
16–18px body size
1.6–1.75 line height
```

The exact combination depends on:

* font family,
* content width,
* platform,
* and screen size.

Dense technical answers should not use tiny text merely to fit more information above the fold.

Users are preparing.

They are not scanning a financial terminal.

---

# 24. Heading Hierarchy

Heading differences should come from a combination of:

* size,
* weight,
* spacing,
* and position.

Avoid relying on:

* different colors for every heading level,
* excessive boldness,
* or decorative lines around every section.

Heading hierarchy should remain clear in both themes.

---

# 25. Font Weight System

Use a restrained weight system.

Conceptually:

```text
400
Regular body text

500
Medium emphasis and selected UI

600
Primary headings and strong interface labels

700
Rare high emphasis
```

Avoid using bold text excessively.

If too much text is bold:

> Bold stops functioning as emphasis.

---

# 26. Text Contrast Hierarchy

Text should generally fall into a limited hierarchy:

```text
Primary Text
Secondary Text
Muted Text
Disabled Text
```

Avoid creating many arbitrary gray levels.

The difference between levels must remain visible and accessible.

Muted text should not become unreadably faint.

---

# 27. Links Must Look Interactive

Links should be identifiable.

They may use:

* accent color,
* underline,
* hover treatment,
* or contextual interaction styling.

Do not make links visually indistinguishable from ordinary text.

Likewise, do not make all accent-colored text clickable if it is not interactive.

---

# 28. Long-Form Content Is a Separate Typography Context

Application UI and long-form answer content should share a design language.

They do not need identical typography rules.

Long-form content may require:

* larger line height,
* stronger paragraph spacing,
* specific heading rhythm,
* code treatment,
* list spacing,
* blockquote treatment,
* table treatment,
* and content-specific measure.

A dedicated prose system is appropriate.

It must remain aligned with the global design system.

---

# 29. Reading Measure

Long-form prose should use a controlled measure.

A useful conceptual target is approximately:

```text
65–80 characters per line
```

depending on:

* font,
* size,
* content type,
* and viewport.

The final implementation may use a maximum width rather than character units.

The principle is more important than the exact unit:

> **Do not stretch prose across wide desktop screens.**

---

# 30. Content Width System

The product should distinguish several width contexts.

Conceptually:

```text
Reading Width
→ long-form prose

Standard Content Width
→ hubs, forms, normal application pages

Wide Content Width
→ dashboards, complex lists, data-heavy layouts

Full Width
→ exceptional task environments only
```

Do not use one universal `max-width` for every page.

The page archetype determines the appropriate width.

---

# 31. Suggested Width Direction

Exact values should be validated against the repository and page content.

A conceptual starting point:

```text
Reading content:
~720–820px

Standard content:
~1040–1200px

Wide application layout:
~1280–1440px

Full viewport:
Only when task-specific
```

These values are not final implementation requirements.

They establish proportional intent.

---

# 32. Whitespace Is Functional

Whitespace should be used to:

* separate concepts,
* establish hierarchy,
* improve scanning,
* reduce fatigue,
* and protect focus.

Whitespace should not be added randomly.

The system should use consistent spacing relationships.

Too little whitespace creates density.

Too much whitespace can make related information feel disconnected.

The goal is:

> **Meaningful breathing room.**

---

# 33. Spacing System

Use a consistent spacing scale.

A 4px-based system is a strong implementation foundation.

Conceptually:

```text
4
8
12
16
20
24
32
40
48
64
80
96
```

Not every value must be exposed as a token.

The system should provide enough steps to support:

* compact controls,
* component spacing,
* section spacing,
* and page rhythm.

Avoid arbitrary values such as:

```text
17px
23px
37px
```

unless a specific visual requirement justifies them.

---

# 34. Spacing Has Levels

Spacing should reflect relationships.

## Micro Spacing

Between:

* icon and label,
* badge contents,
* closely related controls.

## Component Spacing

Inside:

* buttons,
* inputs,
* cards,
* list items.

## Group Spacing

Between:

* related groups,
* subsections,
* content blocks.

## Section Spacing

Between major page regions.

## Page Spacing

Around the main content area.

Using the same gap everywhere destroys hierarchy.

---

# 35. Section Spacing Must Create Rhythm

Major sections should be separated more strongly than items within a section.

The user should visually understand:

```text
These items belong together.

This is a new section.

This is a new major page region.
```

This hierarchy should come primarily from spacing and typography.

Not from placing every section inside a different colored box.

---

# 36. Density Is a System Variable

Interview Explainer should not have one universal density.

Different experiences require different density levels.

Define conceptual density modes:

```text
Comfortable
Standard
Compact
```

These are not necessarily user settings.

They are design contexts.

---

# 37. Comfortable Density

Appropriate for:

* question pages,
* long-form explanations,
* resume feedback,
* deep learning,
* focused review.

Characteristics:

* generous vertical rhythm,
* controlled content width,
* limited metadata,
* low visual competition.

---

# 38. Standard Density

Appropriate for:

* preparation hubs,
* module pages,
* search,
* general product pages,
* forms.

Characteristics:

* efficient but breathable,
* clear grouping,
* moderate information density.

---

# 39. Compact Density

Appropriate for:

* large tables,
* dense management views,
* specific dashboard areas,
* advanced list interfaces.

Compact density should be used selectively.

The existence of large datasets does not justify making the entire product compact.

---

# 40. Density Must Not Be Created by Smaller Text

When a page feels too large, the first solution should not be:

* reduce font size,
* reduce line height,
* compress every gap.

Instead ask:

* Is too much information visible?
* Is metadata unnecessary?
* Are there too many cards?
* Can secondary content be disclosed later?
* Can hierarchy improve?

Density is often an information architecture problem disguised as a spacing problem.

---

# 41. Surface Philosophy

V2 should use a small number of surface levels.

Conceptually:

```text
Page Background
Primary Surface
Subtle Surface
Elevated Surface
Overlay
```

Do not create a unique surface color for every component.

Surface differences should communicate:

* grouping,
* elevation,
* or task context.

Not decorative variety.

---

# 42. The Default Surface Should Often Be No Container

Content does not always require a box.

The default hierarchy tools should be:

1. spacing,
2. typography,
3. alignment,
4. dividers,
5. subtle surface,
6. card container.

This order is intentional.

Do not begin with a card.

---

# 43. Cards Are Not the Universal Layout Primitive

V1-style density often emerges from wrapping every item in a bordered card.

V2 should avoid:

```text
Card
  inside Card
    inside Section Card
      inside Page Container
```

Cards should represent meaningful independent units.

For related content in one flow, prefer:

* lists,
* sections,
* dividers,
* or grouped layouts.

---

# 44. Card Visual Treatment

When cards are appropriate, they should generally use restrained treatment.

Potential ingredients:

* subtle border,
* small radius,
* minimal surface contrast,
* optional very soft shadow,
* clear internal spacing.

Avoid combining all of the following by default:

* thick border,
* strong shadow,
* gradient,
* saturated background,
* large radius,
* hover scale,
* colored accent edge.

One card should not use every visual technique available.

---

# 45. Border System

Borders should be subtle but useful.

Conceptual border levels:

```text
Subtle Border
Default Border
Strong Border
Focus Border
Semantic Border
```

Most containers should use:

* no border,
* or subtle/default border.

Strong borders should be rare.

The interface should not resemble a spreadsheet unless the task genuinely requires one.

---

# 46. Border Contrast in Dark Mode

Dark-mode borders require particular care.

Too bright:

* creates visual grids,
* increases noise,
* and makes every container equally prominent.

Too faint:

* removes useful structure.

The border system should use controlled contrast appropriate to each surface.

---

# 47. Border Radius System

V2 should use a restrained radius scale.

Conceptually:

```text
Small
Medium
Large
Full
```

Potential usage:

```text
Small
→ compact controls, badges

Medium
→ inputs, buttons, standard cards

Large
→ selected larger surfaces

Full
→ pills, avatars, circular controls
```

Avoid using very large rounded corners on every container.

Excessive rounding can make a professional information product feel toy-like.

---

# 48. Radius Consistency

Similar components should use consistent radii.

Avoid arbitrary combinations such as:

```text
6px
7px
10px
13px
18px
```

without semantic meaning.

A small token set creates visual coherence.

---

# 49. Shadow Philosophy

Shadows should communicate elevation.

They should not be applied to every card.

Potential use:

* dropdowns,
* menus,
* modals,
* floating overlays,
* genuinely elevated surfaces.

Most normal content containers should rely on:

* spacing,
* border,
* or subtle surface contrast.

---

# 50. Shadow Levels

A small shadow scale is sufficient.

Conceptually:

```text
None
Subtle
Elevated
Overlay
```

Avoid dramatic shadows in ordinary page layouts.

Dark mode may require different shadow behavior.

A shadow token may not use identical raw values across themes.

---

# 51. Elevation Must Be Semantic

A visually elevated object should behave like an elevated object.

Examples:

* dropdown above page,
* modal above overlay,
* floating menu.

Do not give static content cards strong elevation merely for decoration.

Visual elevation should correspond to spatial or interaction hierarchy.

---

# 52. Icon Philosophy

Icons should improve:

* recognition,
* scanning,
* action comprehension,
* and compact navigation.

They should not be used simply to make every element look designed.

A consistent icon library should be used.

A strong default candidate is:

```text
Lucide
```

or another coherent stroke-based system.

Do not mix multiple icon styles casually.

---

# 53. Icons Need a Job

Use an icon when it:

* clarifies an action,
* improves recognition,
* represents a familiar concept,
* or saves meaningful space.

Avoid adding icons to:

* every heading,
* every card,
* every metadata item,
* every link.

Too many icons create visual texture without additional meaning.

---

# 54. Icon Size System

Use a small number of standard icon sizes.

Conceptually:

```text
Small
Standard
Large
Display
```

Most interface icons should remain in the small or standard range.

Large decorative icons should be rare.

---

# 55. Icons and Labels

Important unfamiliar actions should not rely on icon-only controls.

Icon-only controls are appropriate when:

* the icon is widely understood,
* space is constrained,
* and an accessible name is provided.

Examples may include:

* close,
* search,
* menu,
* copy.

Even familiar icons may require tooltips in desktop contexts.

---

# 56. Button Hierarchy

The design system should define clear button emphasis levels.

Conceptually:

```text
Primary
Secondary
Tertiary / Ghost
Destructive
Link
Icon
```

A page should normally have very few primary buttons.

If five buttons look primary:

> The hierarchy has failed.

---

# 57. Primary Buttons

Primary buttons should represent the main action in a local context.

Examples:

* Start Mock Interview,
* Continue Preparation,
* Analyze Resume.

Primary treatment should be visually clear.

It should not be used for every clickable destination.

---

# 58. Secondary Buttons

Secondary buttons support meaningful alternative actions.

They should remain clearly interactive without competing equally with the primary action.

---

# 59. Ghost and Tertiary Actions

Low-emphasis actions may use:

* text,
* subtle hover backgrounds,
* or minimal chrome.

This is useful for:

* utility actions,
* local navigation,
* secondary controls.

Do not convert every link into a button.

---

# 60. Button Sizes

Use a limited set of control heights.

Conceptually:

```text
Small
Standard
Large
```

Most interface buttons should use the standard size.

Large buttons should be reserved for high-priority actions or appropriate touch contexts.

Avoid arbitrary heights across pages.

---

# 61. Buttons Must Not Become Pills by Default

Fully rounded pill buttons may be appropriate in selected contexts.

They should not be the universal button shape unless the entire design language intentionally supports it.

A moderate radius generally provides:

* modern appearance,
* professional tone,
* and easier consistency.

---

# 62. Input System

Inputs should provide:

* clear labels,
* readable text,
* visible focus,
* clear error states,
* sufficient touch size,
* and predictable spacing.

Placeholder text is not a substitute for a label when the field requires persistent context.

---

# 63. Input Visual Treatment

Inputs should be visually clear without becoming oversized decorative containers.

The system should define:

* default,
* hover where relevant,
* focus,
* disabled,
* error,
* and success where appropriate.

Focus should be more visually prominent than hover.

---

# 64. Search Input Is a Special High-Value Control

Search may receive more prominence than ordinary form inputs in appropriate contexts.

However, search should not become a giant decorative hero object on every page.

Its prominence should depend on:

* page purpose,
* user intent,
* and available context.

---

# 65. Badge System

Badges should communicate compact status or categorization.

Potential uses:

* difficulty,
* status,
* content type,
* selected filters.

Badges should not be used for every metadata field.

A page covered in pills becomes visually fragmented.

---

# 66. Badge Variants

Use a small number of semantic variants.

Conceptually:

```text
Neutral
Primary
Success
Warning
Danger
Info
```

Avoid creating a new color for every topic or technology unless a separate brand system explicitly requires it.

---

# 67. Tags and Badges Are Not the Same Thing

A tag may represent categorization.

A badge may represent state or compact metadata.

The component library should clarify whether the product needs both.

Do not create two visually different systems for the same purpose.

---

# 68. Divider System

Dividers can provide structure without containers.

Use them for:

* list separation,
* section boundaries,
* grouped controls.

Dividers should remain subtle.

Avoid placing horizontal rules between every paragraph or small content block.

---

# 69. Visual Grouping Hierarchy

Use the lightest effective grouping method.

Preferred order:

```text
Proximity
→ Alignment
→ Spacing
→ Typography
→ Divider
→ Surface
→ Border
→ Elevation
```

The further down this list the design goes, the stronger the visual intervention.

Do not use elevation when spacing would solve the problem.

---

# 70. Page Backgrounds

The default page background should remain calm and consistent.

Avoid giving every major section:

* a different gradient,
* a different tinted background,
* or alternating high-contrast bands.

Section differentiation should often come from:

* spacing,
* content hierarchy,
* and occasional subtle surface variation.

---

# 71. Gradients

Gradients should be rare.

Potential appropriate use:

* restrained brand expression,
* limited homepage decoration,
* subtle atmospheric background.

Avoid gradients on:

* every button,
* every card,
* every heading,
* or core reading surfaces.

Gradients must not reduce text contrast.

---

# 72. Decorative Effects

Effects such as:

* glow,
* blur,
* glassmorphism,
* animated gradients,
* large background blobs,
* excessive texture

should not become foundational V2 patterns.

They may be used only when:

* they support brand expression,
* remain subtle,
* do not affect readability,
* and do not create performance cost disproportionate to value.

Interview Explainer is not a visual effects showcase.

---

# 73. Hero Sections

Hero sections should be proportional to the page purpose.

Homepage:

May support stronger visual expression.

Preparation Hub:

Should prioritize orientation.

Question Page:

Should not have a large decorative hero.

Dashboard:

Should prioritize continuation and action.

The same hero pattern should not be reused across every page.

---

# 74. Responsive Foundation

The design system should support responsive behavior through a deliberate breakpoint strategy.

The exact breakpoints should align with:

* content behavior,
* existing framework conventions,
* and actual layout needs.

Do not design only for named devices.

Breakpoints should occur when the layout needs to change.

---

# 75. Conceptual Responsive Ranges

A practical starting model may include:

```text
Small Mobile
Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Implementation may use framework breakpoints.

The important principle is:

> **Responsive behavior should follow content pressure, not device marketing categories.**

---

# 76. Mobile Page Padding

Mobile layouts require sufficient edge spacing.

Content should not touch viewport edges.

At the same time, mobile padding should not consume excessive width.

Use consistent page gutters.

The exact values should be tokenized.

---

# 77. Desktop Page Gutters

Large screens should maintain:

* consistent outer gutters,
* centered content where appropriate,
* and controlled maximum widths.

Do not allow layouts to expand indefinitely.

---

# 78. Responsive Typography

Typography should scale intentionally.

Avoid:

* huge desktop headings shrinking unpredictably,
* mobile titles wrapping into six lines,
* and fixed display sizes that overwhelm small screens.

Use:

* breakpoint-based tokens,
* fluid scaling where carefully controlled,
* or a combination.

The system should remain predictable.

---

# 79. Responsive Spacing

Major section spacing may reduce on smaller screens.

However, mobile should not become cramped simply because space is limited.

Prioritize:

* removing secondary information,
* simplifying layout,
* and collapsing optional controls

before aggressively compressing all spacing.

---

# 80. Mobile Cards

Cards on mobile require special scrutiny.

A desktop page containing many cards can become an endless stack on mobile.

Ask whether the card structure should become:

* a list,
* divided rows,
* an accordion where appropriate,
* or a simpler layout.

Do not automatically stack every desktop card.

---

# 81. Mobile Sidebars

Desktop sidebars should not remain permanent narrow columns on mobile.

Depending on purpose, they may become:

* drawer,
* sheet,
* collapsible section,
* top-level local navigation,
* or contextual control.

The transformation should preserve the sidebar's job.

---

# 82. Mobile Tables

Tables require explicit responsive strategy.

Potential strategies:

* horizontal scrolling,
* priority columns,
* responsive cards only when semantic structure survives,
* or alternate presentation.

Do not shrink table text until it becomes unreadable.

---

# 83. Touch Interaction

Interactive elements should provide sufficient touch area.

Visual size and hit area may differ.

Controls should not be packed so tightly that users frequently activate the wrong action.

---

# 84. Z-Index System

Layering should use a controlled scale.

Conceptually:

```text
Base
Sticky
Dropdown
Overlay
Modal
Critical
```

Do not use arbitrary values such as:

```text
9999
99999
2147483647
```

to resolve stacking problems.

Layering conflicts usually indicate missing system governance.

---

# 85. Focus System

Focus states should be consistent across:

* buttons,
* links,
* inputs,
* cards,
* menus,
* and custom controls.

The focus treatment should be:

* visible,
* accessible,
* theme-aware,
* and not clipped by overflow.

Do not remove browser focus behavior without providing a better alternative.

---

# 86. Selection States

Selected states should use multiple cues where appropriate.

Possible cues:

* background,
* text weight,
* indicator,
* border,
* icon.

Avoid relying solely on color.

Selection treatment should remain consistent across similar navigation systems.

---

# 87. Hover States

Hover should provide subtle confirmation.

Avoid:

* large scale transforms,
* dramatic shadows,
* strong color shifts,
* and movement that causes layout instability.

A card should not jump toward the user every time the pointer crosses it.

---

# 88. Active and Pressed States

Interactive controls should provide immediate pressed feedback.

The effect should be subtle.

The user should feel that the interface responded.

---

# 89. Disabled States

Disabled controls should remain:

* recognizable,
* legible,
* and clearly unavailable.

Do not reduce opacity so far that content becomes unreadable.

Where possible, explain why an important action is unavailable.

---

# 90. Skeleton System

Skeletons should reflect the approximate structure of loaded content.

Avoid one generic rectangle pattern for every page.

Potential skeleton archetypes:

* question page,
* list,
* dashboard,
* card collection.

Skeletons should remain visually quiet.

The loading state should not be more visually active than the loaded page.

---

# 91. Empty-State Visuals

Empty states should not require large illustrations.

A simple combination of:

* concise message,
* small icon where useful,
* and clear next action

may be sufficient.

The product should not create large decorative empty screens that overshadow the task.

---

# 92. Error Visuals

Error styling should be proportional to severity.

Examples:

## Inline Validation

Small and local.

## Section Failure

Contained and recoverable.

## Page Failure

Clear and prominent.

## Destructive Critical Failure

Strong semantic treatment.

Not every error requires a full red panel.

---

# 93. Success Visuals

Success should be acknowledged without excessive celebration.

Examples:

* saved,
* completed,
* updated.

Small actions require small feedback.

Meaningful milestones may receive stronger treatment.

Avoid turning every completed question into a confetti event.

---

# 94. Progress Visuals

Progress may be represented through:

* bars,
* compact counts,
* status,
* or other context-appropriate forms.

Do not use circular progress indicators merely because they look visually interesting.

The visualization should help the user understand progress quickly.

---

# 95. Data Visualization

If V2 introduces charts, they should be:

* necessary,
* readable,
* accessible,
* and decision-oriented.

Do not create charts for metrics that would be clearer as:

* text,
* a number,
* or a progress bar.

Data visualization should not become dashboard decoration.

---

# 96. Code Block Visual System

Code blocks should use a dedicated surface.

Requirements:

* strong readability,
* clear contrast,
* controlled padding,
* horizontal overflow,
* copy support where useful,
* language indication where useful.

Avoid excessive borders and toolbars.

The code itself remains primary.

---

# 97. Inline Code

Inline code should remain distinguishable from prose.

It should use:

* monospace typography,
* subtle background or border where needed,
* and appropriate padding.

Avoid making inline code look like a large badge.

---

# 98. Table Visual System

Tables should prioritize:

* alignment,
* scanning,
* readable row separation,
* clear headers.

Avoid excessive:

* borders around every cell,
* saturated header backgrounds,
* and decorative striping.

Subtle structure is usually sufficient.

---

# 99. Long-Form List Styling

Lists inside answers should have:

* clear indentation,
* sufficient item spacing,
* readable markers,
* and alignment with prose.

Nested lists should remain understandable.

Avoid excessive decorative icons as list markers unless they communicate meaning.

---

# 100. Blockquotes

Blockquotes should represent actual quoted or specially contextualized material.

They should not be used as a generic highlighted paragraph style.

A separate callout system should exist for:

* notes,
* warnings,
* interview tips,
* and important insights.

---

# 101. Brand Expression Must Be Concentrated

Brand identity does not require every component to use the brand accent.

Brand can emerge from:

* typography,
* layout,
* interaction consistency,
* tone,
* logo,
* limited accent use,
* and overall restraint.

A mature product often feels more branded through consistency than through saturation.

---

# 102. Visual Consistency Does Not Mean Visual Uniformity

Different product contexts may require different layouts.

For example:

* question page,
* dashboard,
* mock interview,
* resume analysis.

They should share:

* tokens,
* typography,
* controls,
* interaction patterns,
* and visual philosophy.

They do not need identical composition.

---

# 103. The Design System Must Support Future Product Areas

The system must be flexible enough for:

* content,
* practice,
* mocks,
* resume,
* jobs,
* and dashboards.

This does not mean designing every future component now.

It means avoiding foundations that only work for one page type.

For example:

A design system built entirely around colorful content cards will struggle with:

* long reading,
* forms,
* interview sessions,
* and application workflows.

The foundation must be broader.

---

# 104. Design Tokens Must Be Versioned Carefully

Changing a foundational token may affect the entire product.

Examples:

* body font size,
* page background,
* border contrast,
* primary radius,
* spacing scale.

Token changes should be tested across representative page archetypes.

Do not change foundational tokens to fix one isolated component.

Fix the component if the problem is local.

---

# 105. No Arbitrary Visual Values in Feature Code

Feature implementation should avoid arbitrary values such as:

```text
margin-top: 37px
border-radius: 13px
color: #718096
box-shadow: custom one-off value
```

unless the exception is documented and justified.

Most visual decisions should come from:

* tokens,
* variants,
* and reusable layout primitives.

This reduces design drift.

---

# 106. No Page-Specific Mini Design Systems

A new feature must not introduce its own:

* button style,
* card radius,
* color palette,
* input style,
* shadow system,
* or typography hierarchy

without explicit design-system review.

Interview Explainer should not become several unrelated products sharing one domain.

---

# 107. Design Review Must Use Real Content

Components should not be approved using only:

* lorem ipsum,
* short labels,
* ideal data,
* or empty mockups.

Test with:

* long Java questions,
* code-heavy answers,
* long company names,
* long role names,
* dense modules,
* empty user states,
* and mobile content.

Real content reveals design failures.

---

# 108. Light and Dark Modes Must Be Reviewed Independently

A component is not complete because it looks correct in one theme.

Review:

* contrast,
* hierarchy,
* border strength,
* hover,
* focus,
* selected,
* disabled,
* code,
* tables,
* and overlays

in both themes.

Dark mode is not a post-processing step.

---

# 109. Design System Accessibility Baseline

The visual system must support:

* WCAG-appropriate contrast,
* visible focus,
* readable text,
* zoom,
* reduced motion,
* non-color state cues,
* and usable touch targets.

Accessibility requirements will be expanded in a dedicated specification.

The design system must make accessible implementation the default.

---

# 110. Performance Baseline

Visual design decisions should consider:

* font loading,
* icon bundles,
* image weight,
* animation cost,
* CSS complexity,
* and client-side dependencies.

Avoid requiring heavy libraries for simple visual effects.

The fastest component is often the simplest component.

---

# 111. The V2 Visual Density Audit

Every major page should be reviewed for:

## Container Count

How many bordered or surfaced regions are visible?

## Color Count

How many accent or semantic colors compete simultaneously?

## Persistent UI Count

How many elements remain sticky or fixed?

## Badge Count

How many pills or labels appear?

## CTA Count

How many elements visually request action?

## Typography Levels

How many distinct visual text styles appear?

## Sidebar Pressure

How much horizontal space is consumed by secondary UI?

## Reading Pressure

How much visual interruption surrounds the primary content?

If the answer is excessive:

> Remove before adding.

---

# 112. The Squint Test

Blur or visually squint at the page.

The dominant hierarchy should still be visible.

A user should perceive:

* one primary region,
* a small number of secondary regions,
* and quiet structure.

If the page becomes a field of equally strong boxes:

The hierarchy has failed.

---

# 113. The Grayscale Test

The interface should remain understandable when color is removed.

If hierarchy collapses without color:

* typography,
* spacing,
* grouping,
* or contrast structure is insufficient.

Color should enhance hierarchy.

It should not create hierarchy alone.

---

# 114. The Border Removal Test

Temporarily remove non-essential borders.

Ask:

* Does the page still make sense?
* Are groups still understandable?
* Does spacing establish hierarchy?

If not, the layout may be overdependent on containers.

---

# 115. The Long-Reading Test

Use a real long-form answer for at least 30 minutes.

Review:

* eye fatigue,
* line length,
* paragraph rhythm,
* heading spacing,
* code readability,
* sticky UI irritation,
* and dark-mode comfort.

A design that looks excellent in a screenshot may fail after prolonged reading.

---

# 116. The Mobile Stack Test

When desktop columns become mobile layout:

* does the order remain logical?
* does the page become an endless stack of cards?
* is secondary information appearing before primary content?
* are controls still reachable?
* are tables usable?

Responsive design must preserve priority.

---

# 117. The New-Feature Test

Before adding a new visual pattern, ask:

1. Can an existing pattern solve this?
2. Is the new pattern semantically different?
3. Does it work in both themes?
4. Does it work on mobile?
5. Is it accessible?
6. Does it create another permanent maintenance burden?

New visual patterns should be introduced deliberately.

---

# 118. V2 Visual Anti-Patterns

The following should trigger review:

* card inside card inside card,
* saturated borders around ordinary content,
* every section using a different background,
* multiple gradients on one page,
* excessive pill badges,
* icons on every heading,
* large shadows on static content,
* hover scale on every card,
* glowing dark-mode surfaces,
* giant rounded corners everywhere,
* extremely wide prose,
* tiny body text to increase density,
* multiple competing sidebars,
* large decorative heroes on question pages,
* too many primary buttons,
* inconsistent control heights,
* arbitrary one-off spacing,
* different button systems per feature,
* color used as the only state signal,
* and filling desktop whitespace merely because it exists.

---

# 119. V2 Visual Acceptance Criteria

A major V2 page should not be considered visually complete unless:

* the primary user task is visually dominant,
* reading width is appropriate,
* typography hierarchy is clear,
* spacing follows the system,
* containers are justified,
* color use is restrained,
* light mode is coherent,
* dark mode is coherent,
* mobile hierarchy remains correct,
* focus states are visible,
* long content has been tested,
* and no arbitrary local design system has been introduced.

---

# 120. Initial Token Direction

The following is a conceptual implementation direction.

It is not the final audited token file.

```text
COLOR

background
foreground

surface
surface-subtle
surface-elevated

muted
muted-foreground

border
border-strong

primary
primary-hover
primary-foreground

success
warning
danger
info

focus
```

```text
TYPOGRAPHY

display
page-title
section-title
subsection-title

body-large
body
body-small

label
caption
code
```

```text
SPACING

1
2
3
4
5
6
8
10
12
16
20
24
```

```text
RADIUS

small
medium
large
full
```

```text
SHADOW

none
subtle
elevated
overlay
```

```text
WIDTH

reading
standard
wide
full
```

```text
DENSITY

comfortable
standard
compact
```

These semantic layers should be translated into implementation tokens after the current repository's CSS and Tailwind architecture are audited.

---

# 121. Implementation Principle

Do not begin the V2 visual overhaul by editing hundreds of page-level classes.

The correct order is:

```text
1. Audit existing global styles.
2. Audit Tailwind or styling configuration.
3. Audit current fonts.
4. Audit color usage.
5. Audit repeated spacing values.
6. Audit existing shared components.
7. Define V2 tokens.
8. Implement foundational primitives.
9. Migrate one representative page archetype.
10. Validate light, dark, mobile, accessibility, and performance.
11. Refine the system.
12. Expand systematically.
```

This avoids creating V2 as another layer of inconsistent CSS.

---

# 122. Representative Validation Pages

Before migrating the entire site, validate the design system against representative extremes.

At minimum:

```text
Homepage
Preparation Track Hub
Large Module / Question List
Long Question Page
Code-Heavy Question Page
Search Results
Dashboard
Mobile Navigation
Loading State
Empty State
Error State
```

Future systems should additionally validate:

```text
Mock Interview Session
Resume Analysis
Job Search / Application Workflow
```

If the design system works only on the homepage:

It is not a design system.

---

# 123. Relationship to the Component Library

This document defines the visual laws.

`07_COMPONENT_LIBRARY.md` will define the reusable objects that obey those laws.

Examples:

```text
Button
Input
Search
Card
List Item
Badge
Breadcrumb
Sidebar
Header
Navigation
Table of Contents
Code Block
Callout
Progress
Skeleton
Toast
Dialog
Drawer
Empty State
Error State
Question List Item
Preparation Card
Dashboard Module
```

The component library must not contradict this document.

For example:

If the design system says cards should be restrained:

The component library must not define every card with:

* large shadow,
* gradient,
* hover scale,
* and bright border.

---

# 124. Non-Negotiable Design System Principles

## Principle 1

**Typography and spacing create hierarchy before color and containers.**

## Principle 2

**The interface becomes quieter as user intent becomes more focused.**

## Principle 3

**Color is scarce and intentional.**

## Principle 4

**Dark mode is a designed theme, not an inversion.**

## Principle 5

**Long-form reading comfort is a first-class requirement.**

## Principle 6

**Prose width is controlled.**

## Principle 7

**Not every section needs a card.**

## Principle 8

**Cards represent meaningful units.**

## Principle 9

**Borders and shadows are structural tools, not decoration.**

## Principle 10

**Whitespace is functional.**

## Principle 11

**Density depends on the task.**

## Principle 12

**Mobile requires prioritization rather than compression.**

## Principle 13

**Semantic tokens replace arbitrary visual values.**

## Principle 14

**New features must use the shared visual language.**

## Principle 15

**Color is never the only state signal.**

## Principle 16

**Accessibility is built into the visual foundation.**

## Principle 17

**Performance influences visual implementation.**

## Principle 18

**Real content must be used for validation.**

## Principle 19

**The product should remain coherent in both light and dark modes.**

## Principle 20

**Remove visual competition before adding visual decoration.**

---

# 125. Final Design Principle

Interview Explainer V2 should not try to prove that it is modern by displaying every modern UI technique simultaneously.

It should not need:

* excessive gradients,
* endless cards,
* glowing dark mode,
* constant animation,
* or decorative complexity

to feel premium.

A premium preparation product should feel premium because:

* hierarchy is clear,
* typography is excellent,
* reading is comfortable,
* interactions are predictable,
* spacing is deliberate,
* information is organized,
* and nothing unnecessary competes for attention.

The permanent visual principle is:

> **Calm before decoration.**

> **Hierarchy before color.**

> **Typography before containers.**

> **Spacing before borders.**

> **Meaning before visual variety.**

> **Focus before feature visibility.**

> **Consistency before novelty.**

Interview Explainer V2 should not look empty.

It should look intentional.

It should not look simple because the product lacks complexity.

It should look simple because the complexity has been designed.
