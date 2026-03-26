package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.Embeddable;
import java.io.Serializable;
import java.util.Objects;

/**
 * Composite primary key for DomainCategoryMap entity.
 * Links domains to stack categories.
 */
@Embeddable
public class DomainCategoryMapId implements Serializable {

    private Long domainId;
    private Integer categoryId;

    // Required for JPA
    protected DomainCategoryMapId() {}

    public DomainCategoryMapId(Long domainId, Integer categoryId) {
        this.domainId = domainId;
        this.categoryId = categoryId;
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        DomainCategoryMapId that = (DomainCategoryMapId) o;
        return Objects.equals(domainId, that.domainId) &&
               Objects.equals(categoryId, that.categoryId);
    }

    @Override
    public int hashCode() {
        return Objects.hash(domainId, categoryId);
    }
}