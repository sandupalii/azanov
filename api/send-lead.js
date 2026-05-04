/**
 * ============================================================
 *  AZANOV TRAVEL — Lead API Handler
 *  POST /api/send-lead
 *
 *  Accepts structured lead data, then:
 *    1. Sends a rich Telegram notification
 *    2. Creates an AmoCRM contact + lead (if configured)
 *
 *  Required env vars → see api/config.js & api/README.md
 * ============================================================
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { ENV, sendTelegram, esc, isAmoCrmConfigured, amoCrmUpsertContact, amoCrmCreateLead, amoCrmAddNote } from './config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(LOG_DIR)) fs.mkdirSync(LOG_DIR, { recursive: true });

function backupLeadLocally(leadData) {
  try {
    const logFile = path.join(LOG_DIR, 'leads_backup.jsonl');
    const entry = JSON.stringify({ timestamp: new Date().toISOString(), data: leadData }) + '\n';
    fs.appendFileSync(logFile, entry);
  } catch (err) {
    console.error('[send-lead] Failed to write local backup:', err);
  }
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const body = req.body || {};

  // ── Fail-Safe Backup ────────────────────────────────────────
  backupLeadLocally(body);

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

  // ── AmoCRM (awaited to ensure Vercel does not kill the function early) ─────
  let amoCrmOk = false;
  if (isAmoCrmConfigured()) {
    try {
      await amoCrmCreateLeadFromBody(body);
      amoCrmOk = true;
    } catch (err) {
      console.error('AmoCRM integration error:', err);
    }
  }

  // Return 500 if NOTHING worked — at least one channel must succeed.
  const isTelegramConfigured = !!(ENV.TELEGRAM_BOT_TOKEN && ENV.TELEGRAM_LEAD_CHAT_ID);
  const nothingWorked = !tgResult.ok && !amoCrmOk;
  if (nothingWorked) {
    console.error('[send-lead] Both Telegram and AmoCRM failed — lead lost!', { telegram: tgResult.error, telegramConfigured: isTelegramConfigured, amoCrmConfigured: isAmoCrmConfigured() });
    return res.status(500).json({ ok: false, error: 'Failed to send lead via any channel', telegram: tgResult.error });
  }
  return res.status(200).json({ ok: true, telegram: tgResult.ok, amocrm: amoCrmOk });
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

const BIKE_TYPE_LABELS = {
  scooter: '🛵 Скутер',
  motorbike: '🏍️ Мотобайк',
  car: '🚗 Автомобиль',
  atv: '🏕️ Квадроцикл',
};

function formatTgPrice(val) {
  if (!val || isNaN(val)) return null;
  const n = Math.round(Number(val));
  if (n >= 1000000) return `${(n / 1000000).toFixed(1).replace('.', ',')}M \u0E3F`;
  if (n >= 1000) return `${(n / 1000).toFixed(0)}k \u0E3F`;
  return `${n} \u0E3F`;
}

function buildLeadMessage(d) {
  const {
    name, phone, email, experienceType, packageName, yachtPreset, villaPreset,
    tourPreset, servicePreset, bikeType, groupSize, dateFrom, dateTo, nights, budget,
    estimatedPrice, extras = [], notes, contactMethod, source,
  } = d;

  const icon = EXPERIENCE_ICONS[experienceType] || '\u{1F4CB}';
  const expLabel = experienceType ? `${icon} ${capitalize(experienceType)}` : '\u2014';

  const budgetLabel = {
    '150000': '\u0434\u043e 150 000 \u0E3F',
    '300000': '150 000 \u2013 300 000 \u0E3F',
    '1000000': '300 000 \u2013 1 000 000 \u0E3F',
    '9999999': '\u043e\u0442 1 000 000 \u0E3F',
  }[String(budget)] || budget || null;

  const contactLabel = {
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    call: '\u0417\u0432\u043e\u043d\u043e\u043a',
  }[contactMethod] || contactMethod || '\u2014';

  const lines = [
    `\u{1F514} *\u041d\u043e\u0432\u0430\u044f \u0437\u0430\u044f\u0432\u043a\u0430 \u0441 \u0441\u0430\u0439\u0442\u0430*`,
    ``,
    `\u{1F464} *\u0418\u043c\u044f:* ${esc(name || '\u2014')}`,
    `\u{1F4F1} *\u0422\u0435\u043b\u0435\u0444\u043e\u043d:* ${esc(phone || '\u2014')}`,
  ];

  if (email) lines.push(`\u{1F4E7} *Email:* ${esc(email)}`);

  lines.push(
    ``,
    `\u{1F3AF} *\u0422\u0438\u043f:* ${esc(expLabel)}`,
  );

  if (packageName) lines.push(`\u{1F4E6} *\u041f\u0430\u043a\u0435\u0442:* ${esc(packageName)}`);
  if (yachtPreset) lines.push(`\u26F5 *\u042f\u0445\u0442\u0430:* ${esc(yachtPreset)}`);
  if (villaPreset) lines.push(`\u{1F3E1} *\u0412\u0438\u043b\u043b\u0430:* ${esc(villaPreset)}`);
  if (tourPreset) lines.push(`\u{1F3AB} *\u0422\u0443\u0440:* ${esc(tourPreset)}`);
  if (servicePreset && !tourPreset) lines.push(`\u{1F6E0}\uFE0F *\u0423\u0441\u043b\u0443\u0433\u0430:* ${esc(servicePreset)}`);
  if (experienceType === 'bikes' && bikeType) lines.push(`\u{1F6F5} *\u0422\u0438\u043f \u0422\u0426:* ${esc(BIKE_TYPE_LABELS[bikeType] || bikeType)}`);

  const durationLabel = experienceType === 'bikes' ? '\u{1F4C6} *Дней:*' : '\u{1F319} *Ночей:*';
  lines.push(
    ``,
    `\u{1F465} *\u0413\u043e\u0441\u0442\u0435\u0439:* ${esc(groupSize || '\u2014')}`,
    `\u{1F4C5} *\u0414\u0430\u0442\u0430 \u0437\u0430\u0435\u0437\u0434\u0430:* ${esc(dateFrom || '\u2014')}`,
    `\u{1F4C5} *\u0414\u0430\u0442\u0430 \u0432\u044b\u0435\u0437\u0434\u0430:* ${esc(dateTo || '\u2014')}`,
    `${durationLabel} ${esc(nights || '\u2014')}`,
    ``,
  );

  // ── Price block: prefer estimated price over budget range ────
  const tgPrice = estimatedPrice ? formatTgPrice(estimatedPrice) : null;
  if (tgPrice) {
    lines.push(`\u{1F4B0} *\u0426\u0435\u043d\u0430 (\u043e\u0440\u0438\u0435\u043d\u0442\u0438\u0440):* ${esc(tgPrice)}`);
    if (budgetLabel) lines.push(`\u{1F4CA} *\u0411\u044e\u0434\u0436\u0435\u0442 \u043a\u043b\u0438\u0435\u043d\u0442\u0430:* ${esc(budgetLabel)}`);
  } else {
    lines.push(`\u{1F4B0} *\u0411\u044e\u0434\u0436\u0435\u0442:* ${esc(budgetLabel || '\u2014')}`);
  }

  if (extras && extras.length > 0) {
    lines.push(`\u2728 *\u0414\u043e\u043f\u0443\u0441\u043b\u0443\u0433\u0438:* ${esc(extras.join(', '))}`);
  }

  if (notes) lines.push(``, `\u{1F4AC} *\u041a\u043e\u043c\u043c\u0435\u043d\u0442\u0430\u0440\u0438\u0439:* ${esc(notes)}`);

  lines.push(
    ``,
    `\u{1F4F2} *\u0421\u0432\u044f\u0437\u044c \u0447\u0435\u0440\u0435\u0437:* ${esc(contactLabel)}`,
    ``,
    `_${esc(source || 'azanovtravel.com')}_`,
  );

  return lines.join('\n');
}

// ── AmoCRM lead creation ──────────────────────────────────────

async function amoCrmCreateLeadFromBody(d) {
  const {
    name, phone, email, experienceType,
    packageName, yachtPreset, villaPreset, tourPreset, servicePreset, bikeType,
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
  // Field IDs verified from /api/health-crm on 2026-05-02
  const presetLabel = packageName || yachtPreset || villaPreset || tourPreset || servicePreset || '';
  const bikeLabel = bikeType ? ({ scooter: '🛵 Скутер', motorbike: '🏍️ Мотобайк', car: '🚗 Авто', atv: '🏕️ Квадроцикл' }[bikeType] || bikeType) : null;

  // Budget / Price — must be defined before CF array
  const budgetLabel = {
    '150000': 'до 150 000 ฿',
    '300000': '150 000 – 300 000 ฿',
    '1000000': '300 000 – 1 000 000 ฿',
    '9999999': 'от 1 000 000 ฿',
  }[String(budget)] || budget || '—';
  const estimatedPrice = d.estimatedPrice ? Math.round(Number(d.estimatedPrice)) : null;
  const price = estimatedPrice && estimatedPrice > 0
    ? estimatedPrice
    : (parseInt(budget) < 9999999 ? parseInt(budget) || 0 : 0);

  // Map our addon keys → AmoCRM enum IDs for field 1576361 (multiselect)
  const EXTRAS_ENUM = {
    photo:     2923883, // Фотограф
    fasttrack: 2923885, // Fast track
    massage:   2923887, // Массаж
    chef:      2923889, // Шеф-повар
    fishing:   2923891, // Рыбалка
  };
  const extrasEnumValues = (extras || [])
    .map(key => EXTRAS_ENUM[key])
    .filter(Boolean)
    .map(enumId => ({ enum_id: enumId }));

  const CF = [
    { field_id: 1581989, value: experienceType },                   // Тип заявки
    { field_id: 1581991, value: presetLabel || bikeLabel },         // Название пакета / объект
    { field_id: 1581995, value: villaPreset },                      // Название виллы
    { field_id: 1576421, value: groupSize },                        // Кол-во человек
    { field_id: 1594019, value: parseDateToUnix(dateFrom) },        // Дата начала
    { field_id: 1594021, value: parseDateToUnix(dateTo) },          // Дата окончания
    { field_id: 1582001, value: nights },                           // Количество ночей / дней
    { field_id: 1574875, value: budget ? (budgetLabel !== '—' ? budgetLabel : null) : null }, // Предполагаемый бюджет
    { field_id: 1582005, value: notes },                            // Комментарий
  ];
  const customFields = CF
    .filter(f => f.value !== undefined && f.value !== null && f.value !== '' && !Number.isNaN(f.value))
    .map(f => {
      const isDate = f.field_id === 1594019 || f.field_id === 1594021;
      const val = isDate ? Number(f.value) : String(f.value);
      return { field_id: f.field_id, values: [{ value: val }] };
    });

  // Append extras as multiselect (separate structure with enum_id values)
  if (extrasEnumValues.length) {
    customFields.push({ field_id: 1576361, values: extrasEnumValues });
  }




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
    if (experienceType === 'bikes' && bikeType) noteLines.push(`Тип ТС: ${BIKE_TYPE_LABELS[bikeType] || bikeType}`);
    const durationKey = experienceType === 'bikes' ? 'Дней' : 'Ночей';
    noteLines.push(
      '',
      `Гостей: ${groupSize || '—'}`,
      `Заезд: ${dateFrom || '—'}`,
      `Выезд: ${dateTo || '—'}`,
      `${durationKey}: ${nights || '—'}`,
      `Бюджет: ${budgetLabel}`,
    );
    if (extras && extras.length) {
      noteLines.push(`Доп. услуги: ${extras.join(', ')}`);
    }
    if (notes) noteLines.push('', `Комментарий: ${notes}`);
    noteLines.push(
      '',
      `Способ связи: ${contactMethod || '—'}`,
      `Источник: ${source || 'azanovtravel.com'}`,
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

/**
 * Parses 'dd.mm.yyyy' to a UNIX timestamp in seconds for AmoCRM date fields.
 * Returns null if the format is invalid.
 */
function parseDateToUnix(dateStr) {
  if (!dateStr || typeof dateStr !== 'string') return null;
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // 0-indexed
    const year = parseInt(parts[2], 10);
    const date = new Date(Date.UTC(year, month, day, 0, 0, 0));
    if (!Number.isNaN(date.getTime())) {
      return Math.floor(date.getTime() / 1000);
    }
  }
  return null;
}
