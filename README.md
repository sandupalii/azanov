# Azanov Travel — Website

Static marketing website with a Node.js API backend for form submissions (Telegram + AmoCRM integration).

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Static HTML / CSS / JS |
| API Server | Node.js 20 + Express |
| Deploy | Docker Compose + Nginx |
| Integrations | Telegram Bot API, AmoCRM v4 |

## Project Structure

```
azanovtravel/
├── index.html          # Main landing page
├── tours.html          # Tours page
├── fleet.html          # Fleet / vehicles page
├── villas.html         # Villas page
├── server.js           # Express API server entry point
├── package.json        # Node.js dependencies
├── Dockerfile          # Docker image for the API
├── docker-compose.yml  # Nginx + Node.js stack
├── api/
│   ├── config.js       # Telegram / AmoCRM helpers (reads from env)
│   ├── send-lead.js    # POST /api/send-lead
│   ├── send-crypto.js  # POST /api/send-crypto
│   └── send-review.js  # POST /api/send-review
├── deploy/
│   └── nginx.conf      # Nginx: static serving + /api/ reverse proxy
├── assets/             # Images, fonts
├── css/                # Stylesheets
├── js/                 # Client-side scripts
└── translations/       # i18n JSON files
```

## Quick Start (Local)

```bash
# 1. Clone
git clone https://github.com/YOUR_ORG/azanovtravel.git
cd azanovtravel

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.example .env
# Edit .env and fill in your Telegram bot token and chat IDs

# 4. Start the API server
npm start
# → http://localhost:3001

# Open index.html directly in your browser (or use any static server)
```

## Production Deployment

See **[DEPLOY.md](./DEPLOY.md)** for the full step-by-step guide to deploying with Docker Compose on a Linux VPS.

Summary:
1. Install Docker + Docker Compose on the server
2. Clone this repo: `git clone ... /srv/azanovtravel`
3. Copy `.env.example` → `.env` and fill in secrets
4. Set up SSL certificates (Let's Encrypt / Certbot)
5. Run `docker compose up -d --build`

## Environment Variables

Copy `.env.example` to `.env` and configure:

| Variable | Required | Description |
|----------|----------|-------------|
| `TELEGRAM_BOT_TOKEN` | ✅ | Bot token from @BotFather |
| `TELEGRAM_LEAD_CHAT_ID` | ✅ | Chat ID for lead form notifications |
| `TELEGRAM_CRYPTO_CHAT_ID` | — | Chat ID for crypto requests (falls back to LEAD) |
| `TELEGRAM_REVIEW_CHAT_ID` | — | Chat ID for review submissions (falls back to LEAD) |
| `AMOCRM_DOMAIN` | — | AmoCRM account domain (e.g. `company.amocrm.ru`) |
| `AMOCRM_ACCESS_TOKEN` | — | AmoCRM OAuth access token |
| `AMOCRM_PIPELINE_ID` | — | AmoCRM pipeline ID |
| `AMOCRM_STATUS_ID` | — | AmoCRM initial status ID |

> **Never commit `.env` with real values to Git!**

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `POST` | `/api/send-lead` | Submit 5-step lead form |
| `POST` | `/api/send-crypto` | Submit crypto exchange request |
| `POST` | `/api/send-review` | Submit a review |
| `GET` | `/api/health` | Health check |

## License

Private / proprietary. All rights reserved.
