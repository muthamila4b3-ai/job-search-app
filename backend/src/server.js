require('dotenv').config(); // Load environment variables

const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key';
const NODE_ENV = process.env.NODE_ENV || 'development';

// ==================== ENVIRONMENT VALIDATION ====================
function validateEnvironment() {
  const requiredVars = ['DB_HOST', 'DB_USER', 'DB_PASSWORD', 'DB_NAME', 'JWT_SECRET'];
  const missingVars = requiredVars.filter(varName => !process.env[varName]);

  if (missingVars.length > 0) {
    console.error('❌ Missing required environment variables:', missingVars.join(', '));
    console.error('Please set these variables in your .env file or environment.');
    process.exit(1);
  }

  // Validate JWT_SECRET is not default in production
  if (NODE_ENV === 'production' && JWT_SECRET === 'super_secret_key') {
    console.error('❌ JWT_SECRET is using default value in production. Please set a secure secret.');
    process.exit(1);
  }

  // Validate CORS_ORIGIN in production
  if (NODE_ENV === 'production' && (!process.env.CORS_ORIGIN || process.env.CORS_ORIGIN === '*')) {
    console.error('❌ CORS_ORIGIN must be set to your frontend domain in production (cannot be "*" or empty).');
    process.exit(1);
  }

  console.log('✅ Environment variables validated successfully');
}

validateEnvironment();

// ==================== VALIDATION & UTILITIES ====================
// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Validate email format
function isValidEmail(email) {
  return EMAIL_REGEX.test(email) && email.length <= 255;
}

// Validate password (minimum 6 characters)
function isValidPassword(password) {
  return password && password.length >= 6 && password.length <= 255;
}

// Logger utility
function logRequest(method, path, status = null) {
  const timestamp = new Date().toISOString();
  const statusStr = status ? ` [${status}]` : '';
  console.log(`[${timestamp}] ${method} ${path}${statusStr}`);
}

// Error handler utility
function sendError(res, statusCode, message, details = null) {
  const error = { message };
  if (NODE_ENV === 'development' && details) {
    error.details = details;
  }
  logRequest('ERROR', `${statusCode}`, statusCode);
  res.status(statusCode).json(error);
}

// Validate number ID
function isValidId(id) {
  return Number.isInteger(parseInt(id)) && parseInt(id) > 0;
}

// ==================== MIDDLEWARE ====================
// Request logging middleware
app.use((req, res, next) => {
  logRequest(req.method, req.path);
  next();
});

// CORS Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*', // Change in production
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
}));

// JSON parsing middleware with size limit
app.use(express.json({ limit: '10kb' }));

// ==================== AUTH MIDDLEWARE ====================
function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return sendError(res, 401, 'Token required');
  }

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (error) {
    const statusCode = error.name === 'TokenExpiredError' ? 401 : 403;
    const message = error.name === 'TokenExpiredError' ? 'Token expired' : 'Invalid token';
    return sendError(res, statusCode, message);
  }
}

// ==================== ROOT ROUTE ====================
app.get('/', (req, res) => {
  res.status(200).json({
    message: '🚀 Job Search Backend is Running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    environment: NODE_ENV,
  });
});

// ==================== HEALTH CHECK ====================
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
  });
});

// ==================== ENDPOINT: REGISTER ====================
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password required');
    }

    if (!isValidEmail(email)) {
      return sendError(res, 400, 'Invalid email format');
    }

    if (!isValidPassword(password)) {
      return sendError(res, 400, 'Password must be 6-255 characters');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      'INSERT INTO users (email, password_hash, subscription_plan) VALUES (?, ?, ?)',
      [email, hashedPassword, 'Silver']
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      email,
    });
  } catch (error) {
    console.error('Register error:', error);
    if (error.code === 'ER_DUP_ENTRY') {
      return sendError(res, 409, 'Email already registered');
    }
    sendError(res, 500, 'Registration failed', error.message);
  }
});

