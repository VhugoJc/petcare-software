import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { updateSettingsSchema } from './settings.validation';
import * as settingsService from './settings.service';

export const getSettings = asyncHandler(async (_req: Request, res: Response) => {
  const settings = await settingsService.getSettings();

  res.status(200).json({
    success: true,
    data: settings,
  });
});

export const updateSettings = asyncHandler(async (req: Request, res: Response) => {
  const input = updateSettingsSchema.parse(req.body);
  const settings = await settingsService.updateSettings(input);

  res.status(200).json({
    success: true,
    data: settings,
    message: 'Settings updated successfully',
  });
});