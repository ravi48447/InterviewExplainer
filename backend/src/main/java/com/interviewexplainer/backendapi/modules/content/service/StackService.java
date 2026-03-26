package com.interviewexplainer.backendapi.modules.content.service;

import com.interviewexplainer.backendapi.shared.exception.ResourceNotFoundException;

import com.interviewexplainer.backendapi.modules.content.entity.Question;
import com.interviewexplainer.backendapi.modules.content.entity.TechStack;
import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.content.dto.TechStackDTO;
import com.interviewexplainer.backendapi.modules.content.repository.TechStackRepository;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class StackService {

    private final TechStackRepository techStackRepository;
    private final QuestionRepository questionRepository;

    public StackService(TechStackRepository techStackRepository,
                        QuestionRepository questionRepository) {
        this.techStackRepository = techStackRepository;
        this.questionRepository = questionRepository;
    }

    public TechStackDTO getStackBySlug(String slug) {
        TechStack stack = techStackRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Stack not found: " + slug));
        int count = questionRepository.findByStackIdOrdered(stack.getId()).size();
        return new TechStackDTO(stack.getId(), stack.getName(), stack.getSlug(),
                stack.getDescription(), stack.getIconUrl(), count);
    }

    /**
     * Get ordered questions for a stack.
     */
    public List<QuestionSummaryDTO> getQuestionsForStack(String slug) {
        TechStack stack = techStackRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Stack not found: " + slug));

        return questionRepository.findByStackIdOrdered(stack.getId()).stream()
                .map(q -> toSummaryDTO(q, 0))
                .toList();
    }

    /**
     * Paginated questions for a stack.
     */
    public Page<QuestionSummaryDTO> getQuestionsForStackPaged(String slug, int page, int size) {
        TechStack stack = techStackRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Stack not found: " + slug));

        return questionRepository.findByStackIdOrderedPaged(stack.getId(), PageRequest.of(page, size))
                .map(q -> toSummaryDTO(q, 0));
    }

    private QuestionSummaryDTO toSummaryDTO(Question q, int orderIndex) {
        return new QuestionSummaryDTO(
                q.getId(), q.getTitle(), q.getSlug(),
                q.getDifficulty(), q.getEstimatedReadTime(), orderIndex,
                null, null
        );
    }
}
