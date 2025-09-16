# Deployment Guide

## ⚠️ Important: Playwright Browser Installation

This app uses Playwright for web scraping and analysis. Browsers need to be installed on the deployment platform.

## Available Deployments

### 1. Railway
```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```
**Build Command**: `npm install -g bun && bun install && npx playwright install chromium --with-deps`
**Start Command**: `./start.sh`

### 2. Render
### 2. Render (Recommended)

#### Step-by-Step Render Deployment:

1. **Connect Repository**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository: `offsideDebugger/offsydeB`

2. **Configure Build Settings**
   - **Name**: `offsydeb-api`
   - **Environment**: `Node`
   - **Build Command**: `npm install -g bun && bun install && bunx playwright install chromium`
   - **Start Command**: `bun start`

3. **Environment Variables**
   ```
   NODE_ENV=production
   PORT=10000
   PLAYWRIGHT_BROWSERS_PATH=/opt/render/project/.cache/ms-playwright
   ```

4. **Advanced Settings**
   - **Auto-Deploy**: `Yes`
   - **Branch**: `main`

#### Option 1: Using Render Dashboard (Manual)
1. Go to [render.com](https://render.com) and create account
2. Click "New +" → "Web Service"  
3. Connect GitHub repo: `offsideDebugger/offsydeB`
4. Configure:
   - **Build Command**: `npm install -g bun && bun install && npx playwright install chromium --with-deps`
   - **Start Command**: `bun start`
   - **Environment Variables**:
     - `NODE_ENV=production`
     - `PLAYWRIGHT_BROWSERS_PATH=/opt/render/.cache/ms-playwright`

#### Option 2: Using render.yaml (Automatic)
The repository includes a `render.yaml` file that automatically configures the deployment.
Just connect the repo and Render will use these settings automatically.

#### Testing Your Render Deployment:
```bash
# Health check
curl https://your-app-name.onrender.com/health

# Test API
curl -X POST https://your-app-name.onrender.com/api/audits \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

#### Important Notes for Render:
- First deployment takes 5-10 minutes (installing Playwright browsers)
- Render automatically assigns the port via `process.env.PORT`
- Free tier may have cold starts (first request after inactivity is slow)
- The service will be available at: `https://your-service-name.onrender.com`

### 3. Vercel (⚠️ Not Recommended)
Vercel has limitations with Playwright. Use Railway or Render instead.
```bash
# If you must use Vercel
npm install -g vercel
vercel
```
**Note**: May require serverless functions approach

### 4. Docker
```bash
# Build image
docker build -t offsydeb .

# Run container
docker run -p 4000:4000 offsydeb
```

### 5. VPS/Server
```bash
# Install dependencies
bun install

# Install Playwright browsers
npx playwright install chromium --with-deps

# Start with PM2
npm install -g pm2
pm2 start ecosystem.config.js
```

## Environment Variables

For production, set these environment variables:
- `NODE_ENV=production`
- `PORT=4000` (or your preferred port)

## Testing Endpoints

### Health Check
```bash
curl http://your-domain.com/health
```

### Audit API
```bash
curl -X POST http://your-domain.com/api/audits \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```

### DOM Analysis
```bash
curl -X POST http://your-domain.com/api/dominator \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'
```
