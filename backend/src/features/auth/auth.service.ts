import jwt from 'jsonwebtoken';
import { getConfig } from '../../config/env';
import { AppError } from '../../errors/AppError';
import { User } from './auth.model';
import type {
  IUserDocument,
  AuthResponse,
  AuthTokenPayload,
} from './types/index';
import type { RegisterInput, LoginInput } from './auth.validation';

// ---------- Helpers ----------

function toAuthResponse(user: IUserDocument): AuthResponse {
  const config = getConfig();
  const payload: AuthTokenPayload = {
    sub: user._id.toString(),
    email: user.email,
    role: user.role,
    name: `${user.firstName} ${user.lastName}`,
  };

  const token = jwt.sign(
    payload,
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRES_IN } as jwt.SignOptions
  );

  return {
    user: {
      id: user._id.toString(),
      email: user.email,
      name: `${user.firstName} ${user.lastName}`,
      role: user.role,
    },
    token,
  };
}

// ---------- Service functions ----------

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  // Check if email already exists
  const existing = await User.findOne({ email: input.email });
  if (existing) {
    throw AppError.conflict('A user with this email already exists');
  }

  const user = await User.create(input);
  return toAuthResponse(user);
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  // Find user by email, explicitly include password
  const user = await User.findOne({ email: input.email }).select('+password');
  if (!user) {
    throw AppError.unauthorized('Invalid email or password');
  }

  // Check if user is active
  if (!user.isActive) {
    throw AppError.unauthorized('Account is deactivated');
  }

  // Compare password
  const isMatch = await user.comparePassword(input.password);
  if (!isMatch) {
    throw AppError.unauthorized('Invalid email or password');
  }

  return toAuthResponse(user);
}

export async function getCurrentUser(userId: string): Promise<AuthResponse['user']> {
  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }

  if (!user.isActive) {
    throw AppError.unauthorized('Account is deactivated');
  }

  return {
    id: user._id.toString(),
    email: user.email,
    name: `${user.firstName} ${user.lastName}`,
    role: user.role,
  };
}

export async function seedAdminUser(): Promise<void> {
  const config = getConfig();

  // Only seed in development
  if (config.NODE_ENV !== 'development') {
    return;
  }

  const adminEmail = 'admin@petcare.com';
  const existing = await User.findOne({ email: adminEmail });
  if (existing) {
    return;
  }

  await User.create({
    firstName: 'Admin',
    lastName: 'PetCare',
    email: adminEmail,
    password: 'admin123',
    role: 'admin',
  });

  const logger = (await import('../../config/logger')).getLogger();
  logger.info('Seeded default admin user', { email: adminEmail });
}