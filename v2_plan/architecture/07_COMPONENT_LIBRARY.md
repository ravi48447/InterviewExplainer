# Interview Explainer V2 — Component Library

**Document:** `07_COMPONENT_LIBRARY.md`
**Status:** Foundational / UI Architecture
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md`, `01_PRODUCT_PHILOSOPHY.md`, `02_AI_CONSTITUTION.md`, `03_USER_PSYCHOLOGY.md`, `04_UX_PRINCIPLES.md`, `05_INFORMATION_ARCHITECTURE.md`, `06_DESIGN_SYSTEM.md`
**Purpose:** Define the reusable UI components, composition rules, variants, responsibilities, usage constraints, anti-patterns, accessibility expectations, responsive behavior, and governance model for Interview Explainer V2.

---

# 1. Purpose of This Document

Interview Explainer V2 will contain many pages.

It must not contain many unrelated interface systems.

The component library exists to create:

* consistency,
* implementation speed,
* accessibility,
* maintainability,
* responsive reliability,
* and visual coherence.

However, reusable components can also create problems.

A poorly governed component library can encourage developers to:

* wrap everything in cards,
* add badges everywhere,
* create unnecessary abstraction,
* force unrelated experiences into identical layouts,
* or build dozens of variants nobody understands.

Therefore, the component library follows one central principle:

> **A component should exist because a recurring interface responsibility exists—not because a visual pattern appeared twice.**

---

# 2. Components Are Product Contracts

A component is not merely:

```text
Some JSX + CSS
```

A mature component defines a contract.

That contract may include:

* visual appearance,
* semantic meaning,
* interaction behavior,
* accessibility,
* responsive behavior,
* loading behavior,
* error behavior,
* content limits,
* and composition rules.

For example:

A `Button` is not merely a colored rectangle.

It defines:

* what counts as an action,
* visual priority,
* keyboard behavior,
* disabled behavior,
* loading behavior,
* focus behavior,
* and accessible naming.

Components should reduce repeated decision-making.

---

# 3. The Component Hierarchy

The V2 component system should conceptually contain four levels.

```text
Foundations
    ↓
Primitives
    ↓
Patterns
    ↓
