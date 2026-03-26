package com.interviewexplainer.backendapi.modules.analytics.repository;

import com.interviewexplainer.backendapi.modules.analytics.entity.UserActivityLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.UUID;
import java.util.List;

@Repository
public interface UserActivityLogRepository extends JpaRepository<UserActivityLog, Long> {
    List<UserActivityLog> findByUserIdOrderByCreatedAtDesc(UUID userId);
}
