# Interview Explainer V2 — Page Archetypes

**Document:** `08_PAGE_ARCHETYPES.md`
**Status:** Foundational / Page Architecture
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md`, `01_PRODUCT_PHILOSOPHY.md`, `02_AI_CONSTITUTION.md`, `03_USER_PSYCHOLOGY.md`, `04_UX_PRINCIPLES.md`, `05_INFORMATION_ARCHITECTURE.md`, `06_DESIGN_SYSTEM.md`, `07_COMPONENT_LIBRARY.md`
**Purpose:** Define the structural architecture, information priority, layout behavior, content hierarchy, responsive transformation, SEO responsibilities, and anti-patterns for the major page types of Interview Explainer V2.

---

# 1. Purpose of This Document

A design system defines visual laws.

A component library defines reusable building blocks.

Neither automatically creates good pages.

A page can use:

* correct colors,
* correct typography,
* correct buttons,
* correct cards,
* correct spacing,

and still fail because:

* too much information is visible,
* the primary task is unclear,
* the page hierarchy is weak,
* secondary content competes with primary content,
* mobile becomes an endless stack,
* SEO content overwhelms users,
* or every available component is displayed simultaneously.

Therefore, V2 requires explicit page archetypes.

A page archetype defines:

* why the page exists,
* what the user is trying to accomplish,
* what information is primary,
* what information is secondary,
* what should not appear,
* what the desktop structure should be,
* how the page transforms on mobile,
* and what SEO responsibility the page carries.

The central principle is:

> **Every page should have one dominant job.**

---

# 2. Page Archetypes Are Not Templates

An archetype is not a rigid visual template.

It defines:

* purpose,
* hierarchy,
* information priorities,
* structural relationships,
* and constraints.

Different pages within the same archetype may contain different content.

However, they should behave predictably.

For example:

Two question pages may have:

* different answer lengths,
* different code examples,
* different related questions.

But both should preserve:

```text
Context
→ Question
→ Answer
→ Continuation
```

The archetype protects the user's mental model.

---

# 3. The Major V2 Page Archetypes

The initial V2 system should recognize at least:

```text
1. Homepage
2. Discovery / Directory Page
3. Preparation Track Hub
4. Major Area / Pillar Page
5. Module Page
6. Question Page
7. Company Preparation Page
8. Role Preparation Page
9. Search Experience
10. Authentication Page
11. Dashboard
12. Utility / Legal Page
13. Error / Not Found Page
```

Future product areas may introduce:

```text
14. Mock Interview Setup
15. Mock Interview Session
16. Mock Interview Result
17. Resume Analysis Workspace
18. Job Discovery
19. Job Detail
20. Application Workspace
21. Interview Workspace
```

Future archetypes should follow the same architectural principles.

---

# 4. The Page Priority Model

Every page should classify visible information into four levels.

## Level 1 — Primary

The reason the page exists.

Examples:

* answer on a question page,
* preparation structure on a track page,
* continuation on a dashboard.

## Level 2 — Supporting

Information directly helping the primary task.

Examples:

* breadcrumbs,
* progress,
* table of contents,
* filters.

## Level 3 — Contextual

Useful but not required for the immediate task.

Examples:

* related questions,
* secondary recommendations,
* supplementary metadata.

## Level 4 — Peripheral

Global or low-priority information.

Examples:

* footer,
* promotional content,
* broad discovery links.

The visual hierarchy must reflect these levels.

Level 4 must never visually compete with Level 1.

---

# 5. The One Dominant Region Rule

At normal desktop width, the user should be able to identify the primary region immediately.

Examples:

```text
Question Page
→ Answer content

Track Hub
→ Preparation structure

Search
→ Search results

Dashboard
→ Next action / continuation
```

If two or three large regions compete equally:

The page hierarchy needs review.

---

# 6. Page Density Should Follow Intent

Different page types require different density.

```text
Homepage
→ Moderate

Directory
→ Moderate to efficient

Track Hub
→ Structured

Major Area
→ Structured

Module
→ Efficient but readable

Question
→ Comfortable

Search
→ Efficient

Dashboard
→ Structured and action-oriented

Mock Interview Session
→ Minimal
```

Do not apply one universal density to every page.

---

# 7. Global Page Shell

Most pages may share:

```text
Global Header
Main Content
Footer
```

Authenticated application areas may eventually use a different shell.

However, the shell should not force:

* the same sidebar,
* the same maximum width,
* or the same page header

onto every archetype.

The shell provides global consistency.

The archetype controls local structure.

---

# 8. Global Header Responsibility

The global header should provide access to major product destinations.

It should not attempt to expose the entire information architecture.

Potential responsibilities:

```text
Brand
Primary Product Navigation
Search Access
Authentication / Account
Theme Control if retained
```

Avoid:

* giant permanent navigation menus,
* excessive top-level links,
* multiple competing CTAs,
* technology lists directly in the header.

---

# 9. Footer Responsibility

The footer should support:

* trust,
* secondary navigation,
* legal information,
* selected discovery,
* company information.

It should not become:

* a giant SEO keyword directory,
* a duplicate sitemap,
* or the largest content region on the page.

Footer links should be intentional.

---

# 10. Archetype 1 — Homepage

## Primary Job

Help a new or returning visitor understand:

```text
What Interview Explainer is
Who it is for
What they can do next
```

The homepage should not attempt to display the entire product.

---

# 11. Homepage User Questions

The page should quickly answer:

```text
What is this?
Can it help me?
What can I prepare for?
Where should I start?
Why should I trust it?
```

The homepage should not require users to understand the full taxonomy before taking action.

---

# 12. Homepage Information Priority

Recommended hierarchy:

```text
1. Clear Product Promise
2. Primary Starting Action
3. Major Preparation Paths
4. Product Value / How It Helps
5. Selected Trust Signals
6. Secondary Discovery
7. Footer
```

Not every possible section must exist.

The homepage should remain edited.

---

# 13. Homepage Hero

The hero should communicate:

* what the product does,
* who it helps,
* the primary next action.

Potential structure:

```text
Clear Headline

