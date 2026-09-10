package com.interviewexplainer.backendapi.modules.analytics.dto;

/**
 * One day's study activity, used to render the dashboard contribution heatmap.
 * {@code date} is an ISO {@code yyyy-MM-dd} string in the server's local zone.
 */
public record DailyActivityDTO(
    String date,
    int count
) {}
