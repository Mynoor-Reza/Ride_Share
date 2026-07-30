import rateLimit from 'express-rate-limit';

export const otpLimiter = rateLimit({
  windowMs: 30 * 1000,
  max: 1,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests. Try again later.' } },
});

export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, error: { code: 'RATE_LIMIT', message: 'Too many requests. Try again later.' } },
});
