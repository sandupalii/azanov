# Self-Hosted Deployment Guide
## Azanov Travel Website — Docker + Nginx

No Vercel needed. This guide deploys the full site on any Linux VPS using Docker Compose.

---

## Architecture

```
Internet
   │
   ▼
Nginx (port 80/443)
  ├── /           → serves static HTML/CSS/JS from disk
  ├── /assets/*   → serves images/fonts from disk  
  └── /api/*      → proxies to Node.js container (port 3001)
                          │
                     Express server
                     (server.js)
                       ├── /api/send-lead
                       ├── /api/send-crypto
                       └── /api/send-review
```

---

## Files Created

| File | Purpose |
|------|---------|
| `server.js` | Express server that runs the API handlers |
| `package.json` | Node.js dependencies (express, dotenv) |
| `Dockerfile` | Builds the Node.js API container |
| `.dockerignore` | Excludes static files from Docker build |
| `docker-compose.yml` | Runs Nginx + Node together |
| `deploy/nginx.conf` | Nginx config: static serving + API proxy |

---

## Step-by-Step Setup

### 1 — Server Requirements

Any Linux VPS will work (Ubuntu 22.04 recommended, 1GB RAM min):

```bash
# Install Docker + Docker Compose
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
# Log out and back in, then verify:
docker --version
docker compose version
```

### 2 — Upload the Site

```bash
# From your local machine, sync the project to the server
# (replace user@YOUR_SERVER_IP with your actual details)
rsync -avz --exclude='.git' --exclude='node_modules' --exclude='*.zip' \
  /Users/designer/PROJECTS/azanovretreat/ \
  user@YOUR_SERVER_IP:/srv/azanovretreat/
```

Or clone from Git if you have a repo:
```bash
git clone https://github.com/YOUR_ORG/azanovretreat.git /srv/azanovretreat
```

### 3 — Create the .env File

```bash
cd /srv/azanovretreat
cp .env.example .env
nano .env   # Fill in your tokens
```

Minimum required:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_LEAD_CHAT_ID=-100your_chat_id
```

### 4 — Set Up SSL (HTTPS)

**Option A — Certbot (recommended, free Let's Encrypt):**
```bash
# Install Certbot
sudo apt install certbot -y

# Get certificate (point your domain DNS to this server IP first!)
sudo certbot certonly --standalone -d azanovretreat.com -d www.azanovretreat.com

# Certs will be at /etc/letsencrypt/live/azanovretreat.com/
# Link them into the deploy/ssl folder:
sudo mkdir -p /srv/azanovretreat/deploy/ssl
sudo ln -sf /etc/letsencrypt/live/azanovretreat.com/fullchain.pem \
            /srv/azanovretreat/deploy/ssl/fullchain.pem
sudo ln -sf /etc/letsencrypt/live/azanovretreat.com/privkey.pem \
            /srv/azanovretreat/deploy/ssl/privkey.pem
```

**Option B — HTTP only (for testing without a domain):**

Edit `deploy/nginx.conf` — remove the HTTPS server block and just use:
```nginx
server {
    listen 80;
    root /usr/share/nginx/html;
    index index.html;

    location /api/ {
        proxy_pass http://api:3001;
        proxy_set_header Host $host;
        proxy_read_timeout 30s;
        client_max_body_size 1m;
    }

    location / {
        try_files $uri $uri/ $uri.html =404;
    }
}
```

### 5 — Update nginx.conf Domain

```bash
nano /srv/azanovretreat/deploy/nginx.conf
# Replace both occurrences of:
#   azanovretreat.com www.azanovretreat.com
# with your actual domain (or server IP for testing)
```

### 6 — Launch with Docker Compose

```bash
cd /srv/azanovretreat

# Build and start everything
docker compose up -d --build

# Check status
docker compose ps

# Watch logs
docker compose logs -f
```

The site is now live on ports 80 and 443.

### 7 — Verify It Works

```bash
# API health check
curl https://azanovretreat.com/api/health

# Expected: {"ok":true,"ts":"2026-..."}

# Test lead endpoint
curl -X POST https://azanovretreat.com/api/send-lead \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+66123","experienceType":"villa","groupSize":2,"dateFrom":"20.03.2026","dateTo":"25.03.2026","nights":"5","budget":"150000"}'

# Expected: {"ok":true}
```

---

## Maintenance

### Update the site (redeploy)

```bash
cd /srv/azanovretreat

# Pull latest code / rsync new files
git pull    # or rsync again

# Rebuild only the API container (static files update instantly)
docker compose up -d --build api

# Or restart everything
docker compose down && docker compose up -d --build
```

### Renew SSL certificate (auto-renew)

```bash
# Certbot auto-renew via cron (add this to crontab):
0 3 * * * certbot renew --quiet && docker compose -f /srv/azanovretreat/docker-compose.yml restart nginx
```

### View logs

```bash
docker compose logs api    # Node.js API logs
docker compose logs nginx  # Nginx access/error logs
```

---

## Troubleshooting

| Problem | Solution |
|---------|----------|
| Site loads but `/api/*` returns 502 | Node container crashed — check `docker compose logs api` |
| SSL cert errors | Verify fullchain.pem / privkey.pem exist in `deploy/ssl/` |
| "Cannot find module './config.js'" | Make sure `api/` folder was uploaded to server |
| Telegram messages not arriving | Check `TELEGRAM_BOT_TOKEN` in `.env`, then `docker compose restart api` |
| Changes to HTML not visible | Hard refresh browser (Ctrl+Shift+R) — Nginx serves from disk directly |
