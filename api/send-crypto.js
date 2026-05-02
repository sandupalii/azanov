/**
 * ============================================================
 *  AZANOV TRAVEL — Crypto Exchange Lead Handler
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
        `_${esc(source || 'azanovtravel.com')}_`,
    ];

    const text = lines.join('\n');

    // ── Send Telegram ───────────────────────────────────────────
    const tgResult = await sendTelegram(
        ENV.TELEGRAM_BOT_TOKEN,
        ENV.TELEGRAM_CRYPTO_CHAT_ID,
        text,
        'crypto',
    );

    if (!tgResult.ok) {
        console.error('[send-crypto] Telegram send failed:', tgResult.error);
    }

    // ── AmoCRM (fire-and-forget) ────────────────────────────────
    if (isAmoCrmConfigured()) {
        (async () => {
            try {
                const contactId = await amoCrmUpsertContact({ name, phone });
                const CF = [
                    { field_id: 1582007, value: amount },
                    { field_id: 1582009, value: currency },
                    { field_id: 1582011, value: country },
                    { field_id: 1582013, value: city },
                ];
                const customFields = CF
                    .filter(f => f.value !== undefined && f.value !== null && f.value !== '')
                    .map(f => ({ field_id: f.field_id, values: [{ value: String(f.value) }] }));
                await amoCrmCreateLead({
                    name: `${name} — Crypto Exchange`,
                    price: 0,
                    contactId,
                    tags: ['website', 'crypto-exchange'],
                    customFields,
                });
            } catch (err) {
                console.error('AmoCRM error (crypto):', err);
            }
        })();
    }

    if (!tgResult.ok) {
        return res.status(500).json({ ok: false, error: 'Failed to send Telegram notification', details: tgResult.error });
    }
    return res.status(200).json({ ok: true });
}
