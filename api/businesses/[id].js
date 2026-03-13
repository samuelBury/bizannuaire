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
  const { id } = req.query;

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM businesses WHERE id = $1', [id]);
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  }

  if (req.method === 'PUT') {
    const b = req.body;
    const { rows } = await pool.query(
      `UPDATE businesses SET name=$1, category=$2, description=$3, image=$4, rating=$5, review_count=$6, email=$7, phone=$8, website=$9, address=$10, country=$11, city=$12, sponsored=$13, tags=$14
       WHERE id=$15 RETURNING *`,
      [b.name, b.category, b.description, b.image, b.rating || 0, b.reviewCount || 0, b.email, b.phone, b.website, b.address, b.country, b.city, b.sponsored || false, JSON.stringify(b.tags || []), id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  }

  if (req.method === 'DELETE') {
    await pool.query('DELETE FROM businesses WHERE id = $1', [id]);
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
