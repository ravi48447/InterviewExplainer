package com.interviewexplainer.backendapi.modules.content.entity;

import com.interviewexplainer.backendapi.modules.content.entity.enums.QuestionDifficulty;
import com.interviewexplainer.backendapi.shared.domain.AuditableEntity;
import jakarta.persistence.*;

import java.time.LocalDateTime;

/**
 * Question entity - Core content entity representing interview questions.
 * Each question maps to a unique SEO-optimized page.
 */
@Entity
@Table(name = "questions")
public class Question extends AuditableEntity {

    @Column(nullable = false, columnDefinition = "TEXT")
    private String title;

    @Column(name = "question_text", columnDefinition = "TEXT")
    private String questionText;

    @Column(unique = true, nullable = false, length = 255)
    private String slug;

    @Enumerated(EnumType.STRING)
    @Column(length = 50)
    private QuestionDifficulty difficulty;

    @Column(name = "estimated_read_time")
    private Integer estimatedReadTime;

    @Column(name = "meta_title", length = 255)
    private String metaTitle;

    @Column(name = "meta_description", columnDefinition = "TEXT")
    private String metaDescription;

    // Legacy topic relationship (maintained for backward compatibility)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    private Topic topic;

    // Generation module columns
    @Column(name = "generation_status", length = 50)
    private String generationStatus;

    @Column(name = "generation_method", length = 50)
    private String generationMethod;

    @Column(name = "generation_date")
    private LocalDateTime generationDate;

    @Column(name = "quality_score")
    private Double qualityScore;

    @Column(name = "is_published")
    private Boolean isPublished;

    @Column(name = "content_version")
    private Integer contentVersion;

    // Constructors
    public Question() {
        this.difficulty = QuestionDifficulty.medium;
        this.estimatedReadTime = 5;
        this.generationStatus = "manual";
        this.isPublished = true;
        this.contentVersion = 1;
    }

    public Question(String title, String slug, QuestionDifficulty difficulty) {
        this();
        this.title = title;
        this.slug = slug;
        this.difficulty = difficulty;
    }

    // Getters and Setters
    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public QuestionDifficulty getDifficulty() {
        return difficulty;
    }

    public void setDifficulty(QuestionDifficulty difficulty) {
        this.difficulty = difficulty;
    }

    public Integer getEstimatedReadTime() {
        return estimatedReadTime;
    }

    public void setEstimatedReadTime(Integer estimatedReadTime) {
        this.estimatedReadTime = estimatedReadTime;
    }

    public String getMetaTitle() {
        return metaTitle;
    }

    public void setMetaTitle(String metaTitle) {
        this.metaTitle = metaTitle;
    }

    public String getMetaDescription() {
        return metaDescription;
    }

    public void setMetaDescription(String metaDescription) {
        this.metaDescription = metaDescription;
    }

    public Topic getTopic() {
        return topic;
    }

    public void setTopic(Topic topic) {
        this.topic = topic;
    }

    public String getGenerationStatus() {
        return generationStatus;
    }

    public void setGenerationStatus(String generationStatus) {
        this.generationStatus = generationStatus;
    }

    public String getGenerationMethod() {
        return generationMethod;
    }

    public void setGenerationMethod(String generationMethod) {
        this.generationMethod = generationMethod;
    }

    public LocalDateTime getGenerationDate() {
        return generationDate;
    }

    public void setGenerationDate(LocalDateTime generationDate) {
        this.generationDate = generationDate;
    }

    public Double getQualityScore() {
        return qualityScore;
    }

    public void setQualityScore(Double qualityScore) {
        this.qualityScore = qualityScore;
    }

    public Boolean getIsPublished() {
        return isPublished;
    }

    public void setIsPublished(Boolean isPublished) {
        this.isPublished = isPublished;
    }

    public Integer getContentVersion() {
        return contentVersion;
    }

    public void setContentVersion(Integer contentVersion) {
        this.contentVersion = contentVersion;
    }
}