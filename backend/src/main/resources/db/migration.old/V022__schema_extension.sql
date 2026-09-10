-- Migration 022: Schema Extension
-- Adds missing tables for internal linking, keyword graph, bookmarks, and user progress
-- SAFE: only uses CREATE TABLE IF NOT EXISTS and CREATE INDEX IF NOT EXISTS

-- STEP 11: Automatic internal linking engine
CREATE TABLE IF NOT EXISTS question_internal_links (
    id BIGSERIAL PRIMARY KEY,
    source_question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
    target_question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
    link_type VARCHAR(50),
    relevance_score INT DEFAULT 0
);

-- STEP 12a: Keyword dictionary (StackOverflow-style)
CREATE TABLE IF NOT EXISTS keywords (
    id SERIAL PRIMARY KEY,
    keyword VARCHAR(200) UNIQUE NOT NULL
);

-- STEP 12b: Question → keyword map
CREATE TABLE IF NOT EXISTS question_keywords (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
    keyword_id INT REFERENCES keywords(id) ON DELETE CASCADE,
    UNIQUE(question_id, keyword_id)
);

-- STEP 14: User bookmarks
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
);

-- STEP 15: User progress tracker
CREATE TABLE IF NOT EXISTS user_progress (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL,
    question_id BIGINT REFERENCES questions(id) ON DELETE CASCADE,
    completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    UNIQUE(user_id, question_id)
);

-- STEP 16: Performance indexes
CREATE INDEX IF NOT EXISTS idx_internal_links_source ON question_internal_links(source_question_id);
CREATE INDEX IF NOT EXISTS idx_internal_links_target ON question_internal_links(target_question_id);
CREATE INDEX IF NOT EXISTS idx_internal_links_type ON question_internal_links(link_type);
CREATE INDEX IF NOT EXISTS idx_keyword_lookup ON question_keywords(keyword_id);
CREATE INDEX IF NOT EXISTS idx_question_keywords_question ON question_keywords(question_id);
CREATE INDEX IF NOT EXISTS idx_user_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_user ON user_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_progress_completed ON user_progress(user_id, completed);

