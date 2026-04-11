require('dotenv').config();

const express  = require('express');
const mongoose = require('mongoose');
const cors     = require('cors');
const path     = require('path');

const app = express();

// Ensure JWT_SECRET is always set
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'bnr_infra_secret_key_2024';
}

// ── CORS ─────────────────────────────────────────────────────────────────────
// Build a whitelist that covers every legitimate source:
//  • deployed frontend (www and non-www, http and https)
//  • local development (localhost / 127.0.0.1 on any common port)
const BASE_DOMAIN   = 'bnrinfrastructure.in';
const RENDER_DOMAIN = 'bnr-backend-93y5.onrender.com';

const allowedOrigins = [
  // Production frontend
  `https://${BASE_DOMAIN}`,
  `https://www.${BASE_DOMAIN}`,
  `http://${BASE_DOMAIN}`,
  `http://www.${BASE_DOMAIN}`,
  // Render preview / same-origin requests from the backend itself
  `https://${RENDER_DOMAIN}`,
  // Local development
  'http://localhost:3000',
  'http://localhost:5000',
  'http://localhost:5500',
  'http://localhost:8080',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5000',
  'http://127.0.0.1:5500',
  'http://127.0.0.1:8080',
];

// Accept any extra origin listed in the environment variable (comma-separated)
if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').map(u => u.trim()).forEach(u => {
    if (u && !allowedOrigins.includes(u)) allowedOrigins.push(u);
  });
}

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no Origin header (server-to-server, Postman, curl, mobile)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) return callback(null, true);
    // In development allow any localhost regardless of port
    if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
      return callback(null, true);
    }
    console.warn(`[CORS] Blocked origin: ${origin}`);
    return callback(new Error(`CORS blocked for origin: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  credentials: true,
  optionsSuccessStatus: 200, // Some older browsers (IE11) choke on 204
};

app.use(cors(corsOptions));
// Handle preflight OPTIONS requests for all routes
app.options('*', cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/contact',      require('./routes/contact'));
app.use('/api/quote',        require('./routes/quote'));
app.use('/api/projects',     require('./routes/projects'));
app.use('/api/clients',      require('./routes/clients'));
app.use('/api/admin',        require('./routes/admin'));
app.use('/api/careers',      require('./routes/careers'));
app.use('/api/applications', require('./routes/applications'));
app.use('/api/upload',       require('./routes/upload'));

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    status:    'ok',
    message:   'BNR Infrastructure API is running',
    db:        mongoose.connection.readyState === 1 ? 'connected' : 'disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ── 404 catch-all ─────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({ error: 'Route not found.' });
});

// ── Global error handler ──────────────────────────────────────────────────────
// eslint-disable-next-line no-unused-vars
app.use((err, _req, res, _next) => {
  console.error('[Server Error]', err.message);
  res.status(err.status || 500).json({ error: err.message || 'Internal server error.' });
});

// ── MongoDB Connection ────────────────────────────────────────────────────────
const MONGO_URI = process.env.MONGO_URI;

if (!MONGO_URI) {
  console.warn('⚠️  MONGO_URI not set — running without database.');
} else {
  mongoose.connect(MONGO_URI, {
    serverSelectionTimeoutMS: 10000,
    socketTimeoutMS:          45000,
  })
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => {
      // Log but DO NOT exit — Render may reconnect, and admin login still works.
      console.error('❌ MongoDB connection failed:', err.message);
    });

  // Reconnect on disconnect
  mongoose.connection.on('disconnected', () => {
    console.warn('⚠️  MongoDB disconnected — will attempt to reconnect…');
  });
  mongoose.connection.on('reconnected', () => {
    console.log('✅ MongoDB reconnected');
  });
}

// ── Start server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});