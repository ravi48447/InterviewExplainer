package com.interviewexplainer.backendapi.modules.learning.repository;

import com.interviewexplainer.backendapi.modules.learning.entity.UserBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;
import java.util.UUID;
import java.util.List;

@Repository
public interface UserBookmarkRepository extends JpaRepository<UserBookmark, Long> {
    List<UserBookmark> findByUserId(UUID userId);
    Optional<UserBookmark> findByUserIdAndQuestionId(UUID userId, Long questionId);
}
