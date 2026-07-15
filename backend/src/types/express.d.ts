/**
 * Express Request augmentation.
 *
 * The `user` property is populated by the authentication middleware
 * (to be implemented in a future sprint).
 */

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

export {};