import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import authRoutes from './routes/authRoutes.js';
import contentRoutes from './routes/contentRoutes.js';
import submissionRoutes from './routes/submissionRoutes.js';
import publicRoutes from './routes/publicRoutes.js';
import statsRoutes from './routes/statsRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

const allowedOrigins = [
  process.env.CLIENT_URL || 'http://localhost:3000', // student-facing app
  process.env.ADMIN_CLIENT_URL || 'http://localhost:3001', // admin dashboard
  // Always allow local dev origins to hit this backend (e.g. admin dashboard
  // developers pointing at the deployed API instead of running one locally).
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

export default app;
