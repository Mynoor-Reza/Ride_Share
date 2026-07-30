import { getIO } from '../config/socket';

export function emitRideRequest(ride: any) {
  getIO().emit('ride-request', ride);
}

export function emitRideAccepted(ride: any) {
  const booking = ride.bookings?.[0];
  if (booking) {
    getIO().to(`user:${booking.passengerId}`).emit('ride-accepted', ride);
  }
}

export function emitRideStarted(rideId: string, driverId: string) {
  getIO().to(`ride:${rideId}`).emit('ride-started', { rideId });
}

export function emitRideCompleted(rideId: string, driverId: string) {
  getIO().to(`ride:${rideId}`).emit('ride-completed', { rideId });
}

export function emitNewMessage(rideId: string, userId: string, message: string) {
  getIO().to(`ride:${rideId}`).emit('chat-message', {
    userId,
    message,
    timestamp: new Date().toISOString(),
  });
}
