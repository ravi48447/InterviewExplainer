package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.QuestionStackIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionStackIndexRepository extends JpaRepository<QuestionStackIndex, Long> {

    @Query("SELECT qsi FROM QuestionStackIndex qsi WHERE qsi.stackId = :stackId ORDER BY COALESCE(qsi.subcategorySlug, ''), qsi.orderIndex ASC NULLS LAST")
    List<QuestionStackIndex> findByStackIdOrdered(@Param("stackId") Long stackId);

    List<QuestionStackIndex> findByStackIdOrderByOrderIndexAsc(Long stackId);
}
