import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import session from 'express-session';

// Load environment variables FIRST before any other imports that need them
dotenv.config();

import connectDB from './config/database.js';
import passport from './config/passport.js';
import authRoutes from './routes/auth.js';
import postsRoutes from './routes/posts.js';
import User from './models/User.js';

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Session configuration
app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      secure: process.env.NODE_ENV === 'production',
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
    },
  })
);

// Initialize Passport
app.use(passport.initialize());
app.use(passport.session());

// Make User model available to routes
app.locals.User = User;

// Routes
app.get('/', (req, res) => {
  res.json({
    message: 'RTL Social Media Manager API',
    version: '1.0.0',
    endpoints: {
      auth: '/auth',
      posts: '/api/posts',
    },
  });
});

app.use('/auth', authRoutes);
app.use('/api/posts', postsRoutes);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📱 Frontend URL: ${process.env.FRONTEND_URL}`);
  console.log(`🔐 LinkedIn OAuth configured`);
});

export default app;
