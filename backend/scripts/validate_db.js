const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'interviewexplainer',
  user: 'interviewexplainer',
  password: 'changeme',
});

async function validate() {
  const client = await pool.connect();
  try {
    const res = await client.query(`
      SELECT ts.slug as stack_slug, COUNT(qsi.question_id) as q_count 
      FROM tech_stacks ts 
      LEFT JOIN question_stack_index qsi ON ts.id = qsi.stack_id 
      JOIN domain_stack_map dsm ON ts.id = dsm.stack_id
      JOIN domains d ON d.id = dsm.domain_id
      WHERE d.slug = 'java-backend-1-3'
      GROUP BY ts.slug
    `);
    
    console.log('--- Questions per Stack (java-backend-1-3) ---');
    console.table(res.rows);

    const ansRes = await client.query(`
      SELECT dsm.domain_id, COUNT(ans_sec.id) as total_sections
      FROM answer_sections ans_sec
      JOIN question_stack_index qsi ON qsi.question_id = ans_sec.question_id
      JOIN domain_stack_map dsm ON dsm.stack_id = qsi.stack_id
      JOIN domains d ON d.id = dsm.domain_id
      WHERE d.slug = 'java-backend-1-3'
      GROUP BY dsm.domain_id
    `);
    
    console.log('\n--- Total Answer Sections for Domain ---');
    console.table(ansRes.rows);

  } finally {
    client.release();
    await pool.end();
  }
}

validate().catch(console.error);
