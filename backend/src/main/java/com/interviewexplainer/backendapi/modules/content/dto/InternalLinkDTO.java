package com.interviewexplainer.backendapi.modules.content.dto;

/**
 * Represents a SEO internal link between two questions.
 */
public record InternalLinkDTO(
    Long targetQuestionId,
    String targetQuestionTitle,
    String targetQuestionSlug,
    String linkType,
    Integer relevanceScore
) {}
