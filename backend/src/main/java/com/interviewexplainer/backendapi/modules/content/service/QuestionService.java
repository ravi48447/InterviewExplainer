package com.interviewexplainer.backendapi.modules.content.service;
import com.interviewexplainer.backendapi.shared.exception.ResourceNotFoundException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewexplainer.backendapi.modules.content.entity.Question;
import com.interviewexplainer.backendapi.modules.content.entity.*;
import com.interviewexplainer.backendapi.modules.content.dto.*;
import com.interviewexplainer.backendapi.modules.content.repository.*;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class QuestionService {

    private final QuestionRepository questionRepository;
    private final AnswerSectionRepository answerSectionRepository;
    private final TechStackRepository techStackRepository;
    private final QuestionPageCacheRepository pageCacheRepository;
    private final ObjectMapper objectMapper;

    public QuestionService(QuestionRepository questionRepository,
                           AnswerSectionRepository answerSectionRepository,
                           TechStackRepository techStackRepository,
                           QuestionPageCacheRepository pageCacheRepository,
                           ObjectMapper objectMapper) {
        this.questionRepository = questionRepository;
        this.answerSectionRepository = answerSectionRepository;
        this.techStackRepository = techStackRepository;
        this.pageCacheRepository = pageCacheRepository;
        this.objectMapper = objectMapper;
    }

    /**
     * Step 12: Page Cache Support
     * Before building page dynamically, check cache.
     * If not found, build and cache.
     */
    @Transactional
    public QuestionPageResponseDTO getQuestionPage(String slug) {
        // 1. Check Cache
        Optional<QuestionPageCache> cacheOpt = pageCacheRepository.findBySlug(slug);
        if (cacheOpt.isPresent()) {
            try {
                return objectMapper.readValue(cacheOpt.get().getPageJson(), QuestionPageResponseDTO.class);
            } catch (Exception e) {
                // If parsing fails, fallback to dynamic build
                System.err.println("Cache parsing failed for " + slug + ": " + e.getMessage());
            }
        }

        // 2. Build dynamically
        QuestionPageResponseDTO responseDTO = buildQuestionPageDynamically(slug);

        // 3. Save to cache
        try {
            String json = objectMapper.writeValueAsString(responseDTO);
            QuestionPageCache newCache = cacheOpt.orElseGet(() -> 
                new QuestionPageCache(responseDTO.id(), slug, json)
            );
            newCache.setPageJson(json);
            newCache.setVersion(newCache.getVersion() + 1);
            pageCacheRepository.save(newCache);
        } catch (Exception e) {
            System.err.println("Failed to cache page for " + slug + ": " + e.getMessage());
        }

        return responseDTO;
    }

    private QuestionPageResponseDTO buildQuestionPageDynamically(String slug) {
        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + slug));

        // Fetch answer sections ordered
        List<AnswerSectionDTO> answerSections = answerSectionRepository
                .findByQuestionIdOrderBySectionOrderAsc(question.getId())
                .stream()
                .map(as -> new AnswerSectionDTO(
                        as.getId(), as.getSectionType(), as.getSectionOrder(), as.getContent()))
                .toList();

        // Resolve first stack context
        Optional<Long> stackIdOpt = questionRepository.findFirstStackIdForQuestion(question.getId());
        Long stackId = stackIdOpt.orElse(null);

        String stackName = null;
        String stackSlug = null;
        String domainSlug = null;
        QuestionSummaryDTO previousQuestion = null;
        QuestionSummaryDTO nextQuestion = null;
        List<QuestionSummaryDTO> quickQuestions = List.of();

        if (stackId != null) {
            TechStack stack = techStackRepository.findById(stackId).orElse(null);
            if (stack != null) {
                stackName = stack.getName();
                stackSlug = stack.getSlug();
                // Get domain slug from first domain mapping
                domainSlug = questionRepository.findFirstDomainSlugForStack(stackId).orElse(null);
            }

            previousQuestion = questionRepository
                    .findPreviousQuestion(stackId, question.getId())
                    .map(this::toSummaryDTO)
                    .orElse(null);

            nextQuestion = questionRepository
                    .findNextQuestion(stackId, question.getId())
                    .map(this::toSummaryDTO)
                    .orElse(null);

            quickQuestions = questionRepository
                    .findQuickQuestions(stackId, 10)
                    .stream()
                    .map(this::toSummaryDTO)
                    .toList();
        }

        // Related questions via concept graph
        List<QuestionSummaryDTO> relatedDTOs = List.of();

        return new QuestionPageResponseDTO(
                question.getId(),
                question.getTitle(),
                question.getSlug(),
                question.getDifficulty(),
                question.getEstimatedReadTime(),
                question.getMetaTitle(),
                question.getMetaDescription(),
                stackId,
                stackName,
                stackSlug,
                domainSlug,
                answerSections,
                previousQuestion,
                nextQuestion,
                quickQuestions,
                relatedDTOs
        );
    }

    public QuestionSummaryDTO getQuestionSummary(String slug) {
        Question q = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + slug));
        return toSummaryDTO(q);
    }

    private QuestionSummaryDTO toSummaryDTO(Question q) {
        return new QuestionSummaryDTO(
                q.getId(), q.getTitle(), q.getSlug(),
                q.getDifficulty(), q.getEstimatedReadTime(), null,
                null, null, null, null
        );
    }
}
