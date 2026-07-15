# Interview Explainer V2 — SEO, Search & Indexing Architecture

**Document:** `09_SEO_SEARCH_INDEXING_ARCHITECTURE.md`
**Status:** Foundational / Technical SEO Architecture
**Version:** 2.0
**Product:** Interview Explainer
**Depends On:** `00_VISION.md`, `01_PRODUCT_PHILOSOPHY.md`, `02_AI_CONSTITUTION.md`, `03_USER_PSYCHOLOGY.md`, `04_UX_PRINCIPLES.md`, `05_INFORMATION_ARCHITECTURE.md`, `06_DESIGN_SYSTEM.md`, `07_COMPONENT_LIBRARY.md`, `08_PAGE_ARCHETYPES.md`
**Purpose:** Define how Interview Explainer creates, discovers, renders, canonicalizes, indexes, interlinks, monitors, and scales public search-facing pages while protecting the product from duplicate content, crawl waste, thin pages, accidental deindexation, and uncontrolled programmatic SEO.

---

# 1. Purpose of This Document

Interview Explainer may eventually contain:

```text
Preparation Tracks
Major Areas / Pillars
Modules
Interview Questions
Company Preparation Pages
Role Preparation Pages
Guides
Future Career Resources
```

This creates a significant search opportunity.

It also creates significant technical risk.

A site with 10,000 URLs is not automatically more valuable than a site with 500 URLs.

If the architecture is weak, scale can create:

* duplicate pages,
* thin pages,
* orphan pages,
* crawl traps,
* incorrect canonicals,
* conflicting search intent,
* wasted crawl activity,
* index bloat,
* unstable URLs,
* weak internal linking,
* and thousands of pages Google chooses not to index.

The central principle is:

> **Interview Explainer should scale useful search destinations—not merely URLs.**

---

# 2. SEO Is a System

SEO is not:

```text
Add meta tags
+
Create sitemap
+
Submit to Google
```

The full system is:

```text
Useful Search Intent
        ↓
Valuable Page
        ↓
Stable URL
        ↓
Internal Discovery
        ↓
Crawlability
        ↓
Renderability
        ↓
Canonical Understanding
        ↓
Index Eligibility
        ↓
Search Engine Selection
        ↓
Ranking
        ↓
Useful User Experience
```

Failure at any layer can reduce search performance.

---

# 3. The Indexing Pipeline

For a page to appear in search, several things must happen.

Conceptually:

```text
URL Exists
    ↓
Google Discovers URL
    ↓
Google Can Crawl URL
    ↓
Google Receives Valid Response
    ↓
Google Can Render / Understand Content
    ↓
Page Is Allowed to Be Indexed
    ↓
Canonical Signals Are Consistent
    ↓
Page Provides Sufficient Distinct Value
    ↓
Google Chooses to Index
    ↓
Page Competes for Ranking
```

Submitting a sitemap affects only part of this pipeline.

A sitemap does not guarantee indexing.

---

# 4. Search Architecture Objectives

Interview Explainer V2 should optimize for:

```text
Discoverability
Crawlability
Indexability
Canonical Consistency
Topical Structure
Intent Clarity
Content Quality
Internal Connectivity
Performance
Observability
Controlled Scale
```

The architecture must work for:

* hundreds of pages today,
* thousands later,
* and potentially tens of thousands if the product earns that scale.

---

# 5. Search Engines Are Not the Product Owner

Search traffic is valuable.

However:

The product must not become distorted around search engines.

The hierarchy is:

```text
User Value
    ↓
Product Structure
    ↓
Search Discoverability
```

Not:

```text
Keyword
    ↓
Generate Page
    ↓
Hope User Finds Value
```

SEO should amplify good product architecture.

It should not replace it.

---

# 6. Public Page Eligibility

A page may be publicly accessible without necessarily being indexable.

Every route should belong to an explicit indexing class.

Recommended classes:

```text
INDEX
NOINDEX
CONDITIONAL
PRIVATE
```

These classifications should be intentional.

---

# 7. INDEX Pages

Pages intended for search discovery.

Potential examples:

```text
Homepage
Preparation Track Hubs
High-Value Major Areas
Substantive Module Pages
Distinct Question Pages
Substantive Company Preparation Pages
Substantive Role Preparation Pages
Selected Editorial Guides
```

An INDEX page should generally have:

* a distinct purpose,
* a stable canonical URL,
* useful unique content,
* internal links,
* appropriate status code,
* no indexing prohibition.

---

# 8. NOINDEX Pages

Pages that users may need but search engines generally should not index.

Potential examples:

```text
Internal Search Results
Filter Combinations
Sort Variants
Temporary Utility Pages
Account Pages
Login / Signup
Dashboard
User-Specific Pages
Preview Pages
Internal Testing Routes
```

NOINDEX should be implemented deliberately.

Do not use `robots.txt` as the primary method for removing pages from search indexes.

Search engines generally need access to the page to see a `noindex` directive.

---

# 9. PRIVATE Pages

Examples:

```text
User Dashboard
Resume Analysis
Private Mock Interview Results
Application Workspace
Personal Notes
Account Settings
```

Private pages should be protected through:

* authentication,
* authorization,
* appropriate caching controls,
* and indexing protection.

`noindex` alone is not privacy.

---

# 10. CONDITIONAL Pages

Some page types may be indexable only when quality requirements are met.

Examples:

```text
Company Pages
Role Pages
Module Pages
Generated Topic Pages
```

A page may initially be:

```text
Published but NOINDEX
```

and become:

```text
INDEX
```

after reaching a quality threshold.

This is safer than automatically indexing every generated route.

---

# 11. Index Eligibility Is Not Publication Eligibility

A page can be useful inside the product before it is useful as a search landing page.

Example:

A module with:

```text
2 questions
Minimal introduction
No distinct search intent
```

may still help internal navigation.

It does not necessarily deserve search indexation.

Therefore:

```text
Published
≠
Indexable
```

This distinction should exist in the content model.

---

# 12. Search Intent Ownership

Every indexable page should have a primary search intent.

Examples:

```text
Homepage
→ Interview preparation platform

Track
→ Java backend interview preparation

Major Area
→ Java concurrency interview questions

Module
→ ConcurrentHashMap interview questions

Question
→ How does ConcurrentHashMap work?

Company
→ Amazon interview preparation

Role
→ Data analyst interview preparation
```

The page architecture should avoid multiple pages competing for the same primary intent.

---

# 13. Keyword Cannibalization Control

Potential problem:

```text
/java-interview-questions
/java/questions
/java-backend-interview
/interview/java
/topics/java
```

If these pages all target effectively the same intent:

They compete internally.

Before creating an indexable page:

Ask:

```text
Does another page already own this intent?
```

If yes:

* consolidate,
* differentiate clearly,
* or keep the new page non-indexed.

---

# 14. URL Architecture Principles

