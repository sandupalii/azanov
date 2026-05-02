import 'dotenv/config';
import express from 'express';

import sendLead from './api/send-lead.js';
import sendCrypto from './api/send-crypto.js';
import sendReview from './api/send-review.js';
import { isAmoCrmConfigured, amoCrmGetLeadFields, amoCrmGetPipelines, ENV } from './api/config.js';

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
  const tgOk = !!(ENV.TELEGRAM_BOT_TOKEN && ENV.TELEGRAM_LEAD_CHAT_ID);
  const crmOk = isAmoCrmConfigured();
  res.json({
    ok: true,
    ts: new Date().toISOString(),
    telegram: tgOk ? '✓ configured' : '✗ missing TELEGRAM_BOT_TOKEN or TELEGRAM_LEAD_CHAT_ID',
    amocrm: crmOk ? `✓ configured (${ENV.AMOCRM_DOMAIN})` : '✗ missing AMOCRM_DOMAIN or AMOCRM_ACCESS_TOKEN',
  });
});

// Diagnostic: returns real AmoCRM custom field IDs and pipeline IDs
// Use this to verify the hardcoded field IDs in send-lead.js are correct
app.get('/api/health-crm', async (_req, res) => {
  if (!isAmoCrmConfigured()) {
    return res.status(503).json({ ok: false, error: 'AmoCRM not configured — set AMOCRM_DOMAIN and AMOCRM_ACCESS_TOKEN env vars' });
  }
  try {
    const [fields, pipelines] = await Promise.all([
      amoCrmGetLeadFields(),
      amoCrmGetPipelines(),
    ]);
    return res.json({
      ok: true,
      domain: ENV.AMOCRM_DOMAIN,
      leadFields: fields.data?._embedded?.custom_fields || fields.data || fields,
      pipelines: pipelines.data?._embedded?.pipelines || pipelines.data || pipelines,
      configuredPipelineId: ENV.AMOCRM_PIPELINE_ID,
      configuredStatusId: ENV.AMOCRM_STATUS_ID,
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
});

app.get('/api', (_req, res) => {
  res.json({ ok: true, message: 'API is working. Routes: POST /api/send-lead, GET /api/health, GET /api/health-crm' });
});

// 404 only for unknown /api routes
app.use('/api', (_req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Start server LAST
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✅ API server running on http://localhost:${PORT}`);
  const tgOk = !!(ENV.TELEGRAM_BOT_TOKEN && ENV.TELEGRAM_LEAD_CHAT_ID);
  console.log(`   Telegram: ${tgOk ? '✓ configured' : '✗ TELEGRAM_BOT_TOKEN or TELEGRAM_LEAD_CHAT_ID missing'}`);
  console.log(`   AmoCRM:   ${isAmoCrmConfigured() ? `✓ ${ENV.AMOCRM_DOMAIN}` : '✗ not configured'}`);
  console.log(`   Diagnostic: GET http://localhost:${PORT}/api/health-crm`);
});
