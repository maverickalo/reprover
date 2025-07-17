import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY || "AIzaSyBcqUQHpPaJCvDOvRXGfO2rXHEQqKJzKzQ",
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN || "reprover-e3efc.firebaseapp.com",
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID || "reprover-e3efc",
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET || "reprover-e3efc.firebasestorage.app",
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID || "751567515925",
  appId: process.env.REACT_APP_FIREBASE_APP_ID || "1:751567515925:web:c926c36a9c6eb72b3b826f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);

// Initialize Cloud Firestore and get a reference to the service
export const db = getFirestore(app);

export default app;