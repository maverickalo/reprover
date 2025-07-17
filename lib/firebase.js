import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;

export function initFirebase() {
  if (getApps().length === 0) {
    // Check if required environment variables are set
    if (!process.env.FIREBASE_PROJECT_ID || !process.env.FIREBASE_CLIENT_EMAIL || !process.env.FIREBASE_PRIVATE_KEY) {
      throw new Error(
        'Missing Firebase configuration. Please set FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY environment variables in Vercel.'
      );
    }
    
    // Initialize Firebase Admin with environment variables
    const app = initializeApp({
      credential: cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      }),
    });
    db = getFirestore(app);
  } else {
    db = getFirestore();
  }
  
  return db;
}

export function getDb() {
  if (!db) {
    return initFirebase();
  }
  return db;
}