Concise Supporting Statement

Primary CTA
Secondary Discovery Action

Optional restrained visual context
```

Avoid:

* vague AI language,
* multiple paragraphs,
* four primary CTAs,
* large metric dashboards,
* decorative complexity that pushes useful content below the fold.

---

# 14. Homepage Preparation Discovery

The homepage may introduce major preparation paths.

Examples:

```text
Software Engineering
Data & Analytics
Management Consulting
Company Preparation
```

The exact taxonomy must align with the information architecture.

Do not expose hundreds of modules on the homepage.

The homepage introduces.

Dedicated pages organize.

---

# 15. Homepage Cards

If cards are used:

They should represent genuinely distinct destinations.

Avoid:

* nested cards,
* every feature in a card,
* every statistic in a card,
* every link in a card.

A combination of:

* sections,
* lists,
* selective cards

will usually produce better hierarchy.

---

# 16. Homepage SEO Responsibility

The homepage should target the broad identity and purpose of Interview Explainer.

It should not attempt to rank for every:

* Java question,
* company,
* interview role,
* technology,
* or topic.

Those intents belong to dedicated pages.

The homepage should support:

* brand understanding,
* broad interview preparation intent,
* internal discovery.

---

# 17. Homepage Mobile Transformation

On mobile:

* hero remains concise,
* primary action remains obvious,
* discovery sections simplify,
* multi-column layouts become intentional sequences,
* decorative content may reduce,
* navigation remains accessible.

Avoid turning every desktop grid into an endless card stack.

---

# 18. Homepage Anti-Patterns

Do not:

* display all technologies,
* show every product feature,
* use multiple competing gradients,
* place a dashboard on the homepage,
* show excessive statistics,
* create ten equal sections,
* overload the hero,
* or make the page longer merely for SEO.

---

# 19. Archetype 2 — Discovery / Directory Page

## Primary Job

Help users find the correct preparation destination.

Examples:

```text
All Technologies
All Roles
All Companies
All Preparation Tracks
Topic Directory
```

The directory is a navigation product.

Not merely a list of links.

---

# 20. Directory User Questions

The page should answer:

```text
What options exist?
Which one is relevant to me?
How are they organized?
How can I find a specific one?
```

---

# 21. Directory Information Priority

Recommended:

```text
1. Page Identity
2. Search / Primary Discovery Control
3. High-Level Categories
4. Organized Destinations
5. Secondary Context
```

Avoid leading with long SEO text before the directory.

---

# 22. Directory Layout

Possible structure:

```text
Breadcrumbs

Page Header

Search / Filter if justified

Category Navigation

Structured Destination List

Optional Supporting Content
```

The destination collection may use:

* grouped lists,
* selective cards,
* alphabetical indexes,
* filters.

The correct choice depends on collection size.

---

# 23. Directory Search

For large directories:

Search may be highly valuable.

Examples:

```text
Search technologies
Search companies
Search roles
```

Search should narrow discovery.

It should not create a second unrelated global search system.

---

# 24. Directory Filters

Use only filters that meaningfully reduce ambiguity.

Examples may include:

```text
Domain
Role Type
Experience Level
Industry
```

Do not expose every possible metadata dimension.

---

# 25. Directory SEO Responsibility

Directory pages may target broad category intent.

Examples:

```text
Software engineering interview preparation
Java interview topics
Company interview preparation
```

They should also provide strong internal linking.

However:

The page should remain useful to humans.

Do not generate giant keyword lists without navigational value.

---

# 26. Directory Mobile Transformation

On mobile:

* search remains accessible,
* filters may collapse,
* categories become vertically structured,
* large grids may become grouped lists.

Avoid tiny multi-column card grids.

---

# 27. Directory Anti-Patterns

Do not:

* show hundreds of identical cards,
* create a giant unstructured link wall,
* use colorful logos as the primary organizational system,
* expose unnecessary filters,
* hide important destinations behind excessive interactions.

---

# 28. Archetype 3 — Preparation Track Hub

## Primary Job

Orient the user within a complete preparation journey.

Examples:

```text
Java Backend Interview Preparation
Data Analyst Interview Preparation
Management Consulting Interview Preparation
```

This page answers:

> What does preparation for this target actually contain?

---

# 29. Track Hub User Questions

The page should answer:

```text
What will I prepare?
How is it structured?
Where should I start?
How much is there?
What should I do next?
```

For returning users:

```text
Where did I stop?
```

---

# 30. Track Hub Information Priority

Recommended:

```text
1. Track Identity
2. Start / Continue Action
3. Preparation Structure
4. Progress if available
5. Supporting Guidance
6. Related Destinations
```

The structure itself is primary.

---

# 31. Track Hub Header

Potential contents:

```text
Breadcrumbs

Track Title

Concise Description

Primary Action:
Start Preparation
or
Continue Preparation

Optional compact progress
```

Avoid:

* giant hero illustration,
* excessive badges,
* large statistics dashboard,
* long introductory essay before the structure.

---

# 32. Track Structure

A track may contain:

```text
Major Areas / Pillars
    ↓
Modules
        ↓
