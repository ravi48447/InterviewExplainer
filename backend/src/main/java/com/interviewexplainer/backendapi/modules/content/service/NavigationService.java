package com.interviewexplainer.backendapi.modules.content.service;

import com.interviewexplainer.backendapi.modules.content.entity.Question;
import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class NavigationService {

    private final QuestionRepository questionRepository;

    public NavigationService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    public Optional<QuestionSummaryDTO> getPreviousQuestion(Long stackId, Long questionId) {
        return questionRepository.findPreviousQuestion(stackId, questionId)
                .map(this::toSummaryDTO);
    }

    public Optional<QuestionSummaryDTO> getNextQuestion(Long stackId, Long questionId) {
        return questionRepository.findNextQuestion(stackId, questionId)
                .map(this::toSummaryDTO);
    }

    public List<QuestionSummaryDTO> getSidebarQuestions(Long stackId, int limit) {
        return questionRepository.findQuickQuestions(stackId, limit).stream()
                .map(this::toSummaryDTO)
                .toList();
    }

    private QuestionSummaryDTO toSummaryDTO(Question q) {
        return new QuestionSummaryDTO(
                q.getId(), q.getTitle(), q.getSlug(),
                q.getDifficulty(), q.getEstimatedReadTime(), null,
                null, null
        );
    }
}
