package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import org.hibernate.annotations.JdbcTypeCode;
import org.hibernate.type.SqlTypes;

import java.time.LocalDateTime;

@Entity
@Table(name = "question_page_cache")
public class QuestionPageCache {

    @Id
    @Column(name = "question_id")
    private Long questionId;

    @Column(nullable = false, length = 255)
    private String slug;

    @JdbcTypeCode(SqlTypes.JSON)
    @Column(name = "page_json", columnDefinition = "jsonb")
    private String pageJson;

    @Column(name = "last_generated")
    private LocalDateTime lastGenerated;

    @Column
    private Integer version = 1;

    protected QuestionPageCache() {}

    public QuestionPageCache(Long questionId, String slug, String pageJson) {
        this.questionId = questionId;
        this.slug = slug;
        this.pageJson = pageJson;
        this.lastGenerated = LocalDateTime.now();
    }

    public Long getQuestionId() { return questionId; }
    public String getSlug() { return slug; }
    public String getPageJson() { return pageJson; }
    public void setPageJson(String pageJson) { 
        this.pageJson = pageJson; 
        this.lastGenerated = LocalDateTime.now();
    }
    public LocalDateTime getLastGenerated() { return lastGenerated; }
    public Integer getVersion() { return version; }
    public void setVersion(Integer version) { this.version = version; }
}