Questions
```

The hub should expose enough structure for orientation.

It should not necessarily display every question.

For very large tracks:

Progressive disclosure is essential.

---

# 33. Track Major Areas

Major areas should communicate:

* title,
* purpose,
* scope,
* progress where available.

Examples:

```text
Core Java
Concurrency
Spring Framework
Spring Boot
Databases
Microservices
```

The exact taxonomy depends on the track.

Major areas should not look identical to individual questions.

---

# 34. Track Progress

Progress should remain supportive.

Potentially:

```text
42 of 320 questions completed
Current module: Java Collections
```

Avoid large analytics visualizations.

The primary question remains:

> What should I do next?

---

# 35. Track Hub SEO Responsibility

A track hub is a major SEO landing page.

It may target:

```text
Java backend interview preparation
Data analyst interview questions and preparation
Management consulting interview preparation
```

The page should provide:

* clear topical structure,
* descriptive context,
* crawlable links to major areas and modules,
* useful unique content.

Do not hide the entire structure behind client-only interactions.

---

# 36. Track Hub Mobile Transformation

On mobile:

* track identity remains concise,
* start/continue remains clear,
* major areas become a structured list,
* progress remains compact,
* deeply nested structure should not all expand simultaneously.

---

# 37. Track Hub Anti-Patterns

Do not:

* show every question on the hub,
* display all metadata simultaneously,
* use one colorful card per module if hundreds exist,
* make progress visually larger than preparation content,
* place SEO paragraphs before the primary structure.

---

# 38. Archetype 4 — Major Area / Pillar Page

## Primary Job

Organize a substantial subject area into understandable modules.

Example:

```text
Java Backend
→ Concurrency
```

This page sits between:

```text
Track
and
Module
```

when the taxonomy requires that level.

---

# 39. Major Area User Questions

The page should answer:

```text
What does this area contain?
Why does it matter?
Which modules should I prepare?
Where should I continue?
```

---

# 40. Major Area Information Priority

Recommended:

```text
1. Area Identity
2. Current / Next Action
3. Module Structure
4. Progress
5. Supporting Context
6. Related Areas
```

---

# 41. Major Area Layout

Potential structure:

```text
Breadcrumbs

Page Header

Compact Preparation Context

Module List

Optional Progress Context

Optional Related Area Navigation
```

The module list should dominate.

---

# 42. Major Area Introductory Content

A concise introduction may explain:

* what the area covers,
* why interviewers ask about it,
* how modules are organized.

Avoid a long essay before users can access modules.

Long supporting SEO content may appear later if genuinely useful.

---

# 43. Major Area Module List

Modules should be easy to scan.

Potential information:

```text
Module Title
Concise Scope
Question Count
Progress if available
```

Avoid:

* large decorative icons,
* several badges,
* long descriptions,
* multiple buttons per module.

---

# 44. Major Area SEO Responsibility

The page may target a broad topical cluster.

Example:

```text
Java concurrency interview questions
```

It should establish semantic relationships between:

* parent track,
* modules,
* questions.

Strong internal linking is essential.

---

# 45. Major Area Mobile Transformation

Modules should become a clean vertical sequence.

Avoid:

* nested accordions several levels deep,
* excessive card stacking,
* permanent sidebars.

---

# 46. Archetype 5 — Module Page

## Primary Job

Help users work through a coherent set of interview questions.

This is one of the highest-frequency content navigation pages.

---

# 47. Module User Questions

The page should answer:

```text
What questions are in this module?
Which ones matter most?
What have I completed?
What should I open next?
```

---

# 48. Module Information Priority

Recommended:

```text
1. Module Identity
2. Question List
3. Progress / Current Position
4. Supporting Module Context
5. Adjacent Modules
```

The question list is primary.

---

# 49. Module Header

Potential contents:

```text
Breadcrumbs

Module Title

Concise Description

Compact Progress
```

Avoid a large hero.

Users arrived to access questions.

---

# 50. Question List Architecture

The question list should be:

* scannable,
* readable,
* efficient,
* stable.

A recommended conceptual hierarchy:

```text
Question Number or Position

Question Title

Optional essential metadata

Progress state where available
```

The title should dominate.

---

# 51. Question List Density

The list may use standard or moderately compact density.

However:

Do not reduce readability to fit more questions.

Avoid:

* large card per question,
* long descriptions,
* multiple badges,
* multiple buttons.

For large modules:

A divided list is likely superior.

---

# 52. Question Grouping

If the module contains meaningful subgroups:

Use:

* section headings,
* grouped lists,
* or progressive disclosure where appropriate.

Do not create artificial groups merely to add visual variety.

---

# 53. Module Filters

Most modules should not require complex filtering.

Potentially useful:

```text
All
Not Started
Completed
```

Only if user progress exists and the volume justifies it.

Do not introduce filters before they solve a real problem.

---

# 54. Module SEO Responsibility

Module pages are important topical cluster pages.

They should:

* contain unique contextual information,
* expose crawlable question links,
* clearly connect to parent and adjacent structures,
* avoid duplicate thin introductions.

The question list itself provides valuable topical context.

---

# 55. Module Mobile Transformation

The question list should remain readable.

Potentially:

```text
Question title
Secondary metadata below
Compact status indicator
```

Avoid horizontal compression.

---

# 56. Module Anti-Patterns

Do not:

* create one giant card per question,
* use colorful difficulty pills everywhere,
* place unrelated recommendations before the question list,
* hide the question list behind tabs,
* create unnecessary charts.

---

# 57. Archetype 6 — Question Page

## Primary Job

Help the user understand and prepare one interview question.

This is the most important reading archetype in the current product.

The answer is the product.

Everything else must support it.

---

# 58. Question Page User Questions

The page should answer:

```text
What is the question?
What is the answer?
Why does it matter?
How should I explain it in an interview?
What should I study next?
```

Not every question requires every section.

---

# 59. Question Page Information Priority

Recommended:

```text
1. Question
2. Answer
3. Supporting Explanation / Examples
4. Navigation / Continuation
5. Contextual Metadata
6. Related Content
```

The answer must dominate visually and structurally.

---

# 60. Question Page Structure

Conceptual structure:

```text
Breadcrumbs

