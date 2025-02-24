import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import marketRoutes from './routes/marketRoutes.js';
import errorTracker from './utils/errorTracker.js';
import marketEnvironmentRoutes from './routes/marketEnvironmentRoutes.js';
import industryAnalysisRoutes from './routes/industryAnalysis.js';
import macroAnalysisRoutes from './routes/macroAnalysisRoutes.js';
import insightRoutes from './routes/insightRoutes.js';
import alertRoutes from './routes/alertRoutes.js';
import enhancedMarketRoutes from './routes/enhancedMarketRoutes.js';
import monitoringRoutes from './routes/monitoringRoutes.js';
import relationshipRoutes from './routes/relationshipRoutes.js';
import websocketService from './services/websocketService.js';

const app = express();
const PORT = process.env.PORT || 5000;

// CORS middleware
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'https://market-dashboard-frontend.onrender.com');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Credentials', 'true');
  
  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

// Basic middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes with error handling
app.use('/api/market', async (req, res, next) => {
  try {
    await marketRoutes(req, res, next);
  } catch (error) {
    console.error('Market route error:', error);
    next(error);
  }
});

app.use('/api/market-environment', marketEnvironmentRoutes);
app.use('/api/industry-analysis', industryAnalysisRoutes);
app.use('/api/macro-analysis', macroAnalysisRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/enhanced-market', enhancedMarketRoutes);
app.use('/api/monitoring', monitoringRoutes);
app.use('/api/relationships', relationshipRoutes);

// Health check with CORS headers
app.get('/health', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.json({ 
    status: 'healthy',
    apis: {
      eod: Boolean(process.env.EOD_API_KEY),
      brave: Boolean(process.env.BRAVE_API_KEY)
    },
    version: '2.0.0',
    timestamp: Date.now()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  errorTracker.track(err, `${req.method} ${req.path}`);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    timestamp: Date.now()
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log('CORS Origin:', 'https://market-dashboard-frontend.onrender.com');
});

// Initialize WebSocket
websocketService.initialize(server);