URLs should be:

* stable,
* readable,
* predictable,
* canonical,
* lowercase,
* free of unnecessary parameters,
* independent of temporary UI structure.

Avoid changing URLs because the visual design changed.

---

# 15. Recommended URL Philosophy

The exact repository routes must be audited before implementation.

Conceptually:

```text
/
```

Preparation:

```text
/preparation/{track}
/preparation/{track}/{major-area}
/preparation/{track}/{major-area}/{module}
```

Questions may use:

```text
/questions/{question-slug}
```

or hierarchical paths:

```text
/preparation/{track}/{major-area}/{module}/{question}
```

The final decision must consider:

* existing URLs,
* current indexing,
* migration risk,
* content ownership,
* future taxonomy changes.

Do not change the existing URL system without evidence that the benefits exceed migration risk.

---

# 16. Flat vs Hierarchical Question URLs

## Flat Question URL

Example:

```text
/questions/how-does-concurrenthashmap-work
```

Advantages:

* stable if taxonomy changes,
* simple,
* clear question identity.

Disadvantages:

* hierarchy is not visible in the path.

## Hierarchical Question URL

Example:

```text
/java/concurrency/concurrent-collections/how-does-concurrenthashmap-work
```

Advantages:

* hierarchy visible,
* contextual.

Disadvantages:

* moving a question changes URL,
* deep structures become fragile.

The final V2 choice should prioritize:

> **Long-term URL stability over cosmetic hierarchy.**

Breadcrumbs and internal links can communicate hierarchy without forcing every taxonomy level into the URL.

---

# 17. URL Slug Rules

Slugs should generally:

* use lowercase,
* use hyphens,
* remain concise,
* preserve meaning,
* avoid unnecessary IDs where possible.

Example:

```text
how-does-concurrenthashmap-work
```

Avoid:

```text
How_Does_ConcurrentHashMap_Work_FINAL_123
```

---

# 18. Slug Stability

Once an indexable URL receives:

* traffic,
* links,
* impressions,
* or indexation,

its slug should be treated as durable infrastructure.

Changing a question title should not automatically change its URL.

Content title and canonical slug should be separable.

---

# 19. Duplicate Slugs

The system must handle duplicate or similar question titles.

Possible strategy:

```text
Stable unique slug
+
Internal immutable content ID
```

Do not rely solely on titles as database identity.

---

# 20. URL Parameter Policy

Parameters should have explicit purposes.

Potential examples:

```text
?query=
?sort=
?filter=
?page=
```

Each parameter type requires:

* crawl policy,
* canonical policy,
* indexing policy.

Do not allow arbitrary parameter combinations to create uncontrolled crawlable URLs.

---

# 21. Filter URL Policy

Example:

```text
/questions?difficulty=hard&topic=java&sort=popular
```

Unless a filter combination represents a deliberate search landing page:

It should generally not become an indexable page.

Possible treatment:

* canonical to primary collection,
* `noindex`,
* controlled crawling,
* or client state without permanent crawlable combinations.

The exact implementation depends on route architecture.

---

# 22. Search Query URL Policy

Example:

```text
/search?q=hashmap
```

Internal search pages should generally not be treated as programmatic SEO pages.

Potential risks:

* infinite query space,
* thin results,
* duplicate content,
* crawl waste,
* search spam.

Default policy:

```text
Search Results
→ NOINDEX
```

unless a specific curated search destination is intentionally promoted into a real landing page.

---

# 23. Pagination Policy

Pagination may be required for large collections.

The system should define:

* stable URLs,
* crawlable navigation,
* canonical behavior,
* indexation behavior.

Do not automatically canonicalize every paginated page to page 1 if later pages contain distinct discoverable items.

Pagination strategy must preserve crawl paths.

---

# 24. Trailing Slash Policy

Choose one canonical format:

```text
/path
```

or:

```text
/path/
```

Then enforce it consistently through:

* routing,
* canonical URLs,
* redirects,
* internal links,
* sitemap URLs.

Do not serve both as independent 200 pages.

---

# 25. WWW Policy

Choose one canonical hostname:

```text
https://www.interviewexplainer.com
```

or:

```text
https://interviewexplainer.com
```

The other should permanently redirect.

All of the following must agree:

```text
Canonical tags
Sitemaps
Internal links
Open Graph URLs
Structured data URLs
Redirects
Search Console properties
```

---

# 26. HTTPS Policy

All public production URLs should resolve to HTTPS.

HTTP should permanently redirect to HTTPS.

Avoid redirect chains such as:

```text
HTTP
→ HTTPS non-WWW
→ HTTPS WWW
→ Trailing Slash Version
```

Prefer one direct redirect to the final canonical URL.

---

# 27. Canonical URL Architecture

Every indexable page should emit a canonical URL.

The canonical should:

* use the preferred protocol,
* use the preferred hostname,
* use the preferred path format,
* exclude irrelevant parameters.

Example:

```text
Current URL:
https://www.interviewexplainer.com/question?id=123&utm_source=x

Canonical:
https://www.interviewexplainer.com/questions/how-does-concurrenthashmap-work
```

---

# 28. Self-Referencing Canonicals

Primary indexable pages should generally use self-referencing canonicals.

This helps clarify the preferred URL.

However:

Canonical tags must not be treated as a substitute for fixing duplicate routing.

If multiple URLs unnecessarily serve the same page:

Prefer redirecting duplicates where appropriate.

---

# 29. Canonical Consistency Rule

A page must not:

```text
Canonical → URL A

Sitemap → URL B

Internal Links → URL C

Redirect → URL D
```

All systems should agree on the preferred URL.

Conflicting signals weaken search engine understanding.

---

# 30. Canonical Validation

Automated validation should detect:

* missing canonical,
* relative canonical if not intended,
* canonical to non-200 URL,
* canonical to redirect,
* canonical to noindex page,
* canonical loops,
* cross-domain canonical mistakes,
* multiple canonical tags.

---

# 31. HTTP Status Code Architecture

Routes should return semantically correct status codes.

## 200

Real available page.

## 301 / 308

Permanent URL migration.

## 302 / 307

Temporary redirect.

## 404

Resource does not exist.

## 410

Resource intentionally and permanently removed where appropriate.

## 5xx

Actual server failure.

Do not return `200 OK` for a page that visually says:

```text
Question not found
```

That creates a soft 404.

---

# 32. Soft 404 Prevention

Potential soft 404 patterns:

```text
200 response
+
"No content found"

200 response
+
Empty question page

200 response
+
Generic fallback for invalid slug
```

Invalid content routes should return a true 404 where appropriate.

---

# 33. Redirect Architecture

Redirects are required when:

* URLs are renamed,
* duplicate paths are consolidated,
* content is moved,
* legacy routes are retired.

Redirect rules should:

* point directly to the final destination,
* avoid chains,
* avoid loops,
* preserve relevant intent.

