-- Migration 000: Enum Types
-- Run this first before any tables

DO $$ BEGIN
    CREATE TYPE question_difficulty AS ENUM ('easy', 'medium', 'hard');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE relation_type_enum AS ENUM ('related', 'prerequisite', 'advanced', 'similar');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE answer_section_enum AS ENUM (
        'interviewer_expectation',
        'core_concepts',
        'important_points',
        'code_example',
        'speakable_answer',
        'followup_questions'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;
