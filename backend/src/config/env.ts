import dotenv from 'dotenv';
dotenv.config();

function env(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) throw new Error(`Missing env var: ${key}`);
  return value;
}

export const config = {
  port: parseInt(env('PORT', '3000')),
  nodeEnv: env('NODE_ENV', 'development'),
  database: { url: env('DATABASE_URL') },
  redis: { url: env('REDIS_URL', 'redis://localhost:6379') },
  jwt: {
    accessSecret: env('JWT_ACCESS_SECRET'),
    refreshSecret: env('JWT_REFRESH_SECRET'),
    accessExpiresIn: env('JWT_ACCESS_EXPIRES_IN', '15m'),
    refreshExpiresIn: env('JWT_REFRESH_EXPIRES_IN', '7d'),
  },
  cloudinary: {
    cloudName: env('CLOUDINARY_CLOUD_NAME'),
    apiKey: env('CLOUDINARY_API_KEY'),
    apiSecret: env('CLOUDINARY_API_SECRET'),
  },
} as const;
