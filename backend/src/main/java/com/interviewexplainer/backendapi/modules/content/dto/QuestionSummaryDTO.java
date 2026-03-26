package com.interviewexplainer.backendapi.modules.content.dto;

import com.interviewexplainer.backendapi.modules.content.entity.enums.QuestionDifficulty;

public record QuestionSummaryDTO(
    Long id,
    String title,
    String slug,
    QuestionDifficulty difficulty,
    Integer estimatedReadTime,
    Integer orderIndex,
    String domainSlug,
    String stackSlug
) {}
