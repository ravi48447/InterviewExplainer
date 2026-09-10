-- Migration 006: Domain Stack Map
-- Many-to-many: allows stacks to appear in multiple domains
CREATE TABLE IF NOT EXISTS domain_stack_map (
    domain_id INT REFERENCES domains(id) ON DELETE CASCADE,
    stack_id INT REFERENCES tech_stacks(id) ON DELETE CASCADE,
    display_order INT DEFAULT 0,
    PRIMARY KEY(domain_id, stack_id)
);


CREATE INDEX IF NOT EXISTS idx_domain_stack_domain_order
    ON domain_stack_map(domain_id, display_order);
CREATE INDEX IF NOT EXISTS idx_domain_stack_stack
    ON domain_stack_map(stack_id);
