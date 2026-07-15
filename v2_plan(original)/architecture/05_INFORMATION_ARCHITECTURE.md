# Interview Explainer V2 — Information Architecture

**Document:** `05_INFORMATION_ARCHITECTURE.md`
**Status:** Foundational / Architectural
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md`, `01_PRODUCT_PHILOSOPHY.md`, `02_AI_CONSTITUTION.md`, `03_USER_PSYCHOLOGY.md`, `04_UX_PRINCIPLES.md`
**Purpose:** Define how Interview Explainer's product areas, preparation domains, roles, technologies, companies, content, practice systems, user data, and future capabilities relate to one another from the perspectives of users, URLs, navigation, search engines, and engineering systems.

---

# 1. Purpose of This Document

Interview Explainer is expected to grow substantially.

The platform may eventually contain:

* thousands of interview questions,
* multiple technologies,
* multiple professional domains,
* role-specific preparation,
* company-specific preparation,
* practice systems,
* mock interviews,
* real interview support,
* resume analysis,
* job discovery,
* application tracking,
* personalized dashboards,
* daily preparation,
* progress systems,
* and user-specific career data.

Without a deliberate information architecture, growth will create:

* confusing navigation,
* duplicated pages,
* inconsistent terminology,
* unclear URLs,
* SEO cannibalization,
* disconnected features,
* difficult search,
* and engineering complexity.

The purpose of information architecture is not merely to organize files.

It is to define:

> **What exists, how concepts relate, what users should understand, how users move between them, and how machines identify those relationships.**

The architecture must work simultaneously for:

* first-time users,
* returning users,
* search visitors,
* experienced candidates,
* mobile users,
* search engines,
* AI systems,
* and future product development.

---

# 2. The Fundamental Architecture Principle

> **The product should feel simpler than the system beneath it.**

Interview Explainer may internally require sophisticated models.

Users should not be required to understand that sophistication.

The internal system may contain:

* domain,
* track,
* pillar,
* module,
* topic,
* question,
* competency,
* company mapping,
* role mapping,
* difficulty,
* priority,
* and relationships.

The user interface should expose only the concepts required for the current task.

The internal data hierarchy is not automatically the user-facing navigation hierarchy.

The database structure is not automatically the URL structure.

The URL structure is not automatically the visible breadcrumb structure.

These systems should align where useful.

They do not need to be identical.

---

# 3. Architecture Has Five Layers

Interview Explainer should distinguish five related but different architectures.

## 3.1 Product Architecture

What major capabilities exist?

Examples:

* Prepare,
* Practice,
* Mock Interviews,
* Resume,
* Jobs,
* Dashboard.

## 3.2 Knowledge Architecture

How is interview knowledge organized?

Examples:

* domain,
* role,
* technology,
* subject,
* module,
* question.

## 3.3 Navigation Architecture

How do users move through the product?

Examples:

* global navigation,
* local navigation,
* search,
* breadcrumbs,
* contextual links.

## 3.4 URL Architecture

How are meaningful public and private destinations represented on the web?

## 3.5 Data Architecture

How are entities represented internally?

These layers must cooperate.

They must not be treated as the same thing.

---

# 4. The Product Architecture

The long-term Interview Explainer product should be understood as a career preparation ecosystem.

A conceptual model is:

```text
Interview Explainer

├── Prepare
│   ├── Technical Preparation
│   ├── Role-Based Preparation
│   ├── Company Preparation
│   └── Other Interview Domains
│
├── Practice
│   ├── Question Practice
│   ├── Revision
│   ├── Quizzes / Assessments
│   └── Daily Practice
│
├── Mock Interviews
│   ├── AI Mock Interviews
│   ├── Role-Based Mocks
│   ├── Company-Oriented Mocks
│   └── Interview History
│
├── Interview Workspace
│   ├── Upcoming Interviews
│   ├── Interview Preparation Plans
│   ├── Notes
│   ├── Interview Rounds
│   └── Outcomes
│
├── Resume
│   ├── Resume Analysis
│   ├── Resume Improvement
│   ├── Role Matching
│   └── Resume Versions
│
├── Jobs
│   ├── Job Discovery
│   ├── Saved Jobs
│   ├── Applications
│   └── Job Tracking
│
└── Dashboard
    ├── Continue
    ├── Current Goals
    ├── Progress
    ├── Upcoming Interviews
    ├── Recent Activity
    └── Recommended Next Actions
```

This is a conceptual architecture.

It does not mean all capabilities must exist immediately.

It does not mean every item belongs in global navigation.

It defines how future capabilities can fit into one coherent product.

---

# 5. The Current V2 Scope Must Remain Honest

V2 must distinguish between:

## Existing

Capabilities that currently work.

## Planned

Capabilities approved for implementation.

## Future

Capabilities that belong to the long-term product direction but are not currently available.

Future architecture should influence extensibility.

It should not create:

* empty navigation,
* placeholder pages,
* fake functionality,
* or premature complexity.

The product must not advertise unfinished architecture as existing functionality.

---

# 6. The Primary User-Facing Product Model

As the product grows, users should primarily understand Interview Explainer through a small number of major jobs.

A likely long-term model is:

1. **Prepare**
2. **Practice**
3. **Mock Interviews**
4. **Resume**
5. **Jobs**
6. **Dashboard / My Preparation**

These are user jobs.

They are more understandable than internal implementation categories.

However, global navigation must reflect actual product maturity.

If only some areas are ready, only ready areas should receive primary prominence.

---

# 7. Global Navigation Must Not Mirror the Database

The global navigation should not contain:

* every technology,
* every domain,
* every company,
* every role,
* every module,
* every content type.

Global navigation exists for major product destinations.

A mature global navigation may conceptually support:

```text
Prepare
Practice
Mock Interviews
Resume
Jobs
Search
Account
```

The exact labels must be validated against actual product capabilities and terminology.

The global navigation should remain relatively stable as content volume grows.

Adding 10,000 questions should not require expanding the global navigation.

---

# 8. Dashboard Is a Personal Surface

The dashboard is not another content category.

It is a user-specific orientation surface.

Its purpose is to aggregate relevant information from other systems.

Conceptually:

```text
Dashboard

