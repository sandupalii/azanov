import 'dotenv/config';
import express from 'express';

import sendLead from './api/send-lead.js';
import sendCrypto from './api/send-crypto.js';
import sendReview from './api/send-review.js';

const app = express();
const PORT = process.env.PORT || 3001;

// Parse JSON bodies
app.use(express.json());

// Serve static files from project root
app.use(express.static(process.cwd()));

// API routes
app.post('/api/send-lead', sendLead);
app.post('/api/send-crypto', sendCrypto);
app.post('/api/send-review', sendReview);

app.get('/api/health', (_req, res) => {
  res.json({ ok: true, ts: new Date().toISOString() });
});

app.get('/api', (_req, res) => {
  res.json({ ok: true, message: 'API is working' });
});

// 404 only for unknown /api routes
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server LAST
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
  const hasToken = !!process.env.TELEGRAM_BOT_TOKEN;
  console.log(`   Telegram: ${hasToken ? '✓ configured' : '✗ TELEGRAM_BOT_TOKEN missing'}`);
  if (hasToken) {
    console.log(`   TELEGRAM_LEAD_CHAT_ID:   ${process.env.TELEGRAM_LEAD_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '✗ missing'}`);
    console.log(`   TELEGRAM_CRYPTO_CHAT_ID: ${process.env.TELEGRAM_CRYPTO_CHAT_ID || process.env.TELEGRAM_LEAD_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '○ fallback to LEAD'}`);
    console.log(`   TELEGRAM_REVIEW_CHAT_ID: ${process.env.TELEGRAM_REVIEW_CHAT_ID || process.env.TELEGRAM_LEAD_CHAT_ID || process.env.TELEGRAM_CHAT_ID || '○ fallback to LEAD'}`);
  }
  console.log(`   AmoCRM:   ${process.env.AMOCRM_DOMAIN && process.env.AMOCRM_ACCESS_TOKEN ? '✓ configured' : '○ not configured (optional)'}`);
});
