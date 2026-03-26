package com.interviewexplainer.backendapi.modules.content.repository;

import com.interviewexplainer.backendapi.modules.content.entity.StackCategory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StackCategoryRepository extends JpaRepository<StackCategory, Integer> {
    Optional<StackCategory> findBySlug(String slug);
}
