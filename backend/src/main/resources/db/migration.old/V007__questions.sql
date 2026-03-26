-- Migration 007: Questions Table
-- Each question becomes one SEO page
CREATE TABLE IF NOT EXISTS questions (
    id SERIAL PRIMARY KEY,
    title TEXT NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    difficulty VARCHAR(50) DEFAULT 'medium',
    estimated_read_time INT DEFAULT 5,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX IF NOT EXISTS idx_questions_slug ON questions(slug);
CREATE INDEX IF NOT EXISTS idx_questions_difficulty ON questions(difficulty);
