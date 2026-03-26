package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.Question;
import com.interviewexplainer.backendapi.modules.content.entity.Topic;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionRepository extends JpaRepository<Question, Long> {
    List<Question> findByTopicId(Long topicId);
    long countByTopicId(Long topicId);
    List<Question> findByTopicIn(java.util.Collection<Topic> topics);
    long countByTopicIn(java.util.Collection<Topic> topics);

    Optional<Question> findBySlug(String slug);
    
    @Query(value = """
        SELECT q.* FROM questions q
        JOIN question_stack_index qsm ON q.id = qsm.question_id
        WHERE qsm.stack_id = :stackId
        ORDER BY qsm.order_index ASC
        """, nativeQuery = true)
    List<Question> findByStackIdOrdered(@Param("stackId") Long stackId);

    @Query(value = """
        SELECT q.* FROM questions q
        JOIN question_stack_index qsm ON q.id = qsm.question_id
        WHERE qsm.stack_id = :stackId
        ORDER BY qsm.order_index ASC
        """,
        countQuery = """
        SELECT count(*) FROM questions q
        JOIN question_stack_index qsm ON q.id = qsm.question_id
        WHERE qsm.stack_id = :stackId
        """,
        nativeQuery = true)
    Page<Question> findByStackIdOrderedPaged(@Param("stackId") Long stackId, Pageable pageable);
    
    @Query(value = """
        SELECT q.* FROM questions q
        JOIN question_stack_index qsm ON q.id = qsm.question_id
        WHERE qsm.stack_id = :stackId
        AND qsm.order_index < (
            SELECT qsm2.order_index FROM question_stack_index qsm2
            WHERE qsm2.question_id = :questionId AND qsm2.stack_id = :stackId
        )
        ORDER BY qsm.order_index DESC
        LIMIT 1
        """, nativeQuery = true)
    Optional<Question> findPreviousQuestion(
        @Param("stackId") Long stackId,
        @Param("questionId") Long questionId
    );
    
    @Query(value = """
        SELECT q.* FROM questions q
        JOIN question_stack_index qsm ON q.id = qsm.question_id
        WHERE qsm.stack_id = :stackId
        AND qsm.order_index > (
            SELECT qsm2.order_index FROM question_stack_index qsm2
            WHERE qsm2.question_id = :questionId AND qsm2.stack_id = :stackId
        )
        ORDER BY qsm.order_index ASC
        LIMIT 1
        """, nativeQuery = true)
    Optional<Question> findNextQuestion(
        @Param("stackId") Long stackId,
        @Param("questionId") Long questionId
    );
    
    @Query(value = """
        SELECT q.* FROM questions q
        JOIN question_stack_index qsm ON q.id = qsm.question_id
        WHERE qsm.stack_id = :stackId
        ORDER BY qsm.order_index ASC
        LIMIT :limit
        """, nativeQuery = true)
    List<Question> findQuickQuestions(
        @Param("stackId") Long stackId,
        @Param("limit") int limit
    );
    
//    @Query(value = """
//        SELECT DISTINCT q2.* FROM question_concepts qc1
//        JOIN question_concepts qc2 ON qc1.concept_id = qc2.concept_id
//        JOIN questions q2 ON q2.id = qc2.question_id
//        WHERE qc1.question_id = :questionId
//        AND q2.id != :questionId
//        LIMIT 5
//        """, nativeQuery = true)
//    List<Question> findRelatedQuestions(@Param("questionId") Long questionId);
    
    @Query(value = """
        SELECT * FROM questions
        WHERE search_vector @@ plainto_tsquery('english', :query)
        ORDER BY ts_rank(search_vector, plainto_tsquery('english', :query)) DESC
        LIMIT :limit
        """, nativeQuery = true)
    List<Question> searchQuestions(
        @Param("query") String query,
        @Param("limit") int limit
    );

    @Query(value = "SELECT stack_id FROM question_stack_index WHERE question_id = :questionId LIMIT 1", nativeQuery = true)
    Optional<Long> findFirstStackIdForQuestion(@Param("questionId") Long questionId);

    @Query(value = """
        SELECT d.slug as domain_slug, s.slug as stack_slug
        FROM tech_stacks s
        JOIN question_stack_index qsi ON s.id = qsi.stack_id
        JOIN domain_stack_map dsm ON s.id = dsm.stack_id
        JOIN domains d ON d.id = dsm.domain_id
        WHERE qsi.question_id = :questionId
        LIMIT 1
        """, nativeQuery = true)
    Optional<Object> findFirstContextForQuestion(@Param("questionId") Long questionId);
}
