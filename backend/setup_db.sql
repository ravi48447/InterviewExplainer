-- Check if database exists
SELECT 'Database exists' FROM pg_database WHERE datname='interviewexplainer';

-- Create database if it doesn't exist (you'll need to run this manually if needed)
-- CREATE DATABASE interviewexplainer;

-- Create user if it doesn't exist
DO
$$
BEGIN
  IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'interviewexplainer') THEN
    CREATE USER interviewexplainer WITH PASSWORD 'changeme';
  END IF;
END
$$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE interviewexplainer TO interviewexplainer;
