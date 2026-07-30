import { cleanDb, createTestUser, createTestDriver, createTestVehicle } from './helpers';
import { requestRide, acceptRide, startRide, completeRide } from '../src/services/rideService';

beforeEach(async () => {
  await cleanDb();
});

describe('requestRide', () => {
  it('should create a ride request', async () => {
    const user = await createTestUser();
    const ride = await requestRide(user.id, {
      pickupLat: 23.7,
      pickupLng: 90.4,
      pickupAddress: 'Gulshan',
      dropoffLat: 23.8,
      dropoffLng: 90.5,
      dropoffAddress: 'Banani',
      bookingType: 'WHOLE_CAR',
    });
    expect(ride.status).toBe('REQUESTED');
    expect(ride.id).toBeDefined();
  });

  it('should create a seat-based booking', async () => {
    const user = await createTestUser();
    const ride = await requestRide(user.id, {
      pickupLat: 23.7,
      pickupLng: 90.4,
      pickupAddress: 'Gulshan',
      dropoffLat: 23.8,
      dropoffLng: 90.5,
      dropoffAddress: 'Banani',
      bookingType: 'SEAT',
      seatsBooked: 2,
    });
    expect(ride.status).toBe('REQUESTED');
  });

  it('should reject unverified user', async () => {
    const user = await createTestUser({ verificationStatus: 'PENDING' });
    await expect(
      requestRide(user.id, {
        pickupLat: 23.7,
        pickupLng: 90.4,
        pickupAddress: 'Gulshan',
        dropoffLat: 23.8,
        dropoffLng: 90.5,
        dropoffAddress: 'Banani',
        bookingType: 'WHOLE_CAR',
      })
    ).rejects.toThrow();
  });
});

describe('acceptRide', () => {
  it('should accept a ride', async () => {
    const passenger = await createTestUser({ phone: '01711111111' });
    const driver = await createTestDriver({ phone: '01722222222' });
    const vehicle = await createTestVehicle(driver.id);
    const ride = await requestRide(passenger.id, {
      pickupLat: 23.7,
      pickupLng: 90.4,
      pickupAddress: 'Gulshan',
      dropoffLat: 23.8,
      dropoffLng: 90.5,
      dropoffAddress: 'Banani',
      bookingType: 'WHOLE_CAR',
    });

    const accepted = await acceptRide(ride.id, driver.id, vehicle.id);
    expect(accepted.status).toBe('ACCEPTED');
    expect(accepted.driverId).toBe(driver.id);
  });

  it('should not accept already accepted ride', async () => {
    const passenger = await createTestUser({ phone: '01711111111' });
    const driver = await createTestDriver({ phone: '01722222222' });
    const vehicle = await createTestVehicle(driver.id);
    const ride = await requestRide(passenger.id, {
      pickupLat: 23.7,
      pickupLng: 90.4,
      pickupAddress: 'Gulshan',
      dropoffLat: 23.8,
      dropoffLng: 90.5,
      dropoffAddress: 'Banani',
      bookingType: 'WHOLE_CAR',
    });

    await acceptRide(ride.id, driver.id, vehicle.id);
    await expect(acceptRide(ride.id, driver.id, vehicle.id)).rejects.toThrow();
  });
});

describe('startRide & completeRide', () => {
  it('should start and complete a ride', async () => {
    const passenger = await createTestUser({ phone: '01711111111' });
    const driver = await createTestDriver({ phone: '01722222222' });
    const vehicle = await createTestVehicle(driver.id);
    const ride = await requestRide(passenger.id, {
      pickupLat: 23.7,
      pickupLng: 90.4,
      pickupAddress: 'Gulshan',
      dropoffLat: 23.8,
      dropoffLng: 90.5,
      dropoffAddress: 'Banani',
      bookingType: 'WHOLE_CAR',
    });

    await acceptRide(ride.id, driver.id, vehicle.id);
    const started = await startRide(ride.id, driver.id);
    expect(started.status).toBe('STARTED');

    const completed = await completeRide(ride.id, driver.id);
    expect(completed.status).toBe('COMPLETED');
  });

  it('should not start ride before accept', async () => {
    const driver = await createTestDriver();
    const passenger = await createTestUser({ phone: '01711111111' });
    const ride = await requestRide(passenger.id, {
      pickupLat: 23.7,
      pickupLng: 90.4,
      pickupAddress: 'Gulshan',
      dropoffLat: 23.8,
      dropoffLng: 90.5,
      dropoffAddress: 'Banani',
      bookingType: 'WHOLE_CAR',
    });

    await expect(startRide(ride.id, driver.id)).rejects.toThrow();
  });
});
