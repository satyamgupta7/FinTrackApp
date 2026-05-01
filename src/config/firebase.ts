import { getApps, initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyAAvsk15zDLxxCnYU6EPUXF3Br5z8yp-tk',
  authDomain: 'fintrack-d5faf.firebaseapp.com',
  projectId: 'fintrack-d5faf',
  storageBucket: 'fintrack-d5faf.firebasestorage.app',
  messagingSenderId: '690722270354',
  appId: '1:690722270354:web:c9399c205b1c5573d50a4b',
  measurementId: 'G-7RH124FFSP',
};

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];
export const db = getFirestore(app);
