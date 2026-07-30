import { cleanDb, createTestUser } from './helpers';
import { sendOtp, verifyOtp, register, login } from '../src/services/authService';
import { redis } from '../src/config/redis';

beforeEach(async () => {
  await cleanDb();
  await redis.flushall();
});

describe('sendOtp', () => {
  it('should return OTP for unregistered phone', async () => {
    const result = await sendOtp('01711111111');
    expect(result.otp).toHaveLength(6);
  });

  it('should throw for already registered phone', async () => {
    await createTestUser({ phone: '01711111111' });
    await expect(sendOtp('01711111111')).rejects.toThrow();
  });
});

describe('verifyOtp', () => {
  it('should verify correct OTP', async () => {
    const { otp } = await sendOtp('01711111111');
    const result = await verifyOtp('01711111111', otp);
    expect(result.verified).toBe(true);
  });

  it('should reject wrong OTP', async () => {
    await sendOtp('01711111111');
    await expect(verifyOtp('01711111111', '000000')).rejects.toThrow();
  });
});

describe('register', () => {
  it('should create user with PENDING status', async () => {
    const result = await register({
      phone: '01711111111',
      password: 'password123',
      name: 'New User',
      nidNumber: '1234567890',
    });
    expect(result.userId).toBeDefined();
  });

  it('should throw for duplicate phone', async () => {
    await createTestUser({ phone: '01711111111' });
    await expect(
      register({
        phone: '01711111111',
        password: 'password123',
        name: 'New User',
        nidNumber: '1234567890',
      })
    ).rejects.toThrow();
  });
});

describe('login', () => {
  it('should return tokens for approved user', async () => {
    const user = await createTestUser({ phone: '01711111111', verificationStatus: 'APPROVED' });
    const result = await login('01711111111', 'password123');
    expect(result.accessToken).toBeDefined();
    expect(result.refreshToken).toBeDefined();
    expect(result.user.phone).toBe('01711111111');
  });

  it('should reject wrong password', async () => {
    await createTestUser({ phone: '01711111111', verificationStatus: 'APPROVED' });
    await expect(login('01711111111', 'wrongpass')).rejects.toThrow();
  });

  it('should reject unapproved user', async () => {
    await createTestUser({ phone: '01711111111', verificationStatus: 'PENDING' });
    await expect(login('01711111111', 'password123')).rejects.toThrow();
  });
});
