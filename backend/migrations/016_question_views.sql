-- Migration 016: Question Views (Analytics)
CREATE TABLE IF NOT EXISTS question_views (
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    view_date DATE NOT NULL DEFAULT CURRENT_DATE,
    views INT DEFAULT 0,
    PRIMARY KEY(question_id, view_date)
);

COMMENT ON TABLE question_views IS 'Daily view count analytics per question';

CREATE INDEX IF NOT EXISTS idx_views_question ON question_views(question_id);
CREATE INDEX IF NOT EXISTS idx_views_date ON question_views(view_date DESC);
