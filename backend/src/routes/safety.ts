import { Router } from 'express';
import * as safetyController from '../controllers/safetyController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { shareRideSchema } from '../validators/safety';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

router.post('/share-ride', validate(shareRideSchema), safetyController.shareRide);
router.post('/auto-sos/:rideId', safetyController.autoSosTrigger);

router.put(
  '/emergency-contacts',
  validate(
    z.object({
      contacts: z.array(z.object({ name: z.string(), phone: z.string() })).min(1),
    })
  ),
  safetyController.updateEmergencyContacts
);

export default router;
