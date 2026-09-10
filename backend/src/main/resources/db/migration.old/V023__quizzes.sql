-- Migration 023: Quizzes
-- Adds table for interactive quick quizzes on the question page

CREATE TABLE IF NOT EXISTS question_quizzes (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
    quiz_question TEXT NOT NULL,
    options JSONB NOT NULL,
    correct_answer TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_question_quizzes_question ON question_quizzes(question_id);

