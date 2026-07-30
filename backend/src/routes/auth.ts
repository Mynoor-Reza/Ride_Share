import { Router } from 'express';
import * as authController from '../controllers/authController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { otpLimiter } from '../middleware/rateLimiter';
import {
  sendOtpSchema,
  verifyOtpSchema,
  registerSchema,
  loginSchema,
  refreshTokenSchema,
  approveNidSchema,
} from '../validators/auth';

const router = Router();

router.post('/send-otp', otpLimiter, validate(sendOtpSchema), authController.sendOtp);
router.post('/verify-otp', validate(verifyOtpSchema), authController.verifyOtp);
router.post('/register', validate(registerSchema), authController.register);
router.post('/login', validate(loginSchema), authController.login);
router.post('/refresh', validate(refreshTokenSchema), authController.refresh);
router.post(
  '/admin/approve-nid',
  authenticate,
  authorize('ADMIN', 'SUPER_ADMIN'),
  validate(approveNidSchema),
  authController.approveNid
);

export default router;
