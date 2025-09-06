// server/src/firebaseAdmin.ts
import admin from 'firebase-admin';
import type { ServiceAccount } from 'firebase-admin';

// Validate environment variable
if (!process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  
    throw new Error('Missing FIREBASE_SERVICE_ACCOUNT_JSON environment variable');
}

let serviceAccount: ServiceAccount;
try {
  serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON) as ServiceAccount;
} catch (error) {
  throw new Error('Invalid FIREBASE_SERVICE_ACCOUNT_JSON format');
}

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

const adminDb = admin.firestore();
export { adminDb };
