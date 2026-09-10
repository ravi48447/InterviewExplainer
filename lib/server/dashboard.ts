/**
 * Builds a personalized dashboard summary from a user's stored progress.
 *
 * The heavy "stack list / question counts / skill axes" come from the
 * filesystem content API on the client (driven by the active domain), so this
 * summary focuses on the truly per-user signals: completions, bookmarks,
 * streaks, daily activity and the active domain. A brand-new user therefore
 * gets a real-but-empty dashboard (blank graphs) that fills in as they learn.
 *
 * Server-only.
 */
import { getProgress, listBookmarks, type StoredUser } from './user-store';

export interface DashboardSummaryResponse {
  totalQuestions: number;
  totalConcepts: number;
  activeTracks: number;
  domainsCount: number;
  completedQuestions: number;
  totalTimeSpent: number;
  currentStreak: number;
  longestStreak: number;
  bookmarksCount: number;
  stackPerformance: unknown[];
  weakAreas: unknown[];
  recentActivity: { title: string; detail: string | null; activityType: string; date: string }[];
  primaryDomainName: string | null;
  primaryDomainSlug: string | null;
  experienceLevel: string | null;
  radarData: unknown[];
  dailyActivity: { date: string; count: number }[];
  difficultyBreakdown: { easy: number; medium: number; hard: number };
}

function toDateKey(iso: string): string {
  return iso.slice(0, 10); // yyyy-MM-dd
}

function computeStreaks(dates: string[]): { current: number; longest: number } {
  if (dates.length === 0) return { current: 0, longest: 0 };
  const unique = Array.from(new Set(dates)).sort(); // ascending yyyy-MM-dd
  const dayMs = 86_400_000;
  // Parse as UTC so date keys (derived from toISOString) stay consistent
  // regardless of the server's local timezone.
  const asTime = (d: string) => new Date(d + 'T00:00:00Z').getTime();

  let longest = 1;
  let run = 1;
  for (let i = 1; i < unique.length; i++) {
    const gap = Math.round((asTime(unique[i]) - asTime(unique[i - 1])) / dayMs);
    if (gap === 1) run += 1;
    else if (gap > 1) run = 1;
    longest = Math.max(longest, run);
  }

  // Current streak: walk back from today (allowing "today not yet active").
  const todayKey = toDateKey(new Date().toISOString());
  const set = new Set(unique);
  let current = 0;
  const cursor = new Date(todayKey + 'T00:00:00Z');
  if (!set.has(todayKey)) cursor.setUTCDate(cursor.getUTCDate() - 1); // grace for today
  while (set.has(cursor.toISOString().slice(0, 10))) {
    current += 1;
    cursor.setUTCDate(cursor.getUTCDate() - 1);
  }

  return { current, longest };
}

export function buildSummary(user: StoredUser): DashboardSummaryResponse {
  const progress = getProgress(user.id);
  const bookmarks = listBookmarks(user.id);

  const completedEntries = Object.entries(progress.completed); // [questionId, iso]
  const completedDates = completedEntries.map(([, iso]) => toDateKey(iso));
  const { current, longest } = computeStreaks(completedDates);

  // Daily activity counts (questions completed per day).
  const dailyMap = new Map<string, number>();
  for (const day of completedDates) dailyMap.set(day, (dailyMap.get(day) ?? 0) + 1);
  const dailyActivity = [...dailyMap.entries()]
    .map(([date, count]) => ({ date, count }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Recent activity feed (newest first), merging completions and bookmarks.
  const recent = [
    ...completedEntries.map(([id, iso]) => ({
      title: 'Completed a question',
      detail: `Question #${id}`,
      activityType: 'QUESTION_COMPLETED',
      date: toDateKey(iso),
      _ts: iso,
    })),
  ].sort((a, b) => b._ts.localeCompare(a._ts)).slice(0, 8)
    .map(({ _ts, ...rest }) => rest);

  const activeName =
    user.domains.find(d => d.slug === user.activeDomain)?.name ?? null;

  // ~5 minutes of focused reading per completed question (a reasonable estimate
  // so "study time" isn't always zero once the user starts completing things).
  const totalTimeSpent = completedEntries.length * 300;

  return {
    totalQuestions: 0, // client overrides from real content structure
    totalConcepts: 0,
    activeTracks: user.activeDomain ? 1 : 0,
    domainsCount: user.domains.length,
    completedQuestions: completedEntries.length,
    totalTimeSpent,
    currentStreak: current,
    longestStreak: longest,
    bookmarksCount: bookmarks.length,
    stackPerformance: [],
    weakAreas: [],
    recentActivity: recent,
    primaryDomainName: activeName,
    primaryDomainSlug: user.activeDomain,
    experienceLevel: user.experienceLevel,
    radarData: [],
    dailyActivity,
    difficultyBreakdown: { easy: 0, medium: 0, hard: 0 },
  };
}
