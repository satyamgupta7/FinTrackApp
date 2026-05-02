import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import Constants from 'expo-constants';

const cfg = Constants.expoConfig?.extra?.firebase;

if (!cfg?.apiKey) {
  throw new Error('Firebase config missing. Set firebase keys in app.json extra.firebase');
}

const app = getApps().length === 0 ? initializeApp(cfg) : getApps()[0];
export const db = getFirestore(app);
