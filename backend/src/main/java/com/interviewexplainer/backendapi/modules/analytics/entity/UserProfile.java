package com.interviewexplainer.backendapi.modules.analytics.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "user_profiles")
public class UserProfile {

    @Id
    @Column(name = "user_id")
    private UUID userId;

    @Column(name = "primary_domain_id")
    private Long primaryDomainId;

    @Column(name = "experience_level", length = 50)
    private String experienceLevel;

    @Column(name = "daily_goal_questions")
    private Integer dailyGoalQuestions = 3;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    public UserProfile() {}

    public UserProfile(UUID userId, Long primaryDomainId, String experienceLevel) {
        this.userId = userId;
        this.primaryDomainId = primaryDomainId;
        this.experienceLevel = experienceLevel;
    }

    public UUID getUserId() { return userId; }
    public void setUserId(UUID userId) { this.userId = userId; }

    public Long getPrimaryDomainId() { return primaryDomainId; }
    public void setPrimaryDomainId(Long primaryDomainId) { this.primaryDomainId = primaryDomainId; }

    public String getExperienceLevel() { return experienceLevel; }
    public void setExperienceLevel(String experienceLevel) { this.experienceLevel = experienceLevel; }

    public Integer getDailyGoalQuestions() { return dailyGoalQuestions; }
    public void setDailyGoalQuestions(Integer dailyGoalQuestions) { this.dailyGoalQuestions = dailyGoalQuestions; }

    public LocalDateTime getCreatedAt() { return createdAt; }
}
