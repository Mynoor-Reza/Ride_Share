import { Response } from 'express';

interface Pagination {
  cursor: string | null;
  hasMore: boolean;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  statusCode = 200,
  pagination?: Pagination
) {
  const body: Record<string, unknown> = { success: true, data };
  if (message) body.message = message;
  if (pagination) body.pagination = pagination;
  return res.status(statusCode).json(body);
}

export function sendError(
  res: Response,
  statusCode: number,
  message: string,
  code?: string,
  details?: unknown
) {
  return res.status(statusCode).json({
    success: false,
    error: { code: code || 'ERROR', message, details },
  });
}
