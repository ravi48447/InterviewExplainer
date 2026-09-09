/**
 * demoEcosystem.ts — seeded demo data for the whole product web.
 * One coherent story: a mid-prep candidate whose resume → gaps → mock →
 * dashboard all reference each other. Guests see purpose; real data replaces
 * every piece on login. Deterministic (stable across reloads).
 */

export const DEMO_PROFILE = {
  name: 'Aisha V.',
  role: 'Backend Engineer · 4 yrs',
  domain: 'ruby-backend-fresher',
};

// ---------- resume demo ----------
export const DEMO_RESUME_TEXT = `Aisha Verma
Backend Engineer — 4 years

EXPERIENCE
FinPay Systems (2023–Present)
- Built payment reconciliation services in Ruby on Rails handling 2M transactions/day
- Reduced N+1 queries with eager loading and database indexes, cutting p95 latency by 40%
- Implemented JWT authentication with role-based authorization for 3 product teams
- Led migration of nightly jobs to Sidekiq, cutting run-time from 6 hours to 40 minutes

CartLabs (2022–2023)
- Shipped REST APIs consumed by two mobile clients; wrote RSpec + Minitest coverage
- Containerized services with Docker; ran PostgreSQL schema migrations with zero downtime

SKILLS
Ruby, Rails, Sidekiq, PostgreSQL, Redis, RSpec, Docker, REST APIs, Git

EDUCATION
B.Tech, Computer Science`;

export const DEMO_RESUME = {
  parse: { method: 'docx', words: 96, confidence: 'high' },
  skills: [
    { id: 'ruby-on-rails', label: 'Ruby on Rails' },
    { id: 'sidekiq', label: 'Sidekiq' },
    { id: 'postgresql', label: 'PostgreSQL' },
    { id: 'redis', label: 'Redis' },
    { id: 'rspec', label: 'RSpec' },
    { id: 'minitest', label: 'Minitest' },
    { id: 'docker', label: 'Docker' },
    { id: 'rest-api', label: 'REST API' },
    { id: 'jwt', label: 'JWT' },
    { id: 'authentication', label: 'Authentication' },
    { id: 'authorization', label: 'Authorization' },
    { id: 'n-plus-one', label: 'N+1 optimization' },
    { id: 'eager-loading', label: 'Eager loading' },
    { id: 'database-indexes', label: 'Database indexes' },
    { id: 'sql-migration', label: 'Schema migrations' },
    { id: 'ruby', label: 'Ruby' },
  ],
  readiness: { domain: 'ruby-backend-fresher', score: 46, ratio: 0.46, covered: 38, partial: 21, missing: 45, conceptCount: 104 },
  gaps: [
    { topicId: 'ruby-backend-fresher/rails-security-basics/csrf', title: 'CSRF Protection', importance: 'high', missingConcepts: ['CSRF tokens', 'same-origin', 'verify_authenticity_token'] },
    { topicId: 'ruby-backend-fresher/sidekiq-intro/job-retry-and-failure', title: 'Job Retry & Dead Sets', importance: 'high', missingConcepts: ['exponential backoff', 'dead set / morgue', 'idempotency'] },
    { topicId: 'ruby-backend-fresher/sql-database-basics-ruby/n-plus-one-intro', title: 'N+1 (deep patterns)', importance: 'medium', missingConcepts: ['preload vs eager_load', 'counter caches'] },
    { topicId: 'ruby-backend-fresher/ruby-modules-basics/namespacing', title: 'Module Namespacing', importance: 'medium', missingConcepts: ['module nesting', 'constant lookup'] },
    { topicId: 'ruby-backend-fresher/testing-basics/unit-vs-integration', title: 'Unit vs Integration', importance: 'medium', missingConcepts: ['test pyramid', 'request specs'] },
  ],
  hygiene: {
    score: 85,
    checks: [
      { id: 'quantified', label: 'Quantified achievements', ok: true, detail: '4 quantified bullets (40% latency, 2M tx/day, 6h→40m, 3 teams)' },
      { id: 'action-verbs', label: 'Strong action verbs', ok: true, detail: '11/12 bullets start with action verbs' },
      { id: 'bullet-length', label: 'Bullet length discipline', ok: true, detail: '0 over-long bullets' },
      { id: 'contact', label: 'Contact / links present', ok: false, detail: 'no email/LinkedIn/GitHub detected — add one' },
      { id: 'sections', label: 'Core sections found', ok: true, detail: 'detected: experience, skills, education' },
    ],
  },
  note: 'Claims detected: Kafka-adjacent (Sidekiq), auth (JWT/RBAC), performance (N+1). Prove them in a mock to harden claimed → spoken.',
};

