import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import { apiRoutes } from './routes/index';
import { errorHandler } from './middleware/errorHandler';
import { notFoundHandler } from './middleware/notFoundHandler';
import { getConfig } from './config/env';
import { getLogger } from './config/logger';

export function createApp(): express.Application {
  const app = express();
  const config = getConfig();
  const logger = getLogger();

  // ---------- Security headers ----------
  app.use(helmet());

  // ---------- CORS ----------
  const allowedOrigins = config.CORS_ORIGIN.split(',').map((o) => o.trim());
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (mobile apps, curl, server-to-server)
        // In development, reflect the requesting origin
        if (!origin || config.NODE_ENV === 'development' || allowedOrigins.includes(origin)) {
          callback(null, origin || true);
        } else {
          callback(new Error('Not allowed by CORS'));
        }
      },
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true,
    })
  );

  // ---------- Body parsing ----------
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // ---------- Request logging ----------
  const morganFormat = config.NODE_ENV === 'production' ? 'combined' : 'dev';
  app.use(
    morgan(morganFormat, {
      stream: {
        write: (message: string) => logger.info(message.trim()),
      },
    })
  );

  // ---------- Rate limiting ----------
  const limiter = rateLimit({
    windowMs: config.RATE_LIMIT_WINDOW_MS,
    max: config.RATE_LIMIT_MAX,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
      success: false,
      error: {
        message: 'Too many requests, please try again later.',
      },
    },
  });
  app.use('/api/', limiter);

  // ---------- API routes ----------
  app.use('/api/v1', apiRoutes);

  // ---------- 404 handler (must be after routes) ----------
  app.use(notFoundHandler);

  // ---------- Global error handler (must be last) ----------
  app.use(errorHandler);

  return app;
}