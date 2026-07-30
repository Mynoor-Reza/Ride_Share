import { Request, Response, NextFunction } from 'express';
import * as ratingService from '../services/ratingService';
import { sendSuccess } from '../utils/apiResponse';

export async function createRating(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ratingService.createRating(req.user!.userId, req.body);
    sendSuccess(res, result, 'Rating submitted', 201);
  } catch (err) {
    next(err);
  }
}

export async function getUserRatings(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ratingService.getUserRatings(req.params.userId as string);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function reportUser(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await ratingService.reportUser(req.user!.userId, req.body);
    sendSuccess(res, result, 'User reported');
  } catch (err) {
    next(err);
  }
}
