import { Request, Response, NextFunction } from 'express';
import * as sosService from '../services/sosService';
import { sendSuccess } from '../utils/apiResponse';

export async function triggerSos(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await sosService.triggerSos(req.user!.userId, req.body);
    sendSuccess(res, result, 'SOS triggered', 201);
  } catch (err) {
    next(err);
  }
}

export async function cancelSos(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await sosService.cancelSos(req.params.id as string, req.user!.userId);
    sendSuccess(res, result, 'SOS cancelled');
  } catch (err) {
    next(err);
  }
}

export async function getActiveSos(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await sosService.getActiveSos(req.user!.userId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getAllActiveSos(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await sosService.getAllActiveSos();
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
