/**
 * Custom application error with HTTP status code.
 *
 * - Operational errors (expected business logic failures) use `isOperational = true`.
 * - Programming errors (bugs) use `isOperational = false`.
 */
export class AppError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    statusCode: number = 500,
    options?: {
      isOperational?: boolean;
      details?: Record<string, unknown>;
    }
  ) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.details = options?.details;

    // Maintain proper prototype chain for instanceof checks
    Object.setPrototypeOf(this, AppError.prototype);

    // Capture stack trace, excluding constructor from it
    Error.captureStackTrace(this, this.constructor);
  }

  static badRequest(message: string, details?: Record<string, unknown>): AppError {
    return new AppError(message, 400, { details });
  }

  static unauthorized(message: string = 'Unauthorized'): AppError {
    return new AppError(message, 401);
  }

  static forbidden(message: string = 'Forbidden'): AppError {
    return new AppError(message, 403);
  }

  static notFound(message: string = 'Resource not found'): AppError {
    return new AppError(message, 404);
  }

  static conflict(message: string, details?: Record<string, unknown>): AppError {
    return new AppError(message, 409, { details });
  }

  static internal(message: string = 'Internal server error'): AppError {
    return new AppError(message, 500, { isOperational: false });
  }
}