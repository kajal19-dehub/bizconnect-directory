const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Database connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/bizconnect', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// Test route
app.get('/', (req, res) => {
  res.json({ 
    message: 'BizConnect API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      businesses: '/api/businesses',
      reviews: '/api/reviews',
      users: '/api/users'
    }
  });
});

// API Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/businesses', require('./routes/business'));
app.use('/api/reviews', require('./routes/review'));
app.use('/api/users', require('./routes/user'));

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    error: 'Endpoint not found',
    message: 'The requested API endpoint does not exist'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Server error',
    message: 'Something went wrong on the server'
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📄 API Documentation: http://localhost:${PORT}`);
  console.log(`🔗 API Endpoints:`);
  console.log(`   GET  http://localhost:${PORT}/api/businesses`);
  console.log(`   GET  http://localhost:${PORT}/api/businesses/:id`);
  console.log(`   POST http://localhost:${PORT}/api/auth/register`);
  console.log(`   POST http://localhost:${PORT}/api/auth/login`);
});