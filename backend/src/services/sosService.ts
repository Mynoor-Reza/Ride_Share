import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { getIO } from '../config/socket';

export async function triggerSos(
  userId: string,
  data: { rideId?: string; lat?: number; lng?: number }
) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');

  let location = { lat: data.lat, lng: data.lng };

  if (!location.lat || !location.lng) {
    if (data.rideId) {
      const ride = await prisma.ride.findUnique({ where: { id: data.rideId } });
      if (ride) {
        location = { lat: ride.pickupLat, lng: ride.pickupLng };
      }
    }
  }

  const log = await prisma.emergencyLog.create({
    data: {
      userId,
      rideId: data.rideId ?? null,
      lat: location.lat ?? null,
      lng: location.lng ?? null,
      status: 'ACTIVE',
    },
  });

  // Notify admin room
  getIO().emit('sos-alert', {
    emergencyId: log.id,
    userId,
    userName: user.name,
    phone: user.phone,
    rideId: data.rideId,
    lat: location.lat,
    lng: location.lng,
    timestamp: log.createdAt,
  });

  // TODO: Send SMS to emergency contacts + police
  return log;
}

export async function cancelSos(emergencyId: string, userId: string) {
  const log = await prisma.emergencyLog.findUnique({ where: { id: emergencyId } });
  if (!log) throw AppError.notFound('SOS record not found');
  if (log.userId !== userId) throw AppError.forbidden('Not your SOS');

  const updated = await prisma.emergencyLog.update({
    where: { id: emergencyId },
    data: { status: 'RESOLVED', resolvedAt: new Date() },
  });

  getIO().emit('sos-resolved', { emergencyId, userId });
  return updated;
}

export async function getActiveSos(userId: string) {
  return prisma.emergencyLog.findMany({
    where: { userId, status: 'ACTIVE' },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAllActiveSos() {
  return prisma.emergencyLog.findMany({
    where: { status: 'ACTIVE' },
    include: { user: { select: { id: true, name: true, phone: true } } },
    orderBy: { createdAt: 'desc' },
  });
}
