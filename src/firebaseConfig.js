// Import the functions you need from the SDKs
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"; // Use the default getAuth for web
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { getAnalytics, isSupported } from "firebase/analytics"; // Check if analytics is supported
import { getDatabase } from "firebase/database";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDM-N18S7vjn4xmj9QAfQ2lMwcVf4Q_lqk",
  authDomain: "purecare-2a506.firebaseapp.com",
  projectId: "purecare-2a506",
  storageBucket: "purecare-2a506.appspot.com",
  messagingSenderId: "458703941149",
  appId: "1:458703941149:web:2320b58b1fe052c70ca0f4",
  measurementId: "G-PNR85X9X41"
};

// Initialize Firebase
export const FIREBASE_APP = initializeApp(firebaseConfig);
export const FIREBASE_AUTH = getAuth(FIREBASE_APP); // For web, no need for custom persistence
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIRESTORE_Function = getFunctions(FIREBASE_APP);
export const FIREBASE_REAL = getDatabase(FIREBASE_APP);

// Initialize Analytics (only if supported)
let FIREBASE_ANALYTICS;
isSupported().then((yes) => {
  if (yes) {
    FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP);
  } else {
    console.log("Analytics not supported in this environment");
  }
});

