-- Migration 003: Experience Levels
CREATE TABLE IF NOT EXISTS experience_levels (
    id SERIAL PRIMARY KEY,
    label VARCHAR(50) NOT NULL,
    min_years INT,
    max_years INT
);

COMMENT ON TABLE experience_levels IS 'Candidate experience bands: 0-1, 1-3, 3-5, 5+';
