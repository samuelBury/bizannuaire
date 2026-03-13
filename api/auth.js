export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });

  try {
    const { username, password } = req.body || {};
    const validUser = process.env.ADMIN_USER || 'admin';
    const validPass = process.env.ADMIN_PASSWORD;

    if (!validPass) {
      return res.status(500).json({ error: 'Admin password not configured' });
    }

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password required' });
    }

    const userMatch = username.trim() === validUser.trim();
    const passMatch = password.trim() === validPass.trim();

    if (userMatch && passMatch) {
      const token = Buffer.from(username + ':' + Date.now()).toString('base64');
      return res.status(200).json({ token });
    }

    return res.status(401).json({
      error: 'Identifiants incorrects',
      debug: {
        userLen: username.length,
        expectedUserLen: validUser.trim().length,
        passLen: password.length,
        expectedPassLen: validPass.trim().length,
      }
    });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
}
