import { prisma } from '../src/config/prisma';
import bcrypt from 'bcryptjs';

export async function cleanDb() {
  await prisma.notification.deleteMany();
  await prisma.rating.deleteMany();
  await prisma.emergencyLog.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.ride.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.user.deleteMany();
}

export async function createTestUser(overrides?: Partial<{
  phone: string;
  password: string;
  name: string;
  role: string;
  verificationStatus: string;
  isFemale: boolean;
}>) {
  const hashed = await bcrypt.hash(overrides?.password || 'password123', 6);
  return prisma.user.create({
    data: {
      phone: overrides?.phone || '01712345678',
      password: hashed,
      name: overrides?.name || 'Test User',
      role: (overrides?.role || 'PASSENGER') as any,
      verificationStatus: (overrides?.verificationStatus || 'APPROVED') as any,
      isFemale: overrides?.isFemale ?? false,
    },
  });
}

export async function createTestDriver(overrides?: Partial<{
  phone: string;
  name: string;
  isFemale: boolean;
}>) {
  return createTestUser({
    phone: overrides?.phone || '01798765432',
    name: overrides?.name || 'Test Driver',
    role: 'DRIVER',
    isFemale: overrides?.isFemale ?? false,
    ...overrides,
  });
}

export async function createTestVehicle(driverId: string) {
  return prisma.vehicle.create({
    data: {
      driverId,
      model: 'Toyota Axio',
      number: 'DH-1234',
      totalSeats: 4,
    },
  });
}
