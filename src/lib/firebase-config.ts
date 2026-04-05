/**
 * Firebase config for PDF tools — now uses the main SheetHub project.
 * Reuses the app initialized by src/firebase/config.ts to avoid double-init.
 */
import { initializeApp, getApp, getApps, type FirebaseApp } from "firebase/app";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const sheetHubConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

let app: FirebaseApp;

if (getApps().length > 0) {
  app = getApp(); // Reuse the already-initialized SheetHub app
} else {
  app = initializeApp(sheetHubConfig);
}

const storage = getStorage(app);
const functions = getFunctions(app, "asia-southeast2");

export { app, storage, functions };
