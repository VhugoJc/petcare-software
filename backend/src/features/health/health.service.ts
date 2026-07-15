import mongoose from 'mongoose';
import { getConfig } from '../../config/env';

export interface HealthStatus {
  status: 'ok' | 'degraded' | 'error';
  timestamp: string;
  uptime: number;
  environment: string;
  mongodb: {
    status: 'connected' | 'disconnected' | 'error';
    database: string;
  };
}

export async function getHealthStatus(): Promise<HealthStatus> {
  const config = getConfig();
  const mongoState = mongoose.connection.readyState;

  const mongoStatusMap: Record<number, HealthStatus['mongodb']['status']> = {
    0: 'error',      // disconnected
    1: 'connected',  // connected
    2: 'error',      // connecting
    3: 'error',      // disconnecting
  };

  const mongoStatus = mongoStatusMap[mongoState] ?? 'error';

  return {
    status: mongoStatus === 'connected' ? 'ok' : 'degraded',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: config.NODE_ENV,
    mongodb: {
      status: mongoStatus,
      database: config.MONGO_DATABASE,
    },
  };
}