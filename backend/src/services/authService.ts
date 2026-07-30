import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma';
import { redis } from '../config/redis';
import { AppError } from '../utils/AppError';
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from '../utils/jwt';

const OTP_TTL = 180;
const OTP_PREFIX = 'otp:';

function generateOtp(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export async function sendOtp(phone: string) {
  const existing = await prisma.user.findUnique({ where: { phone } });
  if (existing && existing.verificationStatus === 'APPROVED') {
    throw AppError.conflict('Phone already registered and verified');
  }

  const otp = generateOtp();
  await redis.setex(`${OTP_PREFIX}${phone}`, OTP_TTL, otp);
  // TODO: Integrate SMS gateway - send OTP via SMS
  return { otp, message: 'OTP sent (dev mode - check response)' };
}

export async function verifyOtp(phone: string, otp: string) {
  const stored = await redis.get(`${OTP_PREFIX}${phone}`);
  if (!stored || stored !== otp) {
    throw AppError.badRequest('Invalid or expired OTP', 'INVALID_OTP');
  }
  await redis.del(`${OTP_PREFIX}${phone}`);
  return { verified: true };
}

export async function register(data: {
  phone: string;
  password: string;
  name: string;
  nidNumber: string;
  isFemale?: boolean;
  emergencyContacts?: { name: string; phone: string }[];
}) {
  const existing = await prisma.user.findUnique({ where: { phone: data.phone } });
  if (existing) {
    throw AppError.conflict('Phone already registered');
  }

  const hashedPassword = await bcrypt.hash(data.password, 12);

  const user = await prisma.user.create({
    data: {
      phone: data.phone,
      password: hashedPassword,
      name: data.name,
      nidNumber: data.nidNumber,
      isFemale: data.isFemale ?? false,
      emergencyContacts: data.emergencyContacts ?? undefined,
      verificationStatus: 'PENDING',
    },
  });

  return {
    userId: user.id,
    message: 'Registration submitted. Awaiting NID approval.',
  };
}

export async function login(phone: string, password: string) {
  const user = await prisma.user.findUnique({ where: { phone } });
  if (!user) throw AppError.unauthorized('Invalid credentials');

  if (user.verificationStatus !== 'APPROVED') {
    throw AppError.forbidden('Account not verified. Contact admin.');
  }

  const valid = await bcrypt.compare(password, user.password);
  if (!valid) throw AppError.unauthorized('Invalid credentials');

  const payload = { userId: user.id, role: user.role };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  return {
    accessToken,
    refreshToken,
    user: {
      id: user.id,
      name: user.name,
      phone: user.phone,
      role: user.role,
      verificationStatus: user.verificationStatus,
    },
  };
}

export async function refreshTokens(token: string) {
  try {
    const decoded = verifyRefreshToken(token);
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user || user.verificationStatus !== 'APPROVED') {
      throw AppError.unauthorized('Invalid refresh token');
    }

    const payload = { userId: user.id, role: user.role };
    return {
      accessToken: generateAccessToken(payload),
      refreshToken: generateRefreshToken(payload),
    };
  } catch {
    throw AppError.unauthorized('Invalid or expired refresh token');
  }
}

export async function approveNid(userId: string, action: 'approve' | 'reject') {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user) throw AppError.notFound('User not found');
  if (user.verificationStatus !== 'PENDING') {
    throw AppError.badRequest('User is not pending verification');
  }

  const status = action === 'approve' ? 'APPROVED' : 'REJECTED';
  await prisma.user.update({
    where: { id: userId },
    data: { verificationStatus: status },
  });

  return { message: `NID ${action}d successfully` };
}
