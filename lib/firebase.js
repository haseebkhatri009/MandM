// // Firebase Configuration - M&M Scents
// // Setup: Firebase Console > Project Settings > General > Your apps

// import { initializeApp } from 'firebase/app';
// import { getAuth } from 'firebase/auth';
// import { getDatabase } from 'firebase/database';

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY || "YOUR_API_KEY",
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN || "YOUR_AUTH_DOMAIN",
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || "YOUR_PROJECT_ID",
//   databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL || "YOUR_DATABASE_URL",
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || "YOUR_MESSAGING_SENDER_ID",
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID || "YOUR_APP_ID",
// };


// // Initialize Firebase
// const app = initializeApp(firebaseConfig);

// // Firebase Authentication
// export const auth = getAuth(app);

// // Firebase Realtime Database
// export const rtdb = getDatabase(app);

// export default app;


// lib/firebase.js
// Firebase Configuration - M&M Scents

import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';

// ✅ Environment variables se values lo
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  databaseURL: process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// ✅ Debug: Check if env variables are loaded
console.log('🔍 Checking Firebase Config:');
console.log('✅ API Key:', firebaseConfig.apiKey ? 'Loaded' : 'Missing');
console.log('✅ Auth Domain:', firebaseConfig.authDomain ? 'Loaded' : 'Missing');
console.log('✅ Project ID:', firebaseConfig.projectId ? 'Loaded' : 'Missing');
console.log('✅ Database URL:', firebaseConfig.databaseURL ? 'Loaded' : 'Missing');
console.log('✅ Messaging Sender ID:', firebaseConfig.messagingSenderId ? 'Loaded' : 'Missing');
console.log('✅ App ID:', firebaseConfig.appId ? 'Loaded' : 'Missing');

// ✅ Check if databaseURL is valid
if (!firebaseConfig.databaseURL) {
  console.error('❌ FIREBASE DATABASE URL IS MISSING!');
  console.error('Please check NEXT_PUBLIC_FIREBASE_DATABASE_URL in .env.local');
} else if (!firebaseConfig.databaseURL.startsWith('https://')) {
  console.error('❌ Invalid Firebase databaseURL format:', firebaseConfig.databaseURL);
  console.error('It should start with https://');
}

// ✅ Initialize Firebase (prevent multiple init)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

// Firebase Authentication
export const auth = getAuth(app);

// Firebase Realtime Database
export const rtdb = getDatabase(app);

export default app;

console.log('🔥 Firebase initialized successfully!');