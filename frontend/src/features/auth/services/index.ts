import { RestAuthService } from './RestAuthService';
import type { AuthService } from './AuthService';

/**
 * Active AuthService implementation.
 *
 * Uses the real REST API backend.
 */
export const authService: AuthService = new RestAuthService();