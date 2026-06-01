package com.interviewexplainer.backendapi.modules.content.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "question_stack_index")
public class QuestionStackIndex {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "stack_id", nullable = false)
    private Long stackId;

    @Column(name = "question_id", nullable = false)
    private Long questionId;

    @Column(name = "order_index")
    private Integer orderIndex;

    @Column(name = "subcategory_slug", length = 120)
    private String subcategorySlug;

    @Column(name = "subcategory_name", length = 200)
    private String subcategoryName;

    protected QuestionStackIndex() {}

    public QuestionStackIndex(Long stackId, Long questionId, Integer orderIndex) {
        this.stackId = stackId;
        this.questionId = questionId;
        this.orderIndex = orderIndex;
    }

    public Long getId() { return id; }
    public Long getStackId() { return stackId; }
    public Long getQuestionId() { return questionId; }
    public Integer getOrderIndex() { return orderIndex; }
    public String getSubcategorySlug() { return subcategorySlug; }
    public String getSubcategoryName() { return subcategoryName; }
}
