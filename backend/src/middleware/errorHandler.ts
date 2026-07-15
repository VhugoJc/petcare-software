import type { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError';
import { getConfig } from '../config/env';
import { getLogger } from '../config/logger';

/**
 * Global error handler middleware.
 *
 * - Converts Mongoose and Zod errors into AppError with user-friendly messages.
 * - Returns a consistent JSON envelope.
 * - In development, includes stack traces for debugging.
 */
export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  const logger = getLogger();
  const config = getConfig();
  const isDevelopment = config.NODE_ENV === 'development';

  let error: AppError;

  // Convert known errors
  if (err instanceof ZodError) {
    const details: Record<string, unknown> = {};
    for (const issue of err.issues) {
      const path = issue.path.join('.');
      details[path] = issue.message;
    }
    error = AppError.badRequest('Validation failed', details);
  } else if (err instanceof mongoose.Error.ValidationError) {
    const details: Record<string, unknown> = {};
    for (const [field, ve] of Object.entries(err.errors)) {
      details[field] = ve.message;
    }
    error = AppError.badRequest('Validation failed', details);
  } else if (err instanceof mongoose.Error.CastError) {
    error = AppError.badRequest(`Invalid ${err.path}: ${err.value}`);
  } else if (err instanceof mongoose.Error.DocumentNotFoundError) {
    error = AppError.notFound('Resource not found');
  } else if ((err as any).code === 11000) {
    // MongoDB duplicate key error
    const keyValue = (err as any).keyValue ?? {};
    const fields = Object.keys(keyValue).join(', ');
    error = AppError.conflict(`Duplicate value for: ${fields}`, { fields: keyValue });
  } else if (err instanceof AppError) {
    error = err;
  } else {
    // Unknown error — treat as internal server error
    error = AppError.internal(
      isDevelopment ? err.message : 'Something went wrong'
    );
  }

  // Log the error
  if (error.isOperational) {
    logger.warn('Operational error', {
      statusCode: error.statusCode,
      message: error.message,
      details: error.details,
    });
  } else {
    logger.error('Unexpected error', {
      statusCode: error.statusCode,
      message: error.message,
      stack: err.stack,
    });
  }

  // Build response
  const response: Record<string, unknown> = {
    success: false,
    error: {
      message: error.message,
      ...(error.details && { details: error.details }),
      ...(isDevelopment && !error.isOperational && { stack: err.stack }),
    },
  };

  res.status(error.statusCode).json(response);
}