---

# 34. V1 to V2 Migration Rule

The V2 visual redesign should preserve existing public URLs wherever practical.

Before changing routes:

Create a URL inventory containing:

```text
Current URL
Page Type
Status Code
Indexability
Canonical
Search Impressions
Clicks
Backlinks if known
New URL
Redirect Required
```

No large route migration should happen blindly.

---

# 35. Redirect Mapping

Every changed public URL should have an explicit mapping.

Example:

```text
OLD
/java/questions/hashmap-internal-working

NEW
/questions/how-does-hashmap-work

ACTION
301 / 308 permanent redirect
```

Do not redirect unrelated removed pages to the homepage.

That creates poor user and search behavior.

---

# 36. Internal Linking Architecture

Internal links perform several jobs:

```text
User Navigation
Page Discovery
Hierarchy Communication
Authority Distribution
Contextual Relevance
Orphan Prevention
```

Internal linking should follow product structure.

---

# 37. Core Internal Link Graph

Conceptually:

```text
Homepage
    ↓
Directories / Major Tracks
    ↓
Preparation Track
    ↓
Major Area
    ↓
Module
    ↓
Question
```

Questions should also connect laterally where useful:

```text
Question
↔ Related Question

Question
↔ Previous / Next

Question
→ Parent Module
```

---

# 38. Internal Link Quality

Good internal links are:

* relevant,
* descriptive,
* contextually useful,
* crawlable.

Avoid generic anchor text everywhere such as:

```text
Click here
Read more
Learn more
```

Prefer:

```text
Learn how ConcurrentHashMap handles concurrent updates
```

where natural.

---

# 39. Breadcrumb Internal Links

Breadcrumbs should provide crawlable links to parent structures.

Example:

```text
Java Backend
→ Concurrency
→ Concurrent Collections
→ Current Question
```

The current page may remain unlinked.

---

# 40. Previous / Next Links

Sequential links help:

* users continue,
* crawlers discover neighboring content,
* modules remain interconnected.

They should use actual links.

Do not implement essential navigation solely through JavaScript event handlers without crawlable destinations.

---

# 41. Related Content Links

Related links should be selected by semantic usefulness.

Potential relationships:

```text
Prerequisite
Follow-Up
Comparison
Next Concept
Same Module
```

Avoid random automated recommendations solely to increase link count.

---

# 42. Orphan Page Detection

An indexable page is an orphan if no meaningful internal page links to it.

Automated checks should compare:

```text
Known Indexable URLs
vs
Internally Discovered URLs
```

Orphan indexable pages should trigger review.

---

# 43. Internal Link Depth

Important content should not require an excessive number of navigation steps from major entry points.

However:

The goal is not to make every page one click from the homepage.

A logical hierarchy is acceptable.

The objective is:

* discoverability,
* clear relationships,
* reasonable depth.

---

# 44. Sitemap Architecture

Sitemaps are discovery aids.

They do not guarantee indexing.

The sitemap system should include only canonical URLs that the product genuinely wants indexed.

Do not include:

* noindex pages,
* redirects,
* 404s,
* search URLs,
* filter combinations,
* duplicate URLs,
* private pages.

---

# 45. Sitemap Index

As the site grows, use a sitemap index.

Conceptually:

```text
/sitemap.xml
    ↓
/sitemaps/questions.xml
/sitemaps/modules.xml
/sitemaps/tracks.xml
/sitemaps/companies.xml
/sitemaps/roles.xml
```

Exact implementation may depend on framework capabilities.

---

# 46. Sitemap Segmentation

Segmenting sitemaps by page type provides better observability.

Example:

If:

```text
Questions:
10,000 submitted
3,000 indexed

Tracks:
20 submitted
20 indexed
```

the problem is immediately easier to diagnose.

One giant sitemap hides page-type patterns.

---

# 47. Sitemap Size Limits

The implementation must respect search engine sitemap limits.

Large collections should be split automatically.

Do not manually maintain large static sitemap files.

---

# 48. Sitemap `lastmod`

Use `lastmod` only when it reflects meaningful content modification.

Do not update every page's `lastmod` on every deployment.

False freshness signals reduce trust and diagnostic usefulness.

---

# 49. Sitemap Generation Source

The sitemap should be generated from the canonical content source.

It should not blindly crawl the frontend.

The content system should know:

```text
Published?
Indexable?
Canonical URL?
Last meaningful update?
```

---

# 50. Sitemap Validation

Automated checks should detect sitemap URLs that:

* return non-200,
* redirect,
* are noindex,
* canonicalize elsewhere,
* are duplicated,
* are malformed.

A sitemap should be internally consistent.

---

# 51. Robots.txt Responsibility

`robots.txt` controls crawling access.

It is not the primary indexation control system.

The file should:

* allow crawling of important public content,
* block clearly unnecessary crawl spaces where appropriate,
* reference the sitemap.

Do not accidentally block:

* JavaScript required for rendering,
* CSS required for rendering,
* important public routes.

---

# 52. Robots.txt Safety Rule

Any robots.txt change should be treated as production-critical.

A single broad rule can remove the entire site from crawl access.

Example dangerous pattern:

```text
User-agent: *
Disallow: /
```

Production validation is mandatory.

---

# 53. Meta Robots Architecture

Pages should explicitly support appropriate directives.

Common states:

```text
index, follow
noindex, follow
```

Other directives should be used only when there is a clear reason.

Do not scatter hardcoded robots tags across unrelated components.

Indexing policy should be centralized.

---

# 54. Environment Indexing Protection

Non-production environments should not be indexable.

Examples:

```text
Preview
Staging
Temporary Deployment
Development
```

Protection may include:

* authentication,
* network restriction,
* noindex,
* separate hostname controls.

Do not rely on one fragile mechanism.

---

# 55. Production Environment Safety

The inverse risk is also important.

Do not accidentally ship staging `noindex` configuration to production.

Production deployment checks should validate:

```text
Homepage indexability
Representative track indexability
Representative question indexability
robots.txt
sitemap
canonical hostname
```

---

# 56. Rendering Architecture

Important public content should be available in the initial HTML or reliably server-rendered output where practical.

Search-critical content should not depend entirely on:

* delayed client fetches,
* user interaction,
* browser-only state.

Examples:

```text
Question Title
Answer
Module Links
Breadcrumbs
Canonical Metadata
```

should be search-accessible.

---

# 57. JavaScript Rendering Risk

Modern search engines can render JavaScript.

That does not mean all content should require it.

Heavy client rendering can introduce:

* delayed discovery,
* rendering failures,
* hydration problems,
* performance cost,
* inconsistent metadata.

Public content pages should minimize unnecessary client dependence.

---

# 58. Server Rendering Principle

Where supported by the application framework:

Prefer server rendering or static generation for:

```text
Question Pages
Module Pages
Major Area Pages
Track Hubs
Company Pages
Role Pages
```

