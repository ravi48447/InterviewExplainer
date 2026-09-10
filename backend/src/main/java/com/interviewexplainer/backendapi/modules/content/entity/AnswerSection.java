package com.interviewexplainer.backendapi.modules.content.entity;

import com.interviewexplainer.backendapi.modules.content.entity.Question;
import com.interviewexplainer.backendapi.modules.content.entity.enums.AnswerSectionType;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "answer_sections")
public class AnswerSection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id", nullable = false)
    private Question question;

    @Enumerated(EnumType.STRING)
    @Column(name = "section_type", length = 50, nullable = false)
    private AnswerSectionType sectionType;

    @Column(name = "section_order", nullable = false)
    private Integer sectionOrder = 0;

    @Column(columnDefinition = "TEXT")
    private String content;

    @Column(name = "created_at")
    private LocalDateTime createdAt = LocalDateTime.now();

    @Column(name = "updated_at")
    private LocalDateTime updatedAt = LocalDateTime.now();

    protected AnswerSection() {}

    public AnswerSection(Question question, AnswerSectionType sectionType,
                         Integer sectionOrder, String content) {
        this.question = question;
        this.sectionType = sectionType;
        this.sectionOrder = sectionOrder;
        this.content = content;
    }

    public Long getId() { return id; }
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }
    public AnswerSectionType getSectionType() { return sectionType; }
    public void setSectionType(AnswerSectionType sectionType) { this.sectionType = sectionType; }
    public Integer getSectionOrder() { return sectionOrder; }
    public void setSectionOrder(Integer sectionOrder) { this.sectionOrder = sectionOrder; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }
}
