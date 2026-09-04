// API v2 client — aligned with new PostgreSQL schema
const API_BASE = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080') + '/api/v2';

// ─── Types ───────────────────────────────────────────────────────────────────

export type Difficulty = 'easy' | 'medium' | 'hard';

export type AnswerSectionType =
  | 'interviewer_expectation'
  | 'core_concepts'
  | 'important_points'
  | 'code_example'
  | 'speakable_answer'
  | 'deep_explanation'
  | 'practice_prompt'
  | 'followup_questions'
  | 'explanation'
  | 'short_summary'
  | 'detailed_explanation'
  | 'best_practices'
  | 'common_mistakes'
  | 'real_world_example'
  | 'scenario_based'
  | string;

export interface Language {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
}

export interface Track {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export interface ExperienceLevel {
  id: number;
  label: string;
  minYears: number | null;
  maxYears: number | null;
}

export interface Domain {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  language: string | null;
  languageSlug: string | null;
  track: string | null;
  trackSlug: string | null;
  experienceLabel: string | null;
}

export interface StackPerformance {
  label: string;
  progress: number;
  color: string;
  completed: number;
  total: number;
}

export interface WeakArea {
  label: string;
  description: string;
  mastery: number;
  color: string;
}

export interface RadarData {
  subject: string;
  score: number;
}

export interface DailyActivity {
  date: string;
  count: number;
}

export interface DifficultyBreakdown {
  easy: number;
  medium: number;
  hard: number;
}

export interface RecentActivityItem {
  title: string;
  detail: string | null;
  activityType: string;
  date: string;
}

export interface DashboardSummary {
  totalQuestions: number;
  totalConcepts: number;
  activeTracks: number;
  domainsCount: number;
  completedQuestions: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  bookmarksCount: number;
  stackPerformance: StackPerformance[];
  weakAreas: WeakArea[];
  recentActivity: RecentActivityItem[];
  primaryDomainName: string | null;
  primaryDomainSlug: string | null;
  experienceLevel: string | null;
  radarData: RadarData[];
  dailyActivity: DailyActivity[];
  difficultyBreakdown: DifficultyBreakdown;
}

export interface TechStack {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  iconUrl: string | null;
  questionCount: number;
}

export interface QuestionSummary {
  id: number;
  title: string;
  slug: string;
  difficulty: Difficulty;
  estimatedReadTime: number;
  orderIndex: number | null;
  domainSlug?: string | null;
  stackSlug?: string | null;
  subcategorySlug?: string | null;
  subcategoryName?: string | null;
}

export interface AnswerContent {
  deepExplanation: string;
  interviewTips: string;
  codeSnippet?: string;
  speakableAnswer: string;
  timeToAnswer: string;
}

export interface Topic {
  id: number;
  name: string;
  slug: string;
  questions?: QuestionSummary[];
}

export interface AnswerSection {
  id: number;
  sectionType: AnswerSectionType;
  sectionOrder: number;
  content: string;
  sectionTitle?: string;
  speakingCues?: SpeakingCue[];
}

export interface SpeakingCueSupportItem {
  label: string;
  value?: string;
  detail?: string;
  tone?: 'neutral' | 'blue' | 'green' | 'orange';
}

export interface SpeakingCueSupport {
  type: 'code' | 'trace' | 'checklist' | 'comparison';
  title?: string;
  code?: string;
  language?: string;
  caption?: string;
  items?: SpeakingCueSupportItem[];
}

export interface SpeakingCue {
  cue: string;
  stage?: string;
  leadIn?: string;
  spokenText: string;
  recallRule?: string;
  support?: SpeakingCueSupport;
}

export interface ConceptLink {
  id: number;
  name: string;
  slug: string;
}

export interface InternalLink {
  targetQuestionId: number;
  targetQuestionTitle: string;
  targetQuestionSlug: string;
  linkType: string;
  relevanceScore: number;
}

export interface QuestionQuiz {
  id: number;
  quizQuestion: string;
  optionsJson: string; // JSON string of options
  correctAnswer: string;
}

/** Aggregated page payload — returned by /api/page/question/{slug} */
export interface QuestionPagePayload {
  id: number;
  title: string;
  questionText: string | null;
  slug: string;
  difficulty: Difficulty;
  estimatedReadTime: number;
  metaTitle: string | null;
  metaDescription: string | null;
  stackId: number | null;
  stackName: string | null;
  stackSlug: string | null;
  domainSlug: string | null;
  answerSections: AnswerSection[];
  previousQuestion: QuestionSummary | null;
  nextQuestion: QuestionSummary | null;
  quickQuestions: QuestionSummary[];
  relatedQuestions: QuestionSummary[];
  concepts: ConceptLink[];
  internalLinks: InternalLink[];
  recommendedQuestions: QuestionSummary[];
  peopleAlsoAsk: QuestionSummary[];
  interviewCoach: string[];
  practiceChecklist: string[];
  quizzes: QuestionQuiz[];
}

export const fetchPeopleAlsoAsk = (questionId: number): Promise<{ questions: QuestionSummary[] }> =>
  fetch(`${API_BASE}/recommendations/paa/${questionId}`).then(r => r.json());

export const markQuestionComplete = (userId: number, questionId: number): Promise<{ status: string }> =>
  fetch(`${API_BASE}/user-progress/complete`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userId, questionId })
  }).then(r => r.json());

