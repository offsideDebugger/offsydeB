FROM node:18-slim

# Install system dependencies required by Playwright
RUN apt-get update && apt-get install -y \
    wget \
    gnupg \
    ca-certificates \
    procps \
    libxss1 \
    libgconf-2-4 \
    libxrandr2 \
    libasound2 \
    libpangocairo-1.0-0 \
    libatk1.0-0 \
    libcairo-gobject2 \
    libgtk-3-0 \
    libgdk-pixbuf2.0-0 \
    && rm -rf /var/lib/apt/lists/*

# Install Bun
RUN npm install -g bun

WORKDIR /app

# Copy package files
COPY package.json bun.lockb ./

# Install dependencies
RUN bun install --frozen-lockfile

# Install Playwright browsers
RUN npx playwright install chromium --with-deps

# Copy source code
COPY . .

# Build the application (without playwright install since it's already done)
RUN bun build index.ts --outdir ./dist

# Expose port
EXPOSE 4000

# Set environment
ENV NODE_ENV=production
ENV PORT=4000

# Start the application
CMD ["bun", "start"]
