import 'dotenv/config';

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
  'https://agreement.firststepoverseas.com',
  'https://admin-agreement.firststepoverseas.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`Not allowed by CORS: ${origin}`));
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

app.use('/api/auth', authRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/submissions', submissionRoutes);
app.use('/api/public', publicRoutes);
app.use('/api/stats', statsRoutes);

app.use(errorHandler);

export default app;