-- User Bookmarks Table
CREATE TABLE IF NOT EXISTS user_bookmarks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    question_id INTEGER NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, question_id)
);

CREATE INDEX IF NOT EXISTS idx_bookmarks_user ON user_bookmarks(user_id);
CREATE INDEX IF NOT EXISTS idx_bookmarks_question ON user_bookmarks(question_id);
