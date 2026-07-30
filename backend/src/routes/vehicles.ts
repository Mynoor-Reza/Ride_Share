import { Router } from 'express';
import * as vehicleController from '../controllers/vehicleController';
import { validate } from '../middleware/validate';
import { authenticate, authorize } from '../middleware/auth';
import { createVehicleSchema, updateVehicleSchema } from '../validators/vehicle';

const router = Router();

router.use(authenticate);
router.use(authorize('DRIVER', 'ADMIN', 'SUPER_ADMIN'));

router.post('/', validate(createVehicleSchema), vehicleController.createVehicle);
router.get('/', vehicleController.getMyVehicles);
router.get('/:id', vehicleController.getVehicleById);
router.put('/:id', validate(updateVehicleSchema), vehicleController.updateVehicle);
router.delete('/:id', vehicleController.deleteVehicle);

export default router;