// ---------- mock session report demo ----------
export const DEMO_REPORT = {
  sessionId: 'demo-session-1',
  overallScore: 64,
  turnsCount: 5,
  methodology: 'Scored against the expert answer authored for this topic (concept coverage, depth, structure). Not an AI judge.',
  band: { band: 'Solid', tone: 'amber', line: 'Good answer — a couple of expert points would sharpen it.' },
  strongConcepts: [
    { id: 'sidekiq', label: 'Sidekiq', hits: 3 },
    { id: 'eager-loading', label: 'Eager loading', hits: 2 },
    { id: 'jwt', label: 'JWT auth', hits: 2 },
  ],
  weakConcepts: [
    { id: 'exponential-backoff', label: 'Exponential backoff' },
    { id: 'idempotency', label: 'Idempotency' },
    { id: 'dead-set', label: 'Dead set handling' },
  ],
  moveLog: [
    { turn: 1, move: 'warmup', reason: 'session start — settle nerves with an easy one' },
    { turn: 2, move: 'probe', reason: 'follow-up on candidate phrase "reconciliation"' },
    { turn: 3, move: 'poke', reason: 'candidate echoed a known common_mistake on retries' },
    { turn: 4, move: 'circle_back', reason: 'candidate dodged idempotency — returning rephrased' },
    { turn: 5, move: 'wrap', reason: 'quota reached' },
  ],
  perQuestion: [
    {
      questionId: 'demo-q1', question: 'How do you handle background jobs that fail mid-processing?',
      move: 'open', score: 72,
      coverage: { hit: ['retries with backoff', 'Sidekiq queues'], missed: ['idempotency', 'dead set'], ratio: 0.5 },
      mistakeFlags: ['assuming at-least-once means exactly-once'],
      suggested: { spoken: 'I make jobs idempotent first — design them so running twice equals once, using unique keys. Then Sidekiq retries with exponential backoff (15s to ~21 days, 25 tries by default); after that the job goes to the dead set where I can inspect and replay it. The pair — idempotency + backoff — is what makes at-least-once delivery safe.', checklist: ['Design jobs idempotent (unique keys)', 'Exponential backoff, default 25 tries', 'Dead set for post-retry inspection', 'Monitor retry queues'] },
      nextDrills: ['How would you make a payment job idempotent?', 'What do you monitor on a Sidekiq deployment?'],
    },
    {
      questionId: 'demo-q2', question: 'Walk me through what happens on a cache miss in your reconciliation flow.',
      move: 'probe', score: 58,
      coverage: { hit: ['fallback to DB'], missed: ['stampede protection', 'TTL strategy'], ratio: 0.33 },
      mistakeFlags: [],
      suggested: { spoken: 'On a miss we fall through to the DB read, then populate the cache with a short jittered TTL so simultaneous misses stagger. For hot keys I add a lock or a single-flight pattern to prevent a stampede — N requests missing at once shouldn\'t cause N DB reads.', checklist: ['Fall-through to DB on miss', 'Jittered TTL on repopulate', 'Stampede protection (lock/single-flight)'] },
      nextDrills: ['What TTL would you pick for product data vs. user data?'],
    },
    {
      questionId: 'demo-q3', question: 'Your resume says you cut p95 by 40% — what did you actually change?',
      move: 'poke', score: 81,
      coverage: { hit: ['eager loading', 'database indexes', 'measured p95'], missed: [], ratio: 1 },
      mistakeFlags: [],
      suggested: { spoken: 'I profiled first: the N+1 pattern — one query per record on associations — dominated p95. I added eager loading with includes for the hot paths, composite indexes for the two filter columns the query plans showed scanning, then measured before/after on production traffic: p95 dropped 40% over two weeks.', checklist: ['Profile before fixing', 'Eager load the hot associations', 'Index per query plan, not guess', 'Measure before/after'] },
      nextDrills: ['When would eager loading make things WORSE?'],
    },
  ],
};

// ---------- dashboard demo (analytics) ----------
export const DEMO_ANALYTICS = {
  coverage: [
    { domain: 'ruby-backend-fresher', concepts: 104, percent: 46, strongConcepts: 38, totalTopics: 124 },
    { domain: 'java-backend-fresher', concepts: 88, percent: 12, strongConcepts: 8, totalTopics: 209 },
    { domain: 'go-fresher', concepts: 92, percent: 8, strongConcepts: 5, totalTopics: 146 },
    { domain: 'frontend-fresher', concepts: 74, percent: 5, strongConcepts: 2, totalTopics: 177 },
  ],
  trend: [
    { ts: Date.now() - 10 * 86400000, score: 48, domain: 'ruby-backend-fresher', mode: 'technical', minutes: 15 },
    { ts: Date.now() - 8 * 86400000, score: 52, domain: 'ruby-backend-fresher', mode: 'coding', minutes: 45 },
    { ts: Date.now() - 6 * 86400000, score: 45, domain: 'ruby-backend-fresher', mode: 'behavioral', minutes: 30 },
    { ts: Date.now() - 4 * 86400000, score: 58, domain: 'ruby-backend-fresher', mode: 'technical', minutes: 30 },
    { ts: Date.now() - 2 * 86400000, score: 64, domain: 'ruby-backend-fresher', mode: 'full', minutes: 60 },
  ],
  distribution: { weak: 14, learning: 26, strong: 21, mastered: 17, untouched: 96 },
  stats: { streak: 4, totalSessions: 12, avgScore: 58, bestScore: 81, minutesPracticed: 348, conceptsTouched: 78 },
  strategy: {
    focusDomains: [
      { domain: 'java-backend-fresher', percent: 12, concepts: 88 },
      { domain: 'go-fresher', percent: 8, concepts: 92 },
    ],
    recommendation: 'Your weakest tested area is CSRF Protection — a 15-minute targeted mock today moves it fastest. Prove the Sidekiq claims from your resume next.',
    nextActions: [
      { domain: 'ruby-backend-fresher', percent: 46, action: 'Targeted weakness drill' },
      { domain: 'java-backend-fresher', percent: 12, action: 'Study the fundamentals, then drill' },
      { domain: 'go-fresher', percent: 8, action: 'Study the fundamentals, then drill' },
    ],
  },
  resume: { savedAt: Date.now() - 3 * 86400000, skills: 16 },
  methodology: 'Coverage = importance-weighted concept evidence (spoken > studied > claimed), decaying over 30 days.',
};
