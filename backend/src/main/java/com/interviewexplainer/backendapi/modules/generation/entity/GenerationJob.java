package com.interviewexplainer.backendapi.modules.generation.entity;

import com.interviewexplainer.backendapi.modules.generation.entity.enums.GenerationStatus;
import com.interviewexplainer.backendapi.shared.domain.AuditableEntity;
import jakarta.persistence.*;

/**
 * Represents a content generation job for creating interview questions.
 */
@Entity
@Table(name = "generation_jobs")
public class GenerationJob extends AuditableEntity {

    @Column(name = "stack_id")
    private Long stackId;

    @Column(name = "target_difficulty", length = 50)
    private String targetDifficulty;

    @Column(name = "quantity_requested", nullable = false)
    private Integer quantityRequested;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 50)
    private GenerationStatus status = GenerationStatus.PENDING;

    @Column(name = "prompt", columnDefinition = "TEXT")
    private String prompt;

    @Column(name = "model", length = 100)
    private String model;

    @Column(name = "retry_count")
    private Integer retryCount = 0;

    @Column(name = "failure_reason", columnDefinition = "TEXT")
    private String failureReason;

    // Getters and setters
    public Long getStackId() {
        return stackId;
    }

    public void setStackId(Long stackId) {
        this.stackId = stackId;
    }

    public String getTargetDifficulty() {
        return targetDifficulty;
    }

    public void setTargetDifficulty(String targetDifficulty) {
        this.targetDifficulty = targetDifficulty;
    }

    public Integer getQuantityRequested() {
        return quantityRequested;
    }

    public void setQuantityRequested(Integer quantityRequested) {
        this.quantityRequested = quantityRequested;
    }

    public GenerationStatus getStatus() {
        return status;
    }

    public void setStatus(GenerationStatus status) {
        this.status = status;
    }

    public String getPrompt() {
        return prompt;
    }

    public void setPrompt(String prompt) {
        this.prompt = prompt;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public Integer getRetryCount() {
        return retryCount;
    }

    public void setRetryCount(Integer retryCount) {
        this.retryCount = retryCount;
    }

    public String getFailureReason() {
        return failureReason;
    }

    public void setFailureReason(String failureReason) {
        this.failureReason = failureReason;
    }
}