Domain Components
```

## Foundations

Defined primarily in `06_DESIGN_SYSTEM.md`.

Examples:

* color,
* typography,
* spacing,
* radius,
* shadows,
* widths,
* motion.

## Primitives

General reusable interface components.

Examples:

* Button,
* Input,
* Badge,
* Divider,
* Dialog.

## Patterns

Combinations solving recurring interface structures.

Examples:

* Search field,
* Page header,
* Empty state,
* Pagination,
* Sidebar navigation.

## Domain Components

Components specific to Interview Explainer concepts.

Examples:

* Question list item,
* Preparation track item,
* Module navigation,
* Interview result summary.

The lower the level:

> The more reusable and visually generic the component should be.

The higher the level:

> The more product meaning the component may contain.

---

# 4. Do Not Build a Component for Every Element

Not every repeated `<div>` needs abstraction.

Create a reusable component when one or more of the following are true:

* behavior repeats,
* accessibility logic repeats,
* visual rules must remain consistent,
* semantic meaning repeats,
* responsive transformation repeats,
* state handling repeats,
* or the product needs centralized control.

Do not create components merely to reduce the number of lines in a file.

Abstraction has a maintenance cost.

---

# 5. Component Naming Principles

Names should describe:

* responsibility,
* semantic role,
* or product concept.

Prefer:

```text
QuestionListItem
PageHeader
SearchInput
ModuleNavigation
EmptyState
```

Avoid vague names such as:

```text
FancyBox
InfoThing
BlueCard
SectionWrapper2
ModernContainer
```

Names based on current appearance become misleading when the design changes.

---

# 6. Component Variants Must Be Controlled

Variants should represent meaningful differences.

Good:

```text
Button
- primary
- secondary
- ghost
- destructive
```

Potentially bad:

```text
Card
- blue
- purple
- green
- orange
- gradient
- gradient2
- premium
- modern
- cool
```

A component should not become a dumping ground for every one-off requirement.

If a variant has no stable semantic meaning:

It probably should not exist.

---

# 7. Component APIs Should Prefer Meaning Over Styling

Prefer:

```text
<Button variant="primary">
```

over:

```text
<Button blue rounded shadowLarge>
```

Prefer:

```text
<Callout type="warning">
```

over:

```text
<Box yellow borderLeft>
```

Component APIs should communicate intent.

Implementation details should remain inside the component system.

---

# 8. Escape Hatches Must Be Limited

Reusable components may occasionally require:

* `className`,
* style overrides,
* composition slots,
* or custom children.

However, unrestricted overrides can destroy the system.

If every component is routinely used as:

```text
<Component className="20 arbitrary overrides">
```

the abstraction has failed.

Repeated overrides indicate:

* missing variant,
* incorrect component responsibility,
* or misuse.

The correct response is not always to add more override capability.

---

# 9. Core Primitive Inventory

The initial V2 primitive layer should likely include:

```text
Button
IconButton
Link
Input
Textarea
Select
Checkbox
Radio
Switch
Label
Badge
Avatar
Divider
Tooltip
Popover
Dropdown Menu
Dialog
Drawer / Sheet
Tabs
Accordion
Progress
Skeleton
Spinner
Toast
```

This is a conceptual inventory.

The repository audit should determine:

* what already exists,
* what is duplicated,
* what should be retained,
* what should be replaced,
* and what is unnecessary.

Do not install a component library simply to maximize component count.

---

# 10. Button

## Purpose

Represent an action.

Examples:

* Continue,
* Save,
* Start Mock Interview,
* Analyze Resume,
* Submit.

## Variants

Recommended semantic variants:

```text
Primary
Secondary
Ghost
Destructive
```

A link-styled action may exist when semantically appropriate.

## Sizes

Recommended:

```text
Small
Standard
Large
```

Most product actions should use `Standard`.

## States

Must support:

* default,
* hover,
* active,
* focus-visible,
* disabled,
* loading.

## Rules

A local interface region should usually contain only one visually dominant primary action.

Do not use buttons for ordinary navigation when a semantic link is more appropriate.

Do not use primary buttons for every clickable item.

## Anti-Patterns

* five primary buttons in one section,
* button used as a decorative label,
* button with no accessible name,
* loading button that changes width dramatically,
* disabled button with no explanation when the reason is important,
* arbitrary button heights across pages.

---

# 11. IconButton

## Purpose

Represent a compact action using a familiar icon.

Examples:

* close,
* copy,
* menu,
* search,
* bookmark.

## Requirements

Must have:

* accessible name,
* sufficient hit area,
* visible focus state,
* tooltip where useful.

## Rule

If the action is unfamiliar:

Use a text label.

Do not force users to decode custom iconography.

---

# 12. Text Link

## Purpose

Navigate to another destination.

Links should remain visually distinguishable from ordinary text.

Variants may include:

```text
Default
Subtle
Standalone
```

Do not create excessive visual variation.

## Rule

Use semantic links for navigation.

Do not use buttons solely because they appear visually stronger.

---

# 13. Input

## Purpose

Accept short text input.

Must support:

* label,
* description,
* placeholder,
* error,
* disabled state,
* required state,
* focus state.

## Rule

Placeholder text should not replace a persistent label where context must remain visible after typing.

## Anti-Patterns

* unlabeled fields,
* tiny click targets,
* low-contrast placeholders,
* errors displayed only through red borders,
* one-off input styles on different pages.

---

# 14. Textarea

Textarea should follow the same semantic and accessibility system as Input.

Use for:

* notes,
* longer responses,
* feedback,
* open-ended answers.

Avoid excessively small default heights for tasks requiring meaningful writing.

---

# 15. Select

Use when users must choose from a constrained option set.

Do not use a custom select merely for visual consistency if native behavior would provide a better mobile experience.

For large searchable datasets:

Use an appropriate combobox or searchable selection pattern.

Do not place hundreds of options in a basic dropdown.

---

# 16. Checkbox

Use for independent binary selections.

Examples:

```text
Include behavioral questions
Save preference
Select multiple topics
```

Do not use checkboxes for mutually exclusive choices.

---

# 17. Radio Group

Use for mutually exclusive choices when users benefit from seeing the options simultaneously.

Examples:

```text
Interview difficulty
Experience level
Mock interview format
```

For a very large number of choices:

Use another pattern.

---

# 18. Switch

Use for immediate binary settings.

Examples:

```text
Dark mode
Email notifications
```

Do not use switches for actions requiring explicit submission unless the interaction clearly communicates that behavior.

---

# 19. Label

Labels should remain:

* readable,
* consistently positioned,
* and semantically associated with controls.

Required and optional states should follow one consistent convention.

---

# 20. Badge

## Purpose

Communicate compact:

* status,
* category,
* difficulty,
* or metadata.

## Variants

Possible semantic variants:

```text
Neutral
Primary
Success
Warning
Danger
Info
```

## Rule

Badges are secondary information.

They should not dominate cards or lists.

## Anti-Patterns

* five badges on every question,
* unique badge color for every topic,
* large badges used as headings,
* decorative badges without information value.

---

# 21. Avatar

Use for:

* user identity,
* participant identity,
* or clearly person-associated contexts.

Fallbacks may include:

* initials,
* generic user icon.

Do not use avatars as generic decorative circles.

---

# 22. Divider

Use for subtle structural separation.

Prefer a divider when:

* two related groups need separation,
* but separate containers would be excessive.

Avoid dividers after every small item if spacing alone is sufficient.

---

# 23. Tooltip

Use for brief supplemental information.

Appropriate for:

* icon-only controls,
* unfamiliar terminology,
* concise clarification.

Do not place critical information only inside a tooltip.

Tooltips should not contain:

* long explanations,
* forms,
* complex interactions.

---

# 24. Popover

Use for contextual interactive content that does not require a modal.

Examples:

* compact filters,
* contextual options,
* supplemental controls.

Do not use popovers for large workflows.

---

# 25. Dropdown Menu

Use for a collection of related actions.

Examples:

* account menu,
* item actions,
* overflow menu.

Do not hide primary actions inside overflow menus merely to make the page look cleaner.

---

# 26. Dialog

Use when:

* attention must temporarily move to a focused task,
* the user must make a decision,
* or a small contained workflow should interrupt the current page.

Examples:

* confirmation,
* small form,
* destructive action.

Do not use dialogs for:

* long reading,
* major multi-step workflows,
* ordinary navigation.

---

# 27. Drawer / Sheet

Use when temporary side content is appropriate.

Potential uses:

* mobile navigation,
* filters,
* contextual details.

Do not turn every sidebar into a drawer on desktop.

Responsive transformation should depend on the component's job.

---

# 28. Tabs

Use when:

* multiple peer views share the same context,
* switching is frequent,
* and all views belong to one conceptual destination.

Do not use tabs:

* as a substitute for primary navigation,
* for long sequential workflows,
* or when users need to compare content simultaneously.

Tabs should not become a way to hide excessive page complexity.

---

# 29. Accordion

Use for optional or progressively disclosed content.

Potential uses:

* FAQ,
* secondary module navigation,
* optional detail groups.

Do not place core answer content inside collapsed accordions merely to make the page appear shorter.

Critical information should remain discoverable.

---

# 30. Progress

Progress components may include:

```text
Linear Progress
Compact Completion Indicator
Step Progress
```

Use the simplest representation that communicates the information.

Do not use circular progress by default.

Progress must have accessible text or equivalent semantics.

---

# 31. Skeleton

Skeletons should approximate actual layout.

Variants may correspond to recurring structures:

```text
Text
List Item
Card
Question Page
Dashboard Section
```

Avoid creating a unique skeleton for every page unless necessary.

Skeletons should not create large layout shifts when content loads.

---

# 32. Spinner

Use for:

* compact indeterminate actions,
* button loading,
* small isolated loading states.

Do not use a centered full-page spinner for every route transition.

For content-heavy pages:

Structured skeletons may be more useful.

---

# 33. Toast

Use for temporary feedback.

Examples:

* bookmark saved,
* copied,
* preference updated.

Do not use toasts for:

* critical errors requiring action,
* information users must remember,
* long explanations.

Toast behavior should be consistent.

---

# 34. Layout Primitive Inventory

The layout layer may include:

```text
PageContainer
ReadingContainer
WideContainer
Stack
Inline
Cluster
Grid
Section
Surface
SplitLayout
SidebarLayout
```

These should encode common layout rules.

They should not become unnecessarily abstract.

The repository's existing styling approach should determine the appropriate implementation.

---

# 35. PageContainer

## Purpose

Provide:

* maximum width,
* responsive gutters,
* horizontal centering.

Variants may correspond to:

```text
Reading
Standard
Wide
```

Avoid page-specific hardcoded maximum widths when a standard width context applies.

---

# 36. ReadingContainer

Used for long-form reading.

Examples:

* question answers,
* deep explanations,
* resume analysis narratives.

The ReadingContainer should enforce:

* comfortable measure,
* responsive gutters,
* stable typography context.

Do not place wide application grids inside it.

---

# 37. Stack

A vertical layout primitive for consistent spacing.

Conceptually:

```text
Item
↓ gap
Item
↓ gap
Item
```

Useful for:

* form fields,
* content groups,
* sections.

A Stack should use approved spacing tokens.

---

# 38. Inline / Cluster

Used for horizontally related content.

Examples:

* button groups,
* metadata,
* compact actions,
* tags.

Must support wrapping.

Do not assume horizontal layouts will always fit.

---

# 39. Grid

Use for genuinely parallel items.

Examples:

* preparation track discovery,
* selected dashboard modules,
* feature overview.

Do not use grids merely to fill horizontal space.

If content is sequential:

A list may be better.

---

# 40. Section

A Section component may standardize:

* major vertical spacing,
* optional heading relationship,
* anchor behavior.

It should not automatically:

* add a background,
* border,
* card,
* or decorative treatment.

A section is primarily structural.

---

# 41. Surface

A Surface component may represent intentional visual grouping.

Potential variants:

```text
Default
Subtle
Elevated
```

Use carefully.

Do not wrap every Section in Surface.

---

# 42. SplitLayout

Used when two meaningful regions share a page.

Example:

```text
Primary Content | Secondary Context
```

Potential uses:

* question page with contextual sidebar,
* resume analysis with summary panel.

The secondary region must remain genuinely useful.

Do not create a two-column layout merely because desktop width exists.

---

# 43. SidebarLayout

Used for persistent local navigation or contextual tools.

The component should define:

* width behavior,
* sticky behavior,
* scroll behavior,
* responsive transformation.

The sidebar should not compete visually with primary content.

---

# 44. Navigation Component Inventory

The navigation system may include:

```text
GlobalHeader
DesktopNavigation
MobileNavigation
UserMenu
Breadcrumbs
LocalNavigation
SidebarNavigation
ModuleNavigation
Pagination
PreviousNextNavigation
```

Each has a distinct responsibility.

Do not combine every navigation system on every page.

---

# 45. GlobalHeader

## Purpose

Provide access to major product areas and global actions.

Potential contents:

* logo,
* primary navigation,
* search access,
* theme control if retained,
* authentication or account access.

## Rules

The header should remain stable across public pages.

It should not become a storage area for every feature.

Avoid:

* excessive navigation links,
* multiple competing CTAs,
* large permanent height.

---

# 46. DesktopNavigation

Desktop navigation should expose only major product destinations.

Do not place:

* all technologies,
* all roles,
* all companies,
* all modules

directly in the top-level navigation.

Complex discovery belongs in:

* directories,
* search,
* structured menus,
* or dedicated pages.

---

# 47. MobileNavigation

Mobile navigation must be designed for mobile.

Do not merely compress desktop navigation.

Potential patterns:

* menu drawer,
* compact header,
* limited bottom navigation for authenticated high-frequency tasks.

The exact architecture should depend on actual product priorities.

Do not automatically introduce a bottom tab bar because mobile applications commonly use one.

---

# 48. Breadcrumbs

Breadcrumbs communicate primary hierarchy.

They should:

* remain compact,
* support navigation,
* truncate intelligently on smaller screens.

They should not display every relationship.

Example:

```text
Java Backend
→ Concurrency
→ Concurrent Collections
→ Current Question
```

On mobile, the full hierarchy may require adaptation.

---

# 49. LocalNavigation

Used for navigation within a major product context.

Examples:

* preparation track sections,
* account settings,
* dashboard subsections.

Local navigation should not visually compete with global navigation.

---

# 50. SidebarNavigation

Use when:

* the local structure is substantial,
* users frequently move between neighboring destinations,
* persistent context provides meaningful value.

Do not use a sidebar solely to make the application appear more sophisticated.

---

# 51. ModuleNavigation

A domain-specific navigation pattern for moving through preparation structures.

Potential responsibilities:

* module list,
* current position,
* completion,
* next destination.

It should not necessarily expose the entire preparation taxonomy simultaneously.

Progressive disclosure may be required.

---

# 52. Pagination

Use for large collections when stable navigation matters.

Must provide:

* clear current state,
* accessible controls,
* predictable URLs where applicable.

Do not use pagination purely because a component library includes it.

The collection behavior should determine the pattern.

---

# 53. Previous / Next Navigation

Useful for:

* sequential preparation,
* question progression,
* modules,
* multi-step flows.

Labels should communicate destination where practical.

Prefer:

```text
Previous: HashMap Internals
Next: ConcurrentHashMap
```

over only:

```text
Previous
Next
```

when space allows.

---

# 54. Search Component System

Search may include:

```text
SearchTrigger
SearchInput
SearchDialog
SearchResults
SearchResultItem
SearchFilters
SearchEmptyState
```

The exact architecture depends on V2 search scope.

Search should be treated as a system.

Not merely an input field.

---

# 55. SearchTrigger

A compact control may open global search.

Potential contents:

* search icon,
* label,
* keyboard shortcut on desktop.

Do not display keyboard shortcut hints where they create unnecessary mobile clutter.

---

# 56. SearchInput

The search input should:

* receive clear focus,
* support keyboard interaction,
* communicate loading,
* support clearing,
* remain readable.

Avoid excessive decorative treatment.

---

# 57. SearchResultItem

A search result should communicate:

* primary title,
* result type,
* relevant context,
* optional matched information.

Example:

```text
How does ConcurrentHashMap work?

