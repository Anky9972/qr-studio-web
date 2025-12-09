import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import { serverConfig, rateLimitConfig } from './config/smtp.config';
import { verifyTransporter, closeTransporter } from './services/transporter';
import { createEmailQueue, closeQueue } from './services/queueService';
import { logger } from './utils/logger';
import emailRoutes from './routes/email.routes';

const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
const limiter = rateLimit({
  windowMs: rateLimitConfig.windowMs,
  max: rateLimitConfig.max,
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Request logging
app.use((req: Request, _res: Response, next: NextFunction) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Health check
app.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// API routes
app.use('/api/email', emailRoutes);

// 404 handler
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, _next: NextFunction) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
    ...(serverConfig.nodeEnv === 'development' && {
      details: err.message,
      stack: err.stack,
    }),
  });
});

// Startup
async function startServer() {
  try {
    // Verify SMTP connection
    const smtpVerified = await verifyTransporter();
    if (!smtpVerified) {
      logger.warn('SMTP connection verification failed, but server will start anyway');
    }

    // Initialize email queue
    createEmailQueue();
    logger.info('Email queue initialized');

    // Start server
    app.listen(serverConfig.port, () => {
      logger.info(`🚀 SMTP Server running on port ${serverConfig.port}`);
      logger.info(`Environment: ${serverConfig.nodeEnv}`);
      logger.info(`API Documentation: http://localhost:${serverConfig.port}/api`);
    });
  } catch (error) {
    logger.error('Failed to start server', { error });
    process.exit(1);
  }
}

// Graceful shutdown
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully...');
  
  await closeQueue();
  closeTransporter();
  
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully...');
  
  await closeQueue();
  closeTransporter();
  
  process.exit(0);
});

// Unhandled rejections
process.on('unhandledRejection', (reason: any) => {
  logger.error('Unhandled Rejection', { reason });
});

process.on('uncaughtException', (error: Error) => {
  logger.error('Uncaught Exception', { error: error.message, stack: error.stack });
  process.exit(1);
});

// Start the server
startServer();
