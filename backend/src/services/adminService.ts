import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export async function getUsers(page = 1, limit = 20, filter?: string) {
  const where = filter
    ? {
        OR: [
          { name: { contains: filter, mode: 'insensitive' as const } },
          { phone: { contains: filter } },
        ],
      }
    : {};

  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        phone: true,
        name: true,
        role: true,
        verificationStatus: true,
        isFemale: true,
        createdAt: true,
      },
    }),
    prisma.user.count({ where }),
  ]);

  return { users, total, page, limit };
}

export async function getUserDetails(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      phone: true,
      name: true,
      nidNumber: true,
      nidFrontImage: true,
      nidBackImage: true,
      role: true,
      verificationStatus: true,
      isFemale: true,
      emergencyContacts: true,
      createdAt: true,
      vehicles: true,
    },
  });
  if (!user) throw AppError.notFound('User not found');
  return user;
}

export async function updateUserRole(adminId: string, userId: string, role: string) {
  const target = await prisma.user.findUnique({ where: { id: userId } });
  if (!target) throw AppError.notFound('User not found');

  const admin = await prisma.user.findUnique({ where: { id: adminId } });
  if (admin?.role !== 'SUPER_ADMIN' && role === 'SUPER_ADMIN') {
    throw AppError.forbidden('Only super admin can assign super admin role');
  }

  const updated = await prisma.user.update({
    where: { id: userId },
    data: { role: role as any },
    select: { id: true, phone: true, name: true, role: true, verificationStatus: true },
  });

  return updated;
}

export async function getAllRides(page = 1, limit = 20, status?: string) {
  const where = status ? { status: status as any } : {};

  const [rides, total] = await Promise.all([
    prisma.ride.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        driver: { select: { id: true, name: true, phone: true } },
        bookings: { include: { passenger: { select: { id: true, name: true, phone: true } } } },
      },
    }),
    prisma.ride.count({ where }),
  ]);

  return { rides, total, page, limit };
}

export async function getReports(page = 1, limit = 20) {
  const where = { status: 'REPORT' as const };

  const [reports, total] = await Promise.all([
    prisma.emergencyLog.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { id: true, name: true, phone: true } } },
    }),
    prisma.emergencyLog.count({ where }),
  ]);

  return { reports, total, page, limit };
}

export async function getDashboardStats() {
  const [totalUsers, totalDrivers, totalRides, activeRides, activeSos, pendingVerifications] =
    await Promise.all([
      prisma.user.count(),
      prisma.user.count({ where: { role: 'DRIVER' } }),
      prisma.ride.count(),
      prisma.ride.count({ where: { status: 'STARTED' } }),
      prisma.emergencyLog.count({ where: { status: 'ACTIVE' } }),
      prisma.user.count({ where: { verificationStatus: 'PENDING' } }),
    ]);

  return {
    totalUsers,
    totalDrivers,
    totalRides,
    activeRides,
    activeSos,
    pendingVerifications,
  };
}
