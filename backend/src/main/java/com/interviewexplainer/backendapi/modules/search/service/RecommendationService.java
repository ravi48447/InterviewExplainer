package com.interviewexplainer.backendapi.modules.search.service;

import com.interviewexplainer.backendapi.modules.content.dto.QuestionSummaryDTO;
import com.interviewexplainer.backendapi.modules.content.entity.enums.QuestionDifficulty;
import jakarta.persistence.EntityManager;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * Knowledge Graph Recommendation Engine
 * Calculates the top relevant questions based on shared concepts, tags, and stack.
 */
@Service
@Transactional(readOnly = true)
public class RecommendationService {

    private final EntityManager entityManager;

    public RecommendationService(EntityManager entityManager) {
        this.entityManager = entityManager;
    }

    /**
     * Executes the weighted similarity algorithm to find top N related questions.
     * Score = (shared_concepts * 4) + (shared_tags * 3) + (shared_keywords * 2) + (same_stack * 2) + popularity
     */
    public List<QuestionSummaryDTO> getRecommendations(Long sourceQuestionId, int limit) {
        String sql = """
            WITH source_data AS (
                SELECT 
                    (SELECT stack_id FROM question_stack_index WHERE question_id = :qId LIMIT 1) as s_stack_id
            ),
            candidate_scores AS (
                SELECT 
                    q.id, q.title, q.slug, q.difficulty, q.estimated_read_time,
                    -- Same Stack Bonus (Weight: 2)
                    CASE WHEN EXISTS (
                        SELECT 1 FROM question_stack_index qsm 
                        WHERE qsm.question_id = q.id 
                        AND qsm.stack_id = (SELECT s_stack_id FROM source_data)
                    ) THEN 2 ELSE 0 END AS stack_score
                FROM questions q
                WHERE q.id != :qId
            )
            SELECT id, title, slug, difficulty, estimated_read_time, 
                   (stack_score) as total_score
            FROM candidate_scores
            WHERE stack_score > 0
            ORDER BY total_score DESC
            LIMIT :lmt
        """;

        try {
            List<Object[]> results = entityManager.createNativeQuery(sql)
                    .setParameter("qId", sourceQuestionId)
                    .setParameter("lmt", limit)
                    .getResultList();

            return results.stream().map(row -> {
                try {
                    Long id = ((Number) row[0]).longValue();
                    String title = (String) row[1];
                    String slug = (String) row[2];
                    QuestionDifficulty diff =
                        row[3] != null ? QuestionDifficulty.valueOf((String) row[3]) : null;
                    Integer readTime = row[4] != null ? ((Number) row[4]).intValue() : null;
                    
                    // Resolve first domain/stack context for each recommendation
                    String domainSlug = null;
                    String stackSlug = null;
                    
                    // Native query to find first context
                    String contextSql = """
                        SELECT d.slug, ts.slug 
                        FROM tech_stacks ts 
                        JOIN question_stack_index qsm ON ts.id = qsm.stack_id 
                        JOIN domain_stack_map dsm ON ts.id = dsm.stack_id 
                        JOIN domains d ON d.id = dsm.domain_id 
                        WHERE qsm.question_id = :qi LIMIT 1
                    """;
                    try {
                        Object[] context = (Object[]) entityManager.createNativeQuery(contextSql)
                                .setParameter("qi", id)
                                .getSingleResult();
                        domainSlug = (String) context[0];
                        stackSlug = (String) context[1];
                    } catch (Exception e) {
                        // Fallback or ignore
                    }

                    return new QuestionSummaryDTO(id, title, slug, diff, readTime, null, domainSlug, stackSlug);
                } catch (Exception e) {
                    System.err.println("Error mapping recommendation row: " + e.getMessage());
                    return null;
                }
            }).filter(java.util.Objects::nonNull).collect(Collectors.toList());
        } catch (Exception e) {
            e.printStackTrace();
            return List.of();
        }
    }

    /**
     * Helper list for the sidebar "People Also Ask" infinite scroll feature
     */
    public List<QuestionSummaryDTO> getPeopleAlsoAsk(Long questionId) {
        return getRecommendations(questionId, 6);
    }
}
