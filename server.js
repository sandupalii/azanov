/**
 * ============================================================
 *  AZANOV RETREAT — Self-Hosted API Server
 *
 *  Replaces Vercel serverless functions with a plain
 *  Express.js server. Nginx proxies /api/* here;
 *  static files are served directly by Nginx.
 *
 *  Usage:
 *    node server.js          (production)
 *    node --watch server.js  (dev, Node 18+)
 * ============================================================
 */

import 'dotenv/config';
import express from 'express';

import sendLead from './api/send-lead.js';
import sendCrypto from './api/send-crypto.js';
import sendReview from './api/send-review.js';

const app = express();
const PORT = process.env.PORT || 3005;

// Parse JSON bodies
app.use(express.json());

// Serve static HTML/CSS/JS files from the root directory
app.use(express.static(process.cwd()));

// ── API routes ────────────────────────────────────────────────
app.post('/api/send-lead', sendLead);
app.post('/api/send-crypto', sendCrypto);
app.post('/api/send-review', sendReview);

// Health check (useful for Docker / uptime monitors)
app.get('/api/health', (_req, res) => res.json({ ok: true, ts: new Date().toISOString() }));

// 404 for anything else on /api
app.use('/api', (_req, res) => res.status(404).json({ error: 'Not found' }));

// Start
app.listen(PORT, () => {
    console.log(`✅ API server running on http://localhost:${PORT}`);
    console.log(`   Telegram: ${process.env.TELEGRAM_BOT_TOKEN ? '✓ configured' : '✗ TELEGRAM_BOT_TOKEN missing'}`);
    console.log(`   AmoCRM:   ${process.env.AMOCRM_DOMAIN && process.env.AMOCRM_ACCESS_TOKEN ? '✓ configured' : '○ not configured (optional)'}`);
});
