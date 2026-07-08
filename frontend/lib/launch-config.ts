/**
 * launch-config.ts
 *
 * Single source of truth for "what is live on the public site RIGHT NOW".
 *
 * MVP launch scope (see ROADMAP.md at repo root): Java + Python only.
 * Every other language, every non-core hub (System Design, DSA, Behavioral,
 * Tools, Compare, Companies, Career, Roadmaps, Cheatsheets), and every
 * non-core surface (Mock Interviews, Search) stays in the codebase but is
 * hidden from the UI via this file.
 *
 * When a feature is ready to launch, flip its flag here — DO NOT re-add the
 * link text in the header/footer/home page by hand. That's how drift happens.
 */

// ─── Languages ───────────────────────────────────────────────────────────────
// Lowercase slugs the home-page language tiles + /domains filter match against.
// Add "javascript" / "typescript" / "go" / "ruby" / "kotlin" / "csharp" here
// once their content packs are production-ready.
export const ENABLED_LANGUAGES = ['java', 'python', 'go', 'ruby', 'frontend'] as const;

export type EnabledLanguage = typeof ENABLED_LANGUAGES[number];

/**
 * True if the lowercase language slug should be surfaced as a clickable tile.
 * Languages not in this list still render in the home "Pick Your Language"
 * grid but as greyed-out "Soon" placeholders (see `LANGUAGES` in app/page.tsx).
 */
export function isLanguageEnabled(slug: string): boolean {
  return (ENABLED_LANGUAGES as readonly string[]).includes(slug.toLowerCase());
}

// ─── Hubs (top-level verticals on the home page + header) ────────────────────
//
// Each hub owns a landing page under frontend/app/{slug}/. The page files
// still exist — flipping a flag to `false` just hides every link into them.
// The URL itself will still render the page if someone knows it (which is
// fine for staging / internal QA); it just won't be discoverable from the UI.
//
// When flipping one to `true`, make sure the page:
//   1. Doesn't ship placeholder text ("Coming soon", lorem ipsum, etc.)
//   2. Has all its internal links pointing at real pages
//   3. Renders in < 200 ms in production
export const ENABLED_HUBS = {
  // Core interview prep — always live for MVP.
  interviewQA:     true,   // /domains — curated Q&A browser (Java + Python)
  prepCategories:  true,   // /prep — Quick-Links index of all pillar hubs + module SEO URLs

  // Secondary hubs — landing pages exist but content is not launch-ready.
  systemDesign:    false,  // /system-design
  dsa:             true,   // /dsa
  behavioral:      false,  // /behavioral
  topics:          false,  // /topics
  tools:           false,  // /tools
  compare:         false,  // /compare
  companies:       false,  // /companies
  career:          false,  // /career
  roadmaps:        false,  // /roadmaps
  cheatsheets:     false,  // /cheatsheets

  // Product surfaces.
  dashboard:       true,   // /dashboard — works for logged-in users
  mockInterviews:  true,  // /mock-interviews — requires a backend that's not wired for MVP
  search:          false,  // /search — indexer not populated for launch scope yet
  interviewByLang: false,  // /interview — legacy "browse by language" tree; superseded by /domains
} as const;

export type HubKey = keyof typeof ENABLED_HUBS;

export function isHubEnabled(hub: HubKey): boolean {
  return ENABLED_HUBS[hub] === true;
}

// ─── Quick-start career paths surfaced on the home page ──────────────────────
//
// Every `href` here MUST resolve to a live page (either a canonical domain
// slug handled by proxy.ts or a hardcoded route). If you need a path that
// doesn't exist yet, add it to ROADMAP.md instead of linking a 404.
export interface LaunchQuickPath {
  title: string;
  level: string;
  topics: string;
  gradient: string;
  href: string;
  icon: string;
}

export const LAUNCH_QUICK_PATHS: LaunchQuickPath[] = [
  {
    title:  'Java Backend Engineer',
    level:  'Fresher (0–2 yrs)',
    topics: 'Core Java • OOP • Collections • Spring Boot • SQL • DSA • Git',
    gradient: 'from-orange-500 to-red-600',
    href:   '/java-backend-fresher',
    icon:   'java',
  },
  {
    title:  'Java Backend Engineer',
    level:  'Intermediate (2–5 yrs)',
    topics: 'Spring Boot • REST • JPA • Microservices • System Design',
    gradient: 'from-orange-500 to-red-600',
    href:   '/java-backend-intermediate',
    icon:   'java',
  },
  {
    title:  'Java Fullstack Engineer',
    level:  'Intermediate (2–5 yrs)',
    topics: 'Java • Spring Boot • React • Angular • TypeScript • CSS',
    gradient: 'from-orange-500 to-red-600',
    href:   '/java-fullstack-intermediate',
    icon:   'java',
  },
  {
    title:  'Python Backend Developer',
    level:  'Fresher (0–2 yrs)',
    topics: 'Python Basics • OOP • Django • REST APIs • SQL',
    gradient: 'from-blue-500 to-cyan-600',
    href:   '/python-backend-fresher',
    icon:   'python',
  },
  {
    title:  'Python Backend Developer',
    level:  'Intermediate (2–5 yrs)',
    topics: 'Django • FastAPI • PostgreSQL • Redis',
    gradient: 'from-blue-500 to-cyan-600',
    href:   '/python-backend-intermediate',
    icon:   'python',
  },
  {
    title:  'Python Data Engineer',
    level:  'Intermediate (2–5 yrs)',
    topics: 'ETL • Airflow • Spark • Warehousing',
    gradient: 'from-blue-500 to-cyan-600',
    href:   '/python-data-engineering-intermediate',
    icon:   'python',
  },
  {
    title:  'Python ML/AI Engineer',
    level:  'Intermediate (2–5 yrs)',
    topics: 'Feature Eng • Model Serving • MLOps • LLMs',
    gradient: 'from-blue-500 to-cyan-600',
    href:   '/python-ml-ai-intermediate',
    icon:   'python',
  },
  {
    title:  'Go Backend Engineer',
    level:  'Fresher (0–2 yrs)',
    topics: 'Go Basics • Goroutines • Interfaces • Error Handling • HTTP',
    gradient: 'from-cyan-500 to-teal-600',
    href:   '/go-fresher',
    icon:   'go',
  },
  {
    title:  'Go Backend Engineer',
    level:  'Intermediate (2–6 yrs)',
    topics: 'Goroutines • gRPC • Gin • GORM • System Design',
    gradient: 'from-cyan-500 to-teal-600',
    href:   '/go-intermediate',
    icon:   'go',
  },
  {
    title:  'DSA Interview Prep',
    level:  'All Levels',
    topics: 'Arrays • Trees • Graphs • DP • Backtracking • Java & Python',
    gradient: 'from-blue-500 to-blue-600',
    href:   '/dsa',
    icon:   'layers',
  },
  {
    title:  'Ruby Backend Engineer',
    level:  'Fresher (0–2 yrs)',
    topics: 'Ruby Basics • OOP • Blocks • Rails Basics • SQL • Git',
    gradient: 'from-red-500 to-rose-600',
    href:   '/ruby-backend-fresher',
    icon:   'ruby',
  },
  {
    title:  'Ruby Backend Engineer',
    level:  'Intermediate (2–5 yrs)',
    topics: 'Rails MVC • Active Record • APIs • Sidekiq • System Design',
    gradient: 'from-red-500 to-rose-600',
    href:   '/ruby-backend-intermediate',
    icon:   'ruby',
  },
];
