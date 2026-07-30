import { z } from 'zod';

export const requestRideSchema = z.object({
  pickupLat: z.number().min(-90).max(90),
  pickupLng: z.number().min(-180).max(180),
  pickupAddress: z.string().min(1).max(500),
  dropoffLat: z.number().min(-90).max(90),
  dropoffLng: z.number().min(-180).max(180),
  dropoffAddress: z.string().min(1).max(500),
  bookingType: z.enum(['WHOLE_CAR', 'SEAT']),
  seatsBooked: z.number().int().min(1).max(50).optional(),
  femaleOnly: z.boolean().optional(),
});

export const acceptRideSchema = z.object({
  vehicleId: z.string().uuid(),
});
