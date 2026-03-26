-- Migration 002: Tracks Table
CREATE TABLE IF NOT EXISTS tracks (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT
);

COMMENT ON TABLE tracks IS 'Learning path types: Backend, Frontend, Fullstack, Language Core';

CREATE UNIQUE INDEX IF NOT EXISTS idx_tracks_slug ON tracks(slug);
