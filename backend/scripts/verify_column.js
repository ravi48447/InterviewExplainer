const { Pool } = require('pg');
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'interviewexplainer',
  user: 'interviewexplainer',
  password: 'changeme',
});
async function run() {
  try {
    const res = await pool.query("SELECT column_name FROM information_schema.columns WHERE table_name = 'questions' AND column_name = 'views_count'");
    console.log('Columns found:', res.rows);
    if (res.rows.length === 0) {
      console.log('Adding missing column...');
      await pool.query('ALTER TABLE questions ADD COLUMN views_count INTEGER DEFAULT 0');
      console.log('Column added.');
    }
  } catch (e) {
    console.error('Error:', e);
  } finally {
    await pool.end();
  }
}
run();
