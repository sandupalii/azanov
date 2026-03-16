/**
 * ============================================================
 *  AZANOV RETREAT — Centralized Integration Config
 *  ============================================================
 *
 *  All environment variable names live here.
 *  Set them in your Vercel dashboard (or local .env file).
 *
 *  Required for Telegram:
 *    TELEGRAM_BOT_TOKEN       — from @BotFather
 *    TELEGRAM_LEAD_CHAT_ID    — chat/group for 5-step lead form submissions
 *    TELEGRAM_CRYPTO_CHAT_ID  — chat/group for crypto exchange requests
 *                               (falls back to TELEGRAM_LEAD_CHAT_ID if not set)
 *    TELEGRAM_REVIEW_CHAT_ID  — chat/group for review submissions
 *                               (falls back to TELEGRAM_LEAD_CHAT_ID if not set)
 *
 *  Required for AmoCRM:
 *    AMOCRM_DOMAIN            — e.g. "mycompany.amocrm.ru"
 *    AMOCRM_ACCESS_TOKEN      — long-lived access token from OAuth
 *    AMOCRM_PIPELINE_ID       — (optional) ID of the sales pipeline
 *    AMOCRM_STATUS_ID         — (optional) ID of the initial stage in the pipeline
 *
 *  See api/README.md for step-by-step setup instructions.
 * ============================================================
 */

export const ENV = {
    // ── Telegram ──────────────────────────────────────────────
    TELEGRAM_BOT_TOKEN: process.env.TELEGRAM_BOT_TOKEN,
    TELEGRAM_LEAD_CHAT_ID: process.env.TELEGRAM_LEAD_CHAT_ID || process.env.TELEGRAM_CHAT_ID,
    TELEGRAM_CRYPTO_CHAT_ID: process.env.TELEGRAM_CRYPTO_CHAT_ID || process.env.TELEGRAM_LEAD_CHAT_ID || process.env.TELEGRAM_CHAT_ID,
    TELEGRAM_REVIEW_CHAT_ID: process.env.TELEGRAM_REVIEW_CHAT_ID || process.env.TELEGRAM_CHAT_ID,

    // ── AmoCRM ────────────────────────────────────────────────
    AMOCRM_DOMAIN: process.env.AMOCRM_DOMAIN,
    AMOCRM_ACCESS_TOKEN: process.env.AMOCRM_ACCESS_TOKEN,
    AMOCRM_PIPELINE_ID: process.env.AMOCRM_PIPELINE_ID ? parseInt(process.env.AMOCRM_PIPELINE_ID) : undefined,
    AMOCRM_STATUS_ID: process.env.AMOCRM_STATUS_ID ? parseInt(process.env.AMOCRM_STATUS_ID) : undefined,
};

// ── Telegram helpers ──────────────────────────────────────────

/**
 * Send a Telegram message to the given chatId.
 * Tries MarkdownV2 first; falls back to plain text if parsing fails (e.g. escaping issues).
 * @param {string} token
 * @param {string} chatId
 * @param {string} text      — MarkdownV2 formatted text (or plain text for fallback)
 * @param {string} [source]  — optional label for debug logs (e.g. 'lead', 'crypto', 'review')
 * @returns {Promise<{ok: boolean, error?: string}>}
 */
