import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { getHealthStatus } from './health.service';

export const getHealth = asyncHandler(async (_req: Request, res: Response) => {
  const health = await getHealthStatus();

  const statusCode = health.status === 'ok' ? 200 : 503;

  res.status(statusCode).json({
    success: true,
    data: health,
    message: health.status === 'ok' ? 'Service is healthy' : 'Service is degraded',
  });
});