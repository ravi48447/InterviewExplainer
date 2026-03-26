package com.interviewexplainer.backendapi.modules.content.dto;

public record QuestionQuizDTO(
    Long id,
    String quizQuestion,
    String optionsJson,
    String correctAnswer
) {}
