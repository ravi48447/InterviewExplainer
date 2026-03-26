-- Migration 009: Concepts (Knowledge Graph Nodes)
CREATE TABLE IF NOT EXISTS concepts (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT
);


CREATE UNIQUE INDEX IF NOT EXISTS idx_concepts_slug ON concepts(slug);
