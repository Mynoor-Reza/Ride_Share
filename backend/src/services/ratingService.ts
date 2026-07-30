import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export async function createRating(
  fromId: string,
  data: { rideId?: string; toId: string; score: number; comment?: string }
) {
  if (fromId === data.toId) throw AppError.badRequest('Cannot rate yourself');

  const target = await prisma.user.findUnique({ where: { id: data.toId } });
  if (!target) throw AppError.notFound('User not found');

  const rating = await prisma.rating.create({
    data: {
      rideId: data.rideId ?? null,
      fromId,
      toId: data.toId,
      score: data.score,
      comment: data.comment ?? null,
    },
  });

  return rating;
}

export async function getUserRatings(userId: string) {
  const ratings = await prisma.rating.findMany({
    where: { toId: userId },
    include: { from: { select: { id: true, name: true } } },
    orderBy: { createdAt: 'desc' },
  });

  const avg = ratings.length
    ? ratings.reduce((sum, r) => sum + r.score, 0) / ratings.length
    : 0;

  return { ratings, averageRating: Math.round(avg * 10) / 10, total: ratings.length };
}

export async function reportUser(reporterId: string, data: { userId: string; reason: string }) {
  if (reporterId === data.userId) throw AppError.badRequest('Cannot report yourself');

  const target = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!target) throw AppError.notFound('User not found');

  // Store report in emergency_logs as a REPORT type for now
  const report = await prisma.emergencyLog.create({
    data: {
      userId: data.userId,
      status: 'REPORT',
      lat: null,
      lng: null,
      rideId: null,
    },
  });

  return { message: 'User reported', reportId: report.id };
}
