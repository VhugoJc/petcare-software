import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { getConfig } from '../../config/env';
import { AppError } from '../../errors/AppError';
import type { AuthTokenPayload } from './types/index';

/**
 * Express middleware that verifies the JWT from the Authorization header
 * and attaches the decoded user to `req.user`.
 *
 * Usage:
 *   router.get('/me', authenticate, controller.getMe);
 */
export function authenticate(
  req: Request,
  _res: Response,
  next: NextFunction
): void {
  try {
    const config = getConfig();

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw AppError.unauthorized('Authentication required');
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      throw AppError.unauthorized('Authentication required');
    }

    const decoded = jwt.verify(token, config.JWT_SECRET) as AuthTokenPayload;
    req.user = {
      id: decoded.sub,
      email: decoded.email,
      role: decoded.role,
    };
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      next(AppError.unauthorized('Token has expired'));
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      next(AppError.unauthorized('Invalid token'));
      return;
    }
    next(error);
  }
}