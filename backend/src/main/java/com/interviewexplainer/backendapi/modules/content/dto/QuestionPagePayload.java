package com.interviewexplainer.backendapi.modules.content.dto;

import com.interviewexplainer.backendapi.modules.content.entity.enums.QuestionDifficulty;
import java.util.List;

/**
 * Complete page payload — returned by /api/page/question/{slug}
 * This is the aggregated single-query response that powers the docs-platform frontend.
 * All data needed to render a page is in this one object.
 */
public record QuestionPagePayload(
    // Core question
    Long id,
    String title,
    String slug,
    QuestionDifficulty difficulty,
    Integer estimatedReadTime,
    String metaTitle,
    String metaDescription,

    // Stack context for breadcrumbs + sidebar
    Long stackId,
    String stackName,
    String stackSlug,
    String domainSlug,

    // Structured answer sections (6 types, ordered)
    List<AnswerSectionDTO> answerSections,

    // Navigation: prev and next within the stack
    QuestionSummaryDTO previousQuestion,
    QuestionSummaryDTO nextQuestion,

    // Sidebar: quick question list for this stack
    List<QuestionSummaryDTO> quickQuestions,

    // Related questions from knowledge graph
    List<QuestionSummaryDTO> relatedQuestions,

    // Concept links (knowledge graph nodes)
    List<ConceptDTO> concepts,

    // Internal links for SEO (source → target)
    List<InternalLinkDTO> internalLinks,

    // Recommendation Engine (Knowledge Graph)
    List<QuestionSummaryDTO> recommendedQuestions,
    List<QuestionSummaryDTO> peopleAlsoAsk,

    // Right Panel: Interview Practice
    List<String> interviewCoach,
    List<String> practiceChecklist,

    // Interactive Quizzes
    List<QuestionQuizDTO> quizzes
) {}
