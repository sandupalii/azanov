# Stage 1: install deps
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci --omit=dev

# Stage 2: runtime
FROM node:20-alpine
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules

RUN addgroup -S app && adduser -S app -G app

# Copy the whole project with correct permissions
COPY --chown=app:app . .

USER app

EXPOSE 3001
ENV NODE_ENV=production
ENV PORT=3001

CMD ["node", "server.js"]