├── Continue Preparation
├── Current Goal
├── Recent Activity
├── Progress
├── Saved Items
├── Upcoming Interviews
├── Resume Activity
├── Job Activity
└── Recommended Next Action
```

The dashboard should not own the underlying content.

It should reference and summarize other product systems.

This prevents duplicated logic.

---

# 9. Prepare Is the Knowledge Entry Point

The **Prepare** area should organize structured interview knowledge.

It may eventually include multiple preparation entry models:

```text
Prepare

├── By Domain
├── By Role
├── By Technology
├── By Company
└── By Goal
```

These are different lenses over related knowledge.

They should not automatically create separate duplicated copies of the same content.

For example:

A Java concurrency question may be relevant to:

* Java Backend,
* Backend Engineer,
* Senior Java Developer,
* Amazon preparation,
* concurrency,
* and a specific mock interview.

The question should remain one canonical content entity.

Different preparation paths may reference it.

---

# 10. Content Must Be Entity-Based, Not Page-Duplicated

A core architectural principle is:

> **One concept should have one canonical content identity whenever practical.**

Avoid creating separate duplicated answers such as:

```text
/java/hashmap
/amazon/hashmap
/backend/hashmap
/senior-java/hashmap
```

if all four pages contain essentially the same answer.

Instead:

```text
Canonical Question Entity
        │
        ├── belongs to Java preparation
        ├── relevant to backend roles
        ├── relevant to selected companies
        └── appears in selected preparation paths
```

This reduces:

* content duplication,
* SEO cannibalization,
* inconsistent updates,
* maintenance cost,
* and user confusion.

Company and role pages should contextualize and curate canonical content rather than duplicate it unnecessarily.

---

# 11. The Knowledge Model

Interview Explainer needs a flexible knowledge model capable of supporting different interview domains.

A conceptual model is:

```text
Domain
    │
    ├── Preparation Track / Subject
    │       │
    │       ├── Major Area
    │       │       │
    │       │       ├── Module / Topic Group
    │       │       │       │
    │       │       │       └── Question
```

However, not every domain must use the same visible terminology.

The system may internally normalize relationships.

The user-facing structure may vary.

---

# 12. Domain

A **Domain** represents a broad professional preparation family.

Examples may include:

```text
Software Engineering
Data & Analytics
Management Consulting
Product Management
```

A domain should be broad enough to contain multiple preparation paths.

Domains are relatively stable.

They should not be created for every technology.

Java is not necessarily a domain.

Software Engineering may be the domain.

Java Backend may be a preparation track or subject within that domain.

---

# 13. Preparation Track

A **Preparation Track** represents a coherent preparation journey.

Examples:

```text
Java Backend
Data Analyst
Management Consulting
Frontend Engineering
DevOps
```

A track may combine:

* knowledge,
* skills,
* question sets,
* practice,
* and future recommendations.

The track is likely to be one of the most useful user-facing concepts.

A user can reasonably understand:

> I am preparing for Java Backend interviews.

This is more meaningful than requiring the user to think in internal content taxonomy.

---

# 14. Role

A **Role** represents a job target.

Examples:

```text
Backend Engineer
Java Developer
Data Analyst
Management Consultant
DevOps Engineer
```

A role may reference multiple preparation tracks or competencies.

Roles and preparation tracks may overlap.

They are not automatically the same entity.

For example:

```text
Role: Backend Engineer

Relevant preparation:
- Java Backend
- System Design
- Databases
- Distributed Systems
- Behavioral Interviews
```

The architecture should preserve this distinction.

---

# 15. Technology

A **Technology** represents a specific technology, language, framework, tool, or platform.

Examples:

```text
Java
Spring Boot
SQL
Docker
Kubernetes
Python
```

Technology pages may serve as:

* discovery surfaces,
* preparation hubs,
* or contextual indexes.

A technology is not automatically a preparation track.

For example:

Java is a technology.

Java Backend may be a preparation track.

---

# 16. Skill or Competency

A **Skill** or **Competency** represents a capability that may cross content hierarchies.

Examples:

```text
Concurrency
API Design
SQL Querying
Case Structuring
Communication
System Design
```

Competencies are useful for:

* recommendations,
* assessments,
* progress,
* mock interviews,
* and cross-domain relationships.

They may not always require dedicated public pages.

The data model should not force every internal entity to become an indexable URL.

---

# 17. Pillar

Interview Explainer currently uses large pillar structures in some preparation tracks.

For example:

```text
Java Backend
    ├── Pillar 1
    ├── Pillar 2
    ├── ...
    └── Pillar 18
```

A pillar can remain a useful internal and editorial organization concept.

However:

> **The existence of pillars internally does not require users to learn the word "pillar."**

A pillar may be presented to users as:

* major area,
* section,
* subject,
* or another domain-appropriate term.

The terminology should be determined by user comprehension.

---

# 18. Module

A **Module** groups closely related questions or concepts.

Example:

```text
Java Backend
    └── Concurrency
            └── Concurrent Collections
                    ├── ConcurrentHashMap
                    ├── CopyOnWriteArrayList
                    └── BlockingQueue
```

Modules are useful for:

* local navigation,
* progress,
* structured preparation,
* and editorial organization.

However, module depth should remain controlled.

The user should not navigate through six pages of taxonomy before reaching useful content.

---

# 19. Topic

The term **Topic** should be used carefully.

If modules and topics represent the same user-facing concept, one should be removed from the visible terminology.

The architecture should avoid requiring users to distinguish between:

* category,
* pillar,
* section,
* module,
* topic,
* unit,

unless those distinctions provide genuine value.

Internal richness should not become vocabulary burden.

---

# 20. Question

A **Question** is one of the core knowledge entities.

A question may contain:

* question title,
* canonical slug,
* answer,
* structured sections,
* examples,
* code,
* metadata,
* relationships,
* preparation mappings,
* difficulty,
* priority,
* revision information,
* and future practice data.

A question should have a stable canonical identity.

It may appear in many contexts.

Its canonical content should not be unnecessarily duplicated.

---

# 21. Question Identity Must Be Stable

A question's identity should not depend entirely on where the user found it.

For example:

```text
Question:
How does ConcurrentHashMap work internally?

