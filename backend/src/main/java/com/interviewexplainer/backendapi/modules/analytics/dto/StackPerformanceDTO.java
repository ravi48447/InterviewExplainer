package com.interviewexplainer.backendapi.modules.analytics.dto;

public record StackPerformanceDTO(
    String label,
    int progress,
    String color,
    int completed,
    int total
) {}
