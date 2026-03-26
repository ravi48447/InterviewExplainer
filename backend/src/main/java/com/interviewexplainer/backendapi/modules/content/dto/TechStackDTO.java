package com.interviewexplainer.backendapi.modules.content.dto;

public record TechStackDTO(
    Long id,
    String name,
    String slug,
    String description,
    String iconUrl,
    Integer questionCount
) {}
