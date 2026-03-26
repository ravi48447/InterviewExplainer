package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Composite primary key for QuestionRelation entity.
 * Represents the relationship between two questions in the knowledge graph.
 */
@Embeddable
public class QuestionRelationId implements Serializable {

    private Long questionId;
    private Long relatedQuestionId;

    // Required for JPA
    protected QuestionRelationId() {}

    public QuestionRelationId(Long questionId, Long relatedQuestionId) {
        this.questionId = questionId;
        this.relatedQuestionId = relatedQuestionId;
    }

    public Long getQuestionId() {
        return questionId;
    }

    public void setQuestionId(Long questionId) {
        this.questionId = questionId;
    }

    public Long getRelatedQuestionId() {
        return relatedQuestionId;
    }

    public void setRelatedQuestionId(Long relatedQuestionId) {
        this.relatedQuestionId = relatedQuestionId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        QuestionRelationId that = (QuestionRelationId) o;
        return Objects.equals(questionId, that.questionId) &&
               Objects.equals(relatedQuestionId, that.relatedQuestionId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(questionId, relatedQuestionId);
    }
}