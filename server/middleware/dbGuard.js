const mongoose = require('mongoose');
const connectDB = require('../config/db');

/**
 * Middleware to ensure the MongoDB connection is active before proceeding.
 * This is crucial for serverless environments (like Vercel) where cold starts
 * can sometimes cause a request to hit the server before the DB connection is stable.
 */
const dbGuard = async (req, res, next) => {
  try {
    // 0: disconnected, 1: connected, 2: connecting, 3: disconnecting
    const state = mongoose.connection.readyState;

    if (state === 1) {
      return next();
    }

    if (state === 2) {
      console.log('⏳ Database is connecting, waiting...');
      // Wait for connection to open
      await new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('DB connection timeout')), 5000);
        mongoose.connection.once('open', () => {
          clearTimeout(timeout);
          resolve();
        });
      });
      return next();
    }

    console.log('🔄 Database disconnected, attempting re-connection...');
    await connectDB();
    next();
  } catch (error) {
    console.error('❌ Database Guard Error:', error.message);
    res.status(503).json({ 
      message: 'Service Temporarily Unavailable (Database Connection)',
      error: error.message 
    });
  }
};

module.exports = dbGuard;
