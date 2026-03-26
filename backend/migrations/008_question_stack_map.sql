-- Migration 008: Question Stack Map
-- Maps questions to stacks, enabling reuse and navigation
CREATE TABLE IF NOT EXISTS question_stack_map (
    question_id INT REFERENCES questions(id) ON DELETE CASCADE,
    stack_id INT REFERENCES tech_stacks(id) ON DELETE CASCADE,
    order_index INT DEFAULT 0,
    PRIMARY KEY(question_id, stack_id)
);

COMMENT ON TABLE question_stack_map IS 'Maps questions to stacks with ordering for next/prev navigation';

CREATE INDEX IF NOT EXISTS idx_qsm_stack_order
    ON question_stack_map(stack_id, order_index);
CREATE INDEX IF NOT EXISTS idx_qsm_question
    ON question_stack_map(question_id);