Question Header

Main Reading Area
    Answer Content

Optional Contextual Navigation
    Table of Contents
    Local Module Context

Previous / Next

Related Content

Footer
```

The exact layout depends on answer length.

---

# 61. Question Header

The header should include only essential information.

Potential:

```text
Question Title

Optional:
Difficulty
Topic
Question Type
```

Do not place excessive controls around the title.

Avoid:

* giant colored hero,
* company logo wall,
* several badges,
* multiple sharing buttons,
* progress dashboard.

---

# 62. Question Answer Width

Long-form answer content must use a controlled reading width.

The answer should not stretch across the entire desktop viewport.

If a secondary sidebar exists:

The main reading column should remain comfortable.

---

# 63. Question Page Sidebar

A desktop sidebar is optional.

It should exist only if it provides persistent value.

Potential uses:

```text
Table of Contents
Current Module Context
Compact Progress
```

Do not place all of these simultaneously unless the page genuinely benefits.

The sidebar should remain visually quiet.

---

# 64. Question Page Table of Contents

Use for sufficiently long, structured answers.

Do not generate a TOC for:

* short answers,
* shallow structure,
* or pages with only two small sections.

On mobile:

It may become:

* collapsible,
* inline,
* or omitted.

---

# 65. Question Page Metadata

Metadata should remain secondary.

Potentially useful:

```text
Difficulty
Topic
Experience relevance
```

Only if the information is reliable and useful.

Avoid decorative metadata accumulation.

---

# 66. Question Page Answer Structure

Answer content may include:

```text
Direct Answer
Explanation
Example
Code
Comparison
Common Mistakes
Interview Framing
Follow-Up Questions
```

However:

The content structure should depend on the question.

Do not force every answer into the same oversized template.

---

# 67. Question Page Directness

The answer should begin with useful substance.

Avoid:

* long generic introductions,
* repeating the question unnecessarily,
* excessive framing before answering.

The user should receive value quickly.

---

# 68. Question Page Code

Code should remain readable and integrated with explanation.

Avoid:

* giant code blocks without context,
* unnecessary examples,
* decorative code tabs with one example,
* code that overwhelms conceptual explanation.

---

# 69. Question Page Related Content

Related content should support learning continuity.

Potentially:

```text
Prerequisite
Next Concept
Common Comparison
Related Question
```

Limit quantity.

Avoid a giant recommendation grid immediately after the answer.

---

# 70. Previous / Next Navigation

Sequential navigation is highly valuable.

Where meaningful:

Show destination names.

Example:

```text
Previous
HashMap Internal Working

Next
ConcurrentHashMap
```

This supports intentional continuation.

---

# 71. Question Page SEO Responsibility

Each indexable question page should:

* satisfy a distinct search intent,
* have a unique canonical URL,
* use meaningful title and heading structure,
* provide substantive content,
* link to parent topical structures,
* support related internal navigation.

Do not create indexable question pages with:

* duplicate answers,
* near-empty content,
* generated boilerplate,
* or no distinct intent.

---

# 72. Question Page Structured Data

Structured data should be implemented only when:

* technically valid,
* aligned with actual page content,
* compliant with current search engine requirements.

Do not add schema merely because a page contains a question.

Structured data is not a substitute for content quality or crawlability.

---

# 73. Question Page Mobile Transformation

On mobile:

```text
Breadcrumbs simplify

Question remains prominent

Metadata reduces

Answer uses full available readable width

Sidebar becomes inline / collapsible / removed

Code scrolls safely