// ─── API Helpers ──────────────────────────────────────────────────────────────

const BACKEND_TIMEOUT_MS = 4000; // fail fast if Spring Boot is unreachable / slow

async function get<T>(path: string): Promise<T> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), BACKEND_TIMEOUT_MS);
  try {
    const res = await fetch(`${API_BASE}${path}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error((err as any).message ?? `HTTP ${res.status}: ${path}`);
    }
    return res.json();
  } finally {
    clearTimeout(timer);
  }
}

// ─── Language / Track / Experience ───────────────────────────────────────────

export const fetchLanguages = (track?: string): Promise<Language[]> =>
  get(`/languages${track ? `?track=${encodeURIComponent(track)}` : ''}`);

export const fetchLanguage = (slug: string): Promise<Language> =>
  get(`/languages/${encodeURIComponent(slug)}`);

export const fetchTracks = (language?: string): Promise<Track[]> =>
  get(`/tracks${language ? `?language=${encodeURIComponent(language)}` : ''}`);

export const fetchExperienceLevels = (): Promise<ExperienceLevel[]> =>
  get('/experience-levels');

// ─── Domains ─────────────────────────────────────────────────────────────────

export const fetchDomains = (): Promise<Domain[]> =>
  get('/domains');

export const fetchDomain = (slug: string): Promise<Domain> =>
  get(`/domains/${encodeURIComponent(slug)}`);

export const fetchDomainsByLanguage = (languageSlug: string): Promise<Domain[]> =>
  get(`/languages/${encodeURIComponent(languageSlug)}/domains`);

export interface DomainCategory {
  id: number;
  name: string;
  slug: string;
  stacks: TechStack[];
}

// Stacks are now returned nested within categories for a domain
export const fetchCategoriesForDomain = (domainSlug: string): Promise<DomainCategory[]> =>
  get(`/domains/${encodeURIComponent(domainSlug)}/categories`);

export const resolveDomain = (language: string, track: string, experience: string): Promise<Domain> =>
  get(`/domains/resolve?language=${encodeURIComponent(language)}&track=${encodeURIComponent(track)}&experience=${encodeURIComponent(experience)}`);

// ─── Stacks ───────────────────────────────────────────────────────────────────

export const fetchStack = (slug: string): Promise<TechStack> =>
  get(`/stacks/${encodeURIComponent(slug)}`);

export const fetchQuestionsForStack = (slug: string): Promise<QuestionSummary[]> =>
  get(`/stacks/${encodeURIComponent(slug)}/questions`);

/**
 * Interview prep: a single short Markdown "Revision" sheet attached at the
 * MODULE level (not per topic). Lives at `<module>/_revision.json` and is
 * surfaced to learners as the first synthetic topic of the module.
 *
 * Five to six skim-first sections, each ~150 words. Designed to be printed
 * as a 2–3 page PDF before the user drills the interview questions.
 */
export interface ModuleRevisionSection {
  id: string;
  title: string;
  body: string;
}

export interface ModuleRevision {
  title: string;
  estimatedMinutes?: number;
  sections: ModuleRevisionSection[];
}

export interface StackSubcategory {
  slug: string;
  name: string;
  orderIndex: number;
  questionCount: number;
  questions: QuestionSummary[];
}

export const fetchSubcategoriesForStack = (slug: string): Promise<StackSubcategory[]> =>
  get(`/stacks/${encodeURIComponent(slug)}/subcategories`);

// ─── Aggregated Page Payload (docs-platform architecture) ───────────────────

export const fetchPagePayload = async (slug: string): Promise<QuestionPagePayload> => {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), 4000); // 4-second timeout
  try {
    const res = await fetch(`${API_BASE}/question/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      headers: { 'Accept': 'application/json' },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}: /api/v2/question/${slug}`);
    return res.json();
  } finally {
    clearTimeout(timer);
  }
};

// ─── Questions ────────────────────────────────────────────────────────────────

export const fetchQuestionPage = (slug: string): Promise<QuestionPagePayload> =>
  fetchPagePayload(slug);

export const fetchDashboardSummary = (): Promise<DashboardSummary> =>
  get('/dashboard/summary');

// ─── Search ───────────────────────────────────────────────────────────────────

export const searchQuestions = (query: string, limit = 20): Promise<QuestionSummary[]> =>
  get(`/search?q=${encodeURIComponent(query)}&limit=${limit}`);

// ─── Helpers ─────────────────────────────────────────────────────────────────

export const difficultyColor = (d: Difficulty) =>
  d === 'easy' ? '#22c55e' : d === 'medium' ? '#f59e0b' : '#ef4444';

export const difficultyLabel = (d: Difficulty) =>
  d === 'easy' ? 'Easy' : d === 'medium' ? 'Medium' : 'Hard';

export const sectionLabel = (t: AnswerSectionType) => ({
  interviewer_expectation: '🎯 Interviewer Expectation',
  core_concepts: '🧠 Core Concepts',
  important_points: '📌 Important Points',
  code_example: '💻 Code Example',
  speakable_answer: '🗣️ Speakable Answer',
  followup_questions: '❓ Follow-up Questions',
}[t]);
