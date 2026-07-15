import { createApp } from './app';
import { loadConfig, getConfig } from './config/env';
import { createLogger, getLogger } from './config/logger';
import { connectDatabase, disconnectDatabase } from './config/database';

async function main(): Promise<void> {
  // 1. Load configuration (exits early if env vars are invalid)
  loadConfig();
  const config = getConfig();

  // 2. Create logger
  createLogger();
  const logger = getLogger();

  logger.info('Starting PetCare API server...', {
    environment: config.NODE_ENV,
    port: config.PORT,
  });

  // 3. Connect to MongoDB
  try {
    await connectDatabase();
  } catch (error) {
    logger.error('Could not connect to MongoDB. Exiting.', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }

  // 4. Create and start Express app
  const app = createApp();

  const server = app.listen(config.PORT, config.HOST, () => {
    logger.info(`Server listening on http://${config.HOST}:${config.PORT}`);
    logger.info(`Health check: http://localhost:${config.PORT}/api/v1/health`);
  });

  // 5. Graceful shutdown
  const shutdown = async (signal: string) => {
    logger.info(`Received ${signal}. Shutting down gracefully...`);
    server.close(async () => {
      await disconnectDatabase();
      logger.info('Server shut down complete.');
      process.exit(0);
    });

    // Force exit after 10 seconds if graceful shutdown fails
    setTimeout(() => {
      logger.error('Forced shutdown after timeout.');
      process.exit(1);
    }, 10000);
  };

  process.on('SIGTERM', () => shutdown('SIGTERM'));
  process.on('SIGINT', () => shutdown('SIGINT'));

  // Handle unhandled promise rejections
  process.on('unhandledRejection', (reason) => {
    logger.error('Unhandled Rejection', {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined,
    });
  });

  // Handle uncaught exceptions
  process.on('uncaughtException', (error) => {
    logger.error('Uncaught Exception', {
      message: error.message,
      stack: error.stack,
    });
    process.exit(1);
  });
}

main();