Previous / Next remains usable
```

Do not place permanent side panels on narrow screens.

---

# 74. Question Page Anti-Patterns

Do not:

* use full-width prose,
* surround every answer section with cards,
* show too many sticky elements,
* place recommendations before the answer,
* use giant hero sections,
* overload metadata,
* create excessive colored callouts,
* make body text too small,
* interrupt reading with repeated CTAs.

---

# 75. Archetype 7 — Company Preparation Page

## Primary Job

Help users understand how to prepare for interviews at a specific company.

Examples:

```text
Google Interview Preparation
Amazon Interview Preparation
McKinsey Interview Preparation
```

The structure may vary significantly by company type.

---

# 76. Company Page User Questions

The page should answer:

```text
What roles can I prepare for?
What is the interview process?
What topics matter?
What questions or preparation paths are relevant?
Where should I start?
```

Only include information the product can support reliably.

---

# 77. Company Page Information Priority

Recommended:

```text
1. Company Preparation Identity
2. Relevant Roles / Preparation Paths
3. Interview Process Context
4. Relevant Topics / Questions
5. Supporting Guidance
```

The page should not become a generic company profile.

Interview preparation remains the purpose.

---

# 78. Company Branding

Company logos and brand colors may support recognition.

They should not override the Interview Explainer design system.

Avoid:

* redesigning the entire page around company colors,
* large decorative logo heroes,
* excessive brand imitation.

---

# 79. Company Page Freshness

Company interview processes can change.

Content that may become outdated should:

* have clear ownership,
* be reviewed,
* avoid unsupported certainty.

The system should distinguish:

* stable preparation guidance,
* time-sensitive process claims.

---

# 80. Company Page SEO Responsibility

Company pages may target:

```text
Company interview preparation
Company interview questions
Company role interview preparation
```

Avoid creating thousands of thin company pages merely for search coverage.

A company page should exist when it provides distinct value.

---

# 81. Company Page Mobile Transformation

Prioritize:

* company identity,
* preparation paths,
* process context.

Avoid stacking many promotional-style company cards.

---

# 82. Archetype 8 — Role Preparation Page

## Primary Job

Help users prepare for a specific role across relevant skills and interview formats.

Examples:

```text
Java Backend Developer
Data Analyst
Management Consultant
DevOps Engineer
```

---

# 83. Role Page User Questions

The page should answer:

```text
What do interviews for this role test?
What should I prepare?
How is preparation structured?
What should I start with?
```

---

# 84. Role Page Information Priority

Recommended:

```text
1. Role Identity
2. Preparation Structure
3. Core Skills / Areas
4. Start / Continue
5. Company-Specific Paths where relevant
```

Avoid turning the role page into a generic career description.

---

# 85. Role Page SEO Responsibility

Role pages may target broad role-specific preparation intent.

They should connect:

```text
Role
→ Skills
→ Tracks
→ Modules
→ Questions
→ Companies
```

without duplicating every underlying page.

---

# 86. Archetype 9 — Search Experience

## Primary Job

Help the user reach the most relevant content quickly.

Search is not merely a page.

It is a retrieval experience.

---

# 87. Search User Questions

The search experience should answer:

```text
Did you understand what I searched?
What are the best matching results?
What type of result is this?
How can I refine the search?
```

---

# 88. Search Result Hierarchy

Each result may communicate:

```text
Title
Result Type
Context
Relevant snippet where useful
```

Example:

```text
How does ConcurrentHashMap work?

Question
Java Backend → Concurrency
```

Avoid displaying every metadata field.

---

# 89. Search Result Types

Potential result types:

```text
Question
Module
Major Area
Preparation Track
Company
Role
```

Future:

```text
Mock Interview
Job
Resource
```

Result types should remain understandable.

---

# 90. Search Ranking

Search ranking should prioritize:

* relevance,
* intent match,
* useful destination quality.

Do not prioritize pages merely because they are popular if they are less relevant.

---

# 91. Search Filters

Filters may include:

```text
Content Type
Technology / Domain
Role
Company
```

Only expose filters justified by result volume.

---

# 92. Search Empty State

A no-result state should help the user recover.

Potential actions:

* suggest broader terms,
* correct obvious query issues,
* provide relevant categories.

Avoid:

```text
No results.
```

with no guidance.

---

# 93. Search SEO Responsibility

Internal search result pages generally require careful indexing decisions.

Do not automatically index arbitrary search URLs.

Search pages can create:

* duplicate content,
* crawl traps,
* infinite parameter combinations.

Indexing policy must be explicitly defined in the SEO architecture.

---

# 94. Search Mobile Transformation

Search should remain:

* prominent,
* fast,
* readable.

Filters may move into a sheet or collapsible control.

Results should remain simple.

---

# 95. Archetype 10 — Authentication Page

## Primary Job

Allow the user to:

* sign in,
* register,
* recover access,

with minimal friction.

---

# 96. Authentication Layout

Keep the page focused.

Potential structure:

```text
Brand Context

Authentication Form

Alternative Authentication Method

Necessary Legal / Support Links
```

Avoid:

* full dashboard navigation,
* excessive promotional content,
* distracting feature grids.

---

# 97. Authentication Errors

Errors should be:

* clear,
* specific where safe,
* actionable.

Do not expose technical implementation details.

---

# 98. Authentication Mobile Behavior

Forms should:

* use appropriate input types,
* support password managers,
* avoid viewport issues,
* provide sufficient touch targets.

---

# 99. Archetype 11 — Dashboard

## Primary Job

Help the user decide what to do next.

The dashboard is not a metric museum.

---

# 100. Dashboard User Questions

The dashboard should answer:

```text
What should I continue?
What needs my attention?
What is coming next?
How am I progressing?
```

Future:

```text
What interviews are upcoming?
What applications changed?
What should I prepare for today?
```

---

# 101. Dashboard Information Priority

Recommended:

```text
1. Primary Next Action
2. Active Preparation
3. Time-Sensitive Items
4. Meaningful Progress
5. Secondary Tools
```

The exact structure depends on available product features.

---

# 102. Dashboard First Region

The first region should usually answer:

> What should I do now?

Examples:

```text
Continue Java Backend Preparation

Resume your Mock Interview Practice

