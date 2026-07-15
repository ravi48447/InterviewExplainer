# Interview Explainer V2 — UX Principles

**Document:** `04_UX_PRINCIPLES.md`
**Status:** Foundational / Operational
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md`, `01_PRODUCT_PHILOSOPHY.md`, `02_AI_CONSTITUTION.md`, `03_USER_PSYCHOLOGY.md`
**Purpose:** Translate the V2 product vision and user psychology into concrete experience rules governing page structure, navigation, reading, discovery, interaction, responsiveness, states, and user journeys.

---

# 1. Purpose of This Document

This document defines how Interview Explainer should behave from the user's perspective.

It does not define:

* exact colors,
* exact spacing tokens,
* exact font families,
* component implementation APIs,
* database architecture,
* or SEO implementation details.

Those belong to later specifications.

This document defines experience-level rules.

It answers questions such as:

* What should appear first on a page?
* How much navigation should remain visible?
* When should a sidebar exist?
* When should cards be used?
* How should a question page support long reading?
* How should mobile differ from desktop?
* How should users understand where they are?
* How should search behave?
* How should loading, empty, and error states work?
* How should users move from one preparation step to another?
* How should the product balance discovery with focus?

The central UX principle is:

> **Every page should help the user understand where they are, accomplish the current task, and identify the next useful step without unnecessary cognitive effort.**

---

# 2. UX Is the Organization of Attention

UX is not primarily the arrangement of components.

It is the arrangement of attention.

Every page must establish an attention hierarchy.

A useful default hierarchy is:

1. Current purpose.
2. Primary content or task.
3. Context required to understand it.
4. Primary navigation within the current task.
5. Most useful next action.
6. Secondary discovery.
7. Global product navigation.
8. Promotion and optional product messaging.

The visual and interaction hierarchy should reflect this order.

A secondary recommendation must not visually overpower the primary answer.

A global navigation system must not dominate a focused learning experience.

A signup prompt must not interrupt the value the user came to receive.

---

# 3. Every Page Must Have a Dominant User Job

Every major page archetype must define one dominant user job.

The dominant job determines:

* hierarchy,
* layout,
* visible controls,
* navigation,
* density,
* and acceptable interruption.

Examples:

## Homepage

**Job:** Understand the product and begin relevant preparation.

## Domain Hub

**Job:** Understand and navigate a preparation domain.

## Pillar or Topic Page

**Job:** Understand the structure of a subject area and choose what to study.

## Module Page

**Job:** Navigate a focused collection of related material.

## Question Page

**Job:** Understand or revise one interview concept.

## Search Results

**Job:** Find the most relevant destination.

## Dashboard

**Job:** Regain context and choose the next useful action.

## Mock Interview

**Job:** Complete an interview simulation with minimal distraction.

## Resume Analysis

**Job:** Understand resume issues and act on improvements.

A page may support secondary jobs.

It must not allow them to compete equally with the primary job.

---

# 4. The Three-Layer Page Model

Most Interview Explainer pages should be understood through three experience layers.

## Layer 1 — Global Context

Answers:

* What product am I using?
* How do I access major product areas?
* How do I search?

Examples:

* global header,
* product navigation,
* global search,
* account access.

## Layer 2 — Local Context

Answers:

* Where am I inside this area?
* What is around me?
* How do I navigate this subject?

Examples:

* breadcrumbs,
* local sidebar,
* tabs,
* topic hierarchy,
* module navigation.

## Layer 3 — Primary Work

Answers:

* What am I here to do?

Examples:

* read an answer,
* choose a question,
* complete a mock interview,
* review progress,
* improve a resume.

The deeper the user moves into a focused task, the quieter Layers 1 and 2 should become.

Layer 3 must dominate.

---

# 5. Above-the-Fold Principle

The first viewport should establish relevance.

A user should normally understand:

* what page they are on,
* what the page is about,
* why it may be useful,
* and where the primary content or action begins.

The first viewport should not be consumed by:

* oversized decorative heroes,
* excessive marketing copy,
* unrelated recommendations,
* giant illustrations,
* large empty visual areas,
* or multiple competing calls to action.

This is particularly important for search-landing pages.

A user who searches for:

> Java HashMap vs ConcurrentHashMap

should encounter the relevant content quickly.

The product should not force them through a marketing experience first.

---

# 6. Page Titles Must Orient, Not Decorate

The primary page title should clearly identify the page.

It should not be:

* vague,
* excessively clever,
* artificially promotional,
* or disconnected from search and navigation language.

Good page titles support:

* user orientation,
* scanning,
* accessibility,
* browser understanding,
* and search discovery.

A page should generally have one clear primary heading.

Visual styling must not create a false semantic hierarchy.

---

# 7. Introductory Content Must Earn Its Position

Some pages need introductory context.

Others do not.

Introductory text is useful when it helps users understand:

* scope,
* purpose,
* prerequisites,
* structure,
* or how to use the page.

It should not exist merely because every page template has a description slot.

Question pages should not bury the answer beneath unnecessary introduction.

Hub pages may require more orientation.

The amount of introduction should match the user's likely intent.

---

# 8. The Intent-Narrowing Rule

As user intent becomes more specific, interface complexity should decrease.

Example:

## Homepage

Broad discovery.

May contain:

* major paths,
* search,
* value explanation,
* product areas.

## Java Backend Hub

Focused discovery.

May contain:

* preparation structure,
* topic navigation,
* progress context.

## Concurrency Module

Focused selection.

May contain:

* local hierarchy,
* question list,
* module progress.

## ConcurrentHashMap Question

Focused learning.

Should prioritize:

* question,
* answer,
* local context,
* next useful action.

## Mock Interview Session

Focused action.

Should contain almost nothing unrelated to the session.

This is one of the most important UX rules in V2.

---

# 9. Navigation Must Be Contextual

Interview Explainer should not use one giant navigation solution for every page.

Navigation exists at different levels.

## Global Navigation

Provides access to major product areas.

It should remain stable and limited.

## Section Navigation

Provides access within a major domain or feature.

## Local Navigation

Provides movement within the current topic, module, or task.

## Contextual Navigation

Provides relevant next or related destinations.

These levels should not all demand equal attention simultaneously.

The interface should expose the navigation level most relevant to the current user state.

---

# 10. Global Navigation Must Remain Small

Global navigation should represent major product destinations.

It should not become a complete directory of:

* every technology,
* every company,
* every role,
* every module,
* every feature,
* and every content category.

Large taxonomies belong in:

* dedicated exploration pages,
* search,
* local navigation,
* structured menus,
* or progressive disclosure.

The global header should remain understandable at a glance.

---

# 11. Navigation Labels Must Use User Language

Navigation should use terms users are likely to understand.

Avoid exposing internal data-model terminology unless it is also useful to users.

For example, if the internal system uses:

* domain,
* pillar,
* module,
* unit,
* node,

the UI should not automatically expose all five levels.

The user-facing hierarchy should use the minimum number of concepts necessary.

Terminology must remain consistent.

---

# 12. Breadcrumbs Provide Location, Not Primary Navigation

Breadcrumbs are useful on deep hierarchical pages.

They should answer:

> Where am I?

They should not become:

* oversized,
* highly decorative,
* or a replacement for clear local navigation.

Breadcrumbs should:

* use meaningful labels,
* reflect a valid hierarchy,
* remain compact,
* support navigation to useful ancestors,
* and work semantically.

On mobile, breadcrumbs may be simplified when full display creates excessive wrapping.

The current page does not need to be repeated unnecessarily when the title already provides sufficient orientation.

---

# 13. Sidebars Must Have a Clear Job

A sidebar should exist only when persistent local context creates meaningful value.

Appropriate sidebar roles may include:

* navigating a large topic hierarchy,
* showing a table of contents for long content,
* supporting filters in a complex discovery experience,
* or exposing task-specific controls.

A sidebar should not exist merely because desktop space is available.

Every sidebar must answer:

> What task becomes significantly easier because this remains visible?

If no strong answer exists, the sidebar should be reconsidered.

---

# 14. One Sidebar Is Usually Enough

V2 should avoid interfaces with:

* left navigation,
* right metadata rail,
* floating table of contents,
* sticky utility bar,
* and additional floating controls

all visible simultaneously.

Each persistent region consumes horizontal space and attention.

A question page should not automatically become a three-column dashboard.

If multiple secondary systems are useful, prioritize them.

Possible solutions include:

* one contextual sidebar,
* collapsible local navigation,
* inline metadata,
* a compact table of contents,
* or responsive contextual controls.

The answer remains the primary experience.

---

# 15. Sidebars Must Not Crush Reading Width

When a sidebar is present, the primary content must retain a comfortable reading width.

Do not preserve a sidebar at the cost of:

* extremely narrow content,
* excessive line wrapping,
* cramped code,
* or poor table behavior.

At smaller widths:

* collapse,
* move,
* transform,
* or hide the sidebar appropriately.

The sidebar is secondary to the primary task.

---

# 16. Sticky Elements Require Strong Justification

Sticky UI remains continuously visible.

Therefore, it must provide continuous value.

Potentially valid sticky elements:

* compact global header,
* local navigation,
* current section navigation,
* essential task controls,
* mock interview controls.

Potentially invalid sticky elements:

* promotional banners,
* decorative widgets,
* low-value metadata,
* repeated CTAs,
* large side panels with rarely used information.

Sticky elements must also be tested for:

* mobile viewport obstruction,
* keyboard behavior,
* zoom,
* long content,
* and overlapping layers.

---

# 17. Reading Pages Are Focus Environments

Question and explanation pages should be treated as focused reading environments.

The surrounding interface should support:

* comprehension,
* scanning,
* navigation,
* and sustained attention.

It should not compete with the content.

The reading experience should prioritize:

* comfortable measure,
* clear typography,
* meaningful section spacing,
* stable hierarchy,
* readable code,
* useful tables,
* restrained callouts,
* and predictable navigation.

---

# 18. Reading Width Must Be Controlled

Long-form prose should not stretch across the full viewport on large screens.

Excessively long lines reduce reading comfort.

Excessively narrow lines create unnecessary vertical length and awkward code presentation.

The design system will define exact measurements.

The UX rule is:

> **Long-form text should use a deliberately controlled reading measure rather than inheriting all available width.**

Wide elements such as:

* code,
* tables,
* diagrams,
* and comparison matrices

may require different treatment from prose.

---

# 19. Content Width and Page Width Are Different

The overall page may be wide.

The readable prose should not necessarily be wide.

A page may contain:

* local navigation,
* reading content,
* supporting controls.

The content column should remain optimized for reading.

Do not solve desktop emptiness by stretching paragraphs.

Whitespace around a reading column is not wasted space.

---

# 20. Long Content Needs Visible Structure

Long answers should support scanning through:

* meaningful headings,
* consistent section rhythm,
* lists where appropriate,
* code blocks,
* tables where useful,
* and restrained callouts.

Do not create artificial sections merely to make the page look structured.

The content structure should reflect conceptual structure.

A table of contents may be useful for sufficiently long answers.

It should not be mandatory for every page.

---

# 21. Table of Contents Must Be Proportional

A table of contents is useful when the content is long enough to justify navigation.

It should not appear for:

* very short answers,
* pages with only a few sections,
* or content where the navigation itself becomes more distracting than useful.

When used, it should:

* reflect real headings,
* indicate current location where practical,
* support keyboard navigation,
* avoid excessive nesting,
* and adapt appropriately to mobile.

---

# 22. Code Must Be Treated as Content

Code blocks are not decorative components.

They must prioritize:

* readability,
* correctness,
* copyability,
* horizontal overflow handling,
* syntax clarity,
* and mobile usability.

Useful enhancements may include:

* language label,
* copy action,
* line highlighting when meaningful,
* optional line numbers when genuinely useful.

Avoid excessive chrome around code.

The code should remain the dominant element inside the code block.

---

# 23. Tables Must Be Used for Comparison, Not Decoration

Tables are useful when users need to compare structured values across dimensions.

They should not be used merely to create a visually organized box.

Tables must consider:

* mobile overflow,
* accessibility,
* meaningful headers,
* readable density,
* and long content.

On small screens, choose the least harmful solution based on the table:

* horizontal scrolling,
* responsive transformation,
* or an alternate representation.

Do not silently hide important columns.

---

# 24. Callouts Must Be Rare and Meaningful

Callouts may be useful for:

* important warnings,
* key interview insights,
* common mistakes,
* prerequisites,
* or critical distinctions.

If every section contains a callout, callouts lose emphasis.

Callouts should not become a decorative replacement for ordinary paragraphs.

Use semantic variants sparingly.

---

# 25. Cards Must Represent Units

A card should generally represent:

* an independent object,
* an interactive destination,
* a grouped data unit,
* or a clearly distinct concept.

Examples:

* preparation path,
* company,
* saved item,
* dashboard summary,
* search result where card treatment is justified.

Cards should not automatically wrap:

* every paragraph,
* every heading,
* every metadata group,
* every answer section.

The UX default is not:

> Everything gets a card.

The default is:

> Use the lightest structure that communicates the relationship.

---

# 26. Avoid Nested Containers

Card inside card inside card creates:

* visual noise,
* unclear hierarchy,
* excessive borders,
* and wasted space.

Nested containers require explicit justification.

Before nesting, consider:

* headings,
* spacing,
* dividers,
* lists,
* or semantic grouping.

The hierarchy should remain visually legible without excessive framing.

---

# 27. Lists Should Be Scannable

Large question and topic lists should help users answer:

* What is this?
* How does it relate to my current preparation?
* Have I completed it?
* Is it relevant now?

Do not overload every list item with all available metadata.

Only show metadata that supports selection.

Secondary details can appear:

* after opening,
* on demand,
* or in a more appropriate context.

---

# 28. Metadata Must Be Prioritized

Potential metadata may include:

* difficulty,
* category,
* company,
* role,
* estimated time,
* completion,
* popularity,
* update date,
* tags.

Not all metadata belongs everywhere.

Each page archetype should define:

* primary metadata,
* secondary metadata,
* hidden metadata.

The existence of data does not justify displaying it.

---

# 29. Difficulty Must Not Become Visual Noise

Difficulty can be useful.

It should be presented consistently.

Avoid:

* large saturated badges everywhere,
* multiple conflicting difficulty systems,
* and treating difficulty as the dominant identity of every item.

Difficulty is supporting information.

The question or topic remains primary.

---

# 30. Search Must Be Easy to Reach

For a large knowledge platform, search is a primary navigation mechanism.

Search should be:

* easy to discover,
* easy to activate,
* fast,
* forgiving,
* and understandable.

The interface should not make users navigate through several category levels when they already know what they want.

---

# 31. Search Must Prioritize Intent Over Feature Density

The core search interaction is:

1. Express intent.
2. See relevant results.
3. Reach the right destination.

Do not overload the initial search experience with:

* too many filters,
* complex syntax,
* excessive categories,
* or advanced controls.

Advanced refinement may appear when needed.

Simple search must remain simple.

---

# 32. Search Results Need Clear Information Scent

A result should help users understand:

* what the destination is,
* why it matches,
* and where it belongs.

Potential result information may include:

* title,
* type,
* hierarchy,
* concise context,
* and relevant highlighting.

Avoid presenting search results as visually identical blocks with insufficient context.

Users should be able to distinguish:

* a question,
* a topic,
* a company,
* a preparation path,
* and a feature.

---

# 33. Search Should Support Imperfect Input

Where technically feasible, search should tolerate:

* partial terms,
* common abbreviations,
* minor spelling mistakes,
* alternate naming,
* and natural query phrasing.

The UX should not punish users for failing to use the exact internal terminology.

---

# 34. Filters Must Reduce Results, Not Increase Complexity

Filters are useful when result sets become meaningfully easier to navigate.

Do not add filters because filtering is expected in modern interfaces.

Every filter should correspond to a real user decision.

On mobile, filters should not permanently occupy large portions of the viewport.

---

# 35. Discovery Should Be Structured

Discovery surfaces should help users explore without creating a wall of possibilities.

Useful structures may include:

* major domains,
* role-based paths,
* technology groups,
* company preparation,
* recently relevant content,
* and guided starting points.

Avoid showing all content equally.

Hierarchy and prioritization are essential.

---

# 36. Recommendations Must Be Selective

Recommendations should answer:

> What is the most useful continuation from here?

Prefer:

* one primary recommendation,
* a small number of secondary options,
* and a route back to broader exploration.

Avoid:

* endless related-content walls,
* recommendation carousels everywhere,
* and ten equally emphasized next steps.

Recommendation quality matters more than recommendation quantity.

---

# 37. The User Must Be Allowed to Finish

Not every completion state needs another aggressive CTA.

A user may reach:

> You completed this module.

The product may provide:

* one sensible continuation,
* an option to review,
* and an option to stop.

Do not create endless consumption as the only success state.

---

# 38. Progressive Disclosure Is the Default for Secondary Complexity

Secondary information should often be:

* collapsed,
* placed lower in hierarchy,
* available on demand,
* or shown contextually.

Examples:

* advanced filters,
* detailed metadata,
* full topic trees,
* secondary settings,
* long explanations of features.

Progressive disclosure must not hide critical information.

The question is:

> Does the user need this now?

If not, it may not need immediate prominence.

---

# 39. Accordions Must Not Hide Core Content Without Reason

Accordions are useful for optional or secondary information.

They should not be used to make a page appear cleaner by hiding the content users came to access.

Avoid:

* placing the entire primary answer inside a collapsed accordion,
* excessive accordion nesting,
* and making users repeatedly expand sections during normal reading.

Use accordions when the information is genuinely optional or benefits from selective expansion.

---

# 40. Tabs Require Parallel Concepts

Tabs are appropriate when users switch between closely related peer views.

Examples might include:

* Overview / Progress,
* Questions / Practice,
* Current / Completed.

Tabs are not appropriate when:

* the content should be read sequentially,
* the sections have a hierarchy,
* or users may not realize hidden content exists.

Do not use tabs merely to reduce page length.

---

# 41. Modals Must Be Reserved for Temporary Focus

A modal interrupts the current page.

It should be used when the user needs to temporarily:

* confirm,
* choose,
* edit,
* authenticate,
* or complete a contained action.

Do not use modals for:

* long reading,
* core navigation,
* complex multi-step workflows,
* or information that deserves a permanent URL.

Modals must support:

* keyboard use,
* focus management,
* escape behavior where appropriate,
* and mobile usability.

---

# 42. Popups Must Not Interrupt Initial Value

A first-time user should generally be allowed to experience the product before being interrupted by:

* newsletter prompts,
* account prompts,
* feedback prompts,
* upgrade prompts,
* or promotional overlays.

Timing matters.

A prompt shown after demonstrated value is fundamentally different from one shown before the user has received anything useful.

---

# 43. Authentication Must Have a Clear Value Exchange

Do not require authentication simply because user accounts exist.

Authentication is appropriate when the action requires identity or persistence.

Examples:

* saving progress,
* bookmarks,
* personalized history,
* mock interview records,
* resume analysis history,
* subscription management.

Public content should remain public when the product strategy defines it as public.

If login is required, the user should understand why.

---

# 44. Conversion Must Follow Value

V2 may eventually support monetization.

Conversion UX should follow this sequence:

1. User understands the product.
2. User experiences value.
3. User encounters a meaningful limitation or advanced opportunity.
4. The product explains the additional value.
5. The user chooses whether to upgrade.

Avoid:

* aggressive paywalls before product understanding,
* deceptive buttons,
* fake urgency,
* and intentionally degraded free UX.

Premium conversion should come from additional leverage.

---

# 45. Dashboard UX Must Be Action-Oriented

A dashboard is not a storage area for every available metric.

Its primary job is:

> Help the user regain context and decide what to do next.

The dashboard should prioritize:

* continue preparation,
* current goals,
* recent activity,
* relevant progress,
* weak or pending areas where reliable,
* and saved items.

Charts and metrics must justify themselves.

A metric that does not affect a user decision should not automatically occupy dashboard space.

---

# 46. Dashboard Hierarchy

A useful default hierarchy may be:

1. Continue.
2. Current goal or preparation path.
3. Progress relevant to that goal.
4. Important pending or revision items.
5. Recent activity.
6. Broader analytics.

The exact structure may evolve.

The principle is stable:

> **Action before analytics.**

---

# 47. Progress Must Be Contextual

Do not display progress against the entire content universe.

Progress should be tied to a meaningful scope:

* module,
* selected path,
* current goal,
* daily plan,
* interview plan,
* or another explicit unit.

The user should understand:

* what the percentage means,
* what counts as completion,
* and what completing it represents.

---

# 48. Completion States Need Closure

When users complete a meaningful unit, the interface should acknowledge it clearly.

A completion state may include:

* what was completed,
* what changed,
* one sensible next step,
* an option to review,
* and an option to stop.

Avoid turning completion into another noisy recommendation page.

---

# 49. Loading States Must Preserve Layout

Loading should not cause unnecessary:

* layout shifts,
* flashing,
* or uncertainty.

Skeletons are appropriate when:

* the structure is predictable,
* loading lasts long enough to justify them,
* and the skeleton resembles the eventual layout.

Do not use skeletons everywhere automatically.

For very fast operations, a skeleton may create more visual noise than value.

---

# 50. Loading Indicators Must Match the Operation

Use an appropriate loading pattern.

Examples:

## Page-Level Loading

May use structural skeletons.

## Small Button Action

May use an inline progress indicator.

## Background Save

May use subtle status feedback.

## Long-Running AI Operation

Should communicate:

* that work is occurring,
* what state the process is in where meaningful,
* and whether the user can leave safely.

Do not use the same generic spinner for every type of waiting.

---

# 51. Empty States Must Explain the Absence

An empty state should answer:

* Why is this empty?
* Is this expected?
* What can I do next?

Examples:

A user with no bookmarks:

> You haven't saved any questions yet.

Then provide a useful action.

Avoid:

* blank pages,
* decorative empty-state illustrations without guidance,
* and excessive emotional copy.

---

# 52. Error States Must Support Recovery

An error message should help the user understand:

* what happened,
* whether their work is safe,
* and what they can do next.

Avoid:

* technical stack traces,
* generic "Something went wrong" without recovery,
* blaming the user,
* and dead ends.

Where appropriate, provide:

* retry,
* return,
* restore,
* or contact/feedback options.

---

# 53. Not-Found Pages Must Preserve Orientation

A 404 page should not be an isolated dead end.

It should provide:

* clear explanation,
* search,
* useful navigation,
* and a route back to a meaningful product area.

If the system can safely infer a likely destination, it may suggest it.

Do not automatically redirect uncertain URLs to unrelated pages.

---

# 54. Permission and Authentication Errors Must Be Distinct

Do not treat:

* not found,
* not logged in,
* forbidden,
* expired,
* and server failure

as the same state.

The user should receive the correct explanation and recovery path.

This improves:

* trust,
* usability,
* debugging,
* and technical correctness.

---

# 55. Feedback Must Be Immediate and Proportional

When users perform an action, the interface should acknowledge it.

Examples:

* bookmark saved,
* progress updated,
* answer copied,
* preference changed.

Feedback should match importance.

A small successful action may need:

* state change,
* subtle text,
* or a lightweight toast.

It does not require a modal celebration.

---

# 56. Toasts Must Not Become a Notification Stream

Toasts are appropriate for transient feedback.

They should:

* remain concise,
* avoid covering important controls,
* not stack excessively,
* and disappear appropriately.

Important information that the user may need later should not exist only in a temporary toast.

---

# 57. Destructive Actions Require Appropriate Friction

The amount of confirmation should match the consequence.

Low-risk reversible actions should not require excessive confirmation.

High-risk irreversible actions should require clear confirmation.

Examples:

Removing one bookmark may be easily reversible.

Deleting an account requires substantially more care.

Do not apply the same friction to every action.

---

# 58. Hover Is Enhancement, Not a Requirement

Important information and actions must not depend exclusively on hover.

This is essential for:

* touch devices,
* keyboard users,
* and accessibility.

Hover may provide:

* subtle feedback,
* previews,
* or additional context.

The core experience must remain functional without it.

---

# 59. Focus States Must Be Visible

Keyboard users must be able to understand where focus is.

Do not remove focus indicators merely because they appear visually strong.

The design system should provide a consistent focus treatment.

Focus visibility is functional UI.

---

# 60. Touch Targets Must Be Usable

Mobile controls must provide sufficient interactive area.

Small visual icons may have larger invisible hit areas.

Avoid tightly packed controls that cause accidental activation.

The exact minimum dimensions will be defined in the design and accessibility specifications.

---

# 61. Mobile Is a Prioritization Exercise

Mobile design is not desktop stacked vertically.

For each page, determine:

1. What must remain immediately visible?
2. What can move lower?
3. What can collapse?
4. What can become contextual?
5. What should disappear only if genuinely non-essential?

The primary task must remain strong.

---

# 62. Mobile Navigation Must Remain Predictable

The mobile navigation system should provide reliable access to major product areas.

It should not change radically from page to page.

A bottom navigation bar may be appropriate for a small set of high-frequency destinations.

A menu or drawer may be appropriate for broader navigation.

The exact pattern should follow the information architecture.

Do not introduce bottom navigation simply because it is common in mobile apps.

It must reflect actual high-frequency destinations.

---

# 63. Desktop Space Must Not Encourage Clutter

Large screens create temptation to fill empty areas.

Do not add:

* extra widgets,
* permanent sidebars,
* recommendations,
* or decorative panels

merely because space exists.

Large-screen design should improve:

* readability,
* orientation,
* and efficient navigation.

Empty space can be intentional.

---

# 64. Responsive Design Must Preserve Hierarchy

Responsive behavior should not merely prevent overflow.

It must preserve:

* priority,
* order,
* meaning,
* and task completion.

If an element moves on mobile, ensure the new order still reflects importance.

CSS order should not create an illogical keyboard or screen-reader sequence.

---

# 65. Light and Dark Modes Must Preserve the Same Hierarchy

The experience should not become:

* flatter in one mode,
* noisier in another,
* or semantically different.

Both modes should preserve:

* hierarchy,
* contrast,
* component meaning,
* focus visibility,
* and interaction states.

Dark mode should not use excessive glowing borders or saturated accents to recreate hierarchy.

---

# 66. Motion Must Preserve Context

Motion may help users understand:

* where something came from,
* what changed,
* whether content expanded,
* or whether an action succeeded.

Motion should not:

* delay task completion,
* create spectacle,
* or make repeated actions tiring.

The motion system will define exact durations and easing.

The UX rule is:

> **Motion explains change. It does not decorate inactivity.**

---

# 67. Reduce Motion Must Be Respected

Users who prefer reduced motion should not be forced through:

* large transforms,
* unnecessary parallax,
* prolonged animated transitions,
* or decorative movement.

Functional state changes must remain understandable without motion.

---

# 68. The Homepage Must Not Attempt to Explain Everything

The homepage should communicate:

* what Interview Explainer is,
* who it helps,
* what major preparation paths exist,
* and how to begin.

It should not become:

* a complete feature catalog,
* a full content directory,
* a giant SEO page,
* or a dashboard for anonymous users.

The homepage should create confidence and direction.

---

# 69. Homepage Hierarchy

A useful conceptual hierarchy may include:

1. Clear product proposition.
2. Primary way to begin.
3. Search or direct discovery.
4. Major preparation areas.
5. Evidence of product depth or usefulness.
6. Secondary product capabilities.
7. Trust and supporting information.

The exact design may evolve.

The hierarchy should remain intentional.

---

# 70. Hub Pages Must Organize Complexity

A domain or role hub should not simply list everything.

It should help users understand:

* the scope,
* major areas,
* recommended structure,
* and how to begin.

A hub is an orientation page.

Its job is not to maximize the number of links above the fold.

---

# 71. Module Pages Must Support Selection

A module page should help users decide what to study within a narrower area.

It may provide:

* module context,
* question structure,
* progress,
* difficulty or priority where useful,
* and local navigation.

It should avoid repeating the full domain-level interface.

As intent narrows, the interface should narrow.

---

# 72. Question Pages Must Prioritize the Question and Answer

The question page is one of the most important V2 experiences.

The default hierarchy should be:

1. Location/context.
2. Question title.
3. Essential supporting metadata.
4. Answer content.
5. Local navigation where useful.
6. Next or related preparation.

The answer must not be visually subordinated to:

* a large sidebar,
* promotional cards,
* excessive metadata,
* or global navigation.

---

# 73. Question Metadata Must Remain Secondary

Potential metadata may include:

* difficulty,
* topic,
* role,
* company relevance,
* update date,
* completion,
* bookmark state.

Only information useful at the moment should be prominent.

Do not create a large metadata dashboard above every answer.

---

# 74. Related Questions Belong After or Beside the Primary Task

Related content can support continuation.

It should not compete with the current answer before the user has engaged with it.

Possible placements include:

* after the answer,
* within a quiet contextual rail,
* or as a small next-step section.

Avoid large recommendation grids near the top of a focused question page.

---

# 75. Previous and Next Navigation Should Preserve Learning Flow

Where a meaningful sequence exists, previous/next navigation can reduce navigation effort.

It should reflect a real sequence.

Do not create arbitrary previous/next links solely based on database order.

The user should understand what the sequence represents.

---

# 76. Search-Landing Pages Must Work Independently

Every indexable content page should work as a potential first experience.

A direct visitor should not require homepage context.

The page should provide enough information to understand:

* the topic,
* the product context,
* the hierarchy,
* and a useful continuation.

This principle connects UX directly with SEO architecture.

---

# 77. The Product Must Preserve Scroll Position Where Useful

When users navigate temporarily away from:

* a long question list,
* search results,
* or another browsing context,

returning should preserve context where technically appropriate.

Forcing users to repeatedly relocate their previous position creates friction.

This behavior should be implemented carefully and consistently.

---

# 78. Back Navigation Must Behave Predictably

Browser back should generally work as users expect.

Avoid navigation architectures that:

* trap users,
* unexpectedly replace history,
* or make back navigation lose context.

The product should cooperate with the web rather than fight it.

---

# 79. URLs Should Represent Meaningful Destinations

Important product states that users may:

* revisit,
* share,
* bookmark,
* or discover through search

should generally have meaningful URLs.

Not every transient UI state requires a URL.

The information architecture and SEO framework will define exact routing rules.

---

# 80. UX Must Support SEO Without Becoming SEO-Led

A page may need:

* headings,
* internal links,
* breadcrumbs,
* contextual text,
* and structured relationships.

These can improve both UX and search understanding.

Do not add visible content solely because a keyword strategy demands it.

The best solution is usually a page structure that is genuinely useful to users and semantically clear to machines.

---

# 81. Internal Links Must Be Contextually Useful

Internal linking should not become a giant list of SEO links.

Links should help users:

* understand relationships,
* navigate hierarchy,
* continue learning,
* or discover relevant content.

SEO benefits should follow useful architecture.

---

# 82. Accessibility Must Be Built Into Interaction Design

Accessibility is not a visual QA pass.

Interaction patterns must consider:

* semantic elements,
* keyboard behavior,
* focus order,
* accessible names,
* state announcements,
* contrast,
* reduced motion,
* zoom,
* and touch.

A custom interaction should not be introduced unless it can be made meaningfully accessible.

---

# 83. Performance Must Influence UX Decisions

UX proposals should consider runtime cost.

Examples:

A visually impressive animation may not be worth:

* additional JavaScript,
* interaction delay,
* or mobile battery cost.

A complex client-side search interface may not be worth:

* slow initial loading,
* if simpler server-supported discovery solves the need.

Performance is part of the experience.

---

# 84. UX Should Degrade Gracefully

The core experience should remain useful under imperfect conditions.

Consider:

* slow network,
* failed optional requests,
* missing images,
* unavailable personalization,
* JavaScript delays,
* and partial data.

The product should not become unusable because a secondary enhancement failed.

---

# 85. No Dark Patterns

Interview Explainer must not use:

* disguised advertisements,
* confusing cancellation,
* preselected unwanted options,
* fake urgency,
* deceptive buttons,
* forced continuity,
* or intentionally confusing consent.

Trust is more valuable than short-term conversion.

---

# 86. UX Metrics Must Reflect User Success

Useful metrics may include:

* successful search,
* content engagement,
* continuation,
* return behavior,
* completion of chosen preparation units,
* task success,
* and performance.

Metrics should not automatically optimize for:

* maximum clicks,
* maximum page views,
* or maximum session duration.

A user who finds the correct answer in two minutes may have had an excellent experience.

---

# 87. The Five-Second UX Test

For major pages, ask:

Within approximately five seconds, can a first-time user understand:

* what this page is,
* whether it is relevant,
* and what they can do?

If not, hierarchy needs review.

---

# 88. The Thirty-Minute UX Test

For focus experiences, ask:

After thirty minutes:

* Is the interface tiring?
* Are sticky elements irritating?
* Is the reading width comfortable?
* Is navigation still understandable?
* Are colors and borders competing?
* Are interruptions accumulating?

V2 must optimize for real use over time.

---

# 89. The Mobile Thumb Test

For frequent mobile actions, ask:

* Is the control easy to reach?
* Is the target large enough?
* Is it too close to destructive or unrelated controls?
* Does the action require precision?

The exact layout will depend on context.

Frequent mobile interactions should not require unnecessary dexterity.

---

# 90. The Direct-Landing Test

For every important public page, ask:

If this is the first page the user ever sees:

* Do they know what they are looking at?
* Can they use it immediately?
* Can they understand where it belongs?
* Can they continue if the page is useful?

If not, the page is overly dependent on prior navigation.

---

# 91. The Focus Test

Ask:

If the user came here for one specific task, what on this page competes with that task?

Every competing element must justify itself.

---

# 92. The Removal Test

Before adding another element, ask:

* What could become quieter?
* What could move lower?
* What could appear later?
* What could be combined?
* What could be removed?

V2 must not improve through endless accumulation.

---

# 93. The Consistency Test

Ask:

* Does a similar interaction already exist?
* Does this behave the same way?
* If not, is the difference meaningful?

Consistency should be intentional.

Exceptions should be justified.

---

# 94. The Responsive Test

Test representative page archetypes at minimum across:

* narrow mobile,
* standard mobile,
* tablet,
* laptop,
* desktop,
* and large desktop where relevant.

Also test:

* long titles,
* long content,
* code,
* tables,
* empty states,
* errors,
* and navigation expansion.

Responsive quality cannot be inferred from one screenshot.

---

# 95. The Keyboard Test

For interactive experiences:

* Can all actions be reached?
* Is focus visible?
* Is the order logical?
* Can overlays be entered and exited?
* Are custom interactions understandable?

A mouse-only implementation is incomplete.

---

# 96. The Content-Stress Test

Page archetypes must be tested with realistic extremes.

For question pages:

* very short answer,
* very long answer,
* code-heavy answer,
* table-heavy answer,
* many headings,
* no optional metadata,
* long title.

For lists:

* few items,
* hundreds of items,
* long labels,
* mixed completion states.

For dashboards:

* new user,
* active user,
* sparse data,
* large history.

Design must survive real content.

---

# 97. The UX Acceptance Standard

A V2 user-facing implementation should not be considered complete merely because:

* it matches a screenshot,
* it looks modern,
* or it works on one viewport.

It should satisfy:

* clear hierarchy,
* understandable navigation,
* responsive behavior,
* accessibility,
* appropriate focus,
* valid loading and failure states,
* and consistency with V2 principles.

---

# 98. Non-Negotiable UX Principles

## Principle 1

**Every page has one dominant user job.**

## Principle 2

**The narrower the intent, the quieter the interface.**

## Principle 3

**Primary content must dominate supporting interface.**

## Principle 4

**Every important page must provide orientation.**

## Principle 5

**Navigation must be contextual rather than universally maximal.**

## Principle 6

**Reading pages are focus environments.**

## Principle 7

**Mobile requires prioritization, not compression.**

## Principle 8

**Progress must be meaningful and contextual.**

## Principle 9

**Search is a primary navigation system.**

## Principle 10

**Progressive disclosure is preferred for secondary complexity.**

## Principle 11

**Cards, sidebars, sticky elements, tabs, accordions, and modals require a clear job.**

## Principle 12

**Loading, empty, error, and completion states are part of the product.**

## Principle 13

**Every indexed page may be a user's first experience.**

## Principle 14

**Conversion should follow demonstrated value.**

## Principle 15

**Accessibility and performance are UX requirements.**

## Principle 16

**Users must be allowed to finish.**

## Principle 17

**The product should cooperate with standard web behavior.**

## Principle 18

**The lightest structure that communicates clearly is usually preferred.**

---

# 99. UX Anti-Patterns

The following should trigger explicit review:

* oversized hero sections on high-intent content pages,
* multiple simultaneous sidebars,
* card-inside-card layouts,
* excessive sticky UI,
* large recommendation sections before primary content,
* mobile layouts created only by stacking desktop elements,
* hidden core content inside unnecessary accordions,
* tabs used only to reduce page length,
* modals used for permanent content,
* authentication before demonstrating public value,
* dashboards dominated by non-actionable metrics,
* progress percentages against meaningless total scope,
* hover-only functionality,
* excessive toasts,
* generic failure states,
* decorative loading states,
* navigation exposing the entire taxonomy,
* excessive metadata on list items,
* and conversion prompts that interrupt initial value.

---

# 100. Relationship to the Next Specifications

This document defines experience behavior.

The next documents will make it more concrete.

## `05_INFORMATION_ARCHITECTURE.md`

Will define:

* product hierarchy,
* content hierarchy,
* user-facing taxonomy,
* page archetypes,
* route relationships,
* navigation levels,
* domain structures,
* company structures,
* and how future product areas fit together.

## `06_DESIGN_SYSTEM.md`

Will define:

* color,
* typography,
* spacing,
* surfaces,
* borders,
* radii,
* shadows,
* responsive foundations,
* density,
* and visual tokens.

## `07_COMPONENT_LIBRARY.md`

Will define:

* when each component exists,
* component variants,
* usage rules,
* and prohibited misuse.

## `08_MOTION_SYSTEM.md`

Will define:

* allowed motion,
* durations,
* easing,
* reduced-motion behavior,
* and animation constraints.

## `09_SEO_FRAMEWORK.md`

Will define how public UX architecture becomes:

* crawlable,
* indexable,
* canonical,
* internally linked,
* structured,
* and discoverable.

---

# 101. Final UX Principle

Interview Explainer should not ask users to understand the interface before they can begin preparing.

The interface should explain itself through:

* hierarchy,
* familiarity,
* consistency,
* and context.

The product should become broader as the user explores.

It should become quieter as the user focuses.

It should become faster as the user becomes familiar.

It should remember enough to help returning users continue.

And it should never confuse visual activity with user progress.

The permanent UX principle is:

> **Orient first.**

> **Prioritize the current task.**

> **Reveal complexity when it becomes useful.**

> **Protect focus.**

> **Preserve context.**

> **Make the next step clear.**

> **Allow completion.**

Interview Explainer V2 should feel powerful because the complexity has been organized—not because the complexity is visible.
