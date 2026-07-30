import { z } from 'zod';

export const triggerSosSchema = z.object({
  rideId: z.string().uuid().optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});
