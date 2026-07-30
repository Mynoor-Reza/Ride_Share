import { z } from 'zod';

export const sendOtpSchema = z.object({
  phone: z.string().regex(/^01[3-9]\d{8}$/, 'Invalid Bangladesh phone number'),
});

export const verifyOtpSchema = z.object({
  phone: z.string().regex(/^01[3-9]\d{8}$/),
  otp: z.string().length(6),
});

export const registerSchema = z.object({
  phone: z.string().regex(/^01[3-9]\d{8}$/),
  password: z.string().min(6).max(128),
  name: z.string().min(1).max(100),
  nidNumber: z.string().min(10).max(20),
  isFemale: z.boolean().optional(),
  emergencyContacts: z
    .array(z.object({ name: z.string(), phone: z.string() }))
    .optional(),
});

export const loginSchema = z.object({
  phone: z.string().regex(/^01[3-9]\d{8}$/),
  password: z.string().min(1),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string().min(1),
});

export const approveNidSchema = z.object({
  userId: z.string().uuid(),
  action: z.enum(['approve', 'reject']),
});
