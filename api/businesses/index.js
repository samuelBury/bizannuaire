import { getPool, cors } from '../_db.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pool = getPool();

  if (req.method === 'GET') {
    const { rows } = await pool.query('SELECT * FROM businesses ORDER BY sponsored DESC, rating DESC');
    return res.json(rows);
  }

  if (req.method === 'POST') {
    const b = req.body;
    const { rows } = await pool.query(
      `INSERT INTO businesses (name, category, description, image, rating, review_count, email, phone, website, address, country, city, sponsored, tags)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
      [b.name, b.category, b.description, b.image, b.rating || 0, b.reviewCount || 0, b.email, b.phone, b.website, b.address, b.country, b.city, b.sponsored || false, JSON.stringify(b.tags || [])]
    );
    return res.status(201).json(rows[0]);
  }

  res.status(405).json({ error: 'Method not allowed' });
}
