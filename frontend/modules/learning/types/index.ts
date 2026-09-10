/**
 * Learning Module Types
 */

export interface UserProgress {
  questionId: number;
  status: 'viewed' | 'completed';
  lastViewedAt: string;
  completedAt?: string;
}

export interface Bookmark {
  id: number;
  questionId: number;
  questionTitle: string;
  questionSlug: string;
  createdAt: string;
}

export interface Streak {
  currentStreak: number;
  longestStreak: number;
  lastActivityDate: string;
}
