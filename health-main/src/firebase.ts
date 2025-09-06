// client/src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// import { getStorage } from "firebase/storage"; // only if you’re using Storage

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID
};

// Validate Firebase configuration
const requiredEnvVars = [
  'VITE_FIREBASE_API_KEY',
  'VITE_FIREBASE_AUTH_DOMAIN',
  'VITE_FIREBASE_PROJECT_ID',
  'VITE_FIREBASE_STORAGE_BUCKET',
  'VITE_FIREBASE_SENDER_ID',
  'VITE_FIREBASE_APP_ID'
];

for (const envVar of requiredEnvVars) {
  if (!import.meta.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
}

let app;
try {
  console.log('Initializing Firebase with config:', {
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId
  });
  app = initializeApp(firebaseConfig);
} catch (error: any) {
  console.error('Error initializing Firebase:', error);
  throw new Error(`Failed to initialize Firebase: ${error.message}`);
}

export const auth = getAuth(app);
export const db = getFirestore(app);

// Initialize emulators in development
const initializeEmulators = async () => {
  if (import.meta.env.DEV) {
    try {
      // Connect to Auth emulator
      connectAuthEmulator(auth, 'http://127.0.0.1:9099', { disableWarnings: true });
      console.log('✅ Connected to Auth Emulator');

      // Connect to Firestore emulator
      const { connectFirestoreEmulator } = await import('firebase/firestore');
      connectFirestoreEmulator(db, '127.0.0.1', 9199);
      console.log('✅ Connected to Firestore Emulator');
    } catch (error) {
      console.error('Failed to connect to emulators:', error);
      console.warn('Continuing with production environment');
    }
  }
};

// Initialize emulators
await initializeEmulators();

// Initialize Firebase Auth persistence
import { setPersistence, browserLocalPersistence, connectAuthEmulator } from "firebase/auth";

// Setup auth persistence and emulator
const setupFirebaseAuth = async () => {
  try {
    // First set up persistence
    await setPersistence(auth, browserLocalPersistence);
    console.log('Firebase Auth persistence configured successfully');
    
    // Connect to auth emulator in development
    if (import.meta.env.DEV) {
      // Check if emulator is available before connecting
      try {
        const response = await fetch('http://localhost:9099/emulator/v1/projects/_/config');
        if (response.ok) {
          connectAuthEmulator(auth, 'http://localhost:9099', { disableWarnings: true });
          console.log('✅ Connected to Firebase Auth Emulator');
        } else {
          console.warn('Firebase Auth Emulator not available - using production environment');
        }
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.warn('Could not connect to Firebase Auth Emulator:', error.message);
        } else {
          console.warn('Could not connect to Firebase Auth Emulator');
        }
        console.warn('Continuing with production Firebase environment');
      }
    }
  } catch (error: unknown) {
    console.error("Error configuring Firebase Auth:", error);
    // Don't throw here - allow the app to continue with default config
    // But log for debugging
    if (import.meta.env.DEV) {
      const errorDetails: Record<string, unknown> = {};
      
      if (error instanceof Error) {
        errorDetails.message = error.message;
        errorDetails.stack = error.stack;
        
        // Check for Firebase error properties
        if ('code' in error) {
          errorDetails.code = (error as { code?: string }).code;
        }
      }
      
      console.debug('Firebase Auth setup error details:', errorDetails);
    }
  }
};

// Call the setup function
await setupFirebaseAuth();
