-- Migration 003: Experience Levels
CREATE TABLE IF NOT EXISTS experience_levels (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    min_years INT,
    max_years INT
);

