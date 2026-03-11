# ── Stage 1: install dependencies ─────────────────────────────
FROM node:20-alpine AS deps

WORKDIR /app

COPY package.json ./
RUN npm install --omit=dev

# ── Stage 2: final image ───────────────────────────────────────
FROM node:20-alpine

WORKDIR /app

# Copy installed deps
COPY --from=deps /app/node_modules ./node_modules

# Copy server and API files
COPY server.js     ./
COPY package.json  ./
COPY api/          ./api/

# Non-root user for security
RUN addgroup -S app && adduser -S app -G app
USER app

EXPOSE 3005

ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server.js"]
