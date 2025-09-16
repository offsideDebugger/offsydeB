import express from 'express';
import { chromium } from 'playwright';

const router = express.Router();

router.post('/', async (req, res) => {
    try {
        const { url } = req.body;
        
        if (!url) {
            return res.status(400).json({ error: 'URL is required' });
        }

        console.log('Starting page speed test for:', url);
        
        // Launch browser
        const browser = await chromium.launch({ 
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        
        const context = await browser.newContext();
        const page = await context.newPage();
        
        try {
            // Measure page load time
            const startTime = Date.now();
            
            await page.goto(url, { 
                waitUntil: 'networkidle',
                timeout: 50000 
            });
            
            const loadTime = Date.now() - startTime;
            
            // Get basic page info
            const title = await page.title();
            const consoleErrors: string[] = [];
            page.on('console', msg => {
                if (msg.type() === 'error')
                    consoleErrors.push(msg.text());
            });
            const failedRequests: string[] = [];
            page.on("response", response => {
                if (!response.ok())
                    failedRequests.push(`${response.url()} - ${response.status()}`);
            });
         
            const metrics = await page.evaluate(() => {
                // @ts-ignore - This runs in browser context, ignore all TS errors
                const navigation = performance.getEntriesByType('navigation')[0];
                if (!navigation) return {
                    domContentLoaded: 0,
                    pageLoadComplete: 0,
                    timeToFirstByte: 0,
                    domElements: 0,
                    images: 0,
                    scripts: 0,
                    stylesheets: 0
                };
                return {
                    // @ts-ignore
                    domContentLoaded: Math.round(navigation.domContentLoadedEventEnd - navigation.fetchStart),
                    // @ts-ignore
                    pageLoadComplete: Math.round(navigation.loadEventEnd - navigation.fetchStart),
                    // @ts-ignore
                    timeToFirstByte: Math.round(navigation.responseStart - navigation.fetchStart),
                    // @ts-ignore
                    domElements: document.querySelectorAll('*').length,
                    // @ts-ignore
                    images: document.querySelectorAll('img').length,
                    // @ts-ignore
                    scripts: document.querySelectorAll('script').length,
                    // @ts-ignore
                    stylesheets: document.querySelectorAll('link[rel="stylesheet"]').length
                };
            });
            
            await browser.close();
            
            return res.json({
                success: true,
                data: {
                    url,
                    title,
                    loadTime: `${loadTime}ms`,
                    metrics: {
                        domContentLoaded: `${metrics.domContentLoaded}ms`,
                        pageLoadComplete: `${metrics.pageLoadComplete}ms`,
                        timeToFirstByte: `${metrics.timeToFirstByte}ms`,
                        domElements: metrics.domElements,
                        images: metrics.images,
                        scripts: metrics.scripts,
                        stylesheets: metrics.stylesheets
                    },
                    performance: {
                        grade: loadTime < 2000 ? 'Excellent' : loadTime < 4000 ? 'Good' : loadTime < 6000 ? 'Fair' : 'Poor',
                        color: loadTime < 2000 ? 'green' : loadTime < 4000 ? 'orange' : loadTime < 6000 ? 'yellow' : 'red'
                    },
                    consoleErrors,
                    failedRequests
                }
            });
            
        } catch (pageError) {
            console.error('Error during page test:', pageError);
            await browser.close();
            
            return res.status(500).json({
                error: `Failed to test page: ${pageError instanceof Error ? pageError.message : 'Unknown error'}`,
                success: false
            });
        }
        
    } catch (error) {
        console.error('Page speed test error:', error);
        
        return res.status(500).json({
            error: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
            success: false
        });
    }
});

export default router;
