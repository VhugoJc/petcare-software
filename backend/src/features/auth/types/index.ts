import type { Document } from 'mongoose';

export type UserRole = 'admin' | 'veterinarian' | 'receptionist';

export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserDocument extends IUser, Document {
  comparePassword(candidate: string): Promise<boolean>;
}

export interface RegisterInput {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: UserRole;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthTokenPayload {
  sub: string;
  email: string;
  role: UserRole;
  name: string;
}

export interface AuthResponse {
  user: {
    id: string;
    email: string;
    name: string;
    role: UserRole;
  };
  token: string;
}