const { Pool } = require('pg');

const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'interviewexplainer',
  user: 'interviewexplainer',
  password: 'changeme',
});

async function fix() {
  const client = await pool.connect();
  try {
    // Set default version for any domains that have null version
    const r = await client.query(`UPDATE domains SET version = 1 WHERE version IS NULL`);
    console.log(`Updated ${r.rowCount} domain rows with version=1`);

    // Also check tech_stacks table for same issue
    const r2 = await client.query(`UPDATE tech_stacks SET version = 1 WHERE version IS NULL`);
    console.log(`Updated ${r2.rowCount} tech_stack rows with version=1`);
  } finally {
    client.release();
    await pool.end();
  }
}

fix().catch(console.error);