Prepare for Upcoming Interview
```

Avoid beginning with:

* total question count,
* generic greeting,
* decorative statistics.

---

# 103. Dashboard Metrics

Only display metrics with user value.

Useful examples may include:

```text
Preparation completion
Upcoming interviews
Applications needing action
```

Avoid vanity metrics.

---

# 104. Dashboard Personalization

Personalization should improve prioritization.

It should not create unpredictable layout chaos.

The system should preserve a stable mental model while adapting content.

---

# 105. Dashboard Empty State

A new user dashboard should not appear broken or empty.

It should help users start.

Potential:

```text
Choose a preparation path
Start a mock interview
Upload a resume
```

Do not show eight empty dashboard widgets.

---

# 106. Dashboard Mobile Transformation

On mobile:

* next action remains first,
* time-sensitive items remain visible,
* secondary metrics reduce,
* complex multi-column layouts simplify.

Avoid creating an endless feed of equal cards.

---

# 107. Dashboard SEO Responsibility

Authenticated dashboards should generally not be public search landing pages.

They require appropriate:

* authentication,
* indexing controls,
* privacy protection.

---

# 108. Archetype 12 — Utility / Legal Page

Examples:

```text
About
Contact
Privacy
Terms
Cookie Policy
Accessibility
```

These pages should prioritize:

* readability,
* trust,
* clarity.

Do not over-design legal content.

---

# 109. Legal Page Width

Long legal text should use controlled reading width.

Navigation may include:

* table of contents for long documents,
* clear section headings.

---

# 110. Archetype 13 — Error / Not Found Page

## Primary Job

Help the user recover.

A 404 page should answer:

```text
What happened?
What can I do next?
```

Potential actions:

* search,
* go to preparation hub,
* return home.

Avoid excessive jokes that obscure recovery.

---

# 111. Future Archetype — Mock Interview Setup

## Primary Job

Configure an interview session without overwhelming the user.

Potential sequence:

```text
Choose Interview Type
Choose Role / Domain
Choose Difficulty / Context
Review
Start
```

The setup should avoid exposing every possible option simultaneously.

---

# 112. Future Archetype — Mock Interview Session

## Primary Job

Conduct the interview.

This should be one of the lowest-distraction interfaces in the product.

Potential structure:

```text
Session Context

Current Question

Response Area / Conversation

Minimal Session Controls
```

Avoid:

* global discovery distractions,
* large sidebars,
* unrelated recommendations,
* dashboard widgets.

---

# 113. Mock Interview Session Density

The session should feel focused.

Persistent elements should be limited to what helps:

* current question,
* session status,
* response controls,
* exit / pause where applicable.

---

# 114. Future Archetype — Mock Interview Result

## Primary Job

Help the user understand performance and improve.

Recommended hierarchy:

```text
Overall Summary
Key Strengths
Highest-Priority Improvements
Question-Level Feedback
Recommended Next Actions
```

Avoid beginning with a giant score if the score lacks actionable meaning.

---

# 115. Future Archetype — Resume Analysis Workspace

## Primary Job

Help users understand and improve their resume.

Potential hierarchy:

```text
Resume Context

High-Priority Issues

Section Analysis

Recommendations

Revised Content / Actions
```

Avoid presenting dozens of equal-severity issues.

Prioritization is essential.

---

# 116. Future Archetype — Job Discovery

## Primary Job

Help users find relevant opportunities.

This requires:

* search,
* filters,
* result quality,
* clear job context.

Avoid copying generic job-board density without considering Interview Explainer's preparation advantage.

---

# 117. Future Archetype — Job Detail

## Primary Job

Help the user evaluate the opportunity and prepare to act.

Potential structure:

```text
Job Identity
Company / Role
Key Requirements
Application Action
Preparation Connection
```

The unique product advantage may be connecting:

```text
Job
→ Resume
→ Preparation
→ Interview
```

---

# 118. Future Archetype — Application Workspace

## Primary Job

Help users manage one job opportunity through the process.

Potential:

```text
Application Status
Important Dates
Documents
Preparation
Interview Events
Notes
```

This should be a workflow.

Not merely a large detail page.

---

# 119. Future Archetype — Interview Workspace

## Primary Job

Create one preparation center for a real upcoming interview.

Potentially:

```text
Interview Date
Company
Role
Preparation Plan
Relevant Questions
Mock Interviews
Resume Context
Notes
```

This may become one of the product's most valuable integrated experiences.

---

# 120. Page Archetype and SEO Intent Must Align

A page should exist because:

* users need it,
* search users may need it,
* or the product workflow requires it.

Do not create pages solely because a keyword can be generated.

Each public indexable page should have:

```text
Distinct Intent
Distinct Value
Clear Parent Context
Useful Internal Links
Canonical URL
Appropriate Metadata
```

---

# 121. The Thin Page Rule

Do not index pages that provide little distinct value.

Potential thin-page risks:

```text
Empty modules
Companies with no meaningful preparation content
Generated tag combinations
Search filter combinations
Duplicate question variants
Pagination with little unique value
```

Indexing quantity is not the objective.

Useful search coverage is.

---

# 122. The Duplicate Intent Rule

Two pages should not compete for the same search intent without a clear reason.

Example risk:

```text
/java-interview-questions

/java/questions

/interview/java

/topics/java-interview
```

If all serve the same purpose:

The architecture should consolidate them.

---

# 123. The Parent-Child Linking Rule

Every deep content page should have clear structural relationships.

Example:

```text
Java Backend
    ↓
Concurrency
    ↓
Concurrent Collections
    ↓
How does ConcurrentHashMap work?
```

Links should allow users and crawlers to understand this hierarchy.

---

# 124. The Orphan Page Rule

No important indexable page should exist without meaningful internal links.

Every page should be reachable through logical navigation.

Do not depend solely on:

* XML sitemap,
* search,
* or direct URL access.

---

# 125. Breadcrumb Rule

Breadcrumbs should reflect the primary hierarchy.

They should not include every possible taxonomy relationship.

Example:

```text
Home
→ Java Backend
→ Concurrency
→ ConcurrentHashMap
```

The canonical hierarchy should be stable.

---

# 126. Canonical Page Responsibility

Each archetype should have predictable canonical behavior.

Examples:

```text
Question
→ canonical question URL

Module
→ canonical module URL

Search query
→ likely non-indexed unless explicitly curated

