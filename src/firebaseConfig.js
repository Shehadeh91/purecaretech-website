// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";

import { getAuth, initializeAuth, getReactNativePersistence } from "firebase/auth";

import { getFirestore } from "firebase/firestore";
import { getFunctions, httpsCallable } from "firebase/functions";
import { getAnalytics } from "firebase/analytics";

// import AsyncStorage from "@react-native-async-storage/async-storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
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
export const FIREBASE_AUTH = initializeAuth(FIREBASE_APP);
export const FIRESTORE_DB = getFirestore(FIREBASE_APP);
export const FIRESTORE_Function = getFunctions(FIREBASE_APP)
export const FIREBASE_ANALYTICS = getAnalytics(FIREBASE_APP)



