# API Integration Guide — Azanov Retreat

This guide explains how to configure **Telegram notifications** and **AmoCRM** lead creation for the three lead-generation forms on azanovretreat.com.

## Overview

| Form | Endpoint | Telegram Chat Var | AmoCRM |
|------|----------|-------------------|--------|
| 5-step Lead Form | `POST /api/send-lead` | `TELEGRAM_LEAD_CHAT_ID` | ✅ Lead + Contact |
| Crypto Exchange | `POST /api/send-crypto` | `TELEGRAM_CRYPTO_CHAT_ID` | ✅ Lead + Contact |
| Review Form | `POST /api/send-review` | `TELEGRAM_REVIEW_CHAT_ID` | ✅ Contact |

All env vars are set in **Vercel → Project → Settings → Environment Variables** (or in a `.env` file for local dev). See `.env.example` for the full list.

---

## 1. Telegram Setup

### Step 1 — Create a Bot
1. Open Telegram and message **@BotFather**
2. Send `/newbot` and follow the prompts
3. Copy the **Bot Token** (looks like `1234567890:AAH...`)
4. Set env var: `TELEGRAM_BOT_TOKEN=<your token>`

### Step 2 — Get the Chat ID
1. Create a group (or use an existing one) where leads should appear
2. Add your bot to the group (give it admin rights so it can post)
3. Send any message in the group
4. Visit: `https://api.telegram.org/bot<TOKEN>/getUpdates`
5. Find `"chat": { "id": -XXXXXXXXX }` — that negative number is your Chat ID

### Step 3 — Set Chat IDs
```
TELEGRAM_LEAD_CHAT_ID=-100xxxxxxxxx    # leads from the 5-step form
TELEGRAM_CRYPTO_CHAT_ID=-100yyyyyyyyy  # crypto exchange requests
TELEGRAM_REVIEW_CHAT_ID=-100zzzzzzzzz  # review form submissions
```
> You can use the **same chat ID** for all three if you prefer one unified feed.

---

## 2. AmoCRM Setup

### Step 1 — Create an Integration
1. Log in to your AmoCRM account
2. Go to **Settings → Integrations → + Add Integration**
3. Choose **"Private integration"** (for API access)
4. Fill in a name (e.g. "Azanov Website") and grant **Leads** + **Contacts** scopes

### Step 2 — Get the Access Token
1. After creating the integration, click **"Grant Access"** → complete OAuth
2. You'll receive a **long-lived access token** (valid for 24h by default; use a refresh token flow for production)
3. Set env var: `AMOCRM_ACCESS_TOKEN=<your token>`
4. Set env var: `AMOCRM_DOMAIN=mycompany.amocrm.ru`

### Step 3 — (Optional) Set Pipeline & Stage
To put incoming leads into a specific pipeline stage automatically:
1. Go to **AmoCRM → Sales → Edit Pipeline**
2. Copy the pipeline ID and stage ID from the URL
3. Set env vars:
   ```
   AMOCRM_PIPELINE_ID=123456
   AMOCRM_STATUS_ID=789012
   ```

> **Tip**: If `AMOCRM_DOMAIN` or `AMOCRM_ACCESS_TOKEN` are not set, AmoCRM integration is silently skipped — Telegram still works.

---

## 3. Testing Endpoints

Once your server is running (locally with `vercel dev` or on Vercel preview):

```bash
# ── Test Lead Form ─────────────────────────────────────────────
curl -X POST http://localhost:3000/api/send-lead \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ivan Test",
    "phone": "+66612345678",
    "email": "test@example.com",
    "experienceType": "villa",
    "villaPreset": "Villa Azanov",
    "groupSize": 4,
    "dateFrom": "20.03.2026",
    "dateTo": "25.03.2026",
    "nights": "5",
    "budget": "300000",
    "contactMethod": "whatsapp"
  }'

# ── Test Crypto Form ───────────────────────────────────────────
curl -X POST http://localhost:3000/api/send-crypto \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ivan Test",
    "phone": "+66612345678",
    "amount": "10 000 USDT",
    "currency": "THB",
    "country": "Thailand",
    "city": "Phuket"
  }'

# ── Test Review Form ───────────────────────────────────────────
curl -X POST http://localhost:3000/api/send-review \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Ivan Test",
    "phone": "+66612345678",
    "rating": 5,
    "text": "Fantastic retreat, highly recommend!"
  }'
```

Expected response for all: `{ "ok": true }`

---

## 4. File Reference

| File | Purpose |
|------|---------|
| `api/config.js` | All env var definitions + shared Telegram/AmoCRM helpers |
| `api/send-lead.js` | Handles 5-step lead form submissions |
| `api/send-crypto.js` | Handles crypto exchange form submissions |
| `api/send-review.js` | Handles review form submissions |
| `.env.example` | Template for all required env vars |

---

## 5. Troubleshooting

| Problem | Solution |
|---------|----------|
| Telegram message not arriving | Check bot is in the group with admin rights; verify `TELEGRAM_BOT_TOKEN` and chat ID |
| `400 Bad Request` from Telegram | Usually a MarkdownV2 escaping issue — check server logs for the raw text |
| AmoCRM 401 error | Access token expired — generate a new one or implement token refresh |
| AmoCRM contact not created | Check `AMOCRM_DOMAIN` format (no `https://`, no trailing slash) |
| Forms still only open WhatsApp | `window.LEAD_API_URL` / `window.CRYPTO_API_URL` not set in the HTML page |
