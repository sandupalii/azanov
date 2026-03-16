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

import { ENV, sendTelegram, esc, isAmoCrmConfigured, amoCrmUpsertContact, amoCrmCreateLead, amoCrmAddNote } from './config.js';

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
    'lead',
  );

  if (!tgResult.ok) {
    console.error('[send-lead] Telegram send failed:', tgResult.error);
  }

  // ── AmoCRM (fire-and-forget, non-blocking) ─────────────────
  if (isAmoCrmConfigured()) {
    amoCrmCreateLeadFromBody(body).catch(err => {
      console.error('AmoCRM integration error:', err);
    });
  }

  if (!tgResult.ok) {
    return res.status(500).json({ ok: false, error: 'Failed to send Telegram notification', details: tgResult.error });
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
  const {
    name, phone, email, experienceType,
    packageName, yachtPreset, villaPreset, tourPreset, servicePreset,
    groupSize, dateFrom, dateTo, nights, budget, extras = [],
    notes, contactMethod, source,
  } = d;

  // ── Contact (upsert by phone, then email) ────────────────────
  const contactId = await amoCrmUpsertContact({
    name: name || 'Неизвестный клиент',
    phone,
    email,
  });

  // ── Lead name & tags ─────────────────────────────────────────
  const presetName = packageName || yachtPreset || villaPreset || tourPreset || servicePreset || '';
  const leadName = [name, capitalizeType(experienceType), presetName].filter(Boolean).join(' — ');

  const tags = ['website'];
  if (experienceType) tags.push(experienceType);

  // ── Custom fields for amoCRM ──────────────────────────────────
  // Field IDs are defined in amoCRM account settings
  const CF = [
    { field_id: 1581989, value: experienceType },
    { field_id: 1581991, value: packageName },
    { field_id: 1581993, value: yachtPreset },
    { field_id: 1581995, value: villaPreset },
    { field_id: 1581997, value: tourPreset },
    { field_id: 1581999, value: servicePreset },
    { field_id: 1576421, value: groupSize },
    { field_id: 1574879, value: dateFrom },
    { field_id: 1574881, value: dateTo },
    { field_id: 1582001, value: nights },
    { field_id: 1582003, value: extras && extras.length ? extras.join(', ') : null },
    { field_id: 1582005, value: notes },
  ];
  const customFields = CF
    .filter(f => f.value !== undefined && f.value !== null && f.value !== '')
    .map(f => ({ field_id: f.field_id, values: [{ value: String(f.value) }] }));

  // ── Budget ───────────────────────────────────────────────────
  const budgetLabel = {
    '150000': 'до 150 000 ฿',
    '300000': '150 000 – 300 000 ฿',
    '1000000': '300 000 – 1 000 000 ฿',
    '9999999': 'от 1 000 000 ฿',
  }[String(budget)] || budget || '—';
  const price = parseInt(budget) < 9999999 ? parseInt(budget) || 0 : 0;

  // ── Create lead ──────────────────────────────────────────────
  const leadId = await amoCrmCreateLead({
    name: leadName || 'Заявка с сайта',
    price,
    contactId,
    tags,
    customFields,
  });

  // ── Note: full form data ─────────────────────────────────────
  if (leadId) {
    const noteLines = [
      'Новая заявка с сайта',
      '',
      `Форма: ${experienceType || '—'}`,
      `Имя: ${name || '—'}`,
      `Телефон: ${phone || '—'}`,
      `Email: ${email || '—'}`,
    ];
    if (presetName) noteLines.push(`Объект/услуга: ${presetName}`);
    noteLines.push(
      '',
      `Гостей: ${groupSize || '—'}`,
      `Заезд: ${dateFrom || '—'}`,
      `Выезд: ${dateTo || '—'}`,
      `Ночей: ${nights || '—'}`,
      `Бюджет: ${budgetLabel}`,
    );
    if (extras && extras.length) {
      noteLines.push(`Доп. услуги: ${extras.join(', ')}`);
    }
    if (notes) noteLines.push('', `Комментарий: ${notes}`);
    noteLines.push(
      '',
      `Способ связи: ${contactMethod || '—'}`,
      `Источник: ${source || 'azanovretreat.com'}`,
      `Дата: ${new Date().toLocaleString('ru-RU', { timeZone: 'Asia/Bangkok' })}`,
    );
    await amoCrmAddNote(leadId, noteLines.join('\n'));
  }
}

function capitalizeType(str) {
  const labels = {
    villa: 'Вилла',
    yacht: 'Яхта',
    tour: 'Тур',
    package: 'Пакет',
    retreat: 'Пакет',
    concierge: 'Консьерж',
    bikes: 'Байки',
  };
  return labels[str] || (str ? str.charAt(0).toUpperCase() + str.slice(1) : '');
}

function capitalize(str) {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
}
