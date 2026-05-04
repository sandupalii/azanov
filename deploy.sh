#!/bin/bash
# Simple deployment script for AzanovTravel

echo "🚀 Starting deployment..."

# Pull latest changes (uncomment if using git)
# git pull origin main

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Build CSS and minified JS
echo "🔨 Building static assets..."
npm run build

# Restart PM2 process
echo "🔄 Restarting Node.js server via PM2..."
pm2 reload ecosystem.config.js || pm2 start ecosystem.config.js

echo "✅ Deployment successful!"
