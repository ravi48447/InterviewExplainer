-- Migration 015: Question Page Cache
-- Precomputed JSON page for fast SEO serving
CREATE TABLE IF NOT EXISTS question_page_cache (
    question_id INT PRIMARY KEY REFERENCES questions(id) ON DELETE CASCADE,
    slug VARCHAR(255) UNIQUE NOT NULL,
    page_json JSONB,
    last_generated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    version INT DEFAULT 1
);

COMMENT ON TABLE question_page_cache IS 'Precomputed JSONB page data for fast question page loading';

CREATE INDEX IF NOT EXISTS idx_page_cache_slug ON question_page_cache(slug);
CREATE INDEX IF NOT EXISTS idx_page_cache_generated ON question_page_cache(last_generated);
