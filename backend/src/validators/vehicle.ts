import { z } from 'zod';

export const createVehicleSchema = z.object({
  model: z.string().min(1).max(100),
  number: z.string().min(1).max(20),
  color: z.string().max(50).optional(),
  totalSeats: z.number().int().min(1).max(50).default(4),
});

export const updateVehicleSchema = z.object({
  model: z.string().min(1).max(100).optional(),
  number: z.string().min(1).max(20).optional(),
  color: z.string().max(50).optional(),
  totalSeats: z.number().int().min(1).max(50).optional(),
});
