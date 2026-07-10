import type { LoginCredentials, User, AuthTokens } from '../types';

export interface AuthService {
  login(credentials: LoginCredentials): Promise<{ user: User; tokens: AuthTokens }>;
  logout(): Promise<void>;
  refreshToken(token: string): Promise<AuthTokens>;
  getCurrentUser(): Promise<User | null>;
}