import { Request, Response, NextFunction } from 'express';

const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://frontend-eta-five-90.vercel.app',
  // Allow any vercel.app subdomain for preview deployments
];

export const corsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const origin = req.headers.origin || '';
  
  // Allow vercel.app domains and localhost
  const isAllowed = allowedOrigins.includes(origin) || 
    /^https:\/\/[a-zA-Z0-9-]+-[a-zA-Z0-9]+-[a-zA-Z0-9]+\.vercel\.app$/.test(origin) ||
    /^https:\/\/.*\.vercel\.app$/.test(origin);

  if (isAllowed) {
    res.header('Access-Control-Allow-Origin', origin);
  } else {
    res.header('Access-Control-Allow-Origin', 'https://frontend-eta-five-90.vercel.app');
  }

  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  
  next();
};
