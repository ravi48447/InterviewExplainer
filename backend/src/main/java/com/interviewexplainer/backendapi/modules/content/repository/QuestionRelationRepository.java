package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.QuestionRelation;
import com.interviewexplainer.backendapi.modules.content.entity.QuestionRelationId;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRelationRepository extends JpaRepository<QuestionRelation, QuestionRelationId> {

    @Query("SELECT r FROM QuestionRelation r JOIN FETCH r.relatedQuestion WHERE r.question.id = :questionId")
    List<QuestionRelation> findByQuestionId(@Param("questionId") Long questionId);
}
