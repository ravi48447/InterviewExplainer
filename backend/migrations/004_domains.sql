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

COMMENT ON TABLE domains IS 'Specific preparation paths combining language + track + experience';

CREATE UNIQUE INDEX IF NOT EXISTS idx_domains_slug ON domains(slug);
CREATE INDEX IF NOT EXISTS idx_domains_language ON domains(language_id);
CREATE INDEX IF NOT EXISTS idx_domains_track ON domains(track_id);
CREATE INDEX IF NOT EXISTS idx_domains_experience ON domains(experience_id);
