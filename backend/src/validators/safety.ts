import { z } from 'zod';

export const shareRideSchema = z.object({
  rideId: z.string().uuid(),
});
