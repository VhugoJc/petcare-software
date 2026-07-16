import type { AuthService } from './AuthService';
import type { LoginCredentials, User, AuthTokens } from '../types';
import { API_ENDPOINTS } from '../../../config/api';

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

class RestAuthServiceError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = 'RestAuthServiceError';
    this.status = status;
  }
}

function getAuthHeaders(): Record<string, string> {
  return { 'Content-Type': 'application/json' };
}

function getBearerHeaders(token: string): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,
  };
}

async function handleResponse<T>(response: Response): Promise<T> {
  const body = await response.json();
  if (!response.ok) {
    throw new RestAuthServiceError(
      body.error?.message || 'An unexpected error occurred',
      response.status,
    );
  }
  return body as T;
}

/* ------------------------------------------------------------------ */
/*  RestAuthService                                                    */
/* ------------------------------------------------------------------ */

export class RestAuthService implements AuthService {
  async login(
    credentials: LoginCredentials,
  ): Promise<{ user: User; tokens: AuthTokens }> {
    const response = await fetch(`${API_ENDPOINTS.auth.login}`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(credentials),
    });

    const body = await response.json();

    if (!response.ok) {
      throw new RestAuthServiceError(
        body.error?.message || 'Invalid email or password',
        response.status,
      );
    }

    const { user, token } = body.data;

    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      tokens: {
        accessToken: token,
        refreshToken: token, // Backend returns a single JWT; use as refresh for now
      },
    };
  }

  async logout(): Promise<void> {
    // No server-side token invalidation in v1 — client-side only
    return;
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    // Backend doesn't have a refresh endpoint yet — return the same token
    return { accessToken: token, refreshToken: token };
  }

  async getCurrentUser(): Promise<User | null> {
    // auth endpoints aren't mounted yet — will be handled by session restore
    return null;
  }
}

export { RestAuthServiceError };