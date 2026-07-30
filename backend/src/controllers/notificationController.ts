import { Request, Response, NextFunction } from 'express';
import * as notificationService from '../services/notificationService';
import { sendSuccess } from '../utils/apiResponse';

export async function registerToken(req: Request, res: Response, next: NextFunction) {
  try {
    notificationService.registerToken(req.user!.userId, req.body.token);
    sendSuccess(res, null, 'Device token registered');
  } catch (err) {
    next(err);
  }
}

export async function unregisterToken(req: Request, res: Response, next: NextFunction) {
  try {
    notificationService.unregisterToken(req.user!.userId, req.body.token);
    sendSuccess(res, null, 'Device token unregistered');
  } catch (err) {
    next(err);
  }
}

export async function getNotifications(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await notificationService.getNotifications(req.user!.userId, page, limit);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function markAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await notificationService.markAsRead(req.params.id as string, req.user!.userId);
    sendSuccess(res, result, 'Notification marked as read');
  } catch (err) {
    next(err);
  }
}

export async function markAllAsRead(req: Request, res: Response, next: NextFunction) {
  try {
    await notificationService.markAllAsRead(req.user!.userId);
    sendSuccess(res, null, 'All notifications marked as read');
  } catch (err) {
    next(err);
  }
}