when data characteristics allow.

Interactive islands may remain client-side.

---

# 59. Static Generation Principle

Stable public content may benefit from static generation.

Potential advantages:

* fast delivery,
* low server cost,
* crawl reliability.

However:

Do not attempt to rebuild tens of thousands of pages on every deployment without an appropriate strategy.

Possible approaches may include:

* incremental generation,
* on-demand revalidation,
* selective pre-generation.

The exact implementation depends on the current framework and hosting architecture.

---

# 60. Dynamic Rendering Principle

Dynamic server rendering may be appropriate for:

* rapidly changing public data,
* personalized but indexable shells,
* content too large for full build-time generation.

The architecture should choose rendering based on content behavior.

Not ideology.

---

# 61. Hydration Principle

Do not make an entire question page a client component because:

* one bookmark button,
* one theme toggle,
* or one progress control

requires client state.

Keep interactive boundaries narrow.

---

# 62. Metadata Architecture

Metadata should be generated systematically from page type and content.

Potential metadata:

```text
Title
Meta Description
Canonical
Robots
Open Graph
Twitter / Social Metadata
```

Metadata logic should be centralized by archetype.

---

# 63. Title Architecture

Titles should be:

* unique,
* descriptive,
* aligned with page intent,
* naturally written.

Examples:

```text
How Does ConcurrentHashMap Work? | Interview Explainer

Java Concurrency Interview Questions | Interview Explainer

Java Backend Interview Preparation | Interview Explainer
```

Do not stuff titles with repeated keywords.

---

# 64. Title Templates

Page archetypes may use controlled templates.

Examples:

```text
Question:
{Question Title} | Interview Explainer

Module:
{Module Name} Interview Questions | Interview Explainer

Track:
{Track Name} Interview Preparation | Interview Explainer
```

Templates should allow exceptions.

Do not force awkward titles merely to preserve a template.

---

# 65. Duplicate Title Detection

Automated SEO validation should detect:

* duplicate titles,
* empty titles,
* overly generic titles.

Examples of weak titles:

```text
Interview Question
Module
Home
Interview Explainer
```

for many different pages.

---

# 66. Meta Description Architecture

Descriptions should summarize the page value naturally.

They are not guaranteed to appear as search snippets.

Do not generate meaningless keyword strings.

Example:

```text
Understand how ConcurrentHashMap works in Java, including concurrency control, internal structure, and how to explain it clearly in an interview.
```

Descriptions should be useful.

---

# 67. Meta Description Duplication

Large-scale pages should avoid identical descriptions.

If no meaningful unique description can be generated:

It may be better to omit the description than publish thousands of duplicated boilerplate descriptions.

---

# 68. Heading Architecture

Every page should generally have one clear H1 representing its primary topic.

Subheadings should follow content hierarchy.

Do not use heading tags solely for visual styling.

Avoid:

```text
H1
→ H4
→ H2
```

without structural reason.

---

# 69. Question Page Heading Rule

The question itself should usually be the H1.

Example:

```text
H1:
How does ConcurrentHashMap work in Java?
```

The answer sections may use H2 and H3.

---

# 70. Module Page Heading Rule

The module title should be the H1.

Question links in the list should not all become H1s.

Use appropriate semantic structure.

---

# 71. Image SEO

Images should exist because they help users.

Not because SEO checklists demand them.

When meaningful images exist:

* use descriptive alt text,
* appropriate dimensions,
* efficient formats,
* lazy loading where appropriate.

Do not stuff keywords into alt text.

Decorative images should use appropriate empty alt behavior.

---

# 72. Structured Data Philosophy

Structured data should describe reality.

It should not attempt to trick search engines into displaying enhanced results.

Use schema only when:

* the content matches the schema type,
* required properties are valid,
* the markup reflects visible content,
* current search engine guidelines support the use case.

---

# 73. Organization / Website Structured Data

Site-level structured data may describe:

* organization,
* website,
* search capability where valid.

Implementation should be centralized.

Do not duplicate conflicting organization schema across every component.

---

# 74. Breadcrumb Structured Data

Breadcrumb structured data may be appropriate when it matches visible page hierarchy.

It should use the canonical hierarchy.

---

# 75. Article Structured Data

Do not automatically label every question page as an Article.

Schema selection should match the actual content and publishing model.

---

# 76. FAQ Structured Data

Do not assume interview questions automatically qualify for FAQ rich results.

Search engine policies change.

Schema should not be implemented merely for hoped-for SERP enhancement.

---

# 77. Q&A Structured Data

A question page is not automatically a community Q&A page.

Schema semantics matter.

Do not misuse QAPage markup for pages that do not meet the required content model.

---

# 78. Structured Data Validation

Automated or scheduled validation should detect:

* invalid JSON-LD,
* incorrect URLs,
* missing required properties,
* duplicate conflicting schema,
* schema not matching visible content.

---

# 79. Content Quality Threshold

Before a page becomes indexable, evaluate:

```text
Distinct Search Intent
Substantive Value
Unique Content
Clear Structure
Useful Internal Links
No Duplicate Canonical Intent
Stable URL
Technical Eligibility
```

A page should not be indexed merely because content exists in the database.

---

# 80. Thin Content Detection

Potential signals:

```text
Very little unique text
Only a title and links
Near-duplicate introduction
No meaningful answer
Empty module
Generated category with one item
Company page with generic boilerplate
```

Thin-page detection should combine:

* automated signals,
* page-type thresholds,
* editorial judgment.

Word count alone is insufficient.

---

# 81. Duplicate Content Detection

Potential duplicate sources:

```text
Same question in multiple modules
Different slugs for same question
Company pages reusing generic content
Role pages copying track content
HTTP / HTTPS duplicates
WWW / non-WWW duplicates
Trailing slash variants
Query parameter variants
```

The system should detect both:

* technical duplicates,
* content duplicates.

---

# 82. Question Deduplication

Questions may be semantically identical despite different wording.

Example:

```text
How does HashMap work internally?

Explain the internal working of HashMap.

What happens inside a Java HashMap?
```

These may represent one search intent.

Before creating separate indexable pages:

Determine whether:

* they deserve distinct answers,
* they should be aliases,
* or they should consolidate into one canonical question.

---

# 83. Content Alias Strategy

The system may support:

```text
Canonical Question
+
Alternative Search Phrasings
```

without creating separate indexable pages for every phrasing.

Aliases may help:

* internal search,
* discovery,
* content generation,
* redirects.

This can prevent URL explosion.

---

# 84. Programmatic SEO Definition

Programmatic SEO is not:

```text
Generate thousands of pages
```

A healthy programmatic system is:

```text
Structured Data
+
Real Distinct User Intent
+
Useful Page Template
+
Unique Valuable Content
+
Controlled Indexation
+
Quality Monitoring
```

Scale should come after quality.

---

# 85. Programmatic Page Gate

