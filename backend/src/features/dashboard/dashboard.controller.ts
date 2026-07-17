import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import * as dashboardService from './dashboard.service';

export const getDashboard = asyncHandler(async (_req: Request, res: Response) => {
  const data = await dashboardService.getDashboard();

  res.status(200).json({
    success: true,
    data,
  });
});