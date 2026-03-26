-- Migration 012: Tags
CREATE TABLE IF NOT EXISTS tags (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    slug VARCHAR(120) UNIQUE NOT NULL
);

COMMENT ON TABLE tags IS 'Tags for categorizing questions';

CREATE UNIQUE INDEX IF NOT EXISTS idx_tags_slug ON tags(slug);
