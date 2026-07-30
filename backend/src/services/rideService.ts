import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';
import { emitRideRequest, emitRideAccepted, emitRideStarted, emitRideCompleted } from './socketEmitter';
import { sendToUser } from './notificationService';

type BookingType = 'WHOLE_CAR' | 'SEAT';

export async function requestRide(
  passengerId: string,
  data: {
    pickupLat: number;
    pickupLng: number;
    pickupAddress: string;
    dropoffLat: number;
    dropoffLng: number;
    dropoffAddress: string;
    bookingType: BookingType;
    seatsBooked?: number;
    femaleOnly?: boolean;
  }
) {
  const user = await prisma.user.findUnique({ where: { id: passengerId } });
  if (!user || user.verificationStatus !== 'APPROVED') {
    throw AppError.forbidden('Only verified users can request rides');
  }

  const seats = data.bookingType === 'WHOLE_CAR' ? 1 : (data.seatsBooked ?? 1);

  const ride = await prisma.ride.create({
    data: {
      driverId: '',
      pickupLat: data.pickupLat,
      pickupLng: data.pickupLng,
      pickupAddress: data.pickupAddress,
      dropoffLat: data.dropoffLat,
      dropoffLng: data.dropoffLng,
      dropoffAddress: data.dropoffAddress,
      totalSeats: 0,
      availableSeats: 0,
      femaleOnly: data.femaleOnly ?? false,
      status: 'REQUESTED',
    },
  });

  // Create a pending booking
  await prisma.booking.create({
    data: {
      rideId: ride.id,
      passengerId,
      seatsBooked: seats,
      bookingType: data.bookingType,
      status: 'PENDING',
    },
  });

  emitRideRequest(ride);
  return ride;
}

export async function acceptRide(rideId: string, driverId: string, vehicleId: string) {
  const ride = await prisma.ride.findUnique({
    where: { id: rideId },
    include: { bookings: true },
  });
  if (!ride) throw AppError.notFound('Ride not found');
  if (ride.status !== 'REQUESTED') throw AppError.badRequest('Ride is not available');

  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle || vehicle.driverId !== driverId) {
    throw AppError.forbidden('Invalid vehicle');
  }

  const booking = ride.bookings[0];
  if (!booking) throw AppError.internal('No booking found for this ride');

  const seatsNeeded = booking.bookingType === 'WHOLE_CAR' ? vehicle.totalSeats : booking.seatsBooked;
  if (seatsNeeded > vehicle.totalSeats) {
    throw AppError.badRequest('Vehicle does not have enough seats');
  }

  const pricePerSeat = 0; // TODO: calculate based on distance
  const priceFullRide = 0;

  await prisma.$transaction([
    prisma.ride.update({
      where: { id: rideId },
      data: {
        driverId,
        totalSeats: vehicle.totalSeats,
        availableSeats: vehicle.totalSeats - (booking.bookingType === 'WHOLE_CAR' ? vehicle.totalSeats : booking.seatsBooked),
        pricePerSeat,
        priceFullRide,
        status: 'ACCEPTED',
      },
    }),
    prisma.booking.update({
      where: { id: booking.id },
      data: { status: 'CONFIRMED' },
    }),
  ]);

  const updated = await prisma.ride.findUnique({
    where: { id: rideId },
    include: { driver: true, bookings: { include: { passenger: true } } },
  });

  if (updated) {
    emitRideAccepted(updated);
    const passengerId = updated.bookings?.[0]?.passengerId;
    if (passengerId) {
      sendToUser(passengerId, {
        title: 'Ride Accepted',
        body: `Driver ${updated.driver?.name ?? ''} accepted your ride`,
        data: { rideId: updated.id, type: 'ride_accepted' },
      });
    }
  }
  return updated;
}

export async function startRide(rideId: string, driverId: string) {
  const ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride) throw AppError.notFound('Ride not found');
  if (ride.driverId !== driverId) throw AppError.forbidden('Not your ride');
  if (ride.status !== 'ACCEPTED') throw AppError.badRequest('Ride must be accepted first');

  const updated = await prisma.ride.update({
    where: { id: rideId },
    data: { status: 'STARTED' },
  });

  emitRideStarted(rideId, driverId);

  const booking = await prisma.booking.findFirst({
    where: { rideId, status: 'CONFIRMED' },
    select: { passengerId: true },
  });
  if (booking) {
    sendToUser(booking.passengerId, {
      title: 'Ride Started',
      body: 'Your ride has started. Track your driver in real-time.',
      data: { rideId, type: 'ride_started' },
    });
  }

  return updated;
}

export async function completeRide(rideId: string, driverId: string) {
  const ride = await prisma.ride.findUnique({ where: { id: rideId } });
  if (!ride) throw AppError.notFound('Ride not found');
  if (ride.driverId !== driverId) throw AppError.forbidden('Not your ride');
  if (ride.status !== 'STARTED') throw AppError.badRequest('Ride must be started first');

  const updated = await prisma.ride.update({
    where: { id: rideId },
    data: { status: 'COMPLETED' },
  });

  emitRideCompleted(rideId, driverId);

  const booking = await prisma.booking.findFirst({
    where: { rideId, status: 'CONFIRMED' },
    select: { passengerId: true },
  });
  if (booking) {
    sendToUser(booking.passengerId, {
      title: 'Ride Completed',
      body: 'Your ride has been completed. Please rate your driver.',
      data: { rideId, type: 'ride_completed' },
    });
  }

  return updated;
}

export async function getMyRides(userId: string, role: string) {
  if (role === 'DRIVER') {
    return prisma.ride.findMany({
      where: { driverId: userId },
      include: { bookings: { include: { passenger: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }
  return prisma.ride.findMany({
    where: { bookings: { some: { passengerId: userId } } },
    include: { driver: true, bookings: { where: { passengerId: userId } } },
    orderBy: { createdAt: 'desc' },
  });
}

export async function getAvailableRides(driverId?: string) {
  const where: any = { status: 'REQUESTED' };

  if (driverId) {
    const driver = await prisma.user.findUnique({ where: { id: driverId } });
    if (driver && !driver.isFemale) {
      where.femaleOnly = false;
    }
  }

  return prisma.ride.findMany({
    where,
    include: { bookings: { include: { passenger: true } } },
    orderBy: { createdAt: 'desc' },
  });
}
