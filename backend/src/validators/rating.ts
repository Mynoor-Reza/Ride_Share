import { z } from 'zod';

export const createRatingSchema = z.object({
  rideId: z.string().uuid().optional(),
  toId: z.string().uuid(),
  score: z.number().int().min(1).max(5),
  comment: z.string().max(500).optional(),
});

export const reportUserSchema = z.object({
  userId: z.string().uuid(),
  reason: z.string().min(1).max(500),
});
