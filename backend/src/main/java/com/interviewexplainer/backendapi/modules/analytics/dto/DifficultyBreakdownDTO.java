package com.interviewexplainer.backendapi.modules.analytics.dto;

/**
 * Real distribution of the user's completed questions by difficulty.
 * Derived from {@code questions.difficulty} for completed question ids.
 */
public record DifficultyBreakdownDTO(
    int easy,
    int medium,
    int hard
) {}
