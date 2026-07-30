import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export async function initiatePayment(
  passengerId: string,
  data: { bookingId: string; method: string; transactionId?: string }
) {
  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    include: { ride: true },
  });
  if (!booking) throw AppError.notFound('Booking not found');
  if (booking.passengerId !== passengerId) throw AppError.forbidden('Not your booking');
  if (booking.status !== 'CONFIRMED') throw AppError.badRequest('Booking is not confirmed');

  const existing = await prisma.payment.findUnique({ where: { bookingId: data.bookingId } });
  if (existing) throw AppError.conflict('Payment already initiated for this booking');

  const pricePerSeat = booking.ride.pricePerSeat ?? 0;
  const priceFullRide = booking.ride.priceFullRide ?? 0;
  const amount = booking.bookingType === 'WHOLE_CAR' ? priceFullRide : pricePerSeat * booking.seatsBooked;

  const payment = await prisma.payment.create({
    data: {
      bookingId: data.bookingId,
      amount,
      method: data.method as any,
      transactionId: data.transactionId ?? null,
      status: data.method === 'CASH' ? 'PENDING' : 'COMPLETED',
    },
  });

  if (data.method !== 'CASH') {
    await prisma.booking.update({
      where: { id: data.bookingId },
      data: { status: 'CONFIRMED' },
    });
  }

  return payment;
}

export async function getPaymentByBooking(bookingId: string, userId: string) {
  const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
  if (!booking) throw AppError.notFound('Booking not found');
  if (booking.passengerId !== userId) throw AppError.forbidden('Not your booking');

  return prisma.payment.findUnique({ where: { bookingId } });
}