Relationships:
- Java
- Java Backend
- Concurrency
- Concurrent Collections
- Backend Engineer
- Senior Java Developer
- selected companies
```

The question remains the same entity.

This enables:

* stable URLs,
* consistent updates,
* bookmarks,
* progress,
* search,
* related questions,
* and analytics.

---

# 22. Content Relationships Should Form a Graph

The content system should not be limited to a strict tree.

A strict tree is useful for primary organization.

Real interview knowledge is often a graph.

Example:

```text
ConcurrentHashMap

Primary hierarchy:
Java Backend
→ Concurrency
→ Concurrent Collections

Also related to:
- Thread Safety
- HashMap
- Synchronization
- Locks
- Performance
- Backend Engineering
```

Therefore, the architecture should distinguish:

## Primary Parentage

Used for:

* canonical hierarchy,
* breadcrumbs,
* primary navigation.

## Secondary Relationships

Used for:

* related content,
* recommendations,
* search,
* company mappings,
* role mappings.

This avoids forcing every relationship into the URL hierarchy.

---

# 23. Every Entity Does Not Need a Public Page

The data model may contain entities that exist only to organize or connect information.

An entity should receive a public page when the page provides meaningful standalone value.

Do not create indexable pages automatically for every:

* tag,
* metadata value,
* internal category,
* filter combination,
* relationship,
* or database record.

This is critical for:

* UX quality,
* crawl efficiency,
* SEO quality,
* and maintenance.

---

# 24. Page Creation Requires Standalone Value

Before creating a public page, ask:

1. Does this entity represent a meaningful user intent?
2. Can the page provide unique value?
3. Does the page have enough useful content?
4. Is it distinct from existing pages?
5. Should users navigate directly to it?
6. Should users bookmark or share it?
7. Should search engines index it?

If the answers are weak, the entity may not need a public page.

---

# 25. Page Archetypes

Interview Explainer V2 should define a finite set of page archetypes.

Potential public archetypes include:

```text
Homepage
Preparation Directory
Domain Hub
Preparation Track Hub
Role Page
Technology Page
Major Area Page
Module Page
Question Page
Company Page
Company Preparation Page
Search Results
Pricing
About / Trust / Policy Pages
```

Potential authenticated archetypes include:

```text
Dashboard
Progress
Bookmarks
Practice
Mock Interview Setup
Mock Interview Session
Mock Interview Result
Interview Workspace
Resume Workspace
Resume Analysis
Job Discovery
Saved Jobs
Application Tracker
Account Settings
```

A large site should still be built from a manageable number of page systems.

---

# 26. Page Archetypes Are More Important Than Page Count

Interview Explainer may eventually contain tens of thousands of URLs.

Engineering should not think:

> We have 20,000 unique pages.

It should think:

> We have 12 page archetypes generating 20,000 destinations.

This allows systemic improvements.

If question pages have a problem, fix the question-page system.

If company pages have a problem, fix the company-page system.

Do not manually patch individual pages unless the issue is genuinely content-specific.

---

# 27. The Homepage

The homepage is the broadest public entry point.

Its information architecture should answer:

* What is Interview Explainer?
* What can I prepare for?
* How do I find something specific?
* Where should I begin?

The homepage should not attempt to expose the entire taxonomy.

It should route users into:

* search,
* major preparation areas,
* and high-value product capabilities.

---

# 28. Preparation Directory

A preparation directory may provide structured exploration across available preparation areas.

Conceptually:

```text
Prepare

├── Software Engineering
│   ├── Java Backend
│   ├── Frontend
│   ├── DevOps
│   └── ...
│
├── Data & Analytics
│   ├── Data Analyst
│   └── ...
│
└── Management & Consulting
    ├── Management Consulting
    └── ...
```

This page should prioritize comprehensibility.

It should not become a flat list of every available topic.

---

# 29. Domain Hub

A domain hub represents a broad preparation family.

Example:

```text
Software Engineering
```

It may help users discover:

* roles,
* tracks,
* technologies,
* and relevant preparation types.

A domain hub should provide meaningful orientation.

It should not exist merely to add another URL level.

---

# 30. Preparation Track Hub

A preparation track hub is a major structured preparation destination.

Example:

```text
Java Backend Interview Preparation
```

It may contain:

* track overview,
* major areas,
* recommended structure,
* progress for authenticated users,
* search within the track,
* and a sensible starting point.

This page should organize complexity.

It should not simply dump thousands of questions.

---

# 31. Major Area Page

A major area page represents a substantial section within a preparation track.

Example:

```text
Java Backend
→ Concurrency
```

It may contain:

* area context,
* modules,
* preparation importance,
* progress,
* and related areas.

The exact user-facing term should follow domain language.

---

# 32. Module Page

A module page represents a focused group of related questions.

Example:

```text
Java Backend
→ Concurrency
→ Concurrent Collections
```

Its primary job is selection and progression.

It may contain:

* module context,
* question list,
* completion state,
* priority or difficulty where useful,
* previous/next module navigation.

It should not repeat the entire track interface.

---

# 33. Question Page

A question page is a canonical knowledge destination.

It should have:

* stable identity,
* stable canonical URL,
* clear primary hierarchy,
* meaningful content,
* useful internal relationships,
* and appropriate search metadata.

A question may appear in multiple preparation contexts.

The canonical question page should remain singular unless distinct search intent genuinely requires separate content.

---

# 34. Role Page

A role page represents preparation around a job target.

Example:

```text
Backend Engineer Interview Preparation
```

A role page may combine:

* relevant preparation tracks,
* competencies,
* question collections,
* practice,
* and company relevance.

It should not duplicate every underlying answer.

It should curate and contextualize.

---

# 35. Technology Page

A technology page represents preparation related to a specific technology.

Example:

```text
Spring Boot Interview Preparation
```

It may provide:

* overview,
* relevant modules,
* canonical questions,
* related technologies,
* and preparation paths.

A technology page should provide unique organizational value.

It should not simply duplicate a preparation-track page under another URL.

---

# 36. Company Architecture

Company preparation is a distinct lens over existing knowledge.

Conceptually:

```text
Company