Before a new page family is allowed to scale:

Validate a sample manually.

Example:

```text
10 pages
→ review

50 pages
→ indexation observation

100 pages
→ search performance observation

Then scale gradually
```

Do not generate 20,000 indexable pages before understanding how the first 100 perform.

---

# 86. Indexation Quality Ratio

Monitor:

```text
Indexed Eligible Pages
÷
Submitted Eligible Pages
```

This ratio should be interpreted by page type.

A low ratio may indicate:

* thin content,
* duplicate intent,
* poor discovery,
* technical issues,
* low perceived value,
* or simply insufficient time.

Do not diagnose solely from one metric.

---

# 87. Search Console Page Classification

Important categories may include:

```text
Indexed
Crawled — Currently Not Indexed
Discovered — Currently Not Indexed
Duplicate
Alternate Page With Proper Canonical
Excluded by Noindex
Blocked
Not Found
Redirect
Server Error
```

Each category represents a different problem.

Do not treat all “not indexed” pages as the same issue.

---

# 88. Discovered — Currently Not Indexed

Possible causes include:

* low crawl priority,
* too many low-value URLs,
* weak internal linking,
* site newness,
* crawl capacity.

Actions may include:

* improve internal links,
* reduce low-value URL generation,
* strengthen page quality,
* ensure sitemap correctness.

---

# 89. Crawled — Currently Not Indexed

Possible causes include:

* insufficient distinct value,
* duplication,
* weak content,
* unclear canonical signals,
* quality concerns.

Repeated manual resubmission is not a scalable solution.

The page itself or the architecture usually needs improvement.

---

# 90. Indexing Request Policy

Manual indexing requests may be useful for:

* important new pages,
* testing fixes,
* selected priority pages.

They are not the primary strategy for thousands of URLs.

Scalable indexation depends on:

* discovery,
* quality,
* crawlability,
* consistency.

---

# 91. Search Console Monitoring

Monitor at minimum:

```text
Total Clicks
Total Impressions
CTR
Average Position
Indexed Pages
Excluded Pages
Sitemap Status
Core Web Vitals
Manual Actions
Security Issues
```

Interpret trends by page type and query class.

---

# 92. Impressions Are Not Users

Search impressions represent appearances in search results.

They are not:

* page views,
* visitors,
* Cloudflare requests.

Cloudflare traffic may include:

* assets,
* bots,
* crawlers,
* API requests,
* repeated requests.

Analytics systems measure different things.

Do not compare raw numbers without understanding definitions.

---

# 93. Average Position Interpretation

Average position is an aggregate.

It may change because:

* new queries appear,
* different pages receive impressions,
* ranking changes,
* query mix changes.

A site average moving from:

```text
8.8
to
12.6
```

does not automatically mean every ranking declined.

Analyze:

* query,
* page,
* country,
* device,
* date range.

---

# 94. CTR Interpretation

CTR depends heavily on:

* position,
* query intent,
* title,
* snippet,
* SERP features,
* brand recognition.

Low CTR at low ranking positions may be normal.

Do not optimize titles for clicks at the expense of relevance.

---

# 95. Search Analytics Segmentation

Performance should be segmented by:

```text
Page Type
Track
Topic
Query Type
Brand vs Non-Brand
Device
Country
New vs Established Page
```

Aggregate site metrics can hide useful patterns.

---

# 96. SEO Observability Dashboard

Eventually create an internal SEO health view.

Potential metrics:

```text
Published URLs
Index-Eligible URLs
Sitemap URLs
Indexed URLs
Orphan URLs
Broken Internal Links
Duplicate Titles
Missing Canonicals
Noindex Conflicts
Redirect Chains
404 Internal Links
Page-Type Indexation Ratio
```

This does not need to be a public product feature.

It is operational infrastructure.

---

# 97. Automated SEO Audit

The repository should eventually support a repeatable audit.

Potential checks:

```text
HTTP Status
Title
Description
H1
Canonical
Robots
Open Graph
Structured Data
Internal Links
Broken Links
Image Alt
Sitemap Inclusion
Indexability
```

This should run against representative or generated routes.

---

# 98. CI SEO Validation

High-confidence checks can run in CI.

Examples:

```text
Missing canonical on public page
Multiple H1s where prohibited
Broken internal route
Invalid sitemap generation
Noindex on critical production archetype
Canonical to wrong host
```

Do not make CI dependent on fragile external SEO scores.

Test deterministic properties.

---

# 99. Production SEO Smoke Test

After deployment, automatically verify representative URLs.

Example set:

```text
Homepage
One Track
One Major Area
One Module
Three Questions
One Company Page
One Role Page
robots.txt
sitemap.xml
```

Check:

```text
Status
Canonical
Robots
Title
H1
Rendered Content
```

---

# 100. Search Engine Access Testing

The system should verify that public pages are accessible without:

* authentication,
* cookies,
* browser-only state,
* client-side interaction.

Search-critical content should be present reliably.

---

# 101. Core Web Vitals

SEO and UX performance overlap.

Important metrics include:

```text
LCP
INP
CLS
```

The implementation should prioritize actual user experience.

Do not optimize synthetic scores while making the interface worse.

---

# 102. Largest Contentful Paint

Potential LCP problems:

* oversized hero images,
* slow fonts,
* blocking CSS,
* delayed server response,
* client-rendered primary content.

Question pages should usually have a relatively simple primary content path.

---

# 103. Interaction to Next Paint

Potential INP problems:

* heavy client JavaScript,
* large hydration trees,
* expensive search interactions,
* unnecessary event handlers.

Public reading pages should remain lightweight.

---

# 104. Cumulative Layout Shift

Potential CLS problems:

* images without dimensions,
* ads inserted above content,
* late-loading fonts,
* dynamic headers,
* skeletons not matching content.

The page should remain visually stable.

---

# 105. Font Performance

Use:

* limited font families,
* necessary weights only,
* appropriate loading strategy.

Do not load many font variants merely for visual nuance.

Typography quality and performance must coexist.

---

# 106. Image Performance

Use responsive image behavior where appropriate.

Avoid:

* enormous images for small display areas,
* unnecessary homepage media,
* loading all below-fold imagery immediately.

---

# 107. Third-Party Script Policy

Third-party scripts can damage:

* performance,
* privacy,
* reliability.

Every script should justify its cost.

Potential categories:

```text
Analytics
Error Monitoring
Authentication
Payments
Support
```

Do not accumulate scripts without ownership.

---

# 108. Analytics and SEO Separation

Analytics failures should not prevent content rendering.

Search-critical pages should remain usable if analytics scripts fail.

---

# 109. Content Freshness

Not every page requires frequent updates.

Freshness should reflect actual content change.

Stable technical concepts may remain useful for years.

Company process information may require more frequent review.

The system should distinguish:

```text
Evergreen
Periodically Reviewed
Time-Sensitive
```

