-- Migration 011: Answer Sections
-- Each question has exactly 6 structured sections
CREATE TABLE IF NOT EXISTS answer_sections (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    section_type VARCHAR(50) NOT NULL,
    section_order INT NOT NULL DEFAULT 0,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE answer_sections IS 'Structured answer sections for each question (6 sections per question)';
COMMENT ON COLUMN answer_sections.section_type IS 'One of: interviewer_expectation, core_concepts, important_points, code_example, speakable_answer, followup_questions';

CREATE INDEX IF NOT EXISTS idx_answer_render ON answer_sections(question_id, section_order);
CREATE INDEX IF NOT EXISTS idx_answer_type ON answer_sections(question_id, section_type);
