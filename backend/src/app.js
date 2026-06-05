const express = require('express');
const cors = require('cors');
const { errorHandler } = require('./middleware/errorMiddleware');

const app = express();

// CORS — allow all Vercel deployments + localhost in dev
const allowedOrigins = [
  // Local dev
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
];

app.use(cors({
  origin: (origin, callback) => {
    // No origin = server-to-server or same-origin — allow
    if (!origin) return callback(null, true);

    // Exact match in allowedOrigins list
    if (allowedOrigins.includes(origin)) return callback(null, true);

    // Any Vercel deployment (preview + production)
    if (origin.endsWith('.vercel.app')) return callback(null, true);

    // Custom domain set in FRONTEND_URL env var
    if (process.env.FRONTEND_URL && origin === process.env.FRONTEND_URL) {
      return callback(null, true);
    }

    callback(new Error(`CORS blocked: ${origin}`));
  },
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: false }));

// Routes
app.use('/api/auth',      require('./routes/authRoutes'));
app.use('/api/news',      require('./routes/newsRoutes'));
app.use('/api/matches',   require('./routes/matchRoutes'));
app.use('/api/players',   require('./routes/playerRoutes'));
app.use('/api/standings', require('./routes/standingRoutes'));
app.use('/api/videos',    require('./routes/videoRoutes'));

app.get('/api/health', (req, res) =>
  res.json({ status: 'ok', env: process.env.NODE_ENV, timestamp: new Date().toISOString() })
);

// 404 for unknown API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ success: false, message: `Route not found: ${req.originalUrl}` });
});

// Centralized error handler — must be last
app.use(errorHandler);

module.exports = app;
