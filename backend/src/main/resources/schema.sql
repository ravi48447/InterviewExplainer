-- Comprehensive Schema Purge for InterviewExplainer V3 Recovery
-- This script clears ALL content, user tables, and custom types to allow a clean reconstruction.
-- WARNING: This will delete all data. DataSeeder/DomainSyncService must be run after.

-- 0. Custom Types
DROP TYPE IF EXISTS question_difficulty CASCADE;
DROP TYPE IF EXISTS experience_band CASCADE;

-- 1. Progress and Personalization
DROP TABLE IF EXISTS user_bookmarks CASCADE;
DROP TABLE IF EXISTS user_progress CASCADE;
DROP TABLE IF EXISTS user_question_progress CASCADE;
DROP TABLE IF EXISTS user_activity_log CASCADE;
DROP TABLE IF EXISTS user_streaks CASCADE;
DROP TABLE IF EXISTS user_profiles CASCADE;

-- 2. Content Structure (Taxonomy)
DROP TABLE IF EXISTS domain_navigation CASCADE;
DROP TABLE IF EXISTS domain_stack_map CASCADE;
DROP TABLE IF EXISTS domain_category_map CASCADE;
DROP TABLE IF EXISTS domain_categories CASCADE;
DROP TABLE IF EXISTS category_stacks CASCADE;
DROP TABLE IF EXISTS stack_topics CASCADE;
DROP TABLE IF EXISTS question_stack_index CASCADE;
DROP TABLE IF EXISTS question_keywords CASCADE;
DROP TABLE IF EXISTS question_internal_links CASCADE;
DROP TABLE IF EXISTS question_relation CASCADE;
DROP TABLE IF EXISTS question_quizzes CASCADE;

-- 3. Core Content Tables
DROP TABLE IF EXISTS answer_contents CASCADE;
DROP TABLE IF EXISTS answer_sections CASCADE;
DROP TABLE IF EXISTS question_page_cache CASCADE;
DROP TABLE IF EXISTS questions CASCADE;
DROP TABLE IF EXISTS topics CASCADE;
DROP TABLE IF EXISTS stacks CASCADE;
DROP TABLE IF EXISTS tech_stacks CASCADE;
DROP TABLE IF EXISTS categories CASCADE;
DROP TABLE IF EXISTS stack_categories CASCADE;
DROP TABLE IF EXISTS domains CASCADE;
DROP TABLE IF EXISTS tracks CASCADE;
DROP TABLE IF EXISTS experience_levels CASCADE;
DROP TABLE IF EXISTS languages CASCADE;
DROP TABLE IF EXISTS tags CASCADE;

-- 4. User Base
DROP TABLE IF EXISTS users CASCADE;
