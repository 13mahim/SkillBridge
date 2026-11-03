import express from 'express';
import cookieParser from 'cookie-parser';
import type { Request, Response, NextFunction } from 'express';

// Config
import { config } from '../src/config/index';

// DB init
import { initPostgresDb } from '../src/models/postgres-schema';

// Routes
import authRoutes from '../src/routes/authRoutes';
import tutorRoutes from '../src/routes/tutorRoutes';
import bookingRoutes from '../src/routes/bookingRoutes';
import categoryRoutes from '../src/routes/categoryRoutes';
import reviewRoutes from '../src/routes/reviewRoutes';
import adminRoutes from '../src/routes/adminRoutes';
import seedRoutes from '../src/routes/seedRoutes';
import heroRoutes from '../src/routes/heroRoutes';

const app = express();

// CORS
app.use((req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || '';
  const isAllowed =
    /^https:\/\/.*\.vercel\.app$/.test(origin) ||
    origin === 'http://localhost:5173';
  res.header(
    'Access-Control-Allow-Origin',
    isAllowed ? origin : 'https://frontend-eta-five-90.vercel.app'
  );
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.header(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, PATCH, DELETE, OPTIONS'
  );
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));
app.use(cookieParser());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tutors', tutorRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/seed', seedRoutes);
app.use('/api/hero', heroRoutes);

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', message: 'SkillBridge API is running' });
});

// Root
app.get('/', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    message: '🎓 SkillBridge API',
    endpoints: [
      '/api/tutors',
      '/api/categories',
      '/api/auth/login',
      '/api/auth/register',
    ],
  });
});

// DB init flag (Vercel reuses warm instances)
let initialized = false;

export default async function handler(req: Request, res: Response) {
  if (!initialized) {
    try {
      await initPostgresDb();
      initialized = true;
    } catch (err) {
      console.error('DB init error:', err);
    }
  }
  return app(req, res);
}
