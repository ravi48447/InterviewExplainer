-- ================================================
-- Content Generation Pipeline Schema
-- Version: 2.0.0 - Modular Architecture
-- ================================================

-- Generation Jobs Table
CREATE TABLE IF NOT EXISTS generation_jobs (
    id BIGSERIAL PRIMARY KEY,
    stack_id BIGINT,
    target_difficulty VARCHAR(50),
    quantity_requested INT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'PENDING',
    prompt TEXT,
    model VARCHAR(100),
    retry_count INT DEFAULT 0,
    failure_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_generation_stack FOREIGN KEY (stack_id) REFERENCES tech_stacks(id) ON DELETE CASCADE
);

CREATE INDEX idx_generation_jobs_status ON generation_jobs(status, created_at);
CREATE INDEX idx_generation_jobs_stack ON generation_jobs(stack_id);

-- Generation Results Table
CREATE TABLE IF NOT EXISTS generation_results (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    question_title VARCHAR(255) NOT NULL,
    question_slug VARCHAR(255) NOT NULL,
    difficulty VARCHAR(50),
    quality_score DECIMAL(3,2),
    is_duplicate BOOLEAN DEFAULT FALSE,
    duplicate_question_slug VARCHAR(255),
    sections_json JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_generation_result_job FOREIGN KEY (job_id) REFERENCES generation_jobs(id) ON DELETE CASCADE
);

CREATE INDEX idx_generation_results_job ON generation_results(job_id);
CREATE INDEX idx_generation_results_quality ON generation_results(quality_score DESC) WHERE quality_score IS NOT NULL;
CREATE INDEX idx_generation_results_slug ON generation_results(question_slug);

-- Generation Validation Results Table
CREATE TABLE IF NOT EXISTS generation_validation_results (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    result_id BIGINT NOT NULL,
    validation_type VARCHAR(50) NOT NULL,
    passed BOOLEAN NOT NULL,
    score DECIMAL(3,2),
    details JSONB,
    validated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_validation_job FOREIGN KEY (job_id) REFERENCES generation_jobs(id) ON DELETE CASCADE,
    CONSTRAINT fk_validation_result FOREIGN KEY (result_id) REFERENCES generation_results(id) ON DELETE CASCADE
);

CREATE INDEX idx_validation_results_job ON generation_validation_results(job_id);
CREATE INDEX idx_validation_results_result ON generation_validation_results(result_id);
CREATE INDEX idx_validation_type ON generation_validation_results(validation_type, passed);

-- Add generation metadata to questions table
ALTER TABLE questions ADD COLUMN IF NOT EXISTS generation_status VARCHAR(50) DEFAULT 'manual';
ALTER TABLE questions ADD COLUMN IF NOT EXISTS generation_method VARCHAR(50);
ALTER TABLE questions ADD COLUMN IF NOT EXISTS generation_date TIMESTAMP;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS quality_score DECIMAL(3,2);
ALTER TABLE questions ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT TRUE;
ALTER TABLE questions ADD COLUMN IF NOT EXISTS content_version INT DEFAULT 1;

CREATE INDEX idx_questions_generation_status ON questions(generation_status) WHERE generation_status != 'manual';
CREATE INDEX idx_questions_quality ON questions(quality_score DESC) WHERE is_published = TRUE;
CREATE INDEX idx_questions_published ON questions(is_published, quality_score DESC) WHERE is_published = TRUE;

-- Add generation metadata to answer_sections table
ALTER TABLE answer_sections ADD COLUMN IF NOT EXISTS generation_prompt_id BIGINT;
ALTER TABLE answer_sections ADD COLUMN IF NOT EXISTS token_count INT;
ALTER TABLE answer_sections ADD COLUMN IF NOT EXISTS generation_temperature DECIMAL(2,1);
ALTER TABLE answer_sections ADD COLUMN IF NOT EXISTS validation_score DECIMAL(3,2);
ALTER TABLE answer_sections ADD COLUMN IF NOT EXISTS needs_human_review BOOLEAN DEFAULT FALSE;

