import express from 'express';
import cors from 'cors';
import auditsRoute from './routes/audits.ts';
import dominatorRoute from './routes/dominator.ts';
import cssRoute from './routes/css.ts';
import linksRoute from './routes/links.ts';
import playmakerRoute from './routes/playmaker.ts';
import crawlRoute from './routes/crawl.ts';

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/audits', auditsRoute);
app.use('/api/dominator', dominatorRoute);
app.use('/api/dominator/css', cssRoute);
app.use('/api/dominator/links', linksRoute);
app.use('/api/playmaker', playmakerRoute);
app.use('/api/playwright-crawl', crawlRoute);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
  console.log(`📊 Available endpoints:`);
  console.log(`   POST /api/audits - Page speed audits`);
  console.log(`   POST /api/dominator - DOM element analysis`);
  console.log(`   POST /api/dominator/css - CSS analysis`);
  console.log(`   POST /api/dominator/links - Links analysis`);
  console.log(`   POST /api/playmaker - Route performance testing`);
  console.log(`   POST /api/playwright-crawl - Web crawling`);
  console.log(`   GET  /health - Health check`);
});