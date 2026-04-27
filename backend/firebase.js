
import { initializeApp, cert, getApps, getApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { getStorage } from 'firebase-admin/storage';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const serviceAccount = require('./serviceAccountKey.json');

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