---

# 110. Last Updated Display

Display “Last Updated” only when it is meaningful.

Do not change dates automatically on deployment.

False freshness damages trust.

---

# 111. Content Review Metadata

Internal content records may eventually contain:

```text
Created At
Meaningfully Updated At
Last Reviewed At
Review Due At
Content Owner
Indexability Status
```

Not every field needs public display.

---

# 112. Company Content Freshness

Company interview information may change.

Potential architecture:

```text
Stable Preparation Guidance
+
Time-Sensitive Process Information
```

Time-sensitive claims should have:

* source confidence,
* review date,
* cautious wording where necessary.

---

# 113. Content Removal Policy

When content is removed:

Ask:

```text
Is there an equivalent replacement?
```

If yes:

Permanent redirect.

If no:

Return appropriate 404 or 410.

Do not redirect every deleted page to:

* homepage,
* parent category,

unless that destination genuinely satisfies the old intent.

---

# 114. Content Merge Policy

When duplicate pages are merged:

```text
Choose strongest canonical destination

Merge useful content

Redirect duplicate URLs

Update internal links

Update sitemap

Remove duplicate from indexable inventory
```

---

# 115. Content Split Policy

If one page becomes multiple pages:

Do not automatically redirect the old page to one arbitrary child.

The old page may remain as:

* a hub,
* an overview,
* or redirect only if one new page fully replaces its intent.

---

# 116. Multilingual Future

If Interview Explainer later supports multiple languages:

The architecture must define:

* language-specific URLs,
* canonical behavior,
* hreflang,
* translated content quality.

Do not automatically machine-translate thousands of indexable pages without quality control.

This is a future concern.

Do not implement prematurely.

---

# 117. Geographic Targeting

Interview preparation may differ by market.

If geography-specific pages are introduced:

They should exist only when content meaningfully differs.

Avoid generating:

```text
Java Interview Questions India
Java Interview Questions USA
Java Interview Questions UK
```

with nearly identical content.

---

# 118. Mobile Search Experience

Search engines use mobile-first indexing principles.

Therefore:

The mobile version must not remove essential search content that exists on desktop.

Responsive simplification may remove decorative or secondary interface elements.

It should not remove the primary content.

---

# 119. Hidden Content

Content hidden through legitimate responsive or disclosure patterns can be useful.

However:

Do not hide large volumes of SEO-targeted text merely to manipulate search visibility.

User-facing and search-facing content should remain aligned.

---

# 120. Accessibility and SEO Alignment

Good semantic structure supports both:

* accessibility,
* search understanding.

Examples:

```text
Real links
Semantic headings
Landmarks
Descriptive text
Accessible images
```

Do not sacrifice semantics for visual convenience.

---

# 121. Search Result Snippet Quality

Search snippets may derive from:

* title,
* meta description,
* visible page content.

Therefore:

The opening content should clearly establish the page topic.

Avoid generic openings repeated across thousands of pages.

---

# 122. Question Opening Pattern

A question page should begin with a useful direct response.

Avoid repetitive boilerplate such as:

```text
In today's competitive world, interviews are very important. In this comprehensive guide, we will discuss...
```

This weakens both:

* user experience,
* content distinctiveness.

---

# 123. Template Duplication Risk

Large-scale content systems naturally reuse page structure.

That is acceptable.

What should not be duplicated excessively is the substantive content.

The distinction is:

```text
Shared UI Template
→ Good

Shared Generic Paragraphs on Thousands of Pages
→ Risk
```

---

# 124. AI-Generated Content Governance

AI may assist content production.

AI output must not automatically become:

```text
Published
+
Indexable
```

The content pipeline should include quality gates.

Potential checks:

```text
Distinctness
Accuracy
Completeness
Intent Match
Structure
Duplication
Readability
Internal Linking
```

---

# 125. AI SEO Prohibition

AI agents must not:

* create pages solely from keyword permutations,
* generate thousands of indexable pages without review,
* keyword-stuff headings,
* fabricate company interview processes,
* create duplicate question variants,
* add schema that does not match content,
* change canonical rules casually,
* or change existing URLs without migration analysis.

---

# 126. Search Quality Gate for New Content Families

Before launching a new indexable page family:

Example:

```text
Company × Role Pages
```

validate:

```text
Does each page have distinct intent?

Can each page contain distinct value?

Can content quality be maintained?

Will internal linking support discovery?

Can freshness be maintained?

Can we monitor indexation separately?
```

If not:

Do not scale the page family.

---

# 127. Search Quality Gate for Individual Pages

A page should not become INDEX merely because:

```text
title exists
+
slug exists
+
database row exists
```

Minimum eligibility should be explicitly defined by page type.

---

# 128. Question Indexability Gate

Potential requirements:

```text
Published
Canonical slug exists
Substantive answer exists
Distinct question intent
No duplicate canonical question
Parent module exists
At least one internal incoming link
Valid metadata
200 response
```

The exact thresholds should be implemented in the content model.

---

# 129. Module Indexability Gate

Potential requirements:

```text
Published
Meaningful module identity
Useful introduction or contextual value
Sufficient substantive child content
Crawlable question links
Distinct intent
No duplicate module intent
```

An empty module should not be indexed.

---

# 130. Company Page Indexability Gate

Potential requirements:

```text
Distinct company preparation value
Substantive preparation content
Reliable information
Relevant role or topic connections
Not generic boilerplate
```

Do not create an indexable company page merely because a company name exists.

---

# 131. Indexation Rollout Strategy

For a new site or major content expansion:

Prefer controlled rollout.

Example:

```text
Phase 1
Core tracks + strongest questions

Phase 2
Major areas + modules

Phase 3
Expanded high-quality questions

Phase 4
Company / role pages after quality validation
```

This helps establish a stronger quality signal than releasing a huge weak inventory.

---

# 132. Sitemap Rollout Strategy

The sitemap should reflect only the pages currently intended for indexing.

Do not include future or incomplete routes.

---

# 133. Search Console Validation Strategy

After major SEO changes:

Monitor:

```text
Sitemap Processing
Page Discovery
Indexation
Canonical Selection
Impressions
Queries
Clicks
Errors
```

Do not judge a structural SEO change after one or two days.

Search engines require time to recrawl and reassess.

---

# 134. SEO Change Log

Major search-impacting changes should be recorded.

Examples:

```text
Date
Change
Affected Routes
Expected Impact
Migration / Redirect Details
Validation Result
```

This helps explain later metric changes.

---

# 135. SEO Incident Examples

Potential incidents:

```text
Production accidentally noindexed
robots.txt blocks site
Canonical points to localhost
Sitemap contains staging URLs
Question routes return soft 404
Redirect loop
All pages use same title
Client error removes answer content
```

These should be treated as production incidents.

---

# 136. SEO Incident Response

When a major issue is discovered:

