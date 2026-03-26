package com.interviewexplainer.backendapi.modules.content.service;

import com.interviewexplainer.backendapi.shared.exception.ResourceNotFoundException;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.interviewexplainer.backendapi.modules.content.entity.Question;
import com.interviewexplainer.backendapi.modules.content.entity.Topic;
import com.interviewexplainer.backendapi.modules.content.entity.AnswerSection;
import com.interviewexplainer.backendapi.modules.content.entity.enums.AnswerSectionType;
import com.interviewexplainer.backendapi.modules.content.entity.TechStack;
import com.interviewexplainer.backendapi.modules.content.entity.QuestionPageCache;
import com.interviewexplainer.backendapi.modules.search.service.RecommendationService;
import com.interviewexplainer.backendapi.modules.content.dto.AnswerSectionDTO;
import com.interviewexplainer.backendapi.modules.content.dto.ConceptDTO;
import com.interviewexplainer.backendapi.modules.content.dto.QuestionPagePayload;
import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.content.dto.QuestionQuizDTO;
import com.interviewexplainer.backendapi.modules.content.repository.AnswerSectionRepository;
import com.interviewexplainer.backendapi.modules.content.repository.ConceptRepository;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionPageCacheRepository;
import com.interviewexplainer.backendapi.modules.content.repository.TechStackRepository;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionQuizRepository;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionRepository;
import com.interviewexplainer.backendapi.modules.content.repository.TopicRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import jakarta.persistence.EntityManager;

import java.util.List;
import java.util.Optional;

@Service
@Transactional(readOnly = true)
public class PageAssemblerService {

    private final QuestionRepository questionRepository;
    private final AnswerSectionRepository sectionRepository;
    private final TopicRepository topicRepository;
    private final TechStackRepository techStackRepository;
    private final QuestionPageCacheRepository pageCacheRepository;
    private final ConceptRepository conceptRepository;
    private final RecommendationService recommendationService;
    private final QuestionQuizRepository quizRepository;
    private final ObjectMapper objectMapper;
    private final EntityManager entityManager;

    public PageAssemblerService(
            QuestionRepository questionRepository,
            AnswerSectionRepository sectionRepository,
            TopicRepository topicRepository,
            TechStackRepository techStackRepository,
            QuestionPageCacheRepository pageCacheRepository,
            ConceptRepository conceptRepository,
            RecommendationService recommendationService,
            QuestionQuizRepository quizRepository,
            ObjectMapper objectMapper,
            EntityManager entityManager) {
        this.questionRepository = questionRepository;
        this.sectionRepository = sectionRepository;
        this.topicRepository = topicRepository;
        this.techStackRepository = techStackRepository;
        this.pageCacheRepository = pageCacheRepository;
        this.conceptRepository = conceptRepository;
        this.recommendationService = recommendationService;
        this.quizRepository = quizRepository;
        this.objectMapper = objectMapper;
        this.entityManager = entityManager;
    }

    @Transactional
    public QuestionPagePayload getPagePayload(String slug) {
        Optional<QuestionPageCache> cacheOpt = pageCacheRepository.findBySlug(slug);
        if (cacheOpt.isPresent()) {
            try {
                return objectMapper.readValue(cacheOpt.get().getPageJson(), QuestionPagePayload.class);
            } catch (Exception e) {
                System.err.println("Cache parse failed: " + e.getMessage());
            }
        }

        try {
            return buildPayload(slug);
        } catch (Exception e) {
            e.printStackTrace();
            throw e;
        }
    }

    @Transactional
    public void invalidateCache(String slug) {
        pageCacheRepository.findBySlug(slug).ifPresent(pageCacheRepository::delete);
    }

