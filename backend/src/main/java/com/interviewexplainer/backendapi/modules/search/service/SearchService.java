package com.interviewexplainer.backendapi.modules.search.service;

import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.content.repository.QuestionRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class SearchService {

    private final QuestionRepository questionRepository;

    public SearchService(QuestionRepository questionRepository) {
        this.questionRepository = questionRepository;
    }

    /**
     * Full-text search using PostgreSQL tsvector + GIN index.
     * Target: < 10ms for 500k questions.
     */
    public List<QuestionSummaryDTO> search(String query, int limit) {
        if (query == null || query.trim().length() < 2) {
            return List.of();
        }
        return questionRepository.searchQuestions(query.trim(), limit)
                .stream()
                .map(q -> {
                    // Quick resolution of first stack/domain context
                    String stackSlug = null;
                    String domainSlug = null;
                    
                    // This is a bit heavy in a loop, but okay for small limits
                    // In production, we'd use a single join query
                    Object[] context = (Object[]) questionRepository.findFirstContextForQuestion(q.getId()).orElse(null);
                    if (context != null) {
                        domainSlug = (String) context[0];
                        stackSlug = (String) context[1];
                    }

                    return new QuestionSummaryDTO(
                        q.getId(), q.getTitle(), q.getSlug(),
                        q.getDifficulty(), q.getEstimatedReadTime(), null,
                        domainSlug, stackSlug
                    );
                })
                .toList();
    }
}
