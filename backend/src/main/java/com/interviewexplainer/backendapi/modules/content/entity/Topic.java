package com.interviewexplainer.backendapi.modules.content.entity;

import com.interviewexplainer.backendapi.shared.domain.AuditableEntity;
import jakarta.persistence.*;

/**
 * Topic entity - Legacy grouping mechanism for questions within stacks.
 * Note: In v2 architecture, questions are directly mapped to stacks via QuestionStackIndex.
 * This entity is maintained for backward compatibility.
 */
@Entity
@Table(name = "topics")
public class Topic extends AuditableEntity {

    @Column(nullable = false, length = 255)
    private String name;

    @Column(length = 255)
    private String slug;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(name = "order_index")
    private Integer orderIndex;

    // Constructors
    public Topic() {}

    public Topic(String name, String slug) {
        this.name = name;
        this.slug = slug;
    }

    // Getters and Setters
    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Integer getOrderIndex() {
        return orderIndex;
    }

    public void setOrderIndex(Integer orderIndex) {
        this.orderIndex = orderIndex;
    }
}