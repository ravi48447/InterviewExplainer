package com.interviewexplainer.backendapi.modules.analytics.dto;

import java.util.List;

public record DashboardSummaryDTO(
    long totalQuestions,
    long totalConcepts,
    int activeTracks,
    int domainsCount,
    long completedQuestions,
    long totalTimeSpent,
    int currentStreak,
    int longestStreak,
    long bookmarksCount,
    List<StackPerformanceDTO> stackPerformance,
    List<WeakAreaDTO> weakAreas,
    List<RecentActivityDTO> recentActivity,
    String primaryDomainName,
    String primaryDomainSlug,
    String experienceLevel,
    List<RadarDataDTO> radarData,
    List<DailyActivityDTO> dailyActivity,
    DifficultyBreakdownDTO difficultyBreakdown
) {}
