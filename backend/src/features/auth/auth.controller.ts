import type { Request, Response } from 'express';
import { asyncHandler } from '../../middleware/asyncHandler';
import { registerSchema, loginSchema } from './auth.validation';
import * as authService from './auth.service';

export const register = asyncHandler(async (req: Request, res: Response) => {
  const input = registerSchema.parse(req.body);
  const result = await authService.registerUser(input);

  res.status(201).json({
    success: true,
    data: result,
    message: 'User registered successfully',
  });
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const input = loginSchema.parse(req.body);
  const result = await authService.loginUser(input);

  res.status(200).json({
    success: true,
    data: result,
    message: 'Login successful',
  });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user!.id;
  const user = await authService.getCurrentUser(userId);

  res.status(200).json({
    success: true,
    data: { user },
  });
});