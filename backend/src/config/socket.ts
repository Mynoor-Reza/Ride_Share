import { Server as SocketServer } from 'socket.io';
import jwt from 'jsonwebtoken';
import { config } from './env';
import type { JwtPayload } from '../middleware/auth';

let io: SocketServer;

export function initSocket(server: import('http').Server) {
  io = new SocketServer(server, {
    cors: { origin: '*', credentials: true },
  });

  io.use((socket, next) => {
    const token = socket.handshake.auth.token || socket.handshake.query.token;
    if (!token) return next(new Error('Authentication required'));

    try {
      const decoded = jwt.verify(token as string, config.jwt.accessSecret) as JwtPayload;
      (socket as any).user = decoded;
      next();
    } catch {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    const user = (socket as any).user as JwtPayload;
    socket.join(`user:${user.userId}`);

    socket.on('join-ride', (rideId: string) => {
      socket.join(`ride:${rideId}`);
    });

    socket.on('leave-ride', (rideId: string) => {
      socket.leave(`ride:${rideId}`);
    });

    socket.on('location-update', (data: { rideId: string; lat: number; lng: number }) => {
      socket.to(`ride:${data.rideId}`).emit('passenger-location', {
        userId: user.userId,
        lat: data.lat,
        lng: data.lng,
      });
    });

    socket.on('driver-location', (data: { rideId: string; lat: number; lng: number }) => {
      socket.to(`ride:${data.rideId}`).emit('driver-location', {
        userId: user.userId,
        lat: data.lat,
        lng: data.lng,
      });
    });

    socket.on('chat-message', (data: { rideId: string; message: string }) => {
      io.to(`ride:${data.rideId}`).emit('chat-message', {
        userId: user.userId,
        message: data.message,
        timestamp: new Date().toISOString(),
      });
    });

    socket.on('typing', (data: { rideId: string; isTyping: boolean }) => {
      socket.to(`ride:${data.rideId}`).emit('typing', {
        userId: user.userId,
        isTyping: data.isTyping,
      });
    });

    socket.on('disconnect', () => {});
  });

  return io;
}

export function getIO() {
  if (!io) throw new Error('Socket.io not initialized');
  return io;
}
