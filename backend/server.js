require('dotenv').config(); // MUST be at top

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

// DEBUG (remove later)
console.log("DEBUG MONGO_URI:", process.env.MONGO_URI);

// Ensure JWT_SECRET is always set
if (!process.env.JWT_SECRET) {
  process.env.JWT_SECRET = 'bnr_infra_secret_key_2024';
}

const app = express();

// Middleware
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/contact', require('./routes/contact'));
app.use('/api/quote', require('./routes/quote'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/clients', require('./routes/clients'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/careers', require('./routes/careers'));
app.use('/api/upload', require('./routes/upload'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    message: 'BNR Infrastructure API is running',
    db: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI;

if (MONGO_URI && MONGO_URI.startsWith('mongodb')) {
  mongoose.connect(MONGO_URI)
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('⚠️ MongoDB error:', err.message));
} else {
  console.log('⚠️ Invalid or missing MONGO_URI. DB not connected.');
}