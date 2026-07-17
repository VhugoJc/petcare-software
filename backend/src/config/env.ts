import dotenv from 'dotenv';
import { z, ZodError } from 'zod';
import path from 'path';
import fs from 'fs';

// Load .env files if they exist — backend/.env takes priority over root .env.
// In Docker, environment variables are provided by docker-compose, so these
// calls are no-ops when the files don't exist (e.g. in CI or production).
const backendEnv = path.resolve(__dirname, '../.env');
const rootEnv = path.resolve(__dirname, '../../.env');

if (fs.existsSync(backendEnv)) {
  dotenv.config({ path: backendEnv, override: false });
}
if (fs.existsSync(rootEnv)) {
  dotenv.config({ path: rootEnv, override: false });
}

const envSchema = z.object({
  // Node environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),

  // Server
  PORT: z.coerce.number().positive().max(65535).default(5000),
  HOST: z.string().default('0.0.0.0'),

  // MongoDB
  MONGO_URI: z.string().url().default('mongodb://petcare-mongo:27017/petcare'),
  MONGO_USERNAME: z.string().optional(),
  MONGO_PASSWORD: z.string().optional(),
  MONGO_DATABASE: z.string().default('petcare'),

  // Logging
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('debug'),

  // CORS
  CORS_ORIGIN: z.string().default('http://localhost:5173'),

  // Rate limiting
  RATE_LIMIT_WINDOW_MS: z.coerce.number().positive().default(15 * 60 * 1000), // 15 min
  RATE_LIMIT_MAX: z.coerce.number().positive().default(100),

  // JWT
  JWT_SECRET: z.string().min(16, 'JWT_SECRET must be at least 16 characters'),
  JWT_EXPIRES_IN: z.string().default('24h'),
});

type EnvConfig = z.infer<typeof envSchema>;

let config: EnvConfig;

export function loadConfig(): EnvConfig {
  try {
    config = envSchema.parse(process.env);
    return config;
  } catch (error) {
    if (error instanceof ZodError) {
      const issues = error.issues
        .map((issue) => `  - ${issue.path.join('.')}: ${issue.message}`)
        .join('\n');
      console.error('❌ Invalid environment variables:\n' + issues);
      process.exit(1);
    }
    throw error;
  }
}

export function getConfig(): EnvConfig {
  if (!config) {
    return loadConfig();
  }
  return config;
}

export type { EnvConfig };