├── Company Overview for Interview Preparation
├── Relevant Roles
├── Interview Process
├── Common Preparation Areas
├── Company-Relevant Questions
├── Experience-Based Insights
└── Future Mock / Practice Options
```

Company pages should not automatically duplicate canonical answers.

Instead:

```text
Company Page
      │
      ├── references canonical questions
      ├── references preparation tracks
      ├── references roles
      └── adds company-specific context
```

Company-specific claims must be evidence-aware and maintained carefully.

---

# 37. Company Pages and Company Preparation Pages

Depending on future scale, the architecture may distinguish:

## Company Entity Page

General company interview context.

## Company + Role Preparation Page

Example:

```text
Amazon Backend Engineer Interview Preparation
```

Such pages should exist only when they provide meaningful unique value.

Do not generate every possible:

```text
Company × Role × Technology × Difficulty
```

combination.

Programmatic page generation must follow genuine user intent and content quality.

---

# 38. Practice Is Different From Reading

Preparation content answers:

> What should I understand?

Practice answers:

> Can I recall, apply, or demonstrate it?

Practice should reference the same underlying knowledge entities where appropriate.

Conceptually:

```text
Question Entity
    │
    ├── Read / Learn
    ├── Revise
    ├── Quiz
    ├── Practice
    └── Mock Interview Usage
```

This prevents content and practice from becoming disconnected systems.

---

# 39. Practice Architecture

Potential practice modes may include:

```text
Practice

├── Quick Revision
├── Topic Practice
├── Mixed Practice
├── Saved Questions
├── Weak Areas
├── Daily Practice
└── Assessments
```

Not all modes need to exist immediately.

Practice should be structured around user intent.

It should not become another duplicate content library.

---

# 40. Daily Preparation Is a Delivery Layer

"Daily" should not become an independent content universe.

Daily preparation should select from existing:

* questions,
* revision items,
* practice,
* goals,
* and preparation plans.

Conceptually:

```text
Existing Knowledge + User Context
              │
              ▼
       Daily Preparation
```

This avoids duplicating content specifically for daily pages.

---

# 41. Mock Interviews Are Session-Based Experiences

Mock interviews are fundamentally different from content browsing.

They involve:

* setup,
* session,
* interaction,
* evaluation,
* results,
* and history.

Conceptually:

```text
Mock Interviews

├── Configure
│   ├── Role
│   ├── Domain
│   ├── Experience
│   ├── Interview Type
│   └── Optional Company Context
│
├── Session
│
├── Evaluation
│
└── History
```

The session interface should be highly focused.

It should not inherit the full visual density of content browsing.

---

# 42. Mock Interviews Should Reuse the Knowledge Graph

Where appropriate, mock interviews should understand:

* roles,
* technologies,
* competencies,
* questions,
* and user preparation history.

This enables future systems such as:

```text
User is preparing for:
Backend Engineer

Weak competency:
Concurrency

Upcoming interview:
Company X

Mock interview:
Backend + Concurrency emphasis
```

The architecture should make this possible without hardcoding each combination.

---

# 43. Real Interview Workspace

A future real-interview workspace may help users manage actual interview processes.

Conceptually:

```text
Interview Workspace

├── Company
├── Role
├── Interview Date
├── Rounds
├── Preparation Plan
├── Notes
├── Related Questions
├── Mock Interviews
└── Outcome
```

This is a personal workflow.

It should reference public preparation systems rather than duplicate them.

---

# 44. Resume Architecture

Resume functionality should be treated as a user-specific workspace.

Conceptually:

```text
Resume

├── Resume Documents
├── Resume Versions
├── Analysis
├── Suggestions
├── Role Matching
└── Application Usage
```

Resume analysis should connect where useful to:

* roles,
* skills,
* jobs,
* and preparation recommendations.

The architecture should avoid creating separate isolated profile systems for each feature.

---

# 45. Jobs Architecture

Jobs may eventually include:

```text
Jobs

├── Discover
├── Search
├── Saved
├── Applications
├── Interviews
└── Outcomes
```

The job system should connect logically to:

```text
Job
  │
  ├── Role
  ├── Company
  ├── Required Skills
  ├── Resume
  ├── Application
  └── Preparation
```

This creates a coherent career journey.

However, V2 should not prematurely build a complex universal career graph unless required.

The architecture should support future connections without overengineering the present.

---

# 46. User Data Architecture

User-specific data may eventually include:

```text
User

├── Profile
├── Goals
├── Preparation Tracks
├── Progress
├── Bookmarks
├── History
├── Practice Results
├── Mock Interviews
├── Real Interviews
├── Resumes
├── Saved Jobs
├── Applications
└── Preferences
```

These systems should use a coherent identity model.

Avoid separate disconnected user-state implementations for every feature.

---

# 47. Progress Must Reference Stable Entities

Progress should attach to stable content or preparation entities.

Examples:

```text
User completed Question X.
User completed Module Y.
User is 60% through Preparation Path Z.
```

Progress should not depend on:

* temporary list position,
* current UI ordering,
* or unstable URLs.

Stable IDs are essential.

---

# 48. Bookmarks Must Reference Canonical Entities

A bookmark should reference the underlying entity.

Not merely:

* the current rendered URL,
* page title text,
* or a copied content snapshot.

This allows bookmarks to survive:

* presentation changes,
* navigation changes,
* and appropriate URL migrations.

---

# 49. Search Must Be Cross-Architecture

Search should eventually be capable of finding across relevant entity types.

Conceptually:

```text
Search

