const { cmd } = require('./_db');
const K = 'yumix:msgs';
module.exports = async (req, res) => {
  const pw = process.env.OWNER_PASSWORD;
  if (!pw) return res.status(401).json({ error: 'Set OWNER_PASSWORD in Vercel first (see README)' });
  if (req.headers['x-owner-password'] !== pw) return res.status(401).json({ error: 'Wrong password' });
  try {
    const all = await cmd(['LRANGE', K, 0, -1]);
    if (all === null) return res.status(503).json({ error: 'Database not connected (see README)' });
    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (id === 'all') await cmd(['DEL', K]);
      else { const raw = all.find((x) => JSON.parse(x).id === id); if (raw) await cmd(['LREM', K, 1, raw]); }
      return res.json({ ok: true });
    }
    res.json({ messages: all.map((x) => JSON.parse(x)) });
  } catch (e) { res.status(500).json({ error: 'Server error' }); }
};
