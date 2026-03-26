-- Migration 017: Full Text Search
-- Add search_vector column to questions
ALTER TABLE questions
ADD COLUMN IF NOT EXISTS search_vector tsvector;

-- GIN index for fast full-text search
CREATE INDEX IF NOT EXISTS idx_questions_search
    ON questions USING GIN(search_vector);

-- Function to update search vector automatically
CREATE OR REPLACE FUNCTION update_question_search_vector()
RETURNS TRIGGER AS $$
BEGIN
    NEW.search_vector := to_tsvector('english', 
        coalesce(NEW.title, '') || ' ' ||
        coalesce(NEW.meta_description, '')
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to keep search vector updated
DROP TRIGGER IF EXISTS questions_search_vector_update ON questions;
CREATE TRIGGER questions_search_vector_update
    BEFORE INSERT OR UPDATE ON questions
    FOR EACH ROW EXECUTE FUNCTION update_question_search_vector();

-- Update existing rows
UPDATE questions SET search_vector = to_tsvector('english', 
    coalesce(title, '') || ' ' || coalesce(meta_description, '')
);