export async function sendTelegram(token, chatId, text, source = 'telegram') {
    if (!token || !chatId) {
        const err = 'Missing TELEGRAM_BOT_TOKEN or chat ID';
        console.error(`[Telegram:${source}] ${err} (token=${!!token}, chatId=${chatId || 'empty'})`);
        return { ok: false, error: err };
    }
    console.log(`[Telegram:${source}] POST https://api.telegram.org/bot***/sendMessage chat_id=${chatId}`);

    const send = async (parseMode, textToSend) => {
        const body = parseMode
            ? { chat_id: chatId, text: textToSend, parse_mode: parseMode }
            : { chat_id: chatId, text: textToSend };
        const fullUrl = `https://api.telegram.org/bot${token}/sendMessage`;
        const resp = await fetch(fullUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        });
        const data = await resp.json();
        console.log(`[Telegram:${source}] Response ok=${data.ok} status=${resp.status}`, data.ok ? '' : `error=${JSON.stringify(data)}`);
        return data;
    };
    try {
        let data = await send('MarkdownV2', text);
        if (!data.ok) {
            // MarkdownV2 often fails with 400 "can't parse entities" — retry as plain text
            const isParseError = data.description?.includes("can't parse") || data.description?.includes('Bad Request');
            if (isParseError) {
                const plainText = text.replace(/\\([_*[\]()~`>#+\-=|{}.!])/g, '$1');
                console.log(`[Telegram:${source}] MarkdownV2 parse failed, retrying as plain text`);
                data = await send(null, plainText);
            }
        }
        if (!data.ok) {
            const err = JSON.stringify(data);
            console.error(`[Telegram:${source}] API error:`, err);
            return { ok: false, error: err };
        }
        console.log(`[Telegram:${source}] Message delivered`);
        return { ok: true };
    } catch (err) {
        console.error(`[Telegram:${source}] Network/request error:`, err.message);
        return { ok: false, error: err.message };
    }
}

/**
 * Escape special characters for Telegram MarkdownV2.
 */
export function esc(s) {
    if (!s && s !== 0) return '';
    return String(s).replace(/([_*[\]()~`>#+\-=|{}.!\\])/g, '\\$1');
}

// ── AmoCRM helpers ────────────────────────────────────────────

/**
 * Returns true if AmoCRM is configured (domain + token present).
 */
export function isAmoCrmConfigured() {
    return !!(ENV.AMOCRM_DOMAIN && ENV.AMOCRM_ACCESS_TOKEN);
}

/**
 * Make an authenticated request to the AmoCRM v4 API.
 * @param {string} path   — e.g. '/api/v4/leads'
 * @param {string} method — HTTP method
 * @param {any}    body   — JSON body
 */
export async function amoCrmRequest(path, method = 'GET', body) {
    const url = `https://${ENV.AMOCRM_DOMAIN}${path}`;
    const options = {
        method,
        headers: {
            Authorization: `Bearer ${ENV.AMOCRM_ACCESS_TOKEN}`,
            'Content-Type': 'application/json',
        },
    };
    if (body) options.body = JSON.stringify(body);
    const resp = await fetch(url, options);
    const text = await resp.text();
    try {
        return { ok: resp.ok, status: resp.status, data: text ? JSON.parse(text) : null };
    } catch {
        return { ok: resp.ok, status: resp.status, data: text };
    }
}

/**
 * Create or find a contact in AmoCRM by phone number.
 * Returns the contact id, or null on failure.
 * @param {{ name: string, phone?: string, email?: string }} contact
 */
export async function amoCrmUpsertContact({ name, phone, email }) {
    // 1. Search by phone
    if (phone) {
        const search = await amoCrmRequest(`/api/v4/contacts?query=${encodeURIComponent(phone)}&limit=1`);
        if (search.ok && search.data?._embedded?.contacts?.length) {
            return search.data._embedded.contacts[0].id;
        }
    }

    // 2. Fallback: search by email
    if (email) {
        const searchByEmail = await amoCrmRequest(`/api/v4/contacts?query=${encodeURIComponent(email)}&limit=1`);
        if (searchByEmail.ok && searchByEmail.data?._embedded?.contacts?.length) {
            return searchByEmail.data._embedded.contacts[0].id;
        }
    }

    // 3. Create new contact
    const customFields = [];
    if (phone) {
        customFields.push({ field_code: 'PHONE', values: [{ value: phone, enum_code: 'WORK' }] });
    }
    if (email) {
        customFields.push({ field_code: 'EMAIL', values: [{ value: email, enum_code: 'WORK' }] });
    }

    const body = [{ name: name || 'Unknown', custom_fields_values: customFields }];
    const result = await amoCrmRequest('/api/v4/contacts', 'POST', body);
    if (result.ok && result.data?._embedded?.contacts?.length) {
        return result.data._embedded.contacts[0].id;
    }
    console.error('AmoCRM contact creation failed:', result);
    return null;
}

/**
 * Create a lead in AmoCRM.
 * @param {{ name: string, price?: number, contactId?: number, tags?: string[], customFields?: Array<{field_id: number, values: Array<{value: any}>}>, pipelineId?: number, statusId?: number }} lead
 * Returns the lead id, or null on failure.
 */
export async function amoCrmCreateLead({ name, price, contactId, tags = [], customFields = [], pipelineId, statusId }) {
    // Build _embedded carefully — both tags and contacts must be in ONE _embedded object
    const embedded = {};
    if (tags.length) {
        embedded.tags = tags.map(t => ({ name: t }));
    }
    if (contactId) {
        embedded.contacts = [{ id: contactId }];
    }

    const leadObj = {
        name,
        price: price || 0,
    };
    const resolvedPipelineId = pipelineId || ENV.AMOCRM_PIPELINE_ID;
    const resolvedStatusId = statusId || ENV.AMOCRM_STATUS_ID;
    if (resolvedPipelineId) leadObj.pipeline_id = resolvedPipelineId;
    if (resolvedStatusId) leadObj.status_id = resolvedStatusId;
    if (Object.keys(embedded).length) leadObj._embedded = embedded;
    if (customFields.length) leadObj.custom_fields_values = customFields;

    const result = await amoCrmRequest('/api/v4/leads', 'POST', [leadObj]);
    if (result.ok && result.data?._embedded?.leads?.length) {
        return result.data._embedded.leads[0].id;
    }
    console.error('AmoCRM lead creation failed:', result);
    return null;
}

/**
 * Add a plain-text note to a lead.
 * @param {number} leadId
 * @param {string} text
 */
export async function amoCrmAddNote(leadId, text) {
    if (!leadId || !text) return;
    const body = [{ note_type: 'common', params: { text } }];
    const result = await amoCrmRequest(`/api/v4/leads/${leadId}/notes`, 'POST', body);
    if (!result.ok) {
        console.error('AmoCRM note creation failed:', result);
    }
    return result;
}
