import { prisma } from '../config/prisma';
import { logger } from '../config/logger';

// User device tokens stored in Redis or a separate table
// Simple in-memory map for demo — replace with Redis or DB in production
const deviceTokens = new Map<string, string[]>();

export function registerToken(userId: string, token: string) {
  const existing = deviceTokens.get(userId) || [];
  if (!existing.includes(token)) {
    existing.push(token);
    deviceTokens.set(userId, existing);
  }
}

export function unregisterToken(userId: string, token: string) {
  const existing = deviceTokens.get(userId) || [];
  deviceTokens.set(
    userId,
    existing.filter((t) => t !== token)
  );
}

export function getTokens(userId: string): string[] {
  return deviceTokens.get(userId) || [];
}

type NotificationPayload = {
  title: string;
  body: string;
  data?: Record<string, string>;
};

export async function sendToUser(userId: string, payload: NotificationPayload) {
  const tokens = getTokens(userId);
  if (tokens.length === 0) return;

  // Save to DB
  await prisma.notification.create({
    data: {
      userId,
      title: payload.title,
      body: payload.body,
      data: payload.data ?? undefined,
    },
  });

  // Send via Firebase (if available)
  try {
    const { getFirebaseApp } = await import('../config/firebase');
    const { getMessaging } = await import('firebase-admin/messaging');
    const messaging = getMessaging(getFirebaseApp());

    for (const token of tokens) {
      messaging
        .send({ token, notification: { title: payload.title, body: payload.body }, data: payload.data as { [key: string]: string } | undefined })
        .catch((err: unknown) => logger.warn({ err, token }, 'Firebase send failed'));
    }
  } catch {
    logger.debug('Firebase not available — notification saved to DB only');
  }
}

export async function sendToMultipleUsers(userIds: string[], payload: NotificationPayload) {
  for (const userId of userIds) {
    await sendToUser(userId, payload);
  }
}

export async function getNotifications(userId: string, page = 1, limit = 20) {
  const [notifications, total] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
    prisma.notification.count({ where: { userId } }),
  ]);

  return { notifications, total, page, limit };
}

export async function markAsRead(notificationId: string, userId: string) {
  const notif = await prisma.notification.findUnique({ where: { id: notificationId } });
  if (!notif) throw new Error('Notification not found');
  if (notif.userId !== userId) throw new Error('Not your notification');

  return prisma.notification.update({
    where: { id: notificationId },
    data: { read: true },
  });
}

export async function markAllAsRead(userId: string) {
  await prisma.notification.updateMany({
    where: { userId, read: false },
    data: { read: true },
  });
}
