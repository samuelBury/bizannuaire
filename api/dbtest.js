import pg from 'pg';

export default async function handler(req, res) {
  try {
    const { Pool } = pg;
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false },
    });
    const result = await pool.query('SELECT NOW()');
    res.json({ ok: true, time: result.rows[0].now });
  } catch (err) {
    res.status(500).json({ error: err.message, stack: err.stack });
  }
}
