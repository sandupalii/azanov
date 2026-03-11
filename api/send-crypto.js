/**
 * ============================================================
 *  AZANOV RETREAT — Crypto Exchange Lead Handler
 *  POST /api/send-crypto
 *
 *  Accepts crypto exchange request data, then:
 *    1. Sends a Telegram notification
 *    2. Creates an AmoCRM contact + lead (if configured)
 *
 *  Required env vars → see api/config.js & api/README.md
 * ============================================================
 */

import { ENV, sendTelegram, esc, isAmoCrmConfigured, amoCrmUpsertContact, amoCrmCreateLead } from './config.js';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    const { name, phone, amount, currency, country, city, source } = req.body || {};

    if (!name || !phone || !amount) {
        return res.status(400).json({ error: 'name, phone, amount required' });
    }

    // ── Build Telegram message ──────────────────────────────────
    const lines = [
        `💱 *Заявка на обмен криптовалюты*`,
        ``,
        `👤 *Имя:* ${esc(name)}`,
        `📱 *Телефон:* ${esc(phone)}`,
        ``,
        `💰 *Сумма:* ${esc(amount)}`,
        `💵 *Получить в:* ${esc(currency || '—')}`,
        `🌍 *Страна:* ${esc(country || '—')}`,
        `🏙️ *Город:* ${esc(city || '—')}`,
        ``,
        `_${esc(source || 'azanovretreat.com')}_`,
    ];

    const text = lines.join('\n');

    // ── Send Telegram ───────────────────────────────────────────
    const tgResult = await sendTelegram(
        ENV.TELEGRAM_BOT_TOKEN,
        ENV.TELEGRAM_CRYPTO_CHAT_ID,
        text,
    );

    if (!tgResult.ok) {
        console.error('Telegram send failed (crypto):', tgResult.error);
    }

    // ── AmoCRM (fire-and-forget) ────────────────────────────────
    if (isAmoCrmConfigured()) {
        (async () => {
            try {
                const contactId = await amoCrmUpsertContact({ name, phone });
                await amoCrmCreateLead({
                    name: `${name} — Crypto Exchange`,
                    price: 0,
                    contactId,
                    tags: ['website', 'crypto-exchange'],
                });
            } catch (err) {
                console.error('AmoCRM error (crypto):', err);
            }
        })();
    }

    return res.status(200).json({ ok: true });
}
