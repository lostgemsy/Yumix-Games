const { cmd } = require('./_db');
module.exports = async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  const b = req.body || {};
  const name = String(b.name || 'Guest').trim().slice(0, 30) || 'Guest';
  const text = String(b.text || '').trim().slice(0, 500);
  if (!text) return res.status(400).json({ error: 'Message is empty' });
  const m = { id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), name, text, t: Date.now() };
  try {
    if ((await cmd(['LPUSH', 'yumix:msgs', JSON.stringify(m)])) === null) throw new Error('no db');
    await cmd(['LTRIM', 'yumix:msgs', 0, 499]);
    res.json({ ok: true });
  } catch (e) {
    res.status(503).json({ error: 'Messages are not set up yet. Try again later.' });
  }
};
