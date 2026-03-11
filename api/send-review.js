/**
 * ============================================================
 *  AZANOV RETREAT — Review Handler
 *  POST /api/send-review
 *
 *  Accepts a review submission, then:
 *    1. Sends a Telegram notification
 *    2. Creates/updates an AmoCRM contact (if configured)
 *
 *  Required env vars → see api/config.js & api/README.md
 * ============================================================
 */

import { ENV, sendTelegram, esc, isAmoCrmConfigured, amoCrmUpsertContact, amoCrmCreateLead } from './config.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, phone, rating, text, wishes, source, timestamp } = req.body || {};

  if (!name || !text) {
    return res.status(400).json({ error: 'Name and text required' });
  }

  // ── Build Telegram message ──────────────────────────────────
  const safeRating = Math.min(5, Math.max(1, parseInt(rating) || 5));
  const stars = '⭐'.repeat(safeRating);

  const lines = [
    `📝 *Новый отзыв с сайта*`,
    ``,
    `👤 *Имя:* ${esc(name)}`,
  ];

  if (phone) lines.push(`📱 *Контакт:* ${esc(phone)}`);

  lines.push(
    `${stars} *${safeRating}/5*`,
    ``,
    `💬 *Отзыв:*`,
    esc(text),
  );

  if (wishes) lines.push(``, `📋 *Пожелания:* ${esc(wishes)}`);

  const ts = timestamp ? new Date(timestamp).toLocaleString('ru-RU') : new Date().toLocaleString('ru-RU');
  lines.push(``, `_${esc(source || 'azanovretreat.com')} • ${esc(ts)}_`);

  const tgText = lines.join('\n');

  // ── Send Telegram ───────────────────────────────────────────
  const tgResult = await sendTelegram(
    ENV.TELEGRAM_BOT_TOKEN,
    ENV.TELEGRAM_REVIEW_CHAT_ID,
    tgText,
  );

  if (!tgResult.ok) {
    console.error('Telegram send failed (review):', tgResult.error);
    return res.status(500).json({ error: 'Failed to send' });
  }

  // ── AmoCRM: create/update contact with 'review' tag ────────
  if (isAmoCrmConfigured() && (name || phone)) {
    (async () => {
      try {
        const contactId = await amoCrmUpsertContact({ name, phone });
        if (contactId) {
          await amoCrmCreateLead({
            name: `${name} — Отзыв (${safeRating}★)`,
            price: 0,
            contactId,
            tags: ['website', 'review', `rating-${safeRating}`],
          });
        }
      } catch (err) {
        console.error('AmoCRM error (review):', err);
      }
    })();
  }

  return res.status(200).json({ ok: true });
}
