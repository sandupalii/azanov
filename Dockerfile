# ── Stage 1: install dependencies ─────────────────────────────
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: final image ───────────────────────────────────────
FROM node:20-alpine
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

COPY server.js ./
COPY package.json ./
COPY api/ ./api/

COPY index.html ./
COPY fleet.html ./
COPY tours.html ./
COPY villas.html ./
COPY robots.txt ./
COPY sitemap.xml ./
COPY assets/ ./assets/
COPY css/ ./css/
COPY js/ ./js/
# COPY translations/ ./translations/

RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server.js"]