├── Questions
├── Technologies
├── Roles
├── Preparation Tracks
├── Companies
├── Modules
└── Product Destinations
```

Search results should clearly communicate result type and context.

The user should not need to know which internal database table contains the answer.

---

# 50. Search Is Not the Same as Navigation

Navigation helps users explore known structures.

Search helps users express direct intent.

Both are required.

Do not force users to browse six levels when they know the exact topic.

Do not force users to search when they do not know what exists.

---

# 51. Canonical Hierarchy and Discovery Relationships

Each public content entity should have a primary canonical hierarchy.

Example:

```text
Java Backend
→ Concurrency
→ Concurrent Collections
→ ConcurrentHashMap
```

The same entity may also be discoverable from:

```text
Backend Engineer
Spring / Java Ecosystem
Company Preparation
Search
Related Questions
Bookmarks
Dashboard
```

These secondary paths do not require separate canonical copies.

---

# 52. URL Architecture Principles

URLs should be:

* stable,
* readable,
* meaningful,
* lowercase,
* consistently formatted,
* and free of unnecessary implementation detail.

URLs should not be changed casually.

Existing production URLs are assets.

V2 must audit current URLs before proposing migrations.

---

# 53. URLs Should Not Mirror Every Internal Layer

Avoid unnecessarily deep URLs such as:

```text
/domain/software-engineering/track/java-backend/pillar/concurrency/module/concurrent-collections/question/how-does-concurrenthashmap-work
```

A user does not need the entire database hierarchy encoded into the URL.

A more stable conceptual structure may be:

```text
/questions/how-does-concurrenthashmap-work
```

or:

```text
/java-backend/questions/how-does-concurrenthashmap-work
```

The exact final route must be determined from the existing repository and SEO audit.

This document defines the principle:

> **Encode enough context to create meaning and stability, but not every internal relationship.**

---

# 54. URL Decisions Require Repository Evidence

The final V2 URL architecture must not be invented abstractly.

Before changing current routes, audit:

* existing production URLs,
* indexed URLs,
* backlinks where available,
* current route generation,
* slug uniqueness,
* sitemap structure,
* canonical behavior,
* and internal linking.

The architecture should preserve valuable existing URLs where practical.

A theoretical improvement is not sufficient reason for a destructive migration.

---

# 55. Slugs Must Be Stable

A slug should not change because:

* a title receives minor punctuation edits,
* capitalization changes,
* copy is polished,
* or metadata changes.

Where possible, canonical identity and URL slug should be treated separately from editable display text.

Slug changes require migration handling.

---

# 56. Slug Uniqueness Must Be Defined

If question URLs use a global structure such as:

```text
/questions/{slug}
```

slugs must be globally unique.

If URLs are scoped:

```text
/{track}/{question-slug}
```

uniqueness may be scoped differently.

The architecture must explicitly define this.

Do not discover slug collisions in production accidentally.

---

# 57. Public and Private URL Spaces Should Be Distinct

Public content and authenticated personal workflows have different purposes.

Conceptually:

```text
Public:
/
/prepare/...
/questions/...
/companies/...
/roles/...

Authenticated:
/dashboard
/practice/...
/mock-interviews/...
/resume/...
/jobs/saved
/applications/...
```

The exact routes will be determined later.

The principle is to avoid mixing:

* public indexable knowledge,
* private user data,
* and transient application states

without clear rules.

---

# 58. Not Every Private State Needs a Search-Indexable Page

Authenticated and user-specific pages should generally not be indexed.

Examples:

* dashboard,
* bookmarks,
* personal progress,
* resume analysis,
* application tracker,
* mock interview history.

The SEO framework will define exact directives.

The information architecture should make the distinction explicit.

---

# 59. Filtered URLs Require Governance

Filters can create enormous URL spaces.

Examples:

```text
?difficulty=hard
?company=amazon
?role=backend
?technology=java
```

The system must define:

* which filters create meaningful shareable states,
* which should be indexable,
* which should be canonicalized,
* and which should remain application state.

Do not allow every filter combination to become an accidental SEO page.

---

# 60. Pagination Requires Stable Behavior

Large collections may require:

* pagination,
* progressive loading,
* or another scalable navigation strategy.

The choice must consider:

* user navigation,
* accessibility,
* crawlability,
* URL stability,
* and performance.

Infinite scrolling should not be introduced automatically.

For large knowledge libraries, users often benefit from:

* stable position,
* meaningful URLs,
* and predictable navigation.

---

# 61. Breadcrumb Architecture

Breadcrumbs should represent a useful primary hierarchy.

Example:

```text
Java Backend
→ Concurrency
→ Concurrent Collections
→ Current Question
```

They should not attempt to display every possible relationship.

A question relevant to five roles and ten companies still needs one primary breadcrumb path.

Secondary relationships belong elsewhere.

---

# 62. Internal Linking Architecture

Internal links should arise from meaningful relationships.

Primary internal-link categories include:

## Hierarchical

Parent and child relationships.

## Sequential

Previous and next in a meaningful sequence.

## Semantic

Related concepts.

## Contextual

Relevant role, company, or technology relationships.

## User-Specific

Continue, revise, or resume.

These should be distinct in purpose.

A page should not display all relationship types with equal prominence.

---

# 63. The Next-Step Architecture

Every major page archetype should define its expected next-step model.

Examples:

## Homepage

Next:

* choose preparation area,
* search,
* or begin a major path.

## Track Hub

Next:

* begin a major area,
* continue previous progress,
* or search within the track.

## Module

Next:

* choose a question,
* continue,
* or review progress.

## Question

Next:

* next question,
* related concept,
* practice,
* or return to module.

## Mock Result

Next:

* review weaknesses,
* prepare relevant material,
* or schedule another mock.

The next step should be contextual.

---

# 64. Content Discovery Must Not Become Content Duplication

A question can appear in many discovery surfaces.

Examples:

* module page,
* role page,
* company page,
* search,
* related questions,
* dashboard.

These are references to the canonical entity.

They should not create separate content copies.

This principle should be enforced in data architecture.

---

# 65. SEO Landing Pages Must Fit the Architecture

Search-driven landing pages should represent genuine user intents.

Potential examples:

```text
Java Backend Interview Questions
Spring Boot Interview Questions
Data Analyst Interview Preparation
Management Consulting Case Interview Preparation
Amazon Backend Engineer Interview Preparation
```

These pages should provide:

* meaningful orientation,
* unique organization,
* and useful pathways.

They should not be thin shells generated solely for keyword coverage.

---

# 66. Programmatic SEO Requires Governance

Interview Explainer has the potential to generate many pages.

This creates both opportunity and risk.

Programmatic page creation must require:

* real user intent,
* meaningful unique value,
* sufficient content,
* canonical clarity,
* internal-link support,
* and quality thresholds.

The platform must not generate every possible entity combination.

Example of dangerous uncontrolled generation:

```text
Company × Role × Technology × Difficulty × Experience Level
```

This could create enormous low-value URL spaces.

The SEO framework will define stricter rules.

---

# 67. Taxonomy Must Be Governed

New:

* domains,
* tracks,
* roles,
* technologies,
* categories,
* and tags

should not be created casually.

Without governance, taxonomy becomes fragmented.

Examples:

```text
Backend
Backend Development
Backend Engineering
Backend Developer
Server-Side Development
```

These may represent:

* one concept,
* related concepts,
* or different concepts.

The architecture must define canonical terminology and aliases.

---

# 68. Synonyms Should Support Search, Not Duplicate Navigation

Users may search:

```text
Backend Developer
Backend Engineer
Server-Side Engineer
```

Search may recognize synonyms.

The navigation does not necessarily need three separate categories.

Synonym support should improve findability without fragmenting the architecture.

---

# 69. Terminology Must Be Stable

Once user-facing terms are selected, they should remain consistent.

Avoid casually switching between:

* track,
* path,
* roadmap,
* course,
* journey

for the same concept.

Likewise:

* saved,
* bookmarked,
* favorite

should not all refer to one feature.

A future product-language glossary should define canonical terms.

---

# 70. Content IDs and URLs Must Be Separate Concepts

Internal entities should have stable IDs independent of:

* title,
* slug,
* display order,
* or URL.

Conceptually:

```text
Question ID:
q_12345

