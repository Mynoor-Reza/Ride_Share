import { initializeApp, applicationDefault, App, getApp } from 'firebase-admin/app';
import { logger } from './logger';

let firebaseApp: App | null = null;

export function initFirebase() {
  if (firebaseApp) return firebaseApp;

  try {
    firebaseApp = initializeApp({ credential: applicationDefault() });
    logger.info('Firebase initialized');
  } catch {
    try {
      firebaseApp = initializeApp();
      logger.info('Firebase initialized (ADC fallback)');
    } catch (err) {
      logger.warn({ err }, 'Firebase initialization skipped — no credentials available');
    }
  }

  return firebaseApp;
}

export function getFirebaseApp() {
  if (!firebaseApp) throw new Error('Firebase not initialized');
  return firebaseApp;
}
