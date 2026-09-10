/**
 * lib/dashboard barrel — Phase 09 canonical dashboard layer.
 */
export type {
  DashboardSummary,
  StackPerformance,
  WeakArea,
  RecentActivityItem,
  RadarData,
  DailyActivity,
  DifficultyBreakdown,
  ContinuePrepItem,
  DailyQueue,
  DailyQueueItem,
  RecommendationReason,
  RecommendationItem,
  RecommendationSet,
  DashboardEmptyReason,
  DashboardEmptyState,
} from "./dashboard-types";

export {
  loadDashboardSummary,
  loadContinuePrep,
  loadDailyQueue,
  loadRecommendations,
  resolveDashboardEmptyState,
} from "./dashboard-data";

export { buildDashboardMetadata } from "./dashboard-seo";
