package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.QuestionPageCache;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface QuestionPageCacheRepository extends JpaRepository<QuestionPageCache, Long> {
    Optional<QuestionPageCache> findBySlug(String slug);
}