Title:
How does ConcurrentHashMap work internally?

Slug:
how-does-concurrenthashmap-work
```

This allows the display and URL layers to evolve without destroying identity.

The exact ID system depends on the existing backend.

---

# 71. Ordering Must Be Explicit

Content order should not depend accidentally on:

* database insertion time,
* alphabetical order,
* filesystem order,
* or unstable queries.

Where sequence matters, store or derive meaningful ordering explicitly.

Examples:

* preparation order,
* module order,
* question priority,
* recommended sequence.

A sequence should represent a real learning or preparation rationale.

---

# 72. Difficulty and Priority Are Different

A question may be:

* easy but extremely important,
* difficult but rarely asked,
* foundational,
* advanced,
* or optional.

Do not use difficulty as a substitute for preparation priority.

The architecture should allow these concepts to remain distinct where useful.

---

# 73. Completion and Understanding Are Different

A user opening or scrolling through a page does not necessarily mean they understand it.

The data architecture should distinguish where relevant between:

* viewed,
* saved,
* completed,
* practiced,
* assessed,
* and mastered.

V2 should not prematurely expose all these states in the UI.

The model should avoid conflating them.

---

# 74. User Progress Should Be Portable Across Surfaces

If a user completes a canonical question from:

* a company page,
* search,
* a module,
* or a dashboard recommendation,

the completion state should remain attached to the same question entity.

Progress should not fragment by discovery route.

---

# 75. The Knowledge Graph Should Support Future Intelligence

A well-structured relationship model may eventually support:

* personalized recommendations,
* weak-area detection,
* mock interview generation,
* preparation planning,
* resume skill-gap analysis,
* job-to-preparation mapping,
* and adaptive revision.

However:

> **Future intelligence should emerge from useful present-day structure—not from prematurely building an unnecessarily complex AI ontology.**

Start with relationships the product actually needs.

Extend deliberately.

---

# 76. Repository Architecture Should Reflect Product Boundaries

As Interview Explainer moves toward multiple repositories or clearer service boundaries, product architecture should guide technical separation.

Potential future domains may include:

```text
Content / Knowledge
Mock Interviews
Interview Workspace
User / Identity / Progress
Resume Intelligence
Jobs / Applications
Web Experience
Shared Contracts
```

Technical repository boundaries should be determined by:

* ownership,
* deployment,
* data responsibility,
* scaling,
* and development independence.

They should not be split merely because the product navigation has separate menu items.

Product architecture and repository architecture are related.

They are not identical.

---

# 77. The Web Application Is an Experience Layer

The website should compose capabilities from underlying systems.

Conceptually:

```text
Web Experience
    │
    ├── Knowledge System
    ├── User System
    ├── Practice System
    ├── Mock Interview System
    ├── Resume System
    └── Jobs System
