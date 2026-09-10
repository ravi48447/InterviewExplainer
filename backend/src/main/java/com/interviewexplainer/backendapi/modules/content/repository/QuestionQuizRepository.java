package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.QuestionQuiz;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionQuizRepository extends JpaRepository<QuestionQuiz, Long> {
    List<QuestionQuiz> findByQuestionId(Long questionId);
}
