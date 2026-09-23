const fs = require('fs');
const path = require('path');

const U = process.env.UPSTASH_REDIS_REST_URL || process.env.KV_REST_API_URL;
const T = process.env.UPSTASH_REDIS_REST_TOKEN || process.env.KV_REST_API_TOKEN;
const REDIS_KEY = 'yumix:msgs';
const FILE_PATH = process.env.YUMIX_MESSAGES_FILE || path.join(process.cwd(), '.yumix-messages.json');

exports.getDefaultOwnerPassword = () => process.env.OWNER_PASSWORD || 'yumix123';

function readLocalMessages() {
  try {
    const raw = fs.readFileSync(FILE_PATH, 'utf8').trim();
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (e) {
    return [];
  }
}

function writeLocalMessages(messages) {
  fs.mkdirSync(path.dirname(FILE_PATH), { recursive: true });
  fs.writeFileSync(FILE_PATH, JSON.stringify(messages), 'utf8');
  return messages;
}

exports.cmd = async (args) => {
  if (!U || !T) return null;
  const r = await fetch(U, { method: 'POST', headers: { Authorization: 'Bearer ' + T }, body: JSON.stringify(args) });
  const j = await r.json();
  if (j.error) throw new Error(j.error);
  return j.result;
};

exports.readMessages = async () => {
  const redis = await exports.cmd(['LRANGE', REDIS_KEY, 0, -1]);
  if (redis !== null) return redis;
  return readLocalMessages();
};

exports.writeMessages = async (messages) => {
  const redis = await exports.cmd(['DEL', REDIS_KEY]);
  if (redis !== null) {
    for (const item of messages) {
      await exports.cmd(['LPUSH', REDIS_KEY, item]);
    }
    return messages;
  }
  return writeLocalMessages(messages);
};

exports.addMessage = async (message) => {
  const messages = await exports.readMessages();
  const next = [JSON.stringify(message), ...messages].slice(0, 500);
  await exports.writeMessages(next);
  return next;
};

exports.deleteMessage = async (id) => {
  const messages = await exports.readMessages();
  const next = id === 'all' ? [] : messages.filter((item) => JSON.parse(item).id !== id);
  await exports.writeMessages(next);
  return next;
};
