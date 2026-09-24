import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyDnUBU8Ob-gf_k_73kb1jSpCvulC9aK24o",
  authDomain: "sarca-works.firebaseapp.com",
  projectId: "sarca-works",
  storageBucket: "sarca-works.firebasestorage.app",
  messagingSenderId: "889488260076",
  appId: "1:889488260076:web:b8d8e91e52490f19991ec9",
};

const app =
  getApps().length > 0
    ? getApp()
    : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);