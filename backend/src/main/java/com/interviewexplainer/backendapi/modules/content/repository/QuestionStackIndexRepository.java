package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.QuestionStackIndex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuestionStackIndexRepository extends JpaRepository<QuestionStackIndex, Long> {
    
    List<QuestionStackIndex> findByStackIdOrderByOrderIndexAsc(Long stackId);
    
    Optional<QuestionStackIndex> findByStackIdAndQuestionId(Long stackId, Long questionId);
}
