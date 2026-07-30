import { Request, Response, NextFunction } from 'express';
import * as vehicleService from '../services/vehicleService';
import { sendSuccess } from '../utils/apiResponse';

export async function createVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await vehicleService.createVehicle(req.user!.userId, req.body);
    sendSuccess(res, result, 'Vehicle registered', 201);
  } catch (err) {
    next(err);
  }
}

export async function getMyVehicles(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await vehicleService.getMyVehicles(req.user!.userId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getVehicleById(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await vehicleService.getVehicleById(req.params.id as string, req.user!.userId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function updateVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await vehicleService.updateVehicle(req.params.id as string, req.user!.userId, req.body);
    sendSuccess(res, result, 'Vehicle updated');
  } catch (err) {
    next(err);
  }
}

export async function deleteVehicle(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await vehicleService.deleteVehicle(req.params.id as string, req.user!.userId);
    sendSuccess(res, result, 'Vehicle deleted');
  } catch (err) {
    next(err);
  }
}
