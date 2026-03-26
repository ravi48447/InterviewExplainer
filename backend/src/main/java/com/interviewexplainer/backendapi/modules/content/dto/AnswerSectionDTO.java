package com.interviewexplainer.backendapi.modules.content.dto;

import com.interviewexplainer.backendapi.modules.content.entity.enums.AnswerSectionType;

public record AnswerSectionDTO(
    Long id,
    AnswerSectionType sectionType,
    Integer sectionOrder,
    String content
) {}
