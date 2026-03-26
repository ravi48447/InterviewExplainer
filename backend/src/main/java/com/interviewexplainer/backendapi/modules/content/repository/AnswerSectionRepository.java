package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.AnswerSection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AnswerSectionRepository extends JpaRepository<AnswerSection, Long> {
    
    /**
     * Get all answer sections for a question ordered by section_order.
     * Optimized with idx_answer_render index.
     */
    List<AnswerSection> findByQuestionIdOrderBySectionOrderAsc(Long questionId);
}
