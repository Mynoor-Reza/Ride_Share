import { z } from 'zod';

export const updateUserRoleSchema = z.object({
  userId: z.string().uuid(),
  role: z.enum(['PASSENGER', 'DRIVER', 'ADMIN', 'SUPER_ADMIN']),
});
