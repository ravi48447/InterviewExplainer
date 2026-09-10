package com.interviewexplainer.backendapi.modules.content.dto;

public record ExperienceLevelDTO(
    Long id,
    String label,
    Integer minYears,
    Integer maxYears
) {}
