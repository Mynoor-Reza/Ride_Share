import { Request, Response, NextFunction } from 'express';
import * as paymentService from '../services/paymentService';
import { sendSuccess } from '../utils/apiResponse';

export async function initiatePayment(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentService.initiatePayment(req.user!.userId, req.body);
    sendSuccess(res, result, 'Payment initiated', 201);
  } catch (err) {
    next(err);
  }
}

export async function getPaymentByBooking(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await paymentService.getPaymentByBooking(req.params.bookingId as string, req.user!.userId);
    sendSuccess(res, result);
  } catch (err) {
    next(err);
  }
}
