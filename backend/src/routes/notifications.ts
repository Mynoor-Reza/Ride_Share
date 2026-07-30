import { Router } from 'express';
import * as notificationController from '../controllers/notificationController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { z } from 'zod';

const router = Router();

router.use(authenticate);

router.post('/register', validate(z.object({ token: z.string().min(1) })), notificationController.registerToken);
router.post('/unregister', validate(z.object({ token: z.string().min(1) })), notificationController.unregisterToken);
router.get('/', notificationController.getNotifications);
router.post('/:id/read', notificationController.markAsRead);
router.post('/read-all', notificationController.markAllAsRead);

export default router;
