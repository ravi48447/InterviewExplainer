package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "experience_levels")
public class ExperienceLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String label;

    @Column(name = "min_years")
    private Integer minYears;

    @Column(name = "max_years")
    private Integer maxYears;

    protected ExperienceLevel() {}

    public ExperienceLevel(String label, Integer minYears, Integer maxYears) {
        this.label = label;
        this.minYears = minYears;
        this.maxYears = maxYears;
    }

    public Long getId() { return id; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
    public Integer getMinYears() { return minYears; }
    public void setMinYears(Integer minYears) { this.minYears = minYears; }
    public Integer getMaxYears() { return maxYears; }
    public void setMaxYears(Integer maxYears) { this.maxYears = maxYears; }
}
