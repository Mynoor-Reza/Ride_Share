import { Router } from 'express';
import * as adminController from '../controllers/adminController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { updateUserRoleSchema } from '../validators/admin';

const router = Router();

router.get('/dashboard', adminController.getDashboardStats);
router.get('/users', adminController.getUsers);
router.get('/users/:id', adminController.getUserDetails);
router.put('/users/role', authenticate, authorize('ADMIN', 'SUPER_ADMIN'), validate(updateUserRoleSchema), adminController.updateUserRole);
router.get('/rides', adminController.getAllRides);
router.get('/reports', adminController.getReports);

export default router;
