import { z } from 'zod';

export const initiatePaymentSchema = z.object({
  bookingId: z.string().uuid(),
  method: z.enum(['BKASH', 'NAGAD', 'CASH']),
  transactionId: z.string().optional(),
});
