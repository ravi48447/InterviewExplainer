package com.interviewexplainer.backendapi.modules.learning.service;

import com.interviewexplainer.backendapi.modules.analytics.entity.UserActivityLog;
import com.interviewexplainer.backendapi.modules.learning.entity.UserQuestionProgress;
import com.interviewexplainer.backendapi.modules.analytics.repository.UserActivityLogRepository;
import com.interviewexplainer.backendapi.modules.learning.repository.UserQuestionProgressRepository;
import com.interviewexplainer.backendapi.modules.analytics.service.DashboardService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;
import java.util.List;

@Service
public class ProgressService {

    @Autowired
    private UserQuestionProgressRepository progressRepository;

    @Autowired
    private UserActivityLogRepository activityLogRepository;

    @Autowired
    private DashboardService dashboardService;

    @Transactional
    public void recordView(UUID userId, Long questionId) {
        List<UserQuestionProgress> progressList = progressRepository.findByUserIdAndQuestionId(userId, questionId);
        UserQuestionProgress progress = progressList.isEmpty() ? new UserQuestionProgress(userId, questionId) : progressList.get(0);
        
        progress.setLastViewedAt(LocalDateTime.now());
        progress.setAttemptCount(progress.getAttemptCount() + 1);
        
        if ("not_started".equals(progress.getStatus())) {
            progress.setStatus("viewed");
        }
        
        progressRepository.save(progress);

        // Record activity
        activityLogRepository.save(new UserActivityLog(userId, "question_view", "question", questionId));
        
        // Update streak
        dashboardService.updateStreak(userId);
    }

    @Transactional
    public void markCompleted(UUID userId, Long questionId) {
        List<UserQuestionProgress> progressList = progressRepository.findByUserIdAndQuestionId(userId, questionId);
        UserQuestionProgress progress = progressList.isEmpty() ? new UserQuestionProgress(userId, questionId) : progressList.get(0);
        
        progress.setStatus("completed");
        progress.setCompletedAt(LocalDateTime.now());
        progress.setLastViewedAt(LocalDateTime.now());
        
        progressRepository.save(progress);

        // Record activity
        activityLogRepository.save(new UserActivityLog(userId, "question_complete", "question", questionId));
        
        // Update streak
        dashboardService.updateStreak(userId);
    }

    public List<UserQuestionProgress> getUserProgress(UUID userId) {
        return progressRepository.findByUserId(userId);
    }
}
