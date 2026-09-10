package com.interviewexplainer.backendapi.modules.content.dto;

public record DomainDTO(
    Long id,
    String name,
    String slug,
    String description,
    String language,
    String languageSlug,
    String track,
    String trackSlug,
    String experienceLabel
) {}