Question
Java Backend → Concurrency
```

Do not display every available metadata field.

---

# 58. Search Filters

Filters should appear only when useful for result volume or ambiguity.

Potential filters:

* result type,
* technology,
* role,
* domain.

Avoid presenting a complex filter panel before users need it.

---

# 59. Content Component Inventory

The content system may include:

```text
Prose
ContentHeading
CodeBlock
InlineCode
Callout
Blockquote
Table
DefinitionList
QuestionHeader
QuestionMetadata
RelatedContent
TableOfContents
```

These components must prioritize reading.

---

# 60. Prose

The Prose component governs long-form content.

It should define consistent treatment for:

* paragraphs,
* headings,
* lists,
* links,
* inline code,
* code blocks,
* tables,
* quotes.

Do not manually style answer content separately on every question page.

---

# 61. ContentHeading

Long-form headings should follow a controlled hierarchy.

Potential features:

* anchor IDs,
* optional anchor links,
* appropriate scroll offset.

Avoid placing decorative icons beside every content heading.

---

# 62. CodeBlock

The CodeBlock should support:

* syntax highlighting,
* copy action,
* horizontal overflow,
* accessible labeling where possible.

Optional:

* language label,
* filename,
* line emphasis.

Do not add a complex toolbar unless functionality requires it.

---

# 63. InlineCode

InlineCode should remain compact and readable.

It should not visually overpower surrounding prose.

---

# 64. Callout

## Purpose

Highlight content requiring special contextual treatment.

Potential semantic variants:

```text
Note
Tip
Important
Warning
```

## Rules

Callouts should be used selectively.

Do not turn every important sentence into a colored box.

If a page contains six callouts in one viewport:

The content structure may need review.

---

# 65. Blockquote

Reserved for actual quotation or quotation-like contextual material.

Do not use Blockquote as a generic highlight component.

---

# 66. Content Table

Tables should use shared responsive and visual behavior.

The table system should define:

* header treatment,
* row separation,
* overflow,
* mobile behavior.

Avoid custom table styling per question.

---

# 67. Table of Contents

A table of contents may help long answers.

Use when:

* the content has meaningful section depth,
* navigation benefit outweighs interface cost.

Do not show an empty or trivial table of contents for short answers.

On mobile, it may become:

* collapsible,
* inline,
* or omitted where unnecessary.

---

# 68. QuestionHeader

A QuestionHeader should communicate:

* question title,
* essential context,
* limited relevant metadata.

It should not become a large hero.

Avoid placing:

* five badges,
* multiple CTAs,
* progress,
* author data,
* sharing,
* company logos,
* and unrelated controls

all beside the title.

The question itself remains primary.

---

# 69. QuestionMetadata

Question metadata may include:

* difficulty,
* topic,
* preparation context,
* priority where useful.

Metadata must remain secondary.

Only show information that helps the current task.

---

# 70. RelatedContent

Related content should provide useful continuation.

It should not become a generic SEO link farm.

Potential relationships:

* next concept,
* prerequisite,
* comparison,
* related question.

Limit visible recommendations.

Quality is more valuable than quantity.

---

# 71. Domain Component Inventory

Initial domain-specific components may include:

```text
PreparationTrackItem
MajorAreaItem
ModuleItem
QuestionListItem
QuestionProgress
ContinuePreparation
PreparationProgress
CompanyPreparationItem
RolePreparationItem
MockInterviewCard
InterviewResultSummary
ResumeAnalysisSummary
JobPreparationConnection
```

Only currently needed components should be implemented.

Future components are architectural placeholders, not implementation requirements.

---

# 72. PreparationTrackItem

## Purpose

Represent a preparation track in discovery or continuation contexts.

Potential information:

* track name,
* concise description,
* progress if authenticated,
* next action.

Do not include every possible statistic.

Avoid turning the component into a miniature dashboard.

---

# 73. MajorAreaItem

Represents a substantial preparation area.

Potential contents:

* title,
* concise context,
* module or progress summary,
* continuation state.

The visual treatment should reflect its hierarchy.

A major area should not look identical to an individual question.

---

# 74. ModuleItem

Represents a module in a track or major area.

Potential contents:

* module title,
* question count,
* progress,
* short description where useful.

Avoid excessive metadata.

---

# 75. QuestionListItem

This is one of the most important V2 components.

The existing site may contain very large question collections.

The QuestionListItem must remain:

* scannable,
* compact enough for lists,
* but not cramped.

Potential information hierarchy:

```text
Question Title
Context / topic where needed
Secondary metadata
Progress / status where relevant
```

The title should dominate.

## Do Not Default To

* large card,
* multiple colored badges,
* long description,
* several action buttons,
* hover lift,
* bright border.

A simple divided list row may often be better.

---

# 76. QuestionListItem Variants

Variants should be based on context.

Potentially:

```text
Default
Compact
Progress-Aware
Search Result
```

Do not create variants based purely on page-specific colors.

---

# 77. Question Progress

Progress state may communicate:

* not started,
* viewed,
* completed,
* practiced

if the product actually supports those distinctions.

Do not visually expose more states than the underlying data can reliably represent.

---

# 78. ContinuePreparation

A high-value dashboard or hub component.

It should answer:

* where was I?
* what should I do next?

Potential contents:

```text
Current preparation track
Current module
Next question or task
Progress context
Continue action
```

This should be one coherent continuation unit.

Not a collection of unrelated metrics.

---

# 79. PreparationProgress

Should summarize progress meaningfully.

Potential information:

* completion,
* current position,
* remaining work.

Avoid creating large analytics dashboards for simple progress.

---

# 80. CompanyPreparationItem

Represents a company preparation destination.

Potential information:

* company identity,
* relevant role or context,
* concise preparation description.

Company branding should not overwhelm the Interview Explainer design system.

---

# 81. RolePreparationItem

Represents a role-based preparation destination.

It should clearly communicate:

* role,
* relevant preparation scope,
* next action.

Avoid unnecessary decorative role icons.

---

# 82. Dashboard Component Philosophy

Dashboard components should be designed around decisions and continuation.

Not metrics for their own sake.

Every dashboard component should answer at least one of:

```text
What should I do next?
What changed?
Where am I?
What needs attention?
```

If a dashboard component answers none of these:

It may not deserve dashboard space.

---

# 83. Dashboard Section

A DashboardSection may contain:

* title,
* optional concise context,
* content,
* optional action.

It should not automatically be a card.

The page-level layout should determine grouping.

---

# 84. Metric Component

Use only when a number has meaningful decision value.

Examples may include:

* upcoming interviews,
* active applications,
* preparation completion.

Do not fill the dashboard with:

* total clicks,
* total pages viewed,
* meaningless streak numbers,
* vanity metrics

unless they genuinely help the user.

---

# 85. Empty State

A reusable EmptyState should support:

* title,
* concise explanation,
* optional primary action,
* optional small visual.

Variants may be based on context, not decorative color.

Examples:

```text
No saved questions yet.
No upcoming interviews.
No resume uploaded.
```

The message should explain the next useful action.

---

# 86. Error State

A reusable ErrorState should support severity and scope.

Potential contexts:

```text
Inline
Section
Page
```

The component should support:

* clear message,
* retry action where appropriate,
* fallback navigation where useful.

Do not display raw technical exceptions to users.

---

# 87. Loading State

Loading behavior should be defined by context.

Examples:

```text
Button
→ spinner

