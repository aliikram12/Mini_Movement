require('dotenv').config({ path: '../.env' });
const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/db');

const app = express();
connectDB();

// Security
app.use(helmet({ crossOriginResourcePolicy: { policy: 'cross-origin' } }));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 200 }));
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
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

app.get('/api/health', (_, res) => res.json({ status: 'OK', message: 'Mini Movements API ✨' }));

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../client/dist')));
  app.get('*', (req, res) => res.sendFile(path.resolve(__dirname, '../client/dist', 'index.html')));
} else {
  app.get('/', (_, res) => res.json({ status: 'OK', message: 'Welcome to Mini Movements Backend API 🧸✨' }));
}

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: process.env.NODE_ENV === 'development' ? err.message : undefined });
});

const PORT = process.env.PORT || 5000;

// Prevent direct listen when running as a serverless function on Vercel
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => console.log(`🚀 Mini Movements API on port ${PORT}`));
}

// Export the app for serverless platforms (Vercel)
module.exports = app;
