import mongoose from 'mongoose';
import { getConfig } from './env';
import { getLogger } from './logger';

export async function connectDatabase(): Promise<void> {
  const config = getConfig();
  const logger = getLogger();

  const uri = config.MONGO_URI;
  const dbName = config.MONGO_DATABASE;

  mongoose.connection.on('connecting', () => {
    logger.info('Connecting to MongoDB...');
  });

  mongoose.connection.on('connected', () => {
    logger.info('Connected to MongoDB', { database: dbName });
  });

  mongoose.connection.on('disconnected', () => {
    logger.warn('Disconnected from MongoDB');
  });

  mongoose.connection.on('error', (err) => {
    logger.error('MongoDB connection error', { error: err.message });
  });

  // If the URI already contains credentials, don't pass user/pass separately
  const hasCredentials = uri.includes('@');
  const mongooseOptions: mongoose.ConnectOptions = {
    dbName,
    serverSelectionTimeoutMS: 5000,
    socketTimeoutMS: 45000,
  };

  if (!hasCredentials) {
    mongooseOptions.authSource = 'admin';
    mongooseOptions.user = config.MONGO_USERNAME || undefined;
    mongooseOptions.pass = config.MONGO_PASSWORD || undefined;
  }

  try {
    await mongoose.connect(uri, mongooseOptions);
  } catch (error) {
    logger.error('Failed to connect to MongoDB', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    throw error;
  }
}

export async function disconnectDatabase(): Promise<void> {
  const logger = getLogger();
  await mongoose.disconnect();
  logger.info('Disconnected from MongoDB');
}