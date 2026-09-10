package com.interviewexplainer.backendapi.modules.content.service;

import com.interviewexplainer.backendapi.shared.exception.ResourceNotFoundException;

import com.interviewexplainer.backendapi.modules.content.entity.Question;
import com.interviewexplainer.backendapi.modules.content.entity.QuestionStackIndex;
import com.interviewexplainer.backendapi.modules.content.entity.TechStack;
import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.content.dto.StackSubcategoryDTO;
import com.interviewexplainer.backendapi.modules.content.dto.TechStackDTO;
import com.interviewexplainer.backendapi.modules.content.repository.TechStackRepository;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionRepository;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionStackIndexRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
@Transactional(readOnly = true)
public class StackService {

    private final TechStackRepository techStackRepository;
    private final QuestionRepository questionRepository;
    private final QuestionStackIndexRepository questionStackIndexRepository;

    public StackService(TechStackRepository techStackRepository,
                        QuestionRepository questionRepository,
                        QuestionStackIndexRepository questionStackIndexRepository) {
        this.techStackRepository = techStackRepository;
        this.questionRepository = questionRepository;
        this.questionStackIndexRepository = questionStackIndexRepository;
    }

    public TechStackDTO getStackBySlug(String slug) {
        TechStack stack = techStackRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Stack not found: " + slug));
        int count = questionRepository.findByStackIdOrdered(stack.getId()).size();
        return new TechStackDTO(stack.getId(), stack.getName(), stack.getSlug(),
                stack.getDescription(), stack.getIconUrl(), count);
    }

    /**
     * Get ordered questions for a stack (flat list, includes subcategorySlug).
     */
    public List<QuestionSummaryDTO> getQuestionsForStack(String slug) {
        TechStack stack = techStackRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Stack not found: " + slug));

        List<QuestionStackIndex> indices = questionStackIndexRepository.findByStackIdOrdered(stack.getId());
        List<Long> questionIds = indices.stream().map(QuestionStackIndex::getQuestionId).toList();
        Map<Long, QuestionStackIndex> indexByQuestionId = new LinkedHashMap<>();
        for (QuestionStackIndex idx : indices) {
            indexByQuestionId.put(idx.getQuestionId(), idx);
        }

        List<Question> questions = questionRepository.findAllById(questionIds);
        Map<Long, Question> questionMap = new LinkedHashMap<>();
        for (Question q : questions) {
            questionMap.put(q.getId(), q);
        }

        return indices.stream()
                .filter(idx -> questionMap.containsKey(idx.getQuestionId()))
                .map(idx -> {
                    Question q = questionMap.get(idx.getQuestionId());
                    return new QuestionSummaryDTO(
                            q.getId(), q.getTitle(), q.getSlug(),
                            q.getDifficulty(), q.getEstimatedReadTime(),
                            idx.getOrderIndex(), null, null,
                            idx.getSubcategorySlug(), idx.getSubcategoryName()
                    );
                })
                .toList();
    }

    /**
     * Get questions grouped by subcategory for a stack.
     * Used for the subcategory tree view in the frontend.
     */
    public List<StackSubcategoryDTO> getSubcategoriesForStack(String slug) {
        TechStack stack = techStackRepository.findBySlug(slug)
                .orElseThrow(() -> new ResourceNotFoundException("Stack not found: " + slug));

        List<QuestionStackIndex> indices = questionStackIndexRepository.findByStackIdOrdered(stack.getId());
        List<Long> questionIds = indices.stream().map(QuestionStackIndex::getQuestionId).toList();

        List<Question> questions = questionRepository.findAllById(questionIds);
        Map<Long, Question> questionMap = new LinkedHashMap<>();
        for (Question q : questions) {
            questionMap.put(q.getId(), q);
        }

        // Group by subcategory (preserving insertion order = ordered by subcategory_slug)
        Map<String, List<QuestionSummaryDTO>> grouped = new LinkedHashMap<>();
        Map<String, String> subcatNames = new LinkedHashMap<>();
        Map<String, Integer> subcatOrder = new LinkedHashMap<>();
        int subcatCounter = 0;

        for (QuestionStackIndex idx : indices) {
            Question q = questionMap.get(idx.getQuestionId());
            if (q == null) continue;

            String catSlug = idx.getSubcategorySlug() != null ? idx.getSubcategorySlug() : "__uncategorized__";
            String catName = idx.getSubcategoryName() != null ? idx.getSubcategoryName() : "Other";

            if (!grouped.containsKey(catSlug)) {
                grouped.put(catSlug, new ArrayList<>());
                subcatNames.put(catSlug, catName);
                subcatOrder.put(catSlug, subcatCounter++);
            }

            grouped.get(catSlug).add(new QuestionSummaryDTO(
                    q.getId(), q.getTitle(), q.getSlug(),
                    q.getDifficulty(), q.getEstimatedReadTime(),
                    idx.getOrderIndex(), null, null,
                    catSlug, catName
            ));
        }

        return grouped.entrySet().stream()
                .map(entry -> new StackSubcategoryDTO(
                        entry.getKey(),
                        subcatNames.get(entry.getKey()),
                        subcatOrder.get(entry.getKey()),
                        entry.getValue().size(),
                        entry.getValue()
                ))
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
                null, null, null, null
        );
    }
}