List
→ row skeletons

Question page
→ content skeleton

Dashboard
→ section skeletons
```

Avoid one universal loading screen.

---

# 88. Page Header Pattern

The PageHeader is a reusable pattern, not necessarily one primitive component for every page.

Potential contents:

* eyebrow or context where needed,
* title,
* concise description,
* primary action,
* optional secondary action.

The PageHeader should adapt to page purpose.

Do not force every page to include all slots.

---

# 89. Page Header Rules

A PageHeader should not automatically contain:

* breadcrumbs,
* title,
* description,
* five badges,
* three buttons,
* tabs,
* search,
* and statistics.

If the header becomes an entire dashboard:

The hierarchy should be reconsidered.

---

# 90. Filter Bar

Use when a collection genuinely benefits from filtering.

Potential contents:

* search,
* key filters,
* sort,
* active filter summary.

Do not expose every filter simultaneously.

Secondary filters may use progressive disclosure.

---

# 91. Sort Control

Sorting should use user-understandable options.

Examples:

```text
Recommended
Most Important
Newest
Alphabetical
```

Do not expose internal database ordering terminology.

---

# 92. Active Filter Display

If users can apply multiple filters:

They should understand what is active.

However, avoid generating a large row of colorful pills for every filter.

Compact removable filters may be appropriate.

---

# 93. Sticky Components

Sticky behavior should be rare and purposeful.

Potential appropriate uses:

* desktop local navigation,
* table of contents,
* critical session controls.

Avoid simultaneously making:

* global header,
* sidebar,
* table of contents,
* bottom action bar

all sticky.

Sticky UI consumes viewport space.

---

# 94. Sticky Header

If the global header is sticky:

Its height should remain restrained.

Consider whether it should:

* remain fully visible,
* reduce on scroll,
* or become static

based on actual user value.

Do not add complex scroll behavior without clear benefit.

---

# 95. Bottom Action Bar

Potentially useful on mobile for a truly primary action.

Examples:

* Continue,
* Submit Answer,
* Complete Session.

Do not use a permanent bottom bar for every page.

It reduces reading space.

---

# 96. Modal Confirmation Pattern

Destructive or consequential actions may require confirmation.

The confirmation should state:

* what will happen,
* whether it is reversible,
* the destructive action clearly.

Avoid vague dialogs such as:

```text
Are you sure?
```

without context.

---

# 97. Form Section Pattern

Long forms should be divided into meaningful sections.

Use:

* headings,
* descriptions,
* spacing,
* and occasional dividers.

Do not automatically wrap every form section in a separate card.

---

# 98. Form Error Summary

For large forms, a top-level error summary may be useful.

Inline errors should still appear near relevant fields.

The exact requirement depends on form complexity.

---

# 99. Component Composition Rules

Components should compose in predictable ways.

Example:

```text
PageContainer
    PageHeader
    Section
        QuestionList
            QuestionListItem
            QuestionListItem
