import { config } from './env';
import { logger } from './logger';

const store = new Map<string, { value: string; expiresAt: number }>();

const redis = {
  ping: async () => 'PONG' as const,
  setex: async (key: string, ttl: number, value: string) => {
    store.set(key, { value, expiresAt: Date.now() + ttl * 1000 });
    return 'OK' as const;
  },
  get: async (key: string) => {
    const entry = store.get(key);
    if (!entry) return null;
    if (Date.now() > entry.expiresAt) {
      store.delete(key);
      return null;
    }
    return entry.value;
  },
  del: async (key: string) => {
    return store.delete(key) ? 1 : 0;
  },
};

logger.info('Using in-memory store (Redis not configured for local dev)');

export { redis };
