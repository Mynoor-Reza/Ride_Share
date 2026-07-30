import { Request, Response, NextFunction } from 'express';
import * as rideService from '../services/rideService';
import { sendSuccess } from '../utils/apiResponse';

export async function requestRide(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await rideService.requestRide(req.user!.userId, req.body);
    sendSuccess(res, result, 'Ride requested', 201);
  } catch (err) {
    next(err);
  }
}

export async function acceptRide(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await rideService.acceptRide(
      req.params.id as string,
      req.user!.userId,
      req.body.vehicleId
    );
    sendSuccess(res, result, 'Ride accepted');
  } catch (err) {
    next(err);
  }
}

export async function startRide(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await rideService.startRide(req.params.id as string, req.user!.userId);
    sendSuccess(res, result, 'Ride started');
  } catch (err) {
    next(err);
  }
}

export async function completeRide(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await rideService.completeRide(req.params.id as string, req.user!.userId);
    sendSuccess(res, result, 'Ride completed');
  } catch (err) {
    next(err);
  }
}

export async function getMyRides(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await rideService.getMyRides(req.user!.userId, req.user!.role);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getAvailableRides(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await rideService.getAvailableRides(req.user!.userId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
