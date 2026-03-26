package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "stack_categories")
public class StackCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @Column(nullable = false, length = 255)
    private String name;

    @Column(nullable = false, length = 255, unique = true)
    private String slug;

    // Default constructor for JPA
    protected StackCategory() {}

    public StackCategory(String name, String slug) {
        this.name = name;
        this.slug = slug;
    }

    public Integer getId() { return id; }
    public String getName() { return name; }
    public String getSlug() { return slug; }
}
