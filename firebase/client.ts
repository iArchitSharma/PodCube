// Import the functions you need from the SDKs you need
import { initializeApp, getApps, cert } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCTBYFhYNcr8iU7OSohYEM-DSzAILUZJQw",
  authDomain: "podcube-4418e.firebaseapp.com",
  projectId: "podcube-4418e",
  storageBucket: "podcube-4418e.firebasestorage.app",
  messagingSenderId: "209539433272",
  appId: "1:209539433272:web:e00da979c09c62cc7f37cd",
  measurementId: "G-LLBMKN625R"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
// const analytics = getAnalytics(app);

export const auth = getAuth(app);
export const db = getFirestore(app);