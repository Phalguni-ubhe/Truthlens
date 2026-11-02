// src/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCqD0RcZI7YIQ6131vd9ZSPqnC8-Xsgtsk",
  authDomain: "truthlens-25e44.firebaseapp.com",
  projectId: "truthlens-25e44",
  storageBucket: "truthlens-25e44.firebasestorage.app",
  messagingSenderId: "855255331965",
  appId: "1:855255331965:web:64002e43185e0f816fed14",
  measurementId: "G-DXCM5ZRFSG"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
