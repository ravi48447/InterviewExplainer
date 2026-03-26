package com.interviewexplainer.backendapi.modules.learning.repository;

import com.interviewexplainer.backendapi.modules.learning.entity.UserQuestionProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface UserQuestionProgressRepository extends JpaRepository<UserQuestionProgress, Long> {
    List<UserQuestionProgress> findByUserIdAndQuestionId(UUID userId, Long questionId);
    List<UserQuestionProgress> findByUserId(UUID userId);
    List<UserQuestionProgress> findByUserIdAndQuestionIdIn(UUID userId, Collection<Long> questionIds);
}
