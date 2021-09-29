import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyCDPSOE7UaV6BBFDhTT_ENBBqk3f0dH9Cs",
  authDomain: "twitter-79a4e.firebaseapp.com",
  projectId: "twitter-79a4e",
  storageBucket: "twitter-79a4e.appspot.com",
  messagingSenderId: "540394621278",
  appId: "1:540394621278:web:e12be6423c63f72cd327cf",
};

// const app = initializeApp(firebaseConfig);
export default initializeApp(firebaseConfig);
export const authService = getAuth();
export const dbService = getFirestore();
export const storageService = getStorage();
