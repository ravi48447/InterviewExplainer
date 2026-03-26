-- Migration 014: Question Relations (Knowledge Graph)
CREATE TABLE IF NOT EXISTS question_relations (
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    related_question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    relation_type relation_type_enum DEFAULT 'related',
    PRIMARY KEY(question_id, related_question_id)
);


CREATE INDEX IF NOT EXISTS idx_qr_question ON question_relations(question_id);
CREATE INDEX IF NOT EXISTS idx_qr_related ON question_relations(related_question_id);
CREATE INDEX IF NOT EXISTS idx_qr_type ON question_relations(relation_type);