```

Prefer this over:

```text
PageContainer
    Card
        Card
            Box
                Surface
                    QuestionCard
```

Every visual layer should have a reason.

---

# 100. Maximum Container Depth Principle

There is no universal numeric limit.

However, visible nested containers should trigger review.

If the user can clearly perceive:

```text
Page Surface
→ Section Card
→ Item Card
→ Inner Metadata Box
```

the design is likely over-containerized.

Prefer flattening.

---

# 101. Card Usage Decision

Before using a Card, ask:

1. Is this content an independent unit?
2. Does it need separation from neighboring content?
3. Does the whole unit have a shared interaction?
4. Would spacing or a divider solve the problem?
5. Will this become an endless stack of cards on mobile?

If a divider works:

Use the divider.

---

# 102. Badge Usage Decision

Before adding a Badge, ask:

1. Does this information need compact recognition?
2. Is it a state or category?
3. Does it help the user's current decision?
4. Would plain muted text be clearer?
5. Are there already too many badges nearby?

If plain text works:

Use plain text.

---

# 103. Icon Usage Decision

Before adding an icon, ask:

1. Does it improve recognition?
2. Is the concept visually familiar?
3. Does it save space?
4. Is the same concept already communicated by text?
5. Is the page becoming icon-heavy?

If the icon adds no meaning:

Remove it.

---

# 104. Tooltip Usage Decision

Before using a tooltip, ask:

1. Is the information supplemental?
2. Is it concise?
3. Can keyboard users access it?
4. Can touch users access the information?
5. Is the information too important to hide?

Critical information should remain visible.

---

# 105. Component Responsive Contract

Every reusable component should define:

* narrow-screen behavior,
* wrapping behavior,
* truncation behavior,
* overflow behavior,
* touch behavior.

A component is not complete if it only works at desktop width.

---

# 106. Text Overflow

Components must be tested with:

* long question titles,
* long company names,
* long technology names,
* long translated text if internationalization is introduced.

Do not assume labels fit on one line.

Use truncation only when the full content remains accessible.

---

# 107. Component Content Limits

Some components should define content expectations.

Example:

A badge should not contain a paragraph.

A toast should not contain an essay.

A PageHeader description should not become the entire page introduction.

Content constraints protect component integrity.

---

# 108. Accessibility Contract

Every interactive component must define:

* semantic HTML,
* keyboard interaction,
* focus behavior,
* accessible name,
* disabled behavior,
* screen-reader semantics where required.

Do not attempt to recreate complex accessible components from scratch unless necessary.

Well-maintained primitives may be used when appropriate.

---

# 109. Component Library Dependencies

External libraries may be used selectively.

Potential categories:

* accessible primitives,
* icons,
* syntax highlighting,
* toast behavior.

Dependencies should be evaluated for:

* accessibility,
* bundle impact,
* maintenance,
* customization,
* compatibility.

Do not install a large UI framework solely for one small component.

---

# 110. Shadcn-Style Ownership Principle

If V2 uses a system such as shadcn/ui:

The code should be treated as owned application code.

It must be adapted to:

* Interview Explainer tokens,
* density rules,
* accessibility requirements,
* and visual philosophy.

Do not treat default component styling as the product's final design.

A component generator is not a design system.

---

# 111. Radix-Style Primitive Principle

Accessible headless primitives may be useful for complex interactions such as:

* dialogs,
* dropdowns,
* popovers,
* tabs.

The product should still own:

* visual treatment,
* composition,
* and semantic usage.

---

# 112. Component Documentation

Every important component should eventually document:

```text
Purpose
When to Use
When Not to Use
Variants
States
Responsive Behavior
Accessibility
Examples
Known Constraints
```

This can exist in:

* Storybook,
* documentation pages,
* code comments,
* or another maintainable system.

The exact tooling is secondary.

The rules must be accessible to developers and AI agents.

---

# 113. Storybook Decision

Storybook may be valuable if:

* the component library becomes substantial,
* multiple developers work independently,
* visual regression becomes important,
* or isolated component review is needed.

It should not be introduced automatically if maintenance cost exceeds current value.

A simpler component showcase route may initially be sufficient.

Tooling should solve a current problem.

---

# 114. Visual Regression Testing

High-value shared components should eventually support visual regression testing.

Priority candidates:

```text
Global Header
Navigation
Button
Input
QuestionListItem
Question Page Layout
CodeBlock
Dialog
Mobile Navigation
```

A small visual regression suite around shared foundations can prevent widespread accidental drift.

---

# 115. Component Unit Testing

Prioritize behavior.

Examples:

* button loading prevents duplicate action,
* dialog traps focus correctly,
* dropdown supports keyboard navigation,
* search clear action works,
* pagination creates correct navigation.

Do not test implementation details that provide little confidence.

---

# 116. Component Integration Testing

Important patterns should be tested in realistic compositions.

Example:

```text
Question Page
+
Long Title
+
Code Block
+
Table
+
Sidebar
+
Mobile Width
```

Components that work independently may fail when composed.

---

# 117. Component Performance

Shared components appear frequently.

Small inefficiencies can multiply.

Avoid:

* unnecessary client components,
* unnecessary effects,
* heavy animation,
* oversized dependencies,
* rerenders caused by poor state boundaries.

A simple visual component should remain simple in runtime behavior.

---

# 118. Server and Client Component Boundaries

If the application uses a framework supporting server and client components:

Default to server-rendered components where interaction does not require client state.

Do not mark entire page trees as client-rendered because one child needs interaction.

Examples:

```text
Static Question Content
→ Server

