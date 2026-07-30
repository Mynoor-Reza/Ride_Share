import { Router } from 'express';
import * as rideController from '../controllers/rideController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { requestRideSchema, acceptRideSchema } from '../validators/ride';

const router = Router();

router.use(authenticate);

router.post('/request', validate(requestRideSchema), rideController.requestRide);
router.get('/my', rideController.getMyRides);
router.get('/available', authorize('DRIVER'), rideController.getAvailableRides);

router.post('/:id/accept', authorize('DRIVER'), validate(acceptRideSchema), rideController.acceptRide);
router.post('/:id/start', authorize('DRIVER'), rideController.startRide);
router.post('/:id/complete', authorize('DRIVER'), rideController.completeRide);

export default router;
