package com.interviewexplainer.backendapi.modules.content.dto;

import java.util.List;

public record StackSubcategoryDTO(
        String slug,
        String name,
        int orderIndex,
        int questionCount,
        List<QuestionSummaryDTO> questions
) {}
