import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyAwVspLVCysmvdlmHYwa4OIqm4TsN-WdYQ",
  authDomain: "fork-off.firebaseapp.com",
  projectId: "fork-off",
  storageBucket: "fork-off.firebasestorage.app",
  messagingSenderId: "298189077394",
  appId: "1:298189077394:web:55b81fe6b5013f7739df4b",
  measurementId: "G-K18GTFYFJS",
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);
