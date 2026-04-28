
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';

import fs from 'fs';
import path from 'path';

// Securely parse the service account from a Vercel environment variable or local file
let serviceAccount;
try {
  if (process.env.FIREBASE_SERVICE_ACCOUNT) {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
  } else {
    const keyPath = path.resolve(process.cwd(), 'Serviceaccountkey.json.json');
    serviceAccount = JSON.parse(fs.readFileSync(keyPath, 'utf8'));
  }
} catch (error) {
  console.error("Failed to load Firebase service account key:", error);
}

export const connectFirebase = () => {
  let app;
  if (!getApps().length) {
    app = initializeApp({
      credential: cert(serviceAccount),
      storageBucket: 'tomato-8c432.appspot.com',
    });
  } else {
    app = getApp();
  }
  return {
    db: getFirestore(app),
    bucket: getStorage(app).bucket(),
  };
};
