import { Router } from 'express';
import * as sosController from '../controllers/sosController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { triggerSosSchema } from '../validators/sos';

const router = Router();

router.get('/all', sosController.getAllActiveSos);

router.use(authenticate);

router.post('/trigger', validate(triggerSosSchema), sosController.triggerSos);
router.post('/:id/cancel', sosController.cancelSos);
router.get('/my', sosController.getActiveSos);

export default router;
