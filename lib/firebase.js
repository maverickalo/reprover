import { initializeApp, cert, getApps } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;

export function initFirebase() {
  if (getApps().length === 0) {
    // Use default project ID if not set (matching firebase-admin.js)
    const projectId = process.env.FIREBASE_PROJECT_ID || "reprover-e3efc";
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');
    
    // Check if required environment variables are set
    if (!clientEmail || !privateKey) {
      throw new Error(
        'Missing Firebase configuration. Please set FIREBASE_CLIENT_EMAIL and FIREBASE_PRIVATE_KEY environment variables in Vercel.'
      );
    }
    
    // Initialize Firebase Admin with environment variables
    const app = initializeApp({
      credential: cert({
        projectId,
        clientEmail,
        privateKey,
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