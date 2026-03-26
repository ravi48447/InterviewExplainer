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
-- Migration 001: Languages Table

CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX IF NOT EXISTS idx_languages_slug ON languages(slug);
-- Migration 002: Tracks Table
CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT
);


CREATE UNIQUE INDEX IF NOT EXISTS idx_tracks_slug ON tracks(slug);
-- Migration 003: Experience Levels
CREATE TABLE IF NOT EXISTS experience_levels (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    min_years INT,
    max_years INT
);

-- Migration 004: Domains Table
-- A domain is a specific preparation path (e.g. Java Fullstack 1-3)
CREATE TABLE IF NOT EXISTS domains (
    id SERIAL PRIMARY KEY,
    language_id INT REFERENCES languages(id) ON DELETE SET NULL,
    track_id INT REFERENCES tracks(id) ON DELETE SET NULL,
    experience_id INT REFERENCES experience_levels(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    meta_title VARCHAR(255),
    meta_description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX IF NOT EXISTS idx_domains_slug ON domains(slug);
CREATE INDEX IF NOT EXISTS idx_domains_language ON domains(language_id);
CREATE INDEX IF NOT EXISTS idx_domains_track ON domains(track_id);
CREATE INDEX IF NOT EXISTS idx_domains_experience ON domains(experience_id);
-- Migration 005: Tech Stacks Table
-- Reusable technology stacks (e.g. Core Java, Spring Boot, React, SQL)
CREATE TABLE IF NOT EXISTS tech_stacks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE UNIQUE INDEX IF NOT EXISTS idx_tech_stacks_slug ON tech_stacks(slug);
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
-- Migration 011: Answer Sections
-- Each question has exactly 6 structured sections
CREATE TABLE IF NOT EXISTS answer_sections (
    id SERIAL PRIMARY KEY,
    question_id INT REFERENCES questions(id) ON DELETE CASCADE NOT NULL,
    section_type VARCHAR(50) NOT NULL,
    section_order INT NOT NULL DEFAULT 0,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE INDEX IF NOT EXISTS idx_answer_render ON answer_sections(question_id, section_order);
CREATE INDEX IF NOT EXISTS idx_answer_type ON answer_sections(question_id, section_type);
-- Migration 012: Tags
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL
);


CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
-- Migration 014: Question Relations (Knowledge Graph)
CREATE TABLE IF NOT EXISTS question_relations (
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    related_question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    relation_type relation_type_enum DEFAULT 'related',
    PRIMARY KEY(question_id, related_question_id)
);


CREATE INDEX IF NOT EXISTS idx_qr_question ON question_relations(question_id);
CREATE INDEX IF NOT EXISTS idx_qr_related ON question_relations(related_question_id);
CREATE INDEX IF NOT EXISTS idx_qr_type ON question_relations(relation_type);
