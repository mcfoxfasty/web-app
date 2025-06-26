import { initializeApp, getApps, getApp, FirebaseOptions, FirebaseApp } from "firebase/app";
import { getFirestore, Firestore } from "firebase/firestore";
import { getAuth, Auth } from "firebase/auth";

const firebaseConfig: FirebaseOptions = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;

// This function ensures Firebase is initialized only once.
function initializeFirebase() {
  if (!getApps().length) {
    if (!firebaseConfig.apiKey) {
      // This error will be thrown at runtime if the env var is missing,
      // but it won't crash the build process.
      throw new Error('Firebase API key is not set. Please check your environment variables.');
    }
    app = initializeApp(firebaseConfig);
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  } else {
    app = getApp();
    authInstance = getAuth(app);
    dbInstance = getFirestore(app);
  }
}

// Export getter functions instead of direct instances.
// This is the "lazy" part of the implementation.
export function getAuth() {
  if (!authInstance) {
    initializeFirebase();
  }
  return authInstance;
}

export function getDb() {
  if (!dbInstance) {
    initializeFirebase();
  }
  return dbInstance;
}
