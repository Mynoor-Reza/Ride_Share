import { Router } from 'express';
import * as ratingController from '../controllers/ratingController';
import { validate } from '../middleware/validate';
import { authenticate } from '../middleware/auth';
import { createRatingSchema, reportUserSchema } from '../validators/rating';

const router = Router();

router.use(authenticate);

router.post('/', validate(createRatingSchema), ratingController.createRating);
router.get('/user/:userId', ratingController.getUserRatings);
router.post('/report', validate(reportUserSchema), ratingController.reportUser);

export default router;
