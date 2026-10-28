import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import session from 'express-session';
import path from 'path';

import { sessionStore } from './lib/session';
import { rateLimiters } from './middleware/rateLimit';
import { errorHandler } from './middleware/errorHandler';
import { notFound } from './middleware/notFound';

// Routes
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import categoryRoutes from './routes/categories';
import cartRoutes from './routes/cart';
import checkoutRoutes from './routes/checkout';
import orderRoutes from './routes/orders';
import addressRoutes from './routes/addresses';
import couponRoutes from './routes/coupons';
import paymentRoutes from './routes/payments';
import adminRoutes from './routes/admin';
import uploadRoutes from './routes/upload';
import settingsRoutes from './routes/settings';

const app = express();

// Disable technology disclosure
app.disable('x-powered-by');

const isProduction = process.env.NODE_ENV === 'production';
const sessionSecret = process.env.SESSION_SECRET;

if (
  isProduction &&
  (!sessionSecret ||
    sessionSecret === 'dev-secret-change-in-production' ||
    sessionSecret.startsWith('CHANGE_THIS') ||
    sessionSecret.length < 32)
) {
  throw new Error(
    'FATAL SECURITY ERROR: In production, SESSION_SECRET must be explicitly set to a strong random secret (minimum 32 characters) in your environment variables.',
  );
}

// ─── Security Headers ──────────────────────────────────────────────────────────
app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'", "'unsafe-inline'", 'https://checkout.razorpay.com'],
        styleSrc: ["'self'", "'unsafe-inline'"],
        imgSrc: ["'self'", 'data:', 'blob:', 'https://res.cloudinary.com', 'https://images.unsplash.com'],
        connectSrc: ["'self'", 'https://api.razorpay.com', 'https://res.cloudinary.com'],
        frameSrc: ['https://api.razorpay.com'],
        objectSrc: ["'none'"],
        upgradeInsecureRequests: isProduction ? [] : null,
      },
    },
    crossOriginEmbedderPolicy: false,
    crossOriginResourcePolicy: { policy: 'cross-origin' },
    hsts: isProduction
      ? { maxAge: 31536000, includeSubDomains: true, preload: true }
      : false,
    noSniff: true,
    frameguard: { action: 'sameorigin' },
  }),
);

// ─── CORS ─────────────────────────────────────────────────────────────────────
const defaultDevOrigins = ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://127.0.0.1:5173'];
const configuredOrigins = (process.env.ALLOWED_ORIGINS || '')
  .split(',')
  .map((o) => o.trim())
  .filter(Boolean);

const allowedOrigins = configuredOrigins.length > 0 ? configuredOrigins : defaultDevOrigins;

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (e.g. mobile apps, curl, server-to-server)
      if (
        !origin ||
        allowedOrigins.includes(origin) ||
        (!isProduction && (
          origin.startsWith('http://localhost:') ||
          origin.startsWith('http://127.0.0.1:') ||
          /^http:\/\/(192\.168\.\d+\.\d+|10\.\d+\.\d+\.\d+|172\.(1[6-9]|2\d|3[01])\.\d+\.\d+)(:\d+)?$/.test(origin)
        ))
      ) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS policy'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'X-Idempotency-Key'],
  }),
);

// ─── Body Parsers ─────────────────────────────────────────────────────────────
// Webhook route needs raw body — must be before json()
app.use('/api/payments/webhook', express.raw({ type: 'application/json' }));
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ─── Logging ──────────────────────────────────────────────────────────────────
if (!isProduction && process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ─── Session ──────────────────────────────────────────────────────────────────
app.use(
  session({
    store: sessionStore,
    secret: sessionSecret || 'dev-secret-change-in-production',
    resave: false,
    saveUninitialized: false,
    name: 'kv.sid',
    cookie: {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'strict' : 'lax',
      maxAge: parseInt(process.env.SESSION_MAX_AGE || '604800000', 10),
    },
  }),
);

// ─── Static uploads ───────────────────────────────────────────────────────────
app.use(
  '/uploads',
  express.static(path.join(process.cwd(), 'uploads'), {
    dotfiles: 'ignore',
    index: false,
  }),
);

// ─── Rate Limiting ────────────────────────────────────────────────────────────
// Specific high-risk rate limiters
app.use('/api/auth', rateLimiters.auth);
app.use('/api/checkout', rateLimiters.checkout);
app.use('/api/upload', rateLimiters.upload);
// Global rate limiter applied across remaining API routes (excluding webhooks)
app.use((req, res, next) => {
  if (req.path.startsWith('/api/payments/webhook')) {
    return next();
  }
  return rateLimiters.general(req, res, next);
});

// ─── Routes ───────────────────────────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/checkout', checkoutRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/addresses', addressRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/settings', settingsRoutes);

// Root status handler
app.get('/', (_req, res) => {
  res.json({
    service: 'Krishnavedic API Server',
    status: 'running',
    message: 'The backend API server is running normally. To view the website or admin panel, visit the frontend at http://localhost:5173',
    links: {
      frontend: 'http://localhost:5173',
      adminLogin: 'http://localhost:5173/admin/login',
      healthCheck: '/api/health',
    },
  });
});

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Error Handling ───────────────────────────────────────────────────────────
app.use(notFound);
app.use(errorHandler);

export default app;
