package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.Concept;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ConceptRepository extends JpaRepository<Concept, Long> {
    Optional<Concept> findBySlug(String slug);

//    @Query(value = """
//        SELECT c.* FROM concepts c
//        JOIN question_concepts qc ON c.id = qc.concept_id
//        WHERE qc.question_id = :questionId
//        """, nativeQuery = true)
//    List<Concept> findConceptsByQuestionId(@Param("questionId") Long questionId);
}
