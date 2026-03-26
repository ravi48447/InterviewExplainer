package com.interviewexplainer.backendapi.modules.content.dto;

import com.interviewexplainer.backendapi.modules.content.entity.enums.QuestionDifficulty;
import java.util.List;

/**
 * Complete question page response - assembled by QuestionService.
 * Supports caching and full page render.
 */
public record QuestionPageResponseDTO(
    Long id,
    String title,
    String slug,
    QuestionDifficulty difficulty,
    Integer estimatedReadTime,
    String metaTitle,
    String metaDescription,

    // Stack context
    Long stackId,
    String stackName,
    String stackSlug,

    // Structured answer sections (in order)
    List<AnswerSectionDTO> answerSections,

    // Navigation
    QuestionSummaryDTO previousQuestion,
    QuestionSummaryDTO nextQuestion,

    // Quick question list (sidebar)
    List<QuestionSummaryDTO> quickQuestions,

    // Related from knowledge graph
    List<QuestionSummaryDTO> relatedQuestions
) {}
