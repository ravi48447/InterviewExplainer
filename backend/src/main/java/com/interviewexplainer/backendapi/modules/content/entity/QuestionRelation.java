package com.interviewexplainer.backendapi.modules.content.entity;

import com.interviewexplainer.backendapi.modules.content.entity.Question;
import com.interviewexplainer.backendapi.modules.content.entity.enums.RelationType;
import jakarta.persistence.*;

@Entity
@Table(name = "question_relations")
public class QuestionRelation {

    @EmbeddedId
    private QuestionRelationId id;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("questionId")
    @JoinColumn(name = "question_id")
    private Question question;

    @ManyToOne(fetch = FetchType.LAZY)
    @MapsId("relatedQuestionId")
    @JoinColumn(name = "related_question_id")
    private Question relatedQuestion;

    @Enumerated(EnumType.STRING)
    @Column(name = "relation_type", length = 50)
    private RelationType relationType = RelationType.related;

    protected QuestionRelation() {}

    public QuestionRelation(Question question, Question relatedQuestion,
                            RelationType relationType) {
        this.question = question;
        this.relatedQuestion = relatedQuestion;
        this.relationType = relationType;
        this.id = new QuestionRelationId(question.getId(), relatedQuestion.getId());
    }

    public QuestionRelationId getId() { return id; }
    public Question getQuestion() { return question; }
    public Question getRelatedQuestion() { return relatedQuestion; }
    public RelationType getRelationType() { return relationType; }
    public void setRelationType(RelationType relationType) { this.relationType = relationType; }
}
