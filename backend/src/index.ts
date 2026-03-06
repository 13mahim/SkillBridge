import express from 'express';
import cookieParser from 'cookie-parser';
import bcrypt from 'bcryptjs';
import { config } from './config/index.js';
import { corsMiddleware } from './middlewares/cors.js';
import { initDb } from './models/database.js';
import db from './config/database.js';

// Routes
import authRoutes from './routes/authRoutes.js';
import tutorRoutes from './routes/tutorRoutes.js';
import bookingRoutes from './routes/bookingRoutes.js';
import categoryRoutes from './routes/categoryRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import adminRoutes from './routes/adminRoutes.js';

async function startServer() {
  const app = express();

  // Initialize database
  await initDb();

  // Seed Admin if not exists
  const adminExists = await db.prepare('SELECT * FROM users WHERE role = $1').get('admin');
  if (!adminExists) {
    const hashedPassword = await bcrypt.hash('admin123', 10);
    await db.prepare('INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4)').run(
      'System Admin',
      'admin@skillbridge.com',
      hashedPassword,
      'admin'
    );
    console.log('✅ Admin user seeded: admin@skillbridge.com / admin123');
  }

  // Middlewares
  app.use(corsMiddleware);
  app.use(express.json({ limit: '10mb' })); // Increased limit for base64 images
  app.use(express.urlencoded({ limit: '10mb', extended: true }));
  app.use(cookieParser());

  // API Routes
  app.use('/api/auth', authRoutes);
  app.use('/api/tutors', tutorRoutes);
  app.use('/api/bookings', bookingRoutes);
  app.use('/api/categories', categoryRoutes);
  app.use('/api/reviews', reviewRoutes);
  app.use('/api/admin', adminRoutes);

  // Health check
  app.get('/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
  });

  // Root endpoint
  app.get('/', (req, res) => {
    res.send(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>SkillBridge API</title>
          <style>
            body {
              font-family: system-ui, -apple-system, sans-serif;
              max-width: 800px;
              margin: 50px auto;
              padding: 20px;
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
            }
            .container {
              background: rgba(255,255,255,0.1);
              backdrop-filter: blur(10px);
              padding: 40px;
              border-radius: 20px;
              box-shadow: 0 8px 32px rgba(0,0,0,0.1);
            }
            h1 { margin: 0 0 10px 0; font-size: 2.5em; }
            p { opacity: 0.9; margin: 10px 0; }
            .status { 
              display: inline-block;
              background: #10b981;
              padding: 5px 15px;
              border-radius: 20px;
              font-size: 0.9em;
              font-weight: bold;
            }
            .links {
              margin-top: 30px;
              display: flex;
              gap: 15px;
            }
            a {
              background: white;
              color: #667eea;
              padding: 12px 24px;
              border-radius: 10px;
              text-decoration: none;
              font-weight: bold;
              transition: transform 0.2s;
            }
            a:hover {
              transform: translateY(-2px);
            }
            .endpoints {
              margin-top: 30px;
              background: rgba(0,0,0,0.2);
              padding: 20px;
              border-radius: 10px;
            }
            .endpoint {
              margin: 10px 0;
              font-family: monospace;
              font-size: 0.9em;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>🎓 SkillBridge API</h1>
            <p><span class="status">✓ Running</span></p>
            <p>Backend API server for SkillBridge tutoring platform</p>
            
            <div class="links">
              <a href="http://localhost:5173" target="_blank">Open Frontend →</a>
              <a href="/health">Health Check</a>
            </div>

            <div class="endpoints">
              <h3>📚 API Endpoints:</h3>
              <div class="endpoint">POST /api/auth/register</div>
              <div class="endpoint">POST /api/auth/login</div>
              <div class="endpoint">GET /api/tutors</div>
              <div class="endpoint">GET /api/categories</div>
              <div class="endpoint">POST /api/bookings</div>
              <div class="endpoint">POST /api/reviews</div>
            </div>

            <p style="margin-top: 30px; opacity: 0.7; font-size: 0.9em;">
              Port: ${config.port} | Environment: ${config.nodeEnv}
            </p>
          </div>
        </body>
      </html>
    `);
  });

  // Start server
  app.listen(config.port, () => {
    console.log(`🚀 Backend server running on http://localhost:${config.port}`);
    console.log(`📊 API endpoints available at http://localhost:${config.port}/api`);
    console.log(`🌍 Environment: ${config.nodeEnv}`);
  });
}

startServer().catch(console.error);
