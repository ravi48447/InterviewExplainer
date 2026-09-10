-- Migration 001: Languages Table

CREATE TABLE IF NOT EXISTS languages (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL,
    description TEXT,
    icon_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

COMMENT ON TABLE languages IS 'Programming languages supported by the platform';
COMMENT ON COLUMN languages.slug IS 'URL-safe unique identifier used in SEO URLs';

CREATE UNIQUE INDEX IF NOT EXISTS idx_languages_slug ON languages(slug);
