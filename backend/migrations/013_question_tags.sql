-- Migration 013: Question Tags
CREATE TABLE IF NOT EXISTS question_tags (
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    tag_id INT REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY(question_id, tag_id)
);

COMMENT ON TABLE question_tags IS 'Many-to-many mapping between questions and tags';

CREATE INDEX IF NOT EXISTS idx_question_tags_tag ON question_tags(tag_id);
CREATE INDEX IF NOT EXISTS idx_question_tags_question ON question_tags(question_id);
