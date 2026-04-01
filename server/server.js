require('dotenv').config();
console.log('📝 Environment variables loaded.');
console.log('📍 MONGO_URI exists:', !!process.env.MONGO_URI);
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();
// Trust Proxy for Vercel
app.set('trust proxy', 1);
// connectDB is now called inside startServer() at the bottom

// CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  'http://localhost:3000',
  'https://mini-movements.vercel.app',
  'https://mini-movement.vercel.app'
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    const isVercel = origin.endsWith('.vercel.app');
    const isAllowed = allowedOrigins.includes(origin);
    if (isVercel || isAllowed) {
      callback(null, true);
    } else {
      console.warn(`🔒 CORS blocked: ${origin}`);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept']
}));
app.use(cookieParser());

// Stripe webhook needs raw body
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));

// Body parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/products', require('./routes/products'));
app.use('/api/orders', require('./routes/orders'));
app.use('/api/custom-orders', require('./routes/customOrders'));
app.use('/api/payments', require('./routes/payments'));

app.get('/api', (_, res) => res.json({ status: 'OK', message: 'Mini Movements API Root 🧸✨' }));
app.get('/api/health', (_, res) => res.json({ status: 'OK', message: 'Mini Movements API Health ✨' }));

app.get('/', (_, res) => res.json({ status: 'OK', message: 'Welcome to Mini Movements Backend API 🧸✨' }));

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

const startServer = async () => {
  try {
    // 1. Connect to Database first
    await connectDB();

    // 2. Start Listening
    const PORT = process.env.PORT || 5000;
    if (process.env.VERCEL !== '1') {
      app.listen(PORT, () => console.log(`🚀 Mini Movements Server Ready on port ${PORT}`));
    }
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

// Export the app for serverless platforms (Vercel)
module.exports = app;
