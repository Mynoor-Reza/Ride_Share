import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export async function shareRide(userId: string, rideId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');

  const contacts = user.emergencyContacts as { name: string; phone: string }[] | null;
  if (!contacts || contacts.length === 0) {
    throw AppError.badRequest('No emergency contacts saved. Add contacts in your profile.');
  }

  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    include: {
      driver: { select: { name: true, phone: true } },
      bookings: { where: { passengerId: userId } },
    },
  });
  if (!ride) throw AppError.notFound('Ride not found');

  const shareInfo = {
    rideId: ride.id,
    pickup: ride.pickupAddress,
    dropoff: ride.dropoffAddress,
    driver: ride.driver ? { name: ride.driver.name, phone: ride.driver.phone } : null,
    status: ride.status,
    contacts,
  };

  // TODO: Send SMS to each emergency contact with ride details + live tracking link

  return {
    message: 'Ride shared with emergency contacts',
    sharedWith: contacts,
    ride: shareInfo,
  };
}

export async function autoSosTrigger(userId: string, rideId: string) {
  const ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride) throw AppError.notFound('Ride not found');

  const log = await prisma.emergencyLog.create({
    data: {
      userId,
      rideId,
      lat: ride.pickupLat,
      lng: ride.pickupLng,
      status: 'ACTIVE',
    },
  });

  const { getIO } = await import('../config/socket');
  getIO().emit('sos-alert', {
    emergencyId: log.id,
    userId,
    rideId,
    type: 'AUTO_SOS',
    lat: ride.pickupLat,
    lng: ride.pickupLng,
    timestamp: log.createdAt,
  });

  return log;
}

export async function updateEmergencyContacts(
  userId: string,
  contacts: { name: string; phone: string }[]
) {
  if (contacts.length === 0) {
    throw AppError.badRequest('At least one emergency contact required');
  }

  const user = await prisma.user.update({
    where: { id: userId },
    data: { emergencyContacts: contacts },
    select: { id: true, emergencyContacts: true },
  });

  return user;
}
