const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'interviewexplainer',
  user: 'interviewexplainer',
  password: 'changeme',
});

async function migrate() {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    
    // Copy data from question_stack_index to question_stack_map
    // We use ON CONFLICT DO NOTHING to avoid duplicates if some data already exists
    const r = await client.query(`
      INSERT INTO question_stack_map (stack_id, question_id, order_index)
      SELECT stack_id, question_id, order_index 
      FROM question_stack_index
      ON CONFLICT (stack_id, question_id) DO UPDATE SET order_index = EXCLUDED.order_index
    `);
    
    console.log(`Migrated ${r.rowCount} rows to question_stack_map`);
    
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Migration failed:', err.message);
  } finally {
    client.release();
    await pool.end();
  }
}

migrate().catch(console.error);
