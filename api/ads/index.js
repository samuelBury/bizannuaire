import pg from 'pg';
const { Pool } = pg;

let pool;
function getPool() {
  if (!pool) pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });
  return pool;
}

function cors(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pool = getPool();

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM ads ORDER BY id');
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const a = req.body;
    const { rows } = await pool.query(
      'INSERT INTO ads (title, description, image, cta) VALUES ($1,$2,$3,$4) RETURNING *',
      [a.title, a.description, a.image, a.cta]
    );
    return res.status(201).json(rows[0]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
