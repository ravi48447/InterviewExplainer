package com.interviewexplainer.backendapi.modules.content.service;

import com.interviewexplainer.backendapi.shared.exception.ResourceNotFoundException;

import com.interviewexplainer.backendapi.modules.content.entity.Question;
import com.interviewexplainer.backendapi.modules.content.entity.Concept;
import com.interviewexplainer.backendapi.modules.content.dto.ConceptDTO;
import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.content.repository.ConceptRepository;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class ConceptService {

    private final ConceptRepository conceptRepository;
    private final QuestionRepository questionRepository;

    public ConceptService(ConceptRepository conceptRepository,
                          QuestionRepository questionRepository) {
        this.conceptRepository = conceptRepository;
        this.questionRepository = questionRepository;
    }

    public List<ConceptDTO> getAllConcepts() {
        return conceptRepository.findAll().stream()
                .map(this::toDTO)
                .toList();
    }

    public ConceptDTO getConceptBySlug(String slug) {
        return conceptRepository.findBySlug(slug)
                .map(this::toDTO)
                .orElseThrow(() -> new ResourceNotFoundException("Concept not found: " + slug));
    }

    public List<QuestionSummaryDTO> getRelatedQuestions(Long questionId) {
        List<Question> relatedQuestions = List.of();
        return relatedQuestions.stream()
                .map(q -> toSummaryDTO(q, null))
                .toList();
    }

    private QuestionSummaryDTO toSummaryDTO(Question q, Integer orderIndex) {
        return new QuestionSummaryDTO(
                q.getId(), q.getTitle(), q.getSlug(),
                q.getDifficulty(), q.getEstimatedReadTime(), orderIndex,
                null, null, null, null
        );
    }

    private ConceptDTO toDTO(Concept c) {
        return new ConceptDTO(c.getId(), c.getName(), c.getSlug(), c.getDescription());
    }
}