```

The frontend should not become the permanent owner of every business rule.

Likewise, microservices should not be created prematurely for every feature.

Technical boundaries require separate architectural review.

---

# 78. Content Architecture Must Support Multiple Domains

The existing Java Backend model may contain approximately:

```text
18 major pillars
→ many modules
→ 30–50 questions per module
```

This structure may work well for Java Backend.

It must not automatically be forced onto:

* Data Analyst,
* Management Consulting,
* Product Management,
* or every future domain.

Different domains may require different editorial structures.

Examples:

```text
Java Backend
→ Major Areas
→ Modules
→ Questions
```

```text
Data Analyst
→ Competencies
→ Topics
→ Question Types
→ Practice
```

```text
Management Consulting
→ Case Skills
→ Case Types
→ Drills
→ Full Cases
→ Behavioral Preparation
```

The platform needs a flexible content model.

The user experience should remain coherent despite domain differences.

---

# 79. Standardize the Framework, Not Every Domain

Across domains, standardize:

* navigation principles,
* page hierarchy,
* progress concepts,
* search,
* entity relationships,
* accessibility,
* design system,
* and SEO contracts.

Do not necessarily standardize:

* exact content depth,
* exact terminology,
* exact learning sequence,
* or exact practice format.

The platform should feel like one product without pretending every profession prepares identically.

---

# 80. Content and Product Features Must Remain Distinct

A question is content.

A bookmark is a user action.

A mock interview is a session.

A dashboard is an aggregation surface.

A company is an entity.

A preparation track is an organizational structure.

These concepts should not be collapsed into one generic "page" model.

Clear domain boundaries improve:

* code,
* data,
* navigation,
* and product reasoning.

---

# 81. Public Content Must Be Shareable

Important public preparation content should generally support:

* stable URLs,
* direct access,
* sharing,
* bookmarking,
* and external discovery.

Do not make valuable public content accessible only through transient client-side state.

---

# 82. Private User Work Must Be Protected

User-specific:

* progress,
* resumes,
* applications,
* notes,
* interview records,
* and personal recommendations

must be treated as private application data.

They should not accidentally appear in:

* public routes,
* public metadata,
* sitemaps,
* or indexable pages.

---

# 83. The Architecture Must Support Anonymous and Authenticated Use

A user may begin anonymously.

Later they may create an account.

Where practical, the transition should preserve useful context.

Potentially:

```text
Anonymous:
- browse
- search
- read
- perhaps limited local state

