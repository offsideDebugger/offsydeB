# OffsydeB Express API Server

A powerful web analysis API server converted from Next.js to Express.js, providing various web auditing and analysis tools.

## Features

- **Page Speed Audits** - Comprehensive page performance analysis
- **DOM Element Analysis** - Scan images, videos, audio, and iframes for issues  
- **CSS Analysis** - Detect CSS problems and optimization opportunities
- **Links Analysis** - Check stylesheet and script link validity
- **Route Performance Testing** - Test API endpoint performance and headers
- **Web Crawling** - Extract and analyze page links

## Installation

```bash
# Install dependencies
bun install

# Install Playwright browsers (required for analysis)
bunx playwright install
```

## Usage

```bash
# Development server (with hot reload)
bun run dev

# Production server
bun run start

# Build for production
bun run build
```

The server will start on `http://localhost:3000`

## API Endpoints

### POST /api/audits
Analyze page speed and performance metrics.
```json
{
  "url": "https://example.com"
}
```

### POST /api/dominator  
Scan DOM elements for broken images, videos, audio, and iframes.
```json
{
  "url": "https://example.com"
}
```

### POST /api/dominator/css
Analyze CSS files for issues and optimization opportunities.
```json
{
  "url": "https://example.com"  
}
```

### POST /api/dominator/links
Check stylesheet and JavaScript file validity.
```json
{
  "url": "https://example.com"
}
```

### POST /api/playmaker
Test API route performance, headers, and response quality.
```json
{
  "routes": ["https://api.example.com/users", "https://api.example.com/posts"]
}
```

### POST /api/playwright-crawl
Crawl a webpage and extract all internal links.
```json
{
  "url": "https://example.com"
}
```

### GET /health
Health check endpoint to verify server status.

## Example Usage

```bash
# Test page speed
curl -X POST http://localhost:3000/api/audits \
  -H "Content-Type: application/json" \
  -d '{"url": "https://google.com"}'

# Test DOM elements  
curl -X POST http://localhost:3000/api/dominator \
  -H "Content-Type: application/json" \
  -d '{"url": "https://example.com"}'

# Health check
curl http://localhost:3000/health
```

## Technologies

- **Express.js** - Web server framework
- **Playwright** - Browser automation for analysis
- **TypeScript** - Type safety
- **Bun** - Runtime and package manager
- **Axios** - HTTP client for network requests

## Notes

- All routes require POST requests with JSON payloads (except health check)
- Playwright browsers are automatically installed during setup
- The server uses CORS to allow cross-origin requests
- Analysis functions include timeouts and error handling for reliability