Bookmark Button
→ Client

Search Interaction
→ Client where required
```

The exact implementation depends on the current repository architecture.

---

# 119. Component Data Responsibility

Presentation components should not unnecessarily own data fetching.

Prefer clear boundaries between:

* data retrieval,
* domain transformation,
* presentation.

However, do not create excessive abstraction merely to follow a theoretical architecture.

The goal is understandable ownership.

---

# 120. Domain Components Should Not Hardcode Entire Pages

A `QuestionListItem` should represent a question item.

It should not:

* fetch global user data,
* control page routing,
* own the entire progress system,
* and render unrelated recommendations.

Keep responsibilities coherent.

---

# 121. Page Archetypes Should Compose Components

Page systems should be assembled from:

* layout primitives,
* shared patterns,
* domain components.

Examples:

```text
Question Page
    GlobalHeader
    PageContainer
    Breadcrumbs
    QuestionHeader
    SplitLayout
        Prose
        TableOfContents
    PreviousNextNavigation
```

```text
Module Page
    GlobalHeader
    PageContainer
    Breadcrumbs
    PageHeader
    ModuleProgress
    QuestionList
        QuestionListItem
```

The exact composition may change during implementation.

The principle is systemic reuse.

---

# 122. The Question Page Must Remain Content-First

Question pages are particularly vulnerable to component overload.

Avoid surrounding the answer with:

* excessive cards,
* floating widgets,
* large metadata panels,
* multiple sticky elements,
* recommendation carousels,
* and repeated CTAs.

The primary composition should remain:

```text
Context
Question
Answer
Continuation
```

Everything else is secondary.

---

# 123. The Homepage May Use More Expressive Components

The homepage may appropriately use:

* stronger hero composition,
* discovery sections,
* selected feature presentation,
* brand expression.

However, homepage components should not automatically become templates for:

* question pages,
* dashboards,
* mock interviews.

Different jobs require different composition.

---

# 124. Dashboard Components Must Remain Action-Oriented

A dashboard component should not exist merely because data exists.

Examples:

Useful:

```text
Continue Java Backend Preparation
Upcoming Interview in 3 Days
Resume Needs Review
```

Potentially less useful:

```text
You have clicked 143 things.
```

Data should support action.

---

# 125. Mobile Component Transformation

Responsive behavior may change component form.

Examples:

```text
Desktop Sidebar
→ Mobile Drawer

