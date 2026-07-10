import { MockAuthService } from './MockAuthService';
import type { AuthService } from './AuthService';

/**
 * Active AuthService implementation.
 *
 * To switch to a real API:
 *   1. Create `RestAuthService` implementing `AuthService`
 *   2. Change this export to `RestAuthService`
 *   → No UI components need to change.
 */
export const authService: AuthService = new MockAuthService();