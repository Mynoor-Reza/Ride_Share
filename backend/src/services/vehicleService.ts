import { prisma } from '../config/prisma';
import { AppError } from '../utils/AppError';

export async function createVehicle(driverId: string, data: {
  model: string;
  number: string;
  color?: string;
  totalSeats: number;
}) {
  const user = await prisma.user.findUnique({ where: { id: driverId } });
  if (!user) throw AppError.notFound('User not found');
  if (user.role === 'PASSENGER') {
    throw AppError.forbidden('Only drivers can register vehicles');
  }

  const existing = await prisma.vehicle.findFirst({
    where: { driverId, number: data.number },
  });
  if (existing) throw AppError.conflict('Vehicle with this number already registered');

  const vehicle = await prisma.vehicle.create({
    data: { ...data, driverId },
  });

  return vehicle;
}

export async function getMyVehicles(driverId: string) {
  return prisma.vehicle.findMany({ where: { driverId } });
}

export async function getVehicleById(vehicleId: string, driverId: string) {
  const vehicle = await prisma.vehicle.findUnique({ where: { id: vehicleId } });
  if (!vehicle) throw AppError.notFound('Vehicle not found');
  if (vehicle.driverId !== driverId) throw AppError.forbidden('Not your vehicle');
  return vehicle;
}

export async function updateVehicle(vehicleId: string, driverId: string, data: {
  model?: string;
  number?: string;
  color?: string;
  totalSeats?: number;
}) {
  await getVehicleById(vehicleId, driverId);

  const vehicle = await prisma.vehicle.update({
    where: { id: vehicleId },
    data,
  });

  return vehicle;
}

export async function deleteVehicle(vehicleId: string, driverId: string) {
  await getVehicleById(vehicleId, driverId);

  await prisma.vehicle.delete({ where: { id: vehicleId } });
  return { message: 'Vehicle deleted' };
}
