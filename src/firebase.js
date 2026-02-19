// src/firebase.js
// Replace the config below with your own Firebase project config
// Get it from: Firebase Console → Project Settings → Your Apps → SDK setup

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyADA8P8shRec02JsOtoO2rB5P1FDgYBlJE",
  authDomain: "ramadan-1447-e02f4.firebaseapp.com",
  projectId: "ramadan-1447-e02f4",
  storageBucket: "ramadan-1447-e02f4.firebasestorage.app",
  messagingSenderId: "478439725060",
  appId: "1:478439725060:web:e9bb173c54bcdbcc32bd51"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);