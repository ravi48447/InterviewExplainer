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

COMMENT ON TABLE tech_stacks IS 'Reusable technology stacks that can appear across multiple domains';

CREATE UNIQUE INDEX IF NOT EXISTS idx_tech_stacks_slug ON tech_stacks(slug);
