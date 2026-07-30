import { Request, Response, NextFunction } from 'express';
import * as adminService from '../services/adminService';
import { sendSuccess } from '../utils/apiResponse';

export async function getUsers(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const filter = req.query.filter as string | undefined;
    const result = await adminService.getUsers(page, limit, filter);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getUserDetails(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.getUserDetails(req.params.id as string);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function updateUserRole(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.updateUserRole(req.user!.userId, req.body.userId, req.body.role);
    sendSuccess(res, result, 'User role updated');
  } catch (err) {
    next(err);
  }
}

export async function getAllRides(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const status = req.query.status as string | undefined;
    const result = await adminService.getAllRides(page, limit, status);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getReports(req: Request, res: Response, next: NextFunction) {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;
    const result = await adminService.getReports(page, limit);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}

export async function getDashboardStats(_req: Request, res: Response, next: NextFunction) {
  try {
    const result = await adminService.getDashboardStats();
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
