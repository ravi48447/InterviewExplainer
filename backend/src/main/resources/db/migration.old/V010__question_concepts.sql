-- Migration 010: Question Concept Map (Knowledge Graph Edges)
CREATE TABLE IF NOT EXISTS question_concepts (
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    concept_id INT REFERENCES concepts(id) ON DELETE CASCADE,
    PRIMARY KEY(question_id, concept_id)
);


CREATE INDEX IF NOT EXISTS idx_concept_question ON question_concepts(concept_id, question_id);
CREATE INDEX IF NOT EXISTS idx_question_concept ON question_concepts(question_id);
