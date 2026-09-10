/**
 * Analytics Module Types
 */

export interface DashboardSummary {
  totalQuestions: number;
  completedQuestions: number;
  totalTimeSpent: number;
  currentStreak: number;
  bookmarksCount: number;
  recentActivity: string[];
  stackPerformance: StackPerformance[];
  weakAreas: WeakArea[];
  radarData: RadarData[];
  primaryDomainName?: string;
  primaryDomainSlug?: string;
  experienceLevel?: string;
}

export interface StackPerformance {
  stackName: string;
  stackSlug: string;
  totalQuestions: number;
  completed: number;
  percentage: number;
}

export interface WeakArea {
  conceptName: string;
  questionsCount: number;
  completionRate: number;
}

export interface RadarData {
  category: string;
  value: number;
  maxValue: number;
}

export interface ActivityLog {
  id: number;
  userId: string;
  actionType: string;
  resourceType: string;
  resourceId: number;
  timestamp: string;
  details?: string;
}