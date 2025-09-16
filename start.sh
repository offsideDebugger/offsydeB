#!/bin/bash

# Startup script for production deployment
echo "🚀 Starting OffsydeB API Server..."

# Check if Playwright browsers are installed
if ! npx playwright --version > /dev/null 2>&1; then
    echo "📦 Installing Playwright..."
    npx playwright install chromium --with-deps
fi

# Check if browsers are available
if ! npx playwright install --dry-run chromium > /dev/null 2>&1; then
    echo "⚠️  Installing Playwright browsers..."
    npx playwright install chromium --with-deps
fi

echo "✅ Playwright browsers ready"
echo "🌍 Starting server on port ${PORT:-4000}"

# Start the application
exec bun run index.ts
