-- InterviewExplainer V3 Migration: User System Layer (UUID COMPATIBLE)
-- Goal: Add user authentication extension, progress tracking, and personalization safely.

-- NOTE: existing 'users' and 'user_bookmarks' tables are detected. 
-- We EXTEND with new tables referencing UUID user ids.

-- 1. Create User Profiles (Learning preferences)
CREATE TABLE IF NOT EXISTS user_profiles (
    user_id UUID PRIMARY KEY,
    primary_domain_id INTEGER,
    experience_level VARCHAR(50),
    daily_goal_questions INTEGER DEFAULT 3,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_profile_user
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_profile_domain
        FOREIGN KEY(primary_domain_id) REFERENCES domains(id)
);

-- 2. Create User Question Progress (Core tracking table)
-- Using name 'user_question_progress' as requested, separate from legacy 'user_progress'
CREATE TABLE IF NOT EXISTS user_question_progress (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    question_id INTEGER NOT NULL,
    status VARCHAR(20) DEFAULT 'not_started',
    time_spent_seconds INTEGER DEFAULT 0,
    attempt_count INTEGER DEFAULT 0,
    last_viewed_at TIMESTAMP,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_progress_user
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_progress_question
        FOREIGN KEY(question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE(user_id, question_id)
);

-- 3. Create User Activity Log
CREATE TABLE IF NOT EXISTS user_activity_log (
    id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL,
    activity_type VARCHAR(50), -- e.g., 'login', 'question_view', 'question_complete'
    entity_type VARCHAR(50),   -- e.g., 'question', 'domain'
    entity_id INTEGER,
    metadata JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_activity_user
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 4. Create User Streak System
CREATE TABLE IF NOT EXISTS user_streaks (
    user_id UUID PRIMARY KEY,
    current_streak INTEGER DEFAULT 0,
    longest_streak INTEGER DEFAULT 0,
    last_activity_date DATE,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_streak_user
        FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- 5. Add Performance Indexes (Skip existing ones)
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_progress_user_uuid') THEN
        CREATE INDEX idx_progress_user_uuid ON user_question_progress(user_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_progress_question_v3') THEN
        CREATE INDEX idx_progress_question_v3 ON user_question_progress(question_id);
    END IF;
    IF NOT EXISTS (SELECT 1 FROM pg_class WHERE relname = 'idx_activity_user_uuid') THEN
        CREATE INDEX idx_activity_user_uuid ON user_activity_log(user_id);
    END IF;
END $$;

--------------------------------------------------------------------------------
-- DOWN MIGRATION (Rollback script)
--------------------------------------------------------------------------------
/*
DROP TABLE IF EXISTS user_streaks;
DROP TABLE IF EXISTS user_activity_log;
DROP TABLE IF EXISTS user_question_progress;
DROP TABLE IF EXISTS user_profiles;
*/