-- Generation Prompts Template Table
CREATE TABLE IF NOT EXISTS generation_prompts (
    id BIGSERIAL PRIMARY KEY,
    prompt_type VARCHAR(50) NOT NULL,
    template_version INT NOT NULL,
    prompt_template TEXT NOT NULL,
    model_config JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

CREATE INDEX idx_generation_prompts_type ON generation_prompts(prompt_type, is_active) WHERE is_active = TRUE;

-- Content Quality Metrics Table
CREATE TABLE IF NOT EXISTS content_quality_metrics (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    metric_type VARCHAR(50) NOT NULL,
    metric_value DECIMAL(5,2) NOT NULL,
    measured_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    measurement_method VARCHAR(100),
    CONSTRAINT fk_quality_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE
);

CREATE INDEX idx_quality_metrics_question ON content_quality_metrics(question_id, metric_type);
CREATE INDEX idx_quality_metrics_type ON content_quality_metrics(metric_type, metric_value DESC);

-- Content Import Tracking Table
CREATE TABLE IF NOT EXISTS content_imports (
    id BIGSERIAL PRIMARY KEY,
    import_source VARCHAR(100) NOT NULL,
    stack_id BIGINT,
    file_path TEXT,
    total_questions INT,
    imported_questions INT DEFAULT 0,
    skipped_questions INT DEFAULT 0,
    import_status VARCHAR(50) DEFAULT 'pending',
    error_log TEXT,
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    imported_by UUID,
    CONSTRAINT fk_import_stack FOREIGN KEY (stack_id) REFERENCES tech_stacks(id) ON DELETE SET NULL
);

CREATE INDEX idx_content_imports_status ON content_imports(import_status, started_at);
CREATE INDEX idx_content_imports_stack ON content_imports(stack_id);

-- Question Versioning Table
CREATE TABLE IF NOT EXISTS question_versions (
    id BIGSERIAL PRIMARY KEY,
    question_id BIGINT NOT NULL,
    version_number INT NOT NULL,
    title VARCHAR(255),
    difficulty VARCHAR(50),
    content_snapshot JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by UUID,
    change_description TEXT,
    is_current BOOLEAN DEFAULT FALSE,
    CONSTRAINT fk_version_question FOREIGN KEY (question_id) REFERENCES questions(id) ON DELETE CASCADE,
    UNIQUE(question_id, version_number)
);

CREATE INDEX idx_question_versions_question ON question_versions(question_id, version_number DESC);
CREATE INDEX idx_question_versions_current ON question_versions(question_id) WHERE is_current = TRUE;

-- Generation Cost Tracking Table
CREATE TABLE IF NOT EXISTS generation_costs (
    id BIGSERIAL PRIMARY KEY,
    job_id BIGINT NOT NULL,
    model_name VARCHAR(100) NOT NULL,
    input_tokens INT,
    output_tokens INT,
    estimated_cost DECIMAL(10,4),
    actual_cost DECIMAL(10,4),
    currency VARCHAR(3) DEFAULT 'USD',
    recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_cost_job FOREIGN KEY (job_id) REFERENCES generation_jobs(id) ON DELETE CASCADE
);

CREATE INDEX idx_generation_costs_job ON generation_costs(job_id);
CREATE INDEX idx_generation_costs_date ON generation_costs(recorded_at DESC);

-- Comments
COMMENT ON TABLE generation_jobs IS 'AI content generation job queue';
COMMENT ON TABLE generation_results IS 'Generated question drafts pending validation';
COMMENT ON TABLE generation_validation_results IS 'Validation checks for generated content';
COMMENT ON TABLE generation_prompts IS 'Versioned prompt templates for content generation';
COMMENT ON TABLE content_quality_metrics IS 'Quality scores for questions (readability, accuracy, etc)';
COMMENT ON TABLE question_versions IS 'Version history for questions';
COMMENT ON TABLE generation_costs IS 'LLM API cost tracking';