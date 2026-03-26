package com.interviewexplainer.backendapi.modules.content.dto;

public record TrackDTO(
    Long id,
    String name,
    String slug,
    String description
) {}
