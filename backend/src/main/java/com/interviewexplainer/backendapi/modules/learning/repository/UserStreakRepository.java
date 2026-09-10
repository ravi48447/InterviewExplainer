package com.interviewexplainer.backendapi.modules.learning.repository;

import com.interviewexplainer.backendapi.modules.learning.entity.UserStreak;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;

@Repository
public interface UserStreakRepository extends JpaRepository<UserStreak, UUID> {
}
