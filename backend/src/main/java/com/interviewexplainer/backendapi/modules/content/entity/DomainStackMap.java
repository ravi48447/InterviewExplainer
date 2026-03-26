package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "domain_stack_map")
public class DomainStackMap {

    @EmbeddedId
    private DomainStackMapId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("domainId")
    @JoinColumn(name = "domain_id")
    private Domain domain;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("categoryId")
    @JoinColumn(name = "category_id")
    private StackCategory category;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("stackId")
    @JoinColumn(name = "stack_id")
    private TechStack stack;

    @Column(name = "display_order")
    private Integer displayOrder = 0;

    protected DomainStackMap() {}

    public DomainStackMap(Domain domain, StackCategory category, TechStack stack, Integer displayOrder) {
        this.id = new DomainStackMapId(domain.getId(), category.getId(), stack.getId());
        this.domain = domain;
        this.category = category;
        this.stack = stack;
        this.displayOrder = displayOrder;
    }

    public DomainStackMapId getId() { return id; }
    public Domain getDomain() { return domain; }
    public StackCategory getCategory() { return category; }
    public TechStack getStack() { return stack; }
    public Integer getDisplayOrder() { return displayOrder; }
}