Desktop Table of Contents
→ Collapsible Inline Navigation

Desktop Multi-Column Grid
→ List

Desktop Action Group
→ Wrapped or Prioritized Actions
```

Responsive transformation should preserve purpose.

It does not need to preserve exact visual form.

---

# 126. Component State Matrix

Important components should be reviewed across:

```text
Default
Hover
Focus
Active
Selected
Disabled
Loading
Error
Empty
```

Not every component uses every state.

The relevant states should be explicitly considered.

---

# 127. Theme Matrix

Important components must be reviewed in:

```text
Light
Dark
```

Do not assume semantic tokens automatically guarantee good results.

Visual review remains necessary.

---

# 128. Viewport Matrix

Important components should be reviewed at minimum in:

```text
Narrow Mobile
Large Mobile
Tablet
Laptop
Desktop
Large Desktop
```

Testing should focus on layout behavior.

Not merely screenshot collection.

---

# 129. Content Matrix

Components should be tested with:

```text
Short Content
Typical Content
Very Long Content
Empty Content
Missing Optional Data
Large Numbers
Code
Special Characters
```

Real systems rarely contain only ideal content.

---

# 130. Component Migration Strategy

Do not rewrite the entire interface at once.

Recommended sequence:

```text
1. Audit existing shared components.
2. Identify duplicated primitives.
3. Define V2 tokens.
4. Implement foundational primitives.
5. Implement layout primitives.
6. Implement global navigation.
7. Implement content primitives.
8. Implement QuestionListItem.
9. Migrate one representative page archetype.
10. Validate.
11. Refine components.
12. Expand archetype by archetype.
```

This prevents theoretical component design disconnected from actual pages.

---

# 131. Existing Components Must Be Classified

During repository audit, classify components as:

```text
Keep
Keep and Restyle
Refactor
Merge
Replace
Remove
Page-Specific
Unknown
```

Do not delete components merely because they predate V2.

Some may contain:

* useful behavior,
* accessibility work,
* or domain logic.

Visual redesign should not destroy working functionality.

---

# 132. Duplicate Component Audit

Search for repeated implementations of:

* buttons,
* cards,
* inputs,
* badges,
* modals,
* navigation,
* loading states,
* empty states.

Duplicates should be evaluated for consolidation.

Do not merge components that only look similar but have fundamentally different responsibilities.

---

# 133. CSS Duplication Audit

Repeated visual patterns may exist without shared components.

Search for recurring combinations of:

* padding,
* border,
* radius,
* background,
* shadow,
* typography.

These patterns may reveal:

* missing components,
* missing tokens,
* or widespread design drift.

---

# 134. Component Governance for AI Agents

AI coding agents must not independently invent new visual primitives whenever they encounter a design task.

Before creating a new component, the agent must:

```text
1. Search the existing component library.
2. Search for similar domain components.
3. Determine whether composition solves the requirement.
4. Determine whether a new variant is semantically justified.
5. Create a new component only if a recurring responsibility exists.
```

This rule is mandatory for V2 implementation.

---

# 135. AI Agent Prohibition

AI agents must not:

* create random gradient cards,
* introduce new color systems,
* add arbitrary shadows,
* create duplicate Button components,
* create page-specific modal systems,
* install new icon libraries without review,
* introduce a new UI framework for one feature,
* or bypass shared tokens with large arbitrary class sets.

The repository should become more coherent after every AI-assisted change.

Not less.

---

# 136. Component Change Impact

Before modifying a shared component:

Determine:

* where it is used,
* which variants are affected,
* whether mobile behavior changes,
* whether dark mode changes,
* whether accessibility changes,
* whether visual regression coverage exists.

A small shared-component change can affect hundreds of pages.

---

# 137. Breaking Component Changes

Breaking changes should be deliberate.

Examples:

* renamed variants,
* changed required props,
* changed interaction behavior,
* changed semantic element.

Migration should be coordinated.

Do not silently alter shared contracts during unrelated feature work.

---

# 138. Deprecated Components

When replacing a component:

* mark the old component as deprecated,
* migrate usages,
* remove it after migration.

Avoid keeping multiple generations indefinitely.

Example:

```text
OldCard
CardNew
NewCardV2
FinalCard
```

This is a sign of failed governance.

---

# 139. Component Acceptance Checklist

Before a shared component is considered complete:

```text
[ ] Clear responsibility
[ ] Semantic name
[ ] Uses design tokens
[ ] No unnecessary arbitrary values
[ ] Light mode reviewed
[ ] Dark mode reviewed
[ ] Mobile reviewed
[ ] Keyboard behavior reviewed
[ ] Focus state visible
[ ] Accessible name / semantics
[ ] Loading state considered where relevant
[ ] Error state considered where relevant
[ ] Long content tested
[ ] Usage guidance defined
[ ] Anti-patterns understood
```

---

# 140. Page Composition Acceptance Checklist

Before a page is considered complete:

```text
[ ] Uses shared layout primitives where appropriate
[ ] Uses shared controls
[ ] Does not invent a page-specific mini design system
[ ] Container nesting is justified
[ ] Primary action is visually clear
[ ] Badge count is controlled
[ ] Icon usage is meaningful
[ ] Mobile composition preserves priority
[ ] Loading state matches page structure
[ ] Empty state is useful
[ ] Error state is recoverable
[ ] Reading areas use appropriate width
[ ] Sticky elements are justified
```

---

# 141. Core V2 Component Set — Phase 1

The initial implementation should prioritize components required by the current product.

Likely Phase 1:

```text
FOUNDATION

