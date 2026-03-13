import { getPool, cors } from '../_db.js';

export default async function handler(req, res) {
  cors(res);
  if (req.method === 'OPTIONS') return res.status(200).end();

  const pool = getPool();
  const { id } = req.query;

  if (req.method === 'PUT') {
    const a = req.body;
    const { rows } = await pool.query(
      'UPDATE ads SET title=$1, description=$2, image=$3, cta=$4 WHERE id=$5 RETURNING *',
      [a.title, a.description, a.image, a.cta, id]
    );
    if (!rows.length) return res.status(404).json({ error: 'Not found' });
    return res.json(rows[0]);
  }

  if (req.method === 'DELETE') {
    await pool.query('DELETE FROM ads WHERE id = $1', [id]);
    return res.status(204).end();
  }

  res.status(405).json({ error: 'Method not allowed' });
}
