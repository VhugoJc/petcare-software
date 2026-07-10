import type { User, AuthTokens } from '../types';

const KEYS = {
  ACCESS_TOKEN: 'petcare_access_token',
  REFRESH_TOKEN: 'petcare_refresh_token',
  USER: 'petcare_user',
} as const;

export const tokenStorage = {
  getAccessToken(): string | null {
    return localStorage.getItem(KEYS.ACCESS_TOKEN);
  },

  setAccessToken(token: string): void {
    localStorage.setItem(KEYS.ACCESS_TOKEN, token);
  },

  getRefreshToken(): string | null {
    return localStorage.getItem(KEYS.REFRESH_TOKEN);
  },

  setRefreshToken(token: string): void {
    localStorage.setItem(KEYS.REFRESH_TOKEN, token);
  },

  getUser(): User | null {
    const raw = localStorage.getItem(KEYS.USER);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as User;
    } catch {
      return null;
    }
  },

  setUser(user: User): void {
    localStorage.setItem(KEYS.USER, JSON.stringify(user));
  },

  setTokens(tokens: AuthTokens): void {
    localStorage.setItem(KEYS.ACCESS_TOKEN, tokens.accessToken);
    localStorage.setItem(KEYS.REFRESH_TOKEN, tokens.refreshToken);
  },

  clear(): void {
    localStorage.removeItem(KEYS.ACCESS_TOKEN);
    localStorage.removeItem(KEYS.REFRESH_TOKEN);
    localStorage.removeItem(KEYS.USER);
  },
};