package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Composite primary key for DomainStackMap entity.
 * Links domains to tech stacks with category grouping.
 */
@Embeddable
public class DomainStackMapId implements Serializable {

    private Long domainId;
    private Integer categoryId;
    private Long stackId;

    // Required for JPA
    protected DomainStackMapId() {}

    public DomainStackMapId(Long domainId, Integer categoryId, Long stackId) {
        this.domainId = domainId;
        this.categoryId = categoryId;
        this.stackId = stackId;
    }

    public Long getDomainId() {
        return domainId;
    }

    public void setDomainId(Long domainId) {
        this.domainId = domainId;
    }

    public Integer getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Integer categoryId) {
        this.categoryId = categoryId;
    }

    public Long getStackId() {
        return stackId;
    }

    public void setStackId(Long stackId) {
        this.stackId = stackId;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DomainStackMapId that = (DomainStackMapId) o;
        return Objects.equals(domainId, that.domainId) &&
               Objects.equals(categoryId, that.categoryId) &&
               Objects.equals(stackId, that.stackId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(domainId, categoryId, stackId);
    }
}