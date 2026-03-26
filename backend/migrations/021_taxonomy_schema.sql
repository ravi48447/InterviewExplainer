CREATE TABLE IF NOT EXISTS domain_category_map (
    domain_id INT REFERENCES domains(id) ON DELETE CASCADE,
    category_id INT REFERENCES stack_categories(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    PRIMARY KEY(domain_id, category_id)
);

ALTER TABLE experience_levels DROP CONSTRAINT IF EXISTS uk_experience_label;
ALTER TABLE experience_levels ADD CONSTRAINT uk_experience_label UNIQUE (label);

-- Drop the old table that lacked categories and recreate it
DROP TABLE IF EXISTS domain_stack_map CASCADE;

CREATE TABLE IF NOT EXISTS domain_stack_map (
    domain_id INT REFERENCES domains(id) ON DELETE CASCADE,
    category_id INT REFERENCES stack_categories(id) ON DELETE CASCADE,
    stack_id INT REFERENCES tech_stacks(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    PRIMARY KEY(domain_id, category_id, stack_id)
);

CREATE TABLE IF NOT EXISTS domain_navigation (
    id SERIAL PRIMARY KEY,
    domain_id INT UNIQUE REFERENCES domains(id) ON DELETE CASCADE,
    default_category_id INT REFERENCES stack_categories(id),
    default_stack_id INT REFERENCES tech_stacks(id)
);

CREATE TABLE IF NOT EXISTS question_stack_index (
    id BIGSERIAL PRIMARY KEY,
    stack_id INT NOT NULL,
    question_id BIGINT NOT NULL,
    order_index INT,
    UNIQUE(stack_id, question_id)
);

COMMENT ON TABLE stack_categories IS 'Categories grouping similar stacks within a domain (e.g., frontend, database)';
COMMENT ON TABLE domain_category_map IS 'Maps categories to a domain with ordering';
COMMENT ON TABLE domain_stack_map IS 'Maps stacks to a specific category within a domain with ordering';
COMMENT ON TABLE domain_navigation IS 'Stores the default start navigation for a domain';
COMMENT ON TABLE question_stack_index IS 'High performance ordered mapping of questions to stacks';
