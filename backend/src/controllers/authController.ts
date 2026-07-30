import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { sendSuccess } from '../utils/apiResponse';

export async function sendOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.sendOtp(req.body.phone);
    sendSuccess(res, result, 'OTP sent');
  } catch (err) {
    next(err);
  }
}

export async function verifyOtp(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.verifyOtp(req.body.phone, req.body.otp);
    sendSuccess(res, result, 'OTP verified');
  } catch (err) {
    next(err);
  }
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.register(req.body);
    sendSuccess(res, result, 'Registration submitted', 201);
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.login(req.body.phone, req.body.password);
    sendSuccess(res, result, 'Login successful');
  } catch (err) {
    next(err);
  }
}

export async function refresh(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.refreshTokens(req.body.refreshToken);
    sendSuccess(res, result, 'Tokens refreshed');
  } catch (err) {
    next(err);
  }
}

export async function approveNid(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await authService.approveNid(req.body.userId, req.body.action);
    sendSuccess(res, result, 'NID status updated');
  } catch (err) {
    next(err);
  }
}
