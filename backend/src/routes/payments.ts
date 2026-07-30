import { Router } from 'express';
import * as paymentController from '../controllers/paymentController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { initiatePaymentSchema } from '../validators/payment';

const router = Router();

router.use(authenticate);

router.post('/initiate', validate(initiatePaymentSchema), paymentController.initiatePayment);
router.get('/booking/:bookingId', paymentController.getPaymentByBooking);

export default router;
