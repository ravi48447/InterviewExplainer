-- InterviewExplainer V3 Fix: Align schema with UUID User System
-- This script fixes the type mismatch between legacy BIGINT user_id and new UUID user_id.

-- 1. DROP legacy/conflicting tables to start fresh with UUID
DROP TABLE IF EXISTS user_bookmarks CASCADE;

-- 2. Create user_bookmarks with UUID
CREATE TABLE user_bookmarks (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    question_id BIGINT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_bookmark_user
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_bookmark_question
        FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE(user_id, question_id)
);

-- 3. Ensure user_question_progress uses BIGINT for question_id (consistent with questions.id)
-- Note: It already uses UUID for user_id in migration_v3.
ALTER TABLE IF EXISTS user_question_progress 
    ALTER COLUMN question_id TYPE BIGINT;

-- 4. Ensure user_activity_log uses BIGINT for entity_id
ALTER TABLE IF EXISTS user_activity_log 
    ALTER COLUMN entity_id TYPE BIGINT;

-- 5. Create users table if for some reason it doesn't match UUID (backup check)
-- Actually, we know it exists if signup worked.
