-- Users Table for Authentication
-- Creates the base users table with UUID primary key

CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    experience_band VARCHAR(50) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Index for email lookups
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- Index for experience band filtering
CREATE INDEX IF NOT EXISTS idx_users_experience ON users(experience_band);