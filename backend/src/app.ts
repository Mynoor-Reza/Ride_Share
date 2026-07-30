import express from 'express';
import http from 'http';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { errorHandler } from './middleware/errorHandler';
import { apiLimiter } from './middleware/rateLimiter';

const app = express();
const server = http.createServer(app);

app.use(helmet());
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(cookieParser());
app.use('/api', apiLimiter);

import authRoutes from './routes/auth';
import vehicleRoutes from './routes/vehicles';
import rideRoutes from './routes/rides';
import paymentRoutes from './routes/payments';
import sosRoutes from './routes/sos';
import ratingRoutes from './routes/ratings';
import adminRoutes from './routes/admin';
import safetyRoutes from './routes/safety';
import notificationRoutes from './routes/notifications';

app.use('/api/auth', authRoutes);
app.use('/api/vehicles', vehicleRoutes);
app.use('/api/rides', rideRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/sos', sosRoutes);
app.use('/api/ratings', ratingRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/safety', safetyRoutes);
app.use('/api/notifications', notificationRoutes);

app.get('/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running' });
});

app.use(errorHandler);

export { app, server };
