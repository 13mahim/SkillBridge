import express from 'express';
import cookieParser from 'cookie-parser';
import type { Request, Response, NextFunction } from 'express';
import { config } from '../src/config/index.js';
import pool from '../src/config/postgres.js';
import { initPostgresDb } from '../src/models/postgres-schema.js';

// Routes
import authRoutes from '../src/routes/authRoutes.js';
import tutorRoutes from '../src/routes/tutorRoutes.js';
import bookingRoutes from '../src/routes/bookingRoutes.js';
import categoryRoutes from '../src/routes/categoryRoutes.js';
import reviewRoutes from '../src/routes/reviewRoutes.js';
import adminRoutes from '../src/routes/adminRoutes.js';
import seedRoutes from '../src/routes/seedRoutes.js';
import heroRoutes from '../src/routes/heroRoutes.js';

const app = express();

// CORS Middleware
const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || '';
  const isAllowed = /^https:\/\/.*\.vercel\.app$/.test(origin) || origin === 'http://localhost:5173';
  res.header('Access-Control-Allow-Origin', isAllowed ? origin : 'https://frontend-eta-five-90.vercel.app');
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
};

app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/hero', heroRoutes);

// Health check
app.get('/health', (_req, res) => {
  res.json({ status: 'ok', message: 'SkillBridge API is running' });
});

app.get('/', (_req, res) => {
  res.json({ 
    status: 'ok', 
    message: '🎓 SkillBridge API',
    endpoints: ['/api/tutors', '/api/categories', '/api/auth/login', '/api/auth/register']
  });
});

// Initialize DB once (Vercel caches module between requests)
let initialized = false;
const originalHandler = app;

const handler = async (req: Request, res: Response) => {
  if (!initialized) {
    try {
      await initPostgresDb();
      initialized = true;
    } catch (err) {
      console.error('DB init error:', err);
    }
  }
  return originalHandler(req, res);
};

export default handler;
