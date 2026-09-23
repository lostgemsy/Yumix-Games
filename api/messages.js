const { readMessages, deleteMessage, getDefaultOwnerPassword } = require('./_db');
module.exports = async (req, res) => {
  const pw = getDefaultOwnerPassword();
  if (req.headers['x-owner-password'] !== pw) return res.status(401).json({ error: 'Wrong password' });
  try {
    const all = await readMessages();
    if (req.method === 'DELETE') {
      const id = req.query.id;
      await deleteMessage(id);
      return res.json({ ok: true });
    }
    res.json({ messages: all.map((x) => JSON.parse(x)) });
  } catch (e) {
    res.status(500).json({ error: 'Server error' });
  }
};