Button
IconButton
Link
Input
SearchInput
Badge
Divider
Tooltip
Dialog / Sheet where already required
Skeleton

LAYOUT

PageContainer
ReadingContainer
Section
Stack
Inline
SplitLayout
SidebarLayout

NAVIGATION

GlobalHeader
DesktopNavigation
MobileNavigation
Breadcrumbs
SidebarNavigation
PreviousNextNavigation

CONTENT

Prose
CodeBlock
InlineCode
Callout
ContentTable
TableOfContents

DOMAIN

PreparationTrackItem
MajorAreaItem
ModuleItem
QuestionListItem
QuestionHeader
QuestionMetadata
RelatedContent
```

The exact list must be validated against the current repository.

---

# 142. Phase 2 Components

After current public preparation experiences stabilize:

```text
DashboardSection
ContinuePreparation
PreparationProgress
EmptyState
ErrorState
Toast
FilterBar
SearchResults
SearchResultItem
Pagination
```

Some may already be required earlier.

Implementation should follow actual dependency.

---

# 143. Future Product Components

Future systems may require:

```text
MockInterviewSetup
MockInterviewSessionControls
InterviewTranscript
InterviewFeedback
InterviewResultSummary

ResumeUploader
ResumeAnalysisSummary
ResumeIssue
ResumeRecommendation

JobItem
ApplicationStatus
JobPreparationConnection
InterviewWorkspaceSummary
```

These should not be implemented prematurely.

Their future existence should not distort current public content components.

---

# 144. Component Library Anti-Patterns

The following should trigger review:

* `Card` used as the answer to every layout problem,
* hundreds of arbitrary `className` overrides,
* multiple Button implementations,
* multiple modal libraries,
* icon libraries mixed without reason,
* page-specific colors bypassing tokens,
* domain logic inside generic primitives,
* generic components with 30 unrelated boolean props,
* components named after colors or visual appearance,
* deeply nested wrapper components,
* abstractions used only once with no meaningful responsibility,
* inaccessible custom controls replacing native behavior,
* desktop-only component APIs,
* and AI-generated duplicate primitives.

---

# 145. The Boolean Prop Explosion Rule

Avoid APIs such as:

```text
<Card
  blue
  elevated
  compact
  interactive
  bordered
  rounded
  gradient
  hoverable
  featured
/>
```

This creates unpredictable combinations.

Prefer:

* clear semantic variants,
* composition,
* or separate components when responsibilities genuinely differ.

---

# 146. The God Component Rule

A component should not attempt to support every possible page.

Warning signs:

* dozens of props,
* many unrelated variants,
* internal route checks,
* different markup for every page,
* complex conditional styling.

A component should solve one coherent responsibility.

---

# 147. The One-Off Component Rule

A one-off component may still be appropriate when:

* the structure is complex,
* the responsibility is meaningful,
* or isolating it improves page comprehension.

Reusability is not the only reason for componentization.

However:

Do not place one-off visual wrappers into the global component library.

Keep page-specific components close to their feature.

---

# 148. The Domain Boundary Rule

Generic UI belongs in shared UI layers.

Interview-specific concepts belong in domain layers.

Example:

```text
Button
→ shared UI

QuestionListItem
→ interview preparation domain

MockInterviewFeedback
→ mock interview domain
```

This prevents the shared component library from becoming a collection of every product feature.

---

# 149. The Default Composition Principle

When building a new page:

Start with:

```text
PageContainer
Typography
Spacing
Semantic HTML
```

Then add components only where they solve real recurring responsibilities.

Do not begin with:

```text
Which cards should we use?
```

The page is not a card collection.

---

# 150. Final Component Library Principle

Interview Explainer V2 should not feel consistent because every page uses the same card.

It should feel consistent because:

* typography behaves consistently,
* spacing behaves consistently,
* actions behave consistently,
* navigation behaves consistently,
* states behave consistently,
* and the same product concepts are represented predictably.

The permanent component principles are:

> **Components exist to remove repeated decisions.**

> **Primitives encode behavior and accessibility.**

> **Patterns encode recurring interface responsibilities.**

> **Domain components encode product meaning.**

> **Cards are optional.**

> **Badges are secondary.**

> **Icons require purpose.**

> **Variants require semantic meaning.**

> **Responsive behavior is part of the component contract.**

> **Accessibility is part of the component contract.**

> **AI agents must reuse before inventing.**

> **Every new component increases the system's maintenance cost.**

The goal is not to build the largest component library.

The goal is to build the smallest coherent component system capable of supporting Interview Explainer as it grows.