Authenticated:
- sync progress
- bookmarks
- history
- personalized preparation
- private workflows
```

The exact behavior depends on implementation.

The architecture should avoid unnecessary duplication between anonymous and authenticated versions of the same content.

---

# 84. Search Engine Architecture and User Architecture Should Reinforce Each Other

Good information architecture helps both.

Examples:

A meaningful track page helps users understand preparation.

It also creates a strong search landing page.

A meaningful module page helps users navigate.

It also creates contextual internal links.

A stable question page helps users bookmark and return.

It also creates canonical search identity.

SEO should emerge from useful structure.

---

# 85. Orphan Pages Are Architectural Failures

An important public page should not exist without meaningful paths from the rest of the site.

Public pages should be discoverable through some combination of:

* hierarchy,
* search,
* related content,
* directories,
* sitemaps,
* or contextual links.

A sitemap alone is not a substitute for useful internal architecture.

---

# 86. Dead Ends Should Be Rare

A page should generally provide:

* a parent,
* a continuation,
* related context,
* search,
* or another meaningful route.

This does not mean every page needs a recommendation grid.

One clear next step may be enough.

---

# 87. Navigation Depth Must Be Controlled

Users should not be required to navigate through excessive intermediate pages.

A conceptual internal hierarchy may be deep.

Direct access should remain possible.

For example:

```text
Homepage
→ Prepare
→ Software Engineering
→ Java Backend
→ Concurrency
→ Concurrent Collections
→ Question
```

This may represent a valid conceptual hierarchy.

The user should still be able to reach the question directly through:

* search,
* direct links,
* related content,
* or external search.

Hierarchy provides context.

It should not become a gate.

---

# 88. Search Results Should Expose Context

A result titled:

> Dependency Injection

may be ambiguous.

Useful context may include:

```text
Spring Boot
→ Core Framework
```

or a result type such as:

```text
Question
Technology
Company
Preparation Track
```

This helps users choose correctly without requiring longer titles.

---

# 89. The Architecture Must Support Multiple Entry Points

Users may enter through:

* homepage,
* Google,
* AI search,
* shared question,
* company page,
* dashboard,
* bookmark,
* mock interview result,
* resume analysis,
* job page.

The architecture should not assume one linear funnel.

Every major entry point should reconnect users to the wider product appropriately.

---

# 90. Cross-Product Connections Must Be Contextual

Future product areas should connect when the relationship is useful.

Examples:

```text
Resume Analysis
→ Missing skill
→ Relevant preparation track
```

```text
Job
→ Required technology
→ Relevant interview preparation
```

```text
Mock Interview Result
→ Weak competency
→ Relevant questions and practice
```

```text
Upcoming Real Interview
→ Company + Role
→ Preparation plan
```

These connections should feel like intelligent continuity.

They should not become a wall of cross-selling modules.

---

# 91. Avoid the Super-App Homepage Problem

As Interview Explainer adds:

* content,
* mock interviews,
* resume,
* jobs,
* practice,
* dashboards,

the homepage must not attempt to give every capability equal visual prominence.

The homepage should continue to answer:

> What is this product, and what should I do?

Product breadth should be organized through architecture.

Not through homepage accumulation.

---

# 92. Information Architecture Governance

Changes to major architecture should require deliberate review.

Examples:

* adding a new top-level product area,
* creating a new public entity type,
* changing URL structure,
* adding a new taxonomy level,
* changing canonical hierarchy,
* creating large-scale programmatic pages.

These changes affect:

* UX,
* SEO,
* analytics,
* code,
* data,
* and future development.

They should not emerge accidentally from isolated feature work.

---

# 93. New Entity Checklist

Before introducing a new entity type, ask:

1. What real concept does this represent?
2. Is it distinct from existing entities?
3. Does the user need to understand it?
4. Does it need a public page?
5. Does it need a stable ID?
6. Does it need a URL?
7. Can users search for it?
8. Can users save or progress through it?
9. How does it relate to existing entities?
10. What happens when there are 10,000 of them?

If these questions cannot be answered, the entity may be premature.

---

# 94. New Page-Type Checklist

Before creating a new page archetype, ask:

1. What is the dominant user job?
2. Why can an existing archetype not support it?
3. Is the page public or private?
4. Should it be indexable?
5. What is its canonical identity?
6. How do users reach it?
7. Where can users go next?
8. What happens on mobile?
9. What happens with sparse data?
10. What happens at scale?

A new route does not automatically require a new page archetype.

---

# 95. URL Change Checklist

Before changing a production URL:

1. Why is the change necessary?
2. What existing URLs are affected?
3. Are any indexed?
4. Are there backlinks?
5. What redirects are required?
6. What canonical changes are required?
7. What sitemap changes are required?
8. What internal links must change?
9. What analytics continuity is needed?
10. How will the migration be validated?

URL migrations require dedicated tasks.

---

# 96. V2 Architecture Migration Principle

V2 should not attempt to replace the entire information architecture in one uncontrolled migration.

The recommended process is:

```text
1. Audit current routes and entities.
2. Map current page archetypes.
3. Identify duplicate or conflicting concepts.
4. Define canonical terminology.
5. Define target architecture.
6. Preserve stable public assets.
7. Introduce shared navigation and relationship systems.
8. Migrate one archetype at a time.
9. Validate UX and SEO.
10. Expand.
```

The architecture specification guides migration.

It does not authorize destructive route changes by itself.

---

# 97. Current Repository Must Be Audited Against This Model

Before implementation, the existing repository should be mapped into:

```text
Current Route
Current Page Type
Current Data Source
Current User Purpose
Current Indexability
Current Canonical
Current Parent
Current Children
Current Internal Links
Target Archetype
Migration Required?
```

This audit will reveal:

* duplicate routes,
* orphan pages,
* inconsistent hierarchy,
* missing page types,
* accidental indexable pages,
* and opportunities for systemic improvement.

---

# 98. Non-Negotiable Information Architecture Principles

## Principle 1

**The product should feel simpler than the system beneath it.**

## Principle 2

**Internal data structure is not automatically user navigation.**

## Principle 3

**One canonical content entity may appear in many contexts.**

## Principle 4

**Discovery should not create content duplication.**

## Principle 5

**Every public page must provide standalone value.**

## Principle 6

**Not every entity needs a public page.**

## Principle 7

**Not every public page should be indexable.**

## Principle 8

**Page archetypes matter more than page count.**

## Principle 9

**Primary hierarchy and secondary relationships must be distinguished.**

## Principle 10

**URLs must remain stable and should not mirror every internal layer.**

## Principle 11

**Existing production URLs must not be changed without audit and migration planning.**

## Principle 12

**Progress and bookmarks must reference stable canonical entities.**

## Principle 13

**Search must work across user-facing concepts without requiring knowledge of internal taxonomy.**

## Principle 14

**Different interview domains may require different content structures.**

## Principle 15

**Standardize product principles, not every domain's educational model.**

## Principle 16

**Future product areas should connect through meaningful relationships, not duplication.**

## Principle 17

**Public knowledge and private user data require clear architectural separation.**

## Principle 18

**Programmatic page generation requires quality governance.**

## Principle 19

**Architecture must support multiple entry points.**

## Principle 20

**Major architecture changes require deliberate review.**

---

# 99. Information Architecture Anti-Patterns

The following should trigger explicit review:

* global navigation mirroring the database,
* exposing every taxonomy level to users,
* generating a page for every database entity,
* duplicate copies of the same answer for different companies or roles,
* six-level URLs that mirror internal hierarchy,
* changing slugs whenever titles change,
* progress tied to list position,
* bookmarks tied only to mutable URLs,
* company pages duplicating canonical question content,
* every filter combination becoming indexable,
* uncontrolled programmatic SEO,
* different names for the same concept,
* one rigid content hierarchy forced onto every profession,
* dashboards owning duplicate content,
* daily preparation becoming a separate content library,
* mock interviews disconnected from preparation knowledge,
* resume, jobs, and interviews each creating separate skill models,
* important public pages existing as orphans,
* and homepage navigation expanding every time a feature is added.

---

# 100. Target Conceptual Architecture

The long-term conceptual architecture is:

```text
                         INTERVIEW EXPLAINER
                                  │
             ┌────────────────────┼─────────────────────┐
             │                    │                     │
         PUBLIC KNOWLEDGE      USER WORKSPACE       INTELLIGENCE
             │                    │                     │
      ┌──────┼──────┐       ┌─────┼─────┐        ┌─────┼─────┐
      │      │      │       │     │     │        │     │     │
   Prepare Roles Companies Dashboard Practice  Resume  Mock  Jobs
      │
      │
      ├── Domains
      │
      ├── Preparation Tracks
      │
      ├── Technologies
      │
      ├── Major Areas
      │
      ├── Modules
      │
      └── Canonical Questions
                 │
                 ├── Role Relationships
                 ├── Company Relationships
                 ├── Technology Relationships
                 ├── Practice Relationships
                 ├── Mock Interview Relationships
                 └── User Progress
```

This is not a required literal database schema.

It is a product relationship model.

---

# 101. Final Information Architecture Principle

Interview Explainer should not feel like:

> Thousands of pages.

It should feel like:

> **One understandable preparation system.**

A user may enter through one question.

They should be able to understand the surrounding topic.

A user may begin with a role.

They should be able to discover the relevant preparation.

A user may receive a mock interview weakness.

They should be able to move into focused learning.

A user may find a job.

They should eventually be able to connect that opportunity to:

* the right resume,
* the right preparation,
* and the right interview workflow.

The system beneath Interview Explainer may become complex.

The user's mental model should remain coherent.

The permanent architecture principle is:

> **One canonical identity.**

> **Many useful relationships.**

> **Few concepts the user must learn.**

> **Stable destinations.**

> **Contextual navigation.**

> **No unnecessary duplication.**

> **No accidental URL explosion.**

> **No feature islands.**

Interview Explainer V2 should scale by becoming more connected—not more fragmented.