    private QuestionPagePayload buildPayload(String slug) {
        Question question = questionRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Question not found: " + slug));

        List<AnswerSectionDTO> sections = sectionRepository
                .findByQuestionIdOrderBySectionOrderAsc(question.getId())
                .stream()
                .map(as -> new AnswerSectionDTO(as.getId(), as.getSectionType(), as.getSectionOrder(), as.getContent()))
                .toList();

        Topic topic = (question.getTopic() != null)
                ? topicRepository.findById(question.getTopic().getId()).orElse(null)
                : null;
        Long stackId = questionRepository.findFirstStackIdForQuestion(question.getId()).orElse(null);
        String stackName = null, stackSlug = null, domainSlug = null;
        QuestionSummaryDTO prev = null, next = null;
        List<QuestionSummaryDTO> quickQuestions = List.of();

        if (stackId != null) {
            TechStack stack = techStackRepository.findById(stackId).orElse(null);
            if (stack != null) {
                // Use the more robust repository method to find context
                Object context = questionRepository.findFirstContextForQuestion(question.getId()).orElse(null);
                if (context != null && context instanceof Object[]) {
                    Object[] row = (Object[]) context;
                    domainSlug = (String) row[0];
                    stackSlug = (String) row[1];
                }
                
                // Fallback for stack details
                if (stackSlug == null) {
                    stackSlug = stack.getSlug();
                }
                stackName = stack.getName();
            }

            final String dSlug = domainSlug;
            final String sSlug = stackSlug;

            prev = questionRepository.findPreviousQuestion(stackId, question.getId())
                    .map(q -> toSummary(q, dSlug, sSlug)).orElse(null);
            next = questionRepository.findNextQuestion(stackId, question.getId())
                    .map(q -> toSummary(q, dSlug, sSlug)).orElse(null);
            quickQuestions = questionRepository.findQuickQuestions(stackId, 15)
                    .stream().map(q -> toSummary(q, dSlug, sSlug)).toList();
        }

        final String finalDomainSlug = domainSlug;
        final String finalStackSlug = stackSlug;
        // V2 Fallback: Removed missing taxonomy tables, relying on RecommendationService
        List<QuestionSummaryDTO> related = List.of();
        List<ConceptDTO> concepts = List.of();

        List<QuestionSummaryDTO> recommendedQuestions = recommendationService.getRecommendations(question.getId(), 10)
                .stream()
                .map(q -> new QuestionSummaryDTO(q.id(), q.title(), q.slug(), q.difficulty(), q.estimatedReadTime(), q.orderIndex(), finalDomainSlug, finalStackSlug))
                .toList();

        List<QuestionSummaryDTO> peopleAlsoAsk = recommendationService.getPeopleAlsoAsk(question.getId())
                .stream()
                .map(q -> new QuestionSummaryDTO(q.id(), q.title(), q.slug(), q.difficulty(), q.estimatedReadTime(), q.orderIndex(), finalDomainSlug, finalStackSlug))
                .toList();

        List<String> interviewCoach = sections.stream()
                .filter(s -> AnswerSectionType.interviewer_expectation.equals(s.sectionType()) || AnswerSectionType.speakable_answer.equals(s.sectionType()))
                .map(AnswerSectionDTO::content)
                .toList();

        List<String> practiceChecklist = sections.stream()
                .filter(s -> AnswerSectionType.practice_prompt.equals(s.sectionType()))
                .map(AnswerSectionDTO::content)
                .toList();
        
        if (practiceChecklist.isEmpty()) {
            practiceChecklist = List.of("Explain without notes", "Give a real-world example", "Write pseudocode");
        }

        List<QuestionQuizDTO> quizzes = quizRepository.findByQuestionId(question.getId())
                .stream()
                .map(q -> new QuestionQuizDTO(q.getId(), q.getQuizQuestion(), q.getOptions(), q.getCorrectAnswer()))
                .toList();

        return new QuestionPagePayload(
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
                sections,
                prev,
                next,
                quickQuestions,
                related,
                concepts,
                List.of(),
                recommendedQuestions,
                peopleAlsoAsk,
                interviewCoach,
                practiceChecklist,
                quizzes
        );
    }

    private QuestionSummaryDTO toSummary(Question q, String dSlug, String sSlug) {
        return new QuestionSummaryDTO(q.getId(), q.getTitle(), q.getSlug(), q.getDifficulty(), q.getEstimatedReadTime(), null, dSlug, sSlug);
    }
}