Filter combinations
→ generally require controlled indexing policy
```

Canonical behavior must be implemented systematically.

---

# 127. URL Design Principle

URLs should be:

* stable,
* understandable,
* canonical,
* aligned with hierarchy where useful.

Avoid changing URLs merely for visual redesign.

If URL changes are necessary:

Redirect strategy is mandatory.

---

# 128. V1 to V2 URL Preservation

The UI overhaul must not casually break existing indexed URLs.

Before route changes:

```text
1. Inventory existing URLs.
2. Identify indexed URLs.
3. Identify traffic-bearing URLs.
4. Map old to new.
5. Add permanent redirects where needed.
6. Update internal links.
7. Update sitemap.
8. Validate canonical tags.
```

Visual redesign and SEO migration must be coordinated.

---

# 129. Above-the-Fold Principle

The first viewport should help users understand:

```text
Where am I?
What can I do?
What is the primary content?
```

Do not optimize solely for fitting maximum content above the fold.

Clarity is more important than density.

---

# 130. SEO Content Placement

SEO-supporting content should be integrated into the page hierarchy.

Do not create:

```text
Primary Product Experience

then

3,000 words of unrelated SEO text
```

Supporting content should:

* answer real questions,
* deepen the topic,
* support discovery,
* and remain useful.

---

# 131. Page Length Is Not a Quality Metric

A longer page is not automatically:

* more useful,
* more authoritative,
* or better for SEO.

A page should be as long as necessary to satisfy its purpose.

No longer.

---

# 132. The Secondary Content Limit

Every page should limit how many secondary systems appear simultaneously.

Examples:

```text
Related Content
Popular Content
Recommended Content
Recently Viewed
Trending Content
More From This Topic
```

Showing all of these creates recommendation clutter.

Select the most useful continuation mechanism.

---

# 133. Recommendation Placement

Recommendations should usually appear after the primary task.

Exceptions may exist where recommendations are the task itself.

On a question page:

Answer first.

On a directory page:

Discovery is primary.

Context determines placement.

---

# 134. Sidebar Decision Framework

Before adding a sidebar:

Ask:

```text
Does the information need persistent visibility?

Will users frequently interact with it?

Does it justify consuming horizontal space?

Does it remain useful throughout the page?
```

If not:

Keep it in the main flow.

---

# 135. Two-Column Decision Framework

Use two columns when:

* both regions have sustained value,
* the secondary region benefits from persistence,
* the main region remains comfortably wide.

Do not use two columns merely because desktop screens are wide.

---

# 136. Three-Column Warning

Three-column layouts should be rare.

Potential risks:

* narrow reading width,
* excessive simultaneous information,
* difficult responsive behavior.

A layout such as:

```text
Navigation
Content
Related Content
```

should be used only with strong justification.

---

# 137. Mobile Priority Rule

When desktop regions collapse:

Do not preserve desktop order automatically.

Mobile order should follow user priority.

Example:

```text
Desktop:
Sidebar | Main Content

Mobile:
Main Content
Then Optional Sidebar Content
```

The primary task remains first.

---

# 138. Mobile Removal Rule

Some secondary desktop content may be:

* collapsed,
* moved,
* simplified,
* or removed

on mobile.

Responsive design does not require displaying everything everywhere.

---

# 139. Mobile Sticky UI Rule

Sticky mobile UI should be highly controlled.

Every sticky element reduces usable screen space.

Avoid stacking:

```text
Sticky Header
+
Sticky Filter Bar
+
Sticky Bottom CTA
```

unless the workflow absolutely requires it.

---

# 140. Loading State by Archetype

Each archetype should have loading behavior matching its structure.

Examples:

```text
Homepage
→ selective section skeletons

Module
→ question row skeletons

Question
→ heading + prose skeleton

Dashboard
→ priority section skeletons

Search
→ result skeletons
```

Do not use one universal full-page spinner.

---

# 141. Empty State by Archetype

Empty states should reflect page purpose.

Examples:

```text
Module with no questions
→ content/configuration issue

Dashboard with no activity
→ onboarding opportunity

Search with no results
→ recovery opportunity

Saved questions with none saved
→ discovery opportunity
```

The same empty-state message should not be reused everywhere.

---

# 142. Error State by Archetype

Errors should preserve user context.

Example:

If related questions fail to load:

Do not replace the entire question page with an error.

Fail the secondary region independently.

The scope of the error should match the scope of failure.

---

# 143. Page Performance Priority

Performance priorities differ by archetype.

## Question Pages

Prioritize:

* content delivery,
* text rendering,
* code rendering.

## Search

Prioritize:

* interaction responsiveness,
* result delivery.

## Dashboard

Prioritize:

* primary actionable content,
* progressive secondary loading.

## Homepage

Prioritize:

* fast meaningful paint,
* controlled media.

---

# 144. Page JavaScript Budget Principle

Public content pages should not require excessive client-side JavaScript merely to display:

* headings,
* answers,
* lists,
* navigation.

Interactive features should hydrate only where necessary.

The page architecture should support:

* crawlability,
* performance,
* resilience.

---

# 145. Page Accessibility Responsibilities

Every archetype must support:

* logical heading order,
* landmark structure,
* keyboard navigation,
* visible focus,
* meaningful link text,
* sufficient contrast,
* zoom,
* responsive reflow.

The page architecture itself affects accessibility.

Accessibility is not only a component-level concern.

---

# 146. Page Heading Rule

Each page should have a clear primary heading.

Avoid:

* multiple competing H1s,
* missing H1,
* headings selected only for visual size.

Heading structure should reflect content hierarchy.

---

# 147. Main Landmark Rule

The primary page content should be represented semantically.

Navigation, main content, complementary content, and footer should use appropriate landmarks.

This improves:

* accessibility,
* document understanding,
* maintainability.

---

# 148. Page Analytics Responsibility

Analytics should measure meaningful behavior by archetype.

Examples:

## Homepage

```text
Primary CTA usage
Preparation discovery
Search usage
```

## Track Hub

```text
Start / Continue
Major area selection
```

## Module

```text
Question opens
Continuation
```

## Question

```text
Reading engagement
Next question
Related content usage
```

Do not track every click merely because it is possible.

---

# 149. Page Success Metrics

Each archetype should define success differently.

Examples:

```text
Homepage
→ user reaches relevant preparation

