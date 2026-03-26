package com.interviewexplainer.backendapi.modules.content.dto;

public record LanguageDTO(
    Long id,
    String name,
    String slug,
    String description,
    String iconUrl
) {}
