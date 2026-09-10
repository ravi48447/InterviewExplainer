package com.interviewexplainer.backendapi.modules.analytics.dto;

/**
 * A single, render-ready recent-activity entry for the dashboard.
 *
 * @param title human-readable action (e.g. "Completed a question")
 * @param detail optional context such as a question title (may be null)
 * @param activityType raw activity type token (e.g. "QUESTION_COMPLETED")
 * @param date ISO {@code yyyy-MM-dd} date the activity occurred
 */
public record RecentActivityDTO(
    String title,
    String detail,
    String activityType,
    String date
) {}
