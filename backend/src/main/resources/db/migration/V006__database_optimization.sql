-- V006: Add GIN indexes for full-text search and composite indexes to optimize queries

-- GIN Index for fast full-text title search
CREATE INDEX IF NOT EXISTS idx_questions_title_gin ON questions USING gin(to_tsvector('english', title));

-- Composite index to optimize joins and filtering on domain and stack
CREATE INDEX IF NOT EXISTS idx_dsm_domain_stack ON domain_stack_map(domain_id, stack_id);
