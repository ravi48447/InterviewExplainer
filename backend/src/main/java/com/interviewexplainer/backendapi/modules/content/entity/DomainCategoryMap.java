package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "domain_category_map")
public class DomainCategoryMap {

    @EmbeddedId
    private DomainCategoryMapId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("domainId")
    @JoinColumn(name = "domain_id")
    private Domain domain;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private StackCategory category;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    protected DomainCategoryMap() {}

    public DomainCategoryMap(Domain domain, StackCategory category, Integer displayOrder) {
        this.id = new DomainCategoryMapId(domain.getId(), category.getId());
        this.domain = domain;
        this.category = category;
        this.displayOrder = displayOrder;
    }

    public DomainCategoryMapId getId() { return id; }
    public Domain getDomain() { return domain; }
    public StackCategory getCategory() { return category; }
    public Integer getDisplayOrder() { return displayOrder; }
}