```text
1. Confirm scope.
2. Stop further deployment if necessary.
3. Fix root cause.
4. Validate representative pages.
5. Deploy.
6. Confirm production behavior.
7. Update sitemap if needed.
8. Request recrawl for critical URLs where useful.
9. Monitor recovery.
10. Document the incident.
```

---

# 137. Production SEO Guardrails

Critical guardrails should prevent deployment when:

```text
Homepage is noindex
Canonical host is wrong
Sitemap generation fails
robots.txt blocks all public content
Representative question page lacks answer HTML
Critical route returns non-200
```

---

# 138. SEO Testing Matrix

Test representative combinations.

```text
PAGE TYPES

Homepage
Track
Major Area
Module
Question
Company
Role
Search
Dashboard

STATES

Valid
Invalid Slug
Draft
Noindex
Redirected
Empty
Long Content

ENVIRONMENTS

Local
Preview
Production
```

---

# 139. Search Architecture Ownership

SEO should not be spread across:

```text
random page files
+
random layout files
+
random middleware
+
manual sitemap
```

Define clear ownership for:

```text
Metadata Generation
Canonical Generation
Indexability Policy
Sitemap Generation
Robots
Redirects
Structured Data
SEO Validation
```

---

# 140. Suggested Technical SEO Module Structure

The exact implementation depends on the repository.

Conceptually:

```text
seo/
├── metadata
├── canonical
├── robots
├── structured-data
├── indexability
├── sitemap
├── redirects
└── validation
```

Do not force this exact folder structure if the current framework has a more natural convention.

The principle is centralized policy.

---

# 141. SEO Configuration

Central configuration may include:

```text
Production Origin
Canonical Host
Brand Name
Default Social Image
Page-Type Title Templates
Default Robots Policy
Sitemap Rules
```

Avoid hardcoding production URLs in many files.

---

# 142. Production Origin

The application should have one trusted production origin.

Example conceptually:

```text
https://www.interviewexplainer.com
```

All canonical URL generation should derive from one controlled source.

Do not infer production origin from arbitrary request headers without considering proxy and security implications.

---

# 143. Metadata Fallback Rules

Fallbacks should prevent broken metadata.

However:

Fallbacks should not create thousands of identical titles.

Example:

If a question has no valid title:

That may indicate the page should not be published.

Do not hide content-model failures behind generic SEO fallbacks.

---

# 144. Search-Facing Content Inventory

Maintain an inventory of page families.

Example:

```text
Page Type
Current Count
Published Count
Index-Eligible Count
Sitemap Count
Indexed Count
Organic Clicks
Organic Impressions
```

This becomes increasingly valuable as the site grows.

---

# 145. Search Growth Should Be Measured by Useful Pages

A healthy growth metric is not:

```text
We generated 50,000 URLs.
```

Better:

```text
We have 2,000 high-quality indexable pages.

1,700 are indexed.

900 receive impressions.

300 receive clicks.

Topical coverage and engagement are growing.
```

Quality-adjusted coverage matters.

---

# 146. Early-Stage Search Expectations

For a newly launched domain:

Search growth may be uneven.

Possible early behavior:

```text
Pages discovered
→ impressions begin
→ rankings fluctuate
→ indexation expands
→ some pages disappear/reappear
→ query coverage grows
```

A few days of data are not sufficient for long-term conclusions.

The architecture should be fixed early.

Performance should be judged over longer windows.

---

# 147. What 85 or 180 Impressions Means

Early impressions indicate that Google has begun:

* discovering pages,
* testing pages against queries,
* and collecting ranking signals.

It does not guarantee stable ranking.

At an early stage, the priorities should be:

```text
Technical Indexability
Page Quality
Internal Linking
Content Expansion
Search Intent Coverage
Performance
```

Not immediate advertising monetization.

---

# 148. When Advertising Becomes Relevant

Advertising decisions should depend more on:

```text
Actual Human Sessions
Page Views
Engagement
Audience Geography
Content Experience
Revenue Per Thousand Views
```

than raw Search Console impressions.

Search impressions are not ad impressions.

At very low traffic:

Advertising usually provides negligible revenue while potentially degrading UX.

V2 should prioritize:

* audience growth,
* retention,
* product value,
* future premium conversion paths.

---

# 149. Search Is One Acquisition Channel

Interview Explainer should eventually support:

```text
Organic Search
Direct
Social
Communities
Referrals
Content Distribution
Potential Partnerships
Product-Led Sharing
```

SEO should be important.

It should not become the only growth engine.

---

# 150. SEO Success Definition

SEO success is not:

```text
Every URL indexed.
```

Success is:

```text
The right pages are indexed.

They rank for relevant intent.

Users find valuable answers.

Users continue through the product.

The site earns stronger topical authority over time.
```

---

# 151. V2 SEO Implementation Order

Recommended implementation sequence:

```text
PHASE 1 — AUDIT

1. Crawl current production site.
2. Inventory all public routes.
3. Inventory status codes.
4. Inventory titles and descriptions.
5. Inventory canonicals.
6. Inventory robots directives.
7. Inventory sitemap URLs.
8. Identify duplicate URLs.
9. Identify broken links.
10. Identify orphan pages.
11. Identify current indexed pages.
12. Preserve existing traffic-bearing URLs.

PHASE 2 — FOUNDATION

13. Define canonical production origin.
14. Define URL normalization.
15. Centralize metadata generation.
16. Centralize canonical generation.
17. Define page-type indexability policy.
18. Fix robots.txt.
19. Rebuild sitemap architecture.
20. Add environment protection.

PHASE 3 — PAGE ARCHETYPES

21. Implement correct metadata per archetype.
22. Implement semantic heading structure.
23. Implement breadcrumbs.
24. Implement parent-child links.
25. Implement previous / next navigation.
26. Improve question-page rendering.
27. Improve module crawlability.

PHASE 4 — QUALITY CONTROL

28. Add indexability gates.
29. Detect thin pages.
30. Detect duplicates.
31. Detect orphan pages.
32. Validate structured data.
33. Validate status codes.
34. Validate canonical consistency.

PHASE 5 — OBSERVABILITY

35. Add SEO audit tooling.
36. Add CI checks.
37. Add production smoke tests.
38. Segment Search Console monitoring.
39. Track indexation by page type.
40. Maintain SEO change log.

PHASE 6 — CONTROLLED SCALE

41. Expand strongest topic clusters.
42. Observe indexation.
43. Observe query coverage.
44. Improve weak page families.
45. Scale only validated structures.
```

---

# 152. Immediate Current-Site Priority

Based on the current stage of Interview Explainer, the immediate objective should not be:

```text
Generate more URLs as fast as possible.
```

It should be:

```text
Understand the current URL inventory

Ensure Google can discover the important pages

Ensure those pages are technically indexable

Ensure the pages are linked structurally

Ensure the sitemap contains the correct URLs

Ensure canonical signals agree

Ensure question pages provide distinct value

Then expand content systematically
```

