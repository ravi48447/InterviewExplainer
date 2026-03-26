package com.interviewexplainer.backendapi.modules.content.entity;

import com.interviewexplainer.backendapi.modules.content.entity.Question;
import jakarta.persistence.*;

@Entity
@Table(name = "question_quizzes")
public class QuestionQuiz {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "question_id")
    private Question question;

    @Column(name = "quiz_question", nullable = false, columnDefinition = "TEXT")
    private String quizQuestion;

    // JSONB column defining the quiz options (e.g. array of strings)
    @Column(columnDefinition = "jsonb", nullable = false)
    private String options;

    @Column(name = "correct_answer", nullable = false, columnDefinition = "TEXT")
    private String correctAnswer;

    public QuestionQuiz() {}

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public Question getQuestion() { return question; }
    public void setQuestion(Question question) { this.question = question; }

    public String getQuizQuestion() { return quizQuestion; }
    public void setQuizQuestion(String quizQuestion) { this.quizQuestion = quizQuestion; }

    public String getOptions() { return options; }
    public void setOptions(String options) { this.options = options; }

    public String getCorrectAnswer() { return correctAnswer; }
    public void setCorrectAnswer(String correctAnswer) { this.correctAnswer = correctAnswer; }
}
