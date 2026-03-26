package com.interviewexplainer.backendapi.modules.analytics.dto;

public record WeakAreaDTO(
    String label,
    String description,
    int mastery,
    String color
) {}
