import type { Request, Response, NextFunction } from 'express';

/**
 * Wraps async route handlers to forward unhandled promise rejections
 * to the global error handler, eliminating the need for try/catch
 * in every controller.
 */
export function asyncHandler(
  fn: (req: Request, res: Response, next: NextFunction) => Promise<unknown>
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}