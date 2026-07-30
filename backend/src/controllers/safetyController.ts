import { Request, Response, NextFunction } from 'express';
import * as safetyService from '../services/safetyService';
import { sendSuccess } from '../utils/apiResponse';

export async function shareRide(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await safetyService.shareRide(req.user!.userId, req.body.rideId);
    sendSuccess(res, result, 'Ride shared');
  } catch (err) {
    next(err);
  }
}

export async function autoSosTrigger(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await safetyService.autoSosTrigger(req.user!.userId, req.params.rideId as string);
    sendSuccess(res, result, 'Auto SOS triggered', 201);
  } catch (err) {
    next(err);
  }
}

export async function updateEmergencyContacts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await safetyService.updateEmergencyContacts(req.user!.userId, req.body.contacts);
    sendSuccess(res, result, 'Emergency contacts updated');
  } catch (err) {
    next(err);
  }
}
