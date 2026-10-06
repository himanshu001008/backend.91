require('dotenv').config();

const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { initializeFirebase } = require('./config/firebase');

// Import Routes
const healthRoutes = require('./routes/healthRoutes');
const authRoutes = require('./routes/authRoutes');
const classRoutes = require('./routes/classRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const creditRoutes = require('./routes/creditRoutes');

// Import Error Middleware
const { notFoundHandler, globalErrorHandler } = require('./middleware/errorHandler');

// Initialize Express application
const app = express();

// Set Port
const PORT = process.env.PORT || 5001;

// ==========================================
// Middleware Configuration
// ==========================================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ==========================================
// API Routes
// ==========================================
app.use('/api', healthRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/classes', classRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/credits', creditRoutes);

// ==========================================
// Error Handling Middleware
// ==========================================
app.use(notFoundHandler);
app.use(globalErrorHandler);

// ==========================================
// Start Server & Connect Database
// ==========================================
const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Initialize Firebase Admin SDK
  initializeFirebase();

  // Listen on PORT
  app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`🚀 FlexFit Server running on port ${PORT}`);
    console.log(`🔗 Health Endpoint: http://localhost:${PORT}/api/health`);
    console.log(`=================================`);
  });
};

startServer();

