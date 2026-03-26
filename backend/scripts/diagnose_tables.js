const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'interviewexplainer',
  user: 'interviewexplainer',
  password: 'changeme',
});

async function diagnose() {
  const client = await pool.connect();
  try {
    // Check what tables exist with "question_stack" in the name
    const tables = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_name LIKE 'question_stack%'
    `);
    console.log('--- question_stack* tables:');
    console.table(tables.rows);

    // Check the tech_stacks table for jenkins stack
    const stacks = await client.query(`
      SELECT id, slug, name FROM tech_stacks WHERE slug IN ('jenkins', 'mockito', 'rabbitmq', 'junit', 'system-design-basics', 'advanced-java')
    `);
    console.log('\n--- Tech stacks by slug:');
    console.table(stacks.rows);

    // Check question_stack_index
    const qsi = await client.query(`
      SELECT qsi.stack_id, ts.slug, COUNT(*) FROM question_stack_index qsi
      JOIN tech_stacks ts ON ts.id = qsi.stack_id
      WHERE ts.slug IN ('jenkins', 'mockito', 'rabbitmq', 'junit', 'system-design-basics', 'advanced-java')
      GROUP BY qsi.stack_id, ts.slug
    `);
    console.log('\n--- Questions in question_stack_index for our stacks:');
    console.table(qsi.rows);

    // Check if question_stack_map table exists and what's in it
    try {
      const qsm = await client.query(`SELECT stack_id, COUNT(*) FROM question_stack_map GROUP BY stack_id LIMIT 5`);
      console.log('\n--- question_stack_map counts (top 5):');
      console.table(qsm.rows);
    } catch(e) {
      console.log('\n--- question_stack_map does not exist or error:', e.message);
    }

  } finally {
    client.release();
    await pool.end();
  }
}

diagnose().catch(console.error);
