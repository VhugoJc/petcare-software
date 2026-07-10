import type { AuthService } from './AuthService';
import type { LoginCredentials, User, AuthTokens } from '../types';

/* ------------------------------------------------------------------ */
/*  Mock user database – will be replaced by REST API calls           */
/* ------------------------------------------------------------------ */
const MOCK_USERS: (User & { password: string })[] = [
  {
    id: '1',
    email: 'admin@petcare.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    id: '2',
    email: 'vet@petcare.com',
    password: 'vet123',
    name: 'Dr. Sarah Wilson',
    role: 'veterinarian',
  },
  {
    id: '3',
    email: 'reception@petcare.com',
    password: 'reception123',
    name: 'Emily Martinez',
    role: 'receptionist',
  },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

/** Simulates network latency */
const delay = (ms: number = 800) => new Promise((r) => setTimeout(r, ms));

/** Creates a mock JWT-shaped token (base64-encoded JSON payload) */
const createMockToken = (user: User): string => {
  const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = btoa(
    JSON.stringify({
      sub: user.id,
      email: user.email,
      role: user.role,
      name: user.name,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 3600, // 1 hour
    }),
  );
  return `${header}.${payload}.mock_signature`;
};

/** Creates a mock refresh token */
const createMockRefreshToken = (userId: string): string => {
  return btoa(JSON.stringify({ sub: userId, type: 'refresh', exp: Math.floor(Date.now() / 1000) + 86400 * 7 }));
};

/* ------------------------------------------------------------------ */
/*  MockAuthService                                                    */
/* ------------------------------------------------------------------ */

export class MockAuthService implements AuthService {
  async login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }> {
    await delay();

    const found = MOCK_USERS.find((u) => u.email === credentials.email);

    if (!found) {
      throw new Error('Invalid email or password');
    }

    // In production this would be bcrypt.compare()
    if (credentials.password !== found.password) {
      throw new Error('Invalid email or password');
    }

    const user: User = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
    };

    const tokens: AuthTokens = {
      accessToken: createMockToken(user),
      refreshToken: createMockRefreshToken(user.id),
    };

    return { user, tokens };
  }

  async logout(): Promise<void> {
    await delay(200);
    // In production: invalidate refresh token on server
  }

  async refreshToken(token: string): Promise<AuthTokens> {
    await delay(400);

    // In production: POST /auth/refresh with the refresh token
    // For mock: decode the token and issue new ones
    try {
      const payload = JSON.parse(atob(token));
      const user = MOCK_USERS.find((u) => u.id === payload.sub);

      if (!user) {
        throw new Error('Invalid refresh token');
      }

      const freshUser: User = {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      };

      return {
        accessToken: createMockToken(freshUser),
        refreshToken: createMockRefreshToken(user.id),
      };
    } catch {
      throw new Error('Invalid refresh token');
    }
  }

  async getCurrentUser(): Promise<User | null> {
    await delay(300);

    // In production: GET /auth/me with Authorization header
    // For mock: return a generic user to represent session is valid
    return null;
  }
}