---

# 153. The Indexing Debugging Framework

When a page is not indexed:

Check in this order.

```text
1. Does the URL exist?

2. Does it return 200?

3. Is it publicly accessible?

4. Is robots.txt allowing crawl?

5. Is there a noindex directive?

6. What canonical does the page declare?

7. What canonical did Google select?

8. Is the URL in the correct sitemap?

9. Are internal pages linking to it?

10. Is the primary content available in rendered HTML?

11. Is the page substantially unique?

12. Does another page satisfy the same intent better?

13. Is the page part of a low-quality or excessive URL pattern?

14. Has Google had enough time to process it?
```

Do not begin with:

```text
Request indexing again.
```

until the underlying page has been inspected.

---

# 154. The Search Growth Flywheel

The intended long-term system is:

```text
Strong Track Architecture
        ↓
Strong Modules
        ↓
Strong Question Pages
        ↓
Better Internal Linking
        ↓
More Search Discovery
        ↓
More User Behavior Data
        ↓
Better Understanding of Demand
        ↓
Better Content Prioritization
        ↓
Stronger Track Architecture
```

Search growth should reinforce product quality.

---

# 155. The Content Expansion Rule

New content should preferably expand:

```text
Existing strong topical clusters
```

before creating:

```text
hundreds of disconnected topics
```

Example:

Better:

```text
Java Backend
→ Deep, coherent coverage
```

than:

```text
10 questions each across 100 unrelated technologies
```

when authority and product depth are still developing.

---

# 156. Topical Cluster Strategy

A strong cluster may contain:

```text
Track Hub
    ↓
Major Areas
    ↓
Modules
    ↓
Questions
    ↓
Related Questions
```

This creates:

* coherent user journeys,
* strong internal linking,
* clear semantic relationships,
* better content management.

---

# 157. Search Demand Should Influence Prioritization

Search demand can help determine:

* which modules to expand,
* which questions to improve,
* which new tracks to build.

However:

Search volume should not be the only input.

Other inputs include:

```text
Interview Importance
User Need
Product Strategy
Content Quality Capability
Competitive Opportunity
```

---

# 158. Search Console as Product Feedback

Search queries can reveal:

* how users phrase questions,
* missing topics,
* unexpected demand,
* title mismatch,
* search intent mismatch.

This information can improve:

* content,
* navigation,
* internal search,
* taxonomy.

Search data should inform product decisions.

---

# 159. No SEO Score as Source of Truth

Third-party SEO scores may help identify issues.

They are not the objective.

A site can receive:

```text
95 / 100
```

from an audit tool and still have:

* weak content,
* poor search intent,
* no authority,
* no users.

The source of truth is:

```text
Technical Health
+
Search Visibility
+
Relevant Traffic
+
User Value
+
Business Outcomes
```

---

# 160. AI Agent SEO Governance

Before an AI coding agent changes anything affecting public URLs or metadata, it must determine:

```text
What page archetype is affected?

Is the page intended to be indexed?

What is the canonical URL?

Will an existing URL change?

Will internal links change?

Will sitemap output change?

Will robots behavior change?

Could this create duplicates?

Could this create a crawl trap?

How will the change be validated?
```

The agent must not make SEO-impacting architectural changes as incidental cleanup.

---

# 161. AI Agent SEO Prohibitions

AI agents must not:

* bulk change slugs,
* change hostname assumptions,
* remove canonical tags,
* add `noindex` globally,
* alter robots.txt casually,
* generate arbitrary sitemap URLs,
* add all database records to sitemap,
* create indexable search/filter combinations,
* create duplicate metadata templates,
* misuse structured data,
* redirect all missing pages to homepage,
* or generate thousands of SEO pages without an approved page family.

---

# 162. SEO Definition of Done for a New Public Page

Before an indexable page is considered complete:

```text
[ ] Returns correct 200 response
[ ] Has one stable canonical URL
[ ] Canonical uses production origin
[ ] Has correct robots directive
[ ] Has unique useful title
[ ] Has appropriate H1
[ ] Has useful visible content
[ ] Primary content is render-accessible
[ ] Has meaningful incoming internal link
[ ] Has parent / contextual navigation
[ ] Is included in sitemap if intended
[ ] Sitemap URL matches canonical
[ ] No duplicate route serves same content unintentionally
[ ] Mobile content preserves primary value
[ ] Structured data is valid if present
[ ] Page passes representative production validation
```

---

# 163. SEO Definition of Done for V2 Migration

Before V2 is considered search-safe:

```text
[ ] Existing public URLs inventoried
[ ] Traffic-bearing URLs identified
[ ] URL changes mapped
[ ] Redirects implemented
[ ] Redirect chains removed
[ ] Canonical host consistent
[ ] HTTP redirects correctly
[ ] WWW policy consistent
[ ] Trailing slash policy consistent
[ ] robots.txt validated
[ ] Production pages are not accidentally noindex
[ ] Preview environments protected
[ ] Sitemap contains only intended canonical URLs
[ ] Sitemap segmentation works
[ ] Question pages render meaningful content
[ ] Internal linking hierarchy works
[ ] Breadcrumbs work
[ ] Broken internal links checked
[ ] Soft 404s checked
[ ] Orphan pages checked
[ ] Metadata generation centralized
[ ] Search pages have explicit indexation policy
[ ] Filter URLs have explicit policy
[ ] Core Web Vitals baseline recorded
[ ] Production SEO smoke test passes
```

---

# 164. Final SEO Architecture Principle

Interview Explainer should not ask:

> How do we make Google index everything?

It should ask:

> Which pages deserve to be discovered, and how do we make their value unmistakably accessible?

The permanent SEO principles are:

> **A URL is not automatically a search destination.**

> **Published does not automatically mean indexable.**

> **A sitemap helps discovery; it does not guarantee indexing.**

> **Canonical signals must agree across the entire system.**

> **Stable URLs are infrastructure.**

> **Internal linking is part of product architecture.**

> **Question pages must satisfy distinct intent.**

> **Modules organize questions; they should not duplicate them.**

> **Search and filter pages require controlled indexation.**

> **Private pages require real access control.**

> **Public content should not depend unnecessarily on client-side rendering.**

> **Programmatic SEO means controlled useful scale—not mass URL generation.**

> **The right pages indexed is better than every page indexed.**

> **SEO architecture must be observable and testable.**

> **Search growth should strengthen the product rather than distort it.**

The long-term objective is a search architecture capable of supporting:

```text
Hundreds
→ Thousands
→ Potentially Tens of Thousands
```

of useful interview preparation pages without losing:

* quality,
* clarity,
* crawlability,
* canonical consistency,
* user experience,
* or architectural control.

Interview Explainer should become a large site only because it contains a large amount of useful knowledge.

Not because it learned how to generate a large number of URLs.
