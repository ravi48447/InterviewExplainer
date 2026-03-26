package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "domain_navigation")
public class DomainNavigation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @OneToOne
    @JoinColumn(name = "domain_id", nullable = false, unique = true)
    private Domain domain;

    @ManyToOne
    @JoinColumn(name = "default_category_id")
    private StackCategory defaultCategory;

    @ManyToOne
    @JoinColumn(name = "default_stack_id")
    private TechStack defaultStack;

    protected DomainNavigation() {}

    public Integer getId() { return id; }
    public Domain getDomain() { return domain; }
    public StackCategory getDefaultCategory() { return defaultCategory; }
    public TechStack getDefaultStack() { return defaultStack; }
}
