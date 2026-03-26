package com.interviewexplainer.backendapi.modules.content.dto;

public record ConceptDTO(
    Long id,
    String name,
    String slug,
    String description
) {}
