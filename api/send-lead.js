/**
 * ============================================================
 *  AZANOV RETREAT — Lead API Handler
 *  POST /api/send-lead
 *
 *  Accepts structured lead data, then:
 *    1. Sends a rich Telegram notification
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

  const body = req.body || {};

  // ── Build Telegram message ──────────────────────────────────
  let text;

  if (typeof body.message === 'string' && !body.name) {
    // Legacy plain-text mode (backward compatible)
    text = body.message;
  } else {
    text = buildLeadMessage(body);
  }

  // ── Send Telegram ───────────────────────────────────────────
  const tgResult = await sendTelegram(
    ENV.TELEGRAM_BOT_TOKEN,
    ENV.TELEGRAM_LEAD_CHAT_ID,
    text,
  );

  if (!tgResult.ok) {
    console.error('Telegram send failed:', tgResult.error);
    // Don't block the response — still try AmoCRM
  }

  // ── AmoCRM (fire-and-forget, non-blocking) ─────────────────
  if (isAmoCrmConfigured()) {
    amoCrmCreateLeadFromBody(body).catch(err => {
      console.error('AmoCRM integration error:', err);
    });
  }

  return res.status(200).json({ ok: true });
}

// ── Telegram message builder ──────────────────────────────────

const EXPERIENCE_ICONS = {
  villa: '🏡',
  yacht: '⛵',
  bikes: '🏍️',
  retreat: '🌟',
  package: '📦',
  tour: '🎫',
  concierge: '🛠️',
};

function buildLeadMessage(d) {
  const {
    name, phone, email, experienceType, packageName, yachtPreset, villaPreset,
    tourPreset, servicePreset, groupSize, dateFrom, dateTo, nights, budget,
    extras = [], notes, contactMethod, source,
  } = d;

  const icon = EXPERIENCE_ICONS[experienceType] || '📋';
  const expLabel = experienceType ? `${icon} ${capitalize(experienceType)}` : '—';

  const budgetLabel = {
    '150000': 'до 150 000 ฿',
    '300000': '150 000 – 300 000 ฿',
    '1000000': '300 000 – 1 000 000 ฿',
    '9999999': 'от 1 000 000 ฿',
  }[String(budget)] || budget || '—';

  const contactLabel = {
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    call: 'Звонок',
  }[contactMethod] || contactMethod || '—';

  const lines = [
    `🔔 *Новая заявка с сайта*`,
    ``,
    `👤 *Имя:* ${esc(name || '—')}`,
    `📱 *Телефон:* ${esc(phone || '—')}`,
  ];

  if (email) lines.push(`📧 *Email:* ${esc(email)}`);

  lines.push(
    ``,
    `🎯 *Тип:* ${esc(expLabel)}`,
  );

  if (packageName) lines.push(`📦 *Пакет:* ${esc(packageName)}`);
  if (yachtPreset) lines.push(`⛵ *Яхта:* ${esc(yachtPreset)}`);
  if (villaPreset) lines.push(`🏡 *Вилла:* ${esc(villaPreset)}`);
  if (tourPreset) lines.push(`🎫 *Тур:* ${esc(tourPreset)}`);
  if (servicePreset && !tourPreset) lines.push(`🛠️ *Услуга:* ${esc(servicePreset)}`);

  lines.push(
    ``,
    `👥 *Гостей:* ${esc(groupSize || '—')}`,
    `📅 *Дата заезда:* ${esc(dateFrom || '—')}`,
    `📅 *Дата выезда:* ${esc(dateTo || '—')}`,
    `🌙 *Ночей:* ${esc(nights || '—')}`,
    ``,
    `💰 *Бюджет:* ${esc(budgetLabel)}`,
  );

  if (extras && extras.length > 0) {
    lines.push(`✨ *Допуслуги:* ${esc(extras.join(', '))}`);
  }

  if (notes) lines.push(``, `💬 *Комментарий:* ${esc(notes)}`);

  lines.push(
    ``,
    `📲 *Связь через:* ${esc(contactLabel)}`,
    ``,
    `_${esc(source || 'azanovretreat.com')}_`,
  );

  return lines.join('\n');
}

// ── AmoCRM lead creation ──────────────────────────────────────

async function amoCrmCreateLeadFromBody(d) {
  const { name, phone, email, experienceType, packageName, yachtPreset, villaPreset, tourPreset, budget } = d;

  const contactId = await amoCrmUpsertContact({
    name: name || 'Неизвестный клиент',
    phone,
    email,
  });

  const presetName = packageName || yachtPreset || villaPreset || tourPreset || '';
  const leadName = [name, capitalize(experienceType), presetName].filter(Boolean).join(' — ');

  const tags = ['website'];
  if (experienceType) tags.push(experienceType);

  const price = parseInt(budget) < 9999999 ? parseInt(budget) || 0 : 0;

  await amoCrmCreateLead({
    name: leadName || 'Заявка с сайта',
    price,
    contactId,
    tags,
  });
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