Track Hub
→ user starts or continues

Module
→ user opens and progresses through questions

Question
→ user consumes answer and continues

Search
→ user reaches relevant destination

Dashboard
→ user acts on priority
```

A universal page metric is insufficient.

---

# 150. Page Archetype Governance for AI Agents

Before modifying a page, an AI coding agent must identify:

```text
1. Which archetype is this page?
2. What is the primary user job?
3. What is the dominant region?
4. Which information is secondary?
5. Which existing components should be used?
6. What is the mobile transformation?
7. What SEO responsibilities apply?
```

The agent must not begin by asking:

```text
How can I make this page look more modern?
```

It should begin with:

```text
What is this page supposed to help the user do?
```

---

# 151. AI Agent Page Prohibitions

AI agents must not:

* add sections merely to make a page look complete,
* add cards to fill whitespace,
* create arbitrary sidebars,
* add recommendation carousels without purpose,
* add large hero sections to deep content pages,
* expose every metadata field,
* add SEO text blocks without user value,
* change URLs without migration planning,
* or redesign page structure without identifying the archetype.

---

# 152. Archetype Validation Questions

For every page:

```text
Can a user identify the page purpose in seconds?

Is the primary content visually dominant?

Is secondary content truly secondary?

Is the page using the correct content width?

Are there unnecessary containers?

Are there too many competing actions?

Does mobile preserve the primary task?

Is the page indexable only if it provides distinct value?

Are internal links structurally meaningful?

Does the page have a clear next action?
```

---

# 153. Homepage Acceptance Criteria

```text
[ ] Product purpose is immediately understandable
[ ] Primary action is clear
[ ] Major preparation paths are discoverable
[ ] Homepage does not expose the full taxonomy
[ ] Visual expression does not overwhelm clarity
[ ] Mobile hierarchy remains concise
[ ] SEO content does not dominate
```

---

# 154. Track Hub Acceptance Criteria

```text
[ ] Track identity is clear
[ ] Start / Continue is obvious
[ ] Preparation structure dominates
[ ] Major areas are understandable
[ ] Progress remains supportive
[ ] Entire question inventory is not dumped onto the page
[ ] Parent and child links are crawlable
```

---

# 155. Major Area Acceptance Criteria

```text
[ ] Area purpose is clear
[ ] Module structure dominates
[ ] Introductory content remains concise
[ ] Modules are easy to scan
[ ] Mobile does not become excessive card stacking
```

---

# 156. Module Acceptance Criteria

```text
[ ] Question list is primary
[ ] Question titles are highly scannable
[ ] Metadata is controlled
[ ] List density remains readable
[ ] Progress is useful but secondary
[ ] Question links are crawlable
```

---

# 157. Question Page Acceptance Criteria

```text
[ ] Question is immediately visible
[ ] Answer begins without unnecessary delay
[ ] Reading width is controlled
[ ] Typography supports long sessions
[ ] Sidebar is justified if present
[ ] Metadata remains secondary
[ ] Code is readable
[ ] Related content appears after primary content
[ ] Previous / Next supports continuation
[ ] Mobile reading remains comfortable
[ ] Page satisfies a distinct search intent
```

---

# 158. Search Acceptance Criteria

```text
[ ] Search intent is clear
[ ] Results communicate type and context
[ ] Ranking prioritizes relevance
[ ] Filters exist only where useful
[ ] Empty states support recovery
[ ] Arbitrary query pages do not create uncontrolled indexation
```

---

# 159. Dashboard Acceptance Criteria

```text
[ ] Next action is clear
[ ] Time-sensitive information is prioritized
[ ] Metrics are meaningful
[ ] Empty state supports onboarding
[ ] Mobile prioritization is preserved
[ ] Dashboard is not publicly indexable
```

---

# 160. Final Page Archetype Principle

Interview Explainer V2 should not be a collection of individually designed pages.

It should be a coherent system of page types.

Each page must know:

* why it exists,
* what the user came to do,
* what information matters most,
* what should remain secondary,
* how it behaves on mobile,
* and what role it plays in the broader product and search architecture.

The permanent page architecture principles are:

> **One page, one dominant job.**

> **Primary content must dominate.**

> **Secondary content must earn its space.**

> **Deep pages become quieter, not louder.**

> **Question pages are reading environments.**

> **Module pages are navigation environments.**

> **Track hubs are orientation environments.**

> **Directories are discovery environments.**

> **Dashboards are decision environments.**

> **Mock interviews are focus environments.**

> **Mobile preserves priority, not desktop geometry.**

> **SEO follows useful page architecture.**

> **Not every possible page deserves to exist or be indexed.**

> **A page should be as complex as its task requires—and no more.**

The objective is not visual uniformity.

The objective is predictable clarity.

A user should always understand:

> **Where am I?**

> **What can I do here?**

> **What matters most?**

> **Where do I go next?**