// ==================== ENDPOINT: LOGIN ====================
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, 'Email and password required');
    }

    if (!isValidEmail(email)) {
      return sendError(res, 400, 'Invalid email format');
    }

    const [rows] = await db.query('SELECT * FROM users WHERE email = ?', [email]);

    if (!rows.length) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);

    if (!match) {
      return sendError(res, 401, 'Invalid credentials');
    }

    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '8h' }
    );

    res.status(200).json({
      success: true,
      token,
      subscription_plan: user.subscription_plan,
    });
  } catch (error) {
    console.error('Login error:', error);
    sendError(res, 500, 'Login failed', error.message);
  }
});

// 👤 PROFILE
app.get('/api/profile', authenticateToken, async (req, res) => {
  try {
    const [rows] = await db.query(
      'SELECT id, email, subscription_plan FROM users WHERE id = ?',
      [req.user.userId]
    );

    if (!rows.length) {
      return sendError(res, 404, 'User not found');
    }

    res.status(200).json(rows[0]);
  } catch (error) {
    console.error('Profile error:', error);
    sendError(res, 500, 'Failed to fetch profile', error.message);
  }
});

// 💼 JOB LIST
app.get('/api/jobs', async (req, res) => {
  try {
    const [jobs] = await db.query('SELECT * FROM jobs ORDER BY id DESC');
    res.status(200).json(jobs);
  } catch (error) {
    console.error('Jobs error:', error);
    sendError(res, 500, 'Failed to fetch jobs', error.message);
  }
});

// 📩 APPLY JOB
app.post('/api/jobs/:jobId/apply', authenticateToken, async (req, res) => {
  try {
    const { jobId } = req.params;

    if (!isValidId(jobId)) {
      return sendError(res, 400, 'Invalid job ID');
    }

    const [existing] = await db.query(
      'SELECT * FROM applications WHERE user_id = ? AND job_id = ?',
      [req.user.userId, jobId]
    );

    if (existing.length) {
      return sendError(res, 409, 'Already applied for this job');
    }

    await db.query(
      'INSERT INTO applications (user_id, job_id, status) VALUES (?, ?, ?)',
      [req.user.userId, jobId, 'Applied']
    );

    res.status(201).json({
      success: true,
      message: 'Applied successfully',
      jobId: parseInt(jobId),
    });
  } catch (error) {
    console.error('Apply error:', error);
    sendError(res, 500, 'Failed to apply for job', error.message);
  }
});

// 💳 SUBSCRIPTIONS
app.get('/api/subscriptions', async (req, res) => {
  try {
    const [plans] = await db.query('SELECT * FROM subscription_plans');
    res.status(200).json(plans);
  } catch (error) {
    console.error('Subscriptions error:', error);
    sendError(res, 500, 'Failed to fetch subscriptions', error.message);
  }
});

// 🧾 SUBSCRIBE
app.post('/api/subscriptions/subscribe', authenticateToken, async (req, res) => {
  try {
    const { planId } = req.body;

    if (!planId || !isValidId(planId)) {
      return sendError(res, 400, 'Valid plan ID required');
    }

    const [plans] = await db.query(
      'SELECT name FROM subscription_plans WHERE id = ?',
      [planId]
    );

    if (!plans.length) {
      return sendError(res, 404, 'Subscription plan not found');
    }

    await db.query(
      'UPDATE users SET subscription_plan = ? WHERE id = ?',
      [plans[0].name, req.user.userId]
    );

    res.status(200).json({
      success: true,
      message: 'Subscription updated',
      plan: plans[0].name,
    });
  } catch (error) {
    console.error('Subscribe error:', error);
    sendError(res, 500, 'Failed to update subscription', error.message);
  }
});

// ❌ 404 HANDLER
app.use((req, res) => {
  sendError(res, 404, 'Endpoint not found', `${req.method} ${req.path}`);
});

// ==================== ERROR HANDLER ====================
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return sendError(res, 400, 'Invalid JSON', err.message);
  }
  console.error('Unhandled error:', err);
  sendError(res, 500, 'Internal server error');
});

// ==================== START SERVER ====================
app.listen(PORT, () => {
  console.log(`\n🚀 Server running at http://localhost:${PORT}`);
  console.log(`📝 Environment: ${NODE_ENV}`);
  console.log(`🔐 JWT Secret configured: ${JWT_SECRET !== 'super_secret_key' ? 'Yes' : 'No (default)'}\n`);
});