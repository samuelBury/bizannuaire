import crypto from 'crypto';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  const { username, password } = req.body || {};
  const validUser = process.env.ADMIN_USER || 'admin';
  const validPass = process.env.ADMIN_PASSWORD;

  if (!validPass) return res.status(500).json({ error: 'Admin password not configured' });

  if (username === validUser && password === validPass) {
    const token = crypto.createHmac('sha256', validPass).update(username + Date.now()).digest('hex');
    return res.json({ token });
  }

  res.status(401).json({ error: 'Identifiants incorrects' });
}
