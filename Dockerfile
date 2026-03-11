# ── Stage 1: install dependencies ─────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# ── Stage 2: final image ───────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy installed deps
COPY --from=deps /app/node_modules ./node_modules

# Copy app files
COPY server.js ./
COPY package.json ./
COPY api/ ./api/

# Copy static website files
COPY index.html ./
COPY fleet.html ./
COPY tours.html ./
COPY villas.html ./
COPY robots.txt ./
COPY sitemap.xml ./
COPY assets/ ./assets/
COPY css/ ./css/
COPY js/ ./js/
COPY translations/ ./translations/

# Non-root user for security
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3001

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server.js"]
